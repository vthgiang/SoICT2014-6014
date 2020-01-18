import React, { Component } from 'react';

class ModalEditCourse extends Component {
    render() {
        return (
            <div className="modal fade" id="modal-editCourse" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Chỉnh sửa chương trình đào tạo: An toàn lao động</h4>
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
                                        <label htmlFor="employeeNumber">Mã chương trình đào tạo:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" defaultValue="ITM789" name="employeeNumber" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Tên chương trình đào tạo:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" defaultValue="An toàn lao động" name="employeeNumber" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Áp dụng cho đơn vị:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" defaultValue="Phòng sản xuất" name="employeeNumber" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Áp dụng cho chức vụ:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" defaultValue=" Phó phòng" name="employeeNumber" />
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

export { ModalEditCourse };