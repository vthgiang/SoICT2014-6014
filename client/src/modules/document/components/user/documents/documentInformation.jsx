import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, DateTimeConverter, SelectBox, DatePicker } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import moment from 'moment';
import { LOCAL_SERVER_API } from '../../../../../env';

class DocumentInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    save = () => {
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
            documentRelationshipDocuments,

            documentRoles,

            documentArchivedRecordPlaceInfo,
            documentArchivedRecordPlaceOrganizationalUnit,
            documentArchivedRecordPlaceManager,
        } = this.state;

        const formData = new FormData();
        formData.append('name', documentName);
        formData.append('category', documentCategory);
        if (documentDomains !== undefined) for (var i = 0; i < documentDomains.length; i++) {
            formData.append('domains[]', documentDomains[i]);
        }
        if (documentArchives !== undefined) for (var i = 0; i < documentArchives.length; i++) {
            formData.append('archives[]', documentArchives[i]);
        }
        formData.append('description', documentDescription);
        formData.append('issuingBody', documentIssuingBody);
        formData.append('officialNumber', documentOfficialNumber);
        formData.append('signer', documentSigner);

        formData.append('relationshipDescription', documentRelationshipDescription);
        if (documentRelationshipDocuments !== undefined) for (var i = 0; i < documentRelationshipDocuments.length; i++) {
            formData.append('relationshipDocuments[]', documentRelationshipDocuments[i]);
        }
        if (documentRoles !== undefined) for (var i = 0; i < documentRoles.length; i++) {
            formData.append('roles[]', documentRoles[i]);
        }

        formData.append('archivedRecordPlaceInfo', documentArchivedRecordPlaceInfo);
        formData.append('archivedRecordPlaceOrganizationalUnit', documentArchivedRecordPlaceOrganizationalUnit);
        formData.append('archivedRecordPlaceManager', documentArchivedRecordPlaceManager);

        this.props.editDocument(documentId, formData);
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
        console.log('hihihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', roles, arr_id)
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
            documentArchivedRecordPlaceInfo, documentArchivedRecordPlaceOrganizationalUnit, documentArchivedRecordPlaceManager
        } = this.state;
        const { translate, role, documents, department, user } = this.props;
        const categories = documents.administration.categories.list.map(category => { return { value: category._id, text: category.name } });
        const domains = documents.administration.domains.list.map(domain => { return { value: domain._id, text: domain.name } });
        const roleList = role.list.map(role => { return { value: role._id, text: role.name } });
        const relationshipDocs = documents.administration.data.list.filter(doc => doc._id !== documentId).map(doc => { return { value: doc._id, text: doc.name } })
        let roles = this.findDocumentRole(roleList, documentRoles);
        let category = categories.filter(category => category.value === documentCategory)[0];
        let domain = domains.filter(domain => domain.value === documentDomains[0])[0];
        console.log('111111111111111', documentRelationshipDocuments)
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-information-user-document"
                    formID="form-information-user-document"
                    title={translate('document.information')}
                    hasSaveButton={false}
                >
                    <form id="form-information-user-document">
                        <fieldset className="scheduler-border">
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
                                    {category ? category.text : null}
                                </div>
                                <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                    <strong>{translate('document.domain')}&emsp; </strong>
                                    {domain ? domain.text : null}
                                </div>
                                <div className="for{ translate('document.description') }m-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                    <strong>{translate('document.description')}&emsp; </strong>
                                    {documentDescription}
                                </div>
                            </div>

                        </fieldset>
                        <fieldset className="scheduler-border">
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
                                                            <td><a href="#" onClick={() => this.requestDownloadDocumentFile(documentId, documentName, i)}><u>{translate('document.download')}</u></a></td>
                                                            <td><a href="#" onClick={() => this.requestDownloadDocumentFileScan(documentId, "SCAN_" + documentName, i)}><u>{translate('document.download')}</u></a></td>
                                                        </tr>
                                                    }) : <tr><td colSpan={7}>{translate('document.no_version')}</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('document.relationship.title')}</legend>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('document.relationship.description')}&emsp; </strong>
                                {documentRelationshipDescription}
                            </div>

                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('document.relationship.list')}&emsp; </strong>
                                {documentRelationshipDocuments}
                            </div>


                            {/* <div className="form-group">
                                <label>{ translate('document.relationship.list') }<span className="text-red">*</span></label>
                                <SelectBox
                                    id="select-edit-documents-user-relationship-to-document"
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {relationshipDocs}
                                    value={documentRelationshipDocuments}
                                    multiple={true}
                                    disabled={true}
                                />
                            </div> */}
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('document.roles')}</legend>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('document.roles')}&emsp; </strong>
                                {roles ? roles.map(y =>
                                    <div>{y[0]}</div>
                                ) : null}
                            </div>
                            {/* <SelectBox
                                id={`select-edit-user-document-users-see-permission-${documentId}`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {roleList}
                                value={documentRoles}
                                multiple={true}
                                disabled={true}
                            /> */}
                        </fieldset>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('document.store.title')}</legend>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('document.store.information')}&emsp; </strong>
                                {documentArchivedRecordPlaceInfo}
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('document.store.organizational_unit_manage')}&emsp; </strong>
                                {documentArchivedRecordPlaceOrganizationalUnit}
                            </div>

                            {/* <div className="form-group">
                                <label>{ translate('document.store.organizational_unit_manage') }<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`select-edit-user-documents-organizational-unit-manage${documentId}`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {department.list.map(organ => {return {value: organ._id, text: organ.name}})}
                                    value={documentArchivedRecordPlaceOrganizationalUnit}
                                    multiple={false}
                                    disabled={true}
                                />
                            </div> */}
                        </fieldset>
                    </form>
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