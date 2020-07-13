import React from 'react'
import { DecimalInput, CheckboxInput } from '../common'
import { DecimalWithSliderInput, DecimalInputWithLabel } from '../common/decimal'

interface MaskPropertiesProps {
  maskEnabled: boolean
  maskTop: number
  maskBottom: number
  maskLeft: number
  maskRight: number

  setMaskEnabled: (val: boolean) => void
  setMaskTop: (val: number) => void
  setMaskBottom: (val: number) => void
  setMaskLeft: (val: number) => void
  setMaskRight: (val: number) => void
}

export function MaskProperties(props: MaskPropertiesProps) {
  return (
    <div className="ss-mask-box">
      <ToggleButton label="Mask" active={props.maskEnabled} onClick={v => props.setMaskEnabled(v)} />

      <div className="ss-mask-holder">
        <DecimalInputWithLabel
          label="Top"
          disabled={!props.maskEnabled}
          value={props.maskTop}
          step={0.01}
          min={-9}
          max={9}
          onChange={value => props.setMaskTop(value)}
        />
        <DecimalInputWithLabel
          label="Bottom"
          disabled={!props.maskEnabled}
          value={props.maskBottom}
          step={0.01}
          min={-9}
          max={9}
          onChange={value => props.setMaskBottom(value)}
        />
        <DecimalInputWithLabel
          label="Left"
          disabled={!props.maskEnabled}
          value={props.maskLeft}
          step={0.01}
          min={-16}
          max={16}
          onChange={value => props.setMaskLeft(value)}
        />
        <DecimalInputWithLabel
          label="Right"
          disabled={!props.maskEnabled}
          value={props.maskRight}
          step={0.01}
          min={-16}
          max={16}
          onChange={value => props.setMaskRight(value)}
        />
      </div>
    </div>
  )
}

interface PreMultipliedKeyPropertiesProps {
  disabled?: boolean

  enabled: boolean
  clip: number
  gain: number
  invert: boolean

  setEnabled: (val: boolean) => void
  setClip: (val: number) => void
  setGain: (val: number) => void
  setInvert: (val: boolean) => void
}

export function PreMultipliedKeyProperties(props: PreMultipliedKeyPropertiesProps) {
  const disableControls = props.enabled || props.disabled

  return (
    <div className="ss-pmk">
      <ToggleButton
        disabled={props.disabled}
        active={props.enabled}
        label={'Pre Multiplied Key'}
        onClick={() => props.setEnabled(!props.enabled)}
      />

      <DecimalWithSliderInput
        disabled={disableControls}
        label="Clip"
        value={props.clip}
        step={0.1}
        min={0}
        max={100}
        onChange={e => props.setClip(e)}
      />

      <DecimalWithSliderInput
        disabled={disableControls}
        label="Gain"
        value={props.gain}
        step={0.1}
        min={0}
        max={100}
        onChange={e => props.setGain(e)}
      />

      <CheckboxInput
        label="Invert"
        disabled={disableControls}
        value={props.invert}
        onChange={e => props.setInvert(e)}
      />
    </div>
  )
}

export function ToggleButton(props: {
  label: string
  active: boolean
  onClick: (val: boolean) => void
  disabled?: boolean
}) {
  return (
    <div
      className="ss-circle-button-holder"
      onClick={() => (!props.disabled ? props.onClick(!props.active) : undefined)}
    >
      <div className="ss-circle-button">{props.active ? <div className="ss-circle-button-inner"></div> : ''}</div>
      <div className={`ss-heading ${props.disabled ? 'disabled' : ''}`}>{props.label}</div>
    </div>
  )
}

interface TabPanelProps {
  page: number
  onChange: (newPage: number) => void
}
export class TabPanel extends React.Component<TabPanelProps> {
  render() {
    const children = React.Children.toArray(this.props.children)
      .filter(ch => (ch as Partial<TabPanelTab>).props?.id !== undefined)
      .map(ch => ch as TabPanelTab)
    return (
      <div className="ss-submenu-box" style={{ overflow: 'hidden' }}>
        <div className="ss-submenu-submenu">
          {children.map(ch => {
            let classes = 'ss-submenu-submenu-item'
            if (ch.props.disabled) {
              classes += ' disabled'
            } else if (this.props.page !== ch.props.id) {
              classes += ' inactive'
            }
            return (
              <div
                onClick={() => {
                  if (!ch.props.disabled) {
                    this.props.onChange(ch.props.id)
                  }
                }}
                className={classes}
              >
                {ch.props?.label ?? `?`}
              </div>
            )
          })}
        </div>

        {children.find(ch => ch.props.id === this.props.page && !ch.props.disabled)}
      </div>
    )
  }
}

export class TabPanelTab extends React.Component<{ id: number; label: string; disabled?: boolean }> {
  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}
