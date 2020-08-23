import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';

import { AssetManagerActions } from "../../asset-management/redux/actions";
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { UserActions } from "../../../super-admin/user/redux/actions";

import { RecommendDistributeCreateForm } from './RecommendDistributeCreateForm';
import { AssetDetailForm } from '../../asset-management/components/assetDetailForm';

class ListAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: null,
            status: "",
            canRegisterForUse: true,
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getAllAsset({
            code: "",
            assetName: "",
            assetType: null,
            status: "",
            page: 0,
            limit: 5,
            canRegisterForUse: true
        });
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

    // Bắt sự kiện click đăng ký cấp phát tài sản
    handleCreateRecommend = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-create-recommenddistribute').modal('show');
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
        const { translate, assetsManager, assetType, user, auth } = this.props;
        const { page, limit, currentRowView, currentRow } = this.state;

        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;

        if (assetsManager.isLoading === false) {
            lists = assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % limit) === 0) ?
            parseInt(assetsManager.totalList / limit) :
            parseInt((assetsManager.totalList / limit) + 1);

        var currentPage = parseInt((page / limit) + 1);

        return (
            <div id="listasset" className="tab-pane active" >
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

                        {/* Trạng thái */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus1`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('asset.general_information.select_all_status') }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "Sẵn sàng sử dụng", text: translate('asset.general_information.ready_use') },
                                    { value: "Đang sử dụng", text: translate('asset.general_information.using') },
                                    { value: "Hỏng hóc", text: translate('asset.general_information.damaged') },
                                    { value: "Mất", text: translate('asset.general_information.lost') },
                                    { value: "Thanh lý", text: translate('asset.general_information.disposal') }
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={this.handleSubmitSearch}>{translate('asset.general_information.search')}</button>
                        </div>
                    </div>

                    {/* Bảng đăng kí sử dụng thiết bị */}
                    <table id="asset-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_type')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.user')}</th>
                                <th style={{ width: "20%" }}>{translate('asset.general_information.handover_from_date')}</th>
                                <th style={{ width: "20%" }}>{translate('asset.general_information.handover_to_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('asset.general_information.action')}
                                    <DataTableSetting
                                        tableId="asset-table"
                                        columnArr={[
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.asset_type'),
                                            translate('asset.general_information.user'),
                                            translate('asset.general_information.handover_from_date'),
                                            translate('asset.general_information.handover_to_date'),
                                            translate('asset.general_information.status')
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
                                lists.filter(item => item.canRegisterForUse === true).map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.code}</td>
                                        <td>{x.assetName}</td>
                                        <td>{x.assetType && assettypelist.length && assettypelist.filter(item => item._id === x.assetType).pop() ? assettypelist.filter(item => item._id === x.assetType).pop().typeName : 'Asset type is deleted'}</td>
                                        <td>{x.assignedToUser ? (userlist.length && userlist.filter(item => item._id === x.assignedToUser).pop() ? userlist.filter(item => item._id === x.assignedToUser).pop().name : 'User is deleted') : ''}</td>
                                        <td>{x.handoverFromDate ? this.formatDate2(x.handoverFromDate) : ''}</td>
                                        <td>{x.handoverToDate ? this.formatDate2(x.handoverToDate) : ''}</td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('asset.general_information.view')}><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleCreateRecommend(x)} className="post_add" style={{ width: '5px' }} title={translate('menu.recommend_distribute_asset')}><i className="material-icons">post_add</i></a>
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

                {/* Form xem chi tiết thông tin tài sản */}
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
                        assignedToUser={currentRowView.assignedToUser}
                        assignedToOrganizationalUnit={currentRowView.assignedToOrganizationalUnit}
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

                        residualValue={currentRowView.residualValue}
                        startDepreciation={currentRowView.startDepreciation}
                        usefulLife={currentRowView.usefulLife}
                        depreciationType={currentRowView.depreciationType}

                        archivedRecordNumber={currentRowView.archivedRecordNumber}
                        files={currentRowView.files}
                    />
                }

                {/* Form thêm mới phiếu đăng ký sử dụng thiết bị */}
                {
                    currentRow &&
                    <RecommendDistributeCreateForm
                        _id={currentRow._id}
                        asset={currentRow._id}
                    />
                }
            </div >
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
    getUser: UserActions.get,
};

const connectedListAsset = connect(mapState, actionCreators)(withTranslate(ListAsset));
export { connectedListAsset as ListAsset };
