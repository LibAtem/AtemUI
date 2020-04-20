import React from 'react'
import './Audio.css'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import OutsideClickHandler from 'react-outside-click-handler';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Slider from 'react-rangeslider';


export class AudioPage extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>

  static contextType = DeviceManagerContext

  render() {
    const device = GetActiveDevice(this.context)
    return (
      <div className="page-audio">
        <div></div>
        {device ? (
          <AudioPageInner

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
      </div>
    )
  }
}

interface AudioPageInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: any
  currentProfile:any
}
interface AudioPageInnerState {
  hasConnected: boolean
  state:any
  value:number
  ids:any
  idsSet:boolean
}

class AudioPageInner extends React.Component<AudioPageInnerProps, AudioPageInnerState> {
  constructor(props: AudioPageInnerProps) {
    super(props)
    this.state = {
      hasConnected: props.device.connected,
      state:this.props.currentState,
      value:0,
      ids:{},
      idsSet:false
    }


   

    if (props.device.connected) {
      this.loadDeviceState(props)
      this.sendCommand("LibAtem.Commands.Audio.AudioMixerSendLevelsCommand",{SendLevels:true})
    }
  }


  loadDeviceState(props: AudioPageInnerProps) {
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
 
  componentDidMount(){
    
    //this.refs.slider.getDOMNode().orient = 'vertical';;
    // console.log("vertical2")
    // var step = ReactDOM.findDOMNode(this.refs.slider2) as any;
    // console.log(step)
    // step.outerHTML="<input type=\"range\" orient=\"vertical\">";
  }

  getIds(){
    var inputNames = Object.keys(this.props.currentState.settings.inputs)
    for(var j = 0; j < inputNames.length;j++){
      this.state.ids[this.props.currentState.settings.inputs[inputNames[j]].properties.id] = this.props.currentState.settings.inputs[inputNames[j]].properties.shortName
    }
    this.setState({idsSet:true})
  }

  

  render(){

    if(this.props.currentProfile==null || this.props.currentState==null){
      return(<p>Waiting for Profile</p>)
    }
    var audioInputs = Object.keys(this.props.currentState.audio.inputs)

    if(!this.state.idsSet){
      this.getIds()
    }

    var topBar=[]
    
    var channels=[]
    var lowerButtons=[]
    var name=[]
    var levels = []

   
    for(var i=0; i<  audioInputs.length;i++ ){
      const x =i; 
      if(this.props.currentState.audio.inputs[audioInputs[i]].properties.mixOption==1){
        name.push(<div className="name-active">{this.state.ids[audioInputs[i]]}</div>)
        topBar.push(<div className="tally tally-red"></div>)
        lowerButtons.push([        <div onClick={()=>this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x],Mask:1,MixOption:0})} className= "button-inner left button-inner-selected">ON</div>,
        <div onClick={()=>this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x],Mask:1,MixOption:2})} className= "button-inner right">AFV</div>])
      }else if(this.props.currentState.audio.inputs[audioInputs[i]].properties.mixOption==2){
        name.push(<div className="name-active">{this.state.ids[audioInputs[i]]}</div>)
        topBar.push(<div className="tally tally-yellow"></div>)
        lowerButtons.push([<div onClick={()=>this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x],Mask:1,MixOption:1})} className= "button-inner left">ON</div>,<div onClick={()=>this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x],Mask:1,MixOption:0})} className= "button-inner right button-inner-selected">AFV</div>])
      }else{
        name.push(<div className="name">{this.state.ids[audioInputs[i]]}</div>)
        lowerButtons.push([<div onClick={()=>this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x],Mask:1,MixOption:1})} className= "button-inner left">ON</div>,<div onClick={()=>this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x],Mask:1,MixOption:2})} className= "button-inner right">AFV</div>])
        topBar.push(<div className="tally"></div>)
      }

      if(this.props.currentState.audio.inputs[audioInputs[i]].levels!=null){
        if(this.props.currentState.audio.inputs[audioInputs[i]].levels.levels[0]=="-Infinity"){
          levels.push(<div style={{height:"100%"}} className ="level-inner"></div>)
        }else{
          var percent = Math.min(100-((this.props.currentState.audio.inputs[audioInputs[i]].levels.levels[0]+60)/0.60),100)
          // console.log(percent)
          levels.push(<div style={{height:percent+"%"}} className ="level-inner"></div>)
        }
        
      }else{
        levels.push(<div style={{height:"0px"}} className ="level-inner"></div>)
      }
      // console.log(parseInt(this.props.currentState.audio.inputs[audioInputs[i]].properties.gain))
      channels.push(<div className="channel">
      {name[x]}
      {topBar[x]}
      <div className="slider-holder">
          <div className="scale">
              <div>+6-</div>
              <div>0-</div>
              <div>-6-</div>
              <div>-9-</div>
              <div>-20-</div>
              <div>+6-</div>
              <div>-60-</div>
          </div>
          <div className="slider">
              <div className="fake-slider"></div>
              <Slider 
              tooltip = {false}
               max={6}
                min={-60} 
                step={0.01}
                value={this.props.currentState.audio.inputs[audioInputs[i]].properties.gain} 
                orientation="vertical"
                onChange={(e)=>this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x], MixOption: 0, Gain: e, Balance: -10000, RcaToXlrEnabled: false, Mask: 2 })}
                ></Slider>
              {/* <input ref="slider2" type="range" /> */}
          </div>
          <div className="level-holder">
            <div className="level">
              {levels[x]}
            </div>
          </div>
          <input placeholder={(this.props.currentState.audio.inputs[audioInputs[i]].properties.gain).toFixed(2)} className = "gain-input"></input>
      </div>
      <div className="pan">
        <div className="pan-inner">Pan</div>
        <input className = "pan-input"></input>
      </div>
  
      <div className="button-holder">
          {lowerButtons[x]}
      </div>
  
      <div className="phones">
        <svg className="phones-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#444444" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none" opacity=".1"/><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/></svg>
      </div>
  
  
  </div>)
    }

    return(
      
    <div className = "page-wrapper">
     
    {channels}
</div>
)
  }
    
  
}

