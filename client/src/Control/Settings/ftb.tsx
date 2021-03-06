import React from 'react'
import { SendCommandStrict } from '../../device-page-wrapper'
import { RateInput, CheckboxInput } from '../../components'
import { MagicLabel } from './settings'
import { LibAtemState, LibAtemEnums, LibAtemCommands } from '../../generated'
import { StickyPanelBase } from './base'

export interface FadeToBlackSettingsProps {
  sendCommand: SendCommandStrict
  meIndex: number
  ftb: LibAtemState.MixEffectState_FadeToBlackState
  videoMode: LibAtemEnums.VideoMode
  ftbMode: 'classic' | 'fairlight' | null
  followFadeToBlack: boolean
}
interface FadeToBlackSettingsState {
  open: boolean
}

export class FadeToBlackSettings extends StickyPanelBase<FadeToBlackSettingsProps, FadeToBlackSettingsState> {
  constructor(props: FadeToBlackSettingsProps) {
    super(props, `control.settings.ftb`)

    this.trackSessionValues('open')

    this.state = {
      open: this.getSessionValue('open') == 1,
    }
  }

  render() {
    return (
      <div className="ss-submenu">
        <div
          className="ss-submenu-title"
          onClick={(e) => {
            this.setState({ open: !this.state.open })
          }}
        >
          Fade to Black
        </div>
        <div className="ss-submenu-box">
          {this.state.open ? (
            <div className="atem-form">
              <MagicLabel
                callback={(e: string) => {
                  this.props.sendCommand('LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand', {
                    Index: this.props.meIndex,
                    Rate: Math.min(250, Math.max(parseInt(e), 0)),
                  })
                }}
                value={this.props.ftb.status.remainingFrames}
                label={'Rate:'}
              />
              <div className="content-split">
                <div className="ss-rate">
                  <RateInput
                    value={this.props.ftb.status.remainingFrames}
                    videoMode={this.props.videoMode}
                    callback={(e) => {
                      this.props.sendCommand('LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand', {
                        Index: this.props.meIndex,
                        Rate: e,
                      })
                    }}
                  />
                </div>
                <CheckboxInput
                  label="Audio Follow Video"
                  value={this.props.followFadeToBlack}
                  disabled={this.props.meIndex !== 0 || this.props.ftbMode === null}
                  style={{ gridColumn: 'span 1' }}
                  onChange={(v) => {
                    switch (this.props.ftbMode) {
                      case 'classic':
                        this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerMasterSetCommand', {
                          FollowFadeToBlack: v,
                          Mask: LibAtemCommands.Audio_AudioMixerMasterSetCommand_MaskFlags.FollowFadeToBlack,
                        })
                        break
                      case 'fairlight':
                        // TODO - this isnt working..
                        this.props.sendCommand(
                          'LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterPropertiesSetCommand',
                          {
                            AudioFollowVideoCrossfadeTransitionEnabled: v,
                            Mask:
                              LibAtemCommands.Audio_Fairlight_FairlightMixerMasterPropertiesSetCommand_MaskFlags
                                .AudioFollowVideoCrossfadeTransitionEnabled,
                          }
                        )
                        break
                    }
                  }}
                />
              </div>
            </div>
          ) : undefined}
        </div>
      </div>
    )
  }
}
