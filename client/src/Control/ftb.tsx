import React from 'react'
import { AtemButtonGeneric } from './button/button'
import { SendCommandStrict } from '../device-page-wrapper'
import { RateInput } from './Settings/settings'
import { LibAtemState, LibAtemEnums } from '../generated'

interface FTBProps {
  sendCommand: SendCommandStrict
  meIndex: number
  status: LibAtemState.MixEffectState_FadeToBlackStatusState
  videoMode: LibAtemEnums.VideoMode
}

export function FTBPanel(props: FTBProps) {
    return (
      <div className="box" id="FTB">
        <div className="box-title">Fade to Black</div>
        <div className="box-ftb">
          <div className="rate">
            {' '}
            Rate
            <RateInput
              className={'rate-input'}
              callback={(e) => {
                props.sendCommand('LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand', { Index: props.meIndex, Rate: e })
              }}
              value={props.status.remainingFrames}
              videoMode={props.videoMode}
            />
          </div>
          <AtemButtonGeneric
          color='red'
            callback={() => props.sendCommand('LibAtem.Commands.MixEffects.FadeToBlackAutoCommand', { Index: props.meIndex })}
            name={'FTB'}
            active={props.status.isFullyBlack ? null : props.status.inTransition}
          />
        </div>
      </div>
    )
  }
  