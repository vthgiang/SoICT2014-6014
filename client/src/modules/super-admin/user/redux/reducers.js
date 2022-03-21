import { UserConstants } from "./constants";

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
    searchUses: [],
    listPaginate: [],
    employeesOfUnitsUserIsManager: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    error: null,
    isLoading: false
}

export function user(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;

    switch (action.type) {
        case UserConstants.GET_USERS_REQUEST:
        case UserConstants.GET_USERS_PAGINATE_REQUEST:
        case UserConstants.CREATE_USER_REQUEST:
        case UserConstants.EDIT_USER_REQUEST:
        case UserConstants.DELETE_USER_REQUEST:
        case UserConstants.SEARCH_USER_BY_NAME_REQUEST:
        case UserConstants.IMPORT_USERS_REQUEST:
        case UserConstants.SEND_EMAIL_RESET_PASSWORD_USER_REQUEST:
        case UserConstants.CREATE_USER_ATTRIBUTE_REQUEST:

            return {
                ...state,
                isLoading: true,
            }

        case UserConstants.GET_USERS_FAILE:
        case UserConstants.GET_USERS_PAGINATE_FAILE:
        case UserConstants.CREATE_USER_FAILE:
        case UserConstants.EDIT_USER_FAILE:
        case UserConstants.DELETE_USER_FAILE:
        case UserConstants.SEARCH_USER_BY_NAME_FAILE:
        case UserConstants.IMPORT_USERS_FAILE:
        case UserConstants.SEND_EMAIL_RESET_PASSWORD_USER_FAILE:
        case UserConstants.SEND_EMAIL_RESET_PASSWORD_USER_SUCCESS:
        case UserConstants.CREATE_USER_ATTRIBUTE_FAILE:
            return {
                ...state,
                isLoading: false,
            }

        case UserConstants.GET_USERS_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ROLE_REQUEST:
            return {
                loading: true,
                isLoading: true
            };

        case UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ROLE_SUCCESS:
            return {
                ...state,
                loading: false,
                employees: action.payload,
                isLoading: false
            };

        case UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ROLE_FAILURE:
            return {
                error: action.payload,
                isLoading: false
            };
        case UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ID_REQUEST:
            if (action.callApi) {
                return {
                    ...state,
                    employeesOfUnitsUserIsManager: null,
                    isLoading: true
                };
            }

        case UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ID_SUCCESS:
            if (action.callApi) {
                return {
                    ...state,
                    employeesOfUnitsUserIsManager: action.payload?.employees,
                    isLoading: false
                };
            }

        case UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ID_FAILURE:
            return {
                ...state,
                employeesLoading: false,
                loading: false,
                error: action.payload,
                isLoading: false
            };

        case UserConstants.GET_USERS_PAGINATE_SUCCESS:
            if (action.payload.searchUses) {
                return {
                    ...state,
                    searchUses: action.payload.searchUses,
                    isLoading: false
                };
            } else {
                return {
                    ...state,
                    listPaginate: action.payload.docs,
                    totalDocs: action.payload.totalDocs,
                    limit: action.payload.limit,
                    totalPages: action.payload.totalPages,
                    page: action.payload.page,
                    pagingCounter: action.payload.pagingCounter,
                    hasPrevPage: action.payload.hasPrevPage,
                    hasNextPage: action.payload.hasNextPage,
                    prevPage: action.payload.prevPage,
                    nextPage: action.payload.nextPage,
                    isLoading: false
                };
            }

        case UserConstants.EDIT_USER_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            indexPaginate = findIndex(state.listPaginate, action.payload._id);

            if (index !== -1) {
                state.list[index] = action.payload;
            };

            if (indexPaginate !== -1) {
                state.listPaginate[indexPaginate] = action.payload;
            }

            return {
                ...state,
                isLoading: false
            };

        case UserConstants.CREATE_USER_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ],
                listPaginate: [
                    ...state.listPaginate,
                    action.payload
                ],
                isLoading: false
            };

        case UserConstants.DELETE_USER_SUCCESS:
            index = findIndex(state.list, action.payload);
            indexPaginate = findIndex(state.listPaginate, action.payload);

            if (index !== -1) {
                state.list.splice(index, 1);
            }

            if (indexPaginate !== -1) {
                state.listPaginate.splice(indexPaginate, 1);
            }

            return {
                ...state,
                isLoading: false
            };

        case UserConstants.SEARCH_USER_BY_NAME_SUCCESS:
            return {
                ...state,
                listPaginate: action.payload.docs,
                totalDocs: action.payload.totalDocs,
                limit: action.payload.limit,
                totalPages: action.payload.totalPages,
                page: action.payload.page,
                pagingCounter: action.payload.pagingCounter,
                hasPrevPage: action.payload.hasPrevPage,
                hasNextPage: action.payload.hasNextPage,
                prevPage: action.payload.prevPage,
                nextPage: action.payload.nextPage,
                isLoading: false
            };

        case UserConstants.IMPORT_USERS_SUCCESS:
            return {
                ...state,
                listPaginate: action.payload.docs,
                totalDocs: action.payload.totalDocs,
                limit: action.payload.limit,
                totalPages: action.payload.totalPages,
                page: action.payload.page,
                pagingCounter: action.payload.pagingCounter,
                hasPrevPage: action.payload.hasPrevPage,
                hasNextPage: action.payload.hasNextPage,
                prevPage: action.payload.prevPage,
                nextPage: action.payload.nextPage,
                isLoading: false
            };

        case UserConstants.GET_USER_ROLES_SUCCESS:
            return {
                ...state,
                roles: action.payload
            };

        case UserConstants.GET_LINK_OF_ROLE_SUCCESS:
            return {
                ...state,
                links: action.payload
            }

        case UserConstants.GETROLE_SAMEDEPARTMENT_REQUEST:
            return {
                ...state,
                loading: true
            };

        case UserConstants.GETROLE_SAMEDEPARTMENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                roledepartments: action.payload
            };

        case UserConstants.GETALLUSER_OFDEPARTMENT_REQUEST:
            return {
                ...state,
                loading: true,
                userdepartments: null
            };

        case UserConstants.GETALLUSER_OFDEPARTMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                userdepartments: action.payload
            };

        case UserConstants.GETALLUSER_OFDEPARTMENT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };

        case UserConstants.GETALLUSER_SAMEDEPARTMENT_REQUEST:
            return {
                ...state,
                loading: true,
                userdepartments: null
            };

        case UserConstants.GETALLUSER_SAMEDEPARTMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                userdepartments: action.payload
            };

        case UserConstants.GETALLUSER_SAMEDEPARTMENT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };

        case UserConstants.GETALLUSER_OFCOMPANY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                usercompanys: action.payload
            };

        case UserConstants.GETALLUSER_OFCOMPANY_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };

        case UserConstants.GETDEPARTMENT_OFUSER_REQUEST:
            return {
                ...state,
                organizationalUnitsOfUserLoading: false,
                isLoading: true
            };

        case UserConstants.GETDEPARTMENT_OFUSER_SUCCESS:
            if (action.payload.departmentsByEmail) {
                return {
                    ...state,
                    organizationalUnitsOfUserByEmail: action.payload.departmentsByEmail,
                    isLoading: false
                };
            };
            return {
                ...state,
                organizationalUnitsOfUserLoading: true,
                organizationalUnitsOfUser: action.payload,
                isLoading: false
            };

        case UserConstants.GETDEPARTMENT_OFUSER_FAILURE:
            return {
                ...state,
                organizationalUnitsOfUserLoading: true,
                error: action.error,
                isLoading: false
            };

        case UserConstants.GET_ALL_USERS_OF_UNIT_AND_ITS_SUB_UNITS_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case UserConstants.GET_ALL_USERS_OF_UNIT_AND_ITS_SUB_UNITS_SUCCESS:
            return {
                ...state,
                usersOfChildrenOrganizationalUnit: action.payload,
                isLoading: false
            };

        case UserConstants.GET_ALL_USERS_OF_UNIT_AND_ITS_SUB_UNITS_FAILURE:
            return {
                error: action.payload,
                isLoading: false
            };


        case UserConstants.GET_ALL_USERS_IN_UNITS_OF_COMPANY_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case UserConstants.GET_ALL_USERS_IN_UNITS_OF_COMPANY_SUCCESS:
            return {
                ...state,
                usersInUnitsOfCompany: action.payload,
                isLoading: false
            };

        case UserConstants.GET_ALL_USERS_IN_UNITS_OF_COMPANY_FAILURE:
            return {
                error: action.payload,
                isLoading: false
            };
        case UserConstants.GET_ALL_USERS_WITH_ROLE_REQUEST:
            return {
                isLoading: true
            }
        case UserConstants.GET_ALL_USERS_WITH_ROLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                usersWithRole: action.payload.data.content
            }
        case UserConstants.GET_ALL_USERS_WITH_ROLE_FAIL:
            return {
                isLoading: false
            }
        case UserConstants.CREATE_USER_ATTRIBUTE_SUCCESS:
            console.log(action.payload)
            action.payload.forEach(x => {
                index = findIndex(state.list, x._id);
                indexPaginate = findIndex(state.listPaginate, x._id);
                console.log(index); console.log(indexPaginate)
                if (index !== -1) {
                    state.list[index] = x;
                }

                if (indexPaginate !== -1) {

                    state.listPaginate[indexPaginate] = x;
                }

            })
            console.log("done")
            return {
                ...state,
                isLoading: false
            };
        default:
            return state;
    }
}