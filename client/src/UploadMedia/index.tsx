import React from 'react'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import './media.scss'
import { LibAtemEnums, LibAtemState } from '../generated'
import { ErrorBoundary } from '../errorBoundary'
import { sendCommandStrict } from '../device-page-wrapper'
import { getStillPreviewUrl, MediaPoolStill } from './tile'
import { CommandTypes } from '../generated/commands'

export class UploadMediaPage extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>

  static contextType = DeviceManagerContext

  render() {
    const device = GetActiveDevice(this.context)

    return (
      <ErrorBoundary key={this.context.activeDeviceId || ''}>
        {device && this.context.signalR ? (
          <MediaPageInner
            key={this.context.activeDeviceId || ''}
            device={device}
            currentState={this.context.currentState}
            signalR={this.context.signalR}
          />
        ) : (
          <p>No device selected</p>
        )}
      </ErrorBoundary>
    )
  }
}

interface MediaPageInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
  currentState: LibAtemState.AtemState | null
}
interface MediaPageInnerState {
  dragging: boolean
}
class MediaPageInner extends React.Component<MediaPageInnerProps, MediaPageInnerState> {
  constructor(props: MediaPageInnerProps) {
    super(props)
    this.state = {
      dragging: false,
    }

    this.drop = this.drop.bind(this)
    this.allowDrop = this.allowDrop.bind(this)
    this.drag = this.drag.bind(this)
    this.changeImage = this.changeImage.bind(this)
    this.sendCommand = this.sendCommand.bind(this)
  }

  // Here we define the function that will send the request to the server.
  // It will accept the image name, and the base64 data as arguments

  sendBase64ToServer(name: string, base64: string, index: any) {
    var device = this.props.device
    if (device) {
      var id = GetDeviceId(device)

      var httpPost = new XMLHttpRequest(),
        path = `/api/images/upload/${id}/${name}`,
        data = JSON.stringify({ image: base64, index: index })
      httpPost.onreadystatechange = function (err) {
        if (httpPost.readyState == 4 && httpPost.status == 200) {
          console.log(httpPost.responseText)
        } else {
          console.log(err)
        }
      }
      // Set the content type of the request to json since that's what's being sent

      // httpPost.setHeader('Content-Type', 'application/json');
      httpPost.open('POST', path, true)
      httpPost.setRequestHeader('Content-Type', 'application/json')
      httpPost.send(data)
    }
  }

  changeImage(input: any, id: any) {
    var reader
    var parentThis = this
    console.log(input)
    if (input.files && input.files[0]) {
      reader = new FileReader()

      reader.onload = function (e: any) {
        var result = e.originalTarget.result
        if (result) {
          console.log(result)
          parentThis.sendBase64ToServer('Test', result, id)
        }
        // console.log(result.readAsDataURL())
        // parentThis.sendBase64ToServer("Test",e.originalTarget.result)
      }

      reader.readAsDataURL(input.files[0])
    }
  }

  private sendCommand(...args: CommandTypes) {
    sendCommandStrict(this.props, ...args)
  }

  allowDrop(ev: any) {
    ev.preventDefault()
  }

  drop(ev: any, mp: number) {
    ev.preventDefault()
    var data = ev.dataTransfer.getData('id')
    console.log(data)
    this.sendCommand('LibAtem.Commands.Media.MediaPlayerSourceSetCommand', {
      Index: mp,
      Mask: 3,
      SourceType: 1,
      StillIndex: data,
    })
    //ev.target.appendChild(document.getElementById(data));
  }

  drag(ev: any, id: number) {
    ev.dataTransfer.setData('id', id)
  }

  render() {
    if (!this.props.currentState) {
      return <p>Waiting for state</p>
    }

    const {
      mediaPlayers,
      mediaPool,
      settings: { inputs },
    } = this.props.currentState

    const mediaInputs = Object.entries(inputs)
      .filter(
        ([id, inp]) =>
          inp &&
          (inp.properties.internalPortType === LibAtemEnums.InternalPortType.MediaPlayerFill ||
            inp.properties.internalPortType === LibAtemEnums.InternalPortType.MediaPlayerKey)
      )
      .map(([id, inp]) => ({ id: Number(id), tally: inp.tally }))

    const onAirPlayers = mediaPlayers.map((mp, index) => {
      const theseInputs = mediaInputs.filter(
        (v) => Math.floor((v.id - LibAtemEnums.VideoSource.MediaPlayer1) / 10) === index
      )
      return !!theseInputs.find((v) => v.tally.programTally)
    })

    const deviceId = GetDeviceId(this.props.device)

    return (
      <div id="mediaContainer">
        <div
          id="pool-list"
          // className={this.state.dragging ? 'dragover' : ''}
          // onDragEnter={() => this.setState({ dragging: true })}
          // onDragLeave={() =>this.setState({ dragging: false })}
        >
          {/* TODO - clips */}

          <div className="media-heading">Stills</div>
          <div className="stills-grid">
            {mediaPool.stills.map((still, index) => {
              const inPlayers = mediaPlayers.map(
                (mp) => mp.source.sourceType === LibAtemEnums.MediaPlayerSource.Still && mp.source.sourceIndex === index
              )
              return (
                <MediaPoolStill
                  sendCommand={this.sendCommand}
                  key={index}
                  index={index}
                  deviceId={deviceId}
                  still={still}
                  onAirPlayers={onAirPlayers}
                  inPlayers={inPlayers}
                  drag={this.drag}
                  changeImage={this.changeImage}
                />
              )
            })}
          </div>
        </div>

        <div id="player-list">
          <div className="media-heading">Media Players</div>
          {mediaPlayers.map((mp, index) => {
            return (
              <MediaPlayer
                key={index}
                deviceId={deviceId}
                index={index}
                player={mp}
                pool={mediaPool}
                isLive={onAirPlayers[index] ?? false}
                drop={this.drop}
                allowDrop={this.allowDrop}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

interface MediaPlayerProps {
  deviceId: string
  index: number
  player: LibAtemState.MediaPlayerState
  pool: LibAtemState.MediaPoolState
  isLive: boolean

  drop: (evt: any, index: number) => void
  allowDrop: (evt: any) => void
}
class MediaPlayer extends React.Component<MediaPlayerProps> {
  render() {
    const { index, player, pool, deviceId, isLive } = this.props

    let name = 'No media assigned'
    let hash: string | undefined
    let source = ''

    switch (player.source.sourceType) {
      case LibAtemEnums.MediaPlayerSource.Still: {
        source = `Still ${player.source.sourceIndex + 1}`

        const still = pool.stills[player.source.sourceIndex]
        if (still?.isUsed) {
          name = still.filename ?? ''
          hash = still.hash
        }
        break
      }
      case LibAtemEnums.MediaPlayerSource.Clip: {
        source = `Clip ${player.source.sourceIndex + 1}`

        const clip = pool.clips[player.source.sourceIndex]
        if (clip?.isUsed) {
          name = clip.name ?? ''
          const frame = clip.frames[0]
          hash = frame?.hash
        }
        break
      }
    }

    return (
      <div className="media-player">
        <div className={`index ${isLive ? 'live' : ''}`}>
          <div>{index + 1}</div>
        </div>
        <div className="heading">{name}</div>
        <div className="source">{source}</div>
        <div
          className="media-player-inner"
          onDrop={(event) => this.props.drop(event, index)}
          onDragOver={(event) => this.props.allowDrop(event)}
        >
          {hash ? (
            <img src={getStillPreviewUrl(deviceId, hash)} width="100%"></img>
          ) : (
            <div className="emptyInner"></div>
          )}
        </div>
      </div>
    )
  }
}
