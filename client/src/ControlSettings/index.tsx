import React from 'react'
import './control.css'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import OutsideClickHandler from 'react-outside-click-handler';
import { Container, Table, ButtonGroup, Button, Modal, Form, Row, Col, Navbar, Nav, FormControl, FormControlProps } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Switch, Route } from 'react-router';
import { createSecureContext } from 'tls';
import { prettyDecimal } from '../util';
import Slider from 'react-rangeslider';

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
            currentProfile ={this.context.currentProfile}
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
  currentProfile: any
}
interface ControlSettingsPageInnerState {
  hasConnected: boolean
  state: any | null
  // currentState: any

}

class ControlSettingsPageInner extends React.Component<ControlSettingsPageInnerProps, ControlSettingsPageInnerState> {
  state = {
    hasConnected: this.props.device.connected,
    state: this.props.currentState,
    // currentState: null,
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
    const { device, currentState, signalR, currentProfile} = this.props
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
      currentState={this.props.currentState}
      signalR={this.props.signalR}
      currentProfile={this.props.currentProfile}/>
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
  currentProfile:any
}
interface GeneralSettingsState {
  hasConnected: boolean
  currentState: any
  videoMode:number
  multiViewMode:number
  downConvertMode:number
  clip1Length: number
  clip2Length: number
  
