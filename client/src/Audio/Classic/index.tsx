import React from 'react'
import { AtemDeviceInfo } from '../../Devices/types'
import { LibAtemEnums, LibAtemState } from '../../generated'
import { SendCommandStrict, sendCommandStrict } from '../../device-page-wrapper'
import { CommandTypes } from '../../generated/commands'
import * as _ from 'underscore'
import { audioSourceToVideoSource } from '../../util/audio'
import { InputChannelStrip } from './channel-strip'

interface ClassicAudioPageInnerProps {
  sendCommand: SendCommandStrict
  currentState: LibAtemState.AtemState
}

export class ClassicAudioPageInner extends React.Component<ClassicAudioPageInnerProps> {
  constructor(props: ClassicAudioPageInnerProps) {
    super(props)

    // TODO - we should simply tell the server that we want audio levels, and it should intelligently subscribe/unsubscribe based on all clients
    this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerSendLevelsCommand', { SendLevels: true })
  }

  render() {
    const audioState = this.props.currentState.audio
    if (!audioState) {
      return <p>Classic Audio not supported</p>
    }

    const allAudioInputs: Array<[LibAtemEnums.AudioSource, LibAtemState.AudioState_InputState]> = Object.entries(
      audioState.inputs
    ).map(([k, v]) => [parseInt(k), v])
    const [audioInputs, videoInputs] = _.partition(
      allAudioInputs,
      ([x, v]) => v.properties.sourceType === LibAtemEnums.AudioSourceType.ExternalAudio
    )

    const channels2 = audioInputs.map(([id, input]) => {
      const tally = audioState.tally ? audioState.tally[id] ?? false : false

      return (
        <InputChannelStrip
          sendCommand={this.props.sendCommand}
          currentInput={input}
          id={id}
          audioTally={tally}
          monitors={audioState.monitorOutputs[0]}
          name={LibAtemEnums.AudioSource[id]}
        />
      )
    })

    const external = videoInputs.map(([idMain, input]) => {
      const tally = audioState.tally ? audioState.tally[idMain] ?? false : false

      const videoId = audioSourceToVideoSource(idMain)
      const inputProps = videoId ? this.props.currentState.settings.inputs[videoId] : undefined

      return (
        <InputChannelStrip
          sendCommand={this.props.sendCommand}
          currentInput={input}
          id={idMain}
          audioTally={tally}
          monitors={audioState.monitorOutputs[0]}
          name={inputProps?.properties?.shortName ?? 'Unknown'}
        />
      )
    })

    return (
      <div
        className="page-wrapper"
        style={{
          gridTemplateColumns:
            'repeat(' + external.length + ', 80px) 1px repeat(' + channels2.length + ', 80px) 1px 80px',
        }}
      >
        {external}
        <div></div>
        {channels2}
        <div></div>
        {/* <OutputAudioChannel
          device={this.props.device}
          signalR={this.props.signalR}
          id={'Master'}
          audioId={'Master'}
          audioTally={
            audioState.programOut.followFadeToBlack &&
            (this.props.currentState.mixEffects[0].fadeToBlack.status.inTransition ||
              this.props.currentState.mixEffects[0].fadeToBlack.status.isFullyBlack)
          }
          followFadeToBlack={audioState.programOut.followFadeToBlack}
          currentInput={audioState.programOut}
        ></OutputAudioChannel> */}
      </div>
    )
  }
}

// class OutputAudioChannel extends InputAudioChannel {
//   constructor(props: InputAudioChannelProps) {
//     super(props)
//     this.state = {
//       peaks: [
//         [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],
//         [-60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],
//       ],
//     }
//   }

//   shouldComponentUpdate(nextProps: InputAudioChannelProps) {
//     const differentInput = JSON.stringify(this.props.currentInput) !== JSON.stringify(nextProps.currentInput)
//     const differentFollow = JSON.stringify(this.props.followFadeToBlack) != JSON.stringify(nextProps.followFadeToBlack)
//     const differentTally = JSON.stringify(this.props.audioTally) != JSON.stringify(nextProps.audioTally)
//     // return differentName || differentInput || differentMonitors;
//     return differentInput || differentFollow || differentTally
//   }

