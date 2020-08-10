import React from 'react'
import { RateInput, AtemButtonBar, CheckboxInput, SourceSelectInput, SourcesMap } from '../../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft, faUndoAlt, faRedoAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { PreMultipliedKeyProperties } from '../common'
import { LibAtemCommands, LibAtemEnums, LibAtemState } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { DveImagePage, DveImagePages, IDveImagePage } from './dve-images'
import { AtemButtonBarProps } from '../../../components/button'

interface DVETransitionSettingsProps {
  sendCommand: SendCommandStrict
  meIndex: number
  info: LibAtemState.InfoState_DveInfoState | undefined
  dve: LibAtemState.MixEffectState_TransitionDVEState
  sources: SourcesMap
  videoMode: LibAtemEnums.VideoMode
}

interface DVETransitionSettingsState {
  stylePage: number
}

export class DVETransitionSettings extends React.Component<DVETransitionSettingsProps, DVETransitionSettingsState> {
  constructor(props: DVETransitionSettingsProps) {
    super(props)

    const initialPage = this.getValidPages().findIndex((pg) => pg.images.find((img) => img === this.props.dve.style))
    this.state = {
      stylePage: initialPage === -1 ? 0 : initialPage,
    }

    this.changeStyle = this.changeStyle.bind(this)
  }

  private getValidPages(): IDveImagePage[] {
    if (this.props.info) {
      const supported = new Set(this.props.info.supportedTransitions)
      return DveImagePages.filter((pg) => pg.images.find((im) => im != null && supported.has(im)) !== undefined)
    } else {
      return DveImagePages
    }
  }

  private changeStyle(style: LibAtemEnums.DVEEffect) {
    this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
      Index: this.props.meIndex,
      Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Style,
      Style: style,
    })
  }

  render() {
    const isGraphicsSpin =
      this.props.dve.style === LibAtemEnums.DVEEffect.GraphicCWSpin ||
      this.props.dve.style === LibAtemEnums.DVEEffect.GraphicCCWSpin
    const isGraphicsLogo = this.props.dve.style === LibAtemEnums.DVEEffect.GraphicLogoWipe
    const isGraphics = isGraphicsSpin || isGraphicsLogo

    const supportedEffects = new Set(this.props.info?.supportedTransitions)

    return (
      <div>
        <DveImagePage
          currentStyle={this.props.dve.style}
          currentPage={this.state.stylePage}
          onClick={this.changeStyle}
        />

        <div className="ss-dve-style-page-button-holder">
          {this.getValidPages().map((pg, i) => {
            let classes = 'ss-dve-style-page-button'
            if (this.state.stylePage === i) {
              classes += ' currentPage'
            } else if (pg.images.indexOf(this.props.dve.style) !== -1) {
              classes += ' currentItem'
            }

            return <div key={i} onClick={() => this.setState({ stylePage: i })} className={classes}></div>
          })}
        </div>

        <div className="atem-form no-border">
          <div className="atem-label">Rate:</div>
          <div className="ss-rate">
            <RateInput
              videoMode={this.props.videoMode}
              value={isGraphicsLogo ? this.props.dve.logoRate : this.props.dve.rate}
              callback={(e: number) => {
                if (isGraphicsLogo) {
                  this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                    Index: this.props.meIndex,
                    Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.LogoRate,
                    LogoRate: e,
                  })
                } else {
                  this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                    Index: this.props.meIndex,
                    Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Rate,
                    Rate: e,
                  })
                }
              }}
            />
          </div>

          <div className={isGraphicsSpin ? 'atem-label disabled' : 'atem-label'}>Direction:</div>
          <div className="content-split">
            <AtemButtonBar
              innerStyle={{ lineHeight: '25px', fontSize: '16px' }}
              disabled={isGraphicsSpin}
              options={[
                {
                  label: <FontAwesomeIcon icon={faAngleRight} style={{ width: '20px' }} />,
                  value: false,
                },
                {
                  label: <FontAwesomeIcon icon={faAngleLeft} />,
                  value: true,
                },
              ]}
              selected={this.props.dve.reverse}
              onChange={(v) => {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: this.props.meIndex,
                  Reverse: v,
                  Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Reverse,
                })
              }}
            />

            <CheckboxInput
              label="Flip Flop"
              style={{ gridColumn: 'span 1' }}
              value={this.props.dve.flipFlop}
              disabled={isGraphicsSpin}
              onChange={(v) =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: this.props.meIndex,
                  FlipFlop: v,
                  Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.FlipFlop,
                })
              }
            />
          </div>

          <div className="atem-label">Effects: </div>
          <AtemButtonBar
            innerStyle={{ lineHeight: '25px' }}
            options={[
              {
                label: <FontAwesomeIcon icon={faUndoAlt} />,
                value: LibAtemEnums.DVEEffect.GraphicCCWSpin,
                tooltip: 'Graphic CCW Spin',
                disabled: !supportedEffects.has(LibAtemEnums.DVEEffect.GraphicCCWSpin),
              },
              {
                label: <FontAwesomeIcon icon={faRedoAlt} />,
                value: LibAtemEnums.DVEEffect.GraphicCWSpin,
                tooltip: 'Graphic CW Spin',
                disabled: !supportedEffects.has(LibAtemEnums.DVEEffect.GraphicCWSpin),
              },
              {
                label: <FontAwesomeIcon icon={faArrowRight} />,
                value: LibAtemEnums.DVEEffect.GraphicLogoWipe,
                tooltip: 'Graphic Logo Wipe',
                disabled: !supportedEffects.has(LibAtemEnums.DVEEffect.GraphicLogoWipe),
              },
            ]}
            selected={this.props.dve.style}
            onChange={(v) => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.meIndex,
                Style: v,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Style,
              })
            }}
          />

          <SourceSelectInput
            label="Fill Source"
            sources={this.props.sources}
            sourceAvailability={LibAtemEnums.SourceAvailability.None}
            meAvailability={this.props.meIndex}
            value={this.props.dve.fillSource}
            disabled={!isGraphics}
            onChange={(e) =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.FillSource,
                FillSource: e,
              })
            }
          />

          <CheckboxInput
            label="Enable Key"
            value={this.props.dve.enableKey}
            disabled={!isGraphics}
            style={{ gridColumn: 'span 2' }}
            onChange={(v) =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.meIndex,
                EnableKey: v,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.EnableKey,
              })
            }
          />

          <SourceSelectInput
            label="Key Source"
            sources={this.props.sources}
            sourceAvailability={LibAtemEnums.SourceAvailability.KeySource}
            meAvailability={this.props.meIndex}
            value={this.props.dve.keySource}
            disabled={!isGraphics || !this.props.dve.enableKey}
            onChange={(e) =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.KeySource,
                KeySource: e,
              })
            }
          />
        </div>

        <PreMultipliedKeyProperties
          disabled={!isGraphics || !this.props.dve.enableKey}
          enabled={this.props.dve.preMultiplied}
          clip={this.props.dve.clip}
          gain={this.props.dve.gain}
          invert={this.props.dve.invertKey}
          setEnabled={(v) => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.PreMultiplied,
              PreMultiplied: v,
            })
          }}
          setClip={(v) => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Clip,
              Clip: v,
            })
          }}
          setGain={(v) => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Gain,
              Gain: v,
            })
          }}
          setInvert={(v) => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.InvertKey,
              InvertKey: v,
            })
          }}
        />
      </div>
    )
  }
}
