import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, DateTimeConverter, SelectBox, DatePicker } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import EditVersion from '../../administration/list-data/editVersion';
import moment from 'moment'

class DocumentInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }



    handleUploadFile = (e) => {
        this.setState({ documentFile: e.target.files[0] });
    }

    handleUploadFileScan = (e) => {
        this.setState({ documentFileScan: e.target.files[0] });
    }



    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.documentId !== prevState.documentId) {
            return {
                ...prevState,
                documentId: nextProps.documentId,
                documentName: nextProps.documentName,
                documentDescription: nextProps.documentDescription,
                documentCategory: nextProps.documentCategory,
                documentDomains: nextProps.documentDomains,
                documentArchives: nextProps.documentArchives,
                documentIssuingBody: nextProps.documentIssuingBody,
                documentOfficialNumber: nextProps.documentOfficialNumber,
                documentSigner: nextProps.documentSigner,

                documentVersions: nextProps.documentVersions,

                documentRelationshipDescription: nextProps.documentRelationshipDescription,
                documentRelationshipDocuments: nextProps.documentRelationshipDocuments,

                documentRoles: nextProps.documentRoles,

                documentArchivedRecordPlaceInfo: nextProps.documentArchivedRecordPlaceInfo,
                documentArchivedRecordPlaceOrganizationalUnit: nextProps.documentArchivedRecordPlaceOrganizationalUnit,
                documentArchivedRecordPlaceManager: nextProps.documentArchivedRecordPlaceManager,
            }
        } else if (nextProps.documentVersions.length > prevState.documentVersions.length) {
            return {
                ...prevState,
                documentId: nextProps.documentId,
                documentVersions: nextProps.documentVersions,
            }
        } else {
            return null;
        }
    }

    requestDownloadDocumentFile = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFile(id, fileName, numberVersion);
    }

    requestDownloadDocumentFileScan = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFileScan(id, fileName, numberVersion);
    }

    findDocumentRole(roles, arr_id) {
        let data = arr_id.map(id => {
            let name = roles.filter(role => id && id === role.value);
            return name.map(x => x.text);
        })
        return data;
    }



    render() {
        const {
            documentId, documentName, documentDescription, documentCategory, documentDomains,
            documentIssuingBody, documentOfficialNumber, documentSigner, documentVersions,
            documentRelationshipDescription, documentRelationshipDocuments,
            documentRoles, documentArchives,
            documentArchivedRecordPlaceInfo, documentArchivedRecordPlaceOrganizationalUnit, currentVersion,
        } = this.state;
        const { translate, role, documents, department, user, documentLogs } = this.props;
        const roleList = role.list.map(role => { return { value: role._id, text: role.name } });
        const relationshipDocs = documents.administration.data.list.filter(doc => doc._id !== documentId).map(doc => { return { value: doc._id, text: doc.name } })
        let roles = this.findDocumentRole(roleList, documentRoles);
        console.log('----------------', roles)
        //let logs = documentLogs.reverse();
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-information-user-document"
                    formID="form-information-user-document"
                    title={translate('document.information')}
                    hasSaveButton={false}
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
                                    <legend className="scheduler-border">{translate('document.infomation_docs')}</legend>
                                    <div className="row">
                                        <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                            <strong>{translate('document.name')}&emsp; </strong>
                                            {documentName}
                                        </div>
                                        <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                            <strong>{translate('document.doc_version.issuing_body')}&emsp; </strong>
                                            {documentIssuingBody}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                            <strong>{translate('document.doc_version.official_number')}&emsp; </strong>
                                            {documentOfficialNumber}
                                        </div>
                                        <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                            <strong>{translate('document.doc_version.signer')}&emsp; </strong>
                                            {documentSigner}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                            <strong>{translate('document.category')}&emsp; </strong>
                                            {documentCategory ? documentCategory : null}
                                        </div>
                                        <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                            <strong>{translate('document.domain')}&emsp; </strong>
                                            {documentDomains ? documentDomains.join(" ") : ""}
                                        </div>
                                        <div className="for{ translate('document.description') }m-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                            <strong>{translate('document.description')}&emsp; </strong>
                                            {documentDescription}
                                        </div>
                                        <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                            <strong>Lưu trữ&emsp; </strong>
                                            {documentArchives ? documentArchives.join(" ") : ""}
                                        </div>
                                    </div>
                                </div>

                                <div className="description-box">
                                    <legend className="scheduler-border">{translate('document.doc_version.title')}</legend>
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <table className="table table-hover table-striped table-bordered" id="table-document-version">
                                                <thead>
                                                    <tr>
                                                        <th>{translate('document.version')}</th>
                                                        <th>{translate('document.issuing_date')}</th>
                                                        <th>{translate('document.effective_date')}</th>
                                                        <th>{translate('document.expired_date')}</th>
                                                        <th>{translate('document.doc_version.file')}</th>
                                                        <th>{translate('document.doc_version.scanned_file_of_signed_document')}</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        documentVersions !== undefined && documentVersions.length > 0 ?
                                                            documentVersions.map((version, i) => {
                                                                return <tr key={i}>
                                                                    <td>{version.versionName}</td>
                                                                    <td><DateTimeConverter dateTime={version.issuingDate} type="DD-MM-YYYY" /></td>
                                                                    <td><DateTimeConverter dateTime={version.effectiveDate} type="DD-MM-YYYY" /></td>
                                                                    <td><DateTimeConverter dateTime={version.expiredDate} type="DD-MM-YYYY" /></td>
                                                                    <td><a href="#" onClick={() => this.requestDownloadDocumentFile(documentId, documentName, i)}><u>{version.file ? translate('document.download') : ""}</u></a></td>
                                                                    <td><a href="#" onClick={() => this.requestDownloadDocumentFileScan(documentId, "SCAN_" + documentName, i)}><u>{version.scannedFileOfSignedDocument ? translate('document.download') : ""}</u></a></td>

                                                                </tr>
                                                            }) : <tr><td colSpan={7}>{translate('document.no_version')}</td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="description-box">
                                    <legend className="scheduler-border">{translate('document.relationship.title')}</legend>
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.relationship.description')}&emsp; </strong>
                                        {documentRelationshipDescription}
                                    </div>

                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.relationship.list')}&emsp; </strong>
                                        {documentRelationshipDocuments ? documentRelationshipDocuments.join("-") : ""}
                                    </div>

                                </div>

                                <div className="description-box">
                                    <legend className="scheduler-border">{translate('document.roles')}</legend>
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.roles')}&emsp; </strong>
                                        {roles ? roles.map(y =>
                                            <div>{y[0]}</div>
                                        ) : null}
                                    </div>

                                </div>

                                <div className="description-box">
                                    <legend className="scheduler-border">{translate('document.store.title')}</legend>
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.store.information')}&emsp; </strong>
                                        {documentArchivedRecordPlaceInfo}
                                    </div>
                                    <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                        <strong>{translate('document.store.organizational_unit_manage')}&emsp; </strong>
                                        {documentArchivedRecordPlaceOrganizationalUnit ? documentArchivedRecordPlaceOrganizationalUnit.name : ""}
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5" style={{ padding: "10px 0 10px 0", borderLeft: "1px solid #f4f4f4" }}>
                            <div className="description-box">
                                <legend className="scheduler-border">Lịch sử chỉnh sửa</legend>
                                <div className="form-group col-lg-12 col-md-12 col-ms-12 col-xs-12">
                                    <div className="active tab-pane">
                                        {documentLogs && documentLogs.map(item =>
                                            <div key={item._id} className="item-box row">
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
                        </div>

                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocument: DocumentActions.editDocument,
    downloadDocumentFile: DocumentActions.downloadDocumentFile,
    downloadDocumentFileScan: DocumentActions.downloadDocumentFileScan
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DocumentInformation));