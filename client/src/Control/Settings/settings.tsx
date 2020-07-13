import React from 'react'
import { AtemDeviceInfo } from '../../Devices/types'
import './settings.scss'
import { TransitionSettings } from './Transition/transition'
import { DownstreamKeyerSettings } from './downstreamkey'
import { UpstreamKey } from './Upstream/upstream'
import { LibAtemState, LibAtemEnums, LibAtemProfile, VideoModeInfoSet } from '../../generated'
import { AtemButtonBar } from '../button/button'
import { CommandTypes } from '../../generated/commands'
import { sendCommandStrict } from '../../device-page-wrapper'
import { ColorGeneratorSettings } from './color'
import { FadeToBlackSettings, FadeToBlackSettingsProps } from './ftb'
import { videoIds } from '../../ControlSettings/ids'
import { VideoMode } from '../../generated/common-enums'
import * as _ from 'underscore'

interface SwitcherSettingsProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
  currentState: LibAtemState.AtemState | null
  profile: LibAtemProfile.DeviceProfile | null
  full: boolean
}
interface SwitcherSettingsState {
  page: number
  // full: boolean
}

export class SwitcherSettings extends React.Component<SwitcherSettingsProps, SwitcherSettingsState> {
  constructor(props: SwitcherSettingsProps) {
    super(props)
    this.state = {
      page: 0
    }

    this.sendCommand = this.sendCommand.bind(this)
  }

  private sendCommand(...args: CommandTypes) {
    sendCommandStrict(this.props, ...args)
  }

  private getFtbAudioProps(
    state: LibAtemState.AtemState
  ): Pick<FadeToBlackSettingsProps, 'ftbMode' | 'followFadeToBlack'> {
    if (state.audio) {
      return {
        ftbMode: 'classic',
        followFadeToBlack: state.audio.programOut.followFadeToBlack
      }
    } else if (state.fairlight) {
      return {
        ftbMode: 'fairlight',
        followFadeToBlack: state.fairlight.programOut.followFadeToBlack
      }
    } else {
      return {
        ftbMode: null,
        followFadeToBlack: false
      }
    }
  }

  render() {
    if (!this.props.currentState || !this.props.signalR || !this.props.profile) {
      return <div style={this.props.full ? { height: '100%' } : { overflowY: 'auto' }} className="ss"></div>
    }

    const inputProperties = new Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>()
    // TODO - memo this?
    for (const [k, v] of Object.entries(this.props.currentState.settings.inputs)) {
      const id = videoIds[k]
      if (id !== undefined) {
        inputProperties.set(id, v.properties)
      }
    }

    const meIndex = 0
    const meProps = this.props.currentState.mixEffects[meIndex]

    return (
      <div style={this.props.full ? { height: '100%' } : { overflowY: 'scroll' }} className="ss">
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

        <ColorGeneratorSettings
          sendCommand={this.sendCommand}
          colorGenerators={this.props.currentState.colorGenerators}
        />

        <TransitionSettings
          meIndex={meIndex}
          sendCommand={this.sendCommand}
          transition={meProps.transition}
          profile={this.props.profile}
          inputProperties={inputProperties}
          videoMode={this.props.currentState.settings.videoMode}
        />

        {meProps.keyers.map((key, i) => (
          <UpstreamKey
            key={'usk' + i}
            sendCommand={this.sendCommand}
            currentState={this.props.currentState}
            id={i}
            name={'Upstream Key ' + (i + 1)}
            mixEffect={meIndex}
          />
        ))}

        <DownstreamKeyerSettings
          sendCommand={this.sendCommand}
          videoMode={this.props.currentState.settings.videoMode}
          sources={inputProperties}
          keyers={this.props.currentState.downstreamKeyers}
        />

        <FadeToBlackSettings
          sendCommand={this.sendCommand}
          meIndex={meIndex}
          ftb={meProps.fadeToBlack}
          videoMode={this.props.currentState.settings.videoMode}
          {...this.getFtbAudioProps(this.props.currentState)}
        />
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

interface RateInputProps {
  callback: (frames: number) => void
  value: number
  disabled?: boolean
  videoMode: VideoMode
  className?: string
}
interface RateInputState {
  focus: boolean
  tempValue: string
}

export class RateInput extends React.Component<RateInputProps, RateInputState> {
  constructor(props: RateInputProps) {
    super(props)
    this.state = {
      focus: false,
      tempValue: this.framesToRate(this.props.value)
    }
  }

  shouldComponentUpdate(nextProps: RateInputProps, nextState: RateInputState) {
    return (
      !_.isEqual(_.omit(nextProps, 'callback'), _.omit(this.props, 'callback')) || !_.isEqual(nextState, this.state)
    )
  }

  private rateToFrames(rate: string): number {
    let res = 0

    const rateMatch = rate.match(/^(([0-9]*):|)([0-9]*)$/)
    if (rateMatch) {
      const frames = Number(rateMatch[3])
      const seconds = Number(rateMatch[2])
      if (!Number.isNaN(frames) && !Number.isNaN(seconds)) {
        const fps = VideoModeInfoSet[this.props.videoMode]?.framerate ?? 30
        res = seconds * fps + frames
      } else if (!Number.isNaN(frames)) {
        res = frames
      }
    }

    return Math.min(res, 250)
  }

  private framesToRate(frames: number) {
    const fps = VideoModeInfoSet[this.props.videoMode]?.framerate ?? 30
    const framesRemaining = `${frames % fps}`.padStart(2, '0')
    const seconds = Math.floor(frames / fps)
    return `${seconds}:${framesRemaining}`
  }

  private cleanRate(rate: string) {
    return this.framesToRate(this.rateToFrames(rate))
  }

  private onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ tempValue: e.currentTarget.value })
  }

  render() {
    const className = this.props.className || 'ss-rate-input'
    return (
      <input
        disabled={this.props.disabled}
        onBlur={e => {
          this.setState({ focus: false })
          this.props.callback(this.rateToFrames(this.state.tempValue))
        }}
        onFocus={e => this.setState({ focus: true, tempValue: this.framesToRate(this.props.value) })}
        value={this.state.focus ? this.state.tempValue : this.framesToRate(this.props.value)}
        onChange={e => this.onChange(e)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            this.props.callback(this.rateToFrames(this.state.tempValue))
            this.setState({ tempValue: this.cleanRate(this.state.tempValue) })
          }
        }}
        className={className}
      />
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
