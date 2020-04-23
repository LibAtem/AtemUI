import React from 'react'
import './Audio.css'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import OutsideClickHandler from 'react-outside-click-handler';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Slider from 'react-rangeslider';
import { Redirect } from 'react-router-dom';
import { parse } from 'path';


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
            currentProfile={this.context.currentProfile}
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
  currentProfile: any
}
interface AudioPageInnerState {
  hasConnected: boolean
  state: any
  value: number
  ids: any
  idsSet: boolean
  audioId: any
  peaks: any
  peaksRight: any

}



class AudioPageInner extends React.Component<AudioPageInnerProps, AudioPageInnerState> {

  constructor(props: AudioPageInnerProps) {
    super(props)
    this.state = {
      hasConnected: props.device.connected,
      state: this.props.currentState,
      value: 0,
      ids: {},
      idsSet: false,
      audioId: {
        1: { videoID: "input1", audioID: "input1" },
        2: { videoID: "input2", audioID: "input2" },
        3: { videoID: "input3", audioID: "input3" },
        4: { videoID: "input4", audioID: "input4" },
        5: { videoID: "input5", audioID: "input5" },
        6: { videoID: "input6", audioID: "input6" },
        7: { videoID: "input7", audioID: "input7" },
        8: { videoID: "input8", audioID: "input8" },
        9: { videoID: "input9", audioID: "input9" },
        10: { videoID: "input10", audioID: "input10" },
        11: { videoID: "input11", audioID: "input11" },
        12: { videoID: "input12", audioID: "input12" },
        13: { videoID: "input13", audioID: "input13" },
        14: { videoID: "input14", audioID: "input14" },
        15: { videoID: "input15", audioID: "input15" },
        16: { videoID: "input16", audioID: "input16" },
        17: { videoID: "input17", audioID: "input17" },
        18: { videoID: "input18", audioID: "input18" },
        19: { videoID: "input19", audioID: "input19" },
        20: { videoID: "input20", audioID: "input20" },
        1001: { videoID: null, audioID: "XLR" },
        1101: { videoID: null, audioID: "AESEBU" },
        1201: { videoID: null, audioID: "RCA" },
        1301: { videoID: null, audioID: "Mic1" },
        1302: { videoID: null, audioID: "Mic2" },
        2001: { videoID: "mediaPlayer1", audioID: "mP1" },
        2002: { videoID: "mediaPlayer2", audioID: "mP2" },
        2003: { videoID: "mediaPlayer3", audioID: "mP3" },
        2004: { videoID: "mediaPlayer4", audioID: "mP4" },
      },
      peaks: {},
      peaksRight: {}

    }





    if (props.device.connected) {
      this.loadDeviceState(props)
      this.sendCommand("LibAtem.Commands.Audio.AudioMixerSendLevelsCommand", { SendLevels: true })
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
          // console.log(value)
          // console.log('ManualCommands: sent')
          // console.log(command)
        })
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
        })
    }

  }

  componentDidMount() {

    //this.refs.slider.getDOMNode().orient = 'vertical';;
    // console.log("vertical2")
    // var step = ReactDOM.findDOMNode(this.refs.slider2) as any;
    // console.log(step)
    // step.outerHTML="<input type=\"range\" orient=\"vertical\">";
  }

  // getIds() {
  //   var audio = Object.keys(this.props.currentState.audio.inputs)
  //   for (var j = 0; j < audio.length; j++) {
  //     this.state.peaks[audio[j]] = {}
  //     this.state.peaks[audio[j]][0] = [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60]
  //     this.state.peaks[audio[j]][1] = [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60]
  //   }
  //   this.setState({ idsSet: true })
  // }

  // updatePeaks() {
  //   var audio = Object.keys(this.props.currentState.audio.inputs)

    
  //   for (var k = 0; k < 2; k++) { //for left and right
  //     for (var j = 0; j < audio.length; j++) {
        
  //       //get average 
  //       var total = 0;
  //       for (var i = 0; i < this.state.peaks[audio[j]][k].length; i++) {
  //         total += this.state.peaks[audio[j]][k][i];
  //       }
  //       var avg = total / this.state.peaks[audio[j]][k].length;
        
  //       if (this.props.currentState.audio.inputs[audio[j]].levels == null) {
  //         this.state.peaks[audio[j]][k] = [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60]
  //       }

  //       //if new val is higher than average
  //       else{
  //       var level = (this.props.currentState.audio.inputs[audio[j]].levels.levels[k] == "-Infinity" ? -60 : this.props.currentState.audio.inputs[audio[j]].levels.levels[k])
  //       if (level > avg) {
  //         this.state.peaks[audio[j]][k] = this.state.peaks[audio[j]][k].fill(parseInt(level), 0, 15)
  //       } else {
  //         this.state.peaks[audio[j]][k].shift()
  //         this.state.peaks[audio[j]][k].push(level)
  //       }
  //     }
  //     }
  //   }

  // }

  // getTally(id: string) {
  //   if (this.props.currentState.audio.inputs[id].properties.mixOption == 0) {
  //     return (<div className="tally"></div>)
  //   } else if (this.props.currentState.audio.inputs[id].properties.mixOption == 1) {
  //     return (<div className="tally tally-red"></div>)
  //   } else {
  //     if (this.props.currentState.audio.tally[this.state.audioId[id].audioID]) {
  //       return (<div className="tally tally-red"></div>)
  //     } else {
  //       return (<div className="tally tally-yellow"></div>)
  //     }
  //   }
  // }

  // getName(id: string) {
  //   var name
  //   if (this.state.audioId[id].videoID != null) {
  //     name = this.props.currentState.settings.inputs[this.state.audioId[id].videoID].properties.shortName
  //   } else {
  //     name = this.state.audioId[id].audioID
  //   }
  //   if (this.props.currentState.audio.inputs[id].properties.mixOption == 0) {
  //     return (<div className="name">{name}</div>)
  //   } else {
  //     return (<div className="name-active">{name}</div>)
  //   }

  // }

  // getLowerButtons(id: string) {
  //   //both
  //   if (this.props.currentState.audio.inputs[id].properties.sourceType == 0) {
  //     if (this.props.currentState.audio.inputs[id].properties.mixOption == 1) {
  //       return (<div className="button-holder">
  //         <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 0 })} className="button-inner left button-inner-selected">ON</div>
  //         <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 2 })} className="button-inner right">AFV</div>]
  //       </div>)
  //     } else if (this.props.currentState.audio.inputs[id].properties.mixOption == 2) {
  //       return (<div className="button-holder">
  //         <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 1 })} className="button-inner left">ON</div>
  //         <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 0 })} className="button-inner right button-inner-selected">AFV</div>
  //       </div>)
  //     } else {
  //       return (<div className="button-holder">
  //         <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 1 })} className="button-inner left">ON</div>
  //         <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 2 })} className="button-inner right">AFV</div>
  //       </div>)
  //     }
  //   }
  //   //afv
  //   else if (this.props.currentState.audio.inputs[id].properties.sourceType == 1) {
  //     if (this.props.currentState.audio.inputs[id].properties.mixOption == 2) {
  //       return (<div className="button-holder">
  //         <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 0 })} className="button-inner full button-inner-selected">AFV</div>
  //       </div>)
  //     } else {
  //       return (<div className="button-holder">
  //         <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 2 })} className="button-inner full">AFV</div>
  //       </div>)
  //     }
  //   }
  //   //on
  //   else {
  //     if (this.props.currentState.audio.inputs[id].properties.mixOption == 1) {
  //       return (<div className="button-holder">
  //         <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 0 })} className="button-inner full button-inner-selected">ON</div>
  //       </div>)
  //     } else {
  //       return (<div className="button-holder">
  //         <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 1 })} className="button-inner full">ON</div>
  //       </div>)
  //     }
  //   }

  // }

  // getLevel(id: string, index: number) {
  //   if (this.props.currentState.audio.inputs[id].levels != null) {
  //     var level = (this.props.currentState.audio.inputs[id].levels.levels[index] == "-Infinity") ? -60 : this.props.currentState.audio.inputs[id].levels.levels[index]
  //     var percent = Math.min(100 - ((Math.pow(2,level/40)-0.3535)/(1-0.3535))*100 ,100)
  //     return (<div style={{ height: percent + "%" }} className="level-inner"></div>)
  //   } else {
  //     return (<div style={{ height: "100%" }} className="level-inner"></div>)
  //   }
  // }

  // getFloatingPeaks(id: string, index: number) {
  //   if (this.props.currentState.audio.inputs[id].levels != null) {
  //     if (this.state.peaks[id]) {

  //       var total = 0;
  //       for (var j = 0; j < 5; j++) {
  //         total += this.state.peaks[id][index][j];
  //       }
  //       var avg = total / 5;
  //       var height = Math.min(100 - ((Math.pow(2,avg/40)-0.3535)/(1-0.3535))*100 ,100)///((avg + 60) / 0.60), 100)
  //       if (height < 23) {
  //         return (<div style={{ top: height + "%", background: "red" }} className="peak-inner"></div>)
  //       } else if (height < 50) {
  //         return (<div style={{ top: height + "%", background: "yellow" }} className="peak-inner"></div>)
  //       } else {
  //         return (<div style={{ top: height + "%", background: "green" }} className="peak-inner"></div>)
  //       }

  //     } else {
  //       console.log("err", console.log(this.state.peaks, id))
  //     }

  //   }
  // }

  // getPeakBoxes(id: string, index: number) {
  //   if (this.props.currentState.audio.inputs[id].levels != null) {

  //     if (this.props.currentState.audio.inputs[id].levels.peaks[index] > -0.01) {
  //       return ((index == 0) ? <div className="peakBox-active"></div> : <div className="peakBox-active level-right"></div>)
  //     } else {
  //       return ((index == 0) ? <div className="peakBox"></div> : <div className="peakBox level-right"></div>)
  //     }
  //   }
  // }

  // getTopBarPeak(id: string) {
  //   if (this.props.currentState.audio.inputs[id].levels != null) {
  //   var leftPeak = (this.props.currentState.audio.inputs[id].levels.peaks[0] == "-Infinity") ? -60 : this.props.currentState.audio.inputs[id].levels.peaks[0]
  //   var rightPeak = (this.props.currentState.audio.inputs[id].levels.peaks[1] == "-Infinity") ? -60 : this.props.currentState.audio.inputs[id].levels.peaks[1]
  //   if (Math.max(leftPeak, rightPeak) <= -60) {
  //     return (<div className="peak"></div>)
  //   } else if (Math.max(leftPeak, rightPeak) < -9) {
  //     return (<div className="peak" style={{ color: "green" }}>{Math.max(leftPeak, rightPeak).toFixed(2)}</div>)

  //   } else {
  //     return (<div className="peak" >{Math.max(leftPeak, rightPeak).toFixed(2)}</div>)
  //   }
  // }else{
  //   return (<div className="peak"></div>)
  // }
  // }

 



  render() {

    if (this.props.currentProfile == null || this.props.currentState == null) {
      return (<p>Waiting for Profile</p>)
    }
    var audioInputs = Object.keys(this.props.currentState.audio.inputs)
    var mainInputs = audioInputs.filter(x => (parseInt(x)<=20||parseInt(x)>=2000))
    var externInputs = audioInputs.filter(x => (parseInt(x)>20&&parseInt(x)<2000))
    // if (!this.state.idsSet) {
    //   this.getIds()
    // }

    // var channels = []
    // var lowerButtons = []
    // var tally = []

    // var name = []

    // var levelsLeft = []
    // var levelsRight = []
    // var floatingPeaksLeft = []
    // var floatingPeaksRight = []
    // var peakBoxesLeft = []
    // var peakBoxesRight = []
    // var topBarPeak = []
    var channels2 = []
    var external = []
    // this.updatePeaks()

    for (var i = 0; i < externInputs.length; i++) {


      const x = i;
      var id = externInputs[x]

      external.push(<InputAudioChannel
      device = {this.props.device}
      signalR = {this.props.signalR}
      currentState ={this.props.currentState}
      currentProfile = {this.props.currentProfile}
      id = {id}
      audioId = {this.state.audioId[id]}
      ></InputAudioChannel>)

      }


    for (var i = 0; i < mainInputs.length; i++) {


      const x = i;
      var id = mainInputs[x]

      channels2.push(<InputAudioChannel
      device = {this.props.device}
      signalR = {this.props.signalR}
      currentState ={this.props.currentState}
      currentProfile = {this.props.currentProfile}
      id = {id}
      audioId = {this.state.audioId[id]}
      ></InputAudioChannel>)
      // lowerButtons.push(this.getLowerButtons(id))
      // name.push(this.getName(id))
      // tally.push(this.getTally(id))
      // levelsLeft.push(this.getLevel(id, 0))
      // levelsRight.push(this.getLevel(id, 1))
      // floatingPeaksLeft.push(this.getFloatingPeaks(id, 0))
      // floatingPeaksRight.push(this.getFloatingPeaks(id, 1))
      // peakBoxesLeft.push(this.getPeakBoxes(id, 0))
      // peakBoxesRight.push(this.getPeakBoxes(id, 1))
      // topBarPeak.push(this.getTopBarPeak(id))
      // channels.push(<div className="channel">
      //   {name[x]}
      //   {tally[x]}
      //   <div className="slider-holder">
      //     {topBarPeak[x]}
      //     <div className="scale">
      //       <div className="scale-1">+6-</div>
      //       <div className="scale-2">0-</div>
      //       <div className="scale-3">-6-</div>
      //       <div className="scale-4">-9-</div>
      //       <div className="scale-5">-20-</div>
      //       <div className="scale-6">-60-</div>
      //     </div>
      //     <div className="slider">
      //       <div className="fake-slider"></div>
      //       <Slider
      //         tooltip={false}
      //         max={1.1095}
      //         min={0.3535}
      //         step={0.001}
      //         value={(Math.pow(2, ((this.props.currentState.audio.inputs[mainInputs[i]].properties.gain=="-Infinty")?-60:this.props.currentState.audio.inputs[mainInputs[i]].properties.gain) / 40))}
      //         orientation="vertical"
      //         onChange={(e) => {
      //           this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: mainInputs[x], MixOption: 0, Gain: Math.log2(e) * 40, RcaToXlrEnabled: false, Mask: 2 })
      //         }
      //         }

      //       ></Slider>

      //     </div>
      //     <div className="level-holder">
      //       <div className="level">
      //         {levelsLeft[x]}
      //         {floatingPeaksLeft[x]}

      //       </div>
      //       {peakBoxesLeft[x]}
      //       {peakBoxesRight[x]}
      //       <div className="level level-right">
      //         {levelsRight[x]}
      //         {floatingPeaksRight[x]}


      //       </div>
      //     </div>
      //     <input placeholder={((this.props.currentState.audio.inputs[mainInputs[i]].properties.gain=="-Infinity")?-60:(this.props.currentState.audio.inputs[mainInputs[i]].properties.gain).toFixed(2))} className="gain-input"></input>
      //   </div>
      //   <div className="pan">
      //     <div className="pan-inner">Pan</div>
      //     <input className="pan-input"></input>
      //   </div>
      //   {lowerButtons[x]}
      //   <div className="phones">
      //     <svg className="phones-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#444444" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none" opacity=".1" /><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" /></svg>
      //   </div>
      // </div>)
    }

    return (

      <div className="page-wrapper" style={{gridTemplateColumns: "repeat("+mainInputs.length+", 80px) 1px repeat("+externInputs.length+", 80px) 1px 80px" }}>
        {channels2}
        <div></div>
        {external}
        <div></div>
        <OutputAudioChannel
      device = {this.props.device}
      signalR = {this.props.signalR}
      currentState ={this.props.currentState}
      currentProfile = {this.props.currentProfile}
      id = {"Master"}
      audioId = {"Master"}
      ></OutputAudioChannel>
      </div>
      
    )
  }


}

