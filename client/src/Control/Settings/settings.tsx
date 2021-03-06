import React from 'react'
import './settings.scss'
import { TransitionSettings } from './Transition/transition'
import { DownstreamKeyerSettings } from './downstreamkey'
import { UpstreamKey } from './Upstream/upstream'
import { LibAtemState, LibAtemProfile } from '../../generated'
import { AtemButtonBar, SourcesMap } from '../../components'
import { SendCommandStrict } from '../../device-page-wrapper'
import { ColorGeneratorSettings } from './color'
import { FadeToBlackSettings, FadeToBlackSettingsProps } from './ftb'
import { SuperSourceSettings } from './SuperSource/supersource'
import { MediaPlayerSettings } from './mediaplayers'
import { HyperdeckSettings } from './hyperdeck'
import { StickyPanelBase } from './base'

interface SwitcherSettingsProps {
  sendCommand: SendCommandStrict
  currentState: LibAtemState.AtemState | null
  profile: LibAtemProfile.DeviceProfile | null
  sources: SourcesMap
  full: boolean
  meIndex: number
}
interface SwitcherSettingsState {
  page: number
}

export class SwitcherSettings extends StickyPanelBase<SwitcherSettingsProps, SwitcherSettingsState> {
  constructor(props: SwitcherSettingsProps) {
    super(props, 'control.settings.page')

    this.trackSessionValues('page')

    this.state = {
      page: this.getSessionValue('page') ?? 0,
    }
  }

  private getFtbAudioProps(
    state: LibAtemState.AtemState
  ): Pick<FadeToBlackSettingsProps, 'ftbMode' | 'followFadeToBlack'> {
    if (state.audio) {
      return {
        ftbMode: 'classic',
        followFadeToBlack: state.audio.programOut.followFadeToBlack,
      }
    } else if (state.fairlight) {
      return {
        ftbMode: 'fairlight',
        followFadeToBlack: state.fairlight.programOut.followFadeToBlack,
      }
    } else {
      return {
        ftbMode: null,
        followFadeToBlack: false,
      }
    }
  }

  render() {
    if (!this.props.currentState || !this.props.profile) {
      return <div style={this.props.full ? { height: '100%' } : { overflowY: 'auto' }} className="ss"></div>
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
              value: 0,
            },
            {
              label: 'Media Players',
              value: 1,
            },
            {
              label: 'Output',
              value: 2,
              disabled: true,
            },
          ]}
          selected={this.state.page}
          onChange={(newPage) => this.setState({ page: newPage })}
        />

        {this.state.page === 0 ? (
          <>
            <ColorGeneratorSettings
              sendCommand={this.props.sendCommand}
              colorGenerators={this.props.currentState.colorGenerators}
            />

            <TransitionSettings
              meIndex={this.props.meIndex}
              sendCommand={this.props.sendCommand}
              dveInfo={this.props.currentState.info.dve}
              transition={meProps.transition}
              profile={this.props.profile}
              sources={this.props.sources}
              videoMode={this.props.currentState.settings.videoMode}
            />

            {this.props.currentState.superSources.map((ssrc, i) => (
              <SuperSourceSettings
                key={`ssrc${i}`}
                sendCommand={this.props.sendCommand}
                index={i}
                hasMultiple={(this.props.currentState?.superSources.length ?? 0) > 1}
                ssrcProps={ssrc}
                sources={this.props.sources}
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
                sources={this.props.sources}
                videoMode={videoMode}
              />
            ))}

            <DownstreamKeyerSettings
              sendCommand={this.props.sendCommand}
              videoMode={this.props.currentState.settings.videoMode}
              sources={this.props.sources}
              keyers={this.props.currentState.downstreamKeyers}
            />

            <FadeToBlackSettings
              sendCommand={this.props.sendCommand}
              meIndex={this.props.meIndex}
              ftb={meProps.fadeToBlack}
              videoMode={this.props.currentState.settings.videoMode}
              {...this.getFtbAudioProps(this.props.currentState)}
            />
          </>
        ) : undefined}

        {this.state.page === 1 ? (
          <>
            <MediaPlayerSettings
              sendCommand={this.props.sendCommand}
              mediaPlayers={this.props.currentState.mediaPlayers}
              mediaPool={this.props.currentState.mediaPool}
            />

            <HyperdeckSettings sendCommand={this.props.sendCommand} />
          </>
        ) : undefined}
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
      yCoord: 0,
    }
  }

  render() {
    return (
      <div
        style={{ overscrollBehavior: 'contain', touchAction: 'none' }}
        onTouchMove={(e) => {
          console.log(this.state.yCoord - e.touches.item(0).clientY)
          this.props.callback(this.props.value + (this.state.yCoord - e.touches.item(0).clientY))
          this.setState({ xCoord: e.touches.item(0).clientX, yCoord: e.touches.item(0).clientY })
        }}
        onTouchStart={(e) => this.setState({ xCoord: e.touches.item(0).clientX, yCoord: e.touches.item(0).clientY })}
        className="atem-label"
      >
        {this.props.label}
      </div>
    )
  }
}
