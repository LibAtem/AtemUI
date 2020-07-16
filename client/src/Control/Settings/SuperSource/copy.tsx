import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { LibAtemState, LibAtemEnums } from '../../../generated'
import { CheckboxInput, RunButton } from '../../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { literal } from '../../../util'
import { BoxPropsValues, setBoxProps } from './layouts'

interface SuperSourceBoxCopySettingsProps {
  sendCommand: SendCommandStrict
  index: number
  boxProps: LibAtemState.SuperSourceState_BoxState[]
  version: LibAtemEnums.ProtocolVersion | undefined
}
interface SuperSourceBoxCopySettingsState {
  source: number
  targets: number[]
}

export class SuperSourceBoxCopySettings extends React.Component<
  SuperSourceBoxCopySettingsProps,
  SuperSourceBoxCopySettingsState
> {
  constructor(props: SuperSourceBoxCopySettingsProps) {
    super(props)

    this.state = {
      source: 0,
      targets: []
    }

    this.doCopy = this.doCopy.bind(this)
  }

  private doCopy() {
    const fromBox = this.props.boxProps[this.state.source]
    if (fromBox) {
      const values = literal<Omit<BoxPropsValues, 'BoxIndex'>>({
        Enabled: fromBox.enabled,
        PositionX: fromBox.positionX,
        PositionY: fromBox.positionY,
        Size: fromBox.size,
        Cropped: fromBox.cropped,
        CropTop: fromBox.cropTop,
        CropBottom: fromBox.cropBottom,
        CropLeft: fromBox.cropLeft,
        CropRight: fromBox.cropRight
      })

      for (const target of this.state.targets) {
        setBoxProps(this.props.sendCommand, this.props.version, this.props.index, {
          BoxIndex: target,
          ...values
        })
      }
    }
  }

  render() {
    return (
      <div className="ss-ssrc-copy-boxes">
        <div>
          <div className="atem-heading">From:</div>

          <div className="ss-boxes-option-group">
            {this.props.boxProps.map((box, i) => (
              <CheckboxInput
                label={`Box ${i + 1}`}
                value={this.state.source === i}
                onChange={v => {
                  if (v) {
                    this.setState({ source: i })
                  }
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
        <div>
          <div className="atem-heading">To:</div>

          <div className="ss-boxes-option-group">
            {this.props.boxProps.map((box, i) => {
              const isTarget = this.state.targets.indexOf(i) !== -1
              return (
                <CheckboxInput
                  label={`Box ${i + 1}`}
                  value={isTarget}
                  onChange={v => {
                    if (v && !isTarget) {
                      this.setState({
                        targets: [...this.state.targets, i]
                      })
                    } else if (!v && isTarget) {
                      this.setState({ targets: this.state.targets.filter(v => v !== i) })
                    }
                  }}
                />
              )
            })}
            <CheckboxInput
              label="All Boxes"
              value={
                this.props.boxProps.filter((b, i) => this.state.targets.indexOf(i) !== -1).length ===
                this.props.boxProps.length
              }
              onChange={v => {
                if (v) {
                  this.setState({ targets: this.props.boxProps.map((b, i) => i) })
                } else {
                  this.setState({ targets: [] })
                }
              }}
            />
          </div>
        </div>
        <div></div>
        <div></div>
        <div>
          <RunButton
            label="Copy"
            onClick={this.doCopy}
            style={{ width: '90%' }}
            disabled={this.state.targets.length === 0}
          />
        </div>
      </div>
    )
  }
}
