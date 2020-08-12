import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar } from '../../../../common-components';

import { MaintainanceCreateForm } from './maintainanceCreateForm';
import { IncidentEditForm } from '../../asset-assgined/components/incidentEditForm';

import { IncidentActions } from '../../asset-assgined/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { AssetManagerActions } from '../../asset-management/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";

class IncidentManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            month: "",
            page: 0,
            limit: 100,
        }
    }

    componentDidMount() {
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getUser();
        this.props.getAllAsset({
            code: "",
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
            limit: 100,
        });
    }


    // Bắt sự kiện click chỉnh sửa thông tin sự cố
    handleEdit = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-incident').modal('show');
    }

    // Bắt sự kiện click thêm mới thông tin phiếu bảo trì
    handleAddMaintaince = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRowAdd: value
            }
        });
        window.$('#modal-create-maintainance').modal('show');
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

    deleteIncident = (assetId, incidentId) => {
        this.props.deleteIncident(assetId, incidentId).then(({ response }) => {
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
        const { translate, assetsManager, assetType, user, auth } = this.props;
        const { page, limit, currentRow, currentRowAdd } = this.state;

        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        var formater = new Intl.NumberFormat();
        if (assetsManager.isLoading === false) {
            lists = assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % limit) === 0) ?
            parseInt(assetsManager.totalList / limit) :
            parseInt((assetsManager.totalList / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);
        console.log('assetsManager', assetsManager);

        return (
            <div className="box">
                <div className="box-body qlcv">
                    {/* <UsageCreateForm/> */}
                   
                    {/* Thanh tìm kiếm */}
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

                    {/* Bảng danh sách sự cố tài sản */}
                    <table id="incident-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>Mã tài sản</th>
                                <th style={{ width: "10%" }}>Tên tài sản</th>
                                <th style={{ width: "10%" }}>Mã sự cố</th>
                                <th style={{ width: "10%" }}>Phân loại</th>
                                <th style={{ width: "8%" }}>Người báo cáo</th>
                                <th style={{ width: "10%" }}>Thời gian phát hiện sự cố</th>
                                <th style={{ width: "10%" }}>Nội dung sự cố</th>
                                <th style={{ width: "10%" }}>Trạng thái</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Hành động
                                <DataTableSetting
                                        tableId="incident-table"
                                        columnArr={[
                                            "Mã tài sản",
                                            "Tên tài sản",
                                            "Mã sự cố",
                                            "Phân loại",
                                            "Người báo cáo",
                                            "Thời gian phát hiện sự cố",
                                            "Nội dung sự cố",
                                            "Trạng thái",
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length) &&
                                lists.map(asset => {
                                    return asset.incidentLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{asset.code}</td>
                                            <td>{asset.assetName}</td>
                                            <td>{x.incidentCode}</td>
                                            <td>{x.type}</td>
                                            <td>{x.reportedBy && userlist.length && userlist.filter(item => item._id === x.reportedBy).pop() ? userlist.filter(item => item._id === x.reportedBy).pop().name : 'User is deleted'}</td>
                                            <td>{x.dateOfIncident ? this.formatDate2(x.dateOfIncident) : ''}</td>
                                            <td>{x.description}</td>
                                            <td>{x.statusIncident}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a onClick={() => this.handleAddMaintaince(x, asset)} className="settings text-green" style={{ width: '5px' }} title="Thêm mới thông tin bảo trì tài sản"><i
                                                    className="material-icons">settings</i></a>
                                                <a onClick={() => this.handleEdit(x, asset)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin sự cố tài sản"><i
                                                    className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content="Xóa thông tin sự cố của tài sản"
                                                    data={{
                                                        id: x._id,
                                                        info: asset.code + " - " + x.incidentCode
                                                    }}
                                                    func={() => this.deleteIncident(asset._id, x._id)}
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

                {/* Form chỉnh sửa thông tin sự cố */}
                {
                    currentRow &&
                    <IncidentEditForm
                        _id={currentRow._id}
                        asset={currentRow.asset}
                        incidentCode={currentRow.incidentCode}
                        type={currentRow.type}
                        reportedBy={currentRow.reportedBy}
                        dateOfIncident={this.formatDate2(currentRow.dateOfIncident)}
                        description={currentRow.description}
                    />
                }

                {/* Form thêm thông tin bảo trì */}
                {
                    currentRowAdd &&
                    <MaintainanceCreateForm
                        _id={currentRowAdd._id}
                        asset={currentRowAdd.asset}
                        statusIncident={currentRowAdd.statusIncident}
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
    deleteIncident: IncidentActions.deleteIncident,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
};

const connectedListUsage = connect(mapState, actionCreators)(withTranslate(IncidentManagement));
export { connectedListUsage as IncidentManagement };
