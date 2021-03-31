import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function EmployeeKpiOverviewModal(props) {
    const { translate, kpimembers } = props;
    const tableId = "employee-kpi-overview-modal";
    getTableConfiguration(tableId);

    let list;
    if (kpimembers?.currentKPI) {
        list = kpimembers.currentKPI?.kpis;
    }

    return (
        <React.Fragment>
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
                // setLimit={this.setLimit} 
            />
            <table id={tableId} className="table table-hover table-bordered  table-striped mb-0" >
                <thead>
                    <tr>
                        <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')} style={{ width: "50px" }} className="col-fixed">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')}</th>
                        <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_name')}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_name')}</th>
                        <th title={translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks')}>{translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks')}</th>
                        <th title={translate('kpi.evaluation.dashboard.auto_point')}>{translate('kpi.evaluation.dashboard.auto_point')}</th>
                        <th title={translate('kpi.evaluation.dashboard.employee_point')}>{translate('kpi.evaluation.dashboard.employee_point')}</th>
                        <th title={translate('kpi.evaluation.dashboard.approve_point')}>{translate('kpi.evaluation.dashboard.approve_point')}</th>
                        <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')}</th>
                    </tr>
                </thead>
                <tbody >
                    { list?.length > 0 
                        ? (list.map((kpi, index) =>
                            <tr key={kpi?._id}>
                                <td>{index + 1}</td>
                                <td>{kpi?.name}</td>
                                <td>{kpi?.amountTask}</td>
                                <td>{kpi?.automaticPoint}</td>
                                <td>{kpi?.employeePoint}</td>
                                <td>{kpi?.approvedPoint}</td>
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

function mapState (state) {
    const { kpimembers } = state;
    return { kpimembers }
}
const actions = {

}

const connectedEmployeeKpiOverviewModal = connect(mapState, actions)(withTranslate(EmployeeKpiOverviewModal))
export { connectedEmployeeKpiOverviewModal as EmployeeKpiOverviewModal }