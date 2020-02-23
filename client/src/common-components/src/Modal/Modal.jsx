import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './modal.css';
import Swal from 'sweetalert2';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            show: false
        }
    }

    toggleModal = (id) => {
        this.clear(id);
        this.setState({
            show: !this.state.show
        })
    }

    clear = (id) => {
        document.getElementById(id).reset();
    }

    save = (id) => {
        this.props
            .func()
            .then(res => {
                this.toggleModal(id);
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
                {
                    this.props.modal_type === undefined ?
                    <a className="btn btn-success pull-right" title={this.props.title} onClick={() => this.toggleModal(this.props.id)}>{this.props.button_name}</a> :
                    <a className={this.props.modal_type} title={this.props.title} onClick={() => this.toggleModal(this.props.id)}><i className="material-icons">{this.props.modal_type}</i></a>
                }
                <div className={this.state.show ? "modal fade in show-on" : "modal fade in show-off"}>
                    <div className={`modal-dialog animation-dialog modal-size-${this.props.size}`}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => this.toggleModal(this.props.id)}>&times;</button>
                                <h3 className="modal-title text-center">{this.props.title}</h3>
                            </div>
                            <div className="modal-body text-left">
                                {this.props.children}
                            </div>
                            <div className="modal-footer">
                                <p className="pull-left">(<span className="text-red"> * </span>) : <span className="text-red">{translate('form.required')}</span></p>
                                <button type="submit" className="btn btn-success" onClick={() => this.save(this.props.id)}>{translate('form.save')}</button>
                                <button type="button" className="btn btn-default" onClick={() => this.toggleModal(this.props.id)}>{translate('form.close')}</button>
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