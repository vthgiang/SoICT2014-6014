import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { UsageCreateForm } from './usageCreateForm';
// import { UsageEditForm } from './usageEditForm';
import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti } from '../../../../common-components';
// import { UsageActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { AssetManagerActions } from '../../asset-management/redux/actions';
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
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    }

    componentDidMount() {
        this.props.getAllUsers();
        this.props.getAllAsset({
            code: "",
            assetName: "",
            // assetType: null,
            month: null,
            status: "",
            page: 0,
            limit: 5,
        });
    }


    // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-usage').modal('show');
    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate(date) {
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
        await this.setState({
            ...this.state,

        })
        this.props.searchUsages(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchUsages(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.searchUsages(this.state);
    }

    render() {
        const { translate, assetsManager } = this.props;
        var listUsages = "";
        var formater = new Intl.NumberFormat();
        if (this.props.assetsManager.isLoading === false) {
            listUsages = this.props.assetsManager.listUsages;
        }
        var pageTotal = ((this.props.assetsManager.totalList % this.state.limit) === 0) ?
            parseInt(this.props.assetsManager.totalList / this.state.limit) :
            parseInt((this.props.assetsManager.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <UsageCreateForm />
                    <div className="form-group">
                        <h4 className="box-title">Lịch sử sử dụng tài sản: </h4>
                    </div>
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
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* <div className="form-group">
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
                        </div> */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSubmitSearch()}>Tìm kiếm</button>
                        </div>
                    </div>
                    {/* <div className="form-inline" style={{ marginBottom: 10 }}>
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
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSubmitSearch()}>Tìm kiếm</button>
                        </div>
                    </div> */}
                    <table id="usage-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>Mã tài sản</th>
                                <th style={{ width: "10%" }}>Tên tài sản</th>
                                <th style={{ width: "10%" }}>Loại tài sản</th>
                                <th style={{ width: "8%" }}>Người sử dụng</th>
                                <th style={{ width: "10%" }}>Thời gian bắt đầu sử dụng</th>
                                <th style={{ width: "10%" }}>Thời gian kết thúc sử dụng</th>
                                <th style={{ width: "10%" }}>Nội dung</th>
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
                                            "Nội dung",
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listUsages !== 'undefined' && listUsages.length !== 0) &&
                                listUsages.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.code}</td>
                                        <td>{x.assetName}</td>
                                        <td>{x.assetType}</td>
                                        <td>{x.usedBy}</td>
                                        <td>{x.startDate}</td>
                                        <td>{x.endDate}</td>
                                        <td>{x.description}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin lịch sử hoạt động của tài sản"><i
                                                className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa thông tin lịch sử hoạt động của tài sản"
                                                data={{
                                                    id: x._id,
                                                    info: x.code + " - " + x.usedBy
                                                }}
                                                func={this.props.deleteUsage}
                                            />
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {assetsManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listUsages === 'undefined' || listUsages.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>

                {/* {
                    this.state.currentRow !== undefined &&
                    <UsageEditForm
                        _id={this.state.currentRow._id}
                        asset={this.state.currentRow.asset}
                        usedBy={this.state.currentRow.usedBy}
                        startDate={this.state.currentRow.startDate}
                        endDate={this.state.currentRow.endDate}
                        description={this.state.currentRow.description}
                    />
                } */}
            </div>
        );
    }
};

function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
};

const actionCreators = {
    // searchUsages: UsageActions.searchUsages,
    // deleteUsage: UsageActions.deleteUsage,
    getAllUsers: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
};

const connectedListUsage = connect(mapState, actionCreators)(withTranslate(UsageManagement));
export { connectedListUsage as UsageManagement };
