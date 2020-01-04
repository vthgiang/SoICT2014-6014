import React, { Component } from 'react';

class ModalDeleteSalary extends Component {
    render() {
        return (
            <div className="modal fade" id="modal-deleteSalary" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Xoá bảng lương: Mã nhân viên - 20152369</h4>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc chắn muốn xoá bảng lương</p>
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 25 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" title="Xoá bảng lương" className="btn btn-success pull-right">Xoá</button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
};

export { ModalDeleteSalary };