// ../LibAtem/LibAtem/Version.cs
export interface ProtocolVersionNameAttribute extends Object {
  name: string
}

// ../LibAtem/LibAtem/Version.cs
export interface SinceAttribute extends Object {
  version: ProtocolVersion
}

// ../LibAtem/LibAtem/Version.cs
export interface ProtocolVersionExt {}

// ../LibAtem/LibAtem/Version.cs
export enum ProtocolVersion {
  Minimum = 0x00020016,
  V7_2 = 0x00020016,
  V7_X = 0x00020019,
  V8_0 = 0x0002001c,
  V8_0_1 = 0x0002001d,
  V8_1_1 = 0x0002001e,
  Latest = V8_1_1
}

// ../LibAtem/LibAtem.State/DownstreamKeyerState.cs
export interface DownstreamKeyerState_SourcesState {
  fillSource: VideoSource
  cutSource: VideoSource
}

// ../LibAtem/LibAtem.State/DownstreamKeyerState.cs
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

// ../LibAtem/LibAtem.State/DownstreamKeyerState.cs
export interface DownstreamKeyerState_StateState {
  onAir: boolean
  inTransition: boolean
  isAuto: boolean
  isTowardsOnAir: boolean
  remainingFrames: number
}

// ../LibAtem/LibAtem.State/DownstreamKeyerState.cs
export interface DownstreamKeyerState {
  sources: DownstreamKeyerState_SourcesState
  properties: DownstreamKeyerState_PropertiesState
  state: DownstreamKeyerState_StateState
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_SourcesState {
  program: VideoSource
  preview: VideoSource
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_TransitionState {
  properties: MixEffectState_TransitionPropertiesState
  position: MixEffectState_TransitionPositionState
  mix: MixEffectState_TransitionMixState
  dip: MixEffectState_TransitionDipState
  wipe: MixEffectState_TransitionWipeState
  stinger: MixEffectState_TransitionStingerState
  dve: MixEffectState_TransitionDVEState
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_TransitionPropertiesState {
  style: TransitionStyle
  nextStyle: TransitionStyle
  selection: TransitionLayer
  nextSelection: TransitionLayer
  preview: boolean
  isInPreview: boolean
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_TransitionPositionState {
  inTransition: boolean
  remainingFrames: number
  handlePosition: number
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_TransitionMixState {
  rate: number
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_TransitionDipState {
  input: VideoSource
  rate: number
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_TransitionWipeState {
  rate: number
  pattern: Pattern
  borderWidth: number
  borderInput: VideoSource
  symmetry: number
  borderSoftness: number
  xPosition: number
  yPosition: number
  reverseDirection: boolean
  flipFlop: boolean
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_TransitionStingerState {
  source: StingerSource
  preMultipliedKey: boolean
  clip: number
  gain: number
  invert: boolean
  preroll: number
  clipDuration: number
  triggerPoint: number
  mixRate: number
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_TransitionDVEState {
  rate: number
  logoRate: number
  style: DVEEffect
  fillSource: VideoSource
  keySource: VideoSource
  enableKey: boolean
  preMultiplied: boolean
  clip: number
  gain: number
  invertKey: boolean
  reverse: boolean
  flipFlop: boolean
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_KeyerState {
  luma: MixEffectState_KeyerLumaState
  chroma: MixEffectState_KeyerChromaState
  advancedChroma: MixEffectState_KeyerAdvancedChromaState
  pattern: MixEffectState_KeyerPatternState
  dve: MixEffectState_KeyerDVEState
  flyFrames: MixEffectState_KeyerFlyFrameState[]
  onAir: boolean
  properties: MixEffectState_KeyerPropertiesState
  flyProperties: MixEffectState_KeyerFlyProperties
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_KeyerPropertiesState {
  keyType: MixEffectKeyType
  flyEnabled: boolean
  fillSource: VideoSource
  cutSource: VideoSource
  maskEnabled: boolean
  maskTop: number
  maskBottom: number
  maskLeft: number
  maskRight: number
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_KeyerLumaState {
  preMultiplied: boolean
  clip: number
  gain: number
  invert: boolean
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_KeyerChromaState {
  hue: number
  gain: number
  ySuppress: number
  lift: number
  narrow: boolean
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_KeyerAdvancedChromaState {
  sample: MixEffectState_KeyerAdvancedChromaSampleState
  properties: MixEffectState_KeyerAdvancedChromaPropertiesState
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
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

// ../LibAtem/LibAtem.State/MixEffectState.cs
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

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_KeyerPatternState {
  pattern: Pattern
  size: number
  symmetry: number
  softness: number
  xPosition: number
  yPosition: number
  inverse: boolean
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_KeyerDVEState {
  sizeX: number
  sizeY: number
  positionX: number
  positionY: number
  rotation: number
  rate: number
  borderEnabled: boolean
  borderShadowEnabled: boolean
  borderBevel: BorderBevel
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

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_KeyerFlyProperties {
  isASet: boolean
  isBSet: boolean
  isAtKeyFrame: number
  runToInfinite: number
  activeKeyFrame: number
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
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

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_FadeToBlackState {
  status: MixEffectState_FadeToBlackStatusState
  properties: MixEffectState_FadeToBlackPropertiesState
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_FadeToBlackPropertiesState {
  rate: number
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState_FadeToBlackStatusState {
  isFullyBlack: boolean
  inTransition: boolean
  remainingFrames: number
}

// ../LibAtem/LibAtem.State/MixEffectState.cs
export interface MixEffectState {
  keyers: MixEffectState_KeyerState[]
  transition: MixEffectState_TransitionState
  sources: MixEffectState_SourcesState
  fadeToBlack: MixEffectState_FadeToBlackState
}

// ../LibAtem/LibAtem.State/AuxState.cs
export interface AuxState {
  source: VideoSource
}

// ../LibAtem/LibAtem.State/SuperSourceState.cs
export interface SuperSourceState_BoxState {
  enabled: boolean
  source: VideoSource
  positionX: number
  positionY: number
  size: number
  cropped: boolean
  cropTop: number
  cropBottom: number
  cropLeft: number
  cropRight: number
}

// ../LibAtem/LibAtem.State/SuperSourceState.cs
export interface SuperSourceState_PropertiesState {
  artFillSource: VideoSource
  artCutSource: VideoSource
  artOption: SuperSourceArtOption
  artPreMultiplied: boolean
  artClip: number
  artGain: number
  artInvertKey: boolean
}

// ../LibAtem/LibAtem.State/SuperSourceState.cs
export interface SuperSourceState_BorderState {
  enabled: boolean
  bevel: BorderBevel
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

// ../LibAtem/LibAtem.State/SuperSourceState.cs
export interface SuperSourceState {
  boxes: SuperSourceState_BoxState[]
  properties: SuperSourceState_PropertiesState
  border: SuperSourceState_BorderState
}

// ../LibAtem/LibAtem.State/ColorState.cs
export interface ColorState {
  hue: number
  saturation: number
  luma: number
}

// ../LibAtem/LibAtem.State/InfoState.cs
export interface InfoState {
  version: ProtocolVersion
  timecodeLocked: boolean
  lastTimecode: Timecode
  model: ModelId
  productName: string
  supportedVideoModes: VideoModeInfo[]
  supportsAutoVideoMode: boolean
}

// ../LibAtem/LibAtem.State/InfoState.cs
export interface VideoModeInfo {
  mode: VideoMode
  requiresReconfig: boolean
  multiviewModes: VideoMode[]
  downConvertModes: VideoMode[]
}

// ../LibAtem/LibAtem.State/InfoState.cs
export interface Timecode {
  hour: number
  minute: number
  second: number
  frame: number
  dropFrame: boolean
}

// ../LibAtem/LibAtem.State/AudioState.cs
export interface AudioState_LevelsState {
  levels: number[]
  peaks: number[]
}

// ../LibAtem/LibAtem.State/AudioState.cs
export interface AudioState_ProgramOutState {
  gain: number
  balance: number
  followFadeToBlack: boolean
  levels: AudioState_LevelsState
}

// ../LibAtem/LibAtem.State/AudioState.cs
export interface AudioState_MonitorOutputState {
  enabled: boolean
  gain: number
  mute: boolean
  solo: boolean
  soloSource: AudioSource
  dim: boolean
  dimLevel: number
}

// ../LibAtem/LibAtem.State/AudioState.cs
export interface AudioState_HeadphoneOutputState {
  gain: number
  programOutGain: number
  sidetoneGain: number
  talkbackGain: number
}

// ../LibAtem/LibAtem.State/AudioState.cs
export interface InputState_PropertiesState {
  sourceType: AudioSourceType
  portType: AudioPortType
  mixOption: AudioMixOption
  gain: number
  balance: number
}

// ../LibAtem/LibAtem.State/AudioState.cs
export interface InputState_AnalogState {
  rcaToXlr: boolean
}

// ../LibAtem/LibAtem.State/AudioState.cs
export interface AudioState_InputState {
  isMixedIn: boolean
  properties: InputState_PropertiesState
  levels: AudioState_LevelsState
  analog: InputState_AnalogState
}

// ../LibAtem/LibAtem.State/AudioState.cs
export interface AudioState {
  programOut: AudioState_ProgramOutState
  inputs: Record<number, AudioState_InputState>
  monitorOutputs: AudioState_MonitorOutputState[]
  headphoneOutputs: AudioState_HeadphoneOutputState[]
  tally: Record<AudioSource, boolean>
}

// ../LibAtem/LibAtem.State/SettingsState.cs
export interface SettingsState_HyperdeckState {
  networkAddress: string
  input: VideoSource
  autoRoll: boolean
  autoRollFrameDelay: number
}

// ../LibAtem/LibAtem.State/SettingsState.cs
export interface SettingsState_MixMinusOutputState {
  audioInputId: AudioSource
  supportedModes: MixMinusMode
  mode: MixMinusMode
}

// ../LibAtem/LibAtem.State/SettingsState.cs
export interface SettingsState_TalkbackState {
  muteSdi: boolean
  inputs: SettingsState_TalkbackInputState[]
}

// ../LibAtem/LibAtem.State/SettingsState.cs
export interface SettingsState_TalkbackInputState {}

// ../LibAtem/LibAtem.State/SettingsState.cs
export interface SettingsState {
  multiViewers: MultiViewerState[]
  inputs: Record<VideoSource, InputState>
  hyperdecks: SettingsState_HyperdeckState[]
  talkback: Record<TalkbackChannel, SettingsState_TalkbackState>
  mixMinusOutputs: SettingsState_MixMinusOutputState[]
  videoMode: VideoMode
  downConvertMode: DownConvertMode
  downConvertVideoMode: VideoMode
  serialMode: SerialMode
  sdi3GLevel: SDI3GOutputLevel
  superSourceCascade: boolean
}

// ../LibAtem/LibAtem.State/SettingsState.cs
export interface InputState_PropertiesState {
  shortName: string
  longName: string
  internalPortType: InternalPortType
  availableExternalPortTypes: ExternalPortTypeFlags
  currentExternalPortType: ExternalPortTypeFlags
}

// ../LibAtem/LibAtem.State/SettingsState.cs
export interface InputState_TallyState {
  programTally: boolean
  previewTally: boolean
}

// ../LibAtem/LibAtem.State/SettingsState.cs
export interface InputState {
  properties: InputState_PropertiesState
  tally: InputState_TallyState
}

// ../LibAtem/LibAtem.State/SettingsState.cs
export interface MultiViewerState_PropertiesState {
  layout: MultiViewLayoutV8
  programPreviewSwapped: boolean
}

// ../LibAtem/LibAtem.State/SettingsState.cs
export interface MultiViewerState_WindowState {
  vuMeter: boolean
  supportsVuMeter: boolean
  source: VideoSource
  safeAreaEnabled: boolean
}

// ../LibAtem/LibAtem.State/SettingsState.cs
export interface MultiViewerState {
  supportsVuMeters: boolean
  supportsProgramPreviewSwapped: boolean
  supportsQuadrantLayout: boolean
  supportsToggleSafeArea: boolean
  vuMeterOpacity: number
  properties: MultiViewerState_PropertiesState
  windows: MultiViewerState_WindowState[]
}

// ../LibAtem/LibAtem.State/MacroState.cs
export interface MacroState_RecordStatusState {
  isRecording: boolean
  recordIndex: number
}

// ../LibAtem/LibAtem.State/MacroState.cs
export interface MacroState_RunStatusState {
  runStatus: MacroRunStatus
  runIndex: number
  loop: boolean
}

// ../LibAtem/LibAtem.State/MacroState.cs
export interface MacroState_ItemState {
  isUsed: boolean
  hasUnsupportedOps: boolean
  name: string
  description: string
}

// ../LibAtem/LibAtem.State/MacroState.cs
export interface MacroState {
  pool: MacroState_ItemState[]
  recordStatus: MacroState_RecordStatusState
  runStatus: MacroState_RunStatusState
}

// ../LibAtem/LibAtem.State/MacroState.cs
export enum MacroRunStatus {
  Idle = 0,
  Running = 1,
  UserWait = 2
}

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
export interface FairlightAudioState_ProgramOutState {
  gain: number
  followFadeToBlack: boolean
  audioFollowVideoCrossfadeTransitionEnabled: boolean
  dynamics: FairlightAudioState_DynamicsState
  equalizer: FairlightAudioState_EqualizerState
  levels: FairlightAudioState_LevelsState
}

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
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

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
export interface FairlightAudioState_MonitorOutputState {
  gain: number
  inputMasterGain: number
  inputTalkbackGain: number
  inputSidetoneGain: number
}

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
export interface FairlightAudioState_InputState {
  inputType: FairlightInputType
  supportedConfigurations: FairlightInputConfiguration
  externalPortType: ExternalPortType
  activeConfiguration: FairlightInputConfiguration
  analog: FairlightAudioState_AnalogState
  sources: FairlightAudioState_InputSourceState[]
}

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
export interface FairlightAudioState_AnalogState {
  supportedInputLevel: FairlightAnalogInputLevel
  inputLevel: FairlightAnalogInputLevel
}

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
export interface FairlightAudioState_InputSourceState {
  sourceId: number
  sourceType: FairlightAudioSourceType
  gain: number
  balance: number
  faderGain: number
  supportedMixOptions: FairlightAudioMixOption
  mixOption: FairlightAudioMixOption
  maxFramesDelay: number
  framesDelay: number
  hasStereoSimulation: boolean
  stereoSimulation: number
  dynamics: FairlightAudioState_DynamicsState
  equalizer: FairlightAudioState_EqualizerState
  levels: FairlightAudioState_LevelsState
}

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
export interface FairlightAudioState_DynamicsState {
  makeUpGain: number
  limiter: FairlightAudioState_LimiterState
  compressor: FairlightAudioState_CompressorState
  expander: FairlightAudioState_ExpanderState
}

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
export interface FairlightAudioState_LimiterState {
  limiterEnabled: boolean
  threshold: number
  attack: number
  hold: number
  release: number
}

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
export interface FairlightAudioState_CompressorState {
  compressorEnabled: boolean
  threshold: number
  ratio: number
  attack: number
  hold: number
  release: number
}

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
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

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
export interface FairlightAudioState_EqualizerState {
  enabled: boolean
  gain: number
  bands: FairlightAudioState_EqualizerBandState[]
}

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
export interface FairlightAudioState_EqualizerBandState {
  bandEnabled: boolean
  supportedShapes: FairlightEqualizerBandShape
  shape: FairlightEqualizerBandShape
  supportedFrequencyRanges: FairlightEqualizerFrequencyRange
  frequencyRange: FairlightEqualizerFrequencyRange
  frequency: number
  gain: number
  qFactor: number
}

// ../LibAtem/LibAtem.State/FairlightAudioState.cs
export interface FairlightAudioState {
  programOut: FairlightAudioState_ProgramOutState
  inputs: Record<number, FairlightAudioState_InputState>
  monitors: FairlightAudioState_MonitorOutputState[]
  // tally: Record<[AudioSource, number], boolean>;
}

// ../LibAtem/LibAtem.State/MediaPoolState.cs
export interface MediaPoolState_StillState {
  isUsed: boolean
  hash: number[]
  filename: string
}

// ../LibAtem/LibAtem.State/MediaPoolState.cs
export interface MediaPoolState_FrameState {
  isUsed: boolean
  filename: number[]
}

// ../LibAtem/LibAtem.State/MediaPoolState.cs
export interface MediaPoolState_ClipState {
  isUsed: boolean
  name: string
  maxFrames: number
  frames: MediaPoolState_FrameState[]
}

// ../LibAtem/LibAtem.State/MediaPoolState.cs
export interface MediaPoolState {
  stills: MediaPoolState_StillState[]
  clips: MediaPoolState_ClipState[]
}

// ../LibAtem/LibAtem.State/MediaPlayerState.cs
export interface MediaPlayerState_ClipStatusState {
  playing: boolean
  loop: boolean
  atBeginning: boolean
  clipFrame: number
}

// ../LibAtem/LibAtem.State/MediaPlayerState.cs
export interface MediaPlayerState_SourceState {
  sourceType: MediaPlayerSource
  sourceIndex: number
}

// ../LibAtem/LibAtem.State/MediaPlayerState.cs
export interface MediaPlayerState {
  source: MediaPlayerState_SourceState
  clipStatus: MediaPlayerState_ClipStatusState
}

// ../LibAtem/LibAtem.State/AtemState.cs
export interface AtemState {
  auxiliaries: AuxState[]
  colorGenerators: ColorState[]
  downstreamKeyers: DownstreamKeyerState[]
  mediaPlayers: MediaPlayerState[]
  mixEffects: MixEffectState[]
  superSources: SuperSourceState[]
  audio: AudioState
  fairlight: FairlightAudioState
  macros: MacroState
  mediaPool: MediaPoolState
  settings: SettingsState
  info: InfoState
  power: boolean[]
}

// ../LibAtem/LibAtem/Common/StingerSource.cs
export enum StingerSource {
  None = 0,
  MediaPlayer1 = 1,
  MediaPlayer2 = 2,
  MediaPlayer3 = 3,
  MediaPlayer4 = 4
}

// ../LibAtem/LibAtem/Common/PortType.cs
export interface MacroPortTypeExtensions {}

// ../LibAtem/LibAtem/Common/PortType.cs
export interface ExternalPortTypeFlagsExtensions {}

// ../LibAtem/LibAtem/Common/PortType.cs
export enum ExternalPortType {
  Internal = 0,
  SDI = 1,
  HDMI = 2,
  Composite = 3,
  Component = 4,
  SVideo = 5,
  XLR = 32,
  AESEBU = 64,
  RCA = 128,
  TSJack = 512,
  MADI = 1024,
  TRS = 2048
}

// ../LibAtem/LibAtem/Common/PortType.cs
export enum ExternalPortTypeFlags {
  Unknown = 0,
  SDI = 1,
  HDMI = 2,
  Component = 4,
  Composite = 8,
  SVideo = 16,
  Internal = 32,
  XLR = 64,
  AESEBU = 128,
  RCA = 256,
  TSJack = 512
}

// ../LibAtem/LibAtem/Common/PortType.cs
export enum InternalPortType {
  External = 0,
  Black = 1,
  ColorBars = 2,
  ColorGenerator = 3,
  MediaPlayerFill = 4,
  MediaPlayerKey = 5,
  SuperSource = 6,
  MEOutput = 128,
  Auxiliary = 129,
  Mask = 130
}

// ../LibAtem/LibAtem/Common/PortType.cs
export enum AudioPortType {
  Unknown = 0,
  SDI = 1,
  HDMI = 2,
  XLR = 32,
  AESEBU = 64,
  RCA = 128,
  Internal = 256,
  Headset = 512
}

// ../LibAtem/LibAtem/Common/PortType.cs
export enum MacroPortType {
  SDI = 0,
  HDMI = 1,
  Component = 2
}

// ../LibAtem/LibAtem/Common/DownConvertMode.cs
export enum DownConvertMode {
  CentreCut = 0,
  Letterbox = 1,
  Anamorphic = 2
}

// ../LibAtem/LibAtem/Common/TransitionLayer.cs
export interface KeyIndexAttribute extends Object {
  index: UpstreamKeyId
}

// ../LibAtem/LibAtem/Common/TransitionLayer.cs
export interface TransitionLayerExtensions {}

// ../LibAtem/LibAtem/Common/TransitionLayer.cs
export enum TransitionLayer {
  Background = 1 << 0,
  Key1 = 1 << 1,
  Key2 = 1 << 2,
  Key3 = 1 << 3,
  Key4 = 1 << 4
}

// ../LibAtem/LibAtem/Common/SDI3GOutputLevel.cs
export enum SDI3GOutputLevel {
  LevelA = 1,
  LevelB = 0
}

// ../LibAtem/LibAtem/Common/TStyle.cs
export enum TransitionStyle {
  Mix = 0,
  Dip = 1,
  Wipe = 2,
  DVE = 3,
  Stinger = 4
}

// ../LibAtem/LibAtem/Common/MixEffectKeyType.cs
export enum MixEffectKeyType {
  Luma = 0,
  Chroma = 1,
  Pattern = 2,
  DVE = 3
}

// ../LibAtem/LibAtem/Common/SourceAvailability.cs
export enum SourceAvailability {
  None = 0,
  Auxiliary = 1 << 0,
  Multiviewer = 1 << 1,
  SuperSourceArt = 1 << 2,
  SuperSourceBox = 1 << 3,
  KeySource = 1 << 4,
  All = Auxiliary | Multiviewer | SuperSourceArt | SuperSourceBox | KeySource
}

// ../LibAtem/LibAtem/Common/VideoSource.cs
export interface VideoSourceLists {}

// ../LibAtem/LibAtem/Common/VideoSource.cs
export interface VideoSourceTypeAttribute extends Object {
  portType: InternalPortType
  me1Index: number
  me2Index: number
}

// ../LibAtem/LibAtem/Common/VideoSource.cs
export interface VideoSourceDefaultsAttribute extends Object {
  longName: string
  shortName: string
}

// ../LibAtem/LibAtem/Common/VideoSource.cs
export interface VideoSourceAvailabilityAttribute extends Object {
  sourceAvailability: SourceAvailability
  meAvailability: MeAvailability
}

// ../LibAtem/LibAtem/Common/VideoSource.cs
export interface VideoSourceAvailabilityExtensions {}

// ../LibAtem/LibAtem/Common/VideoSource.cs
export interface VideoSourceExtensions {}

// ../LibAtem/LibAtem/Common/VideoSource.cs
export enum VideoSource {
  Black = 0,
  Input1 = 1,
  Input2 = 2,
  Input3 = 3,
  Input4 = 4,
  Input5 = 5,
  Input6 = 6,
  Input7 = 7,
  Input8 = 8,
  Input9 = 9,
  Input10 = 10,
  Input11 = 11,
  Input12 = 12,
  Input13 = 13,
  Input14 = 14,
  Input15 = 15,
  Input16 = 16,
  Input17 = 17,
  Input18 = 18,
  Input19 = 19,
  Input20 = 20,
  Input21 = 21,
  Input22 = 22,
  Input23 = 23,
  Input24 = 24,
  Input25 = 25,
  Input26 = 26,
  Input27 = 27,
  Input28 = 28,
  Input29 = 29,
  Input30 = 30,
  Input31 = 31,
  Input32 = 32,
  Input33 = 33,
  Input34 = 34,
  Input35 = 35,
  Input36 = 36,
  Input37 = 37,
  Input38 = 38,
  Input39 = 39,
  Input40 = 40,
  ColorBars = 1000,
  Color1 = 2001,
  Color2 = 2002,
  MediaPlayer1 = 3010,
  MediaPlayer1Key = 3011,
  MediaPlayer2 = 3020,
  MediaPlayer2Key = 3021,
  MediaPlayer3 = 3030,
  MediaPlayer3Key = 3031,
  MediaPlayer4 = 3040,
  MediaPlayer4Key = 3041,
  Key1Mask = 4010,
  Key2Mask = 4020,
  Key3Mask = 4030,
  Key4Mask = 4040,
  DSK1Mask = 5010,
  DSK2Mask = 5020,
  SuperSource = 6000,
  SuperSource2 = 6001,
  CleanFeed1 = 7001,
  CleanFeed2 = 7002,
  CleanFeed3 = 7003,
  CleanFeed4 = 7004,
  Auxilary1 = 8001,
  Auxilary2 = 8002,
  Auxilary3 = 8003,
  Auxilary4 = 8004,
  Auxilary5 = 8005,
  Auxilary6 = 8006,
  Auxilary7 = 8007,
  Auxilary8 = 8008,
  Auxilary9 = 8009,
  Auxilary10 = 8010,
  Auxilary11 = 8011,
  Auxilary12 = 8012,
  Auxilary13 = 8013,
  Auxilary14 = 8014,
  Auxilary15 = 8015,
  Auxilary16 = 8016,
  Auxilary17 = 8017,
  Auxilary18 = 8018,
  Auxilary19 = 8019,
  Auxilary20 = 8020,
  Auxilary21 = 8021,
  Auxilary22 = 8022,
  Auxilary23 = 8023,
  Auxilary24 = 8024,
  ME1Prog = 10010,
  ME1Prev = 10011,
  ME2Prog = 10020,
  ME2Prev = 10021,
  ME3Prog = 10030,
  ME3Prev = 10031,
  ME4Prog = 10040,
  ME4Prev = 10041,
  Input1Direct = 11001
}

// ../LibAtem/LibAtem/Common/VideoMode.cs
export interface VideoModeRateAttribute extends Object {
  rate: number
}

// ../LibAtem/LibAtem/Common/VideoMode.cs
export interface VideoModeStandardAttribute extends Object {
  standard: VideoModeStandard
}

// ../LibAtem/LibAtem/Common/VideoMode.cs
export interface VideoModeMultiviewerModeAttribute extends Object {
  mode: VideoMode
  modeNon3G: VideoMode
}

// ../LibAtem/LibAtem/Common/VideoMode.cs
export interface VideoModeResolutionAttribute extends Object {
  resolution: VideoModeResolution
}

// ../LibAtem/LibAtem/Common/VideoMode.cs
export interface SizeAttribute extends Object {
  width: number
  height: number
  size: [number, number]
}

// ../LibAtem/LibAtem/Common/VideoMode.cs
export interface VideoModeExtensions {}

// ../LibAtem/LibAtem/Common/VideoMode.cs
export enum VideoModeStandard {
  SDISD = 0,
  SDIHD = 1,
  SDIHDProgressive = 2,
  HDMI = 3,
  SDI3G = 4,
  SDI6G = 5,
  SDI12G = 6,
  SDI24G = 7
}

// ../LibAtem/LibAtem/Common/VideoMode.cs
export enum VideoModeResolution {
  NTSC = 0,
  PAL = 1,
  _720 = 2,
  _1080 = 3,
  _4K = 4,
  _8K = 5
}

// ../LibAtem/LibAtem/Common/VideoMode.cs
export enum VideoMode {
  N525i5994NTSC = 0,
  P625i50PAL = 1,
  N525i5994169 = 2,
  P625i50169 = 3,
  P720p50 = 4,
  N720p5994 = 5,
  P1080i50 = 6,
  N1080i5994 = 7,
  N1080p2398 = 8,
  N1080p24 = 9,
  P1080p25 = 10,
  N1080p2997 = 11,
  P1080p50 = 12,
  N1080p5994 = 13,
  N4KHDp2398 = 14,
  N4KHDp24 = 15,
  P4KHDp25 = 16,
  N4KHDp2997 = 17,
  P4KHDp5000 = 18,
  N4KHDp5994 = 19,
  N8KHDp2398 = 20,
  N8KHDp24 = 21,
  P8KHDp25 = 22,
  N8KHDp2997 = 23,
  P8KHDp50 = 24,
  N8KHDp5994 = 25,
  N1080p30 = 26,
  N1080p60 = 27
}

// ../LibAtem/LibAtem/Common/SerialMode.cs
export enum SerialMode {
  None = 0,
  PtzVisca = 1,
  Gvg100 = 2
}

// ../LibAtem/LibAtem/Common/XmlAsStringAttribute.cs
export interface XmlAsStringAttribute extends Object {}

// ../LibAtem/LibAtem/Common/Pattern.cs
export enum Pattern {
  LeftToRightBar = 0,
  TopToBottomBar = 1,
  HorizontalBarnDoor = 2,
  VerticalBarnDoor = 3,
  CornersInFourBox = 4,
  RectangleIris = 5,
  DiamondIris = 6,
  CircleIris = 7,
  TopLeftBox = 8,
  TopRightBox = 9,
  BottomRightBox = 10,
  BottomLeftBox = 11,
  TopCentreBox = 12,
  RightCentreBox = 13,
  BottomCentreBox = 14,
  LeftCentreBox = 15,
  TopLeftDiagonal = 16,
  TopRightDiagonal = 17
}

// ../LibAtem/LibAtem/Common/Pattern.cs
export enum BorderBevel {
  None = 0,
  InOut = 1,
  In = 2,
  Out = 3
}

// ../LibAtem/LibAtem/Common/AudioSource.cs
export interface AudioSourceTypeAttribute extends Object {
  type: AudioSourceType
}

// ../LibAtem/LibAtem/Common/AudioSource.cs
export interface AudioPortTypeAttribute extends Object {
  type: ExternalPortType
}

// ../LibAtem/LibAtem/Common/AudioSource.cs
export interface AudioSourceExtensions {}

// ../LibAtem/LibAtem/Common/AudioSource.cs
export enum AudioSource {
  Input1 = 1,
  Input2 = 2,
  Input3 = 3,
  Input4 = 4,
  Input5 = 5,
  Input6 = 6,
  Input7 = 7,
  Input8 = 8,
  Input9 = 9,
  Input10 = 10,
  Input11 = 11,
  Input12 = 12,
  Input13 = 13,
  Input14 = 14,
  Input15 = 15,
  Input16 = 16,
  Input17 = 17,
  Input18 = 18,
  Input19 = 19,
  Input20 = 20,
  XLR = 1001,
  AESEBU = 1101,
  RCA = 1201,
  Mic1 = 1301,
  Mic2 = 1302,
  MP1 = 2001,
  MP2 = 2002,
  MP3 = 2003,
  MP4 = 2004
}

// ../LibAtem/LibAtem/Common/AudioSource.cs
export enum AudioSourceType {
  ExternalVideo = 0,
  MediaPlayer = 1,
  ExternalAudio = 2
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum ModelId {
  Unknown = 0,
  TVStudio = 1,
  OneME = 2,
  TwoME = 3,
  PS4K = 4,
  OneME4K = 5,
  TwoMe4K = 6,
  TwoMEBS4K = 7,
  TVStudioHD = 8,
  Constellation8K = 11
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum MixEffectBlockId {
  One = 0,
  Two = 1,
  Three = 2,
  Four = 3
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum MediaPlayerId {
  One = 0,
  Two = 1,
  Three = 2,
  Four = 3
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum DownstreamKeyId {
  One = 0,
  Two = 1,
  Three = 2,
  Four = 3
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum UpstreamKeyId {
  One = 0,
  Two = 1,
  Three = 2,
  Four = 3
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum SuperSourceId {
  One = 0,
  Two = 1
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum SuperSourceBoxId {
  One = 0,
  Two = 1,
  Three = 2,
  Four = 3
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum AuxiliaryId {
  One = 0,
  Two = 1,
  Three = 2,
  Four = 3,
  Five = 4,
  Six = 5
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum ColorGeneratorId {
  One = 0,
  Two = 1
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum FlyKeyKeyFrameId {
  One = 1,
  Two = 2
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum FlyKeyKeyFrameType {
  A = 1,
  B = 2,
  Full = 3,
  RunToInfinite = 4
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum FlyKeyLocation {
  CentreOfKey = 0,
  TopLeft = 1,
  TopCentre = 2,
  TopRight = 3,
  MiddleLeft = 4,
  MiddleCentre = 5,
  MiddleRight = 6,
  BottomLeft = 7,
  BottomCentre = 8,
  BottomRight = 9
}

// ../LibAtem/LibAtem/Common/Id.cs
export enum TalkbackChannel {
  Production = 0,
  Engineering = 1
}

// ../LibAtem/LibAtem/Common/SuperSourceArtOption.cs
export enum SuperSourceArtOption {
  Background = 0,
  Foreground = 1
}

// ../LibAtem/LibAtem/Common/MeAvailability.cs
export interface MeAvailabilityExtensions {}

// ../LibAtem/LibAtem/Common/MeAvailability.cs
export enum MeAvailability {
  None = 0,
  Me1 = 1,
  Me2 = 2,
  Me3 = 3,
  Me4 = 4,
  All = Me1 | Me2 | Me3 | Me4
}

// ../LibAtem/LibAtem/Common/DVEEffect.cs
export enum DVEEffect {
  SwooshTopLeft = 0,
  SwooshTop = 1,
  SwooshTopRight = 2,
  SwooshLeft = 3,
  SwooshRight = 4,
  SwooshBottomLeft = 5,
  SwooshBottom = 6,
  SwooshBottomRight = 7,
  SpinCCWTopRight = 13,
  SpinCWTopLeft = 8,
  SpinCCWBottomRight = 15,
  SpinCWBottomLeft = 10,
  SpinCWTopRight = 9,
  SpinCCWTopLeft = 12,
  SpinCWBottomRight = 11,
  SpinCCWBottomLeft = 14,
  SqueezeTopLeft = 16,
  SqueezeTop = 17,
  SqueezeTopRight = 18,
  SqueezeLeft = 19,
  SqueezeRight = 20,
  SqueezeBottomLeft = 21,
  SqueezeBottom = 22,
  SqueezeBottomRight = 23,
  PushTopLeft = 24,
  PushTop = 25,
  PushTopRight = 26,
  PushLeft = 27,
  PushRight = 28,
  PushBottomLeft = 29,
  PushBottom = 30,
  PushBottomRight = 31,
  GraphicCWSpin = 32,
  GraphicCCWSpin = 33,
  GraphicLogoWipe = 34
}

// ../LibAtem/LibAtem/Common/MultiViewLayout.cs
export enum MultiViewLayout {
  ProgramTop = 0,
  ProgramBottom = 1,
  ProgramLeft = 2,
  ProgramRight = 3
}

// ../LibAtem/LibAtem/Common/MultiViewLayout.cs
export enum MultiViewLayoutV8 {
  Default = 0,
  TopLeftSmall = 1,
  TopRightSmall = 2,
  ProgramBottom = TopLeftSmall | TopRightSmall,
  BottomLeftSmall = 4,
  ProgramRight = TopLeftSmall | BottomLeftSmall,
  BottomRightSmall = 8,
  ProgramLeft = TopRightSmall | BottomRightSmall,
  ProgramTop = BottomLeftSmall | BottomRightSmall
}

// ../LibAtem/LibAtem/Common/MacroOperationType.cs
export enum MacroOperationType {
  LoopMacro = 0,
  ProgramInput = 0x0002,
  PreviewInput = 0x0003,
  CutTransition = 0x0004,
  AutoTransition = 0x0005,
  MacroUserWait = 5,
  MacroSleep = 0x0007,
  RunMacro = 7,
  UserResumeMacro = 8,
  StartRecordMacro = 9,
  StopRecordMacro = 10,
  VideoMode = 0x000c,
  CameraControlVoidBool = 12,
  CameraControlByte = 13,
  CameraControl16Bit = 14,
  CameraControl32Bit = 15,
  CameraControl64Bit = 16,
  CameraControlFixedPoint16Bit = 17,
  StopMacro = 18,
  TransitionWipeSymmetry = 0x0014,
  TransitionWipeXPosition = 0x0015,
  TransitionWipeYPosition = 0x0016,
  TransitionWipeSymmetryOffset = 22,
  TransitionWipeXPositionOffset = 23,
  TransitionWipeYPositionOffset = 24,
  DownConvertMode = 0x001a,
  InputVideoPort = 0x001b,
  ColorGeneratorHue = 0x001c,
  ColorGeneratorSaturation = 0x001d,
  ColorGeneratorLuminescence = 0x001e,
  AuxiliaryInput = 0x001f,
  MultiViewWindowInput = 0x0020,
  MultiViewLayout = 0x0021,
  DeleteMacro = 33,
  MacroLabel = 34,
  MacroNote = 35,
  KeyCutInput = 0x0025,
  KeyFillInput = 0x0026,
  KeyOnAir = 0x0027,
  KeyType = 0x0028,
  LumaKeyClip = 0x0029,
  LumaKeyGain = 0x002a,
  KeyFlyEnable = 42,
  LumaKeyInvert = 0x002c,
  LumaKeyPreMultiply = 0x002d,
  PatternKeyInvert = 45,
  KeyMaskEnable = 0x002f,
  KeyMaskTop = 0x0030,
  KeyMaskBottom = 0x0031,
  KeyMaskLeft = 0x0032,
  KeyMaskRight = 0x0033,
  TransitionDVEPattern = 0x0034,
  DVEKeyMaskEnable = 0x0035,
  DVEKeyMaskTop = 0x0036,
  DVEKeyMaskBottom = 0x0037,
  DVEKeyMaskLeft = 0x0038,
  DVEKeyMaskRight = 0x0039,
  TransitionDVERate = 0x003a,
  ChromaKeyClip = 0x003b,
  ChromaKeyGain = 0x003c,
  ChromaKeyHue = 0x003d,
  ChromaKeyLift = 0x003e,
  ChromaKeyNarrow = 0x003f,
  PatternKeyPattern = 0x0040,
  PatternKeySize = 0x0041,
  PatternKeySoftness = 0x0042,
  PatternKeyXPosition = 0x0043,
  PatternKeyYPosition = 0x0044,
  PatternKeySymmetry = 0x0045,
  DVEAndFlyKeyRate = 0x0046,
  DVEAndFlyKeyXSize = 0x0047,
  DVEAndFlyKeyYSize = 0x0048,
  MediaPlayerSourceClip = 0x0049,
  DVEAndFlyKeyXPosition = 0x004a,
  DVEAndFlyKeyYPosition = 0x004b,
  DVEKeyShadowEnable = 0x004d,
  DVEKeyBorderEnable = 0x004e,
  DVEAndFlyKeyRotation = 0x004f,
  FlyKeySetKeyFrame = 0x0050,
  FlyKeyResetKeyFrame = 79,
  FlyKeyRunToFull = 0x0052,
  FlyKeyRunToFullWithRate = 81,
  FlyKeyRunToKeyFrame = 0x0054,
  FlyKeyRunToKeyFrameWithRate = 83,
  FlyKeyRunToInfinity = 0x0056,
  DVEKeyShadowDirection = 0x0058,
  DVEKeyShadowAltitude = 0x0059,
  DVEKeyBorderHue = 0x005a,
  DVEKeyBorderSaturation = 0x005b,
  DVEKeyBorderLuminescence = 0x005c,
  DVEKeyBorderBevel = 0x005d,
  DVEKeyBorderOuterWidth = 0x005e,
  DVEKeyBorderInnerWidth = 0x005f,
  DVEKeyBorderOuterSoftness = 0x0060,
  DVEKeyBorderInnerSoftness = 0x0061,
  DVEKeyBorderOpacity = 0x0062,
  DVEKeyBorderBevelPosition = 0x0063,
  DVEKeyBorderBevelSoftness = 0x0064,
  FlyKeyFrameXSize = 98,
  FlyKeyFrameYSize = 99,
  FlyKeyFrameXPosition = 100,
  FlyKeyFrameYPosition = 101,
  FlyKeyFrameRotation = 102,
  FlyKeyFrameShadowDirection = 103,
  FlyKeyFrameShadowAltitude = 104,
  FlyKeyFrameBorderHue = 105,
  FlyKeyFrameBorderSaturation = 106,
  FlyKeyFrameBorderLuminescence = 107,
  FlyKeyFrameBorderOuterWidth = 108,
  FlyKeyFrameBorderInnerWidth = 109,
  FlyKeyFrameBorderOuterSoftness = 110,
  FlyKeyFrameBorderInnerSoftness = 111,
  FlyKeyFrameBorderOpacity = 112,
  FlyKeyFrameBorderBevelPosition = 113,
  FlyKeyFrameBorderBevelSoftness = 114,
  FlyKeyFrameMaskTop = 115,
  FlyKeyFrameMaskBottom = 116,
  FlyKeyFrameMaskLeft = 117,
  FlyKeyFrameMaskRight = 118,
  TransitionWipeRate = 0x007c,
  TransitionWipePattern = 0x007d,
  TransitionWipeBorderWidth = 0x007e,
  TransitionWipeBorderSoftness = 0x007f,
  TransitionWipeBorderFillInput = 0x0080,
  TransitionWipeAndDVEReverse = 0x0081,
  TransitionWipeAndDVEFlipFlop = 0x0082,
  TransitionStyle = 0x0083,
  TransitionSource = 0x0084,
  TransitionPosition = 0x0085,
  TransitionPreview = 0x0086,
  TransitionMixRate = 0x0087,
  TransitionDipRate = 0x0088,
  TransitionDipInput = 0x0089,
  TransitionStingerRate = 0x008a,
  TransitionStingerSourceNone = 134,
  TransitionStingerSourceMediaPlayer = 0x008c,
  TransitionStingerClipDuration = 0x008d,
  TransitionStingerTriggerPoint = 0x008e,
  TransitionStingerMixRate = 0x008f,
  TransitionStingerPreRoll = 0x0090,
  TransitionStingerResetDurations = 0x0091,
  TransitionStingerDVEClip = 0x0092,
  TransitionStingerDVEGain = 0x0093,
  TransitionStingerDVEInvert = 0x0094,
  TransitionStingerDVEPreMultiply = 0x0095,
  DownstreamKeyFillInput = 0x0096,
  DownstreamKeyCutInput = 0x0097,
  DownstreamKeyRate = 0x0098,
  DownstreamKeyAuto = 0x0099,
  DownstreamKeyOnAir = 0x009a,
  DownstreamKeyTie = 0x009b,
  DownstreamKeyClip = 0x009c,
  DownstreamKeyGain = 0x009d,
  DownstreamKeyMaskEnable = 0x009e,
  DownstreamKeyMaskTop = 0x009f,
  DownstreamKeyMaskBottom = 0x00a0,
  DownstreamKeyMaskLeft = 0x00a1,
  DownstreamKeyMaskRight = 0x00a2,
  DownstreamKeyInvert = 0x00a3,
  DownstreamKeyPreMultiply = 0x00a4,
  FadeToBlackRate = 0x00a5,
  FadeToBlackCut = 161,
  FadeToBlackAuto = 0x00a7,
  SuperSourceArtCutInput = 0x00a8,
  SuperSourceArtFillInput = 0x00a9,
  SuperSourceArtAbove = 0x00aa,
  SuperSourceArtPreMultiply = 0x00ab,
  SuperSourceArtClip = 0x00ac,
  SuperSourceArtGain = 0x00ad,
  SuperSourceArtInvert = 0x00ae,
  SuperSourceBorderEnable = 0x00af,
  SuperSourceBorderHue = 0x00b0,
  SuperSourceBorderSaturation = 0x00b1,
  SuperSourceBorderLuminescence = 0x00b2,
  SuperSourceBorderBevel = 0x00b3,
  SuperSourceBorderOuterWidth = 0x00b4,
  SuperSourceBorderInnerWidth = 0x00b5,
  SuperSourceBorderOuterSoftness = 0x00b6,
  SuperSourceBorderInnerSoftness = 0x00b7,
  SuperSourceBorderBevelPosition = 0x00b8,
  SuperSourceBorderBevelSoftness = 0x00b9,
  SuperSourceShadowDirection = 0x00ba,
  SuperSourceShadowAltitude = 0x00bb,
  SuperSourceBoxEnable = 0x00bc,
  SuperSourceBoxInput = 0x00bd,
  SuperSourceBoxXPosition = 0x00be,
  SuperSourceBoxYPosition = 0x00bf,
  SuperSourceBoxSize = 0x00c0,
  SuperSourceBoxMaskEnable = 0x00c1,
  SuperSourceBoxMaskTop = 0x00c2,
  SuperSourceBoxMaskBottom = 0x00c3,
  SuperSourceBoxMaskLeft = 0x00c4,
  SuperSourceBoxMaskRight = 0x00c5,
  AudioMixerInputMixType = 0x00c6,
  AudioMixerInputGain = 0x00c7,
  AudioMixerInputBalance = 0x00c8,
  AudioMixerMasterOutGain = 0x00c9,
  AudioMixerMasterOutBalance = 197,
  AudioMixerMasterOutFollowFadeToBlackMixEffectBlock1 = 0x00cb,
  AudioMixerMonitorOut = 0x00cc,
  AudioMixerMonitorOutGain = 0x00cd,
  AudioMixerMonitorOutMute = 0x00ce,
  AudioMixerMonitorOutSolo = 0x00cf,
  AudioMixerMonitorOutSoloInput = 0x00d0,
  AudioMixerMonitorOutDim = 0x00d1,
  AudioMixerMonitorOutDimLevel = 205,
  AudioMixerInputResetPeaks = 0x00d3,
  AudioMixerInputResetAllPeaks = 207,
  AudioMixerMasterOutResetPeaks = 0x00d5,
  AudioMixerMonitorOutResetPeaks = 209,
  TransitionDVEFillInput = 0x00d7,
  TransitionDVECutInput = 0x00d8,
  TransitionDVECutInputEnable = 0x00d9,
  MediaPlayerSourceStillIndex = 0x00da,
  MediaPlayerSourceClipIndex = 0x00db,
  MediaPlayerGoToBeginning = 0x00dc,
  MediaPlayerGoToFrame = 0x00dd,
  MediaPlayerPlay = 0x00de,
  MediaPlayerPause = 0x00df,
  MediaPlayerLoop = 0x00e0,
  MediaPlayerSourceStill = 0x00e1,
  PatternKeySizeOffset = 221,
  PatternKeyXPositionOffset = 222,
  PatternKeyYPositionOffset = 223,
  DVEAndFlyKeyXSizeOffset = 224,
  DVEAndFlyKeyYSizeOffset = 225,
  DVEAndFlyKeyXPositionOffset = 226,
  DVEAndFlyKeyYPositionOffset = 227,
  SuperSourceBoxXPositionOffset = 228,
  SuperSourceBoxYPositionOffset = 229,
  SuperSourceBoxSizeOffset = 230,
  MediaPlayerPlayFromBeginning = 231,
  PtzRs422ViscaSetPanVelocity = 232,
  PtzRs422ViscaSetTiltVelocity = 233,
  PtzRs422ViscaSetZoomVelocity = 234,
  PtzRs422ViscaUpdatePanTiltPosition = 235,
  PtzRs422ViscaUpdateZoomPosition = 236,
  PtzRs422ViscaGotoPanTiltPosition = 237,
  PtzRs422ViscaGotoZoomPosition = 238,
  PtzRs422ViscaAllocateAddresses = 239,
  PtzRs422ViscaBaudRate = 240,
  GvgReadCrosspointPrgmBkgd = 241,
  GvgReadCrosspointPresetBkgd = 242,
  GvgReadCrosspointKey = 243,
  GvgReadWipePattern = 244,
  GvgReadTransitionMode = 245,
  GvgReadTransitionRateAutoTrans = 246,
  GvgReadTransitionRateDskMix = 247,
  GvgReadTransitionRateFadeToBlack = 248,
  GvgReadLampStatusMap = 249,
  GvgReadAnalogControl = 250,
  GvgReadPushButtonLampControl = 251,
  GvgReadFieldMode = 252,
  GvgReadSoftwareVersion = 253,
  SetSerialPortFunction = 0x0103,
  ToggleTransitionWipeAndDVEReverse = 255,
  ToggleKeyMaskEnable = 256,
  ToggleKeyOnAir = 257,
  ToggleLumaKeyInvert = 258,
  ToggleDVEKeyBorderEnable = 259,
  ToggleDVEKeyShadowEnable = 260,
  ToggleDownstreamKeyOnAir = 261,
  ToggleDownstreamKeyTie = 262,
  ToggleDownstreamKeyInvert = 263,
  ToggleDownstreamKeyMaskEnable = 264,
  ToggleTransitionSource = 265,
  AudioMixerTalkbackMuteSDI = 266,
  HyperDeckSetIPv4Address = 267,
  HyperDeckSetSourceClipIndex = 268,
  HyperDeckGoToPositionDelta = 269,
  HyperDeckUpdatePosition = 270,
  HyperDeckGoToPosition = 271,
  HyperDeckSetLoop = 272,
  HyperDeckSetSpeed = 273,
  HyperDeckPlay = 274,
  HyperDeckStop = 275,
  HyperDeckRecord = 276,
  HyperDeckSetInput = 277,
  HyperDeckSetSingleClip = 278,
  HyperDeckSetSourceSlotIndex = 279,
  HyperDeckSetRollOnTake = 280,
  HyperDeckSetRollOnTakeFrameDelay = 281,
  MultiViewVuMeterEnable = 282,
  MultiViewVuMeterOpacity = 283,
  MultiViewSafeAreaEnable = 284,
  MultiViewPgmPvwSwap = 285,
  AudioMixerHeadphoneOutGain = 286,
  AudioMixerHeadphoneOutMasterGain = 287,
  AudioMixerHeadphoneOutTalkbackGain = 288,
  AudioMixerHeadphoneOutSidetoneGain = 289,
  AudioMixerInputTalkbackMuteSDI = 290,
  MixMinusSetAudioMode = 291,
  AudioMixerAfvFollowTransition = 0x012b,
  SuperSourceV2ArtCutInput = 0x018c,
  SuperSourceV2ArtFillInput = 0x018d,
  SuperSourceV2ArtAbove = 0x018e,
  SuperSourceV2ArtPreMultiply = 0x018f,
  SuperSourceV2ArtClip = 0x0190,
  SuperSourceV2ArtGain = 0x0191,
  SuperSourceV2ArtInvert = 0x0192,
  SuperSourceV2BorderEnable = 0x0193,
  SuperSourceV2BorderHue = 0x0194,
  SuperSourceV2BorderSaturation = 0x0195,
  SuperSourceV2BorderLuminescence = 0x0196,
  SuperSourceV2BorderBevel = 0x0197,
  SuperSourceV2BorderOuterWidth = 0x0198,
  SuperSourceV2BorderInnerWidth = 0x0199,
  SuperSourceV2BorderOuterSoftness = 0x019a,
  SuperSourceV2BorderInnerSoftness = 0x019b,
  SuperSourceV2BorderBevelPosition = 0x019c,
  SuperSourceV2BorderBevelSoftness = 0x019d,
  SuperSourceV2ShadowDirection = 0x019e,
  SuperSourceV2ShadowAltitude = 0x019f,
  SuperSourceV2BoxEnable = 0x01a0,
  SuperSourceV2BoxInput = 0x01a1,
  SuperSourceV2BoxXPosition = 0x01a2,
  SuperSourceV2BoxYPosition = 0x01a3,
  SuperSourceV2BoxSize = 0x01a4,
  SuperSourceV2BoxMaskEnable = 0x01a5,
  SuperSourceV2BoxMaskTop = 0x01a6,
  SuperSourceV2BoxMaskBottom = 0x01a7,
  SuperSourceV2BoxMaskLeft = 0x01a8,
  SuperSourceV2BoxMaskRight = 0x01a9
}

// ../LibAtem/LibAtem/Common/MixMinusMode.cs
export enum MixMinusMode {
  ProgramOut = 1,
  MixMinus = 1 << 1
}

// ../LibAtem/LibAtem/Common/MediaPlayerSource.cs
export enum MediaPlayerSource {
  Still = 1,
  Clip = 2
}

// ../LibAtem/LibAtem/Common/MediaPlayerSource.cs
export enum MediaPoolFileType {
  Still = 0,
  Clip1 = 1,
  Clip2 = 2
}

// ../LibAtem/LibAtem/Common/AudioMixOption.cs
export enum AudioMixOption {
  Off = 0,
  On = 1,
  AudioFollowVideo = 2
}

// ../LibAtem/LibAtem/Common/AudioMixOption.cs
export enum FairlightAudioMixOption {
  Off = 1,
  On = 2,
  AudioFollowVideo = 4
}

// ../LibAtem/LibAtem/Common/AudioMixOption.cs
export enum FairlightEqualizerBandShape {
  LowShelf = 1 << 0,
  LowPass = 1 << 1,
  BandPass = 1 << 2,
  Notch = 1 << 3,
  HighPass = 1 << 4,
  HighShelf = 1 << 5
}

// ../LibAtem/LibAtem/Common/AudioMixOption.cs
export enum FairlightEqualizerFrequencyRange {
  Low = 1 << 0,
  MidLow = 1 << 1,
  MidHigh = 1 << 2,
  High = 1 << 3
}

// ../LibAtem/LibAtem/Common/AudioMixOption.cs
export enum FairlightInputType {
  EmbeddedWithVideo = 0,
  MediaPlayer = 1,
  AudioIn = 2,
  MADI = 4
}

// ../LibAtem/LibAtem/Common/AudioMixOption.cs
export enum FairlightInputConfiguration {
  Mono = 1 << 0,
  Stereo = 1 << 1,
  DualMono = 1 << 2
}

// ../LibAtem/LibAtem/Common/AudioMixOption.cs
export enum FairlightAudioSourceType {
  Mono = 0,
  Stereo = 1
}

// ../LibAtem/LibAtem/Common/AudioMixOption.cs
export enum FairlightAnalogInputLevel {
  Microphone = 1,
  ConsumerLine = 2,
  ProLine = 4
}

// ../LibAtem/LibAtem.DeviceProfile/DeviceProfile.cs
export interface DeviceProfile {
  model: ModelId
  product: string
  mixEffectBlocks: number
  sources: DevicePort[]
  audioSources: AudioSource[]
  auxiliaries: number
  downstreamKeys: number
  upstreamKeys: number
  routableKeyMasks: boolean
  hyperDecks: number
  stingers: number
  multiView: MultiView
  dve: number
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

// ../LibAtem/LibAtem.DeviceProfile/DeviceProfile.cs
export interface VideoModeSet {
  supportedModes: VideoMode[]
  maxFrames: MaxFramesSet
}

// ../LibAtem/LibAtem.DeviceProfile/DeviceProfile.cs
export interface MaxFramesSet {
  sd: number
  720: number
  1080: number
  '4K': number
}

// ../LibAtem/LibAtem.DeviceProfile/DeviceProfile.cs
export interface DevicePort {
  id: VideoSource
  port: ExternalPortType[]
}

// ../LibAtem/LibAtem.DeviceProfile/DeviceProfile.cs
export interface MultiView {
  count: number
  vuMeters: boolean
  canSwapPreviewProgram: boolean
  supports1080P: boolean
  canRouteInputs: boolean
  canToggleSafeArea: boolean
}
