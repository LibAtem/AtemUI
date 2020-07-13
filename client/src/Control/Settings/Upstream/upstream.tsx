import React from 'react'
import { RateInput } from '../../common'
import { MagicInput } from '../settings'
import { LumaKeyerSettings } from './luma'
import { ChromaKeyerClassicProperties } from './chroma'
import { Pattern } from './pattern'
import { DVE } from './dve'
import { ToggleButton, TabPanelTab, TabPanel } from '../common'
import { LibAtemEnums, LibAtemCommands, LibAtemState } from '../../../generated'
import { SendCommandStrict } from '../../../device-page-wrapper'

interface UpstreamKeyState {
  open: boolean
}

interface SubMenuProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  keyer: LibAtemState.MixEffectState_KeyerState
  sources: Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>
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

          <TabPanelTab id={LibAtemEnums.MixEffectKeyType.Chroma} label={'Chroma'} disabled={!this.props.keyer.chroma}>
            <ChromaKeyerClassicProperties
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
            {/* <Pattern
              sendCommand={this.props.sendCommand}
              id={this.props.keyerIndex}
              mixEffect={this.props.meIndex}
              currentState={this.props.currentState}
            /> */}
          </TabPanelTab>

          <TabPanelTab id={LibAtemEnums.MixEffectKeyType.DVE} label={'DVE'} disabled={!this.props.keyer.dve}>
            {/* <DVE
              sendCommand={this.props.sendCommand}
              id={this.props.keyerIndex}
              mixEffect={this.props.meIndex}
              currentState={this.props.currentState}
            /> */}
          </TabPanelTab>
        </TabPanel>
      </div>
    )
  }
}

export function FlyingKey(props: {
  keyerIndex: number
  mixEffectIndex: number
  flyEnabled: any
  properties: any
  sendCommand: any
}) {
  var enabled = props.flyEnabled
  var labelClass = enabled ? 'ss-label' : 'ss-label disabled'

  return (
    <div>
      <ToggleButton
        active={enabled}
        label={'Flying Key'}
        onClick={() => {
          props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyTypeSetCommand', {
            MixEffectIndex: props.mixEffectIndex,
            KeyerIndex: props.keyerIndex,
            Mask: 2,
            FlyEnabled: !props.flyEnabled
          })
        }}
      />

      <div className="ss-row xy">
        <div style={{ minWidth: '50px' }} className="ss-label">
          Position:
        </div>
        <div className="ss-label right">X:</div>
        <MagicInput
          step={0.01}
          disabled={!enabled}
          value={props.properties.positionX}
          callback={(value: any) => {
            if (value != '') {
              props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
                KeyerIndex: props.keyerIndex,
                MixEffectIndex: props.mixEffectIndex,
                Mask: 4,
                PositionX: Math.min(1000, Math.max(-1000, value))
              })
            }
          }}
        />
        <div className="ss-label right">Y:</div>
        <MagicInput
          step={0.01}
          disabled={!enabled}
          value={props.properties.positionY}
          callback={(value: any) => {
            if (value != '') {
              props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
                KeyerIndex: props.keyerIndex,
                MixEffectIndex: props.mixEffectIndex,
                Mask: 8,
                PositionY: Math.min(1000, Math.max(-1000, value))
              })
            }
          }}
        />
      </div>

      <div className="ss-row xy">
        <div style={{ minWidth: '50px' }} className="ss-label">
          Scale:
        </div>
        <div className="ss-label right">X:</div>
        <MagicInput
          step={0.01}
          disabled={!enabled}
          value={props.properties.sizeX}
          callback={(value: any) => {
            if (value != '') {
              props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
                KeyerIndex: props.keyerIndex,
                MixEffectIndex: props.mixEffectIndex,
                Mask: 1,
                SizeX: Math.min(99.99, Math.max(0, value))
              })
            }
          }}
        />
        <div className="ss-label right">Y:</div>
        <MagicInput
          step={0.01}
          disabled={!enabled}
          value={props.properties.sizeY}
          callback={(value: any) => {
            if (value != '') {
              props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
                KeyerIndex: props.keyerIndex,
                MixEffectIndex: props.mixEffectIndex,
                Mask: 2,
                SizeY: Math.min(99.99, Math.max(0, value))
              })
            }
          }}
        />
      </div>

      <div className="ss-row xy">
        <div style={{ minWidth: '50px' }} className="ss-label">
          Rotation:
        </div>
        <div className="ss-label right">360°:</div>
        <MagicInput
          step={1}
          disabled={!enabled}
          value={Math.floor(props.properties.rotation / 360)}
          callback={(value: any) => {
            if (value != '') {
              props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
                KeyerIndex: props.keyerIndex,
                MixEffectIndex: props.mixEffectIndex,
                Mask: 16,
                Rotation:
                  (props.properties.rotation -
                    Math.floor(props.properties.rotation / 360) * 360 +
                    Math.floor(value) * 360) /
                  100
              })
            }
          }}
        />
        <div style={{ fontSize: '12px' }} className="ss-label right">
          + 1°:
        </div>
        <MagicInput
          step={1}
          disabled={!enabled}
          value={props.properties.rotation - Math.floor(props.properties.rotation / 360) * 360}
          callback={(value: any) => {
            if (value != '') {
              props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
                KeyerIndex: props.keyerIndex,
                MixEffectIndex: props.mixEffectIndex,
                Mask: 16,
                Rotation: (Math.floor(props.properties.rotation / 360) * 360 + parseInt(value)) / 100
              })
            }
          }}
        />
      </div>
    </div>
  )
}

