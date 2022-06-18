import { sendRequest } from '../../../../helpers/requestHelper';

export const policyServices = {
    getPolicies,
    deletePolicies,
    createPolicy,
    editPolicy
}

function getPolicies(queryData) {
    console.log("policy")
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/policy/policies-delegation`,
            method: "GET",
            params: {
                policyName: queryData?.policyName ? queryData.policyName : "",
                page: queryData?.page ? queryData.page : null,
                perPage: queryData?.perPage ? queryData.perPage : null
            }
        },
        false,
        true,
        "super_admin.policy"
    );
}

function deletePolicies(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/policy/policies-delegation`,
            method: "DELETE",
            data: {
                policyIds: data?.policyIds
            }
        },
        true,
        true,
        "super_admin.policy"
    )
}

function createPolicy(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/policy/policies-delegation`,
            method: "POST",
            data: data
        },
        true,
        true,
        "super_admin.policy"
    )
}

function editPolicy(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/policy/policies-delegation/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "super_admin.policy"
    )
}