import * as Enums from './common-enums'
export interface AuxSourceGetCommand {
  Id: Enums.AuxiliaryId
  Source: Enums.VideoSource
}

export interface AuxSourceSetCommand {
  Id: Enums.AuxiliaryId
  Source?: Enums.VideoSource
}

export interface ColorGeneratorGetCommand {
  Index: Enums.ColorGeneratorId
  Hue: number
  Saturation: number
  Luma: number
}

export interface ColorGeneratorSetCommand {
  Mask?: ColorGeneratorSetCommand_MaskFlags
  Index: Enums.ColorGeneratorId
  Hue?: number
  Saturation?: number
  Luma?: number
}

export interface InitializationCompleteCommand {
  unimplemented: never
}

export interface StartupStateClearCommand {
}

export interface StartupStateSaveCommand {
}

export interface TallyByInputCommand {
  unimplemented: never
}

export interface TallyBySourceCommand {
  unimplemented: never
}

export interface TallyChannelConfigCommand {
  InputCount: number
}

export interface TallyTlFcCommand {
  unimplemented: never
}

export interface TimeCodeCommand {
  Hour: number
  Minute: number
  Second: number
  Frame: number
  IsDropFrame: boolean
}

export interface TimeCodeRequestCommand {
}

export interface WarningCommand {
  Text: string
}

export interface SuperSource_SuperSourceBorderGetCommand {
  SSrcId: Enums.SuperSourceId
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

export interface SuperSource_SuperSourceBorderSetCommand {
  Mask?: SuperSource_SuperSourceBorderSetCommand_MaskFlags
  SSrcId: Enums.SuperSourceId
  Enabled?: boolean
  Bevel?: Enums.BorderBevel
  OuterWidth?: number
  InnerWidth?: number
  OuterSoftness?: number
  InnerSoftness?: number
  BevelSoftness?: number
  BevelPosition?: number
  Hue?: number
  Saturation?: number
  Luma?: number
  LightSourceDirection?: number
  LightSourceAltitude?: number
}

export interface SuperSource_SuperSourceBoxGetCommand {
  Index: Enums.SuperSourceBoxId
  Enabled: boolean
  InputSource: Enums.VideoSource
  PositionX: number
  PositionY: number
  Size: number
  Cropped: boolean
  CropTop: number
  CropBottom: number
  CropLeft: number
  CropRight: number
}

export interface SuperSource_SuperSourceBoxGetV8Command {
  SSrcId: Enums.SuperSourceId
  BoxIndex: Enums.SuperSourceBoxId
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

export interface SuperSource_SuperSourceBoxSetCommand {
  Mask?: SuperSource_SuperSourceBoxSetCommand_MaskFlags
  BoxIndex: Enums.SuperSourceBoxId
  Enabled?: boolean
  Source?: Enums.VideoSource
  PositionX?: number
  PositionY?: number
  Size?: number
  Cropped?: boolean
  CropTop?: number
  CropBottom?: number
  CropLeft?: number
  CropRight?: number
}

export interface SuperSource_SuperSourceBoxSetV8Command {
  Mask?: SuperSource_SuperSourceBoxSetV8Command_MaskFlags
  SSrcId: Enums.SuperSourceId
  BoxIndex: Enums.SuperSourceBoxId
  Enabled?: boolean
  Source?: Enums.VideoSource
  PositionX?: number
  PositionY?: number
  Size?: number
  Cropped?: boolean
  CropTop?: number
  CropBottom?: number
  CropLeft?: number
  CropRight?: number
}

export interface SuperSource_SuperSourceCascadeCommand {
  Cascade: boolean
}

export interface SuperSource_SuperSourcePropertiesGetCommand {
  ArtFillInput: Enums.VideoSource
  ArtKeyInput: Enums.VideoSource
  ArtOption: Enums.SuperSourceArtOption
  ArtPreMultiplied: boolean
  ArtClip: number
  ArtGain: number
  ArtInvertKey: boolean
  BorderEnabled: boolean
  BorderBevel: Enums.BorderBevel
  BorderOuterWidth: number
  BorderInnerWidth: number
  BorderOuterSoftness: number
  BorderInnerSoftness: number
  BorderBevelSoftness: number
  BorderBevelPosition: number
  BorderHue: number
  BorderSaturation: number
  BorderLuma: number
  BorderLightSourceDirection: number
  BorderLightSourceAltitude: number
}

export interface SuperSource_SuperSourcePropertiesGetV8Command {
  SSrcId: Enums.SuperSourceId
  ArtFillSource: Enums.VideoSource
  ArtCutSource: Enums.VideoSource
  ArtOption: Enums.SuperSourceArtOption
  ArtPreMultiplied: boolean
  ArtClip: number
  ArtGain: number
  ArtInvertKey: boolean
}

export interface SuperSource_SuperSourcePropertiesSetCommand {
  Mask?: SuperSource_SuperSourcePropertiesSetCommand_MaskFlags
  ArtFillSource?: Enums.VideoSource
  ArtCutSource?: Enums.VideoSource
  ArtOption?: Enums.SuperSourceArtOption
  ArtPreMultiplied?: boolean
  ArtClip?: number
  ArtGain?: number
  ArtInvertKey?: boolean
  BorderEnabled?: boolean
  BorderBevel?: Enums.BorderBevel
  BorderOuterWidth?: number
  BorderInnerWidth?: number
  BorderOuterSoftness?: number
  BorderInnerSoftness?: number
  BorderBevelSoftness?: number
  BorderBevelPosition?: number
  BorderHue?: number
  BorderSaturation?: number
  BorderLuma?: number
  BorderLightSourceDirection?: number
  BorderLightSourceAltitude?: number
}

export interface SuperSource_SuperSourcePropertiesSetV8Command {
  Mask?: SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags
  SSrcId: Enums.SuperSourceId
  ArtFillSource?: Enums.VideoSource
  ArtCutSource?: Enums.VideoSource
  ArtOption?: Enums.SuperSourceArtOption
  ArtPreMultiplied?: boolean
  ArtClip?: number
  ArtGain?: number
  ArtInvertKey?: boolean
}

export interface Settings_DownConvertAvailableModesCommand {
  CoreVideoMode: Enums.VideoMode
  DownConvertedMode: Enums.VideoMode
}

export interface Settings_DownConvertModeGetCommand {
  DownConvertMode: Enums.DownConvertMode
}

export interface Settings_DownConvertModeSetCommand {
  DownConvertMode: Enums.DownConvertMode
}

export interface Settings_InputPropertiesGetCommand {
  unimplemented: never
}

export interface Settings_InputPropertiesSetCommand {
  Mask?: Settings_InputPropertiesSetCommand_MaskFlags
  Id: Enums.VideoSource
  LongName?: string
  ShortName?: string
  ExternalPortType?: Enums.ExternalPortTypeFlags
}

export interface Settings_MixMinusOutputGetCommand {
  Id: number
  Mode: Enums.MixMinusMode
  SupportedModes: Enums.MixMinusMode
  AudioInputId: Enums.AudioSource
}

export interface Settings_MixMinusOutputSetCommand {
  Mask?: Settings_MixMinusOutputSetCommand_MaskFlags
  Id: number
  Mode?: Enums.MixMinusMode
}

export interface Settings_SDI3GLevelOutputGetCommand {
  SDI3GOutputLevel: Enums.SDI3GOutputLevel
}

export interface Settings_SDI3GLevelOutputSetCommand {
  SDI3GOutputLevel: Enums.SDI3GOutputLevel
}

export interface Settings_SerialPortModeCommand {
  SerialMode: Enums.SerialMode
}

export interface Settings_VideoModeGetCommand {
  VideoMode: Enums.VideoMode
}

export interface Settings_VideoModeSetCommand {
  VideoMode: Enums.VideoMode
}

export interface Settings_Multiview_MultiviewerAvailableModesCommand {
  CoreVideoMode: Enums.VideoMode
  MultiviewMode: Enums.VideoMode
}

export interface Settings_Multiview_MultiviewPropertiesGetCommand {
  MultiviewIndex: number
  Layout: Enums.MultiViewLayout
  SafeAreaEnabled: boolean
  ProgramPreviewSwapped: boolean
}

export interface Settings_Multiview_MultiviewPropertiesGetV8Command {
  MultiviewIndex: number
  Layout: Enums.MultiViewLayoutV8
  ProgramPreviewSwapped: boolean
}

export interface Settings_Multiview_MultiviewPropertiesSetCommand {
  Mask?: Settings_Multiview_MultiviewPropertiesSetCommand_MaskFlags
  MultiviewIndex: number
  Layout?: Enums.MultiViewLayout
  SafeAreaEnabled?: boolean
  ProgramPreviewSwapped?: boolean
}

export interface Settings_Multiview_MultiviewPropertiesSetV8Command {
  Mask?: Settings_Multiview_MultiviewPropertiesSetV8Command_MaskFlags
  MultiviewIndex: number
  Layout?: Enums.MultiViewLayoutV8
  ProgramPreviewSwapped?: boolean
}

export interface Settings_Multiview_MultiviewVuOpacityCommand {
  MultiviewIndex: number
  Opacity: number
}

export interface Settings_Multiview_MultiviewWindowInputGetCommand {
  MultiviewIndex: number
  WindowIndex: number
  Source: Enums.VideoSource
}

export interface Settings_Multiview_MultiviewWindowInputSetCommand {
  MultiviewIndex: number
  WindowIndex: number
  Source: Enums.VideoSource
}

export interface Settings_Multiview_MultiviewWindowSafeAreaCommand {
  MultiviewIndex: number
  WindowIndex: number
  SafeAreaEnabled: boolean
}

export interface Settings_Multiview_MultiviewWindowVuMeterGetCommand {
  MultiviewIndex: number
  WindowIndex: number
  VuEnabled: boolean
}

export interface Settings_Multiview_MultiviewWindowVuMeterSetCommand {
  MultiviewIndex: number
  WindowIndex: number
  VuEnabled: boolean
}

export interface Settings_HyperDeck_HyperDeckRXCCCommand {
  unimplemented: never
}

export interface Settings_HyperDeck_HyperDeckRXCPCommand {
  unimplemented: never
}

export interface Settings_HyperDeck_HyperDeckRXSSCommand {
  unimplemented: never
}

export interface Settings_HyperDeck_HyperDeckSettingsGetCommand {
  Id: number
  NetworkAddress: number
  NetworkAddressBytes: number[]
  Input: Enums.VideoSource
  AutoRoll: boolean
  AutoRollFrameDelay: number
}

export interface Settings_HyperDeck_HyperDeckSettingsSetCommand {
  Mask?: Settings_HyperDeck_HyperDeckSettingsSetCommand_MaskFlags
  Id: number
  NetworkAddressStr?: number
  Source?: Enums.VideoSource
  AutoRoll?: boolean
  AutoRollFrameDelay?: number
}

export interface MixEffects_FadeToBlackAutoCommand {
  Index: Enums.MixEffectBlockId
}

export interface MixEffects_FadeToBlackCutCommand {
  Index: Enums.MixEffectBlockId
  IsFullyBlack: boolean
}

export interface MixEffects_FadeToBlackPropertiesGetCommand {
  Index: Enums.MixEffectBlockId
  Rate: number
}

export interface MixEffects_FadeToBlackRateSetCommand {
  Index: Enums.MixEffectBlockId
  Rate: number
}

export interface MixEffects_FadeToBlackStateCommand {
  Index: Enums.MixEffectBlockId
  IsFullyBlack: boolean
  InTransition: boolean
  RemainingFrames: number
}

export interface MixEffects_MixEffectAutoCommand {
  Index: Enums.MixEffectBlockId
}

export interface MixEffects_MixEffectCutCommand {
  Index: Enums.MixEffectBlockId
}

export interface MixEffects_PreviewInputGetCommand {
  Index: Enums.MixEffectBlockId
  Source: Enums.VideoSource
}

export interface MixEffects_PreviewInputSetCommand {
  Index: Enums.MixEffectBlockId
  Source: Enums.VideoSource
}

export interface MixEffects_ProgramInputGetCommand {
  Index: Enums.MixEffectBlockId
  Source: Enums.VideoSource
}

export interface MixEffects_ProgramInputSetCommand {
  Index: Enums.MixEffectBlockId
  Source: Enums.VideoSource
}

export interface MixEffects_Transition_TransitionDipGetCommand {
  Index: Enums.MixEffectBlockId
  Rate: number
  Input: Enums.VideoSource
}

export interface MixEffects_Transition_TransitionDipSetCommand {
  Mask?: MixEffects_Transition_TransitionDipSetCommand_MaskFlags
  Index: Enums.MixEffectBlockId
  Rate?: number
  Input?: Enums.VideoSource
}

export interface MixEffects_Transition_TransitionDVEGetCommand {
  Index: Enums.MixEffectBlockId
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

export interface MixEffects_Transition_TransitionDVESetCommand {
  Mask?: MixEffects_Transition_TransitionDVESetCommand_MaskFlags
  Index: Enums.MixEffectBlockId
  Rate?: number
  LogoRate?: number
  Style?: Enums.DVEEffect
  FillSource?: Enums.VideoSource
  KeySource?: Enums.VideoSource
  EnableKey?: boolean
  PreMultiplied?: boolean
  Clip?: number
  Gain?: number
  InvertKey?: boolean
  Reverse?: boolean
  FlipFlop?: boolean
}

export interface MixEffects_Transition_TransitionMixGetCommand {
  Index: Enums.MixEffectBlockId
  Rate: number
}

export interface MixEffects_Transition_TransitionMixSetCommand {
  Index: Enums.MixEffectBlockId
  Rate: number
}

export interface MixEffects_Transition_TransitionPositionGetCommand {
  Index: Enums.MixEffectBlockId
  InTransition: boolean
  RemainingFrames: number
  HandlePosition: number
}

export interface MixEffects_Transition_TransitionPositionSetCommand {
  Index: Enums.MixEffectBlockId
  HandlePosition: number
}

export interface MixEffects_Transition_TransitionPreviewGetCommand {
  Index: Enums.MixEffectBlockId
  PreviewTransition: boolean
}

export interface MixEffects_Transition_TransitionPreviewSetCommand {
  Index: Enums.MixEffectBlockId
  PreviewTransition: boolean
}

export interface MixEffects_Transition_TransitionPropertiesGetCommand {
  Index: Enums.MixEffectBlockId
  Style: Enums.TransitionStyle
  Selection: Enums.TransitionLayer
  NextStyle: Enums.TransitionStyle
  NextSelection: Enums.TransitionLayer
}

export interface MixEffects_Transition_TransitionPropertiesSetCommand {
  Mask?: MixEffects_Transition_TransitionPropertiesSetCommand_MaskFlags
  Index: Enums.MixEffectBlockId
  NextStyle?: Enums.TransitionStyle
  NextSelection?: Enums.TransitionLayer
}

export interface MixEffects_Transition_TransitionStingerGetCommand {
  Index: Enums.MixEffectBlockId
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

export interface MixEffects_Transition_TransitionStingerSetCommand {
  Mask?: MixEffects_Transition_TransitionStingerSetCommand_MaskFlags
  Index: Enums.MixEffectBlockId
  Source?: Enums.StingerSource
  PreMultipliedKey?: boolean
  Clip?: number
  Gain?: number
  Invert?: boolean
  Preroll?: number
  ClipDuration?: number
  TriggerPoint?: number
  MixRate?: number
}

export interface MixEffects_Transition_TransitionWipeGetCommand {
  Index: Enums.MixEffectBlockId
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

export interface MixEffects_Transition_TransitionWipeSetCommand {
  Mask?: MixEffects_Transition_TransitionWipeSetCommand_MaskFlags
  Index: Enums.MixEffectBlockId
  Rate?: number
  Pattern?: Enums.Pattern
  BorderWidth?: number
  BorderInput?: Enums.VideoSource
  Symmetry?: number
  BorderSoftness?: number
  XPosition?: number
  YPosition?: number
  ReverseDirection?: boolean
  FlipFlop?: boolean
}

export interface MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesGetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
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

export interface MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand {
  Mask?: MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  ForegroundLevel?: number
  BackgroundLevel?: number
  KeyEdge?: number
  SpillSuppression?: number
  FlareSuppression?: number
  Brightness?: number
  Contrast?: number
  Saturation?: number
  Red?: number
  Green?: number
  Blue?: number
}

export interface MixEffects_Key_MixEffectKeyAdvancedChromaResetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  KeyAdjustments: boolean
  ChromaCorrection: boolean
  ColorAdjustments: boolean
}

export interface MixEffects_Key_MixEffectKeyAdvancedChromaSampleGetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  EnableCursor: boolean
  Preview: boolean
  CursorX: number
  CursorY: number
  CursorSize: number
  SampledY: number
  SampledCb: number
  SampledCr: number
}

export interface MixEffects_Key_MixEffectKeyAdvancedChromaSampleSetCommand {
  Mask?: MixEffects_Key_MixEffectKeyAdvancedChromaSampleSetCommand_MaskFlags
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  EnableCursor?: boolean
  Preview?: boolean
  CursorX?: number
  CursorY?: number
  CursorSize?: number
  SampledY?: number
  SampledCb?: number
  SampledCr?: number
}

export interface MixEffects_Key_MixEffectKeyChromaGetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  Hue: number
  Gain: number
  YSuppress: number
  Lift: number
  Narrow: boolean
}

export interface MixEffects_Key_MixEffectKeyChromaSetCommand {
  Mask?: MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  Hue?: number
  Gain?: number
  YSuppress?: number
  Lift?: number
  Narrow?: boolean
}

export interface MixEffects_Key_MixEffectKeyCutSourceSetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  CutSource: Enums.VideoSource
}

export interface MixEffects_Key_MixEffectKeyDVEGetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  SizeX: number
  SizeY: number
  PositionX: number
  PositionY: number
  Rotation: number
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
  Rate: number
}