export function KeyFrame(props: {
  keyerIndex: number
  mixEffect: number
  flyEnabled: any
  properties: any
  sendCommand: any
  videoMode: number
  dve: any
}) {
  function getSwoosh() {
    var style = props.properties.activeKeyFrame == 4 ? props.properties.runToInfinite : -1
    return (
      <div style={{ marginBottom: '20px' }} className="ss-dve-style-holder">
        <div
          onClick={() =>
            props.flyEnabled
              ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: props.mixEffect,
                  KeyerIndex: props.keyerIndex,
                  KeyFrame: 4,
                  Mask: 2,
                  RunToInfinite: 1
                })
              : null
          }
          className={
            props.flyEnabled
              ? style == 1
                ? 'ss-dve-style-item selected'
                : 'ss-dve-style-item'
              : 'ss-dve-style-item disabled'
          }
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(-45,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 1 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            props.flyEnabled
              ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: props.mixEffect,
                  KeyerIndex: props.keyerIndex,
                  KeyFrame: 4,
                  Mask: 2,
                  RunToInfinite: 2
                })
              : null
          }
          className={
            props.flyEnabled
              ? style == 2
                ? 'ss-dve-style-item selected'
                : 'ss-dve-style-item'
              : 'ss-dve-style-item disabled'
          }
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50 "
                rx="2"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 2 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            props.flyEnabled
              ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: props.mixEffect,
                  KeyerIndex: props.keyerIndex,
                  KeyFrame: 4,
                  Mask: 2,
                  RunToInfinite: 3
                })
              : null
          }
          className={
            props.flyEnabled
              ? style == 3
                ? 'ss-dve-style-item selected'
                : 'ss-dve-style-item'
              : 'ss-dve-style-item disabled'
          }
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(45,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 3 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            props.flyEnabled
              ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: props.mixEffect,
                  KeyerIndex: props.keyerIndex,
                  KeyFrame: 4,
                  Mask: 2,
                  RunToInfinite: 4
                })
              : null
          }
          className={
            props.flyEnabled
              ? style == 4
                ? 'ss-dve-style-item selected'
                : 'ss-dve-style-item'
              : 'ss-dve-style-item disabled'
          }
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(-90,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 4 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div
            onClick={() =>
              props.flyEnabled
                ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                    MixEffectIndex: props.mixEffect,
                    KeyerIndex: props.keyerIndex,
                    KeyFrame: 4,
                    Mask: 2,
                    RunToInfinite: 0
                  })
                : null
            }
            className={
              props.flyEnabled
                ? style == 0
                  ? 'ss-dve-style-item selected'
                  : 'ss-dve-style-item'
                : 'ss-dve-style-item disabled'
            }
          >
            <svg width="100%" height="100%" viewBox="0 0 75 100" xmlns="http://www.w3.org/2000/svg">
              <g>
                <polygon
                  id="pattern 1"
                  points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                  rx="2"
                  transform="translate(-53,15) rotate(45,75,50)"
                  stroke-width="0.2"
                  stroke="#191919"
                  fill={style === 0 ? '#ff8c00' : '#b2b2b2'}
                />
              </g>
              <g>
                <polygon
                  id="pattern 1"
                  points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                  rx="2"
                  transform="translate(-22,15) rotate(-45,75,50)"
                  stroke-width="0.2"
                  stroke="#191919"
                  fill={style === 0 ? '#ff8c00' : '#b2b2b2'}
                />
              </g>

              <g>
                <polygon
                  id="pattern 1"
                  points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                  rx="2"
                  transform="translate(-22,-14) rotate(-135,75,50)"
                  stroke-width="0.2"
                  stroke="#191919"
                  fill={style === 0 ? '#ff8c00' : '#b2b2b2'}
                />
              </g>

              <g>
                <polygon
                  id="pattern 1"
                  points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                  rx="2"
                  transform="translate(-53,-14) rotate(135,75,50)"
                  stroke-width="0.2"
                  stroke="#191919"
                  fill={style === 0 ? '#ff8c00' : '#b2b2b2'}
                />
              </g>
            </svg>
          </div>

          <div
            onClick={() =>
              props.flyEnabled
                ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                    MixEffectIndex: props.mixEffect,
                    KeyerIndex: props.keyerIndex,
                    KeyFrame: 4,
                    Mask: 2,
                    RunToInfinite: 5
                  })
                : null
            }
            className={
              props.flyEnabled
                ? style == 5
                  ? 'ss-dve-style-item selected'
                  : 'ss-dve-style-item'
                : 'ss-dve-style-item disabled'
            }
          >
            <svg width="100%" height="100%" viewBox="0 0 75 100" xmlns="http://www.w3.org/2000/svg">
              <g>
                <polygon
                  id="pattern 1"
                  points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                  rx="2"
                  transform="translate(-53,15) rotate(45,75,50)"
                  stroke-width="0.2"
                  stroke="#191919"
                  fill={style === 5 ? '#ff8c00' : '#b2b2b2'}
                />
              </g>
              <g>
                <polygon
                  id="pattern 1"
                  points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                  rx="2"
                  transform="translate(-22,15) rotate(-45,75,50)"
                  stroke-width="0.2"
                  stroke="#191919"
                  fill={style === 5 ? '#ff8c00' : '#b2b2b2'}
                />
              </g>

              <g>
                <polygon
                  id="pattern 1"
                  points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                  rx="2"
                  transform="translate(-22,-14) rotate(-135,75,50)"
                  stroke-width="0.2"
                  stroke="#191919"
                  fill={style === 5 ? '#ff8c00' : '#b2b2b2'}
                />
              </g>

              <g>
                <polygon
                  id="pattern 1"
                  points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                  rx="2"
                  transform="translate(-53,-14) rotate(135,75,50)"
                  stroke-width="0.2"
                  stroke="#191919"
                  fill={style === 5 ? '#ff8c00' : '#b2b2b2'}
                />
              </g>

              <g>
                <rect
                  x="5"
                  y="10"
                  width="65"
                  height="80"
                  stroke={style === 5 ? '#ff8c00' : '#b2b2b2'}
                  stroke-width="2"
                  fill="none"
                />
              </g>
            </svg>
          </div>
        </div>

        <div
          onClick={() =>
            props.flyEnabled
              ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: props.mixEffect,
                  KeyerIndex: props.keyerIndex,
                  KeyFrame: 4,
                  Mask: 2,
                  RunToInfinite: 6
                })
              : null
          }
          className={
            props.flyEnabled
              ? style == 6
                ? 'ss-dve-style-item selected'
                : 'ss-dve-style-item'
              : 'ss-dve-style-item disabled'
          }
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(90,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 6 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            props.flyEnabled
              ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: props.mixEffect,
                  KeyerIndex: props.keyerIndex,
                  KeyFrame: 4,
                  Mask: 2,
                  RunToInfinite: 7
                })
              : null
          }
          className={
            props.flyEnabled
              ? style == 7
                ? 'ss-dve-style-item selected'
                : 'ss-dve-style-item'
              : 'ss-dve-style-item disabled'
          }
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(-135,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 7 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            props.flyEnabled
              ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: props.mixEffect,
                  KeyerIndex: props.keyerIndex,
                  KeyFrame: 4,
                  Mask: 2,
                  RunToInfinite: 8
                })
              : null
          }
          className={
            props.flyEnabled
              ? style == 8
                ? 'ss-dve-style-item selected'
                : 'ss-dve-style-item'
              : 'ss-dve-style-item disabled'
          }
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(180,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 8 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            props.flyEnabled
              ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: props.mixEffect,
                  KeyerIndex: props.keyerIndex,
                  KeyFrame: 4,
                  Mask: 2,
                  RunToInfinite: 9
                })
              : null
          }
          className={
            props.flyEnabled
              ? style == 9
                ? 'ss-dve-style-item selected'
                : 'ss-dve-style-item'
              : 'ss-dve-style-item disabled'
          }
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(135,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 9 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="ss-row" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <div className={props.flyEnabled ? 'ss-label' : 'ss-label disabled'}>Rate:</div>
        <div className="ss-rate">
          <RateInput
            disabled={!props.flyEnabled}
            videoMode={props.videoMode}
            value={props.dve.rate}
            callback={(e: number) =>
              props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
                MixEffectIndex: props.mixEffect,
                KeyerIndex: props.keyerIndex,
                Mask: 33554432,
                Rate: e
              })
            }
          />
        </div>
      </div>

      <div className="ss-row">
        <div className={props.flyEnabled ? 'ss-label' : 'ss-label disabled'}>KeyFrame:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 50px 1fr', gridColumnGap: '5px' }}>
          <div
            style={{ width: '50px' }}
            onClick={() =>
              props.flyEnabled
                ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyKeyframeSetCommand', {
                    MixEffectIndex: props.mixEffect,
                    KeyerIndex: props.keyerIndex,
                    KeyFrame: 1,
                    SizeX: props.dve.sizeX,
                    SizeY: props.dve.sizeY,
                    PositionX: props.dve.positionX,
                    PositionY: props.dve.positionY,
                    Rotation: props.dve.rotation,
                    OuterWidth: props.dve.borderOuterWidth,
                    InnerWidth: props.dve.borderInnerWidth,
                    OuterSoftness: props.dve.borderOuterSoftness,
                    InnerSoftness: props.dve.borderInnerSoftness,
                    BevelSoftness: props.dve.borderBevelSoftness,
                    BevelPosition: props.dve.borderBevelPosition,
                    BorderOpacity: props.dve.borderOpacity,
                    BorderHue: props.dve.borderHue,
                    BorderSaturation: props.dve.borderSaturation,
                    BorderLuma: props.dve.borderLuma,
                    LightSourceDirection: props.dve.lightSourceDirection,
                    LightSourceAltitude: props.dve.lightSourceAltitude,
                    MaskTop: props.dve.maskTop,
                    MaskBottom: props.dve.maskBottom,
                    MaskLeft: props.dve.maskLeft,
                    MaskRight: props.dve.maskRight,
                    Mask: 2097151
                  })
                : null
            }
            className={props.flyEnabled ? 'ss-run-button' : 'ss-run-button disabled'}
          >
            Set A
          </div>

          <div
            style={{ width: '50px' }}
            onClick={() =>
              props.flyEnabled
                ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyKeyframeSetCommand', {
                    MixEffectIndex: props.mixEffect,
                    KeyerIndex: props.keyerIndex,
                    KeyFrame: 2,
                    SizeX: props.dve.sizeX,
                    SizeY: props.dve.sizeY,
                    PositionX: props.dve.positionX,
                    PositionY: props.dve.positionY,
                    Rotation: props.dve.rotation,
                    OuterWidth: props.dve.borderOuterWidth,
                    InnerWidth: props.dve.borderInnerWidth,
                    OuterSoftness: props.dve.borderOuterSoftness,
                    InnerSoftness: props.dve.borderInnerSoftness,
                    BevelSoftness: props.dve.borderBevelSoftness,
                    BevelPosition: props.dve.borderBevelPosition,
                    BorderOpacity: props.dve.borderOpacity,
                    BorderHue: props.dve.borderHue,
                    BorderSaturation: props.dve.borderSaturation,
                    BorderLuma: props.dve.borderLuma,
                    LightSourceDirection: props.dve.lightSourceDirection,
                    LightSourceAltitude: props.dve.lightSourceAltitude,
                    MaskTop: props.dve.maskTop,
                    MaskBottom: props.dve.maskBottom,
                    MaskLeft: props.dve.maskLeft,
                    MaskRight: props.dve.maskRight,
                    Mask: 2097151
                  })
                : null
            }
            className={props.flyEnabled ? 'ss-run-button' : 'ss-run-button disabled'}
          >
            Set B
          </div>
        </div>
      </div>

      <div className="ss-dve-style-heading">Run To:</div>
      <div className="ss-run-holder">
        <div
          onClick={() =>
            props.properties.isASet && props.flyEnabled
              ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: props.mixEffect,
                  KeyerIndex: props.keyerIndex,
                  KeyFrame: 1,
                  Mask: 0
                })
              : null
          }
          className={
            props.properties.isASet && props.flyEnabled
              ? props.properties.activeKeyFrame === 1
                ? 'ss-run-button active'
                : 'ss-run-button'
              : 'ss-run-button disabled'
          }
        >
          A
        </div>
        <div
          onClick={() =>
            props.properties.isBSet && props.flyEnabled
              ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: props.mixEffect,
                  KeyerIndex: props.keyerIndex,
                  KeyFrame: 2,
                  Mask: 0
                })
              : null
          }
          className={
            props.properties.isBSet && props.flyEnabled
              ? props.properties.activeKeyFrame === 2
                ? 'ss-run-button active'
                : 'ss-run-button'
              : 'ss-run-button disabled'
          }
        >
          B
        </div>
        <div
          onClick={() =>
            props.flyEnabled
              ? props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: props.mixEffect,
                  KeyerIndex: props.keyerIndex,
                  KeyFrame: 3,
                  Mask: 0
                })
              : null
          }
          className={
            props.flyEnabled
              ? props.properties.activeKeyFrame === 3
                ? 'ss-run-button active'
                : 'ss-run-button'
              : 'ss-run-button disabled'
          }
        >
          Full
        </div>
      </div>
      <div className="ss-dve-style-heading">Run To Infinite:</div>
      {getSwoosh()}
    </div>
  )
}
