import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { AssetManagerActions } from '../redux/actions';

import { AssetImportTab } from './assetImportTab';

import { UploadFile, ImportFileExcel, ExportExcel } from '../../../../../common-components';

import {
    configurationGeneralInformationOfAssetTemplate,
    configurationUsageInformationOfAssetTemplate,
    configurationIncidentInformationOfAssetTemplate,
    configurationMaintainanceInformationOfAssetTemplate,
    configurationDepreciationInformationOfAssetTemplate,
    configurationDisposalInformationOfAssetTemplate,
    importAssetTemplate
} from './fileConfigurationImportAsset';

import { DialogModal } from '../../../../../common-components';

class AssetImportForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // Dữ liệu tài sản lưu vào database
            importGeneralInformationData: [],
            importDepreciationInformationData: [],
            importDisposalInformationData: [],
            importIncidentInformationData: [],
            importMaintainanceInformationData: [],
            importUsageInformationData: [],

            // Lỗi ở các tab
            rowErrorGeneralInformationData: [],
            rowErrorDepreciationInformationData: [],
            rowErrorDisposalInformationData: [],
            rowErrorMaintainanceInformationData: [],
            rowErrorUsageInformationData: [],
            rowErrorIncidentInformationData: [],

            // Chech định dạng file import
            checkFileImportGeneralInformation: true,
            checkFileImportDepreciationInformation: true,
            checkFileImportDisposalInformation: true,
            checkFileImportMaintainanceInformation: true,
            checkFileImportIncidentInformation: true,
            checkFileImportUsageInformation: true
        }
    }

    componentDidMount() {
        this.props.getAllUsers();
    }

    save = () => {
        const {
            importGeneralInformationData,
            importDepreciationInformationData,
            importDisposalInformationData,
            importIncidentInformationData,
            importMaintainanceInformationData,
            importUsageInformationData,
        } = this.state;

        let assets = [];
        if (importGeneralInformationData && importGeneralInformationData.length !== 0) {
            importGeneralInformationData.map((asset) => {
                let importDisposalTemporary = importDisposalInformationData.filter(item => item.code === asset.code);
                let importDepreciationTemporary = importDepreciationInformationData.filter(item => item.code === asset.code);
                assets.push({
                    ...asset,
                    ...importDepreciationTemporary[0],
                    ...importDisposalTemporary[0],
                    maintainanceLogs: importMaintainanceInformationData.filter(item => item.code === asset.code),
                    usageLogs: importUsageInformationData.filter(item => item.code === asset.code),
                    incidentLogs: importIncidentInformationData.filter(item => item.code === asset.code),
                })
            })
        }

        if (assets && assets.length !== 0) {
            // assets.map(item => {
            this.props.addNewAsset(assets)
            // })
        }
    }

    isFormValidated = () => {
        const {
            rowErrorGeneralInformationData,
            rowErrorDepreciationInformationData,
            rowErrorDisposalInformationData,
            rowErrorMaintainanceInformationData,
            rowErrorUsageInformationData,
            rowErrorIncidentInformationData,

            checkFileImportGeneralInformation,
            checkFileImportDepreciationInformation,
            checkFileImportDisposalInformation,
            checkFileImportMaintainanceInformation,
            checkFileImportIncidentInformation,
            checkFileImportUsageInformation
        } = this.state;

        return (rowErrorGeneralInformationData.length === 0
            && rowErrorDepreciationInformationData.length === 0
            && rowErrorDisposalInformationData.length === 0
            && rowErrorMaintainanceInformationData.length === 0
            && rowErrorUsageInformationData.length === 0
            && rowErrorIncidentInformationData.length === 0
        )
            &&
            (checkFileImportGeneralInformation
                && checkFileImportDepreciationInformation
                && checkFileImportDisposalInformation
                && checkFileImportMaintainanceInformation
                && checkFileImportIncidentInformation
                && checkFileImportUsageInformation
            );
    }

    /**
     * Function chuyển dữ liệu date trong excel thành dạng dd-mm-yyyy
     * @param {*} serial :số serial của ngày
     */
    convertExcelDateToJSDate = (serial, type) => {
        if (!serial) return undefined;

        let utc_days = Math.floor(serial - 25569);
        let utc_value = utc_days * 86400;
        let date_info = new Date(utc_value * 1000);
        let month = date_info.getMonth() + 1;
        let day = date_info.getDate();
        if (month.toString().length < 2)
            month = '0' + month;
        if (day.toString().length < 2)
            day = '0' + day;

        switch (type) {
            case "yy-mm-dd":
                return [date_info.getFullYear(), month, day].join('-');
            case "dd-mm-yy":
                return [day, month, date_info.getFullYear()].join('-');
        }
    }

    /**
     * Hàm tiện ích dùng cho các function bên dưới
     * Function chuyển String(dd-mm-yyyy) sang date
     * @param {*} data 
     */
    convertStringToDate = (data, monthYear = false) => {
        if (data) {
            data = data.split('-');
            let date;
            if (monthYear) {
                date = [data[1], data[0]];
            } else {
                date = [data[2], data[1], data[0]];
            }
            return date.join('-');
        } else {
            return data;
        }
    }

    // Xử lý dữ liệu export file mẫu import tài sản
    convertAssetTemplate = (dataTemplate) => {
        const { user, assetsManager, role, assetType, department } = this.props;
        let userList = [], departmentList = [], assetTypes = [], roles = [], assetLocations = [], assetGroups = [], status = [], typeRegisterForUse = [];
        let depreciationType = [];
        let incidentType = [], incidentStatus = [];
        let maintainanceType = [], maintainanceStatus = [];
        let disposalType = [];

        if (user) {
            userList = user.list.map(item => item.name + " - " + item.email);
            if (!userList) userList = [];
        }
        if (assetType) {
            assetTypes = assetType.listAssetTypes.map(item => item.typeNumber);
            if (!assetTypes) assetTypes = [];
        }
        if (role) {
            roles = role.list.map(item => item.name);
            if (!roles) roles = [];
        }
        if (assetsManager) {
            assetLocations = assetsManager.buildingAssets && assetsManager.buildingAssets.list.map(item => item.assetName);
            if (!assetLocations) assetLocations = [];
        }
        if (department) {
            departmentList = department.list.map(item => item.name);
            if (!departmentList) departmentList = [];
        }

        // Thông tin chung
        assetGroups = ["Mặt bằng", "Xe cộ", "Máy móc", "Khác"];
        status = ["Sẵn sàng sử dụng", "Đang sử dụng", "Hỏng hóc", "Mất", "Thanh lý"];
        typeRegisterForUse = ["Không đươc đăng ký sử dụng", "Đăng ký sử dụng theo giờ", "Đăng ký sử dụng lâu dài"];

        depreciationType = ["Đường thẳng", "Số dư giảm dần", "Sản lượng"];

        // Sự cố tài sản
        incidentType = ["Hỏng hóc", "Mất"];
        incidentStatus = ["Chờ xử lý", "Đã xử lý"];

        // Bảo trì tài sản
        maintainanceType = ["Sửa chữa", "Thay thế", "Nâng cấp"];
        maintainanceStatus = ["Đã thực hiện", "Đang thực hiện", "Chưa thực hiện"];

        // Thanh lý tài sản
        disposalType = ["Tiêu hủy", "Nhượng bán", "Tặng"];

        for (let i = 0; i < dataTemplate.dataSheets.length; i++) {
            switch (dataTemplate.dataSheets[i].type) {
                case "General":
                    dataTemplate.dataSheets[i] = this.convertImportGeneralInformationOfAssetTemplate(dataTemplate.dataSheets[i], userList, assetTypes, roles, assetLocations, assetGroups, status, typeRegisterForUse);
                    break;
                case "Depreciation":
                    dataTemplate.dataSheets[i] = this.convertImportDepreciationInformationOfAssetTemplate(dataTemplate.dataSheets[i], depreciationType);
                    break;
                case "Usage":
                    dataTemplate.dataSheets[i] = this.convertImportUsageInformationOfAssetTemplate(dataTemplate.dataSheets[i], userList, departmentList);
                    break;
                case "Incident":
                    dataTemplate.dataSheets[i] = this.convertImportIncidentInformationOfAssetTemplate(dataTemplate.dataSheets[i], userList, incidentType, incidentStatus);
                    break;
                case "Maintainance":
                    dataTemplate.dataSheets[i] = this.convertImportMaintainanceInformationOfAssetTemplate(dataTemplate.dataSheets[i], maintainanceType, maintainanceStatus);
                    break;
                case "Disposal":
                    dataTemplate.dataSheets[i] = this.convertImportDisposalInformationOfAssetTemplate(dataTemplate.dataSheets[i], disposalType);
                    break;
            }
        }

        let data = [], sheetData;
        let length = Math.max(userList.length, departmentList.length, assetTypes.length,
            roles.length, assetLocations.length, assetGroups.length, status.length,
            typeRegisterForUse.length, depreciationType.length, incidentType.length,
            incidentStatus.length, maintainanceType.length, maintainanceStatus.length, disposalType.length);

        for (let i = 0; i < length; i++) {
            data.push({
                userList: userList[i] ? userList[i] : "",
                assetTypes: assetTypes[i] ? assetTypes[i] : "",
                roles: roles[i] ? roles[i] : "",
                assetLocations: assetLocations[i] ? assetLocations[i] : "",
                departmentList: departmentList[i] ? departmentList[i] : "",
                assetGroups: assetGroups[i] ? assetGroups[i] : "",
                status: status[i] ? status[i] : "",
                typeRegisterForUse: typeRegisterForUse[i] ? typeRegisterForUse[i] : "",
                depreciationType: depreciationType[i] ? depreciationType[i] : "",
                incidentType: incidentType[i] ? incidentType[i] : "",
                incidentStatus: incidentStatus[i] ? incidentStatus[i] : "",
                maintainanceType: maintainanceType[i] ? maintainanceType[i] : "",
                maintainanceStatus: maintainanceStatus[i] ? maintainanceStatus[i] : "",
                disposalType: disposalType[i] ? disposalType[i] : ""
            })
        }

        sheetData = {
            sheetName: "Các trường thông tin",
            tables: [{
                rowHeader: 1,
                columns: [
                    { key: "userList", value: "Người quản lý" },
                    { key: "assetTypes", value: "Loại tài sản" },
                    { key: "roles", value: "Role" },
                    { key: "assetLocations", value: "Vị trí tài sản" },
                    { key: "departmentList", value: "Đơn vị" },
                    { key: "assetGroups", value: "Nhóm tài sản" },
                    { key: "status", value: "Trạng thái tài sản" },
                    { key: "typeRegisterForUse", value: "Quyền đăng ký sử dụng" },
                    { key: "depreciationType", value: "Phương pháp khấu hao" },
                    { key: "incidentType", value: "Loại sự cố" },
                    { key: "incidentStatus", value: "Trạng thái sự cố" },
                    { key: "maintainanceType", value: "Phân loại bảo trì" },
                    { key: "maintainanceStatus", value: "Trạng thái bảo trì" },
                    { key: "disposalType", value: "Hình thức thanh lý" }
                ],
                data: data
            }]
        }

        if (dataTemplate.dataSheets.filter(item => item.sheetName === "Các trường thông tin").length === 0) {
            dataTemplate.dataSheets.push(sheetData);
        } else {
            dataTemplate.dataSheets.pop();
            dataTemplate.dataSheets.push(sheetData);
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu thông tin chung 
    convertImportGeneralInformationOfAssetTemplate = (dataTemplate, userList, assetTypes, roles, assetLocations, assetGroups, status, typeRegisterForUse) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];
                let out;

                if (dataTemporary.code) {
                    out = {
                        code: dataTemporary.code,
                        assetName: dataTemporary.assetName,
                        serial: dataTemporary.serial,
                        group: assetGroups[0],
                        assetType: assetTypes && assetTypes[0],
                        purchaseDate: dataTemporary.purchaseDate,
                        warrantyExpirationDate: dataTemporary.warrantyExpirationDate,
                        managedBy: userList && userList[0],
                        readByRoles: roles && roles[0],
                        location: assetLocations && assetLocations[0],
                        status: status[0],
                        typeRegisterForUse: typeRegisterForUse[0],
                        description: dataTemporary.description
                    }
                } else {
                    out = {
                        code: undefined,
                        assetName: undefined,
                        serial: undefined,
                        group: undefined,
                        assetType: assetTypes && assetTypes[1],
                        purchaseDate: undefined,
                        warrantyExpirationDate: undefined,
                        managedBy: undefined,
                        readByRoles: roles && roles[1],
                        location: undefined,
                        status: undefined,
                        typeRegisterForUse: undefined,
                        description: undefined
                    }
                }

                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu khấu hao tài sản 
    convertImportDepreciationInformationOfAssetTemplate = (dataTemplate, depreciationType) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];

                let out = {
                    code: dataTemporary.code,
                    cost: Number(dataTemporary.cost),
                    residualValue: Number(dataTemporary.residualValue),
                    usefulLife: Number(dataTemporary.usefulLife),
                    startDepreciation: dataTemporary.startDepreciation,
                    depreciationType: depreciationType[0]
                }
                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu sử dụng tài sản 
    convertImportUsageInformationOfAssetTemplate = (dataTemplate, userList, departmentList) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];

                let out = {
                    code: dataTemporary.code,
                    usedByUser: userList && userList[0] ? userList[0] : null,
                    usedByOrganizationalUnit: departmentList && departmentList[0] ? departmentList[0] : null,
                    startDate: dataTemporary.startDate,
                    endDate: dataTemporary.endDate,
                    description: dataTemporary.description
                }
                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu sự cố tài sản 
    convertImportIncidentInformationOfAssetTemplate = (dataTemplate, userList, incidentType, status) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];

                let out = {
                    code: dataTemporary.code,
                    incidentCode: dataTemporary.incidentCode,
                    type: incidentType[0],
                    reportedBy: userList && userList[0] ? userList[0] : null,
                    dateOfIncident: dataTemporary.dateOfIncident,
                    description: dataTemporary.description,
                    statusIncident: status[0]
                }
                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu bảo trì tài sản 
    convertImportMaintainanceInformationOfAssetTemplate = (dataTemplate, maintainanceType, status) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];

                let out = {
                    code: dataTemporary.code,
                    maintainanceCode: dataTemporary.maintainanceCode,
                    createDate: dataTemporary.createDate,
                    type: maintainanceType[0],
                    description: dataTemporary.description,
                    startDate: dataTemporary.startDate,
                    endDate: dataTemporary.endDate,
                    expense: Number(dataTemporary.expense),
                    status: status[0]
                }
                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu thanh lý tài sản 
    convertImportDisposalInformationOfAssetTemplate = (dataTemplate, disposalType) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];

                let out = {
                    code: dataTemporary.code,
                    disposalDate: dataTemporary.disposalDate,
                    disposalType: disposalType[0],
                    disposalCost: Number(dataTemporary.disposalCost),
                    disposalDesc: dataTemporary.disposalDesc,
                }
                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý file import thông tin chung
    handleImportExcelGeneralInformation = (value, checkFileImport) => {
        const { user, assetsManager, role, assetType } = this.props;
        let importGeneralInformationData = [];
        let managers = {}, assetTypes = {}, roles = {}, assetLocations = {};
        let rowError = [];

        if (user) {
            user.list.map(item => {
                managers[item.name + " - " + item.email] = item._id;
            })
        }
        if (assetType) {
            assetType.listAssetTypes.map(item => {
                assetTypes[item.typeNumber] = item._id;
            })
        }
        if (role) {
            role.list.map(item => {
                roles[item.name] = item._id
            })
        }
        if (assetsManager) {
            assetsManager.buildingAssets && assetsManager.buildingAssets.list.map(item => {
                assetLocations[item.assetName] = item._id
            })
        }

        if (checkFileImport) {
            let assetGroups, status, typeRegisterForUse;

            assetGroups = { "Mặt bằng": "building", "Xe cộ": "vehicle", "Máy móc": "machine", "Khác": "other" };
            status = { "Sẵn sàng sử dụng": "ready_to_use", "Đang sử dụng": "in_use", "Hỏng hóc": "broken", "Mất": "lost", "Thanh lý": "disposed" };
            typeRegisterForUse = { "Không đươc đăng ký sử dụng": 1, "Đăng ký sử dụng theo giờ": 2, "Đăng ký sử dụng lâu dài": 3 };

            for (let i = 0; i < value.length; i++) {
                let valueTemporary = value[i];

                if (valueTemporary.code) {
                    let errorAlert = [];

                    // Check lỗi dữ liệu import
                    if (!valueTemporary.code || !valueTemporary.assetName || !valueTemporary.group || !valueTemporary.assetType || !valueTemporary.status || !valueTemporary.typeRegisterForUse
                        || (valueTemporary.group && !assetGroups[valueTemporary.group])
                        || (valueTemporary.assetType && !assetTypes[valueTemporary.assetType])
                        || (valueTemporary.typeRegisterForUse && !typeRegisterForUse[valueTemporary.typeRegisterForUse])
                        || (valueTemporary.status && !status[valueTemporary.status])
                        || (valueTemporary.managedBy && !managers[valueTemporary.managedBy])
                        || (valueTemporary.readByRoles && !roles[valueTemporary.readByRoles])
                        || (valueTemporary.location && !assetLocations[valueTemporary.location])
                    ) {
                        rowError = [...rowError, i + 1];
                        valueTemporary = { ...valueTemporary, error: true };
                    }

                    if (!valueTemporary.code) {
                        errorAlert = [...errorAlert, 'Mã tài sản không được để trống'];
                    }

                    if (!valueTemporary.assetName) {
                        errorAlert = [...errorAlert, 'Tên tài sản không được để trống'];
                    }

                    if (!valueTemporary.group) {
                        errorAlert = [...errorAlert, 'Nhóm tài sản không được để trống'];
                    } else if (valueTemporary.group && !assetGroups[valueTemporary.group]) {
                        errorAlert = [...errorAlert, 'Nhóm tài sản không chính xác'];
                    }

                    if (!valueTemporary.assetType) {
                        errorAlert = [...errorAlert, 'Loại tài sản không được để trống'];
                    } else if (valueTemporary.assetType && !assetTypes[valueTemporary.assetType]) {
                        errorAlert = [...errorAlert, 'Loại tài sản không chính xác'];
                    }

                    if (!valueTemporary.status) {
                        errorAlert = [...errorAlert, 'Trạng thái không được để trống'];
                    } else if (valueTemporary.status && !status[valueTemporary.status]) {
                        errorAlert = [...errorAlert, 'Trạng thái không chính xác'];
                    }

                    if (!valueTemporary.typeRegisterForUse) {
                        errorAlert = [...errorAlert, 'Quyền đăng ký sử dụng không được để trống'];
                    } else if (valueTemporary.typeRegisterForUse && !typeRegisterForUse[valueTemporary.typeRegisterForUse]) {
                        errorAlert = [...errorAlert, 'Quyền đăng ký sử dụng không chính xác'];
                    }

                    if (valueTemporary.managedBy && !managers[valueTemporary.managedBy]) {
                        errorAlert = [...errorAlert, 'Người quản lý không chính xác'];
                    }

                    if (valueTemporary.readByRoles && !roles[valueTemporary.readByRoles]) {
                        errorAlert = [...errorAlert, 'Những roles có quyèn không chính xác'];
                    }

                    if (valueTemporary.location && !assetLocations[valueTemporary.location]) {
                        errorAlert = [...errorAlert, 'Vị trí tài sản không chính xác'];
                    }

                    // Format date
                    let purchaseDate = valueTemporary.purchaseDate;
                    let warrantyExpirationDate = valueTemporary.warrantyExpirationDate;

                    valueTemporary = {
                        ...valueTemporary,
                        purchaseDate: (purchaseDate && typeof purchaseDate === 'string') ? purchaseDate : this.convertExcelDateToJSDate(purchaseDate, "dd-mm-yy"),
                        warrantyExpirationDate: (warrantyExpirationDate && typeof warrantyExpirationDate === 'string') ? warrantyExpirationDate : this.convertExcelDateToJSDate(warrantyExpirationDate, "dd-mm-yy"),
                        errorAlert: errorAlert
                    };
                    importGeneralInformationData = [...importGeneralInformationData,
                    {
                        ...valueTemporary,
                        assetType: [assetTypes[valueTemporary.assetType]],
                        readByRoles: [roles[valueTemporary.readByRoles]],
                        managedBy: managers[valueTemporary.managedBy],
                        location: assetLocations[valueTemporary.location],
                        group: assetGroups[valueTemporary.group],
                        typeRegisterForUse: typeRegisterForUse[valueTemporary.typeRegisterForUse],
                        status: status[valueTemporary.status],
                        purchaseDate: (purchaseDate && typeof purchaseDate === 'string') ? this.convertStringToDate(purchaseDate) : this.convertExcelDateToJSDate(purchaseDate, "yy-mm-dd"),
                        warrantyExpirationDate: (warrantyExpirationDate && typeof warrantyExpirationDate === 'string') ? this.convertStringToDate(warrantyExpirationDate) : this.convertExcelDateToJSDate(warrantyExpirationDate, "yy-mm-dd")
                    }
                    ];

                    value[i] = valueTemporary;
                } else {
                    if (importGeneralInformationData.length !== 0) {
                        let errorAlert = [];

                        // Check lỗi dữ liệu import
                        if ((valueTemporary.assetType && !assetTypes[valueTemporary.assetType])
                            || (valueTemporary.readByRoles && !roles[valueTemporary.readByRoles])
                        ) {
                            rowError = [...rowError, i + 1];
                            valueTemporary = { ...valueTemporary, error: true };
                        }

                        if (valueTemporary.assetType && !assetTypes[valueTemporary.assetType]) {
                            errorAlert = [...errorAlert, 'Loại tài sản không chính xác'];
                        }
                        if (valueTemporary.readByRoles && !roles[valueTemporary.readByRoles]) {
                            errorAlert = [...errorAlert, 'Những roles có quyèn không chính xác'];
                        }

                        valueTemporary = {
                            ...valueTemporary,
                            errorAlert: errorAlert
                        };
                        value[i] = valueTemporary;

                        importGeneralInformationData[importGeneralInformationData.length - 1] = {
                            ...importGeneralInformationData[importGeneralInformationData.length - 1],
                            assetType: valueTemporary && valueTemporary.assetType
                                ? [
                                    ...importGeneralInformationData[importGeneralInformationData.length - 1].assetType,
                                    valueTemporary.assetType && assetTypes[valueTemporary.assetType]
                                ]
                                : importGeneralInformationData[importGeneralInformationData.length - 1].assetType,
                            readByRoles: valueTemporary.readByRoles
                                ? [
                                    ...importGeneralInformationData[importGeneralInformationData.length - 1].readByRoles,
                                    valueTemporary.readByRoles && roles[valueTemporary.readByRoles]
                                ]
                                : importGeneralInformationData[importGeneralInformationData.length - 1].readByRoles
                        }
                    } else {
                        let errorAlert = ['Mã tài sản không được để trống'];
                        rowError = [...rowError, i + 1];
                        value[i] = {
                            ...value[i],
                            errorAlert: errorAlert,
                            error: true
                        }
                    }
                }
            }

            this.setState(state => {
                return {
                    ...state,
                    importGeneralInformationData: importGeneralInformationData,

                    importGeneralInformationDataShow: value,
                    rowErrorGeneralInformationData: rowError
                }
            })
        } else {
            this.setState(state => {
                return {
                    ...state,
                    checkFileImportGeneralInformation: checkFileImport,
                }
            })
        }
    }

    // Xử lý file import khấu hao tài sản
    handleImportExcelDepreciationInformation = (value, checkFileImport) => {
        let rowError = [], importDepreciationInformationData = [];

        if (checkFileImport) {
            value = value.map((item, index) => {
                let errorAlert = [];
                let depreciationType = { "Đường thẳng": "straight_line", "Số dư giảm dần": "declining_balance", "Sản lượng": "units_of_production" };

                /* Tạm thời k bắt buộc nhập các trường sau
                    if (!item.cost || !item.usefulLife || !item.startDepreciation || !item.depreciationType || !depreciationType[item.depreciationType]) {
                        rowError = [...rowError, index + 1];
                        item = { ...item, error: true };
                    }

                    if (!item.cost) {
                        errorAlert = [...errorAlert, 'Nguyên giá không được để trống'];
                    }

                    if (!item.usefulLife) {
                        errorAlert = [...errorAlert, 'Thời gian sử dụng không được để trống'];
                    }

                    if (!item.startDepreciation) {
                        errorAlert = [...errorAlert, 'Thời gian bắt đầu trích khấu hao không được để trống'];
                    }

                    if (!item.depreciationType) {
                        errorAlert = [...errorAlert, 'Phương pháp khấu hao không được để trống'];
                    }
                    else 
                */

                if (item.depreciationType && !depreciationType[item.depreciationType]) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }

                if (item.depreciationType && !depreciationType[item.depreciationType]) {
                    errorAlert = [...errorAlert, 'Phương pháp khấu hao không chính xác'];
                }

                // Format date
                let startDepreciation = item.startDepreciation;

                item = {
                    ...item,
                    startDepreciation: (startDepreciation && typeof startDepreciation === 'string') ? startDepreciation : this.convertExcelDateToJSDate(startDepreciation, "dd-mm-yy"),
                    errorAlert: errorAlert
                };
                importDepreciationInformationData = [...importDepreciationInformationData,
                {
                    ...item,
                    depreciationType: depreciationType[item.depreciationType],
                    startDepreciation: (startDepreciation && typeof startDepreciation === 'string') ? this.convertStringToDate(startDepreciation) : this.convertExcelDateToJSDate(startDepreciation, "yy-mm-dd")
                }
                ]

                return item;
            });

            this.setState(state => {
                return {
                    ...state,
                    importDepreciationInformationData: importDepreciationInformationData,

                    importDepreciationInformationDataShow: value,
                    rowErrorDepreciationInformationData: rowError
                }
            })
        } else {
            if (!(value.length === 1 && !value[0].code)) {
                this.setState(state => {
                    return {
                        ...state,
                        checkFileImportDepreciationInformation: checkFileImport,
                    }
                })
            }
        }
    }

    // Xử lý file import sử dụng tài sản
    handleImportExcelUsageInformation = (value, checkFileImport) => {
        const { user, department } = this.props;
        let userList = {}, departmentList = {};
        let rowError = [], importUsageInformationData = [];

        if (user) {
            user.list.map(item => {
                userList[item.name + " - " + item.email] = item._id;
            })
        }
        if (department) {
            department.list.map(item => {
                departmentList[item.name] = item._id;
            })
        }

        if (checkFileImport) {
            value = value.map((item, index) => {
                let errorAlert = [];

                /* Tạm thời k bắt buộc nhập các trường sau
                    if (!item.usedByUser || !item.startDate || !userList[item.usedByUser] || (item.usedByOrganizationalUnit && !departmentList[item.usedByOrganizationalUnit])) {
                        rowError = [...rowError, index + 1];
                        item = { ...item, error: true };
                    }

                    if (!item.usedByUser) {
                        errorAlert = [...errorAlert, 'Người sử dụng không được để trống'];
                    }
                    else if (!userList[item.usedByUser]) {
                        errorAlert = [...errorAlert, 'Người sử dụng không chính xác'];
                    }

                    if (!item.startDate) {
                        errorAlert = [...errorAlert, 'Ngày bắt đầu sử dụng không được để trống'];
                    }

                    if (item.usedByOrganizationalUnit && !departmentList[item.usedByOrganizationalUnit]) {
                        errorAlert = [...errorAlert, 'Đơn vị sử dụng không chính xác'];
                    }
                */

                if ((item.usedByUser && !userList[item.usedByUser]) || (item.usedByOrganizationalUnit && !departmentList[item.usedByOrganizationalUnit])) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }

                if (item.usedByUser && !userList[item.usedByUser]) {
                    errorAlert = [...errorAlert, 'Người sử dụng không chính xác'];
                }
                if (item.usedByOrganizationalUnit && !departmentList[item.usedByOrganizationalUnit]) {
                    errorAlert = [...errorAlert, 'Đơn vị sử dụng không chính xác'];
                }

                // Format date
                let startDate = item.startDate;
                let endDate = item.endDate;

                item = {
                    ...item,
                    startDate: (startDate && typeof startDate === 'string') ? startDate : this.convertExcelDateToJSDate(startDate, "dd-mm-yy"),
                    endDate: (endDate && typeof endDate === 'string') ? endDate : this.convertExcelDateToJSDate(endDate, "dd-mm-yy"),
                    errorAlert: errorAlert
                }
                importUsageInformationData = [...importUsageInformationData,
                {
                    ...item,
                    usedByUser: item.usedByUser && userList[item.usedByUser],
                    usedByOrganizationalUnit: item.usedByOrganizationalUnit && departmentList[item.usedByOrganizationalUnit],
                    startDate: (startDate && typeof startDate === 'string') ? this.convertStringToDate(startDate) : this.convertExcelDateToJSDate(startDate, "yy-mm-dd"),
                    endDate: (endDate && typeof endDate === 'string') ? this.convertStringToDate(endDate) : this.convertExcelDateToJSDate(endDate, "yy-mm-dd")
                }
                ];

                return item;
            });

            this.setState(state => {
                return {
                    ...state,
                    importUsageInformationData: importUsageInformationData,

                    importUsageInformationDataShow: value,
                    rowErrorUsageInformationData: rowError
                }
            })
        } else {
            if (!(value.length === 1 && !value[0].code)) {
                this.setState(state => {
                    return {
                        ...state,
                        checkFileImportUsageInformation: checkFileImport,
                    }
                })
            }
        }
    }

    // Xử lý file import sự cố tài sản
    handleImportExcelIncidentInformation = (value, checkFileImport) => {
        const { user } = this.props;
        let userList = {};
        let rowError = [], importIncidentInformationData = [];

        if (user) {
            user.list.map(item => {
                userList[item.name + " - " + item.email] = item._id;
            })
        }

        if (checkFileImport) {
            value = value.map((item, index) => {
                let errorAlert = [];
                let incidentType = ["Hỏng hóc", "Mất"];
                let status = ["Chờ xử lý", "Đã xử lý"];

                /* Tạm thời không bắt buộc nhập các trường sau 
                    if (!item.dateOfIncident || !item.description || (item.reportedBy && !userList[item.reportedBy])
                        || (item.type && !incidentType.includes(item.type))
                        || (item.statusIncident && !status.includes(item.statusIncident))
                    ) {
                        rowError = [...rowError, index + 1];
                        item = { ...item, error: true };
                    }
                
                    if (!item.dateOfIncident) {
                        errorAlert = [...errorAlert, 'Ngày phát hiện không được để trống'];
                    }

                    if (!item.description) {
                        errorAlert = [...errorAlert, 'Nội dung không được để trống'];
                    }
                */

                if ((item.type && !incidentType.includes(item.type)) || (item.reportedBy && !userList[item.reportedBy]) || (item.statusIncident && !status.includes(item.statusIncident))) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }

                if (item.type && !incidentType.includes(item.type)) {
                    errorAlert = [...errorAlert, 'Loại sự cố không chính xác'];
                }

                if (item.reportedBy && !userList[item.reportedBy]) {
                    errorAlert = [...errorAlert, 'Người báo cáo không chính xác'];
                }
                if (item.statusIncident && !status.includes(item.statusIncident)) {
                    errorAlert = [...errorAlert, 'Trạng thái không chính xác'];
                }

                // Format date
                let dateOfIncident = item.dateOfIncident;

                item = {
                    ...item,
                    dateOfIncident: (dateOfIncident && typeof dateOfIncident === 'string') ? dateOfIncident : this.convertExcelDateToJSDate(dateOfIncident, "dd-mm-yy"),
                    errorAlert: errorAlert
                }
                importIncidentInformationData = [...importIncidentInformationData,
                {
                    ...item,
                    reportedBy: item.reportedBy && userList[item.reportedBy],
                    dateOfIncident: (dateOfIncident && typeof dateOfIncident === 'string') ? this.convertStringToDate(dateOfIncident) : this.convertExcelDateToJSDate(dateOfIncident, "yy-mm-dd")
                }
                ]

                return item;
            });

            this.setState(state => {
                return {
                    ...state,
                    importIncidentInformationData: importIncidentInformationData,

                    importIncidentInformationDataShow: value,
                    rowErrorIncidentInformationData: rowError
                }
            })
        } else {
            if (!(value.length === 1 && !value[0].code)) {
                this.setState(state => {
                    return {
                        ...state,
                        checkFileImportIncidentInformation: checkFileImport,
                    }
                })
            }
        }
    }

    // Xử lý file import bảo trì tài sản
    handleImportExcelMaintainanceInformation = (value, checkFileImport) => {
        let rowError = [], importMaintainanceInformationData = [];

        if (checkFileImport) {
            value = value.map((item, index) => {
                let errorAlert = [];
                let maintainanceType = ["Sửa chữa", "Thay thế", "Nâng cấp"];
                let status = ["Đã thực hiện", "Đang thực hiện", "Chưa thực hiện"];

                if ((item.type && !maintainanceType.includes(item.type)) || (item.status && !status.includes(item.status))) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }

                if (item.type && !maintainanceType.includes(item.maintainanceType)) {
                    errorAlert = [...errorAlert, 'Phân loại không chính xác'];
                }

                if (item.status && !status.includes(item.status)) {
                    errorAlert = [...errorAlert, 'Trạng thái không chính xác'];
                }

                // Format date
                let createDate = item.createDate;
                let startDate = item.startDate;
                let endDate = item.endDate;

                item = {
                    ...item,
                    createDate: (createDate && typeof createDate === 'string') ? createDate : this.convertExcelDateToJSDate(createDate, "dd-mm-yy"),
                    startDate: (startDate && typeof startDate === 'string') ? startDate : this.convertExcelDateToJSDate(startDate, "dd-mm-yy"),
                    endDate: (endDate && typeof endDate === 'string') ? endDate : this.convertExcelDateToJSDate(endDate, "dd-mm-yy"),
                    errorAlert: errorAlert
                };
                importMaintainanceInformationData = [...importMaintainanceInformationData,
                {
                    ...item,
                    createDate: (createDate && typeof createDate === 'string') ? this.convertStringToDate(createDate) : this.convertExcelDateToJSDate(createDate, "yy-mm-dd"),
                    startDate: (startDate && typeof startDate === 'string') ? this.convertStringToDate(startDate) : this.convertExcelDateToJSDate(startDate, "yy-mm-dd"),
                    endDate: (endDate && typeof endDate === 'string') ? this.convertStringToDate(endDate) : this.convertExcelDateToJSDate(endDate, "yy-mm-dd")
                }
                ]

                return item;
            });

            this.setState(state => {
                return {
                    ...state,
                    importMaintainanceInformationData: importMaintainanceInformationData,

                    importMaintainanceInformationDataShow: value,
                    rowErrorMaintainanceInformationData: rowError
                }
            })
        } else {
            if (!(value.length === 1 && !value[0].code)) {
                this.setState(state => {
                    return {
                        ...state,
                        checkFileImportMaintainanceInformation: checkFileImport,
                    }
                })
            }
        }
    }

    // Xử lý file import thanh lý tài sản
    handleImportExcelDisposalInformation = (value, checkFileImport) => {
        let rowError = [], importDisposalInformationData = [];

        if (checkFileImport) {
            value = value.map((item, index) => {
                let errorAlert = [];
                let disposalType = ["Tiêu hủy", "Nhượng bán", "Tặng"];

                if ((item.disposalType && !disposalType.includes(item.disposalType))) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }

                if (item.disposalType && !disposalType.includes(item.disposalType)) {
                    errorAlert = [...errorAlert, 'Hình thức thanh lý không chính xác'];
                }

                //Format date
                let disposalDate = item.disposalDate;

                item = {
                    ...item,
                    disposalDate: (disposalDate && typeof disposalDate === 'string') ? disposalDate : this.convertExcelDateToJSDate(disposalDate, "dd-mm-yy"),
                    errorAlert: errorAlert
                };
                importDisposalInformationData = [...importDisposalInformationData,
                {
                    ...item,
                    disposalDate: (disposalDate && typeof disposalDate === 'string') ? this.convertStringToDate(disposalDate) : this.convertExcelDateToJSDate(disposalDate, "yy-mm-dd")
                }
                ]
                return item;
            });

            this.setState(state => {
                return {
                    ...state,
                    importDisposalInformationData: importDisposalInformationData,

                    importDisposalInformationDataShow: value,
                    rowErrorDisposalInformationData: rowError
                }
            })
        } else {
            if (!(value.length === 1 && !value[0].code)) {
                this.setState(state => {
                    return {
                        ...state,
                        checkFileImportDisposalInformation: checkFileImport,
                    }
                })
            }
        }
    }

    /** Bắt sự kiện import file */
    handleImportExcel = (files) => {
        // Reset các biến check lỗi và dữ liệu cũ
        this.setState(state => {
            return {
                ...state,
                importGeneralInformationData: [],
                importDepreciationInformationData: [],
                importDisposalInformationData: [],
                importIncidentInformationData: [],
                importMaintainanceInformationData: [],
                importUsageInformationData: [],

                importGeneralInformationDataShow: [],
                importDepreciationInformationDataShow: [],
                importDisposalInformationDataShow: [],
                importIncidentInformationDataShow: [],
                importMaintainanceInformationDataShow: [],
                importUsageInformationDataShow: [],

                checkFileImportGeneralInformation: true,
                checkFileImportDepreciationInformation: true,
                checkFileImportDisposalInformation: true,
                checkFileImportMaintainanceInformation: true,
                checkFileImportIncidentInformation: true,
                checkFileImportUsageInformation: true
            }
        })

        // Xử lý các sheet trong file excel
        ImportFileExcel.importData(files[0], configurationGeneralInformationOfAssetTemplate, this.handleImportExcelGeneralInformation);
        ImportFileExcel.importData(files[0], configurationDepreciationInformationOfAssetTemplate, this.handleImportExcelDepreciationInformation);
        ImportFileExcel.importData(files[0], configurationDisposalInformationOfAssetTemplate, this.handleImportExcelDisposalInformation);
        ImportFileExcel.importData(files[0], configurationIncidentInformationOfAssetTemplate, this.handleImportExcelIncidentInformation);
        ImportFileExcel.importData(files[0], configurationMaintainanceInformationOfAssetTemplate, this.handleImportExcelMaintainanceInformation);
        ImportFileExcel.importData(files[0], configurationUsageInformationOfAssetTemplate, this.handleImportExcelUsageInformation);
    }

    render() {
        const { translate } = this.props;
        const {
            importGeneralInformationDataShow,
            importUsageInformationDataShow,
            importDepreciationInformationDataShow,
            importIncidentInformationDataShow,
            importMaintainanceInformationDataShow,
            importDisposalInformationDataShow,

            rowErrorGeneralInformationData,
            rowErrorDepreciationInformationData,
            rowErrorDisposalInformationData,
            rowErrorMaintainanceInformationData,
            rowErrorUsageInformationData,
            rowErrorIncidentInformationData,

            checkFileImportGeneralInformation,
            checkFileImportDepreciationInformation,
            checkFileImportDisposalInformation,
            checkFileImportMaintainanceInformation,
            checkFileImportIncidentInformation,
            checkFileImportUsageInformation
        } = this.state;

        let importAssetTemplateData = this.convertAssetTemplate(importAssetTemplate);

        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-import-asset"
                    formID="form-import-asset"
                    title={translate('menu.add_asset')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <div className="box-body row">
                        <div className="form-group col-md-6 col-xs-12">
                            <label>{translate('human_resource.choose_file')}</label>
                            <UploadFile
                                importFile={this.handleImportExcel}
                            />
                        </div>
                        <div className="form-group col-md-6 col-xs-12">
                            <ExportExcel id={`download_asset_file`} type='link' exportData={importAssetTemplateData}
                                buttonName='Download file import mẫu' />
                        </div>
                    </div>

                    <div className="nav-tabs-custom row" style={{ marginTop: '-10px' }}>
                        <ul className="nav nav-tabs">
                            <li className="active"><a title="Thông tin chung" data-toggle="tab" href="#import_create_general">Thông tin chung</a></li>
                            <li><a title="Thông tin khấu hao" data-toggle="tab" href="#import_depreciation">Thông tin khấu hao</a></li>
                            <li><a title="Thông tin sử dụng" data-toggle="tab" href="#import_usage">Thông tin sử dụng</a></li>
                            <li><a title="Thông tin sự cố" data-toggle="tab" href="#import_incident">Thông tin sự cố</a></li>
                            <li><a title="Thông tin bảo trì" data-toggle="tab" href="#import_maintainance">Thông tin bảo trì</a></li>
                            <li><a title="Thông tin thanh lý" data-toggle="tab" href="#import_disposal">Thông tin thanh lý</a></li>
                        </ul>
                        <div className="tab-content">
                            {/* Thông tin chung */}
                            <AssetImportTab
                                id="import_create_general"
                                scrollTable={true}
                                className="tab-pane active"
                                configuration={configurationGeneralInformationOfAssetTemplate}
                                importData={importGeneralInformationDataShow}
                                rowError={rowErrorGeneralInformationData}
                                checkFileImport={checkFileImportGeneralInformation}
                            />

                            {/* Thông tin khấu hao */}
                            <AssetImportTab
                                id="import_depreciation"
                                className="tab-pane"
                                configuration={configurationDepreciationInformationOfAssetTemplate}
                                importData={importDepreciationInformationDataShow}
                                rowError={rowErrorDepreciationInformationData}
                                checkFileImport={checkFileImportDepreciationInformation}
                            />

                            {/* Thông tin sử dụng */}
                            <AssetImportTab
                                id="import_usage"
                                className="tab-pane"
                                configuration={configurationUsageInformationOfAssetTemplate}
                                importData={importUsageInformationDataShow}
                                rowError={rowErrorUsageInformationData}
                                checkFileImport={checkFileImportUsageInformation}
                            />

                            {/* Thông tin sự cố */}
                            <AssetImportTab
                                id="import_incident"
                                className="tab-pane"
                                configuration={configurationIncidentInformationOfAssetTemplate}
                                importData={importIncidentInformationDataShow}
                                rowError={rowErrorIncidentInformationData}
                                checkFileImport={checkFileImportIncidentInformation}
                            />

                            {/* Thông tin bảo trì */}
                            <AssetImportTab
                                id="import_maintainance"
                                className="tab-pane"
                                configuration={configurationMaintainanceInformationOfAssetTemplate}
                                importData={importMaintainanceInformationDataShow}
                                rowError={rowErrorMaintainanceInformationData}
                                checkFileImport={checkFileImportMaintainanceInformation}
                            />

                            {/* Thông tin thanh lý */}
                            <AssetImportTab
                                id="import_disposal"
                                className="tab-pane"
                                configuration={configurationDisposalInformationOfAssetTemplate}
                                importData={importDisposalInformationDataShow}
                                rowError={rowErrorDisposalInformationData}
                                checkFileImport={checkFileImportDisposalInformation}
                            />
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { user, department, assetsManager, role, assetType } = state;
    return { user, department, assetsManager, role, assetType };
};

const actions = {
    addNewAsset: AssetManagerActions.addNewAsset,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllUsers: UserActions.get
};

const connectedAssetImportForm = connect(mapState, actions)(withTranslate(AssetImportForm));
export { connectedAssetImportForm as AssetImportForm };
