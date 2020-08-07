/* eslint-disable*/
import * as Enums from './common-enums'
export interface AtemState {
  auxiliaries: AuxState[]
  colorGenerators: ColorState[]
  downstreamKeyers: DownstreamKeyerState[]
  mediaPlayers: MediaPlayerState[]
  mixEffects: MixEffectState[]
  superSources: SuperSourceState[]
  hyperdecks: HyperdeckState[]
  audio?: AudioState
  fairlight?: FairlightAudioState
  cameraControl: CameraControlState
  macros: MacroState
  mediaPool: MediaPoolState
  settings: SettingsState
  streaming?: StreamingState
  recording?: RecordingState
  info: InfoState
  power: boolean[]
}

export interface AuxState {
  source: Enums.VideoSource
}

export interface ColorState {
  hue: number
  saturation: number
  luma: number
}

export interface DownstreamKeyerState {
  sources: DownstreamKeyerState_SourcesState
  properties: DownstreamKeyerState_PropertiesState
  state: DownstreamKeyerState_StateState
}

export interface MediaPlayerState {
  source: MediaPlayerState_SourceState
  clipStatus?: MediaPlayerState_ClipStatusState
}

export interface MixEffectState {
  keyers: MixEffectState_KeyerState[]
  transition: MixEffectState_TransitionState
  sources: MixEffectState_SourcesState
  fadeToBlack: MixEffectState_FadeToBlackState
}

export interface SuperSourceState {
  boxes: SuperSourceState_BoxState[]
  properties: SuperSourceState_PropertiesState
  border: SuperSourceState_BorderState
}

export interface HyperdeckState {
  storage: HyperdeckState_StorageState
  settings: HyperdeckState_SettingsState
  player: HyperdeckState_PlayerState
  clips: HyperdeckState_ClipState[]
}

export interface AudioState {
  programOut: AudioState_ProgramOutState
  inputs: Record<number, AudioState_InputState>
  monitorOutputs: AudioState_MonitorOutputState[]
  headphoneOutputs: AudioState_HeadphoneOutputState[]
  tally?: Record<Enums.AudioSource, boolean>
}

export interface FairlightAudioState {
  programOut: FairlightAudioState_ProgramOutState
  inputs: Record<number, FairlightAudioState_InputState>
  monitors: FairlightAudioState_MonitorOutputState[]
  tally?: unknown
}

export interface CameraControlState {
  periodicFlushInterval: number
  cameras: Record<number, CameraControlState_CameraState>
}

export interface MacroState {
  pool: MacroState_ItemState[]
  recordStatus: MacroState_RecordStatusState
  runStatus: MacroState_RunStatusState
}

export interface MediaPoolState {
  stills: MediaPoolState_StillState[]
  clips: MediaPoolState_ClipState[]
  unassignedFrames: number
}

export interface SettingsState {
  multiViewers: MultiViewerState[]
  inputs: Record<Enums.VideoSource, InputState>
  talkback?: Record<Enums.TalkbackChannel, SettingsState_TalkbackState>
  mixMinusOutputs: SettingsState_MixMinusOutputState[]
  autoVideoMode: boolean
  detectedVideoMode: boolean
  videoMode: Enums.VideoMode
  downConvertMode: Enums.DownConvertMode
  downConvertVideoModes: Record<Enums.VideoMode, Enums.VideoMode>
  multiviewVideoModes: Record<Enums.VideoMode, Enums.VideoMode>
  serialMode: Enums.SerialMode
  sDI3GLevel: Enums.SDI3GOutputLevel
  superSourceCascade: boolean
}

export interface StreamingState {
  status: StreamingState_StatusState
  settings: StreamingState_SettingsState
}

export interface RecordingState {
  disks: RecordingDiskState[]
}

export interface InfoState {
  version: Enums.ProtocolVersion
  timecodeLocked: boolean
  lastTimecode?: Timecode
  model: Enums.ModelId
  productName: string
  supportedVideoModes: VideoModeInfo[]
  supportsAutoVideoMode: boolean
  advancedChromaKeyers: boolean
  onlyConfigurableOutputs: boolean
  hasCameraControl: boolean
  dve?: InfoState_DveInfoState
  multiViewers?: InfoState_MultiViewInfoState
}

export interface DownstreamKeyerState_SourcesState {
  fillSource: Enums.VideoSource
  cutSource: Enums.VideoSource
}

export interface DownstreamKeyerState_PropertiesState {
  tie: boolean
  rate: number
  preMultipliedKey: boolean
  clip: number
  gain: number
  invert: boolean
  maskEnabled: boolean
  maskTop: number
  maskBottom: number
  maskLeft: number
  maskRight: number
}

