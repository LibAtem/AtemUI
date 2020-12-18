import React from 'react'
import { AtemDeviceInfo } from '../Devices/types'
import { GetDeviceId } from '../DeviceManager'
import './media.scss'
import { LibAtemEnums, LibAtemState } from '../generated'
import { ErrorBoundary } from '../errorBoundary'
import { DevicePageWrapper, sendCommandStrict } from '../device-page-wrapper'
import { getStillPreviewUrl, MediaPoolStill } from './tile'
import { CommandTypes } from '../generated/commands'
import Image from 'react-graceful-image'

export class UploadMediaPage extends DevicePageWrapper {
  renderContent(device: AtemDeviceInfo, signalR: signalR.HubConnection) {
    return (
      <ErrorBoundary key={this.context.activeDeviceId || ''}>
        <MediaPageInner device={device} currentState={this.context.currentState} signalR={signalR} />
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

  sendBase64ToServer(name: string, base64: string, index: number) {
    const device = this.props.device
    if (device) {
      const httpPost = new XMLHttpRequest()
      httpPost.onreadystatechange = (err) => {
        if (httpPost.readyState == 4 && httpPost.status == 200) {
          console.log(httpPost.responseText)
        } else {
          console.log(err)
        }
      }

      httpPost.open('POST', `/api/images/upload/${GetDeviceId(device)}/still/${index}`, true)
      httpPost.setRequestHeader('Content-Type', 'application/json')
      httpPost.send(JSON.stringify({ image: base64, name: name }))
    }
  }

  changeImage(file: File, index: number) {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      console.log('loaded', file, e)

      const result = e.target?.result
      if (typeof result === 'object' && result) {
        const b64 = Buffer.from(result).toString('base64')
        this.sendBase64ToServer(file.name, b64, index)
      }
    }

    reader.readAsArrayBuffer(file)
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
            <Image
              src={getStillPreviewUrl(deviceId, hash)}
              width="100%"
              height="100%"
              alt=""
              placeholderColor="transparent"
              retry={{ count: Number.MAX_SAFE_INTEGER, delay: 2 }}
            />
          ) : (
            <div className="emptyInner"></div>
          )}
        </div>
      </div>
    )
  }
}
