import React, { Component } from 'react';

class ModalEditSalary extends Component {
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    render() {
        return (
            <div className="modal fade" id="modal-editSalary" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Chỉnh sửa bảng lương</h4>
                        </div>
                        <div className="modal-body">
                            {/* /.box-header */}
                            <div className="box-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Mã nhân viên:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" value="20152369" name="employeeNumber" disabled />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Tháng:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="month" id="datepickerEmployee3" data-date-format="mm-yyyy" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Lương:<span className="required">&#42;</span></label>
                                        <input type="number" className="form-control" />
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

export { ModalEditSalary };