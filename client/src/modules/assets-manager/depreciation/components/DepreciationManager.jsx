import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';
import { AssetManagerActions } from '../../asset-management/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { AssetDetailForm } from '../../asset-management/components/assetDetailForm';
import { UserActions } from '../../../super-admin/user/redux/actions';
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
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    }
    componentDidMount() {
        this.props.getAllAsset(this.state);
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
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
        };
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

    render() {
        const { translate, assetsManager, assetType, user } = this.props;
        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        var formater = new Intl.NumberFormat();
        if (assetsManager.listAssets) {
            lists = assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % this.state.limit) === 0) ?
            parseInt(assetsManager.totalList / this.state.limit) :
            parseInt((assetsManager.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box" >
                <div className="box-body qlcv">
                    <div className="form-group">
                        <h4 className="box-title">Danh sách khấu hao tài sản: </h4>
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
                        <div className="form-group">
                            <label className="form-control-static">Phân loại</label>
                            <SelectMulti id={`multiSelectType`} multiple="multiple"
                                options={{ nonSelectedText: "Chọn loại tài sản", allSelectedText: "Chọn tất cả các loại tài sản" }}
                                onChange={this.handleTypeChange}
                                items={[

                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Tháng</label>
                            <DatePicker
                                id="month1"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                        <div className="form-group">
                            {/* <label></label> */}
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSubmitSearch()} >Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="depreciation-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>Mã tài sản</th>
                                <th style={{ width: "10%" }}>Tên tài sản</th>
                                <th style={{ width: "10%" }}>Loại tài sản</th>
                                <th style={{ width: "10%" }}>Nguyên giá</th>
                                <th style={{ width: "10%" }}>Thời gian bắt đầu trích khấu hao</th>
                                <th style={{ width: "10%" }}>Thời gian trích khấu hao</th>
                                <th style={{ width: "10%" }}>Mức độ KH trung bình năm</th>
                                <th style={{ width: "10%" }}>Mức độ KH  trung bình tháng</th>
                                <th style={{ width: "10%" }}>Giá trị hao mòn lũy kế</th>
                                <th style={{ width: "10%" }}>Giá trị còn lại</th>
                                <th style={{ width: "10%" }}>Thời gian kết thúc trích khấu hao</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động
                                    <DataTableSetting
                                        tableId="depreciation-table"
                                        columnArr={[
                                            "Mã tài sản",
                                            "Tên tài sản",
                                            "Loại tài sản",
                                            "Nguyên giá",
                                            "Thời gian bắt đầu trích khấu hao",
                                            "Thời gian trích khấu hao",
                                            "Mức độ KH trung bình năm",
                                            "Mức độ KH trung bình tháng",
                                            "Giá trị hao mòn lũy kế",
                                            "Giá trị còn lại",
                                            "Thời gian kết thúc trích khấu hao"
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
                                        <td>{x.assets.map(y => y.code)}</td>
                                        <td>{x.assets.map (y => y.assetName)}</td>
                                        <td>{x.assets.map(y=>y.assetType !== null ? assettypelist.filter(item => item._id === y.assetType).pop().typeName : '')}</td>
                                        <td>{formater.format(parseInt(x.assets.map(y => y.cost)))} VNĐ</td>
                                        <td>{this.formatDate(x.assets.map(y => y.startDepreciation))}</td>
                                        <td>{x.assets.map (y => y.usefulLife)} Tháng</td>
                                        <td>{x.annualDepreciationValue} VNĐ/Năm</td>
                                        <td>{x.monthlyDepreciationValue} VNĐ/Tháng</td>
                                        <td>{x.accumulatedDepreciation} VNĐ</td>
                                        <td>{x.residuaValue} VNĐ</td>
                                        <td>{x.endDepreciation}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title="xem thông tin tài sản"><i className="material-icons">view_list</i></a>
                                            {/* <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin tài sản"><i className="material-icons">edit</i></a>
                 
                                            */}
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
                        _id={this.state.currentRowView.assets[0]._id}
                        assets={this.state.currentRowView.assets}

                    />
                }
            </div >
        );
    }
};

function mapState(state) {
    const { assetsManager, assetType, user } = state;
    return { assetsManager, assetType, user };
};

const actionCreators = {
    getAllAsset: AssetManagerActions.getAllAsset,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getUser: UserActions.get,
};

const connectedListDepreciation = connect(mapState, actionCreators)(withTranslate(DepreciationManager));
export { connectedListDepreciation as DepreciationManager };