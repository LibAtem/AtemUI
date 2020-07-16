import React from 'react'
import { CheckboxInput, ToggleHeading, DecimalWithSliderInput, DecimalInputWithLabel } from '../common'

interface MaskPropertiesProps {
  type: 'key' | 'dve' | 'ssrc-box'
  disabled?: boolean

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
  const minY = props.type === 'dve' ? 0 : -9
  const maxY = props.type === 'dve' ? 38 : props.type === 'ssrc-box' ? 18 : 9

  const minX = props.type === 'dve' ? 0 : -16
  const maxX = props.type === 'dve' ? 53 : props.type === 'ssrc-box' ? 32 : 16

  return (
    <div className="atem-form">
      <ToggleHeading
        label={props.type === 'ssrc-box' ? 'Crop' : 'Mask'}
        active={props.maskEnabled}
        disabled={props.disabled}
        onClick={v => props.setMaskEnabled(v)}
      />

      <div className="ss-mask-holder">
        <DecimalInputWithLabel
          label="Top"
          disabled={!props.maskEnabled || props.disabled}
          value={props.maskTop}
          step={0.01}
          min={minY}
          max={maxY}
          onChange={value => props.setMaskTop(value)}
        />
        <DecimalInputWithLabel
          label="Bottom"
          disabled={!props.maskEnabled || props.disabled}
          value={props.maskBottom}
          step={0.01}
          min={minY}
          max={maxY}
          onChange={value => props.setMaskBottom(value)}
        />
        <DecimalInputWithLabel
          label="Left"
          disabled={!props.maskEnabled || props.disabled}
          value={props.maskLeft}
          step={0.01}
          min={minX}
          max={maxX}
          onChange={value => props.setMaskLeft(value)}
        />
        <DecimalInputWithLabel
          label="Right"
          disabled={!props.maskEnabled || props.disabled}
          value={props.maskRight}
          step={0.01}
          min={minX}
          max={maxX}
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
    <div className="atem-form">
      <ToggleHeading
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
        style={{ gridColumn: 'span 2' }}
        value={props.invert}
        onChange={e => props.setInvert(e)}
      />
    </div>
  )
}

interface TabPanelProps {
  page: number
  onChange: (newPage: number) => void
  hideSingle?: boolean
}
export class TabPanel extends React.Component<TabPanelProps> {
  render() {
    const children = React.Children.toArray(this.props.children)
      .filter(ch => (ch as Partial<TabPanelTab>).props?.id !== undefined)
      .map(ch => ch as TabPanelTab)
    return (
      <div className="ss-submenu-box" style={{ overflow: 'hidden' }}>
        <div className="ss-submenu-submenu">
          {children.length <= 1 && this.props.hideSingle
            ? undefined
            : children.map(ch => {
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

        <div>{children.find(ch => ch.props.id === this.props.page && !ch.props.disabled)}</div>
      </div>
    )
  }
}

export class TabPanelTab extends React.Component<{ id: number; label: string; disabled?: boolean }> {
  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}
