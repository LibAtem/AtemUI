import React from 'react'
import { LibAtemEnums } from '../../../generated'

interface DveImagePageProps {
  currentPage: number
  currentStyle: LibAtemEnums.DVEEffect
  onClick: (style: LibAtemEnums.DVEEffect) => void
}

export class DveImagePage extends React.PureComponent<DveImagePageProps> {
  render() {
    const page = DveImagePages[this.props.currentPage]
    if (!page) {
      return (
        <React.Fragment>
          <div className="ss-dve-style-heading"></div>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <div className="ss-dve-style-heading">{page.name}</div>
        <div className="ss-dve-style-holder">
          {page.images.map((style, i) => {
            const img = style === null ? null : DveImages[style]
            if (style === null || !img) {
              return <div key={i} className="ss-dve-style-item dummy"></div>
            } else {
              return (
                <div
                  key={i}
                  onClick={() => this.props.onClick(style)}
                  className={this.props.currentStyle === style ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
                >
                  {img(this.props.currentStyle === style)}
                </div>
              )
            }
          })}
        </div>
      </React.Fragment>
    )
  }
}
interface IDveImagePage {
  name: string
  images: Array<LibAtemEnums.DVEEffect | null>
}
export const DveImagePages: Array<IDveImagePage> = [
  {
    name: 'Push',
    images: [
      LibAtemEnums.DVEEffect.PushTopLeft,
      LibAtemEnums.DVEEffect.PushTop,
      LibAtemEnums.DVEEffect.PushTopRight,
      LibAtemEnums.DVEEffect.PushLeft,
      null,
      LibAtemEnums.DVEEffect.PushRight,
      LibAtemEnums.DVEEffect.PushBottomLeft,
      LibAtemEnums.DVEEffect.PushBottom,
      LibAtemEnums.DVEEffect.PushBottomRight
    ]
  },
  {
    name: 'Squeeze',
    images: [
      LibAtemEnums.DVEEffect.SqueezeTopLeft,
      LibAtemEnums.DVEEffect.SqueezeTop,
      LibAtemEnums.DVEEffect.SqueezeTopRight,
      LibAtemEnums.DVEEffect.SqueezeLeft,
      null,
      LibAtemEnums.DVEEffect.SqueezeRight,
      LibAtemEnums.DVEEffect.SqueezeBottomLeft,
      LibAtemEnums.DVEEffect.SqueezeBottom,
      LibAtemEnums.DVEEffect.SqueezeBottomRight
    ]
  },
  {
    name: 'Spin',
    images: [
      LibAtemEnums.DVEEffect.SpinCCWTopRight,
      LibAtemEnums.DVEEffect.SpinCWTopLeft,
      LibAtemEnums.DVEEffect.SpinCCWBottomRight,
      LibAtemEnums.DVEEffect.SpinCWBottomLeft,
      null,
      LibAtemEnums.DVEEffect.SpinCWTopRight,
      LibAtemEnums.DVEEffect.SpinCCWTopLeft,
      LibAtemEnums.DVEEffect.SpinCWBottomRight,
      LibAtemEnums.DVEEffect.SpinCCWBottomLeft
    ]
  },
  {
    name: 'Swoosh',
    images: [
      LibAtemEnums.DVEEffect.SwooshTopLeft,
      LibAtemEnums.DVEEffect.SwooshTop,
      LibAtemEnums.DVEEffect.SwooshTopRight,
      LibAtemEnums.DVEEffect.SwooshLeft,
      null,
      LibAtemEnums.DVEEffect.SwooshRight,
      LibAtemEnums.DVEEffect.SwooshBottomLeft,
      LibAtemEnums.DVEEffect.SwooshBottom,
      LibAtemEnums.DVEEffect.SwooshBottomRight
    ]
  }
]

export class DveImage extends React.PureComponent<{ style: LibAtemEnums.DVEEffect; isCurrent: boolean }> {
  render() {
    const image = DveImages[this.props.style]
    if (image) {
      return image(this.props.isCurrent)
    } else {
      return null
    }
  }
}

export const DveImages: { [key in LibAtemEnums.DVEEffect]: ((isCurrent: boolean) => JSX.Element) | null } = {
  [LibAtemEnums.DVEEffect.SwooshTopLeft]: isCurrent => (
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
  [LibAtemEnums.DVEEffect.SwooshTop]: isCurrent => (
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
  [LibAtemEnums.DVEEffect.SwooshTopRight]: isCurrent => (
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
  [LibAtemEnums.DVEEffect.SwooshLeft]: isCurrent => (
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
  [LibAtemEnums.DVEEffect.SwooshRight]: isCurrent => (
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
  [LibAtemEnums.DVEEffect.SwooshBottomLeft]: isCurrent => (
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
  [LibAtemEnums.DVEEffect.SwooshBottom]: isCurrent => (
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
  [LibAtemEnums.DVEEffect.SwooshBottomRight]: isCurrent => (
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
  ),
  [LibAtemEnums.DVEEffect.SpinCWTopLeft]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <mask id="myMask">
        <rect fill="white" x="0" y="0" height="100" width="150"></rect>
        <circle r="10" cx="13" cy="13" fill="black"></circle>
        <path
          fill="black"
          d="m 20 0 l 9 10 l -6 0 q -2 19 15 30 l 0 5 q -20 -8 -21 -35 l -6 0 z"
          transform="translate(30,30) rotate(-110,20,20)"
          stroke-width="0.2"
        ></path>
      </mask>
      <g>
        <circle r="4" cx="13" cy="13" fill={isCurrent ? '#ff8c00' : '#b2b2b2'}></circle>
        <polygon
          id="pattern 3"
          points="10,10 10,90  120,90 130,70"
          rx="3"
          mask="url(#myMask)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SpinCWTopRight]: isCurrent => (
    <svg width="100%" height="100%" transform="scale(1, -1)" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <mask id="myMask2">
        <rect fill="white" x="0" y="0" height="100" width="150"></rect>
        <circle r="10" cx="140" cy="90" fill="black"></circle>
        <path
          fill="black"
          d="m 20 0 l 9 10 l -6 0 q -2 19 15 30 l 0 5 q -20 -8 -21 -35 l -6 0 z"
          transform=" translate(125,45) scale(-1,1) rotate(160,20,20) "
          stroke-width="0.2"
        ></path>
      </mask>
      <g>
        <circle r="4" cx="140" cy="90" fill={isCurrent ? '#ff8c00' : '#b2b2b2'}></circle>
        <polygon
          id="pattern 3"
          points="140,90 10,90 10,70 110,30"
          rx="3"
          mask="url(#myMask2)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SpinCWBottomLeft]: isCurrent => (
    <svg width="100%" height="100%" transform="scale(-1, 1)" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <mask id="myMask2">
        <rect fill="white" x="0" y="0" height="100" width="150"></rect>
        <circle r="10" cx="140" cy="90" fill="black"></circle>
        <path
          fill="black"
          d="m 20 0 l 9 10 l -6 0 q -2 19 15 30 l 0 5 q -20 -8 -21 -35 l -6 0 z"
          transform=" translate(125,45) scale(-1,1) rotate(160,20,20) "
          stroke-width="0.2"
        ></path>
      </mask>
      <g>
        <circle r="4" cx="140" cy="90" fill={isCurrent ? '#ff8c00' : '#b2b2b2'}></circle>
        <polygon
          id="pattern 3"
          points="140,90 10,90 10,70 110,30"
          rx="3"
          mask="url(#myMask2)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SpinCWBottomRight]: isCurrent => (
    <svg width="100%" height="100%" transform="scale(-1, -1)" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <mask id="myMask">
        <rect fill="white" x="0" y="0" height="100" width="150"></rect>
        <circle r="10" cx="13" cy="13" fill="black"></circle>
        <path
          fill="black"
          d="m 20 0 l 9 10 l -6 0 q -2 19 15 30 l 0 5 q -20 -8 -21 -35 l -6 0 z"
          transform="translate(30,30) rotate(-110,20,20)"
          stroke-width="0.2"
        ></path>
      </mask>
      <g>
        <circle r="4" cx="13" cy="13" fill={isCurrent ? '#ff8c00' : '#b2b2b2'}></circle>
        <polygon
          id="pattern 3"
          points="10,10 10,90  120,90 130,70"
          rx="3"
          mask="url(#myMask)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SpinCCWTopLeft]: isCurrent => (
    <svg width="100%" height="100%" transform="scale(-1, -1)" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <mask id="myMask2">
        <rect fill="white" x="0" y="0" height="100" width="150"></rect>
        <circle r="10" cx="140" cy="90" fill="black"></circle>
        <path
          fill="black"
          d="m 20 0 l 9 10 l -6 0 q -2 19 15 30 l 0 5 q -20 -8 -21 -35 l -6 0 z"
          transform=" translate(125,45) scale(-1,1) rotate(160,20,20) "
          stroke-width="0.2"
        ></path>
      </mask>
      <g>
        <circle r="4" cx="140" cy="90" fill={isCurrent ? '#ff8c00' : '#b2b2b2'}></circle>
        <polygon
          id="pattern 3"
          points="140,90 10,90 10,70 110,30"
          rx="3"
          mask="url(#myMask2)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SpinCCWTopRight]: isCurrent => (
    <svg width="100%" height="100%" transform="scale(-1, 1)" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <mask id="myMask">
        <rect fill="white" x="0" y="0" height="100" width="150"></rect>
        <circle r="10" cx="13" cy="13" fill="black"></circle>
        <path
          fill="black"
          d="m 20 0 l 9 10 l -6 0 q -2 19 15 30 l 0 5 q -20 -8 -21 -35 l -6 0 z"
          transform="translate(30,30) rotate(-110,20,20)"
          stroke-width="0.2"
        ></path>
      </mask>
      <g>
        <circle r="4" cx="13" cy="13" fill={isCurrent ? '#ff8c00' : '#b2b2b2'}></circle>
        <polygon
          id="pattern 3"
          points="10,10 10,90  120,90 130,70"
          rx="3"
          mask="url(#myMask)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SpinCCWBottomLeft]: isCurrent => (
    <svg width="100%" height="100%" transform="scale(1, -1)" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <mask id="myMask">
        <rect fill="white" x="0" y="0" height="100" width="150"></rect>
        <circle r="10" cx="13" cy="13" fill="black"></circle>
        <path
          fill="black"
          d="m 20 0 l 9 10 l -6 0 q -2 19 15 30 l 0 5 q -20 -8 -21 -35 l -6 0 z"
          transform="translate(30,30) rotate(-110,20,20)"
          stroke-width="0.2"
        ></path>
      </mask>
      <g>
        <circle r="4" cx="13" cy="13" fill={isCurrent ? '#ff8c00' : '#b2b2b2'}></circle>
        <polygon
          id="pattern 3"
          points="10,10 10,90  120,90 130,70"
          rx="3"
          mask="url(#myMask)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SpinCCWBottomRight]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <mask id="myMask2">
        <rect fill="white" x="0" y="0" height="100" width="150"></rect>
        <circle r="10" cx="140" cy="90" fill="black"></circle>
        <path
          fill="black"
          d="m 20 0 l 9 10 l -6 0 q -2 19 15 30 l 0 5 q -20 -8 -21 -35 l -6 0 z"
          transform=" translate(125,45) scale(-1,1) rotate(160,20,20) "
          stroke-width="0.2"
        ></path>
      </mask>
      <g>
        <circle r="4" cx="140" cy="90" fill={isCurrent ? '#ff8c00' : '#b2b2b2'}></circle>
        <polygon
          id="pattern 3"
          points="140,90 10,90 10,70 110,30"
          rx="3"
          mask="url(#myMask2)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SqueezeTopLeft]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(40,25) rotate(-45,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="10"
          y="10"
          width="50"
          height="30"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <polygon
          id="pattern 3"
          points="65,10 70,10 70,50 10,50 10,45 65,45"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SqueezeTop]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(0,25)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="10"
          y="10"
          width="130"
          height="30"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
        <rect
          id="pattern 3"
          x="10"
          y="45"
          width="130"
          height="5"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SqueezeTopRight]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(-40,25) rotate(45,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="90"
          y="10"
          width="50"
          height="30"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
        <polygon
          id="pattern 3"
          points="85,10 80,10 80,50 140,50 140,45 85,45"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SqueezeLeft]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(45,0) rotate(-90,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="main"
          x="10"
          y="10"
          width="50"
          height="80"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
        <rect
          id="edge"
          x="65"
          y="10"
          width="5"
          height="80"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SqueezeRight]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(-45,0) rotate(90,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="main"
          x="90"
          y="10"
          width="50"
          height="80"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
        <rect
          id="edge"
          x="80"
          y="10"
          width="5"
          height="80"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SqueezeBottomLeft]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(45,-25) rotate(-135,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="10"
          y="60"
          width="50"
          height="30"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
        <polygon
          id="pattern 3"
          points="10,55 10,50 70,50 70,90 65,90 65,55"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SqueezeBottom]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(0,-25) rotate(180,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="10"
          y="60"
          width="130"
          height="30"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
        <rect
          id="pattern 3"
          x="10"
          y="50"
          width="130"
          height="5"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.SqueezeBottomRight]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(-45,-25) rotate(135,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="90"
          y="60"
          width="50"
          height="30"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
        <polygon
          id="pattern 3"
          points="80,50 140,50 140,55 85,55 85,90 80,90"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.PushTopLeft]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(40,25) rotate(-45,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="10"
          y="10"
          width="60"
          height="40"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.PushTop]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(0,25)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="10"
          y="10"
          width="130"
          height="40"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.PushTopRight]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(-40,25) rotate(45,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="80"
          y="10"
          width="60"
          height="40"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.PushLeft]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(45,0) rotate(-90,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="10"
          y="10"
          width="60"
          height="80"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.PushRight]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(-45,0) rotate(90,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="80"
          y="10"
          width="60"
          height="80"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.PushBottomLeft]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(45,-25) rotate(-135,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="10"
          y="50"
          width="60"
          height="40"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.PushBottom]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(0,-25) rotate(180,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="10"
          y="50"
          width="130"
          height="40"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.PushBottomRight]: isCurrent => (
    <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <polygon
          id="pattern 1"
          points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
          rx="5"
          transform=" translate(-45,-25) rotate(135,75,50)"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
      <g>
        <rect
          id="pattern 2"
          x="80"
          y="50"
          width="60"
          height="40"
          rx="3"
          stroke-width="0.2"
          stroke="#191919"
          fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
        />
      </g>
    </svg>
  ),
  [LibAtemEnums.DVEEffect.GraphicCWSpin]: null,
  [LibAtemEnums.DVEEffect.GraphicCCWSpin]: null,
  [LibAtemEnums.DVEEffect.GraphicLogoWipe]: null
}
