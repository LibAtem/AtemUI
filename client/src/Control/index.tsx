import React from 'react'
import './control.css'
import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import { SwitcherSettings, RateInput } from './Settings/settings'
import { AtemButtonYellow, AtemButtonFTB, AtemButtonGeneric } from './button/button'
import { videoIds } from '../ControlSettings/ids'
import MediaQuery, { useMediaQuery } from 'react-responsive'
import { DSKPanel } from './dsk'

export class ControlPage extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>

  static contextType = DeviceManagerContext

  render() {
    const device = GetActiveDevice(this.context)
    if (device) {
      if (device.connected) {
        return (
          <ControlPageInnerInner
            key={this.context.activeDeviceId || ''}
            device={device}
            // currentState={this.context.currentState}
            // currentState={this.state.currentState}
            signalR={this.context.signalR}
          />
        )
      } else {
        return <div>Device is not connected</div>
      }
    } else {
      return <div>No device Selected</div>
    }
  }
}

interface ControlPageInnerInnerProps {
  device: AtemDeviceInfo
  signalR: signalR.HubConnection | undefined
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
        state.audio = state.audio ? { programOut: { followFadeToBlack: state.audio.programOut.followFadeToBlack } } : undefined //remove levels which cause constant updates
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
  signalR: signalR.HubConnection | undefined
  currentState: LibAtem.AtemState | null
  open: boolean
}
interface ControlPageInnerState {
  hasConnected: boolean
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

