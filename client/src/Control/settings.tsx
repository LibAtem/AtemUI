import React from 'react'
import { AtemDeviceInfo } from '../Devices/types'
import "./settings.css"
import { SketchPicker, ChromePicker } from 'react-color';
import { GetDeviceId } from '../DeviceManager';


interface SwitcherSettingsProps {
    device: AtemDeviceInfo
    signalR: signalR.HubConnection | undefined
    currentState: any
}
interface SwitcherSettingsState {
    hasConnected: boolean
    state: any | null
    currentState: any
    page: number
}

export class SwitcherSettings extends React.Component<SwitcherSettingsProps, SwitcherSettingsState> {
    constructor(props: SwitcherSettingsProps) {
        super(props)
        this.state = {
            hasConnected: props.device.connected,
            state: props.currentState,
            currentState: null,
            page: 0
        }
    }

    render() {
        return (<div className="ss">

            <div className="ss-button-holder">
                <div className="ss-button-inner ss-button-left ss-button-inner-selected">
                    Paletts
                </div>
                <div className="ss-button-inner ss-button-mid">
                    Media Players
                </div>
                <div className="ss-button-inner ss-button-right">
                    Capture
                </div>
            </div>

            {/* <SubMenu
                key={"sub"}
                device={this.props.device}
                currentState={this.props.currentState}
                signalR={this.props.signalR}
                name={"Color Generators"}

            /> */}

            <ColorMenu
                key={'sub2'}
                device={this.props.device}
                currentState={this.props.currentState}
                signalR={this.props.signalR}
                name={"Color Generators"}
            />

        </div>
        )
    }

}

interface SubMenuProps {
    device: AtemDeviceInfo
    signalR: signalR.HubConnection | undefined
    currentState: any
    name: string
}
interface SubMenuState {
    hasConnected: boolean
    state: any | null
    currentState: any
    open: boolean

}

class SubMenu extends React.Component<SubMenuProps, SubMenuState> {
    constructor(props: SubMenuProps) {
        super(props)
        this.state = {
            open: false,
            hasConnected: props.device.connected,
            state: props.currentState,
            currentState: null,
        }
    }


    render() {

        var box = []
        if (this.state.open) {
            box.push(<div>aaa</div>)
        }
        return (<div className="ss-submenu">
            <div className="ss-submenu-title" onClick={(e) => { this.setState({ open: !this.state.open }) }}>
                Color Generators
            </div>
            <div className="ss-submenu-box" >
                {box}
            </div>

        </div>)
    }
}

interface ColorMenuState {
    hasConnected: boolean
    state: any | null
    currentState: any
    open: boolean
    displayColorPicker: boolean,
    displayColorPicker2: boolean,

}

class ColorMenu extends React.Component<SubMenuProps, ColorMenuState>{
    constructor(props: SubMenuProps) {
        super(props)
        this.state = {
            open: false,
            hasConnected: props.device.connected,
            state: props.currentState,
            currentState: null,
            displayColorPicker: false,
            displayColorPicker2: false,
        }
    }

    private sendCommand(command: string, value: any) {
        const { device, signalR } = this.props
        ///console.log(device ,signalR)
        if (device.connected && signalR) {
          const devId = GetDeviceId(device)
    
          signalR
            .invoke('CommandSend', devId, command, JSON.stringify(value))
            .then((res) => {
              console.log(value)
              console.log('ManualCommands: sent')
              console.log(command)
            })
            .catch(e => {
              console.log('ManualCommands: Failed to send', e)
            })
        }
    
      }

    render() {

        var picker = this.state.displayColorPicker ? <div className="color-picker-popover">
            <div className="color-picker-cover" onClick={() => this.setState({ displayColorPicker: false })} />
            <ChromePicker onChange={(color)=>{this.sendCommand("LibAtem.Commands.ColorGeneratorSetCommand",{ Index: 0, Hue: color.hsl.h, Saturation: color.hsl.s*100, Luma: color.hsl.l*100, Mask: 7 })}} disableAlpha={true} color={{ h: this.props.currentState.colorGenerators[0].hue, s: this.props.currentState.colorGenerators[0].saturation, l: this.props.currentState.colorGenerators[0].luma }} />
        </div> : null

        var picker2 = this.state.displayColorPicker2 ? <div className="color-picker-popover">
            <div className="color-picker-cover" onClick={() => this.setState({ displayColorPicker2: false })} />
            <ChromePicker onChange={(color)=>{this.sendCommand("LibAtem.Commands.ColorGeneratorSetCommand",{ Index: 1, Hue: color.hsl.h, Saturation: color.hsl.s*100, Luma: color.hsl.l*100, Mask: 7 })}} disableAlpha={true} color={{ h: this.props.currentState.colorGenerators[1].hue, s: this.props.currentState.colorGenerators[1].saturation, l: this.props.currentState.colorGenerators[1].luma }} />
        </div> : null

        var box = []
        if (this.state.open) {
            box.push(<div className="ss-color-holder">
                <div className="ss-color-inner">
                    {/* <div className="ss-radio-button"><div className="ss-radio-button-inner"></div></div> */}
                    <div className="ss-color-label">Color 1</div>
                    <div className="ss-color-picker" onClick={() => this.setState({ displayColorPicker: !this.state.displayColorPicker })} style={{ background: "hsl(" + this.props.currentState.colorGenerators[0].hue + "," + this.props.currentState.colorGenerators[0].saturation + "%," + this.props.currentState.colorGenerators[0].luma + "%)" }}></div>
                    {picker}
                </div>

                <div className="ss-color-inner">
                    {/* <div className="ss-radio-button"></div> */}
                    <div className="ss-color-label">Color 2</div>
                    <div className="ss-color-picker" onClick={() => this.setState({ displayColorPicker2: !this.state.displayColorPicker2 })} style={{ background: "hsl(" + this.props.currentState.colorGenerators[1].hue + "," + this.props.currentState.colorGenerators[1].saturation + "%," + this.props.currentState.colorGenerators[1].luma + "%)"  }}></div>
                    {picker2}
                    {/* <ChromePicker disableAlpha ={true} color={{h:this.props.currentState.colorGenerators[0].hue,s:this.props.currentState.colorGenerators[0].saturation,l:this.props.currentState.colorGenerators[0].luma}} /> */}
                </div>



            </div>)
        }
        return (<div className="ss-submenu" >
            <div className="ss-submenu-title" onClick={(e) => { this.setState({ open: !this.state.open }) }}>
                Color Generators
            </div>
            <div className="ss-submenu-box" >
                {box}
            </div>

        </div>)
    }
}

