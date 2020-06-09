import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {AssetCrashEditForm} from './AssetCrashEditForm';
import {DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti} from '../../../../common-components';
import {AssetCrashActions} from '../redux/actions';
// import {AssetManagerActions} from "../../asset-management/redux/actions";
import {UserActions} from "../../../super-admin/user/redux/actions";
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
        this.props.getAllUsers();
    }

    // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-assetcrash').modal('show');
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
        if (this.state.month === "") {
            await this.setState({
                month: this.formatDate(Date.now())
            })
        }
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
        const {translate, assetCrash, auth} = this.props;
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
            <div id="assetcrash" className="tab-pane">
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
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">Phân loại</label>
                            <SelectMulti id={`multiSelectType1`} multiple="multiple"
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
                                    tableId="assetcrash-table"
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
                        listAssetCrashs.filter(item => item.annunciator._id === auth.user._id).map((x, index) => (
                        // listAssetCrashs.map((x, index) => (
                            <tr key={index}>
                                <td>{x.asset !== null ? x.asset.code : ''}</td>
                                <td>{x.asset !== null ? x.asset.assetName : ''}</td>
                                <td>{x.type}</td>
                                <td>{x.reportDate}</td>
                                <td>{x.annunciator.name}</td>
                                <td>{x.detectionDate}</td>
                                <td>{x.reason}</td>
                                <td style={{textAlign: "center"}}>
                                    <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{width: '5px'}} title="Chỉnh sửa thông tin báo cáo sự cố"><i
                                        className="material-icons">edit</i></a>
                                    <DeleteNotification
                                        content="Xóa thông tin báo cáo sự cố"
                                        data={{
                                            id: x._id,
                                            info: x.asset.code //+ " - " + x.asset.code
                                        }}
                                        func={this.props.deleteAssetCrash}
                                    />
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
                    this.state.currentRow !== undefined &&
                    <AssetCrashEditForm
                        _id={this.state.currentRow._id}
                        assetId={this.state.currentRow.asset._id}
                        code={this.state.currentRow.asset.code}
                        asset={this.state.currentRow.asset}
                        assetName={this.state.currentRow.asset.assetName}
                        type={this.state.currentRow.type}
                        annunciator={this.state.currentRow.annunciator._id}
                        reportDate={this.state.currentRow.reportDate}
                        detectionDate={this.state.currentRow.detectionDate}
                        reason={this.state.currentRow.reason}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const {assetCrash, auth} = state;
    return {assetCrash, auth};
};

const actionCreators = {
    searchAssetCrashs: AssetCrashActions.searchAssetCrashs,
    deleteAssetCrash: AssetCrashActions.deleteAssetCrash,
    // getAllAsset: AssetManagerActions.getAllAsset,
    getAllUsers: UserActions.get
};

const connectedListAssetCrash = connect(mapState, actionCreators)(withTranslate(AssetCrashManager));
export {connectedListAssetCrash as AssetCrashManager};