export interface DownstreamKeyerState_StateState {
  onAir: boolean
  inTransition: boolean
  isAuto: boolean
  isTowardsOnAir: boolean
  remainingFrames: number
}

export interface MediaPlayerState_SourceState {
  sourceType: Enums.MediaPlayerSource
  sourceIndex: number
}

export interface MediaPlayerState_ClipStatusState {
  playing: boolean
  loop: boolean
  atBeginning: boolean
  clipFrame: number
}

export interface MixEffectState_KeyerState {
  luma?: MixEffectState_KeyerLumaState
  chroma?: MixEffectState_KeyerChromaState
  advancedChroma?: MixEffectState_KeyerAdvancedChromaState
  pattern?: MixEffectState_KeyerPatternState
  dve?: MixEffectState_KeyerDVEState
  flyFrames?: MixEffectState_KeyerFlyFrameState[]
  onAir: boolean
  properties: MixEffectState_KeyerPropertiesState
  flyProperties?: MixEffectState_KeyerFlyProperties
}

export interface MixEffectState_TransitionState {
  properties: MixEffectState_TransitionPropertiesState
  position: MixEffectState_TransitionPositionState
  mix?: MixEffectState_TransitionMixState
  dip?: MixEffectState_TransitionDipState
  wipe?: MixEffectState_TransitionWipeState
  stinger?: MixEffectState_TransitionStingerState
  dve?: MixEffectState_TransitionDVEState
}

export interface MixEffectState_SourcesState {
  program: Enums.VideoSource
  preview: Enums.VideoSource
}

export interface MixEffectState_FadeToBlackState {
  status: MixEffectState_FadeToBlackStatusState
  properties: MixEffectState_FadeToBlackPropertiesState
}

export interface SuperSourceState_BoxState {
  enabled: boolean
  source: Enums.VideoSource
  positionX: number
  positionY: number
  size: number
  cropped: boolean
  cropTop: number
  cropBottom: number
  cropLeft: number
  cropRight: number
}

export interface SuperSourceState_PropertiesState {
  artFillSource: Enums.VideoSource
  artCutSource: Enums.VideoSource
  artOption: Enums.SuperSourceArtOption
  artPreMultiplied: boolean
  artClip: number
  artGain: number
  artInvertKey: boolean
}

export interface SuperSourceState_BorderState {
  enabled: boolean
  bevel: Enums.BorderBevel
  outerWidth: number
  innerWidth: number
  outerSoftness: number
  innerSoftness: number
  bevelSoftness: number
  bevelPosition: number
  hue: number
  saturation: number
  luma: number
  lightSourceDirection: number
  lightSourceAltitude: number
}

export interface HyperdeckState_StorageState {
  activeStorageMedia: number
  currentClipId: number
  activeStorageStatus: Enums.HyperDeckStorageStatus
  frameRate: number
  timeScale: number
  isInterlaced: boolean
  isDropFrameTimecode: boolean
  remainingRecordTime?: Enums.HyperDeckTime
}

export interface HyperdeckState_SettingsState {
  networkAddress: string
  input: Enums.VideoSource
  autoRoll: boolean
  autoRollFrameDelay: number
  status: Enums.HyperDeckConnectionStatus
  isRemoteEnabled: boolean
  storageMediaCount: number
}

export interface HyperdeckState_PlayerState {
  state: Enums.HyperDeckPlayerState
  loop: boolean
  singleClip: boolean
  playbackSpeed: number
  clipTime?: Enums.HyperDeckTime
  timelineTime?: Enums.HyperDeckTime
}

export interface HyperdeckState_ClipState {
  name: string
  duration?: Enums.HyperDeckTime
  timelineStart?: Enums.HyperDeckTime
  timelineEnd?: Enums.HyperDeckTime
}

export interface AudioState_ProgramOutState {
  gain: number
  balance: number
  followFadeToBlack: boolean
  audioFollowVideoCrossfadeTransitionEnabled: boolean
  levels?: AudioState_LevelsState
}

export interface AudioState_InputState {
  isMixedIn: boolean
  properties: AudioState_InputState_PropertiesState
  levels?: AudioState_LevelsState
  analog?: AudioState_InputState_AnalogState
}

export interface AudioState_MonitorOutputState {
  enabled: boolean
  gain: number
  mute: boolean
  solo: boolean
  soloSource: Enums.AudioSource
  dim: boolean
  dimLevel: number
}

export interface AudioState_HeadphoneOutputState {
  gain: number
  programOutGain: number
  sidetoneGain: number
  talkbackGain: number
}

