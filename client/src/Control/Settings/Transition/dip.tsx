import React from 'react'
import { LibAtemState, LibAtemEnums, LibAtemCommands } from '../../../generated'
import { RateInput } from '../../common'
import { SendCommandStrict } from '../../../device-page-wrapper'

interface DipTransitionSettingsProps {
  sendCommand: SendCommandStrict

  meIndex: LibAtemEnums.MixEffectBlockId
  dip: LibAtemState.MixEffectState_TransitionDipState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

function getSourceOptions(props: DipTransitionSettingsProps) {
  return Array.from(props.sources.entries())
    .filter(([i]) => i < 4000)
    .map(([i, v]) => (
      <option key={i} value={i}>
        {v.longName}
      </option>
    ))
}

export function DipTransitionSettings(props: DipTransitionSettingsProps) {
  return (
    <React.Fragment>
      <div className="ss-row">
        <div className="ss-label">Rate:</div>{' '}
        <div className="ss-rate">
          <RateInput
            value={props.dip.rate}
            videoMode={props.videoMode}
            callback={e => {
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDipSetCommand', {
                Index: props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionDipSetCommand_MaskFlags.Rate,
                Rate: e
              })
            }}
          />
        </div>
      </div>
      <div className="ss-row">
        <div className="ss-label">Dip Source:</div>
        <select
          onChange={e => {
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDipSetCommand', {
              Index: props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionDipSetCommand_MaskFlags.Input,
              Input: e.currentTarget.value as any
            })
          }}
          value={props.dip.input}
          className="ss-dropdown"
          id="cars"
        >
          {getSourceOptions(props)}
        </select>
      </div>
    </React.Fragment>
  )
}
