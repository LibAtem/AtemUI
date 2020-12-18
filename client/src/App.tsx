import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-rangeslider/lib/index.css'
import 'react-simple-tree-menu/dist/main.css'

import React, { FormEvent } from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import { DevicesPage } from './Devices'
import { ManualCommandsPage } from './ManualCommands'
import { ControlPage } from './Control'
import { ControlSettingsPage } from './ControlSettings'
import { DeviceManagerContext, DeviceContext, GetDeviceId } from './DeviceManager'
import * as signalR from '@microsoft/signalr'
import { AtemDeviceInfo } from './Devices/types'
import { StateViewerPage } from './DeviceState'
import { DeviceProfileViewerPage } from './DeviceProfile'
import { UploadMediaPage } from './UploadMedia'
import { AudioPage } from './Audio'
import { LibAtemProfile } from './generated'
import * as objectPath from 'object-path'
import camelcase from 'camelcase'
import { AtemTransferStatus } from './Transfers/types'
import { TransfersPage } from './Transfers'

const LOCAL_STORAGE_ACTIVE_DEVICE_ID = 'AtemUI.MainContext.ActiveDeviceId'

enum ConnectionStatus {
  Disconnected,
  Connected,
  Reconnecting,
}

interface AppState extends DeviceContext {
  connected: ConnectionStatus

  // hasConnected: boolean
}

function isDeviceAvailable(dev: AtemDeviceInfo) {
  return dev.remember && dev.enabled
}

class SignalRRetryPolicy implements signalR.IRetryPolicy {
  nextRetryDelayInMilliseconds(retryContext: signalR.RetryContext): number {
    // Swift retries. This assumes it will be used on a local network
    return Math.min(1000 + retryContext.previousRetryCount * 1000, 10)
  }
}

export default class App extends React.Component<{}, AppState> {
  state = {
    signalR: new signalR.HubConnectionBuilder()
      .withUrl('/hub')
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect(new SignalRRetryPolicy())
      .build(),
    devices: [],
    transfers: [],
    activeDeviceId: window.localStorage.getItem(LOCAL_STORAGE_ACTIVE_DEVICE_ID),
    currentState: null,
    currentProfile: null,
    connected: ConnectionStatus.Disconnected,
    // hasConnected: false
  }
  updateProfile() {
    if (this.state.signalR && this.state.activeDeviceId) {
      this.state.signalR
        .invoke<LibAtemProfile.DeviceProfile>('SendProfile', this.state.activeDeviceId)
        .then((profile) => {
          console.log('ProfileUpdate: Got profile', profile)
          this.setState({ currentProfile: profile })
        })
        .catch((err) => {
          console.error('ProfileUpdate: Failed to load profile:', err)

          this.setState({ currentProfile: null })
        })
    }
  }

  componentDidMount() {
    if (this.state.signalR) {
      const connection = this.state.signalR

      connection.on('messageReceived', (username: string, message: string) => {
        console.log(username, message)
      })

      connection.on('devices', (devices: AtemDeviceInfo[]) => {
        console.log('Devices update:', devices)
        const currentDevice = devices.find((dev) => GetDeviceId(dev) === this.state.activeDeviceId)
        if (currentDevice && !isDeviceAvailable(currentDevice)) {
          console.log('Forget activeDevice')
          // Selected device is now invalid
          // mutation.activeDeviceId = null
          // TODO - is this desired behaviour?
        }

        this.setState({ devices: devices })
      })

      connection.on('transfers', (transfers: AtemTransferStatus[]) => {
        console.log('Transfers update:', transfers)
        this.setState({ transfers: transfers })
      })

      connection.on('state', (state: any) => {
        if (state.deviceId === this.state.activeDeviceId) {
          // console.log(state)
          this.setState({ currentState: state.state })
        }
      })

      connection.on('stateDiff', (state: any) => {
        if (state.deviceId === this.state.activeDeviceId && this.state.currentState) {
          const updatePath = (input: any, path: string[], newObj: any): any => {
            if (input === undefined) {
              return undefined // TODO is this ok?
            }

            const i = path.shift()
            if (i === undefined) {
              return newObj
            } else {
              const child = updatePath(input[i], path, newObj)
              if (Array.isArray(input)) {
                const res = [...input]
                res[Number(i)] = child
                return res
              } else {
                return {
                  ...input,
                  [i]: child,
                }
              }
            }
          }

          let newState = this.state.currentState
          for (const path of state.paths as string[]) {
            const path2 = path.split('.').map((p) => camelcase(p))
            const newObj = objectPath.get(state.state, path2.join('.'))

            newState = updatePath(newState, path2, newObj)
          }
          this.setState({ currentState: newState })
        }
      })

      connection.onreconnecting((err) => {
        if (err) {
          console.log('SignalR connection error:', err)
        }

        this.setState({
          connected: ConnectionStatus.Reconnecting,
        })
      })
      connection.onreconnected(() => {
        this.setState({
          connected: ConnectionStatus.Connected,
        })
      })
      connection.onclose((err) => {
        if (err) {
          console.log('SignalR connection error:', err)
        }

        this.setState({
          connected: ConnectionStatus.Disconnected,
        })
      })
      this.setState({
        signalR: connection,
      })

      connection
        .start()
        .then(() => {
          console.log('SignalR connected')
          this.setState({
            connected: ConnectionStatus.Connected,
            // hasConnected: true
          })
          this.updateProfile()
          this.setDeivce(this.state.activeDeviceId || undefined)
        })
        .catch((err) => console.error('Connection failed', err))
    }
  }

