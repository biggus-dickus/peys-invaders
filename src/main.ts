import {Canvas, Max, Score} from './constants'
import {DOMElem} from './config'
import {createParticles, createStars, game, getRandomFrame, keys} from './game'

import Grid from './objects/grid'
import Player from './objects/player'
import {Projectile, RoundProjectile} from './objects/projectile'

const canvas = DOMElem.CANVAS
canvas.width = Canvas.WIDTH
canvas.height = Canvas.HEIGHT
const ctx = canvas.getContext('2d')!

const player = new Player(ctx)
const playerProjectiles: RoundProjectile[] = []
const invaderProjectiles: Projectile[] = []
const particles: RoundProjectile[] = []
const grids: Grid[] = []

createStars({c: canvas, count: 100, container: particles})

let frames = 0
let randomFrame = getRandomFrame()

export default function render() {
  if (!game.active && game.over) return

  const requestId = window.requestAnimationFrame(render)
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width - Player.OFFSET) {
    player.velocity.x = Player.SPEED
    player.rotation = Player.ROTATION
  } else if (keys.ArrowLeft.pressed && player.position.x >= Player.OFFSET) {
    player.velocity.x = -Player.SPEED
    player.rotation = -Player.ROTATION
  } else {
    player.velocity.x = 0
    player.rotation = 0
  }

  player.update()

  particles.forEach((particle, i) => {
    // respawn stars
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width
      particle.position.y = -particle.radius
    }

    if (particle.opacity <= 0) {
      setTimeout(() => particles.splice(i, 1), 0)
    } else particle.update()
  })

  playerProjectiles.forEach((p, i) => {
    if (p.position.y + p.radius <= 0) {
      setTimeout(() => playerProjectiles.splice(i, 1), 0) // prevent flash when splicing
    } else {
      p.update()
    }
  })

  invaderProjectiles.forEach((iProj, projIndex) => {
    if (iProj.position.y >= canvas.height) {
      setTimeout(() => invaderProjectiles.splice(projIndex, 1), 0)
    } else {
      iProj.update()
    }

    // InvaderProjectile hits Player
    if (
      iProj.position.y + iProj.height >= player.position.y &&
      iProj.position.x + iProj.width >= player.position.x &&
      iProj.position.x <= player.position.x + player.width
    ) {
      createParticles({
        container: particles,
        ctx,
        object: player,
      })
      player.opacity = 0
      game.over = true

      setTimeout(() => invaderProjectiles.splice(projIndex, 1), 0)
      setTimeout(() => {
        game.stop(() => {
          grids.length = 0
          invaderProjectiles.length = 0
          playerProjectiles.length = 0
          frames = 0
          player.opacity = 1
          player.position.x = Math.floor(canvas.width / 2 - player.width / 2)
          keys.ArrowRight.pressed = false
          keys.ArrowLeft.pressed = false
          window.cancelAnimationFrame(requestId)
        })
      }, 2000)
    }
  })

  grids.forEach((grid, gridIndex) => {
    if (grid.position.y >= canvas.height) {
      setTimeout(() => grids.splice(gridIndex, 1), 0)
    } else {
      grid.update()
    }

    // Spawn invader projectiles
    if (frames % 100 === 0 && grid.invaders.length) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
    }

    grid.invaders.forEach((invader, invaderIndex) => {
      invader.update(grid.velocity)

      // PlayerProjectile hits Invader
      playerProjectiles.forEach((p, pIndex) => {
        if (
          p.position.y - p.radius <= invader.position.y + invader.height &&
          p.position.x + p.radius >= invader.position.x &&
          p.position.x - p.radius <= invader.position.x + invader.width &&
          p.position.y + p.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find((inv) => inv === invader)
            const projectileFound = playerProjectiles.find((proj) => proj === p)

            if (invaderFound && projectileFound) {
              game.score += Score.SHIP
              DOMElem.SCORE.textContent = game.score.toString()

              grid.invaders.splice(invaderIndex, 1)
              playerProjectiles.splice(pIndex, 1)

              // Invader goes boom!
              if (particles.length < Max.PARTICLES) {
                createParticles({
                  container: particles,
                  ctx,
                  object: invader,
                  color: '#ffde01',
                })
              }

              // Update grid dimensions after invaders are destroyed
              if (grid.invaders.length) {
                const [firstInvader, lastInvader] = [grid.invaders[0], grid.invaders[grid.invaders.length - 1]]
                grid.width = lastInvader.position.x - firstInvader.position.x + invader.width
                grid.position.x = firstInvader.position.x
              } else {
                grids.splice(gridIndex, 1)
              }
            }
          }, 0)
        }
      })
    })
  })

  // Spawn enemies
  if (frames % randomFrame === 0) {
    grids.push(new Grid(ctx))
    randomFrame = getRandomFrame()
    frames = 0
  }
  frames++
}

const keyHandler = (e: KeyboardEvent, isUp?: boolean): void => {
  if (game.over) return

  if (e.code in keys) {
    keys[e.code as keyof typeof keys].pressed = !isUp
  }

  // Player shooting
  if (e.code === 'Space' && !isUp && playerProjectiles.length < Max.PLAYER_PROJECTILES) {
    playerProjectiles.push(
      new RoundProjectile(
        {
          ctxRef: ctx,
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: -10,
          },
          color: 'red',
        },
        {radius: 4},
      ),
    )
  }
}

window.addEventListener('keydown', keyHandler)
window.addEventListener('keyup', (e) => keyHandler(e, true))
