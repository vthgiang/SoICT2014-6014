import { CategoryServices } from './services';
import { CategoryConstants } from './constants';

export const CategoryActions = {
    getCategories,
    createCategory,
    editCategory,
    deleteCategory
}

function getCategories(data = undefined) {
    if(data !== undefined){
        return dispatch => {
            dispatch({ type: CategoryConstants.PAGINATE_CATEGORY_REQUEST});
            CategoryServices.getCategories(data)
            .then(res => {
                dispatch({
                    type: CategoryConstants.PAGINATE_CATEGORY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CategoryConstants.PAGINATE_CATEGORY_FAILURE,
                    error: err
                })
            })
        }
    }
    return dispatch => {
        dispatch({ type: CategoryConstants.GETALL_CATEGORY_REQUEST});
        CategoryServices.getCategories()
        .then(res => {
            dispatch({
                type: CategoryConstants.GETALL_CATEGORY_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: CategoryConstants.GETALL_CATEGORY_FAILURE,
                error: err
            })
        })
    }
}

function createCategory(data){
    return dispatch => {
        dispatch({
            type: CategoryConstants.CREATE_CATEGORY_REQUEST
        });
        CategoryServices.createCategory(data)
        .then(res => {
            dispatch({
                type: CategoryConstants.CREATE_CATEGORY_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: CategoryConstants.CREATE_CATEGORY_FAILURE,
                error: err
            })
        })
    }
}

function editCategory(id, data){
    return dispatch => {
        dispatch({
            type: CategoryConstants.UPDATE_CATEGORY_REQUEST
        });
        CategoryServices.editCategory(id, data)
        .then(res => {
            dispatch({
                type: CategoryConstants.UPDATE_CATEGORY_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: CategoryConstants.UPDATE_CATEGORY_FAILURE,
                error: err
            })
        })
    }
}

function deleteCategory(id) {
    return dispatch => {
        dispatch({
            type: CategoryConstants.DELETE_CATEGORY_REQUEST
        });
        CategoryServices.deleteCategory(id)
        .then(res => {
            dispatch({
                type: CategoryConstants.DELETE_CATEGORY_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: CategoryConstants.DELETE_CATEGORY_FAILURE,
                error: err
            })
        })
    }
}