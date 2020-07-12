import { MagicInput, RateInput } from './settings'
import React from 'react'
import Slider from 'react-rangeslider'
import { videoIds } from '../../ControlSettings/ids'
import { AtemDeviceInfo } from '../../Devices/types'
import * as LibAtem from '../../libatem'
import { sendCommand, SendCommandArgs } from '../../device-page-wrapper'
import { MaskProperties, ToggleButton } from './common'

interface SubMenuProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
  keyers: LibAtem.DownstreamKeyerState[]
  inputs: Record<LibAtem.VideoSource, LibAtem.InputState>
  videoMode: LibAtem.VideoMode
}
interface SubMenuState {
  open: boolean
  page: number
}

export class DownStreamKeys extends React.Component<SubMenuProps, SubMenuState> {
  constructor(props: SubMenuProps) {
    super(props)
    this.state = {
      open: false,
      page: 0
    }
  }

  private sendCommand(command: string, value: SendCommandArgs) {
    sendCommand(this.props, command, value)
  }

  getSourceOptions() {
    var inputs = Object.keys(this.props.inputs)
    var sources = inputs.filter(i => videoIds[i] < 4000)
    var options = []
    for (var i in sources) {
      options.push(
        <option value={videoIds[sources[i]]}>{(this.props.inputs as any)[sources[i]].properties.longName}</option>
      )
    }
    return options
  }

  getTopBox(index: number) {
    return (
      <div className="ss-dsk-top">
        <div className="ss-label">Rate:</div>
        <div className="ss-rate">
          <RateInput
            value={this.props.keyers[index].properties.rate}
            videoMode={this.props.videoMode}
            callback={(e: string) => {
              this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyRateSetCommand', { Index: index, Rate: e })
            }}
          />
        </div>
        <div className="ss-label">Fill Source:</div>
        <select
          onChange={e => {
            this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyFillSourceSetCommand', {
              Index: index,
              FillSource: e.currentTarget.value
            })
          }}
          value={this.props.keyers[index].sources.fillSource}
          className="ss-dropdown"
          id="cars"
        >
          {this.getSourceOptions()}
        </select>
        <div className="ss-label">Key Source:</div>
        <select
          onChange={e => {
            this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyCutSourceSetCommand', {
              Index: index,
              CutSource: e.currentTarget.value
            })
          }}
          value={this.props.keyers[index].sources.cutSource}
          className="ss-dropdown"
          id="cars"
        >
          {this.getSourceOptions()}
        </select>
      </div>
    )
  }

  getPreMultBox(index: number) {
    var enabled = this.props.keyers[index].properties.preMultipliedKey
    var diabledClass = !enabled ? 'sss ss-slider-outer' : 'sss ss-slider-outer disabled'
    return (
      <div className="ss-pmk">
        <ToggleButton
          active={enabled}
          label={'Pre Multiplied Key'}
          onClick={() => {
            this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
              Index: index,
              Mask: 1,
              PreMultipliedKey: !this.props.keyers[index].properties.preMultipliedKey
            })
          }}
        />
        <div className="ss-slider-holder">
          <div className={diabledClass}>
            <Slider
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                  Index: index,
                  Mask: 2,
                  Clip: e
                })
              }
              value={this.props.keyers[index].properties.clip}
            />
            <div className="ss-slider-label">Clip:</div>
          </div>
          <MagicInput
            disabled={enabled}
            value={this.props.keyers[index].properties.clip}
            callback={(value: any) => {
              if (value != '') {
                this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                  Index: index,
                  Mask: 2,
                  Clip: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <div className="ss-slider-holder">
          <div className={diabledClass}>
            <Slider
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                  Index: index,
                  Mask: 4,
                  Gain: e
                })
              }
              value={this.props.keyers[index].properties.gain}
            />
            <div className="ss-slider-label">Gain:</div>
          </div>
          <MagicInput
            disabled={enabled}
            value={this.props.keyers[index].properties.gain}
            callback={(value: any) => {
              if (value != '') {
                this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                  Index: index,
                  Mask: 4,
                  Gain: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <label className="ss-checkbox-container">
          Invert
          <input
            type="checkbox"
            disabled={enabled}
            checked={this.props.keyers[index].properties.invert}
            onClick={() =>
              this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand', {
                Index: index,
                Mask: 8,
                Invert: !this.props.keyers[index].properties.invert
              })
            }
          ></input>
          <span className="checkmark"></span>
        </label>
      </div>
    )
  }

  render() {
    const tabs: JSX.Element[] = []
    for (let i = 0; i < this.props.keyers.length; i++) {
      tabs.push(
        <div
          key={i}
          onClick={() => this.setState({ page: i })}
          className={this.state.page === i ? 'ss-submenu-submenu-item' : 'ss-submenu-submenu-item disabled'}
        >
          DSK{i + 1}
        </div>
      )
    }

    const dsk = this.props.keyers[this.state.page]

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
        <div className="ss-submenu-box" style={{ overflow: 'hidden' }}>
          {this.state.open ? (
            <React.Fragment>
              <div className="ss-submenu-submenu">{tabs}</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: 'repeat(3, auto)',
                  overflow: 'hidden'
                }}
              >
                {this.getTopBox(this.state.page)}
                <MaskProperties
                  maskEnabled={dsk?.properties?.maskEnabled ?? false}
                  maskTop={dsk?.properties?.maskTop ?? 0}
                  maskLeft={dsk?.properties?.maskLeft ?? 0}
                  maskRight={dsk?.properties?.maskRight ?? 0}
                  maskBottom={dsk?.properties?.maskBottom ?? 0}
                  setMaskEnabled={v => {
                    this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                      Index: this.state.page,
                      Mask: 1,
                      maskEnabled: v
                    })
                  }}
                  setMaskTop={v => {
                    this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                      Index: this.state.page,
                      Mask: 2,
                      maskTop: v
                    })
                  }}
                  setMaskLeft={v => {
                    this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                      Index: this.state.page,
                      Mask: 8,
                      maskLeft: v
                    })
                  }}
                  setMaskRight={v => {
                    this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                      Index: this.state.page,
                      Mask: 16,
                      maskRight: v
                    })
                  }}
                  setMaskBottom={v => {
                    this.sendCommand('LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand', {
                      Index: this.state.page,
                      Mask: 4,
                      maskBottom: v
                    })
                  }}
                />
                {this.getPreMultBox(this.state.page)}
              </div>
            </React.Fragment>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}
