import React from 'react'
import Slider from 'react-rangeslider'

interface DecimalInputProps {
  onChange: (value: number) => void
  value: number
  disabled?: boolean
  step: number
  min?: number
  max?: number
}
interface DecimalInputState {
  focus: boolean
  tempValue: string
}
export class DecimalInput extends React.Component<DecimalInputProps, DecimalInputState> {
  constructor(props: DecimalInputProps) {
    super(props)
    this.state = {
      focus: false,
      tempValue: `0`
    }
  }

  private finishValue(val: string) {
    let valNum = Number(val)
    if (val !== '' && !isNaN(valNum)) {
      if (this.props.max !== undefined) {
        valNum = Math.min(this.props.max, valNum)
      }
      if (this.props.min !== undefined) {
        valNum = Math.max(this.props.min, valNum)
      }

      this.props.onChange(valNum)
    }
  }

  render() {
    const step = this.props.step || 0.01
    const roundedValue = Math.round(this.props.value / step) * step

    return (
      <input
        type="number"
        step={step}
        disabled={this.props.disabled}
        onBlur={e => {
          this.setState({ focus: false })
          this.finishValue(e.currentTarget.value)
        }}
        onFocus={e => this.setState({ focus: true, tempValue: `${roundedValue}` })}
        onChange={e => this.setState({ tempValue: e.currentTarget.value })}
        value={this.state.focus ? this.state.tempValue : roundedValue}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            this.finishValue(e.currentTarget.value)
          }
        }}
        className="ss-rate-input"
      />
    )
  }
}

export function DecimalInputWithLabel(props: DecimalInputProps & { label: string }) {
  return (
    <React.Fragment>
      <div className={props.disabled ? 'atem-label disabled' : 'atem-label'}>{props.label}:</div>
      <div className="ss-rate">
        {' '}
        <DecimalInput {...props} />
      </div>
    </React.Fragment>
  )
}

export function DecimalWithSliderInput(props: DecimalInputProps & { label: string }) {
  return (
    <div className="atem-slider-holder">
      <div className={`atem-slider-holder-inner ${props.disabled ? 'disabled' : ''}`}>
        <Slider tooltip={false} {...props} />
        <div className={`atem-slider-label ${props.disabled ? 'disabled' : ''}`}>{props.label}:</div>
      </div>
      <DecimalInput {...props} />
    </div>
  )
}
