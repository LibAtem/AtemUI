import React from 'react'
import './Audio.css'
import { AtemDeviceInfo } from '../Devices/types'
import { GetDeviceId } from '../DeviceManager'
import Slider from 'react-rangeslider'
import { LibAtemEnums } from '../generated'
import { ErrorBoundary } from '../errorBoundary'
import { DevicePageWrapper } from '../device-page-wrapper'

export class AudioPage extends DevicePageWrapper {
  renderContent(device: AtemDeviceInfo, signalR: signalR.HubConnection) {
    return (
      <ErrorBoundary key={this.context.activeDeviceId || ''}>
        <div className="page-audio">
          <AudioPageInner device={device} currentState={this.context.currentState} signalR={signalR} />
        </div>
      </ErrorBoundary>
    )
  }
}

interface AudioPageInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: any // LibAtem.AtemState | null
}
interface AudioPageInnerState {
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
      value: 0,
      ids: {},
      idsSet: false,
      audioId: {
        1: { videoID: 'input1', audioID: 'input1' },
        2: { videoID: 'input2', audioID: 'input2' },
        3: { videoID: 'input3', audioID: 'input3' },
        4: { videoID: 'input4', audioID: 'input4' },
        5: { videoID: 'input5', audioID: 'input5' },
        6: { videoID: 'input6', audioID: 'input6' },
        7: { videoID: 'input7', audioID: 'input7' },
        8: { videoID: 'input8', audioID: 'input8' },
        9: { videoID: 'input9', audioID: 'input9' },
        10: { videoID: 'input10', audioID: 'input10' },
        11: { videoID: 'input11', audioID: 'input11' },
        12: { videoID: 'input12', audioID: 'input12' },
        13: { videoID: 'input13', audioID: 'input13' },
        14: { videoID: 'input14', audioID: 'input14' },
        15: { videoID: 'input15', audioID: 'input15' },
        16: { videoID: 'input16', audioID: 'input16' },
        17: { videoID: 'input17', audioID: 'input17' },
        18: { videoID: 'input18', audioID: 'input18' },
        19: { videoID: 'input19', audioID: 'input19' },
        20: { videoID: 'input20', audioID: 'input20' },
        1001: { videoID: null, audioID: 'XLR' },
        1101: { videoID: null, audioID: 'AESEBU' },
        1201: { videoID: null, audioID: 'RCA' },
        1301: { videoID: null, audioID: 'Mic1' },
        1302: { videoID: null, audioID: 'Mic2' },
        2001: { videoID: 'mediaPlayer1', audioID: 'mP1' },
        2002: { videoID: 'mediaPlayer2', audioID: 'mP2' },
        2003: { videoID: 'mediaPlayer3', audioID: 'mP3' },
        2004: { videoID: 'mediaPlayer4', audioID: 'mP4' },
      },
      peaks: {},
      peaksRight: {},
    }

    if (props.device.connected) {
      this.sendCommand('LibAtem.Commands.Audio.AudioMixerSendLevelsCommand', { SendLevels: true })
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
        .catch((e) => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }

  render() {
    if (!this.props.currentState?.audio?.inputs) {
      return <p>Waiting for Profile</p>
    }

    var audioInputs = Object.keys(this.props.currentState.audio.inputs)
    var mainInputs = audioInputs.filter((x) => parseInt(x) <= 20 || parseInt(x) >= 2000)
    var externInputs = audioInputs.filter((x) => parseInt(x) > 20 && parseInt(x) < 2000)

    var channels2 = []
    var external = []

    for (var i = 0; i < externInputs.length; i++) {
      var id = externInputs[i]
      external.push(
        <InputAudioChannel
          device={this.props.device}
          signalR={this.props.signalR}
          currentInput={this.props.currentState.audio.inputs[id]}
          id={id}
          audioId={this.state.audioId[id]}
          audioTally={this.props.currentState.audio.tally[this.state.audioId[id].audioID]}
          monitors={this.props.currentState.audio.monitorOutputs[0]}
          name={this.state.audioId[id].audioID}
        ></InputAudioChannel>
      )
    }

    for (var j = 0; j < mainInputs.length; j++) {
      var idMain = mainInputs[j]
      channels2.push(
        <InputAudioChannel
          device={this.props.device}
          signalR={this.props.signalR}
          currentInput={this.props.currentState.audio.inputs[idMain]}
          id={idMain}
          audioId={this.state.audioId[idMain]}
          audioTally={this.props.currentState.audio.tally[this.state.audioId[idMain].audioID]}
          monitors={this.props.currentState.audio.monitorOutputs[0]}
          name={this.props.currentState.settings.inputs[this.state.audioId[idMain].videoID].properties.shortName}
        ></InputAudioChannel>
      )
    }

    return (
      <div
        className="page-wrapper"
        style={{
          gridTemplateColumns:
            'repeat(' + mainInputs.length + ', 80px) 1px repeat(' + externInputs.length + ', 80px) 1px 80px',
        }}
      >
        {channels2}
        <div></div>
        {external}
        <div></div>
        <OutputAudioChannel
          device={this.props.device}
          signalR={this.props.signalR}
          id={'Master'}
          audioId={'Master'}
          audioTally={
            this.props.currentState.audio.programOut.followFadeToBlack &&
            (this.props.currentState.mixEffects[0].fadeToBlack.status.inTransition ||
              this.props.currentState.mixEffects[0].fadeToBlack.status.isFullyBlack)
          }
          followFadeToBlack={this.props.currentState.audio.programOut.followFadeToBlack}
          currentInput={this.props.currentState.audio.programOut}
        ></OutputAudioChannel>
      </div>
    )
  }
}

