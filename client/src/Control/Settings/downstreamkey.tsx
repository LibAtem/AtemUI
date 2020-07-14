import { RateInput } from '../common'
import React from 'react'
import { SendCommandStrict } from '../../device-page-wrapper'
import { MaskProperties, TabPanel, TabPanelTab, PreMultipliedKeyProperties } from './common'
import { LibAtemState, LibAtemEnums, LibAtemCommands } from '../../generated'

interface DownstreamKeyerSettingsProps {
  sendCommand: SendCommandStrict

  keyers: LibAtemState.DownstreamKeyerState[]
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}
interface DownstreamKeyerSettingsState {
  open: boolean
  page: number
}

export class DownstreamKeyerSettings extends React.Component<
  DownstreamKeyerSettingsProps,
  DownstreamKeyerSettingsState
> {
  constructor(props: DownstreamKeyerSettingsProps) {
    super(props)
    this.state = {
      open: false,
      page: 0
    }
  }

  private getSourceOptions() {
    return Array.from(this.props.sources.entries())
      .filter(([i]) => i < 4000)
      .map(([i, v]) => (
        <option key={i} value={i}>
          {v.longName}
        </option>
      ))
  }

  getTopBox(index: number) {
    return (
      <div className="ss-dsk-top">
        <div className="ss-label">Rate:</div>
        <div className="ss-rate">
          <RateInput
            value={this.props.keyers[index].properties.rate}
            videoMode={this.props.videoMode}
            callback={e => {
              this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyRateSetCommand', {
                Index: index,
                Rate: e
              })
            }}
          />
        </div>
        <div className="ss-label">Fill Source:</div>
        <select
          onChange={e => {
            this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyFillSourceSetCommand', {
              Index: index,
              FillSource: e.currentTarget.value as any
            })
          }}
          value={this.props.keyers[index].sources.fillSource}
          className="ss-dropdown"
        >
          {this.getSourceOptions()}
        </select>
        <div className="ss-label">Key Source:</div>
        <select
          onChange={e => {
            this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyCutSourceSetCommand', {
              Index: index,
              CutSource: e.currentTarget.value as any
            })
          }}
          value={this.props.keyers[index].sources.cutSource}
          className="ss-dropdown"
        >
          {this.getSourceOptions()}
        </select>
      </div>
    )
  }

  render() {
    const panels = this.state.open
      ? this.props.keyers.map((dsk, i) => {
          return (
            <TabPanelTab key={i} id={i} label={`DSK${i + 1}`}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: 'repeat(3, auto)',
                  overflow: 'hidden'
                }}
              >
                {this.getTopBox(i)}
                <MaskProperties
                  maskEnabled={dsk.properties?.maskEnabled ?? false}
                  maskTop={dsk.properties?.maskTop ?? 0}
                  maskLeft={dsk.properties?.maskLeft ?? 0}
                  maskRight={dsk.properties?.maskRight ?? 0}
                  maskBottom={dsk.properties?.maskBottom ?? 0}
                  setMaskEnabled={v => {
                    this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                      Index: i,
                      Mask: LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskEnabled,
                      MaskEnabled: v
                    })
                  }}
                  setMaskTop={v => {
                    this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                      Index: i,
                      Mask: LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskTop,
                      MaskTop: v
                    })
                  }}
                  setMaskLeft={v => {
                    this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                      Index: i,
                      Mask: LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskLeft,
                      MaskLeft: v
                    })
                  }}
                  setMaskRight={v => {
                    this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                      Index: i,
                      Mask: LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskRight,
                      MaskRight: v
                    })
                  }}
                  setMaskBottom={v => {
                    this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                      Index: i,
                      Mask: LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskBottom,
                      MaskBottom: v
                    })
                  }}
                />

                <PreMultipliedKeyProperties
                  enabled={dsk.properties?.preMultipliedKey}
                  clip={dsk.properties?.clip}
                  gain={dsk.properties?.gain}
                  invert={dsk.properties?.invert}
                  setEnabled={v => {
                    this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                      Index: i,
                      Mask: LibAtemCommands.DownstreamKey_DownstreamKeyGeneralSetCommand_MaskFlags.PreMultipliedKey,
                      PreMultipliedKey: v
                    })
                  }}
                  setClip={v => {
                    this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                      Index: i,
                      Mask: LibAtemCommands.DownstreamKey_DownstreamKeyGeneralSetCommand_MaskFlags.Clip,
                      Clip: v
                    })
                  }}
                  setGain={v => {
                    this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                      Index: i,
                      Mask: LibAtemCommands.DownstreamKey_DownstreamKeyGeneralSetCommand_MaskFlags.Gain,
                      Gain: v
                    })
                  }}
                  setInvert={v => {
                    this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                      Index: i,
                      Mask: LibAtemCommands.DownstreamKey_DownstreamKeyGeneralSetCommand_MaskFlags.Invert,
                      Invert: v
                    })
                  }}
                />
              </div>
            </TabPanelTab>
          )
        })
      : []

    return (
      <div className="ss-submenu">
        <div
          className="ss-submenu-title"
          onClick={e => {
            this.setState({ open: !this.state.open })
          }}
        >
          Downstream Keys
        </div>
        <TabPanel page={this.state.page} onChange={newPage => this.setState({ page: newPage })} hideSingle={true}>
          {panels}
        </TabPanel>
      </div>
    )
  }
}