export interface MixEffects_Key_MixEffectKeyDVESetCommand {
  Mask?: MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  SizeX?: number
  SizeY?: number
  PositionX?: number
  PositionY?: number
  Rotation?: number
  BorderEnabled?: boolean
  BorderShadowEnabled?: boolean
  BorderBevel?: Enums.BorderBevel
  BorderOuterWidth?: number
  BorderInnerWidth?: number
  BorderOuterSoftness?: number
  BorderInnerSoftness?: number
  BorderBevelSoftness?: number
  BorderBevelPosition?: number
  BorderOpacity?: number
  BorderHue?: number
  BorderSaturation?: number
  BorderLuma?: number
  LightSourceDirection?: number
  LightSourceAltitude?: number
  MaskEnabled?: boolean
  MaskTop?: number
  MaskBottom?: number
  MaskLeft?: number
  MaskRight?: number
  Rate?: number
}

export interface MixEffects_Key_MixEffectKeyFillSourceSetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  FillSource: Enums.VideoSource
}

export interface MixEffects_Key_MixEffectKeyFlyKeyframeGetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  KeyFrame: Enums.FlyKeyKeyFrameId
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

export interface MixEffects_Key_MixEffectKeyFlyKeyframeSetCommand {
  Mask?: MixEffects_Key_MixEffectKeyFlyKeyframeSetCommand_MaskFlags
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  KeyFrame: Enums.FlyKeyKeyFrameId
  SizeX?: number
  SizeY?: number
  PositionX?: number
  PositionY?: number
  Rotation?: number
  OuterWidth?: number
  InnerWidth?: number
  OuterSoftness?: number
  InnerSoftness?: number
  BevelSoftness?: number
  BevelPosition?: number
  BorderOpacity?: number
  BorderHue?: number
  BorderSaturation?: number
  BorderLuma?: number
  LightSourceDirection?: number
  LightSourceAltitude?: number
  MaskTop?: number
  MaskBottom?: number
  MaskLeft?: number
  MaskRight?: number
}

export interface MixEffects_Key_MixEffectKeyFlyPropertiesGetCommand {
  unimplemented: never
}

export interface MixEffects_Key_MixEffectKeyFlyRunSetCommand {
  Mask?: MixEffects_Key_MixEffectKeyFlyRunSetCommand_MaskFlags
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  KeyFrame?: Enums.FlyKeyKeyFrameType
  RunToInfinite?: Enums.FlyKeyLocation
}

export interface MixEffects_Key_MixEffectKeyLumaGetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  PreMultiplied: boolean
  Clip: number
  Gain: number
  Invert: boolean
}

export interface MixEffects_Key_MixEffectKeyLumaSetCommand {
  Mask?: MixEffects_Key_MixEffectKeyLumaSetCommand_MaskFlags
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  PreMultiplied?: boolean
  Clip?: number
  Gain?: number
  Invert?: boolean
}

export interface MixEffects_Key_MixEffectKeyMaskSetCommand {
  Mask?: MixEffects_Key_MixEffectKeyMaskSetCommand_MaskFlags
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  MaskEnabled?: boolean
  MaskTop?: number
  MaskBottom?: number
  MaskLeft?: number
  MaskRight?: number
}

export interface MixEffects_Key_MixEffectKeyOnAirGetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  OnAir: boolean
}

export interface MixEffects_Key_MixEffectKeyOnAirSetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  OnAir: boolean
}

export interface MixEffects_Key_MixEffectKeyPatternGetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  Pattern: Enums.Pattern
  Size: number
  Symmetry: number
  Softness: number
  XPosition: number
  YPosition: number
  Inverse: boolean
}

