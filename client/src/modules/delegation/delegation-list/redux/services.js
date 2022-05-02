import { sendRequest } from '../../../../helpers/requestHelper';

export const delegationServices = {
    getDelegations,
    deleteDelegations,
    createDelegation,
    editDelegation
}

function getDelegations(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
            method: "GET",
            params: {
                delegationName: queryData?.delegationName ? queryData.delegationName : "",
                page: queryData?.page ? queryData.page : null,
                perPage: queryData?.perPage ? queryData.perPage : null
            }
        },
        false,
        true,
        "manage_delegation"
    );
}

function deleteDelegations(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
            method: "DELETE",
            data: {
                delegationIds: data?.delegationIds
            }
        },
        true,
        true,
        "manage_delegation"
    )
}

function createDelegation(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_delegation"
    )
}

function editDelegation(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_delegation"
    )
}