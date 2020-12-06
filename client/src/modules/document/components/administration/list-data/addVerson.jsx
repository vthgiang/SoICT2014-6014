import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { DialogModal, ButtonModal, DateTimeConverter, SelectBox, DatePicker, TreeSelect, ErrorLabel, UploadFile } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import moment from 'moment';
import { getStorage } from "../../../../../config";

class AddVersion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            documentIssuingDate: "",
            documentEffectiveDate: "",
            documentExpiredDate: "",

            file: "",
            urlFile: "",
            fileUpload: "",

            fileScan: "",
            urlFileScan: "",
            fileScanUpload: "",

        }
    }
    handleChangeVersionName = (e) => {
        const value = e.target.value;
        this.validateVersionName(value, true)
    }
    handleUploadFile = (value) => {
        if (value.length !== 0) {
            this.setState({
                file: value[0].fileName,
                urlFile: value[0].urlFile,
                fileUpload: value[0].fileUpload

            })
        } else {
            this.setState({
                file: "",
                urlFile: "",
                fileUpload: ""
            })
        }

    }

    handleUploadFileScan = (value) => {
        if (value.length !== 0) {
            this.setState({
                fileScan: value[0].fileName,
                urlFileScan: value[0].urlFile,
                fileScanUpload: value[0].fileUpload

            })
        } else {
            this.setState({
                fileScan: "",
                urlFileScan: "",
                fileScanUpload: ""
            })
        }

    }
    handleIssuingDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                documentIssuingDate: value,
            }
        })
    }

    handleEffectiveDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                documentEffectiveDate: value,
            }
        })
    }

    handleExpiredDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                documentExpiredDate: value,
            }
        })
    }
    validateVersionName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_version_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    versionName: value,
                    errorVersionName: msg,
                }
            })
        }
        return msg === undefined;
    }
    isValidateFormAddVersion = () => {
        return this.validateVersionName(this.state.versionName, false);
    }

    save = () => {
        if (this.isValidateFormAddVersion()) {
            return this.props.handleChange(this.state);
        }
    }


    render() {
        const { translate } = this.props;
        const { versionId, versionName, issuingDate, effectiveDate, expiredDate, errorVersionName } = this.state;
        return (
            <DialogModal
                modalID="sub-modal-add-document-new-version"
                formID="sub-form-add-document-new-version"
                title={translate('document.add_version')}
                disableSubmit={!this.isValidateFormAddVersion()}
                func={this.save}
            >
                <React.Fragment>
                    <div className={`form-group ${!errorVersionName ? "" : "has-error"}`}>
                        <label>{translate('document.doc_version.name')}<span className="text-red">*</span></label>
                        <input type="text" onChange={this.handleChangeVersionName} className="form-control" />
                        <ErrorLabel content={errorVersionName} />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.upload_file')}</label>
                        <UploadFile multiple={true} onChange={this.handleUploadFile} />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.upload_file_scan')}</label>
                        <UploadFile multiple={true} onChange={this.handleUploadFileScan} />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.doc_version.issuing_date')}</label>
                        <DatePicker
                            id={`document-add-version-issuing-date`}
                            onChange={this.handleIssuingDate}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.doc_version.effective_date')}</label>
                        <DatePicker
                            id={`document-add-version-effective-date`}
                            onChange={this.handleEffectiveDate}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.doc_version.expired_date')}</label>
                        <DatePicker
                            id={`document-add-version-expired-date`}
                            onChange={this.handleExpiredDate}
                        />
                    </div>
                </React.Fragment>
            </DialogModal>
        )
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    //editDocument: DocumentActions.editDocument,
}

const addVersion = connect(mapStateToProps, mapDispatchToProps)(withTranslate(AddVersion));
export { addVersion as AddVersion }
