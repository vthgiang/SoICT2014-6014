import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DateTimeConverter, DataTableSetting, ToolTip, SearchBar, ExportExcel } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { getStorage } from '../../../../../config';
import DocumentInformation from './documentInformation';

class DocumentDownloaded extends Component {
    constructor(props) {
        super(props);
        this.state = { option: 'name', value: '', limit: 5, page: 1 }
    }

    componentDidMount() {
        this.props.getAllRoles();
        this.props.getAllDepartments();
        this.props.getAllDocuments(getStorage('currentRole'));
        this.props.getAllDocuments(getStorage('currentRole'), { page: this.state.page, limit: this.state.limit });
        this.props.getUserDocumentStatistics('downloaded');
        this.props.getUserDocumentStatistics('common');
        this.props.getUserDocumentStatistics('latest');
    }

    toggleDocumentInformation = async (data) => {
        await this.setState({
            currentRow: data
        });
        window.$('#modal-document-information-statistics').modal('show');
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
    searchWithOption = async () => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getAllDocuments(getStorage('currentRole'), data);
    }
    convertDataToExportData = (data) => {
        console.log(data);
        let datas = [];
        for (let i = 0; i < data.length; i++) {
            let x = data[i];
            let domain = "";
            let leng = x.versions.length > x.domains.length ? x.versions.length : x.domains.length;
            if (x.domains.length > 0) {
                domain = x.domains[0].name;
            }
            let out = {
                STT: i + 1,
                name: x.name,
                description: x.description,
                versionName: x.versions[0].versionName,
                domain: domain,
                issuingDate: new Date(x.versions[0].issuingDate),
                effectiveDate: new Date(x.versions[0].effectiveDate),
                expiredDate: new Date(x.versions[0].expiredDate),
                numberOfView: x.numberOfView,
                numberOfDownload: x.numberOfDownload,
                issuingBody: x.issuingBody,
                signer: x.signer,
                officialNumber: x.officialNumber,
                category: x.category.description,
            }
            datas = [...datas, out] ;
            for ( let  j = 1; j < leng; j++) {
                let versionName = "", issuingDate = "", effectiveDate = "", expiredDate = "", domain = "";
                if (x.versions[j]) {
                    versionName = x.versions[j].versionName;
                    issuingDate = new Date(x.versions[j].issuingDate);
                    effectiveDate = new Date(x.versions[j].effectiveDate);
                    expiredDate = new Date(x.versions[j].expiredDate);
                }
                if (x.domains[j]) {
                    domain = x.domains[j].name;
                }
                out = {
                STT: "",
                name: "",
                description: "",
                domain: domain,
                versionName: versionName,
                issuingDate: issuingDate,
                effectiveDate: effectiveDate,
                expiredDate: expiredDate,
                numberOfView: "",
                numberOfDownload: "",
                issuingBody: "",
                signer: "",
                officialNumber: "",
                categor: "",
                }
                datas = [...datas, out] ;
            }
        }
        let exportData = {
            fileName: "Bảng thống kê tài liệu download",
            dataSheets: [
                {
                    sheetName: "sheet1",
                    tables: [
                        {
                            tableName: "Bảng thống kê tài liệu download",
                            merges: [{
                                key: "Vesions",
                                columnName: "Phiên bản",
                                keyMerge: 'versionName',
                                colspan: 4
                            }, {
                                key: "Infomation",
                                columnName: "Thông tin chung",
                                keyMerge: 'name',
                                colspan: 7
                            }],
                            rowHeader: 2,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên" },
                                { key: "officialNumber", value: "Số hiệu"},
                                { key: "category", value: "Loai tài liệu"},
                                { key: "description", value: "Mô tả" },
                                { key: "signer", value: "Người ký"},
                                { key: "domain", value: "Danh mục"},
                                { key: "issuingBody", value: "Cơ quan ban hành"},
                                { key: "versionName", value: "Tên phiên bản"},
                                { key: "issuingDate", value: "Ngày ban hành" },
                                { key: "effectiveDate", value: "Ngày áp dụng" },
                                { key: "expiredDate", value: "Ngày hết hạn" },
                                { key: "numberOfView", value: "Số lần xem" },
                                { key: "numberOfDownload", value: "Số lần download" },
                            ],
                            data: datas
                        }
                    ]
                },
            ]
        }
        console.log(exportData);
        return exportData
    }
    render() {
        const { translate } = this.props;
        const { user } = this.props.documents;
        const { list, paginate } = user.data;
        const { downloaded, common, latest } = user;
        const { isLoading } = this.props.documents;
        const { currentRow } = this.state;
        console.log(downloaded);
        let dataExport = [];
        if (isLoading === false) {
            dataExport = downloaded;
        }
        let exportData = this.convertDataToExportData(dataExport);
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
                            downloaded.length > 0 ?
                                downloaded.map(doc =>
                                    <tr key={doc._id}>
                                        <td>{doc.name}</td>
                                        <td>{doc.description}</td>
                                        <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].issuingDate} type="DD-MM-YYYY" /></td>
                                        <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].effectiveDate} type="DD-MM-YYYY" /></td>
                                        <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].expiredDate} type="DD-MM-YYYY" /></td>
                                        <td><a href="#" onClick={() => this.requestDownloadDocumentFile(doc._id, doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                        <td><a href="#" onClick={() => this.requestDownloadDocumentFileScan(doc._id, "SCAN_" + doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                        <td>{doc.numberOfView}<ToolTip type="latest_history" dataTooltip={doc.views.map(view => {
                                            return (
                                                <React.Fragment>
                                                    {view.viewer + ", "} <DateTimeConverter dateTime={view.time} />
                                                </React.Fragment>
                                            )
                                        })} /></td>
                                        <td>{doc.numberOfDownload}<ToolTip type="latest_history" dataTooltip={doc.downloads.map(download => {
                                            return (
                                                <React.Fragment>
                                                    {download.downloader + ", "} <DateTimeConverter dateTime={download.time} />
                                                </React.Fragment>
                                            )
                                        })} /></td>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DocumentDownloaded));