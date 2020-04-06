import React from 'react'
import './control.css'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import OutsideClickHandler from 'react-outside-click-handler';
import { Container, Table, ButtonGroup, Button, Modal, Form, Row, Col, Navbar, Nav } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Switch, Route } from 'react-router';

export class ControlSettingsPage extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>

  static contextType = DeviceManagerContext

  render() {
    const device = GetActiveDevice(this.context)
    return (
      <Container>

        {device ? (
          <ControlSettingsPageInner

            key={this.context.activeDeviceId || ''}
            device={device}
            currentState={this.context.currentState}
            // currentState={this.state.currentState}
            signalR={this.context.signalR}
          />
        ) : (
            <p>No device selected</p>
          )}
      </Container>
    )
  }
}

interface ControlSettingsPageInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: any
}
interface ControlSettingsPageInnerState {
  hasConnected: boolean
  state: any | null
  currentState: any

}

class ControlSettingsPageInner extends React.Component<ControlSettingsPageInnerProps, ControlSettingsPageInnerState> {
  state = {
    hasConnected: this.props.device.connected,
    state: this.props.currentState,
    currentState: null,
    page:0
  }


  loadDeviceState(props: ControlSettingsPageInnerProps) {
    if (props.signalR) {
      props.signalR
        .invoke<any>('sendState', GetDeviceId(props.device))
        .then(state => {
        })
        .catch(err => {
          console.error('StateViewer: Failed to load state:', err)
          this.setState({
            state: null
          })
        })
    }
  }

  private sendCommand(command: string, value: any) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then((res) => {
          console.log(value)
          console.log('ManualCommands: sent')
          console.log(command)
        })
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
        })
    }

  }


  componentDidUpdate(prevProps: ControlSettingsPageInnerProps) {
    // Should we reload the commandsSpec
    if (
      !this.state.hasConnected &&
      this.props.device.connected // Device first connection
    ) {
      this.setState({
        // TODO - should this be delayed as old data is good enough to get us started
        state: null,
        hasConnected: true
      })
      // now reload
    }
  }

  render() {
    const { device, currentState, signalR } = this.props
    const { hasConnected } = this.state

    if (!hasConnected) {
      return <p className ="mt-5">Device is not connected</p>
    } else if (!currentState) {
      return <p className ="mt-5">Loading state...</p>
    }
    var content =<></>
    if(this.state.page==0){
      content = <GeneralSettings    
      key={this.context.activeDeviceId || ''}
      device={device}
      currentState={this.context.currentState}
      signalR={this.context.signalR}/>
    }

    return (
<div>
<Nav justify className ="mt-5" variant="pills" defaultActiveKey="/home">
  <Nav.Item onClick= {()=>this.state.page = 0} >
    <Nav.Link eventKey="link-1" >General</Nav.Link>
  </Nav.Item>
  <Nav.Item onClick= {()=>this.state.page = 1}>
    <Nav.Link eventKey="link-2">Audio</Nav.Link>
  </Nav.Item>
  <Nav.Item>
  <Nav.Link eventKey="link-3">Multi View</Nav.Link>
  </Nav.Item>
  <Nav.Item>
  <Nav.Link eventKey="link-4">Labels</Nav.Link>
  </Nav.Item>
  <Nav.Item>
  <Nav.Link eventKey="link-5">HyperDeck</Nav.Link>
  </Nav.Item>
  <Nav.Item>
  <Nav.Link eventKey="link-6">Remote</Nav.Link>
  </Nav.Item>
</Nav>

{content}    
              

</div>
    )
  }
}


interface GeneralSettingsProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: any
}
interface GeneralSettingsState {
  hasConnected: boolean
  state: any | null
  currentState: any
}

class GeneralSettings extends React.Component<GeneralSettingsProps, GeneralSettingsState> {
  constructor(props: GeneralSettingsProps) {
    super(props)
    this.state = {
      hasConnected: props.device.connected,
      state: props.currentState,
      currentState: null
    }
  
  }

  private sendCommand(command: string, value: any) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then((res) => {
          console.log(value)
          console.log('ManualCommands: sent')
          console.log(command)
        })
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
        })
    }

  }

  render() {
    const {currentState} = this.props
    const { hasConnected } = this.state

    return (
      <Container className="p-5 maxW" >
      <h3>Video</h3>
<Form>
<Form.Group as={Row} controlId="exampleForm.ControlSelect1">
    <Form.Label column sm="4" >Set video standard to:</Form.Label>
    <Col sm="8">
    <Form.Control as="select">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </Form.Control>
    </Col>
  </Form.Group>
  <Form.Group as={Row} controlId="exampleForm.ControlSelect1">
    <Form.Label column sm="4" >Set multi view standard to:</Form.Label>
    <Col sm="8">
    <Form.Control as="select">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </Form.Control>
    </Col>
  </Form.Group>
  <Form.Group as={Row} controlId="exampleForm.ControlSelect1">
    <Form.Label column sm="4" >Down convert as:</Form.Label>
    <Col sm="8">
    <Form.Control as="select">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </Form.Control>
    </Col>
  </Form.Group>

</Form>
<h3>Media Pool</h3>

<h3>Camera Control</h3>
</Container>
    )
  }
}

