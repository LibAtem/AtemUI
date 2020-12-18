import React from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import { AtemDeviceInfo } from '../Devices/types'
import { GetDeviceId } from '../DeviceManager'
import { CommandSpecSet, CommandSpec, CommandProperty, CommandPropertyType } from './types'
import Select from 'react-select'
import update from 'immutability-helper'
import ToggleSwitch from 'bootstrap-switch-button-react'
import Slider from 'react-rangeslider'
import { prettyDecimal } from '../util'
import { ErrorBoundary } from '../errorBoundary'
import { DevicePageWrapper } from '../device-page-wrapper'

export class ManualCommandsPage extends DevicePageWrapper {
  renderContent(device: AtemDeviceInfo, signalR: signalR.HubConnection) {
    return (
      <ErrorBoundary key={this.context.activeDeviceId || ''}>
        <ManualCommandsPageInner device={device} signalR={signalR} />
      </ErrorBoundary>
    )
  }
}

interface ManualCommandsPageInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection
}
interface ManualCommandsPageInnerState {
  commandsSpec: CommandSpecSet['commands'] | null

  selectedCommand: { label: string; value: string } | null
}

class ManualCommandsPageInner extends React.Component<ManualCommandsPageInnerProps, ManualCommandsPageInnerState> {
  constructor(props: ManualCommandsPageInnerProps) {
    super(props)

    this.state = {
      commandsSpec: null,
      selectedCommand: null,
    }

    if (props.device.connected) {
      this.loadCommandsSpec(props)
    }
  }

  loadCommandsSpec(props: ManualCommandsPageInnerProps) {
    fetch(`/api/spec/${GetDeviceId(props.device)}`)
      .then((res) => res.json())
      .then((data: CommandSpecSet) => {
        console.log('Commands: Got new spec', data.commands)
        this.setState({
          commandsSpec: data.commands,
        })
      })
      .catch((err) => {
        console.error('Commands: Failed to load spec:', err)
        this.setState({
          commandsSpec: null,
        })
      })
  }

  componentDidMount() {
    this.loadCommandsSpec(this.props)
  }

  componentDidUpdate(prevProps: ManualCommandsPageInnerProps) {
    // Should we reload the commandsSpec?
    if (
      prevProps.device.version !== this.props.device.version // Firmware is now different
    ) {
      this.setState({
        // TODO - should this be delayed as old data is good enough to get us started
        commandsSpec: null,
      })
      // now reload it
      this.loadCommandsSpec(this.props)
    }
  }

  render() {
    const { device, signalR } = this.props
    const { commandsSpec, selectedCommand } = this.state

    if (!commandsSpec) {
      return <p>Loading spec...</p>
    }

    const options = Object.values(commandsSpec).map((cmd) => ({
      value: cmd.fullName,
      label: cmd.name,
    }))

    const selectedCommandSpec = selectedCommand ? commandsSpec[selectedCommand.value] : undefined

    return (
      <div>
        <Select
          value={selectedCommand}
          onChange={(v) => this.setState({ selectedCommand: v as any })}
          options={options}
        />

        <CommandBuilder
          key={selectedCommand ? selectedCommand.value : ''}
          device={device}
          signalR={signalR}
          spec={selectedCommandSpec}
        />
      </div>
    )
  }
}

interface CommandBuilderProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection

  spec: CommandSpec | undefined
}
interface CommandBuilderState {
  values: { [propName: string]: any }
}

class CommandBuilder extends React.Component<CommandBuilderProps, CommandBuilderState> {
  constructor(props: CommandBuilderProps) {
    super(props)

    // Calculate and set default values
    const defaultValues: { [propName: string]: any } = {}

    if (props.spec) {
      props.spec.properties.forEach((prop) => {
        switch (prop.type) {
          case CommandPropertyType.Enum:
            const first = prop.options && prop.options[0] ? prop.options[0].id : undefined
            defaultValues[prop.name] = first || 0
            break
          case CommandPropertyType.Bool:
            defaultValues[prop.name] = false
            break
          case CommandPropertyType.Int:
          case CommandPropertyType.Double:
            defaultValues[prop.name] = prop.min || 0
            break
          default:
            console.log('todo')
        }
      })
    }

    this.state = {
      values: defaultValues,
    }
  }

  render() {
    const { spec } = this.props
    const { values } = this.state
    if (!spec) {
      return <p>Select a command</p>
    } else if (!spec.isValid) {
      return <p>This command is incomplete</p>
    }

    const onPropChange = (propName: string, value: any) => {
      const modifier: any = {}
      modifier[propName] = { $set: value }
      this.setState(update(this.state, { values: modifier }))
    }

    return (
      <div>
        <Form>
          {spec.properties.map((prop) => {
            return (
              <Form.Group key={prop.name} as={Row}>
                <Form.Label column sm={2}>
                  {prop.name}
                </Form.Label>
                <Col sm={10}>{this.renderProperty(prop, onPropChange, values[prop.name])}</Col>
              </Form.Group>
            )
          })}

          <Button variant="primary" onClick={() => this.sendCommand()} disabled={!this.props.device.connected || !spec}>
            Send
          </Button>
        </Form>
      </div>
    )
  }

