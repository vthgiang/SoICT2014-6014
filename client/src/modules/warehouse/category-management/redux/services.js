import { sendRequest } from '../../../../helpers/requestHelper';

export const CategoryServices = {
    getCategories,
    getCategoriesByType,
    createCategory,
    editCategory,
    deleteCategory,
}

function getCategories(params){
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/categories`,
        method: 'GET',
        params,
    }, false, true, 'manage_warehouse.category_management');
}

function getCategoriesByType(params){
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/categories/by-type`,
        method: 'GET',
        params,
    }, false, true, 'manage_warehouse.category_management');
}

function createCategory(data){
    return sendRequest({
        url:`${ process.env.REACT_APP_SERVER }/categories`,
        method: 'POST',
        data,
    }, true, true, 'manage_warehouse.category_management');
}

function editCategory(id, data){
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/categories/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'manage_warehouse.category_management');
}

function deleteCategory(id){
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/categories/${id}`,
        method: 'DELETE'
    }, false, true, 'manage_warehouse.category_management')
}