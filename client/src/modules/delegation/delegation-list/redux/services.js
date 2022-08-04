import { sendRequest } from '../../../../helpers/requestHelper';
import {
    getStorage
} from '../../../../config';

export const delegationServices = {
    getDelegations,
    deleteDelegations,
    createDelegation,
    editDelegation,
    revokeDelegation,
    getDelegationsTask,
    deleteTaskDelegations,
    createTaskDelegation,
    editTaskDelegation,
    revokeTaskDelegation,
}

function getDelegations(queryData) {
    let userId = getStorage("userId")
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
            method: "GET",
            params: {
                userId: userId,
                delegationName: queryData?.delegationName ? queryData.delegationName : "",
                page: queryData?.page ? queryData.page : null,
                perPage: queryData?.perPage ? queryData.perPage : null,
                delegateType: queryData?.delegateType ? queryData.delegateType : null,

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
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations/tasks`,
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

function revokeDelegation(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
            method: "PATCH",
            data: {
                delegationIds: data?.delegationIds,
                reason: data?.reason
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

function deleteTaskDelegations(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations-tasks`,
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

function revokeTaskDelegation(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations-tasks`,
            method: "PATCH",
            data: {
                delegationIds: data?.delegationIds,
                reason: data?.reason
            }
        },
        true,
        true,
        "manage_delegation"
    )
}

function createTaskDelegation(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations-tasks`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_delegation"
    )
}

function editTaskDelegation(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations-tasks/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_delegation"
    )
}