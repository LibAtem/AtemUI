import React from 'react'
import { RateInput, AtemButtonBar, CheckboxInput } from '../../common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft, faUndoAlt, faRedoAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { PreMultipliedKeyProperties } from '../common'
import { LibAtemCommands, LibAtemEnums, LibAtemState } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { DveImagePage, DveImagePages } from './dve-images'

interface DVETransitionSettingsProps {
  sendCommand: SendCommandStrict
  meIndex: number
  dve: LibAtemState.MixEffectState_TransitionDVEState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

interface DVETransitionSettingsState {
  stylePage: number
}

export class DVETransitionSettings extends React.Component<DVETransitionSettingsProps, DVETransitionSettingsState> {
  constructor(props: DVETransitionSettingsProps) {
    super(props)

    const initialPage = DveImagePages.findIndex(pg => pg.images.find(img => img === this.props.dve.style))
    this.state = {
      stylePage: initialPage === -1 ? 0 : initialPage
    }

    this.changeStyle = this.changeStyle.bind(this)
  }

  private changeStyle(style: LibAtemEnums.DVEEffect) {
    this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
      Index: this.props.meIndex,
      Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Style,
      Style: style
    })
  }

  private getSourceOptions() {
    // TODO - this needs to be corrected
    return Array.from(this.props.sources.entries())
      .filter(([i]) => i < 4000)
      .map(([i, v]) => (
        <option key={i} value={i}>
          {v.longName}
        </option>
      ))
  }

  render() {
    const isGraphicsSpin =
      this.props.dve.style === LibAtemEnums.DVEEffect.GraphicCWSpin ||
      this.props.dve.style === LibAtemEnums.DVEEffect.GraphicCCWSpin
    const isGraphicsLogo = this.props.dve.style === LibAtemEnums.DVEEffect.GraphicLogoWipe
    const isGraphics = isGraphicsSpin || isGraphicsLogo

    return (
      <div>
        <DveImagePage
          currentStyle={this.props.dve.style}
          currentPage={this.state.stylePage}
          onClick={this.changeStyle}
        />

        <div className="ss-dve-style-page-button-holder">
          {/* TODO - not every model supports every style */}
          {DveImagePages.map((pg, i) => {
            let classes = 'ss-dve-style-page-button'
            if (this.state.stylePage === i) {
              classes += ' currentPage'
            } else if (pg.images.indexOf(this.props.dve.style) !== -1) {
              classes += ' currentItem'
            }

            return <div key={i} onClick={() => this.setState({ stylePage: i })} className={classes}></div>
          })}
        </div>

        <div className="ss-row" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div className="ss-label">Rate:</div>
          <div className="ss-rate">
            <RateInput
              videoMode={this.props.videoMode}
              value={isGraphicsLogo ? this.props.dve.logoRate : this.props.dve.rate}
              callback={(e: number) => {
                if (isGraphicsLogo) {
                  this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                    Index: this.props.meIndex,
                    Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.LogoRate,
                    LogoRate: e
                  })
                } else {
                  this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                    Index: this.props.meIndex,
                    Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Rate,
                    Rate: e
                  })
                }
              }}
            />
          </div>
        </div>

        <div className="ss-row" style={{ gridTemplateColumns: '1fr 1fr 1.5fr' }}>
          <div className={isGraphicsSpin ? 'ss-label disabled' : 'ss-label'}>Direction:</div>
          <AtemButtonBar
            innerStyle={{ lineHeight: '25px' }}
            disabled={isGraphicsSpin}
            options={[
              {
                label: <FontAwesomeIcon icon={faAngleRight} />,
                value: false
              },
              {
                label: <FontAwesomeIcon icon={faAngleLeft} />,
                value: true
              }
            ]}
            selected={this.props.dve.reverse}
            onChange={v => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.meIndex,
                Reverse: v,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Reverse
              })
            }}
          />

          <CheckboxInput
            label="Flip Flop"
            value={this.props.dve.flipFlop}
            disabled={isGraphicsSpin}
            onChange={v =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.meIndex,
                FlipFlop: v,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.FlipFlop
              })
            }
          />
        </div>

        <div className="ss-row" style={{ gridTemplateColumns: '1fr 100px 1fr' }}>
          <div className="ss-label">Effects: </div>
          <AtemButtonBar
            innerStyle={{ lineHeight: '25px' }}
            options={[
              {
                label: <FontAwesomeIcon icon={faUndoAlt} />,
                value: LibAtemEnums.DVEEffect.GraphicCCWSpin,
                tooltip: 'Graphic CCW Spin'
              },
              {
                label: <FontAwesomeIcon icon={faRedoAlt} />,
                value: LibAtemEnums.DVEEffect.GraphicCWSpin,
                tooltip: 'Graphic CW Spin'
              },
              {
                label: <FontAwesomeIcon icon={faArrowRight} />,
                value: LibAtemEnums.DVEEffect.GraphicLogoWipe,
                tooltip: 'Graphic Logo Wipe'
              }
            ]}
            selected={this.props.dve.style}
            onChange={v => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.meIndex,
                Style: v,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Style
              })
            }}
          />
        </div>

        <div className="ss-row">
          <div className={!isGraphics ? 'ss-label disabled' : 'ss-label'}>Fill Source:</div>
          <select
            disabled={!isGraphics}
            onChange={e => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.FillSource,
                FillSource: e.currentTarget.value as any
              })
            }}
            value={this.props.dve.fillSource}
            className="ss-dropdown"
          >
            {this.getSourceOptions()}
          </select>
        </div>

        <CheckboxInput
          label="Enable Key"
          value={this.props.dve.enableKey}
          disabled={!isGraphics}
          onChange={v =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.meIndex,
              EnableKey: v,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.EnableKey
            })
          }
        />

        <div className="ss-row">
          <div className={!isGraphics || !this.props.dve.enableKey ? 'ss-label disabled' : 'ss-label'}>Key Source:</div>
          <select
            disabled={!isGraphics || !this.props.dve.enableKey}
            onChange={e => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.KeySource,
                KeySource: e.currentTarget.value as any
              })
            }}
            value={this.props.dve.keySource}
            className="ss-dropdown"
          >
            {this.getSourceOptions()}
          </select>
        </div>

        <PreMultipliedKeyProperties
          disabled={!isGraphics || !this.props.dve.enableKey}
          enabled={this.props.dve.preMultiplied}
          clip={this.props.dve.clip}
          gain={this.props.dve.gain}
          invert={this.props.dve.invertKey}
          setEnabled={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.PreMultiplied,
              PreMultiplied: v
            })
          }}
          setClip={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Clip,
              Clip: v
            })
          }}
          setGain={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Gain,
              Gain: v
            })
          }}
          setInvert={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.InvertKey,
              InvertKey: v
            })
          }}
        />
      </div>
    )
  }
}
