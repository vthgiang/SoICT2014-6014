import {
    DisciplineConstants
} from './constants';

export function Discipline(state = {}, action) {
    switch (action.type) {
        case DisciplineConstants.GET_DISCIPLINE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.GET_DISCIPLINE_SUCCESS:
            return {
                ...state,
                listDiscipline: action.listDiscipline.content,
                    isLoading: false,
            };
        case DisciplineConstants.GET_DISCIPLINE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
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
                    isLoading: false,
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
                    isLoading: false,
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
                        (Discipline.employee.employeeNumber === action.infoDiscipline.content.employee.employeeNumber &&
                            Discipline.number === action.infoDiscipline.content.number) ?
                        action.infoDiscipline.content : Discipline
                    ),
                    isLoading: false,
            };
        case DisciplineConstants.UPDATE_DISCIPLINE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
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
                listPraise: action.listPraise.content,
                    isLoading: false,
            };
        case DisciplineConstants.GET_PRAISE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
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
                    isLoading: false,
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
                    isLoading: false,
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
                        (Praise.employee.employeeNumber === action.infoPraise.content.employee.employeeNumber &&
                            Praise.number === action.infoPraise.content.number) ?
                        action.infoPraise.content : Praise
                    ),
                    isLoading: false,
            };
        case DisciplineConstants.UPDATE_PRAISE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        default:
            return state
    }
}