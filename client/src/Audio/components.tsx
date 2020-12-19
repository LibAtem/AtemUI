import React from 'react'
import * as _ from 'underscore'

interface AudioDialControlProps {
  onChange: (value: number) => void
  minValue: number
  maxValue: number
  currentValue: number
  isActive: boolean
}
interface AudioDialControlState {
  click: boolean
}

export class AudioDialControl extends React.Component<AudioDialControlProps, AudioDialControlState> {
  constructor(props: AudioDialControlProps) {
    super(props)
    this.state = {
      click: false,
    }

    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.onMouseMove)
    document.body.removeEventListener('mouseup', this.onMouseUp)
  }

  private onMouseUp(): void {
    this.setState({ click: false })
    document.body.removeEventListener('mousemove', this.onMouseMove)
    document.body.removeEventListener('mouseup', this.onMouseUp)
  }

  private onMouseMove(e: MouseEvent): void {
    const delta = e.movementX
    if (delta !== 0) {
      console.log('move', delta)
    }
  }

  render() {
    const { onChange, minValue, maxValue, currentValue, isActive } = this.props
    var slider = []
    const color = isActive ? '#ff7b00' : '#5e5e5e'

    if (currentValue > 0) {
      slider.push(
        <div
          style={{
            left: '50%',
            background: color,
            width: (35 * currentValue) / 50 + 'px',
          }}
          className="pan-slider-inner"
        ></div>
      )
    } else {
      slider.push(
        <div
          style={{
            right: '50%',
            background: color,
            width: (35 * currentValue) / -50 + 'px',
          }}
          className="pan-slider-inner"
        ></div>
      )
    }

    const deg = 10

    return (
      <div className="dial">
        <div
          className="dial-spinner"
          style={{
            transform: `rotate(${deg}deg)`,
          }}
          onMouseDown={(e) => {
            console.log('down')
            if (!this.state.click) {
              document.body.addEventListener('mousemove', this.onMouseMove)
              document.body.addEventListener('mouseup', this.onMouseUp)
              this.setState({ click: true })
            }
          }}
        >
          {/* TODO - replace this with an svg */}
        </div>
      </div>
      //   <div className="pan">
      //     <div className="pan-inner">
      //       <div className="pan-labels">
      //         <div className="pan-L">L</div>
      //         <div className="pan-R">R</div>
      //       </div>
      //       <div
      //         onMouseDown={(event: any) => {
      //           var rect = event.target.getBoundingClientRect()
      //           var x = event.clientX - rect.left
      //           onChange((x / 70) * 110 - 55)
      //         }}
      //         className="pan-slider"
      //       >
      //         {slider}
      //       </div>
      //     </div>
      //     <div onClick={() => onChange(0)} className="pan-input">
      //       {' '}
      //       {currentValue >= 0 ? '+' : ''}
      //       {currentValue.toFixed(0)}
      //     </div>
      //   </div>
    )
  }
}
