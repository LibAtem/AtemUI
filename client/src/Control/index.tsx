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
import { LibAtemState, LibAtemProfile } from '../generated'
import { AtemButtonBar } from './button/button'

export class ControlPage extends DevicePageWrapper {
  renderContent(device: AtemDeviceInfo, signalR: signalR.HubConnection) {
    return (
      <ControlPageInnerInner
        device={device}
        currentState={this.context.currentState}
        signalR={signalR}
        profile={this.context.currentProfile}
      />
    )
  }
}

interface ControlPageInnerInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
  currentState: LibAtemState.AtemState | null
  profile: LibAtemProfile.DeviceProfile | null
}
interface ControlPageInnerInnerState {
  open: boolean
  openMobile: boolean
}

function OpenCloseButton(props: { open: boolean; change: (v: boolean) => void }) {
  if (props.open) {
    return (
      <div onClick={() => props.change(false)} className="open-button">
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
    )
  } else {
    return (
      <div onClick={() => props.change(true)} className="open-button">
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
    )
  }
}

//Handles Mobile Layout
class ControlPageInnerInner extends React.Component<ControlPageInnerInnerProps, ControlPageInnerInnerState> {
  constructor(props: MixEffectPanelProps) {
    super(props)
    this.state = {
      open: true,
      openMobile: false
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
                  profile={this.props.profile}
                  device={this.props.device}
                  currentState={this.props.currentState}
                  signalR={this.props.signalR}
                />

                <OpenCloseButton open={this.state.open} change={v => this.setState({ open: v })} />

                <SwitcherSettings
                  full={false}
                  device={this.props.device}
                  currentState={this.props.currentState}
                  profile={this.props.profile}
                  signalR={this.props.signalR}
                />
              </div>
            ) : (
              <div className="control-page" style={{ gridTemplateColumns: '1fr 20px' }}>
                <MixEffectPanel
                  open={this.state.open}
                  profile={this.props.profile}
                  device={this.props.device}
                  currentState={this.props.currentState}
                  signalR={this.props.signalR}
                />

                <OpenCloseButton open={this.state.open} change={v => this.setState({ open: v })} />
              </div>
            )
          ) : this.state.openMobile ? (
            <div className="control-page" style={{ display: 'box' }}>
              <AtemButtonBar
                style={{ margin: '10px' }}
                options={[
                  {
                    label: 'Control',
                    value: false
                  },
                  {
                    label: 'Settings',
                    value: true
                  }
                ]}
                selected={this.state.openMobile}
                onChange={v => this.setState({ openMobile: v })}
              />

              <SwitcherSettings
                full={true}
                device={this.props.device}
                currentState={this.props.currentState}
                profile={this.props.profile}
                signalR={this.props.signalR}
              />
            </div>
          ) : (
            <div className="control-page">
              <AtemButtonBar
                style={{ margin: '10px' }}
                options={[
                  {
                    label: 'Control',
                    value: false
                  },
                  {
                    label: 'Settings',
                    value: true
                  }
                ]}
                selected={this.state.openMobile}
                onChange={v => this.setState({ openMobile: v })}
              />

              <MixEffectPanel
                device={this.props.device}
                profile={this.props.profile}
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
  profile: LibAtemProfile.DeviceProfile | null
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
    const { currentState, profile } = this.props
    const { hasConnected } = this.state

    if (!hasConnected) {
      return <p>Device is not connected</p>
    } else if (!currentState || !profile) {
      return <p>Loading state...</p>
    }

    const meIndex = 0
    const currentME = currentState.mixEffects[meIndex]

    const sources = compact(
      Object.entries(currentState.settings.inputs).map(([id, src]) => {
        const val = videoIds[id as any]
        if (val !== undefined && src) {
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
          profile={profile}
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
