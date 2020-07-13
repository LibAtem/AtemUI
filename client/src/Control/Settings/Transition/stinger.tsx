import React from 'react'
import { LibAtemState, LibAtemEnums, LibAtemCommands } from '../../../generated'
import { RateInput } from '../../common'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { PreMultipliedKeyProperties } from '../common'

interface StingerTransitionSettingsProps {
  sendCommand: SendCommandStrict

  meIndex: LibAtemEnums.MixEffectBlockId
  stinger: LibAtemState.MixEffectState_TransitionStingerState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

function getMediaPlayerOptions(props: StingerTransitionSettingsProps) {
  return Array.from(props.sources.entries())
    .filter(([i, v]) => v.internalPortType === LibAtemEnums.InternalPortType.MediaPlayerFill)
    .map(([i, v], x) => (
      <option key={i} value={x + 1}>
        {v.longName}
      </option>
    ))
}

export function StingerTransitionSettings(props: StingerTransitionSettingsProps) {
  return (
    <React.Fragment>
      <div className="ss-row">
        <div className="ss-label">Source:</div>
        <select
          onChange={e => {
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
              Index: props.meIndex,
              Mask: LibAtemCommands.MixEffects_Transition_TransitionStingerSetCommand_MaskFlags.Source,
              Source: e.currentTarget.value as any
            })
          }}
          value={props.stinger.source}
          className="ss-dropdown"
        >
          {getMediaPlayerOptions(props)}
        </select>
      </div>

      <div className="ss-row">
        <div className="ss-label">Clip Duration:</div>{' '}
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
      </div>
      <div className="ss-row">
        <div className="ss-label">Trigger Point:</div>{' '}
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
      </div>
      <div className="ss-row">
        <div className="ss-label">Mix Rate:</div>{' '}
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
      </div>
      <div className="ss-row">
        <div className="ss-label">Pre Roll:</div>{' '}
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
    </React.Fragment>
  )
}
