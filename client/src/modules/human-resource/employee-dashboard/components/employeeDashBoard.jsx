import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import {
    AgePyramidChart, HumanResourceChartBySalary, BarAndLineChart, MultipleBarChart, HighestSalaryChart, SalaryOfOrganizationalUnitsChart,
    EmployeeDashBoardHeader, AnnualLeaveTrendsChart, HumanResourceIncreaseAndDecreaseChart, QualificationChart, TrendOfOvertime
} from './combinedContent';

import './employeeDashBoard.css';

class DashBoardEmployees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationalUnits: null,
            actionSearch: true,
            month: this.formatDate(Date.now(), true),
        }
    };

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    };

    /**
     * Bắt sự kiện thay đổi tháng
     * @param {*} value : Giá trị tháng chart nhân sự theo dải lương và chart top lương cao nhất
     */
    handleMonthChange = async (value) => {
        await this.setState({
            month: value
        })
    }

    /**
     * Bắt sự kiện thay đổi đơn vị
     * @param {*} value 
     */
    handleSelectOrganizationalUnit = async (value) => {
        await this.setState({
            organizationalUnits: value,
            actionSearch: this.state.actionSearch,
        })
    };

    render() {
        const { organizationalUnits, actionSearch, month } = this.state;

        return (
            <div className="qlcv">
                <EmployeeDashBoardHeader handleSelectOrganizationalUnit={this.handleSelectOrganizationalUnit} handleMonthChange={this.handleMonthChange} />
                <div className="row">
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <AgePyramidChart organizationalUnits={organizationalUnits} actionSearch={actionSearch} />
                    </div>

                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <HumanResourceChartBySalary organizationalUnits={organizationalUnits} monthShow={month} handleMonthChange={this.handleMonthChange} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <HighestSalaryChart organizationalUnits={organizationalUnits} monthShow={month} handleMonthChange={this.handleMonthChange} />
                    </div>

                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <SalaryOfOrganizationalUnitsChart organizationalUnits={organizationalUnits} monthShow={month} handleMonthChange={this.handleMonthChange} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <QualificationChart organizationalUnits={organizationalUnits} actionSearch={actionSearch} />
                    </div>

                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <HumanResourceIncreaseAndDecreaseChart nameData1='Tuyển mới' nameData2='Nghỉ làm' nameData3='Tổng nhân sự' nameChart={'Tình hình tăng giảm nhân sự'} />
                    </div>
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <AnnualLeaveTrendsChart nameData1='Số lượt nghỉ' nameChart={'Xu hướng nghỉ phép'} />
                    </div>
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <TrendOfOvertime nameData1='Số giờ tăng ca' nameChart={'Xu hướng tăng ca'} />
                    </div>





                    {/* <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Tổng lương' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương công ty/doanh thu 12 tháng gần nhất'} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Kinh doanh' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương khối kinh doanh/doanh thu 12 tháng gần nhất'} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Quản trị' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương khối quản trị/doanh thu 12 tháng gần nhất'} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Sản xuất' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương khối sản xuất/doanh thu 12 tháng gần nhất'} />
                    </div>
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <MultipleBarChart nameData1='% Kinh doanh' nameData2='% Sản xuất' nameData3='% Quản trị' nameChart={'Tỷ lệ % quỹ lương các khối chức năng/doanh thu 12 tháng gần nhất'} />
                    </div> */}
                </div>
            </div >
        );
    }
};
function mapState(state) {
    const { employeesManager } = state;
    return { employeesManager };
}

const DashBoard = connect(mapState, null)(withTranslate(DashBoardEmployees));
export { DashBoard as DashBoardEmployees };