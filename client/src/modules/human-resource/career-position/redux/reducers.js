// import {
//     CareerPositionConstant
// } from './constants';

// const initState = {
//     isLoading: false,
//     totalList: 0,
//     listPosition: [],
//     error: '',
// }

// export function career(state = initState, action) {
//     switch (action.type) {
//         case CareerPositionConstant.GET_CAREER_POSITION_REQUEST:
//         case CareerPositionConstant.CREATE_CAREER_POSITION_REQUEST:
//         case CareerPositionConstant.DELETE_CAREER_POSITION_REQUEST:
//         case CareerPositionConstant.UPDATE_CAREER_POSITION_REQUEST:

//         case CareerPositionConstant.GET_CAREER_FIELD_REQUEST:
//         case CareerPositionConstant.CREATE_CAREER_FIELD_REQUEST:
//         case CareerPositionConstant.DELETE_CAREER_FIELD_REQUEST:
//         case CareerPositionConstant.UPDATE_CAREER_FIELD_REQUEST:

//         case CareerPositionConstant.GET_CAREER_ACTION_REQUEST:
//         case CareerPositionConstant.CREATE_CAREER_ACTION_REQUEST:
//         case CareerPositionConstant.DELETE_CAREER_ACTION_REQUEST:
//         case CareerPositionConstant.UPDATE_CAREER_ACTION_REQUEST:
//             return {
//                 ...state,
//                 isLoading: true,
//             };
//         case CareerPositionConstant.GET_CAREER_POSITION_SUCCESS:
//             return {
//                 ...state,
//                 isLoading: false,
//                 listPosition: action.payload.listPosition !== undefined ? action.payload.listPosition : [],
//                 totalListPost: action.payload.totalList,
//             };

//         case CareerPositionConstant.GET_CAREER_FIELD_SUCCESS:
//             return {
//                 ...state,
//                 isLoading: false,
//                 listField: action.payload.listField !== undefined ? action.payload.listField : [],
//                 totalListField: action.payload.totalList,
//             };

//         case CareerPositionConstant.GET_CAREER_ACTION_SUCCESS:
//             return {
//                 ...state,
//                 isLoading: false,
//                 listAction: action.payload.listAction !== undefined ? action.payload.listAction : [],
//                 totalListAction: action.payload.totalList,
//             };
//         // case CareerPositionConstant.CREATE_CAREER_POSITION_SUCCESS:
//         //     return {
//         //         ...state,
//         //         isLoading: false,
//         //             listDisciplines: [...state.listDisciplines, action.payload]
//         //     };
//         // case CareerPositionConstant.DELETE_CAREER_POSITION_SUCCESS:
//         //     return {
//         //         ...state,
//         //         isLoading: false,
//         //             listDisciplines: state.listDisciplines.filter(discipline => (discipline._id !== action.payload._id))
//         //     };
//         // case CareerPositionConstant.UPDATE_CAREER_POSITION_SUCCESS:
//         //     return {
//         //         ...state,
//         //         isLoading: false,
//         //             listDisciplines: state.listDisciplines.map(discipline => (discipline._id === action.payload._id) ? action.payload : discipline)
//         //     };
//         case CareerPositionConstant.GET_CAREER_POSITION_FAILURE:
//         case CareerPositionConstant.CREATE_CAREER_POSITION_FAILURE:
//         case CareerPositionConstant.DELETE_CAREER_POSITION_FAILURE:
//         case CareerPositionConstant.UPDATE_CAREER_POSITION_FAILURE:

//         case CareerPositionConstant.GET_CAREER_FIELD_FAILURE:
//         case CareerPositionConstant.CREATE_CAREER_FIELD_FAILURE:
//         case CareerPositionConstant.DELETE_CAREER_FIELD_FAILURE:
//         case CareerPositionConstant.UPDATE_CAREER_FIELD_FAILURE:

//         case CareerPositionConstant.GET_CAREER_ACTION_FAILURE:
//         case CareerPositionConstant.CREATE_CAREER_ACTION_FAILURE:
//         case CareerPositionConstant.DELETE_CAREER_ACTION_FAILURE:
//         case CareerPositionConstant.UPDATE_CAREER_ACTION_FAILURE:
//             return {
//                 ...state,
//                 isLoading: false,
//                 error: action.error
//             };
//         default:
//             return state;
//     }
// }