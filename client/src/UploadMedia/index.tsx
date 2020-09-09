import React, { RefObject } from 'react'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import remove from './assets/remove.svg'
import './media.scss'
import { LibAtemEnums, LibAtemState } from '../generated'
import { ErrorBoundary } from '../errorBoundary'
import { SendCommandStrict } from '../device-page-wrapper'

export class UploadMediaPage extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>

  fileInput = React.createRef() as RefObject<HTMLInputElement>
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
  hasConnected: boolean
  images: any
}
class MediaPageInner extends React.Component<MediaPageInnerProps, MediaPageInnerState> {
  constructor(props: MediaPageInnerProps) {
    super(props)
    this.state = {
      hasConnected: this.props.device.connected,
      images: {} as any,
    }

    this.drop = this.drop.bind(this)
    this.allowDrop = this.allowDrop.bind(this)
    this.drag = this.drag.bind(this)
    this.changeImage = this.changeImage.bind(this)
    this.sendCommand = this.sendCommand.bind(this)
  }

  // This function accepts three arguments, the URL of the image to be
  // converted, the mime type of the Base64 image to be output, and a
  // callback function that will be called with the data URL as its argument
  // once processing is complete

  convertToBase64 = function (url: string, imagetype: string, callback: any) {
    var img = document.createElement('IMG') as HTMLImageElement,
      canvas = document.createElement('CANVAS') as HTMLCanvasElement,
      ctx = canvas.getContext('2d'),
      data = ''
    console.log('waaaa')
    // Set the crossOrigin property of the image element to 'Anonymous',
    // allowing us to load images from other domains so long as that domain
    // has cross-origin headers properly set

    img.crossOrigin = 'Anonymous'

    // Because image loading is asynchronous, we define an event listening function that will be called when the image has been loaded
    img.onload = function () {
      console.log('aa12')
      // When the image is loaded, this function is called with the image object as its context or 'this' value
      if (ctx) {
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0)
        data = canvas.toDataURL(imagetype)
        callback(data)
      }
    }

    // We set the source of the image tag to start loading its data. We define
    // the event listener first, so that if the image has already been loaded
    // on the page or is cached the event listener will still fire

