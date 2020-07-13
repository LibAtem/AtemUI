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
  mixEffect: number
  inputProperties: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
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
    const meProps = this.props.currentState.mixEffects[this.props.mixEffect]

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

    const meProps = this.props.currentState.mixEffects[this.props.mixEffect]

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
                meIndex={this.props.mixEffect}
                mix={meProps.transition.mix}
                videoMode={this.props.currentState.settings.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.TransitionStyle.Dip} label={'Dip'}>
            {meProps.transition.dip ? (
              <DipTransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.mixEffect}
                dip={meProps.transition.dip}
                sources={this.props.inputProperties}
                videoMode={this.props.currentState.settings.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.TransitionStyle.Wipe} label={'Wipe'}>
            {meProps.transition.wipe ? (
              <WipeTransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.mixEffect}
                wipe={meProps.transition.wipe}
                sources={this.props.inputProperties}
                videoMode={this.props.currentState.settings.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.TransitionStyle.Stinger} label={'Stinger'} disabled={this.props.profile.mediaPoolClips === 0}>
            {meProps.transition.stinger ? (
              <StingerTransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.mixEffect}
                stinger={meProps.transition.stinger}
                sources={this.props.inputProperties}
                videoMode={this.props.currentState.settings.videoMode}
              />
            ) : (
              undefined
            )}
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.TransitionStyle.DVE} label={'DVE'} disabled={this.props.profile.dVE === 0}>
            {meProps.transition.dVE ? (
              <DVETransitionSettings
                sendCommand={this.props.sendCommand}
                mixEffect={this.props.mixEffect}
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
