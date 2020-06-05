import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';
import { AnnualLeaveActions } from '../../annual-leave/redux/actions';
import { DisciplineActions } from '../../commendation-discipline/redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

import { SelectMulti, DatePicker } from '../../../../common-components';
import { AgePyramidChart, BarAndLineChart, MultipleBarChart } from './combinedContent';
import './employeeDashBoard.css';

class DashBoardEmployees extends Component {
    constructor(props) {
        super(props);
        let partMonth = this.formatDate(Date.now(), true).split('-');
        let month = [partMonth[1], partMonth[0]].join('-');
        this.state = {
            multipleBarChart: true,
            organizationalUnits: null,
            month: month
        }
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

    // Function tính tuổi nhân viện theo năm sinh nhập vào
    getYear = (date) => {
        let dateNow = new Date(Date.now()), birthDate = new Date(date);
        let age = dateNow.getFullYear() - birthDate.getFullYear();
        return age;
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getAllEmployee({ organizationalUnits: this.state.organizationalUnits, status: 'active' });
        this.props.searchAnnualLeaves({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
        this.props.getListPraise({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
        this.props.getListDiscipline({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
    }

    // Bắt sự kiện thay đổi chế đọ xem biểu đồ
    handleChangeViewChart = (name, value) => {
        this.setState({
            ...this.state,
            [name]: value
        })
    }

    // function bắt sự kiện thay đổi unit
    handleSelectOrganizationalUnit = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnits: value
        })
    };

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        let partMonth = value.split('-');
        value = [partMonth[1], partMonth[0]].join('-');
        this.setState({
            ...this.state,
            month: value
        });
    }

    // Bắt sự kiện tìm kiếm 
    handleSunmitSearch = async () => {
        if (this.state.month === "-") {
            await this.setState({
                ...this.state,
                month: ""
            })
        }
        this.props.getAllEmployee({ organizationalUnits: this.state.organizationalUnits, status: 'active' });
        this.props.searchAnnualLeaves({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
        this.props.getListPraise({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
        this.props.getListDiscipline({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
    }
    render() {
        const { employeesManager, department, discipline, annualLeave, translate } = this.props;
        const { organizationalUnits, month, multipleBarChart } = this.state;
        let maleEmployees = employeesManager.listAllEmployees.filter(x => x.gender === 'male');
        let femaleEmployees = employeesManager.listAllEmployees.filter(x => x.gender === 'female');

        // Start Định dạng dữ liệu cho biểu đồ tháp tuổi
        let age = 69, i = 0, data1AgePyramid = [], data2AgePyramid = [];
        while (age > 18) {
            let maleData = [], femaleData = [];
            if (age === 19) {
                femaleData = femaleEmployees.filter(x => this.getYear(x.birthdate) <= age && this.getYear(x.birthdate) > age - 2);
                maleData = maleEmployees.filter(x => this.getYear(x.birthdate) <= age && this.getYear(x.birthdate) > age - 2);
            } else {
                femaleData = femaleEmployees.filter(x => this.getYear(x.birthdate) <= age && this.getYear(x.birthdate) > age - 5);
                maleData = maleEmployees.filter(x => this.getYear(x.birthdate) <= age && this.getYear(x.birthdate) > age - 5);
            }
            data1AgePyramid[i] = 0 - femaleData.length;
            data2AgePyramid[i] = maleData.length;
            age = age - 5;
            i++;
        }
        data1AgePyramid.unshift('Nữ');
        data2AgePyramid.unshift('Nam');

        // End Định dạng dữ liệu cho biểu đồ tháp tuổi
        return (
            <div className="qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                        <SelectMulti id="multiSelectOrganizationalUnit"
                            items={department.list.map((p, i) => { return { value: p._id, text: p.name } })}
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
                                <span className="info-box-number">
                                    {employeesManager.totalEmployeeOfOrganizationalUnits === '' ? employeesManager.totalAllEmployee : employeesManager.totalEmployeeOfOrganizationalUnits}
                                </span>
                                <a href={`/hr-list-employee?organizationalUnits=${organizationalUnits}`} >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>

                            <div className="info-box-content" >
                                <span className="info-box-text">Số khen thưởng</span>
                                <span className="info-box-number">{discipline.totalListCommendation}</span>
                                <a href="/hr-list-employee?organizationalUnits=5ecc8a6dde9c0a42c8d44ebd" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-balance-scale"></i></span>

                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Số kỷ luật</span>
                                <span className="info-box-number">{discipline.totalListDiscipline}</span>
                                <a href="/hr-list-employee" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-calendar-times-o"></i></span>

                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Số nghỉ phép</span>
                                <span className="info-box-number">{annualLeave.totalList}</span>
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
                                        <div className='number_box'>{femaleEmployees.length}</div>
                                    </div>
                                    <div className='row form-group col-lg-10 col-md-10 col-md-sm-10 col-xs-10' style={{ padding: 0 }}>
                                        <p className="pull-left" style={{ marginBottom: 0 }}><b>Độ tuổi</b></p>
                                        <p className="pull-right" style={{ marginBottom: 0 }}><b>ĐV tính: Người</b></p>
                                        <AgePyramidChart id={employeesManager.totalAllEmployee} data1={data1AgePyramid} data2={data2AgePyramid} />
                                    </div>
                                    <div style={{ textAlign: "center", padding: 2 }} className='form-group col-lg-1 col-md-1 col-md-sm-1 col-xs-1'>
                                        <img style={{ width: 40, marginTop: 80, height: 120 }} src="image/male_icon.png" />
                                        <div className='number_box'>{maleEmployees.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
function mapState(state) {
    const { employeesManager, annualLeave, discipline, department } = state;
    return { employeesManager, annualLeave, discipline, department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    searchAnnualLeaves: AnnualLeaveActions.searchAnnualLeaves,
    getListPraise: DisciplineActions.getListPraise,
    getListDiscipline: DisciplineActions.getListDiscipline,
};

const DashBoard = connect(mapState, actionCreators)(withTranslate(DashBoardEmployees));
export { DashBoard as DashBoardEmployees };