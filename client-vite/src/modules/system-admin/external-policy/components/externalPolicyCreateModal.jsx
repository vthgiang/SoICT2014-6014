import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, SelectBox } from '../../../../common-components';
import { ExternalPolicyActions } from '../redux/actions';
import { formatDate } from '../../../../helpers/assetHelper';
import { SystemApiActions } from '../../system-api/system-api-management/redux/actions';

function ExternalPolicyCreateModal(props) {
    const { translate, systemApis } = props;

    const [state, setState] = useState({
        name: '',
        description: '',
        effect: 'Allow',
        actions: [],
        resources: [],
        enabled: true,
        condition: JSON.stringify({
            "or": [
                { "equals": { "key1": "value1" } },
                { "equals": { "key2": "value2" } }
            ]
        }, null, 2),
    });

    const { name, description, effect, actions, resources, enabled, condition } = state;
    let listPaginateApi = systemApis?.listPaginateApi
        .map((api) => api.path)
        .filter((path, index, array) => array.indexOf(path) == index);

    useEffect(() => {
        props.getSystemApis({
            page: 1,
            perPage: 10000
        })
    }, [])

    const handleChangeName = (e) => {
        setState({
            ...state,
            name: e.target.value
        })
    }

    const handleChangeDescription = (e) => {
        setState({
            ...state,
            description: e.target.value
        })
    }

    const handleChangeEffect = (value) => {
        setState({
            ...state,
            effect: value[0]
        })
    }

    const handleChangeActions = (value) => {
        setState(state => ({
            ...state,
            actions: value
        }))
    }

    const handleChangeResources = (value) => {
        setState(state => ({
            ...state,
            resources: value
        }))
    }

    const handleToggleEnabled = (value) => {
        setState(state => ({
            ...state,
            enabled: value.target.value
        }))
    }

    const handleChangeCondition = (value) => {
        setState(state => ({
            ...state,
            condition: value.target.value
        }))
    }

    const handleSubmit = () => {
        props.createExternalPolicy({
            name: name,
            description: description,
            effect: effect,
            actions: actions,
            resources: resources,
            enabled: enabled,
            condition: JSON.parse(condition),
        })
        window.$("#create-external-policy-modal").modal("hide");
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="create-external-policy-modal" isLoading={false}
                formID="form-create-external-policy"
                title={translate('system_admin.external_policy.modal.create_tile')}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
            >
                {/* Form them API */}
                <form id="form-create-external-policy" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input id="create-external-policy-enabled" className="form-control" type="checkbox" name="name" placeholder="Enabled" value={enabled} onChange={handleToggleEnabled} />
                        <label htmlFor="create-external-policy-enabled">{translate('system_admin.external_policy.table.enabled')}</label>
                    </div>

                    {/* Name */}
                    <div className="form-group">
                        <label>{translate('system_admin.external_policy.table.name')}</label>
                        <input className="form-control" type="text" placeholder="Name" name="name" onChange={handleChangeName} />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>{translate('system_admin.external_policy.table.description')}</label>
                        <input className="form-control" type="text" name="name" placeholder="Description" onChange={handleChangeDescription} />
                    </div>

                    <div className={`form-group`}>
                        <label>{translate('system_admin.external_policy.table.resources')}</label>
                        <SelectBox
                            id={`resources-create-external-policy`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={resources}
                            items={listPaginateApi.map(api => { return { value: api, text: api } })}
                            onChange={handleChangeResources}
                            multiple={true}
                        />
                    </div>

                    <div className="form-group">
                        <label>{translate('system_admin.external_policy.table.actions')}</label>
                        <SelectBox
                            id={`method-create-external-policy`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={actions}
                            items={[
                                {
                                    text: 'GET',
                                    value: 'GET'
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
                            onChange={handleChangeActions}
                            multiple={true}
                        />
                    </div>

                    <div className="form-group">
                        <label>{translate('system_admin.external_policy.table.effect')}</label>
                        <SelectBox
                            id={`effect-create`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={effect}
                            items={[
                                { value: 'Allow', text: `Allow` },
                                { value: 'Deny', text: `Deny` },
                            ]}
                            onChange={handleChangeEffect}
                        />
                    </div>

                    <div className={`form-group`}>
                        <label htmlFor="condition">{translate('system_admin.external_policy.table.condition')}</label>
                        <textarea className="form-control" rows="20" name="name" value={condition} onChange={handleChangeCondition} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { systemApis } = state
    return { systemApis };
}

const actionCreators = {
    getSystemApis: SystemApiActions.getSystemApis,
    createExternalPolicy: ExternalPolicyActions.createExternalPolicy
};

const connectedExternalPolicyCreateModal = connect(mapState, actionCreators)(withTranslate(ExternalPolicyCreateModal));
export { connectedExternalPolicyCreateModal as ExternalPolicyCreateModal };
