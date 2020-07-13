import React from 'react'
import { videoIds } from '../../../ControlSettings/ids'
import { Mask, FlyingKey, KeyFrame } from './upstream'
import { MagicInput } from '../settings'
import Slider from 'react-rangeslider'
import { Patterns, PatternInfo } from '../../common/patterns'
import { LibAtemEnums, LibAtemCommands } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'

interface PatternProps {
  sendCommand: SendCommandStrict
  currentState: any
  mixEffect: number
  id: number
}

export class Pattern extends React.Component<PatternProps> {
  getSourceOptions() {
    var inputs = Object.keys(this.props.currentState.settings.inputs)
    var sources = inputs.filter(i => videoIds[i] < 4000)
    var options = []
    for (var i in sources) {
      options.push(
        <option value={videoIds[sources[i]]}>
          {this.props.currentState.settings.inputs[sources[i]].properties.longName}
        </option>
      )
    }
    return options
  }

  private renderPattern(pattern: LibAtemEnums.Pattern) {
    const isCurrent = this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.pattern === pattern
    const patternInfo = Patterns[pattern]

    return (
      <div
        key={pattern}
        onClick={() =>
          this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
            MixEffectIndex: this.props.mixEffect,
            KeyerIndex: this.props.id,
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
    const keyerProps = this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].properties
    const currentPatternInfo: PatternInfo | undefined = Patterns[this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.pattern as LibAtemEnums.Pattern]
    // var pattern = this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.pattern
    return (
      <div>
        <div className="ss-heading">Settings</div>
        <div className="ss-row">
          <div className="ss-label">Fill Source:</div>
          <select
            onChange={e => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFillSourceSetCommand', {
                MixEffectIndex: this.props.mixEffect,
                KeyerIndex: this.props.id,
                FillSource: e.currentTarget.value as any
              })
            }}
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].properties.fillSource}
            className="ss-dropdown"
            id="cars"
          >
            {this.getSourceOptions()}
          </select>
        </div>

        <div className="ss-wipe-pattern-holder">
          {Object.keys(Patterns).map(v => this.renderPattern(Number(v)))}
        </div>

        <label className="ss-checkbox-container">
          Invert Pattern
          <input
            type="checkbox"
            checked={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.inverse}
            onClick={() =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                MixEffectIndex: this.props.mixEffect,
                KeyerIndex: this.props.id,
                Mask: 64,
                Inverse: !this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.inverse
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
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 2,
                  Size: e
                })
              }
              value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.size}
            />
            <div className="ss-slider-label">Size:</div>
          </div>
          <MagicInput
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.size}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
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
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 4,
                  Symmetry: e
                })
              }
              value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.symmetry}
            />
            <div className="ss-slider-label">Symmetry:</div>
          </div>
          <MagicInput
            disabled={!currentPatternInfo?.symmetry}
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.symmetry}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
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
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 8,
                  Softness: e
                })
              }
              value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.softness}
            />
            <div className="ss-slider-label">Softness:</div>
          </div>
          <MagicInput
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.softness}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
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
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.xPosition}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
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
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].pattern.yPosition}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyPatternSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 32,
                  YPosition: Math.min(1, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <Mask
          meIndex={this.props.mixEffect}
          keyerIndex={this.props.id}
          keyerProps={keyerProps}
          sendCommand={this.props.sendCommand}
        />

        <FlyingKey
          flyEnabled={
            this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].properties.flyEnabled
          }
          properties={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve}
          keyerIndex={this.props.id}
          mixEffectIndex={this.props.mixEffect}
          sendCommand={this.props.sendCommand}
        ></FlyingKey>
        <KeyFrame
          videoMode={this.props.currentState.settings.videoMode}
          dve={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve}
          flyEnabled={
            this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].properties.flyEnabled
          }
          properties={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].flyProperties}
          keyerIndex={this.props.id}
          mixEffect={this.props.mixEffect}
          sendCommand={this.props.sendCommand}
        ></KeyFrame>
      </div>
    )
  }
}
