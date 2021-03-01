import React, { Component } from 'react';
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

class IncidentManagement extends Component {
    constructor(props) {
        super(props);
        const tableId = "table-incident-manager";
        const defaultConfig = { limit: 5 }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        this.state = {
            tableId,
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
            limit: limit,
            managedBy: this.props.managedBy ? this.props.managedBy : localStorage.getItem('userId')
        }
    }

    componentDidMount() {
        let { managedBy } = this.state;
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: this.state.limit });
        this.props.getUser();
        this.props.getIncidents(this.state);

        if (!this.props.isActive || this.props.isActive === "tab-pane active") {
            this.props.getAllAsset(this.state);
        }
    }


    // Bắt sự kiện click chỉnh sửa thông tin sự cố
    handleEdit = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-incident').modal('show');
    }

    // Function format dữ liệu Date thành string
    formatDate2(date, monthYear = false) {
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
    formatDate(date) {
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
    handleCodeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleAssetNameChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }
    // Function lưu giá trị mã sự cố vào state khi thay đổi
    handleIncidentCodeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    // Lưu loại sự cố vào state
    handleIncidentTypeChange = (value) => {
        if (value.length === 0) {
            value = ''
        }

        this.setState({
            ...this.state,
            incidentType: value
        })
    }

    // Lưu trạng thái sự cố vào state
    handleIncidentStatusChange = (value) => {
        if (value.length === 0) {
            value = ''
        }

        this.setState({
            ...this.state,
            incidentStatus: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSubmitSearch = () => {
        this.setState({
            ...this.state,
            page: 1
        })
        this.props.getIncidents(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });

        this.props.getIncidents(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        await this.setState({
            page: parseInt(pageNumber),
        });
        this.props.getIncidents(this.state);
    }

    deleteIncident = (assetId, incidentId) => {
        let { managedBy } = this.state
        this.props.deleteIncident(assetId, incidentId).then(({ response }) => {
            if (response.data.success) {
                this.props.getIncidents(this.state);
            }
        });
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data, userlist) => {
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
                        let type = this.convertIncidentType(x.type);
                        let reporter = (x.reportedBy && userlist.length && userlist.filter(item => item._id === x.reportedBy).pop()) ? userlist.filter(item => item._id === x.reportedBy).pop().email : '';
                        let createDate = (x.dateOfIncident) ? this.formatDate2(x.dateOfIncident) : ''
                        let status = this.convertIncidentStatus(x.statusIncident);
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
    handleEditAsset = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowEditAsset: value
            }
        });
        window.$('#modal-edit-asset').modal('show');

        // Mở tab thứ 4
        window.$('.nav-tabs li:eq(3) a').tab('show');

    }

    convertIncidentType = (type) => {
        const { translate } = this.props;
        if (Number(type) === 1) {
            return translate('asset.general_information.damaged');
        } else if (Number(type) === 2) {
            return translate('asset.general_information.lost');
        } else {
            return null;
        }
    }

    convertIncidentStatus = (status) => {
        const { translate } = this.props;
        if (Number(status) === 1) {
            return translate('asset.general_information.waiting');
        } else if (Number(status) === 2) {
            return translate('asset.general_information.processed')
        } else return null;
    }

    render() {
        const { translate, assetsManager, assetType, user, isActive, incidentManager } = this.props;
        const { page, limit, currentRow, currentRowEditAsset, managedBy, tableId } = this.state;

        var lists = [], exportData;
        var userlist = user.list;
        if (incidentManager.isLoading === false) {
            lists = incidentManager.incidentList;
        }

        var pageTotal = ((incidentManager.incidentLength % limit) === 0) ?
            parseInt(incidentManager.incidentLength / limit) :
            parseInt((incidentManager.incidentLength / limit) + 1);

        if (lists && userlist) {
            exportData = this.convertDataToExportData(lists, userlist);
        }

        return (
            <div className={isActive ? isActive : "box"}>
                <div className="box-body qlcv">

                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">

                        {/* Mã tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder={translate('asset.general_information.asset_code')} autoComplete="off" />
                        </div>
                        {/* Tên tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_name')}</label>
                            <input type="text" className="form-control" name="assetName" onChange={this.handleAssetNameChange} placeholder={translate('asset.general_information.asset_name')} autoComplete="off" />
                        </div>
                    </div>

                    <div className="form-inline">

                        {/* Mã sự cố */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.incident_code')}</label>
                            <input type="text" className="form-control" name="incidentCode" onChange={this.handleIncidentCodeChange} placeholder={translate('asset.general_information.incident_code')} autoComplete="off" />
                        </div>

                        {/* Loại sự cố */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.incident_type')}</label>
                            <SelectMulti id={`multiSelectIncidentType`} multiple="multiple"
                                options={{ nonSelectedText: translate('asset.general_information.select_incident_type'), allSelectedText: translate('asset.general_information.select_all_incident_type') }}
                                onChange={this.handleIncidentTypeChange}
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
                                onChange={this.handleIncidentStatusChange}
                                items={[
                                    { value: 1, text: translate('asset.general_information.waiting') },
                                    { value: 2, text: translate('asset.general_information.processed') },
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={() => this.handleSubmitSearch()}>{translate('asset.general_information.search')}</button>
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
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) ?
                                lists.map((x, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><a onClick={() => this.handleEditAsset(x.asset)}>{x.asset && x.asset.code}</a></td>
                                            <td>{x.asset.assetName}</td>
                                            <td>{x.incidentCode}</td>
                                            <td>{this.convertIncidentType(x.type)}</td>
                                            <td>{this.convertIncidentStatus(x.statusIncident)}</td>
                                            <td>{x.reportedBy && userlist.length && userlist.filter(item => item._id === x.reportedBy).pop() ? userlist.filter(item => item._id === x.reportedBy).pop().email : ''}</td>
                                            <td>{x.dateOfIncident ? this.formatDate2(x.dateOfIncident) : ''}</td>
                                            <td>{x.description}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a onClick={() => this.handleEdit(x, x.asset)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_incident_info')}><i
                                                    className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content={translate('asset.asset_info.delete_incident_info')}
                                                    data={{
                                                        id: x._id,
                                                        info: x.asset.code + " - " + x.incidentCode
                                                    }}
                                                    func={() => this.deleteIncident(x.asset._id, x._id)}
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
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
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
                        dateOfIncident={this.formatDate2(currentRow.dateOfIncident)}
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
                        assetType={currentRowEditAsset.assetType}
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
                        canRegisterForUse={currentRowEditAsset.canRegisterForUse}
                        detailInfo={currentRowEditAsset.detailInfo}
                        readByRoles={currentRowEditAsset.readByRoles}
                        cost={currentRowEditAsset.cost}
                        residualValue={currentRowEditAsset.residualValue}
                        startDepreciation={currentRowEditAsset.startDepreciation}
                        usefulLife={currentRowEditAsset.usefulLife}
                        depreciationType={currentRowEditAsset.depreciationType}
                        estimatedTotalProduction={currentRowEditAsset.estimatedTotalProduction}
                        unitsProducedDuringTheYears={currentRowEditAsset.unitsProducedDuringTheYears && currentRowEditAsset.unitsProducedDuringTheYears.map((x) => ({
                            month: this.formatDate2(x.month),
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
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { assetsManager, assetType, user, auth, incidentManager } = state;
    return { assetsManager, assetType, user, auth, incidentManager };
};

const actionCreators = {
    getIncidents: ManageIncidentActions.getIncidents,
    deleteIncident: IncidentActions.deleteIncident,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
};

const connectedListUsage = connect(mapState, actionCreators)(withTranslate(IncidentManagement));
export { connectedListUsage as IncidentManagement };
