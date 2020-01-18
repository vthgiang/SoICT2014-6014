import React, { Component } from 'react';
import { ModalAddEmployeeSabbatical } from './ModalAddEmployeeSabbatical';
import { ModalEditEmployeeSabbatical } from './ModalEditEmployeeSabbatical';
import { ModalDeleteEmployeeSabbatical } from './ModalDeleteEmployeeSabbatical';

class Sabbatical extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="box box-info">
                        <div className="box-body">
                            <div className="col-md-12">
                                <div className="box-header col-md-12" style={{ paddingLeft: 0 }}>
                                    <h3 className="box-title">Danh sách đơn xin nghỉ:</h3>
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
                                <div className="col-md-3">
                                    <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <label style={{ paddingTop: 5 }}>Trạng thái:</label>
                                    </div>
                                    <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <select className="form-control">
                                            <option>--Tất cả--</option>
                                            <option>Đã chấp nhận</option>
                                            <option>Chờ phê duyệt</option>
                                            <option>Không chấp nhận</option>
                                        </select>
                                    </div>
                                </div></div>
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
                                    <div className="form-group" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <center>
                                            <button type="submit" className="btn btn-success" title="Tìm kiếm" >Tìm kiếm</button></center>
                                    </div>
                                </div>
                                <div className="col-md-3" style={{ paddingRight: 0 }}>
                                    <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" id="" data-toggle="modal" data-target="#modal-addEmployeeSabbatical">Thêm đơn xin nghỉ</button>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "8%" }}>Mã NV</th>
                                            <th style={{ width: "16%" }}>Tên nhân viên</th>
                                            <th style={{ width: "8%" }}>Từ ngày</th>
                                            <th style={{ width: "8%" }}>Đến ngày</th>
                                            <th>Lý do</th>
                                            <th style={{ width: "12%" }}>Đơn vị</th>
                                            <th style={{ width: "10%" }}>Chức vụ</th>
                                            <th style={{ width: "11%" }}>Trạng thái</th>
                                            <th style={{ width: "9%" }}>Hành động</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>102566</td>
                                            <td>Nguyễn Hoàng Quân</td>
                                            <td>20/5/2019</td>
                                            <td>22/5/2019</td>
                                            <td>Về quê</td>
                                            <td>P KTTT ViaVet</td>
                                            <td>Nhân viên</td>
                                            <td>Được chấp nhận</td>
                                            <td>
                                                <center>
                                                    <a href="#abc" className="edit" title="Chỉnh sửa đơn xin nghi" data-toggle="modal" data-target="#modal-editEmployeeSabbatical" ><i className="material-icons"></i></a>
                                                    <a href="#abc" className="delete" title="Xoá đơn xin nghỉ" data-toggle="modal" data-target="#modal-deleteemployeeSabbatical"><i className="material-icons"></i></a>
                                                </center>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>102567</td>
                                            <td>Lê Thị Phúc</td>
                                            <td>20/5/2019</td>
                                            <td>22/5/2019</td>
                                            <td>Đi du lịch</td>
                                            <td>PKD ViaVet</td>
                                            <td>Nhân viên</td>
                                            <td>Được chấp nhận</td>
                                            <td>
                                                <center>
                                                    <a href="#abc" className="edit" title="Chỉnh sửa đơn xin nghi" data-toggle="modal" data-target="#modal-editEmployeeSabbatical"><i className="material-icons"></i></a>
                                                    <a href="#abc" className="delete" title="Xoá đơn xin nghỉ" data-toggle="modal" data-target="#modal-deleteemployeeSabbatical"><i className="material-icons"></i></a>
                                                </center>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalAddEmployeeSabbatical />
                <ModalEditEmployeeSabbatical />
                <ModalDeleteEmployeeSabbatical />
            </React.Fragment>
        );
    }
};

export { Sabbatical };