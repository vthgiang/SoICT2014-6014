import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, SelectBox } from '../../../../common-components';
import { InternalPolicyActions } from '../redux/actions';
import { formatDate, formatToTimeZoneDate } from '../../../../helpers/formatDate';
import { SystemApiActions } from '../../system-api/system-api-management/redux/actions';

function InternalPolicyCreateModal(props) {
    const { translate, systemApis } = props;

    const [state, setState] = useState({
        name: '',
        description: '',
        effect: 'Allow',
        actions: [],
        resources: [],
        effectiveStartTime: '',
        effectiveEndTime: '',
    });

    const { name, description, effect, actions, resources, effectiveStartTime, effectiveEndTime } = state;
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

    const handleChangeEffectiveStartTime = (value) => {
        setState(state => ({
            ...state,
            effectiveStartTime: formatToTimeZoneDate(value)
        }))
    }

    const handleChangeEffectiveEndTime = (value) => {
        setState(state => ({
            ...state,
            effectiveEndTime: formatToTimeZoneDate(value)
        }))
    }

    const handleSubmit = () => {
        props.createInternalPolicy({
            name: name,
            description: description,
            effect: effect,
            actions: actions,
            resources: resources,
            effectiveStartTime: effectiveStartTime,
            effectiveEndTime: effectiveEndTime,
        })
        window.$("#create-internal-policy-modal").modal("hide");
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="create-internal-policy-modal" isLoading={false}
                formID="form-create-internal-policy"
                title={translate('system_admin.internal_policy.modal.create_title')}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
            >
                {/* Form them API */}
                <form id="form-create-internal-policy" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_policy.table.name')}</label>
                        <input className="form-control" type="text" placeholder="Name" name="name" onChange={handleChangeName} />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_policy.table.description')}</label>
                        <input className="form-control" type="text" name="name" placeholder="Description" onChange={handleChangeDescription} />
                    </div>

                    <div className={`form-group`}>
                        <label>{translate('system_admin.internal_policy.table.resources')}</label>
                        <SelectBox
                            id={`resources-create-internal-policy`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={resources}
                            items={listPaginateApi.map(api => { return { value: api, text: api } })}
                            onChange={handleChangeResources}
                            multiple={true}
                        />
                    </div>

                    <div className="form-group">
                        <label>{translate('system_admin.internal_policy.table.actions')}</label>
                        <SelectBox
                            id={`method-create-internal-policy`}
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
                        <label>{translate('system_admin.internal_policy.table.effect')}</label>
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
                        <label htmlFor="effectiveStartTime">{translate('system_admin.internal_policy.table.effectiveStartTime')}</label>
                        <DatePicker
                            id={`effectiveStartTime-create`}
                            value={effectiveStartTime ? formatDate(effectiveStartTime, false) : ''}
                            onChange={handleChangeEffectiveStartTime}
                        />
                    </div>

                    <div className={`form-group`}>
                        <label htmlFor="effectiveEndTime">{translate('system_admin.internal_policy.table.effectiveEndTime')}</label>
                        <DatePicker
                            id={`effectiveEndTime-create`}
                            value={effectiveEndTime ? formatDate(effectiveEndTime, false) : ''}
                            onChange={handleChangeEffectiveEndTime}
                        />
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
    createInternalPolicy: InternalPolicyActions.createInternalPolicy
};

const connectedInternalPolicyCreateModal = connect(mapState, actionCreators)(withTranslate(InternalPolicyCreateModal));
export { connectedInternalPolicyCreateModal as InternalPolicyCreateModal };
