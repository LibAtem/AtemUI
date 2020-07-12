import * as Enums from './common-enums'
export interface AtemState {
  Auxiliaries: AuxState[]
  ColorGenerators: ColorState[]
  DownstreamKeyers: DownstreamKeyerState[]
  MediaPlayers: MediaPlayerState[]
  MixEffects: MixEffectState[]
  SuperSources: SuperSourceState[]
  Audio: AudioState
  Fairlight: FairlightAudioState
  Macros: MacroState
  MediaPool: MediaPoolState
  Settings: SettingsState
  Info: InfoState
  Power: boolean[]
}

export interface AuxState {
  Source: Enums.VideoSource
}

export interface ColorState {
  Hue: number
  Saturation: number
  Luma: number
}

export interface DownstreamKeyerState {
  Sources: DownstreamKeyerState_SourcesState
  Properties: DownstreamKeyerState_PropertiesState
  State: DownstreamKeyerState_StateState
}

export interface MediaPlayerState {
  Source: MediaPlayerState_SourceState
  ClipStatus: MediaPlayerState_ClipStatusState
}

export interface MixEffectState {
  Keyers: MixEffectState_KeyerState[]
  Transition: MixEffectState_TransitionState
  Sources: MixEffectState_SourcesState
  FadeToBlack: MixEffectState_FadeToBlackState
}

export interface SuperSourceState {
  Boxes: SuperSourceState_BoxState[]
  Properties: SuperSourceState_PropertiesState
  Border: SuperSourceState_BorderState
}

export interface AudioState {
  ProgramOut: AudioState_ProgramOutState
  Inputs: Record<number, AudioState_InputState>
  MonitorOutputs: AudioState_MonitorOutputState[]
  HeadphoneOutputs: AudioState_HeadphoneOutputState[]
  Tally: Record<Enums.AudioSource, boolean>
}

export interface FairlightAudioState {
  ProgramOut: FairlightAudioState_ProgramOutState
  Inputs: Record<number, FairlightAudioState_InputState>
  Monitors: FairlightAudioState_MonitorOutputState[]
  Tally: unknown
}

export interface MacroState {
  Pool: MacroState_ItemState[]
  RecordStatus: MacroState_RecordStatusState
  RunStatus: MacroState_RunStatusState
}

export interface MediaPoolState {
  Stills: MediaPoolState_StillState[]
  Clips: MediaPoolState_ClipState[]
}

export interface SettingsState {
  MultiViewers: MultiViewerState[]
  Inputs: Record<Enums.VideoSource, InputState>
  Hyperdecks: SettingsState_HyperdeckState[]
  Talkback: Record<Enums.TalkbackChannel, SettingsState_TalkbackState>
  MixMinusOutputs: SettingsState_MixMinusOutputState[]
  VideoMode: Enums.VideoMode
  DownConvertMode: Enums.DownConvertMode
  DownConvertVideoMode: Enums.VideoMode
  SerialMode: Enums.SerialMode
  SDI3GLevel: Enums.SDI3GOutputLevel
  SuperSourceCascade: boolean
}

export interface InfoState {
  Version: unknown
  TimecodeLocked: boolean
  LastTimecode: Timecode
  Model: Enums.ModelId
  ProductName: string
  SupportedVideoModes: VideoModeInfo[]
  SupportsAutoVideoMode: boolean
}

export interface DownstreamKeyerState_SourcesState {
  FillSource: Enums.VideoSource
  CutSource: Enums.VideoSource
}

export interface DownstreamKeyerState_PropertiesState {
  Tie: boolean
  Rate: number
  PreMultipliedKey: boolean
  Clip: number
  Gain: number
  Invert: boolean
  MaskEnabled: boolean
  MaskTop: number
  MaskBottom: number
  MaskLeft: number
  MaskRight: number
}

export interface DownstreamKeyerState_StateState {
  OnAir: boolean
  InTransition: boolean
  IsAuto: boolean
  IsTowardsOnAir: boolean
  RemainingFrames: number
}

export interface MediaPlayerState_SourceState {
  SourceType: Enums.MediaPlayerSource
  SourceIndex: number
}

export interface MediaPlayerState_ClipStatusState {
  Playing: boolean
  Loop: boolean
  AtBeginning: boolean
  ClipFrame: number
}

export interface MixEffectState_KeyerState {
  Luma: MixEffectState_KeyerLumaState
  Chroma: MixEffectState_KeyerChromaState
  AdvancedChroma: MixEffectState_KeyerAdvancedChromaState
  Pattern: MixEffectState_KeyerPatternState
  DVE: MixEffectState_KeyerDVEState
  FlyFrames: MixEffectState_KeyerFlyFrameState[]
  OnAir: boolean
  Properties: MixEffectState_KeyerPropertiesState
  FlyProperties: MixEffectState_KeyerFlyProperties
}

