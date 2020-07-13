import React from 'react'
import { FlyingKey, KeyFrame } from './upstream'
import { MagicInput } from '../settings'
import Slider from 'react-rangeslider'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { KeyerMaskProperties } from './mask'
import { LibAtemEnums, LibAtemState, LibAtemCommands } from '../../../generated'

interface ChromaKeyerClassicPropertiesProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  keyer: LibAtemState.MixEffectState_KeyerState // & Required<Pick<LibAtemState.MixEffectState_KeyerState, 'chroma'>>
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

export class ChromaKeyerClassicProperties extends React.Component<ChromaKeyerClassicPropertiesProps> {
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
    if (!this.props.keyer.chroma) {
      return null
    }

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

        <div className="ss-slider-holder">
          <div className="sss ss-slider-outer hue">
            <Slider
              max={359.9}
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags.Hue,
                  Hue: e
                })
              }
              value={this.props.keyer.chroma.hue}
            />
            <div className="ss-slider-label">Hue:</div>
          </div>
          <MagicInput
            value={this.props.keyer.chroma.hue}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags.Hue,
                  Hue: Math.min(360, Math.max(0, value))
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
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags.Gain,
                  Gain: e
                })
              }
              value={this.props.keyer.chroma.gain}
            />
            <div className="ss-slider-label">Gain:</div>
          </div>
          <MagicInput
            value={this.props.keyer.chroma.gain}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags.Gain,
                  Gain: Math.min(100, Math.max(0, value))
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
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags.YSuppress,
                  YSuppress: e
                })
              }
              value={this.props.keyer.chroma.ySuppress}
            />
            <div className="ss-slider-label">Y Suppress:</div>
          </div>
          <MagicInput
            value={this.props.keyer.chroma.ySuppress}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags.YSuppress,
                  YSuppress: Math.min(100, Math.max(0, value))
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
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags.Lift,
                  Lift: e
                })
              }
              value={this.props.keyer.chroma.lift}
            />
            <div className="ss-slider-label">Gain:</div>
          </div>
          <MagicInput
            value={this.props.keyer.chroma.lift}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags.Lift,
                  Lift: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <label className="ss-checkbox-container">
          Narrow Chroma Key Range
          <input
            type="checkbox"
            checked={this.props.keyer.chroma.narrow}
            onClick={() =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags.Narrow,
                Narrow: !this.props.keyer.chroma?.narrow
              })
            }
          ></input>
          <span className="checkmark"></span>
        </label>

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
