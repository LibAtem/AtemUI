import { MagicInput, RateInput } from "./settings"
import React from "react"
import Slider from "react-rangeslider"
import { videoIds } from "../../ControlSettings/ids"
import { GetDeviceId } from "../../DeviceManager"
import { AtemDeviceInfo } from "../../Devices/types"

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

export class DownStreamKeys extends React.Component<SubMenuProps, SubMenuState>{
    constructor(props: SubMenuProps) {
        super(props)
        this.state = {
            open: false,
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

    getSourceOptions() {
        var inputs = Object.keys(this.props.currentState.settings.inputs)
        var sources = inputs.filter(i => videoIds[i] < 4000)
        var options = []
        for (var i in sources) {
            options.push(<option value={videoIds[sources[i]]}>{this.props.currentState.settings.inputs[sources[i]].properties.longName}</option>)
        }
        return options
    }

    getTopBox(index: number) {
        return (<div className="ss-dsk-top">
            <div className="ss-label">Rate:</div>
            <div className="ss-rate"><RateInput value={this.props.currentState.downstreamKeyers[index].properties.rate} videoMode={this.props.currentState.settings.videoMode}
                callback={(e: string) => { this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyRateSetCommand", { Index: index, Rate: e }) }} /></div>
            <div className="ss-label">Fill Source:</div>
            <select onChange={(e) => { this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyFillSourceSetCommand", { Index: index, FillSource: e.currentTarget.value }) }} value={this.props.currentState.downstreamKeyers[index].sources.fillSource} className="ss-dropdown" id="cars">
                {this.getSourceOptions()}
            </select>
            <div className="ss-label">Key Source:</div>
            <select onChange={(e) => { this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyCutSourceSetCommand", { Index: index, CutSource: e.currentTarget.value }) }} value={this.props.currentState.downstreamKeyers[index].sources.cutSource} className="ss-dropdown" id="cars">
                {this.getSourceOptions()}
            </select>
        </div>)
    }



    getMaskBox(index: number) {
        var enabled = this.props.currentState.downstreamKeyers[index].properties.maskEnabled
        var button = (enabled) ? <div className="ss-circle-button"><div className="ss-circle-button-inner"></div></div> : <div className="ss-circle-button"></div>
        var label = <div className="ss-circle-button-holder" onClick={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand", { Index: index, Mask: 1, maskEnabled: !this.props.currentState.downstreamKeyers[index].properties.maskEnabled })}>
            {button}<div className="ss-heading">Mask</div>
        </div>
        var labelClass = (enabled) ? "ss-label" : "ss-label disabled"

        return (<div className="ss-mask-box">{label}
            <div className="ss-mask-holder">
                <div className={labelClass}>Top:</div>
                <div className="ss-rate"> <MagicInput disabled={!enabled} value={this.props.currentState.downstreamKeyers[index].properties.maskTop} callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand", { Index: index, Mask: 2, MaskTop: Math.min(9, Math.max(-9, value)) }) } }} /></div>
                <div className={labelClass}>Bottom:</div>
                <div className="ss-rate"> <MagicInput disabled={!enabled} value={this.props.currentState.downstreamKeyers[index].properties.maskBottom} callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand", { Index: index, Mask: 4, MaskBottom: Math.min(9, Math.max(-9, value)) }) } }} /></div>
                <div className={labelClass}>Left:</div>
                <div className="ss-rate"> <MagicInput disabled={!enabled} value={this.props.currentState.downstreamKeyers[index].properties.maskLeft} callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand", { Index: index, Mask: 8, MaskLeft: Math.min(16, Math.max(-16, value)) }) } }} /></div>
                <div className={labelClass}>Right:</div>
                <div className="ss-rate"> <MagicInput disabled={!enabled} value={this.props.currentState.downstreamKeyers[index].properties.maskRight} callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyMaskSetCommand", { Index: index, Mask: 16, MaskRight: Math.min(16, Math.max(-16, value)) }) } }} /></div>
            </div>
        </div>)
    }

    getPreMultBox(index: number) {
        var enabled = this.props.currentState.downstreamKeyers[index].properties.preMultipliedKey
        var button = (enabled) ? <div className="ss-circle-button"><div className="ss-circle-button-inner"></div></div> : <div className="ss-circle-button"></div>
        var label = <div className="ss-circle-button-holder" onClick={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand", { Index: index, Mask: 1, PreMultipliedKey: !this.props.currentState.downstreamKeyers[index].properties.preMultipliedKey })}>
            {button}<div className="ss-heading">Pre Multiplied Key</div>
        </div>
        var diabledClass = (!enabled) ? "sss ss-slider-outer" : "sss ss-slider-outer disabled"
        return (<div className="ss-pmk" >
            {label}
            <div className="ss-slider-holder">
                <div className={diabledClass}><Slider tooltip={false} step={0.1} onChange={(e) => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand", { Index: index, Mask: 2, Clip: e })} value={this.props.currentState.downstreamKeyers[index].properties.clip} /><div className="ss-slider-label">Clip:</div></div>
                <MagicInput disabled={enabled} value={this.props.currentState.downstreamKeyers[index].properties.clip}
                    callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand", { Index: index, Mask: 2, Clip: Math.min(100, Math.max(0, value)) }) } }} />
            </div>

            <div className="ss-slider-holder">
                <div className={diabledClass}><Slider tooltip={false} step={0.1} onChange={(e) => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand", { Index: index, Mask: 4, Gain: e })} value={this.props.currentState.downstreamKeyers[index].properties.gain} /><div className="ss-slider-label">Gain:</div></div>
                <MagicInput disabled={enabled} value={this.props.currentState.downstreamKeyers[index].properties.gain}
                    callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand", { Index: index, Mask: 4, Gain: Math.min(100, Math.max(0, value)) }) } }} />
            </div>

            <label className="ss-checkbox-container">Invert
            <input type="checkbox" disabled={enabled} checked={this.props.currentState.downstreamKeyers[index].properties.invert} onClick={() => this.sendCommand("LibAtem.Commands.DownstreamKey.DownstreamKeyGeneralSetCommand", { Index: index, Mask: 8, Invert: !this.props.currentState.downstreamKeyers[index].properties.invert })}></input>
                <span className="checkmark"></span>
            </label>



        </div>)
    }

    render() {

        var box = []
        if (this.state.open) {
            for (var i = 0; i < this.props.currentState.downstreamKeyers.length; i++) {
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
            <div className="ss-submenu-box" style={{ display: "grid", gridTemplateRows: "repeat(" + this.props.currentState.downstreamKeyers.length * 4 + ",auto)", overflow: "hidden" }} >
                {box}
            </div>



        </div>)
    }
}
