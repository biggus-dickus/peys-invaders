import {DOMElem} from './config'
import {game} from './game'
import render from './main'

if (DOMElem.START_BTN) {
  DOMElem.START_BTN.addEventListener('click', () => game.start(render))
}
