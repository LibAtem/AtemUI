import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { KeyerMaskProperties, ResetKeyerMask } from './mask'
import { LibAtemEnums, LibAtemState, LibAtemCommands } from '../../../generated'
import { CheckboxInput, DropdownMenu, DecimalWithSliderInput, SourceSelectInput } from '../../common'
import { FlyingKeyerProperties, FlyingKeyFrameProperties } from './flying'
import { ResetDVE } from './dve'

interface ChromaKeyerClassicPropertiesProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  keyer: LibAtemState.MixEffectState_KeyerState // & Required<Pick<LibAtemState.MixEffectState_KeyerState, 'chroma'>>
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

export class ChromaKeyerClassicProperties extends React.Component<ChromaKeyerClassicPropertiesProps> {
  render() {
    if (!this.props.keyer.chroma) {
      return null
    }

    return (
      <div>
        <div className="ss-heading">
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
          meAvailability={this.props.meIndex + 1}
          value={this.props.keyer.properties.fillSource}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFillSourceSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              FillSource: e
            })
          }
        />

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
