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
    return (
      <input
        type="number"
        step={this.props.step || 0.01}
        disabled={this.props.disabled}
        onBlur={e => {
          this.setState({ focus: false })
          this.finishValue(e.currentTarget.value)
        }}
        onFocus={e => this.setState({ focus: true, tempValue: `${this.props.value}` })}
        onChange={e => this.setState({ tempValue: e.currentTarget.value })}
        value={this.state.focus ? this.state.tempValue : this.props.value}
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

export function DecimalWithSliderInput(props: DecimalInputProps & { label: string }) {
  return (
    <div className="ss-slider-holder">
      <div className={props.disabled ? 'sss ss-slider-outer disabled' : 'sss ss-slider-outer'}>
        <Slider tooltip={false} {...props} />
        <div className={props.disabled ? 'ss-slider-label disabled' : 'ss-slider-label'}>{props.label}:</div>
      </div>
      <DecimalInput {...props} />
    </div>
  )
}

export function DecimalInputWithLabel(props: DecimalInputProps & { label: string }) {
  return (
    <React.Fragment>
      <div className={props.disabled ? 'ss-label disabled' : 'ss-label'}>{props.label}:</div>
      <div className="ss-rate">
        {' '}
        <DecimalInput {...props} />
      </div>
    </React.Fragment>
  )
}
