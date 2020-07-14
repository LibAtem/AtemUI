import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { LibAtemState, LibAtemCommands, LibAtemEnums } from '../../../generated'
import { SelectInput } from '../../common'
import { PreMultipliedKeyProperties } from '../common'
import { BorderProperties, ShadowProperties } from '../border'

function getSourceOptions(sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>) {
  // TODO - this needs to be corrected
  return Array.from(sources.entries())
    .filter(([i]) => i < 4000)
    .map(([i, v]) => (
      <option key={i} value={i}>
        {v.longName}
      </option>
    ))
}

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
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  version: LibAtemEnums.ProtocolVersion | undefined
}

export function SuperSourceArtSettings(props: SuperSourceArtSettingsProps) {
  const artKeyEnabled = props.ssrcProps.artOption === LibAtemEnums.SuperSourceArtOption.Foreground

  // TODO - protcol version support

  return (
    <div>
      <SelectInput
        label="Place In"
        value={props.ssrcProps.artOption}
        options={ArtOptions}
        onChange={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtOption,
            ArtOption: v
          })
        }
      />

      <div className="ss-row">
        <div className={'ss-label'}>Fill Source:</div>
        <select
          onChange={e =>
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtFillSource,
              ArtFillSource: e.currentTarget.value as any
            })
          }
          value={props.ssrcProps.artFillSource}
          className="ss-dropdown"
        >
          {getSourceOptions(props.sources)}
        </select>
      </div>
      <div className="ss-row">
        <div className={!artKeyEnabled ? 'ss-label disabled' : 'ss-label'}>Key Source:</div>
        <select
          disabled={!artKeyEnabled}
          onChange={e =>
            props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
              SSrcId: props.index,
              Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtCutSource,
              ArtCutSource: e.currentTarget.value as any
            })
          }
          value={props.ssrcProps.artCutSource}
          className="ss-dropdown"
        >
          {getSourceOptions(props.sources)}
        </select>
      </div>

      <PreMultipliedKeyProperties
        disabled={!artKeyEnabled}
        enabled={props.ssrcProps.artPreMultiplied}
        clip={props.ssrcProps.artClip}
        gain={props.ssrcProps.artGain}
        invert={props.ssrcProps.artInvertKey}
        setEnabled={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtPreMultiplied,
            ArtPreMultiplied: v
          })
        }
        setClip={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtClip,
            ArtClip: v
          })
        }
        setGain={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtGain,
            ArtGain: v
          })
        }
        setInvert={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourcePropertiesSetV8Command', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourcePropertiesSetV8Command_MaskFlags.ArtInvertKey,
            ArtInvertKey: v
          })
        }
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
        setEnabled={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.Enabled,
            Enabled: v
          })
        }
        setColor={color =>
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
        }
        setBevel={e =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.Bevel,
            Bevel: e
          })
        }
        setOuterWidth={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.OuterWidth,
            OuterWidth: v
          })
        }
        setInnerWidth={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.InnerWidth,
            InnerWidth: v
          })
        }
        setOuterSoftness={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.OuterSoftness,
            OuterSoftness: v
          })
        }
        setInnerSoftness={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.InnerSoftness,
            InnerSoftness: v
          })
        }
        setOpacity={() => null}
        setBevelPosition={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.BevelPosition,
            BevelPosition: v
          })
        }
        setBevelSoftness={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.BevelSoftness,
            BevelSoftness: v
          })
        }
      />

      <ShadowProperties
        disabled={
          artKeyEnabled || !props.borderProps.enabled || props.borderProps.bevel === LibAtemEnums.BorderBevel.None
        }
        altitude={props.borderProps.lightSourceAltitude}
        direction={props.borderProps.lightSourceDirection}
        setAltitude={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.LightSourceAltitude,
            LightSourceAltitude: v
          })
        }
        setDirection={v =>
          props.sendCommand('LibAtem.Commands.SuperSource.SuperSourceBorderSetCommand', {
            SSrcId: props.index,
            Mask: LibAtemCommands.SuperSource_SuperSourceBorderSetCommand_MaskFlags.LightSourceDirection,
            LightSourceDirection: v
          })
        }
      />
    </div>
  )
}
