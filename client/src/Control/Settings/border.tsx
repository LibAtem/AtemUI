import React from 'react'
import { LibAtemEnums } from '../../generated'
import { ChromePicker } from 'react-color'
import { ToggleHeading, SelectInput, DecimalWithSliderInput, DecimalInput } from '../common'

const BorderBevelOptions: Array<{ id: LibAtemEnums.BorderBevel; label: string }> = [
  {
    id: LibAtemEnums.BorderBevel.None,
    label: 'No Bevel'
  },
  {
    id: LibAtemEnums.BorderBevel.InOut,
    label: 'Bevel In Out'
  },
  {
    id: LibAtemEnums.BorderBevel.In,
    label: 'Bevel In'
  },
  {
    id: LibAtemEnums.BorderBevel.Out,
    label: 'Bevel Out'
  }
]

interface BorderPropertiesProps {
  isSsrc?: boolean
  disabled?: boolean

  enabled: boolean
  color: { h: number; s: number; l: number }
  bevel: LibAtemEnums.BorderBevel
  OuterWidth: number
  innerWidth: number
  outerSoftness: number
  innerSoftness: number
  opacity: number
  bevelPosition: number
  bevelSoftness: number

  setEnabled: (val: boolean) => void
  setColor: (col: { h: number; s: number; l: number }) => void
  setBevel: (val: LibAtemEnums.BorderBevel) => void
  setOuterWidth: (val: number) => void
  setInnerWidth: (val: number) => void
  setOuterSoftness: (val: number) => void
  setInnerSoftness: (val: number) => void
  setOpacity: (val: number) => void
  setBevelPosition: (val: number) => void
  setBevelSoftness: (val: number) => void
}

export class BorderProperties extends React.Component<BorderPropertiesProps, { displayColorPicker: boolean }> {
  constructor(props: BorderPropertiesProps) {
    super(props)
    this.state = {
      displayColorPicker: false
    }
  }

  render() {
    const enabled = this.props.enabled && !this.props.disabled
    const disableBevel = !enabled || (this.props.isSsrc && this.props.bevel === LibAtemEnums.BorderBevel.None)

    const colorPicker =
      this.state.displayColorPicker && !this.props.disabled ? (
        <div className="color-picker-popover">
          <div className="color-picker-cover" onClick={() => this.setState({ displayColorPicker: false })} />
          <ChromePicker
            onChange={color => this.props.setColor({ h: color.hsl.h, s: color.hsl.s * 100, l: color.hsl.l * 100 })}
            disableAlpha={true}
            color={this.props.color}
          />
        </div>
      ) : null

    return (
      <div className="atem-form">
        <ToggleHeading
          active={enabled}
          label="Border"
          onClick={v => this.props.setEnabled(v)}
          disabled={this.props.disabled}
        />

        <div className={enabled ? 'atem-label' : 'atem-label disabled'}>Color: </div>
        <div className="ss-color-inner">
          <div
            className="ss-color-picker"
            onClick={() => (enabled ? this.setState({ displayColorPicker: !this.state.displayColorPicker }) : null)}
            style={{
              background: `hsl(${this.props.color.h}, ${this.props.color.s}%, ${this.props.color.l}%)`,
              opacity: enabled ? 1 : 0.5
            }}
          ></div>
          {colorPicker}
        </div>

        <SelectInput
          label="Bevel"
          value={this.props.bevel}
          disabled={!enabled}
          options={BorderBevelOptions}
          onChange={e => this.props.setBevel(e)}
        />

        <DecimalWithSliderInput
          label="Outer Width"
          step={0.01}
          min={0}
          max={16}
          disabled={!enabled}
          value={this.props.OuterWidth}
          onChange={e => this.props.setOuterWidth(e)}
        />

        <DecimalWithSliderInput
          label="Inner Width"
          step={0.01}
          min={0}
          max={16}
          disabled={!enabled}
          value={this.props.innerWidth}
          onChange={e => this.props.setInnerWidth(e)}
        />

        <DecimalWithSliderInput
          label="Outer Soften"
          step={1}
          min={0}
          max={100}
          disabled={!enabled}
          value={this.props.outerSoftness}
          onChange={e => this.props.setOuterSoftness(e)}
        />

        <DecimalWithSliderInput
          label="Inner Soften"
          step={1}
          min={0}
          max={100}
          disabled={!enabled}
          value={this.props.innerSoftness}
          onChange={e => this.props.setInnerSoftness(e)}
        />

        {!this.props.isSsrc ? (
          <DecimalWithSliderInput
            label="Border Opacity"
            step={1}
            min={0}
            max={100}
            disabled={!enabled}
            value={this.props.opacity}
            onChange={e => this.props.setOpacity(e)}
          />
        ) : (
          undefined
        )}

        <DecimalWithSliderInput
          label="Bevel Position"
          step={1}
          min={0}
          max={100}
          disabled={disableBevel}
          value={this.props.bevelPosition}
          onChange={e => this.props.setBevelPosition(e)}
        />

        <DecimalWithSliderInput
          label="Bevel Soften"
          step={1}
          min={0}
          max={100}
          disabled={disableBevel}
          value={this.props.bevelSoftness}
          onChange={e => this.props.setBevelSoftness(e)}
        />
      </div>
    )
  }
}

interface ShadowPropertiesProps {
  disabled?: boolean

  direction: number
  altitude: number

  setDirection: (val: number) => void
  setAltitude: (val: number) => void
}
export function ShadowProperties(props: ShadowPropertiesProps) {
  const labelClass = !props.disabled ? 'atem-label' : 'atem-label disabled'

  return (
    <div style={{ gridTemplateRows: '1fr' }} className="ss-mask-holder">
      <div className={labelClass}>Angle:</div>
      <div className="ss-rate">
        {' '}
        <DecimalInput
          step={1}
          min={0}
          max={359}
          disabled={props.disabled}
          value={props.direction}
          onChange={value => props.setDirection(value)}
        />
      </div>
      <div className={labelClass}>Altitude:</div>
      <div className="ss-rate">
        {' '}
        <DecimalInput
          step={1}
          min={10}
          max={100}
          disabled={props.disabled}
          value={props.altitude}
          onChange={value => props.setAltitude(value)}
        />
      </div>
    </div>
  )
}