interface InputAudioChannelProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined

  currentInput: any

  audioTally: boolean
  id: string
  audioId: any
  monitors?: any
  name?: string
  followFadeToBlack?: Boolean
}
interface InputAudioChannelState {
  value: number
  ids: any
  peaks: any
}

class InputAudioChannel extends React.Component<InputAudioChannelProps, InputAudioChannelState> {
  constructor(props: InputAudioChannelProps) {
    super(props)
    this.state = {
      value: 0,
      ids: {},
      peaks: [
        [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],
        [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],
      ],
    }
  }

  shouldComponentUpdate(nextProps: InputAudioChannelProps) {
    const differentInput = JSON.stringify(this.props.currentInput) !== JSON.stringify(nextProps.currentInput)
    const differentName = this.props.name !== nextProps.name
    const differentMonitors = JSON.stringify(this.props.monitors) !== JSON.stringify(nextProps.monitors)
    // return differentName || differentInput || differentMonitors;
    return differentInput || differentName || differentMonitors
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
        .catch((e) => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }

  getTally(mixOption: number, tally: boolean) {
    if (mixOption === LibAtemEnums.AudioMixOption.Off) {
      return <div className="tally"></div>
    } else if (mixOption === 1) {
      return <div className="tally tally-red"></div>
    } else {
      if (tally) {
        return <div className="tally tally-red"></div>
      } else {
        return <div className="tally tally-yellow"></div>
      }
    }
  }

  getName(id: string) {
    // var name
    // if (this.props.audioId.videoID != null) {
    //   name = this.props.currentState.settings.inputs[this.props.audioId.videoID].properties.shortName
    // } else {
    //   name = this.props.audioId.audioID
    // }
    if (this.props.currentInput.properties.mixOption === 0) {
      return <div className="name">{this.props.name}</div>
    } else {
      return <div className="name-active">{this.props.name}</div>
    }
  }

  getLowerButtons(id: string, mixOption: number, sourceType: number) {
    //both
    if (sourceType === 0) {
      if (mixOption === 1) {
        return (
          <div className="button-holder">
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: id,
                  Mask: 1,
                  MixOption: 0,
                })
              }
              className="button-inner left button-inner-selected"
            >
              ON
            </div>
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: id,
                  Mask: 1,
                  MixOption: 2,
                })
              }
              className="button-inner right"
            >
              AFV
            </div>
            ]
          </div>
        )
      } else if (mixOption === 2) {
        return (
          <div className="button-holder">
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: id,
                  Mask: 1,
                  MixOption: 1,
                })
              }
              className="button-inner left"
            >
              ON
            </div>
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: id,
                  Mask: 1,
                  MixOption: 0,
                })
              }
              className="button-inner right button-inner-selected"
            >
              AFV
            </div>
          </div>
        )
      } else {
        return (
          <div className="button-holder">
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: id,
                  Mask: 1,
                  MixOption: 1,
                })
              }
              className="button-inner left"
            >
              ON
            </div>
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: id,
                  Mask: 1,
                  MixOption: 2,
                })
              }
              className="button-inner right"
            >
              AFV
            </div>
          </div>
        )
      }
    }
    //afv
    else if (sourceType === 1) {
      if (mixOption === 2) {
        return (
          <div className="button-holder">
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: id,
                  Mask: 1,
                  MixOption: 0,
                })
              }
              className="button-inner full button-inner-selected"
            >
              AFV
            </div>
          </div>
        )
      } else {
        return (
          <div className="button-holder">
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: id,
                  Mask: 1,
                  MixOption: 2,
                })
              }
              className="button-inner full"
            >
              AFV
            </div>
          </div>
        )
      }
    }
    //on
    else {
      if (mixOption === 1) {
        return (
          <div className="button-holder">
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: id,
                  Mask: 1,
                  MixOption: 0,
                })
              }
              className="button-inner full button-inner-selected"
            >
              ON
            </div>
          </div>
        )
      } else {
        return (
          <div className="button-holder">
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: id,
                  Mask: 1,
                  MixOption: 1,
                })
              }
              className="button-inner full"
            >
              ON
            </div>
          </div>
        )
      }
    }
  }

  getLevel(index: number, levels: any) {
    if (levels != null) {
      var level = levels.levels[index] === '-Infinity' ? -60 : levels.levels[index]
      var percent = Math.min(100 - ((Math.pow(2, level / 40) - 0.3535) / (1 - 0.3535)) * 100, 100)
      return <div style={{ height: percent + '%' }} className="level-inner"></div>
    } else {
      return <div style={{ height: '100%' }} className="level-inner"></div>
    }
  }

  getFloatingPeaks(index: number, levels: any, mixOption: number) {
    if (levels != null) {
      if (this.state.peaks) {
        //shouldnt have to do this check

        var total = 0
        for (var j = 0; j < 5; j++) {
          total += this.state.peaks[index][j]
        }
        var avg = total / 5
        var height = Math.min(100 - ((Math.pow(2, avg / 40) - 0.3535) / (1 - 0.3535)) * 100, 100) ///((avg + 60) / 0.60), 100)
        if (mixOption === 0) {
          return <div style={{ top: height + '%', background: '#5e5e5e' }} className="peak-inner"></div>
        } else if (height < 23) {
          return <div style={{ top: height + '%', background: 'red' }} className="peak-inner"></div>
        } else if (height < 50) {
          return <div style={{ top: height + '%', background: 'yellow' }} className="peak-inner"></div>
        } else {
          return <div style={{ top: height + '%', background: 'green' }} className="peak-inner"></div>
        }
      }
    }
  }

  getPeakBoxes(index: number, levels: any, mixOption: number) {
    if (levels != null) {
      if (levels.peaks[index] > -0.01) {
        if (mixOption === 0) {
          return index === 0 ? (
            <div style={{ background: '#5e5e5e' }} className="peakBox-active"></div>
          ) : (
            <div style={{ background: '#5e5e5e' }} className="peakBox-active level-right"></div>
          )
        } else {
          return index === 0 ? (
            <div className="peakBox-active"></div>
          ) : (
            <div className="peakBox-active level-right"></div>
          )
        }
      } else {
        return index === 0 ? <div className="peakBox"></div> : <div className="peakBox level-right"></div>
      }
    }
  }

  getTopBarPeak(levels: any) {
    if (levels != null) {
      var leftPeak = levels.peaks[0] === '-Infinity' ? -60 : levels.peaks[0]
      var rightPeak = levels.peaks[1] === '-Infinity' ? -60 : levels.peaks[1]
      if (Math.max(leftPeak, rightPeak) <= -60) {
        return <div className="peak"></div>
      } else if (Math.max(leftPeak, rightPeak) < -9) {
        return (
          <div className="peak" style={{ color: 'green' }}>
            {Math.max(leftPeak, rightPeak).toFixed(2)}
          </div>
        )
      } else {
        return <div className="peak">{Math.max(leftPeak, rightPeak).toFixed(2)}</div>
      }
    } else {
      return <div className="peak"></div>
    }
  }

  updatePeaks(levels: any) {
    for (var k = 0; k < 2; k++) {
      //for left and right
      //get average
      var total = 0
      for (var i = 0; i < this.state.peaks[k].length; i++) {
        total += this.state.peaks[k][i]
      }
      var avg = total / this.state.peaks[k].length

      if (levels === null) {
        this.state.peaks[k] = [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60]
      }

      //if new val is higher than average
      else {
        var level = levels.levels[k] === '-Infinity' ? -60 : levels.levels[k]
        if (level > avg) {
          this.state.peaks[k] = this.state.peaks[k].fill(parseInt(level), 0, 15)
        } else {
          this.state.peaks[k].shift()
          this.state.peaks[k].push(level)
        }
      }
    }
  }

  getPhonesButton() {
    if (this.props.monitors.enabled) {
      if (this.props.monitors.solo === true && this.props.monitors.soloSource == this.props.id) {
        return (
          <div
            className="phones phones-active phones-press"
            onClick={() =>
              this.sendCommand('LibAtem.Commands.Audio.AudioMixerMonitorSetCommand', { Solo: false, Mask: 8 })
            }
          >
            <svg
              className="phones-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#34c9eb"
              width="18px"
              height="18px"
            >
              <path d="M0 0h24v24H0z" fill="none" opacity=".1" />
              <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
            </svg>
          </div>
        )
      } else {
        return (
          <div
            className="phones phones-press"
            onClick={() =>
              this.sendCommand('LibAtem.Commands.Audio.AudioMixerMonitorSetCommand', {
                Solo: true,
                Mask: 24,
                SoloSource: this.props.id,
              })
            }
          >
            <svg
              className="phones-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#707070"
              width="18px"
              height="18px"
            >
              <path d="M0 0h24v24H0z" fill="none" opacity=".1" />
              <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
            </svg>
          </div>
        )
      }
    } else {
      return (
        <div className="phones phones-disabled">
          <svg
            className="phones-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#444444"
            width="18px"
            height="18px"
          >
            <path d="M0 0h24v24H0z" fill="none" opacity=".1" />
            <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
          </svg>
        </div>
      )
    }
  }

  getPan() {
    var slider = []
    var color = '#5e5e5e'
    if (this.props.currentInput.properties.mixOption !== 0) {
      color = '#ff7b00'
    }
    if (this.props.currentInput.properties.balance > 0) {
      slider.push(
        <div
          style={{
            left: '50%',
            background: color,
            width: (35 * this.props.currentInput.properties.balance) / 50 + 'px',
          }}
          className="pan-slider-inner"
        ></div>
      )
    } else {
      slider.push(
        <div
          style={{
            right: '50%',
            background: color,
            width: (35 * this.props.currentInput.properties.balance) / -50 + 'px',
          }}
          className="pan-slider-inner"
        ></div>
      )
    }
    return (
      <div className="pan">
        <div className="pan-inner">
          <div className="pan-labels">
            <div className="pan-L">L</div>
            <div className="pan-R">R</div>
          </div>
          <div
            onMouseDown={(event: any) => {
              var rect = event.target.getBoundingClientRect()
              var x = event.clientX - rect.left
              this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                Index: this.props.id,
                Balance: (x / 70) * 110 - 55,
                Mask: 4,
              })
              console.log(x)
            }}
            className="pan-slider"
          >
            {slider}
          </div>
        </div>
        <div
          onClick={(e) =>
            this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
              Index: this.props.id,
              Balance: 0,
              Mask: 4,
            })
          }
          className="pan-input"
        >
          {' '}
          {this.props.currentInput.properties.balance === 0
            ? ''
            : this.props.currentInput.properties.balance.toFixed(0)}
        </div>
      </div>
    )
  }

  render() {
    var mixOption = this.props.currentInput.properties.mixOption
    var levels = this.props.currentInput.levels
    this.updatePeaks(levels)
    var lowerButton = this.getLowerButtons(this.props.id, mixOption, this.props.currentInput.properties.sourceType)
    var name = this.getName(this.props.id)
    var tally = this.getTally(mixOption, this.props.audioTally)
    var levelsLeft = this.getLevel(0, levels)
    var levelsRight = this.getLevel(1, levels)
    var floatingPeaksLeft = this.getFloatingPeaks(0, levels, mixOption)
    var floatingPeaksRight = this.getFloatingPeaks(1, levels, mixOption)
    var peakBoxesLeft = this.getPeakBoxes(0, levels, mixOption)
    var peakBoxesRight = this.getPeakBoxes(1, levels, mixOption)
    var topBarPeak = this.getTopBarPeak(levels)
    var phonesButton = this.getPhonesButton()
    var pan = this.getPan()
    var levelsClass = mixOption == 0 ? 'level' : 'level level-rainbow'
    return (
      <div className="channel">
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
              value={Math.pow(
                2,
                (this.props.currentInput.properties.gain === '-Infinty'
                  ? -60
                  : this.props.currentInput.properties.gain) / 40
              )}
              orientation="vertical"
              onChange={(e) => {
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: this.props.id,
                  MixOption: 0,
                  Gain: Math.log2(e) * 40,
                  RcaToXlrEnabled: false,
                  Mask: 2,
                })
              }}
            ></Slider>
          </div>
          <div className="level-holder">
            <div className={levelsClass}>
              {levelsLeft}
              {floatingPeaksLeft}
            </div>
            {peakBoxesLeft}
            {peakBoxesRight}
            <div className={levelsClass + ' level-right'}>
              {levelsRight}
              {floatingPeaksRight}
            </div>
          </div>
          <input
            placeholder={
              this.props.currentInput.properties.gain === '-Infinity'
                ? -60
                : this.props.currentInput.properties.gain.toFixed(2)
            }
            className="gain-input"
          ></input>
        </div>
        {pan}
        {lowerButton}
        {phonesButton}
      </div>
    )
  }
}

