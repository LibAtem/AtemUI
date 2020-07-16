import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { LibAtemCommands, LibAtemState, LibAtemEnums } from '../../../generated'
import { DVECommonProprties } from './dve'
import { RateInput } from '../../common'
import { RunButton, ToggleHeading } from '../../common'
import { literal } from '../../../util'
import * as _ from 'underscore'
import { FlyingPatternInfo, FlyingPatternImage } from './flying-pattern'

export function FlyingKeyerProperties(props: {
  sendCommand: SendCommandStrict
  keyerIndex: number
  meIndex: number
  flyEnabled: boolean
  keyerProps: LibAtemState.MixEffectState_KeyerDVEState
}) {
  return (
    <>
      <ToggleHeading
        active={props.flyEnabled}
        label="Flying Key"
        onClick={v =>
          props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyTypeSetCommand', {
            MixEffectIndex: props.meIndex,
            KeyerIndex: props.keyerIndex,
            Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyTypeSetCommand_MaskFlags.FlyEnabled,
            FlyEnabled: v
          })
        }
      />

      <DVECommonProprties
        sendCommand={props.sendCommand}
        meIndex={props.meIndex}
        keyerIndex={props.keyerIndex}
        keyerProps={props.keyerProps}
        disabled={!props.flyEnabled}
      />
    </>
  )
}

interface FlyingKeyFramePropertiesProps {
  sendCommand: SendCommandStrict
  meIndex: number
  keyerIndex: number
  flyEnabled: boolean
  flyProps: LibAtemState.MixEffectState_KeyerFlyProperties
  keyerProps: LibAtemState.MixEffectState_KeyerDVEState
  videoMode: LibAtemEnums.VideoMode
}
export class FlyingKeyFrameProperties extends React.Component<FlyingKeyFramePropertiesProps> {
  constructor(props: FlyingKeyFramePropertiesProps) {
    super(props)

    this.setKeyframe = this.setKeyframe.bind(this)
    this.runToInfinite = this.runToInfinite.bind(this)
  }

