import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './tooltip.css';

class ToolTip extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    displayTooltip = (data) => {
        if(data.length < 4)
            return null;
        return (
            <div className="tooltip2">...
                <span className="tooltip2text">
                    {
                        data.map((element, index, arr) => {
                            if(index !== arr.length - 1) return `${element}, `;
                            else return `${element}`
                        })
                    }
                </span>
            </div>
        );
    }
 
    render() { 
        const {dataTooltip} = this.props;

        return <React.Fragment>{
            dataTooltip.map((element, index, arr) => {
                if(arr.length < 4){
                    if(index !== arr.length - 1) return `${element}, `;
                    else return `${element}`
                }else{
                    if(index < 3 ){
                        return `${element}, `
                    }
                }
            })
        }{
            this.displayTooltip(dataTooltip)
        }
        </React.Fragment>;
    }
}
 

const mapState = state => state;
const ToolTipExport = connect(mapState, null)(withTranslate(ToolTip));
export { ToolTipExport as ToolTip }