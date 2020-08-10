import React from 'react'
import { WipeTransitionSettings } from './wipe'
import { DVETransitionSettings } from './dve'
import { LibAtemState, LibAtemEnums, LibAtemProfile } from '../../../generated'
import { DipTransitionSettings } from './dip'
import { StingerTransitionSettings } from './stinger'
import { TabPanel, TabPanelTab } from '../common'
import { MixTransitionSettings } from './mix'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { SourcesMap } from '../../../components'
import { StickyPanelBase } from '../base'

interface TransitionSettingsState {
  open: boolean
  page: number
}

interface TransitionSettingsProps {
  sendCommand: SendCommandStrict
  dveInfo: LibAtemState.InfoState_DveInfoState | undefined
  transition: LibAtemState.MixEffectState_TransitionState
  profile: LibAtemProfile.DeviceProfile
  meIndex: number
  sources: SourcesMap
  videoMode: LibAtemEnums.VideoMode
}

export class TransitionSettings extends StickyPanelBase<TransitionSettingsProps, TransitionSettingsState> {
  constructor(props: TransitionSettingsProps) {
    super(props, 'control.settings.transition')

    this.trackSessionValues('open', 'page')

    this.state = {
      open: this.getSessionValue('open') == 1,
      page: this.getSessionValue('page') ?? 0,
    }
  }

  private toggleOpen() {
    this.setState({
      open: !this.state.open,
      page: this.props.transition.properties.style,
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

    return (
      <div className="ss-submenu">
        <div className="ss-submenu-title" onClick={() => this.toggleOpen()}>
          Transition
        </div>
        <TabPanel page={this.state.page} onChange={(newPage) => this.setState({ page: newPage })}>
          <TabPanelTab id={LibAtemEnums.TransitionStyle.Mix} label={'Mix'}>
            {this.props.transition.mix ? (
              <MixTransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.meIndex}
                mix={this.props.transition.mix}
                videoMode={this.props.videoMode}
              />
            ) : undefined}
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.TransitionStyle.Dip} label={'Dip'}>
            {this.props.transition.dip ? (
              <DipTransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.meIndex}
                dip={this.props.transition.dip}
                sources={this.props.sources}
                videoMode={this.props.videoMode}
              />
            ) : undefined}
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.TransitionStyle.Wipe} label={'Wipe'}>
            {this.props.transition.wipe ? (
              <WipeTransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.meIndex}
                wipe={this.props.transition.wipe}
                sources={this.props.sources}
                videoMode={this.props.videoMode}
              />
            ) : undefined}
          </TabPanelTab>

          <TabPanelTab
            id={LibAtemEnums.TransitionStyle.Stinger}
            label={'Stinger'}
            disabled={this.props.profile.mediaPoolClips === 0}
          >
            {this.props.transition.stinger ? (
              <StingerTransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.meIndex}
                stinger={this.props.transition.stinger}
                sources={this.props.sources}
                videoMode={this.props.videoMode}
              />
            ) : undefined}
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.TransitionStyle.DVE} label={'DVE'} disabled={this.props.profile.dve === 0}>
            {this.props.transition.dve ? (
              <DVETransitionSettings
                sendCommand={this.props.sendCommand}
                meIndex={this.props.meIndex}
                info={this.props.dveInfo}
                dve={this.props.transition.dve}
                sources={this.props.sources}
                videoMode={this.props.videoMode}
              />
            ) : undefined}
          </TabPanelTab>
        </TabPanel>
      </div>
    )
  }
}
