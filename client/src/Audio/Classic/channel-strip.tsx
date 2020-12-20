import React from 'react'
import Slider from 'react-rangeslider'
import { LibAtemCommands, LibAtemEnums, LibAtemState } from '../../generated'
import { SendCommandStrict } from '../../device-page-wrapper'
import * as _ from 'underscore'
import { AudioDialControl, AudioNumericControl, AudioSoloButton, AudioStripHeading } from '../components'

interface InputChannelStripProps {
  sendCommand: SendCommandStrict

  currentInput: LibAtemState.AudioState_InputState

  audioTally: boolean
  id: LibAtemEnums.AudioSource
  monitors: any
  name: string
}
interface InputChannelStripState {
  peaks: any
}

export class InputChannelStrip extends React.Component<InputChannelStripProps, InputChannelStripState> {
  constructor(props: InputChannelStripProps) {
    super(props)
    this.state = {
      peaks: [
        [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],
        [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],
      ],
    }

    this.balanceChanged = this.balanceChanged.bind(this)
    this.soloChanged = this.soloChanged.bind(this)
  }

  shouldComponentUpdate(nextProps: InputChannelStripProps) {
    const differentInput = JSON.stringify(this.props.currentInput) !== JSON.stringify(nextProps.currentInput)
    const differentName = this.props.name !== nextProps.name
    const differentMonitors = JSON.stringify(this.props.monitors) !== JSON.stringify(nextProps.monitors)
    // return differentName || differentInput || differentMonitors;
    return differentInput || differentName || differentMonitors
  }

