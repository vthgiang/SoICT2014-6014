import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, DataTableSetting, SelectBox, DatePicker } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import moment from 'moment';

class CreateForm extends Component {
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

    handleRelationshipDocuments = value => {
        this.setState({ documentRelationshipDocuments: value });
    }

    handleRoles = value => {
        this.setState({ documentRoles: value });
    }

    handleArchivedRecordPlaceInfo = e => {
        const {value} = e.target;
        this.setState({documentArchivedRecordPlaceInfo: value});
    }

    handleArchivedRecordPlaceOrganizationalUnit = value => {
        this.setState({documentArchivedRecordPlaceOrganizationalUnit: value});
    }

    handleArchivedRecordPlaceManager = e => {
        const {value} = e.target;
        this.setState({documentArchivedRecordPlaceManager: value});
    }

    save = () => {
        const {
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
        this.props.createDocument({
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

    render() {
        const {translate, role, documents, department}=this.props;
        const categories = documents.administration.categories.list.map(category=>{return{value: category._id, text: category.name}});
        const domains = documents.administration.domains.list.map(domain=>{ return {value: domain._id, text: domain.name}});
        const documentRoles = role.list.map( role => {return {value: role._id, text: role.name}});
        const relationshipDocs = documents.administration.data.list.map(doc=>{return {value: doc._id, text: doc.name}})
        const userManage = documents.administration.data.user_manage.map(user=> {return {value: user._id, text: `${user.name} ${user.email}`}});

        console.log("document: ", this.state)

        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-create-document" button_name={translate('general.add')} title={translate('manage_user.add_title')}/>
                <DialogModal
                    modalID="modal-create-document" size="75"
                    formID="form-create-document"
                    title={translate('document.add')}
                    func={this.save}
                >
                    <form id="form-create-document">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('document.information')}</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.name') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleName}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.category') }<span className="text-red">*</span></label>
                                        <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                            id="select-documents-relationship"
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {categories}
                                            onChange={this.handleCategory}
                                            multiple={false}
                                            options={{placeholder: translate('document.administration.categories.select')}}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.domain') }<span className="text-red">*</span></label>
                                        <SelectBox
                                            id="select-box-document-domains"
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {domains}
                                            onChange={this.handleDomains}
                                            multiple={true}
                                            options={{placeholder: translate('document.administration.domains.select')}}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.description') }<span className="text-red">*</span></label>
                                        <textarea style={{height: '180px'}} type="text" className="form-control" onChange={this.handleDescription}/>
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
                                        <input type="text" className="form-control" onChange={this.handleVersionName}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.issuing_body') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleIssuingBody}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.official_number') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleOfficialNumber}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.signer') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleSigner}/>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.issuing_date') }<span className="text-red">*</span></label>
                                        <DatePicker
                                            id="create-document-version-issuing-date"
                                            value={this.state.documentIssuingDate}
                                            onChange={this.handleIssuingDate}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.effective_date') }<span className="text-red">*</span></label>
                                        <DatePicker
                                            id="create-document-version-effective-date"
                                            value={this.state.documentEffectiveDate}
                                            onChange={this.handleEffectiveDate}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.expired_date') }<span className="text-red">*</span></label>
                                        <DatePicker
                                            id="create-document-version-expired-date"
                                            value={this.state.documentExpiredDate}
                                            onChange={this.handleExpiredDate}
                                        />
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
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.relationship.title') }</legend>
                            <div className="form-group">
                                <label>{ translate('document.relationship.description') }<span className="text-red">*</span></label>
                                <textarea type="text" className="form-control" onChange={this.handleRelationshipDescription}/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('document.relationship.list') }<span className="text-red">*</span></label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id="select-documents-relationship-to-document"
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {relationshipDocs}
                                    onChange={this.handleRelationshipDocuments}
                                    multiple={true}
                                />
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.roles') }</legend>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id="select-document-users-see-permission"
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {documentRoles}
                                onChange={this.handleRoles}
                                multiple={true}
                            />
                        </fieldset>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.store.title') }</legend>
                            <div className="form-group">
                                <label>{ translate('document.store.information') }<span className="text-red">*</span></label>
                                <input type="text" className="form-control" onChange={this.handleArchivedRecordPlaceInfo}/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('document.store.organizational_unit_manage') }<span className="text-red">*</span></label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id="select-documents-organizational-unit-manage"
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {department.list.map(organ => {return {value: organ._id, text: organ.name}})}
                                    onChange={this.handleArchivedRecordPlaceOrganizationalUnit}
                                    options={{placeholder: translate('document.store.select_organizational')}}
                                    multiple={false}
                                />
                            </div>
                            <div className="form-group">
                                <label>{ translate('document.store.user_manage') }<span className="text-red">*</span></label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id="select-documents-user-manage"
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {userManage}
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
    createDocument: DocumentActions.createDocument
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CreateForm) );