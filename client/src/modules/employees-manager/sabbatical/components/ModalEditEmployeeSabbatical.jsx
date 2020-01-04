import React, { Component } from 'react';

class ModalEditEmployeeSabbatical extends Component {
    render() {
        return (
            <div className="modal fade" id="modal-editEmployeeSabbatical" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Chỉnh sửa đơn xin nghỉ:</h4>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="checkbox" style={{ marginTop: 0 }}>
                                    <label style={{ paddingLeft: 0 }}>
                                        (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="employeeNumber">Mã nhân viên:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" value="102566" disabled />
                                </div>
                                <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                    <label htmlFor="employeeNumber">Ngày bắt đầu:<span className="required">&#42;</span></label>
                                    <input type="date" className="form-control" defaultValue="20/05/2019" />
                                </div>
                                <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                    <label htmlFor="employeeNumber">Ngày kết thúc:<span className="required">&#42;</span></label>
                                    <input type="date" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="employeeNumber">Lý do:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" style={{ height: 68 }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="employeeNumber">Trạng thái:<span className="required">&#42;</span></label>
                                    <select className="form-control">
                                        <option>Chờ phê duyệt</option>
                                        <option>Đã chấp nhận</option>
                                        <option>Không chấp nhận</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" title="Lưu lại các thay đổi" className="btn btn-success pull-right">Lưu thay đổi</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export { ModalEditEmployeeSabbatical };