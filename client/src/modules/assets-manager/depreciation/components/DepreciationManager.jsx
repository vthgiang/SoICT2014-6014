import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';
import { AssetManagerActions } from '../../asset-manager/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { AssetDetailForm } from '../../asset-manager/components/AssetDetailForm';
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
            typeNumber: "",
            typeName: "",
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
        // if (this.state.month === null) {
        await this.setState({
            ...this.state,
            // ,
            // month: this.formatDate(Date.now())
        })
        // }
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
        const { translate, assetsManager } = this.props;
        var lists = "";
        var formater = new Intl.NumberFormat();
        if (assetsManager.allAsset) {
            lists = this.props.assetsManager.allAsset;
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
                                <th style={{ width: "10%" }}>Thời gian bắt đầu trích khấu hao</th>
                                <th style={{ width: "10%" }}>Nguyên giá</th>
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
                                            "Thời gian bắt đầu trích khấu hao",
                                            "Nguyên giá",
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
                                        <td>{x.asset.code}</td>
                                        <td>{x.asset.assetName}</td>
                                        <td>{x.asset.assetType.typeName}</td>
                                        <td>{x.asset.startDepreciation}</td>
                                        <td>{formater.format(parseInt(x.asset.cost))} VNĐ</td>
                                        <td>{x.asset.timeDepreciation} Tháng</td>
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
                        _id={this.state.currentRowView.asset._id}
                        asset={this.state.currentRowView.asset}
                        repairUpgrade={this.state.currentRowView.repairUpgrade}
                        distributeTransfer={this.state.currentRowView.distributeTransfer}
                    />
                }
            </div >
        );
    }
};

function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
};

const actionCreators = {
    getAllAsset: AssetManagerActions.getAllAsset,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
};

const connectedListDepreciation = connect(mapState, actionCreators)(withTranslate(DepreciationManager));
export { connectedListDepreciation as DepreciationManager };