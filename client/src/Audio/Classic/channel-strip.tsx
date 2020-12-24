import React from 'react'
import { LibAtemCommands, LibAtemEnums, LibAtemState } from '../../generated'
import { SendCommandStrict } from '../../device-page-wrapper'
import * as _ from 'underscore'
import {
  AudioDialControl,
  AudioFaderControl,
  AudioNumericControl,
  AudioSoloButton,
  AudioStripHeading,
  CLASSIC_AUDIO_MIN_LEVEL,
} from '../components'

interface InputChannelStripProps {
  sendCommand: SendCommandStrict

  inputProperties: LibAtemState.AudioState_InputState_PropertiesState
  rawLevels: LibAtemState.AudioState_LevelsState | undefined
  averagePeaks: number[]

  audioTally: boolean
  id: LibAtemEnums.AudioSource
  monitorOutput: any
  name: string
}

export class InputChannelStrip extends React.PureComponent<InputChannelStripProps> {
  constructor(props: InputChannelStripProps) {
    super(props)

    this.balanceChanged = this.balanceChanged.bind(this)
    this.gainChanged = this.gainChanged.bind(this)
    this.soloChanged = this.soloChanged.bind(this)
    this.resetPeaks = this.resetPeaks.bind(this)
  }

  // shouldComponentUpdate(nextProps: InputChannelStripProps) {
  //   const differentInput = !_.isEqual(this.props.currentInput, nextProps.currentInput)
  //   const differentName = this.props.name !== nextProps.name
  //   const differentMonitors = !_.isEqual(this.props.monitorOutput, nextProps.monitorOutput)
  //   // return differentName || differentInput || differentMonitors;
  //   return differentInput || differentName || differentMonitors
  // }

  private getLowerButtons(mixOption: number, sourceType: LibAtemEnums.AudioSourceType) {
    const { id } = this.props

    const createButton = (option: LibAtemEnums.AudioMixOption, label: string) => {
      return (
        <div
          onClick={() =>
            this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
              Index: id,
              Mask: LibAtemCommands.Audio_AudioMixerInputSetCommand_MaskFlags.MixOption,
              MixOption: mixOption === option ? LibAtemEnums.AudioMixOption.Off : option,
            })
          }
          className={`button-inner ${mixOption === option ? 'button-inner-selected' : ''}`}
        >
          {label}
        </div>
      )
    }

    return (
      <div className="button-holder">
        {sourceType !== LibAtemEnums.AudioSourceType.MediaPlayer
          ? createButton(LibAtemEnums.AudioMixOption.On, 'ON')
          : ''}
        {sourceType !== LibAtemEnums.AudioSourceType.ExternalAudio
          ? createButton(LibAtemEnums.AudioMixOption.AudioFollowVideo, 'AFV')
          : ''}
      </div>
    )
  }

  private balanceChanged(value: number): void {
    this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
      Index: this.props.id,
      Mask: LibAtemCommands.Audio_AudioMixerInputSetCommand_MaskFlags.Balance,
      Balance: value,
    })
  }
  private gainChanged(value: number): void {
    this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
      Mask: LibAtemCommands.Audio_AudioMixerInputSetCommand_MaskFlags.Gain,
      Index: this.props.id,
      Gain: value,
    })
  }
  private soloChanged(solo: boolean): void {
    if (solo) {
      this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerMonitorSetCommand', {
        Mask:
          LibAtemCommands.Audio_AudioMixerMonitorSetCommand_MaskFlags.Solo |
          LibAtemCommands.Audio_AudioMixerMonitorSetCommand_MaskFlags.SoloSource,
        Solo: true,
        SoloSource: this.props.id,
      })
    } else {
      this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerMonitorSetCommand', {
        Mask: LibAtemCommands.Audio_AudioMixerMonitorSetCommand_MaskFlags.Solo,
        Solo: false,
      })
    }
  }
  private resetPeaks(): void {
    this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerResetPeaksCommand', {
      Mask: LibAtemCommands.Audio_AudioMixerResetPeaksCommand_MaskFlags.Input,
      Input: this.props.id,
    })
  }

  render() {
    const { inputProperties, rawLevels, monitorOutput, id, name, audioTally, averagePeaks } = this.props

    return (
      <div className="channel">
        <AudioStripHeading name={name} isLive={audioTally} mixOption={inputProperties.mixOption} />
        <div className="audio-fader">
          <AudioNumericControl
            onChange={this.gainChanged}
            currentValue={inputProperties.gain}
            fixedPoint={2}
            negativeInfinity={CLASSIC_AUDIO_MIN_LEVEL}
          >
            <AudioFaderControl
              maxValue={6}
              minValue={CLASSIC_AUDIO_MIN_LEVEL}
              decibels={true}
              isActive={inputProperties.mixOption !== LibAtemEnums.AudioMixOption.Off}
              currentValue={inputProperties.gain}
              onChange={this.gainChanged}
              resetPeaks={this.resetPeaks}
              rawLevels={rawLevels}
              averagePeaks={averagePeaks}
            />
          </AudioNumericControl>
        </div>

        <AudioNumericControl onChange={this.balanceChanged} currentValue={inputProperties.balance}>
          <AudioDialControl
            onChange={this.balanceChanged}
            currentValue={inputProperties.balance}
            minValue={-50}
            maxValue={50}
            isActive={inputProperties.mixOption !== LibAtemEnums.AudioMixOption.Off}
          />
        </AudioNumericControl>
        {this.getLowerButtons(inputProperties.mixOption, inputProperties.sourceType)}
        <AudioSoloButton
          disabled={!monitorOutput.enabled}
          isSolo={monitorOutput.solo && monitorOutput.soloSource === id}
          onChange={this.soloChanged}
        />
      </div>
    )
  }
}
