import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';

import { RecommendDistributeManagerEditForm } from './RecommendDistributeManagerEditForm';
import { UsageCreateForm } from './usageCreateForm';

import { RecommendDistributeActions } from '../../recommend-distribute/redux/actions';
import { UserActions } from "../../../super-admin/user/redux/actions";
import { AssetManagerActions } from "../../asset-management/redux/actions";

class RecommendDistributeManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            month: "",
            status: null,
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.searchRecommendDistributes(this.state);
        this.props.getUser();
        this.props.getAllAsset({
            code: "",
            assetName: "",
            assetType: null,
            status: null,
            page: 0,
            limit: 100,
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
        window.$('#modal-edit-recommenddistributemanage').modal('show');
    }

    // Bắt sự kiện click thêm mới thông tin phiếu bảo trì
    handleAddUsage = async (value, asset) => {
        // value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRowAdd: value
            }
        });
        window.$('#modal-create-usage').modal('show');
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

    // Function lưu giá trị mã nhân viên vào state khi thay đổi
    handleRecommendNumberChange = (event) => {
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

    // Function lưu giá trị status vào state khi thay đổi
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        };

        this.setState({
            ...this.state,
            status: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSubmitSearch = async () => {
        if (this.state.month === "") {
            await this.setState({
                month: this.formatDate(Date.now())
            })
        }
        this.props.searchRecommendDistributes(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchRecommendDistributes(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.searchRecommendDistributes(this.state);
    }

    render() {
        const { translate, recommendDistribute, assetsManager, assetType, user, auth } = this.props;
        const { page, limit, currentRow, currentRowAdd } = this.state;

        var listRecommendDistributes = "";
        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        if (recommendDistribute.isLoading === false) {
            listRecommendDistributes = recommendDistribute.listRecommendDistributes;
        }

        var pageTotal = ((recommendDistribute.totalList % limit) === 0) ?
            parseInt(recommendDistribute.totalList / limit) :
            parseInt((recommendDistribute.totalList / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);

        return (
            <div className="box" >
                <div className="box-body qlcv">
                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">
                        {/* Mã phiếu */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.form_code')}</label>
                            <input type="text" className="form-control" name="recommendNumber" onChange={this.handleRecommendNumberChange} placeholder={translate('asset.general_information.form_code')} autoComplete="off" />
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
                                    { value: "Đã phê duyệt", text: translate('asset.usage.approved') },
                                    { value: "Chờ phê duyệt", text: translate('asset.usage.waiting_approval') },
                                    { value: "Không phê duyệt", text: translate('asset.usage.not_approved') }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        
                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSubmitSearch()} >{translate('page.add_search')}</button>
                        </div>
                    </div>

                    {/* Bảng thông tin đăng kí sử dụng tài sản */}
                    <table id="recommenddistributemanager-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.form_code')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.general_information.create_date')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.usage.proponent')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.general_information.handover_from_date')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.general_information.handover_to_date')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.usage.accountable')}</th>
                                <th style={{ width: "11%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="recommenddistributemanager-table"
                                        columnArr={[
                                            translate('asset.general_information.form_code'),
                                            translate('asset.general_information.create_date'),
                                            translate('asset.usage.proponent'),
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.handover_from_date'),
                                            translate('asset.general_information.handover_to_date'),
                                            translate('asset.usage.accountable'),
                                            translate('asset.general_information.status'),
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listRecommendDistributes && listRecommendDistributes.length !== 0) &&
                                listRecommendDistributes.map((x, index) => {
                                    return (<tr key={index}>
                                        <td>{x.recommendNumber}</td>
                                        <td>{x.dateCreate}</td>
                                        <td>{x.proponent ? x.proponent.name : 'User is deleted'}</td>
                                        <td>{x.asset ? x.asset.code : 'Asset is deleted'}</td>
                                        <td>{x.asset ? x.asset.assetName : 'Asset is deleted'}</td>
                                        <td>{x.dateStartUse}</td>
                                        <td>{x.dateEndUse}</td>
                                        <td>{x.approver ? x.approver.name : 'User is deleted'}</td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleAddUsage(x, x.asset)} className="post_add text-green" style={{ width: '5px' }} title={translate('asset.asset_info.add_usage_info')}><i
                                                className="material-icons">post_add</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_usage_info')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('asset.asset_info.delete_usage_info')}
                                                data={{
                                                    id: x._id,
                                                    info: x.recommendNumber + " - " + x.dateCreate.replace(/-/gi, "/")
                                                }}
                                                func={this.props.deleteRecommendDistribute}
                                            />
                                        </td>
                                    </tr>)
                                })
                            }
                        </tbody>
                    </table>
                    {recommendDistribute.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listRecommendDistributes || listRecommendDistributes.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>

                {/* Form chỉnh sửa phiếu đăng ký sử dụng */}
                {
                    currentRow &&
                    <RecommendDistributeManagerEditForm
                        _id={currentRow._id}
                        recommendNumber={currentRow.recommendNumber}
                        dateCreate={currentRow.dateCreate}
                        proponent={currentRow.proponent}
                        reqContent={currentRow.reqContent}
                        asset={currentRow.asset}
                        dateStartUse={currentRow.dateStartUse}
                        dateEndUse={currentRow.dateEndUse}
                        approver={currentRow.approver}
                        status={currentRow.status}
                        note={currentRow.note}
                    />
                }

                {/* Form thêm phiếu đăng ký sử dụng */}
                {
                    currentRowAdd &&
                    <UsageCreateForm
                        _id={currentRowAdd._id}
                        asset={currentRowAdd.asset}
                        startDate={currentRowAdd.dateStartUse}
                        endDate={currentRowAdd.dateEndUse}
                        usedBy={currentRowAdd.proponent}
                    />
                }
            </div >
        );
    }
};

function mapState(state) {
    const { recommendDistribute, assetsManager, assetType, user, auth } = state;
    return { recommendDistribute, assetsManager, assetType, user, auth };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    searchRecommendDistributes: RecommendDistributeActions.searchRecommendDistributes,
    deleteRecommendDistribute: RecommendDistributeActions.deleteRecommendDistribute,

};

const connectedListRecommendDistributeManager = connect(mapState, actionCreators)(withTranslate(RecommendDistributeManager));
export { connectedListRecommendDistributeManager as RecommendDistributeManager };
