import React from 'react'
import { SendCommandStrict } from '../device-page-wrapper'
import { LibAtemState } from '../generated'
import remove from './assets/remove.svg'
import Dropzone, { DropzoneRef } from 'react-dropzone'

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

                <div className="drop-overlay">Drop to upload</div>

                {still.isUsed && still.hash ? (
                  <div
                    className="empty-inner"
                    /** TODO - how can we try and reload this image if it errors? is there any reason to? */
                    style={{ backgroundImage: `url(${getStillPreviewUrl(deviceId, still.hash)})` }}
                  ></div>
                ) : (
                  <div className="empty-inner">{index + 1}</div>
                )}

                {/* <input
              type="file"
              id="fileElem"
              multiple
              accept="image/*"
              onChange={(e) => this.props.changeImage(e.currentTarget, index)}
            ></input> */}
              </div>
            )}
          </Dropzone>
        </div>
        <div className="tile-label">{still.isUsed ? `${index + 1} ${still.filename}` : ''}</div>
      </div>
    )
  }
}
