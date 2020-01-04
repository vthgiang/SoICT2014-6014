import React, { Component } from 'react';
import { connect } from 'react-redux';
import { employeeActions } from '../redux/actions';
import { ModalDetailEmployee } from './ModalDetailEmployee';
import { ModalEditOrganizational } from './ModalEditOrganizational ';
import { ModalAddEmployee } from './ModalAddEmployee';
import { ModalEditEmployee } from './ModalEditEmployee';
import './listemployee.css';

class ListEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: "display",
            view: "display",
            department: "các đơn vị",
            chiefSelected: "",
            deputySelected: [],
            unit: "Đơn vị",
        }
        this.handleChangeUnit = this.handleChangeUnit.bind(this);
        // this.handleChangeChief = this.handleChangeChief.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'main/js/ListEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.props.getAllEmployee();

    }
    // function click a employee in table list employee
    view = (employeeNumber) => {
        this.props.getInformationEmployee(employeeNumber);
        this.setState({
            view: "",
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
    click = () => {
        var { employees } = this.props;
        this.setState({
            chiefSelected: employees.chiefDepartment,
        })
    }
    handleSubmit(event) {
        var { employees } = this.props;
        this.setState({
            chiefSelected: employees.chiefDepartment,
        })
    }
    render() {
        console.log(this.state)
        var lists, chief = "", deputy = "", listAll;
        var { employees } = this.props;
        var { department } = this.state;
        if (employees.allEmployee) {
            listAll = employees.allEmployee;
        }
        if (employees.listEmployee && employees.listEmployee !== []) {
            lists = employees.listEmployee;
        } else {
            if (employees.allEmployee) {
                lists = employees.allEmployee;
            }
        }
        if (employees.chiefDepartment && employees.chiefDepartment !== []) {
            chief = employees.chiefDepartment;
        }
        if (employees.deputyDepartment && employees.deputyDepartment !== []) {
            deputy = employees.deputyDepartment;
        }
        var { employee, employeeContact } = this.props.employees;
        console.log(employee);
        return (
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Quản lý thông tin nhân viên
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="/"><i className="fa fa-dashboard" /> Home</a></li>
                        <li className="active">Quản lý nhân sự</li>
                    </ol>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-info">
                                {/* <div className="box-header with-border">
                                    <h3 className="box-title">Cơ cấu tổ chức các đơn vị</h3>
                                    <div className="box-tools pull-right">
                                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" /></button>
                                    </div>
                                    <button style={{ marginRight: 10 }} type="submit" className="btn btn-success pull-right" id="" title="Thêm nhân viên mới" data-toggle="modal" data-target="#modal-addEmployee">Thêm nhân viên</button>
                                </div> */}
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
                                        <div className="col-md-3" style={{ paddingRight: 0 }}>
                                            <button type="submit" className="btn btn-success pull-right" id="" title="Thêm nhân viên mới" data-toggle="modal" data-target="#modal-addEmployee">Thêm nhân viên</button>
                                        </div>
                                        {/* <div className={this.state.show} >
                                            <div className="col-md-12">
                                                <div className="col-md-4" style={{ paddingLeft: 0, paddingRight: 20 }}>
                                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                                        <label style={{ marginBottom: 0 }}>Trưởng {department.toLowerCase()}:</label>
                                                    </div>
                                                    {(typeof chief === 'undefined' || chief.length === 0) ?
                                                        <div className="user-panel" style={{ paddingTop: 5, marginTop: 5, background: "#eaeae8" }}>
                                                            <div className="pull-left image">
                                                                <img src="adminLTE/dist/img/avatar5.png" className="img-circle" alt="User " />
                                                            </div>
                                                            <div className="pull-left info">
                                                                <p style={{ fontSize: 14, height: 20, marginTop: 10 }}>Thêm trưởng {department.toLocaleLowerCase()}</p>
                                                            </div>
                                                            <div className="pull-right" style={{ marginTop: 10 }}>
                                                                <a href="#abc" className="delete" title="Thêm nhân sự" style={{ fontSize: 20, color: "#008d4c" }} >
                                                                    <i className="glyphicon glyphicon-plus-sign"></i>
                                                                </a>
                                                            </div>
                                                        </div> :
                                                        chief.map((x, index) => (
                                                            <div key={index} className="user-panel" style={{ paddingTop: 5, marginTop: 5, background: "#eaeae8" }}>
                                                                <div className="pull-left image">
                                                                    <img src="adminLTE/dist/img/avatar5.png" className="img-circle" alt="User " />
                                                                </div>
                                                                <div className="pull-left info">
                                                                    <p style={{ fontSize: 16, height: 20 }}>{x.fullName}</p>
                                                                    <span>Mã NV:{x.employeeNumber}</span>
                                                                </div>
                                                                <div className="pull-right" style={{ marginTop: 15 }}>
                                                                    <a href="#abc" className="edit" title="Thay đổi chức vụ" ><i className="material-icons"></i></a>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                </div>
                                                <div className="col-md-8" style={{ paddingRight: 0 }}>
                                                    <div className="form-group" style={{ marginBottom: 0, marginLeft: 15 }}>
                                                        <label style={{ marginBottom: 0 }}>Phó {department.toLowerCase()}:</label>
                                                    </div>
                                                    {deputy && deputy.map((x, index) => (
                                                        <div key={index} className="col-md-6" style={{ paddingRight: 0, marginTop: 5 }}>
                                                            <div className="user-panel" style={{ paddingTop: 5, background: "#eaeae8" }}>
                                                                <div className="pull-left image">
                                                                    <img src="adminLTE/dist/img/avatar5.png" className="img-circle" alt="User " />
                                                                </div>
                                                                <div className="pull-left info">
                                                                    <p style={{ fontSize: 16, height: 20 }}>{x.fullName}</p>
                                                                    <span>Mã NV:{x.employeeNumber}</span>
                                                                </div>
                                                                <div className="pull-right" style={{ marginTop: 15 }}>
                                                                    <a href="#abc" className="delete" title="Xoá chức vụ" style={{ color: "#E34724" }}><i className="material-icons"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="col-md-6" style={{ paddingRight: 0, marginTop: 5 }}>
                                                        <div className="user-panel" style={{ paddingTop: 5, background: "#eaeae8" }}>
                                                            <div className="pull-left image">
                                                                <img src="adminLTE/dist/img/avatar5.png" className="img-circle" alt="User " />
                                                            </div>
                                                            <div className="pull-left info">
                                                                <p style={{ fontSize: 14, height: 20, marginTop: 10 }}>Thêm phó {department.toLocaleLowerCase()}</p>
                                                            </div>
                                                            <div className="pull-right" style={{ marginTop: 10 }}>
                                                                <a href="#abc" className="delete" title="Thêm nhân sự" style={{ fontSize: 20, color: "#008d4c" }} ><i className="glyphicon glyphicon-plus-sign"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-md-6 pull-right" style={{ paddingRight: 0, marginTop: 5 }}>
                                                        <button type="submit" className="btn btn-success pull-right" id="" title={"Thêm phó " + department.toLowerCase()}><i className="glyphicon glyphicon-plus"></i></button>
                                                    </div> */}
                                        {/* </div>
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="col-md-12">

                                        <table className="table table-bordered" >
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "15%" }}>Mã nhân viên</th>
                                                    <th>Họ và tên</th>
                                                    <th style={{ width: "10%" }}>Giới tính</th>
                                                    <th style={{ width: "12%" }}>Ngày sinh</th>
                                                    <th style={{ width: "12%" }}>Chức vụ</th>
                                                    <th style={{ width: "13%" }}>Đơn vị</th>
                                                    <th style={{ width: "13%" }}>Hành động</th>
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
                                                                x.department && x.department.map((department, key) => (
                                                                    <td key={{ key }}>{department.position}</td>
                                                                ))
                                                            }
                                                            {
                                                                x.department && x.department.map((department, keys) => (
                                                                    <td key={{ keys }}>{department.nameDepartment}</td>
                                                                ))
                                                            }
                                                            < td >
                                                                <center>
                                                                    <a href="#view" title="Xem chi tiết nhân viên" data-toggle="modal" data-target="#modal-viewEmployee" onClick={() => this.view(x.employeeNumber)}><i className="material-icons">visibility</i></a>
                                                                    <a href="#abc" className="edit" title="Chỉnh sửa thông tin nhân viên " data-toggle="modal" data-target="#modal-editEmployee" onClick={() => this.edit(x.employeeNumber)} ><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title="Xoá nhân viên khỏi đơn vị" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                                </center>
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
                                    </div>
                                </div>
                                {/* /.box-body */}
                            </div>
                            {/* /.box */}
                        </div>
                        {/* /.col */}
                    </div>

                    <ModalDetailEmployee employee={employee} employeeContact={employeeContact} />

                    <ModalEditOrganizational department={department} listAll={listAll} />
                    <ModalAddEmployee state={this.state} department={department} />
                    <ModalEditEmployee employee={employee} employeeContact={employeeContact} />
                </section>
            </div >
        );
    };
}

function mapState(state) {
    const { employees } = state;
    return { employees };
}

const actionCreators = {
    getAllEmployee: employeeActions.getAllEmployee,
    getInformationEmployee: employeeActions.getInformationEmployee,
    getListEmployee: employeeActions.getListEmployee,
};
const connectedEmplyee = connect(mapState, actionCreators)(ListEmployee);

export { connectedEmplyee as ListEmployee };