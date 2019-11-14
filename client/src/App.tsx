import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Navbar, Nav, Form, Button, FormControl, Container } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import { DevicesPage } from './Devices'
import { ManualCommandsPage } from './ManualCommands'

function App() {
  return (
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
      </div>
    </Router>
  )
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

export default App
