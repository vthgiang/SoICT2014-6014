import { sendRequest } from "../../../../helpers/requestHelper";

export const InternalPolicyServices = {
    getInternalPolicies,
    createInternalPolicy,
    editInternalPolicy,
    deleteInternalPolicy,
};

const POLICY_BASE_API_URL = `${process.env.REACT_APP_SERVICE_IDENTITY_SERVER}/authorization/internal-policies`;

function getInternalPolicies(params) {
    return sendRequest({
        url: `${POLICY_BASE_API_URL}/internal-policies`,
        method: 'GET',
        params: {
            name: params?.name,
            resource: params?.resource,
            page: params?.page,
            perPage: params?.perPage,
        }
    }, false, true, 'system_admin.internal_policy');
}

function createInternalPolicy(data) {
    return sendRequest({
        url: `${POLICY_BASE_API_URL}/internal-policies`,
        method: 'POST',
        data: data
    }, true, true, 'system_admin.internal_policy');
}

function editInternalPolicy (policyId, data) {
    return sendRequest({
        url: `${POLICY_BASE_API_URL}/internal-policies/${policyId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'system_admin.internal_policy');
}

function deleteInternalPolicy(policyId) {
    return sendRequest({
        url: `${POLICY_BASE_API_URL}/internal-policies/${policyId}`,
        method: 'DELETE',
    }, true, true, 'system_admin.internal_policy');
}
