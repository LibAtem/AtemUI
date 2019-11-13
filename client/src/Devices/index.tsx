import React from 'react'
import { Container, Table, ButtonGroup, Button, Modal, Form, Row, Col } from 'react-bootstrap'
import ReactPolling from 'react-polling'
import { AtemDeviceInfo } from './types'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheck, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'
import update from 'immutability-helper'

interface DevicesTableProps {
  devices: AtemDeviceInfo[]

  isDiscoveredDevices: boolean

  onChangeDevice: (dev: AtemDeviceInfo, diff: Partial<Pick<AtemDeviceInfo, 'enabled' | 'remember'>>) => void
  onForgetDevice: (dev: AtemDeviceInfo) => void
}

class DevicesTable extends React.Component<DevicesTableProps> {
  render() {
    /*
        Perhaps the tables should include some stuff like protocol versions?
    */
    return (
      <Table striped>
        <thead>
          <tr>
            <td>Name</td>
            <td>Address</td>
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
              <td>{moment(dev.info.lastSeen).format('HH:mm:ss DD-MM-YYYY')}</td>
              <td>{this.renderButtons(dev)}</td>
            </tr>
          ))}
          {this.props.devices.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
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
    console.log(`Devices: Adding ${dev}`)

    fetch('/api/devices', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        address: dev.info.address,
        port: dev.info.port
      })
    })
      .then(() => {
        // Track it on the state
        this.props.onChangeDevice(dev, {
          remember: true
        })
      })
      .catch(e => {
        console.log('Devices: Failed to remember', e)
      })
  }
  private onEnableDevice(dev: AtemDeviceInfo) {
    console.log(`Devices: Enabling ${dev}`)

    fetch('/api/devices/enable', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        address: dev.info.address,
        port: dev.info.port
      })
    })
      .then(() => {
        // Track it on the state
        this.props.onChangeDevice(dev, {
          enabled: true
        })
      })
      .catch(e => {
        console.log('Devices: Failed to enable', e)
      })
  }
  private onDisableDevice(dev: AtemDeviceInfo) {
    console.log(`Devices: Disabling ${dev}`)

    fetch('/api/devices/disable', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        address: dev.info.address,
        port: dev.info.port
      })
    })
      .then(() => {
        // Track it on the state
        this.props.onChangeDevice(dev, {
          enabled: false
        })
      })
      .catch(e => {
        console.log('Devices: Failed to disable', e)
      })
  }
  private onForgetDevice(dev: AtemDeviceInfo) {
    console.log(`Devices: Forgetting ${dev}`)

    fetch('/api/devices', {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        address: dev.info.address,
        port: dev.info.port
      })
    })
      .then(() => {
        // Track it on the state
        this.props.onForgetDevice(dev)
      })
      .catch(e => {
        console.log('Devices: Failed to forget', e)
      })
  }
}

interface DevicesState {
  devices: AtemDeviceInfo[]

  showAddModal: boolean
  addAddress: string
  addPort: number
}

export class DevicesPage extends React.Component<{}, DevicesState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      devices: [],
      showAddModal: false,
      addAddress: '',
      addPort: 9910
    }
  }

  render() {
    return (
      <Container>
        <h2>Devices</h2>

        <ReactPolling
          url={'/api/devices'}
          method={'GET'}
          interval={1000}
          onSuccess={data => {
            this.setState({ devices: data })
            return true
          }}
          render={({ isPolling }) => {
            if (isPolling) {
              const discoveredDevices = this.state.devices.filter(d => !d.remember)
              const mainDevices = this.state.devices.filter(d => d.remember)
              return (
                <div>
                  <h2>Main devices</h2>
                  <DevicesTable
                    devices={mainDevices}
                    isDiscoveredDevices={false}
                    onChangeDevice={this.onChangeDevice}
                    onForgetDevice={this.onForgetDevice}
                  />

                  <h2>Discovered devices</h2>
                  <DevicesTable
                    devices={discoveredDevices}
                    isDiscoveredDevices={true}
                    onChangeDevice={this.onChangeDevice}
                    onForgetDevice={this.onForgetDevice}
                  />

                  {this.renderAddModal()}
                </div>
              )
            } else {
              return <div>Device polling stopped...</div>
            }
          }}
        />
      </Container>
    )
  }
  private renderAddModal() {
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

        fetch('/api/devices', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            address,
            port
          })
        })
          .then(() => {
            // Track it on the state
            this.setState({
              devices: update(this.state.devices, {
                $push: [
                  {
                    info: {
                      name: `${address}:${port}`,
                      deviceId: `${address}:${port}`,
                      lastSeen: '',
                      address: address,
                      port: port,
                      strings: []
                    },
                    remember: true,
                    enabled: true
                  }
                ]
              })
            })
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

  private matchDeviceId(dev1: AtemDeviceInfo, dev2: AtemDeviceInfo) {
    return dev1.info.address !== dev2.info.address && dev1.info.port !== dev2.info.port
  }

  private onChangeDevice(dev: AtemDeviceInfo, diff: Partial<AtemDeviceInfo>) {
    this.setState({
      devices: this.state.devices.map(d => {
        if (this.matchDeviceId(d, dev)) {
          return {
            ...d,
            ...dev
          }
        } else {
          return d
        }
      })
    })
  }
  private onForgetDevice(dev: AtemDeviceInfo) {
    this.setState({
      devices: this.state.devices.filter(d => this.matchDeviceId(d, dev))
    })
  }
}
