import React from 'react'
import { LibAtemEnums } from '../generated'

export interface PatternInfo {
  createSvg: (isCurrent: boolean) => JSX.Element
  symmetry: boolean
  x: boolean
  y: boolean
}
export const Patterns: { [key in LibAtemEnums.Pattern]: PatternInfo } = {
  [LibAtemEnums.Pattern.LeftToRightBar]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 1"
            height="80%"
            width="35%"
            y="10%"
            x="55%"
            rx="2"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: false,
    x: false,
    y: false
  },

  [LibAtemEnums.Pattern.TopToBottomBar]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 2"
            height="35%"
            width="80%"
            y="55%"
            x="10%"
            rx="2"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: false,
    x: false,
    y: false
  },
  [LibAtemEnums.Pattern.HorizontalBarnDoor]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 3"
            height="80%"
            width="35%"
            y="10%"
            x="55%"
            rx="2"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
        <g>
          <rect
            id="pattern 3-2"
            height="80%"
            width="35%"
            y="10%"
            x="10%"
            rx="2"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: false,
    x: true,
    y: false
  },
  [LibAtemEnums.Pattern.VerticalBarnDoor]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 4"
            height="35%"
            width="80%"
            y="55%"
            x="10%"
            rx="2"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
        <g>
          <rect
            id="pattern 4-2"
            height="35%"
            width="80%"
            y="10%"
            x="10%"
            rx="2"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: false,
    x: false,
    y: true
  },
  [LibAtemEnums.Pattern.CornersInFourBox]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 5"
            height="35%"
            width="35%"
            y="55%"
            x="10%"
            rx="2"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
        <g>
          <rect
            id="pattern 5-2"
            height="35%"
            width="35%"
            y="10%"
            x="10%"
            rx="2"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>

        <g>
          <rect
            id="pattern 5-3"
            height="35%"
            width="35%"
            y="55%"
            x="55%"
            rx="2"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
        <g>
          <rect
            id="pattern 5-4"
            height="35%"
            width="35%"
            y="10%"
            x="55%"
            rx="2"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: true,
    x: true,
    y: true
  },
  [LibAtemEnums.Pattern.RectangleIris]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 6"
            height="35%"
            width="35%"
            y="32.5%"
            x="32.5%"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: true,
    x: true,
    y: true
  },
  [LibAtemEnums.Pattern.DiamondIris]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 7"
            height="35%"
            width="35%"
            y="32.5%"
            x="32.5%"
            transform="rotate(45,50,50)"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: true,
    x: true,
    y: true
  },
  [LibAtemEnums.Pattern.CircleIris]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <circle
            id="pattern 8"
            r="20"
            cy="50"
            cx="50"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: true,
    x: true,
    y: true
  },
  [LibAtemEnums.Pattern.TopLeftBox]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 9"
            height="35"
            width="35"
            y="10"
            x="10"
            rx="3"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: true,
    x: false,
    y: false
  },
  [LibAtemEnums.Pattern.TopRightBox]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 10"
            height="35"
            width="35"
            y="10"
            x="55"
            rx="3"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: true,
    x: false,
    y: false
  },
  [LibAtemEnums.Pattern.BottomRightBox]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 11"
            height="35"
            width="35"
            y="50"
            x="55"
            rx="3"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: true,
    x: false,
    y: false
  },
  [LibAtemEnums.Pattern.BottomLeftBox]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 12"
            height="35"
            width="35"
            y="50"
            x="10"
            rx="3"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: true,
    x: false,
    y: false
  },
  [LibAtemEnums.Pattern.TopCentreBox]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 13"
            height="35"
            width="35"
            y="10"
            x="32.5"
            rx="3"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: false,
    x: true,
    y: false
  },
  [LibAtemEnums.Pattern.RightCentreBox]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 14"
            height="35"
            width="35"
            y="32.5"
            x="55"
            rx="3"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: false,
    x: false,
    y: true
  },
  [LibAtemEnums.Pattern.BottomCentreBox]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 15"
            height="35"
            width="35"
            y="55"
            x="32.5"
            rx="3"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: false,
    x: true,
    y: false
  },
  [LibAtemEnums.Pattern.LeftCentreBox]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            id="pattern 16"
            height="35"
            width="35"
            y="32.5"
            x="10"
            rx="3"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: false,
    x: false,
    y: true
  },
  [LibAtemEnums.Pattern.TopLeftDiagonal]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <polygon
            id="pattern 17"
            points="15,15 85,15 15,85"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: true,
    x: false,
    y: false
  },
  [LibAtemEnums.Pattern.TopRightDiagonal]: {
    createSvg: isCurrent => (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <polygon
            id="pattern 18"
            points="85,15 85,85 15,15"
            rx="5"
            stroke-width="0.2"
            stroke="#191919"
            fill={isCurrent ? '#ff8c00' : '#b2b2b2'}
          />
        </g>
      </svg>
    ),
    symmetry: true,
    x: false,
    y: false
  }
}
