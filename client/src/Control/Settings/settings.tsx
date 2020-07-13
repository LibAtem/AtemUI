import React from 'react'
import { AtemDeviceInfo } from '../../Devices/types'
import './settings.scss'
import { ChromePicker } from 'react-color'
import { GetDeviceId } from '../../DeviceManager'
import { Transition } from './Transition/transition'
import { DownStreamKeys } from './downstreamkey'
import { UpstreamKey } from './Upstream/upstream'
import { LibAtemState } from '../../generated'
import { AtemButtonBar } from '../button/button'

interface SwitcherSettingsProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: LibAtemState.AtemState | null
  full: boolean
}
interface SwitcherSettingsState {
  hasConnected: boolean
  page: number
  // full: boolean
}

export class SwitcherSettings extends React.Component<SwitcherSettingsProps, SwitcherSettingsState> {
  constructor(props: SwitcherSettingsProps) {
    super(props)
    this.state = {
      hasConnected: props.device.connected,
      page: 0
    }
  }

  render() {
    if (!this.props.currentState || !this.props.signalR) {
      return <div style={this.props.full ? { height: '100%' } : { overflowY: 'auto' }} className="ss"></div>
    }

    var upstreamKeys = []
    for (var i = 0; i < this.props.currentState.mixEffects[0].keyers.length; i++) {
      upstreamKeys.push(
        <UpstreamKey
          key={'up' + i}
          device={this.props.device}
          currentState={this.props.currentState}
          signalR={this.props.signalR}
          id={i}
          name={'Upstream Key ' + (i + 1)}
          mixEffect={0}
        />
      )
    }
    return (
      <div style={this.props.full ? { height: '100%' } : { overflowY: 'scroll' }} className="ss">
        {/* <div style={{ width: "0px", position: "relative" }} onClick={() => this.setState({ open: false })}>
                    <div className="open-button"><svg style={{ position: "absolute", left: "4px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="orange" width="25px" height="25px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg></div>
                </div> */}

        {/* <div style={{ overflowY: "scroll", height: "100%" }} > */}

        <AtemButtonBar
          style={{ margin: '10px' }}
          options={[
            {
              label: 'Palettes',
              value: 0
            },
            {
              label: 'Media Players',
              value: 1,
              disabled: true
            },
            {
              label: 'Capture',
              value: 2,
              disabled: true
            }
          ]}
          selected={0}
          onChange={() => {}}
        />

        <ColorMenu
          key={'cg'}
          device={this.props.device}
          currentState={this.props.currentState}
          signalR={this.props.signalR}
          name={'Color Generators'}
        />

        <Transition
          mixEffect={0}
          key={'tran'}
          device={this.props.device}
          currentState={this.props.currentState}
          signalR={this.props.signalR}
          name={'Transition'}
        />

        {upstreamKeys}

        <DownStreamKeys
          device={this.props.device}
          videoMode={this.props.currentState.settings.videoMode}
          inputs={this.props.currentState.settings.inputs}
          keyers={this.props.currentState.downstreamKeyers}
          signalR={this.props.signalR}
        />

        <FadeToBlack
          key={'ftb'}
          device={this.props.device}
          currentState={this.props.currentState}
          signalR={this.props.signalR}
          name={'Fade To Black'}
        />

        {/* </div> */}
      </div>
    )

    // }
    // else{
    //     return(
    //         <div style={{width:"0px",position:"relative"}} onClick={()=>this.setState({open:true})}>
    //             <div className="open-button"><svg style={{position:"absolute",left:"4px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="orange" width="25px" height="25px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg></div>
    //         </div>
    //     )
    // }
  }
}

interface SubMenuProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: any
  name: string
}
interface SubMenuState {
  hasConnected: boolean
  state: any | null
  currentState: any
  open: boolean
}

class FadeToBlack extends React.Component<SubMenuProps, SubMenuState> {
  constructor(props: SubMenuProps) {
    super(props)
    this.state = {
      open: false,
      hasConnected: props.device.connected,
      state: props.currentState,
      currentState: null
    }
  }

  private sendCommand(command: string, value: any) {
    const { device, signalR } = this.props
    ///console.log(device ,signalR)
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)
      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then(res => {
          console.log(value)
          console.log('ManualCommands: sent')
          console.log(command)
        })
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }

  render() {
    var rate = []
    var box = []
    if (this.state.open) {
      rate.push(
        <div className="ss-rate">
          <RateInput
            value={this.props.currentState.mixEffects[0].fadeToBlack.status.remainingFrames}
            videoMode={this.props.currentState.settings.videoMode}
            callback={e => {
              this.sendCommand('LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand', { Index: 0, Rate: e })
            }}
          />
        </div>
      )
      box.push(
        <div className="ss-rate-holder">
          <MagicLabel
            callback={(e: string) => {
              this.sendCommand('LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand', {
                Index: 0,
                Rate: Math.min(250, Math.max(parseInt(e), 0))
              })
            }}
            value={this.props.currentState.mixEffects[0].fadeToBlack.status.remainingFrames}
            label={'Rate:'}
          />
          {rate}
          <label className="ss-checkbox-container">
            Audio Follow Video
            <input
              type="checkbox"
              checked={this.props.currentState.audio.programOut.followFadeToBlack}
              onClick={() =>
                this.sendCommand('LibAtem.Commands.Audio.AudioMixerMasterSetCommand', {
                  FollowFadeToBlack: !this.props.currentState.audio.programOut.followFadeToBlack,
                  Mask: 4
                })
              }
            ></input>
            <span className="checkmark"></span>
          </label>
        </div>
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
          Fade to Black
        </div>
        <div className="ss-submenu-box">{box}</div>
      </div>
    )
  }
}

