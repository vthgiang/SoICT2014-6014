import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti } from '../../../../common-components';

import { MaintainanceCreateForm } from './maintainanceCreateForm';
import { MaintainanceEditForm } from './maintainanceEditForm';

import { AssetManagerActions } from '../../asset-management/redux/actions';
import { MaintainanceActions } from '../redux/actions';

class MaintainanceManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maintainanceCode: "",
            month: "",
            type: null,
            status: null,
            page: 0,
            limit: 100,
        }
    }

    componentDidMount() {
        this.props.getAllAsset({
            code: "",
            assetName: "",
            assetType: null,
            month: null,
            status: null,
            page: 0,
            limit: 100,
        });
    }

    // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị
    handleEdit = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-maintainance').modal('show');
    }

    // Function format dữ liệu Date thành string
    formatDate2(date, monthYear = false) {
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

    // Function lưu giá trị mã phiếu vào state khi thay đổi
    handleMaintainanceCodeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleCodeChange = (event) => {
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

    // Function lưu giá trị loại phiếu vào state khi thay đổi
    handleTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            type: value
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

    deleteMaintainance = (assetId, maintainanceId) => {
        this.props.deleteMaintainance(assetId, maintainanceId).then(({ response }) => {
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
        const { translate, assetsManager } = this.props;
        const { page, limit, currentRow } = this.state;

        var lists = "";
        var formater = new Intl.NumberFormat();
        if (assetsManager.isLoading === false) {
            lists = assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % limit) === 0) ?
            parseInt(assetsManager.totalList / limit) :
            parseInt((assetsManager.totalList / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);

        return (
            <div className="box">
                <div className="box-body qlcv">

                    {/* Form thêm phiếu bảo trì */}
                    <MaintainanceCreateForm />
                    
                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">
                        {/* Mã phiếu */}
                        <div className="form-group">
                            <label className="form-control-static">Mã phiếu</label>
                            <input type="text" className="form-control" name="maintainceCode" onChange={this.handleMaintainanceCodeChange} placeholder="Mã phiếu" autoComplete="off" />
                        </div>

                        {/* Mã tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">Mã tài sản</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder="Mã tài sản" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        {/* Phân loại */}
                        <div className="form-group">
                            <label className="form-control-static">Phân loại</label>
                            <SelectMulti id={`multiSelectType`} multiple="multiple"
                                options={{ nonSelectedText: "Chọn loại phiếu", allSelectedText: "Chọn tất cả các loại phiếu" }}
                                onChange={this.handleTypeChange}
                                items={[
                                    { value: "Sửa chữa", text: "Sửa chữa" },
                                    { value: "Thay thế", text: "Thay thế" },
                                    { value: "Nâng cấp", text: "Nâng cấp" }
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Tháng */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Trạng thái */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('page.all_status') }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "Đã thực hiện", text: "Đã thực hiện" },
                                    { value: "Đang thực hiện", text: "Đang thực hiện" },
                                    { value: "Chưa thực hiện", text: "Chưa thực hiện" }
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSubmitSearch()}>Tìm kiếm</button>
                        </div>
                    </div>

                    {/* Bảng thông tin bảo trì tài sản */}
                    <table id="maintainance-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>Mã phiếu</th>
                                <th style={{ width: "10%" }}>Ngày lập</th>
                                <th style={{ width: "10%" }}>Phân loại</th>
                                <th style={{ width: "8%" }}>Mã tài sản</th>
                                <th style={{ width: "10%" }}>Tên tài sản</th>
                                <th style={{ width: "10%" }}>Nội dung</th>
                                <th style={{ width: "10%" }}>Ngày thực hiện</th>
                                <th style={{ width: "10%" }}>Ngày hoàn thành</th>
                                <th style={{ width: "10%" }}>Chi phí</th>
                                <th style={{ width: "10%" }}>Trạng thái</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Hành động
                                <DataTableSetting
                                        tableId="maintainance-table"
                                        columnArr={[
                                            "Mã phiếu",
                                            "Ngày lập",
                                            "Phân loại",
                                            "Mã tài sản",
                                            "Tên tài sản",
                                            "Nội dung",
                                            "Ngày thực hiện",
                                            "Ngày hoàn thành",
                                            "Chi phí",
                                            "Trạng thái"
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
                                lists.map(asset => {
                                    return asset.maintainanceLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.maintainanceCode}</td>
                                            <td>{x.createDate ? this.formatDate2(x.createDate) : ''}</td>
                                            <td>{x.type}</td>
                                            <td>{asset.code}</td>
                                            <td>{asset.assetName}</td>
                                            <td>{x.description}</td>
                                            <td>{x.startDate ? this.formatDate2(x.startDate) : ''}</td>
                                            <td>{x.endDate ? this.formatDate2(x.endDate) : ''}</td>
                                            <td>{x.expense ? formater.format(parseInt(x.expense)) : ''} VNĐ</td>
                                            <td>{x.status}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a onClick={() => this.handleEdit(x, asset)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin phiếu"><i
                                                    className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content="Xóa thông tin phiếu"
                                                    data={{
                                                        id: x._id,
                                                        info: x.maintainanceCode ? x.maintainanceCode : '' + " - "
                                                    }}
                                                    func={() => this.deleteMaintainance(asset._id, x._id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                })
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

                {/* Form chỉnh sửa phiếu bảo trì */}
                {
                    currentRow &&
                    <MaintainanceEditForm
                        _id={currentRow._id}
                        asset={currentRow.asset}
                        maintainanceCode={currentRow.maintainanceCode}
                        createDate={this.formatDate2(currentRow.createDate)}
                        type={currentRow.type}
                        description={currentRow.description}
                        startDate={this.formatDate2(currentRow.startDate)}
                        endDate={this.formatDate2(currentRow.endDate)}
                        expense={currentRow.expense}
                        status={currentRow.status}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
};

const actionCreators = {
    deleteMaintainance: MaintainanceActions.deleteMaintainance,
    getAllAsset: AssetManagerActions.getAllAsset,
};

const connectedListMaintainance = connect(mapState, actionCreators)(withTranslate(MaintainanceManagement));
export { connectedListMaintainance as MaintainanceManagement };