export interface MixEffects_Key_MixEffectKeyPatternSetCommand {
  Mask?: MixEffects_Key_MixEffectKeyPatternSetCommand_MaskFlags
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  Pattern?: Enums.Pattern
  Size?: number
  Symmetry?: number
  Softness?: number
  XPosition?: number
  YPosition?: number
  Inverse?: boolean
}

export interface MixEffects_Key_MixEffectKeyPropertiesGetCommand {
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
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

export interface MixEffects_Key_MixEffectKeyTypeSetCommand {
  Mask?: MixEffects_Key_MixEffectKeyTypeSetCommand_MaskFlags
  MixEffectIndex: Enums.MixEffectBlockId
  KeyerIndex: Enums.UpstreamKeyId
  KeyType?: Enums.MixEffectKeyType
  FlyEnabled?: boolean
}

export interface Media_MediaPlayerClipStatusGetCommand {
  Index: Enums.MediaPlayerId
  Playing: boolean
  Loop: boolean
  AtBeginning: boolean
  ClipFrame: number
}

export interface Media_MediaPlayerClipStatusSetCommand {
  Mask?: Media_MediaPlayerClipStatusSetCommand_MaskFlags
  Index: Enums.MediaPlayerId
  Playing?: boolean
  Loop?: boolean
  AtBeginning?: boolean
  ClipFrame?: number
}

export interface Media_MediaPlayerSourceGetCommand {
  Index: Enums.MediaPlayerId
  SourceType: Enums.MediaPlayerSource
  SourceIndex: number
}

export interface Media_MediaPlayerSourceSetCommand {
  Mask?: Media_MediaPlayerSourceSetCommand_MaskFlags
  Index: Enums.MediaPlayerId
  SourceType?: Enums.MediaPlayerSource
  StillIndex?: number
  ClipIndex?: number
}

export interface Media_MediaPoolAudioDescriptionCommand {
  Index: number
  IsUsed: boolean
  Hash: number[]
  Name: string
}

export interface Media_MediaPoolCaptureStillCommand {
}

export interface Media_MediaPoolClearAudioCommand {
  Index: number
}

export interface Media_MediaPoolClearClipCommand {
  Index: number
}

export interface Media_MediaPoolClearStillCommand {
  Index: number
}

export interface Media_MediaPoolClipDescriptionCommand {
  Index: number
  IsUsed: boolean
  Name: string
  FrameCount: number
}

export interface Media_MediaPoolFrameDescriptionCommand {
  Bank: Enums.MediaPoolFileType
  Index: number
  IsUsed: boolean
  Hash: number[]
  Filename: string
}

export interface Media_MediaPoolSetClipCommand {
  Index: number
  Name: string
  Frames: number
}

export interface Media_MediaPoolSettingsGetCommand {
  MaxFrames: number[]
}

export interface Media_MediaPoolSettingsSetCommand {
  MaxFrames: number[]
}

export interface Media_MediaPoolStillSetFilenameCommand {
  Index: number
  Filename: string
}

export interface Macro_MacroActionCommand {
  Index: number
  Action: unknown
}

export interface Macro_MacroAddTimedPauseCommand {
  Frames: number
}

export interface Macro_MacroPropertiesGetCommand {
  Index: number
  IsUsed: boolean
  HasUnsupportedOps: boolean
  Name: string
  Description: string
}

export interface Macro_MacroPropertiesSetCommand {
  Mask?: Macro_MacroPropertiesSetCommand_MaskFlags
  Index: number
  Name?: string
  Description?: string
}

export interface Macro_MacroRecordCommand {
  Index: number
  Name: string
  Description: string
}

export interface Macro_MacroRecordingStatusGetCommand {
  IsRecording: boolean
  Index: number
}

export interface Macro_MacroRunStatusSetCommand {
  Mask?: Macro_MacroRunStatusSetCommand_MaskFlags
  Loop?: boolean
}

export interface Macro_MacroRunStatusGetCommand {
  IsRunning: boolean
  IsWaiting: boolean
  Loop: boolean
  Index: number
}

export interface DownstreamKey_DownstreamKeyAutoCommand {
  Index: Enums.DownstreamKeyId
}

export interface DownstreamKey_DownstreamKeyAutoV8Command {
  Mask?: DownstreamKey_DownstreamKeyAutoV8Command_MaskFlags
  Index: Enums.DownstreamKeyId
  IsTowardsOnAir?: boolean
}

export interface DownstreamKey_DownstreamKeyCutSourceSetCommand {
  Index: Enums.DownstreamKeyId
  CutSource: Enums.VideoSource
}

export interface DownstreamKey_DownstreamKeyFillSourceSetCommand {
  Index: Enums.DownstreamKeyId
  FillSource: Enums.VideoSource
}

export interface DownstreamKey_DownstreamKeyGeneralSetCommand {
  Mask?: DownstreamKey_DownstreamKeyGeneralSetCommand_MaskFlags
  Index: Enums.DownstreamKeyId
  PreMultipliedKey?: boolean
  Clip?: number
  Gain?: number
  Invert?: boolean
}

export interface DownstreamKey_DownstreamKeyMaskSetCommand {
  Mask?: DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags
  Index: Enums.DownstreamKeyId
  MaskEnabled?: boolean
  MaskTop?: number
  MaskBottom?: number
  MaskLeft?: number
  MaskRight?: number
}

export interface DownstreamKey_DownstreamKeyOnAirSetCommand {
  Index: Enums.DownstreamKeyId
  OnAir: boolean
}

export interface DownstreamKey_DownstreamKeyPropertiesGetCommand {
  Index: Enums.DownstreamKeyId
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

export interface DownstreamKey_DownstreamKeyRateSetCommand {
  Index: Enums.DownstreamKeyId
  Rate: number
}

export interface DownstreamKey_DownstreamKeySourceGetCommand {
  Index: Enums.DownstreamKeyId
  FillSource: Enums.VideoSource
  CutSource: Enums.VideoSource
}

export interface DownstreamKey_DownstreamKeyStateGetCommand {
  Index: Enums.DownstreamKeyId
  OnAir: boolean
  InTransition: boolean
  IsAuto: boolean
  RemainingFrames: number
}

export interface DownstreamKey_DownstreamKeyStateGetV8Command {
  Index: Enums.DownstreamKeyId
  OnAir: boolean
  InTransition: boolean
  IsAuto: boolean
  IsTowardsOnAir: boolean
  RemainingFrames: number
}

export interface DownstreamKey_DownstreamKeyTieSetCommand {
  Index: Enums.DownstreamKeyId
  Tie: boolean
}

export interface DeviceProfile_AudioMixerConfigCommand {
  Inputs: number
  Monitors: number
  Headphones: number
}

export interface DeviceProfile_DVEConfigCommand {
  unimplemented: never
}

export interface DeviceProfile_FairlightAudioMixerConfigCommand {
  Inputs: number
  Monitors: number
}

export interface DeviceProfile_MacroPoolConfigCommand {
  MacroCount: number
}

export interface DeviceProfile_MediaPoolConfigCommand {
  StillCount: number
  ClipCount: number
}

export interface DeviceProfile_MixEffectBlockConfigCommand {
  Index: Enums.MixEffectBlockId
  KeyCount: number
}

export interface DeviceProfile_MultiviewerConfigCommand {
  Count: number
  WindowCount: number
  CanRouteInputs: boolean
  CanSwapPreviewProgram: boolean
  CanToggleSafeArea: boolean
}

export interface DeviceProfile_MultiviewerConfigV8Command {
  Count: number
  WindowCount: number
  CanRouteWindows: boolean
  SupportsVuMeters: boolean
  CanToggleSafeArea: boolean
  CanSwapPreviewProgram: boolean
  SupportsQuadrants: boolean
}

export interface DeviceProfile_PowerStatusCommand {
  Pin1: boolean
  Pin2: boolean
}

export interface DeviceProfile_ProductIdentifierCommand {
  Name: string
  Model: Enums.ModelId
}

export interface DeviceProfile_SuperSourceConfigCommand {
  Boxes: number
}

export interface DeviceProfile_SuperSourceConfigV8Command {
  SSrcId: Enums.SuperSourceId
  Boxes: number
}

export interface DeviceProfile_TopologyCommand {
  MixEffectBlocks: number
  VideoSources: number
  DownstreamKeyers: number
  Auxiliaries: number
  MixMinusOutputs: number
  MediaPlayers: number
  SerialPort: number
  HyperDecks: number
  DVE: number
  Stingers: number
  SuperSource: number
}

export interface DeviceProfile_TopologyV8Command {
  MixEffectBlocks: number
  VideoSources: number
  DownstreamKeyers: number
  Auxiliaries: number
  MixMinusOutputs: number
  MediaPlayers: number
  SerialPort: number
  HyperDecks: number
  DVE: number
  Stingers: number
  SuperSource: number
}

export interface DeviceProfile_TopologyV811Command {
  MixEffectBlocks: number
  VideoSources: number
  DownstreamKeyers: number
  Auxiliaries: number
  MixMinusOutputs: number
  MediaPlayers: number
  SerialPort: number
  HyperDecks: number
  DVE: number
  Stingers: number
  SuperSource: number
}

export interface DeviceProfile_VersionCommand {
  ProtocolVersion: unknown
}

export interface DeviceProfile_VideoMixerConfigCommand {
  unimplemented: never
}

export interface DeviceProfile_TimecodeLockedCommand {
  Locked: boolean
}

export interface DataTransfer_DataTransferAckCommand {
  TransferId: number
  TransferIndex: number
}

export interface DataTransfer_DataTransferCompleteCommand {
  TransferId: number
}

export interface DataTransfer_DataTransferDataCommand {
  unimplemented: never
}

export interface DataTransfer_DataTransferDownloadRequestCommand {
  TransferId: number
  TransferStoreId: number
  TransferIndex: number
  Unknown: number
  Unknown2: number
}

export interface DataTransfer_DataTransferErrorCommand {
  TransferId: number
  ErrorCode: number
}

export interface DataTransfer_DataTransferFileDescriptionCommand {
  TransferId: number
  Name: string
  Description: string
  FileHash: number[]
}

export interface DataTransfer_DataTransferUploadContinueCommand {
  TransferId: number
  ChunkSize: number
  ChunkCount: number
}

export interface DataTransfer_DataTransferUploadRequestCommand {
  TransferId: number
  TransferStoreId: number
  TransferIndex: number
  Size: number
  Mode: unknown
}

export interface DataTransfer_LockObtainedCommand {
  Index: number
}

export interface DataTransfer_LockStateChangedCommand {
  Index: number
  Locked: boolean
}

export interface DataTransfer_LockStateSetCommand {
  Index: number
  Locked: boolean
}

export interface CameraControl_CCstCommand {
  unimplemented: never
}

export interface Audio_AudioMixerHeadphoneGetCommand {
  Gain: number
  ProgramOutGain: number
  TalkbackGain: number
  SidetoneGain: number
}

export interface Audio_AudioMixerHeadphoneSetCommand {
  Mask?: Audio_AudioMixerHeadphoneSetCommand_MaskFlags
  Gain?: number
  ProgramOutGain?: number
  TalkbackGain?: number
  SidetoneGain?: number
}

export interface Audio_AudioMixerInputGetCommand {
  Index: Enums.AudioSource
  SourceType: Enums.AudioSourceType
  IndexOfSourceType: number
  PortType: Enums.AudioPortType
  MixOption: Enums.AudioMixOption
  Gain: number
  Balance: number
}

export interface Audio_AudioMixerInputGetV8Command {
  Index: Enums.AudioSource
  SourceType: Enums.AudioSourceType
  IndexOfSourceType: number
  PortType: Enums.AudioPortType
  MixOption: Enums.AudioMixOption
  Gain: number
  Balance: number
  SupportsRcaToXlrEnabled: boolean
  RcaToXlrEnabled: boolean
}

export interface Audio_AudioMixerInputSetCommand {
  Mask?: Audio_AudioMixerInputSetCommand_MaskFlags
  Index: Enums.AudioSource
  MixOption?: Enums.AudioMixOption
  Gain?: number
  Balance?: number
  RcaToXlrEnabled?: boolean
}

export interface Audio_AudioMixerLevelsCommand {
  unimplemented: never
}

export interface Audio_AudioMixerMasterGetCommand {
  Gain: number
  Balance: number
  FollowFadeToBlack: boolean
}

export interface Audio_AudioMixerMasterSetCommand {
  Mask?: Audio_AudioMixerMasterSetCommand_MaskFlags
  Gain?: number
  Balance?: number
  FollowFadeToBlack?: boolean
}

export interface Audio_AudioMixerMonitorGetCommand {
  Enabled: boolean
  Gain: number
  Mute: boolean
  Solo: boolean
  SoloSource: Enums.AudioSource
  Dim: boolean
  DimLevel: number
}

export interface Audio_AudioMixerMonitorSetCommand {
  Mask?: Audio_AudioMixerMonitorSetCommand_MaskFlags
  Enabled?: boolean
  Gain?: number
  Mute?: boolean
  Solo?: boolean
  SoloSource?: Enums.AudioSource
  Dim?: boolean
  DimLevel?: number
}

export interface Audio_AudioMixerPropertiesGetCommand {
  AudioFollowVideo: boolean
}

export interface Audio_AudioMixerPropertiesSetCommand {
  Mask?: Audio_AudioMixerPropertiesSetCommand_MaskFlags
  AudioFollowVideo?: boolean
}

export interface Audio_AudioMixerResetPeaksCommand {
  Mask?: Audio_AudioMixerResetPeaksCommand_MaskFlags
  Input?: Enums.AudioSource
}

export interface Audio_AudioMixerSendLevelsCommand {
  SendLevels: boolean
}

export interface Audio_AudioMixerTalkbackPropertiesGetCommand {
  MuteSDI: boolean
}

export interface Audio_AudioMixerTalkbackPropertiesSetCommand {
  Mask?: Audio_AudioMixerTalkbackPropertiesSetCommand_MaskFlags
  MuteSDI?: boolean
}

export interface Audio_AudioMixerTallyCommand {
  unimplemented: never
}

export interface Audio_TalkbackMixerInputPropertiesGetCommand {
  Channel: Enums.TalkbackChannel
  Index: Enums.VideoSource
  MuteSDI: boolean
}

export interface Audio_TalkbackMixerInputPropertiesSetCommand {
  Mask?: Audio_TalkbackMixerInputPropertiesSetCommand_MaskFlags
  Channel: Enums.TalkbackChannel
  Index: Enums.VideoSource
  MuteSDI?: boolean
}

export interface Audio_Fairlight_FairlightMixerAnalogAudioGetCommand {
  Index: Enums.AudioSource
  SupportedInputLevel: Enums.FairlightAnalogInputLevel
  InputLevel: Enums.FairlightAnalogInputLevel
}

export interface Audio_Fairlight_FairlightMixerAnalogAudioSetCommand {
  Index: Enums.AudioSource
  InputLevel: Enums.FairlightAnalogInputLevel
}

export interface Audio_Fairlight_FairlightMixerInputGetCommand {
  Index: Enums.AudioSource
  InputType: Enums.FairlightInputType
  ExternalPortType: Enums.ExternalPortType
  SupportsRcaToXlr: boolean
  RcaToXlrEnabled: boolean
  SupportedConfigurations: Enums.FairlightInputConfiguration
  ActiveConfiguration: Enums.FairlightInputConfiguration
}

export interface Audio_Fairlight_FairlightMixerInputGetV811Command {
  Index: Enums.AudioSource
  InputType: Enums.FairlightInputType
  ExternalPortType: Enums.ExternalPortType
  SupportedConfigurations: Enums.FairlightInputConfiguration
  ActiveConfiguration: Enums.FairlightInputConfiguration
  SupportedInputLevels: Enums.FairlightAnalogInputLevel
  ActiveInputLevel: Enums.FairlightAnalogInputLevel
}

export interface Audio_Fairlight_FairlightMixerInputSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerInputSetCommand_MaskFlags
  Index: Enums.AudioSource
  RcaToXlrEnabled?: boolean
  ActiveConfiguration?: Enums.FairlightInputConfiguration
}

export interface Audio_Fairlight_FairlightMixerInputSetV811Command {
  Mask?: Audio_Fairlight_FairlightMixerInputSetV811Command_MaskFlags
  Index: Enums.AudioSource
  ActiveConfiguration?: Enums.FairlightInputConfiguration
  ActiveInputLevel?: Enums.FairlightAnalogInputLevel
}

export interface Audio_Fairlight_FairlightMixerMasterCompressorGetCommand {
  CompressorEnabled: boolean
  Threshold: number
  Ratio: number
  Attack: number
  Hold: number
  Release: number
}

export interface Audio_Fairlight_FairlightMixerMasterCompressorSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerMasterCompressorSetCommand_MaskFlags
  CompressorEnabled?: boolean
  Threshold?: number
  Ratio?: number
  Attack?: number
  Hold?: number
  Release?: number
}

