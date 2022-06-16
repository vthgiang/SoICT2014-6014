import { sendRequest } from '../../../../helpers/requestHelper';
import {
    getStorage
} from '../../../../config';

export const delegationServices = {
    getDelegations,
    rejectDelegation,
    confirmDelegation
}

function getDelegations(queryData) {
    let userId = getStorage("userId")
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations-receive`,
            method: "GET",
            params: {
                userId: userId,
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



function rejectDelegation(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations-reject`,
            method: "PATCH",
            data: {
                delegationId: data?.delegationId,
                reason: data?.reason
            }
        },
        true,
        true,
        "manage_delegation"
    )
}

function confirmDelegation(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations-confirm`,
            method: "PATCH",
            data: {
                delegationId: data?.delegationId,
            }
        },
        true,
        true,
        "manage_delegation"
    )
}