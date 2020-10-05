import { CrmGroupConstants } from "./constants";

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initState = {
    list: [],
    totalDocs: 0,
    isLoading: true,
}

export function groups(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;

    switch (action.type) {
        case CrmGroupConstants.GET_CRM_GROUPS_REQUEST:
        case CrmGroupConstants.PAGINATE_CRM_GROUPS_REQUEST:
        case CrmGroupConstants.CREATE_CRM_GROUP_REQUEST:
        case CrmGroupConstants.GET_CRM_GROUP_REQUEST:
        case CrmGroupConstants.EDIT_CRM_GROUP_REQUEST:
        case CrmGroupConstants.DELETE_CRM_GROUP_REQUEST:

            return {
                ...state,
                isLoading: true
            }

        case CrmGroupConstants.GET_CRM_GROUPS_FAILE:
        case CrmGroupConstants.PAGINATE_CRM_GROUPS_FAILE:
        case CrmGroupConstants.CREATE_CRM_GROUP_FAILE:
        case CrmGroupConstants.GET_CRM_GROUP_FAILE:
        case CrmGroupConstants.EDIT_CRM_GROUP_FAILE:
        case CrmGroupConstants.DELETE_CRM_GROUP_FAILE:

            return {
                ...state,
                isLoading: false
            }

        case CrmGroupConstants.GET_CRM_GROUPS_SUCCESS:

            return {
                ...state,
                list: action.payload.groups,
                totalDocs: action.payload.listGroupTotal,
                isLoading: false
            };

        case CrmGroupConstants.CREATE_CRM_GROUP_SUCCESS:
            console.log('payload', action.payload);
            return {
                ...state,
                list: [action.payload, ...state.list],
                isLoading: false
            };

        case CrmGroupConstants.PAGINATE_CRM_GROUPS_SUCCESS:

            return {
                ...state,
                listPaginate: action.payload.docs,
                ...action.payload,
                isLoading: false
            };

        case CrmGroupConstants.EDIT_CRM_GROUP_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            if (index !== -1) state.list[index] = action.payload;
            indexPaginate = findIndex(state.listPaginate, action.payload._id);
            if (indexPaginate !== -1) state.listPaginate[index] = action.payload;

            return {
                ...state,
                isLoading: false
            };

        case CrmGroupConstants.DELETE_CRM_GROUP_SUCCESS:
            index = findIndex(state.list, action.payload);
            if (index !== -1) state.list.splice(index, 1);
            indexPaginate = findIndex(state.listPaginate, action.payload);
            if (indexPaginate !== -1) state.listPaginate.splice(indexPaginate, 1);

            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}