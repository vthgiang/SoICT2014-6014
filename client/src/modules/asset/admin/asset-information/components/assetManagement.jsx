import React, { Component, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti, ExportExcel, TreeSelect } from '../../../../../common-components';

import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { AssetManagerActions } from '../redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { RoleActions } from '../../../../super-admin/role/redux/actions';

import { AssetCreateForm, AssetDetailForm, AssetEditForm, AssetImportForm } from './combinedContent';
import qs from 'qs';
import { getFormatDateFromTime, getPropertyOfValue } from '../../../../../helpers/stringMethod';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
function AssetManagement(props) {
    const tableId_constructor = "table-asset-manager";
    const defaultConfig = { limit: 5 }
    const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId_constructor,
        code: "",
        assetName: "",
        purchaseDate: null,
        disposalDate: null,
        status: window.location.search ? [qs.parse(window.location.search, { ignoreQueryPrefix: true }).status] : ["ready_to_use", "in_use", "broken", "lost", "disposed"],
        group: ["building", "vehicle", "machine", "other"],
        handoverUnit: "",
        handoverUser: "",
        typeRegisterForUse: ["1", "2", "3"],
        page: 0,
        limit: limit_constructor,
        managedBy: props.managedBy ? props.managedBy : ''
    })

    const { assetsManager, assetType, translate, user, isActive, department } = props;
    const { page, limit, currentRowView, status, currentRow, purchaseDate, disposalDate, managedBy, location, tableId, group, typeRegisterForUse } = state;

    useEffect(() => {
        props.getAllAsset(state);
        props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        props.getListBuildingAsTree();
        props.getUser();
        props.getAllDepartments();
        props.getAllRoles();
    }, [])

    // Function format ngày hiện tại thành dạnh mm-yyyy
    const formatDate2 = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return [month, year].join('-');
    }

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) => {
        if (!date) return null;
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    // Bắt sự kiện click xem thông tin tài sản
    const handleView = async (value) => {
        await setState({
            ...state,
            currentRowView: value
        });
        window.$('#modal-view-asset').modal('show');
    }

    // Bắt sự kiện click chỉnh sửa thông tin tài sản
    const handleEdit = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-asset').modal('show');
    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    const handleCodeChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });

    }

    // Function lưu giá trị tên tài sản vào state khi thay đổi
    const handleAssetNameChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });
    }

    // Function lưu giá trị tháng vào state khi thay đổi
    const handlePurchaseMonthChange = async (value) => {
        if (!value) {
            value = null
        }

        await setState({
            ...state,
            purchaseDate: value
        });
    }

    // Function lưu giá trị tháng vào state khi thay đổi
    const handleDisposalMonthChange = async (value) => {
        if (!value) {
            value = null
        }

        await setState({
            ...state,
            disposalDate: value
        });
    }

    // Function lưu giá trị loại tài sản vào state khi thay đổi
    const handleAssetTypeChange = (value) => {
        setState(state => {
            return {
                ...state,
                assetType: value.length !== 0 ? JSON.stringify(value) : null,
            }
        })
    }

    // Bắt sự kiện thay đổi nhóm tài sản
    const handleGroupChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        setState({
            ...state,
            group: value
        })
    }

    // Function lưu giá trị status vào state khi thay đổi
    const handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        setState({
            ...state,
            status: value
        })
    }

    // Function lưu giá trị vị trí vào state khi thay đổi
    const handleLocationChange = async (value) => {

        await setState(state => {
            return {
                ...state,
                location: value.length !== 0 ? value[0] : null,
            }
        });
    }

    // Function lưu giá trị quyền đăng kí vào state khi thay đổi
    const handleTypeRegisterForUseChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        setState({
            ...state,
            typeRegisterForUse: value
        })
    }

    // Function lưu giá trị người sử dụng vào state khi thay đổi
    const handleHandoverUserChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });

    }

    // Function lưu giá trị đơn vị sử dụng vào state khi thay đổi
    const handleHandoverUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        setState({
            ...state,
            handoverUnit: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    const handleSubmitSearch = async () => {
        await setState({
            ...state,
            page: 0,
        });
        props.getAllAsset({ page: 0, ...state });
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    const setLimit = async (number) => {
        await setState({
            ...state,
            limit: parseInt(number),
        });
        props.getAllAsset({ ...state, limit: parseInt(number) });
    }

    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * state.limit;
        await setState({
            ...state,
            page: parseInt(page),
        });

        props.getAllAsset({ ...state, page });
    }

    const getAssetTypesList = (types) => {
        let list = types.reduce((list, cur) => {
            return list ? list + ', ' + cur.typeName : cur.typeName;
        }, '');
        return list;
    }

    const getNumber = (number) => {
        return number ? number : '';
    }

    const getAssetDepreciationType = (type) => {
        const { translate } = props;
        switch (type) {
            case 'straight_line':
                return translate('asset.depreciation.line');
            case 'declining_balance':
                return translate('asset.depreciation.declining_balance');
            case 'units_of_production':
                return translate('asset.depreciation.units_production');
            default:
                return '';
        }
    }

    const getIncidentType = (type) => {
        const { translate } = props;
        if (Number(type) === 1) {
            return translate('asset.general_information.damaged');
        } else if (Number(type) === 2) {
            return translate('asset.general_information.lost');
        } else {
            return null;
        }
    }

    const getIncidentStatus = (status) => {
        const { translate } = props;
        if (Number(status) === 1) {
            return translate('asset.general_information.waiting');
        } else if (Number(status) === 2) {
            return translate('asset.general_information.processed')
        } else return null;
    }

    const gettDisposalType = (type) => {
        const { translate } = props;

        if (type === '1') {
            return translate('asset.asset_info.destruction');
        }
        else if (type === '2') {
            return translate('asset.asset_info.sale')
        }
        else if (type === '3') {
            return translate('asset.asset_info.give')
        }
        else {
            return ''
        }
    }

    const getCostNumber = (number) => {
        if (!number) return '';
        else return new Intl.NumberFormat().format(number);
    }

    const convertDataToExportData = (data, assettypelist, userlist) => {
        const organizationalUnitList = props.department.list;
        let fileName = "File export tài sản";
        let length = 0;
        let exportThongTinChung = [];
        let exportKhauHao = [];
        let exportSuDung = [];
        let exportSuCo = [];
        let exportBaoTriSuaChua = [];
        let exportThanhLy = [];

        if (data) {
            data.forEach((x, index) => {

                // Dữ liệu tab thông tin chung
                let code = x.code;
                let name = x.assetName;
                let description = x.description;
                let group = convertGroupAsset(x.group);
                let type = x.assetType && getAssetTypesList(x.assetType);
                let purchaseDate = getFormatDateFromTime(x.purchaseDate, 'dd-mm-yyyy');
                let disposalDate = getFormatDateFromTime(x.disposalDate, 'dd-mm-yyyy');
                let manager = getPropertyOfValue(x.managedBy, 'email', false, userlist);
                let assigner = getPropertyOfValue(x.assignedToUser, 'email', false, userlist);
                let status = formatStatus(x.status);
                length = x.detailInfo && x.detailInfo.length;
                let info = (length) ? (x.detailInfo.map((item, index) => {
                    return {
                        infoName: item.nameField,
                        value: item.value
                    }
                })) : "";
                let infoName = info[0] ? info[0].infoName : "";
                let value = length ? (info[0].value) : "";

                exportThongTinChung = [...exportThongTinChung, {
                    index: index + 1,
                    code,
                    name,
                    group,
                    description,
                    type,
                    purchaseDate,
                    disposalDate,
                    manager,
                    assigner,
                    status,
                    infoName,
                    value
                }];
                if (length > 1) {
                    for (let i = 1; i < length; i++) {
                        exportThongTinChung = [...exportThongTinChung, {
                            index: "",
                            code: "",
                            group: "",
                            name: "",
                            description: "",
                            type: "",
                            purchaseDate: "",
                            disposalDate: "",
                            manager: "",
                            assigner: "",
                            status: "",
                            infoName: info[i].infoName,
                            value: info[i].value
                        }];
                    }
                }

                // Dữ liệu tab khấu hao
                let cost = getCostNumber(x.cost);
                let residualValue = getCostNumber(x.residualValue);
                let usefulLife = getNumber(x.usefulLife);
                let startDepreciation = getFormatDateFromTime(x.startDepreciation, 'dd-mm-yyyy')
                let depreciationType = getAssetDepreciationType(x.depreciationType);
                exportKhauHao = [...exportKhauHao, {
                    index: index + 1,
                    code,
                    name,
                    cost,
                    residualValue,
                    usefulLife,
                    startDepreciation,
                    depreciationType
                }]

                // Dữ liệu tab thông tin sử dụng
                let dataKH = x.usageLogs ? x.usageLogs.map(use => {
                    return {
                        index: index + 1,
                        code,
                        name,
                        usedByOrganizationalUnit: getPropertyOfValue(use.usedByOrganizationalUnit, 'name', false, organizationalUnitList),
                        usedByUser: getPropertyOfValue(use.usedByUser, 'email', false, userlist),
                        startDate: getFormatDateFromTime(use.startDate, 'dd-mm-yyyy'),
                        endDate: getFormatDateFromTime(use.endDate, 'dd-mm-yyyy'),
                        description: use.description
                    }
                }) : null;
                exportSuDung = dataKH ? [...exportSuDung, ...dataKH] : [...exportSuDung];

                // Dữ liệu tab sự cố
                let dataSuCo = x.incidentLogs ? x.incidentLogs.map(incident => {
                    return {
                        index: index + 1,
                        code,
                        name,
                        incidentCode: incident.incidentCode,
                        incidentType: getIncidentType(incident.type),
                        announcer: getPropertyOfValue(incident.reportedBy, 'email', false, userlist),
                        incidentDate: getFormatDateFromTime(incident.dateOfIncident, 'dd-mm-yyyy'),
                        content: incident.description,
                        status: getIncidentStatus(incident.statusIncident)
                    }
                }) : null;
                exportSuCo = dataSuCo ? [...exportSuCo, ...dataSuCo] : [...exportSuCo]

                // Dữ liệu tab bảo trì - sửa chữa
                let dataBTSC = x.maintainanceLogs ? x.maintainanceLogs.map(mt => {
                    return {
                        index: index + 1,
                        maintainanceCode: mt.maintainanceCode,
                        code,
                        name,
                        createDate: getFormatDateFromTime(mt.createDate),
                        type: getIncidentType(mt.type),
                        description: mt.description,
                        startDate: getFormatDateFromTime(mt.startDate, 'dd-mm-yyyy'),
                        endDate: getFormatDateFromTime(mt.endDate, 'dd-mm-yyyy'),
                        expense: getCostNumber(mt.expense),
                        status: getIncidentStatus(mt.status)
                    }
                }) : null;
                exportBaoTriSuaChua = dataBTSC ? [...exportBaoTriSuaChua, ...dataBTSC] : [...exportBaoTriSuaChua];

                // Dữ liệu tab thanh lý
                let disposalDesc = x.disposalDesc;
                let disposalType = x.disposalType;
                let disposalCost = getCostNumber(x.disposalCost);

                exportThanhLy = [...exportThanhLy, {
                    index: index + 1,
                    code,
                    name,
                    disposalDesc,
                    disposalCost,
                    disposalDate,
                    disposalType: gettDisposalType(disposalType)
                }]
            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                // 1. Sheet thông tin sử dụng
                {
                    sheetName: "Thông tin chung",
                    sheetTitle: 'Bảng danh sách thông tin chung',
                    sheetTitleWidth: 15,
                    tables: [
                        {
                            merges: [{
                                key: "detailInfo",
                                columnName: "Danh sách các trường thông tin chi tiết",
                                keyMerge: 'infoName',
                                colspan: 2
                            }],
                            rowHeader: 2,
                            columns: [
                                { key: "index", value: "STT" },
                                { key: "code", value: "Mã tài sản" },
                                { key: "name", value: "Tên tài sản" },
                                { key: "description", value: "Mô tả" },
                                { key: "group", value: 'Nhóm tài sản' },
                                { key: "type", value: "Loại tài sản" },
                                { key: "purchaseDate", value: "Ngày nhập" },
                                { key: "disposalDate", value: "Ngày thanh lý" },
                                { key: "manager", value: "Người quản lý" },
                                { key: "assigner", value: "Người sử dụng" },
                                { key: "handoverFromDate", value: "Thời gian bắt đầu sử dụng" },
                                { key: "handoverToDate", value: "Thời gian kết thúc sử dụng" },
                                { key: "status", value: "Trạng thái" },
                                { key: "infoName", value: "Tên trường thông tin" },
                                { key: "value", value: "Giá trị" }
                            ],
                            data: exportThongTinChung
                        }
                    ]
                },

                // 2. Sheet thông tin khấu hao
                {
                    sheetName: "Thông tin khấu hao",
                    sheetTitle: 'Danh sách thông tin khấu hao tài sản',
                    sheetTitleWidth: 8,
                    tables: [
                        {
                            rowHeader: 2,
                            columns: [
                                { key: "index", value: "STT" },
                                { key: "code", value: "Mã tài sản" },
                                { key: "name", value: "Tên tài sản" },
                                { key: "cost", value: "Nguyên giá" },
                                { key: "residualValue", value: "Giá trị thu hồi ước tính" },
                                { key: "usefulLife", value: "Thời gian sử dụng (tháng)" },
                                { key: "startDepreciation", value: "Thời điểm bắt đầu trích khấu khao" },
                                { key: "depreciationType", value: "Phương pháp khấu hao" }
                            ],
                            data: exportKhauHao
                        }
                    ]
                },

                // 3. Sheet thông tin sử dụng
                {
                    sheetName: "Thông tin sử dụng",
                    sheetTitle: "Bảng danh sách thông tin sử dụng",
                    sheetTitleWidth: 8,
                    tables: [
                        {
                            rowHeader: 2,
                            columns: [
                                { key: "index", value: "STT" },
                                { key: "code", value: "Mã tài sản" },
                                { key: "name", value: "Tên tài sản" },
                                { key: "description", value: "Mô tả" },
                                { key: "usedByUser", value: "Người sử dụng" },
                                { key: "usedByOrganizationalUnit", value: "Đơn vị sử dụng" },
                                { key: "startDate", value: "Ngày bắt đầu sử dụng" },
                                { key: "endDate", value: "Ngày kết thúc sử dụng" }
                            ],
                            data: exportSuDung
                        }
                    ]
                },

                // 4. Sheet thông tin sự cố
                {
                    sheetName: "Thông tin sự cố",
                    sheetTitle: "Bảng danh sách thông tin sự cố",
                    sheetTitleWidth: 9,
                    tables: [
                        {
                            rowHeader: 2,
                            columns: [
                                { key: "index", value: "STT" },
                                { key: "code", value: "Mã tài sản" },
                                { key: "name", value: "Tên tài sản" },
                                { key: "incidentCode", value: "Mã sự cố" },
                                { key: "incidentType", value: "Loại sự cố" },
                                { key: "announcer", value: "Người báo cáo" },
                                { key: "incidentDate", value: "Ngày phát hiện" },
                                { key: "content", value: "Nội dung" },
                                { key: "status", value: "Trạng thái" }
                            ],
                            data: exportSuCo
                        }
                    ]
                },

                // 5. Sheet thông tin bảo trì - sửa chữa
                {
                    sheetName: "Thông tin bảo trì",
                    sheetTitle: "Bảng danh sách thông tin bảo trì",
                    sheetTitleWidth: 11,
                    tables: [
                        {
                            rowHeader: 2,
                            columns: [
                                { key: "index", value: "STT" },
                                { key: "maintainanceCode", value: "Mã phiếu" },
                                { key: "code", value: "Mã tài sản" },
                                { key: "name", value: "Tên tài sản" },
                                { key: "createDate", value: "Ngày lập" },
                                { key: "type", value: "Phân loại" },
                                { key: "description", value: "Nội dung" },
                                { key: "startDate", value: "Ngày bắt đầu" },
                                { key: "endDate", value: "Ngày hoàn thành" },
                                { key: "expense", value: "Chi phí" },
                                { key: "status", value: "Trạng thái" }
                            ],
                            data: exportBaoTriSuaChua
                        }
                    ]
                },

                // 6. Sheet thông tin thanh lý
                {
                    sheetName: "Thông tin thanh lý",
                    sheetTitle: "Bảng danh sách thông tin thanh lý",
                    sheetTitleWidth: 7,
                    tables: [
                        {
                            rowHeader: 2,
                            columns: [
                                { key: "index", value: "STT" },
                                { key: "code", value: "Mã tài sản" },
                                { key: "name", value: "Tên tài sản" },
                                { key: "disposalDate", value: "Ngày thanh lý" },
                                { key: "disposalType", value: "Hình thức thanh lý" },
                                { key: "disposalCost", value: "Giá trị thanh lý" },
                                { key: "disposalDesc", value: "Nội dung thanh lý" },
                            ],
                            data: exportThanhLy
                        }
                    ]
                }
            ]
        }
        return exportData;
    }

    const getAssetTypes = () => {
        let { assetType } = props;
        let assetTypeName = assetType && assetType.listAssetTypes;
        let typeArr = [];
        assetTypeName.map(item => {
            typeArr.push({
                _id: item._id,
                id: item._id,
                name: item.typeName,
                parent: item.parent ? item.parent._id : null
            })
        })
        return typeArr;
    }

    const getDepartment = () => {
        let { department } = props;
        let listUnit = department && department.list
        let unitArr = [];

        listUnit.map(item => {
            unitArr.push({
                value: item._id,
                text: item.name
            })
        })

        return unitArr;
    }

    const convertGroupAsset = (group) => {
        const { translate } = props;
        if (group === 'building') {
            return translate('asset.dashboard.building')
        }
        else if (group === 'vehicle') {
            return translate('asset.asset_info.vehicle')
        }
        else if (group === 'machine') {
            return translate('asset.dashboard.machine')
        }
        else if (group === 'other') {
            return translate('asset.dashboard.other')
        }
        else return null;
    }

    const formatStatus = (status) => {
        const { translate } = props;

        if (status === 'ready_to_use') {
            return translate('asset.general_information.ready_use')
        }
        else if (status === 'in_use') {
            return translate('asset.general_information.using')
        }
        else if (status === 'broken') {
            return translate('asset.general_information.damaged')
        }
        else if (status === 'lost') {
            return translate('asset.general_information.lost')
        }
        else if (status === 'disposed') {
            return translate('asset.general_information.disposal')
        }
        else {
            return '';
        }
    }

    const formatDisposalDate = (disposalDate, status) =>{
        const { translate } = props;
        if (status === 'disposed') {
            if (disposalDate) return formatDate(disposalDate);
            else return translate('asset.general_information.not_disposal_date');
        }
        else {
            return translate('asset.general_information.not_disposal');
        }
    }

    
      
    var lists = "", exportData;
    var userlist = user.list, departmentlist = department.list;
    var assettypelist = assetType.listAssetTypes;
    let typeArr = getAssetTypes();
    let dataSelectBox = getDepartment();
    let assetTypeName = state.assetType ? state.assetType : [];

    if (assetsManager.isLoading === false) {
        lists = assetsManager.listAssets;
    }

    let assetbuilding = assetsManager && assetsManager.buildingAssets;
    let assetbuildinglist = assetbuilding && assetbuilding.list;
    let buildingList = assetbuildinglist && assetbuildinglist.map(node => {
        return {
            ...node,
            id: node._id,
            name: node.assetName,
            parent: node.location,
        }
    })

    var pageTotal = ((assetsManager.totalList % limit) === 0) ?
        parseInt(assetsManager.totalList / limit) :
        parseInt((assetsManager.totalList / limit) + 1);
    var currentPage = parseInt((page / limit) + 1);

    if (userlist && lists && assettypelist) {
        exportData = convertDataToExportData(lists, assettypelist, userlist);
    }

    return (
        <div className={isActive ? isActive : "box"}>
            <div className="box-body qlcv">
                {/* Form thêm tài sản mới */}
                <div className="dropdown pull-right">
                    <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('menu.add_asset_title')} >{translate('menu.add_update_asset')}</button>
                    <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                        <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-add-asset').modal('show')}>{translate('menu.add_asset')}</a></li>
                        <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-asset-add').modal('show')}>{translate('human_resource.profile.employee_management.add_import')}</a></li>
                        <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-asset-update').modal('show')}>{translate('human_resource.profile.employee_management.update_import')}</a></li>
                    </ul>
                </div>
                <AssetCreateForm />
                <AssetImportForm
                    id='modal-import-asset-add'
                    type="add"
                    page={0}
                    limit={5}
                />
                <AssetImportForm
                    id='modal-import-asset-update'
                    type="update"
                    page={0}
                    limit={5}
                />

                {/* Thanh tìm kiếm */}
                <div className="form-inline">

                    {/* Mã tài sản */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.asset_code')}</label>
                        <input type="text" className="form-control" name="code" onChange={handleCodeChange} placeholder={translate('asset.general_information.asset_code')} autoComplete="off" />
                    </div>

                    {/* Tên tài sản */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.asset_name')}</label>
                        <input type="text" className="form-control" name="assetName" onChange={handleAssetNameChange} placeholder={translate('asset.general_information.asset_name')} autoComplete="off" />
                    </div>
                </div>

                <div className="form-inline">

                    {/* Nhóm tài sản */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.asset_group')}</label>
                        <SelectMulti id={`multiSelectGroupInManagement`} multiple="multiple"
                            value={group}
                            options={{ nonSelectedText: translate('asset.asset_info.select_group'), allSelectedText: translate('asset.general_information.select_all_group') }}
                            onChange={handleGroupChange}
                            items={[
                                { value: "building", text: translate('asset.dashboard.building') },
                                { value: "vehicle", text: translate('asset.asset_info.vehicle') },
                                { value: "machine", text: translate('asset.dashboard.machine') },
                                { value: "other", text: translate('asset.dashboard.other') },
                            ]}
                        >
                        </SelectMulti>
                    </div>

                    {/* Loại tài sản */}
                    <div className="form-group">
                        <label>{translate('asset.general_information.asset_type')}</label>
                        <TreeSelect
                            data={typeArr}
                            value={assetTypeName}
                            handleChange={handleAssetTypeChange}
                            mode="hierarchical"
                        />
                    </div>
                </div>

                <div className="form-inline">

                    {/* Trạng thái */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('page.status')}</label>
                        <SelectMulti id={`multiSelectStatus1`} multiple="multiple"
                            value= {status}
                            options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('asset.general_information.select_all_status') }}
                            onChange={handleStatusChange}
                            value={status ? status : []}
                            items={[
                                { value: "ready_to_use", text: translate('asset.general_information.ready_use') },
                                { value: "in_use", text: translate('asset.general_information.using') },
                                { value: "broken", text: translate('asset.general_information.damaged') },
                                { value: "lost", text: translate('asset.general_information.lost') },
                                { value: "disposed", text: translate('asset.general_information.disposal') }
                            ]}
                        >
                        </SelectMulti>
                    </div>

                    {/* Vị trí tài sản */}
                    <div className="form-group">
                        <label>{translate('asset.general_information.asset_location')}</label>
                        <TreeSelect data={buildingList} value={[location]} handleChange={handleLocationChange} mode="radioSelect" />
                    </div>
                </div>

                <div className="form-inline">

                    {/* Đơn vị được giao sử dụng */}
                    <div className="form-group">
                        <label>{translate('asset.general_information.organization_unit')}</label>
                        <SelectMulti
                            id={`unitInManagement`}
                            multiple="multiple"
                            options={{ nonSelectedText: translate('asset.general_information.select_organization_unit'), allSelectedText: translate('asset.general_information.select_all_organization_unit') }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={dataSelectBox}
                            onChange={handleHandoverUnitChange}
                        />
                    </div>

                    {/* Người được giao sử dụng */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.user')}</label>
                        <input type="text" className="form-control" name="handoverUser" onChange={handleHandoverUserChange} placeholder={translate('asset.general_information.user')} autoComplete="off" />
                    </div>
                </div>

                <div className="form-inline">
                    {/* Ngày nhập */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.purchase_date')}</label>
                        <DatePicker
                            id="purchase-month"
                            dateFormat="month-year"
                            value={purchaseDate}
                            onChange={handlePurchaseMonthChange}
                        />
                    </div>

                    {/* Ngày Thanh lý */}
                    <div className="form-group">
                        <label className="form-control-static" style={{ padding: 0 }}>{translate('asset.general_information.disposal_date')}</label>
                        <DatePicker
                            id="disposal-month"
                            dateFormat="month-year"
                            value={disposalDate}
                            onChange={handleDisposalMonthChange}
                        />
                    </div>
                </div>

                <div className="form-inline" style={{ marginBottom: 10 }}>
                    {/* Quyền đăng ký */}
                    <div className="form-group">
                        <label>{translate('asset.general_information.can_register')}</label>
                        <SelectMulti
                            id={`typeRegisterForUseInManagement`}
                            className="form-control select2"
                            multiple="multiple"
                            value={typeRegisterForUse}
                            options={{ nonSelectedText: translate('asset.general_information.select_register'), allSelectedText: translate('asset.general_information.select_all_register') }}
                            style={{ width: "100%" }}
                            items={[
                                { value: 1, text: translate('asset.general_information.not_for_registering') },
                                { value: 2, text: translate('asset.general_information.register_by_hour') },
                                { value: 3, text: translate('asset.general_information.register_for_long_term') },
                            ]}
                            onChange={handleTypeRegisterForUseChange}
                        />
                    </div>
                    {/* Nút tìm kiếm */}
                    <div className="form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={handleSubmitSearch}>{translate('asset.general_information.search')}</button>
                    </div>
                    {exportData && <ExportExcel id="export-asset-info-management" exportData={exportData} style={{ marginRight: 10 }} />}
                </div>

                {/* Báo lỗi khi thêm mới tài sản */}
                {assetsManager && assetsManager.assetCodeError && assetsManager.assetCodeError.length !== 0
                    && <div style={{ color: 'red' }}>
                        <strong style={{ 'fontWeight': 600, 'paddingRight': 10 }}>{translate('asset.asset_info.asset_code_exist')}:</strong>
                        {
                            assetsManager.assetCodeError.map((item, index) => {
                                let seperator = index !== 0 ? ", " : "";
                                return <span key={index}>{seperator}{item}</span>
                            })
                        }
                    </div>
                }

                {/* Bảng các tài sản */}
                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.asset_group')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.asset_type')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.purchase_date')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.manager')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.user')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.organization_unit')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.disposal_date')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('asset.general_information.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('asset.general_information.asset_code'),
                                        translate('asset.general_information.asset_name'),
                                        translate('asset.general_information.asset_group'),
                                        translate('asset.general_information.asset_type'),
                                        translate('asset.general_information.purchase_date'),
                                        translate('asset.general_information.manager'),
                                        translate('asset.general_information.user'),
                                        translate('asset.general_information.organizaiton_unit'),
                                        translate('asset.general_information.status'),
                                        translate('asset.general_information.disposal_date')
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(lists && lists.length !== 0) ?
                            lists.map((x, index) => (
                                <tr key={index}>
                                    <td>{x.code}</td>
                                    <td>{x.assetName}</td>
                                    <td>{convertGroupAsset(x.group)}</td>
                                    <td>{x.assetType && x.assetType.length !== 0 && x.assetType.map((type, index, arr) => index !== arr.length - 1 ? type.typeName + ', ' : type.typeName)}</td>
                                    <td>{formatDate(x.purchaseDate)}</td>
                                    <td>{getPropertyOfValue(x.managedBy, 'email', false, userlist)}</td>
                                    <td>{getPropertyOfValue(x.assignedToUser, 'email', false, userlist)}</td>
                                    <td>{getPropertyOfValue(x.assignedToOrganizationalUnit, 'name', false, departmentlist)}</td>
                                    <td>{formatStatus(x.status)}</td>
                                    <td>{formatDisposalDate(x.disposalDate, x.status)}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a onClick={() => handleView(x)} style={{ width: '5px' }} title={translate('asset.general_information.view')}><i className="material-icons">view_list</i></a>
                                        <a onClick={() => handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.general_information.edit_info')}><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('asset.general_information.delete_info')}
                                            data={{
                                                id: x._id,
                                                info: x.code + " - " + x.assetName
                                            }}
                                            func={props.deleteAsset}
                                        />
                                    </td>
                                </tr>)) : null
                        }
                    </tbody>
                </table>
                {assetsManager.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                {/* PaginateBar */}
                <PaginateBar
                    display={assetsManager.listAssets ? assetsManager.listAssets.length : null}
                    total={assetsManager.totalList ? assetsManager.totalList : null}
                    pageTotal={pageTotal ? pageTotal : 0}
                    currentPage={currentPage}
                    func={setPage}
                />
            </div>

            {/* Form xem thông tin tài sản */}
            {
                currentRowView &&
                <AssetDetailForm
                    _id={currentRowView._id}
                    avatar={currentRowView.avatar}
                    code={currentRowView.code}
                    assetName={currentRowView.assetName}
                    serial={currentRowView.serial}
                    assetType={currentRowView.assetType}
                    group={currentRowView.group}
                    purchaseDate={currentRowView.purchaseDate}
                    warrantyExpirationDate={currentRowView.warrantyExpirationDate}
                    managedBy={getPropertyOfValue(currentRowView.managedBy, '_id', true, userlist)}
                    assignedToUser={getPropertyOfValue(currentRowView.assignedToUser, '_id', true, userlist)}
                    assignedToOrganizationalUnit={getPropertyOfValue(currentRowView.assignedToOrganizationalUnit, '_id', true, departmentlist)}
                    handoverFromDate={currentRowView.handoverFromDate}
                    handoverToDate={currentRowView.handoverToDate}
                    location={currentRowView.location}
                    description={currentRowView.description}
                    status={currentRowView.status}
                    typeRegisterForUse={currentRowView.typeRegisterForUse}
                    detailInfo={currentRowView.detailInfo}
                    cost={currentRowView.cost}
                    readByRoles={currentRowView.readByRoles}
                    residualValue={currentRowView.residualValue}
                    startDepreciation={currentRowView.startDepreciation}
                    usefulLife={currentRowView.usefulLife}
                    depreciationType={currentRowView.depreciationType}
                    estimatedTotalProduction={currentRowView.estimatedTotalProduction}
                    unitsProducedDuringTheYears={currentRowView.unitsProducedDuringTheYears}

                    maintainanceLogs={currentRowView.maintainanceLogs}
                    usageLogs={currentRowView.usageLogs}
                    incidentLogs={currentRowView.incidentLogs}

                    disposalDate={currentRowView.disposalDate}
                    disposalType={currentRowView.disposalType}
                    disposalCost={currentRowView.disposalCost}
                    disposalDesc={currentRowView.disposalDesc}

                    archivedRecordNumber={currentRowView.archivedRecordNumber}
                    files={currentRowView.documents}
                    linkPage={"management"}
                />
            }

            {/* Form chỉnh sửa thông tin tài sản */}
            {
                currentRow &&
                <AssetEditForm
                    _id={currentRow._id}
                    employeeId={managedBy}
                    avatar={currentRow.avatar}
                    code={currentRow.code}
                    assetName={currentRow.assetName}
                    serial={currentRow.serial}
                    assetType={JSON.stringify(currentRow.assetType)}
                    group={currentRow.group}
                    purchaseDate={currentRow.purchaseDate}
                    warrantyExpirationDate={currentRow.warrantyExpirationDate}
                    managedBy={getPropertyOfValue(currentRow.managedBy, '_id', true, userlist)}
                    assignedToUser={getPropertyOfValue(currentRow.assignedToUser, '_id', true, userlist)}
                    assignedToOrganizationalUnit={getPropertyOfValue(currentRow.assignedToOrganizationalUnit, '_id', true, departmentlist)}
                    handoverFromDate={currentRow.handoverFromDate}
                    handoverToDate={currentRow.handoverToDate}
                    location={currentRow.location}
                    description={currentRow.description}
                    status={currentRow.status}
                    typeRegisterForUse={currentRow.typeRegisterForUse}
                    detailInfo={currentRow.detailInfo}
                    readByRoles={currentRow.readByRoles}
                    cost={currentRow.cost}
                    residualValue={currentRow.residualValue}
                    startDepreciation={currentRow.startDepreciation}
                    usefulLife={currentRow.usefulLife}
                    depreciationType={currentRow.depreciationType}
                    estimatedTotalProduction={currentRow.estimatedTotalProduction}
                    unitsProducedDuringTheYears={currentRow.unitsProducedDuringTheYears && currentRow.unitsProducedDuringTheYears.map((x) => ({
                        month: formatDate2(x.month),
                        unitsProducedDuringTheYear: x.unitsProducedDuringTheYear
                    })
                    )}

                    disposalDate={currentRow.disposalDate}
                    disposalType={currentRow.disposalType}
                    disposalCost={currentRow.disposalCost}
                    disposalDesc={currentRow.disposalDesc}

                    maintainanceLogs={currentRow.maintainanceLogs}
                    usageLogs={currentRow.usageLogs}
                    incidentLogs={currentRow.incidentLogs}
                    archivedRecordNumber={currentRow.archivedRecordNumber}
                    files={currentRow.documents}
                    linkPage={"management"}
                    page={page}
                />
            }
        </div>
    );
};

function mapState(state) {
    const { assetsManager, assetType, user, role, department, auth } = state;
    return { assetsManager, assetType, user, role, department, auth };
};

const actionCreators = {
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllAsset: AssetManagerActions.getAllAsset,
    getListBuildingAsTree: AssetManagerActions.getListBuildingAsTree,
    deleteAsset: AssetManagerActions.deleteAsset,
    getUser: UserActions.get,
    getAllDepartments: DepartmentActions.get,
    getAllRoles: RoleActions.get,
};

const assetManagement = connect(mapState, actionCreators)(withTranslate(AssetManagement));
export { assetManagement as AssetManagement };