export interface MixEffectState_TransitionState {
  Properties: MixEffectState_TransitionPropertiesState
  Position: MixEffectState_TransitionPositionState
  Mix: MixEffectState_TransitionMixState
  Dip: MixEffectState_TransitionDipState
  Wipe: MixEffectState_TransitionWipeState
  Stinger: MixEffectState_TransitionStingerState
  DVE: MixEffectState_TransitionDVEState
}

export interface MixEffectState_SourcesState {
  Program: Enums.VideoSource
  Preview: Enums.VideoSource
}

export interface MixEffectState_FadeToBlackState {
  Status: MixEffectState_FadeToBlackStatusState
  Properties: MixEffectState_FadeToBlackPropertiesState
}

export interface SuperSourceState_BoxState {
  Enabled: boolean
  Source: Enums.VideoSource
  PositionX: number
  PositionY: number
  Size: number
  Cropped: boolean
  CropTop: number
  CropBottom: number
  CropLeft: number
  CropRight: number
}

export interface SuperSourceState_PropertiesState {
  ArtFillSource: Enums.VideoSource
  ArtCutSource: Enums.VideoSource
  ArtOption: Enums.SuperSourceArtOption
  ArtPreMultiplied: boolean
  ArtClip: number
  ArtGain: number
  ArtInvertKey: boolean
}

export interface SuperSourceState_BorderState {
  Enabled: boolean
  Bevel: Enums.BorderBevel
  OuterWidth: number
  InnerWidth: number
  OuterSoftness: number
  InnerSoftness: number
  BevelSoftness: number
  BevelPosition: number
  Hue: number
  Saturation: number
  Luma: number
  LightSourceDirection: number
  LightSourceAltitude: number
}

export interface AudioState_ProgramOutState {
  Gain: number
  Balance: number
  FollowFadeToBlack: boolean
  Levels: AudioState_LevelsState
}

export interface AudioState_InputState {
  IsMixedIn: boolean
  Properties: AudioState_InputState_PropertiesState
  Levels: AudioState_LevelsState
  Analog: AudioState_InputState_AnalogState
}

export interface AudioState_MonitorOutputState {
  Enabled: boolean
  Gain: number
  Mute: boolean
  Solo: boolean
  SoloSource: Enums.AudioSource
  Dim: boolean
  DimLevel: number
}

export interface AudioState_HeadphoneOutputState {
  Gain: number
  ProgramOutGain: number
  SidetoneGain: number
  TalkbackGain: number
}

export interface FairlightAudioState_ProgramOutState {
  Gain: number
  FollowFadeToBlack: boolean
  AudioFollowVideoCrossfadeTransitionEnabled: boolean
  Dynamics: FairlightAudioState_DynamicsState
  Equalizer: FairlightAudioState_EqualizerState
  Levels: FairlightAudioState_LevelsState
}

export interface FairlightAudioState_InputState {
  InputType: Enums.FairlightInputType
  SupportedConfigurations: Enums.FairlightInputConfiguration
  ExternalPortType: Enums.ExternalPortType
  ActiveConfiguration: Enums.FairlightInputConfiguration
  Analog: FairlightAudioState_AnalogState
  Sources: FairlightAudioState_InputSourceState[]
}

export interface FairlightAudioState_MonitorOutputState {
  Gain: number
  InputMasterGain: number
  InputTalkbackGain: number
  InputSidetoneGain: number
}

export interface MacroState_ItemState {
  IsUsed: boolean
  HasUnsupportedOps: boolean
  Name: string
  Description: string
}

export interface MacroState_RecordStatusState {
  IsRecording: boolean
  RecordIndex: number
}

export interface MacroState_RunStatusState {
  RunStatus: MacroState_MacroRunStatus
  RunIndex: number
  Loop: boolean
}

export interface MediaPoolState_StillState {
  IsUsed: boolean
  Hash: number[]
  Filename: string
}

export interface MediaPoolState_ClipState {
  IsUsed: boolean
  Name: string
  MaxFrames: number
  Frames: MediaPoolState_FrameState[]
}

export interface MultiViewerState {
  SupportsVuMeters: boolean
  SupportsProgramPreviewSwapped: boolean
  SupportsQuadrantLayout: boolean
  SupportsToggleSafeArea: boolean
  VuMeterOpacity: number
  Properties: MultiViewerState_PropertiesState
  Windows: MultiViewerState_WindowState[]
}

export interface InputState {
  Properties: InputState_PropertiesState
  Tally: InputState_TallyState
}

export interface SettingsState_HyperdeckState {
  NetworkAddress: string
  Input: Enums.VideoSource
  AutoRoll: boolean
  AutoRollFrameDelay: number
}

export interface SettingsState_TalkbackState {
  MuteSDI: boolean
  Inputs: SettingsState_TalkbackInputState[]
}

