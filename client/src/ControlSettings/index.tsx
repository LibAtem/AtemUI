import React from 'react'
import './settings.scss'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import { Container, ButtonGroup, Button, Form, Row, Col } from 'react-bootstrap'
import { videoIds } from './ids'
import { LibAtemState, LibAtemProfile, LibAtemEnums } from '../generated'
import { sendCommandStrict } from '../device-page-wrapper'
import { AtemButtonBar, SourcesMap } from '../components'
import { GeneralSettings } from './general'
import { CommandTypes } from '../generated/commands'
import { ErrorBoundary } from '../errorBoundary'
import { MultiViewSettings } from './multiview'
import { shallowEqualObjects } from 'shallow-equal'
import { RemoteSettings } from './remote'
import { ClassicAudioSettings } from './classicAudio'

export class ControlSettingsPage extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>

  static contextType = DeviceManagerContext

  render() {
    const device = GetActiveDevice(this.context)

    return (
      <div className="settings-page">
        <Container>
          <ErrorBoundary key={this.context.activeDeviceId || ''}>
            {device && this.context.signalR ? (
              <ControlSettingsPageInner
                key={this.context.activeDeviceId || ''}
                device={device}
                currentState={this.context.currentState}
                currentProfile={this.context.currentProfile}
                signalR={this.context.signalR}
              />
            ) : (
              <p>No device selected</p>
            )}
          </ErrorBoundary>
        </Container>
      </div>
    )
  }
}

interface ControlSettingsPageInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
  currentState: LibAtemState.AtemState | null
  currentProfile: LibAtemProfile.DeviceProfile | null
}
interface ControlSettingsPageInnerState {
  hasConnected: boolean
  page: number
  // currentState: any
}

class ControlSettingsPageInner extends React.Component<ControlSettingsPageInnerProps, ControlSettingsPageInnerState> {
  constructor(props: ControlSettingsPageInnerProps) {
    super(props)

    this.state = {
      hasConnected: this.props.device.connected,
      page: 0,
    }

    this.sendCommand = this.sendCommand.bind(this)
  }

  private sendCommand(...args: CommandTypes) {
    sendCommandStrict(this.props, ...args)
  }

  private lastSourcesMap: ReadonlyMap<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState> = new Map()
  private lastSourcesInput: { [key: string]: LibAtemState.InputState } = {}
  private getSourcesMap(): SourcesMap {
    const newInputs = this.props.currentState?.settings?.inputs

    if (!shallowEqualObjects(newInputs ?? {}, this.lastSourcesInput)) {
      const sources = new Map<LibAtemEnums.VideoSource, LibAtemState.InputState_PropertiesState>()
      if (newInputs) {
        for (const [k, v] of Object.entries(newInputs)) {
          const id = videoIds[k]
          if (id !== undefined) {
            sources.set(id, v.properties)
          }
        }
      }

      this.lastSourcesInput = { ...newInputs }
      this.lastSourcesMap = sources
    }

    return this.lastSourcesMap
  }

