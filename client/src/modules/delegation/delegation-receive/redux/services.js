import { sendRequest } from '../../../../helpers/requestHelper';
import {
    getStorage
} from '../../../../config';

export const delegationServices = {
    getDelegations,
    replyDelegation
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



function replyDelegation(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/delegation/delegations-reply/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_delegation"
    )
}