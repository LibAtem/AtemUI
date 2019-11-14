import React from 'react'
import { AtemDeviceInfo } from './Devices/types'

export interface DeviceContext {
  signalR: signalR.HubConnection | undefined
  devices: AtemDeviceInfo[]
}

export const DeviceManagerContext = React.createContext<DeviceContext>({
  signalR: undefined,
  devices: []
})
