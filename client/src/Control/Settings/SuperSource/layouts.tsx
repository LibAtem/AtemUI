import { ProtocolVersion } from '../../../generated/common-enums'
import React from 'react'
import { SendCommandStrict } from '../../../device-page-wrapper'
import { LibAtemCommands, LibAtemEnums } from '../../../generated'

interface SuperSourceLayoutInfo {
  icon: () => JSX.Element
  apply: (sendCommand: SendCommandStrict, version: ProtocolVersion | undefined, index: number) => void
}

function setBoxProps(
  sendCommand: SendCommandStrict,
  version: ProtocolVersion | undefined,
  index: number,
  props: Omit<Required<LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command>, 'Mask' | 'Source' | 'SSrcId'>
) {
  if (!version || version >= LibAtemEnums.ProtocolVersion.V8_0) {
    sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetV8Command', {
      Mask:
        LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Enabled |
        LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.PositionX |
        LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.PositionY |
        LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Size |
        LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.Cropped |
        LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropTop |
        LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropBottom |
        LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropLeft |
        LibAtemCommands.SuperSource_SuperSourceBoxSetV8Command_MaskFlags.CropRight,
      SSrcId: index,
      ...props
    })
  } else if (index === 0) {
    // Skip if not index 0, as that didnt exist before
    sendCommand('LibAtem.Commands.SuperSource.SuperSourceBoxSetCommand', {
      Mask:
        LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.Enabled |
        LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.PositionX |
        LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.PositionY |
        LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.Size |
        LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.Cropped |
        LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropTop |
        LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropBottom |
        LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropLeft |
        LibAtemCommands.SuperSource_SuperSourceBoxSetCommand_MaskFlags.CropRight,
      ...props
    })
  }
}

export const Layouts: SuperSourceLayoutInfo[] = [
  {
    icon: () => {
      return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100">
          <g>
            <rect
              id="box 4"
              height="42%"
              width="42%"
              y="52.6%"
              x="52.7%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
            <rect
              id="box 3"
              height="42%"
              width="42%"
              y="52.6%"
              x="5.3%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
            <rect
              id="box 2"
              height="42%"
              width="42%"
              y="5.4%"
              x="52.7%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
            <rect
              id="box 1"
              height="42%"
              width="42%"
              y="5  .4%"
              x="5.3%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
          </g>
        </svg>
      )
    },
    apply: (sendCommand, version, index) => {
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 0,
        Enabled: true,
        PositionX: -7.58,
        PositionY: 4.25,
        Size: 0.42,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 1,
        Enabled: true,
        PositionX: 7.58,
        PositionY: 4.25,
        Size: 0.42,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 2,
        Enabled: true,
        PositionX: -7.58,
        PositionY: -4.25,
        Size: 0.42,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 3,
        Enabled: true,
        PositionX: 7.58,
        PositionY: -4.25,
        Size: 0.42,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
    }
  },
  {
    icon: () => {
      return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100">
          <g>
            <rect
              id="box 4"
              height="30%"
              width="30%"
              y="57.2%"
              x="12.6%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
            <rect
              id="box 3"
              height="30%"
              width="30%"
              y="12.8%"
              x="57.4%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
            <rect
              id="box 2"
              height="44%"
              width="44%"
              y="50.222%"
              x="50.4%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
            <rect
              id="box 1"
              height="44%"
              width="44%"
              y="5.8%"
              x="5.6%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
          </g>
        </svg>
      )
    },
    apply: (sendCommand, version, index) => {
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 0,
        Enabled: true,
        PositionX: -7.16,
        PositionY: 4,
        Size: 0.44,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 1,
        Enabled: true,
        PositionX: 7.16,
        PositionY: -4,
        Size: 0.44,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 2,
        Enabled: true,
        PositionX: 7.16,
        PositionY: 4,
        Size: 0.3,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 3,
        Enabled: true,
        PositionX: -7.16,
        PositionY: -4,
        Size: 0.3,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
    }
  },
  {
    icon: () => {
      return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100">
          <g>
            <rect
              id="box 2"
              height="50%"
              width="50%"
              y="44.4%"
              x="44.75%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
            <rect
              id="box 1"
              height="50%"
              width="50%"
              y="5.6%"
              x="5.25%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
          </g>
        </svg>
      )
    },
    apply: (sendCommand, version, index) => {
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 0,
        Enabled: true,
        PositionX: -6.32,
        PositionY: 3.5,
        Size: 0.5,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 1,
        Enabled: true,
        PositionX: 6.32,
        PositionY: -3.5,
        Size: 0.5,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 2,
        Enabled: false,
        PositionX: 0,
        PositionY: 0,
        Size: 1,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 3,
        Enabled: false,
        PositionX: 0,
        PositionY: 0,
        Size: 1,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
    }
  },
  {
    icon: () => {
      return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100">
          <g>
            <rect
              id="box 3"
              height="40%"
              width="40%"
              y="53.6%"
              x="55%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
            <rect
              id="box 2"
              height="40%"
              width="40%"
              y="6.4%"
              x="55%"
              rx="5"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
            />
            <defs>
              <mask id="box1-hole">
                <rect height="69%" width="69%" y="15.5%" x="-1.2%" rx="5" fill="white" />
                <rect height="61%" width="61%" y="19.5%" x="2.8%" rx="5" fill="black" />
              </mask>
            </defs>
            <rect
              id="box 1"
              height="69%"
              width="69%"
              y="15.5%"
              x="-1.2%"
              rx="10"
              stroke-width="1"
              stroke="#191919"
              fill="#b2b2b2"
              mask="url(#box1-hole)"
            />
            <rect
              id="box 1 inner border"
              height="61%"
              width="61%"
              y="19.5%"
              x="2.8%"
              rx="5"
              fill="none"
              stroke-width="1"
              stroke="#191919"
            />
            <rect id="box 1 inner box" height="65%" width="35.45%" y="17.5%" x="16.5%" fill="#b2b2b2" />
          </g>
        </svg>
      )
    },
    apply: (sendCommand, version, index) => {
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 0,
        Enabled: true,
        PositionX: -5.33,
        PositionY: 0,
        Size: 0.69,
        Cropped: true,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 8.22,
        CropRight: 8.22
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 1,
        Enabled: true,
        PositionX: 8,
        PositionY: 4.25,
        Size: 0.4,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 2,
        Enabled: true,
        PositionX: 8,
        PositionY: -4.25,
        Size: 0.4,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
      setBoxProps(sendCommand, version, index, {
        BoxIndex: 3,
        Enabled: false,
        PositionX: 0,
        PositionY: 0,
        Size: 1,
        Cropped: false,
        CropTop: 0,
        CropBottom: 0,
        CropLeft: 0,
        CropRight: 0
      })
    }
  }
]