  public updateLabel(name: string, id: number) {
    const { device, signalR } = this.props
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('updateLabel', devId, name, id)
        .then((res) => {
          // console.log(value)
          console.log('ManualCommands: sent')
          // console.log(command)
        })
        .catch((e) => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }

  componentDidUpdate(prevProps: ControlSettingsPageInnerProps) {
    // Should we reload the commandsSpec
    if (
      !this.state.hasConnected &&
      this.props.device.connected // Device first connection
    ) {
      this.setState({
        // TODO - should this be delayed as old data is good enough to get us started
        hasConnected: true,
      })
    }
  }

  render() {
    const { device, currentState } = this.props
    const { hasConnected } = this.state

    if (!hasConnected) {
      return <p className="mt-5">Device is not connected</p>
    } else if (!currentState) {
      return <p className="mt-5">Loading state...</p>
    }

    const sources = this.getSourcesMap()

    return (
      <div className="settings-content">
        <AtemButtonBar
          selected={this.state.page}
          options={[
            {
              value: 0,
              label: 'General',
            },
            {
              value: 1,
              label: 'Audio',
            },
            {
              value: 2,
              label: 'Multi View',
              disabled: !this.props.currentState?.info.multiViewers,
            },
            {
              value: 3,
              label: 'Labels',
            },
            {
              value: 4,
              label: 'HyperDeck',
            },
            {
              value: 5,
              label: 'Remote',
            },
          ]}
          onChange={(newPage) => this.setState({ page: newPage })}
        />

        {this.state.page === 0 ? (
          <ErrorBoundary key={0}>
            <GeneralSettings sendCommand={this.sendCommand} currentState={currentState} />
          </ErrorBoundary>
        ) : undefined}

        {this.state.page === 1 ? (
          <ErrorBoundary key={1}>
            {currentState.audio ? (
              <ClassicAudioSettings
                sendCommand={this.sendCommand}
                audio={currentState.audio}
                talkback={currentState.settings.talkback}
              />
            ) : (
              ''
            )}
          </ErrorBoundary>
        ) : undefined}

        {this.state.page === 2 ? (
          <ErrorBoundary key={2}>
            <MultiViewSettings
              sendCommand={this.sendCommand}
              sources={sources}
              info={currentState.info.multiViewers}
              multiViewers={currentState.settings.multiViewers}
            />
          </ErrorBoundary>
        ) : undefined}

        {this.state.page === 3 ? (
          <ErrorBoundary key={3}>
            <LabelSettings
              device={device}
              currentState={currentState}
              signalR={this.props.signalR}
              currentProfile={this.props.currentProfile}
              sendCommand={this.sendCommand}
              updateLabel={this.updateLabel}
            />
          </ErrorBoundary>
        ) : undefined}

        {/* TODO HyperDeck */}

        {this.state.page === 5 ? (
          <ErrorBoundary key={5}>
            <RemoteSettings sendCommand={this.sendCommand} currentState={currentState} />
          </ErrorBoundary>
        ) : undefined}
      </div>
    )
  }
}

interface LabelSettingsProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
  currentState: any
  currentProfile: any
  sendCommand: any
  updateLabel: any
}
interface LabelSettingsState {
  page: number
}

class LabelSettings extends React.Component<LabelSettingsProps, LabelSettingsState> {
  state = {
    page: 0,
  }

  signalR = this.props.signalR
  device = this.props.device

