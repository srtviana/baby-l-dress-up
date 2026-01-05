const musicaFundo = new Audio("game/assets/sounds/musica/fundo.wav");
musicaFundo.loop = true;
musicaFundo.volume = 0.25;

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");

  if (!startBtn) {
    console.error("Botão START não encontrado no HTML");
    return;
  }

  startBtn.addEventListener("click", () => {
    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = "../game/dressup/index.html";
    }, 400);
  });
});
