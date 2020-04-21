import React from 'react'
import './Audio.css'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import OutsideClickHandler from 'react-outside-click-handler';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Slider from 'react-rangeslider';
import { Redirect } from 'react-router-dom';


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

  getIds() {
    var audio = Object.keys(this.props.currentState.audio.inputs)
    for (var j = 0; j < audio.length; j++) {
      this.state.peaks[audio[j]] = [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60]
      this.state.peaksRight[audio[j]] = [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60]
    }
    this.setState({ idsSet: true })
  }

  updatePeaks() {
    var audio = Object.keys(this.props.currentState.audio.inputs)

    //calc left peak
    for (var j = 0; j < audio.length; j++) {
      //get average 
      var total = 0;
      for (var i = 0; i < this.state.peaks[audio[j]].length; i++) {
        total += this.state.peaks[audio[j]][i];
      }
      var avg = total / this.state.peaks[audio[j]].length;

      //if new val is higher than average
      if (this.props.currentState.audio.inputs[audio[j]].levels.levels[0] > avg) {
        this.state.peaks[audio[j]] = this.state.peaks[audio[j]].fill(parseInt(this.props.currentState.audio.inputs[audio[j]].levels.levels[0]), 0, 15)
      } else {
        this.state.peaks[audio[j]].shift()
        this.state.peaks[audio[j]].push(this.props.currentState.audio.inputs[audio[j]].levels.levels[0])
      }


    }

    //calc right peak
    for (var j = 0; j < audio.length; j++) {
      var total = 0;
      for (var i = 0; i < this.state.peaksRight[audio[j]].length; i++) {
        total += this.state.peaksRight[audio[j]][i];
      }
      var avg = total / this.state.peaksRight[audio[j]].length;
      if (this.props.currentState.audio.inputs[audio[j]].levels.levels[1] > avg) {
        this.state.peaksRight[audio[j]] = this.state.peaksRight[audio[j]].fill(parseInt(this.props.currentState.audio.inputs[audio[j]].levels.levels[1]), 0, 15)
      } else {
        this.state.peaksRight[audio[j]].shift()
        this.state.peaksRight[audio[j]].push(this.props.currentState.audio.inputs[audio[j]].levels.levels[1])
      }


    }
  }



  render() {

    if (this.props.currentProfile == null || this.props.currentState == null) {
      return (<p>Waiting for Profile</p>)
    }
    var audioInputs = Object.keys(this.props.currentState.audio.inputs)

    if (!this.state.idsSet) {
      this.getIds()
    }


    var topBar = []

    var channels = []
    var lowerButtons = []
    var name = []
    var levels = []
    var levelsRight = []
    var peaks = []
    var peaksRight = []
    // console.log(audioInputs)
    // console.log(this.state.audioId)
    this.updatePeaks()
    for (var i = 0; i < audioInputs.length; i++) {
      //console.log(this.state.audioId[audioInputs[i]])
      const x = i;
      if (this.props.currentState.audio.inputs[audioInputs[i]].properties.mixOption == 1) {
        if (this.state.audioId[audioInputs[i]].videoID != null) {
          name.push(<div className="name-active">{this.props.currentState.settings.inputs[this.state.audioId[audioInputs[i]].videoID].properties.shortName}</div>)
        } else {
          name.push(<div className="name-active">{this.state.audioId[audioInputs[i]].audioID}</div>)
        }

        topBar.push(<div className="tally tally-red"></div>)
        lowerButtons.push([<div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x], Mask: 1, MixOption: 0 })} className="button-inner left button-inner-selected">ON</div>,
        <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x], Mask: 1, MixOption: 2 })} className="button-inner right">AFV</div>])
      } else if (this.props.currentState.audio.inputs[audioInputs[i]].properties.mixOption == 2) {
        if (this.state.audioId[audioInputs[i]].videoID != null) {
          name.push(<div className="name-active">{this.props.currentState.settings.inputs[this.state.audioId[audioInputs[i]].videoID].properties.shortName}</div>)
        } else {
          name.push(<div className="name-active">{this.state.audioId[audioInputs[i]].audioID}</div>)
        }




        if (this.props.currentState.audio.tally[this.state.audioId[audioInputs[i]].audioID]) {
          topBar.push(<div className="tally tally-red"></div>)
        } else {
          topBar.push(<div className="tally tally-yellow"></div>)
        }


        lowerButtons.push([<div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x], Mask: 1, MixOption: 1 })} className="button-inner left">ON</div>, <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x], Mask: 1, MixOption: 0 })} className="button-inner right button-inner-selected">AFV</div>])

      } else {

        if (this.state.audioId[audioInputs[i]].videoID != null) {
          name.push(<div className="name">{this.props.currentState.settings.inputs[this.state.audioId[audioInputs[i]].videoID].properties.shortName}</div>)
        } else {
          name.push(<div className="name">{this.state.audioId[audioInputs[i]].audioID}</div>)
        }
        lowerButtons.push([<div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x], Mask: 1, MixOption: 1 })} className="button-inner left">ON</div>, <div onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x], Mask: 1, MixOption: 2 })} className="button-inner right">AFV</div>])
        topBar.push(<div className="tally"></div>)
      }

      //levels left
      if (this.props.currentState.audio.inputs[audioInputs[i]].levels != null) {
        if (this.props.currentState.audio.inputs[audioInputs[i]].levels.levels[0] == "-Infinity") {
          levels.push(<div style={{ height: "100%" }} className="level-inner"></div>)
          peaks.push(<div ></div>)
        } else {
          var percent = Math.min(100 - ((this.props.currentState.audio.inputs[audioInputs[i]].levels.levels[0] + 60) / 0.60), 100)
          levels.push(<div style={{ height: percent + "%" }} className="level-inner"></div>)


          //left peaks
          if (this.state.peaks[audioInputs[i]]) {
            var total = 0;
            //console.log(this.state.peaks[audioInputs[i]])
            for (var j = 0; j < 5; j++) {
              total += this.state.peaks[audioInputs[i]][j];
            }
            var avg = total / 5;
            //console.log(avg)
            var height = Math.min(100 - ((avg + 60) / 0.60), 100)
            if (height < 23) {
              peaks.push(<div style={{ top: height + "%", background: "red" }} className="peak-inner"></div>)
            } else if (height < 50) {
              peaks.push(<div style={{ top: height + "%", background: "yellow" }} className="peak-inner"></div>)
            } else {
              peaks.push(<div style={{ top: height + "%", background: "green" }} className="peak-inner"></div>)
            }


          } else {
            console.log("err", console.log(this.state.peaks, audioInputs[i]))
          }
        }

      } else {
        levels.push(<div style={{ height: "100%" }} className="level-inner"></div>)
      }

      //levels right
      if (this.props.currentState.audio.inputs[audioInputs[i]].levels != null) {
        if (this.props.currentState.audio.inputs[audioInputs[i]].levels.levels[1] == "-Infinity") {
          levelsRight.push(<div style={{ height: "100%" }} className="level-inner"></div>)
          peaksRight.push(<div></div>)
        } else {
          var percent = Math.min(100 - ((this.props.currentState.audio.inputs[audioInputs[i]].levels.levels[1] + 60) / 0.60), 100)
          levelsRight.push(<div style={{ height: percent + "%" }} className="level-inner"></div>)


          //left peaks
          if (this.state.peaksRight[audioInputs[i]]) {
            var total = 0;
            for (var j = 0; j < 5; j++) {
              total += this.state.peaksRight[audioInputs[i]][j];
            }
            var avg = total / 5;
            var height = Math.min(100 - ((avg + 60) / 0.60), 100)
            if (height < 23) {
              peaksRight.push(<div style={{ top: height + "%", background: "red" }} className="peak-inner"></div>)
            } else if (height < 50) {
              peaksRight.push(<div style={{ top: height + "%", background: "yellow" }} className="peak-inner" ></div>)
            } else {
              peaksRight.push(<div style={{ top: height + "%", background: "green" }} className="peak-inner"></div>)
            }
          } else {
            console.log("err", console.log(this.state.peaksRight, audioInputs[i]))
          }



        }

      } else {
        levelsRight.push(<div style={{ height: "100%" }} className="level-inner"></div>)
        peaksRight.push(<div></div>)
      }

      channels.push(<div className="channel">
        {name[x]}
        {topBar[x]}
        <div className="slider-holder">
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
              value={(Math.pow(2, this.props.currentState.audio.inputs[audioInputs[i]].properties.gain / 40))}
              orientation="vertical"
              onChange={(e) => {


                this.sendCommand("LibAtem.Commands.Audio.AudioMixerInputSetCommand", { Index: audioInputs[x], MixOption: 0, Gain: Math.log2(e) * 40, RcaToXlrEnabled: false, Mask: 2 })
              }
              }

            ></Slider>
            {/* <input ref="slider2" type="range" /> */}
          </div>
          <div className="level-holder">
            <div className="level">
              {levels[x]}
              {peaks[x]}
            </div>

            <div className="level level-right">
              {levelsRight[x]}
              {peaksRight[x]}
            </div>
          </div>
          <input placeholder={(this.props.currentState.audio.inputs[audioInputs[i]].properties.gain).toFixed(2)} className="gain-input"></input>
        </div>
        <div className="pan">
          <div className="pan-inner">Pan</div>
          <input className="pan-input"></input>
        </div>

        <div className="button-holder">
          {lowerButtons[x]}
        </div>

        <div className="phones">
          <svg className="phones-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#444444" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none" opacity=".1" /><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" /></svg>
        </div>


      </div>)
    }

    return (

      <div className="page-wrapper">

        {channels}
      </div>
    )
  }


}

