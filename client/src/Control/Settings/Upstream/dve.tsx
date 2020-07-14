import React from 'react'
import { ChromePicker } from 'react-color'
import { ToggleButton, MaskProperties } from '../common'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { DecimalInput, DecimalWithSliderInput } from '../../common/decimal'
import { LibAtemCommands, LibAtemState, LibAtemEnums } from '../../../generated'
import { SelectInput } from '../../common'
import { FlyingKeyFrameProperties } from './flying'

interface DveSubPanelProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  keyerProps: LibAtemState.MixEffectState_KeyerDVEState
}

interface DveKeyerPropertiesProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  keyer: LibAtemState.MixEffectState_KeyerState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

export class DveKeyerProperties extends React.Component<DveKeyerPropertiesProps> {
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
    const keyerProps = this.props.keyer
    if (!this.props.keyer.dve) {
      return <div></div>
    }

    return (
      <div>
        <div className="ss-heading">Settings</div>
        <div className="ss-row">
          <div className="ss-label">Fill Source:</div>
          <select
            onChange={e =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFillSourceSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                FillSource: e.currentTarget.value as any
              })
            }
            value={keyerProps.properties.fillSource}
            className="ss-dropdown"
          >
            {this.getSourceOptions()}
          </select>
        </div>

        <DVECommonProprties
          sendCommand={this.props.sendCommand}
          disabled={false}
          meIndex={this.props.meIndex}
          keyerIndex={this.props.keyerIndex}
          keyerProps={this.props.keyer.dve}
        />

        <DVEMaskProperties
          sendCommand={this.props.sendCommand}
          meIndex={this.props.meIndex}
          keyerIndex={this.props.keyerIndex}
          keyerProps={this.props.keyer.dve}
        />
        <ShadowProperties
          sendCommand={this.props.sendCommand}
          meIndex={this.props.meIndex}
          keyerIndex={this.props.keyerIndex}
          keyerProps={this.props.keyer.dve}
        />
        <Border
          sendCommand={this.props.sendCommand}
          meIndex={this.props.meIndex}
          keyerIndex={this.props.keyerIndex}
          keyerProps={this.props.keyer.dve}
        />

        {this.props.keyer.dve && this.props.keyer.flyProperties ? (
          <FlyingKeyFrameProperties
            videoMode={this.props.videoMode}
            keyerProps={this.props.keyer.dve}
            flyEnabled={this.props.keyer.properties.flyEnabled}
            flyProps={this.props.keyer.flyProperties}
            keyerIndex={this.props.keyerIndex}
            meIndex={this.props.meIndex}
            sendCommand={this.props.sendCommand}
          />
        ) : (
          undefined
        )}
      </div>
    )
  }
}

