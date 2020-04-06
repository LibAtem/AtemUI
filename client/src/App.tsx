import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-rangeslider/lib/index.css'
// import 'react-simple-tree-menu/dist/main.css'

import React, { FormEvent } from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Navbar, Nav, Form, Button, FormControl, Container, FormControlProps } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import { DevicesPage } from './Devices'
import { ManualCommandsPage } from './ManualCommands'
import { ControlPage } from './Control'
import { ControlSettingsPage } from './ControlSettings'
import { DeviceManagerContext, DeviceContext, GetDeviceId } from './DeviceManager'
import * as signalR from '@microsoft/signalr'
import { AtemDeviceInfo } from './Devices/types'
import { StateViewerPage } from './State'

const LOCAL_STORAGE_ACTIVE_DEVICE_ID = 'AtemUI.MainContext.ActiveDeviceId'

enum ConnectionStatus {
  Disconnected,
  Connected,
  Reconnecting
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
    signalR:  new signalR.HubConnectionBuilder()
    .withUrl('/hub')
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect(new SignalRRetryPolicy())
    .build(),
      devices: [] as AtemDeviceInfo[],
      activeDeviceId: window.localStorage.getItem(LOCAL_STORAGE_ACTIVE_DEVICE_ID),
    currentState: null,
    currentProfile: null,
      connected: ConnectionStatus.Disconnected
      // hasConnected: false
    }
 updateProfile(){
  if (this.state.signalR && this.state.activeDeviceId) {
    this.state.signalR
      .invoke<object>('SendProfile', this.state.activeDeviceId)
      .then(profile => {
        console.log('ProfileUpdate: Got profile',profile)
        this.setState({currentProfile:profile})
      })
      .catch(err => {
        console.error('ProfileUpdate: Failed to load profile:', err)
        
        this.setState({currentProfile:null})
      })
  }
}

  componentDidMount() {

  

  if(this.state.signalR){
    const connection = this.state.signalR
  
  

    

    connection.on('messageReceived', (username: string, message: string) => {
      console.log(username, message)
    })

    connection.on('devices', (devices: AtemDeviceInfo[]) => {
      console.log('Devices update:', devices)
      const currentDevice = devices.find(dev => GetDeviceId(dev) === this.state.activeDeviceId)
      if (currentDevice && !isDeviceAvailable(currentDevice)) {
        console.log('Forget activeDevice')
        // Selected device is now invalid
        // mutation.activeDeviceId = null
        // TODO - is this desired behaviour?
      }
      this.setState({ devices: devices })
    })

    connection.on("state", (state: any) => {
      // console.log(state)
      this.setState({ currentState: state })
    })

    connection.onreconnecting(err => {
      if (err) {
        console.log('SignalR connection error:', err)
      }

      this.setState({
        connected: ConnectionStatus.Reconnecting
      })
    })
    connection.onreconnected(() => {
      this.setState({
        connected: ConnectionStatus.Connected
      })
    })
    connection.onclose(err => {
      if (err) {
        console.log('SignalR connection error:', err)
      }

      this.setState({
        connected: ConnectionStatus.Disconnected
      })
    })
    this.setState({
      signalR: connection
    })
      ; (window as any).conn2 = connection

    connection
      .start()
      .then(() => {
        console.log('SignalR connected')
        this.setState({
          connected: ConnectionStatus.Connected
          // hasConnected: true
        })
        this.updateProfile()
      })
      .catch(err => console.error('Connection failed', err))
  }
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
        console.log("here",id)
       if (this.state.signalR) {
          this.state.signalR
            .invoke<object>('SendProfile', id)
            .then(profile => {
              console.log('ProfileUpdate: Got profile',profile)
              this.setState({currentProfile:profile})          
            })
            .catch(err => {
              console.error('ProfileUpdate: Failed to load profile:', err)
              this.setState({currentProfile:null})
            })
        }
 
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
                <LinkContainer to="/control">
                  <Nav.Link>Control</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/settings">
                  <Nav.Link>Settings</Nav.Link>
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

            {connected !== ConnectionStatus.Disconnected ? (
              <Switch>
                <Route exact path="/">
                  <Home />
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
                <Route path="/state">
                  <StateViewerPage />
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
