import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { KeyerMaskProperties, ResetKeyerMask } from './mask'
import { LibAtemEnums, LibAtemState, LibAtemCommands } from '../../../generated'
import { FlyingKeyerProperties, FlyingKeyFrameProperties } from './flying'
import { ToggleButton } from '../common'
import Slider from 'react-rangeslider'
import { DropdownMenu, RunButton, DecimalWithSliderInput, SourceSelectInput, DropdownMenuItem } from '../../common'
import { ResetDVE } from './dve'
const yuv = require('color-space/yuv')

interface ChromaKeyerAdvancedPropertiesProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  keyer: LibAtemState.MixEffectState_KeyerState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
  videoMode: LibAtemEnums.VideoMode
}

export class ChromaKeyerAdvancedProperties extends React.Component<ChromaKeyerAdvancedPropertiesProps> {
  render() {
    if (!this.props.keyer.advancedChroma) {
      return null
    }

    return (
      <div>
        <div className="ss-heading">
          Settings
          <DropdownMenu resetAll={true}>
            <DropdownMenuItem
              onClick={() =>
                this.props.sendCommand(
                  'LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand',
                  {
                    MixEffectIndex: this.props.meIndex,
                    KeyerIndex: this.props.keyerIndex,
                    Mask:
                      LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags
                        .ForegroundLevel |
                      LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags
                        .BackgroundLevel |
                      LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.KeyEdge,
                    ForegroundLevel: 0,
                    BackgroundLevel: 0,
                    KeyEdge: 50
                  }
                )
              }
            >
              Reset Key Adjustments
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                this.props.sendCommand(
                  'LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand',
                  {
                    MixEffectIndex: this.props.meIndex,
                    KeyerIndex: this.props.keyerIndex,
                    Mask:
                      LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags
                        .SpillSuppression |
                      LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags
                        .FlareSuppression,
                    SpillSuppression: 0,
                    FlareSuppression: 0
                  }
                )
              }
            >
              Reset Chroma Correction
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                this.props.sendCommand(
                  'LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand',
                  {
                    MixEffectIndex: this.props.meIndex,
                    KeyerIndex: this.props.keyerIndex,
                    Mask:
                      LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags
                        .Brightness |
                      LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.Contrast |
                      LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags
                        .Saturation |
                      LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.Red |
                      LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.Green |
                      LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.Blue,
                    Brightness: 0,
                    Contrast: 0,
                    Saturation: 100,
                    Red: 0,
                    Green: 0,
                    Blue: 0
                  }
                )
              }
            >
              Reset Color Adjustments
            </DropdownMenuItem>
            <hr />
            {ResetKeyerMask(this.props.sendCommand, this.props.meIndex, this.props.keyerIndex)}
            {ResetDVE(this.props.sendCommand, this.props.meIndex, this.props.keyerIndex)}
          </DropdownMenu>
        </div>

