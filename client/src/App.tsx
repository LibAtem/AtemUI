import 'bootstrap/dist/css/bootstrap.min.css'

import React, { FormEvent } from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Navbar, Nav, Form, Button, FormControl, Container, FormControlProps } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import { DevicesPage } from './Devices'
import { ManualCommandsPage } from './ManualCommands'
import { DeviceManagerContext, DeviceContext, GetDeviceId } from './DeviceManager'
import * as signalR from '@aspnet/signalr'
import { AtemDeviceInfo } from './Devices/types'

const LOCAL_STORAGE_ACTIVE_DEVICE_ID = 'AtemUI.MainContext.ActiveDeviceId'

interface AppState extends DeviceContext {
  connected: boolean
  hasConnected: boolean
}

function isDeviceAvailable(dev: AtemDeviceInfo) {
  return dev.remember && dev.enabled
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      signalR: undefined,
      devices: [],
      activeDeviceId: window.localStorage.getItem(LOCAL_STORAGE_ACTIVE_DEVICE_ID),

      connected: false,
      hasConnected: false
    }
  }

  componentDidMount() {
    const connection = new signalR.HubConnectionBuilder().withUrl('/hub').build()

    connection.on('messageReceived', (username: string, message: string) => {
      console.log(username, message)
    })

    connection.on('devices', (devices: AtemDeviceInfo[]) => {
      console.log('Devices update:', devices)
      const mutation: Partial<AppState> = { devices }

      const currentDevice = devices.find(dev => GetDeviceId(dev) === this.state.activeDeviceId)
      if (currentDevice && !isDeviceAvailable(currentDevice)) {
        console.log('Forget activeDevice')
        // Selected device is now invalid
        // mutation.activeDeviceId = null
        // TODO - is this desired behaviour?
      }

      this.setState(mutation as any)
    })

    connection.onclose(err => {
      if (err) {
        console.log('SignalR connection error:', err)
      }

      this.setState({
        connected: false
      })
    })
    this.setState({
      signalR: connection
    })
    ;(window as any).conn2 = connection

    connection
      .start()
      .then(() => {
        console.log('SignalR connected')
        this.setState({
          connected: true,
          hasConnected: true
        })
      })
      .catch(err => console.error('Connection failed', err))
  }

  renderDeviceSelection() {
    const availableDevices = this.state.devices.filter(isDeviceAvailable)

    const onChange = (e: FormEvent<FormControl & FormControlProps>) => {
      const id = availableDevices.map(dev => GetDeviceId(dev)).find(id => id === e.currentTarget.value)
      console.log('Change active device: ', id)
      this.setState({
        activeDeviceId: id || null
      })
      if (id) {
        // TODO - does this behave ok with multiple tabs?
        window.localStorage.setItem(LOCAL_STORAGE_ACTIVE_DEVICE_ID, id)
      } else {
        window.localStorage.removeItem(LOCAL_STORAGE_ACTIVE_DEVICE_ID)
      }
    }

    return (
      <FormControl as="select" className="mr-sm-2" value={this.state.activeDeviceId || '-'} onChange={onChange}>
        <option value="-">-</option>
        {availableDevices.map((dev, i) => (
          <option key={i} value={GetDeviceId(dev)}>
            {dev.info.name}
          </option>
        ))}
      </FormControl>
    )
  }

  render() {
    const { hasConnected, connected } = this.state
    return (
      <DeviceManagerContext.Provider value={this.state}>
        <div id="not-connected-overlay" style={{ display: connected ? 'none' : 'block' }}>
          <img src="/loading.svg" alt="connecting spinner" />
          <p>Connecting...</p>
        </div>
        <Router>
          <div>
            <Navbar bg="dark" variant="dark">
              <LinkContainer to="/">
                <Navbar.Brand>Atem UI</Navbar.Brand>
              </LinkContainer>
              <Nav className="mr-auto">
                <IndexLinkContainer to="/">
                  <Nav.Link>Home</Nav.Link>
                </IndexLinkContainer>
                <LinkContainer to="/commands">
                  <Nav.Link>Manual Commands</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/state">
                  <Nav.Link>State</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/devices">
                  <Nav.Link>Devices</Nav.Link>
                </LinkContainer>
              </Nav>
              <Form inline>
                {this.renderDeviceSelection()}
                <Button variant="outline-info">Search</Button>
              </Form>
            </Navbar>

            {hasConnected ? (
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/commands">
                  <ManualCommandsPage />
                </Route>
                <Route path="/devices">
                  <DevicesPage />
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

// You can think of these components as "pages"
// in your app.

function Home() {
  return (
    <Container>
      <h2>Home</h2>
    </Container>
  )
}
