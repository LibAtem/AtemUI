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

interface AtemButtonGenericProps {
    callback: any
    active: boolean
    disabled?: boolean // TODO - use
    name: string
    textClassName?: string
    color: 'red' | 'green'
}

function assertNever(_: never): void{
}

export class AtemButtonGeneric extends React.Component<AtemButtonGenericProps>{
   
    // shouldComponentUpdate(nextProps : AtemButtonProps ) {
    //     const differentActive = this.props.active !== nextProps.active;
    //     const differentName = this.props.name !== nextProps.name
    //     return differentName || differentActive;
    // }

    render() {

        let className = 'atem-button-holder '
        let buttonImage = buttonGrey
        if (this.props.active) {
            className += this.props.color

            switch(this.props.color) {
                case 'red':
                    buttonImage = buttonRed
                    break
                case 'green':
                    buttonImage = buttonGreen
                    break
                default:
                    assertNever(this.props.color)
                    break
            }
        }

        const textClass = this.props.textClassName || "atem-button-text"
        return (<div onMouseDown={this.props.callback} className={className}><img height="50px" width="50px" src={buttonImage}></img><div className={textClass}>{this.props.name}</div></div>)
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