        <SourceSelectInput
          label="Fill Source"
          sources={this.props.sources}
          sourceAvailability={LibAtemEnums.SourceAvailability.None}
          meAvailability={this.props.meIndex + 1}
          value={this.props.keyer.properties.fillSource}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFillSourceSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              FillSource: e
            })
          }
        />

        <ChromaSample
          sendCommand={this.props.sendCommand}
          meIndex={this.props.meIndex}
          keyerIndex={this.props.keyerIndex}
          props={this.props.keyer.advancedChroma.sample}
        />

        <div className="ss-heading">Key Adjustments</div>
        <DecimalWithSliderInput
          label="Foreground"
          step={0.1}
          min={0}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask:
                LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.ForegroundLevel,
              ForegroundLevel: e
            })
          }
          value={this.props.keyer.advancedChroma.properties.foregroundLevel}
        />
        <DecimalWithSliderInput
          label="Background"
          step={0.1}
          min={0}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask:
                LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.BackgroundLevel,
              BackgroundLevel: e
            })
          }
          value={this.props.keyer.advancedChroma.properties.backgroundLevel}
        />
        <DecimalWithSliderInput
          label="Key Edge"
          step={0.1}
          min={0}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.KeyEdge,
              KeyEdge: e
            })
          }
          value={this.props.keyer.advancedChroma.properties.keyEdge}
        />

        <div className="ss-heading">Chroma Correction</div>
        <DecimalWithSliderInput
          label="Spill"
          step={0.1}
          min={0}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask:
                LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags
                  .SpillSuppression,
              SpillSuppression: e
            })
          }
          value={this.props.keyer.advancedChroma.properties.spillSuppression}
        />
        <DecimalWithSliderInput
          label="Flare Suppression"
          step={0.1}
          min={0}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask:
                LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags
                  .FlareSuppression,
              FlareSuppression: e
            })
          }
          value={this.props.keyer.advancedChroma.properties.flareSuppression}
        />

        <div className="ss-heading">Color Adjustments</div>
        <DecimalWithSliderInput
          label="Brightness"
          step={0.1}
          min={-100}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.Brightness,
              Brightness: e
            })
          }
          value={this.props.keyer.advancedChroma.properties.brightness}
        />
        <DecimalWithSliderInput
          label="Contrast"
          step={0.1}
          min={-100}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.Contrast,
              Contrast: e
            })
          }
          value={this.props.keyer.advancedChroma.properties.contrast}
        />
        <DecimalWithSliderInput
          label="Saturation"
          step={0.1}
          min={0}
          max={200}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.Saturation,
              Saturation: e
            })
          }
          value={this.props.keyer.advancedChroma.properties.saturation}
        />

        <DecimalWithSliderInput
          label="Red"
          step={0.1}
          min={-100}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.Red,
              Red: e
            })
          }
          value={this.props.keyer.advancedChroma.properties.red}
        />
        <DecimalWithSliderInput
          label="Green"
          step={0.1}
          min={-100}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.Green,
              Green: e
            })
          }
          value={this.props.keyer.advancedChroma.properties.green}
        />
        <DecimalWithSliderInput
          label="Blue"
          step={0.1}
          min={-100}
          max={100}
          onChange={e =>
            this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaPropertiesSetCommand', {
              MixEffectIndex: this.props.meIndex,
              KeyerIndex: this.props.keyerIndex,
              Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaPropertiesSetCommand_MaskFlags.Blue,
              Blue: e
            })
          }
          value={this.props.keyer.advancedChroma.properties.blue}
        />

        <KeyerMaskProperties
          meIndex={this.props.meIndex}
          keyerIndex={this.props.keyerIndex}
          keyerProps={this.props.keyer.properties}
          sendCommand={this.props.sendCommand}
        />

        {this.props.keyer.dve && this.props.keyer.flyProperties ? (
          <>
            <FlyingKeyerProperties
              sendCommand={this.props.sendCommand}
              meIndex={this.props.meIndex}
              keyerIndex={this.props.keyerIndex}
              flyEnabled={this.props.keyer.properties.flyEnabled}
              keyerProps={this.props.keyer.dve}
            />
            <FlyingKeyFrameProperties
              videoMode={this.props.videoMode}
              keyerProps={this.props.keyer.dve}
              flyEnabled={this.props.keyer.properties.flyEnabled}
              flyProps={this.props.keyer.flyProperties}
              keyerIndex={this.props.keyerIndex}
              meIndex={this.props.meIndex}
              sendCommand={this.props.sendCommand}
            />
          </>
        ) : (
          undefined
        )}
      </div>
    )
  }
}

// function clampToRange

function yuvToRgb(ycbcr: [number, number, number]): [number, number, number] {
  // Note: correct colorspace isnt 100% important, as this is only a ui hint
  const y = ycbcr[0]
  const cb = ycbcr[1] - 0.5
  const cr = ycbcr[1] - 0.5

  // TODO - this might need adjusting to be full-range

  return yuv.rgb([y, cb, cr])
}

interface ChromaSampleProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  props: LibAtemState.MixEffectState_KeyerAdvancedChromaSampleState
}
class ChromaSample extends React.Component<ChromaSampleProps, { open: boolean }> {
  constructor(props: ChromaSampleProps) {
    super(props)

    this.state = {
      open: false
    }
  }

