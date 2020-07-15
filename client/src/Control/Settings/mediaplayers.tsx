import React from 'react'
import { SendCommandStrict } from '../../device-page-wrapper'
import { LibAtemState, LibAtemCommands, LibAtemEnums } from '../../generated'
import { SelectInput } from '../common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faPlay, faChevronRight, faRedo } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface MediaPlayerSettingsProps {
  sendCommand: SendCommandStrict
  mediaPlayers: LibAtemState.MediaPlayerState[]
  mediaPool: LibAtemState.MediaPoolState
}

interface MediaPlayerSettingsState {
  open: boolean
}

const clipOffset = 1 << 8

function MediaButton(props: {
  disabled: boolean | undefined
  active: boolean | undefined
  title: string
  icons: IconProp[]
  onClick: () => void
}) {
  let classes = 'media-button'
  if (props.disabled) {
    classes += ' disabled'
  } else if (props.active) {
    classes += ' active'
  }

  return (
    <div className={classes} title={props.title} onClick={() => (!props.disabled ? props.onClick() : null)}>
      {props.icons.map((ic, i) => (
        <FontAwesomeIcon key={i} icon={ic} />
      ))}
    </div>
  )
}

export class MediaPlayerSettings extends React.Component<MediaPlayerSettingsProps, MediaPlayerSettingsState> {
  constructor(props: MediaPlayerSettingsProps) {
    super(props)
    this.state = {
      open: false
    }
  }

  render() {
    if (this.props.mediaPlayers.length === 0) {
      return <div></div>
    }

    const mediaOptions: Array<{ id: number; label: string }> = []
    this.props.mediaPool.clips.forEach((clip, i) => {
      mediaOptions.push({
        id: i + clipOffset,
        label: `Clip ${i + 1}` + (clip.name ? `: ${clip.name}` : '')
      })
    })
    this.props.mediaPool.stills.forEach((still, i) => {
      mediaOptions.push({
        id: i,
        label: `Still ${i + 1}` + (still.filename ? `: ${still.filename}` : '')
      })
    })

    return (
      <div className="ss-submenu">
        <div
          className="ss-submenu-title"
          onClick={e => {
            this.setState({ open: !this.state.open })
          }}
        >
          Media Players
        </div>
        <div className="ss-submenu-box">
          {this.state.open ? (
            <div className="ss-mediaplayer-panel-holder">
              {this.props.mediaPlayers.map((mp, id) => {
                const isClip = mp.source.sourceType === LibAtemEnums.MediaPlayerSource.Clip
                const hasClip = isClip && this.props.mediaPool.clips[id]?.isUsed
                return (
                  <div key={id} className="ss-mediaplayer-panel">
                    <div className="buttons">
                      <div className="ss-label">MP{id + 1}</div>
                      <MediaButton
                        disabled={!hasClip}
                        active={mp.clipStatus?.atBeginning}
                        title="To Start"
                        icons={[faChevronLeft, faChevronLeft]}
                        onClick={() =>
                          this.props.sendCommand('LibAtem.Commands.Media.MediaPlayerClipStatusSetCommand', {
                            Mask: LibAtemCommands.Media_MediaPlayerClipStatusSetCommand_MaskFlags.ClipFrame,
                            Index: id,
                            ClipFrame: 0
                          })
                        }
                      />
                      <MediaButton
                        disabled={!hasClip}
                        active={mp.clipStatus?.playing}
                        title="Play/Pause"
                        icons={[faPlay]}
                        onClick={() =>
                          this.props.sendCommand('LibAtem.Commands.Media.MediaPlayerClipStatusSetCommand', {
                            Mask: LibAtemCommands.Media_MediaPlayerClipStatusSetCommand_MaskFlags.Playing,
                            Index: id,
                            Playing: !mp.clipStatus?.playing
                          })
                        }
                      />

                      <MediaButton
                        disabled={!hasClip || mp.clipStatus?.playing}
                        active={false}
                        title="Previous Frame"
                        icons={[faChevronLeft]}
                        onClick={() =>
                          this.props.sendCommand('LibAtem.Commands.Media.MediaPlayerClipStatusSetCommand', {
                            Mask: LibAtemCommands.Media_MediaPlayerClipStatusSetCommand_MaskFlags.ClipFrame,
                            Index: id,
                            ClipFrame: Math.max(0, (mp.clipStatus?.clipFrame ?? 1) - 1)
                          })
                        }
                      />
                      <MediaButton
                        disabled={!hasClip || mp.clipStatus?.playing}
                        active={false}
                        title="Next Frame"
                        icons={[faChevronRight]}
                        onClick={() =>
                          this.props.sendCommand('LibAtem.Commands.Media.MediaPlayerClipStatusSetCommand', {
                            Mask: LibAtemCommands.Media_MediaPlayerClipStatusSetCommand_MaskFlags.ClipFrame,
                            Index: id,
                            ClipFrame: (mp.clipStatus?.clipFrame ?? 0) + 1
                          })
                        }
                      />

                      <MediaButton
                        disabled={!hasClip}
                        active={mp.clipStatus?.loop}
                        title="Loop"
                        icons={[faRedo]}
                        onClick={() =>
                          this.props.sendCommand('LibAtem.Commands.Media.MediaPlayerClipStatusSetCommand', {
                            Mask: LibAtemCommands.Media_MediaPlayerClipStatusSetCommand_MaskFlags.Loop,
                            Index: id,
                            Loop: !mp.clipStatus?.loop
                          })
                        }
                      />
                    </div>
                    <SelectInput
                      label="Media"
                      value={isClip ? mp.source.sourceIndex + clipOffset : mp.source.sourceIndex}
                      options={mediaOptions}
                      onChange={v => {
                        if (v >= clipOffset) {
                          this.props.sendCommand('LibAtem.Commands.Media.MediaPlayerSourceSetCommand', {
                            Mask:
                              LibAtemCommands.Media_MediaPlayerSourceSetCommand_MaskFlags.SourceType |
                              LibAtemCommands.Media_MediaPlayerSourceSetCommand_MaskFlags.ClipIndex,
                            Index: id,
                            SourceType: LibAtemEnums.MediaPlayerSource.Clip,
                            ClipIndex: v % clipOffset
                          })
                        } else {
                          this.props.sendCommand('LibAtem.Commands.Media.MediaPlayerSourceSetCommand', {
                            Mask:
                              LibAtemCommands.Media_MediaPlayerSourceSetCommand_MaskFlags.SourceType |
                              LibAtemCommands.Media_MediaPlayerSourceSetCommand_MaskFlags.StillIndex,
                            Index: id,
                            SourceType: LibAtemEnums.MediaPlayerSource.Still,
                            StillIndex: v
                          })
                        }
                      }}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            undefined
          )}
        </div>
      </div>
    )
  }
}
