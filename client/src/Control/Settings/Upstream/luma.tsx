import React from 'react'
import { AtemDeviceInfo } from '../../../Devices/types'
import { GetDeviceId } from '../../../DeviceManager'
import { videoIds } from '../../../ControlSettings/ids'
import { Mask, FlyingKey, KeyFrame } from './upstream'
import { MagicInput } from '../settings'
import Slider from 'react-rangeslider'
import { ToggleButton } from '../common'

interface LumaProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: any
  mixEffect: number
  id: number
}

export class Luma extends React.Component<LumaProps> {
  private sendCommand(command: string, value: any) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)
      console.log(value)
      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then(res => {})
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }

  getPreMultBox(index: number) {
    var enabled = this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].luma.preMultiplied
    var diabledClass = !enabled ? 'sss ss-slider-outer' : 'sss ss-slider-outer disabled'
    return (
      <div className="ss-pmk">
        <ToggleButton
          active={enabled}
          label={'Pre Multiplied Key'}
          onClick={() => {
            this.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
              MixEffectIndex: this.props.mixEffect,
              KeyerIndex: this.props.id,
              Mask: 1,
              PreMultiplied: !enabled
            })
          }}
        />
        <div className="ss-slider-holder">
          <div className={diabledClass}>
            <Slider
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 2,
                  Clip: e
                })
              }
              value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].luma.clip}
            />
            <div className="ss-slider-label">Clip:</div>
          </div>
          <MagicInput
            disabled={enabled}
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].luma.clip}
            callback={(value: any) => {
              if (value != '') {
                this.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 2,
                  Clip: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <div className="ss-slider-holder">
          <div className={diabledClass}>
            <Slider
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 4,
                  Gain: e
                })
              }
              value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].luma.gain}
            />
            <div className="ss-slider-label">Gain:</div>
          </div>
          <MagicInput
            disabled={enabled}
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].luma.gain}
            callback={(value: any) => {
              if (value != '') {
                this.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 4,
                  Gain: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <label className={!enabled ? 'ss-checkbox-container' : 'ss-checkbox-container disabled'}>
          Invert
          <input
            type="checkbox"
            disabled={enabled}
            checked={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].luma.invert}
            onClick={() =>
              this.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyLumaSetCommand', {
                MixEffectIndex: this.props.mixEffect,
                KeyerIndex: this.props.id,
                Mask: 8,
                Invert: !this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].luma.invert
              })
            }
          ></input>
          <span className={!enabled ? 'checkmark' : 'checkmark disabled'}></span>
        </label>
      </div>
    )
  }

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
    if (this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].luma === null) {
      return <div></div>
    }

    return (
      <div>
        <div className="ss-heading">Settings</div>
        <div className="ss-row">
          <div className="ss-label">Fill Source:</div>
          <select
            onChange={e => {
              this.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFillSourceSetCommand', {
                MixEffectIndex: this.props.mixEffect,
                KeyerIndex: this.props.id,
                FillSource: e.currentTarget.value
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
              this.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyCutSourceSetCommand', {
                MixEffectIndex: this.props.mixEffect,
                KeyerIndex: this.props.id,
                CutSource: e.currentTarget.value
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
          properties={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].properties}
          keyerIndex={this.props.id}
          mixEffectIndex={this.props.mixEffect}
          sendCommand={(cmd: string, values: any) => this.sendCommand(cmd, values)}
        ></Mask>

        {this.getPreMultBox(0)}
        <FlyingKey
          flyEnabled={
            this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].properties.flyEnabled
          }
          properties={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve}
          keyerIndex={this.props.id}
          mixEffectIndex={this.props.mixEffect}
          sendCommand={(cmd: string, values: any) => this.sendCommand(cmd, values)}
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
          sendCommand={(cmd: string, values: any) => this.sendCommand(cmd, values)}
        ></KeyFrame>
      </div>
    )
  }
}
