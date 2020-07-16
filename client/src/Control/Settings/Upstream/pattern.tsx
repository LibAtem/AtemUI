import React from 'react'
import { LibAtemEnums, LibAtemCommands, LibAtemState } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { KeyerMaskProperties, ResetKeyerMask } from './mask'
import {
  CheckboxInput,
  DropdownMenu,
  SourceSelectInput,
  DecimalWithSliderInput,
  DecimalInput,
  Patterns,
  PatternInfo,
  SourcesMap
} from '../../../components'
import { FlyingKeyerProperties, FlyingKeyFrameProperties } from './flying'
import { ResetDVE } from './dve'

interface PatternProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  keyer: LibAtemState.MixEffectState_KeyerState
  sources: SourcesMap
  videoMode: LibAtemEnums.VideoMode
}

export class Pattern extends React.Component<PatternProps> {
  private renderPattern(currentPattern: LibAtemEnums.Pattern, pattern: LibAtemEnums.Pattern) {
    const isCurrent = currentPattern === pattern
    const patternInfo = Patterns[pattern]

    return (
      <div
        key={pattern}
        onClick={() =>
          this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
            MixEffectIndex: this.props.meIndex,
            KeyerIndex: this.props.keyerIndex,
            Pattern: pattern,
            Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyPatternSetCommand_MaskFlags.Pattern
          })
        }
        className={isCurrent ? 'ss-wipe-pattern-item active' : 'ss-wipe-pattern-item'}
      >
        {patternInfo.createSvg(isCurrent)}
      </div>
    )
  }

  render() {
    if (!this.props.keyer.pattern) {
      return null
    }

    const currentPattern = this.props.keyer.pattern.pattern
    const currentPatternInfo: PatternInfo | undefined = Patterns[currentPattern]

    return (
      <>
        <div className="atem-form">
          <div className="atem-heading">
            Settings
            <DropdownMenu resetAll={true}>
              {ResetKeyerMask(this.props.sendCommand, this.props.meIndex, this.props.keyerIndex)}
              {ResetDVE(this.props.sendCommand, this.props.meIndex, this.props.keyerIndex)}
            </DropdownMenu>
          </div>

          <SourceSelectInput
            label="Fill Source"
            sources={this.props.sources}
            sourceAvailability={LibAtemEnums.SourceAvailability.None}
            meAvailability={this.props.meIndex}
            value={this.props.keyer.properties.fillSource}
            onChange={e =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFillSourceSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                FillSource: e
              })
            }
          />

          <div className="ss-wipe-pattern-holder" style={{ gridColumn: 'span 2' }}>
            {Object.keys(Patterns).map(v => this.renderPattern(currentPattern, Number(v)))}
          </div>

          <CheckboxInput
            label="Invert Pattern"
            value={this.props.keyer.pattern.inverse}
            onChange={v =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyPatternSetCommand_MaskFlags.Inverse,
                Inverse: v
              })
            }
          />

          <DecimalWithSliderInput
            label="Size"
            step={0.1}
            min={0}
            max={100}
            onChange={e =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyPatternSetCommand_MaskFlags.Size,
                Size: e
              })
            }
            value={this.props.keyer.pattern.size}
          />

          <DecimalWithSliderInput
            label="Symmetry"
            disabled={!currentPatternInfo?.symmetry}
            step={0.1}
            min={0}
            max={100}
            onChange={e =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyPatternSetCommand_MaskFlags.Symmetry,
                Symmetry: e
              })
            }
            value={this.props.keyer.pattern.symmetry}
          />

          <DecimalWithSliderInput
            label="Softness"
            step={0.1}
            min={0}
            max={100}
            onChange={e =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyPatternSetCommand_MaskFlags.Softness,
                Softness: e
              })
            }
            value={this.props.keyer.pattern.softness}
          />

          <div className="atem-label">Position:</div>
          <div className="content-xy">
            <div className={currentPatternInfo?.x ? 'atem-label right' : 'atem-label disabled right'}>X:</div>
            <DecimalInput
              step={0.0001}
              min={0}
              max={1}
              disabled={!currentPatternInfo?.x}
              value={this.props.keyer.pattern.xPosition}
              onChange={value =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyPatternSetCommand_MaskFlags.XPosition,
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
              value={this.props.keyer.pattern.yPosition}
              onChange={value =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyPatternSetCommand_MaskFlags.YPosition,
                  YPosition: value
                })
              }
            />
          </div>
        </div>

        <KeyerMaskProperties
          meIndex={this.props.meIndex}
          keyerIndex={this.props.keyerIndex}
          keyerProps={this.props.keyer.properties}
          sendCommand={this.props.sendCommand}
        />

        {this.props.keyer.dve && this.props.keyer.flyProperties ? (
          <div className="atem-form">
            <FlyingKeyerProperties
              sendCommand={this.props.sendCommand}
              meIndex={this.props.meIndex}
              keyerIndex={this.props.keyerIndex}
              flyEnabled={this.props.keyer.properties.flyEnabled}
              keyerProps={this.props.keyer.dve}
            />
            <FlyingKeyFrameProperties
              videoMode={this.props.videoMode}
              keyerProps={this.props.keyer.dve}
              flyEnabled={this.props.keyer.properties.flyEnabled}
              flyProps={this.props.keyer.flyProperties}
              keyerIndex={this.props.keyerIndex}
              meIndex={this.props.meIndex}
              sendCommand={this.props.sendCommand}
            />
          </div>
        ) : (
          undefined
        )}
      </>
    )
  }
}