class OutputAudioChannel extends InputAudioChannel {
  constructor(props: InputAudioChannelProps) {
    super(props)
    this.state = {
      value: 0,
      ids: {},
      peaks: [
        [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],
        [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],
      ],
    }
  }

  shouldComponentUpdate(nextProps: InputAudioChannelProps) {
    const differentInput = JSON.stringify(this.props.currentInput) !== JSON.stringify(nextProps.currentInput)
    const differentFollow = JSON.stringify(this.props.followFadeToBlack) != JSON.stringify(nextProps.followFadeToBlack)
    const differentTally = JSON.stringify(this.props.audioTally) != JSON.stringify(nextProps.audioTally)
    // return differentName || differentInput || differentMonitors;
    return differentInput || differentFollow || differentTally
  }

  getMasterTally() {
    if (this.props.audioTally) {
      return <div className="tally audio-flashit"></div>
    } else {
      return <div className="tally tally-red"></div>
    }
  }

  getMasterButtons() {
    if (this.props.followFadeToBlack) {
      return (
        <div className="button-holder">
          <div
            onClick={() =>
              this.sendCommand('LibAtem.Commands.Audio.AudioMixerMasterSetCommand', {
                FollowFadeToBlack: false,
                Mask: 4,
              })
            }
            className="button-inner full button-inner-selected"
          >
            AFV
          </div>
        </div>
      )
    } else {
      return (
        <div className="button-holder">
          <div
            onClick={() =>
              this.sendCommand('LibAtem.Commands.Audio.AudioMixerMasterSetCommand', {
                FollowFadeToBlack: true,
                Mask: 4,
              })
            }
            className="button-inner full "
          >
            AFV
          </div>
        </div>
      )
    }
  }