export function DVECommonProprties(props: DveSubPanelProps & { disabled: boolean }) {
  const rotationCoarse = Math.floor(props.keyerProps.rotation / 360)
  const rotationFine = props.keyerProps.rotation - rotationCoarse * 360

  return (
    <React.Fragment>
      <div className="ss-row xy">
        <div style={{ minWidth: '50px' }} className={`ss-label ${props.disabled ? 'disabled' : ''}`}>
          Position:
        </div>
        <div className={`ss-label right ${props.disabled ? 'disabled' : ''}`}>X:</div>
        <DecimalInput
          step={0.01}
          min={-1000}
          max={1000}
          value={props.keyerProps.positionX}
          disabled={props.disabled}
          onChange={value =>
            props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              KeyerIndex: props.keyerIndex,
              MixEffectIndex: props.meIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.PositionX,
              PositionX: value
            })
          }
        />
        <div className={`ss-label right ${props.disabled ? 'disabled' : ''}`}>Y:</div>
        <DecimalInput
          step={0.01}
          min={-1000}
          max={1000}
          value={props.keyerProps.positionY}
          disabled={props.disabled}
          onChange={value =>
            props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              KeyerIndex: props.keyerIndex,
              MixEffectIndex: props.meIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.PositionY,
              PositionY: value
            })
          }
        />
      </div>

      <div className="ss-row xy">
        <div style={{ minWidth: '50px' }} className={`ss-label ${props.disabled ? 'disabled' : ''}`}>
          Scale:
        </div>
        <div className={`ss-label right ${props.disabled ? 'disabled' : ''}`}>X:</div>
        <DecimalInput
          step={0.01}
          min={0}
          max={99.99}
          value={props.keyerProps.sizeX}
          disabled={props.disabled}
          onChange={value =>
            props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              KeyerIndex: props.keyerIndex,
              MixEffectIndex: props.meIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.SizeX,
              SizeX: value
            })
          }
        />
        {/* TODO - link */}
        <div className={`ss-label right ${props.disabled ? 'disabled' : ''}`}>Y:</div>
        <DecimalInput
          step={0.01}
          min={0}
          max={99.99}
          value={props.keyerProps.sizeY}
          disabled={props.disabled}
          onChange={value =>
            props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              KeyerIndex: props.keyerIndex,
              MixEffectIndex: props.meIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.SizeY,
              SizeY: value
            })
          }
        />
      </div>

      <div className="ss-row xy">
        <div style={{ minWidth: '50px' }} className={`ss-label ${props.disabled ? 'disabled' : ''}`}>
          Rotation:
        </div>
        <div className={`ss-label right ${props.disabled ? 'disabled' : ''}`}>360°:</div>
        <DecimalInput
          step={1}
          min={-90}
          max={89}
          value={rotationCoarse}
          disabled={props.disabled}
          onChange={value =>
            props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              KeyerIndex: props.keyerIndex,
              MixEffectIndex: props.meIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.Rotation,
              Rotation: (Math.floor(value) * 360 + rotationFine) / 100 // TODO - the set and get command units dont match
            })
          }
        />
        <div style={{ fontSize: '12px' }} className={`ss-label right ${props.disabled ? 'disabled' : ''}`}>
          + 1°:
        </div>
        <DecimalInput
          step={1}
          value={rotationFine}
          disabled={props.disabled}
          onChange={value =>
            props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              KeyerIndex: props.keyerIndex,
              MixEffectIndex: props.meIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.Rotation,
              Rotation: (rotationCoarse * 360 + value) / 100 // TODO - the set and get command units dont match
            })
          }
        />
      </div>
    </React.Fragment>
  )
}

function DVEMaskProperties(props: DveSubPanelProps) {
  return (
    <MaskProperties
      isDVE={true}
      maskEnabled={props.keyerProps.maskEnabled}
      maskTop={props.keyerProps.maskTop}
      maskLeft={props.keyerProps.maskLeft}
      maskRight={props.keyerProps.maskRight}
      maskBottom={props.keyerProps.maskBottom}
      setMaskEnabled={v => {
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.MaskEnabled,
          MaskEnabled: v
        })
      }}
      setMaskTop={v => {
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.MaskTop,
          MaskTop: v
        })
      }}
      setMaskLeft={v => {
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.MaskLeft,
          MaskLeft: v
        })
      }}
      setMaskRight={v => {
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.MaskRight,
          MaskRight: v
        })
      }}
      setMaskBottom={v => {
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.MaskBottom,
          MaskBottom: v
        })
      }}
    />
  )
}

function ShadowProperties(props: DveSubPanelProps) {
  const labelClass = props.keyerProps.borderShadowEnabled ? 'ss-label' : 'ss-label disabled'

  return (
    <div>
      <ToggleButton
        active={props.keyerProps.borderShadowEnabled}
        label={'Shadow'}
        onClick={v =>
          props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
            MixEffectIndex: props.meIndex,
            KeyerIndex: props.keyerIndex,
            Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderShadowEnabled,
            BorderShadowEnabled: v
          })
        }
      />

      <div style={{ gridTemplateRows: '1fr' }} className="ss-mask-holder">
        <div className={labelClass}>Angle:</div>
        <div className="ss-rate">
          {' '}
          <DecimalInput
            step={1}
            min={0}
            max={359}
            disabled={!props.keyerProps.borderShadowEnabled}
            value={props.keyerProps.lightSourceDirection}
            onChange={value =>
              props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
                MixEffectIndex: props.meIndex,
                KeyerIndex: props.keyerIndex,
                Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.LightSourceDirection,
                LightSourceDirection: value
              })
            }
          />
        </div>
        <div className={labelClass}>Altitude:</div>
        <div className="ss-rate">
          {' '}
          <DecimalInput
            step={1}
            min={10}
            max={100}
            disabled={!props.keyerProps.borderShadowEnabled}
            value={props.keyerProps.lightSourceAltitude}
            onChange={value =>
              props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
                MixEffectIndex: props.meIndex,
                KeyerIndex: props.keyerIndex,
                Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.LightSourceAltitude,
                LightSourceAltitude: value
              })
            }
          />
        </div>
      </div>
    </div>
  )
}

