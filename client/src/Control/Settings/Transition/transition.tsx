import React from 'react'
import { WipeTransitionSettings } from './wipe'
import { DVETransitionSettings } from './dve'
import { LibAtemState, LibAtemEnums, LibAtemProfile } from '../../../generated'
import { DipTransitionSettings } from './dip'
import { StingerTransitionSettings } from './stinger'
import { TabPanel, TabPanelTab } from '../common'
import { MixTransitionSettings } from './mix'
import { SendCommandStrict } from '../../../device-page-wrapper'

interface TransitionSettingsState {
  open: boolean
  page: number
}

interface TransitionSettingsProps {
  sendCommand: SendCommandStrict
  currentState: LibAtemState.AtemState
  profile: LibAtemProfile.DeviceProfile
  meIndex: number
  inputProperties: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

export class TransitionSettings extends React.Component<TransitionSettingsProps, TransitionSettingsState> {
  constructor(props: TransitionSettingsProps) {
    super(props)
    this.state = {
      open: false,
      page: 0
    }
  }

  private toggleOpen() {
    const meProps = this.props.currentState.mixEffects[this.props.meIndex]

    this.setState({
      open: !this.state.open,
      page: meProps.transition.properties.style
    })
  }

  render() {
    if (!this.state.open) {
      return (
        <div className="ss-submenu">
          <div className="ss-submenu-title" onClick={() => this.toggleOpen()}>
            Transition
          </div>
          <div className="ss-submenu-box"></div>
        </div>
      )
    }

    const meProps = this.props.currentState.mixEffects[this.props.meIndex]

    return (
      <div className="ss-submenu">
        <div className="ss-submenu-title" onClick={() => this.toggleOpen()}>
          Transition
        </div>
        <TabPanel page={this.state.page} onChange={newPage => this.setState({ page: newPage })}>
          <TabPanelTab id={LibAtemEnums.TransitionStyle.Mix} label={'Mix'}>
            {meProps.transition.mix ? (
              <MixTransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.meIndex}
                mix={meProps.transition.mix}
                videoMode={this.props.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.TransitionStyle.Dip} label={'Dip'}>
            {meProps.transition.dip ? (
              <DipTransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.meIndex}
                dip={meProps.transition.dip}
                sources={this.props.inputProperties}
                videoMode={this.props.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.TransitionStyle.Wipe} label={'Wipe'}>
            {meProps.transition.wipe ? (
              <WipeTransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.meIndex}
                wipe={meProps.transition.wipe}
                sources={this.props.inputProperties}
                videoMode={this.props.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab
            id={LibAtemEnums.TransitionStyle.Stinger}
            label={'Stinger'}
            disabled={this.props.profile.mediaPoolClips === 0}
          >
            {meProps.transition.stinger ? (
              <StingerTransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.meIndex}
                stinger={meProps.transition.stinger}
                sources={this.props.inputProperties}
                videoMode={this.props.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.TransitionStyle.DVE} label={'DVE'} disabled={this.props.profile.dve === 0}>
            {meProps.transition.dve ? (
              <DVETransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.meIndex}
                dve={meProps.transition.dve}
                sources={this.props.inputProperties}
                videoMode={this.props.videoMode}
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
