import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import { UserActions } from "../../../../super-admin/user/redux/actions";
import { kpiMemberActions } from '../../employee-evaluation/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../redux/actions';
import { createKpiSetActions } from '../../../employee/creation/redux/actions';

import { StatisticsOfEmployeeKpiSetChart } from './statisticsOfEmployeeKpiSetChart';
import { ResultsOfAllEmployeeKpiSetChart } from './resultsOfAllEmployeeKpiSetChart';

import { SelectBox, SelectMulti, ExportExcel, DatePicker } from '../../../../../common-components';


import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';

function EmployeeKpiEvaluationDashboard(props) {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();

    let d = new Date(),
        month = d.getMonth() + 1,
        year = d.getFullYear();
    let startMonth, endMonth, startYear;

    if (month > 3) {
        startMonth = month - 3;
        startYear = year;
    } else {
        startMonth = month - 3 + 12;
        startYear = year - 1;
    }
    if (startMonth < 10)
        startMonth = '0' + startMonth;
    if (month < 10) {
        endMonth = '0' + month;
    } else {
        endMonth = month;
    }

    const [state, setState] = useState({
        commenting: false,
        infosearch: {
            role: localStorage.getItem("currentRole"),
            userId: null,
            status: 4,
            startMonth: [startYear, startMonth].join('-'),
            endMonth: [year, endMonth].join('-')
        },

        userId: null,
        startMonth: [startYear, startMonth].join('-'),
        endMonth: [year, endMonth].join('-'),

        startMonthTitle: [startMonth, startYear].join('-'),
        endMonthTitle: [endMonth, year].join('-'),

        showApproveModal: "",
        showEvaluateModal: "",

        dateOfExcellentEmployees: formatDate(new Date(currentYear, currentMonth - 1, 1)),
        numberOfExcellentEmployees: 5,
        ids: null,
        editing: false,
        IDS: null,

        organizationalUnitIds: null
    });

    const {user, kpimembers, dashboardEvaluationEmployeeKpiSet} = props;
    const {translate} = props;

    const {
        unitMembers, dateOfExcellentEmployees, userId,
        numberOfExcellentEmployees, infosearch, ids, IDS, startMonthTitle, endMonthTitle,
        organizationalUnitIds, statisticsOfEmployeeKpiSetChartData, resultsOfAllEmployeeKpiSetChartData
    } = state;

    let employeeKpiSets, lastMonthEmployeeKpiSets, currentMonthEmployeeKpiSets, settingUpKpi, awaitingApprovalKpi,
        activatedKpi, totalKpi, numberOfEmployee;
    let queue = [], childrenOrganizationalUnit = [], userName;
    let kpimember;
    let listkpi, kpiApproved;
    let currentUnit, currentUnitLoading;

    // let currentDate = new Date();
    // let currentYear = currentDate.getFullYear();
    // let currentMonth = currentDate.getMonth();

    useEffect(() => {
        let infosearch = {
            role: localStorage.getItem("currentRole"),
            user: null,
            status: 5,
            startDate: state.startMonth,
            endDate: endMonth
        }

        props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        props.getEmployeeKPISets(infosearch);
        props.getAllEmployeeOfUnitByRole(localStorage.getItem("currentRole"));
        props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
    }, []);

    useEffect(() => {
        if (!ids && dashboardEvaluationEmployeeKpiSet && dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            let unit = [dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit?.id]
            setState({
                ...state,
                ids: unit,
                IDS: unit,
                infosearch: {
                    ...state.infosearch
                },
                organizationalUnitIds: unit
            });

            if (dashboardEvaluationEmployeeKpiSet && dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit && dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit.id) {
                props.getAllEmployeeOfUnitByIds({
                    organizationalUnitIds: unit
                });
                props.getAllEmployeeKpiSetOfUnitByIds(unit);
            }

            if (userId) {
                props.getAllEmployeeKpiSetByMonth(unit, userId, state.startMonth, state.endMonth)
            }
        }
    });

    useEffect(() => {
        let userdepartments;
        userdepartments = props.user.userdepartments;

        if (userdepartments) {
            if (!Array.isArray(userdepartments)) {
                userdepartments = [userdepartments]
            }

            let unitMembers, userId;
            unitMembers = getEmployeeSelectBoxItems(userdepartments);
            unitMembers = [...unitMembers];
            userId = unitMembers[0].value[2] ? unitMembers[0].value[2].value : (unitMembers[0].value[0] ? unitMembers[0].value[0].value : null)

            setState({
                ...state,
                infosearch: {
                    ...state.infosearch,
                    userId: userId
                },
                userId: userId,
                unitMembers: unitMembers
            });

            if (ids) {
                props.getAllEmployeeKpiSetByMonth(ids, userId, state.startMonth, state.endMonth)
            }
        }
    }, [props.user.userdepartments])

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    const handleShowApproveModal = async (id) => {
        await setState({
            ...state,
            showApproveModal: id
        })
        let element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        let modal = document.getElementById(`memberKPIApprove${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    };

    const showEvaluateModal = async (id) => {
        await setState({
            ...state,
            showEvaluateModal: id
        })
        let element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        let modal = document.getElementById(`memberEvaluate${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    };

    const handleChangeDate = async (value) => {
        await setState({
            ...state,
            dateOfExcellentEmployees: value
        })
    };

    const handleNumberOfEmployeesChange = (event) => {
        const value = event.target.value;
        setState({
            ...state,
            numberOfExcellentEmployees: value
        });
    };

    const handleSelectOrganizationalUnit = (value) => {
        setState({
            ...state,
            IDS: value
        })
    };

    const handleUpdateData = () => {
        if (IDS && IDS !== ids) {
            setState({
                ...state,
                infosearch: {
                    ...state.infosearch,
                    userId: null
                },
                organizationalUnitIds: null,
                ids: IDS
            });

            if (IDS.length > 0) {
                props.getAllEmployeeKpiSetOfUnitByIds(IDS);
                props.getAllEmployeeOfUnitByIds({organizationalUnitIds: IDS});
                props.getAllUserOfDepartment(IDS);
            }
        }
    };

    const handleSelectEmployee = (value) => {
        setState({
            ...state,
            userId: value[0]
        })
    };

    const handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        let startMonthTitle = value.slice(0, 2) + '-' + value.slice(3, 7);

        setState({
            ...state,
            startMonth: month,
            startMonthTitle: startMonthTitle
        })
    };

    const handleSelectMonthEnd = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        let endMonthTitle = value.slice(0, 2) + '-' + value.slice(3, 7);

        setState({
            ...state,
            endMonth: month,
            endMonthTitle: endMonthTitle
        })
    };

    const handleSearchData = async () => {
        let startMonthIso = new Date(state.startMonth);
        let endMonthIso = new Date(state.endMonth);

        if (startMonthIso.getTime() > endMonthIso.getTime()) {
            const {translate} = props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            setState({
                ...state,
                infosearch: {
                    ...state.infosearch,
                    userId: state.userId,
                    startMonth: state.startMonth,
                    endMonth: state.endMonth
                }
            })

            props.getAllEmployeeKpiSetByMonth(ids, state.userId, state.startMonth, state.endMonth)
        }
    };


    const handleStatisticsOfEmployeeKpiSetChartDataAvailable = (data) => {
        setState({
            ...state,
            statisticsOfEmployeeKpiSetChartData: data
        })
    };

    const handleResultsOfAllEmployeeKpiSetChartDataAvailable = (data) => {
        setState({
            ...state,
            resultsOfAllEmployeeKpiSetChartData: data
        })
    };


    if (dashboardEvaluationEmployeeKpiSet) {
        currentUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        currentUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading
    }

    if (unitMembers && infosearch) {
        for (let i=0; i < unitMembers.length; i++) {
            for (let j = 0; j < unitMembers[i].value.length; j++) {
                let arr = unitMembers[i].value;
                if (arr[j].value === infosearch.userId) {
                    userName = arr[j].text
                }
            }
        }
    }

    if (dashboardEvaluationEmployeeKpiSet) {
        employeeKpiSets = dashboardEvaluationEmployeeKpiSet.employeeKpiSets;
        lastMonthEmployeeKpiSets = employeeKpiSets && employeeKpiSets.filter(item => formatDate(item.date) == dateOfExcellentEmployees);
        lastMonthEmployeeKpiSets && lastMonthEmployeeKpiSets.sort((a, b) => b.approvedPoint - a.approvedPoint);
        lastMonthEmployeeKpiSets = lastMonthEmployeeKpiSets && lastMonthEmployeeKpiSets.slice(0, numberOfExcellentEmployees);
    }

    if (employeeKpiSets) {
        currentMonthEmployeeKpiSets = employeeKpiSets.filter(item => formatDate(item.date) == formatDate(new Date(currentYear, currentMonth, 1)));
        totalKpi = currentMonthEmployeeKpiSets.length;
        settingUpKpi = currentMonthEmployeeKpiSets.filter(item => item.status == 0);
        settingUpKpi = settingUpKpi.length;
        awaitingApprovalKpi = currentMonthEmployeeKpiSets.filter(item => item.status == 1);
        awaitingApprovalKpi = awaitingApprovalKpi.length;
        activatedKpi = currentMonthEmployeeKpiSets.filter(item => item.status == 2);
        activatedKpi = activatedKpi.length;
    }

    if (user) {
        // organizationalUnitsOfUser = user.organizationalUnitsOfUser;
        // organizationalUnitsOfUserLoading = user.organizationalUnitsOfUserLoading;

        let allEmployeesUnit = [], idOfEmployees = [];
        let set;

        allEmployeesUnit = user.employees;
        allEmployeesUnit && allEmployeesUnit.map(employee => {
            idOfEmployees.push(employee.userId.id)
        })

        set = new Set(idOfEmployees);
        allEmployeesUnit = Array.from(set);
        numberOfEmployee = allEmployeesUnit.length;
    }

    if (currentUnit) {
        childrenOrganizationalUnit.push(currentUnit);
        queue.push(currentUnit);
        while (queue.length > 0) {
            let v = queue.shift();
            if (v && v.children) {
                for (let i = 0; i < v.children.length; i++) {
                    let u = v.children[i];
                    queue.push(u);
                    childrenOrganizationalUnit.push(u);
                }
            }
        }
    }

    if (kpimembers.kpimembers) {
        kpimember = kpimembers.kpimembers;
    }
    if (kpimembers.kpimembers) {
        listkpi = kpimembers.kpimembers;
        kpiApproved = listkpi && listkpi.filter(item => item.status === 3);

        let automaticPoint = kpiApproved && kpiApproved.map(item => {
            return {label: formatDate(item.date), y: item.automaticPoint}
        }).reverse();

        let employeePoint = kpiApproved.map(item => {
            return {label: formatDate(item.date), y: item.employeePoint}
        }).reverse();

        let approvedPoint = kpiApproved.map(item => {
            return {label: formatDate(item.date), y: item.approvedPoint}
        }).reverse();
    }

    return (
        <React.Fragment>
            {currentUnit
                ? <React.Fragment>
                    <div className="qlcv" style={{textAlign: "right", marginBottom: 15}}>
                        <div className="form-inline">
                            <div className="form-group">
                                <label
                                    className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                                {ids &&
                                <SelectMulti
                                     id="multiSelectOrganizationalUnit"
                                    items={childrenOrganizationalUnit.map(item => {
                                        return {value: item.id, text: item.name}
                                    })}
                                    options={{
                                        nonSelectedText: translate('kpi.evaluation.dashboard.select_units'),
                                        allSelectedText: translate('kpi.evaluation.dashboard.all_unit'),
                                    }}
                                    onChange={handleSelectOrganizationalUnit}
                                    value={ids}
                                >
                                </SelectMulti>
                                }
                                <button type="button" className="btn btn-success"
                                        onClick={handleUpdateData}>{translate('kpi.evaluation.dashboard.analyze')}</button>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Số nhân viên */}
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-yellow"><i className="fa fa-users"/></span>
                                <div className="info-box-content">
                                    <span
                                        className="info-box-text">{translate('kpi.evaluation.dashboard.number_of_employee')}</span>
                                    <span className="info-box-number"
                                          style={{fontSize: '20px'}}>{numberOfEmployee ? numberOfEmployee : 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Đã kích hoạt */}
                        <div className="clearfix visible-sm-block"/>
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-red"><i className="fa fa-thumbs-o-up"/></span>
                                <div className="info-box-content">
                                    <span
                                        className="info-box-text">{`${translate('kpi.evaluation.dashboard.activated')}`}</span>
                                    <span className="info-box-number"
                                          style={{fontSize: '20px'}}>{`${activatedKpi ? activatedKpi : 0}`}</span>
                                </div>
                            </div>
                        </div>

                        {/* Chờ phê duyệt */}
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-green"><i className="fa fa-comments-o"/></span>
                                <div className="info-box-content">
                                    <span
                                        className="info-box-text">{`${translate('kpi.evaluation.dashboard.awaiting_approval')}`}</span>
                                    <span className="info-box-number"
                                          style={{fontSize: '20px'}}>{`${awaitingApprovalKpi ? awaitingApprovalKpi : 0}`}</span>
                                </div>
                            </div>
                        </div>

                        {/* Đng thiết lập */}
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-aqua"><i className="fa fa-cogs"/></span>
                                <div className="info-box-content">
                                    <span
                                        className="info-box-text">{`${translate('kpi.evaluation.dashboard.setting_up')}`}</span>
                                    <span className="info-box-number"
                                          style={{fontSize: '20px'}}>{`${settingUpKpi ? settingUpKpi : 0}`}</span>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box">
                                <div className="box-header with-border">
                                    <h3 className="box-title">{`${numberOfExcellentEmployees} ${translate('kpi.evaluation.dashboard.best_employee')}`}</h3>
                                    <div className="box-tools pull-right">
                                        <button type="button" data-toggle="collapse"
                                                data-target="#setting-excellent-employee" className="pull-right"
                                                style={{border: "none", background: "none", padding: "0px"}}>
                                            <i className="fa fa-gear" style={{fontSize: "19px"}}></i>
                                        </button>
                                        <div className="box box-primary box-solid collapse setting-table"
                                             id={"setting-excellent-employee"}>
                                            <div className="box-header with-border">
                                                <h3 className="box-title">{translate('kpi.evaluation.dashboard.option')}</h3>
                                                <div className="box-tools pull-right">
                                                    <button type="button" className="btn btn-box-tool"
                                                            data-toggle="collapse"
                                                            data-target="#setting-excellent-employee"><i
                                                        className="fa fa-times"></i></button>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="form-group">
                                                    <label
                                                        className="form-control-static">{translate('kpi.evaluation.dashboard.month')}</label>
                                                    <DatePicker
                                                        id="kpi_month"
                                                        dateFormat="month-year"
                                                        value={dateOfExcellentEmployees}
                                                        onChange={handleChangeDate}
                                                        disabled={false}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label
                                                        className="form-control-static">{translate('kpi.evaluation.dashboard.number_of_employee')}</label>
                                                    <input name="numberOfExcellentEmployees" className="form-control"
                                                           type="Number"
                                                           onChange={(event) => handleNumberOfEmployeesChange(event)}
                                                           defaultValue={numberOfExcellentEmployees}/>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="box-body no-parding">
                                    <ul className="users-list clearfix">
                                        {
                                            (typeof lastMonthEmployeeKpiSets !== 'undefined' && lastMonthEmployeeKpiSets.length !== 0) ?
                                                lastMonthEmployeeKpiSets.map((item, index) =>
                                                    <li key={index} style={{maxWidth: 200}}>
                                                        <img
                                                            src={(process.env.REACT_APP_SERVER + item.creator.avatar)}/>
                                                        <a className="users-list-name" href="#detailKpiMember2"
                                                           data-toggle="modal"
                                                           data-target="#memberKPIApprove2">{item.creator.name}</a>
                                                        <span className="users-list-date">{item.approvedPoint}</span>
                                                    </li>
                                                )
                                                :
                                                <li>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</li>
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Thống kê kết quả KPI của nhân viên */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box">
                                <div className="box-header with-border">
                                    <h3 className="box-title">{translate('kpi.evaluation.dashboard.statistics_chart_title')}</h3>
                                    { statisticsOfEmployeeKpiSetChartData &&
                                        <ExportExcel 
                                            type="link" 
                                            id="export-statistic-employee-kpi-set-chart"
                                            exportData={statisticsOfEmployeeKpiSetChartData}
                                        />
                                    }
                                </div>

                                <div className="box-body qlcv" id="statisticsOfEmployeeKpiSetChart">
                                    <div className="form-inline">
                                        <div className="col-sm-6 col-xs-12 form-group">
                                            <label>{translate('kpi.evaluation.employee_evaluation.from')}</label>
                                            <DatePicker
                                                id="monthStartInEmployeeKpiEvaluation"
                                                dateFormat="month-year"
                                                value={startMonthTitle}
                                                onChange={handleSelectMonthStart}
                                                disabled={false}
                                            />
                                        </div>
                                        <div className="col-sm-6 col-xs-12 form-group">
                                            <label>{translate('kpi.evaluation.employee_evaluation.to')}</label>
                                            <DatePicker
                                                id="monthEndInEmployeeKpiEvaluation"
                                                dateFormat="month-year"
                                                value={endMonthTitle}
                                                onChange={handleSelectMonthEnd}
                                                disabled={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-inline">
                                        {unitMembers &&
                                        <div className="col-sm-6 col-xs-12 form-group">
                                            <label>{translate('kpi.evaluation.employee_evaluation.employee')}</label>
                                            <SelectBox
                                                id={`createEmployeeKpiSet`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items={unitMembers}
                                                multiple={false}
                                                onChange={handleSelectEmployee}
                                                value={state.userId}
                                            />
                                        </div>
                                        }
                                        <div className="col-sm-6 col-xs-12 form-group">
                                            <label></label>
                                            <button type="button" className="btn btn-success"
                                                    onClick={handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-xs-12">
                                        <div className="qlcv">
                                            {unitMembers &&
                                                <StatisticsOfEmployeeKpiSetChart
                                                    userId={infosearch.userId}
                                                    startMonth={infosearch.startMonth}
                                                    endMonth={infosearch.endMonth}
                                                    info={infosearch}
                                                    unitId={currentUnit}
                                                    userName={userName}
                                                    organizationalUnitIds={ids}
                                                    onDataAvailable={handleStatisticsOfEmployeeKpiSetChartDataAvailable}
                                                />
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Kết quả Kpi tất cả nhân viên */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box">
                                <div className="box-header with-border">
                                    <h3 className="box-title">{translate('kpi.evaluation.dashboard.result_kpi_titile')}</h3>
                                    {resultsOfAllEmployeeKpiSetChartData &&
                                        <ExportExcel 
                                            type="link" id="export-all-employee-kpi-evaluate-result-dashboard"
                                            exportData={resultsOfAllEmployeeKpiSetChartData}
                                            style={{marginTop: 5}}
                                        />
                                    }
                                </div>

                                <div className="box-body qlcv">
                                    <ResultsOfAllEmployeeKpiSetChart
                                        organizationalUnitIds={organizationalUnitIds}
                                        onDataAvailable={handleResultsOfAllEmployeeKpiSetChartDataAvailable}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
                : currentUnitLoading
                && <div className="box">
                    <div className="box-body">
                        <h4>Bạn chưa có đơn vị</h4>
                    </div>
                </div>
            }
        </React.Fragment>
    );
}

function mapState(state) {
    const {user, kpimembers, dashboardEvaluationEmployeeKpiSet, department} = state;
    return {user, kpimembers, dashboardEvaluationEmployeeKpiSet, department};
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth,
    getEmployeeKPISets: kpiMemberActions.getEmployeeKPISets,
    getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
    getAllEmployeeKpiSetOfUnitByIds: DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnitByIds,
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
};

const connectedKPIMember = connect(mapState, actionCreators)(withTranslate(EmployeeKpiEvaluationDashboard));
export {connectedKPIMember as EmployeeKpiEvaluationDashboard};
