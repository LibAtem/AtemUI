import React from 'react'
import { videoIds } from '../../../ControlSettings/ids'
import { FlyingKey, KeyFrame, Mask } from './upstream'
import { PreMultipliedKeyProperties } from '../common'
import { LibAtemCommands, LibAtemState } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'

interface LumaProps {
  sendCommand: SendCommandStrict
  currentState: any
  mixEffect: number
  id: number
}

export class Luma extends React.Component<LumaProps> {
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

  render() {
    const keyerProps: LibAtemState.MixEffectState_KeyerPropertiesState = this.props.currentState.mixEffects[
      this.props.mixEffect
    ].keyers[this.props.id].properties
    const lumaProps: LibAtemState.MixEffectState_KeyerLumaState | undefined = this.props.currentState.mixEffects[
      this.props.mixEffect
    ].keyers[this.props.id].luma
    if (!lumaProps) {
      return <div></div>
    }

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

        <div className="ss-row">
          <div className="ss-label">Key Source:</div>
          <select
            onChange={e => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyCutSourceSetCommand', {
                MixEffectIndex: this.props.mixEffect,
                KeyerIndex: this.props.id,
                CutSource: e.currentTarget.value as any
              })
            }}
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].properties.keySource}
            className="ss-dropdown"
            id="cars"
          >
            {this.getSourceOptions()}
          </select>
        </div>

        <Mask
          meIndex={this.props.mixEffect}
          keyerIndex={this.props.id}
          keyerProps={keyerProps}
          sendCommand={this.props.sendCommand}
        />

        <PreMultipliedKeyProperties
          enabled={lumaProps.preMultiplied}
          clip={lumaProps.clip}
          gain={lumaProps.gain}
          invert={lumaProps.invert}
          setEnabled={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
              MixEffectIndex: this.props.mixEffect,
              KeyerIndex: this.props.id,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyLumaSetCommand_MaskFlags.PreMultiplied,
              PreMultiplied: v
            })
          }}
          setClip={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
              MixEffectIndex: this.props.mixEffect,
              KeyerIndex: this.props.id,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyLumaSetCommand_MaskFlags.Clip,
              Clip: v
            })
          }}
          setGain={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
              MixEffectIndex: this.props.mixEffect,
              KeyerIndex: this.props.id,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyLumaSetCommand_MaskFlags.Gain,
              Gain: v
            })
          }}
          setInvert={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
              MixEffectIndex: this.props.mixEffect,
              KeyerIndex: this.props.id,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyLumaSetCommand_MaskFlags.Invert,
              Invert: v
            })
          }}
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
