import { AtemDeviceInfo } from "../Devices/types"
import React from "react"
import { GetDeviceId } from "../DeviceManager"
import { RateInput, MagicInput } from "./settings"
import Slider from "react-rangeslider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlay, faSyncAlt, faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons"



interface WipeProps {
    device: AtemDeviceInfo
    signalR: signalR.HubConnection | undefined
    currentState: any
}

interface WipeState {
    hasConnected: boolean
    state: any | null
    currentState: any
}

export class Wipe extends React.Component<WipeProps, WipeState>{
    constructor(props: WipeProps) {
        super(props)
        this.state = {

            hasConnected: props.device.connected,
            state: props.currentState,
            currentState: null
        }
    }

    private sendCommand(command: string, value: any) {
        const { device, signalR } = this.props
        if (device.connected && signalR) {
            const devId = GetDeviceId(device)
            signalR
                .invoke('CommandSend', devId, command, JSON.stringify(value))
                .then((res) => {
                })
                .catch(e => {
                    console.log('ManualCommands: Failed to send', e)
                })
        }
    }

    render() {
        var pattern = this.props.currentState.mixEffects[0].transition.wipe.pattern
        var disabled = false
        var diabledClass = (!disabled) ? "sss ss-slider-outer" : "sss ss-slider-outer disabled"

        return (
            <div>
                <div className="ss-wipe-pattern-holder">

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 0, Mask: 2 })} className={(pattern === 0) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 1" height="80%" width="35%" y="10%" x="55%" rx="2" stroke-width="0.2" stroke="#191919" fill={(pattern === 0) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 1, Mask: 2 })} className={(pattern === 1) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 2" height="35%" width="80%" y="55%" x="10%" rx="2" stroke-width="0.2" stroke="#191919" fill={(pattern === 1) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>
                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 2, Mask: 2 })} className={(pattern === 2) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 3" height="80%" width="35%" y="10%" x="55%" rx="2" stroke-width="0.2" stroke="#191919" fill={(pattern === 2) ? "#ff8c00" : "#b2b2b2"} />
                            </g><g>
                                <rect id="pattern 3-2" height="80%" width="35%" y="10%" x="10%" rx="2" stroke-width="0.2" stroke="#191919" fill={(pattern === 2) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 3, Mask: 2 })} className={(pattern === 3) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 4" height="35%" width="80%" y="55%" x="10%" rx="2" stroke-width="0.2" stroke="#191919" fill={(pattern === 3) ? "#ff8c00" : "#b2b2b2"} />
                            </g><g>
                                <rect id="pattern 4-2" height="35%" width="80%" y="10%" x="10%" rx="2" stroke-width="0.2" stroke="#191919" fill={(pattern === 3) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 4, Mask: 2 })} className={(pattern === 4) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 5" height="35%" width="35%" y="55%" x="10%" rx="2" stroke-width="0.2" stroke="#191919" fill={(pattern === 4) ? "#ff8c00" : "#b2b2b2"} />
                            </g><g>
                                <rect id="pattern 5-2" height="35%" width="35%" y="10%" x="10%" rx="2" stroke-width="0.2" stroke="#191919" fill={(pattern === 4) ? "#ff8c00" : "#b2b2b2"} />
                            </g>

                            <g>
                                <rect id="pattern 5-3" height="35%" width="35%" y="55%" x="55%" rx="2" stroke-width="0.2" stroke="#191919" fill={(pattern === 4) ? "#ff8c00" : "#b2b2b2"} />
                            </g><g>
                                <rect id="pattern 5-4" height="35%" width="35%" y="10%" x="55%" rx="2" stroke-width="0.2" stroke="#191919" fill={(pattern === 4) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 5, Mask: 2 })} className={(pattern === 5) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 6" height="35%" width="35%" y="32.5%" x="32.5%" stroke-width="0.2" stroke="#191919" fill={(pattern === 5) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 6, Mask: 2 })} className={(pattern === 6) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 7" height="35%" width="35%" y="32.5%" x="32.5%" transform="rotate(45,50,50)" stroke-width="0.2" stroke="#191919" fill={(pattern === 6) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 7, Mask: 2 })} className={(pattern === 7) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <circle id="pattern 8" r="20" cy="50" cx="50" stroke-width="0.2" stroke="#191919" fill={(pattern === 7) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 8, Mask: 2 })} className={(pattern === 8) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 9" height="35" width="35" y="10" x="10" rx="3" stroke-width="0.2" stroke="#191919" fill={(pattern === 8) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 9, Mask: 2 })} className={(pattern === 9) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 10" height="35" width="35" y="10" x="55" rx="3" stroke-width="0.2" stroke="#191919" fill={(pattern === 9) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 10, Mask: 2 })} className={(pattern === 10) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 11" height="35" width="35" y="50" x="55" rx="3" stroke-width="0.2" stroke="#191919" fill={(pattern === 10) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 11, Mask: 2 })} className={(pattern === 11) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 12" height="35" width="35" y="50" x="10" rx="3" stroke-width="0.2" stroke="#191919" fill={(pattern === 11) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 12, Mask: 2 })} className={(pattern === 12) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 13" height="35" width="35" y="10" x="32.5" rx="3" stroke-width="0.2" stroke="#191919" fill={(pattern === 12) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 13, Mask: 2 })} className={(pattern === 13) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 14" height="35" width="35" y="32.5" x="55" rx="3" stroke-width="0.2" stroke="#191919" fill={(pattern === 13) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 14, Mask: 2 })} className={(pattern === 14) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 15" height="35" width="35" y="55" x="32.5" rx="3" stroke-width="0.2" stroke="#191919" fill={(pattern === 14) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 15, Mask: 2 })} className={(pattern === 15) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect id="pattern 16" height="35" width="35" y="32.5" x="10" rx="3" stroke-width="0.2" stroke="#191919" fill={(pattern === 15) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 16, Mask: 2 })} className={(pattern === 16) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <polygon id="pattern 17" points="15,15 85,15 15,85" stroke-width="0.2" stroke="#191919" fill={(pattern === 16) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>

                    <div onClick={() => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Pattern: 17, Mask: 2 })} className={(pattern === 17) ? "ss-wipe-pattern-item active" : "ss-wipe-pattern-item"}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <polygon id="pattern 18" points="85,15 85,85 15,15" rx="5" stroke-width="0.2" stroke="#191919" fill={(pattern === 17) ? "#ff8c00" : "#b2b2b2"} />
                            </g>
                        </svg>
                    </div>



                </div>
                <div className="ss-row" style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <div className="ss-label" >Rate:</div>
                    <div className="ss-rate"><RateInput videoMode={this.props.currentState.settings.videoMode} value={this.props.currentState.mixEffects[0].transition.wipe.rate} callback={(e: number) => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Mask: 1, Rate: e })} /></div>
                </div>

                <div className="ss-slider-holder">
                    <div className={diabledClass}><Slider tooltip={false} step={0.1} onChange={(e) => this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Mask: 16, Symmetry: e })} value={this.props.currentState.mixEffects[0].transition.wipe.symmetry} /><div className="ss-slider-label">Symmetry:</div></div>
                    <MagicInput disabled={disabled} value={this.props.currentState.mixEffects[0].transition.wipe.symmetry}
                        callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Mask: 16, Symmetry: Math.min(100, Math.max(0, value)) }) } }} />
                </div>

                <div className="ss-row xy">
                    <div className="ss-label">Position:</div>
                    <div className="ss-label right" >X:</div>
                    <MagicInput step={0.0001}  disabled={disabled} value={this.props.currentState.mixEffects[0].transition.wipe.xPosition}
                        callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Mask: 64, XPosition: Math.min(1, Math.max(0, value)) }) } }} />
                    <div className="ss-label right" >Y:</div>
                    <MagicInput step={0.0001} disabled={disabled} value={this.props.currentState.mixEffects[0].transition.wipe.yPosition}
                        callback={(value: any) => { if (value != "") { this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand", { Index: 0, Mask: 128, YPosition: Math.min(1, Math.max(0, value)) }) } }} />
                </div>

                <div className="ss-row" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
                    <div className="ss-label">Direction:</div>
                    <div className="ss-direction-holder">
                        <div onClick={()=>this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand",{Index:0,ReverseDirection:false,Mask:256})} style={{lineHeight:"25px"}}  className={(!this.props.currentState.mixEffects[0].transition.wipe.reverseDirection)?"ss-button-inner ss-button-left ss-button-inner-selected":"ss-button-inner ss-button-left"}><FontAwesomeIcon icon={faAngleRight} /></div>
                        <div onClick={()=>this.sendCommand("LibAtem.Commands.MixEffects.Transition.TransitionWipeSetCommand",{Index:0,ReverseDirection:true,Mask:256})} style={{lineHeight:"25px"}}  className={(this.props.currentState.mixEffects[0].transition.wipe.reverseDirection)?"ss-button-inner ss-button-right ss-button-inner-selected":"ss-button-inner ss-button-right"}><FontAwesomeIcon icon={faAngleLeft} /></div>
                    </div>

                </div>

            </div>

        )

    }
}