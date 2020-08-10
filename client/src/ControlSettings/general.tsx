import React from 'react'
import { Container } from 'react-bootstrap'
import { SendCommandStrict } from '../device-page-wrapper'
import { RunButton, SelectInput, DecimalWithSliderInput } from '../components'
import { LibAtemState, LibAtemEnums, VideoModeInfoSet } from '../generated'

const SDI3GLevelOptions = [
  {
    id: LibAtemEnums.SDI3GOutputLevel.LevelA,
    label: 'Level A',
  },
  {
    id: LibAtemEnums.SDI3GOutputLevel.LevelB,
    label: 'Level B (Normal)',
  },
]

interface GeneralSettingsProps {
  sendCommand: SendCommandStrict
  currentState: LibAtemState.AtemState
}
export class GeneralSettings extends React.Component<GeneralSettingsProps> {
  render() {
    return (
      <Container className="maxW">
        <div className="atem-form center">
          <VideoSettings
            sendCommand={this.props.sendCommand}
            state={this.props.currentState.settings}
            info={this.props.currentState.info}
          />

          <hr />

          <MediaPoolSettings
            sendCommand={this.props.sendCommand}
            clips={this.props.currentState.mediaPool.clips}
            unassignedFrames={this.props.currentState.mediaPool.unassignedFrames}
            key={countMaxFrames(
              this.props.currentState.mediaPool.clips,
              this.props.currentState.mediaPool.unassignedFrames
            )}
          />

          <hr />

          <CameraControlSettings sendCommand={this.props.sendCommand} />
        </div>
      </Container>
    )
  }
}

interface VideoSettingsProps {
  sendCommand: SendCommandStrict
  state: LibAtemState.SettingsState
  info: LibAtemState.InfoState
}
interface VideoSettingsState {
  videoMode: LibAtemEnums.VideoMode | -1 | null
  multiViewMode: LibAtemEnums.VideoMode | null
  downConvertMode: LibAtemEnums.DownConvertMode | null
  sdi3GLevel: LibAtemEnums.SDI3GOutputLevel | null
}
class VideoSettings extends React.Component<VideoSettingsProps, VideoSettingsState> {
  constructor(props: VideoSettingsProps) {
    super(props)

    this.state = {
      videoMode: null,
      multiViewMode: null,
      downConvertMode: null,
      sdi3GLevel: null,
    }
  }
  render() {
    const hasValues =
      this.state.videoMode !== null ||
      this.state.multiViewMode !== null ||
      this.state.downConvertMode !== null ||
      this.state.sdi3GLevel !== null

    const currentVideoMode = this.state.videoMode ?? (this.props.state.autoVideoMode ? -1 : this.props.state.videoMode)
    const videoModes: Array<{
      id: LibAtemEnums.VideoMode | -1
      label: string
    }> = this.props.info.supportedVideoModes.map((mode, i) => ({
      id: mode.mode,
      label: VideoModeInfoSet[mode.mode]?.name ?? mode.mode,
    }))

    if (this.props.info.supportsAutoVideoMode) {
      const detectedMode = this.props.state.videoMode
      const detectedModeName = VideoModeInfoSet[detectedMode]?.name ?? detectedMode
      videoModes.unshift({
        id: -1,
        label: this.props.state.autoVideoMode ? `Auto Mode (${detectedModeName})` : 'Auto Mode',
      })
    }

    const videoModeInfo = this.props.info.supportedVideoModes.find((mode) => mode.mode === currentVideoMode)
    const multiviewerModes = videoModeInfo?.multiviewModes?.map((mode) => ({
      id: mode,
      label: VideoModeInfoSet[mode]?.name ?? mode,
    }))
    const downConvertModes = videoModeInfo?.downConvertModes?.map((mode) => ({
      id: (mode as any) as LibAtemEnums.DownConvertMode, // TODO - this is wrong..
      label: mode + '',
    }))

    return (
      <>
        <div className="atem-heading">Video</div>

        <SelectInput
          label="Set video standard to"
          value={currentVideoMode}
          options={videoModes}
          onChange={(v) => this.setState({ videoMode: v, multiViewMode: null, downConvertMode: null })}
        />

        {/* TODO - is this correct and the lib has it named wrong? */}
        <SelectInput
          label="Set multi view video standard to"
          disabled={!multiviewerModes || multiviewerModes.length <= 1}
          value={this.state.multiViewMode ?? ''}
          options={multiviewerModes ?? []}
          onChange={(v) => {
            if (v != '') {
              this.setState({ multiViewMode: v })
            }
          }}
        />

        {/* TODO - this bit doesnt make sense... */}
        <SelectInput
          label="Down convert as"
          disabled={!downConvertModes || downConvertModes.length <= 1}
          value={this.state.downConvertMode ?? this.props.state.downConvertMode}
          options={downConvertModes ?? []}
          onChange={(v) => this.setState({ downConvertMode: v })}
        />

        {/* TODO - this should be disabled for most modes... */}
        <SelectInput
          label="Set 3G SDI output to"
          value={this.state.sdi3GLevel ?? this.props.state.sDI3GLevel}
          options={SDI3GLevelOptions}
          onChange={(v) => this.setState({ sdi3GLevel: v })}
        />

        <div></div>
        <div>
          <RunButton
            disabled={!hasValues}
            label="Set"
            onClick={() => {
              // TODO - sendCommand
              console.log(this.state.videoMode)
              if (this.state.videoMode === -1) {
                this.props.sendCommand('LibAtem.Commands.Settings.AutoVideoModeCommand', {
                  Enabled: true,
                  Detected: false,
                })
              } else if (this.state.videoMode !== null) {
                if (this.props.info.supportsAutoVideoMode) {
                  this.props.sendCommand('LibAtem.Commands.Settings.AutoVideoModeCommand', {
                    Enabled: false,
                    Detected: false,
                  })
                }
                this.props.sendCommand('LibAtem.Commands.Settings.VideoModeSetCommand', {
                  VideoMode: this.state.videoMode,
                })
              }
              if (this.state.multiViewMode !== null) {
                // TODO - not implemented in protocol?
                // this.props.sendCommand('LibAtem.Commands.Settings.VideoModeSetCommand', {
                //   VideoMode: this.state.videoMode
                // })
              }
              if (this.state.downConvertMode !== null) {
                this.props.sendCommand('LibAtem.Commands.Settings.DownConvertModeSetCommand', {
                  DownConvertMode: this.state.downConvertMode,
                })
              }
              if (this.state.sdi3GLevel !== null) {
                this.props.sendCommand('LibAtem.Commands.Settings.SDI3GLevelOutputSetCommand', {
                  SDI3GOutputLevel: this.state.sdi3GLevel,
                })
              }

              this.setState({
                videoMode: null,
                multiViewMode: null,
                downConvertMode: null,
                sdi3GLevel: null,
              })
            }}
          />
          <RunButton
            disabled={!hasValues}
            label="Discard"
            onClick={() =>
              this.setState({
                videoMode: null,
                multiViewMode: null,
                downConvertMode: null,
                sdi3GLevel: null,
              })
            }
          />
        </div>
      </>
    )
  }
}

