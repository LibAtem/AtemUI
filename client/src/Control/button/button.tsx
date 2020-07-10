import React from 'react'
import buttonGrey from './images/button_new_low.png'
import buttonYellow from './images/button_yellow.png'
interface AtemButtonProps {
  callback: any
  active: boolean
  disabled?: boolean
  name: string
  className?: string
  update?: any
}

interface AtemButtonGenericProps {
  callback: any
  active: boolean | null
  // disabled?: boolean // TODO - use
  name: string
  textClassName?: string
  color: 'red' | 'green' | 'yellow'
}

export class AtemButtonGeneric extends React.Component<AtemButtonGenericProps> {
  // shouldComponentUpdate(nextProps : AtemButtonProps ) {
  //     const differentActive = this.props.active !== nextProps.active;
  //     const differentName = this.props.name !== nextProps.name
  //     return differentName || differentActive;
  // }

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

export class AtemButtonYellow extends React.Component<AtemButtonProps> {
  shouldComponentUpdate(nextProps: AtemButtonProps) {
    const differentActive = this.props.active !== nextProps.active
    const differentName = this.props.name !== nextProps.name
    const differentUpdate = this.props.update != nextProps.update
    return differentName || differentActive || differentUpdate
  }

  render() {
    if (this.props.active) {
      return (
        <div onMouseDown={this.props.callback} className="atem-button-holder yellow">
          <img height="50px" width="50px" src={buttonYellow}></img>
          <div className="atem-button-text">{this.props.name}</div>
        </div>
      )
    } else {
      return (
        <div onMouseDown={this.props.callback} className="atem-button-holder">
          <img height="50px" width="50px" src={buttonGrey}></img>
          <div className="atem-button-text">{this.props.name}</div>
        </div>
      )
    }
  }
}
