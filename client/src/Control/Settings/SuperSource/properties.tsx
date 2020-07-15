import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { LibAtemEnums, LibAtemState, LibAtemCommands } from '../../../generated'
import { ToggleButton, MaskProperties } from '../common'
import { DecimalInput, SourceSelectInput, DropdownMenu, DropdownMenuItem } from '../../common'
import { Layouts } from './layouts'

interface SuperSourcePropertiesSettingsProps {
  sendCommand: SendCommandStrict
  index: number
  version: LibAtemEnums.ProtocolVersion | undefined
}

export class SuperSourcePropertiesSettings extends React.PureComponent<SuperSourcePropertiesSettingsProps> {
  render() {
    return (
      <div>
        <div className="ss-heading">Layout</div>

        <div className="ss-ssrc-layout-grid">
          {Layouts.map((l, i) => (
            <div key={i} onClick={() => l.apply(this.props.sendCommand, this.props.version, this.props.index)}>
              {l.icon()}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

interface SuperSourceBoxSettingsProps {
  sendCommand: SendCommandStrict
  index: number
  boxIndex: number
  boxProps: LibAtemState.SuperSourceState_BoxState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  version: LibAtemEnums.ProtocolVersion | undefined
}

export function SuperSourceBoxSettings(props: SuperSourceBoxSettingsProps) {
  // TODO - protcol version support

  return (
    <div>
      <div style={{ gridAutoFlow: 'column', display: 'grid' }}>
        <ToggleButton
          label="Enable box"
          active={props.boxProps.enabled}
          onClick={v =>
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
              SSrcId: props.index,
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Enabled,
              Enabled: v
            })
          }
        />

        <DropdownMenu style={{ margin: '10px 10px 0' }} resetAll={true}>
          <DropdownMenuItem
            onClick={() =>
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
                SSrcId: props.index,
                BoxIndex: props.boxIndex,
                Mask:
                  LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.PositionX |
                  LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.PositionY,
                PositionX: 0,
                PositionY: 0
              })
            }
          >
            Reset Pos
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
                SSrcId: props.index,
                BoxIndex: props.boxIndex,
                Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Size,
                Size: 0.5
              })
            }
          >
            Reset Size
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
                SSrcId: props.index,
                BoxIndex: props.boxIndex,
                Mask:
                  LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropTop |
                  LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropBottom |
                  LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropLeft |
                  LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropRight,
                CropTop: 0,
                CropBottom: 0,
                CropLeft: 0,
                CropRight: 0
              })
            }
          >
            Reset Crop
          </DropdownMenuItem>
        </DropdownMenu>
      </div>

      <SourceSelectInput
        label="Source"
        sources={props.sources}
        sourceAvailability={LibAtemEnums.SourceAvailability.SuperSourceBox}
        value={props.boxProps.source}
        disabled={!props.boxProps.enabled}
        onChange={e =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
            SSrcId: props.index,
            BoxIndex: props.boxIndex,
            Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Source,
            Source: e
          })
        }
      />

      <div className="ss-row xy">
        <div style={{ minWidth: '50px' }} className={`ss-label ${!props.boxProps.enabled ? 'disabled' : ''}`}>
          Position:
        </div>
        <div className={`ss-label right ${!props.boxProps.enabled ? 'disabled' : ''}`}>X:</div>
        <DecimalInput
          step={0.01}
          min={-48}
          max={48}
          value={props.boxProps.positionX}
          disabled={!props.boxProps.enabled}
          onChange={value =>
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
              SSrcId: props.index,
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.PositionX,
              PositionX: value
            })
          }
        />
        <div className={`ss-label right ${!props.boxProps.enabled ? 'disabled' : ''}`}>Y:</div>
        <DecimalInput
          step={0.01}
          min={-27}
          max={27}
          value={props.boxProps.positionY}
          disabled={!props.boxProps.enabled}
          onChange={value =>
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
              SSrcId: props.index,
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.PositionY,
              PositionY: value
            })
          }
        />
      </div>

      <div className="ss-row xy">
        <div style={{ minWidth: '50px' }} className={`ss-label ${!props.boxProps.enabled ? 'disabled' : ''}`}>
          Scale:
        </div>
        <div className={`ss-label right ${!props.boxProps.enabled ? 'disabled' : ''}`}>X:</div>
        <DecimalInput
          step={0.01}
          min={0}
          max={1}
          value={props.boxProps.size}
          disabled={!props.boxProps.enabled}
          onChange={value =>
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
              SSrcId: props.index,
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Size,
              Size: value
            })
          }
        />
      </div>

      <MaskProperties
        type="ssrc-box"
        disabled={!props.boxProps.enabled}
        maskEnabled={props.boxProps.cropped}
        maskTop={props.boxProps.cropTop}
        maskBottom={props.boxProps.cropBottom}
        maskLeft={props.boxProps.cropLeft}
        maskRight={props.boxProps.cropRight}
        setMaskEnabled={value =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
            SSrcId: props.index,
            BoxIndex: props.boxIndex,
            Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Cropped,
            Cropped: value
          })
        }
        setMaskTop={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
            SSrcId: props.index,
            BoxIndex: props.boxIndex,
            Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropTop,
            CropTop: v
          })
        }
        setMaskBottom={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
            SSrcId: props.index,
            BoxIndex: props.boxIndex,
            Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropBottom,
            CropBottom: v
          })
        }
        setMaskLeft={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
            SSrcId: props.index,
            BoxIndex: props.boxIndex,
            Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropLeft,
            CropLeft: v
          })
        }
        setMaskRight={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
            SSrcId: props.index,
            BoxIndex: props.boxIndex,
            Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropRight,
            CropRight: v
          })
        }
      />
    </div>
  )
}
