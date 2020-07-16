import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti } from '../../../../common-components';
import { AssetManagerActions } from '../redux/actions';
import { AssetCreateForm, AssetDetailForm, AssetEditForm } from './combinedContent';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';

class AssetManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            canRegisterForUse: "",
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getAllAsset(this.state);
        this.props.getUser();
    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate2(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
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
        ;
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
        ;
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
        ;
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
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.getAllAsset(this.state);
    }

    render() {
        var { assetsManager, assetType, translate, user, auth } = this.props;
        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        if (this.props.assetsManager.isLoading === false) {
            lists = this.props.assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % this.state.limit) === 0) ?
            parseInt(assetsManager.totalList / this.state.limit) :
            parseInt((assetsManager.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <AssetCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã tài sản</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder="Mã tài sản" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Tên tài sản</label>
                            <input type="text" className="form-control" name="assetName" onChange={this.handleAssetNameChange} placeholder="Tên tài sản" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Phân loại</label>
                            <SelectMulti id={`multiSelectType2`} multiple="multiple"
                                options={{ nonSelectedText: "Chọn loại tài sản", allSelectedText: "Chọn tất cả các loại tài sản" }}
                                onChange={this.handleTypeChange}
                                items={[]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate2(Date.now())}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus1`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: "Chọn tất cả trạng thái" }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "Sẵn sàng sử dụng", text: "Sẵn sàng sử dụng" },
                                    { value: "Đang sử dụng", text: "Đang sử dụng" },
                                    { value: "Hỏng hóc", text: "Hỏng hóc" },
                                    { value: "Mất", text: "Mất" },
                                    { value: "Thanh lý", text: "Thanh lý" }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Quyền đăng ký</label>
                            <SelectMulti id={`multiSelectStatus3`} multiple="multiple"
                                options={{ nonSelectedText: "Chọn quyền đăng ký", allSelectedText: "Chọn tất cả quyền đăng ký" }}
                                onChange={this.handleCanRegisterForUseChange}
                                items={[
                                    { value: "Được phép đăng ký sử dụng", text: "Được phép đăng ký sử dụng" },
                                    { value: "Không được phép đăng ký sử dụng", text: "Không được phép đăng ký sử dụng" },
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            {/* <label></label> */}
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={this.handleSubmitSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="asset-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>Mã tài sản</th>
                                <th style={{ width: "10%" }}>Tên tài sản</th>
                                <th style={{ width: "10%" }}>Loại tài sản</th>
                                <th style={{ width: "10%" }}>Ngày nhập</th>
                                <th style={{ width: "10%" }}>Người quản lý</th>
                                <th style={{ width: "10%" }}>Người sử dụng</th>
                                <th style={{ width: "10%" }}>Thời gian bắt đầu sử dụng</th>
                                <th style={{ width: "10%" }}>Trạng thái</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động
                                <DataTableSetting
                                        tableId="asset-table"
                                        columnArr={[
                                            "Mã tài sản",
                                            "Tên tài sản",
                                            "Loại tài sản",
                                            "Ngày nhập",
                                            "Người quản lý",
                                            "Người sử dụng",
                                            "Thời gian bắt đầu sử dụng",
                                            "Trạng thái"
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof lists !== 'undefined' && lists.length !== 0) &&
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.code}</td>
                                        <td>{x.assetName}</td>
                                        <td>{x.assetType !== null && assettypelist.length && assettypelist.find(item => item._id === x.assetType) ? assettypelist.find(item => item._id === x.assetType).typeName : ''}</td>
                                        <td>{this.formatDate(x.purchaseDate)}</td>
                                        <td>{x.managedBy !== null && userlist.length && userlist.find(item => item._id === x.managedBy) ? userlist.find(item => item._id === x.managedBy).name : ''}</td>
                                        <td>{x.assignedTo !== null && userlist.length && userlist.find(item => item._id === x.assignedTo) ? userlist.find(item => item._id === x.assignedTo).name : ''}</td>
                                        <td>{x.handoverFromDate ? this.formatDate(x.handoverFromDate) : ''}</td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title="xem thông tin tài sản"><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin tài sản"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa thông tin tài sản"
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
                        (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                {
                    this.state.currentRowView !== undefined &&
                    <AssetDetailForm
                        _id={this.state.currentRowView._id}
                        avatar={this.state.currentRowView.avatar}
                        code={this.state.currentRowView.code}
                        assetName={this.state.currentRowView.assetName}
                        serial={this.state.currentRowView.serial}
                        assetType={this.state.currentRowView.assetType}
                        purchaseDate={this.state.currentRowView.purchaseDate}
                        warrantyExpirationDate={this.state.currentRowView.warrantyExpirationDate}
                        managedBy={this.state.currentRowView.managedBy}
                        assignedTo={this.state.currentRowView.assignedTo}
                        handoverFromDate={this.state.currentRowView.handoverFromDate}
                        handoverToDate={this.state.currentRowView.handoverToDate}
                        location={this.state.currentRowView.location}
                        description={this.state.currentRowView.description}
                        status={this.state.currentRowView.status}
                        canRegisterForUse={this.state.currentRowView.canRegisterForUse}
                        detailInfo={this.state.currentRowView.detailInfo}
                        cost={this.state.currentRowView.cost}

                        residualValue={this.state.currentRowView.residualValue}
                        startDepreciation={this.state.currentRowView.startDepreciation}
                        usefulLife={this.state.currentRowView.usefulLife}
                        depreciationType={this.state.currentRowView.depreciationType}

                        maintainanceLogs={this.state.currentRowView.maintainanceLogs}
                        usageLogs={this.state.currentRowView.usageLogs}
                        incidentLogs={this.state.currentRowView.incidentLogs}

                        disposalDate={this.state.currentRowView.disposalDate}
                        disposalType={this.state.currentRowView.disposalType}
                        disposalCost={this.state.currentRowView.disposalCost}
                        disposalDesc={this.state.currentRowView.disposalDesc}

                        archivedRecordNumber={this.state.currentRowView.archivedRecordNumber}
                        files={this.state.currentRowView.files}
                    />
                }

                {
                    this.state.currentRow !== undefined &&
                    <AssetEditForm
                        _id={this.state.currentRow._id}
                        avatar={this.state.currentRow.avatar}
                        code={this.state.currentRow.code}
                        assetName={this.state.currentRow.assetName}
                        serial={this.state.currentRow.serial}
                        assetType={this.state.currentRow.assetType}
                        purchaseDate={this.state.currentRow.purchaseDate}
                        warrantyExpirationDate={this.state.currentRow.warrantyExpirationDate}
                        managedBy={this.state.currentRow.managedBy}
                        assignedTo={this.state.currentRow.assignedTo}
                        handoverFromDate={this.state.currentRow.handoverFromDate}
                        handoverToDate={this.state.currentRow.handoverToDate}
                        location={this.state.currentRow.location}
                        description={this.state.currentRow.description}
                        status={this.state.currentRow.status}
                        canRegisterForUse={this.state.currentRow.canRegisterForUse}
                        detailInfo={this.state.currentRow.detailInfo}

                        cost={this.state.currentRow.cost}
                        residualValue={this.state.currentRow.residualValue}
                        startDepreciation={this.state.currentRow.startDepreciation}
                        usefulLife={this.state.currentRow.usefulLife}
                        depreciationType={this.state.currentRow.depreciationType}

                        disposalDate={this.state.currentRow.disposalDate}
                        disposalType={this.state.currentRow.disposalType}
                        disposalCost={this.state.currentRow.disposalCost}
                        disposalDesc={this.state.currentRow.disposalDesc}

                        maintainanceLogs={this.state.currentRow.maintainanceLogs}
                        usageLogs={this.state.currentRow.usageLogs}
                        incidentLogs={this.state.currentRow.incidentLogs}
                        archivedRecordNumber={this.state.currentRow.archivedRecordNumber}
                        files={this.state.currentRow.files}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { assetsManager, assetType, user, auth } = state;
    return { assetsManager, assetType, user, auth };
};

const actionCreators = {
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllAsset: AssetManagerActions.getAllAsset,
    deleteAsset: AssetManagerActions.deleteAsset,
    getUser: UserActions.get,

};

const assetManagement = connect(mapState, actionCreators)(withTranslate(AssetManagement));
export { assetManagement as AssetManagement };
