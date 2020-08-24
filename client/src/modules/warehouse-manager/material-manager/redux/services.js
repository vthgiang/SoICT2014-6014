import { sendRequest } from '../../../../helpers/requestHelper';

export const materialManagerServices = {
    getAll,
    createMaterial,
    deleteMaterial,
    updateMaterial
};

function getAll(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/materials`,
        method: 'GET',
        params:{
            materialName: data !== undefined ? data.materialName : data,
            code: data !== undefined ? data.code : data,
            page: data !== undefined ? data.page : data,
            limit: data !== undefined ? data.limit : data,
        }
    }, false, true, 'manage_warehouse.material_manager');
}

function createMaterial(data){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/materials`,
        method: 'POST',
        data: data
    }, true, true, 'manage_warehouse.material_manager');
}

function deleteMaterial(id){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/materials/${id}`,
        method: 'DELETE',
    }, true, true, 'manage_warehouse.material_manager');
}

function updateMaterial(id, data){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/materials/${id}`,
        method: 'PATCH',
        data: data
    }, true, true, 'manage_warehouse.material_manager')
}