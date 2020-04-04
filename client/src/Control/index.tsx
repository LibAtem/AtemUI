import React from 'react'
import './control.css'

import { Container, Form, Col, Row, FormControl, FormControlProps, Button } from 'react-bootstrap'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import { CommandSpecSet, CommandSpec, CommandProperty, CommandPropertyType } from './types'
import Select from 'react-select'
import update from 'immutability-helper'
import ToggleSwitch from 'bootstrap-switch-button-react'
import Slider from 'react-rangeslider'
import { prettyDecimal } from '../util'
import App from '../App'
import { StateManagerContext } from '../StateManager'

export class ControlPage extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>

  static contextType = DeviceManagerContext


  render() {
    // console.log("CONTEXT", this.context)
    const device = GetActiveDevice(this.context)
    return (
      <div className="page">


        {device ? (
          <ControlPageInner

            key={this.context.activeDeviceId || ''}
            device={device}
            currentState ={this.context.currentState}
            // currentState={this.state.currentState}
            signalR={this.context.signalR}
          />
        ) : (
            <p>No device selected</p>
          )}
      </div>
    )
  }
}

interface ControlPageInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState:any
}
interface ControlPageInnerState {
  hasConnected: boolean
  state: any | null
  currentState:any
}

class ControlPageInner extends React.Component<ControlPageInnerProps, ControlPageInnerState> {
  constructor(props: ControlPageInnerProps) {
    super(props)

    // console.log("STAAATE:",this.props)
    
    this.state = {
      hasConnected: props.device.connected,
      state: props.currentState,
      currentState: null
    }

    if (props.device.connected) {
      this.loadDeviceState(props)
    }
  }

  


  loadDeviceState(props: ControlPageInnerProps) {
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

  private sendCommand(value: any) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('CommandSend', devId, "LibAtem.Commands.MixEffects.ProgramInputSetCommand", JSON.stringify(value))
        .then((res) => {
          console.log('ManualCommands: sent')
          console.log(res)
        })
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
        })
    }

  }



  componentDidUpdate(prevProps: ControlPageInnerProps) {
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

  ProgramMix(item: String) {
    this.sendCommand({ Index: 0, Source: Object.keys(this.props.currentState.settings.inputs).indexOf(item.toString()) })
    this.reeload()
  }

  reeload(){
    this.loadDeviceState(this.props)
  }

  render() {
    const { device,currentState, signalR } = this.props
    const { hasConnected } = this.state

    if (!hasConnected) {
      return <p>Device is not connected</p>
    } else if (!currentState) {
      return <p>Loading spec...</p>
    }
    var state= currentState
    const programSource = state.mixEffects[0].sources.program
    const inputs = state.settings.inputs

    var myKeys = Object.keys(inputs).filter(x => x.includes("input"))
    console.log(this.state)
    var buttons = myKeys.map(item =>
      item.includes(programSource) ? <div key={item} onClick={() => this.ProgramMix(item)} className="atem-button atem-button-active">{inputs[(item)].properties.shortName}</div> : <div key={item} onClick={() => this.ProgramMix(item)} className="atem-button">{inputs[(item)].properties.shortName}</div>


    )

    return (
      <div id="page-wrapper">
        <div className="box" id="Program">
          <div className="box-title">Program</div>
          <div className="box-inner">

            {buttons}
            <div onClick={() => this.reeload()} className="atem-button atem-button-active">Re</div>

          </div>

        </div>
        <div id="Preview"></div>
        <div id="Next"></div>
        <div id="Transition"></div>
        <div id="DSK"></div>
        <div id="FTB"></div>

      </div>
      // <div>
      //   <Select
      //     value={selectedCommand}
      //     onChange={v => this.setState({ selectedCommand: v as any })}
      //     options={options}
      //   />

      //   <CommandBuilder
      //     key={selectedCommand ? selectedCommand.value : ''}
      //     device={device}
      //     signalR={signalR}
      //     spec={selectedCommandSpec}
      //   />
      // </div>
    )
  }
}

