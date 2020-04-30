import React from "react"
import buttonRed from "./images/button_red5.png"
import buttonGrey from "./images/button_new.png"
interface AtemButtonProps {
    callback: any
    active: boolean
    disabled?: boolean
    name:string

}
interface AtemButtonState {
 
}

export class AtemButton extends React.Component<AtemButtonProps, AtemButtonState>{
    constructor(props: AtemButtonProps) {
        super(props)
        this.state = {

        }
    }

    render() {
        if(this.props.active){
            return (<div onMouseDown={this.props.callback} className="atem-button-holder red"><img height="54px" width="54px" src={buttonRed}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }else{
            return (<div onMouseDown={this.props.callback} className="atem-button-holder"><img height="54px" width="54px" src={buttonGrey}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }
        
    }
}