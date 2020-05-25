import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, DatePicker } from '../../../../common-components';
import { LineAndBarChart } from './lineAndBarChart';
import { ThreeBarChart } from './threeBarChart';
import './employeeDashBoard.css';

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
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
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
    render() {
        const { translate } = this.props;
        return (
            <div className="qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                        <SelectMulti id="multiSelectOrganizationalUnit"
                            value={[]}
                            items={[]}
                            options={{ nonSelectedText: translate('kpi.evaluation.dashboard.select_all_units'), allSelectedText: translate('kpi.evaluation.dashboard.all_unit') }}
                            onChange={this.handleSelectOrganizationalUnit}
                        >
                        </SelectMulti>
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.month')}</label>
                        <DatePicker
                            id="month"
                            dateFormat="month-year"
                            value={this.formatDate(Date.now(), true)}
                            onChange={this.handleMonthChange}
                        />
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                    </div>
                </div>
                <div className="row" style={{marginTop:10}}>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-users"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Số nhân viên</span>
                                <span className="info-box-number">2000</span>
                                <a href="/hr-list-employee" >Xem thêm <i class="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>

                            <div className="info-box-content" >
                                <span className="info-box-text">Số khen thưởng</span>
                                <span className="info-box-number">23</span>
                                <a href="/hr-list-employee" >Xem thêm <i class="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-balance-scale"></i></span>

                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Số kỷ luật</span>
                                <span className="info-box-number">180</span>
                                <a href="/hr-list-employee" >Xem thêm <i class="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-calendar-times-o"></i></span>

                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Số nghỉ phép</span>
                                <span className="info-box-number">20</span>
                                <a href="/hr-list-employee" >Xem thêm <i class="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>



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
                </div>
            </div >
        );
    }
};
// function mapState(state) {
// };

// const actionCreators = {
// };

const DashBoard = connect(null, null)(withTranslate(DashBoardEmployees));
export { DashBoard as DashBoardEmployees };