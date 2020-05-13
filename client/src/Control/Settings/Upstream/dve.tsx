import React from "react"
import { AtemDeviceInfo } from "../../../Devices/types"
import { GetDeviceId } from "../../../DeviceManager"
import { videoIds } from "../../../ControlSettings/ids"
import {  FlyingKey, KeyFrame } from "./upstream"
import { MagicInput } from "../settings"
import Slider from "react-rangeslider"
import { ChromePicker } from "react-color"

interface DVEProps {
    device: AtemDeviceInfo
    signalR: signalR.HubConnection | undefined
    currentState: any
    mixEffect: number
    id:number

}



export class DVE extends React.Component<DVEProps>{

    private sendCommand(command: string, value: any) {
        const { device, signalR } = this.props
        if (device.connected && signalR) {
            const devId = GetDeviceId(device)
            console.log(value)
            signalR
                .invoke('CommandSend', devId, command, JSON.stringify(value))
                .then((res) => {
                })
                .catch(e => {
                    console.log('ManualCommands: Failed to send', e)
                })
        }
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

    render() {
        if(this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve===null){
            return(<div></div>)
        }

        var enabled = true
        var rotation =this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve.rotation
        return (

            <div>
                <div className="ss-heading">Settings</div>
                <div className="ss-row">
                    <div className="ss-label">Fill Source:</div>
                    <select  onChange={(e) => { this.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyFillSourceSetCommand", { MixEffectIndex: this.props.mixEffect, KeyerIndex:this.props.id,FillSource: e.currentTarget.value }) }} value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].properties.fillSource} className="ss-dropdown" id="cars">
                        {this.getSourceOptions()}
                    </select>
                </div>

                <div className="ss-row xy">
            <div style={{ minWidth: "50px" }} className="ss-label">Position:</div>
            <div className="ss-label right" >X:</div>
            <MagicInput step={0.01} disabled={!enabled} value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve.positionX}
                callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { KeyerIndex: this.props.id, MixEffectIndex: this.props.mixEffect, Mask: 4, PositionX: Math.min(1000, Math.max(-1000, value)) }) } }} />
            <div className="ss-label right" >Y:</div>
            <MagicInput step={0.01} disabled={!enabled} value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve.positionY}
                callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { KeyerIndex: this.props.id, MixEffectIndex: this.props.mixEffect, Mask: 8, PositionY: Math.min(1000, Math.max(-1000, value)) }) } }} />
        </div>

        <div className="ss-row xy">
            <div style={{ minWidth: "50px" }} className="ss-label">Scale:</div>
            <div className="ss-label right" >X:</div>
            <MagicInput step={0.01} disabled={!enabled} value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve.sizeX}
                callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { KeyerIndex: this.props.id, MixEffectIndex: this.props.mixEffect, Mask: 1, SizeX: Math.min(99.99, Math.max(0, value)) }) } }} />
            <div className="ss-label right" >Y:</div>
            <MagicInput step={0.01} disabled={!enabled} value={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve.sizeY}
                callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { KeyerIndex: this.props.id, MixEffectIndex: this.props.mixEffect, Mask: 2, SizeY: Math.min(99.99, Math.max(0, value)) }) } }} />
        </div>

        <div className="ss-row xy">
            <div style={{ minWidth: "50px" }} className="ss-label">Rotation:</div>
            <div className="ss-label right" >360°:</div>
            <MagicInput step={1} disabled={!enabled} value={Math.floor(rotation / 360)}
                callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { KeyerIndex: this.props.id, MixEffectIndex: this.props.mixEffect, Mask: 16, Rotation: (rotation - (Math.floor(rotation / 360) * 360) + Math.floor(value) * 360) / 100 }) } }} />
            <div style={{fontSize:"12px"}} className="ss-label right" >+ 1°:</div>
            <MagicInput step={1} disabled={!enabled} value={rotation - (Math.floor(rotation / 360) * 360)}
                callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { KeyerIndex: this.props.id, MixEffectIndex: this.props.mixEffect, Mask: 16, Rotation: ((Math.floor(rotation / 360) * 360) + parseInt(value)) / 100 }) } }} />
        </div>
            
            

                <Mask properties={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve} keyerIndex={this.props.id} mixEffectIndex={this.props.mixEffect} sendCommand={(cmd:string,values:any)=>this.sendCommand(cmd,values)}></Mask>
                <Shadow properties={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve} keyerIndex={this.props.id} mixEffectIndex={this.props.mixEffect} sendCommand={(cmd:string,values:any)=>this.sendCommand(cmd,values)}></Shadow>
                <Border properties={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve} keyerIndex={this.props.id} mixEffectIndex={this.props.mixEffect} sendCommand={(cmd:string,values:any)=>this.sendCommand(cmd,values)}></Border>

   
                
                {/* <FlyingKey flyEnabled={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].properties.flyEnabled} properties={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve} keyerIndex={this.props.id} mixEffectIndex={this.props.mixEffect} sendCommand={(cmd:string,values:any)=>this.sendCommand(cmd,values)}></FlyingKey> */}
                <KeyFrame videoMode={this.props.currentState.settings.videoMode} dve={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].dve} flyEnabled={true} properties={this.props.currentState.mixEffects[this.props.mixEffect].keyers[this.props.id].flyProperties} keyerIndex={this.props.id} mixEffect={this.props.mixEffect} sendCommand={(cmd:string,values:any)=>this.sendCommand(cmd,values)}></KeyFrame>
            </div>



        )
    }

}

