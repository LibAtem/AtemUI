import * as Enums from './common-enums'
export interface DeviceProfile {
  model: Enums.ModelId
  product: string
  mixEffectBlocks: number
  sources: DevicePort[]
  audioSources: Enums.AudioSource[]
  auxiliaries: number
  downstreamKeys: number
  upstreamKeys: number
  routableKeyMasks: boolean
  hyperDecks: number
  stingers: number
  multiView: MultiView
  dVE: number
  superSource: number
  mediaPlayers: number
  mediaPoolClips: number
  mediaPoolStills: number
  macroCount: number
  serialPort: number
  audioMonitor: boolean
  videoModes: VideoModeSet
  mixMinusOutputs: number
}

export interface DevicePort {
  id: Enums.VideoSource
  port: Enums.ExternalPortType[]
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
  supportedModes: Enums.VideoMode[]
  maxFrames: MaxFramesSet
}

export interface MaxFramesSet {
  sD: number
  _720: number
  _1080: number
  _4K: number
}

