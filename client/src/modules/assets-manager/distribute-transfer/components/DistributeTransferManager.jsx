import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DistributeTransferCreateForm } from './DistributeTransferCreateForm';
import { DistributeTransferEditForm } from './DistributeTransferEditForm';
import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti } from '../../../../common-components';
import { DistributeTransferActions } from '../redux/actions';
import { AssetManagerActions } from "../../asset-management/redux/actions";
import { UserActions } from "../../../super-admin/user/redux/actions";

class DistributeTransferManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distributeNumber: "",
            code: "",
            month: "",
            type: null,
            page: 0,
            limit: 5,
        }
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    }

    componentDidMount() {
        this.props.searchDistributeTransfers(this.state);
        this.props.getAllAsset({
            code: "",
            assetName: "",
            assetType: null,
            month: "",
            status: null,
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
        window.$('#modal-edit-distributetransfer').modal('show');
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

    // Function lưu giá trị mã phiếu vào state khi thay đổi
    handleDistributeNumberChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleCodeChange = (e) => {
        const { name, value } = e.target;
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
        this.props.searchDistributeTransfers(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchDistributeTransfers(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.searchDistributeTransfers(this.state);
    }

    render() {
        const { translate, distributeTransfer } = this.props;
        var listDistributeTransfers = "";
        if (this.props.distributeTransfer.isLoading === false) {
            listDistributeTransfers = this.props.distributeTransfer.listDistributeTransfers;
        }
        var pageTotal = ((this.props.distributeTransfer.totalList % this.state.limit) === 0) ?
            parseInt(this.props.distributeTransfer.totalList / this.state.limit) :
            parseInt((this.props.distributeTransfer.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <DistributeTransferCreateForm />
                    <div className="form-group">
                        <h4 className="box-title">Lịch sử cấp phát - điều chuyển - thu hồi: </h4>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã phiếu</label>
                            <input type="text" className="form-control" name="distributeNumber" onChange={this.handleDistributeNumberChange} placeholder="Mã phiếu" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Mã tài sản</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder="Mã tài sản" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">Phân loại</label>
                            <SelectMulti id={`multiSelectType`} multiple="multiple"
                                options={{ nonSelectedText: "Chọn loại phiếu", allSelectedText: "Chọn tất cả các loại phiếu" }}
                                onChange={this.handleTypeChange}
                                items={[
                                    { value: "Cấp phát", text: "Cấp phát" },
                                    { value: "Điều chuyển", text: "Điều chuyển" },
                                    { value: "Thu hồi", text: "Thu hồi" }
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
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={this.handleSubmitSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="distributetransfer-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>Mã phiếu</th>
                                <th style={{ width: "10%" }}>Ngày lập</th>
                                <th style={{ width: "10%" }}>Phân loại</th>
                                <th style={{ width: "8%" }}>Mã tài sản</th>
                                <th style={{ width: "10%" }}>Tên tài sản</th>
                                <th style={{ width: "10%" }}>Người bàn giao</th>
                                <th style={{ width: "10%" }}>Người tiếp nhận</th>
                                <th style={{ width: "10%" }}>Vị trí tài sản</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Hành động
                                <DataTableSetting
                                        tableId="distributetransfer-table"
                                        columnArr={[
                                            "Mã phiếu",
                                            "Ngày lập",
                                            "Phân loại",
                                            "Mã tài sản",
                                            "Tên tài sản",
                                            "Người bàn giao",
                                            "Người tiếp nhận",
                                            "Vị trí tài sản",
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listDistributeTransfers !== 'undefined' && listDistributeTransfers.length !== 0) &&
                                listDistributeTransfers.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.distributeNumber}</td>
                                        <td>{x.dateCreate}</td>
                                        <td>{x.type}</td>
                                        <td>{x.asset !== null ? x.asset.code : ''}</td>
                                        <td>{x.asset !== null ? x.asset.assetName : ''}</td>
                                        <td>{x.handoverMan !== null ? x.handoverMan.name : ''}</td>
                                        <td>{x.receiver.name}</td>
                                        <td>{x.nextLocation}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin phiếu"><i
                                                className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa thông tin phiếu"
                                                data={{
                                                    id: x._id,
                                                    info: x.distributeNumber + " - " + x.dateCreate.replace(/-/gi, "/")
                                                }}
                                                func={this.props.deleteDistributeTransfer}
                                            />
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {distributeTransfer.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listDistributeTransfers === 'undefined' || listDistributeTransfers.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>

                {
                    this.state.currentRow !== undefined &&
                    <DistributeTransferEditForm
                        _id={this.state.currentRow._id}
                        distributeNumber={this.state.currentRow.distributeNumber}
                        dateCreate={this.state.currentRow.dateCreate}
                        dateStartUse={this.state.currentRow.dateStartUse}
                        dateEndUse={this.state.currentRow.dateEndUse}
                        place={this.state.currentRow.place}
                        type={this.state.currentRow.type}
                        assetId={this.state.currentRow.asset._id}
                        code={this.state.currentRow.asset.code}
                        assetName={this.state.currentRow.asset.assetName}
                        handoverMan={this.state.currentRow.handoverMan !== null ? this.state.currentRow.handoverMan._id : null}
                        receiver={this.state.currentRow.receiver._id}
                        nowLocation={this.state.currentRow.nowLocation}
                        nextLocation={this.state.currentRow.nextLocation}
                        reason={this.state.currentRow.reason}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { distributeTransfer } = state;
    return { distributeTransfer };
};

const actionCreators = {
    searchDistributeTransfers: DistributeTransferActions.searchDistributeTransfers,
    deleteDistributeTransfer: DistributeTransferActions.deleteDistributeTransfer,
    getAllAsset: AssetManagerActions.getAllAsset,
    getAllUsers: UserActions.get
};

const connectedListDistributeTransfer = connect(mapState, actionCreators)(withTranslate(DistributeTransferManager));
export { connectedListDistributeTransfer as DistributeTransferManager };
