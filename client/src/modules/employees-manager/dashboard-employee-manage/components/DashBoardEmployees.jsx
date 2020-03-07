import React, { Component } from 'react';
import { ModalImportHoliday } from './ModalImportHoliday';
import { ModalDeleteHoliday } from './ModalDeleteHoliday';
import { ModalEditHoliday } from './ModalEditHoliday';
import { ModalAddHoliday } from './ModalAddHoliday';
import { LineAndBarChart } from './LineAndBarChart';
import {ThreeBarChart} from './ThreeBarChart';

class DashBoardEmployees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: [
                ['01-2020', 13.50, 12.33],
                ['02-2020', 13.50, 12.33],
                ['03-2020', 13.50, 11.33],
                ['04-2020', 13.50, 15.33],
                ['05-2020', 13.50, 12.33],
                ['06-2020', 13.50, 11.33],
                ['07-2020', 13.50, 12.33],
                ['08-2020', 13.50, 12.33],
                ['09-2020', 13.50, 11.33],
                ['10-2020', 13.50, 15.33],
                ['11-2020', 13.50, 12.33],
                ['12-2020', 13.50, 11.33],
            ]
        }
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/DashBoardEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <LineAndBarChart
                        dataset={this.state.dataset}
                        nameChart={"Biểu đồ tỷ lệ % quỹ lương công ty/doanh thu 12 tháng gần nhất"}
                        calculationUnit={"%"}
                        nameLableBar={"% Tổng lương"}
                        nameLableLine={"% Mục tiêu"}
                    />
                    <LineAndBarChart
                        dataset={this.state.dataset}
                        nameChart={"Biểu đồ tỷ lệ % quỹ lương khối kinh doanh/doanh thu 12 tháng gần nhất"}
                        calculationUnit={"%"}
                        nameLableBar={"% Kinh doanh"}
                        nameLableLine={"% Mục tiêu"}
                    />
                    <LineAndBarChart
                        dataset={this.state.dataset}
                        nameChart={"Biểu đồ tỷ lệ % quỹ lương khối quản trị/doanh thu 12 tháng gần nhất"}
                        calculationUnit={"%"}
                        nameLableBar={"% Quản trị"}
                        nameLableLine={"% Mục tiêu"}
                    />
                    <LineAndBarChart
                        dataset={this.state.dataset}
                        nameChart={"Biểu đồ tỷ lệ % quỹ lương khối sản xuất/doanh thu 12 tháng gần nhất"}
                        calculationUnit={"%"}
                        nameLableBar={"% Sản xuất"}
                        nameLableLine={"% Mục tiêu"}
                    />
                    <ThreeBarChart
                    nameChart={"Biểu đồ tỷ lệ % quỹ lương các khối chức năng/doanh thu 12 tháng gần nhất"}
                    calculationUnit={"%"}
                    nameField1={"% Kinh doanh"}
                    nameField2={"% Sản xuất"}
                    nameField3={"% Quản trị"}
                    />
                    <div className="col-md-12">
                        <div className="box box-success">
                            <div className="box-header with-border">
                                <h3 className="box-title">Danh sách lịch nghỉ ngày lễ (ngày tết)</h3>
                                <div className="box-tools pull-right">
                                    <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" /></button>
                                </div>
                                <button type="submit" style={{ marginRight: 15 }} className="btn btn-success pull-right" id="" title="Chọn tệp để Import" data-toggle="modal" data-target="#modal-importFileSabbatical">Import File</button>
                                <button type="submit" style={{ marginRight: 15 }} className="btn btn-success pull-right" id="" title="Thêm mới lịch nghỉ" data-toggle="modal" data-target="#modal-addHoliday">Thêm mới</button>
                            </div>
                            <div className="box-body" >
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "5%" }}>STT</th>
                                            <th style={{ width: "30%" }}>Các mốc thời gian</th>
                                            <th style={{ width: "55%" }}>Mô tả các mốc thời gian</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>01/01/2019</td>
                                            <td>Nghỉ tết dương lịch</td>
                                            <td>
                                                <center>
                                                    {/* <a href="#view" className="" title="Xem chi tiết nhân viên" data-toggle="tooltip" style={{ fontSize: 14 }} ><i className="material-icons">visibility</i></a> */}
                                                    <a href="#abc" className="edit" title="Chỉnh sửa lịch nghỉ làm " data-toggle="modal" data-target="#modal-editSabbatical"><i className="material-icons"></i></a>
                                                    <a href="#abc" className="delete" title="Xoá lịch nghỉ làm" data-toggle="modal" data-target="#modal-deleteSabbatical"><i className="material-icons"></i></a>
                                                </center>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>30/04/2019-01/5/2019</td>
                                            <td>Nghỉ lễ ngày giải phóng miền Nam 30/4 và Nghỉ lễ 1/5</td>
                                            <td>
                                                <center>
                                                    {/* <a href="#view" className="" title="Xem chi tiết nhân viên" data-toggle="tooltip" style={{ fontSize: 14 }} ><i className="material-icons">visibility</i></a> */}
                                                    <a href="#abc" className="edit" title="Chỉnh sửa lịch nghỉ làm " data-toggle="modal" data-target="#modal-editSabbatical"><i className="material-icons"></i></a>
                                                    <a href="#abc" className="delete" title="Xoá lịch nghỉ làm" data-toggle="modal" data-target="#modal-deleteSabbatical"><i className="material-icons"></i></a>
                                                </center>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* /.box-body */}
                        </div>
                    </div>
                </div>
                <ModalImportHoliday />
                <ModalDeleteHoliday />
                <ModalEditHoliday />
                <ModalAddHoliday />
            </React.Fragment>
        );
    }
};

export { DashBoardEmployees };