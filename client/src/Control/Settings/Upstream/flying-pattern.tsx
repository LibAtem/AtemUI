import React from 'react'
import { LibAtemEnums } from '../../../generated'

export const FlyingPatternInfo: Array<{ icon: LibAtemEnums.FlyKeyLocation; icon2?: LibAtemEnums.FlyKeyLocation }> = [
  {
    icon: LibAtemEnums.FlyKeyLocation.TopLeft
  },
  {
    icon: LibAtemEnums.FlyKeyLocation.TopCentre
  },
  {
    icon: LibAtemEnums.FlyKeyLocation.TopRight
  },
  {
    icon: LibAtemEnums.FlyKeyLocation.MiddleLeft
  },
  {
    icon: LibAtemEnums.FlyKeyLocation.CentreOfKey,
    icon2: LibAtemEnums.FlyKeyLocation.MiddleCentre
  },
  {
    icon: LibAtemEnums.FlyKeyLocation.MiddleRight
  },
  {
    icon: LibAtemEnums.FlyKeyLocation.BottomLeft
  },
  {
    icon: LibAtemEnums.FlyKeyLocation.BottomCentre
  },
  {
    icon: LibAtemEnums.FlyKeyLocation.BottomRight
  }
]

export class FlyingPatternImage extends React.PureComponent<{
  style: LibAtemEnums.FlyKeyLocation
  isCurrent: boolean
}> {
  render() {
    const image = FlyingPattern[this.props.style]
    if (image) {
      return image(this.props.isCurrent)
    } else {
      return null
    }
  }
}

export const FlyingPattern: { [key in LibAtemEnums.FlyKeyLocation]: (isCurrent: boolean) => JSX.Element } = {
  [LibAtemEnums.FlyKeyLocation.CentreOfKey]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 75 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="translate(-53,15) rotate(45,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="translate(-22,15) rotate(-45,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>

      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="translate(-22,-14) rotate(-135,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>

      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="translate(-53,-14) rotate(135,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.FlyKeyLocation.TopLeft]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="rotate(-45,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.FlyKeyLocation.TopCentre]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50 "
          rx="2"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.FlyKeyLocation.TopRight]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="rotate(45,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.FlyKeyLocation.MiddleLeft]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="rotate(-90,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.FlyKeyLocation.MiddleCentre]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 75 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="translate(-53,15) rotate(45,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="translate(-22,15) rotate(-45,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>

      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="translate(-22,-14) rotate(-135,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>

      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="translate(-53,-14) rotate(135,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>

      <g>
        <rect
          x="5"
          y="10"
          width="65"
          height="80"
          stroke={isCurrent ? '#ff8c00' : '#b2b2b2'}
          stroke-width="2"
          fill="none"
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.FlyKeyLocation.MiddleRight]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="rotate(90,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.FlyKeyLocation.BottomLeft]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="rotate(-135,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.FlyKeyLocation.BottomCentre]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="rotate(180,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.FlyKeyLocation.BottomRight]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="2"
          transform="rotate(135,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  )
}
