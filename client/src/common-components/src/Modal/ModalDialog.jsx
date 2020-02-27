import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './modal.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ModalDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    closeModal = () => {
        document.getElementById(this.props.modalID).className="modal fade in show-off";
    }

    clear = () => {
        document.getElementById(this.props.formID).reset();
    }

    save = (translate) => {
        this.props
            .func()
            .then(res => {
                if(this.props.type !== 'edit') this.clear();
                this.closeModal();
                toast.success(this.props.msg_success, {containerId: `notifi-${this.props.modalID}`});
                
            }).catch(err => {
                if(err.response.data.message){
                    if(translate(`confirm.${err.response.data.message}`) !== undefined)
                        toast.error(translate(`confirm.${err.response.data.message}`), {containerId: `notifi-${this.props.modalID}`});
                    else
                        toast.error(err.response.data.message, {containerId: `notifi-${this.props.modalID}`});
                }else
                    toast.error(this.props.msg_faile, {containerId: `notifi-${this.props.modalID}`});
            });
    }

    render() { 
        const {translate} = this.props;

        return ( 
            <React.Fragment>
                <ToastContainer enableMultiContainer containerId={`notifi-${this.props.modalID}`} position={toast.POSITION.TOP_RIGHT}/>
                <div id={this.props.modalID} className="modal fade in show-off">
                    <div className={`modal-dialog animation-dialog modal-size-${this.props.size}`}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={this.closeModal}>&times;</button>
                                <h3 className="modal-title text-center">{this.props.title}</h3>
                            </div>
                            <div className="modal-body text-left">
                                {this.props.children}
                            </div>
                            <div className="modal-footer">
                                <p className="pull-left">(<span className="text-red"> * </span>) : <span className="text-red">{translate('form.required')}</span></p>
                                <button type="submit" className="btn btn-success" onClick={() => this.save(translate)}>{translate('form.save')}</button>
                                <button type="button" className="btn btn-default" onClick={this.closeModal}>{translate('form.close')}</button>
                            </div>
                        </div>
                    </div>
                </div> 
            </React.Fragment>
         );
    }
}

const mapState = state => state;
const ModalExport = connect(mapState, null)(withTranslate(ModalDialog));
export { ModalExport as ModalDialog }