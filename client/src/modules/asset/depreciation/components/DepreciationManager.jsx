import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, PaginateBar, SelectMulti, ExportExcel } from '../../../../common-components';

import { AssetManagerActions } from '../../asset-management/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';

import { AssetDetailForm } from '../../asset-management/components/combinedContent';
import { DepreciationEditForm } from './depreciationEditForm';

class DepreciationManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: null,
            month: "",
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getAllAsset(this.state);
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
    handleEdit = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-depreciation').modal('show');
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
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            month: value
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

    // Function bắt sự kiện tìm kiếm
    handleSubmitSearch = async () => {
        await this.setState({
            ...this.state,
        })
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
        var page = (pageNumber - 1) * this.state.limit;

        await this.setState({
            page: parseInt(page),
        });

        this.props.getAllAsset(this.state);
    }

    addMonth = (date, month) => {
        date = new Date(date);
        let newDate = new Date(date.setMonth(date.getMonth() + month));

        return this.formatDate(newDate);
    };

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data, assettypelist) => {
        let fileName = "Bảng quản lý khấu hao tài sản ";
        let formater = new Intl.NumberFormat();

        if (data) {

            data = data.map((x, index) => {

                let code = x.code;
                let assetName = x.assetName;
                let type = assettypelist && assettypelist.filter(item => item._id === x.assetType).pop() ? assettypelist.filter(item => item._id === x.assetType).pop().typeName : ''
                let cost = formater.format(parseInt(x.cost));
                let startDepreciation = this.formatDate(x.startDepreciation);
                let month = x.usefulLife;
                let depreciationPerYear = formater.format(parseInt(12 * (x.cost / x.usefulLife)));
                let depreciationPerMonth = formater.format(parseInt((x.cost / x.usefulLife)));
                let accumulatedValue = formater.format(parseInt(((x.cost / x.usefulLife)) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(x.startDepreciation).getFullYear() * 12 + new Date(x.startDepreciation).getMonth()))));
                let remainingValue = formater.format(parseInt(x.cost - ((x.cost / x.usefulLife)) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(x.startDepreciation).getFullYear() * 12 + new Date(x.startDepreciation).getMonth()))));
                let endDepreciation = this.addMonth(x.startDepreciation, x.usefulLife);

                return {
                    index: index + 1,
                    code: code,
                    assetName: assetName,
                    type: type,
                    cost: cost,
                    startDepreciation: startDepreciation,
                    month: month,
                    depreciationPerYear: depreciationPerYear,
                    depreciationPerMonth: depreciationPerMonth,
                    accumulatedValue: accumulatedValue,
                    remainingValue: remainingValue,
                    endDepreciation: endDepreciation

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
                            tableName : fileName,
                            rowHeader: 2,
                            columns: [
                                { key: "index", value: "STT" },
                                { key: "code", value: "Mã tài sản" },
                                { key: "assetName", value: "Tên tài sản" },
                                { key: "type", value: "Loại tài sản" },
                                { key: "cost", value: "Nguyên giá (VNĐ)" },
                                { key: "startDepreciation", value: "Thời gian bắt đầu trích khấu hao" },
                                { key: "month", value: "Thời gian chích khấu hao" },
                                { key: "depreciationPerYear", value: "Mức độ khấu hao trung bình hàng năm" },
                                { key: "depreciationPerMonth", value: "Mức độ khấu hao trung bình hàng tháng" },
                                { key: "accumulatedValue", value: "Giá trị hao mòn lũy kế" },
                                { key: "remainingValue", value: "Giá trị còn lại" },
                                { key: "endDepreciation", value: "Thời gian kết thúc trích khấu hao" },
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData;

    }

    render() {
        const { translate, assetsManager, assetType } = this.props;
        const { page, limit, currentRowView, currentRow } = this.state;

        var lists = "", exportData;
        var assettypelist = assetType.listAssetTypes;
        var formater = new Intl.NumberFormat();
        if (assetsManager.isLoading === false) {
            lists = assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % limit) === 0) ?
            parseInt(assetsManager.totalList / limit) :
            parseInt((assetsManager.totalList / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);

        if (lists && assettypelist) {
            exportData = this.convertDataToExportData(lists, assettypelist);
        }

        return (
            <div className="box">
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

                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Phân loại */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.type')}</label>
                            <SelectMulti id={`multiSelectType`} multiple="multiple"
                                options={{ nonSelectedText: translate('asset.general_information.select_asset_type'), allSelectedText: translate('asset.general_information.select_all_asset_type') }}
                                onChange={this.handleTypeChange}
                                items={[]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Tháng */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.month')}</label>
                            <DatePicker
                                id="month1"
                                dateFormat="month-year"
                                value={this.formatDate2(Date.now())}
                                onChange={this.handleMonthChange}
                            />
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={() => this.handleSubmitSearch()}>{translate('asset.general_information.search')}</button>
                        </div>
                        {exportData && <ExportExcel id="export-asset-depreciation-management" exportData={exportData} style={{ marginRight: 10 }} />}
                    </div>

                    {/* Bảng thông tin khấu hao */}
                    <table id="depreciation-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_type')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.original_price')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.start_depreciation')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.depreciation.depreciation_time')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.asset_info.annual_depreciation')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.asset_info.monthly_depreciation')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.depreciation.accumulated_value')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.depreciation.remaining_value')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.end_depreciation')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('asset.general_information.action')}
                                    <DataTableSetting
                                        tableId="depreciation-table"
                                        columnArr={[
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.asset_type'),
                                            translate('asset.general_information.original_price'),
                                            translate('asset.general_information.start_depreciation'),
                                            translate('asset.depreciation.depreciation_time'),
                                            translate('asset.asset_info.annual_depreciation'),
                                            translate('asset.asset_info.monthly_depreciation'),
                                            translate('asset.depreciation.accumulated_value'),
                                            translate('asset.depreciation.remaining_value'),
                                            translate('asset.general_information.end_depreciation')
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {lists &&
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.code}</td>
                                        <td>{x.assetName}</td>
                                        <td>{assettypelist && assettypelist.filter(item => item._id === x.assetType).pop() ? assettypelist.filter(item => item._id === x.assetType).pop().typeName : 'Asset type is deleted'}</td>
                                        <td>{formater.format(parseInt(x.cost))} VNĐ</td>
                                        <td>{this.formatDate(x.startDepreciation)}</td>
                                        <td>{x.usefulLife} tháng</td>
                                        <td>{formater.format(parseInt(12 * (x.cost / x.usefulLife)))} VNĐ/năm</td>
                                        <td>{formater.format(parseInt((x.cost / x.usefulLife)))} VNĐ/tháng</td>
                                        <td>{formater.format(parseInt(((x.cost / x.usefulLife)) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(x.startDepreciation).getFullYear() * 12 + new Date(x.startDepreciation).getMonth()))))} VNĐ</td>
                                        <td>{formater.format(parseInt(x.cost - ((x.cost / x.usefulLife)) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(x.startDepreciation).getFullYear() * 12 + new Date(x.startDepreciation).getMonth()))))} VNĐ</td>
                                        <td>{this.addMonth(x.startDepreciation, x.usefulLife)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('asset.general_information.view')}><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.depreciation.edit_depreciation')}><i
                                                className="material-icons">edit</i></a>
                                        </td>
                                    </tr>
                                ))
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

                {/* Form xem chi tiết thông tin khấu hao */}
                {
                    currentRowView &&
                    <AssetDetailForm
                        _id={currentRowView._id}
                        avatar={currentRowView.avatar}
                        code={currentRowView.code}
                        assetName={currentRowView.assetName}
                        serial={currentRowView.serial}
                        assetType={currentRowView.assetType}
                        purchaseDate={currentRowView.purchaseDate}
                        warrantyExpirationDate={currentRowView.warrantyExpirationDate}
                        managedBy={currentRowView.managedBy}
                        assignedTo={currentRowView.assignedTo}
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

                {/* Form chỉnh sửa thông tin khấu hao */}
                {
                    currentRow &&
                    <DepreciationEditForm
                        _id={currentRow._id}
                        asset={currentRow.asset}
                        cost={currentRow.cost}
                        residualValue={currentRow.residualValue}
                        startDepreciation={this.formatDate(currentRow.startDepreciation)}
                        usefulLife={currentRow.usefulLife}
                        depreciationType={currentRow.depreciationType}
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
    getUser: UserActions.get,
};

const connectedListDepreciation = connect(mapState, actionCreators)(withTranslate(DepreciationManager));
export { connectedListDepreciation as DepreciationManager };