  render() {
    const rgbCol = yuvToRgb([this.props.props.sampledY, this.props.props.sampledCb, this.props.props.sampledCr])

    return (
      <div>
        <div style={{ gridAutoFlow: 'column', display: 'grid' }}>
          <ToggleButton
            label={
              <div style={{ gridAutoFlow: 'column', display: 'grid' }}>
                Chroma Sample
                <div
                  className="ss-color-picker"
                  style={{
                    background: `rgb(${rgbCol[0]}, ${rgbCol[1]}, ${rgbCol[2]})`
                  }}
                ></div>
              </div>
            }
            active={this.props.props.enableCursor}
            onClick={v =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaSampleSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaSampleSetCommand_MaskFlags.EnableCursor,
                EnableCursor: v
              })
            }
          />
          <RunButton
            label="Preview"
            active={this.props.props.preview}
            style={{ width: '75px', height: 'fit-content', margin: 'auto' }}
            onClick={() => {
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaSampleSetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaSampleSetCommand_MaskFlags.Preview,
                Preview: !this.props.props.preview
              })
            }}
          />
        </div>
        {this.props.props.enableCursor ? (
          <div
            className="sss"
            style={{
              gridAutoFlow: 'column',
              display: 'grid',
              gridTemplateColumns: '10px 1fr 25px'
            }}
          >
            <div></div>
            <ChromaSamplePicker
              cursorX={this.props.props.cursorX}
              cursorY={this.props.props.cursorY}
              cursorSize={this.props.props.cursorSize}
              onChange={(x, y) =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaSampleSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask:
                    LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaSampleSetCommand_MaskFlags.CursorX |
                    LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaSampleSetCommand_MaskFlags.CursorY,
                  CursorX: x,
                  CursorY: y
                })
              }
            />

            <Slider
              tooltip={false}
              orientation={'vertical'}
              value={this.props.props.cursorSize}
              onChange={v => {
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyAdvancedChromaSampleSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyAdvancedChromaSampleSetCommand_MaskFlags.CursorSize,
                  CursorSize: v
                })
              }}
              step={0.01}
              min={6.25}
              max={99.25}
            />
          </div>
        ) : (
          undefined
        )}
      </div>
    )
  }
}

interface ChromaSamplePickerProps {
  cursorX: number
  cursorY: number
  cursorSize: number
  onChange: (x: number, y: number) => void
}
interface ChromaSamplePickerState {
  focus: boolean
  pickerX: number
  pickerY: number
}
class ChromaSamplePicker extends React.Component<ChromaSamplePickerProps, ChromaSamplePickerState> {
  constructor(props: ChromaSamplePickerProps) {
    super(props)

    this.sendMouseUpdate = this.sendMouseUpdate.bind(this)
    this.sendTouchUpdate = this.sendTouchUpdate.bind(this)
  }
  private sendMouseUpdate(e: React.MouseEvent<HTMLDivElement, MouseEvent>, force?: boolean) {
    e.preventDefault()

    const videoWidth = 16
    const videoHeight = 9

    if (this.state?.focus || force) {
      const x = e.nativeEvent.offsetX / e.currentTarget.clientWidth
      const y = e.nativeEvent.offsetY / e.currentTarget.clientHeight

      const x2 = (x - 0.5) * 2 * videoWidth
      const y2 = (y - 0.5) * 2 * -videoHeight

      this.props.onChange(x2, y2)
    }
  }
  private sendTouchUpdate(e: React.TouchEvent<HTMLDivElement>, force?: boolean) {
    e.preventDefault()

    const videoWidth = 16
    const videoHeight = 9

    if (this.state?.focus || force) {
      const r = e.currentTarget.getBoundingClientRect()
      const x = (e.touches[0].clientX - r.left) / e.currentTarget.clientWidth
      const y = (e.touches[0].clientY - r.top) / e.currentTarget.clientHeight

      const x2 = (x - 0.5) * 2 * videoWidth
      const y2 = (y - 0.5) * 2 * -videoHeight

      this.props.onChange(x2, y2)
    }
  }
  render() {
    const videoWidth = 16
    const videoHeight = 9

    return (
      <div className="usk-chroma-sample-picker">
        <div className="usk-chroma-sample-picker-content">
          <div
            className="sampler"
            style={{
              left: `${(this.props.cursorX / (videoWidth * 2) + 0.5) * 100}%`,
              top: `${(this.props.cursorY / (videoHeight * 2) - 0.5) * -100}%`,
              width: `calc(${this.props.cursorSize}% * 0.5625)`,
              height: `${this.props.cursorSize}%`
            }}
          >
            <div></div>
          </div>

          <div
            className="input"
            onMouseDown={e => {
              e.preventDefault()
              this.sendMouseUpdate(e, true)
              this.setState({ focus: true })
            }}
            onMouseUp={e => {
              e.preventDefault()
              this.setState({ focus: false })
            }}
            onTouchStart={e => {
              e.preventDefault()
              this.sendTouchUpdate(e, true)
              this.setState({ focus: true })
            }}
            onTouchEnd={e => {
              e.preventDefault()
              this.setState({ focus: false })
            }}
            onMouseMove={this.sendMouseUpdate}
            onTouchMove={this.sendTouchUpdate}
          >
            {/* This exists to claim the user input  */}
          </div>
        </div>
      </div>
    )
  }
}
