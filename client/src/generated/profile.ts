/* eslint-disable*/
import * as Enums from './common-enums'
export interface DeviceProfile {
  model: Enums.ModelId
  product: string
  mixEffectBlocks: number
  sources?: DevicePort[]
  audioSources?: Enums.AudioSource[]
  auxiliaries: number
  downstreamKeys: number
  upstreamKeys: number
  routableKeyMasks: boolean
  hyperDecks: number
  stingers: number
  multiView?: MultiView
  dve: number
  superSource: number
  mediaPlayers: number
  mediaPoolClips: number
  mediaPoolStills: number
  macroCount: number
  serialPort: number
  audioMonitor: boolean
  videoModes?: VideoModeSet
  mixMinusOutputs: number
}

export interface DevicePort {
  id: Enums.VideoSource
  port?: Enums.VideoPortType[]
}

export interface MultiView {
  count: number
  vuMeters: boolean
  canSwapPreviewProgram: boolean
  supports1080p: boolean
  canRouteInputs: boolean
  canToggleSafeArea: boolean
}

export interface VideoModeSet {
  supportedModes?: Enums.VideoMode[]
  maxFrames?: MaxFramesSet
}

export interface MaxFramesSet {
  sd: number
  _720: number
  _1080: number
  _4k: number
}

