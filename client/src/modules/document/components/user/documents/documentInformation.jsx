import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, DateTimeConverter, SelectBox, DatePicker } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import EditVersion from '../../administration/list-data/editVersion';
import moment from 'moment'

function DocumentInformation(props) {

    const [state, setState] = useState({
        documentId: ""
    })

    function handleUploadFile(e) {
        setState({
            ...state,
            documentFile: e.target.files[0]
        });
    }

    function handleUploadFileScan(e) {
        setState({
            ...state,
            documentFileScan: e.target.files[0]
        });
    }
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
    useEffect(() => {
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
            documentRelationshipDocuments: props.documentRelationshipDocuments,

            documentRoles: props.documentRoles,
            documentUserCanView: props.documentUserCanView,

            documentArchivedRecordPlaceInfo: props.documentArchivedRecordPlaceInfo,
            documentArchivedRecordPlaceOrganizationalUnit: props.documentArchivedRecordPlaceOrganizationalUnit,
            documentArchivedRecordPlaceManager: props.documentArchivedRecordPlaceManager
        })
    }, [props.documentId])

    function requestDownloadDocumentFile(id, fileName, numberVersion) {
        props.downloadDocumentFile(id, fileName, numberVersion);
    }

    function requestDownloadDocumentFileScan(id, fileName, numberVersion) {
        props.downloadDocumentFileScan(id, fileName, numberVersion);
    }

    const findDocumentRole = (roles, arr_id) => {
        if (arr_id) {
            let data = arr_id.map(id => {
                let name = roles.filter(role => id && id === role.value);
                return name.map(x => x.text);
            })
            return data;
        }
    }

    const findUser = (users, arr_id) => {
        if (arr_id) {
            let data = arr_id.map(id => {
                let name = users.filter(user => id && id === user.value);
                return name.map(x => x.text);
            })
            return data;
        }

    }



    const {
        documentId, documentName, documentDescription, documentCategory, documentDomains,
        documentIssuingBody, documentOfficialNumber, documentSigner, documentVersions,
        documentRelationshipDescription, documentRelationshipDocuments,
        documentRoles, documentArchives, documentUserCanView,
        documentArchivedRecordPlaceOrganizationalUnit, currentVersion,
    } = state;
    const { translate, role, documents, department, user, documentLogs } = props;
    const roleList = role.list.map(role => { return { value: role._id, text: role.name } });
    const userList = user.list.map(role => { return { value: role._id, text: role.name } });
    const relationshipDocs = documents.administration.data.list.filter(doc => doc._id !== documentId).map(doc => { return { value: doc._id, text: doc.name } })
    let roles = findDocumentRole(roleList, documentRoles);

    let logs = documentLogs.reverse();
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-information-user-document"
                formID="form-information-user-document"
                title={translate('document.information')}
                hasSaveButton={false}
                bodyStyle={{ padding: "0px" }}
                size={100}
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
                    />
                }
                <div className="row row-equal-height" style={{ margin: "0px", height: "100%", backgroundColor: "#fff" }}>
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7" style={{ paddingTop: "10px" }}>
                        <div className="collapse in">
                            <div className="description-box">
                                <h4 className="scheduler-border">{translate('document.infomation_docs')}</h4>
                                <div className="row">
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.name')}&emsp; </strong>
                                        {documentName}
                                    </div>
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.doc_version.issuing_body')}&emsp; </strong>
                                        {documentIssuingBody ? documentIssuingBody : translate('general.no_data')}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.doc_version.official_number')}&emsp; </strong>
                                        {documentOfficialNumber ? documentOfficialNumber : translate('general.no_data')}
                                    </div>
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.doc_version.signer')}&emsp; </strong>
                                        {documentSigner ? documentSigner : translate('general.no_data')}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.category')}&emsp; </strong>
                                        {documentCategory ? documentCategory : translate('general.no_data')}
                                    </div>
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.domain')}&emsp; </strong>
                                        {documentDomains ? documentDomains.map(y =>
                                            <div>{y}</div>
                                        ) : translate('general.no_data')}
                                    </div>
                                    <div className="for{ translate('document.description') }m-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.description')}&emsp; </strong>
                                        {documentDescription ? documentDescription : translate('general.no_data')}
                                    </div>
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>Lưu trữ&emsp; </strong>
                                        {documentArchives ? documentArchives.map(y =>
                                            <div>{y}</div>
                                        ) : translate('general.no_data')}
                                    </div>
                                </div>
                            </div>

                            <div className="description-box">
                                <h4 className="scheduler-border">{translate('document.doc_version.title')}</h4>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <table className="table table-hover table-striped table-bordered" id="table-document-version">
                                            <thead>
                                                <tr>
                                                    <th>{translate('document.version')}</th>
                                                    <th>{translate('document.issuing_date')}</th>
                                                    <th>{translate('document.effective_date')}</th>
                                                    <th>{translate('document.expired_date')}</th>
                                                    <th>{translate('document.upload_file')}</th>
                                                    <th>{translate('document.upload_file_scan')}</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    documentVersions && documentVersions.length > 0 ?
                                                        documentVersions.map((version, i) => {
                                                            return <tr key={i}>
                                                                <td>{version.versionName}</td>
                                                                <td>{version.issuingDate ? formatDate(version.issuingDate) : null}</td>
                                                                <td>{version.effectiveDate ? formatDate(version.effectiveDate) : null}</td>
                                                                <td>{version.expiredDate ? formatDate(version.expiredDate) : null}</td>
                                                                <td><a href="#" onClick={() => requestDownloadDocumentFile(documentId, documentName, i)}><u>{version.file ? translate('document.download') : ""}</u></a></td>
                                                                <td><a href="#" onClick={() => requestDownloadDocumentFileScan(documentId, "SCAN_" + documentName, i)}><u>{version.scannedFileOfSignedDocument ? translate('document.download') : ""}</u></a></td>

                                                            </tr>
                                                        }) : <tr><td colSpan={7}>{translate('document.no_version')}</td></tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="description-box">
                                <h4 className="scheduler-border">{translate('document.relationship.title')}</h4>
                                <div className="row">
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.relationship.description')}&emsp; </strong>
                                        {documentRelationshipDescription ? documentRelationshipDescription : translate('general.no_data')}
                                    </div>

                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.relationship.list')}&emsp; </strong>
                                        {documentRelationshipDocuments && documentRelationshipDocuments.length ? documentRelationshipDocuments.map(y =>
                                            <div>{y}</div>
                                        ) : translate('general.no_data')}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.roles')}&emsp; </strong>
                                        {roles && roles.length ? roles.map(y =>
                                            <div>{y[0]}</div>
                                        ) : translate('general.no_data')}
                                    </div>


                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.store.organizational_unit_manage')}&emsp; </strong>
                                        {documentArchivedRecordPlaceOrganizationalUnit ? documentArchivedRecordPlaceOrganizationalUnit.name : translate('general.no_data')}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-lg-12 col-md-12 col-ms-12 col-xs-12">
                                        <strong>{translate('document.users')}&emsp; </strong>
                                        {documentUserCanView && documentUserCanView.length ? documentUserCanView.map(y =>
                                            <div key={y._id}>{y.name}</div>
                                        ) : translate('general.no_data')}
                                    </div>



                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5" style={{ borderLeft: "1px solid #f4f4f4" }}>
                        <div className="description-box without-border">
                            <h4 className="scheduler-border">Lịch sử chỉnh sửa</h4>
                            {documentLogs && documentLogs.map(item =>
                                <div key={item._id} className="item-box">
                                    <a style={{ fontWeight: 700, cursor: "pointer" }}>{item.creator?.name} </a>
                                    {item.title ? item.title : translate("task.task_perform.none_description")}&nbsp;
                                    ({moment(item.createdAt).format("HH:mm:ss DD/MM/YYYY")})
                                    <div>
                                        {item.description ? item.description : translate("task.task_perform.none_description")}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocument: DocumentActions.editDocument,
    downloadDocumentFile: DocumentActions.downloadDocumentFile,
    downloadDocumentFileScan: DocumentActions.downloadDocumentFileScan
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DocumentInformation));