function Mask(props: { keyerIndex: number, mixEffectIndex: number, properties: any, sendCommand: any }) {

    var enabled = props.properties.maskEnabled
    var button = (enabled) ? <div className="ss-circle-button"><div className="ss-circle-button-inner"></div></div> : <div className="ss-circle-button"></div>
    var label = <div className="ss-circle-button-holder" onClick={() => props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: props.mixEffectIndex, KeyerIndex: props.keyerIndex, Mask: 1048576, MaskEnabled: !props.properties.maskEnabled })}>
        {button}<div className="ss-heading">Mask</div>
    </div>
    var labelClass = (enabled) ? "ss-label" : "ss-label disabled"

    return (<div className="ss-mask-box">{label}
        <div className="ss-mask-holder">
            <div className={labelClass}>Top:</div>
            <div className="ss-rate"> <MagicInput disabled={!enabled} value={props.properties.maskTop} callback={(value: any) => { if (value != "") { props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: props.mixEffectIndex, KeyerIndex: props.keyerIndex, Mask: 2097152, MaskTop: Math.min(9, Math.max(-9, value)) }) } }} /></div>
            <div className={labelClass}>Bottom:</div>
            <div className="ss-rate"> <MagicInput disabled={!enabled} value={props.properties.maskBottom} callback={(value: any) => { if (value != "") { props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: props.mixEffectIndex, KeyerIndex: props.keyerIndex, Mask: 4194304, MaskBottom: Math.min(9, Math.max(-9, value)) }) } }} /></div>
            <div className={labelClass}>Left:</div>
            <div className="ss-rate"> <MagicInput disabled={!enabled} value={props.properties.maskLeft} callback={(value: any) => { if (value != "") { props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: props.mixEffectIndex, KeyerIndex: props.keyerIndex, Mask: 8388608, MaskLeft: Math.min(16, Math.max(-16, value)) }) } }} /></div>
            <div className={labelClass}>Right:</div>
            <div className="ss-rate"> <MagicInput disabled={!enabled} value={props.properties.maskRight} callback={(value: any) => { if (value != "") { props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: props.mixEffectIndex, KeyerIndex: props.keyerIndex, Mask: 16777216, MaskRight: Math.min(16, Math.max(-16, value)) }) } }} /></div>
        </div>
    </div>)

}