export interface FairlightAudioState_ProgramOutState {
  gain: number
  followFadeToBlack: boolean
  audioFollowVideoCrossfadeTransitionEnabled: boolean
  dynamics: FairlightAudioState_DynamicsState
  equalizer: FairlightAudioState_EqualizerState
  levels?: FairlightAudioState_LevelsState
}

export interface FairlightAudioState_InputState {
  inputType: Enums.FairlightInputType
  supportedConfigurations: Enums.FairlightInputConfiguration
  externalPortType: Enums.AudioPortType
  activeConfiguration: Enums.FairlightInputConfiguration
  analog?: FairlightAudioState_AnalogState
  sources: FairlightAudioState_InputSourceState[]
}

export interface FairlightAudioState_MonitorOutputState {
  gain: number
  inputMasterGain: number
  inputTalkbackGain: number
  inputSidetoneGain: number
}

export interface CameraControlState_CameraState {
  camera: CameraControlState_CameraSettingsState
  chip: CameraControlState_ChipSettingsState
  lens: CameraControlState_LensSettingsState
  colorBars: boolean
}

export interface MacroState_ItemState {
  isUsed: boolean
  hasUnsupportedOps: boolean
  name: string
  description: string
}

export interface MacroState_RecordStatusState {
  isRecording: boolean
  recordIndex: number
}

export interface MacroState_RunStatusState {
  runStatus: MacroState_MacroRunStatus
  runIndex: number
  loop: boolean
}

export interface MediaPoolState_StillState {
  isUsed: boolean
  hash?: number[]
  filename: string
}

export interface MediaPoolState_ClipState {
  isUsed: boolean
  name: string
  frameCount: number
  maxFrames: number
  frames: MediaPoolState_FrameState[]
  audio: MediaPoolState_ClipState_AudioState
}

export interface MultiViewerState {
  vuMeterOpacity: number
  properties: MultiViewerState_PropertiesState
  windows: MultiViewerState_WindowState[]
}

export interface InputState {
  properties: InputState_PropertiesState
  tally: InputState_TallyState
}

export interface SettingsState_TalkbackState {
  muteSDI: boolean
  inputs: SettingsState_TalkbackInputState[]
}

export interface SettingsState_MixMinusOutputState {
  hasAudioInputId: boolean
  audioInputId: Enums.AudioSource
  supportedModes: Enums.MixMinusMode
  mode: Enums.MixMinusMode
}

export interface StreamingState_StatusState {
  isStreaming: boolean
  cacheUsed: number
  encodingBitrate: number
  duration?: Timecode
  state: unknown
  error: number
}

export interface StreamingState_SettingsState {
  serviceName: string
  url: string
  key: string
  lowBitrate: number
  highBitrate: number
}

export interface RecordingDiskState {
  diskId: number
  volumeName: string
  recordingTimeAvailable: number
}

export interface Timecode {
  hour: number
  minute: number
  second: number
  frame: number
  dropFrame: boolean
}

export interface VideoModeInfo {
  mode: Enums.VideoMode
  requiresReconfig: boolean
  multiviewModes: Enums.VideoMode[]
  downConvertModes: Enums.VideoMode[]
}

export interface InfoState_DveInfoState {
  canRotate: boolean
  canScaleUp: boolean
  supportedTransitions: Enums.DVEEffect[]
}

export interface InfoState_MultiViewInfoState {
  canRouteInputs: boolean
  supportsVuMeters: boolean
  supportsProgramPreviewSwapped: boolean
  supportsQuadrantLayout: boolean
  supportsToggleSafeArea: boolean
}

export interface MixEffectState_KeyerLumaState {
  preMultiplied: boolean
  clip: number
  gain: number
  invert: boolean
}

export interface MixEffectState_KeyerChromaState {
  hue: number
  gain: number
  ySuppress: number
  lift: number
  narrow: boolean
}

export interface MixEffectState_KeyerAdvancedChromaState {
  sample: MixEffectState_KeyerAdvancedChromaSampleState
  properties: MixEffectState_KeyerAdvancedChromaPropertiesState
}

export interface MixEffectState_KeyerPatternState {
  pattern: Enums.Pattern
  size: number
  symmetry: number
  softness: number
  xPosition: number
  yPosition: number
  inverse: boolean
}

