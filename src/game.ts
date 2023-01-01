import {DOMElem, GameObject} from './config'
import {RoundProjectile} from './objects/projectile'

type TKey = 'ArrowRight' | 'ArrowLeft' | 'Space'
type Pressed = {pressed: boolean}

class Game {
  over = true
  active = false
  score = 0

  start(onStart: () => void) {
    this.active = true
    this.over = false
    this.score = 0

    DOMElem.SCORE.textContent = '0'
    DOMElem.OVERLAY.classList.add('hidden')
    onStart()
  }

  stop(onStop?: () => void) {
    this.active = false
    this.over = true

    DOMElem.OVERLAY.classList.remove('hidden')
    DOMElem.GAMOVER.classList.remove('hidden')
    DOMElem.HINT.hidden = true
    DOMElem.START_BTN.textContent = 'Another round'
    onStop && onStop()
  }
}
export const game = new Game()

export const keys: Record<TKey, Pressed> = {
  ArrowRight: {pressed: false},
  ArrowLeft: {pressed: false},
  Space: {pressed: false},
}

export const getRandomFrame = () => Math.floor(Math.random() * 750) + 500

type TParams = {
  ctx: GameObject['ctxRef']
  container: RoundProjectile[]
  object: GameObject
  count?: number
  color?: string
}
export const createParticles = ({
  container,
  ctx,
  object,
  color = '#fff',
  count = 15,
}: TParams): RoundProjectile[] => {
  for (let i = 0; i < count; i++) {
    container.push(
      new RoundProjectile(
        {
          ctxRef: ctx,
          position: {
            x: object.position.x + (object.width || 0) / 2,
            y: object.position.y + (object.height || 0) / 2,
          },
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
          },
          color,
        },
        {
          radius: Math.random() * 3,
          fades: true,
        },
      ),
    )
  }

  return container
}

export const createStars = (
  params: Omit<TParams, 'ctx' | 'object'> & {c: HTMLCanvasElement},
): RoundProjectile[] => {
  const {c, color = 'rgba(255, 255, 255, .5)', count = 50, container} = params
  const ctx = c.getContext('2d')!

  for (let i = 0; i < count; i++) {
    container.push(
      new RoundProjectile(
        {
          ctxRef: ctx,
          position: {
            x: Math.random() * c.width,
            y: Math.random() * c.height,
          },
          velocity: {x: 0, y: 0.5},
          color,
        },
        {
          radius: Math.random() * 2,
        },
      ),
    )
  }

  return container
}
