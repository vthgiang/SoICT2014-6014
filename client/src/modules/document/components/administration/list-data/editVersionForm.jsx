import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, DatePicker, UploadFile } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import { getStorage } from "../../../../../config";

function EditVersionForm(props) {
    const [state, setState] = useState({})
    useEffect(() => {
        setState({
            ...state,
            index: props.index,
            versionName: props.versionName,
            issuingDate: props.issuingDate,
            effectiveDate: props.effectiveDate,
            expiredDate: props.expiredDate,
            documentFile: props.documentFile,
            // file: props.documentFile[0].file,
            // urlFile: props.documentFile[0].urlFile,
            // fileUpload: props.documentFile[0].fileUpload,
            documentFileScan:props.documentFileScan,
            // fileScan: props.documentFileScan[0].file,
            // urlFileScan: props.documentFileScan[0].urlFile,
            // fileScanUpload: props.documentFileScan[0].fileUpload,
        })
    }, [props.index])
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
    function handleUploadFile(file){
        file = file.map(x => {
            return {
                fileName: x.fileName,
                url: x.urlFile,
                fileUpload: x.fileUpload
            }
        })
        if (file.length===0){
            file=[{
                fileName:"",
                urlFile:"",
                fileUpload:""
            }]
        }
        if (JSON.stringify(state.documentFile) !== JSON.stringify(file) && JSON.stringify(file)!==JSON.stringify([])) {
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
        if (file.length===0){
            file=[{
                fileName:"",
                urlFile:"",
                fileUpload:""
            }]
        }
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
        if (isValidateForm()) {
            return props.handleChange(state);
        }
    }
    
    const { translate } = props;
    const { documentFile,documentFileScan,versionId, versionName, issuingDate, effectiveDate, expiredDate,
        file, urlFile, fileUpload, fileScan, urlFileScan, fileScanUpload } = state;

    let files, fileScans;
    if (documentFile){
        if (documentFile[0].fileName) {
            files = documentFile
        }
    }
    if (documentFileScan){
        if (documentFileScan[0].fileName) {
            fileScans = documentFileScan
        }
    }
    return (
        <DialogModal
            size="25"
            modalID="modal-edit-document-version-form"
            formID="form-edit-document-version-form"
            title={translate('document.edit')}
            func={save}
            disableSubmit={!isValidateForm()}
        >
            {/* <React.Fragment> */}
            <div className={`form-group `}>
                <label>{translate('document.doc_version.name')}<span className="text-red">*</span></label>
                <input type="text" onChange={handleChangeVersionName} value={versionName} className="form-control" />
            </div>
            <div className="form-group">
                <label>{translate('document.upload_file')}</label>
                <UploadFile files={files} onChange={handleUploadFile} />

            </div>
            <div className="form-group">
                <label>{translate('document.upload_file_scan')}</label>
                <UploadFile files={fileScans} onChange={handleUploadFileScan} />

            </div>
            <div className="form-group">
                <label>{translate('document.doc_version.issuing_date')}</label>
                <DatePicker
                    id={`document-edit-version-form-issuing-date-${versionId}`}
                    value={formatDate(issuingDate)}
                    onChange={handleIssuingDate}
                />
            </div>
            <div className="form-group">
                <label>{translate('document.doc_version.effective_date')}</label>
                <DatePicker
                    id={`document-edit-version-form-effective-date-${versionId}`}
                    value={formatDate(effectiveDate)}
                    onChange={handleEffectiveDate}
                />
            </div>
            <div className="form-group">
                <label>{translate('document.doc_version.expired_date')}</label>
                <DatePicker
                    id={`document-edit-version-form-expired-date-${versionId}`}
                    value={formatDate(expiredDate)}
                    onChange={handleExpiredDate}
                />
            </div>
            {/* </React.Fragment> */}
        </DialogModal>
    )

}
const mapStateToprops = state => state;



export default connect(mapStateToprops, null)(withTranslate(EditVersionForm));