  setDeivce(id: string | undefined) {
    console.log('Change active device: ', id)
    const oldDeviceId = this.state.activeDeviceId
    if (oldDeviceId !== id && oldDeviceId) {
      this.state.signalR
        .invoke<any>('UnsubscribeState', oldDeviceId)
        .then((state) => {})
        .catch((err) => {
          console.error('StateViewer: Failed to subscribe state:', err)
        })
    }

    this.setState({
      activeDeviceId: id || null,
      currentState: null,
    })
    if (id) {
      console.log('here', id)
      if (this.state.signalR) {
        this.state.signalR
          .invoke<LibAtemProfile.DeviceProfile>('SendProfile', id)
          .then((profile) => {
            console.log('ProfileUpdate: Got profile', profile)
            this.setState({ currentProfile: profile })
          })
          .catch((err) => {
            console.error('ProfileUpdate: Failed to load profile:', err)
            this.setState({ currentProfile: null })
          })

        this.state.signalR
          .invoke<any>('SubscribeState', id)
          .then((state) => {
            this.setState({ currentState: state })
          })
          .catch((err) => {
            console.error('StateViewer: Failed to subscribe state:', err)
          })
      }

      // TODO - does this behave ok with multiple tabs?
      window.localStorage.setItem(LOCAL_STORAGE_ACTIVE_DEVICE_ID, id)
    } else {
      window.localStorage.removeItem(LOCAL_STORAGE_ACTIVE_DEVICE_ID)
    }
  }

  render() {
    const { connected } = this.state
    return (
      <DeviceManagerContext.Provider value={this.state}>
        <div
          id="not-connected-overlay"
          style={{ display: connected === ConnectionStatus.Connected ? 'none' : 'block' }}
        >
          <img src="/loading.svg" alt="connecting spinner" />
          <p>Connecting...</p>
        </div>
        <Router>
          <div className="full">
            <NavBar
              activeDeviceId={this.state.activeDeviceId}
              devices={this.state.devices}
              setDevice={(id: string | undefined) => {
                this.setDeivce(id)
              }}
            ></NavBar>
            {connected !== ConnectionStatus.Disconnected ? (
              <Switch>
                <Route exact path="/">
                  <Redirect to={{ pathname: '/control' }} />
                </Route>
                <Route path="/commands">
                  <ManualCommandsPage />
                </Route>
                <Route path="/control">
                  <ControlPage />
                </Route>
                <Route path="/settings">
                  <ControlSettingsPage />
                </Route>
                <Route path="/devices">
                  <DevicesPage />
                </Route>
                <Route path="/transfers">
                  <TransfersPage />
                </Route>
                <Route path="/state">
                  <StateViewerPage />
                </Route>
                <Route path="/profile">
                  <DeviceProfileViewerPage />
                </Route>
                <Route path="/media">
                  <UploadMediaPage />
                </Route>
                <Route path="/audio">
                  <AudioPage />
                </Route>
              </Switch>
            ) : (
              ''
            )}
          </div>
        </Router>
      </DeviceManagerContext.Provider>
    )
  }
}

class NavBar extends React.PureComponent<{
  devices: AtemDeviceInfo[]
  setDevice: (_: string | undefined) => void
  activeDeviceId: string | null
}> {
  // shouldComponentUpdate(nextProps: { devices: AtemDeviceInfo[], setDevice: (_: string | undefined) => void, activeDeviceId: string | null }) {
  //   var deviceInfoChanged = JSON.stringify(this.props.devices) !== JSON.stringify(nextProps.devices)
  //   var activeDevice = this.props.activeDeviceId !== nextProps.activeDeviceId
  //   // console.log(activeDevice,deviceInfoChanged)
  //   return deviceInfoChanged || activeDevice
  // }

  renderDeviceSelection() {
    const availableDevices = this.props.devices.filter(isDeviceAvailable)

    const onChange = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const id = availableDevices.map((dev) => GetDeviceId(dev)).find((id) => id === e.currentTarget.value)
      this.props.setDevice(id)
    }

    return (
      <FormControl as="select" className="mr-sm-2" value={this.props.activeDeviceId || '-'} onChange={onChange}>
        <option value="-">-</option>
        {availableDevices.map((dev, i) => (
          <option key={i} value={GetDeviceId(dev)}>
            {dev.connected ? `*${dev.info.name}*` : dev.info.name}
          </option>
        ))}
      </FormControl>
    )
  }

  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <LinkContainer to="/">
          <Navbar.Brand>Atem UI</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <IndexLinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </IndexLinkContainer>
            <LinkContainer to="/control">
              <Nav.Link>Control</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/settings">
              <Nav.Link>Settings</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/media">
              <Nav.Link>Media</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/audio">
              <Nav.Link>Audio</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/commands">
              <Nav.Link>Manual Commands</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/state">
              <Nav.Link>State</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/profile">
              <Nav.Link>Profile</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav className="justify-content-end">
            <LinkContainer to="/transfers">
              <Nav.Link>Transfers</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/devices">
              <Nav.Link>Devices</Nav.Link>
            </LinkContainer>
          </Nav>
          <Form inline>{this.renderDeviceSelection()}</Form>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
