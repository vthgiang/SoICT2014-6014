import React, { Component, useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { DialogModal, ButtonModal, DateTimeConverter, SelectBox, DatePicker, TreeSelect, ErrorLabel, UploadFile } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import moment from 'moment';
import { getStorage } from "../../../../../config";
import EditVersion from "./editVersion";

function areEqual(prevProps, nextProps) {
    if (prevProps.documentId === nextProps.documentId && prevProps.documentVersions.length === nextProps.documentVersions.length ){
        return true
    } else {
        return false
    }
}
function EditForm(props) {
    function handleName(e) {
        const value = e.target.value;
        validateName(value, true)
    }

    function handleCategory(value){
        validateCategory(value[0], true);
    }

    function handleDomains(value) {
        setState({
            ...state,
            documentDomains: value
        });
    }
    function handleArchives(value) {
        setState({
            ...state,
            documentArchives: value
        });
    }

    function handleDescription(e) {
        const { value } = e.target;
        setState({
            ...state,
            documentDescription: value
        });
    }

    function handleIssuingBody(e) {
        const value = e.target.value;
        setState({
            ...state,
            documentIssuingBody: value,
        })
    }
    function handleOfficialNumber(e) {
        const value = e.target.value.trim();
        validateOfficialNumber(value, true);
    }

    function handleSigner(e) {
        const value = e.target.value;
        setState({
            ...state,
            documentSigner: value,
        })
    }
    function handleRelationshipDescription(e) {
        const { value } = e.target;
        setState({
            ...state,
            documentRelationshipDescription: value
        });
    }
    function handleChangeVersionName(e) {
        const value = e.target.value;
        validateVersionName(value, true)
    }
    function handleRelationshipDocuments(value) {
        setState({
            ...state,
            relatedDocuments: value
        });
    }

    function handleRoles(value) {
        setState({
            ...state,
            documentRoles: value
        });
    }
    function handleUserCanView(value) {
        setState({
            ...state,
            documentUserCanView: value
        });
    }


    function handleArchivedRecordPlaceOrganizationalUnit(value) {
        setState({
            ...state,
            documentArchivedRecordPlaceOrganizationalUnit: value[0]
        });
    }

    function handleVersionName(e) {
        const value = e.target.value;
        setState({
            ...state,
            documentVersionName: value,
        })
    }
    function handleArchivedRecordPlaceManager(e) {
        const { value } = e.target;
        setState({
            ...state,
            documentArchivedRecordPlace: {
                ...state.documentArchivedRecordPlace,
                manager: value
            }
        });
    }

    function handleVersionName(e) {
        const value = e.target.value;
        setState({
            ...state,
            documentVersionName: value,
        })
    }

    function handleIssuingDate(value) {
        setState({
            ...state,
            documentIssuingDate: value,
        })
    }

    function handleEffectiveDate(value) {
        setState({
            ...state,
            documentEffectiveDate: value,
        })
    }

    function handleExpiredDate(value) {
        setState({
            ...state,
            documentExpiredDate: value,
        })
    }
    function handleUploadFile(file) {
        file = file.map(x => {
            return {
                fileName: x.fileName,
                url: x.urlFile,
                fileUpload: x.fileUpload
            }
        })
        
        if (JSON.stringify(state.documentFile) !== JSON.stringify(file)) {
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
        if (JSON.stringify(state.documentFileScan) !== JSON.stringify(file)) {
            setState({
                ...state,
                documentFileScan: file
            });
        }
    }


    const validateName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('document.no_blank_name');
        }
        if (willUpdateState) {
            setState({
                ...state,
                documentName: value,
                errorName: msg,
            })
        }
        return msg === undefined;
    }


    const validateCategory=(value, willUpdateState)=>{
        let msg = undefined;
        if (!value) {
            msg = translate('document.doc_version.no_blank_category');
        }
        if (willUpdateState) {
            setState({
                ...state,
                documentCategory: value,
                errorCategory: msg,
            })
        }
        return msg === undefined;
    }
    const validateVersionName = (value, willUpdateState) => {
        let msg = undefined;
        let val = value.trim();
        if (!val) {
            msg = translate('document.doc_version.no_blank_version_name');
        }
        if (willUpdateState) {
            setState({
                ...state,
                documentVersionName: value,
                errorVersionName: msg,
            })
        }
        return msg === undefined;
    }
    const validateOfficialNumber = (value, willUpdateState) => {
        let msg = undefined;
        if (!value) {
            msg = translate('document.doc_version.no_blank_official_number');
        }

        if (willUpdateState) {
            setState({
                ...state,
                documentOfficialNumber: value,
                errorOfficialNumber: msg,
            })
        }
        return msg === undefined;
    }


    const isValidateForm = () => {
        return validateName(documentName, false)
            && validateCategory(documentCategory, false)
            && validateOfficialNumber(documentOfficialNumber, false)

    }
    const isValidateFormAddVersion = () => {
        return validateVersionName(state.documentVersionName, false);
    }
    const compareArray = (array1, array2) => {
        if (array1 && array2) {
            if (array1.length !== array2.length) {
                return false;
            }
            else {
                for (let i = 0; i < array1.length; i++) {
                    if (array1[i] !== array2[i]) {
                        return false;
                    }
                }
                return true;
            }
        }
    }

    function save(){
        const {
            documentId,
            documentName,
            documentCategory,
            documentDomains,
            documentArchives,
            documentDescription,
            documentIssuingBody,
            documentOfficialNumber,
            documentSigner,
            documentRelationshipDescription,
            relatedDocuments,
            documentRoles,
            documentUserCanView,
            documentArchivedRecordPlaceOrganizationalUnit,
        } = state;
        const { role, documents, department, user } = props;
        const categories = documents.administration.categories.list.map(category => { return { value: category._id, text: category.name } });
        const { list } = documents.administration.domains;
        const roleList = role.list.map(role => { return { value: role._id, text: role.name } });
        const userList = user.list.map(user => { return { value: user._id, text: `${user.name} - ${user.email}` } });
        const relationshipDocs = documents.administration.data.list
        const archives = documents.administration.archives.list;
        let title = "";
        let description = "";
        const formData = new FormData();
        formData.append('name', documentName);
        if (documentName !== props.documentName) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + " Chỉnh sửa thông tin văn bản ");
            }
            description += "Thay đổi tên: " + documentName + ". ";
        }
        if (!compareArray(documentCategory, props.documentCategory)) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + "Chỉnh sửa thông tin văn bản.");
            }

            let nameCategory = categories.filter(item => item.value === documentCategory)
            description += "Thay đổi loại tài liệu: " + nameCategory[0].text + ". ";
            formData.append('category', documentCategory);
        }
        if (!compareArray(documentDomains, props.documentDomains)) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + " Chỉnh sửa thông tin văn bản");
            }

            description += "Lĩnh vực  mới: ";
            let newDomain = [];
            for (let i = 0; i < documentDomains.length; i++) {
                formData.append('domains[]', documentDomains[i]);
                let domain = list.filter(item => item.id === documentDomains[i]);
                newDomain.push(domain[0].name);

            }
            description += newDomain.join(" ") + ". ";
        }
        if (!compareArray(documentArchives, props.documentArchives)) {

            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + " Chỉnh sửa thông tin văn bản");
            }
            description += "Địa chỉ lưu trữ mới: ";
            let newArchives = [];
            for (let i = 0; i < documentArchives.length; i++) {
                formData.append('archives[]', documentArchives[i]);
                let archive = archives.filter(item => item.id === documentArchives[i]);
                newArchives.push(archive[0].name);
            }
            description += newArchives.join(" ") + ". ";
        }
        if (documentDescription !== props.documentDescription) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + "Chỉnh sửa thông tin văn bản.");
            }
            description += "Mô tả mới: " + documentDescription + ". ";
            formData.append('description', documentDescription);
        }
        if (documentIssuingBody !== props.documentIssuingBody) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + "Chỉnh sửa thông tin văn bản.");
            }
            description += "Cơ quan ban hành mới: " + documentIssuingBody + ". ";
            formData.append('issuingBody', documentIssuingBody);
        }
        if (documentOfficialNumber !== props.documentOfficialNumber) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + "Chỉnh sửa thông tin văn bản.");
            }
            description += "Số hiệu mới: " + documentOfficialNumber + ". ";
            formData.append('officialNumber', documentOfficialNumber);
        }
        if (documentSigner !== props.documentSigner) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + "Chỉnh sửa thông tin văn bản.");
            }
            description += "Người ký mới: " + documentSigner + ". ";
            formData.append('signer', documentSigner);
        }

        if (documentRelationshipDescription !== props.documentRelationshipDescription) {
            if (!title.includes("Chỉnh sửa tài liệu liên kết")) {
                title += "Chỉnh sửa tài liệu liên kết."
            }
            description += "Mô tả liên kết tài liệu mới: ";
            formData.append('relationshipDescription', documentRelationshipDescription);
        }
        if (!compareArray(relatedDocuments, props.documentRelationshipDocuments)) {
            if (!title.includes("Chỉnh sửa mô tả liên kết.")) {
                title += "Chỉnh sửa mô tả liên kết."
            }
            description += "Tài liệu liên kết mới: "
            let newArray = [];
            for (let i = 0; i < relatedDocuments.length; i++) {
                formData.append('relationshipDocuments[]', relatedDocuments[i]);
                let relationship = relationshipDocs.filter(item => item.id === relatedDocuments[i]);
                newArray.push(relationship[0].name);

            }
            description += newArray.join(" - ") + ".";
        }
        if (documentRoles !== props.documentRoles) {
            if (!title.includes("Chỉnh sửa phân quyền")) {
                title += "Chỉnh sửa phân quyền. "
            }
            description += "Các phân quyền mới: "
            for (let i = 0; i < documentRoles.length; i++) {
                formData.append('roles[]', documentRoles[i]);
                let nameRole = roleList.filter(item => item.value === documentRoles[i])
                description += nameRole[0].text + " ";
            }
        }
        if (documentUserCanView !== props.documentUserCanView) {
            if (!title.includes("Chỉnh sửa phân quyền người xem")) {
                title += "Chỉnh sửa phân quyền người xem. "
            }
            description += "Các phân quyền người xem mới: "
            for (let i = 0; i < documentUserCanView.length; i++) {
                formData.append('roles[]', documentUserCanView[i]);
                let nameRole = userList.filter(item => item.value === documentUserCanView[i])
                description += nameRole[0].text + " ";
            }
        }
        if (documentArchivedRecordPlaceOrganizationalUnit !== props.documentArchivedRecordPlaceOrganizationalUnit) {
            if (!title.includes("Chỉnh sửa đơn vị quản lí")) {
                title += "Chỉnh sửa đơn vị quản lí"
            }
            let newDepartment;
            newDepartment = department.list.filter(d => d._id === documentArchivedRecordPlaceOrganizationalUnit)
            description += "Đơn vị quản lí mới " + newDepartment[0].name + ". "
            formData.append('archivedRecordPlaceOrganizationalUnit', documentArchivedRecordPlaceOrganizationalUnit);
        }

        if (title) {
            formData.append('title', title);
            formData.append('creator', getStorage("userId"))
        }
        if (description) {
            formData.append('descriptions', description)
        }
        if (title) {
            props.editDocument(documentId, formData);
        }
    }
    const toggleEditVersion = async (data) => {
        await setState({
            ...state,
            currentVersion: data
        });
        window.$('#modal-edit-document-version').modal('show');
    }

    const addNewVersion = id => {
        const {
            documentVersionName,
            documentIssuingDate,
            documentEffectiveDate,
            documentExpiredDate,
            documentFile,
            documentFileScan
        } = state;
        let title, descriptions;
        title = "Thêm phiên bản mới";
        const formData = new FormData();
        if (documentVersionName) {
            formData.append('versionName', documentVersionName);
            descriptions = "Tên phiên bản mới: " + documentVersionName + ". ";
        }
        if (documentIssuingDate) {
            descriptions += "Ngày ban hành " + moment(documentIssuingDate, "DD-MM-YYYY") + ". ";
            formData.append('issuingDate', moment(documentIssuingDate, "DD-MM-YYYY"));
        }
        if (documentEffectiveDate) {
            descriptions += "Ngày hiệu lực " + moment(documentEffectiveDate, "DD-MM-YYYY") + ". ";
            formData.append('effectiveDate', moment(documentEffectiveDate, "DD-MM-YYYY"));
        }
        if (documentExpiredDate) {
            descriptions += "Ngày hết hạn" + + moment(documentExpiredDate, "DD-MM-YYYY") + ". ";
            formData.append('expiredDate', moment(documentExpiredDate, "DD-MM-YYYY"));
        }
        if (documentFile) {
            descriptions += "Thêm file tài liệu. "
            documentFile.forEach(x => {
                formData.append('file', x.fileUpload);
            })
        }
        if (documentFileScan) {
            descriptions += "Thêm file scan tài liệu";
            documentFileScan.forEach(x => {
                formData.append('fileScan', x.fileUpload);
            })
        }

        formData.append('title', title);
        formData.append('creator', getStorage("userId"))
        formData.append('descriptions', descriptions)
        props.editDocument(id, formData, 'ADD_VERSION');

    }
    useEffect(() => {
        if (props.documentId!==state.documentId){
            setState({
                ...state,
                documentId: props.documentId,
                documentName: props.documentName,
                documentDescription: props.documentDescription,
                documentCategory: props.documentCategory,
                documentDomains: props.documentDomains,
                documentArchives: props.documentArchives,
                documentIssuingBody: props.documentIssuingBody,
                documentOfficialNumber: props.documentOfficialNumber,
                documentSigner: props.documentSigner,
    
                documentVersions: props.documentVersions,
    
                documentRelationshipDescription: props.documentRelationshipDescription,
                relatedDocuments: props.documentRelationshipDocuments.map(item => item.id),
    
                documentRoles: props.documentRoles,
                documentUserCanView: props.documentUserCanView,
    
                documentArchivedRecordPlaceInfo: props.documentArchivedRecordPlaceInfo,
                documentArchivedRecordPlaceOrganizationalUnit: props.documentArchivedRecordPlaceOrganizationalUnit,
                documentArchivedRecordPlaceManager: props.documentArchivedRecordPlaceManager,
    
                errorName: undefined,
            })
        } else {
            if (props.documentVersions.length!==state.documentVersions.length){
                setState({
                    ...state,
                    documentVersions: props.documentVersions
                })
            }
        }
    }, [props.documentId,props.documentVersions.length])
    

    function requestDownloadDocumentFile(id, fileName, numberVersion) {
        props.downloadDocumentFile(id, fileName, numberVersion);
    }

    function requestDownloadDocumentFileScan(id, fileName, numberVersion) {
        props.downloadDocumentFileScan(id, fileName, numberVersion);
    }
    const findPath = (archives, select) => {
        let paths = select.map(s => {
            let archive = archives.filter(arch => arch._id === s);
            return archive[0] ? archive[0].path : "";
        })
        return paths;

    }
    const deleteDocumentVersion = (documentId, versionId, info) => {
        const { translate } = props;
        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('document.delete')}</div> <div>"${info}" ?</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                let title = "Xóa phiên bản ";
                let descriptions = "Xoá phiên bản " + info;
                props.editDocument(documentId, {
                    title: title,
                    descriptions: descriptions,
                    versionId: versionId,
                    creator: getStorage("userId"),
                }, 'DELETE_VERSION');
            }
        })
    }
    const onSearch = async (name) => {
        await props.getAllDocuments({ page: state.page, limit: state.limit, name: name, calledId: "relationshipDocs" });
    }

    const updateDocumentVersions = async (version) => {
        let { documentVersions } = state;
        for (let i in documentVersions) {
            if (documentVersions[i]._id === version._id) {
                documentVersions[i] = version
            }
        }

        setState({
            ...state,
            documentVersions: documentVersions
        });
    }
    const formatDate = (date, monthYear = false) => {
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
    const [state, setState] = useState({
        documentVersionName: "",
        page: 1,
        limit: 5,
        documentCategory:""
    })
    const {
        documentId, documentName, documentDescription, documentCategory, documentDomains,
        documentIssuingBody, documentOfficialNumber, documentSigner, documentVersions,
        documentRelationshipDescription, relatedDocuments,
        documentRoles, documentArchives, documentUserCanView,
        documentArchivedRecordPlaceOrganizationalUnit, currentVersion, errorOfficialNumber
    } = state;
    const version= useSelector(state=>state)
    const { errorName } = state;
    const { translate, role, documents, department, documentRelationshipDocuments, user } = props;
    const categories = documents.administration.categories.list.map(category => { return { value: category._id, text: category.name } });
    const { list } = documents.administration.domains;
    const roleList = role.list.map(role => { return { value: role._id, text: role.name } });

    let tmpMap = {};
    let relationshipDocs = documents.administration.relationshipDocs.paginate.map(
        doc => {
            tmpMap[doc._id] = true;
            return { value: doc._id, text: doc.name }
        }
    );
    documentRelationshipDocuments.forEach(doc => {
        if (!tmpMap[doc._id]) {
            relationshipDocs.push({ value: doc._id, text: doc.name })
        }
    });
    const archives = documents.administration.archives.list;
    let path = documentArchives ? findPath(archives, documentArchives) : "";
    return (
        <React.Fragment>
            <DialogModal
                size="100"
                modalID="modal-edit-document"
                formID="form-edit-document"
                title={translate('document.edit')}
                func={save}
                disableSubmit={!isValidateForm()}
            >
                {
                    currentVersion &&
                    <EditVersion
                        documentId={documentId}
                        versionId={currentVersion._id}
                        versionName={currentVersion.versionName}
                        issuingDate={currentVersion.issuingDate}
                        effectiveDate={currentVersion.effectiveDate}
                        expiredDate={currentVersion.expiredDate}
                        documentFile={currentVersion.documentFile}
                        documentFileScan={currentVersion.documentFileScan}

                        updateDocumentVersions={updateDocumentVersions}
                    />
                }
                <form id="form-edit-document">
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#doc-edit-info" data-toggle="tab">{translate('document.infomation_docs')}</a></li>
                            <li><a href="#doc-edit-sub-info" data-toggle="tab">{translate('document.relationship_role_store')}</a></li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane active" id="doc-edit-info">
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                                            <label>{translate('document.name')}<span className="text-red">*</span></label>
                                            <input type="text" className="form-control" onChange={handleName} value={documentName} />
                                            <ErrorLabel content={errorName} />
                                        </div>
                                        <div className={`form-group ${!errorOfficialNumber ? "" : "has-error"}`}>
                                            <label>{translate('document.doc_version.official_number')}<span className="text-red">*</span></label>
                                            <input type="text" className="form-control" onChange={handleOfficialNumber} value={documentOfficialNumber} />
                                            <ErrorLabel content={errorOfficialNumber} />
                                        </div>
                                        <div className="form-group">
                                            <label>{translate('document.doc_version.issuing_body')}</label>
                                            <input type="text" className="form-control" onChange={handleIssuingBody} value={documentIssuingBody} />
                                        </div>
                                        <div className="form-group">
                                            <label>{translate('document.doc_version.signer')}</label>
                                            <input type="text" className="form-control" onChange={handleSigner} value={documentSigner} />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label>{translate('document.category')}<span className="text-red">*</span></label>
                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id={`select-box-edit-document-category-${documentId}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={categories}
                                                value={documentCategory}
                                                onChange={handleCategory}
                                                multiple={false}
                                                options={{ placeholder: translate('document.administration.categories.select') }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{translate('document.domain')}</label>
                                            <TreeSelect
                                                data={list}
                                                value={documentDomains}
                                                handleChange={handleDomains}
                                                mode="hierarchical"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{translate('document.description')}</label>
                                            <textarea type="text" className="form-control" onChange={handleDescription} value={documentDescription ? documentDescription : ""} />
                                        </div>


                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <ButtonModal modalID="add-document-new-version" button_name={translate('general.add')} title={translate('document.add')} />
                                        <DialogModal
                                            modalID="add-document-new-version"
                                            formID="add-document-new-version"
                                            title={translate('document.add_version')}
                                            func={() => addNewVersion(documentId)}
                                            disableSubmit={!isValidateFormAddVersion()}
                                        >
                                            <React.Fragment>
                                                <div className={`form-group `}>
                                                    <label>{translate('document.doc_version.name')}<span className="text-red">*</span></label>
                                                    <input type="text" onChange={handleChangeVersionName} className="form-control" />
                                                </div>
                                                <div className="form-group">
                                                    <label>{translate('document.upload_file')}</label>
                                                    <UploadFile multiple={true} onChange={handleUploadFile} />
                                                </div>
                                                <div className="form-group">
                                                    <label>{translate('document.upload_file_scan')}</label>
                                                    <UploadFile multiple={true} onChange={handleUploadFileScan} />
                                                </div>
                                                <div className="form-group">
                                                    <label>{translate('document.doc_version.issuing_date')}</label>
                                                    <DatePicker
                                                        id={`document-edit-version-issuing-date-${documentId}`}
                                                        onChange={handleIssuingDate}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>{translate('document.doc_version.effective_date')}</label>
                                                    <DatePicker
                                                        id={`document-edit-version-effective-date-${documentId}`}
                                                        onChange={handleEffectiveDate}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>{translate('document.doc_version.expired_date')}</label>
                                                    <DatePicker
                                                        id={`document-edit-version-expired-date-${documentId}`}
                                                        onChange={handleExpiredDate}
                                                    />
                                                </div>
                                            </React.Fragment>
                                        </DialogModal>
                                        <table className="table table-hover table-striped table-bordered" id="table-document-version">
                                            <thead>
                                                <tr>
                                                    <th>{translate('document.version')}</th>
                                                    <th>{translate('document.issuing_date')}</th>
                                                    <th>{translate('document.effective_date')}</th>
                                                    <th>{translate('document.expired_date')}</th>
                                                    <th>{translate('document.doc_version.file')}</th>
                                                    <th>{translate('document.doc_version.scanned_file_of_signed_document')}</th>
                                                    <th style={{ width: '80px', textAlign: 'center' }}>
                                                        {translate('general.action')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    documentVersions !== undefined && documentVersions.length > 0 ?
                                                        documentVersions.map((version, i) => {
                                                            return <tr key={i}>
                                                                <td>{version.versionName}</td>
                                                                <td>{formatDate(version.issuingDate)}</td>
                                                                <td>{formatDate(version.effectiveDate)}</td>
                                                                <td>{formatDate(version.expiredDate)}</td>
                                                                <td>
                                                                    <a href="#" onClick={() => requestDownloadDocumentFile(documentId, documentName, i)}>
                                                                        <u>{version.file ? translate('document.download') : ""}</u>
                                                                    </a>
                                                                </td>
                                                                <td>
                                                                    <a href="#" onClick={() => requestDownloadDocumentFileScan(documentId, "SCAN_" + documentName, i)}>
                                                                        <u>{version.scannedFileOfSignedDocument ? translate('document.download') : ""}</u>
                                                                    </a>
                                                                </td>
                                                                <td>
                                                                    <a className="text-yellow" title={translate('document.edit')} onClick={() => toggleEditVersion(version)}>
                                                                        <i className="material-icons">edit</i>
                                                                    </a>
                                                                    <a className="text-red" title={translate('document.delete')} onClick={() => deleteDocumentVersion(documentId, version._id, version.versionName)}>
                                                                        <i className="material-icons">delete</i>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        }) : <tr><td colSpan={7}>{translate('document.no_version')}</td></tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="doc-edit-sub-info">
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label>{translate('document.relationship.description')}</label>
                                            <textarea type="text" style={{ height: 107 }} className="form-control" onChange={handleRelationshipDescription} value={documentRelationshipDescription} />
                                        </div>
                                        <div className="form-group">
                                            <label>{translate('document.relationship.list')}</label>
                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id="select-edit-documents-relationship-to-document"
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={relationshipDocs}
                                                onChange={handleRelationshipDocuments}
                                                value={relatedDocuments}
                                                multiple={true}
                                                onSearch={onSearch}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label>{translate('document.store.organizational_unit_manage')}</label>
                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id={`select-edit-documents-organizational-unit-manage${documentId}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={department.list.map(organ => { return { value: organ._id, text: organ.name } })}
                                                onChange={handleArchivedRecordPlaceOrganizationalUnit}
                                                value={documentArchivedRecordPlaceOrganizationalUnit}
                                                multiple={false}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{translate('document.roles')}</label>
                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id={`select-edit-document-users-see-permission-${documentId}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={roleList}
                                                value={documentRoles}
                                                onChange={handleRoles}
                                                multiple={true}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{translate('document.users')}</label>
                                            <SelectBox
                                                id={`select-edit-document-user-can-view`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={
                                                    user.list.map(user => { return { value: user ? user._id : null, text: user ? `${user.name} - ${user.email}` : "" } })
                                                }
                                                onChange={handleUserCanView}
                                                value={documentUserCanView}
                                                multiple={true}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{translate('document.store.information')}</label>
                                            <TreeSelect
                                                data={archives}
                                                value={documentArchives}
                                                handleChange={handleArchives}
                                                mode="hierarchical"
                                            />
                                            {path && path.length ? path.map((y, index) =>
                                                <div key={index}>{y}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments,
    editDocument: DocumentActions.editDocument,
    downloadDocumentFile: DocumentActions.downloadDocumentFile,
    downloadDocumentFileScan: DocumentActions.downloadDocumentFileScan
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(React.memo(EditForm,areEqual)));