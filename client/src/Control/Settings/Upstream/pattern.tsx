import React from 'react'
import { FlyingKey, KeyFrame } from './upstream'
import { MagicInput } from '../settings'
import Slider from 'react-rangeslider'
import { Patterns, PatternInfo } from '../../common/patterns'
import { LibAtemEnums, LibAtemCommands, LibAtemState } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { KeyerMaskProperties } from './mask'

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

        <label className="ss-checkbox-container">
          Invert Pattern
          <input
            type="checkbox"
            checked={this.props.keyer.pattern.inverse}
            onClick={() =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                Mask: 64,
                Inverse: !this.props.keyer.pattern?.inverse
              })
            }
          ></input>
          <span className="checkmark"></span>
        </label>

        <div className="ss-slider-holder">
          <div className="sss ss-slider-outer">
            <Slider
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: 2,
                  Size: e
                })
              }
              value={this.props.keyer.pattern.size}
            />
            <div className="ss-slider-label">Size:</div>
          </div>
          <MagicInput
            value={this.props.keyer.pattern.size}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: 2,
                  Size: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <div className="ss-slider-holder">
          <div className={currentPatternInfo?.symmetry ? 'sss ss-slider-outer' : 'sss ss-slider-outer disabled'}>
            <Slider
              tooltip={false}
              step={0.1}
              disabled={!currentPatternInfo?.symmetry}
              onChange={e =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: 4,
                  Symmetry: e
                })
              }
              value={this.props.keyer.pattern.symmetry}
            />
            <div className="ss-slider-label">Symmetry:</div>
          </div>
          <MagicInput
            disabled={!currentPatternInfo?.symmetry}
            value={this.props.keyer.pattern.symmetry}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: 4,
                  Symmetry: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <div className="ss-slider-holder">
          <div className="sss ss-slider-outer">
            <Slider
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: 8,
                  Softness: e
                })
              }
              value={this.props.keyer.pattern.softness}
            />
            <div className="ss-slider-label">Softness:</div>
          </div>
          <MagicInput
            value={this.props.keyer.pattern.softness}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: 8,
                  Softness: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <div className="ss-row xy">
          <div className="ss-label">Position:</div>
          <div className={currentPatternInfo?.x ? 'ss-label right' : 'ss-label disabled right'}>X:</div>
          <MagicInput
            step={0.0001}
            disabled={!currentPatternInfo?.x}
            value={this.props.keyer.pattern.xPosition}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: 16,
                  XPosition: Math.min(1, Math.max(0, value))
                })
              }
            }}
          />
          <div className={currentPatternInfo?.y ? 'ss-label right' : 'ss-label disabled right'}>Y:</div>
          <MagicInput
            step={0.0001}
            disabled={!currentPatternInfo?.y}
            value={this.props.keyer.pattern.yPosition}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: 32,
                  YPosition: Math.min(1, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <KeyerMaskProperties
          meIndex={this.props.meIndex}
          keyerIndex={this.props.keyerIndex}
          keyerProps={this.props.keyer.properties}
          sendCommand={this.props.sendCommand}
        />

        <FlyingKey
          flyEnabled={this.props.keyer.properties.flyEnabled}
          properties={this.props.keyer.dve}
          keyerIndex={this.props.keyerIndex}
          mixEffectIndex={this.props.meIndex}
          sendCommand={this.props.sendCommand}
        ></FlyingKey>
        <KeyFrame
          videoMode={this.props.videoMode}
          dve={this.props.keyer.dve}
          flyEnabled={this.props.keyer.properties.flyEnabled}
          properties={this.props.keyer.flyProperties}
          keyerIndex={this.props.keyerIndex}
          mixEffect={this.props.meIndex}
          sendCommand={this.props.sendCommand}
        ></KeyFrame>
      </div>
    )
  }
}
