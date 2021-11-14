import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, DatePicker, UploadFile } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import { getStorage } from "../../../../../config";
function areEqual(prevProps, nextProps) {
    if (prevProps.documentId === nextProps.documentId && prevProps.versionId === nextProps.versionId){
        return true
    } else {
        return false
    }
}
function EditVersion(props) {
    const [state, setState] = useState({})
    const handleChangeVersionName = (e) => {
        const value = e.target.value;
        validateVersionName(value, true)
    }

    const handleIssuingDate = (value) => {
        setState({
            ...state,
            issuingDate: value,
        })
    }
    const handleEffectiveDate = (value) => {
        setState({
            ...state,
            effectiveDate: value,
        })
    }

    const handleExpiredDate = (value) => {
        setState({
            ...state,
            expiredDate: value,
        })
    }
    const handleUploadFile = (file) => {
        file = file.map(x => {
            return {
                fileName: x.fileName,
                url: x.urlFile,
                fileUpload: x.fileUpload
            }
        })
        if (JSON.stringify(state.documentFile) !== JSON.stringify(file)&& JSON.stringify(file)!==JSON.stringify([])) {
            setState({
                ...state,
                documentFile: file
            });
        }
    }

    const handleUploadFileScan = (file) => {
        file = file.map(x => {
            return {
                fileName: x.fileName,
                url: x.urlFile,
                fileUpload: x.fileUpload
            }
        })
        if (JSON.stringify(state.documentFileScan) !== JSON.stringify(file) && JSON.stringify(file)!==JSON.stringify([])) {
            setState({
                ...state,
                documentFileScan: file
            });
        }
    }
    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    function formatDate(date, monthYear = false) {
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
    const validateVersionName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = props;
        let val = value ? value.trim() : null;
        if (!val) {
            msg = translate('document.doc_version.no_blank_version_name');
        }
        if (willUpdateState) {
            setState({
                ...state,
                versionName: value,
                errorVersionName: msg,
            })
        }
        return msg === undefined;
    }



    const isValidateForm = () => {
        return validateVersionName(state.versionName, false);
    }

    const convertISODate = (dateStr) => {
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
    const save = () => {
        const formData = new FormData();
        const { documentId, versionId, versionName, issuingDate, effectiveDate, expiredDate, documentFile, documentFileScan } = state;
        let title = "", descriptions = "";
        title = "Chỉnh sửa phiên bản";
        if (versionName !== props.versionName) {
            formData.append('versionName', versionName);
            descriptions += "Tên phiên bản mới: " + versionName + ". "
        }
        if (issuingDate !== props.issuingDate) {
            let date = issuingDate.split('-');
            let issuing_date = new Date(date[2], date[1], date[0]);
            formData.append('issuingDate', issuing_date);
            descriptions += "Ngày ban hành " + issuingDate + ". ";
        }
        if (effectiveDate !== props.effectiveDate) {
            let date = effectiveDate.split('-');
            let effective_date = new Date(date[2], date[1], date[0]);
            formData.append('effectiveDate', effective_date);
            descriptions += "Ngày hiệu lực " + effectiveDate + ". ";
        }
        if (expiredDate !== props.expiredDate) {
            let date = expiredDate.split('-');
            let expired_date = new Date(date[2], date[1], date[0]);
            formData.append('expiredDate', expired_date);
            descriptions += "Ngày hết hạn " + expiredDate + ". ";
        }
        if (documentFile && documentFile.length) {
            documentFile.forEach(x => {
                formData.append('file', x.fileUpload);
            })
            descriptions += "Thêm file tài liệu. "
        }
        if (documentFileScan && documentFileScan.length) {
            documentFileScan.forEach(x => {
                formData.append('fileScan', x.fileUpload);
            })
            descriptions += "Thêm file scan tài liệu";
        }
        formData.append('versionId', versionId);
        formData.append('title', title);
        formData.append('creator', getStorage("userId"))
        formData.append('descriptions', descriptions);
        props.editDocument(documentId, formData, 'EDIT_VERSION');
        props.updateDocumentVersions({
            _id: versionId,
            versionName: versionName,
            issuingDate: convertISODate(issuingDate),
            effectiveDate: convertISODate(effectiveDate),
            expiredDate: convertISODate(expiredDate),
            file: documentFile,
            scannedFileOfSignedDocument: documentFileScan,
        })
    }
    useEffect(() => {
        setState({
            ...state,
            documentId: props.documentId,
            versionId: props.versionId,
            versionName: props.versionName,
            issuingDate: props.issuingDate,
            effectiveDate: props.effectiveDate,
            expiredDate: props.expiredDate,
            documentFile: props.documentFile,
            documentFileScan: props.documentFileScan,

        })
    }, [props.versionId || props.documentId])

    const { translate } = props;
    const { versionId, versionName, issuingDate, effectiveDate, expiredDate,documentFile,documentFileScan } = state;
    return (
        <DialogModal
            size="25"
            modalID="modal-edit-document-version"
            formID="form-edit-document-version"
            title={translate('document.edit')}
            func={save}
            disableSubmit={!isValidateForm()}
        >
            <React.Fragment>
                <div className={`form-group `}>
                    <label>{translate('document.doc_version.name')}<span className="text-red">*</span></label>
                    <input type="text" onChange={handleChangeVersionName} value={versionName} className="form-control" />
                </div>
                <div className="form-group">
                    <label>{translate('document.upload_file')}</label>
                    <UploadFile files ={documentFile} onChange={handleUploadFile} />

                </div>
                <div className="form-group">
                    <label>{translate('document.upload_file_scan')}</label>
                    <UploadFile files={documentFileScan} onChange={handleUploadFileScan} />

                </div>
                <div className="form-group">
                    <label>{translate('document.doc_version.issuing_date')}</label>
                    <DatePicker
                        id={`document-edit-version-issuing-date-${versionId}`}
                        value={formatDate(issuingDate)}
                        onChange={handleIssuingDate}
                    />
                </div>
                <div className="form-group">
                    <label>{translate('document.doc_version.effective_date')}</label>
                    <DatePicker
                        id={`document-edit-version-effective-date-${versionId}`}
                        value={formatDate(effectiveDate)}
                        onChange={handleEffectiveDate}
                    />
                </div>
                <div className="form-group">
                    <label>{translate('document.doc_version.expired_date')}</label>
                    <DatePicker
                        id={`document-edit-version-expired-date-${versionId}`}
                        value={formatDate(expiredDate)}
                        onChange={handleExpiredDate}
                    />
                </div>
            </React.Fragment>
        </DialogModal>
    )

}
const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocument: DocumentActions.editDocument,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(React.memo(EditVersion,areEqual)));

