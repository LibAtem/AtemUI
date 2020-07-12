import React, { RefObject } from 'react'

import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import remove from './assets/remove.svg'
import './media.css'
import { LibAtemState } from '../generated'

export class UploadMediaPage extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>

  fileInput = React.createRef() as RefObject<HTMLInputElement>
  static contextType = DeviceManagerContext

  render() {
    const device = GetActiveDevice(this.context)

    return (
      <div>
        {device ? (
          <MediaPageInner
            key={this.context.activeDeviceId || ''}
            device={device}
            currentState={this.context.currentState}
            signalR={this.context.signalR}
          />
        ) : (
          <p>No device selected</p>
        )}
      </div>
    )
  }
}

interface MediaPageInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
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
      images: {} as any
    }
  }

  // This function accepts three arguments, the URL of the image to be
  // converted, the mime type of the Base64 image to be output, and a
  // callback function that will be called with the data URL as its argument
  // once processing is complete

  convertToBase64 = function(url: string, imagetype: string, callback: any) {
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
    img.onload = function() {
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
      httpPost.onreadystatechange = function(err) {
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

    this.convertToBase64(src, type, function(data: string) {
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

      reader.onload = function(e: any) {
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

      httpGet.onreadystatechange = function(err) {
        if (httpGet.readyState == 4 && httpGet.status == 200) {
          // console.log(httpGet.responseText);
          if (httpGet.responseText != 'Not Downloaded' && httpGet.responseText != 'Not Present') {
            console.log('yes')
            parentThis.state.images[name] = httpGet.responseText
            console.log(parentThis.state.images)
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
      StillIndex: data
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
    var imgs = []
    for (var i0 in this.props.currentState.mediaPool.stills) {
      const i = Number(i0)
      const mp = []
      if (
        this.props.currentState.mediaPlayers[0].source.sourceType == 1 &&
        this.props.currentState.mediaPlayers[0].source.sourceIndex == i &&
        this.props.currentState.mediaPlayers[1].source.sourceType == 1 &&
        this.props.currentState.mediaPlayers[1].source.sourceIndex == i
      ) {
        if (this.props.currentState.mixEffects[0].sources.program == 3010) {
          mp.push(<div className="mp1 mp-program">1</div>)
        } else if (this.props.currentState.mixEffects[0].sources.preview == 3010) {
          mp.push(<div className="mp1 mp-preview">1</div>)
        } else {
          mp.push(<div className="mp1">1</div>)
        }
        if (this.props.currentState.mixEffects[0].sources.program == 3020) {
          mp.push(<div className="mp2 mp-program">2</div>)
        } else if (this.props.currentState.mixEffects[0].sources.preview == 3020) {
          mp.push(<div className="mp2 mp-preview">2</div>)
        } else {
          mp.push(<div className="mp2">2</div>)
        }
      } else if (
        this.props.currentState.mediaPlayers[0].source.sourceType == 1 &&
        this.props.currentState.mediaPlayers[0].source.sourceIndex == i
      ) {
        if (this.props.currentState.mixEffects[0].sources.program == 3010) {
          mp.push(<div className="mp1 mp-program">1</div>)
        } else if (this.props.currentState.mixEffects[0].sources.preview == 3010) {
          mp.push(<div className="mp1 mp-preview">1</div>)
        } else {
          mp.push(<div className="mp1">1</div>)
        }
      } else if (
        this.props.currentState.mediaPlayers[1].source.sourceType == 1 &&
        this.props.currentState.mediaPlayers[1].source.sourceIndex == i
      ) {
        if (this.props.currentState.mixEffects[0].sources.program == 3020) {
          mp.push(<div className="mp1 mp-program">2</div>)
        } else if (this.props.currentState.mixEffects[0].sources.preview == 3020) {
          mp.push(<div className="mp1 mp-preview">2</div>)
        } else {
          mp.push(<div className="mp1">2</div>)
        }
      }
      if (this.props.currentState.mediaPool.stills[i].isUsed) {
        if (this.state.images[this.props.currentState.mediaPool.stills[i].hash as any]) {
          const x = i

          imgs.push(
            <div className="image">
              <div
                className="x"
                onClick={() => this.sendCommand('LibAtem.Commands.Media.MediaPoolClearStillCommand', { Index: x })}
              >
                <img className="remove" src={remove}></img>
              </div>
              {mp}
              <div className="inner">
                <img
                  className="drag"
                  onDragStart={event => this.drag(event, Number(x))}
                  draggable={true}
                  src={
                    'data:image/jpg;base64,' +
                    this.state.images[this.props.currentState.mediaPool.stills[i].hash as any]
                  }
                  width="100%"
                ></img>
              </div>
              <div className="nameTag">
                {Number(i) + 1 + '  ' + this.props.currentState.mediaPool.stills[i].filename}
              </div>
            </div>
          )
        }
      } else {
        const x = i
        imgs.push(
          <div className="image" onDragStart={event => this.drag(event, Number(x))} draggable={true}>
            {mp}
            <div className="inner">
              <div className="emptyInner">{Number(i) + 1}</div>
              <input
                type="file"
                id="fileElem"
                multiple
                accept="image/*"
                onChange={e => this.changeImage(e.currentTarget, x)}
              ></input>
            </div>
          </div>
        )
      }
    }

    var mediaPlayers = []
    for (var i in this.props.currentState.mediaPlayers) {
      const x = i
      if (
        this.props.currentState.mediaPlayers[i].source.sourceType == 1 &&
        this.props.currentState.mediaPool.stills[this.props.currentState.mediaPlayers[i].source.sourceIndex].isUsed &&
        this.state.images[
          this.props.currentState.mediaPool.stills[this.props.currentState.mediaPlayers[i].source.sourceIndex]
            .hash as any
        ]
      ) {
        mediaPlayers.push(
          <div className="current">
            <div className="heading">
              {
                this.props.currentState.mediaPool.stills[this.props.currentState.mediaPlayers[i].source.sourceIndex]
                  .filename
              }
            </div>
            <div
              className="current-inner"
              onDrop={event => this.drop(event, parseInt(x))}
              onDragOver={event => this.allowDrop(event)}
            >
              <img
                src={
                  'data:image/jpg;base64,' +
                  this.state.images[
                    this.props.currentState.mediaPool.stills[this.props.currentState.mediaPlayers[i].source.sourceIndex]
                      .hash as any
                  ]
                }
                width="100%"
              ></img>
            </div>
          </div>
        )
      } else {
        mediaPlayers.push(
          <div className="current">
            <div className="heading">No Media Assigned</div>
            <div
              className="current-inner"
              onDrop={event => this.drop(event, parseInt(x))}
              onDragOver={event => this.allowDrop(event)}
            >
              <div className="emptyInner lower">
                {Number(this.props.currentState.mediaPlayers[i].source.sourceIndex) + 1}
              </div>
            </div>
          </div>
        )
      }
    }

    return (
      <div id="mediaContainer">
        <div id="clips">{imgs}</div>

        <div id="current">
          <div id="media-heading">Media Players</div>
          {mediaPlayers}
        </div>
      </div>
    )
  }
}
