import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SelectBox } from '../../../../common-components';
import { InternalServiceIdentityActions } from '../redux/actions';
import { InternalPolicyServices } from '../../internal-policy/redux/services';
import { ExternalPolicyServices } from '../../external-policy/redux/services';

function InternalServiceIdentityEditModal(props) {
    const { translate, internalServiceIdentity } = props;

    const [state, setState] = useState({
        id: null,
        name: null,
        apiPrefix: null,
        internalPolicies: [],
        externalPolicies: [],
        description: null,
    });
    const [listInternalPolicies, setListInternalPolices] = useState([]);
    const [listExternalPolicies, setListExternalPolices] = useState([]);

    const { id, name, apiPrefix, internalPolicies, externalPolicies, description } = state;

    useEffect(() => {
        async function init() {
            const internalPolicesResponse = await InternalPolicyServices.getInternalPolicies();
            setListInternalPolices(internalPolicesResponse.data.content.data);

            const externalPolicesResponse = await ExternalPolicyServices.getExternalPolicies();
            setListExternalPolices(externalPolicesResponse.data.content.data);
        }
        init()
    }, [])

    useEffect(() => {
        async function init() {
            setState({
                id: internalServiceIdentity?.id,
                name: internalServiceIdentity?.name,
                apiPrefix: internalServiceIdentity?.apiPrefix,
                description: internalServiceIdentity?.description,
                internalPolicies: internalServiceIdentity?.internalPolicies?.map((policy) => policy.id),
                externalPolicies: internalServiceIdentity?.externalPolicies?.map((policy) => policy.id),
            })
        }
        init();
    }, [internalServiceIdentity])

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
        props.editInternalServiceIdentity(id, {
            name: name,
            apiPrefix: apiPrefix,
            internalPolicies: internalPolicies,
            externalPolicies: externalPolicies,
            description: description,
        })
        window.$("#update-internal-service-identity-modal").modal("hide");
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="update-internal-service-identity-modal" isLoading={false}
                formID="form-update-internal-service-identity"
                title={translate('system_admin.internal_service_identity.modal.update_title')}
                msg_success="Cập nhật thành công"
                msg_failure="Cập nhật thất bại"
                func={handleSubmit}
            >
                {/* Form them API */}
                <form id="form-update-internal-service-identity" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.name')}</label>
                        <input className="form-control" type="text" name="name" value={name} onChange={handleChangeName} />
                    </div>

                    {/* API Prefix */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.apiPrefix')}</label>
                        <input className="form-control" type="text" name="name"value={apiPrefix} onChange={handleChangeApiPrefix} />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.description')}</label>
                        <input className="form-control" type="text" name="name" value={description} onChange={handleChangeDescription} />
                    </div>

                    <div className="form-group">
                        <label>{translate('system_admin.internal_service_identity.table.internalPolicies')}</label>
                        <div>
                            <SelectBox
                                id={`internal-policies-update-internal-service`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listInternalPolicies?.map(internalPolicy => { return { value: internalPolicy ? internalPolicy.id : null, text: internalPolicy ? internalPolicy.name : "" } })}
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
                                id={`external-policies-update-internal-service`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listExternalPolicies?.map(externalPolicy => { return { value: externalPolicy ? externalPolicy.id : null, text: externalPolicy ? externalPolicy.name : "" } })}
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
    const { } = state;
    return {};
}

const actionCreators = {
    editInternalServiceIdentity: InternalServiceIdentityActions.editInternalServiceIdentity
};

export default connect(mapState, actionCreators)(withTranslate(InternalServiceIdentityEditModal))
