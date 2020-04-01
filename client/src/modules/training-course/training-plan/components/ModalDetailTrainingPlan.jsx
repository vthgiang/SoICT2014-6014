import React, { Component } from 'react';

class ModalDetailTrainingPlan extends Component {
    render() {
        var { data } = this.props
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-viewTrainingPlan-${data._id}`} title="Xem chi tiết khoá đào tạo" data-toggle="modal"><i className="material-icons">view_list</i></a>
                <div className="modal modal-full fade" id={`modal-viewTrainingPlan-${data._id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-size-75">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 style={{ textAlign: "center" }} className="modal-title">Chi tiết khoá đào tạo: {data.nameCourse} - {data.numberCourse}</h4>
                            </div>
                            <div className="modal-body" style={{ paddingTop: 0 }}>
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
                                                    <div className="col-md-6">
                                                        <div className="form-group" style={{ marginTop: 20 }}>
                                                            <strong>Mã khoá đào tạo:&emsp; </strong>
                                                            {data.numberCourse}
                                                        </div>
                                                        <div className="form-group" style={{ marginTop: 20 }}>
                                                            <strong>Thời gian bắt đầu:&emsp; </strong>
                                                            {data.startDate}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Địa điểm đào tạo:&emsp; </strong>
                                                            {data.address}
                                                        </div>
                                                        <div className="form-group" style={{ marginTop: 20 }}>
                                                            <strong>Giảng viên:&emsp; </strong>
                                                            {data.teacherCourse}
                                                        </div>
                                                        <div className="form-group" style={{ marginTop: 20 }}>
                                                            <strong>Thuộc chương trình đào tạo:&emsp; </strong>
                                                            {data.educationProgram.nameEducation}
                                                        </div>
                                                        <div className="form-group" style={{ marginTop: 20 }}>
                                                            <strong>Thời gian cam kết:&emsp; </strong>
                                                            {data.time} Tháng
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group" style={{ marginTop: 20 }} >
                                                            <strong>Tên khoá đào tạo:&emsp; </strong>
                                                            {data.nameCourse}
                                                        </div>

                                                        <div className="form-group" style={{ marginTop: 20 }}>
                                                            <strong>Thời gian kết thúc:&emsp; </strong>
                                                            {data.endDate}
                                                        </div>
                                                        <div className="form-group" style={{ marginTop: 20 }}>
                                                            <strong>Đơn vị đào tạo:&emsp; </strong>
                                                            {data.unitCourse}
                                                        </div>
                                                        <div className="form-group" style={{ marginTop: 20 }}>
                                                            <strong>Loại đào tạo:&emsp; </strong>
                                                            {data.typeCourse}
                                                        </div>
                                                        <div className="form-group" style={{ marginTop: 20 }}>
                                                            <strong>Chi phí đào tạo:&emsp; </strong>
                                                            {data.costsCourse}
                                                        </div>

                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label className="pull-left">Nhân viên tham gia:</label>
                                                        </div>
                                                        <div className="form-group col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }} >
                                                            <fieldset className="scheduler-border">
                                                                <div className=" col-md-12 pull-left" style={{ paddingLeft: 0, paddingRight: 0, width: "100%" }}>
                                                                    <div className="box-header pull-left" style={{ paddingLeft: 0, paddingTop: 0 }}>
                                                                        <h3 className="box-title pull-left" style={{ marginTop: 20 }}>Danh sách nhân viên tham gia khoá đào tạo:</h3>
                                                                    </div>
                                                                </div>
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
                                                            </fieldset>
                                                        </div>
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
            </div>
        );
    }
}

export { ModalDetailTrainingPlan };