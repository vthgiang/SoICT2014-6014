import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, ExportExcel, SelectMulti } from '../../../../../common-components';

import { IncidentEditForm } from '../../../user/asset-assigned/components/incidentEditForm';

import { IncidentActions } from '../../../user/asset-assigned/redux/actions';
import { ManageIncidentActions } from '../redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';

import { AssetManagerActions } from '../../asset-information/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { AssetEditForm } from '../../asset-information/components/assetEditForm';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { parse } from 'uuid';

function IncidentManagement(props) {
    const tableId_constructor = "table-incident-manager";
    const defaultConfig = { limit: 5 }
    const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId: tableId_constructor,
        code: "",
        assetName: "",
        assetType: null,
        purchaseDate: null,
        status: "",
        canRegisterForUse: "",
        incidentCode: "",
        incidentStatus: "",
        incidentType: "",
        page: 1,
        limit: limit_constructor,
        managedBy: props.managedBy ? props.managedBy : localStorage.getItem('userId')
    })

    const { translate, assetsManager, assetType, user, isActive, incidentManager } = props;
    const { page, limit, currentRow, currentRowEditAsset, managedBy, tableId } = state;

    var lists = [], exportData;
    var userlist = user.list;
    if (incidentManager.isLoading === false) {
        lists = incidentManager.incidentList;
    }

    var pageTotal = ((incidentManager.incidentLength % limit) === 0) ?
        parseInt(incidentManager.incidentLength / limit) :
        parseInt((incidentManager.incidentLength / limit) + 1);

    useEffect(() => {
        let { managedBy } = state;
        props.getAssetTypes();
        props.getUser();
        props.getIncidents(state);
        props.getListBuildingAsTree();
        if (!props.isActive || props.isActive === "tab-pane active") {
            props.getAllAsset(state);
        }
    }, [])


    // Bắt sự kiện click chỉnh sửa thông tin sự cố
    const handleEdit = async (value, asset) => {
        value.asset = asset;
        await setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-incident').modal('show');
    }

    // Function format dữ liệu Date thành string
    const formatDate2 = (date, monthYear = false) => {
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

    // Function format ngày hiện tại thành dạnh mm-yyyy
    const formatDate = (date) => {
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

        return [month, year].join('-');
    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    const handleCodeChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });

    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    const handleAssetNameChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });

    }
    // Function lưu giá trị mã sự cố vào state khi thay đổi
    const handleIncidentCodeChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });

    }

    // Lưu loại sự cố vào state
    const handleIncidentTypeChange = (value) => {
        if (value.length === 0) {
            value = ''
        }

        setState({
            ...state,
            incidentType: value
        })
    }

    // Lưu trạng thái sự cố vào state
    const handleIncidentStatusChange = (value) => {
        if (value.length === 0) {
            value = ''
        }

        setState({
            ...state,
            incidentStatus: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    const handleSubmitSearch = () => {
        setState({
            ...state,
            page: 1
        })
        props.getIncidents(state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    const setLimit = async (number) => {
        await setState({
            ...state,
            limit: parseInt(number),
        });

        props.getIncidents({ ...state, limit: parseInt(number) });
    }

    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        let page = parseInt(pageNumber);
        await setState({
            ...state,
            page: page,
        });
        props.getIncidents({ ...state, page: page });
    }

    const deleteIncident = (assetId, incidentId) => {
        let { managedBy } = state
        props.deleteIncident(assetId, incidentId).then(({ response }) => {
            if (response.data.success) {
                props.getIncidents(state);
            }
        });
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    const convertDataToExportData = (data, userlist) => {
        let fileName = "Bảng quản lý thông tin sự cố tài sản ";
        let convertedData = [];
        if (data) {
            data = data.forEach((asset, dataIndex) => {
                let item = asset.asset;

                if (item && item.incidentLogs && item.incidentLogs.length !== 0) {
                    let assetLog = item.incidentLogs.map((x, index) => {
                        let code = x.incidentCode;
                        let assetName = item.assetName;
                        let assetCode = item.code;
                        let type = convertIncidentType(x.type);
                        let reporter = (x.reportedBy && userlist.length && userlist.filter(item => item._id === x.reportedBy).pop()) ? userlist.filter(item => item._id === x.reportedBy).pop().email : '';
                        let createDate = (x.dateOfIncident) ? formatDate2(x.dateOfIncident) : ''
                        let status = convertIncidentStatus(x.statusIncident);
                        let description = x.description;

                        return {
                            index: dataIndex + index + 1,
                            assetCode: assetCode,
                            assetName: assetName,
                            code: code,
                            type: type,
                            reporter: reporter,
                            createDate: createDate,
                            des: description,
                            status: status

                        }
                    })
                    for (let i = 0; i < assetLog.length; i++) {
                        convertedData = [...convertedData, assetLog[i]];
                    }
                }

            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: fileName,
                    tables: [
                        {
                            rowHeader: 2,
                            columns: [
                                { key: "index", value: "STT" },
                                { key: "assetCode", value: "Mã tài sản" },
                                { key: "assetName", value: "Tên tài sản" },
                                { key: "code", value: "Mã sự cố" },
                                { key: "type", value: "Loại sự cố" },
                                { key: "reporter", value: "Người báo cáo" },
                                { key: "des", value: "Nội dung" },
                                { key: "createDate", value: "Ngày phát hiện" },
                                { key: "status", value: "Trạng thái" },
                            ],
                            data: convertedData
                        }
                    ]
                },
            ]
        }
        return exportData;

    }

    // Bắt sự kiện click chỉnh sửa thông tin tài sản
    const handleEditAsset = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRowEditAsset: value
            }
        });
        window.$('#modal-edit-asset').modal('show');

        // Mở tab thứ 4
        window.$('#modal-edit-asset').on('shown.bs.modal', function () {
            window.$('#nav-tabs li:eq(3) a').tab('show');
        });

    }

    const convertIncidentType = (type) => {
        const { translate } = props;
        if (Number(type) === 1) {
            return translate('asset.general_information.damaged');
        } else if (Number(type) === 2) {
            return translate('asset.general_information.lost');
        } else {
            return null;
        }
    }

    const convertIncidentStatus = (status) => {
        const { translate } = props;
        if (Number(status) === 1) {
            return translate('asset.general_information.waiting');
        } else if (Number(status) === 2) {
            return translate('asset.general_information.processed')
        } else return null;
    }


    if (lists && userlist) {
        exportData = convertDataToExportData(lists, userlist);
    }
    return (
        <div className={isActive ? isActive : "box"}>
            <div className="box-body qlcv">

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

                    {/* Mã sự cố */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.incident_code')}</label>
                        <input type="text" className="form-control" name="incidentCode" onChange={handleIncidentCodeChange} placeholder={translate('asset.general_information.incident_code')} autoComplete="off" />
                    </div>

                    {/* Loại sự cố */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.incident_type')}</label>
                        <SelectMulti id={`multiSelectIncidentType`} multiple="multiple"
                            options={{ nonSelectedText: translate('asset.general_information.select_incident_type'), allSelectedText: translate('asset.general_information.select_all_incident_type') }}
                            onChange={handleIncidentTypeChange}
                            items={[
                                { value: 1, text: translate('asset.general_information.damaged') },
                                { value: 2, text: translate('asset.general_information.lost') },
                            ]}
                        >
                        </SelectMulti>
                    </div>
                </div>

                <div className="form-inline" style={{ marginBottom: 10 }}>
                    {/* Trạng thái */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.status')}</label>
                        <SelectMulti id={`multiSelectIncidentStatus`} multiple="multiple"
                            options={{ nonSelectedText: translate('task.task_management.select_status'), allSelectedText: translate('task.task_management.select_all_status') }}
                            onChange={handleIncidentStatusChange}
                            items={[
                                { value: 1, text: translate('asset.general_information.waiting') },
                                { value: 2, text: translate('asset.general_information.processed') },
                            ]}
                        >
                        </SelectMulti>
                    </div>

                    <div className="form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={() => handleSubmitSearch()}>{translate('asset.general_information.search')}</button>
                    </div>
                    {exportData && <ExportExcel id="export-asset-incident-management" exportData={exportData} style={{ marginRight: 10 }} />}
                </div>

                {/* Bảng danh sách sự cố tài sản */}
                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.asset_code')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.incident_code')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.incident_type')}</th>
                            <th style={{ width: "10%" }}>{translate('general.status')}</th>
                            <th style={{ width: "8%" }}>{translate('asset.general_information.reported_by')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.date_incident')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.content')}</th>
                            <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('asset.general_information.asset_code'),
                                        translate('asset.general_information.asset_name'),
                                        translate('asset.general_information.incident_code'),
                                        translate('asset.general_information.incident_type'),
                                        translate('general.status'),
                                        translate('asset.general_information.reported_by'),
                                        translate('asset.general_information.date_incident'),
                                        translate('asset.general_information.content'),
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(lists && lists.length !== 0) ?
                            lists.map((x, index) => {
                                return (
                                    <tr key={index}>
                                        <td><a onClick={() => handleEditAsset(x.asset)}>{x.asset && x.asset.code}</a></td>
                                        <td>{x.asset.assetName}</td>
                                        <td>{x.incidentCode}</td>
                                        <td>{convertIncidentType(x.type)}</td>
                                        <td>{convertIncidentStatus(x.statusIncident)}</td>
                                        <td>{x.reportedBy && userlist.length && userlist.filter(item => item._id === x.reportedBy).pop() ? userlist.filter(item => item._id === x.reportedBy).pop().email : ''}</td>
                                        <td>{x.dateOfIncident ? formatDate2(x.dateOfIncident) : ''}</td>
                                        <td>{x.description}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => handleEdit(x, x.asset)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_incident_info')}><i
                                                className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('asset.asset_info.delete_incident_info')}
                                                data={{
                                                    id: x._id,
                                                    info: x.asset.code + " - " + x.incidentCode
                                                }}
                                                func={() => deleteIncident(x.asset._id, x._id)}
                                            />
                                        </td>
                                    </tr>
                                )
                            }) : null
                        }
                    </tbody>
                </table>

                {assetsManager.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                {/* PaginateBar */}
                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={setPage} />
            </div>

            {/* Form chỉnh sửa thông tin sự cố */}
            {
                currentRow &&
                <IncidentEditForm
                    _id={currentRow._id}
                    managedBy={managedBy}
                    asset={currentRow.asset}
                    incidentCode={currentRow.incidentCode}
                    type={currentRow.type}
                    reportedBy={currentRow.reportedBy}
                    dateOfIncident={formatDate2(currentRow.dateOfIncident)}
                    description={currentRow.description}
                    statusIncident={currentRow.statusIncident}
                />
            }

            {/* Form chỉnh sửa thông tin tài sản */}
            {
                currentRowEditAsset &&
                <AssetEditForm
                    _id={currentRowEditAsset._id}
                    employeeId={managedBy}
                    avatar={currentRowEditAsset.avatar}
                    code={currentRowEditAsset.code}
                    assetName={currentRowEditAsset.assetName}
                    serial={currentRowEditAsset.serial}
                    assetType={JSON.stringify(currentRowEditAsset.assetType)}
                    group={currentRowEditAsset.group}
                    purchaseDate={currentRowEditAsset.purchaseDate}
                    warrantyExpirationDate={currentRowEditAsset.warrantyExpirationDate}
                    managedBy={currentRowEditAsset.managedBy}
                    assignedToUser={currentRowEditAsset.assignedToUser}
                    assignedToOrganizationalUnit={currentRowEditAsset.assignedToOrganizationalUnit}
                    handoverFromDate={currentRowEditAsset.handoverFromDate}
                    handoverToDate={currentRowEditAsset.handoverToDate}
                    location={currentRowEditAsset.location}
                    description={currentRowEditAsset.description}
                    status={currentRowEditAsset.status}
                    typeRegisterForUse={currentRowEditAsset.typeRegisterForUse}
                    detailInfo={currentRowEditAsset.detailInfo}
                    readByRoles={currentRowEditAsset.readByRoles}
                    cost={currentRowEditAsset.cost}
                    residualValue={currentRowEditAsset.residualValue}
                    startDepreciation={currentRowEditAsset.startDepreciation}
                    usefulLife={currentRowEditAsset.usefulLife}
                    depreciationType={currentRowEditAsset.depreciationType}
                    estimatedTotalProduction={currentRowEditAsset.estimatedTotalProduction}
                    unitsProducedDuringTheYears={currentRowEditAsset.unitsProducedDuringTheYears && currentRowEditAsset.unitsProducedDuringTheYears.map((x) => ({
                        month: formatDate2(x.month),
                        unitsProducedDuringTheYear: x.unitsProducedDuringTheYear
                    })
                    )}

                    disposalDate={currentRowEditAsset.disposalDate}
                    disposalType={currentRowEditAsset.disposalType}
                    disposalCost={currentRowEditAsset.disposalCost}
                    disposalDesc={currentRowEditAsset.disposalDesc}

                    maintainanceLogs={currentRowEditAsset.maintainanceLogs}
                    usageLogs={currentRowEditAsset.usageLogs}
                    incidentLogs={currentRowEditAsset.incidentLogs}
                    archivedRecordNumber={currentRowEditAsset.archivedRecordNumber}
                    files={currentRowEditAsset.documents}
                    linkPage={"management"}
                    page={page}
                />
            }
        </div>
    );
};

function mapState(state) {
    const { assetsManager, assetType, user, auth, incidentManager } = state;
    return { assetsManager, assetType, user, auth, incidentManager };
};

const actionCreators = {
    getIncidents: ManageIncidentActions.getIncidents,
    deleteIncident: IncidentActions.deleteIncident,
    getAssetTypes: AssetTypeActions.getAssetTypes,
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    getListBuildingAsTree: AssetManagerActions.getListBuildingAsTree,
};

const connectedListUsage = connect(mapState, actionCreators)(withTranslate(IncidentManagement));
export { connectedListUsage as IncidentManagement };
