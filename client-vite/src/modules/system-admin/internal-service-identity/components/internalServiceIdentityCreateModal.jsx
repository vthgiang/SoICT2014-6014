import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SelectBox } from '../../../../common-components';
import { InternalServiceIdentityActions } from '../redux/actions';
import { internalPolicies } from '../../internal-policy/redux/reducers';
import { InternalPolicyServices } from '../../internal-policy/redux/services';
import { ExternalPolicyServices } from '../../external-policy/redux/services';

function InternalServiceIdentityCreateModal(props) {
    const { translate } = props;

    const [state, setState] = useState({
        name: null,
        apiPrefix: null,
        internalPolicies: [],
        externalPolicies: [],
        description: null,
    });
    const [listInternalPolicies, setListInternalPolices] = useState([]);
    const [listExternalPolicies, setListExternalPolices] = useState([]);

    const { name, apiPrefix, internalPolicies, externalPolicies, description } = state;

    useEffect(() => {
        async function init() {
            const internalPolicesResponse = await InternalPolicyServices.getInternalPolicies();
            setListInternalPolices(internalPolicesResponse.data.data);

            const externalPolicesResponse = await ExternalPolicyServices.getExternalPolicies();
            setListExternalPolices(externalPolicesResponse.data.data);
        }
        init()
    }, [])

    const handleChangeName = (e) => {
        setState({
            ...state,
            name: e.target.value
        })
    }

    const handleChangeApiPrefix = (e) => {
        setState({
            ...state,
            apiPrefix: e.target.value
        })
    }

    const handleChangeInternalPolicies = (value) => {
        setState(state => ({
            ...state,
            internalPolicies: value
        }))
    }

    const handleChangeExternalPolicies = (value) => {
        setState(state => ({
            ...state,
            externalPolicies: value
        }))
    }

    const handleChangeDescription = (e) => {
        setState({
            ...state,
            description: e.target.value
        })
    }

    const handleSubmit = () => {
        props.createInternalServiceIdentity({
            name: name,
            apiPrefix: apiPrefix,
            internalPolicies: internalPolicies,
            externalPolicies: externalPolicies,
            description: description,
        })
        window.$("#create-internal-service-identity-modal").modal("hide");
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="create-internal-service-identity-modal" isLoading={false}
                formID="form-create-internal-service-identity"
                title={translate('system_admin.internal_service_identity.modal.create_title')}
                msg_success={translate('create_internal_service_identity_success')}
                msg_failure={translate('create_internal_service_identity_failure')}
                func={handleSubmit}
            >
                {/* Form them API */}
                <form id="form-create-internal-service-identity" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.name')}</label>
                        <input className="form-control" type="text" name="name" onChange={handleChangeName} />
                    </div>

                    {/* API Prefix */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.apiPrefix')}</label>
                        <input className="form-control" type="text" name="name" onChange={handleChangeApiPrefix} />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.description')}</label>
                        <input className="form-control" type="text" name="name" onChange={handleChangeDescription} />
                    </div>

                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.internalPolicies')}</label>
                        <div>
                            <SelectBox
                                id={`internal-policies-create-internal-service`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listInternalPolicies.map(internalPolicy => { return { value: internalPolicy ? internalPolicy.id : null, text: internalPolicy ? internalPolicy.name : "" } })}
                                value={internalPolicies}
                                onChange={handleChangeInternalPolicies}
                                multiple={true}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.externalPolicies')}</label>
                        <div>
                            <SelectBox
                                id={`external-policies-create-internal-service`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listExternalPolicies.map(externalPolicy => { return { value: externalPolicy ? externalPolicy.id : null, text: externalPolicy ? externalPolicy.name : "" } })}
                                value={externalPolicies}
                                onChange={handleChangeExternalPolicies}
                                multiple={true}
                            />
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { internalPolicies } = state;
    return { internalPolicies };
}

const actionCreators = {
    createInternalServiceIdentity: InternalServiceIdentityActions.createInternalServiceIdentity
};

const connectedInternalServiceIdentityCreateModal = connect(mapState, actionCreators)(withTranslate(InternalServiceIdentityCreateModal));
export { connectedInternalServiceIdentityCreateModal as InternalServiceIdentityCreateModal };
