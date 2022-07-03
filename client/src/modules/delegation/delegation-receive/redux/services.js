import { sendRequest } from '../../../../helpers/requestHelper';
import {
    getStorage
} from '../../../../config';

export const delegationServices = {
    getDelegations,
    rejectDelegation,
    confirmDelegation,
    getDelegationsTask
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
                perPage: queryData?.perPage ? queryData.perPage : null,
                delegateType: queryData?.delegateType ? queryData.delegateType : "",

            }
        },
        false,
        true,
        "manage_delegation"
    );
}

function getDelegationsTask(queryData) {
    let userId = getStorage("userId")
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations-receive/tasks`,
            method: "GET",
            params: {
                userId: userId,
                delegationName: queryData?.delegationName ? queryData.delegationName : "",
                page: queryData?.pageTask ? queryData.pageTask : null,
                perPage: queryData?.perPageTask ? queryData.perPageTask : null,
                delegateType: queryData?.delegateType ? queryData.delegateType : null,

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