const BorderBevelOptions: Array<{ id: LibAtemEnums.BorderBevel; label: string }> = [
  {
    id: LibAtemEnums.BorderBevel.None,
    label: 'No Bevel'
  },
  {
    id: LibAtemEnums.BorderBevel.InOut,
    label: 'Bevel In Out'
  },
  {
    id: LibAtemEnums.BorderBevel.In,
    label: 'Bevel In'
  },
  {
    id: LibAtemEnums.BorderBevel.Out,
    label: 'Bevel Out'
  }
]

class Border extends React.Component<DveSubPanelProps, { displayColorPicker: boolean }> {
  constructor(props: DveSubPanelProps) {
    super(props)
    this.state = {
      displayColorPicker: false
    }
  }

  render() {
    const enabled = this.props.keyerProps.borderEnabled

    const colorPicker = this.state.displayColorPicker ? (
      <div className="color-picker-popover">
        <div className="color-picker-cover" onClick={() => this.setState({ displayColorPicker: false })} />
        <ChromePicker
          onChange={color => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              BorderHue: color.hsl.h,
              BorderSaturation: color.hsl.s * 100,
              BorderLuma: color.hsl.l * 100,
              Mask:
                LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderHue |
                LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderSaturation |
                LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderLuma
            })
          }}
          disableAlpha={true}
          color={{
            h: this.props.keyerProps.borderHue,
            s: this.props.keyerProps.borderSaturation,
            l: this.props.keyerProps.borderLuma
          }}
        />
      </div>
    ) : null

    return (
      <div className="ss-mask-box">
        <ToggleButton
          active={enabled}
          label="Border"
          onClick={v => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderEnabled,
              BorderEnabled: v
            })
          }}
        />

        <div className="ss-color-inner">
          <div className={enabled ? 'ss-label' : 'ss-label disabled'}>Color: </div>
          <div
            className="ss-color-picker"
            onClick={() => (enabled ? this.setState({ displayColorPicker: !this.state.displayColorPicker }) : null)}
            style={{
              background: `hsl(${this.props.keyerProps.borderHue}, ${this.props.keyerProps.borderSaturation}%, ${this.props.keyerProps.borderLuma}%)`,
              opacity: enabled ? 1 : 0.5
            }}
          ></div>
          {colorPicker}
        </div>

        <SelectInput
          label="Color"
          value={this.props.keyerProps.borderBevel}
          disabled={!enabled}
          options={BorderBevelOptions}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderBevel,
              BorderBevel: e
            })
          }
        />

        <DecimalWithSliderInput
          label="Outer Width"
          step={0.01}
          min={0}
          max={16}
          disabled={!enabled}
          value={this.props.keyerProps.borderOuterWidth}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderOuterWidth,
              BorderOuterWidth: e
            })
          }
        />

        <DecimalWithSliderInput
          label="Inner Width"
          step={0.01}
          min={0}
          max={16}
          disabled={!enabled}
          value={this.props.keyerProps.borderInnerWidth}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderInnerWidth,
              BorderInnerWidth: e
            })
          }
        />

        <DecimalWithSliderInput
          label="Outer Soften"
          step={1}
          min={0}
          max={100}
          disabled={!enabled}
          value={this.props.keyerProps.borderOuterSoftness}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderOuterSoftness,
              BorderOuterSoftness: e
            })
          }
        />

        <DecimalWithSliderInput
          label="Inner Soften"
          step={1}
          min={0}
          max={100}
          disabled={!enabled}
          value={this.props.keyerProps.borderInnerSoftness}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderInnerSoftness,
              BorderInnerSoftness: e
            })
          }
        />

        <DecimalWithSliderInput
          label="Border Opacity"
          step={1}
          min={0}
          max={100}
          disabled={!enabled}
          value={this.props.keyerProps.borderOpacity}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderOpacity,
              BorderOpacity: e
            })
          }
        />

        <DecimalWithSliderInput
          label="Border Position"
          step={1}
          min={0}
          max={100}
          disabled={!enabled}
          value={this.props.keyerProps.borderBevelPosition}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderBevelPosition,
              BorderBevelPosition: e
            })
          }
        />

        <DecimalWithSliderInput
          label="Bevel Soften"
          step={1}
          min={0}
          max={100}
          disabled={!enabled}
          value={this.props.keyerProps.borderBevelSoftness}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderBevelSoftness,
              BorderBevelSoftness: e
            })
          }
        />
      </div>
    )
  }
}
