import React from 'react'
import { AtemButtonGeneric } from './button/button'
import { SendCommandStrict } from '../device-page-wrapper'
import { RateInput } from './Settings/settings'
import { LibAtemState, LibAtemEnums, LibAtemCommands, LibAtemProfile } from '../generated'

interface StyleProps {
  sendCommand: SendCommandStrict
  meIndex: number
  profile: LibAtemProfile.DeviceProfile
  properties: LibAtemState.MixEffectState_TransitionPropertiesState
  position: LibAtemState.MixEffectState_TransitionPositionState
  videoMode: LibAtemEnums.VideoMode
}

interface TransStyleProps {
  name: string
  sendRate: ((props: StyleProps, rate: number) => void) | null
  disabled: (profile: LibAtemProfile.DeviceProfile) => boolean
}
const styles: TransStyleProps[] = [
  {
    name: 'MIX',
    sendRate: (props: StyleProps, val: number) => {
      props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionMixSetCommand', {
        Index: props.meIndex,
        Rate: val
      })
    },
    disabled: () => false
  },
  {
    name: 'DIP',
    sendRate: (props: StyleProps, val: number) => {
      props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDipSetCommand', {
        Index: props.meIndex,
        Mask: LibAtemCommands.MixEffects_Transition_TransitionDipSetCommand_MaskFlags.Rate,
        Rate: val
      })
    },
    disabled: () => false
  },
  {
    name: 'WIPE',
    sendRate: (props: StyleProps, val: number) => {
      props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand', {
        Index: props.meIndex,
        Mask: LibAtemCommands.MixEffects_Transition_TransitionWipeSetCommand_MaskFlags.Rate,
        Rate: val
      })
    },
    disabled: () => false
  },
  {
    name: 'DVE',
    sendRate: (props: StyleProps, val: number) => {
      props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
        Index: props.meIndex,
        Mask: LibAtemCommands.MixEffects_Transition_TransitionDVESetCommand_MaskFlags.Rate,
        Rate: val
      })
    },
    disabled: (p) => p.dve === 0
  },
  {
    name: 'STING',
    sendRate: null,
    disabled: (p) => p.mediaPoolClips === 0
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
      <div className="box-style">
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
            disabled={style.disabled(props.profile)}
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
            disabled={!currentStyle?.sendRate}
            className={'rate-input'}
            callback={e => {
              if (currentStyle?.sendRate) {
                currentStyle.sendRate(props, e)
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
