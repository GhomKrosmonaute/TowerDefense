export const tickInterval = 100

export const info: TimeInfo = {
  lastTick: Date.now() - tickInterval,
  gameDuration: 0,
}

export interface TimeInfo {
  lastTick: number
  gameDuration: number
}

export function tick(this: (info: TimeInfo) => void) {
  if (info.lastTick > Date.now() + tickInterval) {
    info.gameDuration += tickInterval
    info.lastTick = Date.now()
    this(info)
    requestAnimationFrame(tick.bind(this))
  }
}
