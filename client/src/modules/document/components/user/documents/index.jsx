import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, DateTimeConverter, PaginateBar, SearchBar, ToolTip } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import {RoleActions} from '../../../../super-admin/role/redux/actions';
import {DepartmentActions} from '../../../../super-admin/organizational-unit/redux/actions';
import DocumentInformation from './DocumentInformation';
import { getStorage } from '../../../../../config';

class UserDocumentsData extends Component {
    constructor(props) {
        super(props);
        this.state = { option: 'name', value: '', limit: 5, page: 1 }
    }

    componentDidMount(){
        this.props.getAllRoles();
        this.props.getAllDepartments();
        this.props.getAllDocuments(getStorage('currentRole'));
        this.props.getAllDocuments(getStorage('currentRole'), {page: this.state.page, limit: this.state.limit});
    }

    toggleDocumentInformation = async (data) => {
        await this.setState({
            currentRow: data
        });
        window.$('#modal-information-user-document').modal('show');
        this.props.increaseNumberView(data._id)
    }

    requestDownloadDocumentFile = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFile(id, fileName, numberVersion);
    }

    requestDownloadDocumentFileScan = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFileScan(id, fileName, numberVersion);
    }

    render() { 
        const { translate } = this.props;
        const { isLoading } = this.props.documents;
        const docs = this.props.documents.user.data;
        const { paginate } = docs;
        const { currentRow } = this.state;

        return ( 
            <React.Fragment>
                {
                    currentRow !== undefined &&
                    <DocumentInformation
                        documentId={currentRow._id}
                        documentName={currentRow.name}
                        documentDescription={currentRow.description}
                        documentCategory={currentRow.category._id}
                        documentDomains={currentRow.domains.map(domain => domain._id)}
                        documentIssuingBody={currentRow.issuingBody}
                        documentOfficialNumber={currentRow.officialNumber}
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
                <SearchBar 
                    columns={[
                        { title: translate('document.name'), value: 'name' },
                        { title: translate('document.description'), value: 'description' }
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
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
                                    tableId="table-manage-user-document"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            paginate.length > 0 ?
                            paginate.map(doc => 
                            <tr key={doc._id}>
                                <td>{doc.name}</td>
                                <td>{doc.description}</td>
                                <td><DateTimeConverter dateTime={doc.versions[doc.versions.length-1].issuingDate} type="DD-MM-YYYY"/></td>
                                <td><DateTimeConverter dateTime={doc.versions[doc.versions.length-1].effectiveDate} type="DD-MM-YYYY"/></td>
                                <td><DateTimeConverter dateTime={doc.versions[doc.versions.length-1].expiredDate} type="DD-MM-YYYY"/></td>
                                <td><a href="#" onClick={()=>this.requestDownloadDocumentFile(doc._id, doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                <td><a href="#" onClick={()=>this.requestDownloadDocumentFileScan(doc._id, "SCAN_"+doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                <td>{doc.numberOfView}<ToolTip type="latest_history" dataTooltip={doc.views.map(view=> {return (
                                    <React.Fragment>
                                        {view.viewer+", "} <DateTimeConverter dateTime={view.time}/>
                                    </React.Fragment>
                                ) })}/></td>
                                <td>{doc.numberOfDownload}<ToolTip type="latest_history" dataTooltip={doc.downloads.map(download=> {return (
                                    <React.Fragment>
                                        {download.downloader+", "} <DateTimeConverter dateTime={download.time}/>
                                    </React.Fragment>
                                ) })}/></td>
                                <td>
                                    <a className="text-green" title={translate('document.edit')} onClick={()=>this.toggleDocumentInformation(doc)}><i className="material-icons">visibility</i></a>
                                    
                                </td>
                            </tr>):
                            isLoading ? 
                            <tr><td colSpan={10}>{translate('general.loading')}</td></tr>:<tr><td colSpan={10}>{translate('general.no_data')}</td></tr>
                        }
                        
                    </tbody>
                </table>
                <PaginateBar pageTotal={docs.totalPages} currentPage={docs.page} func={this.setPage}/> 
            </React.Fragment>
         );
    }

    setPage = async(page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getAllDocuments(getStorage('currentRole'), data);
    }

    setLimit = (number) => {
        if (this.state.limit !== number){
            this.setState({ limit: number });
            const data = { limit: number, page: this.state.page };
            this.props.getAllDocuments(getStorage('currentRole'), data);
        }
    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }
    
    searchWithOption = async() => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getAllDocuments(getStorage('currentRole'), data);
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDepartments: DepartmentActions.get,
    getAllRoles: RoleActions.get,
    getAllDocuments: DocumentActions.getDocumentsUserCanView,
    increaseNumberView: DocumentActions.increaseNumberView,
    downloadDocumentFile: DocumentActions.downloadDocumentFile,
    downloadDocumentFileScan: DocumentActions.downloadDocumentFileScan,
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(UserDocumentsData) );