export interface Audio_Fairlight_FairlightMixerMasterDynamicsResetCommand {
  Dynamics: boolean
  Expander: boolean
  Compressor: boolean
  Limiter: boolean
}

export interface Audio_Fairlight_FairlightMixerMasterEqualizerBandGetCommand {
  Band: number
  BandEnabled: boolean
  Shape: Enums.FairlightEqualizerBandShape
  FrequencyRange: Enums.FairlightEqualizerFrequencyRange
  Frequency: number
  Gain: number
  QFactor: number
}

export interface Audio_Fairlight_FairlightMixerMasterEqualizerBandSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerMasterEqualizerBandSetCommand_MaskFlags
  Band: number
  BandEnabled?: boolean
  Shape?: Enums.FairlightEqualizerBandShape
  FrequencyRange?: Enums.FairlightEqualizerFrequencyRange
  Frequency?: number
  Gain?: number
  QFactor?: number
}

export interface Audio_Fairlight_FairlightMixerMasterEqualizerResetCommand {
  Equalizer: boolean
}

export interface Audio_Fairlight_FairlightMixerMasterGetCommand {
  EqualizerEnabled: boolean
  EqualizerGain: number
  MakeUpGain: number
  Gain: number
  FollowFadeToBlack: boolean
}

export interface Audio_Fairlight_FairlightMixerMasterLevelsCommand {
  InputLeftLevel: number
  InputRightLevel: number
  InputLeftPeak: number
  InputRightPeak: number
  CompressorGainReduction: number
  LimiterGainReduction: number
  OutputLeftLevel: number
  OutputRightLevel: number
  OutputLeftPeak: number
  OutputRightPeak: number
  LeftLevel: number
  RightLevel: number
  LeftPeak: number
  RightPeak: number
}

export interface Audio_Fairlight_FairlightMixerMasterLimiterGetCommand {
  LimiterEnabled: boolean
  Threshold: number
  Attack: number
  Hold: number
  Release: number
}

export interface Audio_Fairlight_FairlightMixerMasterLimiterSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerMasterLimiterSetCommand_MaskFlags
  LimiterEnabled?: boolean
  Threshold?: number
  Attack?: number
  Hold?: number
  Release?: number
}

export interface Audio_Fairlight_FairlightMixerMasterPropertiesGetCommand {
  AudioFollowVideoCrossfadeTransitionEnabled: boolean
}

export interface Audio_Fairlight_FairlightMixerMasterPropertiesSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerMasterPropertiesSetCommand_MaskFlags
  AudioFollowVideoCrossfadeTransitionEnabled?: boolean
}

export interface Audio_Fairlight_FairlightMixerMasterSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerMasterSetCommand_MaskFlags
  EqualizerEnabled?: boolean
  EqualizerGain?: number
  MakeUpGain?: number
  Gain?: number
  FollowFadeToBlack?: boolean
}

export interface Audio_Fairlight_FairlightMixerMonitorGetCommand {
  Gain: number
  InputMasterGain: number
  InputTalkbackGain: number
  InputSidetoneGain: number
}

export interface Audio_Fairlight_FairlightMixerMonitorSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerMonitorSetCommand_MaskFlags
  Gain?: number
  InputMasterGain?: number
  InputTalkbackGain?: number
  InputSidetoneGain?: number
}

export interface Audio_Fairlight_FairlightMixerResetPeakLevelsCommand {
  All: boolean
  Master: boolean
}

export interface Audio_Fairlight_FairlightMixerSendLevelsCommand {
  SendLevels: boolean
}

export interface Audio_Fairlight_FairlightMixerSourceCompressorGetCommand {
  Index: Enums.AudioSource
  SourceId: number
  CompressorEnabled: boolean
  Threshold: number
  Ratio: number
  Attack: number
  Hold: number
  Release: number
}

export interface Audio_Fairlight_FairlightMixerSourceCompressorSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerSourceCompressorSetCommand_MaskFlags
  Index: Enums.AudioSource
  SourceId: number
  CompressorEnabled?: boolean
  Threshold?: number
  Ratio?: number
  Attack?: number
  Hold?: number
  Release?: number
}

export interface Audio_Fairlight_FairlightMixerSourceDeleteCommand {
  Index: Enums.AudioSource
  SourceId: number
}

export interface Audio_Fairlight_FairlightMixerSourceDynamicsResetCommand {
  Index: Enums.AudioSource
  SourceId: number
  Dynamics: boolean
  Expander: boolean
  Compressor: boolean
  Limiter: boolean
}

