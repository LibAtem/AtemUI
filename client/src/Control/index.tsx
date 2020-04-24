import React from 'react'
import './control.css'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import OutsideClickHandler from 'react-outside-click-handler';


export class ControlPage extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>

  static contextType = DeviceManagerContext

  render() {
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
          console.log(command)
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
  SetKey(id: number) {
    var dec = this.dec2bin(this.props.currentState.mixEffects[0].transition.properties.selection).padStart(5, '0').split("").reverse();
    dec[id] = (dec[id] === "0" ? "1" : "0")
    var selection = parseInt(dec.reverse().join(""), 2)
    this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand", { Index: 0, Mask: 2, NextSelection: selection })
  }

  SetStyle(id: string) {
    this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand", { Index: 0, Mask: 1, NextStyle: id })
  }

  Cut() {
    this.sendCommand("LibAtem.Commands.MixEffects.MixEffectCutCommand", { Index: 0 })
  }

  PreviewTrans(prev: boolean) {
    this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionPreviewSetCommand", { Index: 0, PreviewTransition: prev })
  }

  Auto() {
    this.sendCommand("LibAtem.Commands.MixEffects.MixEffectAutoCommand", { Index: 0 })
  }


  dec2bin(dec: number) {
    return (dec >>> 0).toString(2);
  }

  validRate(e: React.KeyboardEvent<HTMLDivElement>, id: string) {
    var input = document.getElementById(id) as HTMLInputElement //Work out what the input will be
    if (((e.keyCode >= 96) && (e.keyCode <= 105)) || ((e.keyCode >= 48) && (e.keyCode <= 57)) || (e.keyCode === 59)) {
      if (input) {
        var startPos = input.selectionStart || 0;
        var endPos = input.selectionEnd || 0;
        var value = input.value.split("")
        var newChar = String.fromCharCode((96 <= e.keyCode && e.keyCode <= 105) ? e.keyCode - 48 : e.keyCode)
        newChar = ((newChar === ";") ? ":" : newChar)
        value.splice(startPos, endPos - startPos, newChar)
        if (value.includes(";") || value.includes(":")) { //Check if it is valid
          if (!value.join("").match(/^(([0-9]|[0-9][0-9]|)(:)([0-9]|[0-9][0-9]|))$/g)) { //This can be expanded to do all checks
            if (e.preventDefault) e.preventDefault();
          }
        } else {
          if (value.length > 3) {
            if (e.preventDefault) e.preventDefault();
          }
        }
      }
    } else if (e.keyCode !== 8 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 46) { //Allow special keys
      if (e.preventDefault) e.preventDefault();
    }
  }

  transitionRate(e: React.KeyboardEvent<HTMLDivElement>, id: string, style: number) {

    if (e.keyCode === 13) {
      this.setTransitionRate(style, id)
    } else {
      this.validRate(e, id)
    }

  }

  ftbRate(id: string, index: number) {
    var input = document.getElementById(id) as HTMLInputElement
    if (input.value !== "") {
      this.sendCommand("LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand", { Index: index, Rate: Math.min(this.rateToFrames(input.value), 250) })
      input.value = ""
    }
  }

  ftbRateHelper(e: React.KeyboardEvent<HTMLDivElement>, id: string, index: number) {
    if (e.keyCode === 13) {
      this.ftbRate(id,index)
    } else {
      this.validRate(e, id)
    }
  }

  dskRate(id: string, index: number) {
    var input = document.getElementById(id) as HTMLInputElement
    if (input.value !== "") {
      this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyRateSetCommand", { Index: index, Rate: Math.min(this.rateToFrames(input.value), 250) })
      input.value = ""
    }
  }

  dskRateHelper(e: React.KeyboardEvent<HTMLDivElement>, id: string, index: number) {
    if (e.keyCode === 13) {
      this.dskRate(id,index)
    } else {
      this.validRate(e, id)
    }
  }

  rateToFrames(rate:string){
    var fps = [30,25,30,25,50,60,25,30,24,24,25,30,50][this.props.currentState.settings.videoMode]
    return parseInt(rate.replace(":", "").padStart(4, "0").substr(0, 2)) * fps + parseInt(rate.replace(":", "").padStart(4, "0").substr(2, 3))
  }

  framesToRate(frames: number) {
    var fps = [30,25,30,25,50,60,25,30,24,24,25,30,50][this.props.currentState.settings.videoMode]
    var framesRemaining = frames % fps
    var seconds = Math.floor(frames / fps);
    return seconds.toString() + ":" + framesRemaining.toString().padStart(2, "0")
  }

  setTransitionRate(style: number, id: string) {
    var input = document.getElementById(id) as HTMLInputElement
    var styleName = ["Mix", "Dip", "Wipe", "DVE"]
    if (input) {
      if (input.value !== "") {
        if (style === 4) {
          this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand", { Index: 0, Mask: 256, MixRate: Math.min(this.rateToFrames(input.value), 250) })
        } else {
          this.sendCommand("LibAtem.Commands.MixEffects.Transition.Transition" + styleName[style] + "SetCommand", { Index: 0, Mask: 1, Rate: Math.min(this.rateToFrames(input.value), 250) })
        }
        input.value = ""
      }
    }

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

    var blkProgram = (programSource === 0) ? <div onMouseDown={() => this.ProgramMix(0)} className="atem-button button-red atem-button-red-active">Blk</div> : <div onMouseDown={() => this.ProgramMix(0)} className="atem-button button-red atem-button-red">Blk</div>
    var barsProgram = (programSource === 1000) ? <div onMouseDown={() => this.ProgramMix(1000)} className="atem-button button-red atem-button-red-active">Bars</div> : <div onMouseDown={() => this.ProgramMix(1000)} className="atem-button button-red atem-button-red">Bars</div>
    var col1Program = (programSource === 2001) ? <div onMouseDown={() => this.ProgramMix(2001)} className="atem-button button-red atem-button-red-active">Col1</div> : <div onMouseDown={() => this.ProgramMix(2001)} className="atem-button button-red atem-button-red">Col1</div>
    var mp1Program = (programSource === 3010) ? <div onMouseDown={() => this.ProgramMix(3010)} className="atem-button button-red atem-button-red-active">MP1</div> : <div onMouseDown={() => this.ProgramMix(3010)} className="atem-button button-red atem-button-red">MP1</div>
    var mp2Program = (programSource === 3020) ? <div onMouseDown={() => this.ProgramMix(3020)} className="atem-button button-red atem-button-red-active">MP2</div> : <div onMouseDown={() => this.ProgramMix(3020)} className="atem-button button-red atem-button-red">MP2</div>

    var previewButtons = myKeys.map(item =>
      item.includes(previewSource) ? <div key={item} onMouseDown={() => this.PreviewMix(Object.keys(this.props.currentState.settings.inputs).indexOf(item.toString()))} className="atem-button button-green atem-button-green-active">{inputs[(item)].properties.shortName}</div> : <div key={item} onMouseDown={() => this.PreviewMix(Object.keys(this.props.currentState.settings.inputs).indexOf(item.toString()))} className="atem-button button-green">{inputs[(item)].properties.shortName}</div>
    )

    var blkPreview = (previewSource === 0) ? <div onMouseDown={() => this.PreviewMix(0)} className="atem-button button-green atem-button-green-active">Blk</div> : <div onMouseDown={() => this.PreviewMix(0)} className="atem-button button-green atem-button-green">Blk</div>
    var barsPreview = (previewSource === 1000) ? <div onMouseDown={() => this.PreviewMix(1000)} className="atem-button button-green atem-button-green-active">Bars</div> : <div onMouseDown={() => this.PreviewMix(1000)} className="atem-button button-green atem-button-green">Bars</div>
    var col1Preview = (previewSource === 2001) ? <div onMouseDown={() => this.PreviewMix(2001)} className="atem-button button-green atem-button-green-active">Col1</div> : <div onMouseDown={() => this.PreviewMix(2001)} className="atem-button button-green atem-button-green">Col1</div>
    var mp1Preview = (previewSource === 3010) ? <div onMouseDown={() => this.PreviewMix(3010)} className="atem-button button-green atem-button-green-active">MP1</div> : <div onMouseDown={() => this.PreviewMix(3010)} className="atem-button button-green atem-button-green">MP1</div>
    var mp2Preview = (previewSource === 3020) ? <div onMouseDown={() => this.PreviewMix(3020)} className="atem-button button-green atem-button-green-active">MP2</div> : <div onMouseDown={() => this.PreviewMix(3020)} className="atem-button button-green atem-button-green">MP2</div>

    var onAirs = [];
    for (var i = 0; i < state.mixEffects[0].keyers.length; i++) {
      const x = i
      onAirs.push((state.mixEffects[0].keyers[i].onAir) ? <div onMouseDown={() => this.OnAir(0, x, false)} className="atem-button button-red atem-button-red-active two-lines">ON AIR</div> : <div onMouseDown={() => this.OnAir(0, x, true)} className="atem-button button-red atem-button-red two-lines">ON AIR</div>)
    }

    var keysState = this.dec2bin(state.mixEffects[0].transition.properties.selection).split("").reverse().join(""); //get binary of state and reverse it for iterating 
    var keys = [];
    keys.push((keysState[0] === "1") ? <div onMouseDown={() => this.SetKey(0)} className="atem-button button-yellow atem-button-yellow-active">BKGD</div> : <div onMouseDown={() => this.SetKey(0)} className="atem-button button-yellow atem-button-yellow">BKGD</div>)
    for (i = 0; i < state.mixEffects[0].keyers.length; i++) {
      const x = i
      keys.push((keysState[i + 1] === "1") ? <div onMouseDown={() => this.SetKey(x + 1)} className="atem-button button-yellow atem-button-yellow-active">KEY{i + 1}</div> : <div onMouseDown={() => this.SetKey(x + 1)} className="atem-button button-yellow atem-button-yellow">KEY{i + 1}</div>)
    }

    var style = [];
    var styleNames = [["MIX", "0"], ["DIP", "1"], ["WIPE", "2"], ["STING", "4"], ["DVE", "3"]] //Styles have 3 and 4 ids swapped

    for (i = 0; i < 5; i++) {
      const x = styleNames[i][1];

      style.push((state.mixEffects[0].transition.properties.style === x) ? <div onMouseDown={() => this.SetStyle(x)} className="atem-button button-yellow atem-button-yellow-active">{styleNames[i][0]}</div> : <div onMouseDown={() => this.SetStyle(x)} className="atem-button button-yellow atem-button-yellow">{styleNames[i][0]}</div>)
    }

    var prevTrans = (state.mixEffects[0].transition.properties.preview) ? <div onMouseDown={() => this.PreviewTrans(false)} className="atem-button atem-button-red-active button-red two-lines" style={{ fontSize: "13px" }}>PREV TRANS</div> : <div onMouseDown={() => this.PreviewTrans(true)} className="atem-button button-red two-lines" style={{ fontSize: "13px" }}>PREV TRANS</div>
    var auto = (state.mixEffects[0].transition.position.inTransition) ? <div onMouseDown={() => this.Auto()} className="atem-button atem-button-red-active button-red">AUTO</div> : <div onMouseDown={() => this.Auto()} className="atem-button button-red">AUTO</div>

    var autoRate = (state.mixEffects[0].transition.properties.style === 4 || state.mixEffects[0].transition.position.inTransition) ? <OutsideClickHandler onOutsideClick={() => { this.setTransitionRate(state.mixEffects[0].transition.properties.style, "autoRate") }}><div className="rate"> Rate <input placeholder={this.framesToRate(state.mixEffects[0].transition.position.remainingFrames)} onKeyDown={(e) => this.transitionRate(e, "autoRate", state.mixEffects[0].transition.properties.style)} id="autoRate" disabled className="rate-input" ></input></div></OutsideClickHandler> : <OutsideClickHandler onOutsideClick={() => { this.setTransitionRate(state.mixEffects[0].transition.properties.style, "autoRate") }}><div className="rate"> Rate <input placeholder={this.framesToRate(state.mixEffects[0].transition.position.remainingFrames)} onKeyDown={(e) => this.transitionRate(e, "autoRate", state.mixEffects[0].transition.properties.style)} id="autoRate" className="rate-input" ></input></div></OutsideClickHandler>
    // 

    var dsk = [];
    dsk.push((state.downstreamKeyers[0].properties.tie) ? <div className="atem-button button-yellow atem-button-yellow-active" onMouseDown={()=>this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyTieSetCommand",{Index:0,Tie:false})}>TIE</div> : <div className="atem-button button-yellow "onMouseDown={()=>this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyTieSetCommand",{Index:0,Tie:true})}>TIE</div>)
    dsk.push((state.downstreamKeyers[1].properties.tie) ? <div className="atem-button button-yellow atem-button-yellow-active" onMouseDown={()=>this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyTieSetCommand",{Index:1,Tie:false})}>TIE</div> : <div className="atem-button button-yellow " onMouseDown={()=>this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyTieSetCommand",{Index:1,Tie:true})}>TIE</div>)
    dsk.push(( state.mixEffects[0].transition.position.inTransition) ? <OutsideClickHandler onOutsideClick={() => { this.dskRate("dsk0", 0) }}><div className="rate"> Rate <input placeholder={this.framesToRate(state.downstreamKeyers[0].state.remainingFrames)} onKeyDown={(e) => this.dskRateHelper(e, "dsk0", 0)} id="dsk0" disabled className="rate-input" ></input></div></OutsideClickHandler> : <OutsideClickHandler onOutsideClick={() => { this.dskRate("dsk0",0) }}><div className="rate"> Rate <input placeholder={this.framesToRate(state.downstreamKeyers[0].state.remainingFrames)} onKeyDown={(e) => this.dskRateHelper(e, "dsk0", 0)} id="dsk0" className="rate-input" ></input></div></OutsideClickHandler>)
    dsk.push(( state.mixEffects[0].transition.position.inTransition) ? <OutsideClickHandler onOutsideClick={() => { this.dskRate("dsk1", 1) }}><div className="rate"> Rate <input placeholder={this.framesToRate(state.downstreamKeyers[1].state.remainingFrames)} onKeyDown={(e) => this.dskRateHelper(e, "dsk1", 1)} id="dsk1" disabled className="rate-input" ></input></div></OutsideClickHandler> : <OutsideClickHandler onOutsideClick={() => { this.dskRate("dsk1",1) }}><div className="rate"> Rate <input placeholder={this.framesToRate(state.downstreamKeyers[1].state.remainingFrames)} onKeyDown={(e) => this.dskRateHelper(e, "dsk1", 1)} id="dsk1" className="rate-input" ></input></div></OutsideClickHandler>)
    dsk.push((state.downstreamKeyers[0].state.onAir) ? <div onMouseDown={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyOnAirSetCommand",{Index:0,OnAir:false})} className="atem-button button-red atem-button-red-active two-lines">ON AIR</div> : <div onMouseDown={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyOnAirSetCommand",{Index:0,OnAir:true})} className="atem-button button-red atem-button-red two-lines">ON AIR</div>)
    dsk.push((state.downstreamKeyers[1].state.onAir) ? <div onMouseDown={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyOnAirSetCommand",{Index:1,OnAir:false})} className="atem-button button-red atem-button-red-active two-lines">ON AIR</div> : <div onMouseDown={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyOnAirSetCommand",{Index:1,OnAir:true})} className="atem-button button-red atem-button-red two-lines">ON AIR</div>)
    dsk.push((state.downstreamKeyers[0].state.isAuto) ? <div onMouseDown={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyAutoV8Command",{Index:0})} className="atem-button atem-button-red-active button-red">AUTO</div> : <div onMouseDown={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyAutoV8Command",{Index:0})} className="atem-button button-red">AUTO</div>)
    dsk.push((state.downstreamKeyers[1].state.isAuto) ? <div onMouseDown={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyAutoV8Command",{"Index": 1,"IsTowardsOnAir": false})} className="atem-button atem-button-red-active button-red">AUTO</div> : <div onMouseDown={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyAutoV8Command",{Index: 1,IsTowardsOnAir: false})} className="atem-button button-red">AUTO</div>)

    var ftb=[];
    ftb.push(( state.mixEffects[0].fadeToBlack.status.inTransition) ? <OutsideClickHandler onOutsideClick={() => { this.ftbRate("ftb0", 0) }}><div className="rate"> Rate <input placeholder={this.framesToRate(state.mixEffects[0].fadeToBlack.status.remainingFrames)} onKeyDown={(e) => this.ftbRateHelper(e, "ftb0", 0)} id="ftb0" disabled className="rate-input" ></input></div></OutsideClickHandler> : <OutsideClickHandler onOutsideClick={() => { this.ftbRate("ftb0",0) }}><div className="rate"> Rate <input placeholder={this.framesToRate(state.mixEffects[0].fadeToBlack.status.remainingFrames)} onKeyDown={(e) => this.ftbRateHelper(e, "ftb0", 0)} id="ftb0" className="rate-input" ></input></div></OutsideClickHandler>)
    if(state.mixEffects[0].fadeToBlack.status.isFullyBlack){
      ftb.push(<div onMouseDown={() => this.sendCommand("LibAtem.Commands.MixEffects.FadeToBlackAutoCommand",{Index:0})} className="atem-button atem-button-red-active flashit button-red">FTB</div> )
    }else if(state.mixEffects[0].fadeToBlack.status.inTransition){
      ftb.push(<div onMouseDown={() => this.sendCommand("LibAtem.Commands.MixEffects.FadeToBlackAutoCommand",{Index:0})} className="atem-button atem-button-red-active button-red">FTB</div> )
    }else{
      ftb.push(<div onMouseDown={() => this.sendCommand("LibAtem.Commands.MixEffects.FadeToBlackAutoCommand",{Index:0})} className="atem-button button-red">FTB</div> )
    }
    
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
            {prevTrans}
            <div></div>
            <div onMouseDown={() => this.Cut()} className="atem-button button-grey ">CUT</div>
            {auto}
            {autoRate}
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

        <div className="box" id="DSK">
          <div className="box-title">DSK1 	&nbsp;	&nbsp;  DSK2</div>
          <div className="box-dsk">
            {dsk}
          </div>
        </div>
        <div className="box" id="FTB">
          <div className="box-title">Fade to Black</div>
          <div className="box-ftb">
            {ftb}
          </div>
        </div>


      </div >
    )
  }
}

