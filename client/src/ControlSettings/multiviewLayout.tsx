import React from 'react'
import { LibAtemEnums } from '../generated'

export class LayoutIcon extends React.PureComponent<{
  layout: LibAtemEnums.MultiViewLayoutV8
  isCurrent: boolean
  isHover: boolean
}> {
  render() {
    const { layout, isCurrent, isHover } = this.props
    const col = isCurrent ? '#ffffff' : isHover ? '#a2a2a2' : '#626262'

    switch (layout) {
      case LibAtemEnums.MultiViewLayoutV8.ProgramTop:
        return (
          <svg width="40" height="30" xmlns="http://www.w3.org/2000/svg">
            <g>
              <title>background</title>
              <rect x="-1" y="-1" width="42" height="32" id="canvas_background" fill="none" />
            </g>
            <g>
              <title>Layer 1</title>
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="1.388896"
                y="2.827785"
                width="18"
                height="10"
                id="svg_1"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="20.833333"
                y="2.716674"
                width="18"
                height="10"
                id="svg_2"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="1.611118"
                y="15.354349"
                width="8"
                height="5"
                id="svg_7"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="11"
                y="15.304348"
                width="8"
                height="5"
                id="svg_9"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="1.611118"
                y="21.565529"
                width="8"
                height="5"
                id="svg_10"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="11"
                y="21.515527"
                width="8"
                height="5"
                id="svg_11"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="21.044105"
                y="15.354349"
                width="8"
                height="5"
                id="svg_12"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="30.432986"
                y="15.304348"
                width="8"
                height="5"
                id="svg_13"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="21.044105"
                y="21.565529"
                width="8"
                height="5"
                id="svg_14"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="30.432986"
                y="21.515527"
                width="8"
                height="5"
                id="svg_15"
                rx="1"
              />
            </g>
          </svg>
        )
      case LibAtemEnums.MultiViewLayoutV8.ProgramBottom:
        return (
          <svg width="40" height="30" xmlns="http://www.w3.org/2000/svg">
            <g>
              <title>background</title>
              <rect x="-1" y="-1" width="42" height="32" id="canvas_background" fill="none" />
            </g>
            <g>
              <title>Layer 1</title>
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="1.388896"
                y="15.494452"
                width="18"
                height="10"
                id="svg_1"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="20.833333"
                y="15.47223"
                width="18"
                height="10"
                id="svg_2"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="1.611118"
                y="2.421015"
                width="8"
                height="5"
                id="svg_7"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="11"
                y="2.371014"
                width="8"
                height="5"
                id="svg_9"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="1.611118"
                y="8.632195"
                width="8"
                height="5"
                id="svg_10"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="11"
                y="8.582193"
                width="8"
                height="5"
                id="svg_11"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="21.044105"
                y="2.421015"
                width="8"
                height="5"
                id="svg_12"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="30.432986"
                y="2.371014"
                width="8"
                height="5"
                id="svg_13"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="21.044105"
                y="8.632195"
                width="8"
                height="5"
                id="svg_14"
                rx="1"
              />
              <rect
                fill={col}
                stroke="#0f0f00"
                stroke-width="1.5"
                stroke-opacity="0"
                fill-opacity="null"
                x="30.432986"
                y="8.582193"
                width="8"
                height="5"
                id="svg_15"
                rx="1"
              />
            </g>
          </svg>
        )
      case LibAtemEnums.MultiViewLayoutV8.ProgramLeft:
        return (
          <svg width="40" height="30" xmlns="http://www.w3.org/2000/svg">
            <g>
              <title>background</title>
              <rect fill="none" id="canvas_background" height="32" width="42" y="-1" x="-1" />
            </g>
            <g>
              <title>Layer 1</title>
              <rect
                rx="1"
                id="svg_1"
                height="11"
                width="18"
                y="3.138344"
                x="1.140449"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_7"
                height="5"
                width="8"
                y="2.802131"
                x="20.984365"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_9"
                height="5"
                width="8"
                y="2.752129"
                x="30.373247"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_10"
                height="5"
                width="8"
                y="9.01331"
                x="20.984365"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_11"
                height="5"
                width="8"
                y="8.963309"
                x="30.373247"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_12"
                height="5"
                width="8"
                y="15.851244"
                x="20.989998"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_13"
                height="5"
                width="8"
                y="15.801242"
                x="30.37888"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_14"
                height="5"
                width="8"
                y="22.062423"
                x="21.05211"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_15"
                height="5"
                width="8"
                y="22.012422"
                x="30.440992"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_16"
                height="11"
                width="18"
                y="15.995485"
                x="1.140449"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
            </g>
          </svg>
        )
      case LibAtemEnums.MultiViewLayoutV8.ProgramRight:
        return (
          <svg width="40" height="30" xmlns="http://www.w3.org/2000/svg">
            <g>
              <title>background</title>
              <rect fill="none" id="canvas_background" height="32" width="42" y="-1" x="-1" />
            </g>
            <g>
              <title>Layer 1</title>
              <rect
                rx="1"
                id="svg_1"
                height="11"
                width="18"
                y="3.138344"
                x="20.581441"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_7"
                height="5"
                width="8"
                y="2.802131"
                x="1.419149"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_9"
                height="5"
                width="8"
                y="2.752129"
                x="10.808031"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_10"
                height="5"
                width="8"
                y="9.01331"
                x="1.419149"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_11"
                height="5"
                width="8"
                y="8.963309"
                x="10.808031"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_12"
                height="5"
                width="8"
                y="15.851244"
                x="1.424783"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_13"
                height="5"
                width="8"
                y="15.801242"
                x="10.813665"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_14"
                height="5"
                width="8"
                y="22.062423"
                x="1.486895"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_15"
                height="5"
                width="8"
                y="22.012422"
                x="10.875776"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
              <rect
                rx="1"
                id="svg_16"
                height="11"
                width="18"
                y="15.995485"
                x="20.581441"
                fill-opacity="null"
                stroke-opacity="0"
                stroke-width="1.5"
                stroke="#0f0f00"
                fill={col}
              />
            </g>
          </svg>
        )
      default:
        return ''
    }
  }
}
