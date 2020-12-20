import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils'
import React from 'react'
import { Form } from 'react-bootstrap'
import * as _ from 'underscore'

interface AudioNumericControlProps {
  onChange: (value: number) => void
  currentValue: number
}

interface AudioNumericControlState {
  newValue: string | null
}

export class AudioNumericControl extends React.Component<AudioNumericControlProps, AudioNumericControlState> {
  constructor(props: AudioNumericControlProps) {
    super(props)

    this.state = {
      newValue: null,
    }

    this.onKeyUp = this.onKeyUp.bind(this)
  }

  private onKeyUp(event: React.KeyboardEvent) {
    if (this.state.newValue && (event.code === 'Enter' || event.code === 'NumpadEnter')) {
      const newValue = parseInt(this.state.newValue.replace('+', ''))
      if (!isNaN(newValue)) {
        this.props.onChange(newValue)
      }
    }
  }

  render() {
    const { currentValue } = this.props
    const valueStr = (currentValue >= 0 ? '+' : '') + currentValue

    return (
      <div className="audio-numeric-control">
        <div className="control-content">{this.props.children}</div>
        <div className="control-input">
          <Form.Control
            type="text"
            value={this.state.newValue ?? valueStr}
            onChange={(e) => this.setState({ newValue: e.target.value })}
            onFocus={() => this.setState({ newValue: valueStr })}
            onBlur={() => this.setState({ newValue: null })}
            onKeyUp={this.onKeyUp}
          />
        </div>
      </div>
    )
  }
}

interface AudioDialControlProps {
  onChange: (value: number) => void
  minValue: number
  maxValue: number
  currentValue: number
  isActive: boolean
}
interface AudioDialControlState {
  downStart: { x: number; value: number } | null
}

export class AudioDialControl extends React.Component<AudioDialControlProps, AudioDialControlState> {
  private readonly valueRangeDegrees = 120

  private lastSentValue: number = 0

  constructor(props: AudioDialControlProps) {
    super(props)
    this.state = {
      downStart: null,
    }

    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
  }

  componentWillUnmount() {
    this.onMouseUp()
  }

  private onMouseUp(): void {
    this.setState({ downStart: null })
    document.body.removeEventListener('mousemove', this.onMouseMove)
    document.body.removeEventListener('mouseup', this.onMouseUp)
  }

  private onMouseMove(e: MouseEvent): void {
    const valueRange = this.props.maxValue - this.props.minValue
    const xPerIncrement = window.innerWidth / 4 / valueRange
    if (e.movementX !== 0 && this.state.downStart !== null) {
      const change = e.screenX - this.state.downStart.x
      const newValueRaw = this.state.downStart.value + Math.floor(change / xPerIncrement) // TODO - round?
      const newValue = Math.min(this.props.maxValue, Math.max(this.props.minValue, newValueRaw))

      if (newValue !== this.lastSentValue) {
        this.lastSentValue = newValue
        this.props.onChange(newValue)
      }
    }
  }

  private renderValueBorder(valueDegrees: number) {
    const { isActive } = this.props

    const size = 47
    const center = size / 2
    const radius = (size - 1) / 2

    function getPoint(deg: number): [number, number] {
      const angle = (deg - 90) * (Math.PI / 180)
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      return [x, y]
    }

    function getCurve(deg: number, color: string) {
      const [x1, y1] = getPoint(0)
      const [x2, y2] = getPoint(deg)
      return (
        <path
          d={`
          M ${x1}, ${y1}
          a ${radius},${radius} 0 0,${deg <= 0 ? 0 : 1} ${x2 - x1} ${y2 - y1}
          L ${center}, ${center}
          `}
          stroke="black"
          fill={color}
          stroke-width="0.5"
        />
      )
    }
    return (
      <svg width={size} height={size}>
        {getCurve(this.valueRangeDegrees, 'black')}
        {getCurve(-this.valueRangeDegrees, 'black')}

        {getCurve(valueDegrees, isActive ? '#ff7b00' : '#5e5e5e')}
      </svg>
    )
  }

  render() {
    const { minValue, maxValue, currentValue } = this.props

    const range = maxValue - minValue
    const pct = (currentValue - minValue) / range
    const deg = this.valueRangeDegrees * (pct * 2 - 1)

    return (
      <div>
        <div className="dial">
          <div className="dial-value">{this.renderValueBorder(deg)}</div>
          <div
            className="dial-spinner"
            style={{
              transform: `rotate(${deg}deg)`,
            }}
            onMouseDown={(e) => {
              if (this.state.downStart === null) {
                document.body.addEventListener('mousemove', this.onMouseMove)
                document.body.addEventListener('mouseup', this.onMouseUp)
                this.setState({ downStart: { x: e.screenX, value: this.props.currentValue } })

                this.lastSentValue = this.props.currentValue
              }
            }}
          >
            {/* TODO - replace this with an svg */}
          </div>
          <div className="dial-labels">
            <div>L</div>
            <div></div>
            <div>R</div>
          </div>
        </div>
      </div>
    )
  }
}
