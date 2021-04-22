import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
import dayjs from 'dayjs'

import { managerKpiActions } from '../../../employee/management/redux/actions'

import { DialogModal } from '../../../../../common-components/index';

function EmployeeKpiSetLogsModal (props) {
    const { translate, KPIPersonalManager, employeeKpiSetId, type } = props
    
    useEffect(() => {
        if (employeeKpiSetId) {
            props.getEmployeeKpiSetLogs(employeeKpiSetId)
        }
    }, [props.employeeKpiSetId])

    let employeeKpiSetLogs;
    if (KPIPersonalManager) {
        employeeKpiSetLogs = KPIPersonalManager?.employeeKpiSetLogs
    }

    return (
        <DialogModal
            modalID={`modal-employee-kpi-set-log-${type}`}
            title={`${translate('kpi.evaluation.employee_evaluation.show_logs')}`}
            hasSaveButton={false}
            size={75}
        >
            <table className="table table-bordered table-striped table-hover" style={{ marginBottom: '0px' }}>
                <thead>
                    <tr>
                        <th title="STT" className="col-fixed" style={{ width: 50 }}>STT</th>
                        <th title="Người chỉnh sửa">{`Người chỉnh sửa`}</th>
                        <th title="Mô tả">{`Mô tả`}</th>
                        <th title="Ngày chỉnh sửa">{`Ngày chỉnh sửa`}</th>
                    </tr>
                </thead>
                <tbody >
                {employeeKpiSetLogs?.length > 0 &&
                    employeeKpiSetLogs.map((item, index) =>
                        <tr key={item?._id}>
                            <td>{index + 1}</td>
                            <td>{item?.creator?.name ? item?.creator?.name : ""}</td>
                            <td>{item?.title ? parse(item?.title) : ""}</td>
                            <td>{item?.createdAt ? dayjs(item?.createdAt).format("HH:mm:ss DD/MM/YYYY") : ""}</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
            {
                KPIPersonalManager.loading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    employeeKpiSetLogs?.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
        </DialogModal>
    )
}

function mapState (state) {
    const { KPIPersonalManager } = state
    return { KPIPersonalManager }
}
const actions = {
    getEmployeeKpiSetLogs: managerKpiActions.getEmployeeKpiSetLogs
}

const connectedEmployeeKpiSetLogsModal = connect(mapState, actions)(withTranslate(EmployeeKpiSetLogsModal))
export { connectedEmployeeKpiSetLogsModal as EmployeeKpiSetLogsModal }