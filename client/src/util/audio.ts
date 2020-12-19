import { LibAtemEnums } from '../generated'

export function audioSourceToVideoSource(id: LibAtemEnums.AudioSource): LibAtemEnums.VideoSource | undefined {
  if (id < 1000) {
    return (id as number) as LibAtemEnums.VideoSource
  }

  if (id < 2000) {
    // Analog audio inputs
    return undefined
  }

  if (id <= 3000) {
    const mpId = id - 2000
    return mpId * 10 + 3000
  }

  return undefined
}