function Shadow(props: { keyerIndex: number, mixEffectIndex: number, properties: any, sendCommand: any }) {

    var enabled = props.properties.borderShadowEnabled
    var button = (enabled) ? <div className="ss-circle-button"><div className="ss-circle-button-inner"></div></div> : <div className="ss-circle-button"></div>
    var label = <div className="ss-circle-button-holder" onClick={() => props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: props.mixEffectIndex, KeyerIndex: props.keyerIndex, Mask: 64, BorderShadowEnabled: !enabled })}>
        {button}<div className="ss-heading">Shadow</div>
    </div>
    var labelClass = (enabled) ? "ss-label" : "ss-label disabled"

    return (<div >{label}
        <div style={{gridTemplateRows:"1fr"}} className="ss-mask-holder">
            <div className={labelClass}>Angle:</div>
            <div className="ss-rate"> <MagicInput  step={1} disabled={!enabled} value={props.properties.lightSourceDirection} callback={(value: any) => { if (value != "") { props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: props.mixEffectIndex, KeyerIndex: props.keyerIndex, Mask: 262144, LightSourceDirection: Math.min(360, Math.max(0, value)) }) } }} /></div>
            <div className={labelClass}>Altitude:</div>
            <div className="ss-rate"> <MagicInput step={1} disabled={!enabled} value={props.properties.lightSourceAltitude} callback={(value: any) => { if (value != "") { props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: props.mixEffectIndex, KeyerIndex: props.keyerIndex, Mask: 524288, LightSourceAltitude: Math.min(100, Math.max(10, value)) }) } }} /></div>

        </div>
    </div>)

}

interface BorderProps {
    keyerIndex: number
    mixEffectIndex: number
     properties: any
     sendCommand: any

}

class Border extends React.Component<BorderProps ,{displayColorPicker:boolean}>{
    constructor(props: BorderProps) {
        super(props)
        this.state = {
          displayColorPicker:false
        }
    }

