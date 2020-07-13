import React from 'react'
import _ from 'underscore'

interface AtemButtonGenericProps {
  callback: () => void
  active: boolean | null
  // disabled?: boolean // TODO - use
  name: string
  textClassName?: string
  color: 'red' | 'green' | 'yellow'
}

export class AtemButtonGeneric extends React.Component<AtemButtonGenericProps> {
  shouldComponentUpdate(nextProps: AtemButtonGenericProps) {
    return !_.isEqual(_.omit(nextProps, 'callback'), _.omit(this.props, 'callback'))
  }

  render() {
    let className = 'atem-button-holder '

    if (this.props.active === null) {
      className += `btn-${this.props.color}-flash`
    } else if (this.props.active !== false) {
      className += `btn-${this.props.color}`
    } else {
      className += 'btn-default'
    }

    return (
      <div onMouseDown={this.props.callback} className={className}>
        <div className={`atem-button-text ${this.props.textClassName}`}>{this.props.name}</div>
      </div>
    )
  }
}

interface AtemButtonBarProps<T> {
  style?: React.HTMLAttributes<HTMLDivElement>['style']
  innerStyle?: React.HTMLAttributes<HTMLDivElement>['style']
  selected: T
  disabled?: boolean
  options: Array<{
    value: T
    label: JSX.Element | string
    disabled?: boolean
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
                this.props.onChange(opt.value)
              }}
            >
              {opt.label}
            </div>
          )
        })}
      </div>
    )
  }
}
