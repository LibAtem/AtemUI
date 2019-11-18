import React from 'react'
import { Container, Table, ButtonGroup, Button, Modal, Form, Row, Col } from 'react-bootstrap'
import { AtemDeviceInfo } from './types'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheck, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'
import { DeviceManagerContext } from '../DeviceManager'

interface DevicesTableProps {
  connection: signalR.HubConnection
  devices: AtemDeviceInfo[]

  isDiscoveredDevices: boolean
}

class DevicesTable extends React.Component<DevicesTableProps> {
  render() {
    const getStatusString = (dev: AtemDeviceInfo) => {
      if (!dev.enabled) {
        return ''
      } else {
        let str = dev.connected ? 'Connected' : 'Disconnected'

        if (dev.version) {
          str += ` - ${dev.version}`
        }

        return str
      }
    }
    /*
        Perhaps the tables should include some stuff like protocol versions?
    */
    return (
      <Table striped>
        <thead>
          <tr>
            <td>Name</td>
            <td>Address</td>
            <td>Status</td>
            <td>Last Seen</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {this.props.devices.map(dev => (
            <tr key={`${dev.info.address}:${dev.info.port}`}>
              <td>{dev.info.name}</td>
              <td>
                {dev.info.address}:{dev.info.port}
              </td>
              <td>{getStatusString(dev)}</td>
              <td>{moment(dev.info.lastSeen).format('HH:mm:ss DD-MM-YYYY')}</td>
              <td>{this.renderButtons(dev)}</td>
            </tr>
          ))}
          {this.props.devices.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                No devices
              </td>
            </tr>
          ) : (
            ''
          )}
        </tbody>
      </Table>
    )
  }
  private renderButtons(dev: AtemDeviceInfo) {
    if (this.props.isDiscoveredDevices) {
      return (
        <ButtonGroup>
          <Button variant="primary" title="Add Device" onClick={() => this.onRememberDevice(dev)}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </ButtonGroup>
      )
    } else {
      return (
        <ButtonGroup>
          {dev.enabled ? (
            <Button variant="success" title="Disable Device" onClick={() => this.onDisableDevice(dev)}>
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          ) : (
            <Button variant="warning" title="Enable Device" onClick={() => this.onEnableDevice(dev)}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          )}

          <Button variant="danger" title="Forget Device" onClick={() => this.onForgetDevice(dev)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </ButtonGroup>
      )
    }
  }

  private onRememberDevice(dev: AtemDeviceInfo) {
    console.log(`Devices: Adding`, dev)

    this.props.connection
      .invoke('deviceAdd', dev.info.address, dev.info.port)
      .then(() => {
        console.log('Devices: add')
      })
      .catch(e => {
        console.log('Devices: Failed to remember', e)
      })
  }
  private onEnableDevice(dev: AtemDeviceInfo) {
    console.log(`Devices: Enabling`, dev)

    this.props.connection
      .invoke('deviceEnabled', dev.info.address, dev.info.port, true)
      .then(() => {
        console.log('Devices: enabled')
      })
      .catch(e => {
        console.log('Devices: Failed to enable', e)
      })
  }
  private onDisableDevice(dev: AtemDeviceInfo) {
    console.log(`Devices: Disabling`, dev)

    this.props.connection
      .invoke('deviceEnabled', dev.info.address, dev.info.port, false)
      .then(() => {
        console.log('Devices: disabled')
      })
      .catch(e => {
        console.log('Devices: Failed to disable', e)
      })
  }
  private onForgetDevice(dev: AtemDeviceInfo) {
    console.log(`Devices: Forgetting`, dev)

    this.props.connection
      .invoke('deviceForget', dev.info.address, dev.info.port)
      .then(() => {
        console.log('Devices: forget')
      })
      .catch(e => {
        console.log('Devices: Failed to forget', e)
      })
  }
}

interface DevicesState {
  // devices: AtemDeviceInfo[]

  showAddModal: boolean
  addAddress: string
  addPort: number
}

export class DevicesPage extends React.Component<{}, DevicesState> {
  // declare context: React.ContextType<typeof DeviceManagerContext>
  context!: React.ContextType<typeof DeviceManagerContext>
  static contextType = DeviceManagerContext

  constructor(props: {}) {
    super(props)

    this.state = {
      // devices: [],
      showAddModal: false,
      addAddress: '',
      addPort: 9910
    }
  }

  render() {
    const { devices, signalR } = this.context

    const discoveredDevices = devices.filter(d => !d.remember)
    const mainDevices = devices.filter(d => d.remember)

    if (!signalR) {
      return (
        <Container>
          <h2>Devices</h2>

          <p>Not connected</p>
        </Container>
      )
    }

    return (
      <Container>
        <h2>Devices</h2>

        <div>
          <h2>Main devices</h2>
          <DevicesTable connection={signalR} devices={mainDevices} isDiscoveredDevices={false} />

          <h2>Discovered devices</h2>
          <DevicesTable connection={signalR} devices={discoveredDevices} isDiscoveredDevices={true} />

          {this.renderAddModal(signalR)}
        </div>
      </Container>
    )
  }
  private renderAddModal(connection: signalR.HubConnection) {
    const handleClose = () => this.setState({ showAddModal: false })
    const handleShow = () => this.setState({ showAddModal: true })

    const addModalAddress = React.createRef<HTMLInputElement>()
    const addModalPort = React.createRef<HTMLInputElement>()

    const addDevice = () => {
      console.log('Devices: Add click')

      const currentAddressControl = addModalAddress.current
      const currentPortControl = addModalPort.current

      if (currentAddressControl && currentPortControl) {
        const address = currentAddressControl.value
        const port = parseInt(currentPortControl.value, 10)

        console.log(`Devices: Trying to add ${address}:${port}`)

        if (address === '' || port === 0 || isNaN(port)) {
          // Ignore case of defaults?
          return
        }

        connection
          .invoke('deviceAdd', address, port)
          .then(() => {
            console.log('Devices: added')
          })
          .catch(e => {
            console.log('Devices: Failed to add', e)
          })
      }

      return handleClose()
    }

    return (
      <div>
        <Button variant="primary" onClick={handleShow}>
          Add Device
        </Button>

        <Modal show={this.state.showAddModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Device</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} controlId="formAddress">
                <Form.Label column sm="2">
                  Address
                </Form.Label>
                <Col sm="10">
                  <Form.Control type="text" ref={addModalAddress as any} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPort">
                <Form.Label column sm="2">
                  Port
                </Form.Label>
                <Col sm="10">
                  <Form.Control type="number" defaultValue="9910" ref={addModalPort as any} />
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={addDevice}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
