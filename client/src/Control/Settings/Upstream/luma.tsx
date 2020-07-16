import React from 'react'
import { PreMultipliedKeyProperties } from '../common'
import { LibAtemCommands, LibAtemState, LibAtemEnums } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { KeyerMaskProperties, ResetKeyerMask } from './mask'
import { FlyingKeyerProperties, FlyingKeyFrameProperties } from './flying'
import { DropdownMenu, SourceSelectInput, SourcesMap } from '../../common'
import { ResetDVE } from './dve'

interface LumaKeyerSettingsProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  keyer: LibAtemState.MixEffectState_KeyerState
  sources: SourcesMap
  videoMode: LibAtemEnums.VideoMode
}

export class LumaKeyerSettings extends React.Component<LumaKeyerSettingsProps> {
  render() {
    if (!this.props.keyer.luma) {
      return null
    }

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
          <SourceSelectInput
            label="Key Source"
            sources={this.props.sources}
            sourceAvailability={LibAtemEnums.SourceAvailability.KeySource}
            meAvailability={this.props.meIndex}
            value={this.props.keyer.properties.cutSource}
            onChange={e =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyCutSourceSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                CutSource: e
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

        <PreMultipliedKeyProperties
          enabled={this.props.keyer.luma.preMultiplied}
          clip={this.props.keyer.luma.clip}
          gain={this.props.keyer.luma.gain}
          invert={this.props.keyer.luma.invert}
          setEnabled={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyLumaSetCommand_MaskFlags.PreMultiplied,
              PreMultiplied: v
            })
          }}
          setClip={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyLumaSetCommand_MaskFlags.Clip,
              Clip: v
            })
          }}
          setGain={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyLumaSetCommand_MaskFlags.Gain,
              Gain: v
            })
          }}
          setInvert={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyLumaSetCommand_MaskFlags.Invert,
              Invert: v
            })
          }}
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
