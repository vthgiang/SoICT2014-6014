import React, { Component } from 'react';

class ModalAddHoliday extends Component {
    render() {
        return (
            <div className="modal fade" id="modal-addSabbatical" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới lịch nghỉ:</h4>
                        </div>
                        <div className="modal-body">
                            {/* /.box-header */}
                            <div className="box-body">
                                <div className="col-md-12">
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="employeeNumber">Ngày bắt đầu:<span className="required">&#42;</span></label>
                                        <input type="date" className="form-control" />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="employeeNumber">Ngày kết thúc:<span className="required">&#42;</span></label>
                                        <input type="date" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Mô tả lịch nghỉ:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="detail" style={{ height: 68 }} />
                                    </div>

                                </div>
                            </div>
                            {/* /.box-body */}
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" title="Thêm mới lịch nghỉ" className="btn btn-success pull-right">Thêm mới</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};

export { ModalAddHoliday };