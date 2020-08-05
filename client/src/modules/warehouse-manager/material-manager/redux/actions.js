import { materialManagerConstants } from './constants';
import { materialManagerServices} from './services';

export const materialManagerActions = {
    getAll,
    createMaterial,
    updateMaterial,
    deleteMaterial
}

function getAll(data){
    return dispatch => {
        dispatch({
            type: materialManagerConstants.GETALL_MATERIAL_REQUEST
        });

        materialManagerServices.getAll(data)
            .then(res => {
                dispatch({
                    type: materialManagerConstants.GETALL_MATERIAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: materialManagerConstants.GETALL_MATERIAL_FAILURE,
                    error
                })
            });
    };
}

function createMaterial(data) {
    return dispatch => {
        dispatch({
            type: materialManagerConstants.CREATE_MATERIAL_REQUEST
        });
        materialManagerServices.createMaterial(data)
            .then(res => {
                dispatch(getAll({
                    code: "",
                    materialName: "",
                    decsription: "",
                    cost: null,
                    page: 0,
                    limit: 5,
                }));
                dispatch({
                    type: materialManagerConstants.CREATE_MATERIAL_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: materialManagerConstants.CREATE_MATERIAL_FAILURE,
                    error: err
                });
            })
    }
}

function updateMaterial(id, data) {
    return dispatch => {
        dispatch({
            type: materialManagerConstants.UPDATE_MATERIAL_REQUEST,
        });
        materialManagerServices.updateMaterial(id, data)
            .then(res => {
                dispatch(getAll({
                    code: "",
                    materialName: "",
                    decsription: "",
                    cost: null,
                    page: 0,
                    limit: 5,
                }));
                dispatch({
                    type: materialManagerConstants.UPDATE_MATERIAL_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: materialManagerConstants.UPDATE_MATERIAL_FAILURE,
                    error: err
                })
            })
    }
}

function deleteMaterial(id){
    return dispatch => {
        dispatch({
            type: materialManagerConstants.DELETE_MATERIAL_REQUEST,
        });
        materialManagerServices.deleteMaterial(id)
            .then(res => {
                dispatch(getAll({
                    code: "",
                    materialName: "",
                    decsription: "",
                    cost: null,
                    page: 0,
                    limit: 5,
                }));
                dispatch({
                    type: materialManagerConstants.DELETE_MATERIAL_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: materialManagerConstants.DELETE_MATERIAL_FAILURE,
                    error: err
                })
            })
    }
}