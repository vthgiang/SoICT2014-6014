import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TabEmployeeCapacity, TabIntegratedStatistics, TabTask } from './combinedContent';
import { TabHumanResource, TabSalary, TabAnualLeave } from '../../human-resource/employee-dashboard/components/combinedContent';

import { DatePicker, SelectMulti, LazyLoadComponent, forceCheckOrVisible, CustomLegendC3js } from '../../../common-components';
import { showListInSwal } from '../../../helpers/showListInSwal';

import { getEmployeeDashboardActions } from '../../human-resource/employee-dashboard/redux/actions';
import { EmployeeManagerActions } from '../../human-resource/profile/employee-management/redux/actions';
import { TimesheetsActions } from '../../human-resource/timesheets/redux/actions';
import { DisciplineActions } from '../../human-resource/commendation-discipline/redux/actions';
import { SalaryActions } from '../../human-resource/salary/redux/actions';
import { taskManagementActions } from '../../task/task-management/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';

import "./dashboardUnit.css";

class MainDashboardUnit extends Component {
    constructor(props) {
        super(props);
        this.INFO_SEARCH = {};
        this.state = {
            month: this.formatDate(Date.now(), true),
            monthSearch: this.formatDate(Date.now(), false, true),
            monthShow: this.formatDate(Date.now(), true),
            organizationalUnits: [this.props.childOrganizationalUnit[0].id],
            arrayUnitShow: [this.props.childOrganizationalUnit[0].id],

            startDate: this.formatDate((new Date()).setMonth(new Date().getMonth() - 6), true),
            startDateIncreaseAndDecreaseChart: this.formatDate((new Date()).setMonth(new Date().getMonth() - 3), true),
            endDate: this.formatDate(Date.now(), true),

            // Biểu đồ khẩn cấp / cần làm
            currentDate: this.formatDate(Date.now(), false),
            listUnit: [],
        }
        this.searchData = React.createRef()
        this.searchData.current = {
            month: this.formatDate(Date.now(), true),
            monthShow: this.formatDate(Date.now(), true),
            organizationalUnits: this.props.childOrganizationalUnit.map(x => x.id),
            arrayUnitShow: this.props.childOrganizationalUnit.map(x => x.id),
            startDate: this.formatDate((new Date()).setMonth(new Date().getMonth() - 6), true),
            startDateIncreaseAndDecreaseChart: this.formatDate((new Date()).setMonth(new Date().getMonth() - 3), true),
            startDateTrendOfOvertimeChart: this.formatDate((new Date()).setMonth(new Date().getMonth() - 6), true),
            startDateAnnualLeaveTrendsChart: this.formatDate((new Date()).setMonth(new Date().getMonth() - 6), true),
            endDateIncreaseAndDecreaseChart: this.formatDate(Date.now(), true),
            endDateTrendOfOvertimeChart: this.formatDate(Date.now(), true),
            endDateAnnualLeaveTrendsChart: this.formatDate(Date.now(), true)
        }
    };

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false, yearMonth = false) {
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
            } else if (yearMonth) {
                return [year, month].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    };
    formatNewDate = (date) => {
        let partDate = date.split('-');
        return [partDate[1], partDate[0]].join('-')
    }

    /**
     * Function bắt sự kiện thay đổi đơn vị
     * @param {*} value : Array id đơn vị
     */
    handleSelectOrganizationalUnit = (value) => {
        this.setState({
            arrayUnitShow: value,
        });

        this.INFO_SEARCH = {
            organizationalUnits: value
        }
        this.handleChangeSearchData('organizationalUnits', value)
    }

    /**
     * Function bắt sự kiện thay đổi tháng
     * @param {*} value : Giá trị tháng
     */
    handleSelectMonth = (value) => {
        this.setState({
            month: value
        })
        this.handleChangeSearchData('month', value)
    };

    /** Bắt sự kiện phân tích dữ liệu */
    handleUpdateData = () => {

        let { month, arrayUnitShow } = this.state;
        let { childOrganizationalUnit } = this.props;
        const { department } = this.props;
        const { organizationalUnits } = this.INFO_SEARCH;


        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');



        if (organizationalUnits.length > 0) {
            this.setState({

                organizationalUnits: organizationalUnits,
                monthShow: month,
                arrayUnitShow: organizationalUnits

            });

            let arrayUnit = arrayUnitShow;
            if (arrayUnitShow.length === department.list.length) {
                // arrayUnitShow = department.list.map(x => x._id);
                arrayUnit = undefined;
            } else if (arrayUnitShow.length === 0) {
                // arrayUnitShow = childOrganizationalUnit.map(x => x.id);
                arrayUnit = childOrganizationalUnit.map(x => x.id);
            }
            this.props.getAllSalaryChart({name: "salary-date-data",monthTime: month})
            this.props.getEmployeeDashboardData({
                searchChart: {
                    employeeDashboardChart: { 
                        organizationalUnits: this.searchData.current.organizationalUnits,
                        month: this.formatNewDate(this.searchData.current.month), 
                        startDateIncreaseAndDecreaseChart: this.formatNewDate(this.searchData.current.startDateIncreaseAndDecreaseChart),
                        endDateIncreaseAndDecreaseChart: this.formatNewDate(this.searchData.current.endDateIncreaseAndDecreaseChart),
                        startDateAnnualLeaveTrendsChart: this.formatNewDate(this.searchData.current.startDateAnnualLeaveTrendsChart),
                        endDateAnnualLeaveTrendsChart: this.formatNewDate(this.searchData.current.endDateAnnualLeaveTrendsChart),
                        startDateTrendOfOvertimeChart: this.formatNewDate(this.searchData.current.startDateTrendOfOvertimeChart),
                        endDateTrendOfOvertimeChart: this.formatNewDate(this.searchData.current.endDateTrendOfOvertimeChart)    
                    }
                }
            });
        }

    }

    /** Bắt sự kiện chuyển tab  */
    handleNavTabs = (value) => {
        if (value) {
            forceCheckOrVisible(true, false);
        }
        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }


    static getDerivedStateFromProps(props, state) {
        if (props.childOrganizationalUnit) {
            return {
                ...state,
                listUnit: props.childOrganizationalUnit,
            }
        } else {
            return null;
        }
    }

    componentDidMount() {
        const { month, organizationalUnits, arrayUnitShow, startDate, endDate, startDateIncreaseAndDecreaseChart } = this.state;

        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');

        this.INFO_SEARCH = {
            organizationalUnits
        }
        this.props.getAllSalaryChart()
        this.props.getEmployeeDashboardData({

            defaultParams: {
                organizationalUnits: this.searchData.current.organizationalUnits,
                month: this.formatNewDate(this.searchData.current.month), 
                startDateIncreaseAndDecreaseChart: this.formatNewDate(this.searchData.current.startDateIncreaseAndDecreaseChart),
                endDateIncreaseAndDecreaseChart: this.formatNewDate(this.searchData.current.endDateIncreaseAndDecreaseChart),
                startDateAnnualLeaveTrendsChart: this.formatNewDate(this.searchData.current.startDateAnnualLeaveTrendsChart),
                endDateAnnualLeaveTrendsChart: this.formatNewDate(this.searchData.current.endDateAnnualLeaveTrendsChart),
                startDateTrendOfOvertimeChart: this.formatNewDate(this.searchData.current.startDateTrendOfOvertimeChart),
                endDateTrendOfOvertimeChart: this.formatNewDate(this.searchData.current.endDateTrendOfOvertimeChart)
            }
        });
    }

    getUnitName = (arrayUnit, arrUnitId) => {
        let data = [];
        arrayUnit && arrayUnit.forEach(x => {
            arrUnitId && arrUnitId.length > 0 && arrUnitId.forEach(y => {
                if (x.value === y)
                    data.push(x.text)
            })
        })
        return data;
    }

    showUnitTask = (selectBoxUnit, idsUnit) => {
        const { translate } = this.props
        if (idsUnit && idsUnit.length > 0) {
            const listUnit = this.getUnitName(selectBoxUnit, idsUnit);
            showListInSwal(listUnit, translate('general.list_unit'))
        }
    }

    handleChangeSearchData = (name, value) => {
        this.searchData.current = {
            ...this.searchData.current,
            [name]: value
        }
    }

    render() {
        const { translate, department, employeesManager, user, discipline, salaryChart } = this.props;

        const { childOrganizationalUnit } = this.props;

        const { monthShow, month, organizationalUnits, arrayUnitShow, monthSearch } = this.state;

        let listAllEmployees = (!organizationalUnits || organizationalUnits.length === department.list.length) ?
            employeesManager.listAllEmployees : employeesManager.listEmployeesOfOrganizationalUnits;
        
        let listEmployee = user.employees;

        let searchData = this.searchData;


        console.log(searchData)
        const search_data_props = { searchData, handleChangeSearchData: this.handleChangeSearchData }
        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                            <SelectMulti id="multiSelectOrganizationalUnitInDashboardUnit"
                                items={childOrganizationalUnit.map(item => { return { value: item.id, text: item.name } })}
                                options={{
                                    nonSelectedText: translate('page.non_unit'),
                                    allSelectedText: translate('page.all_unit'),
                                }}
                                onChange={this.handleSelectOrganizationalUnit}
                                value={arrayUnitShow}
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

                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#task" data-toggle="tab" onClick={() => this.handleNavTabs()}>Công việc</a></li>
                            <li><a href="#employee-capacity" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Năng lực nhân viên</a></li>
                            <li><a href="#human-resourse" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Tổng quan nhân sự</a></li>
                            <li><a href="#annualLeave" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Nghỉ phép-Tăng ca</a></li>
                            <li><a href="#salary" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Lương thưởng nhân viên</a></li>
                            <li><a href="#integrated-statistics" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Thống kê tổng hợp</a></li>
                        </ul>
                        <div className="tab-content ">
                            <div className="tab-pane active" id="task">
                                <TabTask
                                    childOrganizationalUnit={childOrganizationalUnit?.length && childOrganizationalUnit.filter(item => organizationalUnits.includes(item?.id))}
                                    organizationalUnits={organizationalUnits}
                                    getUnitName={this.getUnitName}
                                    showUnitTask={this.showUnitTask}
                                    month={monthSearch}
                                />
                            </div>
                            {/* Tab năng lực nhân viên*/}
                            <div className="tab-pane" id="employee-capacity">
                                <LazyLoadComponent>
                                    <TabEmployeeCapacity
                                        organizationalUnits={organizationalUnits}
                                        month={monthShow}
                                        monthSearch={monthSearch}
                                        allOrganizationalUnits={organizationalUnits}
                                        childOrganizationalUnit={childOrganizationalUnit?.length && childOrganizationalUnit.filter(item => organizationalUnits.includes(item?.id))}
                                    />
                                </LazyLoadComponent>
                            </div>

                            {/* Tab tổng quan nhân sự*/}
                            <div className="tab-pane" id="human-resourse">
                                <LazyLoadComponent>
                                    <div className="row qlcv" style={{ marginTop: '10px' }}>
                                        <div className="col-md-3 col-sm-6 col-xs-6">
                                            <div className="info-box with-border">
                                                <span className="info-box-icon bg-aqua"><i className="fa fa-users"></i></span>
                                                <div className="info-box-content">
                                                    <span className="info-box-text">Số nhân viên</span>
                                                    <span className="info-box-number">
                                                        {listAllEmployees.length}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                            <div className="info-box with-border">
                                                <span className="info-box-icon bg-yellow"><i className="fa fa-tasks"></i></span>
                                                <div className="info-box-content">
                                                    <span className="info-box-text">Số sinh nhật</span>
                                                    <span className="info-box-number">
                                                        {employeesManager.listEmployees ? employeesManager.listEmployees.length : 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                            <div className="info-box with-border">
                                                <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>
                                                <div className="info-box-content">
                                                    <span className="info-box-text">Số khen thưởng</span>
                                                    <span className="info-box-number">
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
                                                    <span className="info-box-number">
                                                        {discipline.totalListDiscipline ? discipline.totalListDiscipline.length : 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <TabHumanResource
                                        childOrganizationalUnit={childOrganizationalUnit.filter(item => organizationalUnits.includes(item?.id))}
                                        defaultUnit={true}
                                        organizationalUnits={organizationalUnits}
                                        monthShow={monthShow}
                                        search_data_props={search_data_props}
                                    />
                                </LazyLoadComponent>
                            </div>

                            {/* Tab nghỉ phép tăng ca*/}
                            <div className="tab-pane" id="annualLeave">
                                <LazyLoadComponent>
                                    <TabAnualLeave
                                        idUnits={childOrganizationalUnit.length ? childOrganizationalUnit.filter(item => organizationalUnits.includes(item?.id)) : []}
                                        defaultUnit={true}
                                        monthShow={monthShow}
                                        childOrganizationalUnit={childOrganizationalUnit.filter(item => organizationalUnits.includes(item?.id))}
                                        search_data_props={search_data_props}
                                    />
                                </LazyLoadComponent>
                            </div>

                            {/* Tab lương thưởng*/}
                            <div className="tab-pane" id="salary">
                                <LazyLoadComponent>
                                    <TabSalary childOrganizationalUnit={childOrganizationalUnit.filter(item => organizationalUnits.includes(item?.id))}
                                        organizationalUnits={organizationalUnits}
                                        monthShow={monthShow}
                                        salaryChart={salaryChart}
                                        search_data_props={search_data_props}
                                    />
                                </LazyLoadComponent>
                            </div>

                            {/* Tab thống kê tổng hợp*/}
                            <div className="tab-pane" id="integrated-statistics">
                                <LazyLoadComponent>
                                    <TabIntegratedStatistics listAllEmployees={listAllEmployees} month={monthShow} listEmployee={listEmployee} organizationalUnits={organizationalUnits} />
                                </LazyLoadComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { department, employeesManager, tasks, user, discipline, employeeDashboardData } = state;
    const { salaryChart } = state.salary
    return { department, employeesManager, tasks, user, discipline, salaryChart, employeeDashboardData };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    getListPraise: DisciplineActions.getListPraise,
    getListDiscipline: DisciplineActions.getListDiscipline,
    searchSalary: SalaryActions.searchSalary,
    getTimesheets: TimesheetsActions.searchTimesheets,
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getAllSalaryChart: SalaryActions.getAllSalaryChart,
    getEmployeeDashboardData: getEmployeeDashboardActions.getEmployeeDashboardData,
};

const mainDashboardUnit = connect(mapState, actionCreators)(withTranslate(MainDashboardUnit));
export { mainDashboardUnit as MainDashboardUnit };