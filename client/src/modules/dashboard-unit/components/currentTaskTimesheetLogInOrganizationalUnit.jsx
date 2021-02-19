import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

import { SelectMulti } from '../../../common-components';

import { performTaskAction } from './../../task/task-perform/redux/actions';

function CurrentTaskTimesheetLogInOrganizationalUnit(props) {
    const { translate, performtasks } = props;
    const { listUnitSelect } = props;

    const [organizationalUnitId, setOrganizationalUnitId] = useState(null);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        if (!organizationalUnitId && listUnitSelect?.[0]?.value) {
            setOrganizationalUnitId([listUnitSelect?.[0]?.value]);
            props.getCurrentTaskTimesheetLogOfEmployeeInOrganizationalUnit({ organizationalUnitId: [listUnitSelect?.[0]?.value] });
        }

        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => {
            clearInterval(timer);
        }
    })

    const handleSelectOrganizationalUnitForTimesheetLog = (value) => {
        setOrganizationalUnitId(value)
    }

    const handleUpdateData = () => {
        props.getCurrentTaskTimesheetLogOfEmployeeInOrganizationalUnit({ organizationalUnitId: organizationalUnitId });
    }

    const showTiming = (startedAt, currentTime) => {
        if (!startedAt || !currentTime) return 0;
        let timer1 = new Date(startedAt);
        let timer2 = new Date(currentTime);
        let diff = timer2.getTime() - timer1.getTime();

        if (diff <= 0) {
            return '__:__:__'
        } else {
            return moment.utc(diff).format('HH:mm:ss')
        }
    }

    let currentTaskTimesheetLog;
    if (performtasks) {
        currentTaskTimesheetLog = performtasks.currentTaskTimesheetLogInUnit;
    }

    return (
        <React.Fragment>
            {/* Seach theo thời gian */}
            <div className="qlcv">
                <div className="form-inline" >
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                        <SelectMulti id="multiSelectOrganizationalUnitTimesheet"
                            items={listUnitSelect}
                            options={{
                                nonSelectedText: translate('page.non_unit'),
                                allSelectedText: translate('page.all_unit'),
                            }}
                            onChange={(value) => handleSelectOrganizationalUnitForTimesheetLog(value)}
                            value={organizationalUnitId}
                        >
                        </SelectMulti>
                    </div>
                    <button type="button" className="btn btn-success" onClick={() => handleUpdateData()}>{translate('general.search')}</button>
                </div>

                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')} style={{ width: "45px" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}</th>
                            <th title={translate('kpi.organizational_unit.kpi_organizational_unit_manager.employee_name')}>{translate('kpi.organizational_unit.kpi_organizational_unit_manager.employee_name')}</th>
                            <th title={translate('intro.service_signup.form.email')}>{translate('intro.service_signup.form.email')}</th>
                            <th title={translate('task.task_management.detail_link')}>{translate('task.task_management.detail_link')}</th>
                            <th title={translate('task.task_management.col_timesheet_log')}>{translate('task.task_management.col_timesheet_log')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        { currentTaskTimesheetLog && currentTaskTimesheetLog.length !== 0 && 
                            currentTaskTimesheetLog.map((item, index) =>
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td title={item?.creator?.name}>{item?.creator?.name}</td>
                                    <td title={item?.creator?.email}>{item?.creator?.email}</td>
                                    <td title={item?.task?.name}><a href={`/task?taskId=${item?.task?._id}`} target="_blank">{item?.task?.name}</a></td>
                                    <td>{showTiming(item?.startedAt, time)}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

        </React.Fragment>
    )
}

function mapState(state) {
    const { translate, performtasks } = state;
    return { translate, performtasks }
}
const actions = {
    getCurrentTaskTimesheetLogOfEmployeeInOrganizationalUnit: performTaskAction.getCurrentTaskTimesheetLogOfEmployeeInOrganizationalUnit
}

const connectedCurrentTaskTimesheetLogInOrganizationalUnit = connect(mapState, actions)(withTranslate(CurrentTaskTimesheetLogInOrganizationalUnit))
export { connectedCurrentTaskTimesheetLogInOrganizationalUnit as CurrentTaskTimesheetLogInOrganizationalUnit }