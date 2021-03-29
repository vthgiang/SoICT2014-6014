import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from "c3";
import "c3/c3.css";
import C3Chart from 'react-c3js';
import 'c3/c3.css';


function CrmDashBoard(props) {
    const data1 = {
        columns: [
            ['điểm đánh giá trung bình tháng', 30, 20, 95.2, 40, 50.9, 25,30, 91, 100, 40.9, 50, 50,22,21],
            ['Tỉ lệ thành công(%)', 50, 20, 10, 40, 15, 25,50, 20, 10, 40, 15, 25,80,65]
        ],
    };
    const data2 = {
        columns: [
            ['Khách hàng mới', 20],
            ['Tiềm năng', 20],
            ['Đã liên hệ', 40],
            ['Đã mua hàng', 12]
        ], type: 'pie'
    };
    const data3 = {
        columns: [
            ['Khách hàng bình thường', 20],
            ['Khách bán buôn', 20],
            ['Khách VIP', 40],
          
        ], type: 'pie'
    };

    return (
        <div className="container-fluid">
            <div className="row" >
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-aqua"><i class="fa fa-users" /></span>
                        <div className="info-box-content">
                            <span className="info-box-text">{"Số khách hàng quản lý"}</span>
                            <span className="info-box-number">142</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-yellow"><i className="fa fa-handshake-o" /></span>
                        <div className="info-box-content">
                            <span className="info-box-text">{"Tổng sô hoạt động tháng 3"}</span>
                            <span className="info-box-number">150</span>
                        </div>
                    </div>
                </div>

                <div className="clearfix visible-sm-block" />
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-green"><i className="fa fa-check-circle-o" /></span>
                        <div className="info-box-content">
                            <span className="info-box-text">{'Số hoạt động đã hoàn thành'}</span>
                            <span className="info-box-number">80</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-red"><i className="fa fa-exclamation" /></span>
                        <div className="info-box-content">
                            <span className="info-box-text">{'Số hoạt động quá hạn'}</span>
                            <span className="info-box-number">11</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row" style={{ marginTop: '60px', textAlign: 'center' }}>

                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <C3Chart data={data3} />
                    <label > <span>Biểu đồ khách hàng theo nhóm </span></label>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <C3Chart data={data2} />
                    <label > <span>Biểu đồ khách hàng theo trạng thái</span></label>
                </div>

            </div>
            <div className="row" style={{ marginTop: '10px', textAlign: 'center' }}>

                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <C3Chart data={data1} />
                    <label > <span>Biểu đồ đánh giá hoạt động CSKH</span></label>
                </div>
            </div>
        </div>
    );
}





export default (withTranslate(CrmDashBoard));