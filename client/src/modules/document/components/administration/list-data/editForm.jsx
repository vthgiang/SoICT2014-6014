import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, DataTableSetting, SelectBox, DatePicker } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';

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

    handleApplyAt = value => {
        this.setState({documentApplyAt: value})
    }
    save = () => {
        const {documentTypeName, documentTypeDescription} = this.state;
        this.props.createDocumentCategory({
            name: documentTypeName,
            description: documentTypeDescription
        });
    }

    
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.data !== undefined && nextProps.data._id !== prevState.documentId) {
            return {
                ...prevState,
                documentId: nextProps.data._id,
                documentName: nextProps.data.name
            } 
        } else {
            return null;
        }
    }

    render() {
        const {translate, role, documents, department}=this.props;
        const categories = documents.administration.categories.list.map(category=>{return{value: category._id, text: category.name}});
        const domains = documents.administration.domains.list.map(domain=>{ return {value: domain._id, text: domain.name}});
        const documentRoles = role.list.map( role => {return {value: role._id, text: role.name}});
        const relationshipDocs = documents.administration.data.list.map(doc=>{return {value: doc._id, text: doc.name}})
        const userManage = documents.administration.data.user_manage.map(user=> {return {value: user._id, text: `${user.name} ${user.email}`}});
        const {documentName} = this.state;
        console.log("state doc: ", this.state);

        return ( 
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-document" size="75"
                    formID="form-edit-document"
                    title={translate('document.add')}
                    func={this.save}
                >
                    <form id="form-create-document">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin văn bản</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.name') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} value={documentName}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.category') }<span className="text-red">*</span></label>
                                        <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                            id="select-edit-documents-relationship"
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
                                            id="select-edit-box-document-domains"
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
                                        <textarea style={{height: '184px'}} type="text" className="form-control" onChange={this.handleName}/>
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
                                        <input type="text" className="form-control" onChange={this.handleName}/>
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
                                            id="document-edit-version-issuing-date"
                                            value={this.state.documentIssuingDate}
                                            onChange={this.handleIssuingDate}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.effective_date') }<span className="text-red">*</span></label>
                                        <DatePicker
                                            id="document-edit-version-effective-date"
                                            value={this.state.documentEffectiveDate}
                                            onChange={this.handleEffectiveDate}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.expired_date') }<span className="text-red">*</span></label>
                                        <DatePicker
                                            id="document-edit-version-expired-date"
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
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <table className="table table-hover table-striped table-bordered" id="table-document-version">
                                        <thead>
                                            <tr>
                                                <th>{translate('document.version')}</th>
                                                <th>{translate('document.description')}</th>
                                                <th>{translate('document.created_at')}</th>
                                                <th>{translate('document.apply_at')}</th>
                                                <th style={{ width: '120px', textAlign: 'center' }}>
                                                    {translate('general.action')}
                                                    <DataTableSetting
                                                        columnArr={[
                                                            translate('document.name'), 
                                                            translate('document.description'), 
                                                            translate('document.created_at'), 
                                                            translate('document.apply_at')
                                                        ]}
                                                        limit={this.state.limit}
                                                        setLimit={this.setLimit}
                                                        hideColumnOption = {true}
                                                        tableId="table-document-version"
                                                    />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1.0</td>
                                                <td>Mô tả phiên bản 1.0</td>
                                                <td>10/5/2020</td>
                                                <td>17/5/2020</td>
                                                <td>
                                                    <a className="text-yellow" title={translate('document.edit')}><i className="material-icons">edit</i></a>
                                                    <a className="text-red" title={translate('document.delete')}><i className="material-icons">delete</i></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2.0</td>
                                                <td>Mô tả phiên bản 2.0</td>
                                                <td>11/5/2020</td>
                                                <td>17/5/2020</td>
                                                <td>
                                                    <a className="text-yellow" title={translate('document.edit')}><i className="material-icons">edit</i></a>
                                                    <a className="text-red" title={translate('document.delete')}><i className="material-icons">delete</i></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>3.0</td>
                                                <td>Mô tả phiên bản 3.0</td>
                                                <td>17/5/2020</td>
                                                <td>18/5/2020</td>
                                                <td>
                                                    <a className="text-yellow" title={translate('document.edit')}><i className="material-icons">edit</i></a>
                                                    <a className="text-red" title={translate('document.delete')}><i className="material-icons">delete</i></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.relationship.title') }</legend>
                            <div className="form-group">
                                <label>{ translate('document.relationship.description') }<span className="text-red">*</span></label>
                                <textarea type="text" className="form-control" onChange={this.handleName}/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('document.relationship.list') }<span className="text-red">*</span></label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id="select-edit-documents-relationship-to-document"
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {relationshipDocs}
                                    multiple={true}
                                />
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.users') }</legend>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id="select-edit-document-users-see-permission"
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {documentRoles}
                                onChange={this.handleRolesChange}
                                multiple={true}
                            />
                        </fieldset>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.store.title') }</legend>
                            <div className="form-group">
                                <label>{ translate('document.store.information') }<span className="text-red">*</span></label>
                                <input type="text" className="form-control" onChange={this.handleName}/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('document.store.organizational_unit_manage') }<span className="text-red">*</span></label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id="select-edit-documents-organizational-unit-manage"
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {department.list.map(organ => {return {value: organ._id, text: organ.name}})}
                                    onChange={this.handleOrganizationalUnit}
                                    options={{placeholder: translate('document.store.select_organizational')}}
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
                                    onChange={this.handleRolesChange}
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

    handleRolesChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                documentRoles: value
            }
        });
    }

    handleOrganizationalUnit = value => {
        this.setState({
            documentOrganizationalUnit: value[0]
        })
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    createDocumentCategory: DocumentActions.createDocumentCategory
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(EditForm) );