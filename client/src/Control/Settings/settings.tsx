import React from 'react'
import './settings.scss'
import { TransitionSettings } from './Transition/transition'
import { DownstreamKeyerSettings } from './downstreamkey'
import { UpstreamKey } from './Upstream/upstream'
import { LibAtemState, LibAtemEnums, LibAtemProfile } from '../../generated'
import { AtemButtonBar } from '../common'
import { SendCommandStrict } from '../../device-page-wrapper'
import { ColorGeneratorSettings } from './color'
import { FadeToBlackSettings, FadeToBlackSettingsProps } from './ftb'
import { videoIds } from '../../ControlSettings/ids'
import { SuperSourceSettings } from './SuperSource/supersource'

interface SwitcherSettingsProps {
  sendCommand: SendCommandStrict
  currentState: LibAtemState.AtemState | null
  profile: LibAtemProfile.DeviceProfile | null
  full: boolean
  meIndex: number
}
interface SwitcherSettingsState {
  page: number
}

export class SwitcherSettings extends React.Component<SwitcherSettingsProps, SwitcherSettingsState> {
  constructor(props: SwitcherSettingsProps) {
    super(props)
    this.state = {
      page: 0
    }
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
    if (!this.props.currentState || !this.props.profile) {
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

    const meProps = this.props.currentState.mixEffects[this.props.meIndex] as LibAtemState.MixEffectState | undefined
    const videoMode = this.props.currentState.settings.videoMode

    if (!meProps) {
      return <p>Bad ME</p>
    }

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
              label: 'Output',
              value: 2,
              disabled: true
            }
          ]}
          selected={0}
          onChange={() => {}}
        />

        <ColorGeneratorSettings
          sendCommand={this.props.sendCommand}
          colorGenerators={this.props.currentState.colorGenerators}
        />

        <TransitionSettings
          meIndex={this.props.meIndex}
          sendCommand={this.props.sendCommand}
          transition={meProps.transition}
          profile={this.props.profile}
          inputProperties={inputProperties}
          videoMode={this.props.currentState.settings.videoMode}
        />

        {this.props.currentState.superSources.map((ssrc, i) => (
          <SuperSourceSettings
            key={`ssrc${i}`}
            sendCommand={this.props.sendCommand}
            index={i}
            hasMultiple={(this.props.currentState?.superSources.length ?? 0) > 1}
            ssrcProps={ssrc}
            sources={inputProperties}
            version={this.props.currentState?.info.version}
          />
        ))}

        {meProps.keyers.map((key, i) => (
          <UpstreamKey
            key={'usk' + i}
            sendCommand={this.props.sendCommand}
            keyer={key}
            meIndex={this.props.meIndex}
            keyerIndex={i}
            sources={inputProperties}
            videoMode={videoMode}
          />
        ))}

        <DownstreamKeyerSettings
          sendCommand={this.props.sendCommand}
          videoMode={this.props.currentState.settings.videoMode}
          sources={inputProperties}
          keyers={this.props.currentState.downstreamKeyers}
        />

        <FadeToBlackSettings
          sendCommand={this.props.sendCommand}
          meIndex={this.props.meIndex}
          ftb={meProps.fadeToBlack}
          videoMode={this.props.currentState.settings.videoMode}
          {...this.getFtbAudioProps(this.props.currentState)}
        />
      </div>
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
