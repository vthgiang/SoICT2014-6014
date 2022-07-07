import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './modal.css';

import { Loading } from '../loading/loading';

class DialogModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reload: 0,
            isClose: false
        }
    }

    componentDidMount() {
        if (window.$('body').hasClass('modal-open')) {
            window.$(".modal-backdrop").remove();
            window.$('body').removeClass('modal-open');
            window.$('body').css('padding-right', "0px");
        }
    }

    closeModal = (reset) => {
        const { modalID } = this.props;
        this.setState({
            reload: this.state.reload + 1
        });
        if (reset && document.getElementById(modalID)) document.getElementById(modalID).value = "";
        window.$(`#${this.props.modalID}`).modal("hide");

        if (this.props.afterClose !== undefined) {
            this.props.afterClose()
        }
    }

    save = () => {
        const { closeOnSave = true, resetOnSave = false, afterSave } = this.props;
        this.props.func();
        if (closeOnSave) {
            this.closeModal(resetOnSave);
        }

        if (afterSave !== undefined) {
            afterSave()
        }
    }

    render() {
        const { translate } = this.props;
        const { resetOnClose = false, disableSubmit = false, hasSaveButton = true, hasCloseButton = true, size, styleCustom, maxWidth, hasNote = true, receiveEventClose, marginTop, bodyStyle = {}, title, isLoading, modalID, saveText = undefined, note, noTabIndex } = this.props;

        const { isClose } = this.state;

        const defaultNote = <p className="text-left">(<span className="text-red"> * </span>) : <span className="text-red">{translate('form.required')}</span></p>;

        return (
            <React.Fragment>
                <div id={modalID} className="modal fade" tabIndex={!noTabIndex ? -1 : ""} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className={`modal-dialog modal-size-${size}`} style={maxWidth ? marginTop ? { marginTop: marginTop + "px", maxWidth: maxWidth + "px" } : { maxWidth: maxWidth + "px", marginTop: "unset" } : marginTop ? { marginTop: marginTop + "px", maxWidth: "unset" } : { marginTop: "unset", maxWidth: "unset" }}>
                        <div className="modal-content">
                            <div className="modal-header" style={styleCustom}>
                                <button type="button" className="close" onClick={() => {
                                    this.closeModal(resetOnClose);
                                    this.setState({ isClose: !isClose }, () => {
                                        if (receiveEventClose) this.props.receiveEventClose(isClose);
                                    }
                                    );
                                }}>&times;</button>
                                <h4 className="modal-title text-center threedots">{title} &nbsp; {isLoading && <Loading />}</h4>
                            </div>
                            <div className="modal-body text-left" style={bodyStyle}>
                                {this.props.children}
                            </div>
                            <div className="modal-footer">
                                <div className="row">
                                    <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                                        {
                                            hasNote ? note ? note : defaultNote : ""
                                        }
                                    </div>
                                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                        {
                                            hasSaveButton && <button type="button" disabled={disableSubmit} className="btn btn-success" onClick={this.save}>{saveText || translate('form.save')}</button>
                                        }
                                        {
                                            hasCloseButton && <button type="button" className="btn btn-danger" onClick={() => this.closeModal(resetOnClose)}>{translate('form.close')}</button>
                                        }
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