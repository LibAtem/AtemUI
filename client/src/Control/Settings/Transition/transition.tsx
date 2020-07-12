import { GetDeviceId } from '../../../DeviceManager'
import React from 'react'
import Slider from 'react-rangeslider'
import { MagicInput, RateInput } from '../settings'
import { videoIds } from '../../../ControlSettings/ids'
import { Wipe } from './wipe'
import { DVE } from './dve'
import { AtemDeviceInfo } from '../../../Devices/types'
import { ToggleButton } from '../common'

interface TransitionState {
  hasConnected: boolean
  state: any | null
  currentState: any
  open: boolean
  page: number
}

interface SubMenuProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: any
  name: string
  mixEffect: number
}

export class Transition extends React.Component<SubMenuProps, TransitionState> {
  constructor(props: SubMenuProps) {
    super(props)
    this.state = {
      open: false,
      hasConnected: props.device.connected,
      state: props.currentState,
      currentState: null,
      page: 0
    }
  }

  private sendCommand(command: string, value: any) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)
      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then(res => {})
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }

  getPreMultBox(index: number) {
    var enabled = this.props.currentState.mixEffects[index].transition.stinger.preMultipliedKey
    var diabledClass = !enabled ? 'sss ss-slider-outer' : 'sss ss-slider-outer disabled'
    return (
      <div className="ss-pmk">
        <ToggleButton
          active={enabled}
          label={'Pre Multiplied Key'}
          onClick={() => {
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
              Index: index,
              Mask: 2,
              PreMultipliedKey: !enabled
            })
          }}
        />
        <div className="ss-slider-holder">
          <div className={diabledClass}>
            <Slider
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                  Index: index,
                  Mask: 4,
                  Clip: e
                })
              }
              value={this.props.currentState.mixEffects[index].transition.stinger.clip}
            />
            <div className="ss-slider-label">Clip:</div>
          </div>
          <MagicInput
            disabled={enabled}
            value={this.props.currentState.mixEffects[index].transition.stinger.clip}
            callback={(value: any) => {
              if (value != '') {
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                  Index: index,
                  Mask: 4,
                  Clip: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <div className="ss-slider-holder">
          <div className={diabledClass}>
            <Slider
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                  Index: index,
                  Mask: 8,
                  Gain: e
                })
              }
              value={this.props.currentState.mixEffects[index].transition.stinger.gain}
            />
            <div className="ss-slider-label">Gain:</div>
          </div>
          <MagicInput
            disabled={enabled}
            value={this.props.currentState.mixEffects[index].transition.stinger.gain}
            callback={(value: any) => {
              if (value != '') {
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                  Index: index,
                  Mask: 8,
                  Gain: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <label className="ss-checkbox-container">
          Invert
          <input
            type="checkbox"
            disabled={enabled}
            checked={this.props.currentState.mixEffects[index].transition.stinger.invert}
            onClick={() =>
              this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                Index: index,
                Mask: 16,
                Invert: !this.props.currentState.mixEffects[index].transition.stinger.invert
              })
            }
          ></input>
          <span className="checkmark"></span>
        </label>
      </div>
    )
  }

  getSourceOptions() {
    var inputs = Object.keys(this.props.currentState.settings.inputs)
    var sources = inputs.filter(i => videoIds[i] < 4000)
    var options = []
    for (var i in sources) {
      options.push(
        <option value={videoIds[sources[i]]}>
          {this.props.currentState.settings.inputs[sources[i]].properties.longName}
        </option>
      )
    }
    return options
  }

  getMediaPlayerOptions() {
    var sources = Object.keys(this.props.currentState.settings.inputs).filter(
      i => videoIds[i] === 3010 || videoIds[i] === 3020 || videoIds[i] === 3030 || videoIds[i] === 3040
    )
    var options = []
    for (var i in sources) {
      const x = parseInt(i)
      options.push(
        <option value={x + 1}>{this.props.currentState.settings.inputs[sources[i]].properties.longName}</option>
      )
    }
    return options
  }

  render() {
    if (!this.state.open) {
      return (
        <div className="ss-submenu">
          <div
            className="ss-submenu-title"
            onClick={e => {
              this.setState({ open: !this.state.open })
            }}
          >
            {this.props.name}
          </div>
          <div className="ss-submenu-box"></div>
        </div>
      )
    }

    var box = []
    if (this.state.page === 0) {
      //mix
      box.push(
        <div className="ss-row">
          <div className="ss-label">Rate:</div>{' '}
          <div className="ss-rate">
            <RateInput
              value={this.props.currentState.mixEffects[this.props.mixEffect].transition.mix.rate}
              videoMode={this.props.currentState.settings.videoMode}
              callback={(e) => {
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionMixSetCommand', {
                  Index: this.props.mixEffect,
                  Rate: e
                })
              }}
            />
          </div>
        </div>
      )
    } else if (this.state.page === 1) {
      //dip
      box.push(
        <div className="ss-row">
          <div className="ss-label">Rate:</div>{' '}
          <div className="ss-rate">
            <RateInput
              value={this.props.currentState.mixEffects[this.props.mixEffect].transition.dip.rate}
              videoMode={this.props.currentState.settings.videoMode}
              callback={(e) => {
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDipSetCommand', {
                  Index: this.props.mixEffect,
                  Mask: 1,
                  Rate: e
                })
              }}
            />
          </div>
        </div>
      )

      box.push(
        <div className="ss-row">
          <div className="ss-label">Dip Source:</div>
          <select
            onChange={e => {
              this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDipSetCommand', {
                Index: this.props.mixEffect,
                Mask: 2,
                Input: e.currentTarget.value
              })
            }}
            value={this.props.currentState.mixEffects[this.props.mixEffect].transition.dip.input}
            className="ss-dropdown"
            id="cars"
          >
            {this.getSourceOptions()}
          </select>
        </div>
      )
    } else if (this.state.page === 2) {
      //wipe
      box.push(
        <Wipe
          mixEffect={this.props.mixEffect}
          device={this.props.device}
          signalR={this.props.signalR}
          currentState={this.props.currentState}
        />
      )
    } else if (this.state.page === 3) {
      //stinger
      box.push(
        <div className="ss-row">
          <div className="ss-label">Source:</div>
          <select
            onChange={e => {
              this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                Index: this.props.mixEffect,
                Mask: 1,
                Source: e.currentTarget.value
              })
            }}
            value={this.props.currentState.mixEffects[this.props.mixEffect].transition.stinger.source}
            className="ss-dropdown"
            id="cars"
          >
            {this.getMediaPlayerOptions()}
          </select>
        </div>
      )

      box.push(
        <div className="ss-row">
          <div className="ss-label">Clip Duration:</div>{' '}
          <div className="ss-rate">
            <RateInput
              value={this.props.currentState.mixEffects[this.props.mixEffect].transition.stinger.clipDuration}
              videoMode={this.props.currentState.settings.videoMode}
              callback={(e) => {
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                  Index: this.props.mixEffect,
                  Mask: 64,
                  ClipDuration: e
                })
              }}
            />
          </div>
        </div>
      )
      box.push(
        <div className="ss-row">
          <div className="ss-label">Trigger Point:</div>{' '}
          <div className="ss-rate">
            <RateInput
              value={this.props.currentState.mixEffects[this.props.mixEffect].transition.stinger.triggerPoint}
              videoMode={this.props.currentState.settings.videoMode}
              callback={(e) => {
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                  Index: this.props.mixEffect,
                  Mask: 128,
                  TriggerPoint: e
                })
              }}
            />
          </div>
        </div>
      )
      box.push(
        <div className="ss-row">
          <div className="ss-label">Mix Rate:</div>{' '}
          <div className="ss-rate">
            <RateInput
              value={this.props.currentState.mixEffects[this.props.mixEffect].transition.stinger.mixRate}
              videoMode={this.props.currentState.settings.videoMode}
              callback={(e) => {
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                  Index: this.props.mixEffect,
                  Mask: 256,
                  MixRate: e
                })
              }}
            />
          </div>
        </div>
      )
      box.push(
        <div className="ss-row">
          <div className="ss-label">Pre Roll:</div>{' '}
          <div className="ss-rate">
            <RateInput
              value={this.props.currentState.mixEffects[this.props.mixEffect].transition.stinger.preroll}
              videoMode={this.props.currentState.settings.videoMode}
              callback={(e) => {
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                  Index: this.props.mixEffect,
                  Mask: 32,
                  Preroll: e
                })
              }}
            />
          </div>
        </div>
      )
      box.push(this.getPreMultBox(this.props.mixEffect))
    } else if (this.state.page === 4) {
      //dve
      box.push(
        <DVE
          mixEffect={this.props.mixEffect}
          device={this.props.device}
          signalR={this.props.signalR}
          currentState={this.props.currentState}
        />
      )
    }

    return (
      <div className="ss-submenu">
        <div
          className="ss-submenu-title"
          onClick={e => {
            this.setState({ open: !this.state.open })
          }}
        >
          {this.props.name}
        </div>
        <div className="ss-submenu-box" style={{ overflow: 'hidden' }}>
          <div className="ss-submenu-submenu">
            <div
              onClick={() => this.setState({ page: 0 })}
              className={this.state.page === 0 ? 'ss-submenu-submenu-item' : 'ss-submenu-submenu-item disabled'}
            >
              Mix
            </div>
            <div
              onClick={() => this.setState({ page: 1 })}
              className={this.state.page === 1 ? 'ss-submenu-submenu-item' : 'ss-submenu-submenu-item disabled'}
            >
              Dip
            </div>
            <div
              onClick={() => this.setState({ page: 2 })}
              className={this.state.page === 2 ? 'ss-submenu-submenu-item' : 'ss-submenu-submenu-item disabled'}
            >
              Wipe
            </div>
            <div
              onClick={() => this.setState({ page: 3 })}
              className={this.state.page === 3 ? 'ss-submenu-submenu-item' : 'ss-submenu-submenu-item disabled'}
            >
              Stinger
            </div>
            <div
              onClick={() => this.setState({ page: 4 })}
              className={this.state.page === 4 ? 'ss-submenu-submenu-item' : 'ss-submenu-submenu-item disabled'}
            >
              DVE
            </div>
          </div>

          {box}
        </div>
      </div>
    )
  }
}