interface InputAudioChannelProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: any
  currentProfile: any
  id:string
  audioId:any
}
interface InputAudioChannelState {
  hasConnected: boolean
  state: any
  value: number
  ids: any
  peaks: any
}



class InputAudioChannel extends React.Component<InputAudioChannelProps, InputAudioChannelState> {

  constructor(props: InputAudioChannelProps) {
    super(props)
    this.state = {
      hasConnected: props.device.connected,
      state: this.props.currentState,
      value: 0,
      ids: {},
      peaks: [[-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],[-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60]],

    }
  }

  sendCommand(command: string, value: any) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then((res) => {
          // console.log(value)
          // console.log('ManualCommands: sent')
          // console.log(command)
        })
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
        })
    }

  }

  getTally(mixOption:number ,tally:boolean) {
    if (mixOption == 0) {
      return (<div className="tally"></div>)
    } else if (mixOption == 1) {
      return (<div className="tally tally-red"></div>)
    } else {
      if (tally) {
        return (<div className="tally tally-red"></div>)
      } else {
        return (<div className="tally tally-yellow"></div>)
      }
    }
  }

  getName(id: string) {
    var name
    if (this.props.audioId.videoID != null) {
      name = this.props.currentState.settings.inputs[this.props.audioId.videoID].properties.shortName
    } else {
      name = this.props.audioId.audioID
    }
    if (this.props.currentState.audio.inputs[id].properties.mixOption == 0) {
      return (<div className="name">{name}</div>)
    } else {
      return (<div className="name-active">{name}</div>)
    }

  }

  getLowerButtons(id: string ,mixOption: number, sourceType:number) {
    //both
    if (sourceType == 0) {
      if (mixOption == 1) {
        return (<div className="button-holder">
          <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 0 })} className="button-inner left button-inner-selected">ON</div>
          <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 2 })} className="button-inner right">AFV</div>]
        </div>)
      } else if (mixOption == 2) {
        return (<div className="button-holder">
          <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 1 })} className="button-inner left">ON</div>
          <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 0 })} className="button-inner right button-inner-selected">AFV</div>
        </div>)
      } else {
        return (<div className="button-holder">
          <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 1 })} className="button-inner left">ON</div>
          <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 2 })} className="button-inner right">AFV</div>
        </div>)
      }
    }
    //afv
    else if (sourceType == 1) {
      if (mixOption == 2) {
        return (<div className="button-holder">
          <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 0 })} className="button-inner full button-inner-selected">AFV</div>
        </div>)
      } else {
        return (<div className="button-holder">
          <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 2 })} className="button-inner full">AFV</div>
        </div>)
      }
    }
    //on
    else {
      if (mixOption == 1) {
        return (<div className="button-holder">
          <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 0 })} className="button-inner full button-inner-selected">ON</div>
        </div>)
      } else {
        return (<div className="button-holder">
          <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: id, Mask: 1, MixOption: 1 })} className="button-inner full">ON</div>
        </div>)
      }
    }

  }

  getLevel(index: number ,levels : any ) {
    if (levels != null) {
      var level = (levels.levels[index] == "-Infinity") ? -60 : levels.levels[index]
      var percent = Math.min(100 - ((Math.pow(2,level/40)-0.3535)/(1-0.3535))*100 ,100)
      return (<div style={{ height: percent + "%" }} className="level-inner"></div>)
    } else {
      return (<div style={{ height: "100%" }} className="level-inner"></div>)
    }
  }

  getFloatingPeaks(index: number,levels :any) {
    if (levels != null) {
      if (this.state.peaks) { //shouldnt have to do this check

        var total = 0;
        for (var j = 0; j < 5; j++) {
          total += this.state.peaks[index][j];
        }
        var avg = total / 5;
        var height = Math.min(100 - ((Math.pow(2,avg/40)-0.3535)/(1-0.3535))*100 ,100)///((avg + 60) / 0.60), 100)
        if (height < 23) {
          return (<div style={{ top: height + "%", background: "red" }} className="peak-inner"></div>)
        } else if (height < 50) {
          return (<div style={{ top: height + "%", background: "yellow" }} className="peak-inner"></div>)
        } else {
          return (<div style={{ top: height + "%", background: "green" }} className="peak-inner"></div>)
        }

      } 

    }
  }

  getPeakBoxes(index: number ,levels:any) {
    if (levels != null) {

      if (levels.peaks[index] > -0.01) {
        return ((index == 0) ? <div className="peakBox-active"></div> : <div className="peakBox-active level-right"></div>)
      } else {
        return ((index == 0) ? <div className="peakBox"></div> : <div className="peakBox level-right"></div>)
      }
    }
  }

  getTopBarPeak(levels:any) {
    if (levels != null) {
    var leftPeak = ( levels.peaks[0] == "-Infinity") ? -60 : levels.peaks[0]
    var rightPeak = ( levels.peaks[1] == "-Infinity") ? -60 :  levels.peaks[1]
    if (Math.max(leftPeak, rightPeak) <= -60) {
      return (<div className="peak"></div>)
    } else if (Math.max(leftPeak, rightPeak) < -9) {
      return (<div className="peak" style={{ color: "green" }}>{Math.max(leftPeak, rightPeak).toFixed(2)}</div>)

    } else {
      return (<div className="peak" >{Math.max(leftPeak, rightPeak).toFixed(2)}</div>)
    }
  }else{
    return (<div className="peak"></div>)
  }
  }

  updatePeaks(levels:any) {
   
    for (var k = 0; k < 2; k++) { //for left and right
        //get average 
        var total = 0;
        for (var i = 0; i < this.state.peaks[k].length; i++) {
          total += this.state.peaks[k][i];
        }
        var avg = total / this.state.peaks[k].length;
        
        if (levels == null) {
          this.state.peaks[k] = [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60]
        }

        //if new val is higher than average
        else{
        var level = (levels.levels[k] == "-Infinity" ? -60 : levels.levels[k])
        if (level > avg) {
          this.state.peaks[k] = this.state.peaks[k].fill(parseInt(level), 0, 15)
        } else {
          this.state.peaks[k].shift()
          this.state.peaks[k].push(level)
        }
      }
      
    }

  }

  getPhonesButton(){
    if(this.props.currentState.audio.monitorOutputs[0].enabled){
      if(this.props.currentState.audio.monitorOutputs[0].solo==true&&this.props.currentState.audio.monitorOutputs[0].soloSource==this.props.id){
        return(
          <div className="phones phones-active phones-press" onClick={()=>this.sendCommand("LibAtem.Commands.Audio.AudioMixerMonitorSetCommand",{ Solo: false, Mask: 8 })}>
          <svg className="phones-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34c9eb" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none" opacity=".1" /><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" /></svg>
        </div>)
      }else{
        return(
          <div className="phones phones-press" onClick={()=>this.sendCommand("LibAtem.Commands.Audio.AudioMixerMonitorSetCommand",{ Solo: true, Mask: 24, SoloSource: this.props.id })}>
          <svg className="phones-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#707070" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none" opacity=".1" /><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" /></svg>
        </div>)
      }
    }else{
      return(
        <div className="phones phones-disabled">
        <svg className="phones-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#444444" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none" opacity=".1" /><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" /></svg>
      </div>)
      }
    }
 


  render() {
      
      this.updatePeaks(this.props.currentState.audio.inputs[this.props.id].levels)
      var lowerButton= (this.getLowerButtons(this.props.id,this.props.currentState.audio.inputs[this.props.id].properties.mixOption,this.props.currentState.audio.inputs[this.props.id].properties.sourceType ))
      var name = (this.getName(this.props.id))
      var tally =(this.getTally(this.props.currentState.audio.inputs[this.props.id].properties.mixOption,this.props.currentState.audio.tally[this.props.audioId.audioID]))
      var levelsLeft = (this.getLevel(0,this.props.currentState.audio.inputs[this.props.id].levels))
      var levelsRight = (this.getLevel(1,this.props.currentState.audio.inputs[this.props.id].levels))
      var floatingPeaksLeft = (this.getFloatingPeaks(0,this.props.currentState.audio.inputs[this.props.id].levels))
      var floatingPeaksRight=(this.getFloatingPeaks(1,this.props.currentState.audio.inputs[this.props.id].levels))
      var peakBoxesLeft=this.getPeakBoxes(0,this.props.currentState.audio.inputs[this.props.id].levels)
      var peakBoxesRight=this.getPeakBoxes(1,this.props.currentState.audio.inputs[this.props.id].levels)
      var topBarPeak=(this.getTopBarPeak(this.props.currentState.audio.inputs[this.props.id].levels))
      var phonesButton= this.getPhonesButton()
      
      return(<div className="channel">
        {name}
        {tally}
        <div className="slider-holder">
          {topBarPeak}
          <div className="scale">
            <div className="scale-1">+6-</div>
            <div className="scale-2">0-</div>
            <div className="scale-3">-6-</div>
            <div className="scale-4">-9-</div>
            <div className="scale-5">-20-</div>
            <div className="scale-6">-60-</div>
          </div>
          <div className="slider">
            <div className="fake-slider"></div>
            <Slider
              tooltip={false}
              max={1.1095}
              min={0.3535}
              step={0.001}
              value={(Math.pow(2, ((this.props.currentState.audio.inputs[this.props.id].properties.gain=="-Infinty")?-60:this.props.currentState.audio.inputs[this.props.id].properties.gain) / 40))}
              orientation="vertical"
              onChange={(e) => {
                this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: this.props.id, MixOption: 0, Gain: Math.log2(e) * 40, RcaToXlrEnabled: false, Mask: 2 })
              }
              }

            ></Slider>

          </div>
          <div className="level-holder">
            <div className="level">
              {levelsLeft}
              {floatingPeaksLeft}

            </div>
            {peakBoxesLeft}
            {peakBoxesRight}
            <div className="level level-right">
              {levelsRight}
              {floatingPeaksRight}


            </div>
          </div>
          <input placeholder={((this.props.currentState.audio.inputs[this.props.id].properties.gain=="-Infinity")?-60:(this.props.currentState.audio.inputs[this.props.id].properties.gain).toFixed(2))} className="gain-input"></input>
        </div>
        <div className="pan">
          <div className="pan-inner">Pan</div>
          <input className="pan-input"></input>
        </div>
        {lowerButton}
        {phonesButton}
      </div>)

}
}

