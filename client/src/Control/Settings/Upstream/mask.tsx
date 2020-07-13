import React from 'react'
import { MaskProperties } from '../common'
import { LibAtemState, LibAtemCommands } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'

export function KeyerMaskProperties(props: {
  meIndex: number
  keyerIndex: number
  keyerProps: LibAtemState.MixEffectState_KeyerPropertiesState
  sendCommand: SendCommandStrict
}) {
  return (
    <MaskProperties
      maskEnabled={props.keyerProps.maskEnabled}
      maskTop={props.keyerProps.maskTop}
      maskLeft={props.keyerProps.maskLeft}
      maskRight={props.keyerProps.maskRight}
      maskBottom={props.keyerProps.maskBottom}
      setMaskEnabled={v => {
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyMaskSetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyMaskSetCommand_MaskFlags.MaskEnabled,
          MaskEnabled: v
        })
      }}
      setMaskTop={v => {
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyMaskSetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyMaskSetCommand_MaskFlags.MaskTop,
          MaskTop: v
        })
      }}
      setMaskLeft={v => {
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyMaskSetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyMaskSetCommand_MaskFlags.MaskLeft,
          MaskLeft: v
        })
      }}
      setMaskRight={v => {
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyMaskSetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyMaskSetCommand_MaskFlags.MaskRight,
          MaskRight: v
        })
      }}
      setMaskBottom={v => {
        props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyMaskSetCommand', {
          MixEffectIndex: props.meIndex,
          KeyerIndex: props.keyerIndex,
          Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyMaskSetCommand_MaskFlags.MaskBottom,
          MaskBottom: v
        })
      }}
    />
  )
}
