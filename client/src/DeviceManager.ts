import React from 'react'
import { AtemDeviceInfo } from './Devices/types'

export interface DeviceContext {
  signalR: signalR.HubConnection | undefined
  devices: AtemDeviceInfo[]
  activeDeviceId: string | null
  currentState: LibAtem.AtemState | null
  currentProfile: LibAtem.DeviceProfile | null
}

export const DeviceManagerContext = React.createContext<DeviceContext>({
  signalR: undefined,
  devices: [],
  activeDeviceId: null,
  currentState: null,
  currentProfile: null
})

export function GetDeviceId(dev: AtemDeviceInfo) {
  return `${dev.info.address}:${dev.info.port}`
}

export function GetActiveDevice(context: DeviceContext) {
  if (context.activeDeviceId) {
    return context.devices.find(dev => GetDeviceId(dev) === context.activeDeviceId)
  } else {
    return undefined
  }
}
