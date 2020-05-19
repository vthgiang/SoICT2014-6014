import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {ToastContainer} from 'react-toastify';
import {AssetCreateForm} from './AssetCreateForm';
import {AssetEditForm} from './AssetEditForm';
import {AssetDetailForm} from './AssetDetailForm';
import {DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti} from '../../../../common-components';
import {AssetManagerActions} from '../redux/actions';
import {AssetTypeActions} from "../../asset-type/redux/actions";

class AssetManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assetNumber: "",
            assetName: "",
            assetType: null,
            month: null,
            status: null,
            page: 0,
            limit: 5,
            typeNumber: "",
            typeName: "",
        }
        this.handleSunmitSearch = this.handleSunmitSearch.bind(this);
    }

    componentDidMount() {
        this.props.getAllAsset(this.state);
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

    // Bắt sự kiện click chỉnh sửa thông tin tài sản
    handleEdit = async (value) => {
        console.log(value);
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-asset').modal('show');
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
    handleAssetNumberChange = (event) => {
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
    handleSunmitSearch = async () => {
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
        const {assetsManager, translate} = this.props;
        var lists = "";

        if (assetsManager.allAsset) {
            lists = this.props.assetsManager.allAsset;
        }

        console.log('lists', lists);
        var pageTotal = ((assetsManager.totalList % this.state.limit) === 0) ?
            parseInt(assetsManager.totalList / this.state.limit) :
            parseInt((assetsManager.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <AssetCreateForm/>
                    {/* <div className="form-group">
                        <h4 className="box-title">Danh sách tài sản: </h4>
                    </div> */}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã tài sản</label>
                            <input type="text" className="form-control" name="assetNumber" onChange={this.handleAssetNumberChange} placeholder="Mã tài sản" autoComplete="off"/>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Tên tài sản</label>
                            <input type="text" className="form-control" name="assetName" onChange={this.handleAssetNameChange} placeholder="Tên tài sản" autoComplete="off"/>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Phân loại</label>
                            <SelectMulti id={`multiSelectType2`} multiple="multiple"
                                         options={{nonSelectedText: "Chọn loại tài sản", allSelectedText: "Chọn tất cả các loại tài sản"}}
                                         onChange={this.handleTypeChange}
                                         items={[]}
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
                    </div>
                    <div className="form-inline" style={{marginBottom: 10}}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus1`} multiple="multiple"
                                         options={{nonSelectedText: translate('page.non_status'), allSelectedText: "Chọn tất cả trạng thái"}}
                                         onChange={this.handleStatusChange}
                                         items={[
                                             {value: "Sẵn sàng sử dụng", text: "Sẵn sàng sử dụng"},
                                             {value: "Đang sử dụng", text: "Đang sử dụng"},
                                             {value: "Hỏng hóc", text: "Hỏng hóc"},
                                             {value: "Mất", text: "Mất"},
                                             {value: "Thanh lý", text: "Thanh lý"}
                                         ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSunmitSearch()}>Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="asset-table" className="table table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th style={{width: "8%"}}>Mã tài sản</th>
                            <th style={{width: "10%"}}>Tên tài sản</th>
                            <th style={{width: "10%"}}>Loại tài sản</th>
                            <th style={{width: "10%"}}>Ngày nhập</th>
                            <th style={{width: "10%"}}>Người quản lý</th>
                            <th style={{width: "10%"}}>Người sử dụng</th>
                            <th style={{width: "10%"}}>Thời gian bắt đầu sử dụng</th>
                            {/* <th style={{width: "10%"}}>Thời gian kết thúc sử dụng</th> */}
                            {/* <th style={{width: "10%"}}>Vị trí</th> */}
                            <th style={{width: "10%"}}>Trạng thái</th>
                            <th style={{width: '120px', textAlign: 'center'}}>Hành động
                                <DataTableSetting
                                    tableId="asset-table"
                                    columnArr={[
                                        "Mã tài sản",
                                        "Tên tài sản",
                                        "Loại tài sản",
                                        "Ngày nhập",
                                        "Người quản lý",
                                        "Người sử dụng",
                                        "Thời gian bắt đầu sử dụng",
                                        // "Thời gian kết thúc sử dụng",
                                        // "Vị trí",
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
                                <td>{x.asset.assetNumber}</td>
                                <td>{x.asset.assetName}</td>
                                <td>{x.asset.assetType.typeName}</td>
                                <td>{x.asset.datePurchase}</td>
                                <td>{x.asset.manager.name}</td>
                                <td>{x.asset.person.name}</td>
                                <td>{x.asset.dateStartUse}</td>
                                {/* <td>{x.asset.dateEndUse}</td> */}
                                {/* <td>{x.asset.manager.position.name}</td> */}
                                {/* <td>{x.asset.location}</td> */}
                                <td>{x.asset.status}</td>
                                <td style={{textAlign: "center"}}>
                                    <a onClick={() => this.handleView(x)} style={{width: '5px'}} title="xem thông tin tài sản"><i className="material-icons">view_list</i></a>
                                    <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{width: '5px'}} title="Chỉnh sửa thông tin tài sản"><i className="material-icons">edit</i></a>
                                    <DeleteNotification
                                        content="Xóa thông tin tài sản"
                                        data={{
                                            id: x._id,
                                            info: x.asset.assetNumber + " - " + x.asset.assetName
                                        }}
                                        func={this.props.deleteAsset}
                                    />
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
                <ToastContainer/>
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
                    <AssetEditForm
                        _id={this.state.currentRow.asset._id}
                        asset={this.state.currentRow.asset}
                        repairUpgrade={this.state.currentRow.repairUpgrade}
                        distributeTransfer={this.state.currentRow.distributeTransfer}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const {assetsManager} = state;
    return {assetsManager};
};

const actionCreators = {
    getAllAsset: AssetManagerActions.getAllAsset,
    deleteAsset: AssetManagerActions.deleteAsset,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
};

const assetManager = connect(mapState, actionCreators)(withTranslate(AssetManager));
export {assetManager as AssetManager};
