import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, DataTableSetting } from '../../../../../common-components';
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

    save = () => {
        const {documentTypeName, documentTypeDescription} = this.state;
        this.props.createDocumentCategory({
            name: documentTypeName,
            description: documentTypeDescription
        });
    }

    render() {
        const {translate}=this.props;

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
                                        <label>{ translate('document.users') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleName}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.description') }<span className="text-red">*</span></label>
                                        <textarea type="text" className="form-control" onChange={this.handleName}/>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.category') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleName}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.domain') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleName}/>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Phiên bản</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.version') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleName}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.description') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" onChange={this.handleName}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.apply_at') }<span className="text-red">*</span></label>
                                        <input type="date" className="form-control"/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.upload_file') }<span className="text-red">*</span></label>
                                        <input type="file"/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.upload_file_scan') }<span className="text-red">*</span></label>
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
                                                            translate('document.createdAt'), 
                                                            translate('document.applyAt'), 
                                                            translate('document.views'), 
                                                            translate('document.downloads')
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
                            <legend className="scheduler-border">Liên kết văn bản</legend>
                            
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Hồ sơ lưu trữ bản cứng</legend>
                            
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    createDocumentCategory: DocumentActions.createDocumentCategory
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CreateForm) );