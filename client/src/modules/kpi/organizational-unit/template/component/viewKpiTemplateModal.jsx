import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';

import { kpiTemplateActions } from '../redux/actions';
import { ViewKpiTemplate } from './viewKpiTemplate';

const ModalViewKpiTemplate = (props) => {

    const { kpiTemplate } = props;

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID="modal-view-kpi-template" isLoading={false}
                formID="form-view-kpi-template"
                title={`Thông tin chi tiết ${kpiTemplate.name}`}
                hasSaveButton={false}
            >
                <ViewKpiTemplate
                    kpiTemplate={kpiTemplate}
                />
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { kpitemplates } = state;
    return { kpitemplates };
}

const actionCreators = {
    getKpiTemplate: kpiTemplateActions.getKpiTemplateById,
};

const connectedModalViewKpiTemplate = connect(mapState, actionCreators)(withTranslate(ModalViewKpiTemplate));
export { connectedModalViewKpiTemplate as ModalViewKpiTemplate };
