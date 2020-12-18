import React from 'react'
import { AtemDeviceInfo } from './Devices/types'
import { LibAtemState, LibAtemProfile } from './generated'
import { AtemTransferStatus } from './Transfers/types'

export interface DeviceContext {
  signalR: signalR.HubConnection | undefined
  devices: AtemDeviceInfo[]
  transfers: AtemTransferStatus[]
  activeDeviceId: string | null
  currentState: LibAtemState.AtemState | null
  currentProfile: LibAtemProfile.DeviceProfile | null
}

export const DeviceManagerContext = React.createContext<DeviceContext>({
  signalR: undefined,
  devices: [],
  transfers: [],
  activeDeviceId: null,
  currentState: null,
  currentProfile: null,
})

export function GetDeviceId(dev: AtemDeviceInfo): string {
  return `${dev.info.address}:${dev.info.port}`
}

export function GetActiveDevice(context: DeviceContext): AtemDeviceInfo | undefined {
  if (context.activeDeviceId) {
    return context.devices.find((dev) => GetDeviceId(dev) === context.activeDeviceId)
  } else {
    return undefined
  }
}
