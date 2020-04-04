import React from 'react'
import './control.css'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'


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
            currentState={this.context.currentState}
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
  currentState: any
}
interface ControlPageInnerState {
  hasConnected: boolean
  state: any | null
  currentState: any
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

  private sendCommand(command: string, value: any) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
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

  ProgramMix(item: number) {
    this.sendCommand("LibAtem.Commands.MixEffects.ProgramInputSetCommand", { Index: 0, Source: item })
  }

  PreviewMix(item: number) {
    this.sendCommand("LibAtem.Commands.MixEffects.PreviewInputSetCommand", { Index: 0, Source: item })
  }



  render() {
    const { device, currentState, signalR } = this.props
    const { hasConnected } = this.state

    if (!hasConnected) {
      return <p>Device is not connected</p>
    } else if (!currentState) {
      return <p>Loading state...</p>
    }
    var state = currentState
    const programSource = state.mixEffects[0].sources.program
    const previewSource = state.mixEffects[0].sources.preview
    const inputs = state.settings.inputs

    var myKeys = Object.keys(inputs).filter(x => x.includes("input"))
    console.log(this.state)
    var programButtons = myKeys.map(item =>
      item.includes(programSource) ? <div key={item} onMouseDown={() => this.ProgramMix(Object.keys(this.props.currentState.settings.inputs).indexOf(item.toString()))} className="atem-button button-red atem-button-red-active">{inputs[(item)].properties.shortName}</div> : <div key={item} onMouseDown={() => this.ProgramMix(Object.keys(this.props.currentState.settings.inputs).indexOf(item.toString()))} className="atem-button button-red">{inputs[(item)].properties.shortName}</div>
    )

    var blkProgram = (programSource == 0) ? <div onMouseDown={() => this.ProgramMix(0)} className="atem-button atem-button-red-active">Blk</div> : <div onMouseDown={() => this.ProgramMix(0)} className="atem-button atem-button-red">Blk</div>
    var barsProgram = (programSource == 1000) ? <div onMouseDown={() => this.ProgramMix(1000)} className="atem-button atem-button-red-active">Bars</div> : <div onMouseDown={() => this.ProgramMix(1000)} className="atem-button atem-button-red">Bars</div>
    var col1Program = (programSource == 2001) ? <div onMouseDown={() => this.ProgramMix(2001)} className="atem-button atem-button-red-active">Col1</div> : <div onMouseDown={() => this.ProgramMix(2001)} className="atem-button atem-button-red">Col1</div>
    var mp1Program = (programSource == 3010) ? <div onMouseDown={() => this.ProgramMix(3010)} className="atem-button atem-button-red-active">MP1</div> : <div onMouseDown={() => this.ProgramMix(3010)} className="atem-button atem-button-red">MP1</div>
    var mp2Program = (programSource == 3020) ? <div onMouseDown={() => this.ProgramMix(3020)} className="atem-button atem-button-red-active">MP2</div> : <div onMouseDown={() => this.ProgramMix(3020)} className="atem-button atem-button-red">MP2</div>


    var previewButtons = myKeys.map(item =>
      item.includes(previewSource) ? <div key={item} onMouseDown={() => this.PreviewMix(Object.keys(this.props.currentState.settings.inputs).indexOf(item.toString()))} className="atem-button button-green atem-button-green-active">{inputs[(item)].properties.shortName}</div> : <div key={item} onMouseDown={() => this.PreviewMix(Object.keys(this.props.currentState.settings.inputs).indexOf(item.toString()))} className="atem-button button-green">{inputs[(item)].properties.shortName}</div>
    )

    var blkPreview = (previewSource == 0) ? <div onMouseDown={() => this.PreviewMix(0)} className="atem-button atem-button-green-active">Blk</div> : <div onMouseDown={() => this.PreviewMix(0)} className="atem-button atem-button-green">Blk</div>
    var barsPreview = (previewSource == 1000) ? <div onMouseDown={() => this.PreviewMix(1000)} className="atem-button atem-button-green-active">Bars</div> : <div onMouseDown={() => this.PreviewMix(1000)} className="atem-button atem-button-green">Bars</div>
    var col1Preview = (previewSource == 2001) ? <div onMouseDown={() => this.PreviewMix(2001)} className="atem-button atem-button-green-active">Col1</div> : <div onMouseDown={() => this.PreviewMix(2001)} className="atem-button atem-button-green">Col1</div>
    var mp1Preview = (previewSource == 3010) ? <div onMouseDown={() => this.PreviewMix(3010)} className="atem-button atem-button-green-active">MP1</div> : <div onMouseDown={() => this.PreviewMix(3010)} className="atem-button atem-button-green">MP1</div>
    var mp2Preview = (previewSource == 3020) ? <div onMouseDown={() => this.PreviewMix(3020)} className="atem-button atem-button-green-active">MP2</div> : <div onMouseDown={() => this.PreviewMix(3020)} className="atem-button atem-button-green">MP2</div>
    return (
      <div id="page-wrapper">
        <div className="box" id="Program">
          <div className="box-title">Program</div>
          <div className="box-inner">
            <div className="box-inner-inputs">

              {programButtons}
              {/* <div className="atem-button atem-button-green-active">Re</div> */}

            </div>
            <div className="box-inner-mid">
              {blkProgram}
              {barsProgram}

            </div>
            <div className="box-inner-rest">

              {col1Program}
              <div></div>
              {mp1Program}
              {mp2Program}
            </div>
          </div>

        </div>

        <div className="box" id="Next">
          <div className="box-title">Next Transition</div>
          <div className="box-inner"></div>
        </div>
        <div className="box" id="Transition">
          <div className="box-title">Transition Style</div>
          <div className="box-inner">

          </div>
        </div>

      

        
      <div className="box" id="Preview">
        <div className="box-title">Preview</div>
        <div className="box-inner">
          <div className="box-inner-inputs">

            {previewButtons}
            {/* <div className="atem-button atem-button-green-active">Re</div> */}

          </div>
          <div className="box-inner-mid">
            {blkPreview}
            {barsPreview}

          </div>
          <div className="box-inner-rest">

            {col1Preview}
            <div></div>
            {mp1Preview}
            {mp2Preview}
          </div>
        </div>

      </div>

      <div className="box" id="Next">
        <div className="box-title">Next Transition</div>
        <div className="box-inner"></div>
      </div>
      <div className="box" id="Transition">
        <div className="box-title">Transition Style</div>
        <div className="box-inner">

        </div>
      </div>


      </div >
    )
  }
}

