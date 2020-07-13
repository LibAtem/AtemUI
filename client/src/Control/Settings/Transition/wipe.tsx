import React from 'react'
import { AtemButtonBar, RateInput, CheckboxInput } from '../../common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { LibAtemCommands, LibAtemEnums, LibAtemState } from '../../../generated'
import { Patterns, PatternInfo } from '../../common/patterns'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { DecimalWithSliderInput, DecimalInput } from '../../common/decimal'

interface WipeProps {
  sendCommand: SendCommandStrict

  meIndex: number
  wipe: LibAtemState.MixEffectState_TransitionWipeState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

export class WipeTransitionSettings extends React.Component<WipeProps> {
  private getSourceOptions() {
    return Array.from(this.props.sources.entries())
      .filter(([i]) => i < 4000)
      .map(([i, v]) => (
        <option key={i} value={i}>
          {v.longName}
        </option>
      ))
  }

  private renderPattern(pattern: LibAtemEnums.Pattern) {
    const isCurrent = this.props.wipe.pattern === pattern
    const patternInfo = Patterns[pattern]

    return (
      <div
        key={pattern}
        onClick={() =>
          this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
            Index: this.props.meIndex,
            Pattern: pattern,
            Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.Pattern
          })
        }
        className={isCurrent ? 'ss-wipe-pattern-item active' : 'ss-wipe-pattern-item'}
      >
        {patternInfo.createSvg(isCurrent)}
      </div>
    )
  }

  render() {
    const currentPatternInfo: PatternInfo | undefined = Patterns[this.props.wipe.pattern]

    return (
      <div>
        <div className="ss-wipe-pattern-holder">{Object.keys(Patterns).map(v => this.renderPattern(Number(v)))}</div>

        <div className="ss-row" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div className="ss-label">Rate:</div>
          <div className="ss-rate">
            <RateInput
              videoMode={this.props.videoMode}
              value={this.props.wipe.rate}
              callback={(e: number) =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
                  Index: this.props.meIndex,
                  Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.Rate,
                  Rate: e
                })
              }
            />
          </div>
        </div>

        <DecimalWithSliderInput
          label={'Symmetry'}
          disabled={!currentPatternInfo?.symmetry}
          value={this.props.wipe.symmetry}
          step={0.1}
          min={0}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
              Index: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.Symmetry,
              Symmetry: e
            })
          }
        />

        <div className="ss-row xy">
          <div className="ss-label">Position:</div>
          <div className={currentPatternInfo?.x ? 'ss-label right' : 'ss-label disabled right'}>X:</div>
          <DecimalInput
            step={0.0001}
            min={0}
            max={1}
            disabled={!currentPatternInfo?.x}
            value={this.props.wipe.xPosition}
            onChange={value =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
                Index: this.props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.XPosition,
                XPosition: value
              })
            }
          />
          <div className={currentPatternInfo?.y ? 'ss-label right' : 'ss-label disabled right'}>Y:</div>
          <DecimalInput
            step={0.0001}
            min={0}
            max={1}
            disabled={!currentPatternInfo?.y}
            value={this.props.wipe.yPosition}
            onChange={value =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
                Index: this.props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.YPosition,
                YPosition: value
              })
            }
          />
        </div>

        <div className="ss-row" style={{ gridTemplateColumns: '1fr 1fr 1.5fr' }}>
          <div className="ss-label">Direction:</div>
          <AtemButtonBar
            innerStyle={{ lineHeight: '25px' }}
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
            selected={this.props.wipe.reverseDirection}
            onChange={v => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
                Index: this.props.meIndex,
                ReverseDirection: v,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.ReverseDirection
              })
            }}
          />

          <CheckboxInput
            label="Flip Flop"
            value={this.props.wipe.flipFlop}
            onChange={v =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
                Index: this.props.meIndex,
                FlipFlop: v,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.FlipFlop
              })
            }
          />
        </div>

        <div className="ss-heading">Border</div>
        <DecimalWithSliderInput
          label="Softness"
          step={0.1}
          min={0}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
              Index: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.BorderSoftness,
              BorderSoftness: e
            })
          }
          value={this.props.wipe.borderSoftness}
        />

        <DecimalWithSliderInput
          label="Width"
          step={0.1}
          min={0}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
              Index: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.BorderWidth,
              BorderWidth: e
            })
          }
          value={this.props.wipe.borderWidth}
        />

        <div className="ss-row">
          <div className={this.props.wipe.borderWidth === 0 ? 'ss-label disabled' : 'ss-label'}>Fill Source:</div>
          <select
            disabled={this.props.wipe.borderWidth === 0}
            onChange={e => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
                Index: this.props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.BorderInput,
                BorderInput: e.currentTarget.value as any
              })
            }}
            value={this.props.wipe.borderInput}
            className="ss-dropdown"
          >
            {this.getSourceOptions()}
          </select>
        </div>
      </div>
    )
  }
}