  private runToInfinite(target: LibAtemEnums.FlyKeyLocation) {
    if (this.props.flyEnabled) {
      this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
        MixEffectIndex: this.props.meIndex,
        KeyerIndex: this.props.keyerIndex,
        KeyFrame: LibAtemEnums.FlyKeyKeyFrameType.RunToInfinite,
        Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyFlyRunSetCommand_MaskFlags.RunToInfinite,
        RunToInfinite: target
      })
    }
  }

  private createIcon(currentStyle: LibAtemEnums.FlyKeyLocation | null, style: LibAtemEnums.FlyKeyLocation, i: number) {
    let classes = 'ss-dve-style-item'
    if (!this.props.flyEnabled) {
      classes += ' disabled'
    } else if (currentStyle === style) {
      classes += 'selected'
    }

    return (
      <div key={i} onClick={() => this.runToInfinite(style)} className={classes}>
        <FlyingPatternImage isCurrent={currentStyle === style} style={style} />
      </div>
    )
  }

  private setKeyframe(keyframe: LibAtemEnums.FlyKeyKeyFrameId) {
    const maskVals = Object.values(LibAtemCommands.MixEffects_Key_MixEffectKeyFlyKeyframeSetCommand_MaskFlags).filter(
      v => typeof v === 'number'
    ) as number[]

    this.props.sendCommand(
      'LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyKeyframeSetCommand',
      literal<Required<LibAtemCommands.MixEffects_Key_MixEffectKeyFlyKeyframeSetCommand>>({
        MixEffectIndex: this.props.meIndex,
        KeyerIndex: this.props.keyerIndex,
        KeyFrame: keyframe,
        SizeX: this.props.keyerProps.sizeX,
        SizeY: this.props.keyerProps.sizeY,
        PositionX: this.props.keyerProps.positionX,
        PositionY: this.props.keyerProps.positionY,
        Rotation: this.props.keyerProps.rotation,
        OuterWidth: this.props.keyerProps.borderOuterWidth,
        InnerWidth: this.props.keyerProps.borderInnerWidth,
        OuterSoftness: this.props.keyerProps.borderOuterSoftness,
        InnerSoftness: this.props.keyerProps.borderInnerSoftness,
        BevelSoftness: this.props.keyerProps.borderBevelSoftness,
        BevelPosition: this.props.keyerProps.borderBevelPosition,
        BorderOpacity: this.props.keyerProps.borderOpacity,
        BorderHue: this.props.keyerProps.borderHue,
        BorderSaturation: this.props.keyerProps.borderSaturation,
        BorderLuma: this.props.keyerProps.borderLuma,
        LightSourceDirection: this.props.keyerProps.lightSourceDirection,
        LightSourceAltitude: this.props.keyerProps.lightSourceAltitude,
        MaskTop: this.props.keyerProps.maskTop,
        MaskBottom: this.props.keyerProps.maskBottom,
        MaskLeft: this.props.keyerProps.maskLeft,
        MaskRight: this.props.keyerProps.maskRight,
        Mask: (_.max(maskVals) << 1) - 1
      })
    )
  }

  render() {
    const currentInfinite =
      this.props.flyProps.activeKeyFrame === LibAtemEnums.FlyKeyKeyFrameType.RunToInfinite
        ? this.props.flyProps.runToInfinite
        : null

    return (
      <>
        <div className={this.props.flyEnabled ? 'atem-label' : 'atem-label disabled'}>Rate:</div>
        <div className="ss-rate">
          <RateInput
            disabled={!this.props.flyEnabled}
            videoMode={this.props.videoMode}
            value={this.props.keyerProps.rate}
            maxSeconds={10}
            callback={(e: number) =>
              this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand', {
                MixEffectIndex: this.props.meIndex,
                KeyerIndex: this.props.keyerIndex,
                Mask: LibAtemCommands.MixEffects_Key_MixEffectKeyDVESetCommand_MaskFlags.Rate,
                Rate: e
              })
            }
          />
        </div>

        <div className={this.props.flyEnabled ? 'atem-label' : 'atem-label disabled'}>KeyFrame:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 50px 1fr', gridColumnGap: '5px' }}>
          <RunButton
            label="Set A"
            disabled={!this.props.flyEnabled}
            onClick={() => this.setKeyframe(LibAtemEnums.FlyKeyKeyFrameId.One)}
          />
          <RunButton
            label="Set B"
            disabled={!this.props.flyEnabled}
            onClick={() => this.setKeyframe(LibAtemEnums.FlyKeyKeyFrameId.Two)}
          />
        </div>

        <div className="fly-run-holder">
          <div className="ss-dve-style-heading">Run To:</div>
          <div className="ss-run-holder">
            <RunButton
              label="A"
              disabled={!this.props.flyEnabled || !this.props.flyProps.isASet}
              active={this.props.flyProps.activeKeyFrame === LibAtemEnums.FlyKeyKeyFrameType.A}
              onClick={() =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  KeyFrame: LibAtemEnums.FlyKeyKeyFrameType.A,
                  Mask: 0
                })
              }
            />
            <RunButton
              label="B"
              disabled={!this.props.flyEnabled || !this.props.flyProps.isBSet}
              active={this.props.flyProps.activeKeyFrame === LibAtemEnums.FlyKeyKeyFrameType.B}
              onClick={() =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  KeyFrame: LibAtemEnums.FlyKeyKeyFrameType.B,
                  Mask: 0
                })
              }
            />
            <RunButton
              label="Full"
              disabled={!this.props.flyEnabled}
              active={this.props.flyProps.activeKeyFrame === LibAtemEnums.FlyKeyKeyFrameType.Full}
              onClick={() =>
                this.props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyFlyRunSetCommand', {
                  MixEffectIndex: this.props.meIndex,
                  KeyerIndex: this.props.keyerIndex,
                  KeyFrame: LibAtemEnums.FlyKeyKeyFrameType.Full,
                  Mask: 0
                })
              }
            />
          </div>
          <div className="ss-dve-style-heading">Run To Infinite:</div>
          <div style={{ marginBottom: '20px' }} className="ss-dve-style-holder">
            {FlyingPatternInfo.map((info, i) => {
              if (info.icon2 !== undefined) {
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    {this.createIcon(currentInfinite, info.icon, 0)}
                    {this.createIcon(currentInfinite, info.icon2, 1)}
                  </div>
                )
              }
              return this.createIcon(currentInfinite, info.icon, i)
            })}
          </div>
        </div>
      </>
    )
  }
}
