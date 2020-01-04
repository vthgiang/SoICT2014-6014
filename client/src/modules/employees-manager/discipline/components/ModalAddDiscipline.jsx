import React, { Component } from './node_modules/react';

class ModalAddDiscipline extends Component {
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    render() {
        return (
            <div className="modal fade" id="modal-addDisciline" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới kỷ luật:</h4>
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
                                    <input type="text" className="form-control" id="employeeNumber" name="employeeNumber" placeholder="Mã số nhân viên" />
                                </div>
                                <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                    <label htmlFor="number">Số quyết định:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                    <label htmlFor="unit">Cấp ra quyết định:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                    <label htmlFor="startDate">Ngày có hiệu lực:<span className="required">&#42;</span></label>
                                    <input type="date" className="form-control" name="startDate" />
                                </div>
                                <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                    <label htmlFor="endDate">Ngày hết hiệu lực:<span className="required">&#42;</span></label>
                                    <input type="date" className="form-control" name="endDate" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="hinhthuc">Hình thức kỷ luật:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="hinhthuc" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="thanhtich">Lý do kỷ luật:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="thanhtich" style={{ height: 78 }} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-success" title="Thêm mới kỷ luật" >Thêm mới</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export { ModalAddDiscipline };