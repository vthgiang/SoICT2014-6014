import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, PaginateBar } from '../../../../common-components';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { AssetManagerActions } from '../../asset-management/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";

import { AssetEditForm } from '../../asset-management/components/combinedContent';
import { UsageCreateForm } from './usageCreateForm';

class UsageManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            month: "",
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getUser();
        this.props.getAllAsset({
            code: "",
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
            limit: 5,
        });
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

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
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
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.getAllAsset(this.state);
    }

    deleteUsage = (assetId, usageId) => {
        this.props.deleteUsage(assetId, usageId).then(({ response }) => {
            if (response.data.success) {
                this.props.getAllAsset({
                    code: "",
                    assetName: "",
                    month: null,
                    status: "",
                    page: 0,
                    limit: 5,
                });
            }
        });
    }

    render() {
        const { translate, assetsManager, assetType, user } = this.props;
        const { page, limit, currentRow } = this.state;

        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        var formater = new Intl.NumberFormat();
        if (this.props.assetsManager.isLoading === false) {
            lists = this.props.assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % limit) === 0) ?
            parseInt(assetsManager.totalList / limit) :
            parseInt((assetsManager.totalList / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);

        return (
            <div className="box">
                <div className="box-body qlcv">
                    {/* Form thêm mới thông tin sử dụng */}
                    <UsageCreateForm />

                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">
                        {/* Mã tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">Mã tài sản</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder="Mã tài sản" autoComplete="off" />
                        </div>

                        {/* Tên tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">Tên tài sản</label>
                            <input type="text" className="form-control" name="assetName" onChange={this.handleAssetNameChange} placeholder="Tên tài sản" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Tháng */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate2(Date.now())}
                                onChange={this.handleMonthChange}
                            />
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSubmitSearch()}>Tìm kiếm</button>
                        </div>
                    </div>

                    {/* Bảng thông tin đăng kí sử dụng tài sản */}
                    <table id="usage-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>Mã tài sản</th>
                                <th style={{ width: "10%" }}>Tên tài sản</th>
                                <th style={{ width: "10%" }}>Loại tài sản</th>
                                <th style={{ width: "8%" }}>Người sử dụng</th>
                                <th style={{ width: "10%" }}>Thời gian bắt đầu sử dụng</th>
                                <th style={{ width: "10%" }}>Thời gian kết thúc sử dụng</th>
                                <th style={{ width: "10%" }}>Vị trí tài sản</th>
                                <th style={{ width: "10%" }}>Trạng thái</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Hành động
                                <DataTableSetting
                                        tableId="usage-table"
                                        columnArr={[
                                            "Mã tài sản",
                                            "Tên tài sản",
                                            "Loại tài sản",
                                            "Người sử dụng",
                                            "Thời gian bắt đầu sử dụng",
                                            "Thời gian kết thúc sử dụng",
                                            // "Nội dung",
                                            "Vị trí tài sản",
                                            "Trạng thái",
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length) &&
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.code}</td>
                                        <td>{x.assetName}</td>
                                        <td>{x.assetType && assettypelist.length && assettypelist.find(item => item._id === x.assetType) ? assettypelist.find(item => item._id === x.assetType).typeName : ''}</td>
                                        <td>{x.assignedTo ? (userlist.length && userlist.find(item => item._id === x.assignedTo) ? userlist.find(item => item._id === x.assignedTo).name : 'User is deleted') : ''}</td>
                                        <td>{x.handoverFromDate ? this.formatDate(x.handoverFromDate) : ''}</td>
                                        <td>{x.handoverToDate ? this.formatDate(x.handoverToDate) : ''}</td>
                                        <td>{x.location}</td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin sử dụng tài sản"><i className="material-icons">edit</i></a>
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

                {/* Form chỉnh sửa thông tin đăng kí sử dụng */}
                {
                    currentRow &&
                    <AssetEditForm
                        _id={currentRow._id}
                        avatar={currentRow.avatar}
                        code={currentRow.code}
                        assetName={currentRow.assetName}
                        serial={currentRow.serial}
                        assetType={currentRow.assetType}
                        purchaseDate={currentRow.purchaseDate}
                        warrantyExpirationDate={currentRow.warrantyExpirationDate}
                        managedBy={currentRow.managedBy}
                        assignedTo={currentRow.assignedTo}
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
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
};

const connectedListUsage = connect(mapState, actionCreators)(withTranslate(UsageManagement));
export { connectedListUsage as UsageManagement };
