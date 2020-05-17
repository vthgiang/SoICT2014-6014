import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './modal.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {Loading} from '../loading/loading';

class DialogModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reload: 0,
            isClose: false
        }
    }

    closeModal = (reset) => {
        this.setState({
            reload: this.state.reload + 1
        });
        if(reset) document.getElementById(this.props.formID).reset();
        window.$(`#${this.props.modalID}`).modal("hide");

        if (this.props.afterClose !== undefined){
            this.props.afterClose()
        }
    }

    save = () => {
        const {closeOnSave = true, resetOnSave = false, afterSave} = this.props;
        this.props.func();
        if (closeOnSave){
            this.closeModal(resetOnSave);
        }

        if (afterSave !== undefined){
            afterSave()
        }
    }

    componentDidUpdate(){
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    render() { 
        const {translate} = this.props;
        const {resetOnClose = false, disableSubmit = false, hasSaveButton=true, size, maxWidth, hasNote=true, bodyStyle={}} = this.props;
        return ( 
            <React.Fragment>
                <div id={this.props.modalID} className="modal fade" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className={`modal-dialog modal-size-${this.props.size}`} style={maxWidth===undefined?{}:{maxWidth: maxWidth}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={()=> {
                                    this.closeModal(resetOnClose);
                                    this.setState({isClose: !this.state.isClose},()=>{
                                        if(this.props.receiveEventClose) this.props.receiveEventClose(this.state.isClose);
                                    }
                                    );
                                }}>&times;</button>
                                <h4 className="modal-title text-center">{this.props.title} &nbsp; { this.props.isLoading && <Loading/> }</h4>
                            </div>
                            <div className="modal-body text-left" style={bodyStyle}>
                                {this.props.children}
                            </div>
                            <div className="modal-footer">
                                <div className="row">
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        {
                                            hasNote && <p className="text-left">(<span className="text-red"> * </span>) : <span className="text-red">{translate('form.required')}</span></p>
                                        }
                                    </div>
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        {
                                            hasSaveButton && <button type="submit" disabled={this.props.disableSubmit} className="btn btn-success" onClick={this.save}>{translate('form.save')}</button>
                                        }
                                        <button type="button" className="btn btn-default" onClick={()=>this.closeModal(resetOnClose)}>{translate('form.close')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </React.Fragment>
         );
    }
}

const mapState = state => state;
const ModalExport = connect(mapState, null)(withTranslate(DialogModal));
export { ModalExport as DialogModal }