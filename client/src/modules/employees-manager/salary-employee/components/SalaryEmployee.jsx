import React, { Component } from 'react';
import { ModalAddSalary } from './ModalAddSalary';
import { ModalImportFileSalary } from './ModalImportFileSalary';
import { ModalDeleteSalary } from './ModalDeleteSalary';
import { ModalEditSalary } from './ModalEditSalary';

class SalaryEmployee extends Component {
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="box box-info">
                            <div className="box-body">
                                <div className="col-md-12">
                                    <div className="box-header col-md-12" style={{ paddingLeft: 0 }}>
                                        <h3 className="box-title">Danh sách bảng lương nhân viên:</h3>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label htmlFor="fullname" style={{ paddingTop: 5 }}>Đơn vị:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <select className="form-group" style={{ height: 32, width: "100%" }}>
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
                                            <label htmlFor="fullname" style={{ paddingTop: 5 }}>Tháng:</label>
                                        </div>
                                        <input type="text" style={{ width: "66%" }} className="form-control" name="month" id="datepicker2" data-date-format="mm-yyyy" />
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group" style={{ paddingLeft: 0 }}>
                                            <button type="submit" className="btn btn-success" title="Tìm kiếm" >Tìm kiếm</button>
                                        </div>
                                    </div>
                                    <div className="col-md-3" style={{ paddingRight: 0 }}>
                                        <div className="form-group pull-right" >
                                            <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="true" title="Thêm bảng lương nhân viên" >Thêm bảng lương</button>
                                            <ul className="dropdown-menu pull-right" style={{background:"#999", marginTop:-15}}>
                                                <li><a href="#abc" style={{color:"#fff"}} title="Thêm nhiều bảng lương" data-toggle="modal" data-target="#modal-importFileSalary">Import file Excel</a></li>
                                                <li><a href="#abc" style={{color:"#fff"}} title="Thêm một bảng lương" data-toggle="modal" data-target="#modal-addSalary">Thêm bằng tay</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "13%" }}>Mã nhân viên</th>
                                                <th style={{ width: "20%" }}>Tên nhân viên</th>
                                                <th style={{ width: "13%" }}>Tháng</th>
                                                <th style={{ width: "13%" }}>Tổng lương</th>
                                                <th style={{ width: "15%" }}>Đơn vị</th>
                                                <th style={{ width: "12%" }}>Chức vụ</th>
                                                <th style={{ width: "13%" }}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>20152369</td>
                                                <td>Trần Hùng Cường</td>
                                                <td>01/05/2019</td>
                                                <td>10.000.000 VND</td>
                                                <td>Phòng nhân sự</td>
                                                <td>Nhân viên</td>
                                                <td>
                                                    <center>
                                                        {/* <a href="#view" className="" title="Xem chi tiết nhân viên" data-toggle="tooltip" style={{ fontSize: 14 }} ><i className="material-icons">visibility</i></a> */}
                                                        <a href="#abc" className="edit" title="Chỉnh sửa thông tin nhân viên " data-toggle="modal" data-target="#modal-editSalary"><i className="material-icons"></i></a>
                                                        <a href="#abc" className="delete" title="Xoá nhân viên khỏi đơn vị" data-toggle="modal" data-target="#modal-deleteSalary"><i className="material-icons"></i></a>
                                                    </center>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>20152369</td>
                                                <td>Trần Văn Hùng</td>
                                                <td>01/05/2019</td>
                                                <td>10.000.000 VND</td>
                                                <td>Phòng nhân sự</td>
                                                <td>Nhân viên</td>
                                                <td>
                                                    <center>
                                                        {/* <a href="#view" className="" title="Xem chi tiết lương " data-toggle="tooltip" ><i className="material-icons">visibility</i></a> */}
                                                        <a href="#abc" className="edit" title="Chỉnh sửa thông tin lương" data-toggle="modal" data-target="#modal-editSalary" ><i className="material-icons"></i></a>
                                                        <a href="#abc" className="delete" title="Xoá lương" data-toggle="modal" data-target="#modal-deleteSalary"><i className="material-icons"></i></a>
                                                    </center>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalAddSalary />
                <ModalImportFileSalary />
                <ModalDeleteSalary />
                <ModalEditSalary />
            </React.Fragment>
        );
    }
}

export { SalaryEmployee };