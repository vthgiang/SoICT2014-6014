import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import { DataTableSetting, DateTimeConverter, PaginateBar, SearchBar, ToolTip } from '../../../../../common-components';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import DocumentInformation from '../../user/documents/documentInformation';
import { DocumentActions } from '../../../redux/actions';

import CreateForm from './createForm';
import EditForm from './editForm';
import ListView from './listView';
import ListDownload from './listDownload';

const getIndex = (array, id) => {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
        if (array[i]._id === id) {
            index = i;
            break;
        }
    }
    return index;
}

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = { option: 'name', value: '', limit: 5, page: 1 }
    }

    componentDidMount() {
        this.props.getAllDocuments();
        this.props.getAllDocuments({ page: this.state.page, limit: this.state.limit });
        this.props.getAllRoles();
        this.props.getAllDepartments();
    }

    toggleEditDocument = async (data) => {
        await this.setState({
            currentRow: data
        });
        window.$('#modal-edit-document').modal('show');
        this.props.increaseNumberView(data._id)
    }

    requestDownloadDocumentFile = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFile(id, fileName, numberVersion);
    }

    requestDownloadDocumentFileScan = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFileScan(id, fileName, numberVersion);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { data } = nextProps.documents.administration;
        if (prevState.currentRow) {
            const index = getIndex(data.list, prevState.currentRow._id);
            if (data.list[index].versions.length !== prevState.currentRow.versions.length) {
                return {
                    ...prevState,
                    currentRow: data.list[index]
                }
            }
            else return null;
        } else {
            return null;
        }
    }

    deleteDocument = (id, info) => {
        const { translate } = this.props;
        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('document.delete')}</div> <div>"${info}" ?</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                this.props.deleteDocument(id);
            }
        })
    }
    toggleDocumentInformation = async (data) => {
        await this.setState({
            currentRow: data
        });
        window.$('#modal-information-user-document').modal('show');
        this.props.increaseNumberView(data._id)
    }
    showDetailListView = async (data) => {
        await this.setState({
            currentRow: data,
        });
        window.$('#modal-list-view').modal('show');
    }
    showDetailListDownload = async (data) => {
        await this.setState({
            currentRow: data,
        })
        window.$('#modal-list-download').modal('show');
    }
    render() {
        const { translate } = this.props;
        const docs = this.props.documents.administration.data;
        const { paginate } = docs;
        const { isLoading } = this.props.documents;
        const { currentRow } = this.state;
        console.log('---------------------', docs);

        return (
            <React.Fragment>
                <CreateForm />
                {
                    currentRow &&
                    <ListView
                        docs={currentRow}
                    />
                }
                {
                    currentRow &&
                    <ListDownload
                        docs={currentRow}
                    />
                }
                {
                    currentRow &&
                    <EditForm
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
                {
                    currentRow &&
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
                <table className="table table-hover table-striped table-bordered" id="table-manage-document-list">
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
                                    hideColumnOption={true}
                                    tableId="table-manage-document"
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
                                        <td>{!doc.description ? doc.description : ""}</td>
                                        <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].issuingDate} type="DD-MM-YYYY" /></td>
                                        <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].effectiveDate} type="DD-MM-YYYY" /></td>
                                        <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].expiredDate} type="DD-MM-YYYY" /></td>
                                        <td><a href="#" onClick={() => this.requestDownloadDocumentFile(doc._id, doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                        <td><a href="#" onClick={() => this.requestDownloadDocumentFileScan(doc._id, "SCAN_" + doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                        <td>
                                            <a href="#modal-list-view" onClick={() => this.showDetailListView(doc)}>{doc.numberOfView}</a>
                                        </td>
                                        <td>
                                            <a href="#modal-list-download" onClick={() => this.showDetailListDownload(doc)}>{doc.numberOfDownload}</a>
                                        </td>
                                        <td>
                                            <a className="text-green" title={translate('document.view')} onClick={() => this.toggleDocumentInformation(doc)}><i className="material-icons">visibility</i></a>
                                            <a className="text-yellow" title={translate('document.edit')} onClick={() => this.toggleEditDocument(doc)}><i className="material-icons">edit</i></a>
                                            <a className="text-red" title={translate('document.delete')} onClick={() => this.deleteDocument(doc._id, doc.name)}><i className="material-icons">delete</i></a>
                                        </td>
                                    </tr>) :
                                isLoading ?
                                    <tr><td colSpan={10}>{translate('general.loading')}</td></tr> : <tr><td colSpan={10}>{translate('general.no_data')}</td></tr>
                        }

                    </tbody>
                </table>
                <PaginateBar pageTotal={docs.totalPages} currentPage={docs.page} func={this.setPage} />
            </React.Fragment>
        );
    }

    setPage = async (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getAllDocuments(data);
    }

    setLimit = (number) => {
        if (this.state.limit !== number) {
            this.setState({ limit: number });
            const data = { limit: number, page: this.state.page };
            this.props.getAllDocuments(data);
        }
    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async () => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getAllDocuments(data);
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments,
    getAllRoles: RoleActions.get,
    getAllDepartments: DepartmentActions.get,
    downloadDocumentFile: DocumentActions.downloadDocumentFile,
    downloadDocumentFileScan: DocumentActions.downloadDocumentFileScan,
    increaseNumberView: DocumentActions.increaseNumberView,
    deleteDocument: DocumentActions.deleteDocument,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Table));