import React from 'react'
import { MaskProperties } from '../common'
import { LibAtemState, LibAtemCommands } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { DropdownMenuItem } from '../../../components'

export function ResetKeyerMask(sendCommand: SendCommandStrict, meIndex: number, keyerIndex: number) {
  return (
    <DropdownMenuItem
      onClick={() =>
        sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyMaskSetCommand', {
          MixEffectIndex: meIndex,
          KeyerIndex: keyerIndex,
          Mask:
            LibAtemCommands.MixEffects_Key_MixEffectKeyMaskSetCommand_MaskFlags.MaskTop |
            LibAtemCommands.MixEffects_Key_MixEffectKeyMaskSetCommand_MaskFlags.MaskBottom |
            LibAtemCommands.MixEffects_Key_MixEffectKeyMaskSetCommand_MaskFlags.MaskLeft |
            LibAtemCommands.MixEffects_Key_MixEffectKeyMaskSetCommand_MaskFlags.MaskRight,
          MaskTop: 9,
          MaskBottom: -9,
          MaskLeft: -16,
          MaskRight: 16
        })
      }
    >
      Reset Mask
    </DropdownMenuItem>
  )
}

export function KeyerMaskProperties(props: {
  meIndex: number
  keyerIndex: number
  keyerProps: LibAtemState.MixEffectState_KeyerPropertiesState
  sendCommand: SendCommandStrict
}) {
  return (
    <MaskProperties
      type="key"
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
