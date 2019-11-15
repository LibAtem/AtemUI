import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Navbar, Nav, Form, Button, FormControl, Container } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import { DevicesPage } from './Devices'
import { ManualCommandsPage } from './ManualCommands'
import { DeviceManagerContext, DeviceContext } from './DeviceManager'
import * as signalR from '@aspnet/signalr'
import { AtemDeviceInfo } from './Devices/types'

interface AppState extends DeviceContext {
  connected: boolean
  hasConnected: boolean
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      signalR: undefined,
      devices: [],

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
      this.setState({ devices })
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
                <LinkContainer to="/devices">
                  <Nav.Link>Devices</Nav.Link>
                </LinkContainer>
              </Nav>
              <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
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
