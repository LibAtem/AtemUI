import * as Enums from './common-enums'

export type IVideoModeInfoSet = { [key in Enums.VideoMode]: VideoModeInfo }
export interface VideoModeInfo {
  name: string
  width: number
  height: number
  framerate: number
  // multiviewerModes: Enums.VideoMode[]
}
