import React, { Component } from 'react';

class ModalDetailTrainingPlan extends Component {
    render() {
        return (
            <div className="modal modal-full fade" id="modal-viewTrainingPlan" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Chi tiết khoá đào tạo</h4>
                        </div>
                        <div className="modal-body" style={{ paddingTop: 0 }}>


                            {/* <div className="box-header with-border">
                                    <h3 className="box-title">Chi tiết khoá đào tạo</h3>
                                </div> */}
                            <div className="nav-tabs-custom">
                                <ul className="nav nav-tabs">
                                    <li className="active"><a data-toggle="tab" href="#ketquadaotao">Thông tin khoá đào tạo</a></li>
                                    <li style={{ marginRight: 0 }}><a data-toggle="tab" href="#thongke">Thống kê khoá đào tạo</a></li>
                                </ul>
                                <div className="tab-content">
                                    <div id="ketquadaotao" className="tab-pane active">
                                        {/* /.box-header */}
                                        <div className="box-body">
                                            <div className="col-md-12">
                                                <div className="col-md-12">
                                                    <div className="form-group" style={{ marginTop: 20 }}>
                                                        <strong>Mã khoá đào tạo:&emsp; </strong>
                                                        12563
                                                        </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <strong>Tên khoá đào tạo:&emsp; </strong>
                                                        An toàn lao động 2019
                                                        </div>

                                                    <div className="form-group" style={{ marginTop: 20 }}>
                                                        <strong>Thời gian bắt đầu:&emsp; </strong>
                                                        5/5/2018
                                                        </div>
                                                    <div className="form-group" style={{ marginTop: 20 }}>
                                                        <strong>Chi phí đào tạo:&emsp; </strong>
                                                        100.000.000 VND
                                                        </div>
                                                    <div className="form-group" style={{ marginTop: 20 }}>
                                                        <strong>Giảng viên:&emsp; </strong>
                                                        Nguyễn văn A
                                                        </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <strong>Địa điểm đào tạo:&emsp; </strong>
                                                        P-901 Vnist
                                                        </div>
                                                    <div className="form-group" style={{ marginTop: 20 }}>
                                                        <strong>Thời gian kết thúc:&emsp; </strong>
                                                        20/10/2018
                                                        </div>
                                                    <div className="form-group" style={{ marginTop: 20 }}>
                                                        <strong>Đơn vị đào tạo:&emsp; </strong>
                                                        Công ty An toàn thông tin và truyền thông Việt Nam
                                                        </div>
                                                    <div className="form-group" style={{ marginTop: 20 }}>
                                                        <strong>Thuộc chương trình đào tạo:&emsp; </strong>
                                                        An toàn lao động
                                                        </div>
                                                </div>
                                                <div className="box-header col-md-12">
                                                    <h3 className="box-title">Danh sách nhân viên tham gia khoá đào tạo:</h3>
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
                                                                <td>Đạt</td>
                                                            </tr>
                                                            <tr>
                                                                <td>VN123456</td>
                                                                <td>Nguyễn Chí Thanh</td>
                                                                <td>phòng hành chính</td>
                                                                <td>Đạt</td>
                                                            </tr>
                                                            <tr>
                                                                <td>VN123456</td>
                                                                <td>Nguyễn Chí Thanh</td>
                                                                <td>phòng hành chính</td>
                                                                <td>Không đạt</td>

                                                            </tr>
                                                            <tr>
                                                                <td>VN123456</td>
                                                                <td>Nguyễn Chí Thanh</td>
                                                                <td>phòng hành chính</td>
                                                                <td>Đạt</td>
                                                            </tr>
                                                            <tr>
                                                                <td>VN123456</td>
                                                                <td>Nguyễn Chí Thanh</td>
                                                                <td>phòng hành chính</td>
                                                                <td>Đạt</td>
                                                            </tr>

                                                        </tbody>
                                                    </table>

                                                </div>
                                            </div>
                                        </div>
                                        {/* /.box-body */}

                                    </div>
                                    <div id="thongke" className="tab-pane">
                                        <div className="box-body">
                                            <div className="col-md-6">
                                                <div className="form-group" >
                                                    <strong>Số lượng tham gia :&emsp; </strong>
                                                    25 nhân viên
                                                        </div>
                                                <div className="form-group">
                                                    <strong>Số lượng hoàn thành:&emsp; </strong>
                                                    20 nhân viên
                                                        </div>
                                                <div className="form-group">
                                                    <strong>Số lượng chưa hoàn thành:&emsp; </strong>
                                                    25 nhân viên
                                                        </div>
                                                <div className="form-group" >
                                                    <strong>Chi phí khoá đào tạo:&emsp; </strong>
                                                    100.000.000VND
                                                        </div>

                                            </div>
                                            <div className="col-md-6">
                                                <button type="submit" title="Xuất báo cáo ra excel" className="btn btn-primary pull-right" id="" style={{ marginRight: 32 }}>Xuất báo cáo</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { ModalDetailTrainingPlan };