class OutputAudioChannel extends InputAudioChannel {

  constructor(props: InputAudioChannelProps) {
    super(props)
    this.state = {
      hasConnected: props.device.connected,
      state: this.props.currentState,
      value: 0,
      ids: {},
      peaks: [[-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],[-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60]]

    }
  }

  getMasterTally(){
    if(this.props.currentState.audio.programOut.followFadeToBlack && (this.props.currentState.mixEffects[0].fadeToBlack.status.inTransition||this.props.currentState.mixEffects[0].fadeToBlack.status.isFullyBlack)){
      return <div className ="tally flashit"></div>
    }else{
      return <div className ="tally tally-red"></div>
    }
  }

  getMasterButtons(){
    if(this.props.currentState.audio.programOut.followFadeToBlack){
        return(
          <div className="button-holder">
            <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerMasterSetCommand", { FollowFadeToBlack: false, Mask: 4 })} className="button-inner full button-inner-selected">AFV</div>
          </div>)
    }else{
      return(
        <div className="button-holder">
          <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerMasterSetCommand", { FollowFadeToBlack: true, Mask: 4 })} className="button-inner full ">AFV</div>
        </div>) }
  }


  

  render() {
    
    var lowerButton=  this.getMasterButtons()
    var levels = this.props.currentState.audio.programOut.levels
    this.updatePeaks(levels)
    var tally = this.getMasterTally()
    var topBarPeak=(this.getTopBarPeak(levels))
    var levelsLeft = (this.getLevel(0,levels))
    var levelsRight = (this.getLevel(1,levels))
    // peakBoxesLeft
    // var levelsLeft = (this.getLevel(this.props.id, 0))
    // var levelsRight = (this.getLevel(this.props.id, 1))
    var floatingPeaksLeft = (this.getFloatingPeaks(0,levels))
    var floatingPeaksRight=(this.getFloatingPeaks(1,levels))
    var peakBoxesLeft=(this.getPeakBoxes(0,levels))
    var peakBoxesRight=(this.getPeakBoxes(1,levels))
    
    // var topBarPeak=(this.getTopBarPeak(this.props.id))
    
    return(<div className="channel" style={{gridTemplateRows: "30px 10px 1fr 20px 60px"}}>
      <div className ="name-active">Master</div>
      {tally}
      <div className="slider-holder">
        {topBarPeak}
        <div className="scale">
          <div className="scale-1">+6-</div>
          <div className="scale-2">0-</div>
          <div className="scale-3">-6-</div>
          <div className="scale-4">-9-</div>
          <div className="scale-5">-20-</div>
          <div className="scale-6">-60-</div>
        </div>
        <div className="slider">
          <div className="fake-slider"></div>
          <Slider
            tooltip={false}
            max={1.1095}
            min={0.3535}
            step={0.001}
            value={(Math.pow(2, ((this.props.currentState.audio.programOut.gain=="-Infinty")?-60:this.props.currentState.audio.programOut.gain) / 40))}
            orientation="vertical"
            onChange={(e) => {
              this.sendCommand("LibAtem.Commands.Audio.AudioMixerMasterSetCommand", { Index: this.props.id,  Gain: Math.log2(e) * 40,  Mask: 1 })
            }
            }

          ></Slider>

        </div>
        <div className="level-holder">
          <div className="level">
            {levelsLeft}
            {floatingPeaksLeft}

          </div>
          {peakBoxesLeft}
          {peakBoxesRight}
          <div className="level level-right">
            {levelsRight}
            {floatingPeaksRight}


          </div>
        </div>
        <input placeholder={((this.props.currentState.audio.programOut.gain=="-Infinity")?-60:(this.props.currentState.audio.programOut.gain).toFixed(2))} className="gain-input"></input>
      </div>
      {lowerButton}
      
   
    </div>)

}
}