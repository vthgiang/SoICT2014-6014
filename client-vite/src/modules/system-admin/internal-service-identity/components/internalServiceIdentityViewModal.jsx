import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { InternalServiceIdentityActions } from '../redux/actions';

function InternalServiceIdentityViewModal(props) {
    const { translate, internalServiceIdentity } = props;

    const [state, setState] = useState({
        name: null,
        apiPrefix: null,
        description: null,
        internalPolicies: null,
        externalPolicies: null,
    });

    useEffect(() => {
        async function init() {
            setState({
                name: internalServiceIdentity?.name,
                apiPrefix: internalServiceIdentity?.apiPrefix,
                description: internalServiceIdentity?.description,
                internalPolicies: JSON.stringify(internalServiceIdentity?.internalPolicies, null, 2),
                externalPolicies: JSON.stringify(internalServiceIdentity?.externalPolicies, null, 2),
            })
        }
        init();
    }, [internalServiceIdentity])

    const { name, apiPrefix, description, internalPolicies, externalPolicies } = state;

    return (
        <React.Fragment>
            <DialogModal
                modalID="view-internal-service-identity-modal" isLoading={false}
                formID="form-view-internal-service-identity"
                title={translate('system_admin.internal_service_identity.modal.view_title')}
            >
                {/* Form them API */}
                <form id="form-view-internal-service-identity">
                    {/* Name */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.name')}</label>
                        <input readOnly className="form-control" type="text" name="name" value={name} />
                    </div>

                    {/* API Prefix */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.apiPrefix')}</label>
                        <input readOnly className="form-control" type="text" name="name"value={apiPrefix} />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.description')}</label>
                        <input readOnly className="form-control" type="text" name="name" value={description} />
                    </div>

                    {/* Internal policies */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.internalPolicies')}</label>
                        <pre>{internalPolicies}</pre>
                    </div>

                    {/* External policies */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.externalPolicies')}</label>
                        <pre>{externalPolicies}</pre>
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
    editInternalServiceIdentity: InternalServiceIdentityActions.editInternalServiceIdentity
};

export default connect(mapState, actionCreators)(withTranslate(InternalServiceIdentityViewModal))
