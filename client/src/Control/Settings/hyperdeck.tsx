import React from 'react'
import { SendCommandStrict } from '../../device-page-wrapper'
import { StickyPanelBase } from './base'

interface HyperdeckSettingsProps {
  sendCommand: SendCommandStrict
}

interface HyperdeckSettingsState {
  open: boolean
}

export class HyperdeckSettings extends StickyPanelBase<HyperdeckSettingsProps, HyperdeckSettingsState> {
  constructor(props: HyperdeckSettingsProps) {
    super(props, `control.media.hyperdeck`)

    this.trackSessionValues('open')

    this.state = {
      open: this.getSessionValue('open') == 1,
    }
  }

  render() {
    return (
      <div className="ss-submenu">
        <div
          className="ss-submenu-title"
          onClick={(e) => {
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
          ) : undefined}
        </div>
      </div>
    )
  }
}
