import React from 'react'
import { Container } from 'react-bootstrap'
import { SendCommandStrict } from '../device-page-wrapper'
import { CheckboxInput, SelectInput } from '../components'
import { LibAtemCommands, LibAtemEnums, LibAtemState } from '../generated'

enum OnOff {
  On,
  Off,
}

interface ClassicAudioSettingsProps {
  sendCommand: SendCommandStrict
  audio: LibAtemState.AudioState
  talkback: LibAtemState.SettingsState_TalkbackState[]
}
export class ClassicAudioSettings extends React.Component<ClassicAudioSettingsProps> {
  render() {
    const monitorOutput: LibAtemState.AudioState_MonitorOutputState | undefined = this.props.audio.monitorOutputs[0]
    const talkback: LibAtemState.SettingsState_TalkbackState | undefined = this.props.talkback[0]

    return (
      <Container className="maxW">
        <div className="atem-form center">
          <div className="atem-heading">Audio</div>

          <SelectInput
            label="Audio monitor outputs are:"
            disabled={monitorOutput === undefined}
            value={monitorOutput?.enabled ? OnOff.On : OnOff.Off}
            options={[
              {
                id: OnOff.Off,
                label: 'Program audio',
              },
              {
                id: OnOff.On,
                label: 'Monitor audio',
              },
            ]}
            onChange={(v) =>
              this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerMonitorSetCommand', {
                Mask: LibAtemCommands.Audio_AudioMixerMonitorSetCommand_MaskFlags.Enabled,
                Enabled: v === OnOff.On,
              })
            }
          />

          <SelectInput
            label="Audio Follow Video:"
            value={this.props.audio.programOut.audioFollowVideoCrossfadeTransitionEnabled ? OnOff.On : OnOff.Off}
            options={[
              {
                id: OnOff.Off,
                label: 'Normal',
              },
              {
                id: OnOff.On,
                label: 'Transition',
              },
            ]}
            onChange={(v) =>
              this.props.sendCommand('LibAtem.Commands.Audio.AudioMixerPropertiesSetCommand', {
                Mask: LibAtemCommands.Audio_AudioMixerPropertiesSetCommand_MaskFlags.AudioFollowVideo,
                AudioFollowVideo: v === OnOff.On,
              })
            }
          />

          <hr />

          <div className="atem-heading">Talkback via SDI Channels 15 and 16</div>

          <div>{/* Push checkbox to right column */}</div>
          <CheckboxInput
            label="Enable all talkback on SDI inputs and outputs"
            style={{ gridColumn: 'span 1' }}
            value={!(talkback?.muteSDI ?? false)}
            disabled={talkback === undefined}
            onChange={(v) => {
              this.props.sendCommand('LibAtem.Commands.Talkback.TalkbackMixerPropertiesSetCommand', {
                Mask: LibAtemCommands.Talkback_TalkbackMixerPropertiesSetCommand_MaskFlags.MuteSDI,
                Channel: LibAtemEnums.TalkbackChannel.Production,
                MuteSDI: !v,
              })
            }}
          />
        </div>
      </Container>
    )
  }
}
