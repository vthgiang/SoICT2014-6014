import {
    BiddingPackageConstants
} from './constants';
const initState = {
    isLoading: false,
    exportData: [],

    totalList: 0,
    propsalData: {
        proposal: null,
        isComplete: 0,
    },

    biddingPackageDetail: [],
    listBiddingPackages: [],
    listAllBiddingPackages: [],
    listActiveBiddingPackage: [],
    error: '',
}

const findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

export function biddingPackagesManager(state = initState, action) {
    let index = -1;
    let indexAll = -1;
    switch (action.type) {
        case BiddingPackageConstants.GETALL_REQUEST:
            if (!action.callId) {
                return {
                    ...state,
                    isLoading: true,
                    exportData: [],
                };
            }
            else if (action.callId === "contract") {
                return {
                    ...state,
                };
            }
        case BiddingPackageConstants.GET_DETAIL_REQUEST:
        case BiddingPackageConstants.ADD_BIDDING_PACKAGE_REQUEST:
        case BiddingPackageConstants.UPDATE_INFOR_BIDDING_PACKAGE_REQUEST:
        case BiddingPackageConstants.DELETE_BIDDING_PACKAGE_REQUEST:
        case BiddingPackageConstants.GET_DOCUMENT_REQUEST:
        case BiddingPackageConstants.IMPORT_BIDDING_PACKAGE_REQUEST:
        case BiddingPackageConstants.PROPOSE_EMPLOYEE_FOR_TASK_REQUEST:
            return {
                ...state,
                isLoading: true,
                exportData: [],
                // listBiddingPackagesOfOrganizationalUnits:[],
                // listAllBiddingPackages:[],
            };
        case BiddingPackageConstants.GETALL_SUCCESS:
            if (!action.callId) {
                return {
                    ...state,
                    listBiddingPackages: action.payload.listBiddingPackages,
                    listAllBiddingPackages: action.payload.listAllBiddingPackages,
                    totalList: action.payload.totalList,
                    isLoading: false
                };
            }
            else if (action.callId === "contract") {
                return {
                    ...state,
                    listActiveBiddingPackage: action.payload.listBiddingPackages,
                    isLoading: false
                };
            }
        case BiddingPackageConstants.GET_DETAIL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                biddingPackageDetail: action.payload.listBiddingPackages
            }
        case BiddingPackageConstants.ADD_BIDDING_PACKAGE_SUCCESS:
                state.listBiddingPackages = [action.payload.listBiddingPackages, ...state.listBiddingPackages];
                state.listAllBiddingPackages = [action.payload.listBiddingPackages, ...state.listAllBiddingPackages];
                // state.totalList = state.totalList + 1
            return {
                ...state,
                isLoading: false
            };
        case BiddingPackageConstants.UPDATE_INFOR_BIDDING_PACKAGE_SUCCESS:
            state.listBiddingPackages = state.listBiddingPackages.map(x => {
                if ((String(x._id) === String(action.payload?.listBiddingPackages?._id))) {
                    return action.payload?.listBiddingPackages
                }
                return x
            });
            state.listAllBiddingPackages = state.listAllBiddingPackages.map(x => {
                if ((String(x._id) === String(action.payload?.listBiddingPackages?._id))) {
                    return action.payload?.listBiddingPackages
                }
                return x
            });
            return {
                ...state,
                // listBiddingPackages: action.payload.listBiddingPackages,
                // listAllBiddingPackages: action.payload.listAllBiddingPackages,
                // totalList: action.payload.totalList,
                isLoading: false
            };
        case BiddingPackageConstants.DELETE_BIDDING_PACKAGE_SUCCESS:
            return {
                ...state,
                // listBiddingPackages: state.listBiddingPackages.filter(x => String(x._id) !== String(action.payload)),
                // totalList: state.totalList - 1,
                isLoading: false,
            };
        case BiddingPackageConstants.IMPORT_BIDDING_PACKAGE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                importBiddingPackages: action.payload.content,
                error: ""
            }
        case BiddingPackageConstants.PROPOSE_EMPLOYEE_FOR_TASK_SUCCESS:
            console.log('PROPOSE_EMPLOYEE_FOR_TASK_SUCCESS', action.payload.content);
            return {
                ...state,
                isLoading: false,
                propsalData: action.payload,
                error: ""
            }
        case BiddingPackageConstants.GETALL_FAILURE:
        case BiddingPackageConstants.GET_DETAIL_FAILURE:
        case BiddingPackageConstants.ADD_BIDDING_PACKAGE_FAILURE:
        case BiddingPackageConstants.UPDATE_INFOR_BIDDING_PACKAGE_FAILURE:
        case BiddingPackageConstants.DELETE_BIDDING_PACKAGE_FAILURE:
        case BiddingPackageConstants.IMPORT_BIDDING_PACKAGE_FAILURE:
        case BiddingPackageConstants.GET_DOCUMENT_REQUEST:
        case BiddingPackageConstants.PROPOSE_EMPLOYEE_FOR_TASK_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        default:
            return state
    }
}