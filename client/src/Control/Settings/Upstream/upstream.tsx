import React from 'react'
import { LumaKeyerSettings } from './luma'
import { ChromaKeyerClassicProperties } from './chroma'
import { Pattern } from './pattern'
import { DveKeyerProperties } from './dve'
import { TabPanelTab, TabPanel } from '../common'
import { LibAtemEnums, LibAtemCommands, LibAtemState } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { ChromaKeyerAdvancedProperties } from './chroma-advanced'
import { SourcesMap } from '../../common'

interface UpstreamKeyState {
  open: boolean
}

interface SubMenuProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  keyer: LibAtemState.MixEffectState_KeyerState
  sources: SourcesMap
  videoMode: LibAtemEnums.VideoMode
}

export class UpstreamKey extends React.Component<SubMenuProps, UpstreamKeyState> {
  constructor(props: SubMenuProps) {
    super(props)
    this.state = {
      open: false
    }
  }

  shouldComponentUpdate(next: SubMenuProps, nextState: UpstreamKeyState) {
    return this.state.open !== nextState.open || this.state.open //only update if component is open
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
            Upstream Key {this.props.keyerIndex + 1}
          </div>
          <div className="ss-submenu-box"></div>
        </div>
      )
    }

    return (
      <div className="ss-submenu">
        <div
          className="ss-submenu-title"
          onClick={e => {
            this.setState({ open: !this.state.open })
          }}
        >
          Upstream Key {this.props.keyerIndex + 1}
        </div>
        <TabPanel
          page={this.props.keyer.properties.keyType}
          onChange={newPage => {
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyTypeSetCommand', {
              KeyerIndex: this.props.keyerIndex,
              MixEffectIndex: this.props.meIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyTypeSetCommand_MaskFlags.KeyType,
              KeyType: newPage
            })
          }}
        >
          <TabPanelTab id={LibAtemEnums.MixEffectKeyType.Luma} label={'Luma'} disabled={!this.props.keyer.luma}>
            <LumaKeyerSettings
              sendCommand={this.props.sendCommand}
              meIndex={this.props.meIndex}
              keyerIndex={this.props.keyerIndex}
              keyer={this.props.keyer}
              sources={this.props.sources}
              videoMode={this.props.videoMode}
            />
          </TabPanelTab>

          <TabPanelTab
            id={LibAtemEnums.MixEffectKeyType.Chroma}
            label={'Chroma'}
            disabled={!this.props.keyer.chroma && !this.props.keyer.advancedChroma}
          >
            <ChromaKeyerClassicProperties
              sendCommand={this.props.sendCommand}
              meIndex={this.props.meIndex}
              keyerIndex={this.props.keyerIndex}
              keyer={this.props.keyer}
              sources={this.props.sources}
              videoMode={this.props.videoMode}
            />
            <ChromaKeyerAdvancedProperties
              sendCommand={this.props.sendCommand}
              meIndex={this.props.meIndex}
              keyerIndex={this.props.keyerIndex}
              keyer={this.props.keyer}
              sources={this.props.sources}
              videoMode={this.props.videoMode}
            />
          </TabPanelTab>

          <TabPanelTab
            id={LibAtemEnums.MixEffectKeyType.Pattern}
            label={'Pattern'}
            disabled={!this.props.keyer.pattern}
          >
            <Pattern
              sendCommand={this.props.sendCommand}
              meIndex={this.props.meIndex}
              keyerIndex={this.props.keyerIndex}
              keyer={this.props.keyer}
              sources={this.props.sources}
              videoMode={this.props.videoMode}
            />
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.MixEffectKeyType.DVE} label={'DVE'} disabled={!this.props.keyer.dve}>
            <DveKeyerProperties
              sendCommand={this.props.sendCommand}
              meIndex={this.props.meIndex}
              keyerIndex={this.props.keyerIndex}
              keyer={this.props.keyer}
              sources={this.props.sources}
              videoMode={this.props.videoMode}
            />
          </TabPanelTab>
        </TabPanel>
      </div>
    )
  }
}