export interface SettingsState_MixMinusOutputState {
  AudioInputId: Enums.AudioSource
  SupportedModes: Enums.MixMinusMode
  Mode: Enums.MixMinusMode
}

export interface Timecode {
  Hour: number
  Minute: number
  Second: number
  Frame: number
  DropFrame: boolean
}

export interface VideoModeInfo {
  Mode: Enums.VideoMode
  RequiresReconfig: boolean
  MultiviewModes: Enums.VideoMode[]
  DownConvertModes: Enums.VideoMode[]
}

export interface MixEffectState_KeyerLumaState {
  PreMultiplied: boolean
  Clip: number
  Gain: number
  Invert: boolean
}

export interface MixEffectState_KeyerChromaState {
  Hue: number
  Gain: number
  YSuppress: number
  Lift: number
  Narrow: boolean
}

export interface MixEffectState_KeyerAdvancedChromaState {
  Sample: MixEffectState_KeyerAdvancedChromaSampleState
  Properties: MixEffectState_KeyerAdvancedChromaPropertiesState
}

export interface MixEffectState_KeyerPatternState {
  Pattern: Enums.Pattern
  Size: number
  Symmetry: number
  Softness: number
  XPosition: number
  YPosition: number
  Inverse: boolean
}

export interface MixEffectState_KeyerDVEState {
  SizeX: number
  SizeY: number
  PositionX: number
  PositionY: number
  Rotation: number
  Rate: number
  BorderEnabled: boolean
  BorderShadowEnabled: boolean
  BorderBevel: Enums.BorderBevel
  BorderOuterWidth: number
  BorderInnerWidth: number
  BorderOuterSoftness: number
  BorderInnerSoftness: number
  BorderBevelSoftness: number
  BorderBevelPosition: number
  BorderOpacity: number
  BorderHue: number
  BorderSaturation: number
  BorderLuma: number
  LightSourceDirection: number
  LightSourceAltitude: number
  MaskEnabled: boolean
  MaskTop: number
  MaskBottom: number
  MaskLeft: number
  MaskRight: number
}

export interface MixEffectState_KeyerFlyFrameState {
  SizeX: number
  SizeY: number
  PositionX: number
  PositionY: number
  Rotation: number
  OuterWidth: number
  InnerWidth: number
  OuterSoftness: number
  InnerSoftness: number
  BevelSoftness: number
  BevelPosition: number
  BorderOpacity: number
  BorderHue: number
  BorderSaturation: number
  BorderLuma: number
  LightSourceDirection: number
  LightSourceAltitude: number
  MaskTop: number
  MaskBottom: number
  MaskLeft: number
  MaskRight: number
}

export interface MixEffectState_KeyerPropertiesState {
  KeyType: Enums.MixEffectKeyType
  FlyEnabled: boolean
  FillSource: Enums.VideoSource
  CutSource: Enums.VideoSource
  MaskEnabled: boolean
  MaskTop: number
  MaskBottom: number
  MaskLeft: number
  MaskRight: number
}

export interface MixEffectState_KeyerFlyProperties {
  IsASet: boolean
  IsBSet: boolean
  IsAtKeyFrame: number
  RunToInfinite: number
  ActiveKeyFrame: number
}

export interface MixEffectState_TransitionPropertiesState {
  Style: Enums.TransitionStyle
  NextStyle: Enums.TransitionStyle
  Selection: Enums.TransitionLayer
  NextSelection: Enums.TransitionLayer
  Preview: boolean
  IsInPreview: boolean
}

export interface MixEffectState_TransitionPositionState {
  InTransition: boolean
  RemainingFrames: number
  HandlePosition: number
}

export interface MixEffectState_TransitionMixState {
  Rate: number
}

export interface MixEffectState_TransitionDipState {
  Input: Enums.VideoSource
  Rate: number
}

export interface MixEffectState_TransitionWipeState {
  Rate: number
  Pattern: Enums.Pattern
  BorderWidth: number
  BorderInput: Enums.VideoSource
  Symmetry: number
  BorderSoftness: number
  XPosition: number
  YPosition: number
  ReverseDirection: boolean
  FlipFlop: boolean
}

export interface MixEffectState_TransitionStingerState {
  Source: Enums.StingerSource
  PreMultipliedKey: boolean
  Clip: number
  Gain: number
  Invert: boolean
  Preroll: number
  ClipDuration: number
  TriggerPoint: number
  MixRate: number
}

export interface MixEffectState_TransitionDVEState {
  Rate: number
  LogoRate: number
  Style: Enums.DVEEffect
  FillSource: Enums.VideoSource
  KeySource: Enums.VideoSource
  EnableKey: boolean
  PreMultiplied: boolean
  Clip: number
  Gain: number
  InvertKey: boolean
  Reverse: boolean
  FlipFlop: boolean
}

