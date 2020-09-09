import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti, ExportExcel, TreeSelect } from '../../../../../common-components';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { AssetManagerActions } from '../redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import { AssetCreateForm, AssetDetailForm, AssetEditForm } from './combinedContent';
import { configTaskTempalte } from '../../../../task/task-template/component/fileConfigurationImportTaskTemplate';

class AssetManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: "",
            purchaseDate: null,
            status: "",
            typeRegisterForUse: "",
            page: 0,
            limit: 5,
            managedBy: this.props.managedBy ? this.props.managedBy : ''
        }
    }

    componentDidMount() {
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getListBuildingAsTree();
        this.props.getAllAsset(this.state);
        this.props.getUser();
        this.props.getAllRoles();
        this.props.getAllDepartments();
    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate2(date) {
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
    formatDate(date, monthYear = false) {
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
    handleView = async (value) => {
        await this.setState(state => {
            return {
                currentRowView: value
            }
        });
        window.$('#modal-view-asset').modal('show');
    }

    // Bắt sự kiện click chỉnh sửa thông tin tài sản
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-asset').modal('show');
    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleCodeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị tên tài sản vào state khi thay đổi
    handleAssetNameChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = async (value) => {
        if (!value) {
            value = null
        }

        await this.setState({
            ...this.state,
            purchaseDate: value
        });
    }

    // Function lưu giá trị loại tài sản vào state khi thay đổi
    handleAssetTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            assetType: value
        })
    }

    // Bắt sự kiện thay đổi nhóm tài sản
    handleGroupChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            group: value
        })
    }

    // Function lưu giá trị status vào state khi thay đổi
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            status: value
        })
    }

    // Function lưu giá trị status vào state khi thay đổi
    handleTypeRegisterForUseChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            typeRegisterForUse: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSubmitSearch = async () => {
        this.props.getAllAsset(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getAllAsset(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),
        });

        this.props.getAllAsset(this.state);
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data, assettypelist, userlist) => {
        let fileName = "Bảng quản lý thông tin tài sản ";
        let length = 0;
        let convertedData = [];
        if (data) {
            data = data.map((x, index) => {

                let code = x.code;
                let name = x.assetName;
                let description = x.description;
                let type = x.assetType && assettypelist.length && assettypelist.find(item => item._id === x.assetType) ? assettypelist.find(item => item._id === x.assetType).typeName : 'Asset is deleted';
                let purchaseDate = this.formatDate(x.purchaseDate);
                let manager = x.managedBy && userlist.length && userlist.find(item => item._id === x.managedBy) ? userlist.find(item => item._id === x.managedBy).email : 'User is deleted';
                let assigner = x.assignedToUser ? (userlist.length && userlist.find(item => item._id === x.assignedToUser) ? userlist.find(item => item._id === x.assignedToUser).email : 'User is deleted') : ''
                // let handoverFromDate = x.handoverFromDate ? this.formatDate(x.handoverFromDate) : '';
                // let handoverToDate = x.handoverToDate ? this.formatDate(x.handoverToDate) : '';
                let status = x.status;
                length = x.detailInfo.length;
                let info = (length) ? (x.detailInfo.map((item, index) => {
                    return {
                        infoName: item.nameField,
                        value: item.value
                    }
                })) : "";
                let infoName = info[0] ? info[0].infoName : "";
                let value = length ? (info[0].value) : "";


                let dataOneRow = {
                    index: index + 1,
                    code: code,
                    name: name,
                    description: description,
                    type: type,
                    purchaseDate: purchaseDate,
                    manager: manager,
                    assigner: assigner,
                    // handoverFromDate: handoverFromDate,
                    // handoverToDate: handoverToDate,
                    status: status,
                    infoName: infoName,
                    value: value

                }
                convertedData = [...convertedData, dataOneRow];
                if (length > 1) {
                    for (let i = 1; i < length; i++) {
                        dataOneRow = {
                            index: "",
                            code: "",
                            name: "",
                            description: "",
                            type: "",
                            purchaseDate: "",
                            manager: "",
                            assigner: "",
                            handoverFromDate: "",
                            handoverToDate: "",
                            status: "",
                            infoName: info[i].infoName,
                            value: info[i].value
                        }
                        convertedData = [...convertedData, dataOneRow];
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
                                { key: "name", value: "Họ và tên" },
                                { key: "description", value: "Mô tả" },
                                { key: "type", value: "Loại tài sản" },
                                { key: "purchaseDate", value: "Ngày nhập" },
                                { key: "manager", value: "Người quản lý" },
                                { key: "assigner", value: "Người sử dụng" },
                                { key: "handoverFromDate", value: "Thời gian bắt đầu sử dụng" },
                                { key: "handoverToDate", value: "Thời gian kết thúc sử dụng" },
                                { key: "status", value: "Trạng thái" },
                                { key: "infoName", value: "Tên trường thông tin" },
                                { key: "value", value: "Giá trị" }
                            ],
                            data: convertedData
                        }
                    ]
                },
            ]
        }
        return exportData;
    }

    getAssetTypes = () => {
        let { assetType } = this.props;
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

    render() {
        var { assetsManager, assetType, translate, user, isActive, department } = this.props;
        var { page, limit, currentRowView, currentRow, purchaseDate, managedBy } = this.state;

        var lists = "", exportData;
        var userlist = user.list, departmentlist = department.list;
        var assettypelist = assetType.listAssetTypes;
        let typeArr = this.getAssetTypes();
        let assetTypeName = this.state.assetType ? this.state.assetType : [];

        if (assetsManager.isLoading === false) {
            lists = assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % limit) === 0) ?
            parseInt(assetsManager.totalList / limit) :
            parseInt((assetsManager.totalList / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);

        if (userlist && lists && assettypelist) {
            exportData = this.convertDataToExportData(lists, assettypelist, userlist);
        }
        return (
            <div className={isActive ? isActive : "box"}>

                <div className="box-body qlcv">
                    {/* Form thêm tài sản mới */}
                    <AssetCreateForm />

                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder={translate('asset.general_information.asset_code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_name')}</label>
                            <input type="text" className="form-control" name="assetName" onChange={this.handleAssetNameChange} placeholder={translate('asset.general_information.asset_name')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        {/* Loại tài sản */}
                        <div className="form-group">
                            <label>{translate('asset.general_information.type')}</label>
                            <TreeSelect
                                data={typeArr}
                                value={assetTypeName}
                                handleChange={this.handleAssetTypeChange}
                                mode="hierarchical"
                            />
                        </div>
                        {/* Nhóm tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_group')}</label>
                            <SelectMulti id={`multiSelectGroupInManagement`} multiple="multiple"
                                options={{ nonSelectedText: translate('asset.asset_info.select_group'), allSelectedText: translate('asset.general_information.select_all_group') }}
                                onChange={this.handleGroupChange}
                                items={[
                                    { value: "Building", text: translate('asset.dashboard.building') },
                                    { value: "Vehicle", text: translate('asset.dashboard.vehicle') },
                                    { value: "Machine", text: translate('asset.dashboard.machine') },
                                    { value: "Other", text: translate('asset.dashboard.other') },
                                ]}
                            >
                            </SelectMulti>
                        </div>
                    </div>

                    <div className="form-inline" >
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus1`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('asset.general_information.select_all_status') }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "Sẵn sàng sử dụng", text: translate('asset.general_information.ready_use') },
                                    { value: "Đang sử dụng", text: translate('asset.general_information.using') },
                                    { value: "Hỏng hóc", text: translate('asset.general_information.damaged') },
                                    { value: "Mất", text: translate('asset.general_information.lost') },
                                    { value: "Thanh lý", text: translate('asset.general_information.disposal') }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.can_register')}</label>
                            <SelectMulti id={`multiSelectStatus3`} multiple="multiple"
                                options={{ nonSelectedText: translate('asset.general_information.select_register'), allSelectedText: translate('asset.general_information.select_all_register') }}
                                onChange={this.handleTypeRegisterForUseChange}
                                items={[
                                    { value: true, text: translate('asset.general_information.can_register') },
                                    { value: false, text: translate('asset.general_information.cant_register') },
                                ]}
                            >
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Ngày nhập */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.purchase_date')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={purchaseDate}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                        {/* Nút tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={this.handleSubmitSearch}>{translate('asset.general_information.search')}</button>
                        </div>
                        {exportData && <ExportExcel id="export-asset-info-management" exportData={exportData} style={{ marginRight: 10 }} />}
                    </div>

                    {/* Bảng các tài sản */}
                    <table id="asset-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_type')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.purchase_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.manager')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.user')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.organization_unit')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('asset.general_information.action')}
                                    <DataTableSetting
                                        tableId="asset-table"
                                        columnArr={[
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.asset_type'),
                                            translate('asset.general_information.purchase_date'),
                                            translate('asset.general_information.manager'),
                                            translate('asset.general_information.user'),
                                            translate('asset.general_information.organizaiton_unit'),
                                            translate('asset.general_information.status')
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) &&
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.code}</td>
                                        <td>{x.assetName}</td>
                                        <td>{x.assetType && x.assetType.length ? x.assetType.map((item, index) => { let suffix = index < x.assetType.length - 1 ? ", " : ""; return item.typeName + suffix }) : 'Asset is deleted'}</td>
                                        <td>{this.formatDate(x.purchaseDate)}</td>
                                        <td>{x.managedBy && userlist.length && userlist.find(item => item._id === x.managedBy) ? userlist.find(item => item._id === x.managedBy).name : 'User is deleted'}</td>
                                        <td>{x.assignedToUser ? (userlist.length && userlist.find(item => item._id === x.assignedToUser) ? userlist.find(item => item._id === x.assignedToUser).name : 'User is deleted') : ''}</td>
                                        <td>{x.assignedToOrganizationalUnit ? (departmentlist.length && departmentlist.find(item => item._id === x.assignedToOrganizationalUnit) ? departmentlist.find(item => item._id === x.assignedToOrganizationalUnit).name : 'Organizational Unit is deleted') : ''}</td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('asset.general_information.view')}><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.general_information.edit_info')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('asset.general_information.delete_info')}
                                                data={{
                                                    id: x._id,
                                                    info: x.code + " - " + x.assetName
                                                }}
                                                func={this.props.deleteAsset}
                                            />
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {assetsManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
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
                        managedBy={currentRowView.managedBy}
                        assignedToUser={currentRowView.assignedToUser}
                        assignedToOrganizationalUnit={currentRowView.assignedToOrganizationalUnit}
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
                        assetType={currentRow.assetType}
                        group={currentRow.group}
                        purchaseDate={currentRow.purchaseDate}
                        warrantyExpirationDate={currentRow.warrantyExpirationDate}
                        managedBy={currentRow.managedBy}
                        assignedToUser={currentRow.assignedToUser}
                        assignedToOrganizationalUnit={currentRow.assignedToOrganizationalUnit}
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
                            month: this.formatDate2(x.month),
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
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { assetsManager, assetType, user, role, department } = state;
    return { assetsManager, assetType, user, role, department };
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
