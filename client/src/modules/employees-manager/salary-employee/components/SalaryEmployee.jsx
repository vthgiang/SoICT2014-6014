import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SalaryActions } from '../redux/actions';
import { ModalAddSalary } from './ModalAddSalary';
import { ModalImportFileSalary } from './ModalImportFileSalary';
import { ModalDeleteSalary } from './ModalDeleteSalary';
import { ModalEditSalary } from './ModalEditSalary';
import ActionColumn from '../../../../common-components/ActionColumn';
import PaginateBar from '../../../../common-components/PaginateBar';
import '../../employee-manager/components/listemployee.css';

class SalaryEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: "",
            month: "",
            employeeNumber: "",
            department: "All",
            page: 0,
            limit: 5,

        }
        this.handleResizeColumn();
        this.setLimit = this.setLimit.bind(this);
        this.setPage = this.setPage.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.props.getListSalary(this.state);
    }

    // function: notification the result of an action
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
    }

    setLimit = async (number) => {
        await this.setState({ limit: parseInt(number) });
        this.props.getListSalary(this.state);
        window.$(`#setting-table`).collapse("hide");
    }
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListSalary(this.state);
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    handleSunmitSearch = async () => {
        await this.setState({
            month: this.refs.month.value
        })
        this.props.getListSalary(this.state);
    }
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
    render() {
        var formatter = new Intl.NumberFormat();
        var listSalary = "";
        if (this.props.Salary.isLoading === false) {
            listSalary = this.props.Salary.listSalary;
        }
        var pageTotal = (this.props.Salary.totalList % this.state.limit === 0) ?
            parseInt(this.props.Salary.totalList / this.state.limit) :
            parseInt((this.props.Salary.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-info">
                            <div className="box-body">
                                <div className="col-md-12">
                                    <div className="box-header col-md-12" style={{ paddingLeft: 0 }}>
                                        <h3 className="box-title">Danh sách bảng lương nhân viên:</h3>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label style={{ paddingTop: 5 }}>Đơn vị:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <select className="form-control">
                                                <option value="các đơn vị">-- Tất cả --</option>
                                                <optgroup label="MARKETING & NCPT sản phẩm">
                                                    <option value="Phòng MARKETING">Phòng MARKETING</option>
                                                    <option value="Phòng nghiên cứu phát triển sản phẩm">Phòng nghiên cứu phát triển sản phẩm</option>
                                                </optgroup>
                                                <optgroup label="Quản trị nhân sự">
                                                    <option value="Phòng hành chính - quản trị">Phòng hành chính - quản trị</option>
                                                    <option value="Tổ hỗ trợ">Tổ hỗ trợ</option>
                                                </optgroup>
                                                <optgroup label="Tài chính - kế toán">
                                                    <option>Phòng kế toàn doanh nghiệp</option>
                                                    <option>Phòng kế toàn ADMIN</option>
                                                </optgroup>
                                                <optgroup label="Nhà máy sản xuất">
                                                    <option>Phòng công nghệ phát triển sản phẩm</option>
                                                    <option>Văn phòng xưởng</option>
                                                    <option>Phòng đảm bảo chất lượng</option>
                                                    <option>Phòng kiểm tra chất lượng</option>
                                                    <option>Phòng kế hoạch vật tư</option>
                                                    <option>Xưởng thuốc bột GMP</option>
                                                    <option>Xưởng thuốc nước GMP</option>
                                                    <option>Xưởng thực phẩm chức năng</option>
                                                </optgroup>
                                                <option value="Phòng kinh doanh VIAVET">Phòng kinh doanh VIAVET</option>
                                                <option value="Phòng kinh doanh SANFOVET">Phòng kinh doanh SANFOVET</option>
                                                <option value="">Ban kinh doanh dự án</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label style={{ paddingTop: 5 }}>Chức vụ:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <select className="form-control">
                                                <option>--Tất cả--</option>
                                                <option>Trưởng phòng</option>
                                                <option>Phó trưởng phòng</option>
                                                <option>Nhân viên</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label htmlFor="employeeNumber" style={{ paddingTop: 5 }}>Mã NV:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label htmlFor="month" style={{ paddingTop: 5 }}>Tháng:</label>
                                        </div>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" className="form-control" name="month" id="employeedatepicker4" defaultValue={this.formatDate(Date.now())} ref="month" placeholder="Tháng tính lương" data-date-format="mm-yyyy" autoComplete="off" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group" style={{ paddingLeft: 0 }}>
                                            <button type="submit" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSunmitSearch()} >Tìm kiếm</button>
                                        </div>
                                    </div>
                                    <div className="col-md-3" style={{ paddingRight: 0 }}>
                                        <div className="form-group pull-right" >
                                            <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="true" title="Thêm bảng lương nhân viên" >Thêm bảng lương</button>
                                            <ul className="dropdown-menu pull-right" style={{ background: "#999", marginTop: -15 }}>
                                                <li><a href="#abc" style={{ color: "#fff" }} title="Thêm nhiều bảng lương" data-toggle="modal" data-target="#modal-importFileSalary">Import file Excel</a></li>
                                                <li><a href="#abc" style={{ color: "#fff" }} title="Thêm một bảng lương" data-toggle="modal" data-target="#modal-addNewSalary">Thêm bằng tay</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "13%" }}>Mã nhân viên</th>
                                                <th style={{ width: "20%" }}>Tên nhân viên</th>
                                                <th style={{ width: "13%" }}>Tháng</th>
                                                <th style={{ width: "13%" }}>Tổng lương</th>
                                                <th style={{ width: "15%" }}>Đơn vị</th>
                                                <th style={{ width: "15%" }}>Chức vụ</th>
                                                <th style={{ width: '120px', textAlign: 'center' }}>
                                                    <ActionColumn
                                                        columnName="Hành động"
                                                        hideColumn={false}
                                                        setLimit={this.setLimit}
                                                    />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(typeof listSalary === 'undefined' || listSalary.length === 0) ? <tr><td colSpan={7}><center> Không có dữ liệu</center></td></tr> :
                                                listSalary.map((x, index) => {

                                                    var salary = x.mainSalary.slice(0, x.mainSalary.length - 3);
                                                    if (x.bonus.length !== 0) {
                                                        var total = 0;
                                                        for (let count in x.bonus) {
                                                            total = total + parseInt(x.bonus[count].number)
                                                        }
                                                    }
                                                    var unit = x.mainSalary.slice(-3, x.mainSalary.length);
                                                    return (
                                                        <tr key={index}>
                                                            <td>{x.employee.employeeNumber}</td>
                                                            <td>{x.employee.fullName}</td>
                                                            <td>{x.month}</td>
                                                            <td>
                                                                {
                                                                    (typeof x.bonus === 'undefined' || x.bonus.length === 0) ?
                                                                        formatter.format(parseInt(salary)) :
                                                                        formatter.format(total + parseInt(salary))
                                                                } {unit}
                                                            </td>
                                                            <td>Phòng nhân sự</td>
                                                            <td>Nhân viên</td>
                                                            <td>
                                                                <ModalEditSalary data={x} />
                                                                <ModalDeleteSalary data={x} />
                                                            </td>
                                                        </tr>)
                                                })
                                            }
                                        </tbody>
                                    </table>

                                </div>
                                <PaginateBar pageTotal={pageTotal} currentPage={page} func={this.setPage} />
                            </div>
                        </div>

                    </div>
                </div>
                <ToastContainer />
                <ModalAddSalary />
                <ModalImportFileSalary />

            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { Salary } = state;
    return { Salary };
};

const actionCreators = {
    getListSalary: SalaryActions.getListSalary,
};

const connectedListSalary = connect(mapState, actionCreators)(SalaryEmployee);
export { connectedListSalary as SalaryEmployee };