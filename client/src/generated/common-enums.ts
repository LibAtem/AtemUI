/* eslint-disable*/
export enum ProtocolVersion {
  V7_2 = 131094,
  V7_X = 131097,
  V8_0 = 131100,
  V8_0_1 = 131101,
  V8_1_1 = 131102,
}

export enum AudioMixOption {
  Off = 0,
  On = 1,
  AudioFollowVideo = 2,
}

export enum FairlightAudioMixOption {
  Off = 1,
  On = 2,
  AudioFollowVideo = 4,
}

export enum FairlightEqualizerBandShape {
  LowShelf = 1,
  LowPass = 2,
  BandPass = 4,
  Notch = 8,
  HighPass = 16,
  HighShelf = 32,
}

export enum FairlightEqualizerFrequencyRange {
  Low = 1,
  MidLow = 2,
  MidHigh = 4,
  High = 8,
}

export enum FairlightInputType {
  EmbeddedWithVideo = 0,
  MediaPlayer = 1,
  AudioIn = 2,
  MADI = 4,
}

export enum FairlightInputConfiguration {
  Mono = 1,
  Stereo = 2,
  DualMono = 4,
}

export enum FairlightAudioSourceType {
  Mono = 0,
  Stereo = 1,
}

export enum FairlightAnalogInputLevel {
  Microphone = 1,
  ConsumerLine = 2,
  ProLine = 4,
}

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
  XLR = 1001,
  AESEBU = 1101,
  RCA = 1201,
  Mic1 = 1301,
  Mic2 = 1302,
  MP1 = 2001,
  MP2 = 2002,
  MP3 = 2003,
  MP4 = 2004,
}

export enum AudioSourceType {
  ExternalVideo = 0,
  MediaPlayer = 1,
  ExternalAudio = 2,
}

export enum AdjustmentDomain {
  Lens = 0,
  Camera = 1,
  ColourBars = 4,
  Chip = 8,
}

export enum CameraFeature {
  PositiveGain = 1,
  WhiteBalance = 2,
  Shutter = 5,
  Detail = 8,
  Gain = 13,
}

export enum LensFeature {
  Focus = 0,
  AutoFocus = 1,
  Iris = 2,
  Zoom = 9,
}

export enum ChipFeature {
  Lift = 0,
  Gamma = 1,
  Gain = 2,
  Aperture = 3,
  Contrast = 4,
  Lum = 5,
  HueSaturation = 6,
}

export enum CameraDetail {
  Off = 0,
  Default = 1,
  Medium = 2,
  High = 3,
}

export enum DownConvertMode {
  CentreCut = 0,
  Letterbox = 1,
  Anamorphic = 2,
}

export enum DVEEffect {
  SwooshTopLeft = 0,
  SwooshTop = 1,
  SwooshTopRight = 2,
  SwooshLeft = 3,
  SwooshRight = 4,
  SwooshBottomLeft = 5,
  SwooshBottom = 6,
  SwooshBottomRight = 7,
  SpinCWTopLeft = 8,
  SpinCWTopRight = 9,
  SpinCWBottomLeft = 10,
  SpinCWBottomRight = 11,
  SpinCCWTopLeft = 12,
  SpinCCWTopRight = 13,
  SpinCCWBottomLeft = 14,
  SpinCCWBottomRight = 15,
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
  GraphicLogoWipe = 34,
}

export enum HyperDeckStorageStatus {
  Unavailable = 0,
  Ready = 1,
}

export enum HyperDeckConnectionStatus {
  NotConnected = 0,
  Connecting = 1,
  Connected = 2,
  Incompatible = 3,
}

export enum HyperDeckPlayerState {
  Playing = 0,
  Idle = 1,
  Shuttle = 2,
  Recording = 4,
}

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
  TVStudioProHD = 9,
  TVStudioPro4K = 10,
  Constellation = 11,
  Constellation8K = 12,
  Mini = 13,
  MiniPro = 14,
  MiniProISO = 15,
}

export enum MixEffectBlockId {
  One = 0,
  Two = 1,
  Three = 2,
  Four = 3,
}

export enum MediaPlayerId {
  One = 0,
  Two = 1,
  Three = 2,
  Four = 3,
}

export enum DownstreamKeyId {
  One = 0,
  Two = 1,
  Three = 2,
  Four = 3,
}

