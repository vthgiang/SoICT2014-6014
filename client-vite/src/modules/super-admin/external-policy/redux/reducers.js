import { ExternalPolicyConstants } from "./constants";

const initState = {
    listSuperAdminExternalPolicy: [],
}

export function superAdminExternalPolicies (state = initState, action) {
    switch (action.type) {
        case ExternalPolicyConstants.GET_EXTERNAL_POLICY_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case ExternalPolicyConstants.GET_EXTERNAL_POLICY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listSuperAdminExternalPolicy: action.payload.data,
                totalExternalPolicies: action.payload.totalExternalPolicies,
                totalPages: action.payload.totalPages,
            };
        case ExternalPolicyConstants.GET_EXTERNAL_POLICY_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        default:
            return state;
    }
}