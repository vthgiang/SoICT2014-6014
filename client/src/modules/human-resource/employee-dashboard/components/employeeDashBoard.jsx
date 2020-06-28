import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AgePyramidChart, BarAndLineChart, MultipleBarChart, EmployeeDashBoardHeader, BarChart, TwoBarChart } from './combinedContent';
import './employeeDashBoard.css';

class DashBoardEmployees extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    DisRenderAgePyramidChart = () => {
        this.setState({
            agePyramidChartId: 'keyId',
        })
    }
    render() {
        const { agePyramidChartId } = this.state;
        return (
            <div className="qlcv">
                <EmployeeDashBoardHeader DisRenderAgePyramidChart={this.DisRenderAgePyramidChart} />
                <div className="row">
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <AgePyramidChart id={agePyramidChartId} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarChart nameData1='Số lượt nghỉ' nameChart={'Xu hướng nghỉ phép của nhân viên trong 12 tháng gần nhất'} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <TwoBarChart nameData1='Tuyển mới' nameData2='Nghỉ làm' nameChart={'Tình hình tăng giảm nhân sự trong 12 tháng gần nhất'} />
                    </div> 
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Tổng lương' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương công ty/doanh thu 12 tháng gần đây'} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Kinh doanh' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương khối kinh doanh/doanh thu 12 tháng gần đây'} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Quản trị' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương khối quản trị/doanh thu 12 tháng gần đây'} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Sản xuất' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương khối sản xuất/doanh thu 12 tháng gần đây'} />
                    </div>
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <MultipleBarChart nameData1='% Kinh doanh' nameData2='% Sản xuất' nameData3='% Quản trị' nameChart={'Tỷ lệ % quỹ lương các khối chức năng/doanh thu 12 tháng gần đây'} />
                    </div>
                </div>
            </div >
        );
    }
};

const DashBoard = connect(null, null)(withTranslate(DashBoardEmployees));
export { DashBoard as DashBoardEmployees };