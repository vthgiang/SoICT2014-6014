import { materialManagerConstants } from './constants';

const initState = {
    isLoading: false,
    totalList: '',
    totalAllMaterial: '',

    listMaterials: [],
    listAllMaterials: [],
    error: '',
}

export function materials(state = initState, action) {
    switch (action.type) {
        case materialManagerConstants.GETALL_MATERIAL_REQUEST:
        case materialManagerConstants.CREATE_MATERIAL_REQUEST:
        case materialManagerConstants.DELETE_MATERIAL_REQUEST:
        case materialManagerConstants.UPDATE_MATERIAL_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case materialManagerConstants.GETALL_MATERIAL_SUCCESS:
            if (action.payload.totalList !== undefined) {
                return {
                    ...state,
                    listMaterials: action.payload.data,
                    totalList: action.payload.totalList,
                    isLoading: false
                };

            } else {
                return {
                    ...state,

                    totalAllMaterial: action.payload.totalAllMaterial !== undefined ?
                        action.payload.totalAllMaterial : state.totalAllMaterial,

                    listAllMaterials: action.payload.listAllMaterials !== undefined ?
                        action.payload.listAllMaterials : state.listAllMaterials,

                    isLoading: false
                }
            }
        case materialManagerConstants.GETALL_MATERIAL_FAILURE:
        case materialManagerConstants.CREATE_MATERIAL_FAILURE:
        case materialManagerConstants.DELETE_MATERIAL_FAILURE:
        case materialManagerConstants.UPDATE_MATERIAL_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case materialManagerConstants.CREATE_MATERIAL_SUCCESS:
            return {
                ...state,
                listMaterials: [...state.listAllMaterials, ...action.payload.materials],
                isLoading: false
            }
        case materialManagerConstants.UPDATE_MATERIAL_SUCCESS:
            return {
                ...state,
                listMaterials: state.listMaterials.map(x => x.materials._id === action.payload.materials._id ? action.payload : x),
                isLoading: false
            }
        case materialManagerConstants.DELETE_MATERIAL_SUCCESS:
            return {
                ...state,
                listMaterials: state.listMaterials.filter(x => (x.materials._id !== action.payload._id)),
                isLoading: false
            }
        default:
            return state
    }
}