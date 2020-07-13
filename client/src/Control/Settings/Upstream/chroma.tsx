import React from 'react'
import { videoIds } from '../../../ControlSettings/ids'
import { Mask, FlyingKey, KeyFrame } from './upstream'
import { MagicInput } from '../settings'
import Slider from 'react-rangeslider'
import { SendCommandStrict } from '../../../device-page-wrapper'

interface ChromaProps {
  sendCommand: SendCommandStrict
  currentState: any
  mixEffect: number
  id: number
}

export class Chroma extends React.Component<ChromaProps> {
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
    const keyerProps = this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].properties

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

        <div className="ss-slider-holder">
          <div className="sss ss-slider-outer hue">
            <Slider
              max={359.9}
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 1,
                  Hue: e
                })
              }
              value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].chroma.hue}
            />
            <div className="ss-slider-label">Hue:</div>
          </div>
          <MagicInput
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].chroma.hue}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 1,
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
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 2,
                  Gain: e
                })
              }
              value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].chroma.gain}
            />
            <div className="ss-slider-label">Gain:</div>
          </div>
          <MagicInput
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].chroma.gain}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 2,
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
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 4,
                  YSuppress: e
                })
              }
              value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].chroma.ySuppress}
            />
            <div className="ss-slider-label">Y Suppress:</div>
          </div>
          <MagicInput
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].chroma.ySuppress}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 4,
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
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 8,
                  Lift: e
                })
              }
              value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].chroma.lift}
            />
            <div className="ss-slider-label">Gain:</div>
          </div>
          <MagicInput
            value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].chroma.lift}
            callback={(value: any) => {
              if (value != '') {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                  MixEffectIndex: this.props.mixEffect,
                  KeyerIndex: this.props.id,
                  Mask: 8,
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
            checked={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].chroma.narrow}
            onClick={() =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyChromaSetCommand', {
                MixEffectIndex: this.props.mixEffect,
                KeyerIndex: this.props.id,
                Mask: 16,
                Narrow: !this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].chroma.narrow
              })
            }
          ></input>
          <span className="checkmark"></span>
        </label>

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
