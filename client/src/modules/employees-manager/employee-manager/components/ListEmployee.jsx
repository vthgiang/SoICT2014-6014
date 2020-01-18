import React, { Component } from 'react';
import { connect } from 'react-redux';
import { employeeManagerActions } from '../redux/actions';
import { employeeInfoActions } from '../../employee-info/redux/actions';
import { ModalDetailEmployee } from './ModalDetailEmployee';
import { ModalEditOrganizational } from './ModalEditOrganizational ';
import { ModalAddEmployee } from './ModalAddEmployee';
import { ModalEditEmployee } from './ModalEditEmployee';
import './listemployee.css';

class ListEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showView: "",
            showEdit: "",
            department: "các đơn vị",
        }
        this.handleChangeUnit = this.handleChangeUnit.bind(this);
        this.handleResizeColumn();

    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'main/js/ListEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.props.getAllEmployee();

    }

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
    // function click a employee in table list employee
    view = async (employeeNumber) => {
        //this.props.getInformationEmployee(employeeNumber);
        await this.setState({
            showView: employeeNumber
        })


    }
    edit = (employeeNumber) => {
        this.props.getInformationEmployee(employeeNumber);
    }

    // function click edit information a employee

    // function change unit show 
    handleChangeUnit(event) {
        var { value } = event.target;
        this.setState({
            department: value
        })
        if (value !== "các đơn vị") {
            this.props.getListEmployee(value, "Trưởng phòng", "Phó phòng");
            this.setState({
                show: ""
            })
        } else {
            this.props.getListEmployee("", "", "");
            this.setState({
                show: "display"
            })
        }
        let script = document.createElement('script');
        script.src = 'main/js/ListEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    render() {
        console.log(this.state)
        var lists, listAll;
        var { employeesManager } = this.props;
        var { department } = this.state;
        if (employeesManager.allEmployee) {
            listAll = employeesManager.allEmployee;
        }
        if (employeesManager.listEmployee && employeesManager.listEmployee !== []) {
            lists = employeesManager.listEmployee;
        } else {
            if (employeesManager.allEmployee) {
                lists = employeesManager.allEmployee;
            }
        }
        var { employee, employeeContact } = this.props.employeesManager;
        console.log(employee);
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box box-info">
                        {/* /.box-header */}
                        <div className="box-body">
                            <div className="col-md-12">
                                <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    <div className="box-header col-md-6" style={{ paddingLeft: 0 }}>
                                        <h3 className="box-title">Danh sách nhân viên {department.toLowerCase()}:</h3>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <label htmlFor="fullname" style={{ paddingTop: 5 }}>Đơn vị:</label>
                                    </div>
                                    <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <select className="form-group" id="department" style={{ height: 32, width: "100%" }} onChange={this.handleChangeUnit}>
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
                                        <label htmlFor="fullname" style={{ paddingTop: 5 }}>Chức vụ:</label>
                                    </div>
                                    <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <select className="form-group" defaultValue="1" style={{ height: 32, width: "99%" }}>
                                            <option value="1">--Tất cả--</option>
                                            <option value="2">Nhân viên</option>
                                            <option value="4">Trưởng phòng</option>
                                            <option value="5">Phó phòng</option>

                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="col-md-3">
                                    <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <label htmlFor="fullname" style={{ paddingTop: 5 }}>Mã NV:</label>
                                    </div>
                                    <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <input type="text" className="form-control" name="employeeNumber" />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <label htmlFor="fullname" style={{ paddingTop: 5 }}>Giới tính:</label>
                                    </div>
                                    <input type="text" style={{ width: "66%" }} className="form-control" name="month" />
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group" style={{ paddingLeft: 0 }}>
                                        <button type="submit" className="btn btn-success" title="Tìm kiếm" >Tìm kiếm</button>
                                    </div>
                                </div>
                                <div className="col-md-12">

                                    <table className="table table-striped table-bordered table-resizable" id="myTable" >
                                        <thead>
                                            <tr>
                                                <th style={{ width: "15%" }}>Mã nhân viên</th>
                                                <th>Họ và tên</th>
                                                <th style={{ width: "10%" }}>Giới tính</th>
                                                <th style={{ width: "12%" }}>Ngày sinh</th>
                                                <th style={{ width: "12%" }}>Chức vụ</th>
                                                <th style={{ width: "13%" }}>Đơn vị</th>
                                                <th style={{ width: "13%" }}>Hành động
                                                
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(typeof lists === 'undefined' || lists.length === 0) ? <tr><td colSpan={6}><center> Không có dữ liệu</center></td></tr> :
                                                lists.map((x, index) => (
                                                    <tr key={index}>
                                                        <td>{x.employeeNumber}</td>
                                                        <td>{x.fullName}</td>
                                                        <td>{x.gender}</td>
                                                        <td>{x.brithday}</td>
                                                        {
                                                            (typeof x.department !== 'undefined' && x.department.length !== 0) ?
                                                                x.department.map((department, key) => (
                                                                    <td key={{ key }}>{department.position}</td>
                                                                )) : <td></td>
                                                        }
                                                        {
                                                            (typeof x.department !== 'undefined' && x.department.length !== 0) ?
                                                                x.department.map((department, keys) => (
                                                                    <td key={{ keys }}>{department.nameDepartment}</td>
                                                                )) : <td></td>
                                                        }
                                                        < td >
                                                            <ModalDetailEmployee list={x} />
                                                            <ModalEditEmployee list={x} />
                                                            <a href="#abc" className="delete" title="Xoá nhân viên khỏi đơn vị" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                        </td>
                                                    </tr>
                                                )
                                                )}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th>Mã nhân viên</th>
                                                <th>Họ và tên</th>
                                                <th>Giới tính</th>
                                                <th>Ngày sinh</th>
                                                <th>Chức vụ</th>
                                                <th>Đơn vị</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <div>
                                        <ul className="pagination pagination-sm m-0 pull-right" style={{ marginTop: 0 }}>
                                            <li className="page-item"><a className="page-link" href="#">«</a></li>
                                            <li className="page-item"><a className="page-link" href="#">1</a></li>
                                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                                            <li className="page-item"><a className="page-link" href="#">»</a></li>
                                        </ul>
                                        <div id="search-page" className="col-sm-12 collapse" style={{ width: "26%" }}>
                                            <input className="col-sm-6 form-control" type="number" min="1" style={{ width: "60%" }} ref={input => this.newCurrentPage = input} />
                                            <button className="col-sm-4 btn btn-success" style={{ width: "35%", marginLeft: "5%" }} onClick={() => this.handleSearchPage()}>Tìm kiếm</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* /.box-body */}
                    </div>
                    {/* /.box */}
                </div>
                <ModalEditOrganizational department={department} listAll={listAll} />
                <ModalAddEmployee state={this.state} department={department} />
            </div >
        );
    };
}

function mapState(state) {
    const { employeesManager } = state;
    return { employeesManager };
}

const actionCreators = {
    getAllEmployee: employeeManagerActions.getAllEmployee,
    getInformationEmployee: employeeInfoActions.getInformationEmployee,
    getListEmployee: employeeManagerActions.getListEmployee,
};
const connectedEmplyee = connect(mapState, actionCreators)(ListEmployee);

export { connectedEmplyee as ListEmployee };