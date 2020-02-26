import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './modal.css';
import 'react-toastify/dist/ReactToastify.css';

class ModalButton extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    openModal = () => {
        document.getElementById(this.props.modalID).className="modal fade in show-on";
    }
    render() { 
        return ( 
            <React.Fragment>
                {
                    this.props.button_type === undefined ?
                    <a className="btn btn-success pull-right" title={this.props.title} onClick={this.openModal}>{this.props.button_name}</a> :
                    <a className={`${this.props.button_type} text-${this.props.color}`} title={this.props.title} onClick={this.openModal}><i className="material-icons">{this.props.button_type}</i></a>
                }
            </React.Fragment>
         );
    }
}
 

const mapState = state => state;
const ModalExport = connect(mapState, null)(withTranslate(ModalButton));
export { ModalExport as ModalButton }