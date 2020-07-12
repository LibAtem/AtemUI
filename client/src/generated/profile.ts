import * as Enums from './common-enums'
export interface DeviceProfile {
  Model: Enums.ModelId
  Product: string
  MixEffectBlocks: number
  Sources: DevicePort[]
  AudioSources: Enums.AudioSource[]
  Auxiliaries: number
  DownstreamKeys: number
  UpstreamKeys: number
  RoutableKeyMasks: boolean
  HyperDecks: number
  Stingers: number
  MultiView: MultiView
  DVE: number
  SuperSource: number
  MediaPlayers: number
  MediaPoolClips: number
  MediaPoolStills: number
  MacroCount: number
  SerialPort: number
  AudioMonitor: boolean
  VideoModes: VideoModeSet
  MixMinusOutputs: number
}

export interface DevicePort {
  Id: Enums.VideoSource
  Port: Enums.ExternalPortType[]
}

export interface MultiView {
  Count: number
  VuMeters: boolean
  CanSwapPreviewProgram: boolean
  Supports1080p: boolean
  CanRouteInputs: boolean
  CanToggleSafeArea: boolean
}

export interface VideoModeSet {
  SupportedModes: Enums.VideoMode[]
  MaxFrames: MaxFramesSet
}

export interface MaxFramesSet {
  SD: number
  _720: number
  _1080: number
  _4K: number
}

