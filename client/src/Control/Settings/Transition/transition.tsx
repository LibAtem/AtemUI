import React from 'react'
import { WipeTransitionSettings } from './wipe'
import { DVETransitionSettings } from './dve'
import { AtemDeviceInfo } from '../../../Devices/types'
import { LibAtemState } from '../../../generated'
import { DipTransitionSettings } from './dip'
import { StingerTransitionSettings } from './stinger'
import { VideoSource } from '../../../generated/common-enums'
import { videoIds } from '../../../ControlSettings/ids'
import { TabPanel, TabPanelTab } from '../common'
import { MixTransitionSettings } from './mix'
import { CommandTypes } from '../../../generated/commands'
import { sendCommandStrict } from '../../../device-page-wrapper'

interface TransitionSettingsState {
  open: boolean
}

interface TransitionSettingsProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
  currentState: LibAtemState.AtemState // | null
  mixEffect: number
}

export class TransitionSettings extends React.Component<TransitionSettingsProps, TransitionSettingsState> {
  constructor(props: TransitionSettingsProps) {
    super(props)
    this.state = {
      open: false
    }
  }

  private sendCommand(...args: CommandTypes) {
    sendCommandStrict(this.props, ...args)
  }

  render() {
    if (!this.state.open) {
      return (
        <div className="ss-submenu">
          <div
            className="ss-submenu-title"
            onClick={e => {
              this.setState({ open: !this.state.open })
            }}
          >
            Transition
          </div>
          <div className="ss-submenu-box"></div>
        </div>
      )
    }

    const meProps = this.props.currentState.mixEffects[this.props.mixEffect]

    const inputProperties = new Map<VideoSource, LibAtemState.InputState_PropertiesState>()
    // TODO - memo this?
    for (const [k, v] of Object.entries(this.props.currentState.settings.inputs)) {
      const id = videoIds[k]
      if (id !== undefined) {
        inputProperties.set(id, v.properties)
      }
    }

    return (
      <div className="ss-submenu">
        <div
          className="ss-submenu-title"
          onClick={e => {
            this.setState({ open: !this.state.open })
          }}
        >
          Transition
        </div>
        <TabPanel default={0}>
          <TabPanelTab label={'Mix'}>
            {meProps.transition.mix ? (
              <MixTransitionSettings
                sendCommand={this.sendCommand}
                meIndex={this.props.mixEffect}
                mix={meProps.transition.mix}
                videoMode={this.props.currentState.settings.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab label={'Dip'}>
            {meProps.transition.dip ? (
              <DipTransitionSettings
                sendCommand={this.sendCommand}
                meIndex={this.props.mixEffect}
                dip={meProps.transition.dip}
                sources={inputProperties}
                videoMode={this.props.currentState.settings.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab label={'Wipe'}>
            {meProps.transition.wipe ? (
              <WipeTransitionSettings
                sendCommand={this.sendCommand}
                meIndex={this.props.mixEffect}
                wipe={meProps.transition.wipe}
                sources={inputProperties}
                videoMode={this.props.currentState.settings.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab label={'Stinger'}>
            {meProps.transition.stinger ? (
              <StingerTransitionSettings
                sendCommand={this.sendCommand}
                meIndex={this.props.mixEffect}
                stinger={meProps.transition.stinger}
                sources={inputProperties}
                videoMode={this.props.currentState.settings.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab label={'DVE'}>
            {meProps.transition.dVE ? (
              <DVETransitionSettings
                mixEffect={this.props.mixEffect}
                device={this.props.device}
                signalR={this.props.signalR}
                currentState={this.props.currentState}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>
        </TabPanel>
      </div>
    )
  }
}