export enum UpstreamKeyId {
  One = 0,
  Two = 1,
  Three = 2,
  Four = 3,
}

export enum SuperSourceId {
  One = 0,
  Two = 1,
}

export enum SuperSourceBoxId {
  One = 0,
  Two = 1,
  Three = 2,
  Four = 3,
}

export enum ColorGeneratorId {
  One = 0,
  Two = 1,
}

export enum FlyKeyKeyFrameId {
  One = 1,
  Two = 2,
}

export enum FlyKeyKeyFrameType {
  None = 0,
  A = 1,
  B = 2,
  Full = 3,
  RunToInfinite = 4,
}

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
  BottomRight = 9,
}

export enum TalkbackChannel {
  Production = 0,
  Engineering = 1,
}

export enum MacroOperationType {
  LoopMacro = 0,
  ProgramInput = 2,
  PreviewInput = 3,
  CutTransition = 4,
  AutoTransition = 5,
  MacroUserWait = 6,
  MacroSleep = 7,
  RunMacro = 8,
  UserResumeMacro = 9,
  StartRecordMacro = 10,
  StopRecordMacro = 11,
  VideoMode = 12,
  CameraControlVoidBool = 13,
  CameraControlByte = 14,
  CameraControl16Bit = 15,
  CameraControl32Bit = 16,
  CameraControl64Bit = 17,
  CameraControlFixedPoint16Bit = 18,
  StopMacro = 19,
  TransitionWipeSymmetry = 20,
  TransitionWipeXPosition = 21,
  TransitionWipeYPosition = 22,
  TransitionWipeSymmetryOffset = 23,
  TransitionWipeXPositionOffset = 24,
  TransitionWipeYPositionOffset = 25,
  DownConvertMode = 26,
  InputVideoPort = 27,
  ColorGeneratorHue = 28,
  ColorGeneratorSaturation = 29,
  ColorGeneratorLuminescence = 30,
  AuxiliaryInput = 31,
  MultiViewWindowInput = 32,
  MultiViewLayout = 33,
  DeleteMacro = 34,
  MacroLabel = 35,
  MacroNote = 36,
  KeyCutInput = 37,
  KeyFillInput = 38,
  KeyOnAir = 39,
  KeyType = 40,
  LumaKeyClip = 41,
  LumaKeyGain = 42,
  KeyFlyEnable = 43,
  LumaKeyInvert = 44,
  LumaKeyPreMultiply = 45,
  PatternKeyInvert = 46,
  KeyMaskEnable = 47,
  KeyMaskTop = 48,
  KeyMaskBottom = 49,
  KeyMaskLeft = 50,
  KeyMaskRight = 51,
  TransitionDVEPattern = 52,
  DVEKeyMaskEnable = 53,
  DVEKeyMaskTop = 54,
  DVEKeyMaskBottom = 55,
  DVEKeyMaskLeft = 56,
  DVEKeyMaskRight = 57,
  TransitionDVERate = 58,
  ChromaKeyClip = 59,
  ChromaKeyGain = 60,
  ChromaKeyHue = 61,
  ChromaKeyLift = 62,
  ChromaKeyNarrow = 63,
  PatternKeyPattern = 64,
  PatternKeySize = 65,
  PatternKeySoftness = 66,
  PatternKeyXPosition = 67,
  PatternKeyYPosition = 68,
  PatternKeySymmetry = 69,
  DVEAndFlyKeyRate = 70,
  DVEAndFlyKeyXSize = 71,
  DVEAndFlyKeyYSize = 72,
  MediaPlayerSourceClip = 73,
  DVEAndFlyKeyXPosition = 74,
  DVEAndFlyKeyYPosition = 75,
  DVEKeyShadowEnable = 77,
  DVEKeyBorderEnable = 78,
  DVEAndFlyKeyRotation = 79,
  FlyKeySetKeyFrame = 80,
  FlyKeyResetKeyFrame = 81,
  FlyKeyRunToFull = 82,
  FlyKeyRunToFullWithRate = 83,
  FlyKeyRunToKeyFrame = 84,
  FlyKeyRunToKeyFrameWithRate = 85,
  FlyKeyRunToInfinity = 86,
  DVEKeyShadowDirection = 88,
  DVEKeyShadowAltitude = 89,
  DVEKeyBorderHue = 90,
  DVEKeyBorderSaturation = 91,
  DVEKeyBorderLuminescence = 92,
  DVEKeyBorderBevel = 93,
  DVEKeyBorderOuterWidth = 94,
  DVEKeyBorderInnerWidth = 95,
  DVEKeyBorderOuterSoftness = 96,
  DVEKeyBorderInnerSoftness = 97,
  DVEKeyBorderOpacity = 98,
  DVEKeyBorderBevelPosition = 99,
  DVEKeyBorderBevelSoftness = 100,
  FlyKeyFrameXSize = 101,
  FlyKeyFrameYSize = 102,
  FlyKeyFrameXPosition = 103,
  FlyKeyFrameYPosition = 104,
  FlyKeyFrameRotation = 105,
  FlyKeyFrameShadowDirection = 106,
  FlyKeyFrameShadowAltitude = 107,
  FlyKeyFrameBorderHue = 108,
  FlyKeyFrameBorderSaturation = 109,
  FlyKeyFrameBorderLuminescence = 110,
  FlyKeyFrameBorderOuterWidth = 111,
  FlyKeyFrameBorderInnerWidth = 112,
  FlyKeyFrameBorderOuterSoftness = 113,
  FlyKeyFrameBorderInnerSoftness = 114,
  FlyKeyFrameBorderOpacity = 115,
  FlyKeyFrameBorderBevelPosition = 116,
  FlyKeyFrameBorderBevelSoftness = 117,
  FlyKeyFrameMaskTop = 118,
  FlyKeyFrameMaskBottom = 119,
  FlyKeyFrameMaskLeft = 120,
  FlyKeyFrameMaskRight = 121,
  TransitionWipeRate = 124,
  TransitionWipePattern = 125,
  TransitionWipeBorderWidth = 126,
  TransitionWipeBorderSoftness = 127,
  TransitionWipeBorderFillInput = 128,
  TransitionWipeAndDVEReverse = 129,
  TransitionWipeAndDVEFlipFlop = 130,
  TransitionStyle = 131,
  TransitionSource = 132,
  TransitionPosition = 133,
  TransitionPreview = 134,
  TransitionMixRate = 135,
  TransitionDipRate = 136,
  TransitionDipInput = 137,
  TransitionStingerRate = 138,
  TransitionStingerSourceNone = 139,
  TransitionStingerSourceMediaPlayer = 140,
  TransitionStingerClipDuration = 141,
  TransitionStingerTriggerPoint = 142,
  TransitionStingerMixRate = 143,
  TransitionStingerPreRoll = 144,
  TransitionStingerResetDurations = 145,
  TransitionStingerDVEClip = 146,
  TransitionStingerDVEGain = 147,
  TransitionStingerDVEInvert = 148,
  TransitionStingerDVEPreMultiply = 149,
  DownstreamKeyFillInput = 150,
  DownstreamKeyCutInput = 151,
  DownstreamKeyRate = 152,
  DownstreamKeyAuto = 153,
  DownstreamKeyOnAir = 154,
  DownstreamKeyTie = 155,
  DownstreamKeyClip = 156,
  DownstreamKeyGain = 157,
  DownstreamKeyMaskEnable = 158,
  DownstreamKeyMaskTop = 159,
  DownstreamKeyMaskBottom = 160,
  DownstreamKeyMaskLeft = 161,
  DownstreamKeyMaskRight = 162,
  DownstreamKeyInvert = 163,
  DownstreamKeyPreMultiply = 164,
  FadeToBlackRate = 165,
  FadeToBlackCut = 166,
  FadeToBlackAuto = 167,
  SuperSourceArtCutInput = 168,
  SuperSourceArtFillInput = 169,
  SuperSourceArtAbove = 170,
  SuperSourceArtPreMultiply = 171,
  SuperSourceArtClip = 172,
  SuperSourceArtGain = 173,
  SuperSourceArtInvert = 174,
  SuperSourceBorderEnable = 175,
  SuperSourceBorderHue = 176,
  SuperSourceBorderSaturation = 177,
  SuperSourceBorderLuminescence = 178,
  SuperSourceBorderBevel = 179,
  SuperSourceBorderOuterWidth = 180,
  SuperSourceBorderInnerWidth = 181,
  SuperSourceBorderOuterSoftness = 182,
  SuperSourceBorderInnerSoftness = 183,
  SuperSourceBorderBevelPosition = 184,
  SuperSourceBorderBevelSoftness = 185,
  SuperSourceShadowDirection = 186,
  SuperSourceShadowAltitude = 187,
  SuperSourceBoxEnable = 188,
  SuperSourceBoxInput = 189,
  SuperSourceBoxXPosition = 190,
  SuperSourceBoxYPosition = 191,
  SuperSourceBoxSize = 192,
  SuperSourceBoxMaskEnable = 193,
  SuperSourceBoxMaskTop = 194,
  SuperSourceBoxMaskBottom = 195,
  SuperSourceBoxMaskLeft = 196,
  SuperSourceBoxMaskRight = 197,
  AudioMixerInputMixType = 198,
  AudioMixerInputGain = 199,
  AudioMixerInputBalance = 200,
  AudioMixerMasterOutGain = 201,
  AudioMixerMasterOutBalance = 202,
  AudioMixerMasterOutFollowFadeToBlackMixEffectBlock1 = 203,
  AudioMixerMonitorOut = 204,
  AudioMixerMonitorOutGain = 205,
  AudioMixerMonitorOutMute = 206,
  AudioMixerMonitorOutSolo = 207,
  AudioMixerMonitorOutSoloInput = 208,
  AudioMixerMonitorOutDim = 209,
  AudioMixerMonitorOutDimLevel = 210,
  AudioMixerInputResetPeaks = 211,
  AudioMixerInputResetAllPeaks = 212,
  AudioMixerMasterOutResetPeaks = 213,
  AudioMixerMonitorOutResetPeaks = 214,
  TransitionDVEFillInput = 215,
  TransitionDVECutInput = 216,
  TransitionDVECutInputEnable = 217,
  MediaPlayerSourceStillIndex = 218,
  MediaPlayerSourceClipIndex = 219,
  MediaPlayerGoToBeginning = 220,
  MediaPlayerGoToFrame = 221,
  MediaPlayerPlay = 222,
  MediaPlayerPause = 223,
  MediaPlayerLoop = 224,
  MediaPlayerSourceStill = 225,
  PatternKeySizeOffset = 226,
  PatternKeyXPositionOffset = 227,
  PatternKeyYPositionOffset = 228,
  DVEAndFlyKeyXSizeOffset = 229,
  DVEAndFlyKeyYSizeOffset = 230,
  DVEAndFlyKeyXPositionOffset = 231,
  DVEAndFlyKeyYPositionOffset = 232,
  SuperSourceBoxXPositionOffset = 233,
  SuperSourceBoxYPositionOffset = 234,
  SuperSourceBoxSizeOffset = 235,
  MediaPlayerPlayFromBeginning = 236,
  PtzRs422ViscaSetPanVelocity = 237,
  PtzRs422ViscaSetTiltVelocity = 238,
  PtzRs422ViscaSetZoomVelocity = 239,
  PtzRs422ViscaUpdatePanTiltPosition = 240,
  PtzRs422ViscaUpdateZoomPosition = 241,
  PtzRs422ViscaGotoPanTiltPosition = 242,
  PtzRs422ViscaGotoZoomPosition = 243,
  PtzRs422ViscaAllocateAddresses = 244,
  PtzRs422ViscaBaudRate = 245,
  GvgReadCrosspointPrgmBkgd = 246,
  GvgReadCrosspointPresetBkgd = 247,
  GvgReadCrosspointKey = 248,
  GvgReadWipePattern = 249,
  GvgReadTransitionMode = 250,
  GvgReadTransitionRateAutoTrans = 251,
  GvgReadTransitionRateDskMix = 252,
  GvgReadTransitionRateFadeToBlack = 253,
  GvgReadLampStatusMap = 254,
  GvgReadAnalogControl = 255,
  GvgReadPushButtonLampControl = 256,
  GvgReadFieldMode = 257,
  GvgReadSoftwareVersion = 258,
  SetSerialPortFunction = 259,
  ToggleTransitionWipeAndDVEReverse = 260,
  ToggleKeyMaskEnable = 261,
  ToggleKeyOnAir = 262,
  ToggleLumaKeyInvert = 263,
  ToggleDVEKeyBorderEnable = 264,
  ToggleDVEKeyShadowEnable = 265,
  ToggleDownstreamKeyOnAir = 266,
  ToggleDownstreamKeyTie = 267,
  ToggleDownstreamKeyInvert = 268,
  ToggleDownstreamKeyMaskEnable = 269,
  ToggleTransitionSource = 270,
  AudioMixerTalkbackMuteSDI = 271,
  HyperDeckSetIPv4Address = 272,
  HyperDeckSetSourceClipIndex = 273,
  HyperDeckGoToPositionDelta = 274,
  HyperDeckUpdatePosition = 275,
  HyperDeckGoToPosition = 276,
  HyperDeckSetLoop = 277,
  HyperDeckSetSpeed = 278,
  HyperDeckPlay = 279,
  HyperDeckStop = 280,
  HyperDeckRecord = 281,
  HyperDeckSetInput = 282,
  HyperDeckSetSingleClip = 283,
  HyperDeckSetSourceSlotIndex = 284,
  HyperDeckSetRollOnTake = 285,
  HyperDeckSetRollOnTakeFrameDelay = 286,
  MultiViewVuMeterEnable = 287,
  MultiViewVuMeterOpacity = 288,
  MultiViewSafeAreaEnable = 289,
  MultiViewPgmPvwSwap = 290,
  AudioMixerHeadphoneOutGain = 291,
  AudioMixerHeadphoneOutMasterGain = 292,
  AudioMixerHeadphoneOutTalkbackGain = 293,
  AudioMixerHeadphoneOutSidetoneGain = 294,
  AudioMixerInputTalkbackMuteSDI = 295,
  MixMinusSetAudioMode = 296,
  AudioMixerAfvFollowTransition = 299,
  SuperSourceV2ArtCutInput = 396,
  SuperSourceV2ArtFillInput = 397,
  SuperSourceV2ArtAbove = 398,
  SuperSourceV2ArtPreMultiply = 399,
  SuperSourceV2ArtClip = 400,
  SuperSourceV2ArtGain = 401,
  SuperSourceV2ArtInvert = 402,
  SuperSourceV2BorderEnable = 403,
  SuperSourceV2BorderHue = 404,
  SuperSourceV2BorderSaturation = 405,
  SuperSourceV2BorderLuminescence = 406,
  SuperSourceV2BorderBevel = 407,
  SuperSourceV2BorderOuterWidth = 408,
  SuperSourceV2BorderInnerWidth = 409,
  SuperSourceV2BorderOuterSoftness = 410,
  SuperSourceV2BorderInnerSoftness = 411,
  SuperSourceV2BorderBevelPosition = 412,
  SuperSourceV2BorderBevelSoftness = 413,
  SuperSourceV2ShadowDirection = 414,
  SuperSourceV2ShadowAltitude = 415,
  SuperSourceV2BoxEnable = 416,
  SuperSourceV2BoxInput = 417,
  SuperSourceV2BoxXPosition = 418,
  SuperSourceV2BoxYPosition = 419,
  SuperSourceV2BoxSize = 420,
  SuperSourceV2BoxMaskEnable = 421,
  SuperSourceV2BoxMaskTop = 422,
  SuperSourceV2BoxMaskBottom = 423,
  SuperSourceV2BoxMaskLeft = 424,
  SuperSourceV2BoxMaskRight = 425,
}

