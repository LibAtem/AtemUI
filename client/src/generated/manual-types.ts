import * as Enums from './common-enums'

export type IVideoModeInfoSet = { [key in Enums.VideoMode]: VideoModeInfo }
export interface VideoModeInfo {
  name: string
  width: number
  height: number
  framerate: number
  // multiviewerModes: Enums.VideoMode[]
}

export const DownConvertModeNames: { [key in Enums.DownConvertMode]: string } = {
  [Enums.DownConvertMode.CentreCut]: 'Centre Cut',
  [Enums.DownConvertMode.Letterbox]: 'Letterbox',
  [Enums.DownConvertMode.Anamorphic]: 'Anamorphic',
}
export const DownConvertModeOptions = Object.entries(DownConvertModeNames).map(([id, label]) => ({
  id: Number(id),
  label,
}))
