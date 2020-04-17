import { DisciplineConstants } from './constants';

const initState = {
    isLoading: false,
    totalListDiscipline: "",
    listDiscipline: [],
    totalListPraise: "",
    listPraise: [],
    error: ""
}

export function discipline(state = initState, action) {
    switch (action.type) {
        /**
         * Start
         * Reducer quản lý kỷ luật
         */
        case DisciplineConstants.GET_DISCIPLINE_REQUEST:
        case DisciplineConstants.CREATE_DISCIPLINE_REQUEST:
        case DisciplineConstants.DELETE_DISCIPLINE_REQUEST:
        case DisciplineConstants.UPDATE_DISCIPLINE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.GET_DISCIPLINE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDiscipline: action.payload.listDiscipline,
                totalListDiscipline: action.payload.totalList,
            };
        case DisciplineConstants.CREATE_DISCIPLINE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDiscipline: [...state.listDiscipline, action.payload]
            };
        case DisciplineConstants.DELETE_DISCIPLINE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDiscipline: state.listDiscipline.filter(discipline => (discipline._id !== action.payload._id))
            };
        case DisciplineConstants.UPDATE_DISCIPLINE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDiscipline: state.listDiscipline.map(discipline =>(discipline._id === action.payload._id) ? action.payload : discipline)
            };
        case DisciplineConstants.GET_DISCIPLINE_FAILURE:
        case DisciplineConstants.CREATE_DISCIPLINE_FAILURE:
        case DisciplineConstants.DELETE_DISCIPLINE_FAILURE:
        case DisciplineConstants.UPDATE_DISCIPLINE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
            /**
             * Start
             * Reducer quản lý kỷ luật
             */

            /**
             * Start
             * Reducer quản lý khen thưởng
             */
        case DisciplineConstants.GET_PRAISE_REQUEST:
        case DisciplineConstants.CREATE_PRAISE_REQUEST:
        case DisciplineConstants.DELETE_PRAISE_REQUEST:
        case DisciplineConstants.UPDATE_PRAISE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.GET_PRAISE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPraise: action.payload.listPraise,
                totalListPraise: action.payload.totalList,
            };
        case DisciplineConstants.CREATE_PRAISE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPraise: [...state.listPraise, action.payload],
            };
        case DisciplineConstants.DELETE_PRAISE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPraise: state.listPraise.filter(praise => (praise._id !== action.payload._id))
            };
        case DisciplineConstants.UPDATE_PRAISE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPraise: state.listPraise.map(praise =>(praise._id === action.payload._id) ? action.payload : praise),
            };
        case DisciplineConstants.GET_PRAISE_FAILURE:
        case DisciplineConstants.CREATE_PRAISE_FAILURE:
        case DisciplineConstants.DELETE_PRAISE_FAILURE:
        case DisciplineConstants.UPDATE_PRAISE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}