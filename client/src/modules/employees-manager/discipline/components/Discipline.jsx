import React, { Component } from 'react';
import { ModalAddDiscipline } from './ModalAddDiscipline';
import { ModalEditDiscipline } from './ModalEditDiscipline';
import { ModalAddPraise } from './ModalAddPraise';
import { ModalEditPraise } from './ModalEditPraise';

class Discipline extends Component {
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
                    {/* left column */}
                    <div className="col-sm-12">
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Danh sách nhân viên được khen thưởng" data-toggle="tab" href="#khenthuong">Danh sách khen thưởng</a></li>
                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Danh sách nhân viên bị kỷ luật" data-toggle="tab" href="#kyluat">Danh sách kỷ luật</a></li>
                            </ul>
                            <div className="tab-content">
                                <div id="khenthuong" className="tab-pane active">
                                    <div className="box-body">
                                        <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                                        <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                                                <input type="text" style={{ width: "66%" }} className="form-control" name="month" id="datepicker2" data-date-format="mm-yyyy" placeholder="Tháng ra quyết định" />
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group" style={{ paddingLeft: 0 }}>
                                                    <button type="submit" className="btn btn-success" title="Tìm kiếm" >Tìm kiếm</button>
                                                </div>
                                            </div>
                                            <div className="col-md-3" style={{ paddingRight: 0 }}>
                                                <div className="form-group pull-right" >
                                                    <button type="button" className="btn btn-success" title="Thêm khen thưởng nhân viên" data-toggle="modal" data-target="#modal-addPraise" >Thêm khen thưởng</button>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <table className="table table-bordered" >
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "12%" }}>Mã nhân viên</th>
                                                        <th>Tên nhân viên</th>
                                                        <th style={{ width: "13%" }}>Ngày quyết định</th>
                                                        <th style={{ width: "15%" }}>Thành tích (lý do)</th>
                                                        <th>Đơn vị</th>
                                                        <th>Chức vụ</th>
                                                        <th style={{ width: "12%" }}>Hành động</th>
                                                    </tr>

                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>123653</td>
                                                        <td>Quách Hồng Phong</td>
                                                        <td>30/05/2019</td>
                                                        <td>Nhân viên xuất sắc nhất tháng 5</td>
                                                        <td>Phòng MARKETING</td>
                                                        <td>nhân viên</td>
                                                        <td>
                                                            <center>
                                                                <a href="#view" title="Xem chi tiết nhân viên" data-toggle="modal" data-target="#modal-viewEmployee"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="edit" title="Chỉnh sửa đơn xin nghi" data-toggle="modal" data-target="#modal-editPraise" ><i className="material-icons"></i></a>
                                                                <a href="#abc" className="delete" title="Xoá đơn xin nghỉ" data-toggle="modal" data-target="#modal-deleteemployeeSabbatical"><i className="material-icons"></i></a>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>123652</td>
                                                        <td>Đỗ Văn Dương</td>
                                                        <td>30/06/2019</td>
                                                        <td>Nhân viên xuất sắc nhất tháng 6</td>
                                                        <td>Phòng MARKETING</td>
                                                        <td>nhân viên</td>
                                                        <td>
                                                            <center>
                                                                <a href="#view" title="Xem chi tiết nhân viên" data-toggle="modal" data-target="#modal-viewEmployee"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="edit" title="Chỉnh sửa đơn xin nghi" data-toggle="modal" data-target="#modal-editPraise" ><i className="material-icons"></i></a>
                                                                <a href="#abc" className="delete" title="Xoá đơn xin nghỉ" data-toggle="modal" data-target="#modal-deleteemployeeSabbatical"><i className="material-icons"></i></a>
                                                            </center>
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div id="kyluat" className="tab-pane">
                                    <div className="box-body">
                                        <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                                        <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                                                <input type="text" style={{ width: "66%" }} className="form-control" name="month" id="datepickerEmployee2" data-date-format="mm-yyyy" placeholder="Tháng ra quyết định" />
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group" style={{ paddingLeft: 0 }}>
                                                    <button type="submit" className="btn btn-success" title="Tìm kiếm" >Tìm kiếm</button>
                                                </div>
                                            </div>
                                            <div className="col-md-3" style={{ paddingRight: 0 }}>
                                                <div className="form-group pull-right" >
                                                    <button type="button" className="btn btn-success" title="Thêm kỷ luật nhân viên" data-toggle="modal" data-target="#modal-addDisciline" >Thêm kỷ luật</button>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-sm-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <table className="table table-bordered" >
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "12%" }}>Mã nhân viên</th>
                                                        <th>Tên nhân viên</th>
                                                        <th style={{ width: "15%" }}>Ngày có hiệu lực</th>
                                                        <th style={{ width: "15%" }}>Ngày hết hiệu lực</th>
                                                        <th>Lý do kỷ luật</th>
                                                        <th>Đơn vị</th>
                                                        <th>Chức vụ</th>
                                                        <th style={{ width: "12%" }}>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>123653</td>
                                                        <td>Quách Hồng Phong</td>
                                                        <td>20/07/2019</td>
                                                        <td>12/08/2019</td>
                                                        <td>Chưa hoàn thành chỉ tiêu</td>
                                                        <td>Phòng MARKETING</td>
                                                        <td>nhân viên</td>
                                                        <td>
                                                            <center>
                                                                <a href="#view" title="Xem chi tiết nhân viên" data-toggle="modal" data-target="#modal-viewEmployee"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="edit" title="Chỉnh sửa thông tin kỷ luật" data-toggle="modal" data-target="#modal-editDisciline" ><i className="material-icons"></i></a>
                                                                <a href="#abc" className="delete" title="Xoá đơn xin nghỉ" data-toggle="modal" data-target="#modal-deleteemployeeSabbatical"><i className="material-icons"></i></a>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>123652</td>
                                                        <td>Đỗ Văn Dương</td>
                                                        <td>20/07/2019</td>
                                                        <td>12/08/2019</td>
                                                        <td>Chưa hoàn thành chỉ tiêu</td>
                                                        <td>Phòng MARKETING</td>
                                                        <td>nhân viên</td>
                                                        <td>
                                                            <center>
                                                                <a href="#view" title="Xem chi tiết nhân viên" data-toggle="modal" data-target="#modal-viewEmployee"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="edit" title="Chỉnh sửa thông tin lỷ luật" data-toggle="modal" data-target="#modal-editDisciline" ><i className="material-icons"></i></a>
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
                        </div>
                    </div>
                </div>
                <ModalAddDiscipline />
                <ModalEditDiscipline />
                <ModalAddPraise />
                <ModalEditPraise />
            </React.Fragment>
        )
    };
}

export { Discipline };