import React, { Component } from 'react';
import { ModalImportSabbatical } from './ModalImportSabbatical';
import { ModalDeleteSabbatical } from './ModalDeleteSabbatical';
import { ModalEditSabbatical } from './ModalEditSabbatical';

class DashBoardEmployees extends Component {
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'main/js/DashBoardEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    render() {
        return (
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Dashboard quản lý nhân sự
                </h1>
                    <ol className="breadcrumb">
                        <li><a href="#abc"><i className="fa fa-dashboard" /> Home</a></li>
                        <li className="active">Quản lý nhân sự</li>
                    </ol>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <i className="fa fa-bar-chart-o" />
                                    <h3 className="box-title">Xu hướng vắng mặt của nhân viên trong 6 tháng gần nhất</h3>
                                    <div className="box-tools pull-right">
                                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" />
                                        </button>
                                    </div>
                                </div>
                                <div className="box-body">
                                    <div id="bar-chartEmployees" style={{ height: 300 }} />
                                </div>
                                {/* /.box-body*/}
                            </div>
                        </div>
                        <div className="col-md-6">
                            {/* LINE CHART */}
                            <div className="box box-info">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Tình hình tăng giảm nhân sự trong 12 tháng gần nhất</h3>
                                    <div className="box-tools pull-right">
                                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" />
                                        </button>
                                    </div>
                                </div>
                                <div className="box-body chart-responsive">
                                    <div className="chart" id="line-chartEmployees" style={{ height: 300 }} />
                                </div>
                                {/* /.box-body */}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="box box-success">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Danh sách lịch nghỉ ngày lễ (ngày tết)</h3>
                                    <div className="box-tools pull-right">
                                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" /></button>
                                    </div>
                                    <button type="submit" style={{ marginRight: 15 }} className="btn btn-success pull-right" id="" title="Chọn tệp để Import" data-toggle="modal" data-target="#modal-importFileSabbatical">Import File</button>
                                </div>
                                <div className="box-body" >
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }}>STT</th>
                                                <th style={{ width: "30%" }}>Các mốc thời gian</th>
                                                <th style={{ width: "65%" }}>Mô tả các mốc thời gian</th>
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
                </section>
                <ModalImportSabbatical />
                <ModalDeleteSabbatical />
                <ModalEditSabbatical />
            </div >
        );
    }
};

export { DashBoardEmployees };