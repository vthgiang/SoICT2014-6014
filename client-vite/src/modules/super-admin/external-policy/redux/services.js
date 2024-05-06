import { sendRequest } from "../../../../helpers/requestHelper";

export const ExternalPolicyServices = {
    getExternalPolicies,
};

const POLICY_BASE_API_URL = `${process.env.REACT_APP_SERVICE_IDENTITY_SERVER}/external-policies`;

function getExternalPolicies(params) {
    return sendRequest({
        url: `${POLICY_BASE_API_URL}/external-policies`,
        method: 'GET',
        params: {
            name: params?.name,
            page: params?.page,
            perPage: params?.perPage,
        }
    }, false, true, 'super_admin.external_policy');
}
