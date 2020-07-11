import React from 'react'
import './control.scss'
import { AtemDeviceInfo } from '../Devices/types'
import { GetDeviceId } from '../DeviceManager'
import { SwitcherSettings } from './Settings/settings'
import { videoIds } from '../ControlSettings/ids'
import MediaQuery from 'react-responsive'
import { DSKPanel } from './dsk'
import { NextPanel } from './next'
import { FTBPanel } from './ftb'
import { TransitionStylePanel } from './style'
import { BankPanel, InputProps } from './bank'
import { DevicePageWrapper } from '../device-page-wrapper'

export type SendCommand = (commandName: string, args: { [key: string]: string | number | boolean }) => void

export class ControlPage extends DevicePageWrapper {
  renderContent(device: AtemDeviceInfo, signalR: signalR.HubConnection) {
    return (
      <ControlPageInnerInner
        device={device}
        // currentState={this.context.currentState}
        // currentState={this.state.currentState}
        signalR={signalR}
      />
    )
  }
}

interface ControlPageInnerInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
  // currentState: LibAtem.AtemState | null
}
interface ControlPageInnerInnerState {
  open: boolean
  openMobile: boolean
  currentState: LibAtem.AtemState | null
}

//Handles Mobile Layout
class ControlPageInnerInner extends React.Component<ControlPageInnerInnerProps, ControlPageInnerInnerState> {
  constructor(props: ControlPageInnerProps) {
    super(props)
    this.state = {
      open: true,
      openMobile: false,
      currentState: null
    }
  }

  componentDidMount() {
    if (this.props.signalR) {
      this.props.signalR.on('state', (state: any) => {
        state.audio = state.audio
          ? { programOut: { followFadeToBlack: state.audio.programOut.followFadeToBlack } }
          : undefined //remove levels which cause constant updates
        if (JSON.stringify(this.state.currentState) !== JSON.stringify(state)) {
          this.setState({ currentState: state })
        }
      })
    }
  }

  componentWillUnmount() {
    if (this.props.signalR) {
      this.props.signalR.off('state')
    }
  }

  render() {
    return (
      <MediaQuery minWidth="950px">
        {matches =>
          matches ? (
            this.state.open ? (
              <div className="control-page" style={{ gridTemplateColumns: '1fr 20px 310px' }}>
                <ControlPageInner
                  open={this.state.open}
                  device={this.props.device}
                  currentState={this.state.currentState}
                  signalR={this.props.signalR}
                />

                <div
                  onClick={() => {
                    this.setState({ open: false })
                  }}
                  className="open-button"
                >
                  <svg
                    style={{ position: 'absolute', top: '7px' }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="orange"
                    width="25px"
                    height="25px"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>

                <SwitcherSettings
                  full={false}
                  device={this.props.device}
                  currentState={this.state.currentState}
                  signalR={this.props.signalR}
                />
              </div>
            ) : (
              <div className="control-page" style={{ gridTemplateColumns: '1fr 20px' }}>
                <ControlPageInner
                  open={this.state.open}
                  device={this.props.device}
                  currentState={this.state.currentState}
                  signalR={this.props.signalR}
                />

                <div
                  onClick={() => {
                    this.setState({ open: true })
                  }}
                  className="open-button"
                >
                  <svg
                    style={{ position: 'absolute', left: '-1px', top: '7px' }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="orange"
                    width="25px"
                    height="25px"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                  </svg>
                </div>
              </div>
            )
          ) : this.state.openMobile ? (
            <div className="control-page" style={{ display: 'box' }}>
              <div className="ss-button-holder" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="ss-button-inner ss-button-left " onClick={() => this.setState({ openMobile: false })}>
                  Control
                </div>

                <div
                  className="ss-button-inner ss-button-right ss-button-inner-selected"
                  onClick={() => this.setState({ openMobile: true })}
                >
                  Settings
                </div>
              </div>

              <SwitcherSettings
                full={true}
                device={this.props.device}
                currentState={this.state.currentState}
                signalR={this.props.signalR}
              />
            </div>
          ) : (
            <div className="control-page">
              <div className="ss-button-holder" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div
                  className="ss-button-inner ss-button-left ss-button-inner-selected"
                  onClick={() => this.setState({ openMobile: false })}
                >
                  Control
                </div>

                <div className="ss-button-inner ss-button-right " onClick={() => this.setState({ openMobile: true })}>
                  Settings
                </div>
              </div>

              <ControlPageInner
                device={this.props.device}
                currentState={this.state.currentState}
                open={this.state.open}
                signalR={this.props.signalR}
              />
            </div>
          )
        }
      </MediaQuery>
    )
  }
}

interface ControlPageInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
  currentState: LibAtem.AtemState | null
  open: boolean
}
interface ControlPageInnerState {
  hasConnected: boolean
}

function compact<T>(raw: Array<T | undefined>): T[] {
  return raw.filter(v => v !== undefined) as T[]
}

class ControlPageInner extends React.Component<ControlPageInnerProps, ControlPageInnerState> {
  constructor(props: ControlPageInnerProps) {
    super(props)
    this.state = {
      hasConnected: props.device.connected
    }
    if (props.device.connected) {
      this.loadDeviceState(props)
    }
  }

