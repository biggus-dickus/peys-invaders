import {GameObject} from '../config'

type TParams = {
  position: GameObject['position']
  velocity: GameObject['velocity']
  ctxRef: GameObject['ctxRef']
  color: NonNullable<GameObject['color']>
  width?: GameObject['width']
  height?: GameObject['height']
}

type TOpts = {
  radius: NonNullable<GameObject['radius']>
  fades?: GameObject['fades']
}

export class Projectile implements GameObject {
  position = {x: 0, y: 0}
  velocity = {x: 0, y: 0}
  color
  ctxRef
  width
  height

  constructor({position, velocity, ctxRef, color, width = 5, height = 5}: TParams) {
    this.ctxRef = ctxRef
    this.position = position
    this.velocity = velocity
    this.color = color
    this.width = width
    this.height = height
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.draw()
  }

  draw() {
    this.ctxRef.fillStyle = this.color
    this.ctxRef.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

export class RoundProjectile extends Projectile {
  radius
  opacity = 1
  fades

  constructor(props: TParams, {fades, radius}: TOpts) {
    super(props)
    this.radius = radius
    this.fades = fades
  }

  draw() {
    this.ctxRef.save()
    this.ctxRef.globalAlpha = this.opacity

    this.ctxRef.beginPath()
    this.ctxRef.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    this.ctxRef.fillStyle = this.color
    this.ctxRef.fill()
    this.ctxRef.closePath()

    this.ctxRef.restore()
  }

  update() {
    super.update()
    if (this.fades) {
      this.opacity -= 0.02
    }
  }
}
