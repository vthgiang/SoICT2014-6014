import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './modal.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {Loading} from '../loading1/loading';

class DialogModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reload: 0
        }
    }

    closeModal = (reset) => {
        this.setState({
            reload: this.state.reload + 1
        });
        if(reset) document.getElementById(this.props.formID).reset();
        window.$(`#${this.props.modalID}`).modal("hide");
    }

    save = (translate) => {
        const func = this.props.func();
        const {resetOnSave = false} = this.props;
        

        if(func !== undefined){
            func.then(res => {
                this.closeModal(resetOnSave);
                toast.success(this.props.msg_success, {containerId: 'toast-notification'});
            }).catch(err => {
                document.getElementById(this.props.formID).reset();
                if(err.response.data.message){
                    // Nếu thông báo lỗi trả về là một mảng các thông báo lỗi
                    if(Array.isArray(err.response.data.message)){
                        err.response.data.message.forEach(message => {
                            if(translate(`error.${message}`) !== undefined)
                                toast.error(translate(`error.${message}`), {containerId: 'toast-notification'});
                            else
                                toast.error(message, {containerId: 'toast-notification'});
                        });
                    }
                    // Ngược lại nếu thông báo lỗi trả về chỉ là 1 lỗi
                    else {
                        if(translate(`error.${err.response.data.message}`) !== undefined)
                            toast.error(translate(`error.${err.response.data.message}`), {containerId: 'toast-notification'});
                        else
                            toast.error(err.response.data.message, {containerId: 'toast-notification'});
                    }
                }else
                    toast.error(this.props.msg_faile, {containerId: 'toast-notification'});
            });
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
        const {resetOnClose = false, disableSubmit = false, hasSaveButton=true} = this.props;

        return ( 
            <React.Fragment>
                <div id={this.props.modalID} className="modal fade" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div  className={`modal-dialog  modal-size-${this.props.size}`}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={()=>this.closeModal(resetOnClose)}>&times;</button>
                                <h4 className="modal-title text-center">{this.props.title} &nbsp; { this.props.isLoading && <Loading/> }</h4>
                            </div>
                            <div className="modal-body text-left">
                                {this.props.children}
                            </div>
                            <div className="modal-footer">
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <p className="text-left">(<span className="text-red"> * </span>) : <span className="text-red">{translate('form.required')}</span></p>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        {
                                            hasSaveButton && <button type="submit" disabled={this.props.disableSubmit} className="btn btn-success" onClick={() => this.save(translate)}>{translate('form.save')}</button>
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