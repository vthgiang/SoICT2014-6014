import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DateTimeConverter, DataTableSetting, ToolTip, SearchBar, ExportExcel } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { getStorage } from '../../../../../config';
import DocumentInformation from '../documents/documentInformation';
import ListDownload from '../../administration/list-data/listDownload';
import ListView from '../../administration/list-data/listView';


class DocumentCommon extends Component {
    constructor(props) {
        super(props);
        this.state = { option: 'name', value: '', limit: 5, page: 1 }
    }

    componentDidMount() {
        this.props.getAllRoles();
        this.props.getAllDepartments();
        this.props.getAllDocuments(getStorage('currentRole'));
        this.props.getAllDocuments(getStorage('currentRole'), { page: this.state.page, limit: this.state.limit });
        this.props.getUserDocumentStatistics('common');

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
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }
    findPath = (select) => {
        const archives = this.props.documents.administration.archives.list;
        let paths = select.map(s => {
            let archive = archives.filter(arch => arch._id === s);
            return archive[0] ? archive[0].path : "";
        })
        return paths;
    }
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
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

    findRole = (id) => {
        const listRole = this.props.role.list;
        let role = listRole.filter((role) => role._id === id);
        if (role && role.length)
            return role[0].name;
        else return "";
    }
    searchWithOption = async () => {
        let path = this.state.archive ? this.findPath(this.state.archive) : "";
        const data = {
            limit: this.state.limit,
            page: 1,
            name: this.state.name,
            category: this.state.category ? this.state.category[0] : "",
            domains: this.state.domain ? this.state.domain : "",
            archives: path && path.length ? path[0] : "",
        };
        await this.props.getAllDocuments(getStorage('currentRole'), data);
    }
    convertDataToExportData = (data) => {

        let newData = [];
        for (let i = 0; i < data.length; i++) {
            let element = {};
            let x = data[i];
            let length = 0;
            let domain = "";
            let length_domains, length_archives, length_relationship, length_roles, length_versions, length_logs, length_views, length_downloads;
            if (x.domains && x.domains.length) {
                element.domains = x.domains[0].name;
                length_domains = x.domains.length;
            } else {
                element.domains = "";
                length_domains = 0;
            }
            if (x.archives && x.archives.length) {
                element.archives = x.archives[0].path;
                length_archives = x.archives.length;
            } else {
                element.archives = "";
                length_archives = 0;
            }
            if (x.roles && x.roles.length) {
                element.roles = this.findRole(x.roles[0]);
                length_roles = x.roles.length;
            } else {
                element.roles = 0;
                length_roles = 0;
            }
            if (x.relationshipDocuments && x.relationshipDocuments.length) {
                element.relationshipDocuments = x.relationshipDocuments[0].name;
                length_relationship = x.relationshipDocuments.length;
            } else {
                element.relationshipDocuments = "";
                length_relationship = 0;
            }
            if (x.versions && x.versions.length) {
                element.versionName = x.versions[0].versionName;
                element.issuingDate = this.formatDate(x.versions[0].issuingDate);
                element.effectiveDate = this.formatDate(x.versions[0].effectiveDate);
                element.expiredDate = this.formatDate(x.versions[0].expiredDate);
                length_versions = x.versions.length;
            } else {
                element.versionName = "";
                element.issuingDate = "";
                element.effectiveDate = "";
                element.expiredDate = "";
                length_versions = 0;
            }
            if (x.views && x.views.length) {
                element.viewer = x.views[0].viewer.name;
                element.timeView = this.formatDate(x.views[0].time);
                length_views = x.views.length;
            } else {
                element.viewer = "";
                element.timeView = "";
                length_views = 0;
            }
            if (x.downloads && x.downloads.length) {
                element.downloader = x.downloads[0].downloader.name;
                element.timeDownload = this.formatDate(x.downloads[0].time);
                length_downloads = x.downloads.length;
            } else {
                element.downloader = "";
                element.timeDownload = "";
                length_downloads = 0;
            }
            if (x.logs && x.logs.length) {
                element.title = x.logs[0].title;
                element.description = x.logs[0].description;
                length_logs = x.logs.length;
            } else {
                element.title = "";
                element.descriptionLogs = "";
                length_logs = 0;
            }
            element.name = x.name;
            element.description = x.description ? x.description : "";
            element.issuingBody = x.issuingBody ? x.issuingBody : "";
            element.signer = x.signer ? x.signer : "";
            element.category = x.category ? x.category.name : "";
            element.relationshipDescription = x.relationshipDescription ? x.relationshipDescription : "";
            element.organizationUnitManager = x.organizationUnitManager ? x.organizationUnitManager.name : "";
            element.officialNumber = x.officialNumber ? x.officialNumber : "";
            let max_length = Math.max(length_domains, length_archives, length_relationship, length_roles, length_versions, length_logs, length_views, length_downloads);

            newData = [...newData, element];
            if (max_length > 1) {
                for (let i = 1; i < max_length; i++) {
                    let object = {
                        name: "",
                        description: "",
                        issuingBody: "",
                        signer: "",
                        category: "",
                        relationshipDescription: "",
                        organizationUnitManager: "",
                        officialNumber: "",
                        domains: i < length_domains ? x.domains[i].name : "",
                        archives: i < length_archives ? x.archives[i].path : "",
                        roles: i < length_roles ? this.findRole(x.roles[i]) : "",
                        relationshipDocuments: i < length_relationship ? x.relationshipDocuments[i].name : "",
                        versionName: i < length_versions ? x.versions[i].versionName : "",
                        issuingDate: i < length_versions ? this.formatDate(x.versions[i].issuingDate) : "",
                        effectiveDate: i < length_versions ? this.formatDate(x.versions[i].effectiveDate) : "",
                        expiredDate: i < length_versions ? this.formatDate(x.versions[i].expiredDate) : "",
                        viewer: i < length_views ? x.views[i].viewer.name : "",
                        timeView: i < length_views ? this.formatDate(x.views[i].time) : "",
                        downloader: i < length_downloads ? x.downloads[i].downloader.name : "",
                        timeDownload: i < length_downloads ? this.formatDate(x.downloads[i].time) : "",
                        title: i < length_logs ? x.logs[i].title : "",
                        descriptionLogs: i < length_logs ? x.logs[i].description : "",

                    }
                    newData = [...newData, object];
                }
            }


        }
        let exportData = {
            fileName: "Bảng thống kê tài liệu",
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: "Danh sách tài liệu",
                    tables: [
                        {
                            tableName: "Bảng thống kê tài liệu",
                            merges: [{
                                key: "Versions",
                                columnName: "Phiên bản",
                                keyMerge: 'versionName',
                                colspan: 3
                            }, {
                                key: "Views",
                                columnName: "Người đã xem",
                                keyMerge: 'viewer',
                                colspan: 2
                            }, {
                                key: "Downloads",
                                columnName: "Người đã tải",
                                keyMerge: 'downloader',
                                colspan: 2,
                            }, {
                                key: "Logs",
                                columnName: "Lịch sử chỉnh sửa",
                                keyMerge: 'title',
                                colspan: 2,
                            },
                            ],
                            rowHeader: 2,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên" },
                                { key: "description", value: "Mô tả" },
                                { key: "category", value: "Loai tài liệu" },
                                { key: "issuingBody", value: "Cơ quan ban hành" },
                                { key: "signer", value: "Người ký" },
                                { key: "relationshipDescription", value: "Mô tả liên kết" },
                                { key: "organizationUnitManager", value: "Cơ quan quản lí" },
                                { key: "domains", value: "Danh mục" },
                                { key: "archives", value: "Địa chỉ lưu trữ" },
                                { key: "roles", value: "Các chức danh được xem" },
                                { key: "versionName", value: "Tên phiên bản" },
                                { key: "issuingDate", value: "Ngày ban hành" },
                                { key: "effectiveDate", value: "Ngày hiệu lực" },
                                { key: "viewer", value: "Người đã xem" },
                                { key: "timeView", value: "Thời gian xem" },
                                { key: "downloader", value: "Người đã tải" },
                                { key: "timeDownload", value: "Người đã tải" },
                                { key: "title", value: "Tiêu đề chỉnh sửa" },
                                { key: "descriptionLogs", value: "Chỉnh sửa chi tiết" },

                            ],
                            data: newData
                        }
                    ]
                },
            ]
        }

        return exportData
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
        const { user } = this.props.documents;
        const { list, paginate } = user.data;
        const { downloaded, common, latest } = user;
        const { isLoading } = this.props.documents;
        const { currentRow } = this.state;
        let dataExport = [];
        if (isLoading === false) {
            dataExport = common;
        }
        let exportData = dataExport ? this.convertDataToExportData(dataExport) : "";
        return (
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
                        documentCategory={currentRow.category ? currentRow.category.name : ""}
                        documentDomains={currentRow.domains ? currentRow.domains.map(domain => domain.name) : []}
                        documentArchives={currentRow.archives ? currentRow.archives.map(archive => archive.path) : []}
                        documentIssuingBody={currentRow.issuingBody}
                        documentOfficialNumber={currentRow.officialNumber}
                        documentSigner={currentRow.signer}
                        documentVersions={currentRow.versions}

                        documentRelationshipDescription={currentRow.relationshipDescription}
                        documentRelationshipDocuments={currentRow.relationshipDocuments ? currentRow.relationshipDocuments.map(document => document.name) : []}

                        documentRoles={currentRow.roles}

                        documentArchivedRecordPlaceInfo={currentRow.archivedRecordPlaceInfo}
                        documentArchivedRecordPlaceOrganizationalUnit={currentRow.archivedRecordPlaceOrganizationalUnit}
                        documentArchivedRecordPlaceManager={currentRow.archivedRecordPlaceManager}
                        documentLogs={currentRow.logs}
                    />
                }
                {<ExportExcel id="export-document-downloaded" exportData={exportData} style={{ marginLeft: 5 }} />}
                <SearchBar
                    columns={[
                        { title: translate('document.name'), value: 'name' },
                        { title: translate('document.description'), value: 'description' }
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
                <table className="table table-hover table-striped table-bordered" id="table-manage-user-document-downloaded">
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
                            common && common.length > 0 ?
                                common.map(doc =>
                                    <tr key={doc._id}>
                                        <td>{doc.name}</td>
                                        <td>{doc.description}</td>
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
                                        <td style={{ width: '10px' }}>
                                            <a className="text-green" title={translate('document.edit')} onClick={() => this.toggleDocumentInformation(doc)}><i className="material-icons">visibility</i></a>
                                        </td>
                                    </tr>) :
                                isLoading ?
                                    <tr><td colSpan={10}>{translate('general.loading')}</td></tr> : <tr><td colSpan={10}>{translate('general.no_data')}</td></tr>
                        }

                    </tbody>
                </table>

            </React.Fragment>
        );
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
    getUserDocumentStatistics: DocumentActions.getUserDocumentStatistics
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DocumentCommon));