    render(){
    var enabled = this.props.properties.borderEnabled
    var button = (enabled) ? <div className="ss-circle-button"><div className="ss-circle-button-inner"></div></div> : <div className="ss-circle-button"></div>
    var label = <div className="ss-circle-button-holder" onClick={() => this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 32, BorderEnabled: !enabled })}>
        {button}<div className="ss-heading">Border</div>
    </div>
    var labelClass = (enabled) ? "ss-slider-label" : "ss-slider-label disabled"

    var picker = this.state.displayColorPicker ? <div className="color-picker-popover">
            <div className="color-picker-cover" onClick={() => this.setState({ displayColorPicker: false })} />
            <ChromePicker onChange={(color) => { this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", {MixEffectIndex: this.props.mixEffectIndex,KeyerIndex:this.props.keyerIndex, BorderHue: color.hsl.h, BorderSaturation: color.hsl.s * 100, BorderLuma: color.hsl.l * 100, Mask: 229376 }) }} disableAlpha={true} 
            color={{ h: this.props.properties.borderHue, s: this.props.properties.borderSaturation, l: this.props.properties.borderLuma }} />
        </div> : null

    return (<div className="ss-mask-box" >
        
                {label}
                
               
                <div className="ss-color-inner">
                <div className={(enabled) ?"ss-label":"ss-label disabled"}>Color: </div>
                    <div className="ss-color-picker" onClick={() => (enabled)?this.setState({ displayColorPicker: !this.state.displayColorPicker }):null} style={{ background: "hsl(" + this.props.properties.borderHue + "," + ((enabled)?this.props.properties.borderSaturation:this.props.properties.borderSaturation*0.2) + "%," + this.props.properties.borderLuma + "%)" }}></div>
                    {picker}
                </div>

                


                <div className="ss-row">
                    <div className={(enabled) ?"ss-label":"ss-label disabled"}>Fill Source:</div>
                    <select disabled={!enabled}  onChange={(e) => { this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: this.props.mixEffectIndex,KeyerIndex:this.props.keyerIndex,Mask:128, BorderBevel:e.currentTarget.value})}} value={this.props.properties.borderBevel} className="ss-dropdown" id="cars">
                    <option value={0}>No Bevel</option>
                    <option value={1}>Bevel In Out</option>
                    <option value={2}>Bevel In</option>
                    <option value={3}>Bevel Out</option>
                    </select>
                </div>


                <div className="ss-slider-holder">
                    <div className={(enabled) ? "sss ss-slider-outer" : "sss ss-slider-outer disabled"}><Slider max={16} tooltip={false} step={0.01} onChange={(e) => this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 256, borderOuterWidth: e })}
                        value={this.props.properties.borderOuterWidth} />
                        <div className={labelClass}>Outer Width:</div></div>
                    <MagicInput disabled={!enabled} value={this.props.properties.borderOuterWidth}
                        callback={(value: any) => { if (value != "") { this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex:this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 256, borderOuterWidth: Math.min(16, Math.max(0, value)) }) } }} />
                </div>

                <div className="ss-slider-holder">
                    <div className={(enabled) ? "sss ss-slider-outer" : "sss ss-slider-outer disabled"}><Slider max={16} tooltip={false} step={0.01} onChange={(e) => this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 512, BorderInnerWidth: e })}
                        value={this.props.properties.borderInnerWidth} />
                        <div className={labelClass}>Inner Width:</div></div>
                    <MagicInput disabled={!enabled} value={this.props.properties.borderInnerWidth}
                        callback={(value: any) => { if (value != "") { this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex:this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 512, BorderInnerWidth: Math.min(16, Math.max(0, value)) }) } }} />
                </div>

                <div className="ss-slider-holder">
                    <div className={(enabled) ? "sss ss-slider-outer" : "sss ss-slider-outer disabled"}><Slider max={100} tooltip={false} step={1} onChange={(e) => this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 1024, BorderOuterSoftness: e })}
                        value={this.props.properties.borderOuterSoftness} />
                        <div className={labelClass}>Outer Soften:</div></div>
                    <MagicInput step={1} disabled={!enabled} value={this.props.properties.borderOuterSoftness}
                        callback={(value: any) => { if (value != "") { this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex:this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 1024, BorderOuterSoftness: Math.min(100, Math.max(0, value)) }) } }} />
                </div>

                <div className="ss-slider-holder">
                    <div className={(enabled) ? "sss ss-slider-outer" : "sss ss-slider-outer disabled"}><Slider max={100} tooltip={false} step={1} onChange={(e) => this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 2048, BorderInnerSoftness: e })}
                        value={this.props.properties.borderInnerSoftness} />
                        <div className={labelClass}>Inner Soften:</div></div>
                    <MagicInput step={1} disabled={!enabled} value={this.props.properties.borderInnerSoftness}
                        callback={(value: any) => { if (value != "") { this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex:this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 2048, BorderInnerSoftness: Math.min(100, Math.max(0, value)) }) } }} />
                </div>

                <div className="ss-slider-holder">
                    <div className={(enabled) ? "sss ss-slider-outer" : "sss ss-slider-outer disabled"}><Slider max={100} tooltip={false} step={1} onChange={(e) => this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 16384, BorderOpacity: e })}
                        value={this.props.properties.borderOpacity} />
                        <div className={labelClass}>Border Opacity:</div></div>
                    <MagicInput step={1} disabled={!enabled} value={this.props.properties.borderOpacity}
                        callback={(value: any) => { if (value != "") { this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex:this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 16384, BorderOpacity: Math.min(100, Math.max(0, value)) }) } }} />
                </div>

                <div className="ss-slider-holder">
                    <div className={(enabled) ? "sss ss-slider-outer" : "sss ss-slider-outer disabled"}><Slider max={100} tooltip={false} step={1} onChange={(e) => this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 8192, BorderBevelPosition: e })}
                        value={this.props.properties.borderBevelPosition} />
                        <div className={labelClass}>Border Position:</div></div>
                    <MagicInput step={1} disabled={!enabled} value={this.props.properties.borderBevelPosition}
                        callback={(value: any) => { if (value != "") { this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex:this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 8192, BorderBevelPosition: Math.min(100, Math.max(0, value)) }) } }} />
                </div>

                <div className="ss-slider-holder">
                    <div className={(enabled) ? "sss ss-slider-outer" : "sss ss-slider-outer disabled"}><Slider max={100} tooltip={false} step={1} onChange={(e) => this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex: this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 4096, BorderBevelSoftness: e })}
                        value={this.props.properties.borderBevelSoftness} />
                        <div className={labelClass}>Border Position:</div></div>
                    <MagicInput step={1} disabled={!enabled} value={this.props.properties.borderBevelSoftness}
                        callback={(value: any) => { if (value != "") { this.props.sendCommand("LibAtem.Commands.MixEffects.Key.MixEffectKeyDVESetCommand", { MixEffectIndex:this.props.mixEffectIndex, KeyerIndex: this.props.keyerIndex, Mask: 4096, BorderBevelSoftness: Math.min(100, Math.max(0, value)) }) } }} />
                </div>

    </div>)
    }
}