import React from "react"
import buttonRed from "./images/button_red5.png"
import buttonGreen from "./images/button_green2.png"
import buttonGrey from "./images/button_new_low.png"
import buttonYellow from "./images/button_yellow.png"
interface AtemButtonProps {
    callback: any
    active: boolean
    disabled?: boolean
    name:string
    className?:string
    update?:any
}
interface AtemButtonState {
 
}

export class AtemButtonRed extends React.Component<AtemButtonProps>{
   
    shouldComponentUpdate(nextProps : AtemButtonProps ) {
        const differentActive = this.props.active !== nextProps.active;
        const differentName = this.props.name !== nextProps.name
        return differentName || differentActive;
    }

    render() {

        var textClass = this.props.className || "atem-button-text"
        if(this.props.active){
            return (<div onMouseDown={this.props.callback} className="atem-button-holder red"><img height="50px" width="50px" src={buttonRed}></img><div className={textClass}>{this.props.name}</div></div>)
        }else{
            return (<div onMouseDown={this.props.callback} className="atem-button-holder"><img height="50px" width="50px" src={buttonGrey}></img><div className={textClass}>{this.props.name}</div></div>)
        }
    }
}

interface AtemButtonFTBProps {
    callback: any
    isFullBlack: boolean
    inTransition:boolean
    disabled?: boolean
    name:string
    

}

export class AtemButtonFTB extends React.Component<AtemButtonFTBProps>{

    shouldComponentUpdate(nextProps : AtemButtonFTBProps ) {
        const differentBlack = this.props.isFullBlack !== nextProps.isFullBlack;
        const differentTransition = this.props.inTransition !== nextProps.inTransition
        return differentBlack || differentTransition;
    }

    render() {
        if(this.props.inTransition){
            return (<div onMouseDown={this.props.callback} className="atem-button-holder red"><img height="50px" width="50px" src={buttonRed}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }else if(this.props.isFullBlack){
            return (<div onMouseDown={this.props.callback} className="atem-button-holder flash"><div className="atem-button-text">{this.props.name}</div></div>) 
        }else{
            return (<div onMouseDown={this.props.callback} className="atem-button-holder"><img height="50px" width="50px" src={buttonGrey}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }
    }
}

export class AtemButtonOnAir extends React.Component<AtemButtonProps, AtemButtonState>{
  

    shouldComponentUpdate(nextProps : AtemButtonProps ) {
        const differentActive = this.props.active !== nextProps.active;
        const differentName = this.props.name !== nextProps.name
        return differentName || differentActive;
    }


    render() {
        if(this.props.active){
            return (<div onMouseDown={this.props.callback} className="atem-button-holder red"><img height="50px" width="50px" src={buttonRed}></img><div className="atem-button-text on-air">{this.props.name}</div></div>)
        }else{
            return (<div onMouseDown={this.props.callback} className="atem-button-holder "><img height="50px" width="50px" src={buttonGrey}></img><div className="atem-button-text on-air">{this.props.name}</div></div>)
        }
    }
}

export class AtemButtonGreen extends React.Component<AtemButtonProps>{


    shouldComponentUpdate(nextProps : AtemButtonProps ) {
        const differentActive = this.props.active !== nextProps.active;
        const differentName = this.props.name !== nextProps.name
        return differentName || differentActive;
    }


    render() {
        if(this.props.active){
            return (<div onMouseDown={this.props.callback} className="atem-button-holder green"><img height="50px" width="50px" src={buttonGreen}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }else{
            return (<div onMouseDown={this.props.callback} className="atem-button-holder"><img height="50px" width="50px" src={buttonGrey}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }
        
    }
}

export class AtemButtonYellow extends React.Component<AtemButtonProps>{

    shouldComponentUpdate(nextProps : AtemButtonProps ) {
        const differentActive = this.props.active !== nextProps.active;
        const differentName = this.props.name !== nextProps.name
        const differentUpdate = this.props.update != nextProps.update
        return differentName || differentActive || differentUpdate;
    }


    render() {
        if(this.props.active){
            return (<div onMouseDown={this.props.callback} className="atem-button-holder yellow"><img height="50px" width="50px" src={buttonYellow}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }else{
            return (<div onMouseDown={this.props.callback} className="atem-button-holder"><img height="50px" width="50px" src={buttonGrey}></img><div className="atem-button-text">{this.props.name}</div></div>)
        }
    }
}