  public sendCommand(command: string, value: any) {
    const signalR = this.props.signalR
    const device = this.props.device
    if (device.connected && signalR) {
      const devId = GetDeviceId(device)

      signalR
        .invoke('CommandSend', devId, command, JSON.stringify(value))
        .then(res => {
          console.log(value)
          console.log('ManualCommands: sent')
          console.log(command)
        })
        .catch(e => {
          console.log('ManualCommands: Failed to send', e)
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

    return (
      <div className={this.props.open ? 'page-wrapper-control open' : 'page-wrapper-control'}>
        <Program
          currentState={currentState}
          sendCommand={(command: string, values: any) => this.sendCommand(command, values)}
        />

        <Transition
          currentState={currentState}
          sendCommand={(command: string, values: any) => this.sendCommand(command, values)}
        />
        <Preview
          currentState={currentState}
          sendCommand={(command: string, values: any) => this.sendCommand(command, values)}
        />
        <Next
          currentState={currentState}
          sendCommand={(command: string, values: any) => this.sendCommand(command, values)}
        />
        <DSKPanel
          downstreamKeyers={currentState.downstreamKeyers}
          videoMode={currentState.settings.videoMode}
          sendCommand={(command: string, values: any) => this.sendCommand(command, values)}
        />
        <FTB
          currentState={currentState}
          sendCommand={(command: string, values: any) => this.sendCommand(command, values)}
        />
      </div>
    )
  }
}

interface ProgramProps {
  sendCommand: any
  currentState: LibAtem.AtemState
}

function Program(props: ProgramProps) {
  const inputs = props.currentState.settings.inputs as any
  var myKeys = Object.keys(inputs).filter(i => videoIds[i] < 50 && videoIds[i] > 0)
  const programSource = props.currentState.mixEffects[0].sources.program
  var programButtons = myKeys.map(item => (
    <AtemButtonGeneric
      color="red"
      name={inputs[item].properties.shortName}
      callback={() =>
        props.sendCommand('LibAtem.Commands.MixEffects.ProgramInputSetCommand', { Index: 0, Source: videoIds[item] })
      }
      active={item === `input${programSource}`} // TODO
    />
  ))

  var blkProgram = (
    <AtemButtonGeneric
      color="red"
      name={'Blk'}
      callback={() => props.sendCommand('LibAtem.Commands.MixEffects.ProgramInputSetCommand', { Index: 0, Source: 0 })}
      active={programSource === 0}
    />
  )
  var barsProgram = (
    <AtemButtonGeneric
      color="red"
      name={'Bars'}
      callback={() =>
        props.sendCommand('LibAtem.Commands.MixEffects.ProgramInputSetCommand', { Index: 0, Source: 1000 })
      }
      active={programSource === 1000}
    />
  )
  var col1Program = (
    <AtemButtonGeneric
      color="red"
      name={'Col1'}
      callback={() =>
        props.sendCommand('LibAtem.Commands.MixEffects.ProgramInputSetCommand', { Index: 0, Source: 2001 })
      }
      active={programSource === 2001}
    />
  )
  var mp1Program = (
    <AtemButtonGeneric
      color="red"
      name={'MP1'}
      callback={() =>
        props.sendCommand('LibAtem.Commands.MixEffects.ProgramInputSetCommand', { Index: 0, Source: 3010 })
      }
      active={programSource === 3010}
    />
  )
  var mp2Program = (
    <AtemButtonGeneric
      color="red"
      name={'MP2'}
      callback={() =>
        props.sendCommand('LibAtem.Commands.MixEffects.ProgramInputSetCommand', { Index: 0, Source: 3020 })
      }
      active={programSource === 3020}
    />
  )

  const isPhone = useMediaQuery({ query: '(min-width: 600px)' })

  if (!isPhone) {
    return (
      <div className="box pp" id="Program">
        <div className="box-title">Program</div>
        <div className="box-inner-mobile">
          <div className="box-inner-inputs">{programButtons}</div>
          <div className="box-program-row">
            {blkProgram}
            {barsProgram}
            {col1Program}
            {mp1Program}
            {mp2Program}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="box pp" id="Program">
        <div className="box-title">Program</div>
        <div className="box-inner">
          <div className="box-inner-inputs">{programButtons}</div>
          <div className="box-inner-mid">
            {blkProgram}
            {barsProgram}
          </div>
          <div className="box-inner-rest">
            {col1Program}
            <div></div>
            {mp1Program}
            {mp2Program}
          </div>
        </div>
      </div>
    )
  }
}

function Preview(props: ProgramProps) {
  const buttonColor = props.currentState.mixEffects[0].transition.position.inTransition ? 'red' : 'green'

  const inputs = props.currentState.settings.inputs as any
  var myKeys = Object.keys(inputs).filter(i => videoIds[i] < 50 && videoIds[i] > 0)
  const previewSource = props.currentState.mixEffects[0].sources.preview
  var previewButtons = myKeys.map(item => (
    <AtemButtonGeneric
      color={buttonColor}
      name={inputs[item].properties.shortName}
      callback={() =>
        props.sendCommand('LibAtem.Commands.MixEffects.PreviewInputSetCommand', { Index: 0, Source: videoIds[item] })
      }
      active={item === `input${previewSource}`} // TODO
    />
  ))

  var blk = (
    <AtemButtonGeneric
      color={buttonColor}
      name={'Blk'}
      callback={() => props.sendCommand('LibAtem.Commands.MixEffects.PreviewInputSetCommand', { Index: 0, Source: 0 })}
      active={previewSource === 0}
    />
  )
  var bars = (
    <AtemButtonGeneric
      color={buttonColor}
      name={'Bars'}
      callback={() =>
        props.sendCommand('LibAtem.Commands.MixEffects.PreviewInputSetCommand', { Index: 0, Source: 1000 })
      }
      active={previewSource === 1000}
    />
  )
  var col1 = (
    <AtemButtonGeneric
      color={buttonColor}
      name={'Col1'}
      callback={() =>
        props.sendCommand('LibAtem.Commands.MixEffects.PreviewInputSetCommand', { Index: 0, Source: 2001 })
      }
      active={previewSource === 2001}
    />
  )
  var mp1 = (
    <AtemButtonGeneric
      color={buttonColor}
      name={'MP1'}
      callback={() =>
        props.sendCommand('LibAtem.Commands.MixEffects.PreviewInputSetCommand', { Index: 0, Source: 3010 })
      }
      active={previewSource === 3010}
    />
  )
  var mp2 = (
    <AtemButtonGeneric
      color={buttonColor}
      name={'MP2'}
      callback={() =>
        props.sendCommand('LibAtem.Commands.MixEffects.PreviewInputSetCommand', { Index: 0, Source: 3020 })
      }
      active={previewSource === 3020}
    />
  )

  const isPhone = useMediaQuery({ query: '(min-width: 600px)' })

  if (!isPhone) {
    return (
      <div className="box pp" id="Preview">
        <div className="box-title">Preview</div>
        <div className="box-inner-mobile">
          <div className="box-inner-inputs">{previewButtons}</div>
          <div className="box-program-row">
            {blk}
            {bars}
            {col1}
            {mp1}
            {mp2}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="box pp" id="Preview">
        <div className="box-title">Preview</div>
        <div className="box-inner">
          <div className="box-inner-inputs">{previewButtons}</div>
          <div className="box-inner-mid">
            {blk}
            {bars}
          </div>
          <div className="box-inner-rest">
            {col1}
            <div></div>
            {mp1}
            {mp2}
          </div>
        </div>
      </div>
    )
  }
}

function Transition(props: ProgramProps) {
  var styleName = ['Mix', 'Dip', 'Wipe', 'DVE']
  var style = props.currentState.mixEffects[0].transition.properties.style
  return (
    <div className="box" id="Transition">
      <div className="box-title">Transition Style</div>
      <div className="box-transition">
        <AtemButtonYellow
          callback={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand', {
              Index: 0,
              Mask: 1,
              NextStyle: 0
            })
          }
          active={style === 0}
          name={'MIX'}
        ></AtemButtonYellow>
        <AtemButtonYellow
          callback={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand', {
              Index: 0,
              Mask: 1,
              NextStyle: 1
            })
          }
          active={style === 1}
          name={'DIP'}
        ></AtemButtonYellow>
        <AtemButtonYellow
          callback={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand', {
              Index: 0,
              Mask: 1,
              NextStyle: 2
            })
          }
          active={style === 2}
          name={'WIPE'}
        ></AtemButtonYellow>
        <AtemButtonYellow
          callback={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand', {
              Index: 0,
              Mask: 1,
              NextStyle: 4
            })
          }
          active={style === 4}
          name={'STING'}
        ></AtemButtonYellow>
        <AtemButtonYellow
          callback={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand', {
              Index: 0,
              Mask: 1,
              NextStyle: 3
            })
          }
          active={style === 3}
          name={'DVE'}
        ></AtemButtonYellow>

        <AtemButtonGeneric
          color="red"
          textClassName={'atem-button-text prev-trans'}
          callback={() =>
            props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPreviewSetCommand', {
              Index: 0,
              PreviewTransition: !props.currentState.mixEffects[0].transition.properties.preview
            })
          }
          active={props.currentState.mixEffects[0].transition.properties.preview}
          name={'PREV TRANS'}
        />

        {/* {prevTrans} */}
        <div></div>
        {/* <div onMouseDown={() => this.Cut()} className="atem-button button-grey ">CUT</div> */}
        {/* {auto} */}
        <AtemButtonGeneric
          color="red"
          callback={() => props.sendCommand('LibAtem.Commands.MixEffects.MixEffectCutCommand', { Index: 0 })}
          active={false}
          name={'CUT'}
        />

        <AtemButtonGeneric
          color="red"
          callback={() => props.sendCommand('LibAtem.Commands.MixEffects.MixEffectAutoCommand', { Index: 0 })}
          active={props.currentState.mixEffects[0].transition.position.inTransition}
          name={'AUTO'}
        />

        <div className="rate">
          {' '}
          Rate
          <RateInput
            disabled={style === 4}
            className={'rate-input'}
            callback={(e: string) => {
              props.sendCommand('LibAtem.Commands.MixEffects.Transition.Transition' + styleName[style] + 'SetCommand', {
                Index: 0,
                Mask: 1,
                Rate: e
              })
            }}
            value={props.currentState.mixEffects[0].transition.position.remainingFrames}
            videoMode={props.currentState.settings.videoMode}
          ></RateInput>
        </div>
      </div>
    </div>
  )
}