  private getLowerButtons(mixOption: number, sourceType: LibAtemEnums.AudioSourceType) {
    const id = this.props.id

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

  getLevel(index: number, levels: any) {
    if (levels != null) {
      var level = levels.levels[index] === '-Infinity' ? -60 : levels.levels[index]
      var percent = Math.min(100 - ((Math.pow(2, level / 40) - 0.3535) / (1 - 0.3535)) * 100, 100)
      return <div style={{ height: percent + '%' }} className="level-inner"></div>
    } else {
      return <div style={{ height: '100%' }} className="level-inner"></div>
    }
  }

  getFloatingPeaks(index: number, levels: any, mixOption: number) {
    if (levels != null) {
      if (this.state.peaks) {
        //shouldnt have to do this check

        var total = 0
        for (var j = 0; j < 5; j++) {
          total += this.state.peaks[index][j]
        }
        var avg = total / 5
        var height = Math.min(100 - ((Math.pow(2, avg / 40) - 0.3535) / (1 - 0.3535)) * 100, 100) ///((avg + 60) / 0.60), 100)
        if (mixOption === 0) {
          return <div style={{ top: height + '%', background: '#5e5e5e' }} className="peak-inner"></div>
        } else if (height < 23) {
          return <div style={{ top: height + '%', background: 'red' }} className="peak-inner"></div>
        } else if (height < 50) {
          return <div style={{ top: height + '%', background: 'yellow' }} className="peak-inner"></div>
        } else {
          return <div style={{ top: height + '%', background: 'green' }} className="peak-inner"></div>
        }
      }
    }
  }

  getPeakBoxes(index: number, levels: any, mixOption: number) {
    if (levels != null) {
      if (levels.peaks[index] > -0.01) {
        if (mixOption === 0) {
          return index === 0 ? (
            <div style={{ background: '#5e5e5e' }} className="peakBox-active"></div>
          ) : (
            <div style={{ background: '#5e5e5e' }} className="peakBox-active level-right"></div>
          )
        } else {
          return index === 0 ? (
            <div className="peakBox-active"></div>
          ) : (
            <div className="peakBox-active level-right"></div>
          )
        }
      } else {
        return index === 0 ? <div className="peakBox"></div> : <div className="peakBox level-right"></div>
      }
    }
  }

  getTopBarPeak(levels: any) {
    if (levels != null) {
      var leftPeak = levels.peaks[0] === '-Infinity' ? -60 : levels.peaks[0]
      var rightPeak = levels.peaks[1] === '-Infinity' ? -60 : levels.peaks[1]
      if (Math.max(leftPeak, rightPeak) <= -60) {
        return <div className="peak"></div>
      } else if (Math.max(leftPeak, rightPeak) < -9) {
        return (
          <div className="peak" style={{ color: 'green' }}>
            {Math.max(leftPeak, rightPeak).toFixed(2)}
          </div>
        )
      } else {
        return <div className="peak">{Math.max(leftPeak, rightPeak).toFixed(2)}</div>
      }
    } else {
      return <div className="peak"></div>
    }
  }

  updatePeaks(levels: any) {
    for (var k = 0; k < 2; k++) {
      //for left and right
      //get average
      var total = 0
      for (var i = 0; i < this.state.peaks[k].length; i++) {
        total += this.state.peaks[k][i]
      }
      var avg = total / this.state.peaks[k].length

      if (levels === null) {
        this.state.peaks[k] = [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60]
      }

      //if new val is higher than average
      else {
        var level = levels.levels[k] === '-Infinity' ? -60 : levels.levels[k]
        if (level > avg) {
          this.state.peaks[k] = this.state.peaks[k].fill(parseInt(level), 0, 15)
        } else {
          this.state.peaks[k].shift()
          this.state.peaks[k].push(level)
        }
      }
    }
  }

  private balanceChanged(value: number): void {
    this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
      Index: this.props.id,
      Mask: LibAtemCommands.Audio_AudioMixerInputSetCommand_MaskFlags.Balance,
      Balance: value,
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

  render() {
    const { currentInput, monitors, id, name, audioTally } = this.props

    var mixOption = this.props.currentInput.properties.mixOption
    var levels = this.props.currentInput.levels
    this.updatePeaks(levels)
    var levelsLeft = this.getLevel(0, levels)
    var levelsRight = this.getLevel(1, levels)
    var floatingPeaksLeft = this.getFloatingPeaks(0, levels, mixOption)
    var floatingPeaksRight = this.getFloatingPeaks(1, levels, mixOption)
    var peakBoxesLeft = this.getPeakBoxes(0, levels, mixOption)
    var peakBoxesRight = this.getPeakBoxes(1, levels, mixOption)
    var topBarPeak = this.getTopBarPeak(levels)
    var levelsClass = mixOption == 0 ? 'level' : 'level level-rainbow'
    return (
      <div className="channel">
        <AudioStripHeading name={this.props.name} isLive={audioTally} mixOption={mixOption} />
        <div className="slider-holder">
          {topBarPeak}
          <div className="scale">
            <div className="scale-1">+6-</div>
            <div className="scale-2">0-</div>
            <div className="scale-3">-6-</div>
            <div className="scale-4">-9-</div>
            <div className="scale-5">-20-</div>
            <div className="scale-6">-60-</div>
          </div>
          <div className="slider">
            <div className="fake-slider"></div>
            <Slider
              tooltip={false}
              max={1.1095}
              min={0.3535}
              step={0.001}
              value={Math.pow(
                2,
                (this.props.currentInput.properties.gain === ('-Infinty' as any)
                  ? -60
                  : this.props.currentInput.properties.gain) / 40
              )}
              orientation="vertical"
              onChange={(e) => {
                this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerInputSetCommand', {
                  Index: this.props.id,
                  MixOption: 0,
                  Gain: Math.log2(e) * 40,
                  RcaToXlrEnabled: false,
                  Mask: 2,
                })
              }}
            ></Slider>
          </div>
          <div className="level-holder">
            <div className={levelsClass}>
              {levelsLeft}
              {floatingPeaksLeft}
            </div>
            {peakBoxesLeft}
            {peakBoxesRight}
            <div className={levelsClass + ' level-right'}>
              {levelsRight}
              {floatingPeaksRight}
            </div>
          </div>
          <input
            placeholder={
              this.props.currentInput.properties.gain === ('-Infinity' as any)
                ? '-60'
                : this.props.currentInput.properties.gain.toFixed(2)
            }
            className="gain-input"
          ></input>
        </div>
        <AudioNumericControl onChange={this.balanceChanged} currentValue={currentInput.properties.balance}>
          <AudioDialControl
            onChange={this.balanceChanged}
            currentValue={currentInput.properties.balance}
            minValue={-50}
            maxValue={50}
            isActive={currentInput.properties.mixOption !== LibAtemEnums.AudioMixOption.Off}
          />
        </AudioNumericControl>
        {this.getLowerButtons(mixOption, currentInput.properties.sourceType)}
        <AudioSoloButton
          disabled={!monitors.enabled}
          isSolo={monitors.solo && monitors.soloSource === id}
          onChange={this.soloChanged}
        />
      </div>
    )
  }
}
