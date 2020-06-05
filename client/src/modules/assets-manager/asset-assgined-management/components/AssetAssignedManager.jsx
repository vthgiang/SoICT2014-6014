import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {DataTableSetting, PaginateBar, SelectMulti} from '../../../../common-components';
import {AssetManagerActions} from '../../asset-manager/redux/actions';
import {AssetTypeActions} from "../../asset-type/redux/actions";
import {AssetCrashCreateForm} from "./AssetCrashCreateForm";
import {UserActions} from "../../../super-admin/user/redux/actions";
import {AssetDetailForm} from "../../asset-manager/components/AssetDetailForm";

class AssetAssignedManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: null,
            month: "",
            status: null,
            page: 0,
            limit: 50,
            typeNumber: "",
            typeName: "",
        }
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    }

    componentDidMount() {
        this.props.getAllAsset(this.state);
        this.props.getAllUsers();
        this.props.searchAssetTypes({typeNumber: "", typeName: "", limit: 0});
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

    // Bắt sự kiện click báo cáo sự cố tài sản
    handleReport = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-create-assetcrash').modal('show');
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

    // Function lưu giá trị tên tài sản vào state khi thay đổi
    handleAssetNameChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
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
        const {translate, assetsManager, auth} = this.props;
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
            <div id="assetassigned" className="tab-pane active">
                <div className="box-body qlcv">
                    <div className="form-group">
                        <h4 className="box-title">Danh sách thiết bị được bàn giao: </h4>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã tài sản</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder="Mã tài sản" autoComplete="off"/>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Tên tài sản</label>
                            <input type="text" className="form-control" name="assetName" onChange={this.handleAssetNameChange} placeholder="Tên tài sản" autoComplete="off"/>
                        </div>
                    </div>
                    <div className="form-inline" style={{marginBottom: 10}}>
                        <div className="form-group">
                            <label className="form-control-static">Phân loại</label>
                            <SelectMulti id={`multiSelectType`} multiple="multiple"
                                         options={{nonSelectedText: "Chọn loại tài sản", allSelectedText: "Chọn tất cả các loại tài sản"}}
                                         onChange={this.handleTypeChange}
                                         items={[]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus1`} multiple="multiple"
                                         options={{nonSelectedText: translate('page.non_status'), allSelectedText: "Chọn tất cả trạng thái"}}
                                         onChange={this.handleStatusChange}
                                         items={[
                                             {value: "Đang sử dụng", text: "Đang sử dụng"},
                                             {value: "Hỏng hóc", text: "Hỏng hóc"},
                                             {value: "Mất", text: "Mất"}
                                         ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            {/* <label></label> */}
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSubmitSearch()}>Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="assetassigned-table" className="table table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th style={{width: "8%"}}>Mã tài sản</th>
                            <th style={{width: "10%"}}>Tên tài sản</th>
                            <th style={{width: "10%"}}>Loại tài sản</th>
                            <th style={{width: "10%"}}>Giá trị tài sản</th>
                            <th style={{width: "20%"}}>Thời gian sử dụng từ ngày</th>
                            <th style={{width: "20%"}}>Thời gian sử dụng đến ngày</th>
                            <th style={{width: "10%"}}>Trạng thái</th>
                            <th style={{width: '120px', textAlign: 'center'}}>Hành động
                                <DataTableSetting
                                    tableId="assetassigned-table"
                                    columnArr={[
                                        "Mã tài sản",
                                        "Tên tài sản",
                                        "Loại tài sản",
                                        "Giá trị tài sản",
                                        "Thời gian sử dụng từ ngày",
                                        "Thời gian sử dụng đến ngày",
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
                        lists.filter(item => item.asset.person._id === auth.user._id).map((x, index) => (
                            <tr key={index}>
                                <td>{x.asset.code}</td>
                                <td>{x.asset.assetName}</td>
                                <td>{x.asset.assetType.typeName}</td>
                                <td>{formater.format(parseInt(x.asset.cost))} VNĐ</td>
                                <td>{x.asset.dateStartUse}</td>
                                <td>{x.asset.dateEndUse}</td>
                                <td>{x.asset.status}</td>
                                <td style={{textAlign: "center"}}>
                                    <a onClick={() => this.handleView(x)} style={{width: '5px'}} title="xem thông tin tài sản"><i className="material-icons">view_list</i></a>
                                    <a onClick={() => this.handleReport(x)} className="edit text-red" style={{width: '5px'}} title="Báo cáo sự cố thiết bị"><i
                                        className="material-icons">notification_important</i></a>
                                </td>
                            </tr>))
                        }
                        </tbody>
                    </table>
                    {assetsManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
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

                {
                    this.state.currentRow !== undefined &&
                    <AssetCrashCreateForm
                        _id={this.state.currentRow._id}
                        assetId={this.state.currentRow.asset._id}
                        code={this.state.currentRow.asset.code}
                        asset={this.state.currentRow.asset}
                        assetName={this.state.currentRow.asset.assetName}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const {assetsManager, auth} = state;
    return {assetsManager, auth};
};

const actionCreators = {
    getAllAsset: AssetManagerActions.getAllAsset,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllUsers: UserActions.get
};

const connectedListAssetAssigned = connect(mapState, actionCreators)(withTranslate(AssetAssignedManager));
export {connectedListAssetAssigned as AssetAssignedManager};
