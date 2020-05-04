import React from "react"
import buttonRed from "./images/button_red5.png"
import buttonGreen from "./images/button_green2.png"
import buttonGrey from "./images/button_new.png"
interface AtemButtonProps {
    callback: any
    active: boolean
    disabled?: boolean
    name:string

}
interface AtemButtonState {
 
}

export class AtemButtonRed extends React.Component<AtemButtonProps, AtemButtonState>{
    constructor(props: AtemButtonProps) {
        super(props)
        this.state = {

        }
    }

    render() {
        if(this.props.active){
            return (<div onMouseDown={this.props.callback} className="atem-button-holder red"><img height="50px" width="50px" src={buttonRed}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }else{
            return (<div onMouseDown={this.props.callback} className="atem-button-holder"><img height="50px" width="50px" src={buttonGrey}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }
        
    }
}

export class AtemButtonGreen extends React.Component<AtemButtonProps, AtemButtonState>{
    constructor(props: AtemButtonProps) {
        super(props)
        this.state = {

        }
    }

    render() {
        if(this.props.active){
            return (<div onMouseDown={this.props.callback} className="atem-button-holder green"><img height="50px" width="50px" src={buttonGreen}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }else{
            return (<div onMouseDown={this.props.callback} className="atem-button-holder"><img height="50px" width="50px" src={buttonGrey}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }
        
    }
}