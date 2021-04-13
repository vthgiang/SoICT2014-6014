import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AnnualLeaveApplicationForm } from './combinedContent';
import { DatePicker } from '../../../../common-components';

import { WorkPlanActions } from '../../work-plan/redux/actions';
import { AnnualLeaveActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

function AnnualLeave(props) {
    const [state, setState] = useState({
        year: new Date().getFullYear(),
    })

    useEffect(() => {
        const { year } = state;
        props.getDepartment();
        props.getListWorkPlan({ year: year });
        props.getNumberAnnaulLeave({ numberAnnulLeave: true, year: year });
    }, [])

    const { translate, workPlan, annualLeave, department } = props;
    const { year } = state;

    let workPlans = [], maximumNumberOfLeaveDays = 0;
    let listAnnualLeavesOfOneYear = annualLeave.listAnnualLeavesOfOneYear;
    if (workPlan.listWorkPlan && workPlan.listWorkPlan.length !== 0) {
        workPlans = workPlan.listWorkPlan;
    };
    if (workPlan.maximumNumberOfLeaveDays) {
        maximumNumberOfLeaveDays = workPlan.maximumNumberOfLeaveDays;
    }

    /**
    * Function format ngày hiện tại thành dạnh dd/mm/yyyy
    * @param {*} date : Ngày muốn format
    */
    const formatDate = (date) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('/');
        }
        return date;
    };

    /**
    * Function format dữ liệu Date thành string
    * @param {*} date : Ngày muốn format
    * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
    */
    const formatDate2 = (date, monthYear = false) => {
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
    }


    /**
    * Bắt sự kiện thay đổi số ngày được nghỉ phép trong năm
    * @param {*} value : Tổng số ngày được nghỉ phép
    */
    const handleYearChange = (value) => {
        setState({
            ...state,
            year: value
        })
    };

    // Bắt sự kiện tìm kiếm
    const handleSunmitSearch = () => {
        const { year } = state;
        props.getNumberAnnaulLeave({ numberAnnulLeave: true, year: year });
    }

    return (
        <div className="box" >
            <div className=" row box-body qlcv">
                <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12 pull-right">
                    <AnnualLeaveApplicationForm />
                </div>
                <div className="col-lg-8 col-md-6 col-sm-6 col-xs-12">
                    <div className="form-inline">
                        {/* Năm */}
                        <div className="form-group">
                            <label style={{ width: 'auto' }}>{translate('human_resource.work_plan.year')}</label>
                            <DatePicker
                                id="year"
                                dateFormat="year"
                                value={year}
                                onChange={handleYearChange}
                            />
                        </div>
                        {/* Nút tìm kiếm */}
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>
                    </div>
                </div>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                    <div className="description-box" style={{ paddingRight: 10 }}>
                        <h4>{translate('human_resource.annual_leave_personal.inform_annual_leave')}</h4>
                        <div>
                            <strong>
                                {translate('human_resource.annual_leave_personal.total_number_leave_of_year')}:
                                </strong>
                                &nbsp;&nbsp;
                                <span>{`${maximumNumberOfLeaveDays} ${translate('human_resource.annual_leave_personal.day')}`}</span>
                        </div>
                        <div>
                            <strong>
                                {translate('human_resource.annual_leave_personal.leaved')}:
                                </strong>
                                &nbsp;&nbsp;
                                <span>{`${annualLeave.numberAnnulLeave} ${translate('human_resource.annual_leave_personal.day')}`}</span>
                        </div>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.annual_leave.table.start_date')}</th>
                                    <th>{translate('human_resource.annual_leave.table.end_date')}</th>
                                    <th>{translate('human_resource.annual_leave.totalHours')}</th>
                                    <th>{translate('human_resource.unit')}</th>
                                    <th>{translate('human_resource.annual_leave.table.reason')}</th>
                                    <th>{translate('human_resource.status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listAnnualLeavesOfOneYear && listAnnualLeavesOfOneYear.length !== 0 &&
                                    listAnnualLeavesOfOneYear.map((x, index) => {
                                        let organizationalUnit = department.list.find(y => y._id === x.organizationalUnit);
                                        let totalHours = x.totalHours ? x.totalHours : (Math.round((new Date(x.endDate).getTime() - new Date(x.startDate).getTime()) / (24 * 60 * 60 * 1000)) + 1) * 8
                                        return (
                                            <tr key={index}>
                                                <td><p>{formatDate2(x.startDate)}</p>{x.startTime ? x.startTime : null}</td>
                                                <td><p>{formatDate2(x.endDate)}</p>{x.endTime ? x.endTime : null}</td>
                                                <td>{totalHours}</td>
                                                <td>{organizationalUnit ? organizationalUnit.name : null}</td>
                                                <td>{x.reason}</td>
                                                <td>{translate(`human_resource.annual_leave.status.${x.status}`)}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            annualLeave.isLoading ?
                                <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                (!listAnnualLeavesOfOneYear || listAnnualLeavesOfOneYear.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </div>
                    <div className="description-box" style={{ paddingRight: 10, marginTop: 25 }}>
                        <h4>{translate('human_resource.annual_leave_personal.list_annual_leave')}</h4>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th className="not-sort" style={{ width: 50 }}>{translate('human_resource.stt')}</th>
                                    <th>{translate('human_resource.work_plan.table.timeline')}</th>
                                    <th>{translate('human_resource.work_plan.table.describe_timeline')}</th>
                                    <th>{translate('human_resource.work_plan.table.type')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workPlans && workPlans.length !== 0 &&
                                    workPlans.map((x, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{(formatDate(x.startDate) === formatDate(x.endDate)) ? formatDate(x.startDate) : formatDate(x.startDate) + " - " + formatDate(x.endDate)}</td>
                                            <td>{x.description}</td>
                                            <td>{translate(`human_resource.work_plan.${x.type}`)}</td>
                                        </tr>)
                                    )}
                            </tbody>
                        </table>
                        {
                            workPlan.isLoading ?
                                <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                (!workPlans || workPlans.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </div>
                </div>
            </div >
        </div>
    );
};

function mapState(state) {
    const { workPlan, annualLeave, department } = state;
    return { workPlan, annualLeave, department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListWorkPlan: WorkPlanActions.getListWorkPlan,
    getNumberAnnaulLeave: AnnualLeaveActions.searchAnnualLeaves,
};

const annualLeave = connect(mapState, actionCreators)(withTranslate(AnnualLeave));
export { annualLeave as AnnualLeave };