import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { LibAtemState, LibAtemEnums } from '../../../generated'
import { TabPanelTab, TabPanel } from '../common'
import { SuperSourceArtSettings } from './art'
import { SuperSourcePropertiesSettings, SuperSourceBoxSettings } from './properties'
import { SourcesMap } from '../../../components'
import { SuperSourceBoxCopySettings } from './copy'
import { StickyPanelBase } from '../base'

interface SuperSourceSettingsProps {
  sendCommand: SendCommandStrict
  index: number
  hasMultiple: boolean
  ssrcProps: LibAtemState.SuperSourceState
  sources: SourcesMap
  version: LibAtemEnums.ProtocolVersion | undefined
}

interface SuperSourceSettingsState {
  open: boolean
  page: number
  box: number
}

export class SuperSourceSettings extends StickyPanelBase<SuperSourceSettingsProps, SuperSourceSettingsState> {
  constructor(props: SuperSourceSettingsProps) {
    super(props, `control.settings.supersource.${props.index}`)

    this.trackSessionValues('open', 'page', 'box')

    this.state = {
      open: this.getSessionValue('open') == 1,
      page: this.getSessionValue('page') ?? 0,
      box: this.getSessionValue('box') ?? 0,
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
          SuperSource {this.props.hasMultiple ? this.props.index + 1 : ''}
        </div>

        {this.state.open ? (
          <TabPanel page={this.state.page} onChange={(newPage) => this.setState({ page: newPage })}>
            <TabPanelTab id={0} label={'Presets'}>
              <SuperSourcePropertiesSettings
                sendCommand={this.props.sendCommand}
                index={this.props.index}
                version={this.props.version}
              />
              <div className="atem-heading">Box Control</div>
              <TabPanel page={this.state.box} onChange={(newBox) => this.setState({ box: newBox })}>
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
            <TabPanelTab id={2} label={'Copy'}>
              <SuperSourceBoxCopySettings
                sendCommand={this.props.sendCommand}
                index={this.props.index}
                boxProps={this.props.ssrcProps.boxes}
                version={this.props.version}
              />
            </TabPanelTab>
          </TabPanel>
        ) : (
          <div className="ss-submenu-box"></div>
        )}
      </div>
    )
  }
}
