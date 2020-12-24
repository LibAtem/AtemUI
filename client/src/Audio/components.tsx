import React from 'react'
import { Form } from 'react-bootstrap'
import Slider from 'react-rangeslider'
import * as _ from 'underscore'
import { LibAtemEnums, LibAtemState } from '../generated'

interface AudioNumericControlProps {
  onChange: (value: number) => void
  currentValue: number
  fixedPoint?: number
  negativeInfinity?: number
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
      let newValue = parseInt(this.state.newValue.replace('+', ''))
      if (this.props.negativeInfinity !== undefined) {
        if (this.state.newValue.trim().toLowerCase() === '-inf') {
          newValue = this.props.negativeInfinity
        }
      }
      if (!isNaN(newValue)) {
        this.props.onChange(newValue)
      }
    }
  }

  render() {
    const { currentValue, fixedPoint, negativeInfinity } = this.props
    const valueStr =
      negativeInfinity !== undefined && currentValue <= negativeInfinity
        ? '-inf'
        : (currentValue >= 0 ? '+' : '') + (fixedPoint !== undefined ? currentValue.toFixed(fixedPoint) : currentValue)

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

  borderType: 'normal' | 'split'
  activeDialColor: string
  labelL: string
  labelR: string
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

  render() {
    const { minValue, maxValue, currentValue, isActive, labelL, labelR, activeDialColor, borderType } = this.props

    const range = maxValue - minValue
    const pct = (currentValue - minValue) / range
    const deg = this.valueRangeDegrees * (pct * 2 - 1)

    return (
      <div className="dial">
        <div className="dial-value">
          <DialValueBorder
            deg={deg}
            isActive={isActive}
            valueRangeDegrees={this.valueRangeDegrees}
            activeDialColor={activeDialColor}
            borderType={borderType}
          />
        </div>
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
          <div>{labelL}</div>
          <div>{labelR}</div>
        </div>
      </div>
    )
  }
}

function DialValueBorder({
  isActive,
  valueRangeDegrees,
  deg,
  activeDialColor,
  borderType,
}: {
  isActive: boolean
  valueRangeDegrees: number
  deg: number
  activeDialColor: string
  borderType: 'normal' | 'split'
}) {
  const size = 47
  const center = size / 2
  const radius = (size - 1) / 2

  function getPoint(deg: number): [number, number] {
    const angle = (deg - 90) * (Math.PI / 180)
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    return [x, y]
  }

  function getCurve(fromDeg: number, toDeg: number, color: string) {
    const [x1, y1] = getPoint(fromDeg)
    const [x2, y2] = getPoint(toDeg)

    const longArc = Math.abs(fromDeg - toDeg) >= 180 ? 1 : 0
    return (
      <path
        d={`
          M ${x1}, ${y1}
          a ${radius},${radius} 0 ${longArc},${toDeg <= fromDeg ? 0 : 1} ${x2 - x1} ${y2 - y1}
          L ${center}, ${center}
          `}
        stroke="black"
        fill={color}
        strokeWidth="0.5"
      />
    )
  }

  return (
    <svg width={size} height={size}>
      {getCurve(-valueRangeDegrees, valueRangeDegrees, 'black')}

      {getCurve(borderType === 'split' ? 0 : -valueRangeDegrees, deg, isActive ? activeDialColor : '#5e5e5e')}
    </svg>
  )
}

interface AudioSoloButtonProps {
  disabled: boolean
  isSolo: boolean
  onChange: (solo: boolean) => void
}

export class AudioSoloButton extends React.Component<AudioSoloButtonProps> {
  render() {
    const { disabled, isSolo, onChange } = this.props

    const classes = ['phones']
    let fillColor = '#444444'

    if (!disabled) {
      classes.push('phones-enabled')
      fillColor = '#707070'
      if (isSolo) {
        classes.push('phones-active')
        fillColor = '#34c9eb'
      }
    }

    return (
      <div className={classes.join(' ')} onClick={() => (!disabled ? onChange(!isSolo) : null)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fillColor} width="18px" height="18px">
          <path d="M0 0h24v24H0z" fill="none" opacity=".1" />
          <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
        </svg>
      </div>
    )
  }
}

interface AudioStripHeadingProps {
  name: string
  isLive: boolean
  mixOption: LibAtemEnums.AudioMixOption
  afvFlash: boolean
}

export class AudioStripHeading extends React.PureComponent<AudioStripHeadingProps> {
  render() {
    const { name, isLive, mixOption, afvFlash } = this.props

    const live = isLive || mixOption === LibAtemEnums.AudioMixOption.On
    const afv = mixOption === LibAtemEnums.AudioMixOption.AudioFollowVideo

    let tallyClass = ''
    if (live) {
      tallyClass = 'tally-red'
    } else if (afv) {
      tallyClass = afvFlash ? 'tally-yellow flash' : 'tally-yellow'
    }

    return (
      <div className="strip-heading">
        <div className={`name ${live || afv ? 'name-active' : ''}`}>{name}</div>
        <div className={`tally ${tallyClass}`}></div>
      </div>
    )
  }
}

