import React from 'react'
import { AtemButtonGeneric } from './button/button'
import { SendCommand } from '.'
import { RateInput } from './Settings/settings'

interface FTBProps {
  sendCommand: SendCommand
  meIndex: number
  status: LibAtem.MixEffectState_FadeToBlackStatusState
  videoMode: LibAtem.VideoMode
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
              callback={(e: string) => {
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
  