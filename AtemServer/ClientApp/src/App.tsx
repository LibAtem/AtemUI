import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Navbar, Nav, Form, Button, FormControl, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { DevicesPage } from './Devices'

function App() {
  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="mr-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
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
          <Route path="/about">
            <About />
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

function About() {
  return (
    <Container>
      <h2>About</h2>
    </Container>
  )
}

function Dashboard() {
  return (
    <Container>
      <h2>Dashboard</h2>
    </Container>
  )
}

export default App
