import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
// import {RepairUpgradeCreateForm} from './RepairUpgradeCreateForm';
// import {RepairUpgradeEditForm} from './RepairUpgradeEditForm';
import {DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti} from '../../../../common-components';
import {AssetCrashActions} from '../redux/actions';
import {AssetManagerActions} from "../../asset-manager/redux/actions";
import {UserActions} from "../../../super-admin/user/redux/actions";
import { AssetDetailForm } from '../../asset-manager/components/AssetDetailForm';
class AssetCrashManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            month: "",
            type: null,
            page: 0,
            limit: 5,
        }
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    }

    componentDidMount() {
        this.props.searchAssetCrashs(this.state);
        this.props.getAllAsset({
            code: "",
            assetName: "",
            month: "",
            page: 0,
            limit: 5,
        });
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
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleAssetNameChange = (event) => {
        const {name, value} = event.target;
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
        ;
        this.setState({
            ...this.state,
            type: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSubmitSearch = async () => {
        // if (this.state.month === "") {
            await this.setState({
                ...this.state,
                // month: this.formatDate(Date.now())
            })
        // }
        this.props.searchAssetCrashs(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchAssetCrashs(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.searchAssetCrashs(this.state);
    }

    render() {
        const {translate, assetCrash} = this.props;
        var listAssetCrashs = "";
        var formater = new Intl.NumberFormat();
        if (this.props.assetCrash.isLoading === false) {
            listAssetCrashs = this.props.assetCrash.listAssetCrashs;
        }
        var pageTotal = ((this.props.assetCrash.totalList % this.state.limit) === 0) ?
            parseInt(this.props.assetCrash.totalList / this.state.limit) :
            parseInt((this.props.assetCrash.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    {/* <RepairUpgradeCreateForm/> */}
                    <div className="form-group">
                        <h4 className="box-title">Danh sách sự cố thiết bị: </h4>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã tài sản</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder="Mã tài sản" autoComplete="off"/>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Tên tài sản</label>
                            <input type="text" className="form-control" name="assetName" onChange={this.handleRepairNumberChange} placeholder="Mã phiếu" autoComplete="off"/>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Phân loại</label>
                            <SelectMulti id={`multiSelectType`} multiple="multiple"
                                         options={{nonSelectedText: "Chọn loại sự cố", allSelectedText: "Chọn tất cả sự cố"}}
                                         onChange={this.handleTypeChange}
                                         items={[
                                             {value: "Báo hỏng", text: "Báo hỏng"},
                                             {value: "Báo mất", text: "Báo mất"}
                                         ]}
                            >
                            </SelectMulti>
                        </div>
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
                            {/* <label></label> */}
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSubmitSearch()}>Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="assetcrash-table" className="table table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th style={{width: "8%"}}>Mã tài sản</th>
                            <th style={{width: "10%"}}>Tên tài sản</th>
                            <th style={{width: "10%"}}>Phân loại</th>
                            <th style={{width: "10%"}}>Thời gian báo cáo</th>
                            <th style={{width: "10%"}}>Người báo cáo</th>
                            <th style={{width: "10%"}}>Thời gian phát hiện sự cố</th>
                            <th style={{width: "10%"}}>Nội dung</th>
                            <th style={{width: '100px', textAlign: 'center'}}>Hành động
                                <DataTableSetting
                                    tableId="repairupgrade-table"
                                    columnArr={[
                                        "Mã tài sản",
                                        "Tên tài sản",
                                        "Phân loại",
                                        "Thời gian báo cáo",
                                        "Người báo cáo",
                                        "Thời gian phát hiện sự cố",
                                        "Nội dung"
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    hideColumnOption={true}
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {(typeof listAssetCrashs !== 'undefined' && listAssetCrashs.length !== 0) &&
                        listAssetCrashs.map((x, index) => (
                            <tr key={index}>
                                <td>{x.asset !== null ? x.asset.code : ''}</td>
                                <td>{x.asset !== null ? x.asset.assetName : ''}</td>
                                <td>{x.type}</td>
                                <td>{x.reportDate}</td>
                                <td>{x.annunciator.name}</td>
                                <td>{x.detectionDate}</td>
                                <td>{x.reason}</td>
                                <td style={{textAlign: "center"}}>
                                    <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title="xem thông tin tài sản"><i className="material-icons">view_list</i></a>
                                    {/* <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{width: '5px'}} title="Chỉnh sửa thông tin phiếu"><i
                                        className="material-icons">edit</i></a>
                                    <DeleteNotification
                                        content="Xóa thông tin phiếu"
                                        data={{
                                            id: x._id,
                                            info: x.repairNumber //+ " - " + x.asset.code
                                        }}
                                        func={this.props.deleteRepairUpgrade}
                                    /> */}
                                </td>
                            </tr>))
                        }
                        </tbody>
                    </table>
                    {assetCrash.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listAssetCrashs === 'undefined' || listAssetCrashs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage}/>
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
            </div>
        );
    }
};

function mapState(state) {
    const {assetCrash} = state;
    return {assetCrash};
};

const actionCreators = {
    searchAssetCrashs: AssetCrashActions.searchAssetCrashs,
    // deleteRepairUpgrade: AssetCrashActions.deleteRepairUpgrade,
    getAllAsset: AssetManagerActions.getAllAsset,
    getAllUsers: UserActions.get
};

const connectedListAssetCrash = connect(mapState, actionCreators)(withTranslate(AssetCrashManager));
export {connectedListAssetCrash as AssetCrashManager};