  private sendCommand() {
    const { device, signalR, spec } = this.props
    if (device.connected && spec) {
      const devId = GetDeviceId(device)
      console.log(spec.fullName)
      console.log(this.state.values)
      signalR
        .invoke('CommandSend', devId, spec.fullName, JSON.stringify(this.state.values))
        .then((res) => {
          console.log('ManualCommands: sent')
          console.log(res)
        })
        .catch((e) => {
          console.log('ManualCommands: Failed to send', e)
        })
    }
  }

  private renderProperty(spec: CommandProperty, change: (propName: string, value: any) => void, value: any) {
    switch (spec.type) {
      case CommandPropertyType.Flags:
        return <CommandBuilderFlagsProperty spec={spec} change={change} value={value as number} />
      case CommandPropertyType.Enum:
        return <CommandBuilderEnumProperty spec={spec} change={change} value={value as number} />
      case CommandPropertyType.Bool:
        return <CommandBuilderBoolProperty spec={spec} change={change} value={value as boolean} />
      case CommandPropertyType.Int:
      case CommandPropertyType.Double:
        return <CommandBuilderSliderProperty spec={spec} change={change} value={value as number} />
      default:
        return <p>Unknown type</p>
    }
  }
}

interface CommandBuilderPropertyProps<T> {
  spec: CommandProperty

  value: T
  change: (propName: string, value: T) => void
}
class CommandBuilderEnumProperty extends React.Component<CommandBuilderPropertyProps<number>> {
  render() {
    const { spec } = this.props
    if (!spec.options) {
      return <p>Invalid property</p>
    }

    return (
      <Form.Control
        as="select"
        placeholder={spec.name}
        value={this.props.value + ''}
        onChange={(e) => {
          this.props.change(spec.name, parseInt(e.currentTarget.value || '', 10))
        }}
      >
        {spec.options.map((v, i) => (
          <option key={i} value={v.id}>
            {v.name}
          </option>
        ))}
      </Form.Control>
    )
  }
}
class CommandBuilderBoolProperty extends React.Component<CommandBuilderPropertyProps<boolean>> {
  render() {
    return (
      <ToggleSwitch
        checked={this.props.value}
        onlabel=" "
        onstyle="success"
        offlabel=" "
        onChange={(checked: boolean) => {
          this.props.change(this.props.spec.name, checked)
        }}
      />
    )
  }
}
class CommandBuilderFlagsProperty extends React.Component<CommandBuilderPropertyProps<number>> {
  render() {
    const { spec } = this.props
    if (!spec.options) {
      return <p>Invalid property</p>
    }

    return spec.options
      .filter((v) => v.id !== 0)
      .map((v) => {
        return (
          <div key={v.id}>
            <span>{v.name}: </span>
            <ToggleSwitch
              checked={(this.props.value & v.id) !== 0}
              onlabel=" "
              onstyle="success"
              offlabel=" "
              onChange={(checked: boolean) => {
                const newValue = checked ? this.props.value | v.id : this.props.value ^ v.id
                this.props.change(this.props.spec.name, newValue)
              }}
            />
          </div>
        )
      })
  }
}
class CommandBuilderSliderProperty extends React.Component<CommandBuilderPropertyProps<number>> {
  render() {
    const { spec } = this.props
    if (spec.min === undefined || spec.max === undefined) {
      return <p>Invalid property</p>
    }
    if (spec.type === CommandPropertyType.Double && spec.scale === undefined) {
      return <p>Invalid property</p>
    }

    let min = spec.min
    let max = spec.max
    let value = this.props.value
    const scale = spec.scale
    let step = 1

    if (scale) {
      min /= scale
      max /= scale
      value /= scale
      step /= scale
    }

    const horizontalLabels: any = {}
    horizontalLabels[min] = min
    horizontalLabels[0] = 0
    horizontalLabels[max] = max

    const change = (val: number) => {
      if (val < min) val = min
      if (val > max) val = max
      if (scale) val *= scale
      this.props.change(spec.name, val)
      //   const updDat = { data: {} }
      //   updDat.data[spec.$.id] = { $set: val }
      //   this.setState(update(this.state, updDat))
    }

    return [
      <Slider
        key={0}
        min={min}
        max={max}
        step={step}
        labels={horizontalLabels}
        onChange={change}
        value={value}
        format={prettyDecimal}
      />,
      <br key={1} />,
      <Form.Control
        key={2}
        type="number"
        placeholder={spec.name}
        min={min}
        max={max}
        value={prettyDecimal(value)}
        onChange={(e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
          change(parseInt(e.currentTarget.value || '', 10))
        }}
      />,
    ]
  }
}
