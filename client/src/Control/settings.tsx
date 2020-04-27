import React from 'react'
import { AtemDeviceInfo } from '../Devices/types'
import "./settings.css"
import { SketchPicker, ChromePicker } from 'react-color';
import { GetDeviceId } from '../DeviceManager';
import OutsideClickHandler from 'react-outside-click-handler';
import { Form } from 'react-bootstrap';
import { groupHeadingCSS } from 'react-select/src/components/Group';
import { videoIds } from '../ControlSettings/ids';
import { borderRadius } from 'react-select/src/theme';
import Slider from 'react-rangeslider';


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
                key={'cg'}
                device={this.props.device}
                currentState={this.props.currentState}
                signalR={this.props.signalR}
                name={"Color Generators"}
            />

            <DownStreamKeys
                key={'dsk'}
                device={this.props.device}
                currentState={this.props.currentState}
                signalR={this.props.signalR}
                name={"Downstream Keys"}
            />

            <FadeToBlack
                key={'ftb'}
                device={this.props.device}
                currentState={this.props.currentState}
                signalR={this.props.signalR}
                name={"Fade To Black"}
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

class FadeToBlack extends React.Component<SubMenuProps, SubMenuState> {
    constructor(props: SubMenuProps) {
        super(props)
        this.state = {
            open: false,
            hasConnected: props.device.connected,
            state: props.currentState,
            currentState: null,
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

    ftbRate(id: string, index: number) {
        var input = document.getElementById(id) as HTMLInputElement
        if (input.value !== "") {
            this.sendCommand("LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand", { Index: index, Rate: Math.min(this.rateToFrames(input.value), 250) })
            input.value = ""
        }
    }

    validRate(e: React.KeyboardEvent<HTMLDivElement>, id: string) {
        var input = document.getElementById(id) as HTMLInputElement //Work out what the input will be
        if (((e.keyCode >= 96) && (e.keyCode <= 105)) || ((e.keyCode >= 48) && (e.keyCode <= 57)) || (e.keyCode === 59)) {
            if (input) {
                var startPos = input.selectionStart || 0;
                var endPos = input.selectionEnd || 0;
                var value = input.value.split("")
                var newChar = String.fromCharCode((96 <= e.keyCode && e.keyCode <= 105) ? e.keyCode - 48 : e.keyCode)
                newChar = ((newChar === ";") ? ":" : newChar)
                value.splice(startPos, endPos - startPos, newChar)
                if (value.includes(";") || value.includes(":")) { //Check if it is valid
                    if (!value.join("").match(/^(([0-9]|[0-9][0-9]|)(:)([0-9]|[0-9][0-9]|))$/g)) { //This can be expanded to do all checks
                        if (e.preventDefault) e.preventDefault();
                    }
                } else {
                    if (value.length > 3) {
                        if (e.preventDefault) e.preventDefault();
                    }
                }
            }
        } else if (e.keyCode !== 8 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 46) { //Allow special keys
            if (e.preventDefault) e.preventDefault();
        }
    }

    ftbRateHelper(e: React.KeyboardEvent<HTMLDivElement>, id: string, index: number) {
        if (e.keyCode === 13) {
            this.ftbRate(id, index)
        } else {
            this.validRate(e, id)
        }
    }

    rateToFrames(rate: string) {
        var fps = [30, 25, 30, 25, 50, 60, 25, 30, 24, 24, 25, 30, 50][this.props.currentState.settings.videoMode]
        return parseInt(rate.replace(":", "").padStart(4, "0").substr(0, 2)) * fps + parseInt(rate.replace(":", "").padStart(4, "0").substr(2, 3))
    }

    framesToRate(frames: number) {
        var fps = [30, 25, 30, 25, 50, 60, 25, 30, 24, 24, 25, 30, 50][this.props.currentState.settings.videoMode]
        var framesRemaining = frames % fps
        var seconds = Math.floor(frames / fps);
        return seconds.toString() + ":" + framesRemaining.toString().padStart(2, "0")
    }

    render() {
        var rate = []
        var box = []
        if (this.state.open) {
            rate.push((this.props.currentState.mixEffects[0].fadeToBlack.status.inTransition) ? <OutsideClickHandler onOutsideClick={() => { this.ftbRate("ss-ftb0", 0) }}><div className="ss-rate"> <input placeholder={this.framesToRate(this.props.currentState.mixEffects[0].fadeToBlack.status.remainingFrames)} onKeyDown={(e) => this.ftbRateHelper(e, "ss-ftb0", 0)} id="ss-ftb0" disabled className="ss-rate-input" ></input></div></OutsideClickHandler>
                : <OutsideClickHandler onOutsideClick={() => { this.ftbRate("ss-ftb0", 0) }}><div className="ss-rate"> <input placeholder={this.framesToRate(this.props.currentState.mixEffects[0].fadeToBlack.status.remainingFrames)} onKeyDown={(e) => this.ftbRateHelper(e, "ss-ftb0", 0)} id="ss-ftb0" className="ss-rate-input" ></input></div></OutsideClickHandler>)

            box.push(<div className="ss-rate-holder"><div className="ss-rate-label">Rate:</div>{rate}
                <label className="ss-checkbox-container">Audio Follow Video
  <                 input type="checkbox" checked={this.props.currentState.audio.programOut.followFadeToBlack} onClick={() => this.sendCommand("LibAtem.Commands.Audio.AudioMixerMasterSetCommand", { FollowFadeToBlack: !this.props.currentState.audio.programOut.followFadeToBlack, Mask: 4 })}></input>
                    <span className="checkmark"></span>
                </label>
            </div>)
        }

        return (<div className="ss-submenu">
            <div className="ss-submenu-title" onClick={(e) => { this.setState({ open: !this.state.open }) }}>
                Fade to Black
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
                    //   console.log(value)
                    //   console.log('ManualCommands: sent')
                    //   console.log(command)
                })
                .catch(e => {
                    console.log('ManualCommands: Failed to send', e)
                })
        }

    }

