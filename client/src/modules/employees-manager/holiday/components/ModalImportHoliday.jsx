import React, { Component } from 'react';

class ModalImportHoliday extends Component {
    render() {
        return (
            <div className="modal fade" id="modal-importFileSabbatical" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm lịch nghỉ ngày lễ (ngày tết):</h4>
                        </div>
                        <div className="modal-body" >
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="employeeNumber">Chọn file Import:<span className="text-red">&#42;</span></label>
                                    <input type="file" className="form-control" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-success" title="Thêm lịch nghỉ ngày lễ, tết" >Thêm mới</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export { ModalImportHoliday };