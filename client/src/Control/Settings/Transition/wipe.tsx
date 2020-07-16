import React from 'react'
import {
  AtemButtonBar,
  RateInput,
  CheckboxInput,
  SourcesMap,
  DecimalInput,
  DecimalWithSliderInput,
  SourceSelectInput,
  PatternInfo,
  Patterns
} from '../../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { LibAtemCommands, LibAtemEnums, LibAtemState } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'

interface WipeProps {
  sendCommand: SendCommandStrict

  meIndex: number
  wipe: LibAtemState.MixEffectState_TransitionWipeState
  sources: SourcesMap
  videoMode: LibAtemEnums.VideoMode
}

export class WipeTransitionSettings extends React.Component<WipeProps> {
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

        <div className="atem-form no-border">
          <div className="atem-label">Rate:</div>
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

          <div className="atem-label">Position:</div>
          <div className="content-xy">
            <div className={currentPatternInfo?.x ? 'atem-label right' : 'atem-label disabled right'}>X:</div>
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
            <div className={currentPatternInfo?.y ? 'atem-label right' : 'atem-label disabled right'}>Y:</div>
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

          <div className="atem-label">Direction:</div>
          <div className="content-split">
            <AtemButtonBar
              innerStyle={{ lineHeight: '25px', fontSize: '16px' }}
              options={[
                {
                  label: <FontAwesomeIcon icon={faAngleRight} style={{ width: '20px' }} />,
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
              style={{ gridColumn: 'span 1' }}
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

          <div className="atem-heading">Border</div>
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

          <SourceSelectInput
            label="Fill Source"
            sources={this.props.sources}
            sourceAvailability={LibAtemEnums.SourceAvailability.None}
            meAvailability={this.props.meIndex}
            value={this.props.wipe.borderInput}
            disabled={this.props.wipe.borderWidth === 0}
            onChange={e =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
                Index: this.props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.BorderInput,
                BorderInput: e
              })
            }
          />
        </div>
      </div>
    )
  }
}
