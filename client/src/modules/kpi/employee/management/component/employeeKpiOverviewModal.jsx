import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import _deepClone from 'lodash/cloneDeep';

import { EmployeeKpiSetLogsModal } from './employeeKpiSetLogsModal'

import { DataTableSetting, SlimScroll, ToolTip } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function EmployeeKpiOverviewModal(props) {
    const { translate, kpimembers } = props;
    const [state, setState] = useState({
        employeeKpiSetId: null,
        type: "overview",
        tableKpiId: "table-kpi"
    })
    const { employeeKpiSetId, type, tableKpiId } = state
    const tableId = "employee-kpi-overview-modal";
    getTableConfiguration(tableId);

    useEffect(() => {
        SlimScroll.removeVerticalScrollStyleCSS(tableKpiId + type)
        SlimScroll.addVerticalScrollStyleCSS(tableKpiId + type, 500, true)
    })

    const showEmployeeKPISetLogs = (id) => {
        setState({
            ...state,
            employeeKpiSetId: id
        })

        window.$(`#modal-employee-kpi-set-log-${type}`).modal('show')
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = d.getHours(),
            minute = d.getMinutes(),
            second = d.getSeconds()

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [hour, minute, second].join(':') + " " + [day, month, year].join('-');
    }

    let list;
    if (kpimembers?.currentKPI) {
        list = _deepClone(kpimembers.currentKPI?.kpis);
        if (list?.length > 0) {
            list.sort((a, b) => (a.weight < b.weight) ? 1 : -1);
        }
    }

    return (
        <React.Fragment>
            <EmployeeKpiSetLogsModal
                employeeKpiSetId={employeeKpiSetId}
                type={type}
            />
            <div style={{ marginBottom: '10px' }}>
                <button className=" btn btn-primary pull-right" onClick={() => showEmployeeKPISetLogs(kpimembers?.currentKPI?._id)}>{translate('kpi.evaluation.employee_evaluation.show_logs')}</button>
                <div>
                    <label>{translate('kpi.evaluation.employee_evaluation.number_of_targets')}:</label>
                    <span> {list?.length ?? 0}</span>
                </div>
                <div>
                    <label>{translate('task.task_management.eval_of')}:</label>
                    <ToolTip 
                        type={'text_tooltip'}
                        dataTooltip={`${translate('kpi.evaluation.dashboard.auto_point')} - ${translate('kpi.evaluation.dashboard.employee_point')} - ${translate('kpi.evaluation.dashboard.approve_point')}`}
                    >
                        <span>
                            <span> {kpimembers?.currentKPI?.automaticPoint !== null && kpimembers?.currentKPI?.automaticPoint >= 0 ? kpimembers?.currentKPI?.automaticPoint : translate('kpi.evaluation.employee_evaluation.not_avaiable')}</span>
                            <span> - {kpimembers?.currentKPI?.employeePoint !== null && kpimembers?.currentKPI?.employeePoint >= 0 ? kpimembers?.currentKPI?.employeePoint : translate('kpi.evaluation.employee_evaluation.not_avaiable')}</span>
                            <span> - {kpimembers?.currentKPI?.approvedPoint !== null && kpimembers?.currentKPI?.approvedPoint >= 0 ? kpimembers?.currentKPI?.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_avaiable')}</span>
                        </span>
                    </ToolTip>
                </div>
                <div>
                    <label>{translate('kpi.evaluation.employee_evaluation.lastest_edit')}: </label>
                    <span> {kpimembers?.currentKPI?.logs?.[0]?.creator?.name} ({formatDate(kpimembers?.currentKPI?.logs?.[0]?.createdAt)})</span>
                </div>
            </div>

            <h4 style={{ display: "inline-block", fontWeight: "600", marginTop: "0px" }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_list')}</h4>
            <DataTableSetting
                className="pull-right"
                tableId={tableId}
                tableContainerId="tree-table-container"
                tableWidth="1300px"
                columnArr={[
                    translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_'),
                    translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_name'),
                    translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks'),
                    translate('kpi.evaluation.dashboard.auto_point'),
                    translate('kpi.evaluation.dashboard.employee_point'),
                    translate('kpi.evaluation.dashboard.approve_point'),
                    translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')
                ]}
                linePerPageOption={false}
            />
            <div id={tableKpiId + type}>
                <table id={tableId} className="table table-hover table-bordered  table-striped mb-0" >
                    <thead>
                        <tr>
                            <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')} style={{ width: "50px" }} className="col-fixed">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')}</th>
                            <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_name')}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_name')}</th>
                            <th title={translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks')}>{translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks')}</th>
                            <th title={translate('task.task_management.eval_of')}>{translate('task.task_management.eval_of')}</th>
                            <th title={`${translate('kpi.evaluation.employee_evaluation.weekly_point')} 1`}>{translate('kpi.evaluation.employee_evaluation.weekly_point')} 1</th>
                            <th title={`${translate('kpi.evaluation.employee_evaluation.weekly_point')} 2`}>{translate('kpi.evaluation.employee_evaluation.weekly_point')} 2</th>
                            <th title={`${translate('kpi.evaluation.employee_evaluation.weekly_point')} 3`}>{translate('kpi.evaluation.employee_evaluation.weekly_point')} 3</th>
                            <th title={`${translate('kpi.evaluation.employee_evaluation.weekly_point')} 4`}>{translate('kpi.evaluation.employee_evaluation.weekly_point')} 4</th>
                            <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')}</th>
                        </tr>
                    </thead>
                    <tbody >
                        {list?.length > 0
                            ? (list.map((kpi, index) =>
                                <tr key={kpi?._id}>
                                    <td>{index + 1}</td>
                                    <td>{kpi?.name}</td>
                                    <td>{kpi?.amountTask ?? 0}</td>
                                    <td>
                                        <ToolTip 
                                            type={'text_tooltip'}
                                            dataTooltip={`${translate('kpi.evaluation.dashboard.auto_point')} - ${translate('kpi.evaluation.dashboard.employee_point')} - ${translate('kpi.evaluation.dashboard.approve_point')}`}
                                        >
                                            <span>
                                                <span>{kpi?.automaticPoint !== null && kpi?.automaticPoint >= 0 ? kpi.automaticPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                <span>{kpi?.employeePoint !== null && kpi?.employeePoint >= 0 ? kpi.employeePoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                <span>{kpi?.approvedPoint !== null && kpi?.approvedPoint >= 0 ? kpi.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')}</span>
                                            </span>
                                        </ToolTip>
                                    </td>
                                    <td>
                                        { kpi?.weeklyEvaluations?.length > 0 
                                            && kpi?.weeklyEvaluations?.filter(eva => eva?.title === 'week1')?.map(
                                                item => <ToolTip
                                                        type={'text_tooltip'}
                                                        dataTooltip={`${translate('kpi.evaluation.dashboard.auto_point')} - ${translate('kpi.evaluation.dashboard.employee_point')} - ${translate('kpi.evaluation.dashboard.approve_point')}`}
                                                    >
                                                        <span>
                                                            <span>{item?.automaticPoint !== null && item?.automaticPoint >= 0 ? item.automaticPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                            <span>{item?.employeePoint !== null && item?.employeePoint >= 0 ? item.employeePoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                            <span>{item?.approvedPoint !== null && item?.approvedPoint >= 0 ? item.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')}</span>
                                                        </span>
                                                    </ToolTip>
                                            )
                                        }
                                    </td>
                                    <td>
                                        { kpi?.weeklyEvaluations?.length > 0 
                                            && kpi?.weeklyEvaluations?.filter(eva => eva?.title === 'week2')?.map(
                                                item => <ToolTip
                                                        type={'text_tooltip'}
                                                        dataTooltip={`${translate('kpi.evaluation.dashboard.auto_point')} - ${translate('kpi.evaluation.dashboard.employee_point')} - ${translate('kpi.evaluation.dashboard.approve_point')}`}
                                                    >
                                                        <span>
                                                            <span>{item?.automaticPoint !== null && item?.automaticPoint >= 0 ? item.automaticPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                            <span>{item?.employeePoint !== null && item?.employeePoint >= 0 ? item.employeePoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                            <span>{item?.approvedPoint !== null && item?.approvedPoint >= 0 ? item.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')}</span>
                                                        </span>
                                                    </ToolTip>
                                            )
                                        }
                                    </td>
                                    <td>
                                        { kpi?.weeklyEvaluations?.length > 0 
                                            && kpi?.weeklyEvaluations?.filter(eva => eva?.title === 'week3')?.map(
                                                item => <ToolTip
                                                        type={'text_tooltip'}
                                                        dataTooltip={`${translate('kpi.evaluation.dashboard.auto_point')} - ${translate('kpi.evaluation.dashboard.employee_point')} - ${translate('kpi.evaluation.dashboard.approve_point')}`}
                                                    >
                                                        <span>
                                                            <span>{item?.automaticPoint !== null && item?.automaticPoint >= 0 ? item.automaticPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                            <span>{item?.employeePoint !== null && item?.employeePoint >= 0 ? item.employeePoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                            <span>{item?.approvedPoint !== null && item?.approvedPoint >= 0 ? item.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')}</span>
                                                        </span>
                                                    </ToolTip>
                                            )
                                        }
                                    </td>
                                    <td>
                                        { kpi?.weeklyEvaluations?.length > 0 
                                            && kpi?.weeklyEvaluations?.filter(eva => eva?.title === 'week4')?.map(
                                                item => <ToolTip
                                                        type={'text_tooltip'}
                                                        dataTooltip={`${translate('kpi.evaluation.dashboard.auto_point')} - ${translate('kpi.evaluation.dashboard.employee_point')} - ${translate('kpi.evaluation.dashboard.approve_point')}`}
                                                    >
                                                        <span>
                                                            <span>{item?.automaticPoint !== null && item?.automaticPoint >= 0 ? item.automaticPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                            <span>{item?.employeePoint !== null && item?.employeePoint >= 0 ? item.employeePoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                            <span>{item?.approvedPoint !== null && item?.approvedPoint >= 0 ? item.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')}</span>
                                                        </span>
                                                    </ToolTip>
                                            )
                                        }
                                    </td>
                                    <td>{kpi?.weight}</td>
                                </tr>
                            ))
                            : <tr><td colSpan={7}>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { kpimembers } = state;
    return { kpimembers }
}
const actions = {

}

const connectedEmployeeKpiOverviewModal = connect(mapState, actions)(withTranslate(EmployeeKpiOverviewModal))
export { connectedEmployeeKpiOverviewModal as EmployeeKpiOverviewModal }