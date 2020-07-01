import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {DataTableSetting, PaginateBar, SelectMulti} from '../../../../common-components';
import {AssetManagerActions} from '../../asset-management/redux/actions';
import {AssetTypeActions} from "../../asset-type/redux/actions";
import {IncidentCreateForm} from "./incidentCreateForm";
import {UserActions} from "../../../super-admin/user/redux/actions";
import {AssetDetailForm} from '../../asset-management/components/assetDetailForm';

class AssetAssignedManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
            limit: 100,
        }
        // this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    }

    componentDidMount() {
        this.props.searchAssetTypes({typeNumber: "", typeName: "", limit: 0});
        this.props.getAllAsset(this.state);
        this.props.getUser();
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
    handleReport = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-create-assetcrash').modal('show');
    }

    // Function format dữ liệu Date thành string
    formatDate2(date, monthYear = false) {
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
        const { id, translate, assetsManager, assetType, user, auth} = this.props;
        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        var formater = new Intl.NumberFormat();
        if (this.props.assetsManager.isLoading === false) {
            lists = this.props.assetsManager.listAssets;
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
                            <th style={{width: "20%"}}>Thời gian bắt đầu sử dụng</th>
                            <th style={{width: "20%"}}>Thời gian kết thúc sử dụng</th>
                            <th style={{width: "10%"}}>Trạng thái</th>
                            <th style={{width: '120px', textAlign: 'center'}}>Hành động
                                <DataTableSetting
                                    tableId="assetassigned-table"
                                    columnArr={[
                                        "Mã tài sản",
                                        "Tên tài sản",
                                        "Loại tài sản",
                                        "Giá trị tài sản",
                                        "Thời gian bắt đầu sử dụng",
                                        "Thời gian kết thúc sử dụng",
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
                        lists.filter(item => item.assignedTo === auth.user._id).map((x, index) => (
                        // lists.map((x, index) => (
                            <tr key={index}>
                                <td>{x.code}</td>
                                <td>{x.assetName}</td>
                                <td>{x.assetType !== null && assettypelist.length ? assettypelist.filter(item => item._id === x.assetType).pop().typeName : ''}</td>
                                <td>{formater.format(parseInt(x.cost))} VNĐ</td>
                                <td>{this.formatDate(x.handoverFromDate)}</td>
                                <td>{this.formatDate(x.handoverToDate)}</td>
                                <td>{x.status}</td>
                                <td style={{textAlign: "center"}}>
                                    <a onClick={() => this.handleView(x)} style={{width: '5px'}} title="xem thông tin tài sản"><i className="material-icons">view_list</i></a>
                                    <a onClick={() => this.handleReport(x, x)} className="edit text-red" style={{width: '5px'}} title="Báo cáo sự cố thiết bị"><i
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
                        detailInfo={this.state.currentRowView.detailInfo}
                        cost={this.state.currentRowView.cost}
                        residualValue={this.state.currentRowView.residualValue}
                        startDepreciation={this.state.currentRowView.startDepreciation}
                        usefulLife={this.state.currentRowView.usefulLife}
                        maintainanceLogs={this.state.currentRowView.maintainanceLogs}
                        usageLogs={this.state.currentRowView.usageLogs}
                        incidentLogs={this.state.currentRowView.incidentLogs}
                        archivedRecordNumber={this.state.currentRowView.archivedRecordNumber}
                        files={this.state.currentRowView.files}
                    />
                }

                {
                    this.state.currentRow !== undefined &&
                    <IncidentCreateForm
                        _id={this.state.currentRow._id}
                        asset={this.state.currentRow.asset}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const {assetsManager, assetType, user, auth} = state;
    return {assetsManager, assetType, user, auth};
};

const actionCreators = {
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllAsset: AssetManagerActions.getAllAsset,
    getUser: UserActions.get,
};

const connectedListAssetAssigned = connect(mapState, actionCreators)(withTranslate(AssetAssignedManager));
export {connectedListAssetAssigned as AssetAssignedManager};
