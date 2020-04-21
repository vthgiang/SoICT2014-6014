import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetCreateForm } from './AssetCreateForm';
import { AssetEditForm } from './AssetEditForm';
import { DeleteNotification, DatePicker, PaginateBar, ActionColumn, SelectMulti } from '../../../../common-components';
// import { AssetActions } from '../redux/actions';

class AssetManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assetNumber: "",
            assetName: "",
            assetType: null,
            month: "",
            status: null,
            page: 0,
            limit: 5,
        }
        this.handleSunmitSearch = this.handleSunmitSearch.bind(this);
    }
    componentDidMount() {
        // this.props.getListAsset(this.state);
    }
    // Bắt sự kiện click chỉnh sửa thông tin tài sản
    handleEdit = async (value) => {
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
        };
        this.setState({
            ...this.state,
            assetType: value
        })
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
    handleSunmitSearch = async () => {
        if (this.state.month === "") {
            await this.setState({
                month: this.formatDate(Date.now())
            })
        }
        // this.props.getListAsset(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        // this.props.getListAsset(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.getListAsset(this.state);
    }

    render() {
        const { translate, asset } = this.props;
        var listAsset = "";

        if (this.props.asset.isLoading === false) {
            listAsset = this.props.asset.listAsset;
        }
        var pageTotal = ((this.props.asset.totalList % this.state.limit) === 0) ?
            parseInt(this.props.asset.totalList / this.state.limit) :
            parseInt((this.props.asset.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box" >
                <div className="box-body qlcv">
                    {/* <AssetCreateForm /> */}
                    <div className="form-group">
                        <h4 className="box-title">Danh sách tài sản: </h4>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã tài sản</label>
                            <input type="text" className="form-control" name="assetNumber" onChange={this.handleAssetNumberChange} placeholder="Mã tài sản" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Tên tài sản</label>
                            <input type="text" className="form-control" name="assetNumber" onChange={this.handleRepairNumberChange} placeholder="Tên tài sản" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
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
                                    { value: "available", text: "Sẵn sàng sử dụng" },
                                    { value: "using", text: "Đang sử dụng" },
                                    { value: "broken", text: "Hỏng hóc" },
                                    { value: "lost", text: "Mất" }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSunmitSearch()} >{translate('page.add_search')}</button>
                        </div>
                    </div>
                    <table id="asset-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>Mã tài sản</th>
                                <th style={{ width: "10%" }}>Tên tài sản</th>
                                <th style={{ width: "10%" }}>Loại tài sản</th>
                                <th style={{ width: "10%" }}>Ngày nhập</th>
                                <th style={{ width: "10%" }}>Người quản lý</th>
                                <th style={{ width: "10%" }}>Chức vụ</th>
                                <th style={{ width: "10%" }}>Vị trí</th>
                                <th style={{ width: "10%" }}>Trạng thái</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động
                                    <ActionColumn
                                        tableId="repairupgrade-table"
                                        columnArr={[
                                            "Mã tài sản",
                                            "Tên tài sản",
                                            "Loại tài sản",
                                            "Ngày nhập",
                                            "Người quản lý",
                                            "Chức vụ",
                                            "Vị trí",
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
                            {(typeof listAsset !== 'undefined' && listAsset.length !== 0) &&
                                listAsset.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.assetNumber}</td>
                                        <td>{x.assetName}</td>
                                        <td>{x.assetType}</td>
                                        <td>{x.datePurchase}</td>
                                        <td>{x.manager}</td>
                                        <td>{x.chucvu}</td>
                                        <td>{x.location}</td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin tài sản"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa thông tin tài sản"
                                                data={{
                                                    id: x._id,
                                                    info: x.assetNumber + " - " + x.assetName
                                                }}
                                                func={this.props.deleteAsset}
                                            />
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {asset.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listAsset === 'undefined' || listAsset.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                
                {
                    this.state.currentRow !== undefined &&
                    <AssetEditForm
                        _id={this.state.currentRow._id}
                        repairNumber={this.state.currentRow.repairNumber}
                        createDate={this.state.currentRow.createDate}
                        type={this.state.currentRow.type}
                        assetNumber={this.state.currentRow.assetNumber}
                        assetName={this.state.currentRow.assetName}
                        repairDate={this.state.currentRow.repairDate}
                        completeDate={this.state.currentRow.completeDate}
                        cost={this.state.currentRow.cost}
                        status={this.state.currentRow.status}
                    />
                }
            </div >
        );
    }
};

function mapState(state) {
    const { asset } = state;
    return { asset };
};

const actionCreators = {
    // getListAsset: AssetActions.getListAsset,
    // deleteAsset: AssetActions.deleteAsset,
};

const connectedListAsset = connect(mapState, actionCreators)(withTranslate(AssetManager));
export { connectedListAsset as AssetManager };