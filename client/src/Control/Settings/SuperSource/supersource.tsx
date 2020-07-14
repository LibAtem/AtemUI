import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { LibAtemState, LibAtemEnums } from '../../../generated'
import { TabPanelTab, TabPanel } from '../common'
import { SuperSourceArtSettings } from './art'
import { SuperSourcePropertiesSettings, SuperSourceBoxSettings } from './properties'

interface SuperSourceSettingsProps {
  sendCommand: SendCommandStrict
  index: number
  hasMultiple: boolean
  ssrcProps: LibAtemState.SuperSourceState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  version: LibAtemEnums.ProtocolVersion | undefined
}

interface SuperSourceSettingsState {
  open: boolean
  page: number
  box: number
}

export class SuperSourceSettings extends React.Component<SuperSourceSettingsProps, SuperSourceSettingsState> {
  constructor(props: SuperSourceSettingsProps) {
    super(props)
    this.state = {
      open: false,
      page: 0,
      box: 0
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

        {this.state.open ? (
          <TabPanel page={this.state.page} onChange={newPage => this.setState({ page: newPage })}>
            <TabPanelTab id={0} label={'Presets'}>
              <SuperSourcePropertiesSettings
                sendCommand={this.props.sendCommand}
                index={this.props.index}
                version={this.props.version}
              />
              <div className="ss-heading">Box Control</div>
              <TabPanel page={this.state.box} onChange={newBox => this.setState({ box: newBox })}>
                {this.props.ssrcProps.boxes.map((box, i) => (
                  <TabPanelTab key={i} id={i} label={`Box ${i + 1}`}>
                    <SuperSourceBoxSettings
                      sendCommand={this.props.sendCommand}
                      index={this.props.index}
                      boxIndex={i}
                      boxProps={box}
                      sources={this.props.sources}
                      version={this.props.version}
                    />
                  </TabPanelTab>
                ))}
              </TabPanel>
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
          <div className="ss-submenu-box"></div>
        )}
      </div>
    )
  }
}
