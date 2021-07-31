import React, { Component, useEffect, useMemo, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import { DataTableSetting, DateTimeConverter, PaginateBar, TreeSelect, SelectBox, ExportExcel, SmartTable } from '../../../../../common-components';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import DocumentInformation from '../../user/documents/documentInformation';
import { DocumentActions } from '../../../redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import CreateForm from './createForm';
import EditForm from './editForm';
import ListView from './listView';
import ListDownload from './listDownload';
import FilePreview from '../../../components/administration/list-data/FilePreview';


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

function Table(props) {
    const TableId = "table-manage-document-list";
    const defaultConfig = { limit: 5 }
    const Limit = getTableConfiguration(TableId, defaultConfig).limit;
    const [state, setState] = useState({
        tableId: TableId,
        category: "",
        archive: "",
        name: "",
        option: {
            category: "",
            domain: "",
            archive: "",
        },
        limit: Limit,
        page: 1
    })
    useEffect(() => {
        const currentPage = window.location.pathname;
        // props.getAllDocuments({ calledId: "all", by: currentPage === '/documents/organizational-unit' ? 'organizational-unit' : undefined });
        props.getAllDocuments({ page: state.page, limit: state.limit, calledId: "paginate", by: currentPage === '/documents/organizational-unit' ? 'organizational-unit' : undefined });

        props.getAllDocuments({ page: state.page, limit: state.limit, calledId: "relationshipDocs", by: currentPage === '/documents/organizational-unit' ? 'organizational-unit' : undefined });
        props.getAllRoles();
        props.getAllDepartments();
        props.getDocumentDomains();
        props.getDocumentArchive();
        props.getDocumentCategories();
        props.getAllUser();
    }, [])

    const toggleEditDocument = async (data) => {
        await setState({
            ...state,
            currentRow: data
        });
        window.$('#modal-edit-document').modal('show');
        props.increaseNumberView(data._id)
    }

    function requestDownloadDocumentFile(id, fileName, numberVersion) {
        props.downloadDocumentFile(id, fileName, numberVersion);
    }

    function requestDownloadDocumentFileScan(id, fileName, numberVersion) {
        props.downloadDocumentFileScan(id, fileName, numberVersion);
    }


    function deleteDocument(id, info) {
        const { translate } = props;
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
                props.deleteDocument(id);
            }
        })
    }
    const toggleDocumentInformation = async (data) => {
        await setState({
            ...state,
            currentRow: data
        });
        window.$('#modal-information-user-document').modal('show');
        props.increaseNumberView(data._id)
    }
    const showDetailListView = async (data) => {
        await setState({
            ...state,
            currentRow: data,
        });
        window.$('#modal-list-view').modal('show');
    }
    const showDetailListDownload = async (data) => {
        await setState({
            ...state,
            currentRow: data,
        })
        window.$('#modal-list-download').modal('show');
    }

    const showFilePreview = async (data) => {

        await setState({
            ...state,
            currentFile: data,
        });
        window.$('#modal-file-preview').modal('show');
    }

    const checkHasComponent = (name) => {
        let { auth } = props;
        let result = false;
        auth.components.forEach(component => {
            if (component.name === name) result = true;
        });

        return result;
    }
    function handleCategoryChange(value) {
        setState({
            ...state,
            category: value,
        })
    }
    function handleDomainChange(value) {
        setState({
            ...state,
            domain: value,
        })
    }

    function handleNameChange(e) {
        const value = e.target.value;
        setState({
            ...state,
            name: value.trim(),
        })
    }
    function handleIssuingBodyChange(e) {
        const value = e.target.value;
        setState({
            ...state,
            issuingBody: value.trim(),
        })
    }
    function handleArchivedRecordPlaceOrganizationalUnit(value) {
        setState({
            ...state,
            organizationUnit: value,
        })
    }
    function handleArchiveChange(value) {
        setState({
            ...state,
            archive: value,
        })
    }

    function handleIssuingBodyChange(e) {
        const { value } = e.target;
        setState({
            ...state,
            issuingBody: value,
        })
    }

    function formatDate(date, monthYear = false) {
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

    const convertData = (data) => {
        let array = data.map(item => {
            return {
                value: item._id,
                text: item.name,
            }
        })
        array.unshift({ value: "", text: "Tất cả các loại" });
        return array;
    }
    const findRole = (id) => {
        const listRole = props.role.list;
        let role = listRole.filter((role) => role._id === id);
        if (role && role.length)
            return role[0].name;
        else return "";
    }
    const convertDataToExportData = (data) => {

        let newData = [];
        for (let i = 0; i < data.length; i++) {
            let element = {};
            let x = data[i];
            let length_domains, length_archives, length_relationship, length_roles, length_versions, length_logs,
                length_views, length_downloads;
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
                element.roles = findRole(x.roles[0]);
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
                element.issuingDate = formatDate(x.versions[0].issuingDate);
                element.effectiveDate = formatDate(x.versions[0].effectiveDate);
                element.expiredDate = formatDate(x.versions[0].expiredDate);
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
                element.timeView = formatDate(x.views[0].time);
                length_views = x.views.length;
            } else {
                element.viewer = "";
                element.timeView = "";
                length_views = 0;
            }
            if (x.downloads && x.downloads.length) {
                element.downloader = x.downloads[0].downloader.name;
                element.timeDownload = formatDate(x.downloads[0].time);
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
            let max_length = Math.max(length_domains, length_archives, length_relationship,
                length_roles, length_versions, length_logs, length_views, length_downloads);

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
                        roles: i < length_roles ? findRole(x.roles[i]) : "",
                        relationshipDocuments: i < length_relationship ? x.relationshipDocuments[i].name : "",
                        versionName: i < length_versions ? x.versions[i].versionName : "",
                        issuingDate: i < length_versions ? formatDate(x.versions[i].issuingDate) : "",
                        effectiveDate: i < length_versions ? formatDate(x.versions[i].effectiveDate) : "",
                        expiredDate: i < length_versions ? formatDate(x.versions[i].expiredDate) : "",
                        viewer: i < length_views ? x.views[i].viewer.name : "",
                        timeView: i < length_views ? formatDate(x.views[i].time) : "",
                        downloader: i < length_downloads ? x.downloads[i].downloader.name : "",
                        timeDownload: i < length_downloads ? formatDate(x.downloads[i].time) : "",
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
                                { key: "domains", value: "Lĩnh vực" },
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
    const setPage = async (page) => {
        const currentPage = window.location.pathname;
        setState({
            ...state,
            page: page
        });
        const data = {
            limit: state.limit,
            page: page,
            calledId: "paginate", by: currentPage === '/documents/organizational-unit' ? 'organizational-unit' : undefined
        };
        await props.getAllDocuments(data);
    }

    const findPath = (select) => {
        const archives = props.documents.administration.archives.list;
        let paths = select.map(s => {
            let archive = archives.filter(arch => arch._id === s);
            return archive[0] ? archive[0].path : "";
        })
        return paths;

    }
    const setLimit = (number) => {
        const currentPage = window.location.pathname;
        if (state.limit !== number) {
            setState({
                ...state,
                limit: number
            });
            const data = { limit: number, page: state.page, calledId: "paginate", by: currentPage === '/documents/organizational-unit' ? 'organizational-unit' : undefined };
            props.getAllDocuments(data);
        }
    }

    const searchWithOption = async () => {
        const currentPage = window.location.pathname;
        let path = state.archive ? findPath(state.archive) : "";
        const data = {
            limit: state.limit,
            page: 1,
            name: state.name,
            category: state.category ? state.category[0] : "",
            domains: state.domain ? state.domain : "",
            archives: path && path.length ? path : "",
            issuingBody: state.issuingBody ? state.issuingBody : "",
            organizationUnit: state.organizationUnit ? state.organizationUnit : "",
            calledId: "paginate", by: currentPage === '/documents/organizational-unit' ? 'organizational-unit' : undefined
        };
        await props.getAllDocuments(data);
    }

    /**
     * 
     * @param {duong dan file} data 
     * check xem file co phai anh hay pdf khong
     */
    const checkTypeFile = (data) => {
        if (typeof data === 'string' || data instanceof String) {
            let index = data.lastIndexOf(".");
            let typeFile = data.substring(index + 1, data.length);
            if (typeFile === "pdf" || typeFile === "png" || typeFile === "jpg" || typeFile === "jpeg") {
                return true;
            }
            else return false;
        }
        else return false;
    }


    const { translate, documents, department } = props;
    const { domains, categories, archives } = props.documents.administration;
    const { isLoading } = props.documents;
    const docs = props.documents.administration.data;

    const { currentRow, archive, domain, category, currentFile, tableId } = state;
    const { paginate } = docs;

    const listDomain = domains.list
    const listArchive = archives.list;
    const listCategory = convertData(categories.list)
    let list = [];
    if (isLoading === false) {
        list = docs.paginate;
    }
    let exportData = list ? convertDataToExportData(list) : "";
    if (currentRow) {
        let index = paginate.findIndex(value => value._id === currentRow._id)
        if (index !== -1) {
            if (currentRow.versions.length !== paginate[index].versions.length) {
                setState({
                    ...state,
                    currentRow: paginate[index]
                })
            }
        }
    }

    const getDataCheck = (data) => {

        if (data?.length && paginate?.length) {
            const getDocumentSelected = paginate.filter(x => data.some(y => y === x._id));
            let results = [];
            if (getDocumentSelected?.length)
                getDocumentSelected.forEach(x => {
                    let versions = [];
                    x?.versions?.length && x.versions.forEach(y => {
                        let child = {
                            childFolder: y?.versionName,
                        }
                        if (y?.scannedFileOfSignedDocument || y?.file)
                            child = {
                                ...child,
                                file: y?.file,
                                scannedFileOfSignedDocument: y?.scannedFileOfSignedDocument
                            }
                        versions = [...versions, child]
                    })

                    results = [
                        ...results,
                        {
                            folderName: x.name,
                            versions: versions
                        }
                    ]
                })
            if (results?.length)
                setState({
                    ...state,
                    results
                })
            console.log('results', results);
        }
    }

    const handleDownloadAllFileOfDocument = () => {
        props.downloadAllFileOfDocument(state.results);
    }

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
                currentFile &&
                <FilePreview
                    file={currentFile}
                />
            }
            {
                currentRow &&
                <EditForm
                    documentId={currentRow._id}
                    documentName={currentRow.name}
                    documentDescription={currentRow.description}
                    documentCategory={currentRow.category ? currentRow.category._id || currentRow.category : ""}
                    documentDomains={currentRow.domains ? currentRow.domains.map(domain => domain._id || domain) : []}
                    documentArchives={currentRow.archives ? currentRow.archives.map(archive => archive._id || archive) : []}
                    documentIssuingBody={currentRow.issuingBody}
                    documentOfficialNumber={currentRow.officialNumber}
                    documentSigner={currentRow.signer}
                    documentVersions={currentRow.versions}

                    documentRelationshipDescription={currentRow.relationshipDescription}
                    documentRelationshipDocuments={currentRow.relationshipDocuments ? currentRow.relationshipDocuments.map(relationshipDocument => relationshipDocument._id || relationshipDocument) : []}

                    documentRoles={currentRow.roles}
                    documentUserCanView={currentRow.userCanView}
                    documentArchivedRecordPlaceInfo={currentRow.archivedRecordPlaceInfo}
                    organizationUnit={currentRow.archivedRecordPlaceOrganizationalUnit ? currentRow.archivedRecordPlaceOrganizationalUnit._id : ""}
                    documentArchivedRecordPlaceManager={currentRow.archivedRecordPlaceManager}

                />

            }
            {
                currentRow &&
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
                    documentUserCanView={currentRow.userCanView}

                    documentArchivedRecordPlaceInfo={currentRow.archivedRecordPlaceInfo}
                    organizationUnit={currentRow.archivedRecordPlaceOrganizationalUnit}
                    documentArchivedRecordPlaceManager={currentRow.archivedRecordPlaceManager}
                    documentLogs={currentRow.logs}
                />
            }

            <ExportExcel id="export-document" exportData={exportData} style={{ marginRight: 5 }} buttonName={translate('document.export')} />
            <div className="form-inline">
                <div className="form-group">
                    <label>{translate('document.category')}</label>
                    <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                        id={`stattus-category`}
                        style={{ width: "100%" }}
                        items={listCategory}
                        onChange={handleCategoryChange}
                        value={category}
                    />
                </div>
                <div className="form-group" >
                    <label>{translate('document.store.information')}</label>
                    <TreeSelect
                        id="tree-select-search-archive"
                        data={listArchive}
                        className="form-control"
                        handleChange={handleArchiveChange}
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
                        id="tree-select-search-domain"
                        data={listDomain}
                        className="form-control"
                        handleChange={handleDomainChange}
                        value={domain}
                        mode="hierarchical"
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="form-group">
                    <label>{translate('document.name')}</label>
                    <input type="text" className="form-control" onChange={handleNameChange} />
                </div>

            </div>

            <div className="form-inline">
                <div className="form-group">
                    <label>{translate('document.store.organizational_unit_manage')}</label>
                    <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                        id="select-documents-organizational-unit-manage-table"
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={department.list.map(organ => { return { value: organ._id, text: organ.name } })}
                        onChange={handleArchivedRecordPlaceOrganizationalUnit}
                        options={{ placeholder: translate('document.store.select_organizational') }}
                        multiple={false}
                    />
                </div>
                <div className="form-group">
                    <label>{translate('document.doc_version.issuing_body')}</label>
                    <input type="text" className="form-control" onChange={handleIssuingBodyChange} />
                </div>
                <div className="form-group" style={{ marginLeft: 0 }}>
                    <button type="button" className="btn btn-success" onClick={() => searchWithOption()}>{
                        translate('kpi.organizational_unit.management.over_view.search')}</button>
                </div>
                {state?.results?.length > 0 && <button type="button" className="btn btn-success pull-right" title={'Tải xuống các tệp đính kèm trong tài liệu'} onClick={handleDownloadAllFileOfDocument}><i className="fa fa-download" style={{ marginRight: 5 }} aria-hidden="true"></i>Tải file đính kèm</button>}
            </div>

            <SmartTable
                tableId={tableId}
                columnData={{
                    issuing_body: translate('document.doc_version.issuing_body'),
                    name: translate('document.name'),
                    description: translate('document.description'),
                    issuing_date: translate('document.issuing_date'),
                    effective_date: translate('document.effective_date'),
                    expired_date: translate('document.expired_date'),
                    upload_file: translate('document.upload_file'),
                    upload_file_scan: translate('document.upload_file_scan'),
                    views: translate('document.views'),
                    downloads: translate('document.downloads')
                }}
                tableHeaderData={{
                    issuing_body: <th>{translate('document.doc_version.issuing_body')}</th>,
                    name: <th>{translate('document.name')}</th>,
                    description: <th>{translate('document.description')}</th>,
                    issuing_date: <th>{translate('document.issuing_date')}</th>,
                    effective_date: <th>{translate('document.effective_date')}</th>,
                    expired_date: <th>{translate('document.expired_date')}</th>,
                    upload_file: <th>{translate('document.upload_file')}</th>,
                    upload_file_scan: <th>{translate('document.upload_file_scan')}</th>,
                    views: <th>{translate('document.views')}</th>,
                    downloads: <th>{translate('document.downloads')}</th>,
                    action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                }}
                tableBodyData={
                    paginate && paginate.length > 0 && paginate.map(doc => ({
                        id: doc._id,
                        issuing_body: <td>{doc?.issuingBody}</td>,
                        name: <td>{doc?.name}</td>,
                        description: <td>{doc?.description ? doc.description : ""}</td>,
                        issuing_date: <td>{doc?.versions?.length ? formatDate(doc?.versions?.[doc?.versions?.length - 1]?.issuingDate) : null}</td>,
                        effective_date: <td>{doc?.versions?.length ? formatDate(doc?.versions?.[doc?.versions?.length - 1]?.effectiveDate) : null}</td>,
                        expired_date: <td>{doc?.versions?.length ? formatDate(doc?.versions?.[doc?.versions?.length - 1]?.expiredDate) : null}</td>,
                        upload_file: <td>
                            <a href="#" onClick={() => requestDownloadDocumentFile(doc._id, doc.name, doc.versions.length - 1)}>
                                <u>{doc?.versions?.length && doc?.versions?.[doc?.versions?.length - 1]?.file ? <i className="fa fa-download"></i> : ""}</u>
                            </a>

                            <a href="#" onClick={() => showFilePreview(doc.versions.length && doc.versions[doc.versions.length - 1].file)}>
                                <u>{doc?.versions?.length && doc?.versions?.[doc?.versions?.length - 1]?.file && checkTypeFile(doc?.versions?.[doc?.versions?.length - 1]?.file) ?
                                    <i className="fa fa-eye"></i> : ""}</u>
                            </a>
                        </td>,
                        upload_file_scan: <td>
                            <a href="#" onClick={() => requestDownloadDocumentFileScan(doc._id, "SCAN_" + doc.name, doc.versions.length - 1)}>
                                <u>{doc?.versions?.length && doc?.versions?.[doc?.versions?.length - 1]?.scannedFileOfSignedDocument ? <i className="fa fa-download"></i> : ""}</u>
                            </a>
                            <a href="#" onClick={() => showFilePreview(doc?.versions?.length && doc?.versions?.[doc?.versions?.length - 1]?.scannedFileOfSignedDocument)}>
                                <u>{doc?.versions?.length && doc?.versions?.[doc?.versions?.length - 1]?.scannedFileOfSignedDocument && checkTypeFile(doc?.versions?.[doc?.versions?.length - 1]?.scannedFileOfSignedDocument) ?
                                    <i className="fa fa-eye"></i> : ""}</u>
                            </a>
                        </td>,
                        views: <td>
                            <a href="#modal-file-preview`" onClick={() => showDetailListView(doc)}>{doc?.numberOfView}</a>
                        </td>,
                        downloads: <td>
                            <a href="#modal-list-download" onClick={() => showDetailListDownload(doc)}>{doc?.numberOfDownload}</a>
                        </td>,
                        action: <td>
                            <a className="text-green" title={translate('document.view')} onClick={() => toggleDocumentInformation(doc)}>
                                <i className="material-icons">visibility</i>
                            </a>
                            <a className="text-yellow" title={translate('document.edit')} onClick={() => toggleEditDocument(doc)}>
                                <i className="material-icons">edit</i>
                            </a>
                            <a className="text-red" title={translate('document.delete')} onClick={() => deleteDocument(doc?._id, doc?.name)}>
                                <i className="material-icons">delete</i>
                            </a>
                        </td>
                    }))
                }
                dataDependency={paginate}
                onSetNumberOfRowsPerpage={setLimit}
                onSelectedRowsChange={getDataCheck}
            />
            {
                isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    paginate && paginate.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
            <PaginateBar pageTotal={docs?.totalPages} currentPage={docs?.page} func={setPage} />
        </div>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments,
    getAllRoles: RoleActions.get,
    getAllDepartments: DepartmentActions.get,
    downloadDocumentFile: DocumentActions.downloadDocumentFile,
    downloadAllFileOfDocument: DocumentActions.downloadAllFileOfDocument,
    downloadDocumentFileScan: DocumentActions.downloadDocumentFileScan,
    increaseNumberView: DocumentActions.increaseNumberView,
    deleteDocument: DocumentActions.deleteDocument,
    getDocumentDomains: DocumentActions.getDocumentDomains,
    getDocumentCategories: DocumentActions.getDocumentCategories,
    getDocumentArchive: DocumentActions.getDocumentArchive,
    getAllUser: UserActions.get,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Table));