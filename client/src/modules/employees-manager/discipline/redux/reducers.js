import {
    DisciplineConstants
} from './constants';

const initState = {
    listDiscipline: [],
    listPraise: []
}

export function discipline(state = initState, action) {
    switch (action.type) {
        case DisciplineConstants.GET_DISCIPLINE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.GET_DISCIPLINE_SUCCESS:
            return {
                ...state,
                listDiscipline: action.listDiscipline.content.listDiscipline,
                totalListDiscipline: action.listDiscipline.content.totalList,
                    isLoading: false,
            };
        case DisciplineConstants.GET_DISCIPLINE_FAILURE:
            return {
                error: action.error,
            };
        case DisciplineConstants.CREATE_DISCIPLINE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.CREATE_DISCIPLINE_SUCCESS:
            return {
                ...state,
                listDiscipline: [
                        ...state.listDiscipline,
                        action.newDiscipline.content
                    ],
                    isLoading: false,
            };
        case DisciplineConstants.CREATE_DISCIPLINE_FAILURE:
            return {
                error: action.error,
            };
        case DisciplineConstants.DELETE_DISCIPLINE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.DELETE_DISCIPLINE_SUCCESS:
            return {
                ...state,
                listDiscipline: state.listDiscipline.filter(Discipline => (Discipline._id !== action.disciplineDelete.content._id)),
                    isLoading: false,
            };
        case DisciplineConstants.DELETE_DISCIPLINE_FAILURE:
            return {
                error: action.error,
            };
        case DisciplineConstants.UPDATE_DISCIPLINE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.UPDATE_DISCIPLINE_SUCCESS:
            return {
                ...state,
                listDiscipline: state.listDiscipline.map(Discipline =>
                        (Discipline._id === action.infoDiscipline.content._id) ?
                        action.infoDiscipline.content : Discipline
                    ),
                    isLoading: false,
            };
        case DisciplineConstants.UPDATE_DISCIPLINE_FAILURE:
            return {
                error: action.error,
            };
            // reducer khen thưởng
        case DisciplineConstants.GET_PRAISE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.GET_PRAISE_SUCCESS:
            return {
                ...state,
                listPraise: action.listPraise.content.listPraise,
                    totalListPraise: action.listPraise.content.totalList,
                    isLoading: false,
            };
        case DisciplineConstants.GET_PRAISE_FAILURE:
            return {
                error: action.error,
            };
        case DisciplineConstants.CREATE_PRAISE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.CREATE_PRAISE_SUCCESS:
            return {
                ...state,
                listPraise: [
                        ...state.listPraise,
                        action.newPraise.content
                    ],
                    isLoading: false,
            };
        case DisciplineConstants.CREATE_PRAISE_FAILURE:
            return {
                error: action.error,
            };
        case DisciplineConstants.DELETE_PRAISE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.DELETE_PRAISE_SUCCESS:
            return {
                ...state,
                listPraise: state.listPraise.filter(Praise => (Praise._id !== action.praiseDelete.content._id)),
                    isLoading: false,
            };
        case DisciplineConstants.DELETE_PRAISE_FAILURE:
            return {
                error: action.error,
            };
        case DisciplineConstants.UPDATE_PRAISE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.UPDATE_PRAISE_SUCCESS:
            return {
                ...state,
                listPraise: state.listPraise.map(Praise =>
                        (Praise._id === action.infoPraise.content._id) ?
                        action.infoPraise.content : Praise
                    ),
                    isLoading: false,
            };
        case DisciplineConstants.UPDATE_PRAISE_FAILURE:
            return {
                error: action.error,
            };
        default:
            return state
    }
}