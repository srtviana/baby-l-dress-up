const musicaFundo = new Audio("game/assets/sounds/musica/fundo.wav");
musicaFundo.loop = true;
musicaFundo.volume = 0.25;

const btnStart = document.getElementById("btn-start");

btnStart.addEventListener("click", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "game/dressup.html";
  }, 600);
});