  loadDeviceState(props: ControlPageInnerProps) {
    if (props.signalR) {
      props.signalR
        .invoke<any>('sendState', GetDeviceId(props.device))
        .then(state => {})
        .catch(err => {
          console.error('StateViewer: Failed to load state:', err)
        })
    }
  }

  public sendCommand(command: string, value: { [key: string]: string | number | boolean }) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then(res => {
          console.log(value)
          console.log('Control: sent')
          console.log(command)
        })
        .catch(e => {
          console.log('Control: Failed to send', e)
        })
    }
  }

  componentDidUpdate(prevProps: ControlPageInnerProps) {
    // Should we reload the commandsSpec
    if (
      !this.state.hasConnected &&
      this.props.device.connected // Device first connection
    ) {
      this.setState({
        // TODO - should this be delayed as old data is good enough to get us started
        hasConnected: true
      })
      // now reload
    }
  }

  render() {
    const { currentState } = this.props
    const { hasConnected } = this.state

    if (!hasConnected) {
      return <p>Device is not connected</p>
    } else if (!currentState) {
      return <p>Loading state...</p>
    }

    const meIndex = 0
    const currentME = currentState.mixEffects[meIndex]

    const sources = compact(
      Object.entries(currentState.settings.inputs).map(([id, src]) => {
        const val = videoIds[id as any]
        if (val !== undefined) {
          const r: InputProps = {
            index: val,
            name: src.properties.shortName,
            type: src.properties.internalPortType
          }
          return r
        } else {
          return undefined
        }
      })
    )

    return (
      <div className={this.props.open ? 'page-wrapper-control open' : 'page-wrapper-control'}>
        <BankPanel
          meIndex={meIndex}
          inTransition={false}
          isProgram={true}
          currentSource={currentME.sources.program}
          sources={sources}
          sendCommand={(command, values) => this.sendCommand(command, values)}
        />
        <TransitionStylePanel
          meIndex={meIndex}
          properties={currentME.transition.properties}
          position={currentME.transition.position}
          videoMode={currentState.settings.videoMode}
          sendCommand={(command, values) => this.sendCommand(command, values)}
        />
        <BankPanel
          meIndex={meIndex}
          inTransition={currentME.transition.position.inTransition}
          isProgram={false}
          currentSource={currentME.sources.preview}
          sources={sources}
          sendCommand={(command, values) => this.sendCommand(command, values)}
        />
        <NextPanel
          meIndex={meIndex}
          transition={currentME.transition.properties}
          keyers={currentME.keyers.map(k => ({ onAir: k.onAir }))}
          sendCommand={(command, values) => this.sendCommand(command, values)}
        />
        <DSKPanel
          downstreamKeyers={currentState.downstreamKeyers}
          videoMode={currentState.settings.videoMode}
          sendCommand={(command, values) => this.sendCommand(command, values)}
        />
        <FTBPanel
          meIndex={meIndex}
          videoMode={currentState.settings.videoMode}
          status={currentME.fadeToBlack.status}
          sendCommand={(command, values) => this.sendCommand(command, values)}
        />
      </div>
    )
  }
}
