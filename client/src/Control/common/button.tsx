import React from 'react'
import _ from 'underscore'

interface AtemButtonGenericProps {
  callback: () => void
  active: boolean | null
  disabled?: boolean
  name: string
  textClassName?: string
  color: 'red' | 'green' | 'yellow'
}

export class AtemButtonGeneric extends React.Component<AtemButtonGenericProps> {
  constructor(props: AtemButtonGenericProps) {
    super(props)

    this.onClick = this.onClick.bind(this)
  }

  shouldComponentUpdate(nextProps: AtemButtonGenericProps) {
    return !_.isEqual(_.omit(nextProps, 'callback'), _.omit(this.props, 'callback'))
  }

  private onClick() {
    if (!this.props.disabled) {
      this.props.callback()
    }
  }

  render() {
    let className = 'atem-button-holder '

    if (this.props.disabled) {
      className += `btn-disabled`
    } else if (this.props.active === null) {
      className += `btn-${this.props.color}-flash`
    } else if (this.props.active !== false) {
      className += `btn-${this.props.color}`
    } else {
      className += 'btn-default'
    }

    return (
      <div onMouseDown={this.onClick} className={className}>
        <div className={`atem-button-text ${this.props.textClassName}`}>{this.props.name}</div>
      </div>
    )
  }
}

interface AtemButtonBarProps<T> {
  style?: React.CSSProperties
  innerStyle?: React.CSSProperties
  selected: T
  disabled?: boolean
  options: Array<{
    value: T
    label: JSX.Element | string
    disabled?: boolean
    tooltip?: string
  }>
  onChange: (val: T) => void
}
export class AtemButtonBar<T> extends React.Component<AtemButtonBarProps<T>> {
  render() {
    return (
      <div className="button-bar" style={this.props.style}>
        {this.props.options.map((opt, i) => {
          let classes = 'button-bar-inner'
          if (opt.value === this.props.selected) {
            classes += ' button-bar-inner-selected'
          }
          if (opt.disabled || this.props.disabled) {
            classes += ' disabled'
          }

          return (
            <div
              key={i}
              className={classes}
              style={this.props.innerStyle}
              onClick={() => {
                if (!this.props.disabled && !opt.disabled) {
                  this.props.onChange(opt.value)
                }
              }}
              title={opt.tooltip}
            >
              {opt.label}
            </div>
          )
        })}
      </div>
    )
  }
}

interface CheckboxInputProps {
  label: string
  disabled?: boolean
  value: boolean
  onChange: (val: boolean) => void
  style?: React.CSSProperties
}
export function CheckboxInput(props: CheckboxInputProps) {
  return (
    <label
      className={props.disabled ? 'atem-checkbox-container disabled' : 'atem-checkbox-container'}
      style={props.style}
    >
      {props.label}
      <input
        type="checkbox"
        disabled={props.disabled}
        checked={props.value}
        onChange={e => {
          if (!props.disabled) {
            props.onChange(e.currentTarget.checked)
          }
        }}
      />
      <span className={props.disabled ? 'checkmark disabled' : 'checkmark'}></span>
    </label>
  )
}

interface RunButtonProps {
  label: string
  disabled?: boolean
  active?: boolean
  onClick: () => void
  style?: React.CSSProperties
}
export function RunButton(props: RunButtonProps) {
  let classes = 'ss-run-button'
  if (props.disabled) {
    classes += ' disabled'
  } else if (props.active) {
    classes += ' active'
  }
  return (
    <div
      style={props.style ?? { width: '50px' }}
      onClick={() => (!props.disabled ? props.onClick() : undefined)}
      className={classes}
    >
      {props.label}
    </div>
  )
}

export function ToggleHeading(props: {
  label: string | JSX.Element
  active: boolean
  onClick: (val: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="atem-toggle-heading-holder">
      <div
        className="atem-toggle-circle-button"
        onClick={() => (!props.disabled ? props.onClick(!props.active) : undefined)}
      >
        {props.active ? <div className="atem-toggle-circle-button-inner"></div> : ''}
      </div>
      <div
        className={`atem-heading ${props.disabled ? 'disabled' : ''}`}
        onClick={() => (!props.disabled ? props.onClick(!props.active) : undefined)}
      >
        {props.label}
      </div>
    </div>
  )
}