  // currentProfile:any
}

class GeneralSettings extends React.Component<GeneralSettingsProps, GeneralSettingsState> {
  constructor(props: GeneralSettingsProps) {
    super(props)
    this.state = {
      hasConnected: props.device.connected, 
      currentState: props.currentState,
      videoMode:props.currentState.settings.videoMode,
      multiViewMode:0,
      downConvertMode:0,
      clip1Length:0,
      clip2Length:0
      // currentProfile:props.currentProfile
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

  changeVideoMode(event :any){
    this.setState({videoMode: event.target.value});
  }

  changeDownConvertMode(event :any){
    this.setState({downConvertMode: event.target.value});
  }

  changeMultiViewMode(event :any){
    this.setState({multiViewMode: event.target.value});

  }

  render() {
    const {currentState,currentProfile} = this.props
    const { hasConnected,videoMode } = this.state
    console.log(currentProfile,currentState,currentProfile.videoModes.supportedModes.length)
    var videoModes = []
    var videModeNames = ["525i59.94 NTSC","625i50 PAL","525i59.94 16:9","625i50 16:9","720p50","720p59.94","1080i50","1080i59.94","1080p23.98","1080p24","1080p25","1080p29.97","1080p50","1080p59.94","4KHDp23.98","4KHDp24","4KHDp25","4KHDp29.97","4KHDp50","4KHDp59.94"]
    var multiViewModes =[[7],[6],[7],[6],[4],[5],[6],[7],[8],[9],[10,6],[11,7],[12,6],[13,7],[8],[9],[6],[7],[6],[7]]
    for(var i =0; i  <  currentProfile.videoModes.supportedModes.length; i++){
      videoModes.push(<option value ={i}>{videModeNames[currentProfile.videoModes.supportedModes[i]]}</option>)
    }
    var multiviewMode = []
    for(var i =0; i  <  multiViewModes[videoMode].length; i++){
        multiviewMode.push(<option value ={i}>{videModeNames[multiViewModes[videoMode][i]]}</option>)
    }
    return (
      <Container className="p-5 maxW" >
      <h3>Video</h3>
<Form>
<Form.Group as={Row} controlId="exampleForm.ControlSelect1">
    <Form.Label column sm="4" >Set video standard to:</Form.Label>
    <Col sm="6">
    <Form.Control defaultValue={videoMode} onChange={(e)=>this.changeVideoMode(e)} as="select">
 {videoModes}
    </Form.Control>
    </Col>
    <Col>  <Button onClick={()=>this.sendCommand("LibAtem.Commands.Settings.VideoModeSetCommand",{videoMode:this.state.videoMode})}  variant="primary" >
    Set
  </Button></Col>
  
  </Form.Group>
 
  <Form.Group as={Row} controlId="exampleForm.ControlSelect1">
    <Form.Label column sm="4" >Set multi view standard to:</Form.Label>
    <Col sm="8">
    <Form.Control defaultValue={this.state.multiViewMode}  onChange={(e)=>this.changeMultiViewMode(e)} disabled={(multiViewModes[currentState.settings.videoMode].length == 1)} as="select">
    {multiviewMode}
    </Form.Control>
    <small id="emailHelp" className="form-text text-muted">Not implemented correctly as can't test.</small>
    </Col>
  </Form.Group>
  <Form.Group as={Row} controlId="exampleForm.ControlSelect1">
    <Form.Label column sm="4" >Down convert as:</Form.Label>
    <Col sm="8">
    <Form.Control defaultValue={this.state.downConvertMode} onChange={(e)=>this.changeDownConvertMode(e)} as="select">
      <option value ={0}>Center cut</option>
      <option value ={1}>Letterbox</option>
      <option value ={2}>Anamaorphic</option>

    </Form.Control>
    </Col>
  </Form.Group>
  <Button onClick={()=>this.sendCommand("LibAtem.Commands.Media.MediaPoolSettingsSetCommand",{MaxFrames:[450,450]})} variant="primary" >
    Set
  </Button>

</Form>
<h3>Media Pool</h3>
<small id="emailHelp" className="form-text text-muted">There are 900 frames to share between the clips</small>

<Form.Group as={Row}>
<Form.Label column sm="4" >Clip 1 Length:</Form.Label>
<Col sm="6">
<Slider
        key={0}
        min={0}
        max={900}
        step={1}
        // labels={"horizontalLabels"}
        onChange={ (v)=>{  
          this.setState({
          clip1Length: v,
          clip2Length: 900- v
        })}}
        value={this.state.clip1Length}
        // defaultValue={0}
        format={prettyDecimal}
      />
      <br key={1} />
      </Col>
      <Col sm="2">
      <Form.Control
        key={2}
        type="number"
        placeholder={""}
        min={0}
        max={900}
        value={prettyDecimal(this.state.clip1Length)}
        onChange={(e: React.FormEvent<FormControl & FormControlProps>) => {
          if(e.currentTarget.value){
          this.setState({
           
            clip1Length: parseInt(e.currentTarget.value),
            clip2Length: 900-parseInt(e.currentTarget.value)
          })
        }
        }}
      />
      </Col>
      </Form.Group>
      <Form.Group as={Row}>
<Form.Label column sm="4" >Clip 2 Length:</Form.Label>
<Col sm="6">
<Slider
        key={0}
        min={0}
        max={900}
        step={1}
        // labels={"horizontalLabels"}
        onChange={ (v)=>{  
          this.setState({
          clip2Length: v,
          clip1Length: 900- v
        })}}
        value={this.state.clip2Length}
        // defaultValue={0}
        format={prettyDecimal}
      />
      <br key={1} />
      </Col>
      <Col sm="2">
      <Form.Control
        key={2}
        type="number"
        placeholder={""}
        min={0}
        max={900}
        value={prettyDecimal(this.state.clip2Length)}
        onChange={(e: React.FormEvent<FormControl & FormControlProps>) => {
          if(e.currentTarget.value){
          this.setState({
           
            clip2Length: parseInt(e.currentTarget.value),
            clip1Length: 900-parseInt(e.currentTarget.value)
          })
        }
        }}
      />
      </Col>
      </Form.Group>
<h3>Camera Control</h3>
</Container>
    )
  }
}


interface SliderInnerState {
  min:number
  max:number
  value: number
  scale:number
  change: (propName: string, value: number) => void
  // change: (propName: string, value: T) => void
}

class SliderInnerState extends React.Component<SliderInnerState> {

 
  render() {
    
    


    let min = this.props.min
    let max = this.props.max
    let value = this.props.value
    const scale = this.props.scale
    let step = 1

    if (scale) {
      min /= scale
      max /= scale
      value /= scale
      step /= scale
    }

    const horizontalLabels: any = {}
    horizontalLabels[min] = min
    horizontalLabels[0] = 0
    horizontalLabels[max] = max

    const change = (val: number) => {
      if (val < min) val = min
      if (val > max) val = max
      if (scale) val *= scale
      this.props.change("aa", val)
      //   const updDat = { data: {} }
      //   updDat.data[spec.$.id] = { $set: val }
      //   this.setState(update(this.state, updDat))
    }

    return [
     
    ]
  }
}

