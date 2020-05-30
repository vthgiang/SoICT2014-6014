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

    displayTitleContent = (title, data) => {
        return <React.Fragment>
            <span className="text-blue">{title}</span>
            <div className="tooltip2">...
                <span className="tooltip2text">
                    <ul>
                        {
                            data.map((content, i)=> <li key={i}>{content}</li>)
                        }
                    </ul>
                </span>
            </div>
        </React.Fragment>
    }
 
    diplayToolTip = (data, type) => {
        switch(type){
            case 'title-content': 
                return this.displayTitleContent(data, type);
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