export interface MixEffectState_KeyerDVEState {
  sizeX: number
  sizeY: number
  positionX: number
  positionY: number
  rotation: number
  rate: number
  borderEnabled: boolean
  borderShadowEnabled: boolean
  borderBevel: Enums.BorderBevel
  borderOuterWidth: number
  borderInnerWidth: number
  borderOuterSoftness: number
  borderInnerSoftness: number
  borderBevelSoftness: number
  borderBevelPosition: number
  borderOpacity: number
  borderHue: number
  borderSaturation: number
  borderLuma: number
  lightSourceDirection: number
  lightSourceAltitude: number
  maskEnabled: boolean
  maskTop: number
  maskBottom: number
  maskLeft: number
  maskRight: number
}

export interface MixEffectState_KeyerFlyFrameState {
  sizeX: number
  sizeY: number
  positionX: number
  positionY: number
  rotation: number
  outerWidth: number
  innerWidth: number
  outerSoftness: number
  innerSoftness: number
  bevelSoftness: number
  bevelPosition: number
  borderOpacity: number
  borderHue: number
  borderSaturation: number
  borderLuma: number
  lightSourceDirection: number
  lightSourceAltitude: number
  maskTop: number
  maskBottom: number
  maskLeft: number
  maskRight: number
}

export interface MixEffectState_KeyerPropertiesState {
  keyType: Enums.MixEffectKeyType
  flyEnabled: boolean
  fillSource: Enums.VideoSource
  cutSource: Enums.VideoSource
  maskEnabled: boolean
  maskTop: number
  maskBottom: number
  maskLeft: number
  maskRight: number
  canFlyKey: boolean
}

export interface MixEffectState_KeyerFlyProperties {
  isASet: boolean
  isBSet: boolean
  runningToKeyFrame: Enums.FlyKeyKeyFrameType
  runningToInfinite: Enums.FlyKeyLocation
}

export interface MixEffectState_TransitionPropertiesState {
  style: Enums.TransitionStyle
  nextStyle: Enums.TransitionStyle
  selection: Enums.TransitionLayer
  nextSelection: Enums.TransitionLayer
  previewTransition: boolean
}

export interface MixEffectState_TransitionPositionState {
  inTransition: boolean
  remainingFrames: number
  handlePosition: number
}

export interface MixEffectState_TransitionMixState {
  rate: number
}

export interface MixEffectState_TransitionDipState {
  input: Enums.VideoSource
  rate: number
}

export interface MixEffectState_TransitionWipeState {
  rate: number
  pattern: Enums.Pattern
  borderWidth: number
  borderInput: Enums.VideoSource
  symmetry: number
  borderSoftness: number
  xPosition: number
  yPosition: number
  reverseDirection: boolean
  flipFlop: boolean
}

export interface MixEffectState_TransitionStingerState {
  source: Enums.StingerSource
  preMultipliedKey: boolean
  clip: number
  gain: number
  invert: boolean
  preroll: number
  clipDuration: number
  triggerPoint: number
  mixRate: number
}

export interface MixEffectState_TransitionDVEState {
  rate: number
  logoRate: number
  style: Enums.DVEEffect
  fillSource: Enums.VideoSource
  keySource: Enums.VideoSource
  enableKey: boolean
  preMultiplied: boolean
  clip: number
  gain: number
  invertKey: boolean
  reverse: boolean
  flipFlop: boolean
}

export interface MixEffectState_FadeToBlackStatusState {
  isFullyBlack: boolean
  inTransition: boolean
  remainingFrames: number
}

export interface MixEffectState_FadeToBlackPropertiesState {
  rate: number
}

export interface AudioState_LevelsState {
  levels: number[]
  peaks: number[]
}

export interface AudioState_InputState_PropertiesState {
  sourceType: Enums.AudioSourceType
  portType: Enums.AudioPortType
  mixOption: Enums.AudioMixOption
  gain: number
  balance: number
}

export interface AudioState_InputState_AnalogState {
  rcaToXlr: boolean
}

export interface FairlightAudioState_DynamicsState {
  makeUpGain: number
  limiter?: FairlightAudioState_LimiterState
  compressor?: FairlightAudioState_CompressorState
  expander?: FairlightAudioState_ExpanderState
}

export interface FairlightAudioState_EqualizerState {
  enabled: boolean
  gain: number
  bands: FairlightAudioState_EqualizerBandState[]
}

export interface FairlightAudioState_LevelsState {
  levels: number[]
  peaks: number[]
  dynamicsInputLevels: number[]
  dynamicsInputPeaks: number[]
  dynamicsOutputLevels: number[]
  dynamicsOutputPeaks: number[]
  expanderGainReductionLevel: number
  compressorGainReductionLevel: number
  limiterGainReductionLevel: number
}

export interface FairlightAudioState_AnalogState {
  supportedInputLevel: Enums.FairlightAnalogInputLevel
  inputLevel: Enums.FairlightAnalogInputLevel
}

