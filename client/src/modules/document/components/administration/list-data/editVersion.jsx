import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, DateTimeConverter, SelectBox, DatePicker, TreeSelect, ErrorLabel } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import moment from 'moment';
import { getStorage } from "../../../../../config";

class EditVersion extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleChangeVersionName = (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                versionName: value,
            }
        })
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
    handleUploadFile = (e) => {
        this.setState({ documentFile: e.target.files[0] });
    }

    handleUploadFileScan = (e) => {
        this.setState({ documentFileScan: e.target.files[0] });
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


    save = () => {
        const formData = new FormData();
        const { documentId, versionId, versionName, issuingDate, effectiveDate, expiredDate, documentFile, documentFileScan } = this.state;
        let title = "", descriptions = "";
        title = "Chỉnh sửa phiên bản";
        if (versionName !== this.props.versionName) {
            formData.append('versionName', versionName);
            descriptions += "Tên phiên bản mới: " + versionName + ". "
        }
        if (issuingDate !== this.props.issuingDate) {
            let date = issuingDate.split('-');
            let issuing_date = new Date(date[2], date[1], date[0]);
            formData.append('issuingDate', issuing_date);
            descriptions += "Ngày ban hành " + issuingDate + ". ";
        }
        if (effectiveDate !== this.props.effectiveDate) {
            let date = effectiveDate.split('-');
            let effective_date = new Date(date[2], date[1], date[0]);
            formData.append('effectiveDate', effective_date);
            descriptions += "Ngày hiệu lực " + effectiveDate + ". ";
        }
        if (expiredDate !== this.props.expiredDate) {
            let date = expiredDate.split('-');
            let expired_date = new Date(date[2], date[1], date[0]);
            formData.append('expiredDate', expired_date);
            descriptions += "Ngày hết hạn " + expiredDate + ". ";
        }
        if (documentFile) {
            formData.append('file', documentFile);
            descriptions += "Thêm file tài liệu. "
        }
        if (documentFileScan) {
            formData.append('fileScan', documentFileScan);
            descriptions += "Thêm file scan tài liệu";
        }
        formData.append('versionId', versionId);
        formData.append('title', title);
        formData.append('creator', getStorage("userId"))
        formData.append('descriptions', descriptions);
        this.props.editDocument(documentId, formData, 'EDIT_VERSION');
        this.props.updateDocumentVersions({
            _id: versionId,
            versionName: versionName,
            issuingDate: issuingDate,
            effectiveDate: effectiveDate,
            expiredDate: expiredDate,
            file: documentFile,
            scannedFileOfSignedDocument: documentFileScan,
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.versionId !== prevState.versionId) {
            return {
                ...prevState,
                documentId: nextProps.documentId,
                versionId: nextProps.versionId,
                versionName: nextProps.versionName,
                issuingDate: nextProps.issuingDate,
                effectiveDate: nextProps.effectiveDate,
                expiredDate: nextProps.expiredDate,
                documentFile: nextProps.documentFile,
                documentFileScan: nextProps.documentFileScan,
            }
        }
        else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;
        const { versionId, versionName, issuingDate, effectiveDate, expiredDate } = this.state;
        return (
            <DialogModal
                size="25"
                modalID="modal-edit-document-version"
                formID="form-edit-document-version"
                title={translate('document.edit')}
                func={this.save}
            >
                <React.Fragment>
                    <div className={`form-group `}>
                        <label>{translate('document.doc_version.name')}<span className="text-red">*</span></label>
                        <input type="text" onChange={this.handleChangeVersionName} value={versionName} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.upload_file')}</label>
                        <br />
                        <div className="upload btn btn-primary">
                            <i className="fa fa-folder"></i>
                            {" " + translate('document.choose_file')}
                            <input className="upload" type="file" name="file" onChange={this.handleUploadFile} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>{translate('document.upload_file_scan')}</label>
                        <br />
                        <div className="upload btn btn-primary">
                            <i className="fa fa-folder"></i>
                            {" " + translate('document.choose_file')}
                            <input className="upload" type="file" name="file" onChange={this.handleUploadFileScan} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>{translate('document.doc_version.issuing_date')}</label>
                        <DatePicker
                            id={`document-edit-version-issuing-date-${versionId}`}
                            value={this.formatDate(issuingDate)}
                            onChange={this.handleIssuingDate}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.doc_version.effective_date')}</label>
                        <DatePicker
                            id={`document-edit-version-effective-date-${versionId}`}
                            value={this.formatDate(effectiveDate)}
                            onChange={this.handleEffectiveDate}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.doc_version.expired_date')}</label>
                        <DatePicker
                            id={`document-edit-version-expired-date-${versionId}`}
                            value={this.formatDate(expiredDate)}
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
    editDocument: DocumentActions.editDocument,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditVersion));