  render() {
    var lowerButton = this.getMasterButtons()
    var levels = this.props.currentInput.levels
    this.updatePeaks(levels)
    var tally = this.getMasterTally()
    var topBarPeak = this.getTopBarPeak(levels)
    var levelsLeft = this.getLevel(0, levels)
    var levelsRight = this.getLevel(1, levels)
    // peakBoxesLeft
    // var levelsLeft = (this.getLevel(this.props.id, 0))
    // var levelsRight = (this.getLevel(this.props.id, 1))
    var floatingPeaksLeft = this.getFloatingPeaks(0, levels, 1)
    var floatingPeaksRight = this.getFloatingPeaks(1, levels, 1)
    var peakBoxesLeft = this.getPeakBoxes(0, levels, 1)
    var peakBoxesRight = this.getPeakBoxes(1, levels, 1)

    // var topBarPeak=(this.getTopBarPeak(this.props.id))

    return (
      <div className="channel" style={{ gridTemplateRows: '30px 10px 1fr 20px 60px' }}>
        <div className="name-active">Master</div>
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
              value={Math.pow(
                2,
                (this.props.currentInput.gain === '-Infinty' ? -60 : this.props.currentInput.gain) / 40
              )}
              orientation="vertical"
              onChange={(e) => {
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerMasterSetCommand', {
                  Index: this.props.id,
                  Gain: Math.log2(e) * 40,
                  Mask: 1,
                })
              }}
            ></Slider>
          </div>
          <div className="level-holder">
            <div className="level level-rainbow">
              {levelsLeft}
              {floatingPeaksLeft}
            </div>
            {peakBoxesLeft}
            {peakBoxesRight}
            <div className="level level-right level-rainbow">
              {levelsRight}
              {floatingPeaksRight}
            </div>
          </div>
          <input
            placeholder={this.props.currentInput.gain === '-Infinity' ? -60 : this.props.currentInput.gain.toFixed(2)}
            className="gain-input"
          ></input>
        </div>

        {lowerButton}
      </div>
    )
  }
}
