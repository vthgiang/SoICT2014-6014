import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class ButtonModal extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    render() { 
        return ( 
            <React.Fragment>
                {
                    this.props.button_type === undefined ?
                    <a style={{marginBottom: '10px', marginTop: '2px'}} className="btn btn-success pull-right" title={this.props.title} data-toggle="modal" data-backdrop="static" href={`#${this.props.modalID}`}>{this.props.button_name}</a> :
                    <a className={`${this.props.button_type} text-${this.props.color}`} style={{width: '5px'}} title={this.props.title} data-toggle="modal" data-backdrop="static" href={`#${this.props.modalID}`}><i className="material-icons">{this.props.button_type}</i></a>
                }
            </React.Fragment>
         );
    }
}
 

const mapState = state => state;
const ModalExport = connect(mapState, null)(withTranslate(ButtonModal));
export { ModalExport as ButtonModal }