export interface FairlightAudioState_InputSourceState {
  sourceId: number
  sourceType: Enums.FairlightAudioSourceType
  gain: number
  balance: number
  faderGain: number
  supportedMixOptions: Enums.FairlightAudioMixOption
  mixOption: Enums.FairlightAudioMixOption
  maxFramesDelay: number
  framesDelay: number
  hasStereoSimulation: boolean
  stereoSimulation: number
  dynamics: FairlightAudioState_DynamicsState
  equalizer: FairlightAudioState_EqualizerState
  levels?: FairlightAudioState_LevelsState
}

export interface CameraControlState_CameraSettingsState {
  detail: Enums.CameraDetail
  detailPeriodicFlushEnabled: boolean
  gain: number
  gainPeriodicFlushEnabled: boolean
  positiveGain: number
  positiveGainPeriodicFlushEnabled: boolean
  shutter: number
  shutterPeriodicFlushEnabled: boolean
  whiteBalance: number
  whiteBalancePeriodicFlushEnabled: boolean
}

export interface CameraControlState_ChipSettingsState {
  lift: CameraControlState_RGBYState
  gamma: CameraControlState_RGBYState
  gain: CameraControlState_RGBYState
  contrast: number
  contrastPeriodicFlushEnabled: boolean
  hue: number
  saturation: number
  hueSaturationPeriodicFlushEnabled: boolean
  lumMix: number
  lumMixPeriodicFlushEnabled: boolean
  aperture: number
  aperturePeriodicFlushEnabled: boolean
}

export interface CameraControlState_LensSettingsState {
  zoomSpeed: number
  zoomSpeedPeriodicFlushEnabled: boolean
  focus: number
  focusPeriodicFlushEnabled: boolean
  iris: number
  irisPeriodicFlushEnabled: boolean
}

export interface MacroState_MacroRunStatus {
}

export interface MediaPoolState_FrameState {
  isUsed: boolean
  hash: number[]
}

export interface MediaPoolState_ClipState_AudioState {
  isUsed: boolean
  name: string
  hash?: number[]
}

export interface MultiViewerState_PropertiesState {
  layout: Enums.MultiViewLayoutV8
  programPreviewSwapped: boolean
}

export interface MultiViewerState_WindowState {
  source: Enums.VideoSource
  supportsVuMeter: boolean
  vuMeterEnabled: boolean
  supportsSafeArea: boolean
  safeAreaEnabled: boolean
}

export interface InputState_PropertiesState {
  shortName: string
  longName: string
  areNamesDefault: boolean
  internalPortType: Enums.InternalPortType
  sourceAvailability: Enums.SourceAvailability
  meAvailability: Enums.MeAvailability
  availableExternalPortTypes?: Enums.VideoPortType[]
  currentExternalPortType: Enums.VideoPortType
}

export interface InputState_TallyState {
  programTally: boolean
  previewTally: boolean
}

export interface SettingsState_TalkbackInputState {
}

export interface MixEffectState_KeyerAdvancedChromaSampleState {
  enableCursor: boolean
  preview: boolean
  cursorX: number
  cursorY: number
  cursorSize: number
  sampledY: number
  sampledCb: number
  sampledCr: number
}

export interface MixEffectState_KeyerAdvancedChromaPropertiesState {
  foregroundLevel: number
  backgroundLevel: number
  keyEdge: number
  spillSuppression: number
  flareSuppression: number
  brightness: number
  contrast: number
  saturation: number
  red: number
  green: number
  blue: number
}

export interface FairlightAudioState_LimiterState {
  limiterEnabled: boolean
  threshold: number
  attack: number
  hold: number
  release: number
}

export interface FairlightAudioState_CompressorState {
  compressorEnabled: boolean
  threshold: number
  ratio: number
  attack: number
  hold: number
  release: number
}

export interface FairlightAudioState_ExpanderState {
  expanderEnabled: boolean
  gateEnabled: boolean
  threshold: number
  range: number
  ratio: number
  attack: number
  hold: number
  release: number
}

export interface FairlightAudioState_EqualizerBandState {
  bandEnabled: boolean
  supportedShapes: Enums.FairlightEqualizerBandShape
  shape: Enums.FairlightEqualizerBandShape
  supportedFrequencyRanges: Enums.FairlightEqualizerFrequencyRange
  frequencyRange: Enums.FairlightEqualizerFrequencyRange
  frequency: number
  gain: number
  qFactor: number
}

export interface CameraControlState_RGBYState {
  r: number
  g: number
  b: number
  y: number
  periodicFlushEnabled: boolean
}

