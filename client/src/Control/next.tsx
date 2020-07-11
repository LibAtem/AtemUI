import React from 'react'
import { AtemButtonGeneric } from './button/button'
import { SendCommand } from '../device-page-wrapper'
import * as LibAtem  from '../libatem'

interface NextProps {
  sendCommand: SendCommand
  meIndex: number
  transition: LibAtem.MixEffectState_TransitionPropertiesState
  keyers: Pick<LibAtem.MixEffectState_KeyerState, 'onAir'>[]
}

export function NextPanel(props: NextProps) {
  const hasSelection = (id: number): boolean => (props.transition.selection & (1 << id)) !== 0
  const setSelection = (id: number): number => {
    if (hasSelection(id)) {
      return props.transition.selection ^ (1 << id)
    } else {
      return props.transition.selection | (1 << id)
    }
  }

  const keyers = props.keyers.map((key, index) => {
    return (
      <div key={index} className="box-transition-col">
        <AtemButtonGeneric
          color="red"
          textClassName={'on-air'}
          name={'ON AIR'}
          callback={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyOnAirSetCommand', {
              MixEffectIndex: props.meIndex,
              KeyerIndex: index,
              OnAir: !key.onAir
            })
          }
          active={key.onAir}
        />
        <AtemButtonGeneric
          color="yellow"
          callback={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand', {
              Index: props.meIndex,
              Mask: 2,
              NextSelection: setSelection(index + 1)
            })
          }
          active={hasSelection(index + 1)}
          name={`KEY${index + 1}`}
        />
      </div>
    )
  })

  return (
    <div className="box" id="Next">
      <div className="box-title">Next Transition</div>
      <div className="box-transition" style={{ gridTemplateColumns: `repeat(${keyers.length + 1}, 50px)` }}>
        <div className="box-transition-col">
          <div></div>
          <AtemButtonGeneric
            color="yellow"
            callback={() =>
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand', {
                Index: props.meIndex,
                Mask: 2,
                NextSelection: setSelection(0)
              })
            }
            active={hasSelection(0)}
            name={'BKGD'}
          />
        </div>
        {keyers}
      </div>
    </div>
  )
}
