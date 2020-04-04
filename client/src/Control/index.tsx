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
          console.log(value)
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

  OnAir(mixEffectIndex: number, KeyerIndex: number, state: boolean) {
    this.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyOnAirSetCommand", { MixEffectIndex: mixEffectIndex, KeyerIndex: KeyerIndex, OnAir: state })
  }

  // Convert to binary, swap out bit, convert back
  SetKey(id: number){
    var dec = this.dec2bin(this.props.currentState.mixEffects[0].transition.properties.selection).padStart(5, '0').split("").reverse();
    dec[id] = (dec[id] == "0" ?  "1" : "0")
    var selection = parseInt(dec.reverse().join(""),2)
    this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand", { Index: 0, Mask: 2, Selection: selection })
  }

  SetStyle(id:string){
    console.log(id)
    this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand", { Index: 0, Mask: 1, Style: id })
  }

  Cut(){
    this.sendCommand("LibAtem.Commands.MixEffects.MixEffectCutCommand", { Index: 0})
  }

  PreviewTrans(prev : boolean){
    this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionPreviewSetCommand", { Index: 0, PreviewTransition: prev})
  }


  dec2bin(dec: number) {
    return (dec >>> 0).toString(2);
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
    var programButtons = myKeys.map(item =>
      item.includes(programSource) ? <div key={item} onMouseDown={() => this.ProgramMix(Object.keys(this.props.currentState.settings.inputs).indexOf(item.toString()))} className="atem-button button-red atem-button-red-active">{inputs[(item)].properties.shortName}</div> : <div key={item} onMouseDown={() => this.ProgramMix(Object.keys(this.props.currentState.settings.inputs).indexOf(item.toString()))} className="atem-button button-red">{inputs[(item)].properties.shortName}</div>
    )

    var blkProgram = (programSource == 0) ? <div onMouseDown={() => this.ProgramMix(0)} className="atem-button button-red atem-button-red-active">Blk</div> : <div onMouseDown={() => this.ProgramMix(0)} className="atem-button button-red atem-button-red">Blk</div>
    var barsProgram = (programSource == 1000) ? <div onMouseDown={() => this.ProgramMix(1000)} className="atem-button button-red atem-button-red-active">Bars</div> : <div onMouseDown={() => this.ProgramMix(1000)} className="atem-button button-red atem-button-red">Bars</div>
    var col1Program = (programSource == 2001) ? <div onMouseDown={() => this.ProgramMix(2001)} className="atem-button button-red atem-button-red-active">Col1</div> : <div onMouseDown={() => this.ProgramMix(2001)} className="atem-button button-red atem-button-red">Col1</div>
    var mp1Program = (programSource == 3010) ? <div onMouseDown={() => this.ProgramMix(3010)} className="atem-button button-red atem-button-red-active">MP1</div> : <div onMouseDown={() => this.ProgramMix(3010)} className="atem-button button-red atem-button-red">MP1</div>
    var mp2Program = (programSource == 3020) ? <div onMouseDown={() => this.ProgramMix(3020)} className="atem-button button-red atem-button-red-active">MP2</div> : <div onMouseDown={() => this.ProgramMix(3020)} className="atem-button button-red atem-button-red">MP2</div>

    var previewButtons = myKeys.map(item =>
      item.includes(previewSource) ? <div key={item} onMouseDown={() => this.PreviewMix(Object.keys(this.props.currentState.settings.inputs).indexOf(item.toString()))} className="atem-button button-green atem-button-green-active">{inputs[(item)].properties.shortName}</div> : <div key={item} onMouseDown={() => this.PreviewMix(Object.keys(this.props.currentState.settings.inputs).indexOf(item.toString()))} className="atem-button button-green">{inputs[(item)].properties.shortName}</div>
    )

    var blkPreview = (previewSource == 0) ? <div onMouseDown={() => this.PreviewMix(0)} className="atem-button button-green atem-button-green-active">Blk</div> : <div onMouseDown={() => this.PreviewMix(0)} className="atem-button button-green atem-button-green">Blk</div>
    var barsPreview = (previewSource == 1000) ? <div onMouseDown={() => this.PreviewMix(1000)} className="atem-button button-green atem-button-green-active">Bars</div> : <div onMouseDown={() => this.PreviewMix(1000)} className="atem-button button-green atem-button-green">Bars</div>
    var col1Preview = (previewSource == 2001) ? <div onMouseDown={() => this.PreviewMix(2001)} className="atem-button button-green atem-button-green-active">Col1</div> : <div onMouseDown={() => this.PreviewMix(2001)} className="atem-button button-green atem-button-green">Col1</div>
    var mp1Preview = (previewSource == 3010) ? <div onMouseDown={() => this.PreviewMix(3010)} className="atem-button button-green atem-button-green-active">MP1</div> : <div onMouseDown={() => this.PreviewMix(3010)} className="atem-button button-green atem-button-green">MP1</div>
    var mp2Preview = (previewSource == 3020) ? <div onMouseDown={() => this.PreviewMix(3020)} className="atem-button button-green atem-button-green-active">MP2</div> : <div onMouseDown={() => this.PreviewMix(3020)} className="atem-button button-green atem-button-green">MP2</div>

    var onAirs = [];
    for (var i = 0; i < state.mixEffects[0].keyers.length; i++) {
      const x = i
      onAirs.push((state.mixEffects[0].keyers[i].onAir) ? <div onMouseDown={() => this.OnAir(0, x, false)} className="atem-button button-red atem-button-red-active two-lines">ON AIR</div> : <div onMouseDown={() => this.OnAir(0, x, true)} className="atem-button button-red atem-button-red two-lines">ON AIR</div>)
    }

    var keysState = this.dec2bin(state.mixEffects[0].transition.properties.selection).split("").reverse().join(""); //get binary of state and reverse it for iterating 
    var keys = [] ;
    keys.push((keysState[0]=="1") ? <div onMouseDown={() => this.SetKey(0)} className="atem-button button-yellow atem-button-yellow-active">BKGD</div> : <div onMouseDown={() => this.SetKey(0)} className="atem-button button-yellow atem-button-yellow">BKGD</div>)
    for (var i = 0; i < state.mixEffects[0].keyers.length; i++) {
      const x = i
      keys.push((keysState[i+1]=="1") ? <div onMouseDown={() => this.SetKey(x+1)} className="atem-button button-yellow atem-button-yellow-active">KEY{i+1}</div> : <div onMouseDown={() => this.SetKey(x+1)} className="atem-button button-yellow atem-button-yellow">KEY{i+1}</div>)
    }

    var style = [] ;
    var styleNames =[["MIX","0"],["DIP","1"],["WIPE","2"],["STING","4"],["DVE","3"]] //Styles have 3 and 4 ids swapped

   for (var i = 0; i < 5; i++) {
      const x = styleNames[i][1];

      style.push((state.mixEffects[0].transition.properties.style==x) ? <div onMouseDown={() => this.SetStyle(x)} className="atem-button button-yellow atem-button-yellow-active">{styleNames[i][0]}</div> : <div onMouseDown={() => this.SetStyle(x)} className="atem-button button-yellow atem-button-yellow">{styleNames[i][0]}</div>)
    }

    var prevTrans = state.mixEffects[0].transition.properties.style?<div onMouseDown={() => this.PreviewTrans(false)} className="atem-button button-red-active button-red two-lines" style={{fontSize:"13px"}}>PREV TRANS</div> : <div onMouseDown={() => this.PreviewTrans(true)} className="atem-button button-red two-lines" style={{fontSize:"13px"}}>PREV TRANS</div>


    return (
      <div id="page-wrapper">
        <div className="box" id="Program">
          <div className="box-title">Program</div>
          <div className="box-inner">
            <div className="box-inner-inputs">
              {programButtons}
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
          <div className="box-transition">
            <div></div>
            {onAirs}
            {keys}
          </div>
        </div>
        <div className="box" id="Transition">
          <div className="box-title">Transition Style</div>
          <div className="box-transition">
            {style}
            <div onMouseDown={() => this.Cut()} className="atem-button button-grey ">CUT</div>
            <div></div>
            <div onMouseDown={() => this.Cut()} className="atem-button button-red two-lines" style={{fontSize:"13px"}}>PREV TRANS</div>
          </div>
        </div>
        <div className="box" id="Preview">
          <div className="box-title">Preview</div>
          <div className="box-inner">
            <div className="box-inner-inputs">
              {previewButtons}
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

