import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, DataTableSetting, SelectBox, DatePicker } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import moment from 'moment';
import {convertJsonObjectToFormData} from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

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

    handleUploadFile = (e) => {
        this.setState({ documentFile: e.target.files[0] });
    }

    handleUploadFileScan = (e) => {
        this.setState({ documentFileScan: e.target.files[0] });
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
            documentFile,
            documentFileScan,
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
        if(documentDomains !== undefined) for (var i = 0; i < documentDomains.length; i++) {
            formData.append('domains[]', documentDomains[i]);
        }
        formData.append('description', documentDescription); 
        formData.append('issuingBody', documentIssuingBody);
        formData.append('officialNumber', documentOfficialNumber);
        formData.append('signer', documentSigner);

        formData.append('versionName', documentVersionName);
        formData.append('issuingDate', moment(documentIssuingDate, "DD-MM-YYYY"));
        formData.append('effectiveDate', moment(documentEffectiveDate, "DD-MM-YYYY"));
        formData.append('expiredDate', moment(documentExpiredDate, "DD-MM-YYYY"));
        formData.append('file', documentFile);
        formData.append('fileScan', documentFileScan);

        formData.append('relationshipDescription', documentRelationshipDescription);
        if(documentRelationshipDocuments !== undefined)for (var i = 0; i < documentRelationshipDocuments.length; i++) {
            formData.append('relationshipDocuments[]', documentRelationshipDocuments[i]);
        }
        if(documentRoles !== undefined) for (var i = 0; i < documentRoles.length; i++) {
            formData.append('roles[]', documentRoles[i]);
        }

        formData.append('archivedRecordPlaceInfo', documentArchivedRecordPlaceInfo);
        formData.append('archivedRecordPlaceOrganizationalUnit', documentArchivedRecordPlaceOrganizationalUnit);
        formData.append('archivedRecordPlaceManager', documentArchivedRecordPlaceManager);

        this.props.createDocument(formData);
    }

    render() {
        const {translate, role, documents, department}=this.props;
        const categories = documents.administration.categories.list.map(category=>{return{value: category._id, text: category.name}});
        const domains = documents.administration.domains.list.map(domain=>{ return {value: domain._id, text: domain.name}});
        const documentRoles = role.list.map( role => {return {value: role._id, text: role.name}});
        const relationshipDocs = documents.administration.data.list.map(doc=>{return {value: doc._id, text: doc.name}})
        const userManage = documents.administration.data.user_manage.map(user=> {return {value: user._id, text: `${user.name} ${user.email}`}});

        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-create-document" button_name={translate('general.add')} title={translate('manage_user.add_title')}/>
                <DialogModal
                    modalID="modal-create-document"
                    formID="form-create-document"
                    title={translate('document.add')}
                    func={this.save} size="100"
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
                                        <label>{ translate('document.doc_version.issuing_body') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleIssuingBody} placeholder="VD: Cơ quan hành chính"/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.official_number') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleOfficialNumber} placeholder="VD: 05062020VN"/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.signer') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleSigner} placeholder="VD: Nguyễn Việt Anh"/>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
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
                                    <div className="form-group">
                                        <label>{ translate('document.description') }<span className="text-red">*</span></label>
                                        <textarea type="text" className="form-control" onChange={this.handleDescription}/>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{ translate('document.doc_version.title') }</legend>
                                        <div className="form-group">
                                            <label>{ translate('document.doc_version.name') }<span className="text-red">*</span></label>
                                            <input type="text" className="form-control" onChange={this.handleVersionName} placeholder="VD: Phiên bản 1"/>
                                        </div>  
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
                                            <input type="file" onChange={this.handleUploadFile}/>
                                        </div>
                                        <div className="form-group">
                                            <label>{ translate('document.doc_version.scanned_file_of_signed_document') }<span className="text-red">*</span></label>
                                            <input type="file" onChange={this.handleUploadFileScan}/>
                                        </div>
                                </fieldset>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{ translate('document.relationship.title') }</legend>
                                    <div className="form-group">
                                        <label>{ translate('document.relationship.description') }</label>
                                        <textarea type="text" className="form-control" onChange={this.handleRelationshipDescription}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.relationship.list') }</label>
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
                                        <label>{ translate('document.store.information') }</label>
                                        <input type="text" className="form-control" onChange={this.handleArchivedRecordPlaceInfo} placeholder="VD: Tủ 301"/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.store.organizational_unit_manage') }</label>
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
                                    {/* <div className="form-group">
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
                                    </div> */}
                                </fieldset>
                            </div>
                        </div>
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