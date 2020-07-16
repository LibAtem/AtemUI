import React from 'react'
import { LibAtemState, LibAtemEnums, LibAtemCommands } from '../../../generated'
import { RateInput, SourcesMap, SelectInput } from '../../common'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { PreMultipliedKeyProperties } from '../common'

interface StingerTransitionSettingsProps {
  sendCommand: SendCommandStrict

  meIndex: LibAtemEnums.MixEffectBlockId
  stinger: LibAtemState.MixEffectState_TransitionStingerState
  sources: SourcesMap
  videoMode: LibAtemEnums.VideoMode
}

function getMediaPlayerOptions(props: StingerTransitionSettingsProps) {
  return Array.from(props.sources.values())
    .filter(v => v.internalPortType === LibAtemEnums.InternalPortType.MediaPlayerFill)
    .map((v, x) => ({ id: x + 1, label: v.longName }))
}

export function StingerTransitionSettings(props: StingerTransitionSettingsProps) {
  return (
    <>
      <div className="atem-form">
        <SelectInput
          label="Source"
          value={props.stinger.source}
          options={getMediaPlayerOptions(props)}
          onChange={v =>
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
              Index: props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionStingerSetCommand_MaskFlags.Source,
              Source: v
            })
          }
        />
        <div className="atem-label">Clip Duration:</div>{' '}
        <div className="ss-rate">
          <RateInput
            value={props.stinger.clipDuration}
            videoMode={props.videoMode}
            callback={e => {
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                Index: props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionStingerSetCommand_MaskFlags.ClipDuration,
                ClipDuration: e
              })
            }}
          />
        </div>
        <div className="atem-label">Trigger Point:</div>{' '}
        <div className="ss-rate">
          <RateInput
            value={props.stinger.triggerPoint}
            videoMode={props.videoMode}
            callback={e => {
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                Index: props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionStingerSetCommand_MaskFlags.TriggerPoint,
                TriggerPoint: e
              })
            }}
          />
        </div>
        <div className="atem-label">Mix Rate:</div>{' '}
        <div className="ss-rate">
          <RateInput
            value={props.stinger.mixRate}
            videoMode={props.videoMode}
            callback={e => {
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                Index: props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionStingerSetCommand_MaskFlags.MixRate,
                MixRate: e
              })
            }}
          />
        </div>
        <div className="atem-label">Pre Roll:</div>{' '}
        <div className="ss-rate">
          <RateInput
            value={props.stinger.preroll}
            videoMode={props.videoMode}
            callback={e => {
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                Index: props.meIndex,
                Mask: LibAtemCommands.MixEffects_Transition_TransitionStingerSetCommand_MaskFlags.Preroll,
                Preroll: e
              })
            }}
          />
        </div>
      </div>
      <PreMultipliedKeyProperties
        enabled={props.stinger.preMultipliedKey}
        clip={props.stinger.clip}
        gain={props.stinger.gain}
        invert={props.stinger.invert}
        setEnabled={v => {
          props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
            Index: props.meIndex,
            Mask: LibAtemCommands.MixEffects_Transition_TransitionStingerSetCommand_MaskFlags.PreMultipliedKey,
            PreMultipliedKey: v
          })
        }}
        setClip={v => {
          props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
            Index: props.meIndex,
            Mask: LibAtemCommands.MixEffects_Transition_TransitionStingerSetCommand_MaskFlags.Clip,
            Clip: v
          })
        }}
        setGain={v => {
          props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
            Index: props.meIndex,
            Mask: LibAtemCommands.MixEffects_Transition_TransitionStingerSetCommand_MaskFlags.Gain,
            Gain: v
          })
        }}
        setInvert={v => {
          props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
            Index: props.meIndex,
            Mask: LibAtemCommands.MixEffects_Transition_TransitionStingerSetCommand_MaskFlags.Invert,
            Invert: v
          })
        }}
      />
    </>
  )
}
