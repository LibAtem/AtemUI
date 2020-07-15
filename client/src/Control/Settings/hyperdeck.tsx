import React from 'react'
import { SendCommandStrict } from '../../device-page-wrapper'

interface HyperdeckSettingsProps {
  sendCommand: SendCommandStrict
  //   mediaPlayers: LibAtemState.MediaPlayerState[]
  //   mediaPool: LibAtemState.MediaPoolState
}

interface HyperdeckSettingsState {
  open: boolean
}

export class HyperdeckSettings extends React.Component<HyperdeckSettingsProps, HyperdeckSettingsState> {
  constructor(props: HyperdeckSettingsProps) {
    super(props)
    this.state = {
      open: false
    }
  }

  render() {
    return (
      <div className="ss-submenu">
        <div
          className="ss-submenu-title"
          onClick={e => {
            this.setState({ open: !this.state.open })
          }}
        >
          HyperDecks
        </div>
        <div className="ss-submenu-box">
          {this.state.open ? (
            <div className="ss-mediaplayer-panel-holder">
              <div className="atem-label">Not implemented</div>
            </div>
          ) : (
            undefined
          )}
        </div>
      </div>
    )
  }
}