  public sendCommand(command: string, value: any) {
    const signalR = this.signalR
    const device = this.device
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then((res) => {
          console.log(value)
          console.log('ManualCommands: sent')
          console.log(command)
        })
        .catch((e) => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }

  public updateLable(name: string, id: number) {
    const signalR = this.signalR
    const device = this.device
    console.log('update label', name, id)
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('updateLabel', devId, name, id)
        .then((res) => {
          // console.log(value)
          console.log('ManualCommands: sent')
          // console.log(command)
        })
        .catch((e) => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }

  render() {
    var content = <></>
    if (this.state.page == 0) {
      content = (
        <InputLabelSettings
          key={this.context.activeDeviceId || ''}
          device={this.props.device}
          currentState={this.props.currentState}
          signalR={this.props.signalR}
          currentProfile={this.props.currentProfile}
          sendCommand={this.sendCommand}
          updateLabel={this.updateLable}
        />
      )
    } else if (this.state.page == 1) {
      content = (
        <OutputLabelSettings
          key={this.context.activeDeviceId || ''}
          device={this.props.device}
          currentState={this.props.currentState}
          signalR={this.props.signalR}
          currentProfile={this.props.currentProfile}
          sendCommand={this.sendCommand}
          updateLabel={this.updateLable}
        />
      )
    } else if (this.state.page == 2) {
      content = (
        <MediaLabelSettings
          key={this.context.activeDeviceId || ''}
          device={this.props.device}
          currentState={this.props.currentState}
          signalR={this.props.signalR}
          currentProfile={this.props.currentProfile}
          sendCommand={this.sendCommand}
          updateLabel={this.updateLable}
        />
      )
    }

    return (
      <Container className="maxW">
        <Row className="justify-content-md-center p-5">
          <ButtonGroup aria-label="Basic example">
            <Button onClick={() => this.setState({ page: 0 })} variant={this.state.page == 0 ? 'primary' : 'secondary'}>
              Input
            </Button>
            <Button onClick={() => this.setState({ page: 1 })} variant={this.state.page == 1 ? 'primary' : 'secondary'}>
              Output
            </Button>
            <Button onClick={() => this.setState({ page: 2 })} variant={this.state.page == 2 ? 'primary' : 'secondary'}>
              Media
            </Button>
          </ButtonGroup>
        </Row>
        {content}
      </Container>
    )
  }
}

class InputLabelSettings extends React.Component<LabelSettingsProps, LabelSettingsState> {
  state = {
    page: 0,
  }

  set() {
    var outputs = Object.keys(this.props.currentState.settings.inputs).filter((x) => x.includes('input'))
    for (var i in outputs) {
      // console.log(Object.keys(this.props.currentState.settings.inputs).indexOf(outputs[i].toString()))
      var index = Object.keys(this.props.currentState.settings.inputs).indexOf(outputs[i].toString())
      var port = document.getElementById('port' + i) as HTMLInputElement
      var long = document.getElementById('long' + i) as HTMLInputElement
      var short = document.getElementById('short' + i) as HTMLInputElement
      console.log(outputs[i], index)
      var id = videoIds[outputs[i]]
      if (long && short) {
      }
      if (
        long.value != this.props.currentState.settings.inputs['input' + index].properties.longName &&
        short.value != this.props.currentState.settings.inputs['input' + index].properties.shortName &&
        port.value !=
          this.props.currentState.settings.inputs['input' + (parseInt(i) + 1)].properties.currentExternalPortType
      ) {
        this.props.updateLabel(long.value, id)
        this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
          Id: index,
          Mask: 7,
          LongName: long.value,
          ShortName: short.value,
          ExternalPortType: parseInt(port.value),
        })
      } else if (
        long.value != this.props.currentState.settings.inputs['input' + index].properties.longName &&
        short.value != this.props.currentState.settings.inputs['input' + index].properties.shortName
      ) {
        this.props.updateLabel(long.value, id)
        this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
          Id: index,
          Mask: 3,
          LongName: long.value,
          ShortName: short.value,
        })
      } else if (
        long.value != this.props.currentState.settings.inputs['input' + index].properties.longName &&
        port.value !=
          this.props.currentState.settings.inputs['input' + (parseInt(i) + 1)].properties.currentExternalPortType
      ) {
        this.props.updateLabel(long.value, id)
        this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
          Id: index,
          Mask: 5,
          LongName: long.value,
          ExternalPortType: parseInt(port.value),
        })
      } else if (
        short.value != this.props.currentState.settings.inputs['input' + index].properties.shortValue &&
        port.value !=
          this.props.currentState.settings.inputs['input' + (parseInt(i) + 1)].properties.currentExternalPortType
      ) {
        this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
          Id: index,
          Mask: 6,
          ShortName: short.value,
          ExternalPortType: parseInt(port.value),
        })
      } else if (long.value != this.props.currentState.settings.inputs['input' + index].properties.longName) {
        this.props.updateLabel(long.value, id)
        this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
          Id: index,
          Mask: 1,
          LongName: long.value,
        })
      } else if (short.value != this.props.currentState.settings.inputs['input' + index].properties.shortName) {
        this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
          Id: index,
          Mask: 2,
          ShortName: short.value,
        })
      } else if (
        port.value !=
        this.props.currentState.settings.inputs['input' + (parseInt(i) + 1)].properties.currentExternalPortType
      ) {
        this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
          Id: index,
          Mask: 4,
          ExternalPortType: parseInt(port.value),
        })
      }
    }
  }

  render() {
    var rows = []
    var portTypes = ['SDI', 'HDMI', 'Component', 'Composite', 'SVideo', 'Internal', 'XLR', 'AESEBU', 'RCA', 'TSJack']
    for (var i = 0; i < this.props.currentProfile.sources.length; i++) {
      var options = []
      for (var j in this.props.currentProfile.sources[i].port) {
        // console.log(this.props.currentProfile.sources[i].port)
        options.push(
          <option value={parseInt(this.props.currentProfile.sources[i].port[j])}>
            {portTypes[Math.log2(parseInt(this.props.currentProfile.sources[i].port[j]))]}
          </option>
        )
      }
      rows.push(
        <Form.Group as={Row}>
          <Form.Label column sm="1">
            {i + 1}
          </Form.Label>
          <Col sm="3">
            <Form.Control
              id={'port' + i}
              disabled={this.props.currentProfile.sources[i].port.length == 1}
              defaultValue={
                this.props.currentState.settings.inputs['input' + (i + 1)].properties.currentExternalPortType
              }
              as="select"
            >
              {options}
            </Form.Control>
          </Col>
          <Col sm="4">
            <Form.Control
              id={'long' + i}
              type="text"
              defaultValue={this.props.currentState.settings.inputs['input' + (i + 1)].properties.longName}
              placeholder={this.props.currentState.settings.inputs['input' + (i + 1)].properties.longName}
            />
          </Col>
          <Col sm="4">
            <Form.Control
              id={'short' + i}
              type="text"
              defaultValue={this.props.currentState.settings.inputs['input' + (i + 1)].properties.shortName}
              placeholder={this.props.currentState.settings.inputs['input' + (i + 1)].properties.longName}
            />
          </Col>
        </Form.Group>
      )
    }

    return (
      <Form id={'Page' + this.state.page}>
        <Row>
          <Col sm="1"></Col>
          <Col sm="3">Input</Col>
          <Col sm="4">Name</Col>
          <Col sm="4">Label</Col>
        </Row>
        {rows}
        <Button onClick={() => this.set()} variant="primary">
          Set
        </Button>
      </Form>
    )
  }
}

