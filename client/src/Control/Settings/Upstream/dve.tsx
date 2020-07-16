import React from 'react'
import { MaskProperties } from '../common'
import { SendCommandStrict } from '../../../device-page-wrapper'
import {
  DecimalInput,
  DropdownMenuItem,
  DropdownMenu,
  SourceSelectInput,
  SourcesMap,
  ToggleHeading
} from '../../../components'
import { LibAtemCommands, LibAtemState, LibAtemEnums } from '../../../generated'
import { FlyingKeyFrameProperties } from './flying'
import { BorderProperties, ShadowProperties } from '../border'
import { ResetKeyerMask } from './mask'

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
  sources: SourcesMap
  videoMode: LibAtemEnums.VideoMode
}

export class DveKeyerProperties extends React.Component<DveKeyerPropertiesProps> {
  render() {
    if (!this.props.keyer.dve) {
      return <div></div>
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

          <DVECommonProprties
            sendCommand={this.props.sendCommand}
            disabled={false}
            meIndex={this.props.meIndex}
            keyerIndex={this.props.keyerIndex}
            keyerProps={this.props.keyer.dve}
          />
        </div>

        <DVEMaskProperties
          sendCommand={this.props.sendCommand}
          meIndex={this.props.meIndex}
          keyerIndex={this.props.keyerIndex}
          keyerProps={this.props.keyer.dve}
        />
        <Shadow
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
          <div className="atem-form no-border">
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

export function ResetDVE(sendCommand: SendCommandStrict, meIndex: number, keyerIndex: number) {
  return [
    <DropdownMenuItem
      key="dve"
      onClick={() =>
        sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          KeyerIndex: keyerIndex,
          MixEffectIndex: meIndex,
          Mask:
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.SizeX |
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.SizeY |
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.PositionX |
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.PositionY |
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.Rotation,
          SizeX: 0.5,
          SizeY: 0.5,
          PositionX: 0,
          PositionY: 0,
          Rotation: 0
        })
      }
    >
      Reset DVE
    </DropdownMenuItem>,
    <DropdownMenuItem
      key="dve-full"
      skipInAll={true}
      onClick={() =>
        sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          KeyerIndex: keyerIndex,
          MixEffectIndex: meIndex,
          Mask:
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.SizeX |
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.SizeY |
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.PositionX |
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.PositionY |
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.Rotation,
          SizeX: 1,
          SizeY: 1,
          PositionX: 0,
          PositionY: 0,
          Rotation: 0
        })
      }
    >
      Reset DVE Full
    </DropdownMenuItem>,
    <DropdownMenuItem
      key="rotation"
      skipInAll={true}
      onClick={() =>
        sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          KeyerIndex: keyerIndex,
          MixEffectIndex: meIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.Rotation,
          Rotation: 0
        })
      }
    >
      Reset Rotation
    </DropdownMenuItem>
  ]
}

export function DVECommonProprties(props: DveSubPanelProps & { disabled: boolean }) {
  const rotationCoarse = Math.floor(props.keyerProps.rotation / 360)
  const rotationFine = props.keyerProps.rotation - rotationCoarse * 360

  return (
    <>
      <div className={`atem-label ${props.disabled ? 'disabled' : ''}`}>Position:</div>
      <div className="content-xy">
        <div className={`atem-label right ${props.disabled ? 'disabled' : ''}`}>X:</div>
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
        <div className={`atem-label right ${props.disabled ? 'disabled' : ''}`}>Y:</div>
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

      <div className={`atem-label ${props.disabled ? 'disabled' : ''}`}>Scale:</div>
      <div className="content-xy">
        <div className={`atem-label right ${props.disabled ? 'disabled' : ''}`}>X:</div>
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
        <div className={`atem-label right ${props.disabled ? 'disabled' : ''}`}>Y:</div>
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

      <div className={`atem-label ${props.disabled ? 'disabled' : ''}`}>Rotation:</div>
      <div className="content-xy">
        <div className={`atem-label right ${props.disabled ? 'disabled' : ''}`}>360°:</div>
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
        <div style={{ fontSize: '12px' }} className={`atem-label right ${props.disabled ? 'disabled' : ''}`}>
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
    </>
  )
}

function DVEMaskProperties(props: DveSubPanelProps) {
  return (
    <MaskProperties
      type="dve"
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

function Shadow(props: DveSubPanelProps) {
  return (
    <div className="atem-form">
      <ToggleHeading
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

      <ShadowProperties
        disabled={!props.keyerProps.borderShadowEnabled}
        altitude={props.keyerProps.lightSourceAltitude}
        direction={props.keyerProps.lightSourceDirection}
        setAltitude={value =>
          props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
            MixEffectIndex: props.meIndex,
            KeyerIndex: props.keyerIndex,
            Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.LightSourceAltitude,
            LightSourceAltitude: value
          })
        }
        setDirection={value =>
          props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
            MixEffectIndex: props.meIndex,
            KeyerIndex: props.keyerIndex,
            Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.LightSourceDirection,
            LightSourceDirection: value
          })
        }
      />
    </div>
  )
}

function Border(props: DveSubPanelProps) {
  return (
    <BorderProperties
      enabled={props.keyerProps.borderEnabled}
      color={{ h: props.keyerProps.borderHue, s: props.keyerProps.borderSaturation, l: props.keyerProps.borderLuma }}
      bevel={props.keyerProps.borderBevel}
      OuterWidth={props.keyerProps.borderOuterWidth}
      innerWidth={props.keyerProps.borderInnerWidth}
      outerSoftness={props.keyerProps.borderOuterSoftness}
      innerSoftness={props.keyerProps.borderInnerSoftness}
      opacity={props.keyerProps.borderOpacity}
      bevelPosition={props.keyerProps.borderBevelPosition}
      bevelSoftness={props.keyerProps.borderBevelSoftness}
      setEnabled={v =>
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderEnabled,
          BorderEnabled: v
        })
      }
      setColor={color =>
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          BorderHue: color.h,
          BorderSaturation: color.s * 100,
          BorderLuma: color.l * 100,
          Mask:
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderHue |
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderSaturation |
            LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderLuma
        })
      }
      setBevel={e =>
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderBevel,
          BorderBevel: e
        })
      }
      setOuterWidth={v =>
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderOuterWidth,
          BorderOuterWidth: v
        })
      }
      setInnerWidth={v =>
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderInnerWidth,
          BorderInnerWidth: v
        })
      }
      setOuterSoftness={v =>
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderOuterSoftness,
          BorderOuterSoftness: v
        })
      }
      setInnerSoftness={v =>
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderInnerSoftness,
          BorderInnerSoftness: v
        })
      }
      setOpacity={v =>
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderOpacity,
          BorderOpacity: v
        })
      }
      setBevelPosition={v =>
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderBevelPosition,
          BorderBevelPosition: v
        })
      }
      setBevelSoftness={v =>
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.BorderBevelSoftness,
          BorderBevelSoftness: v
        })
      }
    />
  )
}