export interface Audio_Fairlight_FairlightMixerSourceEqualizerBandGetCommand {
  Index: Enums.AudioSource
  SourceId: number
  Band: number
  BandEnabled: boolean
  SupportedShapes: Enums.FairlightEqualizerBandShape
  Shape: Enums.FairlightEqualizerBandShape
  SupportedFrequencyRanges: Enums.FairlightEqualizerFrequencyRange
  FrequencyRange: Enums.FairlightEqualizerFrequencyRange
  Frequency: number
  Gain: number
  QFactor: number
}

export interface Audio_Fairlight_FairlightMixerSourceEqualizerBandSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerSourceEqualizerBandSetCommand_MaskFlags
  Index: Enums.AudioSource
  SourceId: number
  Band: number
  BandEnabled?: boolean
  Shape?: Enums.FairlightEqualizerBandShape
  FrequencyRange?: Enums.FairlightEqualizerFrequencyRange
  Frequency?: number
  Gain?: number
  QFactor?: number
}

export interface Audio_Fairlight_FairlightMixerSourceEqualizerResetCommand {
  Index: Enums.AudioSource
  SourceId: number
  Equalizer: boolean
}

export interface Audio_Fairlight_FairlightMixerSourceExpanderGetCommand {
  Index: Enums.AudioSource
  SourceId: number
  ExpanderEnabled: boolean
  GateEnabled: boolean
  Threshold: number
  Range: number
  Ratio: number
  Attack: number
  Hold: number
  Release: number
}

export interface Audio_Fairlight_FairlightMixerSourceExpanderSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerSourceExpanderSetCommand_MaskFlags
  Index: Enums.AudioSource
  SourceId: number
  ExpanderEnabled?: boolean
  GateEnabled?: boolean
  Threshold?: number
  Range?: number
  Ratio?: number
  Attack?: number
  Hold?: number
  Release?: number
}

export interface Audio_Fairlight_FairlightMixerSourceGetCommand {
  Index: Enums.AudioSource
  SourceId: number
  SourceType: Enums.FairlightAudioSourceType
  MaxFramesDelay: number
  FramesDelay: number
  Gain: number
  HasStereoSimulation: boolean
  StereoSimulation: number
  EqualizerBands: number
  EqualizerEnabled: boolean
  EqualizerGain: number
  MakeUpGain: number
  Balance: number
  FaderGain: number
  SupportedMixOptions: Enums.FairlightAudioMixOption
  MixOption: Enums.FairlightAudioMixOption
}

export interface Audio_Fairlight_FairlightMixerSourceLevelsCommand {
  SourceId: number
  Index: Enums.AudioSource
  InputLeftLevel: number
  InputRightLevel: number
  InputLeftPeak: number
  InputRightPeak: number
  ExpanderGainReduction: number
  CompressorGainReduction: number
  LimiterGainReduction: number
  OutputLeftLevel: number
  OutputRightLevel: number
  OutputLeftPeak: number
  OutputRightPeak: number
  LeftLevel: number
  RightLevel: number
  LeftPeak: number
  RightPeak: number
}

export interface Audio_Fairlight_FairlightMixerSourceLimiterGetCommand {
  Index: Enums.AudioSource
  SourceId: number
  LimiterEnabled: boolean
  Threshold: number
  Attack: number
  Hold: number
  Release: number
}

export interface Audio_Fairlight_FairlightMixerSourceLimiterSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerSourceLimiterSetCommand_MaskFlags
  Index: Enums.AudioSource
  SourceId: number
  LimiterEnabled?: boolean
  Threshold?: number
  Attack?: number
  Hold?: number
  Release?: number
}

export interface Audio_Fairlight_FairlightMixerSourceResetPeakLevelsCommand {
  Index: Enums.AudioSource
  SourceId: number
  Output: boolean
  DynamicsInput: boolean
  DynamicsOutput: boolean
}

export interface Audio_Fairlight_FairlightMixerSourceSetCommand {
  Mask?: Audio_Fairlight_FairlightMixerSourceSetCommand_MaskFlags
  Index: Enums.AudioSource
  SourceId: number
  FramesDelay?: number
  Gain?: number
  StereoSimulation?: number
  EqualizerEnabled?: boolean
  EqualizerGain?: number
  MakeUpGain?: number
  Balance?: number
  FaderGain?: number
  MixOption?: Enums.FairlightAudioMixOption
}

export interface Audio_Fairlight_FairlightMixerTallyCommand {
  unimplemented: never
}

export enum ColorGeneratorSetCommand_MaskFlags {
  Hue = 1,
  Saturation = 2,
  Luma = 4,
}

export enum SuperSource_SuperSourceBorderSetCommand_MaskFlags {
  Enabled = 1,
  Bevel = 2,
  OuterWidth = 4,
  InnerWidth = 8,
  OuterSoftness = 16,
  InnerSoftness = 32,
  BevelSoftness = 64,
  BevelPosition = 128,
  Hue = 256,
  Saturation = 512,
  Luma = 1024,
  LightSourceDirection = 2048,
  LightSourceAltitude = 4096,
}

export enum SuperSource_SuperSourceBoxSetCommand_MaskFlags {
  Enabled = 1,
  Source = 2,
  PositionX = 4,
  PositionY = 8,
  Size = 16,
  Cropped = 32,
  CropTop = 64,
  CropBottom = 128,
  CropLeft = 256,
  CropRight = 512,
}

export enum SuperSource_SuperSourceBoxSetV8Command_MaskFlags {
  Enabled = 1,
  Source = 2,
  PositionX = 4,
  PositionY = 8,
  Size = 16,
  Cropped = 32,
  CropTop = 64,
  CropBottom = 128,
  CropLeft = 256,
  CropRight = 512,
}

export enum SuperSource_SuperSourcePropertiesSetCommand_MaskFlags {
  ArtFillSource = 1,
  ArtCutSource = 2,
  ArtOption = 4,
  ArtPreMultiplied = 8,
  ArtClip = 16,
  ArtGain = 32,
  ArtInvertKey = 64,
  BorderEnabled = 128,
  BorderBevel = 256,
  BorderOuterWidth = 512,
  BorderInnerWidth = 1024,
  BorderOuterSoftness = 2048,
  BorderInnerSoftness = 4096,
  BorderBevelSoftness = 8192,
  BorderBevelPosition = 16384,
  BorderHue = 32768,
  BorderSaturation = 65536,
  BorderLuma = 131072,
  BorderLightSourceDirection = 262144,
  BorderLightSourceAltitude = 524288,
}

export enum SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags {
  ArtFillSource = 1,
  ArtCutSource = 2,
  ArtOption = 4,
  ArtPreMultiplied = 8,
  ArtClip = 16,
  ArtGain = 32,
  ArtInvertKey = 64,
}

export enum Settings_InputPropertiesSetCommand_MaskFlags {
  LongName = 1,
  ShortName = 2,
  ExternalPortType = 4,
}

export enum Settings_MixMinusOutputSetCommand_MaskFlags {
  Mode = 1,
}

export enum Settings_Multiview_MultiviewPropertiesSetCommand_MaskFlags {
  Layout = 1,
  SafeAreaEnabled = 2,
  ProgramPreviewSwapped = 4,
}

export enum Settings_Multiview_MultiviewPropertiesSetV8Command_MaskFlags {
  Layout = 1,
  ProgramPreviewSwapped = 2,
}

export enum Settings_HyperDeck_HyperDeckSettingsSetCommand_MaskFlags {
  NetworkAddress = 1,
  Source = 2,
  AutoRoll = 4,
  AutoRollFrameDelay = 8,
}

export enum MixEffects_Transition_TransitionDipSetCommand_MaskFlags {
  Rate = 1,
  Input = 2,
}

export enum MixEffects_Transition_TransitionDVESetCommand_MaskFlags {
  Rate = 1,
  LogoRate = 2,
  Style = 4,
  FillSource = 8,
  KeySource = 16,
  EnableKey = 32,
  PreMultiplied = 64,
  Clip = 128,
  Gain = 256,
  InvertKey = 512,
  Reverse = 1024,
  FlipFlop = 2048,
}

export enum MixEffects_Transition_TransitionPropertiesSetCommand_MaskFlags {
  NextStyle = 1,
  NextSelection = 2,
}

export enum MixEffects_Transition_TransitionStingerSetCommand_MaskFlags {
  Source = 1,
  PreMultipliedKey = 2,
  Clip = 4,
  Gain = 8,
  Invert = 16,
  Preroll = 32,
  ClipDuration = 64,
  TriggerPoint = 128,
  MixRate = 256,
  Durations = 480,
}

export enum MixEffects_Transition_TransitionWipeSetCommand_MaskFlags {
  Rate = 1,
  Pattern = 2,
  BorderWidth = 4,
  BorderInput = 8,
  Symmetry = 16,
  BorderSoftness = 32,
  XPosition = 64,
  YPosition = 128,
  ReverseDirection = 256,
  FlipFlop = 512,
}

export enum MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags {
  ForegroundLevel = 1,
  BackgroundLevel = 2,
  KeyEdge = 4,
  SpillSuppression = 8,
  FlareSuppression = 16,
  Brightness = 32,
  Contrast = 64,
  Saturation = 128,
  Red = 256,
  Green = 512,
  Blue = 1024,
}

export enum MixEffects_Key_MixEffectKeyAdvancedChromaSampleSetCommand_MaskFlags {
  EnableCursor = 1,
  Preview = 2,
  CursorX = 4,
  CursorY = 8,
  CursorSize = 16,
  SampledY = 32,
  SampledCb = 64,
  SampledCr = 128,
}

export enum MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags {
  Hue = 1,
  Gain = 2,
  YSuppress = 4,
  Lift = 8,
  Narrow = 16,
}

export enum MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags {
  SizeX = 1,
  SizeY = 2,
  PositionX = 4,
  PositionY = 8,
  Rotation = 16,
  BorderEnabled = 32,
  BorderShadowEnabled = 64,
  BorderBevel = 128,
  BorderOuterWidth = 256,
  BorderInnerWidth = 512,
  BorderOuterSoftness = 1024,
  BorderInnerSoftness = 2048,
  BorderBevelSoftness = 4096,
  BorderBevelPosition = 8192,
  BorderOpacity = 16384,
  BorderHue = 32768,
  BorderSaturation = 65536,
  BorderLuma = 131072,
  LightSourceDirection = 262144,
  LightSourceAltitude = 524288,
  MaskEnabled = 1048576,
  MaskTop = 2097152,
  MaskBottom = 4194304,
  MaskLeft = 8388608,
  MaskRight = 16777216,
  Rate = 33554432,
}

