// ===============================
// Jogo da Velha ✦ Baby L
// Look sincronizado com o Closet
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Estado do jogo
  const board = Array(9).fill(null);
  let gameActive = true;

  const PLAYER = "X";
  const L = "O";

  const BABY_L_LOOK_KEY = "babyL-look";

  // Elementos
  const cells = document.querySelectorAll(".cell");
  const statusText = document.getElementById("status");
  const thoughtBubble = document.getElementById("thought-bubble");
  const thoughtText = document.getElementById("thought-text");
  const resetBtn = document.getElementById("reset-btn");
  const backBtn = document.getElementById("btn-voltar");

  const scorePlayerEl = document.getElementById("score-player");
  const scoreLEl = document.getElementById("score-l");
  const scoreDrawEl = document.getElementById("score-draw");

  // Baby L (base + rosto + roupas)
  const lBase       = document.getElementById("l-base");
  const lFace       = document.getElementById("l-face");
  const lLayerAcc   = document.getElementById("l-acessorios");
  const lLayerTop   = document.getElementById("l-camisa");
  const lLayerPants = document.getElementById("l-calca");
  const lLayerShoes = document.getElementById("l-sapato");

  const bgMusic = document.getElementById("bg-music");

  // Faces (mesmas do closet)
  const FACE_NEUTRA  = "../../dressup/assets/L/1.1.png";
  const FACE_PISCAR  = "../../dressup/assets/L/1.2.png";
  const FACE_EMPATE  = "../../dressup/assets/L/1.3.png";
  const FACE_DERROTA = "../../dressup/assets/L/1.4.png";
  const FACE_VITORIA = "../../dressup/assets/L/1.5.png";

  // Placar
  let scorePlayer = 0;
  let scoreL = 0;
  let scoreDraw = 0;

  function atualizarPlacar() {
    if (scorePlayerEl) scorePlayerEl.textContent = scorePlayer;
    if (scoreLEl)      scoreLEl.textContent      = scoreL;
    if (scoreDrawEl)   scoreDrawEl.textContent   = scoreDraw;
  }

  // Combos vencedores
  const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // Pensamentos
  const pensamentosL = {
    pensando: [
      "Hm… interessante.",
      "Há padrões aqui…",
      "Você joga de forma previsível.",
      "Vamos ver onde isso leva."
    ],
    venceu: [
      "Exatamente como calculei.",
      "Fim de jogo.",
      "A probabilidade estava ao meu favor."
    ],
    perdeu: [
      "Interessante…",
      "Você venceu desta vez.",
      "Anotado."
    ],
    empate: [
      "Um impasse.",
      "Nenhum erro decisivo.",
      "Equilíbrio."
    ]
  };

  function pensamentoAleatorio(tipo) {
    const lista = pensamentosL[tipo];
    return lista[Math.floor(Math.random() * lista.length)];
  }

  function mostrarPensamento(texto, tempo = 1800) {
    if (!thoughtBubble || !thoughtText) return;
    thoughtText.textContent = texto;
    thoughtBubble.classList.add("show");

    setTimeout(() => {
      thoughtBubble.classList.remove("show");
    }, tempo);
  }

  // Som de clique
  function playClickSound(tipo) {
    const sound = new Audio(`../../dressup/assets/sounds/cliques/${tipo}.wav`);
    sound.volume = 0.6;
    sound.play().catch(() => {});
  }

  // Rosto / expressões
  let expressaoAtiva = false;

  function setFace(src) {
    if (!lFace) return;
    lFace.src = src;
  }

  function setExpressao(tipo) {
    if (!lFace) return;

    expressaoAtiva = true;

    if (tipo === "vitoria") {
      setFace(FACE_VITORIA);   // 1.5
    } else if (tipo === "derrota") {
      setFace(FACE_DERROTA);   // 1.4
    } else if (tipo === "empate") {
      setFace(FACE_EMPATE);    // 1.3
    } else {
      setFace(FACE_NEUTRA);    // fallback
    }

    // depois de 2s volta pra neutra
    setTimeout(() => {
      expressaoAtiva = false;
      setFace(FACE_NEUTRA);
    }, 2000);
  }

  function piscarL() {
    if (!lFace || expressaoAtiva) return;

    setFace(FACE_PISCAR);
    setTimeout(() => setFace(FACE_NEUTRA), 120);
  }

  (function loopPiscar() {
    setTimeout(() => {
      piscarL();
      loopPiscar();
    }, Math.random() * 4000 + 2500);
  })();

  // Aplicar look salvo vindo do closet
  function aplicarLookSalvo() {
    const saved = localStorage.getItem(BABY_L_LOOK_KEY);
    if (!saved) return;

    let look;
    try {
      look = JSON.parse(saved);
    } catch {
      return;
    }

    // no closet o src é "assets/dress/camisa/1.png"
    // aqui prefixamos com "../../dressup/"
    if (look.acessorios && lLayerAcc) {
      lLayerAcc.src = `../../dressup/${look.acessorios}`;
    }
    if (look.camisa && lLayerTop) {
      lLayerTop.src = `../../dressup/${look.camisa}`;
    }
    if (look.calca && lLayerPants) {
      lLayerPants.src = `../../dressup/${look.calca}`;
    }
    if (look.sapato && lLayerShoes) {
      lLayerShoes.src = `../../dressup/${look.sapato}`;
    }
  }

  // ===============================
  // Funções de lógica do jogo
  // ===============================
  function makeMove(index, jogador) {
    board[index] = jogador;
    cells[index].textContent = jogador;
  }

  function encontrarJogada(jogador) {
    for (let combo of winningCombos) {
      const [a,b,c] = combo;
      const linha = [board[a], board[b], board[c]];

      if (
        linha.filter(v => v === jogador).length === 2 &&
        linha.includes(null)
      ) {
        return combo[linha.indexOf(null)];
      }
    }
    return null;
  }

  // IA mais esperta: vence se puder, bloqueia, pega centro, depois cantos, depois laterais
  function melhorJogadaIA() {
    // 1) Ganhar se possível
    const ganhar = encontrarJogada(L);
    if (ganhar !== null && ganhar !== undefined) return ganhar;

    // 2) Bloquear você
    const bloquear = encontrarJogada(PLAYER);
    if (bloquear !== null && bloquear !== undefined) return bloquear;

    // 3) Centro
    if (board[4] === null) return 4;

    // 4) Cantos
    const cantosLivres = [0,2,6,8].filter(i => board[i] === null);
    if (cantosLivres.length) {
      return cantosLivres[Math.floor(Math.random() * cantosLivres.length)];
    }

    // 5) Laterais
    const lateraisLivres = [1,3,5,7].filter(i => board[i] === null);
    if (lateraisLivres.length) {
      return lateraisLivres[Math.floor(Math.random() * lateraisLivres.length)];
    }

    return null;
  }

  function escolherAleatorio() {
    const livres = board
      .map((v,i) => v === null ? i : null)
      .filter(v => v !== null);
    if (!livres.length) return null;
    return livres[Math.floor(Math.random() * livres.length)];
  }

  function checkWinner() {
    for (let combo of winningCombos) {
      const [a,b,c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  // IA do L
  function lMove() {
    if (!gameActive) return;

    let escolha = melhorJogadaIA();

    // fallback (só por segurança)
    if (escolha === null || escolha === undefined) {
      escolha = escolherAleatorio();
    }

    if (escolha === null || escolha === undefined) return;

    makeMove(escolha, L);

    const vencedor = checkWinner();
    if (vencedor) return endGame(vencedor);

    if (board.every(cell => cell !== null)) {
      scoreDraw++;
      atualizarPlacar();
      statusText.textContent = "Empate 😐";
      mostrarPensamento(pensamentoAleatorio("empate"));
      setExpressao("empate");   // 1.3
      gameActive = false;
      return;
    }

    statusText.textContent = "Sua vez 😌";
  }

  // Final do jogo
  function endGame(vencedor) {
    gameActive = false;

    if (vencedor === PLAYER) {
      // Você ganhou → L DERROTA (1.4)
      scorePlayer++;
      atualizarPlacar();
      statusText.textContent = "Você ganhou 😎";
      setExpressao("derrota");
      mostrarPensamento(pensamentoAleatorio("perdeu"));
    } else {
      // L ganhou → L VITÓRIA (1.5)
      scoreL++;
      atualizarPlacar();
      statusText.textContent = "L ganhou 😏";
      setExpressao("vitoria");
      mostrarPensamento(pensamentoAleatorio("venceu"));
    }
  }

  // Clique do player
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      if (!gameActive || board[index]) return;

      makeMove(index, PLAYER);

      const vencedor = checkWinner();
      if (vencedor) return endGame(vencedor);

      if (board.every(cell => cell !== null)) {
        scoreDraw++;
        atualizarPlacar();
        statusText.textContent = "Empate 😐";
        mostrarPensamento(pensamentoAleatorio("empate"));
        setExpressao("empate");   // 1.3
        gameActive = false;
        return;
      }

      statusText.textContent = "Vez do L… 🤔";
      mostrarPensamento(pensamentoAleatorio("pensando"));
      setTimeout(lMove, 650);
    });
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      playClickSound("resetar");

      for (let i = 0; i < board.length; i++) {
        board[i] = null;
      }
      cells.forEach(cell => (cell.textContent = ""));
      gameActive = true;
      statusText.textContent = "Sua vez 😌";

      expressaoAtiva = false;
      setFace(FACE_NEUTRA);
      if (thoughtBubble) thoughtBubble.classList.remove("show");
    });
  }

  // Música de fundo
  function playMusic() {
    if (!bgMusic || !bgMusic.paused) return;

    bgMusic.volume = 0.35;
    bgMusic.play().catch(() => {
      console.log("Aguardando interação do usuário");
    });
  }

  document.addEventListener("click", playMusic, { once: true });

  function fadeOutMusic(duration = 800) {
    if (!bgMusic) return;

    let step = bgMusic.volume / (duration / 50);

    const fade = setInterval(() => {
      if (bgMusic.volume > step) {
        bgMusic.volume -= step;
      } else {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        clearInterval(fade);
      }
    }, 50);
  }

  // Voltar pro hub
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      playClickSound("salvar");
      fadeOutMusic();
      setTimeout(() => {
        window.location.href = "../../hub.html";
      }, 500);
    });
  }

  // Init visual
  if (thoughtBubble) {
    thoughtBubble.classList.remove("show");
  }
  if (statusText) {
    statusText.textContent = "Sua vez 😌";
  }
  atualizarPlacar();
  setFace(FACE_NEUTRA);
  aplicarLookSalvo();
});
