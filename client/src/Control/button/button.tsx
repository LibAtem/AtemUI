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
