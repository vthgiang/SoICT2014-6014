import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, SelectBox } from '../../../../../common-components';

function PrivilegeApiCreateModal(props) {
    const { translate } = props;

    const [state, setState] = useState({
        email: null,
    });

    const { email } = state;

    const handleChangeEmail = (e) => {
        setState({
            ...state,
            email: e.target.value
        })
    }

    const handleSubmit = () => {
      
        window.$("#privilege-system-api-modal").modal("hide");
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="privilege-system-api-modal" isLoading={false}
                formID="form-privilege-system-api"
                title={translate('system_admin.system_api.modal.create_title')}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_faile={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
            >
                {/* Form them phan quyen API */}
                <form id="form-privilege-system-api" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>
                    {/* Email */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('system_admin.privilege_system_api.table.email')}</label>
                        <input className="form-control" type="text" placeholder={translate('system_admin.privilege_system_api.placeholder.input_email')} name="name" onChange={(e) => handleChangeEmail(e)} />
                    </div>

                    
                </form>
            </DialogModal>
        </React.Fragment>
    );

}

function mapState(state) {
    const {  } = state;
    return {  };
}

const actionCreators = {
};

const connectedPrivilegeApiCreateModal = connect(mapState, actionCreators)(withTranslate(PrivilegeApiCreateModal));
export { connectedPrivilegeApiCreateModal as PrivilegeApiCreateModal };
