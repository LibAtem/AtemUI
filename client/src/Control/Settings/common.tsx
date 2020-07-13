import React from 'react'
import { MagicInput } from './settings'

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
  const enabled = props.maskEnabled
  const labelClass = enabled ? 'ss-label' : 'ss-label disabled'

  return (
    <div className="ss-mask-box">
      <ToggleButton label="Mask" active={props.maskEnabled} onClick={() => props.setMaskEnabled(!props.maskEnabled)} />
      <div className="ss-mask-holder">
        <div className={labelClass}>Top:</div>
        <div className="ss-rate">
          {' '}
          <MagicInput
            disabled={!enabled}
            value={props.maskTop}
            callback={(value: any) => {
              if (value != '') {
                props.setMaskTop(Math.min(9, Math.max(-9, value)))
              }
            }}
          />
        </div>
        <div className={labelClass}>Bottom:</div>
        <div className="ss-rate">
          {' '}
          <MagicInput
            disabled={!enabled}
            value={props.maskBottom}
            callback={(value: any) => {
              if (value != '') {
                props.setMaskBottom(Math.min(9, Math.max(-9, value)))
              }
            }}
          />
        </div>
        <div className={labelClass}>Left:</div>
        <div className="ss-rate">
          {' '}
          <MagicInput
            disabled={!enabled}
            value={props.maskLeft}
            callback={(value: any) => {
              if (value != '') {
                props.setMaskLeft(Math.min(9, Math.max(-9, value)))
              }
            }}
          />
        </div>
        <div className={labelClass}>Right:</div>
        <div className="ss-rate">
          {' '}
          <MagicInput
            disabled={!enabled}
            value={props.maskRight}
            callback={(value: any) => {
              if (value != '') {
                props.setMaskRight(Math.min(9, Math.max(-9, value)))
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function ToggleButton(props: { label: string; active: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <div className="ss-circle-button-holder" onClick={() => props.onClick()}>
      <div className="ss-circle-button">{props.active ? <div className="ss-circle-button-inner"></div> : ''}</div>
      <div className={`ss-heading ${props.disabled ? 'disabled' : ''}`}>{props.label}</div>
    </div>
  )
}

interface TabPanelProps {
  default: number
}
export class TabPanel extends React.Component<TabPanelProps, { page: number }> {
  constructor(props: TabPanelProps) {
    super(props)

    this.state = {
      page: props.default
    }
  }
  render() {
    const children = React.Children.toArray(this.props.children)
    return (
      <div className="ss-submenu-box" style={{ overflow: 'hidden' }}>
        <div className="ss-submenu-submenu">
          {children.map((ch, i) => {
            const ch2 = ch as Partial<TabPanelTab>

            return (
              <div
                onClick={() => this.setState({ page: i })}
                className={this.state.page === i ? 'ss-submenu-submenu-item' : 'ss-submenu-submenu-item disabled'}
              >
                {ch2.props?.label ?? `Tab ${i}`}
              </div>
            )
          })}
        </div>

        {children[this.state.page]}
      </div>
    )
  }
}

export class TabPanelTab extends React.Component<{ label: string }> {
  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}
