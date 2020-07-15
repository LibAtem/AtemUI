import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { LibAtemState, LibAtemCommands, LibAtemEnums } from '../../../generated'
import { SelectInput2, SourceSelectInput2, SourcesMap } from '../../common'
import { PreMultipliedKeyProperties } from '../common'
import { BorderProperties, ShadowProperties } from '../border'

const ArtOptions = [
  {
    id: LibAtemEnums.SuperSourceArtOption.Background,
    label: 'Background'
  },
  {
    id: LibAtemEnums.SuperSourceArtOption.Foreground,
    label: 'Foreground'
  }
]

interface SuperSourceArtSettingsProps {
  sendCommand: SendCommandStrict
  index: number
  ssrcProps: LibAtemState.SuperSourceState_PropertiesState
  borderProps: LibAtemState.SuperSourceState_BorderState
  sources: SourcesMap
  version: LibAtemEnums.ProtocolVersion | undefined
}

export function SuperSourceArtSettings(props: SuperSourceArtSettingsProps) {
  const artKeyEnabled = props.ssrcProps.artOption === LibAtemEnums.SuperSourceArtOption.Foreground

  return (
    <>
      <div className="atem-form">
        <SelectInput2
          label="Place In"
          value={props.ssrcProps.artOption}
          options={ArtOptions}
          onChange={v => {
            if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
                SSrcId: props.index,
                Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtOption,
                ArtOption: v
              })
            } else if (props.index === 0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
                Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.ArtOption,
                ArtOption: v
              })
            }
          }}
        />

        <SourceSelectInput2
          label="Fill Source"
          sources={props.sources}
          sourceAvailability={LibAtemEnums.SourceAvailability.SuperSourceArt}
          value={props.ssrcProps.artFillSource}
          onChange={e => {
            if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
                SSrcId: props.index,
                Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtFillSource,
                ArtFillSource: e
              })
            } else if (props.index === 0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
                Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.ArtFillSource,
                ArtFillSource: e
              })
            }
          }}
        />

        <SourceSelectInput2
          label="Key Source"
          sources={props.sources}
          sourceAvailability={
            LibAtemEnums.SourceAvailability.SuperSourceArt | LibAtemEnums.SourceAvailability.KeySource
          }
          value={props.ssrcProps.artCutSource}
          disabled={!artKeyEnabled}
          onChange={e => {
            if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
                SSrcId: props.index,
                Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtCutSource,
                ArtCutSource: e
              })
            } else if (props.index === 0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
                Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.ArtCutSource,
                ArtCutSource: e
              })
            }
          }}
        />
      </div>

      <PreMultipliedKeyProperties
        disabled={!artKeyEnabled}
        enabled={props.ssrcProps.artPreMultiplied}
        clip={props.ssrcProps.artClip}
        gain={props.ssrcProps.artGain}
        invert={props.ssrcProps.artInvertKey}
        setEnabled={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtPreMultiplied,
              ArtPreMultiplied: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.ArtPreMultiplied,
              ArtPreMultiplied: v
            })
          }
        }}
        setClip={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtClip,
              ArtClip: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.ArtClip,
              ArtClip: v
            })
          }
        }}
        setGain={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtGain,
              ArtGain: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.ArtGain,
              ArtGain: v
            })
          }
        }}
        setInvert={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtInvertKey,
              ArtInvertKey: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.ArtInvertKey,
              ArtInvertKey: v
            })
          }
        }}
      />

      <BorderProperties
        isSsrc={true}
        enabled={props.borderProps.enabled && !artKeyEnabled}
        color={{ h: props.borderProps.hue, s: props.borderProps.saturation, l: props.borderProps.luma }}
        bevel={props.borderProps.bevel}
        OuterWidth={props.borderProps.outerWidth}
        innerWidth={props.borderProps.innerWidth}
        outerSoftness={props.borderProps.outerSoftness}
        innerSoftness={props.borderProps.innerSoftness}
        opacity={0}
        bevelPosition={props.borderProps.bevelPosition}
        bevelSoftness={props.borderProps.bevelSoftness}
        setEnabled={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.Enabled,
              Enabled: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderEnabled,
              BorderEnabled: v
            })
          }
        }}
        setColor={color => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
              SSrcId: props.index,
              Hue: color.h,
              Saturation: color.s,
              Luma: color.l,
              Mask:
                LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.Hue |
                LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.Saturation |
                LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.Luma
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              BorderHue: color.h,
              BorderSaturation: color.s,
              BorderLuma: color.l,
              Mask:
                LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderHue |
                LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderSaturation |
                LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderLuma
            })
          }
        }}
        setBevel={e => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.Bevel,
              Bevel: e
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderBevel,
              BorderBevel: e
            })
          }
        }}
        setOuterWidth={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.OuterWidth,
              OuterWidth: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderOuterWidth,
              BorderOuterWidth: v
            })
          }
        }}
        setInnerWidth={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.InnerWidth,
              InnerWidth: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderInnerWidth,
              BorderInnerWidth: v
            })
          }
        }}
        setOuterSoftness={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.OuterSoftness,
              OuterSoftness: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderOuterSoftness,
              BorderOuterSoftness: v
            })
          }
        }}
        setInnerSoftness={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.InnerSoftness,
              InnerSoftness: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderInnerSoftness,
              BorderInnerSoftness: v
            })
          }
        }}
        setOpacity={() => null}
        setBevelPosition={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.BevelPosition,
              BevelPosition: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderBevelPosition,
              BorderBevelPosition: v
            })
          }
        }}
        setBevelSoftness={v => {
          if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.BevelSoftness,
              BevelSoftness: v
            })
          } else if (props.index === 0) {
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderBevelSoftness,
              BorderBevelSoftness: v
            })
          }
        }}
      />

      <div className="atem-form no-border">
        <ShadowProperties
          disabled={
            artKeyEnabled || !props.borderProps.enabled || props.borderProps.bevel === LibAtemEnums.BorderBevel.None
          }
          altitude={props.borderProps.lightSourceAltitude}
          direction={props.borderProps.lightSourceDirection}
          setAltitude={v => {
            if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
                SSrcId: props.index,
                Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.LightSourceAltitude,
                LightSourceAltitude: v
              })
            } else if (props.index === 0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
                Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderLightSourceAltitude,
                BorderLightSourceAltitude: v
              })
            }
          }}
          setDirection={v => {
            if (!props.version || props.version >= LibAtemEnums.ProtocolVersion.V8_0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
                SSrcId: props.index,
                Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.LightSourceDirection,
                LightSourceDirection: v
              })
            } else if (props.index === 0) {
              props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetCommand', {
                Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetCommand_MaskFlags.BorderLightSourceDirection,
                BorderLightSourceDirection: v
              })
            }
          }}
        />
      </div>
    </>
  )
}