class OutputLabelSettings extends React.Component<LabelSettingsProps, LabelSettingsState> {
  constructor(props: LabelSettingsProps) {
    super(props)
    this.state = {
      // hasConnected: this.props.device.connected,
      // currentState: this.props.currentState,
      page: 0,
    }
  }

  set() {
    // var = ids[]
    var outputs = Object.keys(this.props.currentState.settings.inputs).filter(
      (x) => !x.includes('input') && !x.includes('mediaPlayer')
    )
    for (var i in outputs) {
      console.log(Object.keys(this.props.currentState.settings.inputs).indexOf(outputs[i].toString()))
      var index = Object.keys(this.props.currentState.settings.inputs).indexOf(outputs[i].toString())
      var long = document.getElementById('long' + i) as HTMLInputElement
      var short = document.getElementById('short' + i) as HTMLInputElement
      var id = videoIds[outputs[i]]
      console.log(outputs[i], id)
      if (long && short) {
        if (
          long.value != this.props.currentState.settings.inputs[outputs[i]].properties.longName &&
          short.value != this.props.currentState.settings.inputs[outputs[i]].properties.shortName
        ) {
          this.props.updateLabel(long.value, id)
          this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
            Id: id,
            Mask: 3,
            LongName: long.value,
            ShortName: short.value,
          })
        } else if (long.value != this.props.currentState.settings.inputs[outputs[i]].properties.longName) {
          this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
            Id: id,
            Mask: 1,
            LongName: long.value,
          })
          this.props.updateLabel(long.value, id)
        } else if (short.value != this.props.currentState.settings.inputs[outputs[i]].properties.shortName) {
          this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
            Id: id,
            Mask: 2,
            ShortName: short.value,
          })
        }
      }
    }
  }

  render() {
    var rows = []
    var outputs = Object.keys(this.props.currentState.settings.inputs).filter(
      (x) => !x.includes('input') && !x.includes('mediaPlayer')
    )
    for (var j in outputs) {
      rows.push(
        <Form.Group as={Row}>
          <Form.Label column sm="1">
            {parseInt(j) + 1}
          </Form.Label>
          <Col sm="6">
            <Form.Control
              id={'long' + j}
              type="text"
              placeholder={this.props.currentState.settings.inputs[outputs[j]].properties.longName}
              defaultValue={this.props.currentState.settings.inputs[outputs[j]].properties.longName}
            />
          </Col>
          <Col sm="5">
            <Form.Control
              id={'short' + j}
              type="text"
              placeholder={this.props.currentState.settings.inputs[outputs[j]].properties.shortName}
              defaultValue={this.props.currentState.settings.inputs[outputs[j]].properties.shortName}
            />
          </Col>
        </Form.Group>
      )
    }
    return (
      <Form id={'Page' + this.state.page}>
        <Row>
          <Col sm="1"></Col>
          <Col sm="6">Name</Col>
          <Col sm="5">Label</Col>
        </Row>
        {rows}
        <Button onClick={() => this.set()} variant="primary">
          Set
        </Button>
      </Form>
    )
  }
}

