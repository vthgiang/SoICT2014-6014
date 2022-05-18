import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const ContractService = {
    getListContract,
    createContract,
    editContract,
    deleteContract
}
/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListContract(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/contracts/contract`,
        method: 'GET',
        params: {
            name: data.name,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.contract');
}

/**
 * Thêm mới hợp đồng
 * @data : Dữ liệu cần thêm 
 */
function createContract(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/contracts/contract`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.contract');
}

//=============EDIT===============

/**
 * Chỉnh sửa hợp đồng
 * @data : Dữ liệu
 */
function editContract(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/contracts/contract/${data.contractId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'human_resource.contract');
}

// =============DELETE===============

/**
 * Xóa hợp đồng
 * @data : Dữ liệu xóa
 */
 function deleteContract(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/contracts/contract/${data}`,
        method: 'DELETE',
        data: data
    }, true, true, 'human_resource.contract');
}