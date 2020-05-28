import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, DateTimeConverter, SelectBox, DatePicker } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import moment from 'moment';
import { LOCAL_SERVER_API } from '../../../../../env';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            documentName: value
        })
    }

    handleCategory = (value) => {
        this.setState({
            documentCategory: value[0]
        })
    }

    handleDomains = value => {
        this.setState({ documentDomains: value });
    }

    handleDescription = (e) => {
        const {value} = e.target;
        this.setState({documentDescription: value});
    }

    handleVersionName = (e) => {
        const {value} = e.target;
        this.setState({ documentVersionName: value });
    }

    handleIssuingBody = (e) => {
        const {value} = e.target;
        this.setState({ documentIssuingBody: value }); 
    }

    handleOfficialNumber = e => {
        const {value} = e.target;
        this.setState({documentOfficialNumber: value})
    }

    handleSigner = e => {
        const {value} = e.target;
        this.setState({ documentSigner: value })
    }

    handleIssuingDate = value => {
        this.setState({ documentIssuingDate: value });
    }

    handleEffectiveDate = value => {
        this.setState({ documentEffectiveDate: value});
    }

    handleExpiredDate = value => {
        this.setState({ documentExpiredDate: value});
    }

    handleRelationshipDescription = e => {
        const {value} = e.target;
        this.setState({ documentRelationshipDescription: value });
    }

    handleRelationshipDocuments = e => {
        const {value} = e.target;
        this.setState({ documentRelationshipDocuments: value });
    }

    handleRoles= value => {
        this.setState({ documentRoles: value });
    }

    handleArchivedRecordPlaceInformation = e => {
        const {value} = e.target;
        this.setState(state => {
            return {
                ...state,
                documentArchivedRecordPlace: {
                    ...state.documentArchivedRecordPlace,
                    information: value
                }
            }
        });
    }

    handleArchivedRecordPlaceOrganizationalUnit = e => {
        const {value} = e.target;
        this.setState(state => {
            return {
                ...state,
                documentArchivedRecordPlace: {
                    ...state.documentArchivedRecordPlace,
                    organizationalUnit: value
                }
            }
        });
    }

    handleArchivedRecordPlaceManager = e => {
        const {value} = e.target;
        this.setState(state => {
            return {
                ...state,
                documentArchivedRecordPlace: {
                    ...state.documentArchivedRecordPlace,
                    manager: value
                }
            }
        });
    }

    save = () => {
        const {
            documentId,
            documentName, 
            documentCategory,
            documentDomains,
            documentDescription,
            documentVersionName,
            documentIssuingBody,
            documentOfficialNumber,
            documentIssuingDate,
            documentEffectiveDate,
            documentExpiredDate,
            documentSigner,
            documentRelationshipDescription,
            documentRelationshipDocuments,
            documentRoles,
            documentArchivedRecordPlaceInfo,
            documentArchivedRecordPlaceOrganizationalUnit,
            documentArchivedRecordPlaceManager,
        } = this.state;
        this.props.editDocument(documentId, {
            name: documentName,
            category: documentCategory,
            domains: documentDomains,
            description: documentDescription,
            versionName: documentVersionName,
            issuingBody: documentIssuingBody,
            officialNumber: documentOfficialNumber,
            issuingDate: moment(documentIssuingDate, "DD-MM-YYYY"),
            effectiveDate: moment(documentEffectiveDate, "DD-MM-YYYY"),
            expiredDate: moment(documentExpiredDate, "DD-MM-YYYY"),
            signer: documentSigner,
            relationshipDescription: documentRelationshipDescription,
            relationshipDocuments: documentRelationshipDocuments,
            roles: documentRoles,
            
            archivedRecordPlaceInfo: documentArchivedRecordPlaceInfo,
            archivedRecordPlaceOrganizationalUnit: documentArchivedRecordPlaceOrganizationalUnit,
            archivedRecordPlaceManager: documentArchivedRecordPlaceManager
        });
    }

    
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.documentId !== prevState.documentId) {
            return {
                ...prevState,
                documentId: nextProps.documentId,
                documentName: nextProps.documentName,
                documentDescription: nextProps.documentDescription,
                documentCategory: nextProps.documentCategory,
                documentDomains: nextProps.documentDomains,

                documentVersionName: nextProps.documentVersionName,
                documentIssuingBody: nextProps.documentIssuingBody,
                documentOfficialNumber: nextProps.documentOfficialNumber,
                documentIssuingDate: nextProps.documentIssuingDate,
                documentExpiredDate: nextProps.documentExpiredDate,
                documentEffectiveDate: nextProps.documentEffectiveDate,
                documentSigner: nextProps.documentSigner,
                documentVersions: nextProps.documentVersions,

                documentRelationshipDescription: nextProps.documentRelationshipDescription,
                documentRelationshipDocuments: nextProps.documentRelationshipDocuments,

                documentRoles: nextProps.documentRoles,

                documentArchivedRecordPlaceInfo: nextProps.documentArchivedRecordPlaceInfo,
                documentArchivedRecordPlaceOrganizationalUnit: nextProps.documentArchivedRecordPlaceOrganizationalUnit,
                documentArchivedRecordPlaceManager: nextProps.documentArchivedRecordPlaceManager,
            } 
        }else if(nextProps.documentVersions.length > prevState.documentVersions.length){
            return {
                ...prevState,
                documentId: nextProps.documentId,
                documentVersions: nextProps.documentVersions,
            } 
        } else {
            return null;
        }
    }

    requestDownloadDocumentFile = (id, fileName) => {
        this.props.downloadDocumentFile(id, fileName);
    }

    render() {
        const {
            documentId, documentName, documentDescription, documentCategory, documentDomains, 
            documentVersionName, documentIssuingBody, documentOfficialNumber, documentIssuingDate, documentExpiredDate, documentEffectiveDate, documentSigner, documentVersions, 
            documentRelationshipDescription, documentRelationshipDocuments,
            documentRoles, 
            documentArchivedRecordPlaceInfo, documentArchivedRecordPlaceOrganizationalUnit, documentArchivedRecordPlaceManager
        } = this.state;
        const {translate, role, documents, department, user}=this.props;
        const categories = documents.administration.categories.list.map(category=>{return{value: category._id, text: category.name}});
        const domains = documents.administration.domains.list.map(domain=>{ return {value: domain._id, text: domain.name}});
        const roleList = role.list.map( role => {return {value: role._id, text: role.name}});
        const relationshipDocs = documents.administration.data.list.filter(doc => doc._id !== documentId).map(doc=>{return {value: doc._id, text: doc.name}})
        const userManage = documents.administration.data.user_manage.map(user=> {return {value: user._id, text: `${user.name} ${user.email}`}});

        return ( 
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-document" size="100"
                    formID="form-edit-document"
                    title={translate('document.add')}
                    func={this.save}
                >
                    <form id="form-edit-document">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin văn bản</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.name') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" value={documentName} onChange={this.handleName}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.issuing_body') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleIssuingBody} value={documentIssuingBody}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.official_number') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleOfficialNumber} value={documentOfficialNumber}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.signer') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleSigner} value={documentSigner}/>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.category') }<span className="text-red">*</span></label>
                                        <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                            id={`select-box-edit-document-category-${documentId}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {categories}
                                            value={documentCategory}
                                            onChange={this.handleCategory}
                                            multiple={false}
                                            options={{placeholder: translate('document.administration.categories.select')}}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.domain') }<span className="text-red">*</span></label>
                                        <SelectBox
                                            id={`select-box-edit-document-domains-${documentId}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            value={documentDomains}
                                            items = {domains}
                                            onChange={this.handleDomains}
                                            multiple={true}
                                            options={{placeholder: translate('document.administration.domains.select')}}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.description') }<span className="text-red">*</span></label>
                                        <textarea type="text" className="form-control" onChange={this.handleDescription} value={documentDescription}/>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.doc_version.title') }</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.name') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleVersionName} value={documentVersionName}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.file') }<span className="text-red">*</span></label>
                                        <input type="file"/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.scanned_file_of_signed_document') }<span className="text-red">*</span></label>
                                        <input type="file"/>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.issuing_date') }<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`document-edit-version-issuing-date-${documentId}`}
                                            value={documentIssuingDate}
                                            onChange={this.handleIssuingDate}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.effective_date') }<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`document-edit-version-effective-date-${documentId}`}
                                            value={documentEffectiveDate}
                                            onChange={this.handleEffectiveDate}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.expired_date') }<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`document-edit-version-expired-date-${documentId}`}
                                            value={documentExpiredDate}
                                            onChange={this.handleExpiredDate}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <button type="button" className="btn btn-success pull-right" onClick={()=>this.addNewDocumentVersion(documentId)}>Thêm</button>
                                    <table className="table table-hover table-striped table-bordered" id="table-document-version">
                                        <thead>
                                            <tr>
                                                <th>{translate('document.version')}</th>
                                                <th>{translate('document.description')}</th>
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
                                                documentVersions.map((version, i) => 
                                                    <tr key={i}>
                                                        <td>{version.versionName}</td>
                                                        <td>{version.description}</td>
                                                        <td><DateTimeConverter dateTime={version.issuingDate} type="DD-MM-YYYY"/></td>
                                                        <td><DateTimeConverter dateTime={version.effectiveDate} type="DD-MM-YYYY"/></td>
                                                        <td><DateTimeConverter dateTime={version.expiredDate} type="DD-MM-YYYY"/></td>
                                                        <td><a href="#"><u>Tải xuống</u></a></td>
                                                        <td><a href="#" onClick={()=>this.requestDownloadDocumentFile('123456', documentName+"đasadsa")}><u>Tải xuống</u></a></td>
                                                    </tr>
                                                ) : <tr><td colSpan={7}>{translate('document.no_version')}</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.relationship.title') }</legend>
                            <div className="form-group">
                                <label>{ translate('document.relationship.description') }<span className="text-red">*</span></label>
                                <textarea type="text" className="form-control" onChange={this.handleRelationshipDescription} value={documentRelationshipDescription}/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('document.relationship.list') }<span className="text-red">*</span></label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id="select-edit-documents-relationship-to-document"
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {relationshipDocs}
                                    onChange={this.handleRelationshipDocuments}
                                    value={documentRelationshipDocuments}
                                    multiple={true}
                                />
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.roles') }</legend>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`select-edit-document-users-see-permission-${documentId}`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {roleList}
                                value={documentRoles}
                                onChange={this.handleRoles}
                                multiple={true}
                            />
                        </fieldset>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.store.title') }</legend>
                            <div className="form-group">
                                <label>{ translate('document.store.information') }<span className="text-red">*</span></label>
                                <input type="text" className="form-control" onChange={this.handleArchivedRecordPlaceInformation} value={documentArchivedRecordPlaceInfo}/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('document.store.organizational_unit_manage') }<span className="text-red">*</span></label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id={`select-edit-documents-organizational-unit-manage${documentId}`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {department.list.map(organ => {return {value: organ._id, text: organ.name}})}
                                    onChange={this.handleArchivedRecordPlaceOrganizationalUnit}
                                    value={documentArchivedRecordPlaceOrganizationalUnit}
                                    multiple={false}
                                />
                            </div>
                            <div className="form-group">
                                <label>{ translate('document.store.user_manage') }<span className="text-red">*</span></label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id="select-edit-documents-user-manage"
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {userManage}
                                    value={documentArchivedRecordPlaceManager}
                                    onChange={this.handleArchivedRecordPlaceManager}
                                    options={{placeholder: translate('document.store.select_user')}}
                                    multiple={false}
                                />
                            </div>
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
    downloadDocumentFile: DocumentActions.downloadDocumentFile
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(EditForm) );