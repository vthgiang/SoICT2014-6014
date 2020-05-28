import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox, DataTableSetting, DateTimeConverter } from '../../../../../common-components';
import CreateForm from './createForm';
import { DocumentActions } from '../../../redux/actions';
import EditForm from './editForm';
import moment from 'moment';
import {RoleActions} from '../../../../super-admin/role/redux/actions';
import {DepartmentActions} from '../../../../super-admin/organizational-unit/redux/actions';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        this.props.getAllDocuments();
        this.props.getAllRoles();
        this.props.getAllDepartments();
    }

    toggleEditDocument = async (data) => {
        await this.setState({
            currentRow: data
        });
        window.$('#modal-edit-document').modal('show');
    }

    requestDownloadDocumentFile = (id, fileName) => {
        this.props.downloadDocumentFile(id, fileName);
    }

    render() { 
        const {translate} = this.props;
        const {list} = this.props.documents.administration.data;
        const {isLoading} = this.props.documents;
        const {currentRow} = this.state;

        return ( 
            <React.Fragment>
                <CreateForm/>
                {
                    currentRow !== undefined &&
                    <EditForm
                        documentId={currentRow._id}
                        documentName={currentRow.name}
                        documentDescription={currentRow.description}
                        documentCategory={currentRow.category}
                        documentDomains={currentRow.domains}

                        documentVersionName={currentRow.versionName}
                        documentIssuingBody={currentRow.issuingBody}
                        documentOfficialNumber={currentRow.officialNumber}
                        documentIssuingDate={moment(currentRow.issuingDate).format("DD-MM-YYYY")}
                        documentExpiredDate={moment(currentRow.expiredDate).format("DD-MM-YYYY")}
                        documentEffectiveDate={moment(currentRow.effectiveDate).format("DD-MM-YYYY")}
                        documentSigner={currentRow.signer}
                        documentVersions={currentRow.versions}

                        documentRelationshipDescription={currentRow.relationshipDescription}
                        documentRelationshipDocuments={currentRow.relationshipDocuments}

                        documentRoles={currentRow.roles}

                        documentArchivedRecordPlaceInfo={currentRow.archivedRecordPlaceInfo}
                        documentArchivedRecordPlaceOrganizationalUnit={currentRow.archivedRecordPlaceOrganizationalUnit}
                        documentArchivedRecordPlaceManager={currentRow.archivedRecordPlaceManager}
                    />
                }
                <table className="table table-hover table-striped table-bordered" id="table-manage-document">
                    <thead>
                        <tr>
                            <th>{translate('document.name')}</th>
                            <th>{translate('document.description')}</th>
                            <th>{translate('document.issuing_date')}</th>
                            <th>{translate('document.effective_date')}</th>
                            <th>{translate('document.expired_date')}</th>
                            <th>{translate('document.upload_file')}</th>
                            <th>{translate('document.upload_file_scan')}</th>
                            <th>{translate('document.views')}</th>
                            <th>{translate('document.downloads')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                {translate('general.action')}
                                <DataTableSetting
                                    columnArr={[
                                        translate('document.name'), 
                                        translate('document.description'), 
                                        translate('document.issuing_date'), 
                                        translate('document.effective_date'), 
                                        translate('document.expired_date'), 
                                        translate('document.upload_file'), 
                                        translate('document.upload_file_scan'),
                                        translate('document.views'), 
                                        translate('document.downloads')
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    hideColumnOption = {true}
                                    tableId="table-manage-document"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.length > 0 ?
                            list.map(doc => 
                            <tr key={doc._id}>
                                <td>{doc.name}</td>
                                <td>{doc.description}</td>
                                <td><DateTimeConverter dateTime={doc.issuingDate} type="DD-MM-YYYY"/></td>
                                <td><DateTimeConverter dateTime={doc.effectiveDate} type="DD-MM-YYYY"/></td>
                                <td><DateTimeConverter dateTime={doc.expiredDate} type="DD-MM-YYYY"/></td>
                                <td><a href="#" onClick={()=>this.requestDownloadDocumentFile(doc._id, doc.name)}><u>{translate('document.download')}</u></a></td>
                                <td><a href="#" onClick={()=>this.requestDownloadDocumentFile(doc._id, doc.name)}><u>{translate('document.download')}</u></a></td>
                                <td>{doc.numberOfView}</td>
                                <td>{doc.numberOfDownload}</td>
                                <td>
                                    <a className="text-yellow" title={translate('document.edit')} onClick={()=>this.toggleEditDocument(doc)}><i className="material-icons">edit</i></a>
                                    <a className="text-red" title={translate('document.delete')}><i className="material-icons">delete</i></a>
                                </td>
                            </tr>):
                            isLoading ? 
                            <tr><td colSpan={10}>{translate('general.loading')}</td></tr>:<tr><td colSpan={10}>{translate('general.no_data')}</td></tr>
                        }
                        
                    </tbody>
                </table>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments,
    getAllRoles: RoleActions.get,
    getAllDepartments: DepartmentActions.get,
    downloadDocumentFile: DocumentActions.downloadDocumentFile
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Table) );