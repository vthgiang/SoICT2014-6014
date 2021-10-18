import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, SelectMulti, LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components';

import { TabHumanResource, TabSalary, TabAnualLeave, TabIntegratedStatistics } from './combinedContent';

import { getEmployeeDashboardActions } from "../redux/actions"
import './employeeDashBoard.css';
import Swal from 'sweetalert2';

/**
 * Function format dữ liệu Date thành string
 * @param {*} date : Ngày muốn format
 * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
 */
const formatDate = (date, monthYear = false) => {
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


let INFO_SEARCH = {

}

const DashBoardEmployees = (props) => {
    const {
        translate,timesheets, employeeDashboardData,
        childOrganizationalUnit, 
        getEmployeeDashboardData
    } = props; 

    const [state, setState] = useState({
        month: formatDate(Date.now(), true),
        monthShow: formatDate(Date.now(), true),
        organizationalUnits: childOrganizationalUnit.map(x => x.id),
        arrayUnitShow: childOrganizationalUnit.map(x => x.id),
        startDate: formatDate((new Date()).setMonth(new Date().getMonth() - 6), true),
        startDateIncreaseAndDecreaseChart: formatDate((new Date()).setMonth(new Date().getMonth() - 3), true),
        endDate: formatDate(Date.now(), true)
    });
    const { monthShow, month, organizationalUnits, arrayUnitShow, startDate, endDate, startDateIncreaseAndDecreaseChart } = state;

    useEffect(() => {
        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');

        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        let arrIncreaseAndDecreaseChart = startDateIncreaseAndDecreaseChart.split('-');
        let startDateIncreaseAndDecreaseChartNew = [arrIncreaseAndDecreaseChart[1], arrIncreaseAndDecreaseChart[0]].join('-');

        INFO_SEARCH = {
            organizationalUnits,
        }

        getEmployeeDashboardData({
            defaultParams: {
                organizationalUnits: organizationalUnits,
                month: newMonth, 
                startDate: startDateNew,
                endDate: endDateNew,
                startDateIncreaseAndDecreaseChart: startDateIncreaseAndDecreaseChartNew
            }
        });
    }, []);
    
    /**
     * Function bắt sự kiện thay đổi đơn vị
     * @param {*} value : Array id đơn vị
     */
    const handleSelectOrganizationalUnit = (value) => {
        INFO_SEARCH = {
            organizationalUnits: value
        }
    }

    /**
     * Function bắt sự kiện thay đổi tháng
     * @param {*} value : Giá trị tháng
     */
    const handleSelectMonth = (value) => {
        setState(state => ({ ...state, month: value }));
    };

    /** Bắt sự kiện phân tích dữ liệu */
    const handleUpdateData = () => {
        const { organizationalUnits } = INFO_SEARCH;

        let { month } = state;
        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');

        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        let arrIncreaseAndDecreaseChart = startDateIncreaseAndDecreaseChart.split('-');
        let startDateIncreaseAndDecreaseChartNew = [arrIncreaseAndDecreaseChart[1], arrIncreaseAndDecreaseChart[0]].join('-');

        if (organizationalUnits?.length > 0 && (month !== formatDate(Date.now(), true))) {
            setState(state => ({
                ...state,
                organizationalUnits: organizationalUnits,
                monthShow: month,
                arrayUnitShow: organizationalUnits
            }));

            getEmployeeDashboardData({
                searchChart: {
                    employeeDashboardChart: { month: newMonth, organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew, startDateIncreaseAndDecreaseChart: startDateIncreaseAndDecreaseChartNew }
                } 
            });
        }
    }

    const showDetailAnnualLeave = () => {
        Swal.fire({
            icon: "question",
            html: `<h4><div >Số giờ nghỉ phép được tổng hợp theo phần chấm công nhân viên</div> </h4>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">`,
            width: "25%",
        })
    }

    /** Bắt sự kiện chuyển tab  */
    const handleNavTabs = (value) => {
        if (!value) {
            forceCheckOrVisible(true, false);
        }
        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }

    let listAllEmployees = employeeDashboardData.listEmployeesOfOrganizationalUnits;

    let totalHourAnnualLeave = 0;
    let listTimesheets = employeeDashboardData.dataOvertimeUnits?.listOvertimeOfUnitsByStartDateAndEndDate ? employeeDashboardData.dataOvertimeUnits.listOvertimeOfUnitsByStartDateAndEndDate : [];
    listTimesheets.forEach(x => {
        if (x.totalHoursOff && x.totalHoursOff !== 0) {
            totalHourAnnualLeave = totalHourAnnualLeave + x.totalHoursOff;
        }
    });
    // Tab lương thưởng
    const tabSalary = useMemo(() => <TabSalary childOrganizationalUnit={childOrganizationalUnit} organizationalUnits={organizationalUnits} monthShow={monthShow} />, [organizationalUnits, monthShow]);
    return (
        <React.Fragment>
            <div className="qlcv">
                <div className="form-inline" style={{ marginBottom: 10 }}>
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                        <SelectMulti id="multiSelectOrganizationalUnitInDashboardUnit"
                            items={childOrganizationalUnit.map(item => { return { value: item.id, text: item.name } })}
                            options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                            onChange={handleSelectOrganizationalUnit}
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
                            onChange={handleSelectMonth}
                            deleteValue={false}
                        />
                    </div>
                    <button type="button" className="btn btn-success" onClick={handleUpdateData}>{translate('kpi.evaluation.dashboard.analyze')}</button>
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
                                <span className="info-box-text">Số giờ nghỉ phép <a title={'Giải thích'} onClick={showDetailAnnualLeave}>
                                    <i className="fa fa-question-circle" style={{ cursor: 'pointer', }} />
                                </a></span>
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
                                    {employeeDashboardData.commendation?.totalList ? employeeDashboardData.commendation.totalList?.length : 0}
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
                                    {employeeDashboardData.discipline?.listDisciplines ? employeeDashboardData.discipline.listDisciplines?.length : 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#human-resourse" data-toggle="tab" onClick={() => handleNavTabs(true)}>Tổng quan nhân sự</a></li>
                        <li><a href="#annualLeave" data-toggle="tab" onClick={() => handleNavTabs()}>Nghỉ phép-Tăng ca</a></li>
                        <li><a href="#salary" data-toggle="tab" onClick={() => handleNavTabs(true)}>Lương thưởng nhân viên</a></li>
                        <li><a href="#integrated-statistics" data-toggle="tab">Thống kê tổng hợp</a></li>
                    </ul>
                    <div className="tab-content ">
                        {/* Tab tổng quan nhân sự*/}
                        <div className="tab-pane active" id="human-resourse">
                            <LazyLoadComponent>
                                <TabHumanResource 
                                    childOrganizationalUnit={childOrganizationalUnit} 
                                    defaultUnit={true} 
                                    organizationalUnits={organizationalUnits} 
                                    monthShow={monthShow} 
                                    date={{startDate, endDate, startDateIncreaseAndDecreaseChart, month}}/>
                            </LazyLoadComponent>
                        </div>

                        {/* Tab nghỉ phép tăng ca*/}
                        <div className="tab-pane" id="annualLeave">
                            <LazyLoadComponent>
                                <TabAnualLeave
                                    childOrganizationalUnit={childOrganizationalUnit}
                                    idUnits={props?.childOrganizationalUnit?.length && props.childOrganizationalUnit.filter(item => arrayUnitShow.includes(item?.id))}
                                    defaultUnit={true}
                                    date={{startDate, endDate, startDateIncreaseAndDecreaseChart, month}}/>
                            </LazyLoadComponent>
                        </div>

                        {/* Tab lương thưởng*/}
                        <div className="tab-pane" id="salary">
                            {/* <TabSalary childOrganizationalUnit={childOrganizationalUnit} organizationalUnits={organizationalUnits} monthShow={monthShow} /> */}
                            {tabSalary}
                        </div>

                        {/* Tab thống kê tổng hợp*/}
                        <div className="tab-pane" id="integrated-statistics">
                            <TabIntegratedStatistics listAllEmployees={listAllEmployees} month={monthShow} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>);
}

function mapState(state) {
    const {  employeeDashboardData } = state;
    return { employeeDashboardData };
}

const actionCreators = {
    getEmployeeDashboardData: getEmployeeDashboardActions.getEmployeeDashboardData,
};
const DashBoard = connect(mapState, actionCreators)(withTranslate(DashBoardEmployees));
export { DashBoard as DashBoardEmployees };