import { Game } from "./js/main"
import './styles/main.scss'


window.addEventListener("keydown", (e) => {
  if (e.keyCode == 32) {
    if (Game.GameState == 0) {
      document.querySelector('.startScreen').classList.toggle('is-hidden')
      Game.init()
    } else if (Game.GameState == 2) {
      document.querySelector('.clearScreen').classList.toggle('is-hidden')
      document.querySelector('canvas').remove()
      Game._startNewGame()
    } else if (Game.GameState == 3) {
      document.querySelector('canvas').remove()
      document.querySelector('.endScreen').classList.toggle('is-hidden')
      Game._startNewGame()
    }
  }
});

// Game.init();

// console.log(bro('sup'))