export enum MeAvailability {
  None = 0,
  Me1 = 1,
  Me2 = 2,
  Me3 = 4,
  Me4 = 8,
  All = 15,
}

export enum MediaPlayerSource {
  Still = 1,
  Clip = 2,
}

export enum MediaPoolFileType {
  Still = 0,
  Clip1 = 1,
  Clip2 = 2,
  Clip3 = 3,
  Clip4 = 4,
}

export enum MixEffectKeyType {
  Luma = 0,
  Chroma = 1,
  Pattern = 2,
  DVE = 3,
}

export enum MixMinusMode {
  ProgramOut = 1,
  MixMinus = 2,
}

export enum MultiViewLayout {
  ProgramTop = 0,
  ProgramBottom = 1,
  ProgramLeft = 2,
  ProgramRight = 3,
}

export enum MultiViewLayoutV8 {
  Default = 0,
  TopLeftSmall = 1,
  TopRightSmall = 2,
  ProgramBottom = 3,
  BottomLeftSmall = 4,
  ProgramRight = 5,
  BottomRightSmall = 8,
  ProgramLeft = 10,
  ProgramTop = 12,
}

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
  TopRightDiagonal = 17,
}

export enum BorderBevel {
  None = 0,
  InOut = 1,
  In = 2,
  Out = 3,
}

