import {Canvas} from '../constants'
import {GameObject} from '../config'

export default class Player implements GameObject {
  position = {x: 0, y: 0}
  velocity = {x: 0, y: 0}
  image = new Image()
  width = 0
  height = 0
  rotation = 0
  opacity = 1
  ctxRef

  static SCALE = 0.3
  static OFFSET = 10
  static SPEED = 10
  static ROTATION = 0.15

  constructor(cRef: CanvasRenderingContext2D) {
    this.ctxRef = cRef
    const img = new Image()
    img.src = '/img/player.png'

    img.onload = () => {
      this.image = img
      this.width = img.width * Player.SCALE
      this.height = img.height * Player.SCALE
      this.position = {
        x: Math.floor(Canvas.WIDTH / 2 - this.width / 2),
        y: Math.floor(Canvas.HEIGHT - this.height - Player.OFFSET),
      }
    }
  }

  update() {
    if (this.image) {
      this.position.x += this.velocity.x
      this.draw()
    }
  }

  draw() {
    this.ctxRef.save()
    this.ctxRef.globalAlpha = this.opacity

    this.ctxRef.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
    )
    this.ctxRef.rotate(this.rotation)
    this.ctxRef.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2,
    )

    this.ctxRef.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    )

    this.ctxRef.restore()
  }
}
