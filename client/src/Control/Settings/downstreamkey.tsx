import { RateInput, DropdownMenu, DropdownMenuItem, SourcesMap, SourceSelectInput } from '../../components'
import React from 'react'
import { SendCommandStrict } from '../../device-page-wrapper'
import { MaskProperties, TabPanel, TabPanelTab, PreMultipliedKeyProperties } from './common'
import { LibAtemState, LibAtemEnums, LibAtemCommands } from '../../generated'
import { StickyPanelBase } from './base'

interface DownstreamKeyerSettingsProps {
  sendCommand: SendCommandStrict

  keyers: LibAtemState.DownstreamKeyerState[]
  sources: SourcesMap
  videoMode: LibAtemEnums.VideoMode
}
interface DownstreamKeyerSettingsState {
  open: boolean
  page: number
}

export class DownstreamKeyerSettings extends StickyPanelBase<
  DownstreamKeyerSettingsProps,
  DownstreamKeyerSettingsState
> {
  constructor(props: DownstreamKeyerSettingsProps) {
    super(props, `control.settings.dsk`)

    this.trackSessionValues('open', 'page')

    this.state = {
      open: this.getSessionValue('open') == 1,
      page: this.getSessionValue('page') ?? 0,
    }
  }

  render() {
    const panels = this.state.open
      ? this.props.keyers.map((dsk, i) => {
          return (
            <TabPanelTab key={i} id={i} label={`DSK${i + 1}`}>
              <div className="atem-form">
                <div className="atem-label">Rate:</div>
                <div style={{ display: 'grid', gridAutoFlow: 'column' }}>
                  <div className="ss-rate">
                    <RateInput
                      value={dsk.properties.rate}
                      videoMode={this.props.videoMode}
                      callback={(e) => {
                        this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyRateSetCommand', {
                          Index: i,
                          Rate: e,
                        })
                      }}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuItem
                      onClick={() => {
                        this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                          Index: i,
                          Mask:
                            LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskTop |
                            LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskBottom |
                            LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskLeft |
                            LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskRight,
                          MaskTop: 9,
                          MaskBottom: -9,
                          MaskLeft: -16,
                          MaskRight: 16,
                        })
                      }}
                    >
                      Reset Mask
                    </DropdownMenuItem>
                  </DropdownMenu>
                </div>

                <SourceSelectInput
                  label="Fill Source"
                  sources={this.props.sources}
                  sourceAvailability={LibAtemEnums.SourceAvailability.None}
                  meAvailability={0}
                  value={dsk.sources.fillSource}
                  onChange={(e) =>
                    this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyFillSourceSetCommand', {
                      Index: i,
                      FillSource: e,
                    })
                  }
                />
                <SourceSelectInput
                  label="Key Source"
                  sources={this.props.sources}
                  sourceAvailability={LibAtemEnums.SourceAvailability.KeySource}
                  meAvailability={0}
                  value={dsk.sources.cutSource}
                  onChange={(e) =>
                    this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyCutSourceSetCommand', {
                      Index: i,
                      CutSource: e,
                    })
                  }
                />
              </div>

              <MaskProperties
                type="key"
                maskEnabled={dsk.properties?.maskEnabled ?? false}
                maskTop={dsk.properties?.maskTop ?? 0}
                maskLeft={dsk.properties?.maskLeft ?? 0}
                maskRight={dsk.properties?.maskRight ?? 0}
                maskBottom={dsk.properties?.maskBottom ?? 0}
                setMaskEnabled={(v) => {
                  this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                    Index: i,
                    Mask: LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskEnabled,
                    MaskEnabled: v,
                  })
                }}
                setMaskTop={(v) => {
                  this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                    Index: i,
                    Mask: LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskTop,
                    MaskTop: v,
                  })
                }}
                setMaskLeft={(v) => {
                  this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                    Index: i,
                    Mask: LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskLeft,
                    MaskLeft: v,
                  })
                }}
                setMaskRight={(v) => {
                  this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                    Index: i,
                    Mask: LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskRight,
                    MaskRight: v,
                  })
                }}
                setMaskBottom={(v) => {
                  this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                    Index: i,
                    Mask: LibAtemCommands.DownstreamKey_DownstreamKeyMaskSetCommand_MaskFlags.MaskBottom,
                    MaskBottom: v,
                  })
                }}
              />

              <PreMultipliedKeyProperties
                enabled={dsk.properties?.preMultipliedKey}
                clip={dsk.properties?.clip}
                gain={dsk.properties?.gain}
                invert={dsk.properties?.invert}
                setEnabled={(v) => {
                  this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                    Index: i,
                    Mask: LibAtemCommands.DownstreamKey_DownstreamKeyGeneralSetCommand_MaskFlags.PreMultipliedKey,
                    PreMultipliedKey: v,
                  })
                }}
                setClip={(v) => {
                  this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                    Index: i,
                    Mask: LibAtemCommands.DownstreamKey_DownstreamKeyGeneralSetCommand_MaskFlags.Clip,
                    Clip: v,
                  })
                }}
                setGain={(v) => {
                  this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                    Index: i,
                    Mask: LibAtemCommands.DownstreamKey_DownstreamKeyGeneralSetCommand_MaskFlags.Gain,
                    Gain: v,
                  })
                }}
                setInvert={(v) => {
                  this.props.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                    Index: i,
                    Mask: LibAtemCommands.DownstreamKey_DownstreamKeyGeneralSetCommand_MaskFlags.Invert,
                    Invert: v,
                  })
                }}
              />
            </TabPanelTab>
          )
        })
      : []

    return (
      <div className="ss-submenu">
        <div
          className="ss-submenu-title"
          onClick={(e) => {
            this.setState({ open: !this.state.open })
          }}
        >
          Downstream Keys
        </div>
        <TabPanel page={this.state.page} onChange={(newPage) => this.setState({ page: newPage })} hideSingle={true}>
          {panels}
        </TabPanel>
      </div>
    )
  }
}