export enum InternalPortType {
  External = 0,
  Black = 1,
  ColorBars = 2,
  ColorGenerator = 3,
  MediaPlayerFill = 4,
  MediaPlayerKey = 5,
  SuperSource = 6,
  ExternalDirect = 7,
  MEOutput = 128,
  Auxiliary = 129,
  Mask = 130,
  MultiViewer = 131,
}

export enum VideoPortType {
  None = 0,
  SDI = 1,
  HDMI = 2,
  Component = 4,
  Composite = 8,
  SVideo = 16,
  Internal = 256,
}

export enum AudioPortType {
  Unknown = 0,
  SDI = 1,
  HDMI = 2,
  XLR = 32,
  AESEBU = 64,
  RCA = 128,
  Internal = 256,
  TSJack = 512,
  MADI = 1024,
  TRSJack = 2048,
}

export enum MacroPortType {
  SDI = 0,
  HDMI = 1,
  Component = 2,
}

export enum RecordingError {
  NoMedia = 0,
  None = 2,
  MediaFull = 4,
  MediaError = 8,
  MediaUnformatted = 16,
  DroppingFrames = 32,
  Unknown = 32768,
}

export enum RecordingStatus {
  Idle = 0,
  Recording = 1,
  Stopping = 128,
}

export enum RecordingDiskStatus {
  Idle = 1,
  Unformatted = 2,
  Active = 4,
  Recording = 8,
}