export enum MixEffects_Key_MixEffectKeyFlyKeyframeSetCommand_MaskFlags {
  SizeX = 1,
  SizeY = 2,
  PositionX = 4,
  PositionY = 8,
  Rotation = 16,
  OuterWidth = 32,
  InnerWidth = 64,
  OuterSoftness = 128,
  InnerSoftness = 256,
  BevelSoftness = 512,
  BevelPosition = 1024,
  BorderOpacity = 2048,
  BorderHue = 4096,
  BorderSaturation = 8192,
  BorderLuma = 16384,
  LightSourceDirection = 32768,
  LightSourceAltitude = 65536,
  MaskTop = 131072,
  MaskBottom = 262144,
  MaskLeft = 524288,
  MaskRight = 1048576,
}

export enum MixEffects_Key_MixEffectKeyFlyRunSetCommand_MaskFlags {
  OnOff = 1,
  RunToInfinite = 2,
}

export enum MixEffects_Key_MixEffectKeyLumaSetCommand_MaskFlags {
  PreMultiplied = 1,
  Clip = 2,
  Gain = 4,
  Invert = 8,
}

export enum MixEffects_Key_MixEffectKeyMaskSetCommand_MaskFlags {
  MaskEnabled = 1,
  MaskTop = 2,
  MaskBottom = 4,
  MaskLeft = 8,
  MaskRight = 16,
}

export enum MixEffects_Key_MixEffectKeyPatternSetCommand_MaskFlags {
  Pattern = 1,
  Size = 2,
  Symmetry = 4,
  Softness = 8,
  XPosition = 16,
  YPosition = 32,
  Inverse = 64,
}

export enum MixEffects_Key_MixEffectKeyTypeSetCommand_MaskFlags {
  KeyType = 1,
  FlyEnabled = 2,
}

export enum Media_MediaPlayerClipStatusSetCommand_MaskFlags {
  Playing = 1,
  Loop = 2,
  AtBeginning = 4,
  ClipFrame = 8,
}

export enum Media_MediaPlayerSourceSetCommand_MaskFlags {
  SourceType = 1,
  StillIndex = 2,
  ClipIndex = 4,
}

export enum Macro_MacroPropertiesSetCommand_MaskFlags {
  Name = 1,
  Description = 2,
}

export enum Macro_MacroRunStatusSetCommand_MaskFlags {
  Loop = 1,
}

export enum DownstreamKey_DownstreamKeyAutoV8Command_MaskFlags {
  IsTowardsOnAir = 1,
}

export enum DownstreamKey_DownstreamKeyGeneralSetCommand_MaskFlags {
  PreMultipliedKey = 1,
  Clip = 2,
  Gain = 4,
  Invert = 8,
}

export enum DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags {
  MaskEnabled = 1,
  MaskTop = 2,
  MaskBottom = 4,
  MaskLeft = 8,
  MaskRight = 16,
}

export enum Audio_AudioMixerHeadphoneSetCommand_MaskFlags {
  Gain = 1,
  ProgramOutGain = 2,
  TalkbackGain = 4,
  SidetoneGain = 8,
}

export enum Audio_AudioMixerInputSetCommand_MaskFlags {
  MixOption = 1,
  Gain = 2,
  Balance = 4,
  RcaToXlrEnabled = 8,
}

export enum Audio_AudioMixerMasterSetCommand_MaskFlags {
  Gain = 1,
  Balance = 2,
  FollowFadeToBlack = 4,
}

export enum Audio_AudioMixerMonitorSetCommand_MaskFlags {
  Enabled = 1,
  Gain = 2,
  Mute = 4,
  Solo = 8,
  SoloSource = 16,
  Dim = 32,
  DimLevel = 64,
}

export enum Audio_AudioMixerPropertiesSetCommand_MaskFlags {
  AudioFollowVideo = 1,
}

export enum Audio_AudioMixerResetPeaksCommand_MaskFlags {
  All = 1,
  Input = 2,
  Master = 4,
  Monitor = 8,
}

export enum Audio_AudioMixerTalkbackPropertiesSetCommand_MaskFlags {
  MuteSDI = 1,
}

export enum Audio_TalkbackMixerInputPropertiesSetCommand_MaskFlags {
  MuteSDI = 1,
}

export enum Audio_Fairlight_FairlightMixerInputSetCommand_MaskFlags {
  RcaToXlrEnabled = 1,
  ActiveConfiguration = 2,
}

export enum Audio_Fairlight_FairlightMixerInputSetV811Command_MaskFlags {
  ActiveConfiguration = 1,
  ActiveInputLevel = 2,
}

export enum Audio_Fairlight_FairlightMixerMasterCompressorSetCommand_MaskFlags {
  CompressorEnabled = 1,
  Threshold = 2,
  Ratio = 4,
  Attack = 8,
  Hold = 16,
  Release = 32,
}

export enum Audio_Fairlight_FairlightMixerMasterEqualizerBandSetCommand_MaskFlags {
  BandEnabled = 1,
  Shape = 2,
  FrequencyRange = 4,
  Frequency = 8,
  Gain = 16,
  QFactor = 32,
}

export enum Audio_Fairlight_FairlightMixerMasterLimiterSetCommand_MaskFlags {
  LimiterEnabled = 1,
  Threshold = 2,
  Attack = 4,
  Hold = 8,
  Release = 16,
}

export enum Audio_Fairlight_FairlightMixerMasterPropertiesSetCommand_MaskFlags {
  AudioFollowVideoCrossfadeTransitionEnabled = 1,
}

export enum Audio_Fairlight_FairlightMixerMasterSetCommand_MaskFlags {
  EqualizerEnabled = 1,
  EqualizerGain = 2,
  MakeUpGain = 4,
  Gain = 8,
  FollowFadeToBlack = 16,
}

export enum Audio_Fairlight_FairlightMixerMonitorSetCommand_MaskFlags {
  Gain = 1,
  InputMasterGain = 2,
  InputTalkbackGain = 8,
  InputSidetoneGain = 128,
}

export enum Audio_Fairlight_FairlightMixerSourceCompressorSetCommand_MaskFlags {
  CompressorEnabled = 1,
  Threshold = 2,
  Ratio = 4,
  Attack = 8,
  Hold = 16,
  Release = 32,
}

export enum Audio_Fairlight_FairlightMixerSourceEqualizerBandSetCommand_MaskFlags {
  BandEnabled = 1,
  Shape = 2,
  FrequencyRange = 4,
  Frequency = 8,
  Gain = 16,
  QFactor = 32,
}

export enum Audio_Fairlight_FairlightMixerSourceExpanderSetCommand_MaskFlags {
  ExpanderEnabled = 1,
  GateEnabled = 2,
  Threshold = 4,
  Range = 8,
  Ratio = 16,
  Attack = 32,
  Hold = 64,
  Release = 128,
}

export enum Audio_Fairlight_FairlightMixerSourceLimiterSetCommand_MaskFlags {
  LimiterEnabled = 1,
  Threshold = 2,
  Attack = 4,
  Hold = 8,
  Release = 16,
}

export enum Audio_Fairlight_FairlightMixerSourceSetCommand_MaskFlags {
  FramesDelay = 1,
  Gain = 2,
  StereoSimulation = 4,
  EqualizerEnabled = 8,
  EqualizerGain = 16,
  MakeUpGain = 32,
  Balance = 64,
  FaderGain = 128,
  MixOption = 256,
}