interface AudioFaderControlProps {
  onChange: (value: number) => void
  resetPeaks: () => void
  minValue: number
  maxValue: number
  currentValue: number
  decibels: boolean
  isActive: boolean

  rawLevels?: LibAtemState.AudioState_LevelsState
  averagePeaks: number[]
}

export class AudioFaderControl extends React.PureComponent<AudioFaderControlProps> {
  private getPeakClippingBox(peak: number | undefined) {
    const { isActive } = this.props
    if (peak !== undefined && peak > -0.01) {
      if (!isActive) {
        return <div style={{ background: '#5e5e5e' }} className="peakBox-active"></div>
      } else {
        return <div className="peakBox-active"></div>
      }
    } else {
      return <div className="peakBox"></div>
    }
  }

  private getFloatingPeakBox(index: number) {
    const { isActive, minValue } = this.props
    const peakAverage = this.props.averagePeaks[index]
    if (peakAverage !== undefined && peakAverage > minValue) {
      const height = 100 - this.calculatePercent(dbToFader(minValue), dbToFader(0), dbToFader(peakAverage))
      if (!isActive) {
        return <div style={{ top: height + '%', background: '#5e5e5e' }} className="peak-inner"></div>
      } else if (height < 23) {
        return <div style={{ top: height + '%', background: 'red' }} className="peak-inner"></div>
      } else if (height < 50) {
        return <div style={{ top: height + '%', background: 'yellow' }} className="peak-inner"></div>
      } else {
        return <div style={{ top: height + '%', background: 'green' }} className="peak-inner"></div>
      }
    }

    return ''
  }

  private calculatePercent(min: number, max: number, val: number): number {
    return Math.max(Math.min(((val - min) / (max - min)) * 100, 100), 0)
  }

  private sanitisePeakValue(value: number | '-Infinity'): number {
    const { minValue } = this.props
    return value === '-Infinity' ? minValue : value
  }

  private getTopBarPeak() {
    const { rawLevels } = this.props

    let peakValue = ''
    let peakClass = ''
    if (rawLevels) {
      const peakValues = rawLevels.peaks.map(this.sanitisePeakValue.bind(this))
      if (peakValues.length > 0) {
        const peak = _.max(peakValues)

        if (peak >= -9) {
          peakValue = peak.toFixed(2)
        } else if (peak > CLASSIC_AUDIO_MIN_LEVEL) {
          peakClass = 'peaks-ok'
          peakValue = peak.toFixed(2)
        }
      }
    }
    return (
      <div className={`peaks ${peakClass}`} onClick={this.props.resetPeaks}>
        {peakValue}
      </div>
    )
  }

  render() {
    const { minValue, maxValue, currentValue, onChange, isActive, rawLevels } = this.props

    const levelBarHeight = this.calculatePercent(dbToFader(minValue), dbToFader(maxValue), dbToFader(0))

    return (
      <React.Fragment>
        {this.getTopBarPeak()}
        <div className="scale">
          <div className="scale-1">+6-</div>
          <div className="scale-2">0-</div>
          <div className="scale-3">-6-</div>
          <div className="scale-4">-9-</div>
          <div className="scale-5">-20-</div>
          <div className="scale-6">-60-</div>
        </div>
        <div className="slider">
          <div className="fader-slot"></div>
          <Slider
            tooltip={false}
            max={dbToFader(maxValue)}
            min={dbToFader(minValue)}
            step={0.001}
            value={dbToFader(Math.max(CLASSIC_AUDIO_MIN_LEVEL, currentValue))}
            orientation="vertical"
            onChange={(e) => onChange(faderToDb(e))}
          />
        </div>
        <div className="level-holder">
          {rawLevels
            ? rawLevels.levels.map((value, i) => {
                const level = this.sanitisePeakValue(value)
                const percent = this.calculatePercent(dbToFader(minValue), dbToFader(0), dbToFader(level))
                const roundedPercent = Math.round(percent * 10) / 10 // Minimise data updates
                return (
                  <div key={i} className="level-bar-holder" style={{ gridTemplateRows: `1fr auto ${levelBarHeight}%` }}>
                    <div></div>
                    {this.getPeakClippingBox(rawLevels.peaks[i])}

                    <div className="level-bar">
                      <div
                        className={`level-bar-inner ${isActive ? 'level-bar-rainbow' : ''}`}
                        style={{ clipPath: `inset(${100 - roundedPercent}% 0px 0px 0px)` }}
                      ></div>
                      {this.getFloatingPeakBox(i)}
                    </div>
                  </div>
                )
              })
            : ''}
        </div>
      </React.Fragment>
    )
  }
}

function faderToDb(v: number): number {
  return Math.log2(v) * 40
}
function dbToFader(v: number): number {
  return Math.pow(2, v / 40)
}

export function sanitisePeakValue(value: number | '-Infinity', minValue: number): number {
  return value === '-Infinity' ? minValue : value
}
export const CLASSIC_AUDIO_MIN_LEVEL = -60
