import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { ExternalPolicyActions } from '../redux/actions';

function ExternalPolicyViewModal(props) {
    const { translate, externalPolicy } = props;

    const [state, setState] = useState({
        name: null,
        description: '',
        effect: 'Allow',
        actions: [],
        resources: [],
        enabled: true,
        condition: '',
    });

    const { name, description, effect, actions, resources, enabled, condition } = state;

    useEffect(() => {
        async function init() {
            setState({
                name: externalPolicy?.name,
                effect: externalPolicy?.effect,
                description: externalPolicy?.description,
                actions: externalPolicy?.actions,
                resources: externalPolicy?.resources,
                enabled: externalPolicy?.enabled,
                condition: JSON.stringify(externalPolicy?.condition, null, 2),
            })
        }
        init();
    }, [externalPolicy])

    return (
        <React.Fragment>
            <DialogModal
                modalID="view-external-policy-modal" isLoading={false}
                formID="form-view-external-policy"
                title={translate('system_admin.external_policy.modal.view_title')}
            >
                {/* Form them API */}
                <form id="form-view-external-policy">
                    <div className="form-group">
                        <input readonly id="view-external-policy-enabled" className="form-control" type="checkbox" name="name" placeholder="Enabled" defaultChecked={enabled} />
                        <label htmlFor="view-external-policy-enabled">{translate('system_admin.external_policy.table.enabled')}</label>
                    </div>

                    {/* Name */}
                    <div className="form-group">
                        <label>{translate('system_admin.external_policy.table.name')}</label>
                        <input readOnly className="form-control" type="text" placeholder="Name" name="name" value={name} />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>{translate('system_admin.external_policy.table.description')}</label>
                        <input readOnly className="form-control" type="text" name="name" placeholder="Description" value={description} />
                    </div>

                    <div className="form-group">
                        <label>{translate('system_admin.external_policy.table.effect')}</label>
                        <input readOnly className="form-control" type="text" name="name" placeholder="Effect" value={effect} />
                    </div>

                    <div className="form-group">
                        <label>{translate('system_admin.external_policy.table.actions')}</label>
                        <input readOnly className="form-control" type="text" name="name" placeholder="Actions" value={actions} />
                    </div>

                    <div className="form-group">
                        <label>{translate('system_admin.external_policy.table.resources')}</label>
                        <input readOnly className="form-control" type="text" name="name" placeholder="Resources" value={resources} />
                    </div>

                    <div className="form-group">
                        <label>{translate('system_admin.external_policy.table.condition')}</label>
                        <pre>{condition}</pre>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { } = state;
    return {};
}

const actionCreators = {
    editExternalPolicy: ExternalPolicyActions.editExternalPolicy
};

export default connect(mapState, actionCreators)(withTranslate(ExternalPolicyViewModal))
