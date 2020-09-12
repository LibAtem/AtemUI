import React from 'react'
import { SendCommandStrict } from '../device-page-wrapper'
import { LibAtemState } from '../generated'
import remove from './assets/remove.svg'
import Dropzone, { DropzoneRef } from 'react-dropzone'
import Image from 'react-graceful-image'

export function getStillPreviewUrl(deviceId: string, hash: string): string {
  const hash2 = Buffer.from(hash, 'base64').toString('hex')
  return `/api/images/download/${deviceId}/${hash2}`
}

interface MediaPoolStillProps {
  sendCommand: SendCommandStrict

  deviceId: string
  index: number
  still: LibAtemState.MediaPoolState_StillState
  onAirPlayers: boolean[] // TODO
  inPlayers: boolean[]

  drag: (evt: any, index: number) => void
  changeImage: (input: any, id: number) => void
}
interface MediaPoolStillState {
  dragging: boolean
}
export class MediaPoolStill extends React.Component<MediaPoolStillProps, MediaPoolStillState> {
  private readonly _dropRef: React.RefObject<DropzoneRef>

  constructor(props: MediaPoolStillProps) {
    super(props)

    this._dropRef = React.createRef()

    this.state = {
      dragging: false,
    }

    this.dropFile = this.dropFile.bind(this)
  }

  private dropFile(acceptedFiles: File[]) {
    this.setState({ dragging: false })

    if (acceptedFiles && acceptedFiles.length === 1) {
      this.props.changeImage(acceptedFiles[0], this.props.index)
    }

    console.log(acceptedFiles)
  }
  render() {
    const { deviceId, index, still, inPlayers, onAirPlayers } = this.props

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
          <Dropzone
            ref={this._dropRef}
            onDrop={this.dropFile}
            onDragEnter={() => this.setState({ dragging: true })}
            onDragLeave={(e) => this.setState({ dragging: false })}
            accept="image/*"
            multiple={false}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: `inner ${this.state.dragging ? 'dragover' : ''}` })}>
                <div>
                  <input {...getInputProps()} />
                </div>
                <div className="inner-content text">{index + 1}</div>

                <div className="inner-content">
                  <svg xmlns="http://www.w3.org/2000/svg" className="ring-svg">
                    <rect width="100%" height="100%" fill="none" rx="100" ry="100" stroke="#2f2f2f" strokeWidth="3" />
                    {still.isUsed ? (
                      <rect
                        width="100%"
                        height="100%"
                        fill="none"
                        rx="100"
                        ry="100"
                        stroke="#D86704FF"
                        strokeWidth="3"
                        strokeDasharray="8,7.5"
                        strokeDashoffset="86"
                        strokeLinecap="butt"
                      />
                    ) : (
                      ''
                    )}
                  </svg>
                </div>

                {still.isUsed && still.hash ? (
                  <div className="inner-content">
                    <Image
                      src={getStillPreviewUrl(deviceId, still.hash)}
                      width="100%"
                      height="100%"
                      alt=""
                      placeholderColor="transparent"
                      retry={{ count: Number.MAX_SAFE_INTEGER, delay: 2 }}
                    />
                  </div>
                ) : (
                  ''
                )}

                <div className="drop-overlay">Drop to upload</div>
              </div>
            )}
          </Dropzone>
        </div>
        <div className="tile-label">{still.isUsed ? `${index + 1} ${still.filename}` : ''}</div>
      </div>
    )
  }
}
