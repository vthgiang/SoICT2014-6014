import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import _deepClone from 'lodash/cloneDeep';

import { EmployeeKpiSetLogsModal } from './employeeKpiSetLogsModal'

import { DataTableSetting } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function EmployeeKpiOverviewModal(props) {
    const { translate, kpimembers } = props;
    const [state, setState] = useState({
        employeeKpiSetId: null
    })
    const { employeeKpiSetId } = state
    const tableId = "employee-kpi-overview-modal";
    getTableConfiguration(tableId);

    const showEmployeeKPISetLogs = (id) => {
        setState({
            ...state,
            employeeKpiSetId: id
        })
        window.$('#modal-employee-kpi-set-log').modal('show')
    }


    let list;
    if (kpimembers?.currentKPI) {
        list = _deepClone(kpimembers.currentKPI?.kpis);
        list.sort((a, b) => (a.weight < b.weight) ? 1 : -1);
    }

    const thStyle = {
        position: "sticky",
        top: "-1.2em",
        background: "#fff",
        zIndex: 1,
    };

    return (
        <React.Fragment>
            <EmployeeKpiSetLogsModal
                employeeKpiSetId={employeeKpiSetId}
            />
            <button className=" btn btn-primary pull-right" onClick={() => showEmployeeKPISetLogs(kpimembers?.currentKPI?._id)}>{translate('kpi.evaluation.employee_evaluation.show_logs')}</button>
            <br/><br/>

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
            <table id={tableId} className="table table-hover table-bordered  table-striped mb-0" >
                <thead>
                    <tr>
                        <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')} style={{ width: "50px", ...thStyle }} className="col-fixed">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')}</th>
                        <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_name')} style={thStyle}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_name')}</th>
                        <th title={translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks')} style={thStyle}>{translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks')}</th>
                        <th title={translate('kpi.evaluation.dashboard.auto_point')} style={thStyle}>{translate('kpi.evaluation.dashboard.auto_point')}</th>
                        <th title={translate('kpi.evaluation.dashboard.employee_point')} style={thStyle}>{translate('kpi.evaluation.dashboard.employee_point')}</th>
                        <th title={translate('kpi.evaluation.dashboard.approve_point')} style={thStyle}>{translate('kpi.evaluation.dashboard.approve_point')}</th>
                        <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')} style={thStyle}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')}</th>
                    </tr>
                </thead>
                <tbody >
                    {list?.length > 0
                        ? (list.map((kpi, index) =>
                            <tr key={kpi?._id}>
                                <td>{index + 1}</td>
                                <td>{kpi?.name}</td>
                                <td>{kpi?.amountTask}</td>
                                <td>{kpi?.automaticPoint !== null && kpi?.automaticPoint >= 0 ? kpi.automaticPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')}</td>
                                <td>{kpi?.employeePoint !== null && kpi?.employeePoint >= 0 ? kpi.employeePoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')}</td>
                                <td>{kpi?.approvedPoint !== null && kpi?.approvedPoint >= 0 ? kpi.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')}</td>
                                <td>{kpi?.weight}</td>
                            </tr>
                        ))
                        : <tr><td colSpan={7}>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</td></tr>
                    }
                </tbody>
            </table>
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