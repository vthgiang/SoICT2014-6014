import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, DatePicker, UploadFile } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import { getStorage } from "../../../../../config";

class EditVersionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // documentFile: [],
            // documentFileScan: [],
        }
    }

    handleChangeVersionName = (e) => {
        const value = e.target.value;
        this.validateVersionName(value, true)
    }

    handleIssuingDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                issuingDate: value,
            }
        })
    }
    handleEffectiveDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                effectiveDate: value,
            }
        })
    }

    handleExpiredDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                expiredDate: value,
            }
        })
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
    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }
    validateVersionName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        let val = value ? value.trim() : null;
        if (!val) {
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



    isValidateForm = () => {
        return this.validateVersionName(this.state.versionName, false);
    }

    convertISODate = (dateStr) => {
        if (dateStr) {
            if (!dateStr.includes(':')) {
                let splitter = dateStr.split('-');
                let isoDate = new Date(splitter[2], splitter[1] - 1, splitter[0])
                return isoDate;
            }
            else
                return dateStr;
        }
        return null;
    }

    save = () => {
        if (this.isValidateForm()) {
            return this.props.handleChange(this.state);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.index !== prevState.index) {
            return {
                ...prevState,
                index: nextProps.index,
                versionName: nextProps.versionName,
                issuingDate: nextProps.issuingDate,
                effectiveDate: nextProps.effectiveDate,
                expiredDate: nextProps.expiredDate,

                file: nextProps.documentFile[0].file,
                urlFile: nextProps.documentFile[0].urlFile,
                fileUpload: nextProps.documentFile[0].fileUpload,

                fileScan: nextProps.documentFileScan[0].file,
                urlFileScan: nextProps.documentFileScan[0].urlFile,
                fileScanUpload: nextProps.documentFileScan[0].fileUpload,

            }
        }
        else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;
        const { versionId, versionName, issuingDate, effectiveDate, expiredDate,
            file, urlFile, fileUpload, fileScan, urlFileScan, fileScanUpload } = this.state;
        let files, fileScans;
        if (file) {
            files = [{ fileName: file, urlFile: urlFile, fileUpload: fileUpload }]
        }
        if (fileScan) {
            fileScans = [{ fileName: fileScan, urlFile: urlFileScan, fileUpload: fileScanUpload }]
        }
        return (
            <DialogModal
                size="25"
                modalID="modal-edit-document-version-form"
                formID="form-edit-document-version-form"
                title={translate('document.edit')}
                func={this.save}
                disableSubmit={!this.isValidateForm()}
            >
                {/* <React.Fragment> */}
                <div className={`form-group `}>
                    <label>{translate('document.doc_version.name')}<span className="text-red">*</span></label>
                    <input type="text" onChange={this.handleChangeVersionName} value={versionName} className="form-control" />
                </div>
                <div className="form-group">
                    <label>{translate('document.upload_file')}</label>
                    <UploadFile files={files} onChange={this.handleUploadFile} />

                </div>
                <div className="form-group">
                    <label>{translate('document.upload_file_scan')}</label>
                    <UploadFile files={fileScans} onChange={this.handleUploadFileScan} />

                </div>
                <div className="form-group">
                    <label>{translate('document.doc_version.issuing_date')}</label>
                    <DatePicker
                        id={`document-edit-version-form-issuing-date-${versionId}`}
                        value={this.formatDate(issuingDate)}
                        onChange={this.handleIssuingDate}
                    />
                </div>
                <div className="form-group">
                    <label>{translate('document.doc_version.effective_date')}</label>
                    <DatePicker
                        id={`document-edit-version-form-effective-date-${versionId}`}
                        value={this.formatDate(effectiveDate)}
                        onChange={this.handleEffectiveDate}
                    />
                </div>
                <div className="form-group">
                    <label>{translate('document.doc_version.expired_date')}</label>
                    <DatePicker
                        id={`document-edit-version-form-expired-date-${versionId}`}
                        value={this.formatDate(expiredDate)}
                        onChange={this.handleExpiredDate}
                    />
                </div>
                {/* </React.Fragment> */}
            </DialogModal>
        )

    }
}
const mapStateToProps = state => state;



export default connect(mapStateToProps, null)(withTranslate(EditVersionForm));

