import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { DropdownItemProps } from 'react-bootstrap/esm/DropdownItem'

interface DropdownMenuProps {
  resetAll?: boolean
  className?: string
  style?: React.CSSProperties
}

export class DropdownMenu extends React.Component<DropdownMenuProps> {
  render() {
    return (
      <Dropdown className={`right ${this.props.className ?? ''}`} style={this.props.style}>
        <Dropdown.Toggle variant="reset">
          <FontAwesomeIcon icon={faBars} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {this.props.children}

          {this.props.resetAll ? (
            <>
              <hr />
              <Dropdown.Item
                onClick={e => {
                  // Slightly hacky 'click' on every other option
                  const children = React.Children.toArray(this.props.children) as Array<{
                    props?: DropdownMenuItemProps
                  }>
                  console.log(children)
                  children.forEach(ch => (ch.props?.onClick && !ch.props.skipInAll ? ch.props.onClick(e) : null))
                }}
              >
                Reset All
              </Dropdown.Item>
            </>
          ) : (
            undefined
          )}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

interface DropdownMenuItemProps extends DropdownItemProps {
  skipInAll?: boolean
}
export class DropdownMenuItem extends React.Component<DropdownMenuItemProps> {
  render() {
    return <Dropdown.Item {...this.props}>{this.props.children}</Dropdown.Item>
  }
}
