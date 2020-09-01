import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti, ExportExcel } from '../../../../../common-components';

import { AssetManagerActions } from '../../../admin/asset-information/redux/actions';
import { AssetTypeActions } from "../../../admin/asset-type/redux/actions";
import { UserActions } from '../../../../super-admin/user/redux/actions';

import { AssetDetailForm, AssetEditForm } from './combinedContent';

import Swal from 'sweetalert2';

class AssetGeneralInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: null,
            purchaseDate: null,
            status: "",
            canRegisterForUse: "",
            page: 0,
            limit: 5,
            managedBy:localStorage.getItem('userId')
        }
    }

    componentDidMount() {
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getListBuildingAsTree();
        this.props.getAllAsset(this.state);
        this.props.getUser();
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
        console.log(value);
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-asset').modal('show');
    }

    /**Xoa tasktemplate theo id */
    handleDelete = (id) => {
        const { translate } = this.props;
        const { managedBy } = this.state;
            Swal.fire({
                title: translate('asset.asset_info.delete_asset_confirm'),
                type: 'success',
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('task_template.confirm')
            }).then((res) => {
                if (res.value) {
                    this.props.deleteAsset(id,managedBy);
                }
            });
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
    handleCanRegisterForUseChange = (value) => {
        if (value.length === 0) {
            value = null
        }
        
        this.setState({
            ...this.state,
            canRegisterForUse: value
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

    render() {
        var { assetsManager, assetType, translate, user,id } = this.props;
        var { page, limit, currentRowView, currentRow, purchaseDate } = this.state;

        var lists = "", exportData;
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
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
            <div id="general" class ="tab-pane active">
                <div className="box-body qlcv">

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
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.type')}</label>
                            <SelectMulti id={`multiSelectType2`} multiple="multiple"
                                options={{ nonSelectedText: translate('asset.general_information.select_asset_type'), allSelectedText: translate('asset.general_information.select_all_asset_type') }}
                                onChange={this.handleTypeChange}
                                items={[]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.purchase_date')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={purchaseDate}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
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
                                onChange={this.handleCanRegisterForUseChange}
                                items={[
                                    { value: true, text: translate('asset.general_information.can_register') },
                                    { value: false, text: translate('asset.general_information.cant_register') },
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
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
                                        <td>{x.assetType && assettypelist.length && assettypelist.find(item => item._id === x.assetType) ? assettypelist.find(item => item._id === x.assetType).typeName : 'Asset is deleted'}</td>
                                        <td>{this.formatDate(x.purchaseDate)}</td>
                                        <td>{x.managedBy && userlist.length && userlist.find(item => item._id === x.managedBy) ? userlist.find(item => item._id === x.managedBy).name : 'User is deleted'}</td>
                                        <td>{x.assignedToUser ? (userlist.length && userlist.find(item => item._id === x.assignedToUser) ? userlist.find(item => item._id === x.assignedToUser).name : 'User is deleted') : ''}</td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('asset.general_information.view')}><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.general_information.edit_info')}><i className="material-icons">edit</i></a>
                                            <a href="cursor:{'pointer'}" onClick={() => this.handleDelete(x._id)} className="delete" title={translate('asset.general_information.delete_info')}>
                                                            <i className="material-icons"></i>
                                            </a>
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
                        canRegisterForUse={currentRowView.canRegisterForUse}
                        detailInfo={currentRowView.detailInfo}
                        cost={currentRowView.cost}

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
                        files={currentRowView.files}
                    />
                }

                {/* Form chỉnh sửa thông tin tài sản */}
                {
                    currentRow &&
                    <AssetEditForm
                        _id={currentRow._id}
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
                        canRegisterForUse={currentRow.canRegisterForUse}
                        detailInfo={currentRow.detailInfo}

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
                        files={currentRow.files}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { assetsManager, assetType, user } = state;
    return { assetsManager, assetType, user };
};

const actionCreators = {
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllAsset: AssetManagerActions.getAllAsset,
    getListBuildingAsTree: AssetManagerActions.getListBuildingAsTree,
    deleteAsset: AssetManagerActions.deleteAsset,
    getUser: UserActions.get,

};

const assetManagement = connect(mapState, actionCreators)(withTranslate(AssetGeneralInfo));
export { assetManagement as AssetGeneralInfo };