class MediaLabelSettings extends React.Component<LabelSettingsProps, LabelSettingsState> {
  constructor(props: LabelSettingsProps) {
    super(props)
    this.state = {
      page: 0,
    }
  }

  set() {
    // var = ids[]
    var outputs = Object.keys(this.props.currentState.settings.inputs).filter((x) => x.includes('mediaPlayer'))
    for (var i in outputs) {
      console.log(Object.keys(this.props.currentState.settings.inputs).indexOf(outputs[i].toString()))
      var index = Object.keys(this.props.currentState.settings.inputs).indexOf(outputs[i].toString())
      var long = document.getElementById('long' + i) as HTMLInputElement
      var short = document.getElementById('short' + i) as HTMLInputElement
      var id = videoIds[outputs[i]]
      if (long && short) {
      }
      if (
        long.value != this.props.currentState.settings.inputs[outputs[i]].properties.longName &&
        short.value != this.props.currentState.settings.inputs[outputs[i]].properties.shortName
      ) {
        this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
          Id: id,
          Mask: 3,
          LongName: long.value,
          ShortName: short.value,
        })
        this.props.updateLabel(long.value, id)
      } else if (long.value != this.props.currentState.settings.inputs[outputs[i]].properties.longName) {
        this.props.updateLabel(long.value, id)
        this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
          Id: id,
          Mask: 1,
          LongName: long.value,
        })
      } else if (short.value != this.props.currentState.settings.inputs[outputs[i]].properties.shortName) {
        this.props.sendCommand('LibAtem.Commands.Settings.InputPropertiesSetCommand', {
          Id: id,
          Mask: 2,
          ShortName: short.value,
        })
      }
    }
  }

  render() {
    var rows = []
    var outputs = Object.keys(this.props.currentState.settings.inputs).filter((x) => x.includes('mediaPlayer'))
    for (var j in outputs) {
      rows.push(
        <Form.Group as={Row}>
          <Form.Label column sm="1">
            {parseInt(j) + 1}
          </Form.Label>
          <Col sm="6">
            <Form.Control
              id={'long' + j}
              type="text"
              placeholder={this.props.currentState.settings.inputs[outputs[j]].properties.longName}
              defaultValue={this.props.currentState.settings.inputs[outputs[j]].properties.longName}
            />
          </Col>
          <Col sm="5">
            <Form.Control
              id={'short' + j}
              type="text"
              placeholder={this.props.currentState.settings.inputs[outputs[j]].properties.shortName}
              defaultValue={this.props.currentState.settings.inputs[outputs[j]].properties.shortName}
            />
          </Col>
        </Form.Group>
      )
    }
    return (
      <Form id={'Page' + this.state.page}>
        <Row>
          <Col sm="1"></Col>
          <Col sm="6">Name</Col>
          <Col sm="5">Label</Col>
        </Row>
        {rows}
        <Button onClick={() => this.set()} variant="primary">
          Set
        </Button>
      </Form>
    )
  }
}