function FTB(props: ProgramProps) {
  return (
    <div className="box" id="FTB">
      <div className="box-title">Fade to Black</div>
      <div className="box-ftb">
        <div className="rate">
          {' '}
          Rate
          <RateInput
            className={'rate-input'}
            callback={(e: string) => {
              props.sendCommand('LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand', { Index: 0, Rate: e })
            }}
            value={props.currentState.mixEffects[0].fadeToBlack.status.remainingFrames}
            videoMode={props.currentState.settings.videoMode}
          ></RateInput>
        </div>
        <AtemButtonFTB
          key={'ftb_button'}
          callback={() => props.sendCommand('LibAtem.Commands.MixEffects.FadeToBlackAutoCommand', { Index: 0 })}
          name={'FTB'}
          inTransition={props.currentState.mixEffects[0].fadeToBlack.status.inTransition}
          isFullBlack={props.currentState.mixEffects[0].fadeToBlack.status.isFullyBlack}
        ></AtemButtonFTB>
      </div>
    </div>
  )
}

function Next(props: ProgramProps) {
  function dec2bin(dec: number) {
    return (dec >>> 0).toString(2)
  }

  function setKey(id: number) {
    var dec = dec2bin(props.currentState.mixEffects[0].transition.properties.selection)
      .padStart(5, '0')
      .split('')
      .reverse()
    dec[id] = dec[id] === '0' ? '1' : '0'
    return parseInt(dec.reverse().join(''), 2)
  }

  var onAirs = []
  var keysState = (props.currentState.mixEffects[0].transition.properties.selection >>> 0)
    .toString(2)
    .split('')
    .reverse()
    .join('') //get binary of state and reverse it for iterating
  var keys = []

  var selection = props.currentState.mixEffects[0].transition.properties.selection

  keys.push(
    <AtemButtonYellow
      update={selection}
      callback={() =>
        props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand', {
          Index: 0,
          Mask: 2,
          NextSelection: setKey(0)
        })
      }
      active={keysState[0] === '1'}
      name={'BKGD'}
    ></AtemButtonYellow>
  )

  for (var i = 0; i < props.currentState.mixEffects[0].keyers.length; i++) {
    const x = i
    onAirs.push(
      <AtemButtonGeneric
        color="red"
        textClassName={'atem-button-text on-air'}
        name={'ON AIR'}
        callback={() =>
          props.sendCommand('LibAtem.Commands.MixEffects.Key.MixEffectKeyOnAirSetCommand', {
            MixEffectIndex: 0,
            KeyerIndex: x,
            OnAir: !props.currentState.mixEffects[0].keyers[x].onAir
          })
        }
        active={props.currentState.mixEffects[0].keyers[x].onAir}
      />
    )
    keys.push(
      <AtemButtonYellow
        update={selection}
        callback={() =>
          props.sendCommand('LibAtem.Commands.MixEffects.Transition.TransitionPropertiesSetCommand', {
            Index: 0,
            Mask: 2,
            NextSelection: setKey(x + 1)
          })
        }
        active={keysState[i + 1] === '1'}
        name={'KEY' + (i + 1)}
      ></AtemButtonYellow>
    )
  }

  return (
    <div
      className="box"
      id="Next"
    >
      <div className="box-title">Next Transition</div>
      <div className="box-transition"
      style={{ gridTemplateColumns: `repeat(${onAirs.length + 1}, 50px)` }}>
        <div></div>
        {onAirs}
        {keys}
      </div>
    </div>
  )
}
