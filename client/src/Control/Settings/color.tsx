import React from 'react'
import { SendCommandStrict } from '../../device-page-wrapper'
import { ChromePicker } from 'react-color'
import { LibAtemState, LibAtemCommands } from '../../generated'

interface ColorGeneratorSettingsProps {
  sendCommand: SendCommandStrict
  colorGenerators: LibAtemState.ColorState[]
}

interface ColorGeneratorSettingsState {
  open: boolean
  displayPicker: number | null
}

export class ColorGeneratorSettings extends React.Component<ColorGeneratorSettingsProps, ColorGeneratorSettingsState> {
  constructor(props: ColorGeneratorSettingsProps) {
    super(props)
    this.state = {
      open: false,
      displayPicker: null
    }
  }

  private renderActivePicker() {
    if (this.state.displayPicker !== null) {
      const colorId = this.state.displayPicker
      const colorProps = this.props.colorGenerators[colorId]
      return (
        <div className="color-picker-popover">
          <div className="color-picker-cover" onClick={() => this.setState({ displayPicker: null })} />
          <ChromePicker
            onChange={color => {
              this.props.sendCommand('LibAtem.Commands.ColorGeneratorSetCommand', {
                Index: colorId,
                Hue: color.hsl.h,
                Saturation: color.hsl.s * 100,
                Luma: color.hsl.l * 100,
                Mask:
                  LibAtemCommands.ColorGeneratorSetCommand_MaskFlags.Hue |
                  LibAtemCommands.ColorGeneratorSetCommand_MaskFlags.Saturation |
                  LibAtemCommands.ColorGeneratorSetCommand_MaskFlags.Luma
              })
            }}
            disableAlpha={true}
            color={{
              h: colorProps?.hue ?? 0,
              s: colorProps?.saturation ?? 0,
              l: colorProps?.luma ?? 0
            }}
          />
        </div>
      )
    } else {
      return null
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
          Color Generators
        </div>
        <div className="ss-submenu-box">
          {this.state.open ? (
            <div className="ss-color-holder">
              {this.props.colorGenerators.map((col, id) => {
                return (
                  <div key={id} className="ss-color-inner" style={{ margin: '10px' }}>
                    <div className="atem-label">Color {id + 1}</div>
                    <div
                      className="ss-color-picker"
                      onClick={() => this.setState({ displayPicker: this.state.displayPicker === id ? null : id })}
                      style={{
                        background: `hsl(${col.hue}, ${col.saturation}%, ${col.luma}%)`
                      }}
                    ></div>
                  </div>
                )
              })}
              {this.renderActivePicker()}
            </div>
          ) : (
            undefined
          )}
        </div>
      </div>
    )
  }
}