    img.src = url
    console.log(img)
  }
  onDrop: any

  // Here we define the function that will send the request to the server.
  // It will accept the image name, and the base64 data as arguments

  sendBase64ToServer(name: string, base64: string, index: any) {
    var device = this.props.device
    if (device) {
      var id = GetDeviceId(device)

      var httpPost = new XMLHttpRequest(),
        path = 'http://127.0.0.1:5000/api2/' + id + '/' + name,
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

  // This wrapper function will accept the name of the image, the url, and the
  // image type and perform the request

  uploadImage(src: string, name: string, type: string) {
    var parentThis = this

    this.convertToBase64(src, type, function (data: string) {
      console.log('button Pressed')
      parentThis.sendBase64ToServer(name, data, 0)
    })
  }

  //   var fileTag = document.getElementById("filetag"),
  //   preview = document.getElementById("preview");

  // fileTag.addEventListener("change", function() {
  //   changeImage(this);
  // });

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

  getImages() {
    if (this.props.currentState) {
      for (var i in this.props.currentState.mediaPool.stills) {
        if (this.props.currentState.mediaPool.stills[i].isUsed) {
          if (!this.state.images[this.props.currentState.mediaPool.stills[i].hash as any]) {
            console.log('image not found:' + this.props.currentState.mediaPool.stills[i].hash)
            this.getImage(this.props.currentState.mediaPool.stills[i].hash as any)
          }
        }
      }
    }
  }

  getImage(name: string) {
    var device = this.props.device
    if (device) {
      var id = GetDeviceId(device)
      var parentThis = this
      var httpGet = new XMLHttpRequest(),
        path = 'http://127.0.0.1:5000/api2/download/' + id,
        data = JSON.stringify({ hash: name })

      httpGet.onreadystatechange = function (err) {
        if (httpGet.readyState == 4 && httpGet.status == 200) {
          // console.log(httpGet.responseText);
          if (httpGet.responseText != 'Not Downloaded' && httpGet.responseText != 'Not Present') {
            console.log('yes')
            const newImages = { ...parentThis.state.images }
            newImages[name] = httpGet.responseText
            parentThis.setState({ images: newImages })
            // parentThis.state.images[name] = httpGet.responseText
            // console.log(parentThis.state.images)
          } else if (httpGet.responseText == 'Not Downloaded') {
            console.log('not downloaded')
          } else if (httpGet.responseText != 'Not Present') {
            console.log('not present')
          } else {
            console.log('No')
          }
        } else {
          // console.log(err);
        }
      }

      httpGet.open('POST', path, true)
      httpGet.setRequestHeader('Content-Type', 'application/json')
      httpGet.send(data)
    }
  }

  public sendCommand(command: string, value: any) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then((res) => {
          console.log(value)
          console.log('ManualCommands: sent')
          console.log(command)
        })
        .catch((e) => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
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

  // Call the function with the provided values. The mime type could also be png
  // or webp

  /* <div>
          <input onChange={(e)=>this.changeImage(e.currentTarget)}type="file" id="filetag"></input>
          <img src="" id="preview"></img>
          </div>
          {imgs} */

  //uploadImage(imgsrc, name, 'image/jpeg')
  /* <button onClick={()=>this.uploadImage("/img1.png", "image", 'image/jpeg')}>UP</button> */
  render() {
    if (!this.props.currentState) {
      return <p>Waiting for state</p>
    }

    this.getImages() // TODO - this is a hack

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

    return (
      <div id="mediaContainer">
        <div id="pool-list">
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
                  still={still}
                  onAirPlayers={onAirPlayers}
                  inPlayers={inPlayers}
                  images={this.state.images}
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
                index={index}
                player={mp}
                pool={mediaPool}
                isLive={onAirPlayers[index] ?? false}
                images={this.state.images}
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

interface MediaPoolStillProps {
  sendCommand: SendCommandStrict

  index: number
  still: LibAtemState.MediaPoolState_StillState
  onAirPlayers: boolean[] // TODO
  inPlayers: boolean[]
  images: any

  drag: (evt: any, index: number) => void
  changeImage: (input: any, id: number) => void
}
class MediaPoolStill extends React.Component<MediaPoolStillProps> {
  render() {
    const { index, still, images, inPlayers, onAirPlayers } = this.props

    const mp: React.ReactNode[] = []

    return (
      <div className="pool-tile">
        <div className="player-icons">
          {inPlayers.map((active, index) => {
            if (active) {
              const onAir = onAirPlayers[index] ?? false
              return (
                <div key={index} className={onAir ? 'program' : ''}>
                  {index + 1}
                </div>
              )
            } else {
              return ''
            }
          })}
        </div>
        {still.isUsed && (
          <div
            className="x"
            onClick={() =>
              this.props.sendCommand('LibAtem.Commands.Media.MediaPoolClearStillCommand', { Index: index })
            }
          >
            <img className="remove" src={remove}></img>
          </div>
        )}
        {mp}
        <div className="size" onDragStart={(event) => this.props.drag(event, index)} draggable={true}>
          <div className="inner">
            <div className="emptyInner">{index + 1}</div>
            {/* <img
                className="drag"
                onDragStart={(event) => this.props.drag(event, Number(index))}
                draggable={true}
                src={'data:image/jpg;base64,' + images[still.hash as any]}
                width="100%"
              ></img> */}
            <input
              type="file"
              id="fileElem"
              multiple
              accept="image/*"
              onChange={(e) => this.props.changeImage(e.currentTarget, index)}
            ></input>
          </div>
        </div>
        <div className="tile-label">{still.isUsed ? `${index + 1} ${still.filename}` : ''}</div>
      </div>
    )
  }
}

interface MediaPlayerProps {
  index: number
  player: LibAtemState.MediaPlayerState
  pool: LibAtemState.MediaPoolState
  isLive: boolean
  images: any

  drop: (evt: any, index: number) => void
  allowDrop: (evt: any) => void
}
class MediaPlayer extends React.Component<MediaPlayerProps> {
  render() {
    const { index, player, pool, images, isLive } = this.props

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
          {hash && images[hash] ? (
            <img src={'data:image/jpg;base64,' + images[hash]} width="100%"></img>
          ) : (
            <div className="emptyInner"></div>
          )}
        </div>
      </div>
    )
  }
}
