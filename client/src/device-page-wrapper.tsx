import React from 'react'
import { DeviceManagerContext, GetActiveDevice } from './DeviceManager'
import { AtemDeviceInfo } from './Devices/types'
import { Row, Col, Container } from 'react-bootstrap'

export abstract class DevicePageWrapper extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>

  static contextType = DeviceManagerContext

  render() {
    const device = GetActiveDevice(this.context)
    if (device) {
      if (device.connected && this.context.signalR) {
        return <div key={this.context.activeDeviceId || ''}>{this.renderContent(device, this.context.signalR)}</div>
      } else {
        return <NotConnected />
      }
    } else {
      return <NoDevice />
    }
  }

  abstract renderContent(device: AtemDeviceInfo, signalR: signalR.HubConnection): JSX.Element
}

function NoDevice(props: {}) {
  return (
    <Container>
      <Row>
        <Col sm={12}>
          <h1>No device is selected</h1>
        </Col>
      </Row>
    </Container>
  )
}

function NotConnected(props: {}) {
  return (
    <Container>
      <Row>
        <Col sm={12}>
          <h1>Device is not connected</h1>
        </Col>
      </Row>
    </Container>
  )
}