interface ColorMenuState {
  hasConnected: boolean
  state: any | null
  currentState: any
  open: boolean
  displayColorPicker: boolean
  displayColorPicker2: boolean
}

class ColorMenu extends React.Component<SubMenuProps, ColorMenuState> {
  constructor(props: SubMenuProps) {
    super(props)
    this.state = {
      open: false,
      hasConnected: props.device.connected,
      state: props.currentState,
      currentState: null,
      displayColorPicker: false,
      displayColorPicker2: false
    }
  }

  private sendCommand(command: string, value: any) {
    const { device, signalR } = this.props
    ///console.log(device ,signalR)
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then(res => {
          //   console.log(value)
          //   console.log('ManualCommands: sent')
          //   console.log(command)
        })
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }

  render() {
    var picker = this.state.displayColorPicker ? (
      <div className="color-picker-popover">
        <div className="color-picker-cover" onClick={() => this.setState({ displayColorPicker: false })} />
        <ChromePicker
          onChange={color => {
            this.sendCommand('LibAtem.Commands.ColorGeneratorSetCommand', {
              Index: 0,
              Hue: color.hsl.h,
              Saturation: color.hsl.s * 100,
              Luma: color.hsl.l * 100,
              Mask: 7
            })
          }}
          disableAlpha={true}
          color={{
            h: this.props.currentState.colorGenerators[0].hue,
            s: this.props.currentState.colorGenerators[0].saturation,
            l: this.props.currentState.colorGenerators[0].luma
          }}
        />
      </div>
    ) : null

    var picker2 = this.state.displayColorPicker2 ? (
      <div className="color-picker-popover">
        <div className="color-picker-cover" onClick={() => this.setState({ displayColorPicker2: false })} />
        <ChromePicker
          onChange={color => {
            this.sendCommand('LibAtem.Commands.ColorGeneratorSetCommand', {
              Index: 1,
              Hue: color.hsl.h,
              Saturation: color.hsl.s * 100,
              Luma: color.hsl.l * 100,
              Mask: 7
            })
          }}
          disableAlpha={true}
          color={{
            h: this.props.currentState.colorGenerators[1].hue,
            s: this.props.currentState.colorGenerators[1].saturation,
            l: this.props.currentState.colorGenerators[1].luma
          }}
        />
      </div>
    ) : null

    var box = []
    if (this.state.open) {
      box.push(
        <div className="ss-color-holder">
          <div className="ss-color-inner">
            {/* <div className="ss-radio-button"><div className="ss-radio-button-inner"></div></div> */}
            <div className="ss-label">Color 1</div>
            <div
              className="ss-color-picker"
              onClick={() => this.setState({ displayColorPicker: !this.state.displayColorPicker })}
              style={{
                background:
                  'hsl(' +
                  this.props.currentState.colorGenerators[0].hue +
                  ',' +
                  this.props.currentState.colorGenerators[0].saturation +
                  '%,' +
                  this.props.currentState.colorGenerators[0].luma +
                  '%)'
              }}
            ></div>
          </div>

          <div className="ss-color-inner">
            {/* <div className="ss-radio-button"></div> */}
            <div className="ss-label">Color 2</div>
            <div
              className="ss-color-picker"
              onClick={() => this.setState({ displayColorPicker2: !this.state.displayColorPicker2 })}
              style={{
                background:
                  'hsl(' +
                  this.props.currentState.colorGenerators[1].hue +
                  ',' +
                  this.props.currentState.colorGenerators[1].saturation +
                  '%,' +
                  this.props.currentState.colorGenerators[1].luma +
                  '%)'
              }}
            ></div>
            {picker2}
            {picker}
            {/* <ChromePicker disableAlpha ={true} color={{h:this.props.currentState.colorGenerators[0].hue,s:this.props.currentState.colorGenerators[0].saturation,l:this.props.currentState.colorGenerators[0].luma}} /> */}
          </div>
        </div>
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
          Color Generators
        </div>
        <div className="ss-submenu-box">{box}</div>
      </div>
    )
  }
}

interface MagicInputProps {
  callback: any
  value: any
  disabled?: boolean
  step?: number
}
interface MagicInputState {
  focus: boolean
  tempValue: any
}

export class MagicInput extends React.Component<MagicInputProps, MagicInputState> {
  constructor(props: MagicInputProps) {
    super(props)
    this.state = {
      focus: false,
      tempValue: this.props.value
    }
  }

