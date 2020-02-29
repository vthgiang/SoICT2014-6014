import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './modal.css';
import Swal from 'sweetalert2';

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

    notification = (icon, color, message) => {
        Swal.fire({
            position: 'top-end',
            icon,
            html: `<h4 class="text-${color}">${message}</h4>`,
            showConfirmButton: false,
            timer: 4000
          })
    }

    save = (translate) => {
        this.props
            .func()
            .then(res => {
                if(this.props.type !== 'edit') this.clear();
                this.closeModal();
                this.notification("success", "green", this.props.msg_success);
                
            }).catch(err => {
                if(err.response.data.message){
                    if( 
                        err.response.data.message.length < 20 &&
                        translate(`confirm.${err.response.data.message}`) !== undefined
                    )
                        this.notification("warning", "orange", translate(`confirm.${err.response.data.message}`));
                    else
                        this.notification("warning", "orange", err.response.data.message);
                }else
                    this.notification("error", "red", this.props.msg_faile);
            });
    }

    render() { 
        const {translate} = this.props;

        return ( 
            <React.Fragment>
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