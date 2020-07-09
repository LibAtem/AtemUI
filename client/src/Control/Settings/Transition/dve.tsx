import React from 'react'
import { AtemDeviceInfo } from '../../../Devices/types'
import { GetDeviceId } from '../../../DeviceManager'
import { RateInput, MagicInput } from '../settings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft, faUndoAlt, faRedoAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { videoIds } from '../../../ControlSettings/ids'
import Slider from 'react-rangeslider'

interface DVEProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: any
  mixEffect: number
}

interface DVEState {
  hasConnected: boolean
  state: any | null
  currentState: any
  page: number
}

export class DVE extends React.Component<DVEProps, DVEState> {
  constructor(props: DVEProps) {
    super(props)
    this.state = {
      hasConnected: props.device.connected,
      state: props.currentState,
      currentState: null,
      page: 2
    }
  }

  private sendCommand(command: string, value: any) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)
      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then(res => {})
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }
  getSpin() {
    var style = this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style
    return (
      <div className="ss-dve-style-holder">
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 13
            })
          }
          className={style == 13 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg
            width="100%"
            height="100%"
            transform="scale(-1, 1)"
            viewBox="0 0 150 100"
            xmlns="http://www.w3.org/2000/svg"
          >
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
              <circle r="4" cx="13" cy="13" fill={style === 13 ? '#ff8c00' : '#b2b2b2'}></circle>
              <polygon
                id="pattern 3"
                points="10,10 10,90  120,90 130,70"
                rx="3"
                mask="url(#myMask)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 13 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 8
            })
          }
          className={style == 8 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
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
              <circle r="4" cx="13" cy="13" fill={style === 8 ? '#ff8c00' : '#b2b2b2'}></circle>
              <polygon
                id="pattern 3"
                points="10,10 10,90  120,90 130,70"
                rx="3"
                mask="url(#myMask)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 8 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 15
            })
          }
          className={style == 15 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
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
              <circle r="4" cx="140" cy="90" fill={style === 15 ? '#ff8c00' : '#b2b2b2'}></circle>
              <polygon
                id="pattern 3"
                points="140,90 10,90 10,70 110,30"
                rx="3"
                mask="url(#myMask2)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 15 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 10
            })
          }
          className={style == 10 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg
            width="100%"
            height="100%"
            transform="scale(-1, 1)"
            viewBox="0 0 150 100"
            xmlns="http://www.w3.org/2000/svg"
          >
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
              <circle r="4" cx="140" cy="90" fill={style === 10 ? '#ff8c00' : '#b2b2b2'}></circle>
              <polygon
                id="pattern 3"
                points="140,90 10,90 10,70 110,30"
                rx="3"
                mask="url(#myMask2)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 10 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div className="ss-dve-style-item dummy"></div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 9
            })
          }
          className={style == 9 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg
            width="100%"
            height="100%"
            transform="scale(1, -1)"
            viewBox="0 0 150 100"
            xmlns="http://www.w3.org/2000/svg"
          >
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
              <circle r="4" cx="140" cy="90" fill={style === 9 ? '#ff8c00' : '#b2b2b2'}></circle>
              <polygon
                id="pattern 3"
                points="140,90 10,90 10,70 110,30"
                rx="3"
                mask="url(#myMask2)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 9 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 12
            })
          }
          className={style == 12 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg
            width="100%"
            height="100%"
            transform="scale(-1, -1)"
            viewBox="0 0 150 100"
            xmlns="http://www.w3.org/2000/svg"
          >
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
              <circle r="4" cx="140" cy="90" fill={style === 12 ? '#ff8c00' : '#b2b2b2'}></circle>
              <polygon
                id="pattern 3"
                points="140,90 10,90 10,70 110,30"
                rx="3"
                mask="url(#myMask2)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 12 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 11
            })
          }
          className={style == 11 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg
            width="100%"
            height="100%"
            transform="scale(-1, -1)"
            viewBox="0 0 150 100"
            xmlns="http://www.w3.org/2000/svg"
          >
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
              <circle r="4" cx="13" cy="13" fill={style === 11 ? '#ff8c00' : '#b2b2b2'}></circle>
              <polygon
                id="pattern 3"
                points="10,10 10,90  120,90 130,70"
                rx="3"
                mask="url(#myMask)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 11 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 14
            })
          }
          className={style == 14 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg
            width="100%"
            height="100%"
            transform="scale(1, -1)"
            viewBox="0 0 150 100"
            xmlns="http://www.w3.org/2000/svg"
          >
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
              <circle r="4" cx="13" cy="13" fill={style === 14 ? '#ff8c00' : '#b2b2b2'}></circle>
              <polygon
                id="pattern 3"
                points="10,10 10,90  120,90 130,70"
                rx="3"
                mask="url(#myMask)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 14 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
      </div>
    )
  }

  getSqueeze() {
    var style = this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style
    return (
      <div className="ss-dve-style-holder">
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 16
            })
          }
          className={style == 16 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(40,25) rotate(-45,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 16 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 16 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
            <g>
              <polygon
                id="pattern 3"
                points="65,10 70,10 70,50 10,50 10,45 65,45"
                rx="3"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 16 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 17
            })
          }
          className={style == 17 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(0,25)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 17 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 17 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 17 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 18
            })
          }
          className={style == 18 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(-40,25) rotate(45,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 26 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 18 ? '#ff8c00' : '#b2b2b2'}
              />
              <polygon
                id="pattern 3"
                points="85,10 80,10 80,50 140,50 140,45 85,45"
                rx="3"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 18 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 19
            })
          }
          className={style == 19 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(45,0) rotate(-90,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 19 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 19 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 19 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div className="ss-dve-style-item dummy"></div>

        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 20
            })
          }
          className={style == 20 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(-45,0) rotate(90,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 20 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 20 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 20 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 21
            })
          }
          className={style == 21 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(45,-25) rotate(-135,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 29 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 21 ? '#ff8c00' : '#b2b2b2'}
              />
              <polygon
                id="pattern 3"
                points="10,55 10,50 70,50 70,90 65,90 65,55"
                rx="3"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 21 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 22
            })
          }
          className={style == 22 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(0,-25) rotate(180,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 22 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 22 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 22 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 23
            })
          }
          className={style == 23 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(-45,-25) rotate(135,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 23 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 23 ? '#ff8c00' : '#b2b2b2'}
              />
              <polygon
                id="pattern 3"
                points="80,50 140,50 140,55 85,55 85,90 80,90"
                rx="3"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 23 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
      </div>
    )
  }

  getPush() {
    var style = this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style
    return (
      <div className="ss-dve-style-holder">
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 24
            })
          }
          className={style == 24 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(40,25) rotate(-45,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 24 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 24 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 25
            })
          }
          className={style == 25 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(0,25)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 25 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 25 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 26
            })
          }
          className={style == 26 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(-40,25) rotate(45,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 26 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 26 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 27
            })
          }
          className={style == 27 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(45,0) rotate(-90,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 27 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 27 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div className="ss-dve-style-item dummy"></div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 28
            })
          }
          className={style == 28 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(-45,0) rotate(90,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 28 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 28 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 29
            })
          }
          className={style == 29 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(45,-25) rotate(-135,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 29 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 29 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 30
            })
          }
          className={style == 30 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(0,-25) rotate(180,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 30 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 30 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>

        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 31
            })
          }
          className={style == 31 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="5"
                transform=" translate(-45,-25) rotate(135,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 31 ? '#ff8c00' : '#b2b2b2'}
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
                fill={style === 31 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
      </div>
    )
  }

  getSwoosh() {
    var style = this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style
    return (
      <div className="ss-dve-style-holder">
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 0
            })
          }
          className={style == 0 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(-45,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 0 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 1
            })
          }
          className={style == 1 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50 "
                rx="2"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 1 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 2
            })
          }
          className={style == 2 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(45,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 2 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 3
            })
          }
          className={style == 3 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(-90,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 3 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div className="ss-dve-style-item dummy"></div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 4
            })
          }
          className={style == 4 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(90,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 4 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 5
            })
          }
          className={style == 5 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(-135,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 5 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 6
            })
          }
          className={style == 6 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(180,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 6 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
        <div
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: this.props.mixEffect,
              Mask: 4,
              Style: 7
            })
          }
          className={style == 7 ? 'ss-dve-style-item selected' : 'ss-dve-style-item'}
        >
          <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon
                id="pattern 1"
                points="75,35 90,50 80,50 80,65 70,65 70,50 60,50"
                rx="2"
                transform="rotate(135,75,50)"
                stroke-width="0.2"
                stroke="#191919"
                fill={style === 7 ? '#ff8c00' : '#b2b2b2'}
              />
            </g>
          </svg>
        </div>
      </div>
    )
  }

  getSourceOptions() {
    var inputs = Object.keys(this.props.currentState.settings.inputs)
    var sources = inputs.filter(i => videoIds[i] < 4000)
    var options = []
    for (var i in sources) {
      options.push(
        <option value={videoIds[sources[i]]}>
          {this.props.currentState.settings.inputs[sources[i]].properties.longName}
        </option>
      )
    }
    return options
  }

  getPreMultBox(index: number) {
    var enabled = this.props.currentState.mixEffects[index].transition.dve.preMultiplied
    if (
      this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style < 32 ||
      !this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.enableKey
    ) {
      var button = <div className="ss-circle-button"></div>
      var label = (
        <div className="ss-circle-button-holder">
          {button}
          <div className="ss-heading disabled">Pre Multiplied Key</div>
        </div>
      )
      enabled = true
    } else {
      var button = enabled ? (
        <div className="ss-circle-button">
          <div className="ss-circle-button-inner"></div>
        </div>
      ) : (
        <div className="ss-circle-button"></div>
      )
      var label = (
        <div
          className="ss-circle-button-holder"
          onClick={() =>
            this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
              Index: index,
              Mask: 64,
              PreMultiplied: !enabled
            })
          }
        >
          {button}
          <div className="ss-heading">Pre Multiplied Key</div>
        </div>
      )
    }

    var diabledClass = !enabled ? 'sss ss-slider-outer' : 'sss ss-slider-outer disabled'
    return (
      <div className="ss-pmk">
        {label}
        <div className="ss-slider-holder">
          <div className={diabledClass}>
            <Slider
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: index,
                  Mask: 128,
                  Clip: e
                })
              }
              value={this.props.currentState.mixEffects[index].transition.dve.clip}
            />
            <div className="ss-slider-label">Clip:</div>
          </div>
          <MagicInput
            disabled={enabled}
            value={this.props.currentState.mixEffects[index].transition.dve.clip}
            callback={(value: any) => {
              if (value != '') {
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: index,
                  Mask: 128,
                  Clip: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <div className="ss-slider-holder">
          <div className={diabledClass}>
            <Slider
              tooltip={false}
              step={0.1}
              onChange={e =>
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: index,
                  Mask: 256,
                  Gain: e
                })
              }
              value={this.props.currentState.mixEffects[index].transition.dve.gain}
            />
            <div className="ss-slider-label">Gain:</div>
          </div>
          <MagicInput
            disabled={enabled}
            value={this.props.currentState.mixEffects[index].transition.dve.gain}
            callback={(value: any) => {
              if (value != '') {
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: index,
                  Mask: 256,
                  Gain: Math.min(100, Math.max(0, value))
                })
              }
            }}
          />
        </div>

        <label className={!enabled ? 'ss-checkbox-container' : 'ss-checkbox-container disabled'}>
          Invert
          <input
            type="checkbox"
            disabled={enabled}
            checked={this.props.currentState.mixEffects[index].transition.dve.invert}
            onClick={() =>
              this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: index,
                Mask: 512,
                Invert: !this.props.currentState.mixEffects[index].transition.dve.invert
              })
            }
          ></input>
          <span className={!enabled ? 'checkmark' : 'checkmark disabled'}></span>
        </label>
      </div>
    )
  }

  render() {
    var styleHeding = ['Push', 'Squeeze', 'Spin', 'Swoosh'][this.state.page]
    var currentStyle = this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style
    var style = []
    if (this.state.page === 0) {
      style.push(this.getPush())
    } else if (this.state.page === 1) {
      style.push(this.getSqueeze())
    } else if (this.state.page === 2) {
      style.push(this.getSpin())
    } else if (this.state.page === 3) {
      style.push(this.getSwoosh())
    }

    var rate = []

    if (this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style != 34) {
      rate.push(
        <div className="ss-row" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div className="ss-label">Rate:</div>
          <div className="ss-rate">
            <RateInput
              videoMode={this.props.currentState.settings.videoMode}
              value={this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.rate}
              callback={(e: number) =>
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: this.props.mixEffect,
                  Mask: 1,
                  Rate: e
                })
              }
            />
          </div>
        </div>
      )
    } else {
      rate.push(
        <div className="ss-row" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div className="ss-label">Rate:</div>
          <div className="ss-rate">
            <RateInput
              videoMode={this.props.currentState.settings.videoMode}
              value={this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.logoRate}
              callback={(e: number) =>
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: this.props.mixEffect,
                  Mask: 2,
                  LogoRate: e
                })
              }
            />
          </div>
        </div>
      )
    }

    var direction = []
    if (
      this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style == 32 ||
      this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style == 33
    ) {
      direction.push(
        <div className="ss-row" style={{ gridTemplateColumns: '1fr 1fr 1.5fr' }}>
          <div className="ss-label disabled">Direction:</div>
          <div className="ss-direction-holder">
            <div style={{ lineHeight: '25px' }} className="ss-button-inner ss-button-left disabled">
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
            <div style={{ lineHeight: '25px' }} className="ss-button-inner ss-button-right disabled">
              <FontAwesomeIcon icon={faAngleLeft} />
            </div>
          </div>
          <label
            className={
              this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style == 32 ||
              this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style == 33
                ? 'ss-checkbox-container disabled'
                : 'ss-checkbox-container'
            }
          >
            Flip Flop
            <input
              type="checkbox"
              disabled={true}
              checked={this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.flipFlop}
              onClick={() =>
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: this.props.mixEffect,
                  FlipFlop: !this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.flipFlop,
                  Mask: 2048
                })
              }
            ></input>
            <span
              className={
                this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style == 32 ||
                this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style == 33
                  ? 'checkmark disabled'
                  : 'checkmark'
              }
            ></span>
          </label>
        </div>
      )
    } else {
      direction.push(
        <div className="ss-row" style={{ gridTemplateColumns: '1fr 1fr 1.5fr' }}>
          <div className="ss-label">Direction:</div>
          <div className="ss-direction-holder">
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: this.props.mixEffect,
                  Reverse: false,
                  Mask: 1024
                })
              }
              style={{ lineHeight: '25px' }}
              className={
                !this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.reverse
                  ? 'ss-button-inner ss-button-left ss-button-inner-selected'
                  : 'ss-button-inner ss-button-left'
              }
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
            <div
              onClick={() =>
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: this.props.mixEffect,
                  Reverse: true,
                  Mask: 1024
                })
              }
              style={{ lineHeight: '25px' }}
              className={
                this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.reverse
                  ? 'ss-button-inner ss-button-right ss-button-inner-selected'
                  : 'ss-button-inner ss-button-right'
              }
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </div>
          </div>
          <label className="ss-checkbox-container">
            Flip Flop
            <input
              type="checkbox"
              checked={this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.flipFlop}
              onClick={() =>
                this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                  Index: this.props.mixEffect,
                  FlipFlop: !this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.flipFlop,
                  Mask: 2048
                })
              }
            ></input>
            <span className="checkmark"></span>
          </label>
        </div>
      )
    }

    return (
      <div>
        <div className="ss-dve-style-heading">{styleHeding}</div>

        {style}

        <div className="ss-dve-style-page-button-holder">
          <div
            onClick={() => this.setState({ page: 0 })}
            className={
              this.state.page === 0
                ? 'ss-dve-style-page-button currentPage'
                : currentStyle > 23 && currentStyle < 32
                ? 'ss-dve-style-page-button currentItem'
                : 'ss-dve-style-page-button'
            }
          ></div>
          <div
            onClick={() => this.setState({ page: 1 })}
            className={
              this.state.page === 1
                ? 'ss-dve-style-page-button currentPage'
                : currentStyle > 15 && currentStyle < 24
                ? 'ss-dve-style-page-button currentItem'
                : 'ss-dve-style-page-button'
            }
          ></div>
          <div
            onClick={() => this.setState({ page: 2 })}
            className={
              this.state.page === 2
                ? 'ss-dve-style-page-button currentPage'
                : currentStyle > 7 && currentStyle < 16
                ? 'ss-dve-style-page-button currentItem'
                : 'ss-dve-style-page-button'
            }
          ></div>
          <div
            onClick={() => this.setState({ page: 3 })}
            className={
              this.state.page === 3
                ? 'ss-dve-style-page-button currentPage'
                : currentStyle >= 0 && currentStyle < 8
                ? 'ss-dve-style-page-button currentItem'
                : 'ss-dve-style-page-button'
            }
          ></div>
        </div>

        {rate}

        {direction}

        <div className="ss-row" style={{ gridTemplateColumns: '1fr 25px 25px 25px 1fr' }}>
          <div className="ss-label">Effects: </div>
          <div
            onClick={() =>
              this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.mixEffect,
                Mask: 4,
                Style: 33
              })
            }
            style={{ borderRadius: '10px', lineHeight: '25px' }}
            className={
              this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style == 33
                ? 'ss-button-inner ss-button-inner-selected'
                : 'ss-button-inner'
            }
          >
            <FontAwesomeIcon icon={faUndoAlt} />
          </div>
          <div
            onClick={() =>
              this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.mixEffect,
                Mask: 4,
                Style: 32
              })
            }
            style={{ borderRadius: '10px', lineHeight: '25px' }}
            className={
              this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style == 32
                ? 'ss-button-inner ss-button-inner-selected'
                : 'ss-button-inner'
            }
          >
            <FontAwesomeIcon icon={faRedoAlt} />
          </div>
          <div
            onClick={() =>
              this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.mixEffect,
                Mask: 4,
                Style: 34
              })
            }
            style={{ borderRadius: '10px', lineHeight: '25px' }}
            className={
              this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style == 34
                ? 'ss-button-inner ss-button-inner-selected'
                : 'ss-button-inner'
            }
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>

        <div className="ss-row">
          <div
            className={
              this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style < 32
                ? 'ss-label disabled'
                : 'ss-label'
            }
          >
            Fill Source:
          </div>
          <select
            disabled={this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style < 32}
            onChange={e => {
              this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.mixEffect,
                Mask: 8,
                FillSource: e.currentTarget.value
              })
            }}
            value={this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.fillSource}
            className="ss-dropdown"
            id="cars"
          >
            {this.getSourceOptions()}
          </select>
        </div>

        <label
          className={
            this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style < 32
              ? 'ss-checkbox-container disabled'
              : 'ss-checkbox-container'
          }
        >
          Enable Key
          <input
            type="checkbox"
            checked={this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.enableKey}
            onClick={() =>
              this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.mixEffect,
                EnableKey: !this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.enableKey,
                Mask: 32
              })
            }
          ></input>
          <span
            className={
              this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style < 32
                ? 'checkmark disabled'
                : 'checkmark'
            }
          ></span>
        </label>

        <div className="ss-row">
          <div
            className={
              this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style < 32 ||
              !this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.enableKey
                ? 'ss-label disabled'
                : 'ss-label'
            }
          >
            Key Source:
          </div>
          <select
            disabled={
              this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.style < 32 ||
              !this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.enableKey
            }
            onChange={e => {
              this.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionDVESetCommand', {
                Index: this.props.mixEffect,
                Mask: 16,
                KeySource: e.currentTarget.value
              })
            }}
            value={this.props.currentState.mixEffects[this.props.mixEffect].transition.dve.keySource}
            className="ss-dropdown"
            id="cars"
          >
            {this.getSourceOptions()}
          </select>
        </div>

        {this.getPreMultBox(0)}
      </div>
    )
  }
}
