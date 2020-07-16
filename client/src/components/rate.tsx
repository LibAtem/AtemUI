import React from 'react'
import { VideoModeInfoSet, LibAtemEnums } from '../generated'
import * as _ from 'underscore'

interface RateInputProps {
  callback: (frames: number) => void
  value: number
  disabled?: boolean
  videoMode: LibAtemEnums.VideoMode
  className?: string
  maxSeconds?: number
}
interface RateInputState {
  focus: boolean
  tempValue: string
}

export class RateInput extends React.Component<RateInputProps, RateInputState> {
  constructor(props: RateInputProps) {
    super(props)
    this.state = {
      focus: false,
      tempValue: this.framesToRate(this.props.value)
    }
  }

  shouldComponentUpdate(nextProps: RateInputProps, nextState: RateInputState) {
    return (
      !_.isEqual(_.omit(nextProps, 'callback'), _.omit(this.props, 'callback')) || !_.isEqual(nextState, this.state)
    )
  }

  private rateToFrames(rate: string): number {
    let res = 0

    const fps = VideoModeInfoSet[this.props.videoMode]?.framerate ?? 30
    const rateMatch = rate.match(/^(([0-9]*):|)([0-9]*)$/)
    if (rateMatch) {
      const frames = Number(rateMatch[3])
      const seconds = Number(rateMatch[2])
      if (!Number.isNaN(frames) && !Number.isNaN(seconds)) {
        res = seconds * fps + frames
      } else if (!Number.isNaN(frames)) {
        res = frames
      }
    }

    const max = this.props.maxSeconds ? this.props.maxSeconds * fps : 250
    return Math.min(res, max)
  }

  private framesToRate(frames: number) {
    const fps = VideoModeInfoSet[this.props.videoMode]?.framerate ?? 30
    const framesRemaining = `${frames % fps}`.padStart(2, '0')
    const seconds = Math.floor(frames / fps)
    return `${seconds}:${framesRemaining}`
  }

  private cleanRate(rate: string) {
    return this.framesToRate(this.rateToFrames(rate))
  }

  private onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ tempValue: e.currentTarget.value })
  }

  render() {
    const className = this.props.className || 'ss-rate-input'
    return (
      <input
        disabled={this.props.disabled}
        onBlur={e => {
          this.setState({ focus: false })
          this.props.callback(this.rateToFrames(this.state.tempValue))
        }}
        onFocus={e => this.setState({ focus: true, tempValue: this.framesToRate(this.props.value) })}
        value={this.state.focus ? this.state.tempValue : this.framesToRate(this.props.value)}
        onChange={e => this.onChange(e)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            this.props.callback(this.rateToFrames(this.state.tempValue))
            this.setState({ tempValue: this.cleanRate(this.state.tempValue) })
          }
        }}
        className={className}
      />
    )
  }
}
