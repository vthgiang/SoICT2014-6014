import React, {Component, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DetailOfTaskDialogModal } from './detailOfTaskDialogModal';
import { DetailOfEmployeeKpiDialogModal } from './detailOfEmployeeKpiDialogModal';
import { DetailOfParticipantDialogModal } from './detailOfParticipantDialogModal';

import { SlimScroll } from '../../../../common-components';


function DetailsOfOrganizationalUnitKpiForm(props) {

    const [state, setState] = useState({

    });

    const { translate } = props;
    const { details } = props;

    useEffect(()=>{
        if (props.details !== state.details) {
            setState ({
                ...state,
                details: props.details
            })
        }
    },[props.details])

    return (
        <div id="details-of-organizational-unit-kpi-form" className="description-box" style={{ height: "100%" }}>
            <h4 className="box-title">{translate('table.info')}</h4>

            <div className="row">
                <div className="col-xs-6">
                    <div className="form-group">
                        <strong>{translate('document.administration.domains.name')}:  </strong>
                        {details && details.name}
                    </div>

                    <div className="form-group">
                        <strong>{translate('task.task_management.col_organization')}:  </strong>
                        {details && details.organizationalUnit}
                    </div>

                    <div className="form-group">
                        <strong>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')}:  </strong>
                        {details && details.weight}
                    </div>
                </div>

                <div className="col-xs-6">
                    {/** Chi tiết số lượng kpi nhân viên */}
                    <div className="form-group">
                        <a title={translate('kpi.organizational_unit.statistics.detail_employee_kpi')} data-toggle="modal" data-target="#modal-employee-kpi-detail" data-backdrop="static" data-keyboard="false" style={{ cursor: "pointer" }}>
                            <strong>{translate('kpi.organizational_unit.dashboard.trend_chart.amount_employee_kpi')}:  </strong>
                            {details?.listEmployeeKpi?.length}
                        </a>
                        <DetailOfEmployeeKpiDialogModal listEmployeeKpi={details?.listEmployeeKpi}/>
                    </div>

                    {/** Chi tiết số lượng công việc */}
                    <div className="form-group">
                        <a title={translate('menu.task')} data-toggle="modal" data-target="#modal-task-detail" data-backdrop="static" data-keyboard="false" style={{ cursor: "pointer" }}>
                            <strong>{translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks')}:  </strong>
                            {details && details.listTask && details.listTask.length}
                        </a>
                        <DetailOfTaskDialogModal listTask={details && details.listTask}/>
                    </div>

                    {/** Chi tiết người tham gia */}
                    <div className="form-group">
                        <a title={translate('kpi.organizational_unit.statistics.detail_participant')} data-toggle="modal" data-target="#modal-participant-detail" data-backdrop="static" data-keyboard="false" style={{ cursor: "pointer" }}>
                            <strong>{translate('kpi.organizational_unit.dashboard.trend_chart.participants')}:  </strong>
                            {details && details.listParticipant && details.listParticipant.length}
                        </a>
                        <DetailOfParticipantDialogModal listParticipant={details && details.listParticipant}/>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <button className="btn btn-danger" onClick={() => {
                    window.$(`#details-of-organizational-unit-kpi-form`).slideUp()
                }}>{ translate('form.close') }</button>
            </div>

            <SlimScroll outerComponentId="details-of-organizational-unit-kpi-form" innerComponentWidth={"100%"} activate={true} />
        </div>
    )
}

function mapState(state) {
    const { } = state;
    return { };
}

const actions = {

}

const connectDetailsOfOrganizationalUnitKpiForm = connect(mapState, actions)(withTranslate(DetailsOfOrganizationalUnitKpiForm));
export { connectDetailsOfOrganizationalUnitKpiForm as DetailsOfOrganizationalUnitKpiForm }
