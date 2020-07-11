import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RecommendDistributeManagerEditForm } from './RecommendDistributeManagerEditForm';
import { UsageCreateForm } from './usageCreateForm';
import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';
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
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
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
        var listRecommendDistributes = "";
        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        if (this.props.recommendDistribute.isLoading === false) {
            listRecommendDistributes = this.props.recommendDistribute.listRecommendDistributes;
        }
        var pageTotal = ((this.props.recommendDistribute.totalList % this.state.limit) === 0) ?
            parseInt(this.props.recommendDistribute.totalList / this.state.limit) :
            parseInt((this.props.recommendDistribute.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box" >
                <div className="box-body qlcv">
                    <div className="form-group">
                        <h4 className="box-title">Danh sách phiếu đăng ký sử dụng tài sản: </h4>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã phiếu:</label>
                            <input type="text" className="form-control" name="recommendNumber" onChange={this.handleRecommendNumberChange} placeholder="Mã phiếu" autoComplete="off" />
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
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('page.all_status') }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "Đã phê duyệt", text: "Đã phê duyệt" },
                                    { value: "Chờ phê duyệt", text: "Chờ phê duyệt" },
                                    { value: "Không phê duyệt", text: "Không phê duyệt" }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSubmitSearch()} >{translate('page.add_search')}</button>
                        </div>
                    </div>
                    <table id="recommenddistributemanager-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>Mã phiếu</th>
                                <th style={{ width: "15%" }}>Ngày lập</th>
                                <th style={{ width: "15%" }}>Người đề nghị</th>
                                <th style={{ width: "17%" }}>Mã tài sản</th>
                                <th style={{ width: "15%" }}>Tên tài sản</th>
                                <th style={{ width: "17%" }}>Thời gian đăng ký sử dụng từ ngày</th>
                                <th style={{ width: "17%" }}>Thời gian đăng ký sử dụng đến ngày</th>
                                <th style={{ width: "17%" }}>Người phê duyệt</th>
                                <th style={{ width: "11%" }}>Trạng thái</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động
                                    <DataTableSetting
                                        tableId="recommenddistributemanager-table"
                                        columnArr={[
                                            "Mã phiếu",
                                            "Ngày lập",
                                            "Người đề nghị",
                                            "Mã tài sản",
                                            "Tên tài sản",
                                            "Thời gian đăng ký sử dụng từ ngày",
                                            "Thời gian đăng ký sử dụng đến ngày",
                                            "Người phê duyệt",
                                            "Trạng thái",
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listRecommendDistributes !== 'undefined' && listRecommendDistributes.length !== 0) &&
                                listRecommendDistributes.map((x, index) => {
                                    console.log(x);
                                    return (<tr key={index}>
                                        <td>{x.recommendNumber}</td>
                                        <td>{x.dateCreate}</td>
                                        <td>{x.proponent.name}</td>
                                        <td>{x.asset !== null ? x.asset.code : ''}</td>
                                        <td>{x.asset !== null ? x.asset.assetName : ''}</td>
                                        <td>{x.dateStartUse}</td>
                                        <td>{x.dateEndUse}</td>
                                        <td>{x.approver ? x.approver.name : ''}</td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleAddUsage(x, x.asset)} className="post_add text-green" style={{ width: '5px' }} title="Thêm mới thông tin sử dụng tài sản"><i
                                                className="material-icons">post_add</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Cập nhật thông tin phiếu đăng ký sử dụng tài sản"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa thông tin phiếu"
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
                        (typeof listRecommendDistributes === 'undefined' || listRecommendDistributes.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>

                {
                    this.state.currentRow !== undefined &&
                    <RecommendDistributeManagerEditForm
                        _id={this.state.currentRow._id}
                        recommendNumber={this.state.currentRow.recommendNumber}
                        dateCreate={this.state.currentRow.dateCreate}
                        proponent={this.state.currentRow.proponent}
                        reqContent={this.state.currentRow.reqContent}
                        asset={this.state.currentRow.asset}
                        dateStartUse={this.state.currentRow.dateStartUse}
                        dateEndUse={this.state.currentRow.dateEndUse}
                        approver={this.state.currentRow.approver}
                        status={this.state.currentRow.status}
                        note={this.state.currentRow.note}
                    />
                }
                {
                    this.state.currentRowAdd !== undefined &&
                    <UsageCreateForm
                        _id={this.state.currentRowAdd._id}
                        asset={this.state.currentRowAdd.asset}
                        startDate={this.state.currentRowAdd.dateStartUse}
                        endDate={this.state.currentRowAdd.dateEndUse}
                        usedBy={this.state.currentRowAdd.proponent}
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
