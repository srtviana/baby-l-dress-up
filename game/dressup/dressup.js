// ===============================
// ELEMENTOS PRINCIPAIS
// ===============================
const itensDiv = document.getElementById("itens");

const layers = {
  camisa: document.getElementById("camisa-layer"),
  calca: document.getElementById("calca-layer"),
  sapato: document.getElementById("sapato-layer"),
  acessorios: document.getElementById("acessorios-layer"),
};

const resetBtn = document.getElementById("reset-btn");
const btnSalvar = document.getElementById("btn-salvar");

// ===============================
// SONS DO GAME
// ===============================
const somRoupas = new Audio("assets/sounds/cliques/roupas.wav");
somRoupas.volume = 0.4;

const somSalvar = new Audio("assets/sounds/cliques/salvar.wav");
somSalvar.volume = 0.5;

const somResetar = new Audio("assets/sounds/cliques/resetar.wav");
somResetar.volume = 0.5;

const musicaFundo = new Audio("assets/sounds/musica/fundo.wav");
musicaFundo.loop = true;
musicaFundo.volume = 0.25;

// ===============================
// LOOK ESPECIAL (ORDEM DIFERENTE)
// ===============================
const lookEspecial = {
  camisa: "assets/dress/camisa/8.png",
  calca: "assets/dress/calca/7.png",
  sapato: "assets/dress/sapato/7.png"
};

// ===============================
// CONTROLE DE ORDEM DAS CAMADAS
// ===============================
function atualizarOrdemCamadas() {
  const camisaAtual = layers.camisa.src || "";
  const calcaAtual = layers.calca.src || "";
  const sapatoAtual = layers.sapato.src || "";

  const lookCompleto =
    camisaAtual.includes(lookEspecial.camisa) &&
    calcaAtual.includes(lookEspecial.calca) &&
    sapatoAtual.includes(lookEspecial.sapato);

  if (lookCompleto) {
    // ORDEM ESPECIAL
    layers.sapato.style.zIndex = 4;
    layers.camisa.style.zIndex = 2;
    layers.calca.style.zIndex = 3;
  } else {
    // ORDEM PADRÃO
    layers.sapato.style.zIndex = 2;
    layers.calca.style.zIndex = 3;
    layers.camisa.style.zIndex = 4;
  }
}

// ===============================
// ROUPAS DISPONÍVEIS
// ===============================
const roupas = {
  camisa: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png"],
  calca: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png"],
  sapato: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png"],
  acessorios: ["1.png", "2.png"],
};

// ===============================
// CATEGORIAS (GERA ÍCONES)
// ===============================
document.querySelectorAll(".categoria").forEach(cat => {
  cat.addEventListener("click", () => {
    const categoria = cat.dataset.cat;
    itensDiv.innerHTML = "";

    roupas[categoria].forEach(item => {
      const img = document.createElement("img");
      img.src = `assets/icons/${categoria}/${item}`;
      img.classList.add("item");

      img.addEventListener("mouseenter", () => {
        somRoupas.currentTime = 0;
        somRoupas.play();
      });

      img.addEventListener("click", () => {
        const layer = layers[categoria];
        const roupaSrc = `assets/dress/${categoria}/${item}`;

        if (layer.getAttribute("src") === roupaSrc) {
          layer.removeAttribute("src");
        } else {
          layer.src = roupaSrc;
        }

        atualizarOrdemCamadas();
      });

      itensDiv.appendChild(img);
    });
  });
});

// ===============================
// RESET
// ===============================
resetBtn.addEventListener("click", () => {
  somResetar.currentTime = 0;
  somResetar.play();

  face.src = "assets/L/1.4.png";

  setTimeout(() => {
    face.src = "assets/L/1.1.png";
  }, 600);

  Object.values(layers).forEach(layer => {
    layer.removeAttribute("src");
  });

  atualizarOrdemCamadas();
});

// ===============================
// SALVAR LOOK
// ===============================
btnSalvar.addEventListener("click", () => {
  somSalvar.currentTime = 0;
  somSalvar.play();

  face.src = "assets/L/1.3.png";

  setTimeout(() => {
    face.src = "assets/L/1.1.png";
  }, 600);

  const look = {
    camisa: layers.camisa.getAttribute("src") || "",
    calca: layers.calca.getAttribute("src") || "",
    sapato: layers.sapato.getAttribute("src") || "",
    acessorios: layers.acessorios.getAttribute("src") || ""
  };

  localStorage.setItem("babyL-look", JSON.stringify(look));
});

// ===============================
// CARREGAR LOOK SALVO
// ===============================
const lookSalvo = localStorage.getItem("babyL-look");

if (lookSalvo) {
  const look = JSON.parse(lookSalvo);

  if (look.camisa) layers.camisa.src = look.camisa;
  if (look.calca) layers.calca.src = look.calca;
  if (look.sapato) layers.sapato.src = look.sapato;
  if (look.acessorios) layers.acessorios.src = look.acessorios;

  atualizarOrdemCamadas();
}

// ===============================
// MÚSICA
// ===============================
let musicaIniciada = false;

document.addEventListener("click", () => {
  if (!musicaIniciada) {
    musicaFundo.play();
    musicaIniciada = true;
  }
});

// ===============================
// ROSTO / ANIMAÇÕES
// ===============================
const face = document.getElementById("face-mask");

let expressaoAtiva = false;

function piscar() {
  if (expressaoAtiva) return;

  face.src = "assets/L/1.2.png";
  setTimeout(() => {
    face.src = "assets/L/1.1.png";
  }, 120);
}

setInterval(() => {
  piscar();
}, Math.random() * 4000 + 3000);

expressaoAtiva = true;
face.src = "assets/L/1.3.png";

setTimeout(() => {
  face.src = "assets/L/1.1.png";
  expressaoAtiva = false;
}, 600);

// ===============================
// ARMÁRIO MOBILE
// ===============================
const overlay = document.getElementById("overlay-armario");
const abrirBtn = document.getElementById("abrir-armario-btn");

function abrirArmario() {
  document.body.classList.add("armario-aberto");
}

function fecharArmario() {
  document.body.classList.remove("armario-aberto");
}

abrirBtn.addEventListener("click", abrirArmario);
overlay.addEventListener("click", fecharArmario);


// ======================================
// BOTÃO ABIR MINIGAMES
// =====================================
const openGamesBtn = document.getElementById("open-games");

 if (openGamesBtn) {
  openGamesBtn.addEventListener("click", () => {
    window.location.href= "../hub.html";
  });
 }
 