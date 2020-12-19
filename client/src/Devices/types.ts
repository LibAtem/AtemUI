// Note: Copy of the C# types
export interface AtemDeviceInfo {
  info: {
    name: string
    deviceId: string
    lastSeen: string // TODO
    address: string
    port: number
    strings: string[]
  }
  enabled: boolean
  remember: boolean

  connected: boolean
  version?: string
}

export type AtemDeviceMap = { [deviceId: string]: AtemDeviceInfo | undefined }
