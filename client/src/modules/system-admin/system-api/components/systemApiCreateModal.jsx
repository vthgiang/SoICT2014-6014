import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, SelectBox } from '../../../../common-components';

import { SystemApiActions } from '../redux/actions'

function SystemApiCreateModal(props) {
    const { translate } = props;

    const [state, setState] = useState({
        path: null,
        method: 'GET',
        description: null,
    });

    const { path, method, description } = state;

    const handleChangePath = (e) => {
        setState({
            ...state,
            path: e.target.value
        })
    }

    const handleChangeMethod = (value) => {
        setState({
            ...state,
            method: value[0]
        })
    }

    const handleChangeDescription = (e) => {
        setState({
            ...state,
            description: e.target.value
        })
    }

    const handleSubmit = () => {
        props.createSystemApi({
            path: path, 
            method: method, 
            description: description, 
        })
        window.$("#create-system-api").modal("hide");
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="create-system-api" isLoading={false}
                formID="form-create-system-api"
                title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.initialize_kpi_set')}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_faile={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
            >
                {/* Form them API */}
                <form id="form-create-system-api" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>
                    {/* Path */}
                    <div className="form-group">
                        <label>{translate('system_admin.system_api.table.path')}</label>
                        <input className="form-control" type="text" placeholder={translate('system_admin.system_api.placeholder.input_path')} name="name" onChange={(e) => handleChangePath(e)} />
                    </div>

                    {/* Method */}
                    <div className="form-group">
                        <label>{translate('system_admin.system_api.table.method')}</label>
                        <SelectBox
                            id={`method-create-system-api`}
                            className="form-control select2"
                            style={{width: "100%"}}
                            items={[
                                {
                                    text: 'GET',
                                    value: 'GET'
                                },
                                {
                                    text: 'PUT',
                                    value: 'PUT'
                                },
                                {
                                    text: 'PATCH',
                                    value: 'PATCH'
                                },
                                {
                                    text: 'POST',
                                    value: 'POST'
                                },
                                {
                                    text: 'DELETE',
                                    value: 'DELETE'
                                }
                            ]}
                            onChange={handleChangeMethod}
                            multiple={false}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>{translate('system_admin.system_api.table.description')}</label>
                        <input className="form-control" type="text" name="name" placeholder={translate('system_admin.system_api.placeholder.input_description')} onChange={(e) => handleChangeDescription(e)} />
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
    createSystemApi: SystemApiActions.createSystemApi
};

const connectedSystemApiCreateModal = connect(mapState, actionCreators)(withTranslate(SystemApiCreateModal));
export { connectedSystemApiCreateModal as SystemApiCreateModal };
