import React from 'react'
import { AtemDeviceInfo } from '../Devices/types'
import { GetDeviceId } from '../DeviceManager'
import { Container, Form, Row, Col } from 'react-bootstrap'
import Slider from 'react-rangeslider'
import { prettyDecimal } from '../util'
import { SendCommandStrict } from '../device-page-wrapper'
import { SelectInput } from '../Control/common/select'
import { RunButton } from '../Control/common'
import { LibAtemState, LibAtemEnums, VideoModeInfoSet } from '../generated'

const SDI3GLevelOptions = [
  {
    id: LibAtemEnums.SDI3GOutputLevel.LevelA,
    label: 'Level A'
  },
  {
    id: LibAtemEnums.SDI3GOutputLevel.LevelB,
    label: 'Level B (Normal)'
  }
]

interface GeneralSettingsProps {
  sendCommand: SendCommandStrict
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: any
  currentProfile: any
}
interface GeneralSettingsState {
  clip1Length: number
  clip2Length: number
}
export class GeneralSettings extends React.Component<GeneralSettingsProps, GeneralSettingsState> {
  constructor(props: GeneralSettingsProps) {
    super(props)
    this.state = {
      clip1Length: props.currentState.mediaPool.clips[0].maxFrames,
      clip2Length: props.currentState.mediaPool.clips[1].maxFrames
    }
  }

