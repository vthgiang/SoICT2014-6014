import React, { Component } from 'react';

class ModalAddTrainingPlan extends Component {
    render() {
        return (
            <div className="modal modal-full fade" id="modal-addTrainingPlan" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm khoá đào tạo</h4>
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
                                    <div className="col-md-6">
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Tên khoá đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Thời gian bắt đầu:<span className="required">&#42;</span></label>
                                            <input type="date" className="form-control" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Chi phí đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Giảng viên:</label>
                                            <input type="text" className="form-control" />
                                        </div>

                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Địa điểm đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Thời gian kết thúc:<span className="required">&#42;</span></label>
                                            <input type="date" className="form-control" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Đơn vị đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="form-group col-md-8">
                                            <label htmlFor="employeeNumber">Thuộc chương trình đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" />
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
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>
                            {/* /.box-body */}
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" title="Thêm mới khoá đào tạo" className="btn btn-success pull-right">Thêm mới</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};

export { ModalAddTrainingPlan };