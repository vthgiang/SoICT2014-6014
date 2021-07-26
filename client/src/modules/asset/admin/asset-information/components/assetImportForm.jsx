import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { AssetManagerActions } from '../redux/actions';

import { AssetImportTab } from './assetImportTab';

import { UploadFile, ImportFileExcel, ExportExcel, SelectBox } from '../../../../../common-components';

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

function AssetImportForm(props) {
    const [state, setState] = useState({
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
        checkFileImportUsageInformation: true,

        // Loai import, = "createAsset" để thêm tài sản mới, = "editAsset" để thêm thông tin cho tài sản đã tồn tại
        importType: "createAsset"
    })

    const { translate } = props;
    const { id, type } = props;

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
        checkFileImportUsageInformation,
    } = state;

    useEffect(() => {
        props.getAllUsers();
    }, []);

    const save = async () => {
        const { type, page, limit } = props;
        const {
            importGeneralInformationData,
            importDepreciationInformationData,
            importDisposalInformationData,
            importIncidentInformationData,
            importMaintainanceInformationData,
            importUsageInformationData,
        } = state;

        let assets = [];
        if (type === 'add') {
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
        } else {
            let assetCodes = [];

            if (importGeneralInformationData && importGeneralInformationData.length !== 0) {
                importGeneralInformationData.map(item => {
                    assetCodes.push(item.code)
                })
            }
            if (importDepreciationInformationData && importDepreciationInformationData.length !== 0) {
                importDepreciationInformationData.map(item => {
                    assetCodes.push(item.code)
                })
            }
            if (importDisposalInformationData && importDisposalInformationData.length !== 0) {
                importDisposalInformationData.map(item => {
                    assetCodes.push(item.code)
                })
            }
            if (importIncidentInformationData && importIncidentInformationData.length !== 0) {
                importIncidentInformationData.map(item => {
                    assetCodes.push(item.code)
                })
            }
            if (importMaintainanceInformationData && importMaintainanceInformationData.length !== 0) {
                importMaintainanceInformationData.map(item => {
                    assetCodes.push(item.code)
                })
            }
            if (importUsageInformationData && importUsageInformationData.length !== 0) {
                importUsageInformationData.map(item => {
                    assetCodes.push(item.code)
                })
            }

            assetCodes = Array.from(new Set(assetCodes))

            if (assetCodes && assetCodes.length !== 0) {
                assetCodes.map(assetCode => {
                    let importDisposalTemporary = importDisposalInformationData.filter(item => item.code === assetCode);
                    let importDepreciationTemporary = importDepreciationInformationData.filter(item => item.code === assetCode);
                    let importGeneralInformationTemporary = importGeneralInformationData.filter(item => item.code === assetCode);
                    assets.push({
                        ...importGeneralInformationTemporary[0],
                        ...importDepreciationTemporary[0],
                        ...importDisposalTemporary[0],
                        maintainanceLogs: importMaintainanceInformationData.filter(item => item.code === assetCode),
                        usageLogs: importUsageInformationData.filter(item => item.code === assetCode),
                        incidentLogs: importIncidentInformationData.filter(item => item.code === assetCode),
                    })
                })
            }
        }

        if (assets && assets.length !== 0) {
            if (type === 'add') {
                await props.addNewAsset(assets)
            } else {
                await props.updateInformationAsset(undefined, assets, true);
            }

            await props.getAllAsset({
                code: "",
                assetName: "",
                assetType: "",
                purchaseDate: null,
                disposalDate: null,
                status: '',
                group: "",
                handoverUnit: "",
                handoverUser: "",
                typeRegisterForUse: "",
                page: page,
                limit: limit,
                managedBy: ''
            });
        }
    }

    const isFormValidated = () => {
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
        } = state;

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
    const convertExcelDateToJSDate = (serial, type) => {
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
    const convertStringToDate = (data, monthYear = false) => {
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
    const convertAssetTemplate = (dataTemplate) => {
        const { user, assetsManager, role, assetType, department } = props;
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
                    dataTemplate.dataSheets[i] = convertImportGeneralInformationOfAssetTemplate(dataTemplate.dataSheets[i], userList, assetTypes, roles, assetLocations, assetGroups, status, typeRegisterForUse);
                    break;
                case "Depreciation":
                    dataTemplate.dataSheets[i] = convertImportDepreciationInformationOfAssetTemplate(dataTemplate.dataSheets[i], depreciationType);
                    break;
                case "Usage":
                    dataTemplate.dataSheets[i] = convertImportUsageInformationOfAssetTemplate(dataTemplate.dataSheets[i], userList, departmentList);
                    break;
                case "Incident":
                    dataTemplate.dataSheets[i] = convertImportIncidentInformationOfAssetTemplate(dataTemplate.dataSheets[i], userList, incidentType, incidentStatus);
                    break;
                case "Maintainance":
                    dataTemplate.dataSheets[i] = convertImportMaintainanceInformationOfAssetTemplate(dataTemplate.dataSheets[i], maintainanceType, maintainanceStatus);
                    break;
                case "Disposal":
                    dataTemplate.dataSheets[i] = convertImportDisposalInformationOfAssetTemplate(dataTemplate.dataSheets[i], disposalType);
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
    const convertImportGeneralInformationOfAssetTemplate = (dataTemplate, userList, assetTypes, roles, assetLocations, assetGroups, status, typeRegisterForUse) => {
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
    const convertImportDepreciationInformationOfAssetTemplate = (dataTemplate, depreciationType) => {
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
    const convertImportUsageInformationOfAssetTemplate = (dataTemplate, userList, departmentList) => {
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
    const convertImportIncidentInformationOfAssetTemplate = (dataTemplate, userList, incidentType, status) => {
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
    const convertImportMaintainanceInformationOfAssetTemplate = (dataTemplate, maintainanceType, status) => {
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
    const convertImportDisposalInformationOfAssetTemplate = (dataTemplate, disposalType) => {
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
    const handleImportExcelGeneralInformation = (value, checkFileImport) => {
        const { user, assetsManager, role, assetType } = props;
        const { type } = props;

        let importGeneralInformationData = [];
        let managers = {}, assetTypes = {}, roles = {}, assetLocations = {};
        let rowError = [];
        let allRoleId = [];

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
                roles[item.name] = item._id;
                allRoleId = [...allRoleId, item._id];
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
                    let detailInfo = [];

                    if (type === 'add') {
                        // Check lỗi dữ liệu import || !valueTemporary.group
                        if (!valueTemporary.code || !valueTemporary.assetName || !valueTemporary.assetType || !valueTemporary.status || !valueTemporary.typeRegisterForUse
                            || (valueTemporary.group && !assetGroups[valueTemporary.group])
                            || (valueTemporary.assetType && !assetTypes[valueTemporary.assetType])
                            || (valueTemporary.typeRegisterForUse && !typeRegisterForUse[valueTemporary.typeRegisterForUse])
                            || (valueTemporary.status && !status[valueTemporary.status])
                            || (valueTemporary.managedBy && !managers[valueTemporary.managedBy])
                            || (valueTemporary.readByRoles && (valueTemporary?.readByRoles?.trim().toLowerCase() !== 'all' && !roles[valueTemporary.readByRoles]))
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

                        // if (!valueTemporary.group) {
                        //     errorAlert = [...errorAlert, 'Nhóm tài sản không được để trống'];
                        // } else
                        if (valueTemporary.group && !assetGroups[valueTemporary.group]) {
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

                        if (valueTemporary.readByRoles && (valueTemporary?.readByRoles?.trim().toLowerCase() !== 'all' && !roles[valueTemporary.readByRoles])) {
                            errorAlert = [...errorAlert, 'Những roles có quyền không chính xác'];
                        }

                        if (valueTemporary.location && !assetLocations[valueTemporary.location]) {
                            errorAlert = [...errorAlert, 'Vị trí tài sản không chính xác'];
                        }
                    } else {
                        if ((valueTemporary.group && !assetGroups[valueTemporary.group])
                            || (valueTemporary.assetType && !assetTypes[valueTemporary.assetType])
                            || (valueTemporary.typeRegisterForUse && !typeRegisterForUse[valueTemporary.typeRegisterForUse])
                            || (valueTemporary.status && !status[valueTemporary.status])
                            || (valueTemporary.managedBy && !managers[valueTemporary.managedBy])
                            || (valueTemporary.readByRoles && (valueTemporary?.readByRoles?.trim().toLowerCase() !== 'all' && !roles[valueTemporary.readByRoles]))
                            || (valueTemporary.location && !assetLocations[valueTemporary.location])
                        ) {
                            rowError = [...rowError, i + 1];
                            valueTemporary = { ...valueTemporary, error: true };
                        }

                        if (valueTemporary.group && !assetGroups[valueTemporary.group]) {
                            errorAlert = [...errorAlert, 'Nhóm tài sản không chính xác'];
                        }

                        if (valueTemporary.assetType && !assetTypes[valueTemporary.assetType]) {
                            errorAlert = [...errorAlert, 'Loại tài sản không chính xác'];
                        }

                        if (valueTemporary.status && !status[valueTemporary.status]) {
                            errorAlert = [...errorAlert, 'Trạng thái không chính xác'];
                        }

                        if (valueTemporary.typeRegisterForUse && !typeRegisterForUse[valueTemporary.typeRegisterForUse]) {
                            errorAlert = [...errorAlert, 'Quyền đăng ký sử dụng không chính xác'];
                        }

                        if (valueTemporary.managedBy && !managers[valueTemporary.managedBy]) {
                            errorAlert = [...errorAlert, 'Người quản lý không chính xác'];
                        }

                        if (valueTemporary.readByRoles && (valueTemporary?.readByRoles?.trim().toLowerCase() !== 'all' && !roles[valueTemporary.readByRoles])) {
                            errorAlert = [...errorAlert, 'Những roles có quyèn không chính xác'];
                        }

                        if (valueTemporary.location && !assetLocations[valueTemporary.location]) {
                            errorAlert = [...errorAlert, 'Vị trí tài sản không chính xác'];
                        }
                    }
                    //chưa xác định

                    // Format date
                    let purchaseDate = valueTemporary.purchaseDate;
                    let warrantyExpirationDate = valueTemporary.warrantyExpirationDate;

                    valueTemporary = {
                        ...valueTemporary,
                        purchaseDate: (purchaseDate && typeof purchaseDate === 'string') ? purchaseDate : convertExcelDateToJSDate(purchaseDate, "dd-mm-yy"),
                        warrantyExpirationDate: (warrantyExpirationDate && typeof warrantyExpirationDate === 'string') ? warrantyExpirationDate : convertExcelDateToJSDate(warrantyExpirationDate, "dd-mm-yy"),
                        errorAlert: errorAlert
                    };

                    let count = 0;
                    valueTemporary?.assetInfo?.length && valueTemporary.assetInfo.forEach(x => {
                        if (x === null)
                            count = count + 1;
                    });

                    if (count < 2) {
                        detailInfo = [...detailInfo, {
                            nameField: valueTemporary?.assetInfo[0] ? valueTemporary?.assetInfo[0] : "",
                            value: valueTemporary?.assetInfo[1] ? valueTemporary?.assetInfo[1]?.toString() : "",
                        }]
                    }

                    importGeneralInformationData = [...importGeneralInformationData,
                    {
                        ...valueTemporary,
                        assetType: assetTypes[valueTemporary.assetType] && [assetTypes[valueTemporary.assetType]],
                        readByRoles: valueTemporary?.readByRoles?.trim().toLowerCase() === 'all' ? allRoleId : roles[valueTemporary.readByRoles] && [roles[valueTemporary.readByRoles]],
                        managedBy: managers[valueTemporary.managedBy],
                        location: assetLocations[valueTemporary.location],
                        group: assetGroups[valueTemporary.group],
                        typeRegisterForUse: typeRegisterForUse[valueTemporary.typeRegisterForUse],
                        status: status[valueTemporary.status],
                        purchaseDate: (purchaseDate && typeof purchaseDate === 'string') ? convertStringToDate(purchaseDate) : convertExcelDateToJSDate(purchaseDate, "yy-mm-dd"),
                        warrantyExpirationDate: (warrantyExpirationDate && typeof warrantyExpirationDate === 'string') ? convertStringToDate(warrantyExpirationDate) : convertExcelDateToJSDate(warrantyExpirationDate, "yy-mm-dd"),
                        detailInfo,
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

                        if (importGeneralInformationData && (importGeneralInformationData.length - 1 >= 0)) {
                            let assetInfo = {};
                            let countInfo = 0;
                            valueTemporary?.assetInfo?.length === 2 && valueTemporary.assetInfo.forEach(x => {
                                if (x === null)
                                    countInfo = countInfo + 1;
                            });

                            if (countInfo < 2) {
                                assetInfo = {
                                    nameField: valueTemporary?.assetInfo[0] ? valueTemporary?.assetInfo[0] : "",
                                    value: valueTemporary?.assetInfo[1] ? valueTemporary?.assetInfo[1]?.toString() : "",
                                }
                            }

                            importGeneralInformationData[importGeneralInformationData.length - 1] = {
                                ...importGeneralInformationData[importGeneralInformationData.length - 1],
                                assetType: valueTemporary && valueTemporary.assetType && importGeneralInformationData[importGeneralInformationData.length - 1].assetType
                                    ? [
                                        ...importGeneralInformationData[importGeneralInformationData.length - 1].assetType,
                                        valueTemporary.assetType && assetTypes[valueTemporary.assetType]
                                    ]
                                    : importGeneralInformationData[importGeneralInformationData.length - 1].assetType,
                                readByRoles: valueTemporary && valueTemporary.readByRoles && importGeneralInformationData[importGeneralInformationData.length - 1].readByRoles && !importGeneralInformationData[importGeneralInformationData.length - 1].readByRoles.includes(roles[valueTemporary.readByRoles])
                                    ? [
                                        ...importGeneralInformationData[importGeneralInformationData.length - 1].readByRoles,
                                        valueTemporary.readByRoles && roles[valueTemporary.readByRoles]
                                    ]
                                    : importGeneralInformationData[importGeneralInformationData.length - 1].readByRoles,
                                detailInfo: Object.keys(assetInfo).length && importGeneralInformationData[importGeneralInformationData.length - 1].detailInfo ?
                                    [...importGeneralInformationData[importGeneralInformationData.length - 1].detailInfo, assetInfo] :
                                    importGeneralInformationData[importGeneralInformationData.length - 1].detailInfo,
                            }
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
            console.log('importGeneralInformationData', importGeneralInformationData)
            setState(state => {
                return {
                    ...state,
                    importGeneralInformationData: importGeneralInformationData,

                    importGeneralInformationDataShow: value,
                    rowErrorGeneralInformationData: rowError
                }
            })
        } else {
            if (!(value.length === 1 && !value[0].code)) {
                setState(state => {
                    return {
                        ...state,
                        checkFileImportGeneralInformation: checkFileImport,
                    }
                })
            }
        }
    }

    // Xử lý file import khấu hao tài sản
    const handleImportExcelDepreciationInformation = (value, checkFileImport) => {
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
                    startDepreciation: (startDepreciation && typeof startDepreciation === 'string') ? startDepreciation : convertExcelDateToJSDate(startDepreciation, "dd-mm-yy"),
                    errorAlert: errorAlert
                };
                importDepreciationInformationData = [...importDepreciationInformationData,
                {
                    ...item,
                    depreciationType: depreciationType[item.depreciationType],
                    startDepreciation: (startDepreciation && typeof startDepreciation === 'string') ? convertStringToDate(startDepreciation) : convertExcelDateToJSDate(startDepreciation, "yy-mm-dd")
                }
                ]

                return item;
            });

            setState(state => {
                return {
                    ...state,
                    importDepreciationInformationData: importDepreciationInformationData,

                    importDepreciationInformationDataShow: value,
                    rowErrorDepreciationInformationData: rowError
                }
            })
        } else {
            if (!(value.length === 1 && !value[0].code)) {
                setState(state => {
                    return {
                        ...state,
                        checkFileImportDepreciationInformation: checkFileImport,
                    }
                })
            }
        }
    }

    // Xử lý file import sử dụng tài sản
    const handleImportExcelUsageInformation = (value, checkFileImport) => {
        const { user, department } = props;
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
                    startDate: (startDate && typeof startDate === 'string') ? startDate : convertExcelDateToJSDate(startDate, "dd-mm-yy"),
                    endDate: (endDate && typeof endDate === 'string') ? endDate : convertExcelDateToJSDate(endDate, "dd-mm-yy"),
                    errorAlert: errorAlert
                }
                importUsageInformationData = [...importUsageInformationData,
                {
                    ...item,
                    usedByUser: item.usedByUser && userList[item.usedByUser],
                    usedByOrganizationalUnit: item.usedByOrganizationalUnit && departmentList[item.usedByOrganizationalUnit],
                    startDate: (startDate && typeof startDate === 'string') ? convertStringToDate(startDate) : convertExcelDateToJSDate(startDate, "yy-mm-dd"),
                    endDate: (endDate && typeof endDate === 'string') ? convertStringToDate(endDate) : convertExcelDateToJSDate(endDate, "yy-mm-dd")
                }
                ];

                return item;
            });

            setState(state => {
                return {
                    ...state,
                    importUsageInformationData: importUsageInformationData,

                    importUsageInformationDataShow: value,
                    rowErrorUsageInformationData: rowError
                }
            })
        } else {
            if (!(value.length === 1 && !value[0].code)) {
                setState(state => {
                    return {
                        ...state,
                        checkFileImportUsageInformation: checkFileImport,
                    }
                })
            }
        }
    }

    // Xử lý file import sự cố tài sản
    const handleImportExcelIncidentInformation = (value, checkFileImport) => {
        const { user } = props;
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
                    dateOfIncident: (dateOfIncident && typeof dateOfIncident === 'string') ? dateOfIncident : convertExcelDateToJSDate(dateOfIncident, "dd-mm-yy"),
                    errorAlert: errorAlert
                }
                importIncidentInformationData = [...importIncidentInformationData,
                {
                    ...item,
                    reportedBy: item.reportedBy && userList[item.reportedBy],
                    dateOfIncident: (dateOfIncident && typeof dateOfIncident === 'string') ? convertStringToDate(dateOfIncident) : convertExcelDateToJSDate(dateOfIncident, "yy-mm-dd")
                }
                ]

                return item;
            });

            setState(state => {
                return {
                    ...state,
                    importIncidentInformationData: importIncidentInformationData,

                    importIncidentInformationDataShow: value,
                    rowErrorIncidentInformationData: rowError
                }
            })
        } else {
            if (!(value.length === 1 && !value[0].code)) {
                setState(state => {
                    return {
                        ...state,
                        checkFileImportIncidentInformation: checkFileImport,
                    }
                })
            }
        }
    }

    // Xử lý file import bảo trì tài sản
    const handleImportExcelMaintainanceInformation = (value, checkFileImport) => {
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

                if (item.type && !maintainanceType.includes(item.type)) {
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
                    createDate: (createDate && typeof createDate === 'string') ? createDate : convertExcelDateToJSDate(createDate, "dd-mm-yy"),
                    startDate: (startDate && typeof startDate === 'string') ? startDate : convertExcelDateToJSDate(startDate, "dd-mm-yy"),
                    endDate: (endDate && typeof endDate === 'string') ? endDate : convertExcelDateToJSDate(endDate, "dd-mm-yy"),
                    errorAlert: errorAlert
                };
                importMaintainanceInformationData = [...importMaintainanceInformationData,
                {
                    ...item,
                    createDate: (createDate && typeof createDate === 'string') ? convertStringToDate(createDate) : convertExcelDateToJSDate(createDate, "yy-mm-dd"),
                    startDate: (startDate && typeof startDate === 'string') ? convertStringToDate(startDate) : convertExcelDateToJSDate(startDate, "yy-mm-dd"),
                    endDate: (endDate && typeof endDate === 'string') ? convertStringToDate(endDate) : convertExcelDateToJSDate(endDate, "yy-mm-dd")
                }
                ]

                return item;
            });

            setState(state => {
                return {
                    ...state,
                    importMaintainanceInformationData: importMaintainanceInformationData,

                    importMaintainanceInformationDataShow: value,
                    rowErrorMaintainanceInformationData: rowError
                }
            })
        } else {
            if (!(value.length === 1 && !value[0].code)) {
                setState(state => {
                    return {
                        ...state,
                        checkFileImportMaintainanceInformation: checkFileImport,
                    }
                })
            }
        }
    }

    // Xử lý file import thanh lý tài sản
    const handleImportExcelDisposalInformation = (value, checkFileImport) => {
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
                    disposalDate: (disposalDate && typeof disposalDate === 'string') ? disposalDate : convertExcelDateToJSDate(disposalDate, "dd-mm-yy"),
                    errorAlert: errorAlert
                };
                importDisposalInformationData = [...importDisposalInformationData,
                {
                    ...item,
                    disposalDate: (disposalDate && typeof disposalDate === 'string') ? convertStringToDate(disposalDate) : convertExcelDateToJSDate(disposalDate, "yy-mm-dd")
                }
                ]
                return item;
            });

            setState(state => {
                return {
                    ...state,
                    importDisposalInformationData: importDisposalInformationData,

                    importDisposalInformationDataShow: value,
                    rowErrorDisposalInformationData: rowError
                }
            })
        } else {
            if (!(value.length === 1 && !value[0].code)) {
                setState(state => {
                    return {
                        ...state,
                        checkFileImportDisposalInformation: checkFileImport,
                    }
                })
            }
        }
    }

    /** Bắt sự kiện import file */
    const handleImportExcel = (files) => {
        // Reset các biến check lỗi và dữ liệu cũ
        setState(state => {
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
        ImportFileExcel.importData(files[0], configurationGeneralInformationOfAssetTemplate, handleImportExcelGeneralInformation);
        ImportFileExcel.importData(files[0], configurationDepreciationInformationOfAssetTemplate, handleImportExcelDepreciationInformation);
        ImportFileExcel.importData(files[0], configurationDisposalInformationOfAssetTemplate, handleImportExcelDisposalInformation);
        ImportFileExcel.importData(files[0], configurationIncidentInformationOfAssetTemplate, handleImportExcelIncidentInformation);
        ImportFileExcel.importData(files[0], configurationMaintainanceInformationOfAssetTemplate, handleImportExcelMaintainanceInformation);
        ImportFileExcel.importData(files[0], configurationUsageInformationOfAssetTemplate, handleImportExcelUsageInformation);
    }


    let importAssetTemplateData = convertAssetTemplate(importAssetTemplate);

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={id}
                formID={`form-${id}`}
                title={type === 'add' ? translate('menu.add_asset') : translate('menu.update_asset')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <div className="box-body row">
                    <div className="form-group col-md-6 col-xs-12">
                        <label>{translate('human_resource.choose_file')}</label>
                        <UploadFile
                            importFile={handleImportExcel}
                        />
                    </div>
                    <div className="form-group col-md-6 col-xs-12">
                        <ExportExcel id={`download_asset_file`} type='link' exportData={importAssetTemplateData}
                            buttonName='Download file import mẫu' />
                    </div>
                </div>

                <div className="nav-tabs-custom row" style={{ marginTop: '-10px' }}>
                    <ul className="nav nav-tabs">
                        <li className="active"><a title="Thông tin chung" data-toggle="tab" href={`#import_create_general${id}`}>Thông tin chung</a></li>
                        <li><a title="Thông tin khấu hao" data-toggle="tab" href={`#import_depreciation${id}`}>Thông tin khấu hao</a></li>
                        <li><a title="Thông tin sử dụng" data-toggle="tab" href={`#import_usage${id}`}>Thông tin sử dụng</a></li>
                        <li><a title="Thông tin sự cố" data-toggle="tab" href={`#import_incident${id}`}>Thông tin sự cố</a></li>
                        <li><a title="Thông tin bảo trì" data-toggle="tab" href={`#import_maintainance${id}`}>Thông tin bảo trì</a></li>
                        <li><a title="Thông tin thanh lý" data-toggle="tab" href={`#import_disposal${id}`}>Thông tin thanh lý</a></li>
                    </ul>
                    <div className="tab-content">
                        {/* Thông tin chung */}
                        <AssetImportTab
                            id={`import_create_general${id}`}
                            scrollTable={true}
                            className="tab-pane active"
                            configuration={configurationGeneralInformationOfAssetTemplate}
                            importData={importGeneralInformationDataShow}
                            rowError={rowErrorGeneralInformationData}
                            checkFileImport={checkFileImportGeneralInformation}
                        />

                        {/* Thông tin khấu hao */}
                        <AssetImportTab
                            id={`import_depreciation${id}`}
                            className="tab-pane"
                            configuration={configurationDepreciationInformationOfAssetTemplate}
                            importData={importDepreciationInformationDataShow}
                            rowError={rowErrorDepreciationInformationData}
                            checkFileImport={checkFileImportDepreciationInformation}
                        />

                        {/* Thông tin sử dụng */}
                        <AssetImportTab
                            id={`import_usage${id}`}
                            className="tab-pane"
                            configuration={configurationUsageInformationOfAssetTemplate}
                            importData={importUsageInformationDataShow}
                            rowError={rowErrorUsageInformationData}
                            checkFileImport={checkFileImportUsageInformation}
                        />

                        {/* Thông tin sự cố */}
                        <AssetImportTab
                            id={`import_incident${id}`}
                            className="tab-pane"
                            configuration={configurationIncidentInformationOfAssetTemplate}
                            importData={importIncidentInformationDataShow}
                            rowError={rowErrorIncidentInformationData}
                            checkFileImport={checkFileImportIncidentInformation}
                        />

                        {/* Thông tin bảo trì */}
                        <AssetImportTab
                            id={`import_maintainance${id}`}
                            className="tab-pane"
                            configuration={configurationMaintainanceInformationOfAssetTemplate}
                            importData={importMaintainanceInformationDataShow}
                            rowError={rowErrorMaintainanceInformationData}
                            checkFileImport={checkFileImportMaintainanceInformation}
                        />

                        {/* Thông tin thanh lý */}
                        <AssetImportTab
                            id={`import_disposal${id}`}
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


function mapState(state) {
    const { user, department, assetsManager, role, assetType } = state;
    return { user, department, assetsManager, role, assetType };
};

const actions = {
    getAllAsset: AssetManagerActions.getAllAsset,
    addNewAsset: AssetManagerActions.addNewAsset,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllUsers: UserActions.get,
    updateInformationAsset: AssetManagerActions.updateInformationAsset
};

const connectedAssetImportForm = connect(mapState, actions)(withTranslate(AssetImportForm));
export { connectedAssetImportForm as AssetImportForm };