export type CommandTypes =
  ["LibAtem.Commands.AuxSourceGetCommand", AuxSourceGetCommand] |
  ["LibAtem.Commands.AuxSourceSetCommand", AuxSourceSetCommand] |
  ["LibAtem.Commands.ColorGeneratorGetCommand", ColorGeneratorGetCommand] |
  ["LibAtem.Commands.ColorGeneratorSetCommand", ColorGeneratorSetCommand] |
  ["LibAtem.Commands.InitializationCompleteCommand", InitializationCompleteCommand] |
  ["LibAtem.Commands.StartupStateClearCommand", StartupStateClearCommand] |
  ["LibAtem.Commands.StartupStateSaveCommand", StartupStateSaveCommand] |
  ["LibAtem.Commands.TallyByInputCommand", TallyByInputCommand] |
  ["LibAtem.Commands.TallyBySourceCommand", TallyBySourceCommand] |
  ["LibAtem.Commands.TallyChannelConfigCommand", TallyChannelConfigCommand] |
  ["LibAtem.Commands.TallyTlFcCommand", TallyTlFcCommand] |
  ["LibAtem.Commands.TimeCodeCommand", TimeCodeCommand] |
  ["LibAtem.Commands.TimeCodeRequestCommand", TimeCodeRequestCommand] |
  ["LibAtem.Commands.WarningCommand", WarningCommand] |
  ["LibAtem.Commands.SuperSource.SuperSourceBorderGetCommand", SuperSource_SuperSourceBorderGetCommand] |
  ["LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand", SuperSource_SuperSourceBorderSetCommand] |
  ["LibAtem.Commands.SuperSource.SuperSourceBoxGetCommand", SuperSource_SuperSourceBoxGetCommand] |
  ["LibAtem.Commands.SuperSource.SuperSourceBoxGetV8Command", SuperSource_SuperSourceBoxGetV8Command] |
  ["LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand", SuperSource_SuperSourceBoxSetCommand] |
  ["LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command", SuperSource_SuperSourceBoxSetV8Command] |
  ["LibAtem.Commands.SuperSource.SuperSourceCascadeCommand", SuperSource_SuperSourceCascadeCommand] |
  ["LibAtem.Commands.SuperSource.SuperSourcePropertiesGetCommand", SuperSource_SuperSourcePropertiesGetCommand] |
  ["LibAtem.Commands.SuperSource.SuperSourcePropertiesGetV8Command", SuperSource_SuperSourcePropertiesGetV8Command] |
  ["LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand", SuperSource_SuperSourcePropertiesSetCommand] |
  ["LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command", SuperSource_SuperSourcePropertiesSetV8Command] |
  ["LibAtem.Commands.Settings.DownConvertAvailableModesCommand", Settings_DownConvertAvailableModesCommand] |
  ["LibAtem.Commands.Settings.DownConvertModeGetCommand", Settings_DownConvertModeGetCommand] |
  ["LibAtem.Commands.Settings.DownConvertModeSetCommand", Settings_DownConvertModeSetCommand] |
  ["LibAtem.Commands.Settings.InputPropertiesGetCommand", Settings_InputPropertiesGetCommand] |
  ["LibAtem.Commands.Settings.InputPropertiesSetCommand", Settings_InputPropertiesSetCommand] |
  ["LibAtem.Commands.Settings.MixMinusOutputGetCommand", Settings_MixMinusOutputGetCommand] |
  ["LibAtem.Commands.Settings.MixMinusOutputSetCommand", Settings_MixMinusOutputSetCommand] |
  ["LibAtem.Commands.Settings.SDI3GLevelOutputGetCommand", Settings_SDI3GLevelOutputGetCommand] |
  ["LibAtem.Commands.Settings.SDI3GLevelOutputSetCommand", Settings_SDI3GLevelOutputSetCommand] |
  ["LibAtem.Commands.Settings.SerialPortModeCommand", Settings_SerialPortModeCommand] |
  ["LibAtem.Commands.Settings.VideoModeGetCommand", Settings_VideoModeGetCommand] |
  ["LibAtem.Commands.Settings.VideoModeSetCommand", Settings_VideoModeSetCommand] |
  ["LibAtem.Commands.Settings.Multiview.MultiviewerAvailableModesCommand", Settings_Multiview_MultiviewerAvailableModesCommand] |
  ["LibAtem.Commands.Settings.Multiview.MultiviewPropertiesGetCommand", Settings_Multiview_MultiviewPropertiesGetCommand] |
  ["LibAtem.Commands.Settings.Multiview.MultiviewPropertiesGetV8Command", Settings_Multiview_MultiviewPropertiesGetV8Command] |
  ["LibAtem.Commands.Settings.Multiview.MultiviewPropertiesSetCommand", Settings_Multiview_MultiviewPropertiesSetCommand] |
  ["LibAtem.Commands.Settings.Multiview.MultiviewPropertiesSetV8Command", Settings_Multiview_MultiviewPropertiesSetV8Command] |
  ["LibAtem.Commands.Settings.Multiview.MultiviewVuOpacityCommand", Settings_Multiview_MultiviewVuOpacityCommand] |
  ["LibAtem.Commands.Settings.Multiview.MultiviewWindowInputGetCommand", Settings_Multiview_MultiviewWindowInputGetCommand] |
  ["LibAtem.Commands.Settings.Multiview.MultiviewWindowInputSetCommand", Settings_Multiview_MultiviewWindowInputSetCommand] |
  ["LibAtem.Commands.Settings.Multiview.MultiviewWindowSafeAreaCommand", Settings_Multiview_MultiviewWindowSafeAreaCommand] |
  ["LibAtem.Commands.Settings.Multiview.MultiviewWindowVuMeterGetCommand", Settings_Multiview_MultiviewWindowVuMeterGetCommand] |
  ["LibAtem.Commands.Settings.Multiview.MultiviewWindowVuMeterSetCommand", Settings_Multiview_MultiviewWindowVuMeterSetCommand] |
  ["LibAtem.Commands.Settings.HyperDeck.HyperDeckRXCCCommand", Settings_HyperDeck_HyperDeckRXCCCommand] |
  ["LibAtem.Commands.Settings.HyperDeck.HyperDeckRXCPCommand", Settings_HyperDeck_HyperDeckRXCPCommand] |
  ["LibAtem.Commands.Settings.HyperDeck.HyperDeckRXSSCommand", Settings_HyperDeck_HyperDeckRXSSCommand] |
  ["LibAtem.Commands.Settings.HyperDeck.HyperDeckSettingsGetCommand", Settings_HyperDeck_HyperDeckSettingsGetCommand] |
  ["LibAtem.Commands.Settings.HyperDeck.HyperDeckSettingsSetCommand", Settings_HyperDeck_HyperDeckSettingsSetCommand] |
  ["LibAtem.Commands.MixEffects.FadeToBlackAutoCommand", MixEffects_FadeToBlackAutoCommand] |
  ["LibAtem.Commands.MixEffects.FadeToBlackCutCommand", MixEffects_FadeToBlackCutCommand] |
  ["LibAtem.Commands.MixEffects.FadeToBlackPropertiesGetCommand", MixEffects_FadeToBlackPropertiesGetCommand] |
  ["LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand", MixEffects_FadeToBlackRateSetCommand] |
  ["LibAtem.Commands.MixEffects.FadeToBlackStateCommand", MixEffects_FadeToBlackStateCommand] |
  ["LibAtem.Commands.MixEffects.MixEffectAutoCommand", MixEffects_MixEffectAutoCommand] |
  ["LibAtem.Commands.MixEffects.MixEffectCutCommand", MixEffects_MixEffectCutCommand] |
  ["LibAtem.Commands.MixEffects.PreviewInputGetCommand", MixEffects_PreviewInputGetCommand] |
  ["LibAtem.Commands.MixEffects.PreviewInputSetCommand", MixEffects_PreviewInputSetCommand] |
  ["LibAtem.Commands.MixEffects.ProgramInputGetCommand", MixEffects_ProgramInputGetCommand] |
  ["LibAtem.Commands.MixEffects.ProgramInputSetCommand", MixEffects_ProgramInputSetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionDipGetCommand", MixEffects_Transition_TransitionDipGetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionDipSetCommand", MixEffects_Transition_TransitionDipSetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionDVEGetCommand", MixEffects_Transition_TransitionDVEGetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand", MixEffects_Transition_TransitionDVESetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionMixGetCommand", MixEffects_Transition_TransitionMixGetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionMixSetCommand", MixEffects_Transition_TransitionMixSetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionPositionGetCommand", MixEffects_Transition_TransitionPositionGetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionPositionSetCommand", MixEffects_Transition_TransitionPositionSetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionPreviewGetCommand", MixEffects_Transition_TransitionPreviewGetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionPreviewSetCommand", MixEffects_Transition_TransitionPreviewSetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionPropertiesGetCommand", MixEffects_Transition_TransitionPropertiesGetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand", MixEffects_Transition_TransitionPropertiesSetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionStingerGetCommand", MixEffects_Transition_TransitionStingerGetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand", MixEffects_Transition_TransitionStingerSetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionWipeGetCommand", MixEffects_Transition_TransitionWipeGetCommand] |
  ["LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", MixEffects_Transition_TransitionWipeSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesGetCommand", MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesGetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand", MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaResetCommand", MixEffects_Key_MixEffectKeyAdvancedChromaResetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaSampleGetCommand", MixEffects_Key_MixEffectKeyAdvancedChromaSampleGetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaSampleSetCommand", MixEffects_Key_MixEffectKeyAdvancedChromaSampleSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaGetCommand", MixEffects_Key_MixEffectKeyChromaGetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand", MixEffects_Key_MixEffectKeyChromaSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyCutSourceSetCommand", MixEffects_Key_MixEffectKeyCutSourceSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyDVEGetCommand", MixEffects_Key_MixEffectKeyDVEGetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", MixEffects_Key_MixEffectKeyDVESetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyFillSourceSetCommand", MixEffects_Key_MixEffectKeyFillSourceSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyKeyframeGetCommand", MixEffects_Key_MixEffectKeyFlyKeyframeGetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyKeyframeSetCommand", MixEffects_Key_MixEffectKeyFlyKeyframeSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyPropertiesGetCommand", MixEffects_Key_MixEffectKeyFlyPropertiesGetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand", MixEffects_Key_MixEffectKeyFlyRunSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaGetCommand", MixEffects_Key_MixEffectKeyLumaGetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand", MixEffects_Key_MixEffectKeyLumaSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyMaskSetCommand", MixEffects_Key_MixEffectKeyMaskSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyOnAirGetCommand", MixEffects_Key_MixEffectKeyOnAirGetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyOnAirSetCommand", MixEffects_Key_MixEffectKeyOnAirSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternGetCommand", MixEffects_Key_MixEffectKeyPatternGetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand", MixEffects_Key_MixEffectKeyPatternSetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyPropertiesGetCommand", MixEffects_Key_MixEffectKeyPropertiesGetCommand] |
  ["LibAtem.Commands.MixEffects.Key.MixEffectKeyTypeSetCommand", MixEffects_Key_MixEffectKeyTypeSetCommand] |
  ["LibAtem.Commands.Media.MediaPlayerClipStatusGetCommand", Media_MediaPlayerClipStatusGetCommand] |
  ["LibAtem.Commands.Media.MediaPlayerClipStatusSetCommand", Media_MediaPlayerClipStatusSetCommand] |
  ["LibAtem.Commands.Media.MediaPlayerSourceGetCommand", Media_MediaPlayerSourceGetCommand] |
  ["LibAtem.Commands.Media.MediaPlayerSourceSetCommand", Media_MediaPlayerSourceSetCommand] |
  ["LibAtem.Commands.Media.MediaPoolAudioDescriptionCommand", Media_MediaPoolAudioDescriptionCommand] |
  ["LibAtem.Commands.Media.MediaPoolCaptureStillCommand", Media_MediaPoolCaptureStillCommand] |
  ["LibAtem.Commands.Media.MediaPoolClearAudioCommand", Media_MediaPoolClearAudioCommand] |
  ["LibAtem.Commands.Media.MediaPoolClearClipCommand", Media_MediaPoolClearClipCommand] |
  ["LibAtem.Commands.Media.MediaPoolClearStillCommand", Media_MediaPoolClearStillCommand] |
  ["LibAtem.Commands.Media.MediaPoolClipDescriptionCommand", Media_MediaPoolClipDescriptionCommand] |
  ["LibAtem.Commands.Media.MediaPoolFrameDescriptionCommand", Media_MediaPoolFrameDescriptionCommand] |
  ["LibAtem.Commands.Media.MediaPoolSetClipCommand", Media_MediaPoolSetClipCommand] |
  ["LibAtem.Commands.Media.MediaPoolSettingsGetCommand", Media_MediaPoolSettingsGetCommand] |
  ["LibAtem.Commands.Media.MediaPoolSettingsSetCommand", Media_MediaPoolSettingsSetCommand] |
  ["LibAtem.Commands.Media.MediaPoolStillSetFilenameCommand", Media_MediaPoolStillSetFilenameCommand] |
  ["LibAtem.Commands.Macro.MacroActionCommand", Macro_MacroActionCommand] |
  ["LibAtem.Commands.Macro.MacroAddTimedPauseCommand", Macro_MacroAddTimedPauseCommand] |
  ["LibAtem.Commands.Macro.MacroPropertiesGetCommand", Macro_MacroPropertiesGetCommand] |
  ["LibAtem.Commands.Macro.MacroPropertiesSetCommand", Macro_MacroPropertiesSetCommand] |
  ["LibAtem.Commands.Macro.MacroRecordCommand", Macro_MacroRecordCommand] |
  ["LibAtem.Commands.Macro.MacroRecordingStatusGetCommand", Macro_MacroRecordingStatusGetCommand] |
  ["LibAtem.Commands.Macro.MacroRunStatusSetCommand", Macro_MacroRunStatusSetCommand] |
  ["LibAtem.Commands.Macro.MacroRunStatusGetCommand", Macro_MacroRunStatusGetCommand] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyAutoCommand", DownstreamKey_DownstreamKeyAutoCommand] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyAutoV8Command", DownstreamKey_DownstreamKeyAutoV8Command] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyCutSourceSetCommand", DownstreamKey_DownstreamKeyCutSourceSetCommand] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyFillSourceSetCommand", DownstreamKey_DownstreamKeyFillSourceSetCommand] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand", DownstreamKey_DownstreamKeyGeneralSetCommand] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand", DownstreamKey_DownstreamKeyMaskSetCommand] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyOnAirSetCommand", DownstreamKey_DownstreamKeyOnAirSetCommand] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyPropertiesGetCommand", DownstreamKey_DownstreamKeyPropertiesGetCommand] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyRateSetCommand", DownstreamKey_DownstreamKeyRateSetCommand] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeySourceGetCommand", DownstreamKey_DownstreamKeySourceGetCommand] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyStateGetCommand", DownstreamKey_DownstreamKeyStateGetCommand] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyStateGetV8Command", DownstreamKey_DownstreamKeyStateGetV8Command] |
  ["LibAtem.Commands.DownstreamKey.DownstreamKeyTieSetCommand", DownstreamKey_DownstreamKeyTieSetCommand] |
  ["LibAtem.Commands.DeviceProfile.AudioMixerConfigCommand", DeviceProfile_AudioMixerConfigCommand] |
  ["LibAtem.Commands.DeviceProfile.DVEConfigCommand", DeviceProfile_DVEConfigCommand] |
  ["LibAtem.Commands.DeviceProfile.FairlightAudioMixerConfigCommand", DeviceProfile_FairlightAudioMixerConfigCommand] |
  ["LibAtem.Commands.DeviceProfile.MacroPoolConfigCommand", DeviceProfile_MacroPoolConfigCommand] |
  ["LibAtem.Commands.DeviceProfile.MediaPoolConfigCommand", DeviceProfile_MediaPoolConfigCommand] |
  ["LibAtem.Commands.DeviceProfile.MixEffectBlockConfigCommand", DeviceProfile_MixEffectBlockConfigCommand] |
  ["LibAtem.Commands.DeviceProfile.MultiviewerConfigCommand", DeviceProfile_MultiviewerConfigCommand] |
  ["LibAtem.Commands.DeviceProfile.MultiviewerConfigV8Command", DeviceProfile_MultiviewerConfigV8Command] |
  ["LibAtem.Commands.DeviceProfile.PowerStatusCommand", DeviceProfile_PowerStatusCommand] |
  ["LibAtem.Commands.DeviceProfile.ProductIdentifierCommand", DeviceProfile_ProductIdentifierCommand] |
  ["LibAtem.Commands.DeviceProfile.SuperSourceConfigCommand", DeviceProfile_SuperSourceConfigCommand] |
  ["LibAtem.Commands.DeviceProfile.SuperSourceConfigV8Command", DeviceProfile_SuperSourceConfigV8Command] |
  ["LibAtem.Commands.DeviceProfile.TopologyCommand", DeviceProfile_TopologyCommand] |
  ["LibAtem.Commands.DeviceProfile.TopologyV8Command", DeviceProfile_TopologyV8Command] |
  ["LibAtem.Commands.DeviceProfile.TopologyV811Command", DeviceProfile_TopologyV811Command] |
  ["LibAtem.Commands.DeviceProfile.VersionCommand", DeviceProfile_VersionCommand] |
  ["LibAtem.Commands.DeviceProfile.VideoMixerConfigCommand", DeviceProfile_VideoMixerConfigCommand] |
  ["LibAtem.Commands.DeviceProfile.TimecodeLockedCommand", DeviceProfile_TimecodeLockedCommand] |
  ["LibAtem.Commands.DataTransfer.DataTransferAckCommand", DataTransfer_DataTransferAckCommand] |
  ["LibAtem.Commands.DataTransfer.DataTransferCompleteCommand", DataTransfer_DataTransferCompleteCommand] |
  ["LibAtem.Commands.DataTransfer.DataTransferDataCommand", DataTransfer_DataTransferDataCommand] |
  ["LibAtem.Commands.DataTransfer.DataTransferDownloadRequestCommand", DataTransfer_DataTransferDownloadRequestCommand] |
  ["LibAtem.Commands.DataTransfer.DataTransferErrorCommand", DataTransfer_DataTransferErrorCommand] |
  ["LibAtem.Commands.DataTransfer.DataTransferFileDescriptionCommand", DataTransfer_DataTransferFileDescriptionCommand] |
  ["LibAtem.Commands.DataTransfer.DataTransferUploadContinueCommand", DataTransfer_DataTransferUploadContinueCommand] |
  ["LibAtem.Commands.DataTransfer.DataTransferUploadRequestCommand", DataTransfer_DataTransferUploadRequestCommand] |
  ["LibAtem.Commands.DataTransfer.LockObtainedCommand", DataTransfer_LockObtainedCommand] |
  ["LibAtem.Commands.DataTransfer.LockStateChangedCommand", DataTransfer_LockStateChangedCommand] |
  ["LibAtem.Commands.DataTransfer.LockStateSetCommand", DataTransfer_LockStateSetCommand] |
  ["LibAtem.Commands.CameraControl.CCstCommand", CameraControl_CCstCommand] |
  ["LibAtem.Commands.Audio.AudioMixerHeadphoneGetCommand", Audio_AudioMixerHeadphoneGetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerHeadphoneSetCommand", Audio_AudioMixerHeadphoneSetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerInputGetCommand", Audio_AudioMixerInputGetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerInputGetV8Command", Audio_AudioMixerInputGetV8Command] |
  ["LibAtem.Commands.Audio.AudioMixerInputSetCommand", Audio_AudioMixerInputSetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerLevelsCommand", Audio_AudioMixerLevelsCommand] |
  ["LibAtem.Commands.Audio.AudioMixerMasterGetCommand", Audio_AudioMixerMasterGetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerMasterSetCommand", Audio_AudioMixerMasterSetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerMonitorGetCommand", Audio_AudioMixerMonitorGetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerMonitorSetCommand", Audio_AudioMixerMonitorSetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerPropertiesGetCommand", Audio_AudioMixerPropertiesGetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerPropertiesSetCommand", Audio_AudioMixerPropertiesSetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerResetPeaksCommand", Audio_AudioMixerResetPeaksCommand] |
  ["LibAtem.Commands.Audio.AudioMixerSendLevelsCommand", Audio_AudioMixerSendLevelsCommand] |
  ["LibAtem.Commands.Audio.AudioMixerTalkbackPropertiesGetCommand", Audio_AudioMixerTalkbackPropertiesGetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerTalkbackPropertiesSetCommand", Audio_AudioMixerTalkbackPropertiesSetCommand] |
  ["LibAtem.Commands.Audio.AudioMixerTallyCommand", Audio_AudioMixerTallyCommand] |
  ["LibAtem.Commands.Audio.TalkbackMixerInputPropertiesGetCommand", Audio_TalkbackMixerInputPropertiesGetCommand] |
  ["LibAtem.Commands.Audio.TalkbackMixerInputPropertiesSetCommand", Audio_TalkbackMixerInputPropertiesSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerAnalogAudioGetCommand", Audio_Fairlight_FairlightMixerAnalogAudioGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerAnalogAudioSetCommand", Audio_Fairlight_FairlightMixerAnalogAudioSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerInputGetCommand", Audio_Fairlight_FairlightMixerInputGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerInputGetV811Command", Audio_Fairlight_FairlightMixerInputGetV811Command] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerInputSetCommand", Audio_Fairlight_FairlightMixerInputSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerInputSetV811Command", Audio_Fairlight_FairlightMixerInputSetV811Command] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterCompressorGetCommand", Audio_Fairlight_FairlightMixerMasterCompressorGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterCompressorSetCommand", Audio_Fairlight_FairlightMixerMasterCompressorSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterDynamicsResetCommand", Audio_Fairlight_FairlightMixerMasterDynamicsResetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterEqualizerBandGetCommand", Audio_Fairlight_FairlightMixerMasterEqualizerBandGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterEqualizerBandSetCommand", Audio_Fairlight_FairlightMixerMasterEqualizerBandSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterEqualizerResetCommand", Audio_Fairlight_FairlightMixerMasterEqualizerResetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterGetCommand", Audio_Fairlight_FairlightMixerMasterGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterLevelsCommand", Audio_Fairlight_FairlightMixerMasterLevelsCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterLimiterGetCommand", Audio_Fairlight_FairlightMixerMasterLimiterGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterLimiterSetCommand", Audio_Fairlight_FairlightMixerMasterLimiterSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterPropertiesGetCommand", Audio_Fairlight_FairlightMixerMasterPropertiesGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterPropertiesSetCommand", Audio_Fairlight_FairlightMixerMasterPropertiesSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterSetCommand", Audio_Fairlight_FairlightMixerMasterSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMonitorGetCommand", Audio_Fairlight_FairlightMixerMonitorGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerMonitorSetCommand", Audio_Fairlight_FairlightMixerMonitorSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerResetPeakLevelsCommand", Audio_Fairlight_FairlightMixerResetPeakLevelsCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSendLevelsCommand", Audio_Fairlight_FairlightMixerSendLevelsCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceCompressorGetCommand", Audio_Fairlight_FairlightMixerSourceCompressorGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceCompressorSetCommand", Audio_Fairlight_FairlightMixerSourceCompressorSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceDeleteCommand", Audio_Fairlight_FairlightMixerSourceDeleteCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceDynamicsResetCommand", Audio_Fairlight_FairlightMixerSourceDynamicsResetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceEqualizerBandGetCommand", Audio_Fairlight_FairlightMixerSourceEqualizerBandGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceEqualizerBandSetCommand", Audio_Fairlight_FairlightMixerSourceEqualizerBandSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceEqualizerResetCommand", Audio_Fairlight_FairlightMixerSourceEqualizerResetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceExpanderGetCommand", Audio_Fairlight_FairlightMixerSourceExpanderGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceExpanderSetCommand", Audio_Fairlight_FairlightMixerSourceExpanderSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceGetCommand", Audio_Fairlight_FairlightMixerSourceGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceLevelsCommand", Audio_Fairlight_FairlightMixerSourceLevelsCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceLimiterGetCommand", Audio_Fairlight_FairlightMixerSourceLimiterGetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceLimiterSetCommand", Audio_Fairlight_FairlightMixerSourceLimiterSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceResetPeakLevelsCommand", Audio_Fairlight_FairlightMixerSourceResetPeakLevelsCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerSourceSetCommand", Audio_Fairlight_FairlightMixerSourceSetCommand] |
  ["LibAtem.Commands.Audio.Fairlight.FairlightMixerTallyCommand", Audio_Fairlight_FairlightMixerTallyCommand];
