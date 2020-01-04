import React, { Component } from 'react';

class ModalEditTrainingPlan extends Component {
    render() {
        return (
            <div className="modal modal-full fade" id="modal-editTrainingPlan" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Chỉnh sửa khoá đào tạo: An toàn lao động 2019</h4>
                        </div>
                        <div className="modal-body" style={{ paddingTop: 0 }}>
                            {/* /.box-header */}
                            <div className="box-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0, marginLeft: 30 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                    </div>
                                    <div className="col-md-12" style={{paddingLeft:0}}>
                                        <div className="col-md-6">
                                            <div className="form-group col-md-8">
                                                <label htmlFor="employeeNumber">Mã khoá đào tạo:<span className="required">&#42;</span></label>
                                                <input type="text" className="form-control" defaultValue="12563" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Tên khoá đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue="An toàn lao động 2019" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Thời gian bắt đầu:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue="5/5/2018" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Chi phí đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue="100.000.000 VND" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Giảng viên:</label>
                                            <input type="text" className="form-control" defaultValue="Nguyễn Văn A" />
                                        </div>

                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Địa điểm đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue="P-901 Vnist" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Thời gian kết thúc:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue="20/10/2018" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Đơn vị đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue="Công ty An toàn thông tin và truyền thông Việt Nam" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Thuộc chương trình đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue="An toàn lao động" />
                                        </div>
                                    </div>
                                    <div className="box-header col-md-12">
                                        <div className="col-md-6" style={{ paddingLeft: 5 }}>
                                            <h3 className="box-title">Danh sách nhân viên tham gia khoá đào tạo:</h3>
                                        </div>
                                        <div className="col-md-6" style={{ paddingRight: 5 }}>
                                            <button type="submit" className="btn btn-success pull-right" title="Thêm nhân viên tham gia kháo đào tạo">Thêm nhân viên</button>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <table className="table table-bordered table-hover listcourse">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "18%" }}>Mã nhân viên</th>
                                                    <th>Tên nhân viên</th>
                                                    <th>Đơn vị</th>
                                                    <th style={{ width: '20%' }}>Kết quả</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>VN123456</td>
                                                    <td>Nguyễn Chí Thanh</td>
                                                    <td>phòng hành chính</td>
                                                    <td>
                                                        <div className="">
                                                            <div className="radio" style={{ marginTop: 0 }}>
                                                                <label>
                                                                    <input type="radio" name="optionsRadios1" id="optionsRadios1" defaultValue="Hoàn thành" />
                                                                    &nbsp;Đạt&emsp;&emsp;
                                                                                </label>
                                                                <label>
                                                                    <input type="radio" name="optionsRadios1" id="optionsRadios2" defaultValue="Không hoàn thành" />
                                                                    &nbsp;Không đạt
                                                                                </label>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>VN123456</td>
                                                    <td>Nguyễn Chí Thanh</td>
                                                    <td>phòng hành chính</td>
                                                    <td>
                                                        <div className="">
                                                            <div className="radio" style={{ marginTop: 0 }}>
                                                                <label>
                                                                    <input type="radio" name="optionsRadios2" id="optionsRadios1" defaultValue="Hoàn thành" />
                                                                    &nbsp;Đạt&emsp;&emsp;
                                                                                </label>
                                                                <label>
                                                                    <input type="radio" name="optionsRadios2" id="optionsRadios2" defaultValue="Không hoàn thành" />
                                                                    &nbsp;Không đạt
                                                                                </label>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>VN123456</td>
                                                    <td>Nguyễn Chí Thanh</td>
                                                    <td>phòng hành chính</td>
                                                    <td>
                                                        <div className="">
                                                            <div className="radio" style={{ marginTop: 0 }}>
                                                                <label>
                                                                    <input type="radio" name="optionsRadios3" id="optionsRadios1" defaultValue="Hoàn thành" />
                                                                    &nbsp;Đạt&emsp;&emsp;
                                                                                </label>
                                                                <label>
                                                                    <input type="radio" name="optionsRadios3" id="optionsRadios2" defaultValue="Không hoàn thành" />
                                                                    &nbsp;Không đạt
                                                                                </label>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>VN123456</td>
                                                    <td>Nguyễn Chí Thanh</td>
                                                    <td>phòng hành chính</td>
                                                    <td>
                                                        <div className="">
                                                            <div className="radio" style={{ marginTop: 0 }}>
                                                                <label>
                                                                    <input type="radio" name="optionsRadios4" id="optionsRadios1" defaultValue="Hoàn thành" />
                                                                    &nbsp;Đạt&emsp;&emsp;
                                                                                </label>
                                                                <label>
                                                                    <input type="radio" name="optionsRadios4" id="optionsRadios2" defaultValue="Không hoàn thành" />
                                                                    &nbsp;Không đạt
                                                                                </label>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>VN123456</td>
                                                    <td>Nguyễn Chí Thanh</td>
                                                    <td>phòng hành chính</td>
                                                    <td>
                                                        <div className="">
                                                            <div className="radio" style={{ marginTop: 0 }}>
                                                                <label>
                                                                    <input type="radio" name="optionsRadios5" id="optionsRadios1" defaultValue="Hoàn thành" />
                                                                    &nbsp;Đạt&emsp;&emsp;
                                                                                </label>
                                                                <label>
                                                                    <input type="radio" name="optionsRadios5" id="optionsRadios2" defaultValue="Không hoàn thành" />
                                                                    &nbsp;Không đạt
                                                                                </label>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>
                            {/* /.box-body */}
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" title="Lưu lại các thay đổi" className="btn btn-success pull-right">Lưu thay đổi</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};

export { ModalEditTrainingPlan };