import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './tooltip.css';

class ToolTip extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    displayDefault = (data) => {
        return <React.Fragment>
            {
                data.map((element, index, arr) => {
                    if(arr.length < 4){
                        if(index !== arr.length - 1) return `${element}, `;
                        else return `${element}`
                    }else{
                        if(index < 3 ){
                            return `${element}, `
                        }
                    }
                })
            }
            {
                data.length >= 4 &&
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
            }
        </React.Fragment>
    }

    displayTitleContent = (data) => {
        let convertData = [];
        for (let index = data.length-1 ; index > data.length-6; index--) {
            const element = data[index];
            convertData.push(element);
        }
        return <React.Fragment>
            <div className="tooltip2">
                <u className="text-blue" style={{marginLeft: '3px'}}>chi tiết</u>
                <span className="tooltip2text">
                    {convertData.map((content, i)=> <p key={i} className="text-left">{content}</p>)}
                </span>
            </div>
        </React.Fragment>
    }
 
    diplayToolTip = (data, type) => {
        switch(type){
            case 'latest_history': 
                return this.displayTitleContent(data);
            default:
                return this.displayDefault(data);
        }
    }

    render() { 
        const {dataTooltip, type=undefined} = this.props;

        return this.diplayToolTip(dataTooltip, type);
    }
}
 

const mapState = state => state;
const ToolTipExport = connect(mapState, null)(withTranslate(ToolTip));
export { ToolTipExport as ToolTip }