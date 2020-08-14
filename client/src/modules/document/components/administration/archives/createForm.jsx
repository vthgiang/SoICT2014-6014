import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, TreeSelect } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
class CreateForm extends Component {
    constructor(props) {
        super(props);
        console.log('cons', this.props.archiveParent);
        this.state = {
            archiveParent: this.props.archiveParent,
        }
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            documentName: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            documentDescription: value
        })
    }

    handleParent = (value) => {
        this.setState({ archiveParent: value[0] });
    };
    validateName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.no_blank_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentName: value,
                    errorName: msg,
                }
            })
        }
        return msg === undefined;
    }
    handleValidateName = (e) => {
        const value = e.target.value.trim();
        this.validateName(value, true);
    }

    isValidateForm = () => {
        return this.validateName(this.state.documentName, false);
    }

    save = () => {
        const { documentName, documentDescription, archiveParent } = this.state;
        this.props.createDocumentArchive({
            name: documentName,
            description: documentDescription,
            parent: archiveParent ? archiveParent : ""
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.archiveParent !== prevState.archiveParent && nextProps.archiveParent && nextProps.archiveParent.length) {
            let dm = nextProps.archiveParent;
            return {
                ...prevState,
                archiveParent: dm,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, documents } = this.props;
        const { list } = documents.administration.archives;
        const { archiveParent, errorName } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-document-archive"
                    formID="form-create-document-archive"
                    title="Thêm mục lưu trữ"
                    disableSubmit={!this.isValidateForm()}
                    func={this.save}
                >
                    <form id="form-create-document-archive">
                        <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                            <label>Tên mục lưu trữ<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleValidateName} />
                            <ErrorLabel content={errorName} />
                        </div>
                        <div className="form-group">
                            <label>Tên nút cha</label>
                            <TreeSelect data={list} value={!archiveParent ? "" : archiveParent} handleChange={this.handleParent} mode="radioSelect" />
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea style={{ minHeight: '100px' }} type="text" className="form-control" onChange={this.handleDescription} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createDocumentArchive: DocumentActions.createDocumentArchive
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));