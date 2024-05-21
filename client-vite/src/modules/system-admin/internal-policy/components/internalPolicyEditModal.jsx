import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, SelectBox } from '../../../../common-components';
import { InternalPolicyActions } from '../redux/actions';
import { formatDate, formatToTimeZoneDate } from '../../../../helpers/formatDate';
import { SystemApiActions } from '../../system-api/system-api-management/redux/actions';

function InternalPolicyEditModal(props) {
    const { translate, internalPolicy, systemApis } = props;

    const [state, setState] = useState({
        id: null,
        name: null,
        description: null,
        effect: null,
        actions: null,
        resources: null,
        effectiveStartTime: null,
        effectiveEndTime: null,
    });

    const { id, name, description, effect, actions, resources, effectiveStartTime, effectiveEndTime } = state;
    let listPaginateApi = systemApis?.listPaginateApi
        .map((api) => api.path)
        .filter((path, index, array) => array.indexOf(path) == index);

    useEffect(() => {
        props.getSystemApis({
            page: 1,
            perPage: 10000
        })
    }, [])

    useEffect(() => {
        async function init() {
            setState({
                id: internalPolicy?.id,
                name: internalPolicy?.name,
                effect: internalPolicy?.effect,
                description: internalPolicy?.description,
                actions: internalPolicy?.actions,
                resources: internalPolicy?.resources,
                effectiveStartTime: internalPolicy?.effectiveStartTime,
                effectiveEndTime: internalPolicy?.effectiveEndTime,
            })
        }
        init();
    }, [internalPolicy])

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
        setState({
            ...state,
            effectiveStartTime: formatToTimeZoneDate(value)
        })
    }

    const handleChangeEffectiveEndTime = (value) => {
        setState({
            ...state,
            effectiveEndTime: formatToTimeZoneDate(value)
        })
    }

    const handleSubmit = () => {
        props.editInternalPolicy(id, {
            name: name,
            description: description,
            effect: effect,
            actions: actions,
            resources: resources,
            effectiveStartTime: effectiveStartTime,
            effectiveEndTime: effectiveEndTime,
        })
        window.$("#update-internal-policy-modal").modal("hide");
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="update-internal-policy-modal" isLoading={false}
                formID="form-update-internal-policy"
                title={translate('system_admin.internal_policy.modal.update_title')}
                msg_success="Cập nhật thành công"
                msg_failure="Cập nhật thất bại"
                func={handleSubmit}
            >
                {/* Form them API */}
                <form id="form-update-internal-policy" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_policy.table.name')}</label>
                        <input readOnly className="form-control" type="text" placeholder="Name" name="name" value={name} />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_policy.table.description')}</label>
                        <input className="form-control" type="text" name="name" placeholder="Description" value={description} onChange={handleChangeDescription} />
                    </div>

                    <div className={`form-group`}>
                        <label>{translate('system_admin.internal_policy.table.resources')}</label>
                        <SelectBox
                            id={`resources-update-internal-policy`}
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
                            id={`method-update-internal-policy`}
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
                            id={`effect-update`}
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
                            id={`effectiveStartTime-update`}
                            value={formatDate(effectiveStartTime, false)}
                            onChange={handleChangeEffectiveStartTime}
                        />
                    </div>

                    <div className={`form-group`}>
                        <label htmlFor="effectiveEndTime">{translate('system_admin.internal_policy.table.effectiveEndTime')}</label>
                        <DatePicker
                            id={`effectiveEndTime-update`}
                            value={formatDate(effectiveEndTime, false)}
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
    editInternalPolicy: InternalPolicyActions.editInternalPolicy
};

export default connect(mapState, actionCreators)(withTranslate(InternalPolicyEditModal))