//   getMasterTally() {
//     if (this.props.audioTally) {
//       return <div className="tally audio-flashit"></div>
//     } else {
//       return <div className="tally tally-red"></div>
//     }
//   }

//   getMasterButtons() {
//     if (this.props.followFadeToBlack) {
//       return (
//         <div className="button-holder">
//           <div
//             onClick={() =>
//               this.sendCommand('LibAtem.Commands.Audio.AudioMixerMasterSetCommand', {
//                 FollowFadeToBlack: false,
//                 Mask: 4,
//               })
//             }
//             className="button-inner full button-inner-selected"
//           >
//             AFV
//           </div>
//         </div>
//       )
//     } else {
//       return (
//         <div className="button-holder">
//           <div
//             onClick={() =>
//               this.sendCommand('LibAtem.Commands.Audio.AudioMixerMasterSetCommand', {
//                 FollowFadeToBlack: true,
//                 Mask: 4,
//               })
//             }
//             className="button-inner full "
//           >
//             AFV
//           </div>
//         </div>
//       )
//     }
//   }

//   render() {
//     var lowerButton = this.getMasterButtons()
//     var levels = this.props.currentInput.levels
//     this.updatePeaks(levels)
//     var tally = this.getMasterTally()
//     var topBarPeak = this.getTopBarPeak(levels)
//     var levelsLeft = this.getLevel(0, levels)
//     var levelsRight = this.getLevel(1, levels)
//     // peakBoxesLeft
//     // var levelsLeft = (this.getLevel(this.props.id, 0))
//     // var levelsRight = (this.getLevel(this.props.id, 1))
//     var floatingPeaksLeft = this.getFloatingPeaks(0, levels, 1)
//     var floatingPeaksRight = this.getFloatingPeaks(1, levels, 1)
//     var peakBoxesLeft = this.getPeakBoxes(0, levels, 1)
//     var peakBoxesRight = this.getPeakBoxes(1, levels, 1)

//     // var topBarPeak=(this.getTopBarPeak(this.props.id))

//     return (
//       <div className="channel" style={{ gridTemplateRows: '30px 10px 1fr 20px 60px' }}>
//         <div className="name-active">Master</div>
//         {tally}
//         <div className="slider-holder">
//           {topBarPeak}
//           <div className="scale">
//             <div className="scale-1">+6-</div>
//             <div className="scale-2">0-</div>
//             <div className="scale-3">-6-</div>
//             <div className="scale-4">-9-</div>
//             <div className="scale-5">-20-</div>
//             <div className="scale-6">-60-</div>
//           </div>
//           <div className="slider">
//             <div className="fake-slider"></div>
//             <Slider
//               tooltip={false}
//               max={1.1095}
//               min={0.3535}
//               step={0.001}
//               value={Math.pow(
//                 2,
//                 (this.props.currentInput.gain === '-Infinty' ? -60 : this.props.currentInput.gain) / 40
//               )}
//               orientation="vertical"
//               onChange={(e) => {
//                 this.sendCommand('LibAtem.Commands.Audio.AudioMixerMasterSetCommand', {
//                   Index: this.props.id,
//                   Gain: Math.log2(e) * 40,
//                   Mask: 1,
//                 })
//               }}
//             ></Slider>
//           </div>
//           <div className="level-holder">
//             <div className="level level-rainbow">
//               {levelsLeft}
//               {floatingPeaksLeft}
//             </div>
//             {peakBoxesLeft}
//             {peakBoxesRight}
//             <div className="level level-right level-rainbow">
//               {levelsRight}
//               {floatingPeaksRight}
//             </div>
//           </div>
//           <input
//             placeholder={this.props.currentInput.gain === '-Infinity' ? -60 : this.props.currentInput.gain.toFixed(2)}
//             className="gain-input"
//           ></input>
//         </div>

//         {lowerButton}
//       </div>
//     )
//   }
// }
