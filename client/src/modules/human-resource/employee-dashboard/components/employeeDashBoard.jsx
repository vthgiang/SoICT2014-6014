import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, DatePicker } from '../../../../common-components';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { LineAndBarChart } from './lineAndBarChart';
import { ThreeBarChart } from './threeBarChart';
import { AgePyramidChart, BarAndLineChart, MultipleBarChart } from './combinedContent';
import './employeeDashBoard.css';

class DashBoardEmployees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barAndLineSalary: true,
            organizationalUnits: null,
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
        this.props.getDepartment();
    }

    // Bắt sự kiện thay đổi chế đọ xem biểu đồ
    handleChangeViewChart = () => {
        console.log('dădadad');
        // this.setState({
        //     ...this.state,
        //     [name]: value
        // })
    }

    // function bắt sự kiện thay đổi unit
    handleSelectOrganizationalUnit = (value) => {
        console.log(value);
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnits: value
        })
    };

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
        const { list } = this.props.department;
        const { translate } = this.props;
        const { organizationalUnits, month } = this.state;
        return (
            <div className="qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                        <SelectMulti id="multiSelectOrganizationalUnit"
                            items={list.map((p, i) => { return { value: p._id, text: p.name } })}
                            options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
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
                <div className="row" style={{ marginTop: 10 }}>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-users"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Số nhân viên</span>
                                <span className="info-box-number">2000</span>
                                <a href={`/hr-list-employee?organizationalUnits=${organizationalUnits}`} >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>

                            <div className="info-box-content" >
                                <span className="info-box-text">Số khen thưởng</span>
                                <span className="info-box-number">23</span>
                                <a href="/hr-list-employee?organizationalUnits=5ecc8a6dde9c0a42c8d44ebd" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-balance-scale"></i></span>

                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Số kỷ luật</span>
                                <span className="info-box-number">180</span>
                                <a href="/hr-list-employee" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-calendar-times-o"></i></span>

                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Số nghỉ phép</span>
                                <span className="info-box-number">20</span>
                                <a href="/hr-list-employee" >Xem thêm <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <div className="box">
                            <div className="box-header with-border">
                                <i className="fa fa-bar-chart-o" />
                                <h3 className="box-title">Tháp tuổi cán bộ công nhân viên trong công ty</h3>

                            </div>
                            <div className="box-body dashboard_box_body">
                                <div className="form-inline">
                                    <div style={{ textAlign: "center", padding: 2 }} className='form-group col-lg-1 col-md-1 col-md-sm-1 col-xs-1'>
                                        <img style={{ width: 40, marginTop: 80, height: 120 }} src="image/female_icon.png" />
                                        <div className='number_box'>55</div>
                                    </div>
                                    <div className='row form-group col-lg-10 col-md-10 col-md-sm-10 col-xs-10' style={{ padding: 0 }}>
                                        <p className="pull-left" style={{ marginBottom: 0 }}><b>Độ tuổi</b></p>
                                        <p className="pull-right" style={{ marginBottom: 0 }}><b>ĐV tính: Người</b></p>
                                        <AgePyramidChart />
                                    </div>
                                    <div style={{ textAlign: "center", padding: 2 }} className='form-group col-lg-1 col-md-1 col-md-sm-1 col-xs-1'>
                                        <img style={{ width: 40, marginTop: 80, height: 120 }} src="image/male_icon.png" />
                                        <div className='number_box'>66</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <div className="box">
                            <div className="box-header with-border">

                                <h3 className="box-title">Tỷ lệ % quỹ lương công ty/doanh thu 12 tháng gần đây</h3>
                            </div>
                            <div className="box-body dashboard_box_body">
                                <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: %</b></p>
                                <div className="box-tools pull-right">
                                    <div className="btn-group pull-rigth" id="" data-toggle="btn-toggle">
                                        <button type="button" className="btn btn-default btn-xs active" data-toggle="on">Bar and line</button>
                                        <button type="button" className="btn btn-default btn-xs" data-toggle="off">Two line</button>
                                    </div>
                                </div>
                                <BarAndLineChart nameData1='% Tổng lương' nameData2='% Mục tiêu' lineBar={true} />
                            </div>
                        </div>
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <div className="box">
                            <div className="box-header with-border">
                                <h3 className="box-title">Tỷ lệ % quỹ lương khối kinh doanh/doanh thu 12 tháng gần đây</h3>
                            </div>
                            <div className="box-body dashboard_box_body">
                                <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: %</b></p>
                                <div className="box-tools pull-right">
                                    <div className="btn-group pull-rigth" id="" data-toggle="btn-toggle">
                                        <button type="button" className="btn btn-default btn-xs active" data-toggle="on">Bar and line</button>
                                        <button type="button" className="btn btn-default btn-xs" data-toggle="off">Two line</button>
                                    </div>
                                </div>
                                <BarAndLineChart nameData1='% Kinh doanh' nameData2='% Mục tiêu' lineBar={true} />
                            </div>
                        </div>
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <div className="box">
                            <div className="box-header with-border">
                                <h3 className="box-title">Tỷ lệ % quỹ lương khối quản trị/doanh thu 12 tháng gần nhất</h3>
                            </div>
                            <div className="box-body dashboard_box_body">
                                <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: %</b></p>
                                <div className="box-tools pull-right">
                                    <div className="btn-group pull-rigth" id="" data-toggle="btn-toggle">
                                        <button type="button" className="btn btn-default btn-xs active" data-toggle="on">Bar and line</button>
                                        <button type="button" className="btn btn-default btn-xs" data-toggle="off">Two line</button>
                                    </div>
                                </div>
                                <BarAndLineChart nameData1='% Quản trị' nameData2='% Mục tiêu' lineBar={true} />
                            </div>
                        </div>
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <div className="box">
                            <div className="box-header with-border">
                                <h3 className="box-title">Tỷ lệ % quỹ lương khối sản xuất/doanh thu 12 tháng gần nhất</h3>
                            </div>
                            <div className="box-body dashboard_box_body">
                                <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: %</b></p>
                                <div className="box-tools pull-right">
                                    <div className="btn-group pull-rigth" id="" data-toggle="btn-toggle">
                                        <button type="button" className="btn btn-default btn-xs active" data-toggle="on">Bar and line</button>
                                        <button type="button" className="btn btn-default btn-xs" data-toggle="off">Two line</button>
                                    </div>
                                </div>
                                <BarAndLineChart nameData1='% Sản xuất' nameData2='% Mục tiêu' lineBar={true} />
                            </div>
                        </div>
                    </div>
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <div className="box">
                            <div className="box-header with-border">
                                <h3 className="box-title">Tỷ lệ % quỹ lương các khối chức năng/doanh thu 12 tháng gần nhất</h3>
                            </div>
                            <div className="box-body dashboard_box_body">
                                <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: %</b></p>
                                <div className="box-tools pull-right">
                                    <div className="btn-group pull-rigth" id="" data-toggle="btn-toggle">
                                        <button type="button" className="btn btn-default btn-xs active" data-toggle="on">Bar and line</button>
                                        <button type="button" className="btn btn-default btn-xs" data-toggle="off">Two line</button>
                                    </div>
                                </div>
                                <MultipleBarChart nameData1='% Kinh doanh' nameData2='% Sản xuất' nameData3='% Quản trị' lineBar={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};
function mapState(state) {
    const { employeesManager, department } = state;
    return { employeesManager, department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    // getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const DashBoard = connect(mapState, actionCreators)(withTranslate(DashBoardEmployees));
export { DashBoard as DashBoardEmployees };