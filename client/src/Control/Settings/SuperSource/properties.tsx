import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { LibAtemEnums, LibAtemState, LibAtemCommands } from '../../../generated'
import { MaskProperties } from '../common'
import {
  DecimalInput,
  SourceSelectInput2,
  DropdownMenu,
  DropdownMenuItem,
  SourcesMap,
  ToggleButton2,
  DecimalInputWithLabel
} from '../../common'
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
        <div className="atem-heading">Layout</div>

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
  sources: SourcesMap
  version: LibAtemEnums.ProtocolVersion | undefined
}

export function SuperSourceBoxSettings(props: SuperSourceBoxSettingsProps) {
  return (
    <>
      <div className="atem-form">
        <div style={{ gridColumn: 'span 2', display: 'grid', gridAutoFlow: 'column' }}>
          <ToggleButton2
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
              onClick={() => {
                if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
                  props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
                    SSrcId: props.index,
                    BoxIndex: props.boxIndex,
                    Mask:
                      LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.PositionX |
                      LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.PositionY,
                    PositionX: 0,
                    PositionY: 0
                  })
                } else if (props.index === 0) {
                  props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
                    BoxIndex: props.boxIndex,
                    Mask:
                      LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.PositionX |
                      LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.PositionY,
                    PositionX: 0,
                    PositionY: 0
                  })
                }
              }}
            >
              Reset Pos
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
                  props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
                    SSrcId: props.index,
                    BoxIndex: props.boxIndex,
                    Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Size,
                    Size: 0.5
                  })
                } else if (props.index === 0) {
                  props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
                    BoxIndex: props.boxIndex,
                    Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.Size,
                    Size: 0.5
                  })
                }
              }}
            >
              Reset Size
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
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
                } else if (props.index === 0) {
                  props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
                    BoxIndex: props.boxIndex,
                    Mask:
                      LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropTop |
                      LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropBottom |
                      LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropLeft |
                      LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropRight,
                    CropTop: 0,
                    CropBottom: 0,
                    CropLeft: 0,
                    CropRight: 0
                  })
                }
              }}
            >
              Reset Crop
            </DropdownMenuItem>
          </DropdownMenu>
        </div>

        <SourceSelectInput2
          label="Source"
          sources={props.sources}
          sourceAvailability={LibAtemEnums.SourceAvailability.SuperSourceBox}
          value={props.boxProps.source}
          disabled={!props.boxProps.enabled}
          onChange={e => {
            if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
                SSrcId: props.index,
                BoxIndex: props.boxIndex,
                Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Source,
                Source: e
              })
            } else if (props.index === 0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
                BoxIndex: props.boxIndex,
                Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.Source,
                Source: e
              })
            }
          }}
        />

        <div style={{ minWidth: '50px' }} className={`atem-label ${!props.boxProps.enabled ? 'disabled' : ''}`}>
          Position:
        </div>
        <div className="content-xy">
          <div className={`atem-label right ${!props.boxProps.enabled ? 'disabled' : ''}`}>X:</div>
          <DecimalInput
            step={0.01}
            min={-48}
            max={48}
            value={props.boxProps.positionX}
            disabled={!props.boxProps.enabled}
            onChange={value => {
              if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
                props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
                  SSrcId: props.index,
                  BoxIndex: props.boxIndex,
                  Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.PositionX,
                  PositionX: value
                })
              } else if (props.index === 0) {
                props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
                  BoxIndex: props.boxIndex,
                  Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.PositionX,
                  PositionX: value
                })
              }
            }}
          />
          <div className={`atem-label right ${!props.boxProps.enabled ? 'disabled' : ''}`}>Y:</div>
          <DecimalInput
            step={0.01}
            min={-27}
            max={27}
            value={props.boxProps.positionY}
            disabled={!props.boxProps.enabled}
            onChange={value => {
              if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
                props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
                  SSrcId: props.index,
                  BoxIndex: props.boxIndex,
                  Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.PositionY,
                  PositionY: value
                })
              } else if (props.index === 0) {
                props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
                  BoxIndex: props.boxIndex,
                  Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.PositionY,
                  PositionY: value
                })
              }
            }}
          />
        </div>

        <DecimalInputWithLabel
          label="Scale"
          step={0.01}
          min={0}
          max={1}
          value={props.boxProps.size}
          disabled={!props.boxProps.enabled}
          onChange={value => {
            if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
                SSrcId: props.index,
                BoxIndex: props.boxIndex,
                Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Size,
                Size: value
              })
            } else if (props.index === 0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
                BoxIndex: props.boxIndex,
                Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.Size,
                Size: value
              })
            }
          }}
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
        setMaskEnabled={value => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
              SSrcId: props.index,
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Cropped,
              Cropped: value
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.Cropped,
              Cropped: value
            })
          }
        }}
        setMaskTop={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
              SSrcId: props.index,
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropTop,
              CropTop: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropTop,
              CropTop: v
            })
          }
        }}
        setMaskBottom={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
              SSrcId: props.index,
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropBottom,
              CropBottom: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropBottom,
              CropBottom: v
            })
          }
        }}
        setMaskLeft={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
              SSrcId: props.index,
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropLeft,
              CropLeft: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropLeft,
              CropLeft: v
            })
          }
        }}
        setMaskRight={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
              SSrcId: props.index,
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropRight,
              CropRight: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
              BoxIndex: props.boxIndex,
              Mask: LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropRight,
              CropRight: v
            })
          }
        }}
      />
    </>
  )
}
