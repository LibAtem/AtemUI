import React from 'react'
import { LibAtemState, LibAtemEnums } from '../../../generated'
import { RateInput } from '../../../components'
import { SendCommandStrict } from '../../../device-page-wrapper'

interface MixTransitionSettingsProps {
  sendCommand: SendCommandStrict

  meIndex: LibAtemEnums.MixEffectBlockId
  mix: LibAtemState.MixEffectState_TransitionMixState
  videoMode: LibAtemEnums.VideoMode
}

export function MixTransitionSettings(props: MixTransitionSettingsProps) {
  return (
    <React.Fragment>
      <div className="atem-form">
        <div className="atem-label">Rate:</div>
        <div className="ss-rate">
          <RateInput
            value={props.mix.rate}
            videoMode={props.videoMode}
            callback={e => {
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionMixSetCommand', {
                Index: props.meIndex,
                Rate: e
              })
            }}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
