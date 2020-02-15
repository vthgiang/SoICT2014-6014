import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CourseActions } from '../redux/actions';

class ModalDetailCourse extends Component {
    constructor(props) {
        super(props);
        this.handleResizeColumn();
    }

    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
    }
    render() {
        var { data } = this.props;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-viewCourse-${data.numberEducation}`} title="Xem chi tiết chương trình đào tạo" data-toggle="modal"><i className="material-icons">visibility</i></a>
                <div className="modal modal-full fade" id={`modal-viewCourse-${data.numberEducation}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog-full">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Chi tiết chương trình đào tạo: {data.nameEducation + "-" + data.numberEducation}</h4>
                            </div>
                            <div className="modal-body" style={{ paddingTop: 0 }}>
                                <div className="col-md-12">
                                    <div className="box-header col-md-12" style={{ paddingLeft: 0 }}>
                                        <h3 className="box-title">Danh sách khoá đào tạo của chương trình đào tạo:</h3>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0 }}>
                                            <label htmlFor="fullname" >Mã khoá đào tạo:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
                                            <input type="text" className="form-control" name="fullName" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0 }}>
                                            <label htmlFor="fullname" style={{ paddingTop: 5 }}>Loại đào tạo:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
                                            <input type="text" className="form-control" name="fullName" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group" style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 5 }}>
                                            <button type="submit" className="btn btn-success" title="Tìm kiếm" >Tìm kiếm</button>
                                        </div>
                                    </div>
                                    <table id="listexample" className="table table-striped table-bordered table-resizable">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "20%" }}>Tên khoá đào tạo</th>
                                                <th title="Mã khoá đào tạo" style={{ width: "14%" }}>Mã khoá đào tạo</th>
                                                <th title="Thời gian bắt đầu">Bắt đầu</th>
                                                <th title="Thời gian kết thúc">Kết thúc</th>
                                                <th title="Địa điểm đào tạo">Địa điểm</th>
                                                <th style={{ width: "20%" }}>Đơn vị đào tạo</th>
                                                <th style={{ width: "12%" }}>Loại đào tạo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>An toàn lao động 2019</td>
                                                <td>10987</td>
                                                <td>5/5/2018</td>
                                                <td>9/10/2018</td>
                                                <td>P-901</td>
                                                <td>Công ty an toan thong tin va truyen thong Viet Nam</td>
                                                <td>Đào tạo nội bộ</td>
                                            </tr>
                                            <tr>
                                                <td>An toàn lao động 2018</td>
                                                <td>10987</td>
                                                <td>06/5/2019</td>
                                                <td>20/11/2019</td>
                                                <td>P-901</td>
                                                <td>Công ty an toan thong tin va truyen thong Viet Nam</td>
                                                <td>Đào tạo nội bộ</td>

                                            </tr>
                                            <tr>
                                                <td>An toàn lao động 2017</td>
                                                <td>10987</td>
                                                <td>06/5/2019</td>
                                                <td>20/11/2019</td>
                                                <td>P-901</td>
                                                <td>Công ty an toan thong tin va truyen thong Viet Nam</td>
                                                <td>Đào tạo nội bộ</td>

                                            </tr>
                                            <tr>
                                                <td>An toàn lao động 2016</td>
                                                <td>10987</td>
                                                <td>06/5/2019</td>
                                                <td>20/11/2019</td>
                                                <td>P-901</td>
                                                <td>Công ty an toan thong tin va truyen thong Viet Nam</td>
                                                <td>Đào tạo nội bộ</td>
                                            </tr>
                                        </tbody>
                                    </table>
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
};

// function mapState(state) {
//     const { listCourse } = state;
//     return { listCourse };
// };

// const actionCreators = {
//     addNewCourse: CourseActions.createNewCourse,
// };

// const connectedAddCourse = connect(mapState, actionCreators)(ModalDetailCourse);
export { ModalDetailCourse };