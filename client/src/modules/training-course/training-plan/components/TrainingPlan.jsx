import React, { Component } from 'react';
import { ModalDetailTrainingPlan } from './ModalDetailTrainingPlan';
import { ModalEditTrainingPlan } from './ModalEditTrainingPlan';
import { ModalDeleteTrainingPlan } from './ModalDeleteTrainingPlan';
import { ModalAddTrainingPlan } from './ModalAddTrainingPlan';
class TrainingPlan extends Component {
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'main/js/ListEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <div className="box">

                            {/* /.box-header */}
                            <div className="box-body">
                                <div className="col-md-12">
                                    <div className="box-header col-md-12">
                                        <h3 className="box-title" style={{ marginTop: 10 }}>Danh sách các khoá đào tạo:</h3>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label htmlFor="fullname" >Mã khoá đào tạo:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
                                            <input type="text" className="form-control" name="fullName" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label htmlFor="fullname" style={{ paddingTop: 5 }}>Loại đào tạo:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
                                            <input type="text" className="form-control" name="fullName" />
                                        </div>
                                    </div>
                                    <div className="col-md-3" style={{ paddingTop: 5 }}>
                                        <div className="form-group" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <button type="submit" className="btn btn-success" title="Tìm kiếm" >Tìm kiếm</button>
                                        </div>
                                    </div>
                                    <div className="col-md-3" style={{ paddingTop: 5, paddingRight: 0 }}>
                                        <button type="submit" className="btn btn-success pull-right" id="" data-toggle="modal" data-target="#modal-addTrainingPlan" >Thêm khoá đào tạo</button>
                                    </div>
                                    <table id="listexample" className="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>Mã đào tạo</th>
                                                <th style={{ width: "22%" }}>Tên khoá đào tạo</th>
                                                <th title="Thời gian bắt đầu">Bắt đầu</th>
                                                <th title="Thời gian kết thúc">Kết thúc</th>
                                                <th>Địa điểm đào tạo</th>
                                                <th style={{ width: "22%" }}>Đơn vị đào tạo</th>
                                                <th style={{ width: "13%" }}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>12563</td>
                                                <td>An toàn lao động 2018</td>
                                                <td>5/5/2018</td>
                                                <td>9/10/2018</td>
                                                <td>P-901</td>
                                                <td>Công ty an toan thong tin va truyen thong Viet Nam</td>
                                                <td>
                                                    <center>
                                                        <a href="#view" title="Xem chi tiết chương trình đào tạo" data-toggle="modal" data-target="#modal-viewTrainingPlan" style={{ fontSize: 14 }} ><i className="material-icons">visibility</i></a>
                                                        <a href="#abc" className="edit" title="Chỉnh sửa chương trình đào tạo " data-toggle="modal" data-target="#modal-editTrainingPlan" ><i className="material-icons"></i></a>
                                                        <a href="#abc" className="delete" title="Xoá khoá đào tạo" data-toggle="modal" data-target="#modal-deleteTrainingPlan"><i className="material-icons"></i></a>
                                                    </center>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>12562</td>
                                                <td>Kinh nghiệm làm viêc 2019</td>
                                                <td>06/5/2019</td>
                                                <td>20/11/2019</td>
                                                <td>P-901</td>
                                                <td>Công ty an toan thong tin va truyen thong Viet Nam</td>
                                                <td>
                                                    <center>
                                                        <a href="#view" title="Xem chi tiết chương trình đào tạo" data-toggle="modal" data-target="#modal-viewTrainingPlan" style={{ fontSize: 14 }} ><i className="material-icons">visibility</i></a>
                                                        <a href="#abc" className="edit" title="Chỉnh sửa chương trình đào tạo " data-toggle="modal" data-target="#modal-editTrainingPlan"><i className="material-icons"></i></a>
                                                        <a href="#abc" className="delete" title="Xoá khoá đào tạo" data-toggle="modal" data-target="#modal-deleteTrainingPlan"><i className="material-icons"></i></a>
                                                    </center>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>12568</td>
                                                <td>Kỹ năng giao tiếp 2019</td>
                                                <td>06/5/2019</td>
                                                <td>20/11/2019</td>
                                                <td>P-901</td>
                                                <td>Công ty an toan thong tin va truyen thong Viet Nam</td>
                                                <td>
                                                    <center>
                                                        <a href="#view" title="Xem chi tiết chương trình đào tạo" data-toggle="modal" data-target="#modal-viewTrainingPlan" style={{ fontSize: 14 }} ><i className="material-icons">visibility</i></a>
                                                        <a href="#abc" className="edit" title="Chỉnh sửa chương trình đào tạo " data-toggle="modal" data-target="#modal-editTrainingPlan" ><i className="material-icons"></i></a>
                                                        <a href="#abc" className="delete" title="Xoá khoá đào tạo" data-toggle="modal" data-target="#modal-deleteTrainingPlan"><i className="material-icons"></i></a>
                                                    </center>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>12569</td>
                                                <td>Kỹ năng đàm phán 2019</td>
                                                <td>06/5/2019</td>
                                                <td>20/11/2019</td>
                                                <td>P-901</td>
                                                <td>Công ty an toan thong tin va truyen thong Viet Nam</td>
                                                <td>
                                                    <center>
                                                        <a href="#view" title="Xem chi tiết khoá đào tạo" data-toggle="modal" data-target="#modal-viewTrainingPlan" style={{ fontSize: 14 }} ><i className="material-icons">visibility</i></a>
                                                        <a href="#abc" className="edit" title="Chỉnh sửa khoá đào tạo " data-toggle="modal" data-target="#modal-editTrainingPlan" ><i className="material-icons"></i></a>
                                                        <a href="#abc" className="delete" title="Xoá khoá đào tạo" data-toggle="modal" data-target="#modal-deleteTrainingPlan"><i className="material-icons"></i></a>
                                                    </center>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* /.box-body */}
                        </div>
                        <ModalDetailTrainingPlan />
                        <ModalEditTrainingPlan />
                        <ModalDeleteTrainingPlan />
                        <ModalAddTrainingPlan />
                        {/* /.box */}
                    </div>
                    {/* /.col */}
                </div>
            </React.Fragment>
        );
    };
};

export { TrainingPlan };