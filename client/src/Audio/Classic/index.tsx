import React, { PropsWithChildren } from 'react'
import { LibAtemEnums, LibAtemState } from '../../generated'
import { SendCommandStrict } from '../../device-page-wrapper'
import * as _ from 'underscore'
import { audioSourceToVideoSource } from '../../util/audio'
import { InputChannelStrip, OutputChannelStrip } from './channel-strip'
import { CLASSIC_AUDIO_MIN_LEVEL, sanitisePeakValue } from '../components'
import { useMediaQuery } from 'react-responsive'

interface ClassicAudioPageInnerProps {
  sendCommand: SendCommandStrict
  currentState: LibAtemState.AtemState
}

interface ClassicAudioPageInnerState {
  inputPeaks: { [sourceId: number]: number[] }
  outputPeaks: number[]
}

export class ClassicAudioPageInner extends React.PureComponent<ClassicAudioPageInnerProps, ClassicAudioPageInnerState> {
  private readonly PEAK_UPDATE_PERIOD = 50 // ms
  private readonly PEAK_STORED_VALUES = 15
  private readonly PEAK_SAMPLE_VALUES = 5

  private updateInterval: NodeJS.Timeout | undefined

  private inputPeakSamples: { [sourceId: number]: number[][] } = {}

  constructor(props: ClassicAudioPageInnerProps) {
    super(props)

    this.state = {
      inputPeaks: {},
      outputPeaks: [],
    }

    // TODO - we should simply tell the server that we want audio levels, and it should intelligently subscribe/unsubscribe based on all clients
    this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerSendLevelsCommand', { SendLevels: true })
  }

  componentDidMount() {
    if (this.updateInterval === undefined) {
      this.updateInterval = setInterval(this.updatePeaks.bind(this), this.PEAK_UPDATE_PERIOD)
    }
  }
  componentWillUnmount() {
    if (this.updateInterval !== undefined) {
      clearInterval(this.updateInterval)
      this.updateInterval = undefined
    }
  }

  private updatePeaks(): void {
    const audioState = this.props.currentState.audio
    if (audioState) {
      const newPeaks: ClassicAudioPageInner['inputPeakSamples'] = {}
      const newState: ClassicAudioPageInnerState['inputPeaks'] = {}
      for (const [id0, props] of Object.entries(audioState.inputs)) {
        const id = (id0 as any) as number
        if (props.levels) {
          const newInputPeaks = props.levels.levels.map((val, index) => {
            const safePeak = sanitisePeakValue(val, CLASSIC_AUDIO_MIN_LEVEL)
            const oldValues = (this.inputPeakSamples[id] ?? [])[index] ?? []

            const oldAverage = _.reduce(oldValues, (memo, num) => memo + num, 0) / oldValues.length
            if (oldValues.length === 0 || oldAverage < safePeak) {
              return new Array(this.PEAK_STORED_VALUES).fill(safePeak) // TODO - verify
            } else {
              return [safePeak, ...oldValues].slice(0, this.PEAK_STORED_VALUES)
            }
          })

          newPeaks[id] = newInputPeaks
          newState[id] = newInputPeaks.map((p) => {
            const sampleValues = p.slice(-this.PEAK_SAMPLE_VALUES)
            return _.reduce(sampleValues, (memo, num) => memo + num, 0) / sampleValues.length
          })
        }
      }

      this.inputPeakSamples = newPeaks
      this.setState({ inputPeaks: newState })
    }
  }

  render() {
    const audioState = this.props.currentState.audio
    if (!audioState) {
      return <p>Classic Audio not supported</p>
    }

    const isFadedToBlack = this.props.currentState.mixEffects[0]?.fadeToBlack?.status?.isFullyBlack ?? false

    const { inputPeaks, outputPeaks } = this.state

    const allAudioInputs: Array<[LibAtemEnums.AudioSource, LibAtemState.AudioState_InputState]> = Object.entries(
      audioState.inputs
    ).map(([k, v]) => [parseInt(k), v])
    const [audioInputs, videoInputs] = _.partition(
      allAudioInputs,
      ([x, v]) => v.properties.sourceType === LibAtemEnums.AudioSourceType.ExternalAudio
    )

    const stickyChannels = audioInputs.map(([id, input]) => {
      const tally = audioState.tally ? audioState.tally[id] ?? false : false

      return (
        <InputChannelStrip
          key={id}
          sendCommand={this.props.sendCommand}
          inputProperties={input.properties}
          rawLevels={input.levels}
          averagePeaks={inputPeaks[id] ?? []}
          id={id}
          audioTally={tally}
          monitorOutput={audioState.monitorOutputs[0]}
          name={LibAtemEnums.AudioSource[id]}
        />
      )
    })

    const externalChannels = videoInputs.map(([idMain, input]) => {
      const tally = audioState.tally ? audioState.tally[idMain] ?? false : false

      const videoId = audioSourceToVideoSource(idMain)
      const inputProps = videoId ? this.props.currentState.settings.inputs[videoId] : undefined

      return (
        <InputChannelStrip
          key={idMain}
          sendCommand={this.props.sendCommand}
          inputProperties={input.properties}
          rawLevels={input.levels}
          averagePeaks={inputPeaks[idMain] ?? []}
          id={idMain}
          audioTally={tally}
          monitorOutput={audioState.monitorOutputs[0]}
          name={inputProps?.properties?.shortName ?? 'Unknown'}
        />
      )
    })

    return (
      <PageChannelStrip stickyChannels={stickyChannels.length}>
        <div className="channel-strip-group scrollable">{externalChannels}</div>
        <div className="channel-strip-group">{stickyChannels}</div>
        <div className="channel-strip-group">
          <OutputChannelStrip
            sendCommand={this.props.sendCommand}
            gain={audioState.programOut.gain}
            balance={audioState.programOut.balance}
            followFadeToBlack={audioState.programOut.followFadeToBlack}
            isFadedToBlack={isFadedToBlack}
            rawLevels={audioState.programOut.levels}
            averagePeaks={outputPeaks ?? []}
            monitorOutput={audioState.monitorOutputs[0]}
          />
        </div>
      </PageChannelStrip>
    )
  }
}

function PageChannelStrip(props: PropsWithChildren<{ stickyChannels: number }>) {
  const WIDTH_PER_CHANENL = 90
  const stickyWidth = props.stickyChannels * WIDTH_PER_CHANENL
  const isNarrow = useMediaQuery({ query: `(max-width: ${stickyWidth * 3}px)` })

  return <div className={`page-channel-strip ${isNarrow ? '' : 'channels-inner-scroll'}`}>{props.children}</div>
}
