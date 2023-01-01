import {GameObject} from '../config'
import Invader from './invader'
import {Canvas} from '../constants'

export default class Grid implements GameObject {
  position = {x: 0, y: 0}
  velocity = {x: 5, y: 0}
  width = 0
  height = 0
  ctxRef
  invaders: Invader[] = []

  static CELL_SIZE = 35

  constructor(cRef: CanvasRenderingContext2D) {
    this.ctxRef = cRef
    this.invaders = []

    const cols = Math.floor(Math.random() * 10) + 5
    const rows = Math.floor(Math.random() * 5) + 1

    this.width = cols * Grid.CELL_SIZE
    this.height = rows * Grid.CELL_SIZE

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader(
            {
              x: x * Grid.CELL_SIZE,
              y: y * Grid.CELL_SIZE,
            },
            this.ctxRef,
          ),
        )
      }
    }
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.velocity.y = 0

    if (this.position.x + this.width >= Canvas.WIDTH || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = Grid.CELL_SIZE
    }
  }

  draw() {}
}
