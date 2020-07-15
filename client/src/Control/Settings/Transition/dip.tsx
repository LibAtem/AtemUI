import React from 'react'
import { LibAtemState, LibAtemEnums, LibAtemCommands } from '../../../generated'
import { RateInput, SourceSelectInput, SourcesMap } from '../../common'
import { SendCommandStrict } from '../../../device-page-wrapper'

interface DipTransitionSettingsProps {
  sendCommand: SendCommandStrict

  meIndex: LibAtemEnums.MixEffectBlockId
  dip: LibAtemState.MixEffectState_TransitionDipState
  sources: SourcesMap
  videoMode: LibAtemEnums.VideoMode
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

      <SourceSelectInput
        label="Dip Source"
        sources={props.sources}
        sourceAvailability={LibAtemEnums.SourceAvailability.None}
        meAvailability={props.meIndex}
        value={props.dip.input}
        onChange={e =>
          props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDipSetCommand', {
            Index: props.meIndex,
            Mask: LibAtemCommands.MixEffects_Transition_TransitionDipSetCommand_MaskFlags.Input,
            Input: e
          })
        }
      />
    </React.Fragment>
  )
}
