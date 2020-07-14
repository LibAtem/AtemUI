import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { LibAtemState, LibAtemEnums } from '../../../generated'
import { TabPanelTab, TabPanel } from '../common'
import { SuperSourceArtSettings } from './art'

interface SuperSourceSettingsProps {
  sendCommand: SendCommandStrict
  index: number
  hasMultiple: boolean
  ssrcProps: LibAtemState.SuperSourceState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  version: unknown // TODO - ProtocolVersion
}

interface SuperSourceSettingsState {
  open: boolean
  page: number
}

export class SuperSourceSettings extends React.Component<SuperSourceSettingsProps, SuperSourceSettingsState> {
  constructor(props: SuperSourceSettingsProps) {
    super(props)
    this.state = {
      open: false,
      page: 1
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
          SuperSource {this.props.hasMultiple ? this.props.index + 1 : ''}
        </div>
        <div className="ss-submenu-box">
          {this.state.open ? (
            <TabPanel page={this.state.page} onChange={newPage => this.setState({ page: newPage })}>
              <TabPanelTab id={0} label={'Presets'}>
                {/* {this.props.transition.mix ? (
                  <MixTransitionSettings
                    sendCommand={this.props.sendCommand}
                    meIndex={this.props.meIndex}
                    mix={this.props.transition.mix}
                    videoMode={this.props.videoMode}
                  />
                ) : (
                  undefined
                )} */}
              </TabPanelTab>
              <TabPanelTab id={1} label={'Art'}>
                <SuperSourceArtSettings
                  sendCommand={this.props.sendCommand}
                  index={this.props.index}
                  ssrcProps={this.props.ssrcProps.properties}
                  borderProps={this.props.ssrcProps.border}
                  sources={this.props.sources}
                  version={this.props.version}
                />
              </TabPanelTab>
              <TabPanelTab id={2} label={'Copy'} disabled={true}>
                {/* {this.props.transition.mix ? (
                  <MixTransitionSettings
                    sendCommand={this.props.sendCommand}
                    meIndex={this.props.meIndex}
                    mix={this.props.transition.mix}
                    videoMode={this.props.videoMode}
                  />
                ) : (
                  undefined
                )} */}
              </TabPanelTab>
            </TabPanel>
          ) : (
            undefined
          )}
        </div>
      </div>
    )
  }
}