  private sendCommand(command: string, value: any) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then(res => {
          console.log(value)
          console.log('ManualCommands: sent')
          console.log(command)
        })
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }

  render() {
    const { currentState, currentProfile } = this.props

    var maxFrames = 0
    for (var i = 0; i < currentState.mediaPool.clips.length; i++) {
      maxFrames += currentState.mediaPool.clips[i].maxFrames
    }
    return (
      <Container className="maxW">
        <div className="atem-form center">
          <VideoSettings
            sendCommand={this.props.sendCommand}
            state={this.props.currentState.settings}
            info={this.props.currentState.info}
          />

          <hr />

          <MediaPoolSettings sendCommand={this.props.sendCommand} clips={this.props.currentState.mediaPool.clips} />

          <hr />

          <CameraControlSettings sendCommand={this.props.sendCommand} />
        </div>

        <h3>Media Pool</h3>
        <small id="emailHelp" className="form-text text-muted">
          There are {maxFrames} frames to share between the clips
        </small>

        <Form.Group as={Row}>
          <Form.Label column sm="4">
            Clip 1 Length:
          </Form.Label>
          <Col sm="6">
            <Slider
              key={0}
              min={0}
              max={maxFrames}
              step={1}
              // labels={"horizontalLabels"}
              onChange={v => {
                this.setState({
                  clip1Length: v,
                  clip2Length: maxFrames - v
                })
              }}
              value={this.state.clip1Length}
              // defaultValue={0}
              format={prettyDecimal}
            />
            <br key={1} />
          </Col>
          <Col sm="2">
            <Form.Control
              key={2}
              type="number"
              placeholder={''}
              min={0}
              max={maxFrames}
              value={prettyDecimal(this.state.clip1Length)}
              onChange={(e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.currentTarget.value) {
                  this.setState({
                    clip1Length: parseInt(e.currentTarget.value),
                    clip2Length: maxFrames - parseInt(e.currentTarget.value)
                  })
                }
              }}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="4">
            Clip 2 Length:
          </Form.Label>
          <Col sm="6">
            <Slider
              key={0}
              min={0}
              max={maxFrames}
              step={1}
              onChange={v => {
                this.setState({
                  clip2Length: v,
                  clip1Length: maxFrames - v
                })
              }}
              value={this.state.clip2Length}
              format={prettyDecimal}
            />
            <br key={1} />
          </Col>
          <Col sm="2">
            <Form.Control
              key={2}
              type="number"
              placeholder={''}
              min={0}
              max={maxFrames}
              value={prettyDecimal(this.state.clip2Length)}
              onChange={(e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                if (e.currentTarget.value) {
                  this.setState({
                    clip2Length: parseInt(e.currentTarget.value),
                    clip1Length: maxFrames - parseInt(e.currentTarget.value)
                  })
                }
              }}
            />
          </Col>
        </Form.Group>
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
  videoMode: LibAtemEnums.VideoMode | null
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
      sdi3GLevel: null
    }
  }
  render() {
    const hasValues =
      this.state.videoMode !== null ||
      this.state.multiViewMode !== null ||
      this.state.downConvertMode !== null ||
      this.state.sdi3GLevel !== null

    const currentVideoMode = this.state.videoMode ?? this.props.state.videoMode
    const videoModes = this.props.info.supportedVideoModes.map((mode, i) => ({
      id: mode.mode,
      label: VideoModeInfoSet[mode.mode]?.name ?? mode.mode
    }))

    const videoModeInfo = this.props.info.supportedVideoModes.find(mode => mode.mode === currentVideoMode)
    const multiviewerModes = videoModeInfo?.multiviewModes?.map(mode => ({
      id: mode,
      label: VideoModeInfoSet[mode]?.name ?? mode
    }))
    const downConvertModes = videoModeInfo?.downConvertModes?.map(mode => ({
      id: (mode as any) as LibAtemEnums.DownConvertMode, // TODO - this is wrong..
      label: mode + ''
    }))

    return (
      <>
        <div className="atem-heading">Video</div>

        <SelectInput
          label="Set video standard to"
          value={currentVideoMode}
          options={videoModes}
          onChange={v => this.setState({ videoMode: v, multiViewMode: null, downConvertMode: null })}
        />

        {/* TODO - is this correct and the lib has it named wrong? */}
        <SelectInput
          label="Set multi view video standard to"
          disabled={!multiviewerModes || multiviewerModes.length <= 1}
          value={this.state.multiViewMode ?? this.props.state.downConvertVideoMode}
          options={multiviewerModes ?? []}
          onChange={v => this.setState({ multiViewMode: v })}
        />

        {/* TODO - this bit doesnt make sense... */}
        <SelectInput
          label="Down convert as"
          disabled={!downConvertModes || downConvertModes.length <= 1}
          value={this.state.downConvertMode ?? this.props.state.downConvertMode}
          options={downConvertModes ?? []}
          onChange={v => this.setState({ downConvertMode: v })}
        />

        {/* TODO - this should be disabled for most modes... */}
        <SelectInput
          label="Set 3G SDI output to"
          value={this.state.sdi3GLevel ?? this.props.state.sDI3GLevel}
          options={SDI3GLevelOptions}
          onChange={v => this.setState({ sdi3GLevel: v })}
        />

        <div></div>
        <div>
          <RunButton
            disabled={!hasValues}
            label="Set"
            onClick={() => {
              // TODO - sendCommand
              if (this.state.videoMode !== null) {
                this.props.sendCommand('LibAtem.Commands.Settings.VideoModeSetCommand', {
                  VideoMode: this.state.videoMode
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
                  DownConvertMode: this.state.downConvertMode
                })
              }
              if (this.state.sdi3GLevel !== null) {
                this.props.sendCommand('LibAtem.Commands.Settings.SDI3GLevelOutputSetCommand', {
                  SDI3GOutputLevel: this.state.sdi3GLevel
                })
              }

              this.setState({
                videoMode: null,
                multiViewMode: null,
                downConvertMode: null,
                sdi3GLevel: null
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
                sdi3GLevel: null
              })
            }
          />
        </div>
      </>
    )
  }
}

interface MediaPoolSettingsProps {
  sendCommand: SendCommandStrict
  clips: LibAtemState.MediaPoolState_ClipState[]
  // state: LibAtemState.SettingsState
  // info: LibAtemState.InfoState
}
class MediaPoolSettings extends React.Component<MediaPoolSettingsProps> {
  render() {
    let maxFrames = 0
    for (const clip of this.props.clips) {
      maxFrames += clip.maxFrames
    }

    return (
      <>
        <div className="atem-heading">Media Pool</div>
        <div className="atem-note">There are {maxFrames} frames to share between the clips</div>

        {this.props.clips.map((clip, i) => (
          <>
            <div key={`label${i}`} className="atem-label">
              Clip {i + 1} length:
            </div>
            <div key={`slider${i}`}>TODO</div>
          </>
        ))}
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

        <div className="atem-note">TODO</div>
      </>
    )
  }
}