    render() {

        var picker = this.state.displayColorPicker ? <div className="color-picker-popover">
            <div className="color-picker-cover" onClick={() => this.setState({ displayColorPicker: false })} />
            <ChromePicker onChange={(color) => { this.sendCommand("LibAtem.Commands.ColorGeneratorSetCommand", { Index: 0, Hue: color.hsl.h, Saturation: color.hsl.s * 100, Luma: color.hsl.l * 100, Mask: 7 }) }} disableAlpha={true} color={{ h: this.props.currentState.colorGenerators[0].hue, s: this.props.currentState.colorGenerators[0].saturation, l: this.props.currentState.colorGenerators[0].luma }} />
        </div> : null

        var picker2 = this.state.displayColorPicker2 ? <div className="color-picker-popover">
            <div className="color-picker-cover" onClick={() => this.setState({ displayColorPicker2: false })} />
            <ChromePicker onChange={(color) => { this.sendCommand("LibAtem.Commands.ColorGeneratorSetCommand", { Index: 1, Hue: color.hsl.h, Saturation: color.hsl.s * 100, Luma: color.hsl.l * 100, Mask: 7 }) }} disableAlpha={true} color={{ h: this.props.currentState.colorGenerators[1].hue, s: this.props.currentState.colorGenerators[1].saturation, l: this.props.currentState.colorGenerators[1].luma }} />
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
                    <div className="ss-color-picker" onClick={() => this.setState({ displayColorPicker2: !this.state.displayColorPicker2 })} style={{ background: "hsl(" + this.props.currentState.colorGenerators[1].hue + "," + this.props.currentState.colorGenerators[1].saturation + "%," + this.props.currentState.colorGenerators[1].luma + "%)" }}></div>
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

class DownStreamKeys extends React.Component<SubMenuProps, SubMenuState>{
    constructor(props: SubMenuProps) {
        super(props)
        this.state = {
            open: true,
            hasConnected: props.device.connected,
            state: props.currentState,
            currentState: null
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
                    //   console.log(value)
                    //   console.log('ManualCommands: sent')
                    //   console.log(command)
                })
                .catch(e => {
                    console.log('ManualCommands: Failed to send', e)
                })
        }

    }

    getHeading(index: number) {
        return (<div className="ss-heading">Key {index + 1}</div>)
    }

    getSourceOptions(){
        var inputs = Object.keys(this.props.currentState.settings.inputs)
        var sources = inputs.filter(i => videoIds[i]<4000)
        var options = []
        for(var i in sources){
            options.push(<option value={videoIds[sources[i]]}>{this.props.currentState.settings.inputs[sources[i]].properties.longName}</option>)
        }
        return options
      }