function countMaxFrames(clips: LibAtemState.MediaPoolState_ClipState[], unassigned: number) {
  let maxFrames = unassigned
  for (const clip of clips) {
    maxFrames += clip.maxFrames
  }
  return maxFrames
}

interface MediaPoolSettingsProps {
  sendCommand: SendCommandStrict
  clips: LibAtemState.MediaPoolState_ClipState[]
  unassignedFrames: number
}
interface MediaPoolSettingsState {
  frames: number[] | null
}
class MediaPoolSettings extends React.Component<MediaPoolSettingsProps, MediaPoolSettingsState> {
  constructor(props: MediaPoolSettingsProps) {
    super(props)

    this.state = {
      frames: null,
    }
  }
  render() {
    const maxFrames = countMaxFrames(this.props.clips, this.props.unassignedFrames)

    const clips: Array<Pick<LibAtemState.MediaPoolState_ClipState, 'maxFrames'>> =
      this.props.clips.length > 0
        ? this.props.clips
        : [
            {
              maxFrames: 0,
            },
            {
              maxFrames: 0,
            },
          ]

    return (
      <>
        <div className="atem-heading">Media Pool</div>
        {this.props.clips.length > 2 ? (
          <div className="atem-note">There are {maxFrames} frames to share between the clips</div>
        ) : (
          ''
        )}

        {clips.map((clip, id) => (
          <DecimalWithSliderInput
            label={`Clip ${id + 1} length`}
            step={1}
            min={0}
            max={maxFrames}
            value={this.state.frames ? this.state.frames[id] : clip.maxFrames}
            disabled={this.props.clips.length === 0}
            onChange={(newValue) => {
              if (this.props.clips.length === 2) {
                // As there is only 2, changing one will change the other
                const clampedValue = Math.max(Math.min(newValue, maxFrames), 0)
                const newFrames =
                  id === 0 ? [clampedValue, maxFrames - clampedValue] : [maxFrames - clampedValue, clampedValue]
                this.setState({ frames: newFrames })
              } else if (this.props.clips.length > 2) {
                // Here we have a pool of unassignedFrames, and changing one does not affect the others
                const newFrames = this.state.frames
                  ? [...this.state.frames]
                  : this.props.clips.map((cl) => cl.maxFrames)

                const otherInUse = newFrames.filter((v, i) => i !== id).reduce((a, b) => a + b, 0)
                const clampedValue = Math.max(Math.min(newValue, maxFrames - otherInUse), 0)

                newFrames[id] = clampedValue
                this.setState({ frames: newFrames })
              }
            }}
          />
        ))}

        <div></div>
        <div>
          <RunButton
            disabled={!this.state.frames}
            label="Set"
            onClick={() => {
              if (this.state.frames !== null) {
                this.props.sendCommand('LibAtem.Commands.Media.MediaPoolSettingsSetCommand', {
                  MaxFrames: this.state.frames,
                })
              }

              this.setState({ frames: null })
            }}
          />
          <RunButton disabled={!this.state.frames} label="Discard" onClick={() => this.setState({ frames: null })} />
        </div>
      </>
    )
  }
}

interface CameraControlSettingsProps {
  sendCommand: SendCommandStrict
  // state: LibAtemState.SettingsState
  // info: LibAtemState.InfoState
}
class CameraControlSettings extends React.Component<CameraControlSettingsProps> {
  render() {
    return (
      <>
        <div className="atem-heading">Camera Control</div>

        <div className="atem-note">TODO. This is a client side setting</div>

        {/* <SelectInput label="Camera control monitoring" value={0}  /> */}
      </>
    )
  }
}
