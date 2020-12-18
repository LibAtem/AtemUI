import React from 'react'
import { DeviceManagerContext, GetActiveDevice, GetDeviceId } from './DeviceManager'
import { AtemDeviceInfo } from './Devices/types'
import { Row, Col, Container } from 'react-bootstrap'
import { CommandTypes } from './generated/commands'
import Moment from 'react-moment'

export abstract class DevicePageWrapper extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>

  static contextType = DeviceManagerContext

  render() {
    const device = GetActiveDevice(this.context)
    if (device) {
      if (device.connected && this.context.signalR) {
        return <div key={this.context.activeDeviceId || ''}>{this.renderContent(device, this.context.signalR)}</div>
      } else {
        return <NotConnected device={device} />
      }
    } else {
      return <NoDevice />
    }
  }

  abstract renderContent(device: AtemDeviceInfo, signalR: signalR.HubConnection): JSX.Element
}

function NoDevice(props: {}) {
  return (
    <div className="page-content">
      <Container>
        <Row className="splash-page">
          <Col sm={12}>
            <h1>No device is selected</h1>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

function NotConnected(props: { device: AtemDeviceInfo }) {
  return (
    <div className="page-content">
      <Container>
        <Row className="splash-page">
          <Col sm={12}>
            <h3>Device is not connected</h3>
            <p>
              Last seen <Moment fromNow date={props.device.info.lastSeen} />
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export interface PropsBase {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
}

export type SendCommandArgs = { [key: string]: string | number | boolean }
export type SendCommand = (commandName: string, args: SendCommandArgs) => void

export function sendCommand(props: PropsBase, command: string, value: SendCommandArgs) {
  const { device, signalR } = props
  if (device.connected) {
    const devId = GetDeviceId(device)

    signalR
      .invoke<void>('CommandSend', devId, command, JSON.stringify(value))
      .then(() => {
        console.log(value)
        console.log('Control: sent')
        console.log(command)
      })
      .catch((e) => {
        console.log('Control: Failed to send', e)
      })
  }
}

export type SendCommandStrict = (...args: CommandTypes) => void
export function sendCommandStrict(props: PropsBase, ...rawArgs: CommandTypes): void {
  const { device, signalR } = props
  if (device.connected) {
    const devId = GetDeviceId(device)

    const [command, args] = rawArgs
    signalR
      .invoke<void>('CommandSend', devId, command, JSON.stringify(args))
      .then(() => {
        console.log(args)
        console.log('Control: sent')
        console.log(command)
      })
      .catch((e) => {
        console.log('Control: Failed to send', e)
      })
  }
}
