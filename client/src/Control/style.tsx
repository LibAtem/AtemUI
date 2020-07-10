import React from 'react'
import { AtemButtonGeneric } from './button/button'
import { SendCommand } from '.'
import { RateInput } from './Settings/settings'

interface StyleProps {
  sendCommand: SendCommand
  meIndex: number
  properties: LibAtem.MixEffectState_TransitionPropertiesState
  position: LibAtem.MixEffectState_TransitionPositionState
  videoMode: LibAtem.VideoMode
}

interface TransStyleProps {
  name: string
  command: string | null
  mask: number
}
const styles: TransStyleProps[] = [
  {
    name: 'MIX',
    command: 'LibAtem.Commands.MixEffects.Transition.TransitionMixSetCommand',
    mask: 1
  },
  {
    name: 'DIP',
    command: 'LibAtem.Commands.MixEffects.Transition.TransitionDipSetCommand',
    mask: 1
  },
  {
    name: 'WIPE',
    command: 'LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand',
    mask: 1
  },
  {
    name: 'DVE',
    command: 'LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand',
    mask: 1
  },
  {
    name: 'STING',
    command: null,
    mask: 0
  }
]

export function TransitionStylePanel(props: StyleProps) {
  const checkStyle = (index: number) => {
    if (props.position.inTransition) {
      if (props.properties.nextStyle === index) {
        return true
      } else if (props.properties.style === index) {
        // TODO - test this
        return null
      } else {
        return false
      }
    } else {
      return props.properties.style === index
    }
  }

  const currentStyle = styles[props.properties.nextStyle] as TransStyleProps | undefined

  return (
    <div className="box" id="Transition">
      <div className="box-title">Transition Style</div>
      <div className="box-transition">
        {styles.map((style, index) => (
          <AtemButtonGeneric
            color="yellow"
            callback={() =>
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand', {
                Index: props.meIndex,
                Mask: 1,
                NextStyle: index
              })
            }
            active={checkStyle(index)}
            name={style.name}
          />
        ))}

        <AtemButtonGeneric
          color="red"
          textClassName={'prev-trans'}
          callback={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPreviewSetCommand', {
              Index: props.meIndex,
              PreviewTransition: !props.properties.preview
            })
          }
          active={props.properties.preview}
          name={'PREV TRANS'}
        />

        <div></div>
        <AtemButtonGeneric
          color="red"
          callback={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.MixEffectCutCommand', { Index: props.meIndex })
          }
          active={false}
          name={'CUT'}
        />

        <AtemButtonGeneric
          color="red"
          callback={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.MixEffectAutoCommand', { Index: props.meIndex })
          }
          active={props.position.inTransition}
          name={'AUTO'}
        />

        <div className="rate">
          {' '}
          Rate
          <RateInput
            disabled={!currentStyle?.command}
            className={'rate-input'}
            callback={(e: string) => {
              if (currentStyle?.command) {
                props.sendCommand(currentStyle.command, {
                  Index: props.meIndex,
                  Mask: currentStyle.mask,
                  Rate: e
                })
              }
            }}
            value={props.position.remainingFrames}
            videoMode={props.videoMode}
          />
        </div>
      </div>
    </div>
  )
}
