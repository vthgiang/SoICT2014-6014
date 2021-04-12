import React, {Component, useState} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, DataTableSetting, PaginateBar, TreeTable } from '../../../../common-components';

function DetailOfParticipantDialogModal(props) {

    const [state, setState] = useState({

    })
    const { translate } = props;
    const { listParticipant } = props;

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-participant-detail"
                title={translate('kpi.organizational_unit.statistics.detail_participant')}
                hasNote={false}
                hasSaveButton={false}
            >
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                    <tr>
                        <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')} style={{ width: "40px" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}</th>
                        <th title={translate('kpi.organizational_unit.kpi_organizational_unit_manager.employee_name')}>{translate('kpi.organizational_unit.kpi_organizational_unit_manager.employee_name')}</th>
                        <th title={translate('intro.service_signup.form.email')} style={{ textAlign: "left" }}>{translate('intro.service_signup.form.email')}</th>
                    </tr>
                    </thead>

                    <tbody>
                    {
                        listParticipant && listParticipant.length !== 0 ?
                            listParticipant.map((item, index) =>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td title={item.name}>{item.name}</td>
                                    <td title={item.email}>{item.email}</td>
                                </tr>
                            )
                            : <tr>
                                <td colSpan="3">{translate('kpi.organizational_unit.kpi_organizational_unit_manager.no_data')}</td>
                            </tr>
                    }
                    </tbody>
                </table>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const { } = state;
    return { };
}

const actions = {

}

const connectDetailOfParticipantDialogModal = connect(mapState, actions)(withTranslate(DetailOfParticipantDialogModal));
export { connectDetailOfParticipantDialogModal as DetailOfParticipantDialogModal }
