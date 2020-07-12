import React from 'react'
import './control.scss'
import { AtemDeviceInfo } from '../Devices/types'
import { SwitcherSettings } from './Settings/settings'
import { videoIds } from '../ControlSettings/ids'
import MediaQuery from 'react-responsive'
import { DSKPanel } from './dsk'
import { NextPanel } from './next'
import { FTBPanel } from './ftb'
import { TransitionStylePanel } from './style'
import { BankPanel, InputProps } from './bank'
import { DevicePageWrapper, sendCommandStrict } from '../device-page-wrapper'
import { LibAtemState } from '../generated'

export class ControlPage extends DevicePageWrapper {
  renderContent(device: AtemDeviceInfo, signalR: signalR.HubConnection) {
    return (
      <ControlPageInnerInner
        device={device}
        currentState={this.context.currentState}
        signalR={signalR}
      />
    )
  }
}

interface ControlPageInnerInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
  currentState: LibAtemState.AtemState | null
}
interface ControlPageInnerInnerState {
  open: boolean
  openMobile: boolean
}

//Handles Mobile Layout
class ControlPageInnerInner extends React.Component<ControlPageInnerInnerProps, ControlPageInnerInnerState> {
  constructor(props: MixEffectPanelProps) {
    super(props)
    this.state = {
      open: true,
      openMobile: false,
    }
  }

  render() {
    return (
      <MediaQuery minWidth="950px">
        {matches =>
          matches ? (
            this.state.open ? (
              <div className="control-page" style={{ gridTemplateColumns: '1fr 20px 310px' }}>
                <MixEffectPanel
                  open={this.state.open}
                  device={this.props.device}
                  currentState={this.props.currentState}
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
                  currentState={this.props.currentState}
                  signalR={this.props.signalR}
                />
              </div>
            ) : (
              <div className="control-page" style={{ gridTemplateColumns: '1fr 20px' }}>
                <MixEffectPanel
                  open={this.state.open}
                  device={this.props.device}
                  currentState={this.props.currentState}
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
                currentState={this.props.currentState}
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

              <MixEffectPanel
                device={this.props.device}
                currentState={this.props.currentState}
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

interface MixEffectPanelProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
  currentState: LibAtemState.AtemState | null
  open: boolean
}
interface MixEffectPanelState {
  hasConnected: boolean
}

function compact<T>(raw: Array<T | undefined>): T[] {
  return raw.filter(v => v !== undefined) as T[]
}

class MixEffectPanel extends React.Component<MixEffectPanelProps, MixEffectPanelState> {
  constructor(props: MixEffectPanelProps) {
    super(props)
    this.state = {
      hasConnected: props.device.connected
    }
  }

  componentDidUpdate(prevProps: MixEffectPanelProps) {
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
          sendCommand={(...args) => sendCommandStrict(this.props, ...args)}
        />
        <TransitionStylePanel
          meIndex={meIndex}
          properties={currentME.transition.properties}
          position={currentME.transition.position}
          videoMode={currentState.settings.videoMode}
          sendCommand={(...args) => sendCommandStrict(this.props, ...args)}
        />
        <BankPanel
          meIndex={meIndex}
          inTransition={currentME.transition.position.inTransition}
          isProgram={false}
          currentSource={currentME.sources.preview}
          sources={sources}
          sendCommand={(...args) => sendCommandStrict(this.props, ...args)}
        />
        <NextPanel
          meIndex={meIndex}
          transition={currentME.transition.properties}
          keyers={currentME.keyers.map(k => ({ onAir: k.onAir }))}
          sendCommand={(...args) => sendCommandStrict(this.props, ...args)}
        />
        <DSKPanel
          downstreamKeyers={currentState.downstreamKeyers}
          videoMode={currentState.settings.videoMode}
          sendCommand={(...args) => sendCommandStrict(this.props, ...args)}
        />
        <FTBPanel
          meIndex={meIndex}
          videoMode={currentState.settings.videoMode}
          status={currentME.fadeToBlack.status}
          sendCommand={(...args) => sendCommandStrict(this.props, ...args)}
        />
      </div>
    )
  }
}
