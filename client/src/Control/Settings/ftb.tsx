import React from 'react'
import { SendCommandStrict } from '../../device-page-wrapper'
import { RateInput, MagicLabel } from './settings'
import { LibAtemState, LibAtemEnums, LibAtemCommands } from '../../generated'

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

export class FadeToBlackSettings extends React.Component<FadeToBlackSettingsProps, FadeToBlackSettingsState> {
  constructor(props: FadeToBlackSettingsProps) {
    super(props)
    this.state = {
      open: false
    }
  }

  render() {
    const disableAfv = this.props.meIndex !== 0 || this.props.ftbMode === null
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
        <div className="ss-submenu-box">
          {this.state.open ? (
            <div className="ss-rate-holder">
              <MagicLabel
                callback={(e: string) => {
                  this.props.sendCommand('LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand', {
                    Index: this.props.meIndex,
                    Rate: Math.min(250, Math.max(parseInt(e), 0))
                  })
                }}
                value={this.props.ftb.status.remainingFrames}
                label={'Rate:'}
              />
              <div className="ss-rate">
                <RateInput
                  value={this.props.ftb.status.remainingFrames}
                  videoMode={this.props.videoMode}
                  callback={e => {
                    this.props.sendCommand('LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand', {
                      Index: this.props.meIndex,
                      Rate: e
                    })
                  }}
                />
              </div>
              <label className={`ss-checkbox-container ${disableAfv ? 'disabled' : ''}`}>
                Audio Follow Video
                <input
                  type="checkbox"
                  checked={this.props.followFadeToBlack}
                  disabled={this.props.meIndex !== 0 || this.props.ftbMode === null}
                  onClick={() => {
                    switch (this.props.ftbMode) {
                      case 'classic':
                        this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerMasterSetCommand', {
                          FollowFadeToBlack: !this.props.followFadeToBlack,
                          Mask: LibAtemCommands.Audio_AudioMixerMasterSetCommand_MaskFlags.FollowFadeToBlack
                        })
                        break
                      case 'fairlight':
                        // TODO - this isnt working..
                        this.props.sendCommand(
                          'LibAtem.Commands.Audio.Fairlight.FairlightMixerMasterPropertiesSetCommand',
                          {
                            AudioFollowVideoCrossfadeTransitionEnabled: !this.props.followFadeToBlack,
                            Mask:
                              LibAtemCommands.Audio_Fairlight_FairlightMixerMasterPropertiesSetCommand_MaskFlags
                                .AudioFollowVideoCrossfadeTransitionEnabled
                          }
                        )
                        break
                    }
                  }}
                ></input>
                <span className="checkmark"></span>
              </label>
            </div>
          ) : (
            undefined
          )}
        </div>
      </div>
    )
  }
}