    getTopBox(index: number) {
        return (<div className="ss-dsk-top">
            <div className="ss-label">Rate:</div>
            <OutsideClickHandler onOutsideClick={() => { this.ftbRate("ss-dsk" + index, 0) }}><div className="ss-rate"> <input placeholder={this.framesToRate(this.props.currentState.mixEffects[0].fadeToBlack.status.remainingFrames)} onKeyDown={(e) => this.ftbRateHelper(e, "ss-dsk" + index, 0)} id={"ss-dsk" + index} className="ss-rate-input" ></input></div></OutsideClickHandler>
            <div className="ss-label">Fill Source:</div>
            <select onChange={(e)=>{this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyFillSourceSetCommand",{Index:index,FillSource:e.currentTarget.value})}} value={this.props.currentState.downstreamKeyers[index].sources.fillSource} className="ss-dropdown" id="cars">
                {this.getSourceOptions()}
            </select>
            <div className="ss-label">Key Source:</div>
            <select onChange={(e)=>{this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyCutSourceSetCommand",{Index:index,CutSource:e.currentTarget.value})}} value={this.props.currentState.downstreamKeyers[index].sources.cutSource} className="ss-dropdown" id="cars">
                {this.getSourceOptions()}
            </select>
        </div>)
    }

    ftbRate(id: string, index: number) {
        var input = document.getElementById(id) as HTMLInputElement
        if (input.value !== "") {
            this.sendCommand("LibAtem.Commands.MixEffects.FadeToBlackRateSetCommand", { Index: index, Rate: Math.min(this.rateToFrames(input.value), 250) })
            input.value = ""
        }
    }

    rateToFrames(rate: string) {
        var fps = [30, 25, 30, 25, 50, 60, 25, 30, 24, 24, 25, 30, 50][this.props.currentState.settings.videoMode]
        return parseInt(rate.replace(":", "").padStart(4, "0").substr(0, 2)) * fps + parseInt(rate.replace(":", "").padStart(4, "0").substr(2, 3))
    }

    framesToRate(frames: number) {
        var fps = [30, 25, 30, 25, 50, 60, 25, 30, 24, 24, 25, 30, 50][this.props.currentState.settings.videoMode]
        var framesRemaining = frames % fps
        var seconds = Math.floor(frames / fps);
        return seconds.toString() + ":" + framesRemaining.toString().padStart(2, "0")
    }

    validRate(e: React.KeyboardEvent<HTMLDivElement>, id: string) {
        var input = document.getElementById(id) as HTMLInputElement //Work out what the input will be
        if (((e.keyCode >= 96) && (e.keyCode <= 105)) || ((e.keyCode >= 48) && (e.keyCode <= 57)) || (e.keyCode === 59)) {
            if (input) {
                var startPos = input.selectionStart || 0;
                var endPos = input.selectionEnd || 0;
                var value = input.value.split("")
                var newChar = String.fromCharCode((96 <= e.keyCode && e.keyCode <= 105) ? e.keyCode - 48 : e.keyCode)
                newChar = ((newChar === ";") ? ":" : newChar)
                value.splice(startPos, endPos - startPos, newChar)
                if (value.includes(";") || value.includes(":")) { //Check if it is valid
                    if (!value.join("").match(/^(([0-9]|[0-9][0-9]|)(:)([0-9]|[0-9][0-9]|))$/g)) { //This can be expanded to do all checks
                        if (e.preventDefault) e.preventDefault();
                    }
                } else {
                    if (value.length > 3) {
                        if (e.preventDefault) e.preventDefault();
                    }
                }
            }
        } else if (e.keyCode !== 8 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 46) { //Allow special keys
            if (e.preventDefault) e.preventDefault();
        }
    }

    ftbRateHelper(e: React.KeyboardEvent<HTMLDivElement>, id: string, index: number) {
        if (e.keyCode === 13) {
            this.ftbRate(id, index)
        } else {
            this.validRate(e, id)
        }
    }

    getMaskBox(index:number){
        var enabled = this.props.currentState.downstreamKeyers[index].properties.maskEnabled
        var button = (enabled)? <div className="ss-circle-button"><div className="ss-circle-button-inner"></div></div>:<div className="ss-circle-button"></div>
        var label = <div className="ss-circle-button-holder" onClick={()=>this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand",{Index:index,Mask:1,maskEnabled:!this.props.currentState.downstreamKeyers[index].properties.maskEnabled})}>
            {button}<div className="ss-heading">Mask</div>
        </div>
        var labelClass = (enabled)?"ss-label":"ss-label disabled"
        
        return(<div className="ss-mask-box">{label}
        <div className="ss-mask-holder">
            <div className={labelClass}>Top:</div>
            <div className="ss-rate"> <MagicInput disabled={!enabled}  value={this.props.currentState.downstreamKeyers[index].properties.maskTop} callback={(value: any)=>{if(value!=""){this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand",{Index:index,Mask:2,MaskTop:Math.min(9,Math.max(-9,value))})}}} /></div>
            <div className={labelClass}>Bottom:</div>
            <div className="ss-rate"> <MagicInput disabled={!enabled}  value={this.props.currentState.downstreamKeyers[index].properties.maskBottom} callback={(value: any)=>{if(value!=""){this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand",{Index:index,Mask:4,MaskBottom:Math.min(9,Math.max(-9,value))})}}} /></div>
            <div className={labelClass}>Left:</div>
            <div className="ss-rate"> <MagicInput disabled={!enabled} value={this.props.currentState.downstreamKeyers[index].properties.maskLeft} callback={(value: any)=>{if(value!=""){this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand",{Index:index,Mask:8,MaskLeft:Math.min(16,Math.max(-16,value))})}}} /></div>
            <div className={labelClass}>Right:</div>
            <div className="ss-rate"> <MagicInput disabled={!enabled}  value={this.props.currentState.downstreamKeyers[index].properties.maskRight} callback={(value: any)=>{if(value!=""){this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand",{Index:index,Mask:16,MaskRight:Math.min(16,Math.max(-16,value))})}}} /></div>
        </div>
        </div>)
    }

    getPreMultBox(index:number){
        var enabled = this.props.currentState.downstreamKeyers[index].properties.preMultipliedKey
        var button = (enabled)? <div className="ss-circle-button"><div className="ss-circle-button-inner"></div></div>:<div className="ss-circle-button"></div>
        var label = <div className="ss-circle-button-holder" onClick={()=>this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand",{Index:index,Mask:1,PreMultipliedKey:!this.props.currentState.downstreamKeyers[index].properties.preMultipliedKey})}>
                        {button}<div className="ss-heading">Pre Multiplied Key</div>
                    </div>
        var diabledClass = (!enabled)?"sss ss-slider-outer":"sss ss-slider-outer disabled"
        return(<div className ="ss-pmk" >
            {label}
            <div className="ss-slider-holder">
               <div className={diabledClass}><Slider  tooltip={false} step={0.1} onChange={(e)=>this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand",{Index:index,Mask:2,Clip:e})}  value={this.props.currentState.downstreamKeyers[index].properties.clip}/><div className="ss-slider-label">Clip:</div></div> 
               <MagicInput disabled={enabled} value={this.props.currentState.downstreamKeyers[index].properties.clip}
                callback={(value: any)=>{if(value!=""){this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand",{Index:index,Mask:2,Clip:Math.min(100,Math.max(0,value))})}}} />
            </div>

            <div className="ss-slider-holder">
               <div className={diabledClass}><Slider  tooltip={false} step={0.1} onChange={(e)=>this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand",{Index:index,Mask:4,Gain:e})}  value={this.props.currentState.downstreamKeyers[index].properties.gain}/><div className="ss-slider-label">Gain:</div></div> 
               <MagicInput disabled={enabled} value={this.props.currentState.downstreamKeyers[index].properties.gain}
                callback={(value: any)=>{if(value!=""){this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand",{Index:index,Mask:4,Gain:Math.min(100,Math.max(0,value))})}}} />
            </div>

            <label className="ss-checkbox-container">Invert
            <input type="checkbox" disabled={enabled} checked={this.props.currentState.downstreamKeyers[index].properties.invert} onClick={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand", {Index:index,Mask:8, Invert: !this.props.currentState.downstreamKeyers[index].properties.invert })}></input>
                    <span className="checkmark"></span>
            </label>
            


        </div>)
    }

    render() {



        var box = []
        if (this.state.open) {
            for(var i = 0; i<this.props.currentState.downstreamKeyers.length;i++){
                box.push(this.getHeading(i))
                box.push(this.getTopBox(i))
                box.push(this.getMaskBox(i))
                box.push(this.getPreMultBox(i))
            }
        }


        return (<div className="ss-submenu" >
            <div className="ss-submenu-title" onClick={(e) => { this.setState({ open: !this.state.open }) }}>
                {this.props.name}
            </div>
            <div className="ss-submenu-box" style={{ display: "grid", gridTemplateRows: "repeat("+this.props.currentState.downstreamKeyers.length *4+",auto)",overflow:"hidden"}} >
                {box}
            </div>

        </div>)
    }
}

interface MagicInputProps {
    callback:any
    value:any
    disabled?:boolean
}
interface MagicInputState {
    focus:boolean
    tempValue:any
    disabled:boolean
}

class MagicInput extends React.Component<MagicInputProps, MagicInputState>{
    constructor(props: MagicInputProps) {
        super(props)
        this.state = {
            focus:false,
            tempValue:this.props.value,
            disabled: this.props.disabled || true
        }
    }

    render(){

        return(<input type="number" step={0.01} 
        disabled={this.props.disabled}
        onBlur={(e)=>{this.setState({focus:false}); this.props.callback(e.currentTarget.value)}} 
        onFocus={(e)=>this.setState({focus:true,tempValue:this.props.value})}
        onChange={(e=>this.setState({tempValue:e.currentTarget.value}))}
        value={(this.state.focus)?this.state.tempValue:this.props.value}
        onKeyPress={(e)=>{if(e.key==="Enter"){this.props.callback(e.currentTarget.value)}}}
        className="ss-rate-input" ></input>)
    }

}

