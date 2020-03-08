import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './modal.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ModalDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reload: 0
        }
    }

    closeModal = () => {
        this.setState({
            reload: this.state.reload + 1
        });
        document.getElementById(this.props.formID).reset();
        window.$(`#${this.props.modalID}`).modal("hide");
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
                toast.success(this.props.msg_success, {containerId: 'toast-notification'});
            }).catch(err => {
                document.getElementById(this.props.formID).reset();
                if(err.response.data.message){
                    if( 
                        err.response.data.message.length < 15 &&
                        translate(`confirm.${err.response.data.message}`) !== undefined
                    )
                        toast.warning(translate(`confirm.${err.response.data.message}`), {containerId: 'toast-notification'});
                    else
                        toast.warning(err.response.data.message, {containerId: 'toast-notification'});
                }else
                    toast.error(this.props.msg_faile, {containerId: 'toast-notification'});
            });
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
        return ( 
            <React.Fragment>
                <div id={this.props.modalID} className="modal fade" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div  className={`modal-dialog  modal-size-${this.props.size}`}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={this.closeModal}>&times;</button>
                                <h4 className="modal-title text-center">{this.props.title}</h4>
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