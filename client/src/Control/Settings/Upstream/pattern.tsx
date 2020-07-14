import React from 'react'
import { Patterns, PatternInfo } from '../../common/patterns'
import { LibAtemEnums, LibAtemCommands, LibAtemState } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { KeyerMaskProperties } from './mask'
import { CheckboxInput } from '../../common'
import { DecimalWithSliderInput, DecimalInput } from '../../common/decimal'
import { FlyingKeyerProperties, FlyingKeyFrameProperties } from './flying'

interface PatternProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  keyer: LibAtemState.MixEffectState_KeyerState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

export class Pattern extends React.Component<PatternProps> {
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
    // var pattern = this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.pattern
    return (
      <div>
        <div className="ss-heading">Settings</div>
        <div className="ss-row">
          <div className="ss-label">Fill Source:</div>
          <select
            onChange={e => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFillSourceSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                FillSource: e.currentTarget.value as any
              })
            }}
            value={this.props.keyer.properties.fillSource}
            className="ss-dropdown"
          >
            {this.getSourceOptions()}
          </select>
        </div>

        <div className="ss-wipe-pattern-holder">
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

        <div className="ss-row xy">
          <div className="ss-label">Position:</div>
          <div className={currentPatternInfo?.x ? 'ss-label right' : 'ss-label disabled right'}>X:</div>
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
          <div className={currentPatternInfo?.y ? 'ss-label right' : 'ss-label disabled right'}>Y:</div>
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

        <KeyerMaskProperties
          meIndex={this.props.meIndex}
          keyerIndex={this.props.keyerIndex}
          keyerProps={this.props.keyer.properties}
          sendCommand={this.props.sendCommand}
        />

        {this.props.keyer.dve && this.props.keyer.flyProperties ? (
          <>
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
          </>
        ) : (
          undefined
        )}
      </div>
    )
  }
}
