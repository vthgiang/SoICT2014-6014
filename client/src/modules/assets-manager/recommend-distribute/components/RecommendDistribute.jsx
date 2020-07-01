import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RecommendDistributeCreateForm } from './RecommendDistributeCreateForm';
import { RecommendDistributeEditForm } from './RecommendDistributeEditForm';
import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';
import { AssetManagerActions } from "../../asset-management/redux/actions";
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { RecommendDistributeActions } from '../redux/actions';
import {AssetDetailForm} from '../../asset-management/components/assetDetailForm';

class RecommendDistribute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: null,
            status: null,
            page: 0,
            limit: 5,
            //-----------------------
            recommendNumber: "",
            month: "",
            statusRecommend: "",
            pageRecommend: 0,
            limitRecommend: 5,
        }
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
        this.handleSubmitRecommendSearch = this.handleSubmitRecommendSearch.bind(this);
    }
    componentDidMount() {
        this.props.searchRecommendDistributes(this.state);
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
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

    // Bắt sự kiện click chỉnh sửa thông tin phiếu đăng ký cấp phát
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowEdit: value
            }
        });
        window.$('#modal-edit-recommenddistribute').modal('show');
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

    /**
     * Bảng danh sách các tài sản
     */
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
        ;
        this.setState({
            ...this.state,
            assetType: value
        })
    }

    // Function lưu giá trị status vào state khi thay đổi
    handleStatusAssetChange = (value) => {
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

    /**
     * Bảng danh sách phiếu đăng ký cấp phát
     */

    // Function lưu giá trị mã phiếu vào state khi thay đổi
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
    handleSubmitRecommendSearch = async () => {
        // if (this.state.month === "") {
            await this.setState({
                ...this.state
                // month: this.formatDate(Date.now())
            })
        // }
        this.props.searchRecommendDistributes(this.state);
    }

    // // Bắt sự kiện setting số dòng hiện thị trên một trang
    // setLimit = async (number) => {
    //     await this.setState({
    //         limit: parseInt(number),
    //     });
    //     this.props.searchRecommendDistributes(this.state);
    // }

    // // Bắt sự kiện chuyển trang
    // setPage = async (pageNumber) => {
    //     var page = (pageNumber - 1) * this.state.limit;
    //     await this.setState({
    //         page: parseInt(page),

    //     });
    //     this.props.searchRecommendDistributes(this.state);
    // }

    render() {
        const { translate, recommendDistribute, assetsManager,assetType, user, auth } = this.props;
        var lists = "";
        var listRecommendDistributes = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;

        if (this.props.recommendDistribute.isLoading === false) {
            listRecommendDistributes = this.props.recommendDistribute.listRecommendDistributes;
        }
        if (this.props.assetsManager.isLoading === false) {
            lists = this.props.assetsManager.listAssets;
        }
        console.log('listRecommendDistributes', listRecommendDistributes);
        // asset
        var pageTotal = ((assetsManager.totalList % this.state.limit) === 0) ?
            parseInt(assetsManager.totalList / this.state.limit) :
            parseInt((assetsManager.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);

        // recommend
        // var pageTotal = ((this.props.recommendDistribute.totalList % this.state.limit) === 0) ?
        //     parseInt(this.props.recommendDistribute.totalList / this.state.limit) :
        //     parseInt((this.props.recommendDistribute.totalList / this.state.limit) + 1);
        // var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box" >
                <div className="box-body qlcv">
                    <div className="form-group">
                        <h4 className="box-title">Danh sách tài sản: </h4>
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
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus1`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: "Chọn tất cả trạng thái" }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "Sẵn sàng sử dụng", text: "Sẵn sàng sử dụng" },
                                    { value: "Đang sử dụng", text: "Đang sử dụng" },
                                    { value: "Hỏng hóc", text: "Hỏng hóc" },
                                    { value: "Mất", text: "Mất" }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            {/* <label></label> */}
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSubmitSearch()} >Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="asset-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>Mã tài sản</th>
                                <th style={{ width: "10%" }}>Tên tài sản</th>
                                <th style={{ width: "10%" }}>Loại tài sản</th>
                                <th style={{ width: "10%" }}>Người được giao sử dụng</th>
                                <th style={{ width: "20%" }}>Thời gian sử dụng từ ngày</th>
                                <th style={{ width: "20%" }}>Thời gian sử dụng đến ngày</th>
                                <th style={{ width: "10%" }}>Trạng thái</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động
                                    <DataTableSetting
                                        tableId="asset-table"
                                        columnArr={[
                                            "Mã tài sản",
                                            "Tên tài sản",
                                            "Loại tài sản",
                                            "Người được giao sử dụng",
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
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.code}</td>
                                        <td>{x.assetName}</td>
                                        <td>{x.assetType !== null && assettypelist.length ? assettypelist.filter(item => item._id === x.assetType).pop().typeName : ''}</td>
                                        <td>{x.assignedTo !== null && userlist.length ? userlist.filter(item => item._id === x.assignedTo).pop().name : ''}</td>
                                        <td>{this.formatDate2(x.handoverFromDate)}</td>
                                        <td>{this.formatDate2(x.handoverFromDate)}</td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title="xem thông tin tài sản"><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleCreateRecommend(x)} className="post_add" style={{ width: '5px' }} title="Đăng ký sử dụng thiết bị"><i className="material-icons">post_add</i></a>
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
                    <RecommendDistributeCreateForm
                        _id={this.state.currentRow._id}
                        asset={this.state.currentRow._id}
                    />
                }
                <hr />
                <div className="box-body qlcv">
                    {/* <RecommendDistributeCreateForm /> */}
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
                                    { value: "Đã chấp nhận", text: "Đã chấp nhận" },
                                    { value: "Chờ phê duyệt", text: "Chờ phê duyệt" },
                                    { value: "Không chấp nhận", text: "Không chấp nhận" }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSubmitRecommendSearch()} >{translate('page.add_search')}</button>
                        </div>
                    </div>
                    <table id="recommenddistribute-table" className="table table-striped table-bordered table-hover">
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
                                        tableId="recommenddistribute-table"
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
                                        // limit={this.state.limit}
                                        // setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listRecommendDistributes !== 'undefined' && listRecommendDistributes.length !== 0) &&
                                listRecommendDistributes.filter(item => item.proponent._id === auth.user._id).map((x, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{x.recommendNumber}</td>
                                            <td>{x.dateCreate}</td>
                                            <td>{x.proponent.name}</td>
                                            <td>{x.asset !== null ? x.asset.code : ''}</td>
                                            <td>{x.asset !== null ? x.asset.assetName : ''}</td>
                                            <td>{x.dateStartUse}</td>
                                            <td>{x.dateEndUse}</td>
                                            {/* <td>{x.approver !== null ? x.approver.name : ''}</td> */}
                                            <td>{x.approver && x.approver.name}</td>
                                            <td>{x.status}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin phiếu đăng ký cấp phát"><i className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content="Xóa thông tin phiếu"
                                                    data={{
                                                        id: x._id,
                                                        info: x.recommendNumber + " - " + x.dateCreate.replace(/-/gi, "/")
                                                    }}
                                                    func={this.props.deleteRecommendDistribute}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {recommendDistribute.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listRecommendDistributes === 'undefined' || listRecommendDistributes.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    {/* <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} /> */}
                </div>

                {
                    this.state.currentRowEdit !== undefined &&
                    <RecommendDistributeEditForm
                        _id={this.state.currentRowEdit._id}
                        recommendNumber={this.state.currentRowEdit.recommendNumber}
                        dateCreate={this.state.currentRowEdit.dateCreate}
                        proponent={this.state.currentRowEdit.proponent}
                        reqContent={this.state.currentRowEdit.reqContent}
                        asset={this.state.currentRowEdit.asset}
                        dateStartUse={this.state.currentRowEdit.dateStartUse}
                        dateEndUse={this.state.currentRowEdit.dateEndUse}
                        status={this.state.currentRowEdit.status}
                        approver={this.state.currentRowEdit.approver}
                        note={this.state.currentRowEdit.note}
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
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllAsset: AssetManagerActions.getAllAsset,
    getUser: UserActions.get,
    searchRecommendDistributes: RecommendDistributeActions.searchRecommendDistributes,
    deleteRecommendDistribute: RecommendDistributeActions.deleteRecommendDistribute,
};

const connectedListRecommendDistribute = connect(mapState, actionCreators)(withTranslate(RecommendDistribute));
export { connectedListRecommendDistribute as RecommendDistribute };