export enum SDI3GOutputLevel {
  LevelB = 0,
  LevelA = 1,
}

export enum SerialMode {
  None = 0,
  PtzVisca = 1,
  Gvg100 = 2,
}

export enum SourceAvailability {
  None = 0,
  Auxiliary = 1,
  Multiviewer = 2,
  SuperSourceArt = 4,
  SuperSourceBox = 8,
  KeySource = 16,
  All = 31,
}

export enum StingerSource {
  None = 0,
  MediaPlayer1 = 1,
  MediaPlayer2 = 2,
  MediaPlayer3 = 3,
  MediaPlayer4 = 4,
}

export enum StreamingError {
  None = 0,
  InvalidState = 16,
  Unknown = 32768,
}

export enum StreamingStatus {
  Idle = 1,
  Connecting = 2,
  Streaming = 4,
  Stopping = 32,
}

export enum SuperSourceArtOption {
  Background = 0,
  Foreground = 1,
}

export enum TimeCodeMode {
  FreeRun = 0,
  TimeOfDay = 1,
}

export enum TransitionLayer {
  Background = 1,
  Key1 = 2,
  Key2 = 4,
  Key3 = 8,
  Key4 = 16,
}

export enum TransitionStyle {
  Mix = 0,
  Dip = 1,
  Wipe = 2,
  DVE = 3,
  Stinger = 4,
}

export enum VideoModeStandard {
  SDISD = 0,
  SDIHD = 1,
  SDIHDProgressive = 2,
  HDMI = 3,
  SDI3G = 4,
  SDI6G = 5,
  SDI12G = 6,
  SDI24G = 7,
}

export enum VideoModeResolution {
  NTSC = 0,
  PAL = 1,
  _720 = 2,
  _1080 = 3,
  _4K = 4,
  _8K = 5,
}

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
  N1080p60 = 27,
}

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
  Key5Mask = 4050,
  Key6Mask = 4060,
  Key7Mask = 4070,
  Key8Mask = 4080,
  Key9Mask = 4090,
  Key10Mask = 4100,
  Key11Mask = 4110,
  Key12Mask = 4120,
  Key13Mask = 4130,
  Key14Mask = 4140,
  Key15Mask = 4150,
  Key16Mask = 4160,
  DSK1Mask = 5010,
  DSK2Mask = 5020,
  DSK3Mask = 5030,
  DSK4Mask = 5040,
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
  Input1Direct = 11001,
}

