import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import { DataTableSetting, DateTimeConverter, PaginateBar, TreeSelect, SelectBox, ExportExcel } from '../../../../../common-components';
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
        this.props.getAllDocuments();
        this.props.getAllDocuments({ page: this.state.page, limit: this.state.limit });
        this.props.getAllRoles();
        this.props.getAllDepartments();
        this.props.getDocumentDomains();
        this.props.getDocumentArchive();
        this.props.getDocumentCategories();
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
    checkHasComponent = (name) => {
        let { auth } = this.props;
        let result = false;
        auth.components.forEach(component => {
            if (component.name === name) result = true;
        });

        return result;
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
            datas = [...datas, out];
            for (let j = 1; j < leng; j++) {
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
                datas = [...datas, out];
            }
        }
        let exportData = {
            fileName: "Bảng thống kê tài liệu",
            dataSheets: [
                {
                    sheetName: "sheet1",
                    tables: [
                        {
                            tableName: "Bảng thống kê tài liệu",
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
                                { key: "officialNumber", value: "Số hiệu" },
                                { key: "category", value: "Loai tài liệu" },
                                { key: "description", value: "Mô tả" },
                                { key: "signer", value: "Người ký" },
                                { key: "domain", value: "Danh mục" },
                                { key: "issuingBody", value: "Cơ quan ban hành" },
                                { key: "versionName", value: "Tên phiên bản" },
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
        const docs = this.props.documents.administration.data;
        const { domains, categories, archives } = this.props.documents.administration;
        const { paginate } = docs;
        const { isLoading } = this.props.documents;
        const { currentRow, archive, category } = this.state;
        const listDomain = domains.list
        const listCategory = this.convertData(categories.list)
        const listArchive = archives.list;
        console.log('tttt', currentRow);
        let list = [];
        if (isLoading === false) {
            list = docs.list;
        }
        let exportData = this.convertDataToExportData(list);
        return (
            <div className="qlcv">
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
                        documentCategory={currentRow.category ? currentRow.category._id : ""}
                        documentDomains={currentRow.domains.map(domain => domain._id)}
                        documentArchives={currentRow.archives.map(archive => archive._id)}
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

                {<ExportExcel id="export-document" exportData={exportData} style={{ marginRight: 5, marginTop: 2 }} />}
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
            // key: this.state.option,
            // value: this.state.value,
            name: this.state.name,
            category: this.state.category[0],
            domains: this.state.domain[0],
            archives: this.state.archive[0],
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
    getDocumentDomains: DocumentActions.getDocumentDomains,
    getDocumentCategories: DocumentActions.getDocumentCategories,
    getDocumentArchive: DocumentActions.getDocumentArchive,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Table));