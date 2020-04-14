import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { BuyRequestCreateForm } from './BuyRequestCreateForm';
import { BuyRequestEditForm } from './BuyRequestEditForm';
import { DeleteNotification, DatePicker, PaginateBar, ActionColumn, SelectMulti } from '../../../../common-components';
// import { BuyRequestActions } from '../redux/actions';

class BuyRequestManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: null,
            position: null,
            employeeNumber: "",
            month: "",
            status: null,
            page: 0,
            limit: 5,
        }
        //this.handleChange = this.handleChange.bind(this);
        this.handleSunmitSearch = this.handleSunmitSearch.bind(this);
    }
    componentDidMount() {
        // this.props.getListBuyRequest(this.state);
        // this.props.getDepartment();
    }
    // Bắt sự kiện click chỉnh sửa thông tin nghỉ phép
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-buyrequest').modal('show');
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
    handleMSNVChange = (event) => {
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

    // Function lưu giá trị unit vào state khi thay đổi
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            unit: value
        })
    }

    // Function lưu giá trị chức vụ vào state khi thay đổi
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            position: value
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
        // this.props.getListBuyRequest(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        // this.props.getListBuyRequest(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.getListBuyRequest(this.state);
    }

    render() {
        const { list } = this.props.department;
        const { translate, buyRequest } = this.props;
        var listBuyRequest = "", listPosition = [];
        // if (this.state.unit !== null) {
        //     let unit = this.state.unit;
        //     unit.forEach(u => {
        //         list.forEach(x => {
        //             if (x._id === u) {
        //                 let position = [
        //                     { _id: x.dean._id, name: x.dean.name },
        //                     { _id: x.vice_dean._id, name: x.vice_dean.name },
        //                     { _id: x.employee._id, name: x.employee.name }
        //                 ]
        //                 listPosition = listPosition.concat(position)
        //             }
        //         })
        //     })
        // }
        if (this.props.buyRequest.isLoading === false) {
            listBuyRequest = this.props.buyRequest.listBuyRequest;
        }
        var pageTotal = ((this.props.buyRequest.totalList % this.state.limit) === 0) ?
            parseInt(this.props.buyRequest.totalList / this.state.limit) :
            parseInt((this.props.buyRequest.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box" >
                <div className="box-body qlcv">
                    <BuyRequestCreateForm />
                    <div className="form-group">
                        <h4 className="box-title">Danh sách phiếu đề nghị mua sắm thiết bị: </h4>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã phiếu:</label>
                            <input type="text" className="form-control" name="reqNumber" onChange={this.handleMSNVChange} placeholder="Mã phiếu" autoComplete="off" />
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
                                    { value: "pass", text: "Đã chấp nhận" },
                                    { value: "process", text: "Chờ phê duyệt" },
                                    { value: "faile", text: "Không chấp nhận" }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSunmitSearch()} >{translate('page.add_search')}</button>
                        </div>
                    </div>
                    <table id="buyrequest-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>Mã phiếu</th>
                                <th style={{ width: "14%" }}>Ngày lập</th>
                                <th style={{ width: "15%" }}>Người đề nghị</th>
                                <th style={{ width: "15%" }}>Nội dung</th>
                                <th style={{ width: "15%" }}>Người phê duyệt</th>
                                <th style={{ width: "14%" }}>Ghi chú</th>
                                <th style={{ width: "11%" }}>Trạng thái</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động
                                    <ActionColumn
                                        tableId="buyrequest-table"
                                        columnArr={[
                                            "Mã phiếu",
                                            "Ngày lập",
                                            "Người đề nghị",
                                            "Nội dung",
                                            "Người phê duyệt",
                                            "Ghi chú",
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
                            {(typeof listBuyRequest !== 'undefined' && listBuyRequest.length !== 0) &&
                                listBuyRequest.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.reqNumber}</td>
                                        <td>{x.createDate}</td>
                                        <td>{x.nguoidenghi}</td>
                                        <td>{x.noidung}</td>
                                        <td>{x.nguoipheduyet}</td>
                                        <td>{x.ghichu}</td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin phiếu đề nghị"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa thông tin phiếu"
                                                data={{
                                                    id: x._id,
                                                    info: x.reqNumber + " - " + x.createDate.replace(/-/gi, "/")
                                                }}
                                                func={this.props.deleteBuyRequest}
                                            />
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {buyRequest.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listBuyRequest === 'undefined' || listBuyRequest.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <BuyRequestEditForm
                        _id={this.state.currentRow._id}
                        reqNumber={this.state.currentRow.reqNumber}
                        createDate={this.state.currentRow.createDate}
                        // startDate={this.state.currentRow.startDate}
                        // reason={this.state.currentRow.reason}
                        status={this.state.currentRow.status}
                    />
                }
            </div >
        );
    }
};

function mapState(state) {
    const { buyRequest, department } = state;
    return { buyRequest, department };
};

const actionCreators = {
    // getDepartment: DepartmentActions.get,
    // getListBuyRequest: BuyRequestActions.getListBuyRequest,
    // deleteBuyRequest: BuyRequestActions.deleteBuyRequest,
};

const connectedListBuyRequest = connect(mapState, actionCreators)(withTranslate(BuyRequestManager));
export { connectedListBuyRequest as BuyRequestManager };