  render() {
    return (
      <input
        type="number"
        step={this.props.step || 0.01}
        disabled={this.props.disabled}
        onBlur={e => {
          this.setState({ focus: false })
          this.props.callback(e.currentTarget.value)
        }}
        onFocus={e => this.setState({ focus: true, tempValue: this.props.value })}
        onChange={e => this.setState({ tempValue: e.currentTarget.value })}
        value={this.state.focus ? this.state.tempValue : this.props.value}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            this.props.callback(e.currentTarget.value)
          }
        }}
        className="ss-rate-input"
      ></input>
    )
  }
}

interface RateProps {
  callback: (val: number) => void
  value: number
  disabled?: boolean
  videoMode: number
  className?: string
}
interface RateState {
  focus: boolean
  tempValue: string
}

export class RateInput extends React.Component<RateProps, RateState> {
  constructor(props: RateProps) {
    super(props)
    this.state = {
      focus: false,
      tempValue: this.framesToRate(this.props.value)
    }
  }

  shouldComponentUpdate(nextProps: RateProps, nextState: RateState) {
    const changedVideoMode = this.props.videoMode !== nextProps.videoMode
    const changedValue = this.props.value !== nextProps.value
    const changedDisabled = this.props.disabled !== nextProps.disabled
    const changedTempValue = this.state.tempValue !== nextState.tempValue
    const changedFocus = this.state.focus !== nextState.focus

    return changedValue || changedVideoMode || changedFocus || changedTempValue || changedDisabled
  }

  rateToFrames(rate: string) {
    console.log(rate)
    var fps = [30, 25, 30, 25, 50, 60, 25, 30, 24, 24, 25, 30, 50][this.props.videoMode]
    return (
      parseInt(
        rate
          .replace(':', '')
          .padStart(4, '0')
          .substr(0, 2)
      ) *
        fps +
      parseInt(
        rate
          .replace(':', '')
          .padStart(4, '0')
          .substr(2, 3)
      )
    )
  }

  framesToRate(frames: number) {
    var fps = [30, 25, 30, 25, 50, 60, 25, 30, 24, 24, 25, 30, 50][this.props.videoMode]
    var framesRemaining = frames % fps
    var seconds = Math.floor(frames / fps)
    return seconds.toString() + ':' + framesRemaining.toString().padStart(2, '0')
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    var value = e.currentTarget.value
    if (value.match(/^(([0-9]|[0-9][0-9]|)(:)([0-9]|[0-9][0-9]|))$/g)) {
      this.setState({ tempValue: value })
    } else if (Number.isInteger(Number(value)) && value.length <= 3) {
      this.setState({ tempValue: value })
    }
  }

  render() {
    var className = this.props.className || 'ss-rate-input'
    return (
      <input
        disabled={this.props.disabled}
        onBlur={e => {
          this.setState({ focus: false })
          this.props.callback(Math.min(this.rateToFrames(this.state.tempValue), 250))
        }}
        onFocus={e => this.setState({ focus: true, tempValue: this.framesToRate(this.props.value) })}
        value={this.state.focus ? this.state.tempValue : this.framesToRate(this.props.value)}
        onChange={e => this.onChange(e)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            this.props.callback(Math.min(this.rateToFrames(this.state.tempValue), 250))
            this.setState({ tempValue: this.framesToRate(this.rateToFrames(this.state.tempValue)) })
          }
        }}
        className={className}
      ></input>
    )
  }
}

interface MagicLabelProps {
  callback: any
  value: any
  disabled?: boolean
  step?: number
  label: string
}
interface MagicLabelState {
  focus: boolean
  tempValue: any
  disabled: boolean
  xCoord: number
  yCoord: number
}

export class MagicLabel extends React.Component<MagicLabelProps, MagicLabelState> {
  constructor(props: MagicLabelProps) {
    super(props)
    this.state = {
      focus: false,
      tempValue: this.props.value,
      disabled: this.props.disabled || true,
      xCoord: 0,
      yCoord: 0
    }
  }

  render() {
    var step = this.props.step || 1
    return (
      <div
        style={{ overscrollBehavior: 'contain', touchAction: 'none' }}
        onTouchMove={e => {
          console.log(this.state.yCoord - e.touches.item(0).clientY)
          this.props.callback(this.props.value + (this.state.yCoord - e.touches.item(0).clientY))
          this.setState({ xCoord: e.touches.item(0).clientX, yCoord: e.touches.item(0).clientY })
        }}
        onTouchStart={e => this.setState({ xCoord: e.touches.item(0).clientX, yCoord: e.touches.item(0).clientY })}
        className="ss-label"
      >
        {this.props.label}
      </div>
    )
  }
}
