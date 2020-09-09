import React from 'react'
import { Container } from 'react-bootstrap'
import { SendCommandStrict } from '../device-page-wrapper'
import { SelectInput } from '../components'
import { LibAtemState } from '../generated'
import { SerialModeOptions } from '../generated/manual-types'

interface RemoteSettingsProps {
  sendCommand: SendCommandStrict
  currentState: LibAtemState.AtemState
}
export class RemoteSettings extends React.Component<RemoteSettingsProps> {
  render() {
    const currentSerialMode = this.props.currentState.settings.serialMode
    return (
      <Container className="maxW">
        <div className="atem-form center">
          <div className="atem-heading">Remote</div>

          <SelectInput
            label="Use RS-422 control port to:"
            value={currentSerialMode}
            options={SerialModeOptions}
            onChange={(v) =>
              this.props.sendCommand('LibAtem.Commands.Settings.SerialPortModeCommand', {
                SerialMode: v,
              })
            }
          />

          <hr />
        </div>
      </Container>
    )
  }
}