export interface MixEffectState_FadeToBlackStatusState {
  IsFullyBlack: boolean
  InTransition: boolean
  RemainingFrames: number
}

export interface MixEffectState_FadeToBlackPropertiesState {
  Rate: number
}

export interface AudioState_LevelsState {
  Levels: number[]
  Peaks: number[]
}

export interface AudioState_InputState_PropertiesState {
  SourceType: Enums.AudioSourceType
  PortType: Enums.AudioPortType
  MixOption: Enums.AudioMixOption
  Gain: number
  Balance: number
}

export interface AudioState_InputState_AnalogState {
  RcaToXlr: boolean
}

export interface FairlightAudioState_DynamicsState {
  MakeUpGain: number
  Limiter: FairlightAudioState_LimiterState
  Compressor: FairlightAudioState_CompressorState
  Expander: FairlightAudioState_ExpanderState
}

export interface FairlightAudioState_EqualizerState {
  Enabled: boolean
  Gain: number
  Bands: FairlightAudioState_EqualizerBandState[]
}

export interface FairlightAudioState_LevelsState {
  Levels: number[]
  Peaks: number[]
  DynamicsInputLevels: number[]
  DynamicsInputPeaks: number[]
  DynamicsOutputLevels: number[]
  DynamicsOutputPeaks: number[]
  ExpanderGainReductionLevel: number
  CompressorGainReductionLevel: number
  LimiterGainReductionLevel: number
}

export interface FairlightAudioState_AnalogState {
  SupportedInputLevel: Enums.FairlightAnalogInputLevel
  InputLevel: Enums.FairlightAnalogInputLevel
}

export interface FairlightAudioState_InputSourceState {
  SourceId: number
  SourceType: Enums.FairlightAudioSourceType
  Gain: number
  Balance: number
  FaderGain: number
  SupportedMixOptions: Enums.FairlightAudioMixOption
  MixOption: Enums.FairlightAudioMixOption
  MaxFramesDelay: number
  FramesDelay: number
  HasStereoSimulation: boolean
  StereoSimulation: number
  Dynamics: FairlightAudioState_DynamicsState
  Equalizer: FairlightAudioState_EqualizerState
  Levels: FairlightAudioState_LevelsState
}

export interface MacroState_MacroRunStatus {
}

export interface MediaPoolState_FrameState {
  IsUsed: boolean
  Filename: number[]
}

export interface MultiViewerState_PropertiesState {
  Layout: Enums.MultiViewLayoutV8
  ProgramPreviewSwapped: boolean
}

export interface MultiViewerState_WindowState {
  VuMeter: boolean
  SupportsVuMeter: boolean
  Source: Enums.VideoSource
  SafeAreaEnabled: boolean
}

export interface InputState_PropertiesState {
  ShortName: string
  LongName: string
  InternalPortType: Enums.InternalPortType
  AvailableExternalPortTypes: Enums.ExternalPortTypeFlags
  CurrentExternalPortType: Enums.ExternalPortTypeFlags
}

export interface InputState_TallyState {
  ProgramTally: boolean
  PreviewTally: boolean
}

export interface SettingsState_TalkbackInputState {
}

export interface MixEffectState_KeyerAdvancedChromaSampleState {
  EnableCursor: boolean
  Preview: boolean
  CursorX: number
  CursorY: number
  CursorSize: number
  SampledY: number
  SampledCb: number
  SampledCr: number
}

export interface MixEffectState_KeyerAdvancedChromaPropertiesState {
  ForegroundLevel: number
  BackgroundLevel: number
  KeyEdge: number
  SpillSuppression: number
  FlareSuppression: number
  Brightness: number
  Contrast: number
  Saturation: number
  Red: number
  Green: number
  Blue: number
}

export interface FairlightAudioState_LimiterState {
  LimiterEnabled: boolean
  Threshold: number
  Attack: number
  Hold: number
  Release: number
}

export interface FairlightAudioState_CompressorState {
  CompressorEnabled: boolean
  Threshold: number
  Ratio: number
  Attack: number
  Hold: number
  Release: number
}

export interface FairlightAudioState_ExpanderState {
  ExpanderEnabled: boolean
  GateEnabled: boolean
  Threshold: number
  Range: number
  Ratio: number
  Attack: number
  Hold: number
  Release: number
}

export interface FairlightAudioState_EqualizerBandState {
  BandEnabled: boolean
  SupportedShapes: Enums.FairlightEqualizerBandShape
  Shape: Enums.FairlightEqualizerBandShape
  SupportedFrequencyRanges: Enums.FairlightEqualizerFrequencyRange
  FrequencyRange: Enums.FairlightEqualizerFrequencyRange
  Frequency: number
  Gain: number
  QFactor: number
}

