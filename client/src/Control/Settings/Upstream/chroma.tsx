import React from 'react'
import { FlyingKey, KeyFrame } from './upstream'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { KeyerMaskProperties } from './mask'
import { LibAtemEnums, LibAtemState, LibAtemCommands } from '../../../generated'
import { DecimalWithSliderInput } from '../../common/decimal'
import { CheckboxInput } from '../../common'

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

        <DecimalWithSliderInput
          label="Hue"
          step={0.1}
          min={0}
          max={359.9}
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

        <DecimalWithSliderInput
          label="Gain"
          step={0.1}
          min={0}
          max={100}
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

        <DecimalWithSliderInput
          label="Y Suppress"
          step={0.1}
          min={0}
          max={100}
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

        <DecimalWithSliderInput
          label="Lift"
          step={0.1}
          min={0}
          max={100}
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

        <CheckboxInput
          label="Narrow Chroma Key Range"
          value={this.props.keyer.chroma.narrow}
          onChange={v =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyChromaSetCommand_MaskFlags.Narrow,
              Narrow: v
            })
          }
        />

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
