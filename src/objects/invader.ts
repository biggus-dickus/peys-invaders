import {GameObject} from '../config'
import {Projectile} from './projectile'

export default class Invader implements GameObject {
  position = {x: 0, y: 0}
  velocity = {x: 0, y: 0}
  width = 0
  height = 0
  image = new Image()
  ctxRef

  static SCALE = .25

  constructor(position: GameObject['position'], cRef: CanvasRenderingContext2D) {
    this.ctxRef = cRef
    const img = new Image()
    img.src = '/img/invader.png'

    img.onload = () => {
      this.image = img
      this.width = img.width * Invader.SCALE
      this.height = img.height * Invader.SCALE
      this.position = position
    }
  }

  update(velocity?: GameObject['velocity']) {
    if (this.image && velocity) {
      this.position.x += velocity.x
      this.position.y += velocity.y
      this.draw()
    }
  }

  draw() {
    this.ctxRef.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    )
  }

  shoot(projectiles: Projectile[]) {
    projectiles.push(
      new Projectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: { x: 0, y: 5 },
        width: 3,
        height: 10,
        ctxRef: this.ctxRef,
        color: '#fff',
      }),
    )
  }
}
