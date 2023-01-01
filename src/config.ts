type TPosition = {x: number; y: number}

export interface GameObject {
  position: TPosition
  velocity: TPosition
  ctxRef: CanvasRenderingContext2D

  width?: number
  height?: number
  color?: string
  radius?: number
  rotation?: number
  image?: HTMLImageElement
  opacity?: number
  fades?: boolean

  update: (velocity?: GameObject['velocity']) => void
  draw: () => void
  shoot?: (args: any) => void
}

export const DOMElem = {
  CANVAS: document.getElementById('canvas') as HTMLCanvasElement,
  GAMOVER: document.getElementById('gamover') as HTMLElement,
  HINT: document.getElementById('hint') as HTMLElement,
  OVERLAY: document.getElementById('overlay') as HTMLElement,
  SCORE: document.getElementById('score-el') as HTMLElement,
  START_BTN: document.getElementById('start-el') as HTMLButtonElement,
}
