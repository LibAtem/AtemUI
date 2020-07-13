import React from 'react'
import { LibAtemState, LibAtemEnums, LibAtemCommands } from '../../../generated'
import { RateInput, MagicInput } from '../settings'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { ToggleButton } from '../common'
import Slider from 'react-rangeslider'

interface StingerTransitionSettingsProps {
  sendCommand: SendCommandStrict

  meIndex: LibAtemEnums.MixEffectBlockId
  stinger: LibAtemState.MixEffectState_TransitionStingerState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

function getMediaPlayerOptions(props: StingerTransitionSettingsProps) {
  return Array.from(props.sources.entries())
    .filter(([i]) => i === 3010 || i === 3020 || i === 3030 || i === 3040)
    .map(([i, v], x) => (
      <option key={i} value={x + 1}>
        {v.longName}
      </option>
    ))
}

function getPreMultBox(props: StingerTransitionSettingsProps) {
  var enabled = props.stinger.preMultipliedKey
  var diabledClass = !enabled ? 'sss ss-slider-outer' : 'sss ss-slider-outer disabled'
  return (
    <div className="ss-pmk">
      <ToggleButton
        active={enabled}
        label={'Pre Multiplied Key'}
        onClick={() => {
          props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
            Index: props.meIndex,
            Mask: 2,
            PreMultipliedKey: !enabled
          })
        }}
      />
      <div className="ss-slider-holder">
        <div className={diabledClass}>
          <Slider
            tooltip={false}
            step={0.1}
            onChange={e =>
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                Index: props.meIndex,
                Mask: 4,
                Clip: e
              })
            }
            value={props.stinger.clip}
          />
          <div className="ss-slider-label">Clip:</div>
        </div>
        <MagicInput
          disabled={enabled}
          value={props.stinger.clip}
          callback={(value: any) => {
            if (value != '') {
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                Index: props.meIndex,
                Mask: 4,
                Clip: Math.min(100, Math.max(0, value))
              })
            }
          }}
        />
      </div>

      <div className="ss-slider-holder">
        <div className={diabledClass}>
          <Slider
            tooltip={false}
            step={0.1}
            onChange={e =>
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                Index: props.meIndex,
                Mask: 8,
                Gain: e
              })
            }
            value={props.stinger.gain}
          />
          <div className="ss-slider-label">Gain:</div>
        </div>
        <MagicInput
          disabled={enabled}
          value={props.stinger.gain}
          callback={(value: any) => {
            if (value != '') {
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
                Index: props.meIndex,
                Mask: 8,
                Gain: Math.min(100, Math.max(0, value))
              })
            }
          }}
        />
      </div>

      <label className="ss-checkbox-container">
        Invert
        <input
          type="checkbox"
          disabled={enabled}
          checked={props.stinger.invert}
          onClick={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionStingerSetCommand', {
              Index: props.meIndex,
              Mask: 16,
              Invert: !props.stinger.invert
            })
          }
        ></input>
        <span className="checkmark"></span>
      </label>
    </div>
  )
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
          id="cars"
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

      {getPreMultBox(props)}
    </React.Fragment>
  )
}
