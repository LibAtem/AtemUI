import React from 'react'
import { FlyingKey, KeyFrame } from './upstream'
import { PreMultipliedKeyProperties } from '../common'
import { LibAtemCommands, LibAtemState, LibAtemEnums } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { KeyerMaskProperties } from './mask'

interface LumaKeyerSettingsProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  keyer: LibAtemState.MixEffectState_KeyerState // & Required<Pick<LibAtemState.MixEffectState_KeyerState, 'luma'>>
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

export class LumaKeyerSettings extends React.Component<LumaKeyerSettingsProps> {
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
    if (!this.props.keyer.luma) {
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

        <div className="ss-row">
          <div className="ss-label">Key Source:</div>
          <select
            onChange={e => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyCutSourceSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                CutSource: e.currentTarget.value as any
              })
            }}
            value={this.props.keyer.properties.cutSource}
            className="ss-dropdown"
          >
            {this.getSourceOptions()}
          </select>
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

        <FlyingKey
          flyEnabled={this.props.keyer.properties.flyEnabled}
          properties={this.props.keyer.dve}
          keyerIndex={this.props.keyerIndex}
          mixEffectIndex={this.props.meIndex}
          sendCommand={this.props.sendCommand}
        />
        <KeyFrame
          videoMode={this.props.videoMode}
          dve={this.props.keyer.dve}
          flyEnabled={this.props.keyer.properties.flyEnabled}
          properties={this.props.keyer.flyProperties}
          keyerIndex={this.props.keyerIndex}
          mixEffect={this.props.meIndex}
          sendCommand={this.props.sendCommand}
        />
      </div>
    )
  }
}
