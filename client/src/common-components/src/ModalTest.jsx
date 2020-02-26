import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './css/modal.css';
import Swal from 'sweetalert2';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            show: false
        }
    }

    toggleModal = () => {
        this.setState({
            show: !this.state.show
        })
    }

    save = () => {
        this.props
            .func()
            .then(res => {
                this.toggleModal();
                Swal.fire({
                    icon: 'success',
                    position: "top-right",
                    title: this.props.msg_success,
                    showConfirmButton: false,
                    timer: 3000
                  })
            }).catch(err => {
                Swal.fire({
                    icon: 'warning',
                    position: "top-right",
                    title: this.props.msg_faile,
                    showConfirmButton: false,
                    timer: 3000
                  })
            });
    }

    render() { 
        const {translate} = this.props;
        return ( 
            <React.Fragment>
                <a className="btn btn-success pull-right" href='#modal' title={this.props.title} onClick={this.toggleModal}>{this.props.button_name}</a>
                <div className={this.state.show ? "modal fade in show-on" : "modal fade in show-off"}>
                    <div className={`modal-dialog animation-dialog modal-size-${this.props.size}`}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={this.toggleModal}>&times;</button>
                                <h3 className="modal-title text-center">{this.props.title}</h3>
                            </div>
                            <div className="modal-body">
                                {this.props.children}
                            </div>
                            <div className="modal-footer">
                                <p className="pull-left">(<span className="text-red"> * </span>) : <span className="text-red">{translate('form.required')}</span></p>
                                <button type="button" className="btn btn-primary" onClick={this.toggleModal}>{translate('form.close')}</button>
                                <button type="submit" className="btn btn-success" onClick={this.save}>{translate('form.save')}</button>
                            </div>
                        </div>
                    </div>
                </div> 
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const ModalExport = connect(mapState, null)(withTranslate(Modal));

export { ModalExport as Modal }