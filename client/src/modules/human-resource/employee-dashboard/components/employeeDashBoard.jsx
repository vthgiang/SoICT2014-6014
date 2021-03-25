import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, SelectMulti, LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components';

import { TabHumanResource, TabSalary, TabAnualLeave, TabIntegratedStatistics } from './combinedContent';

import { TimesheetsActions } from '../../timesheets/redux/actions';
import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';
import { AnnualLeaveActions } from '../../annual-leave/redux/actions';
import { DisciplineActions } from '../../commendation-discipline/redux/actions';
import { SalaryActions } from '../../salary/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import './employeeDashBoard.css';

class DashBoardEmployees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            month: this.formatDate(Date.now(), true),
            monthShow: this.formatDate(Date.now(), true),
            organizationalUnits: null,
            arrayUnitShow: null,
        }
    };

    static getDerivedStateFromProps(props, state) {
        if (!state.arrayUnitShow && props && props.childOrganizationalUnit) {
            return {
                ...state,
                arrayUnitShow: props.childOrganizationalUnit.map(x => x.id)
            }
        } else {
            return null;
        }

    }

    componentDidMount() {
        const { organizationalUnits, month } = this.state;
        const { childOrganizationalUnit } = this.props
        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');

        this.props.getAllEmployeeOfUnitByIds({
            organizationalUnitIds: organizationalUnits && organizationalUnits.length !== 0 ? organizationalUnits : childOrganizationalUnit.map(x => x.id)
        });
        /* Lấy danh sách nhân viên  */
        this.props.getAllEmployee({ organizationalUnits: organizationalUnits, status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'] });

        /* Lấy thông tin nghi phép */
        this.props.searchAnnualLeaves({ organizationalUnits: organizationalUnits, month: newMonth });

        /* Lấy dánh sách khen thưởng, kỷ luật */
        this.props.getListPraise({ organizationalUnits: organizationalUnits, month: newMonth });
        this.props.getListDiscipline({ organizationalUnits: organizationalUnits, month: newMonth });

        /* Lấy dữ liệu lương nhân viên*/
        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: organizationalUnits, month: newMonth });
        this.props.searchSalary({ callApiDashboard: true, month: newMonth });

        /* Lấy dữ liệu nghỉ phép, tăng ca của nhân viên */
        this.props.getTimesheets({
            organizationalUnits: organizationalUnits, month: newMonth, page: 0,
            limit: 100000,
        });
    }

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
     * Function bắt sự kiện thay đổi đơn vị
     * @param {*} value : Array id đơn vị
     */
    handleSelectOrganizationalUnit = (value) => {
        this.setState({
            arrayUnitShow: value,
        });

    }

    /**
     * Function bắt sự kiện thay đổi tháng
     * @param {*} value : Giá trị tháng
     */
    handleSelectMonth = (value) => {
        this.setState({
            month: value
        })
    };

    /** Bắt sự kiện phân tích dữ liệu */
    handleUpdateData = () => {
        const { childOrganizationalUnit } = this.props;
        let { month, arrayUnitShow } = this.state;
        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');

        this.setState({
            organizationalUnits: arrayUnitShow,
            monthShow: month
        });

        if (arrayUnitShow && arrayUnitShow.length === childOrganizationalUnit.length) {
            arrayUnitShow = null;
        };

        this.props.getAllEmployeeOfUnitByIds({
            organizationalUnitIds: arrayUnitShow && arrayUnitShow.length !== 0 ? arrayUnitShow : childOrganizationalUnit.map(x => x.id)
        });
        /* Lấy danh sách nhân viên  */
        this.props.getAllEmployee({ organizationalUnits: arrayUnitShow, status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'] });

        /* Lấy thông tin nghi phép */
        this.props.searchAnnualLeaves({ organizationalUnits: arrayUnitShow, month: newMonth });

        /* Lấy dánh sách khen thưởng, kỷ luật */
        this.props.getListPraise({ organizationalUnits: arrayUnitShow, month: newMonth });
        this.props.getListDiscipline({ organizationalUnits: arrayUnitShow, month: newMonth });

        /* Lấy dữ liệu lương nhân viên*/
        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: arrayUnitShow, month: newMonth });
        this.props.searchSalary({ callApiDashboard: true, month: newMonth });

        /* Lấy dữ liệu nghỉ phép, tăng ca của nhân viên */
        this.props.getTimesheets({
            organizationalUnits: arrayUnitShow, month: newMonth, page: 0,
            limit: 100000,
        });

    }

    /** Bắt sự kiện chuyển tab  */
    handleNavTabs = (value) => {
        if (!value) {
            forceCheckOrVisible(true, false);
        }
        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }

    render() {
        const { translate, employeesManager, annualLeave, discipline, timesheets } = this.props;

        const { childOrganizationalUnit } = this.props;

        const { monthShow, month, organizationalUnits, arrayUnitShow } = this.state;

        let listAllEmployees = (!organizationalUnits || organizationalUnits.length === 0 || organizationalUnits.length === childOrganizationalUnit.length) ?
            employeesManager.listAllEmployees : employeesManager.listEmployeesOfOrganizationalUnits;

        let totalHourAnnualLeave = 0;
        let listTimesheets = timesheets.listTimesheets;
        listTimesheets.forEach(x => {
            if (x.totalHoursOff && x.totalHoursOff !== 0) {
                totalHourAnnualLeave = totalHourAnnualLeave + x.totalHoursOff;
            }
        });
        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                            <SelectMulti id="multiSelectOrganizationalUnitInDashboardUnit"
                                items={childOrganizationalUnit.map(item => { return { value: item.id, text: item.name } })}
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                onChange={this.handleSelectOrganizationalUnit}
                                value={arrayUnitShow ? arrayUnitShow : []}
                            >
                            </SelectMulti>
                        </div>

                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                            <DatePicker
                                id="monthInDashboardUnit"
                                dateFormat="month-year"
                                value={month}
                                onChange={this.handleSelectMonth}
                                deleteValue={false}
                            />
                        </div>
                        <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('kpi.evaluation.dashboard.analyze')}</button>
                    </div>
                    <div className="row">
                        <div className="col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-aqua"><i className="fa fa-users"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số nhân viên</span>
                                    <span className="info-box-number" style={{ fontSize: '20px' }}>
                                        {listAllEmployees.length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-yellow"><i className="fa fa-clock-o" aria-hidden="true"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số giờ nghỉ phép</span>
                                    <span className="info-box-number" style={{ fontSize: '20px' }}>
                                        {totalHourAnnualLeave}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số khen thưởng</span>
                                    <span className="info-box-number" style={{ fontSize: '20px' }}>
                                        {discipline.totalListCommendation ? discipline.totalListCommendation.length : 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-red"><i className="fa fa-balance-scale"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số kỷ luật</span>
                                    <span className="info-box-number" style={{ fontSize: '20px' }}>
                                        {discipline.totalListDiscipline ? discipline.totalListDiscipline.length : 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#human-resourse" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Tổng quan nhân sự</a></li>
                            <li><a href="#annualLeave" data-toggle="tab" onClick={() => this.handleNavTabs()}>Nghỉ phép-Tăng ca</a></li>
                            <li><a href="#salary" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Thu nhập nhân viên</a></li>
                            <li><a href="#integrated-statistics" data-toggle="tab">Thống kê tổng hợp</a></li>
                        </ul>
                        <div className="tab-content ">
                            {/* Tab tổng quan nhân sự*/}
                            <div className="tab-pane active" id="human-resourse">
                                <TabHumanResource childOrganizationalUnit={childOrganizationalUnit} defaultUnit={false} organizationalUnits={organizationalUnits} monthShow={monthShow} />
                            </div>

                            {/* Tab nghỉ phép tăng ca*/}
                            <div className="tab-pane" id="annualLeave">
                                <LazyLoadComponent>
                                    <TabAnualLeave childOrganizationalUnit={childOrganizationalUnit} defaultUnit={false} />
                                </LazyLoadComponent>
                            </div>

                            {/* Tab lương thưởng*/}
                            <div className="tab-pane" id="salary">
                                <TabSalary childOrganizationalUnit={childOrganizationalUnit} organizationalUnits={organizationalUnits} monthShow={monthShow} />
                            </div>

                            {/* Tab thống kê tổng hợp*/}
                            <div className="tab-pane" id="integrated-statistics">
                                <TabIntegratedStatistics listAllEmployees={listAllEmployees} month={monthShow} />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { employeesManager, annualLeave, discipline, timesheets } = state;
    return { employeesManager, annualLeave, discipline, timesheets };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    searchAnnualLeaves: AnnualLeaveActions.searchAnnualLeaves,
    getListPraise: DisciplineActions.getListPraise,
    getListDiscipline: DisciplineActions.getListDiscipline,
    searchSalary: SalaryActions.searchSalary,
    getTimesheets: TimesheetsActions.searchTimesheets,
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
};
const DashBoard = connect(mapState, actionCreators)(withTranslate(DashBoardEmployees));
export { DashBoard as DashBoardEmployees };