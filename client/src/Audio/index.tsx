import React from 'react'
import './Audio.scss'
import { AtemDeviceInfo } from '../Devices/types'
import { LibAtemState } from '../generated'
import { ErrorBoundary } from '../errorBoundary'
import { DevicePageWrapper, SendCommandStrict } from '../device-page-wrapper'
import { ClassicAudioPageInner } from './Classic'

export class AudioPage extends DevicePageWrapper {
  renderContent(sendCommand: SendCommandStrict, deviceState: LibAtemState.AtemState) {
    return (
      <ErrorBoundary key={this.context.activeDeviceId || ''}>
        <div className="page-audio">
          {deviceState.audio ? (
            <ClassicAudioPageInner sendCommand={sendCommand} currentState={deviceState} />
          ) : deviceState.fairlight ? (
            'Not Implemented'
          ) : (
            <p>Unknown audio system</p>
          )}
        </div>
      </ErrorBoundary>
    )
  }
}
