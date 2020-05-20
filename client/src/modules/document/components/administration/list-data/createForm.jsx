import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, DataTableSetting, SelectBox, DatePicker } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';

class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            documentTypeName: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            documentTypeDescription: value
        })
    }

    handleDomain = value => {
        this.setState({ documentDomain: value });
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

    render() {
        const {translate, role, documents, department}=this.props;
        const categories = documents.administration.categories.list.map(category=>{return{value: category._id, text: category.name}});
        const domains = documents.administration.domains.list.map(domain=>{ return {value: domain._id, text: domain.name}});
        const documentRoles = role.list.map( role => {return {value: role._id, text: role.name}});
        const relationshipDocs = documents.administration.listData.list.map(doc=>{return {value: doc._id, text: doc.name}})
        const userManage = documents.administration.listData.create.user_manage.map(user=> {return {value: user._id, text: `${user.name} ${user.email}`}})
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
                            <legend className="scheduler-border">Thông tin văn bản</legend>
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
                                            onChange={this.handleRolesChange}
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
                                            onChange={this.handleDomainsChange}
                                            multiple={false}
                                            options={{placeholder: translate('document.administration.categories.select')}}
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
                                     <label>{ translate('document.doc_version.apply_at') }<span className="text-red">*</span></label>
                                        <DatePicker
                                            id="document-version-apply-at"
                                            value={this.state.documentApplyAt}
                                            onChange={this.handleApplyAt}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.upload_file') }<span className="text-red">*</span></label>
                                        <input type="file"/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.upload_file_scan') }<span className="text-red">*</span></label>
                                        <input type="file"/>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.description') }<span className="text-red">*</span></label>
                                        <textarea style={{height: '110px'}} type="text" className="form-control" onChange={this.handleName}/>
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
                                    id="select-documents-relationship-to-document"
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
                                id="select-document-users-see-permission"
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
                                    id="select-documents-organizational-unit-manage"
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
                                    id="select-documents-user-manage"
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

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CreateForm) );