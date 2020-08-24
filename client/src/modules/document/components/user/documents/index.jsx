import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, DateTimeConverter, PaginateBar, TreeSelect, SelectBox, ExportExcel } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import DocumentInformation from './documentInformation';
import { getStorage } from '../../../../../config';
import ListDownload from '../../administration/list-data/listDownload';
import ListView from '../../administration/list-data/listView';

class UserDocumentsData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: "",
            domain: "",
            archive: "",
            name: "",
            option: {
                category: "",
                domain: "",
                archive: "",
            },
            limit: 5,
            page: 1
        }
    }

    componentDidMount() {
        this.props.getAllRoles();
        this.props.getAllDepartments();
        this.props.getAllDocuments(getStorage('currentRole'));
        this.props.getAllDocuments(getStorage('currentRole'), { page: this.state.page, limit: this.state.limit });
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

    convertDataToExportData = (data) => {
        data = data.map((x, index) => {
            return {
                STT: index + 1,
                name: x.name,
                description: x.description,
                issuingDate: new Date(x.versions[0].issuingDate),
                effectiveDate: new Date(x.versions[0].effectiveDate),
                expiredDate: new Date(x.versions[0].expiredDate),
                numberOfView: x.numberOfView,
                numberOfDownload: x.numberOfDownload,
                issuingBody: x.issuingBody,
                signer: x.signer,
                officialNumber: x.officialNumber,
            }
        });
        let exportData = {
            fileName: "Bang thong ke tai lieu",
            dataSheets: [
                {
                    sheetName: "sheet1",
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên" },
                                { key: "description", value: "Mô tả" },
                                { key: "signer", value: "Người ký" },
                                { key: "officialNumber", value: "Số hiệu" },
                                { key: "issuingBody", value: "Cơ quan ban hành" },
                                { key: "issuingDate", value: "Ngày ban hành" },
                                { key: "effectiveDate", value: "Ngày áp dụng" },
                                { key: "expiredDate", value: "Ngày hết hạn" },
                                { key: "numberOfView", value: "Số lần xem" },
                                { key: "numberOfDownload", value: "Số lần download" },
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData
    }
    convertData = (data) => {
        let array = data.map(item => {
            return {
                value: item.id,
                text: item.name,
            }
        })
        array.unshift({ value: "", text: "Tất cả các loại" });
        return array;
    }
    handleCategoryChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                category: value,
            }
        })
    }
    handleDomainChange = (value) => {
        this.setState({ domain: value });
    }
    handleDomains = value => {
        this.setState({ documentDomains: value });
    }
    handleNameChange = (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                name: value.trim(),
            }
        })
    }
    handleArchiveChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                archive: value,
            }
        })
    }

    render() {
        const { translate } = this.props;
        const { domains, categories, archives } = this.props.documents.administration;
        const docs = this.props.documents.user.data;
        const { paginate } = docs;
        const { isLoading } = this.props.documents;
        const { currentRow, archive, category } = this.state;
        const listDomain = domains.list
        const listCategory = this.convertData(categories.list)
        const listArchive = archives.list;
        console.log('tttt', currentRow.logs);
        let list = [];
        if (isLoading === false) {
            list = docs.list;
        }
        let exportData = this.convertDataToExportData(list);
        return (
            <div className="qlcv">
                <React.Fragment>
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
                        currentRow !== undefined &&
                        <DocumentInformation
                            documentId={currentRow._id}
                            documentName={currentRow.name}
                            documentDescription={currentRow.description}
                            documentCategory={currentRow.category ? currentRow.category._id : ""}
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
                            documentLogs={currentRow.logs}
                        />
                    }
                    {<ExportExcel id="export-document" exportData={exportData} style={{ marginLeft: 5 }} />}
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('document.category')}</label>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`stattus-category`}
                                style={{ width: "100%" }}
                                items={listCategory}
                                onChange={this.handleCategoryChange}
                                value={category}
                            />
                        </div>
                        <div className="form-group" >
                            <label>{translate('document.store.information')}</label>
                            <TreeSelect
                                data={listArchive}
                                className="form-control select2"
                                handleChange={this.handleArchiveChange}
                                value={archive}
                                mode="hierarchical"
                                style={{ width: " 100%" }}
                            />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('document.domain')}</label>
                            <TreeSelect
                                data={listDomain}
                                className="form-control select2"
                                handleChange={this.handleDomainChange}
                                mode="hierarchical"
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('document.name')}</label>
                            <input type="text" className="form-control" onChange={this.handleNameChange} />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={() => this.searchWithOption()}>{
                                translate('kpi.organizational_unit.management.over_view.search')}</button>
                        </div>
                    </div>

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
                                        hideColumnOption={true}
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
                                            <td>{doc.description ? doc.description : ""}</td>
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

                                            </td>
                                        </tr>) :
                                    isLoading ?
                                        <tr><td colSpan={10}>{translate('general.loading')}</td></tr> : <tr><td colSpan={10}>{translate('general.no_data')}</td></tr>
                            }

                        </tbody>
                    </table>

                    <PaginateBar pageTotal={docs.totalPages} currentPage={docs.page} func={this.setPage} />
                </React.Fragment>
            </div>
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
        await this.props.getAllDocuments(getStorage('currentRole'), data);
    }

    setLimit = (number) => {
        if (this.state.limit !== number) {
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

    searchWithOption = async () => {
        const data = {
            limit: this.state.limit,
            page: 1,
            name: this.state.name,
            category: this.state.category[0],
            domains: this.state.domain[0],
            archives: this.state.archive[0],
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(UserDocumentsData));