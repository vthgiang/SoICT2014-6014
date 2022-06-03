import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const BiddingContractService = {
    getListBiddingContract,
    createBiddingContract,
    editBiddingContract,
    deleteBiddingContract,
    createProjectByContract,
}
/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListBiddingContract(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-contracts/bidding-contract`,
        method: 'GET',
        params: {
            name: data.name,
            page: data.page,
            limit: data.limit
        }
    }, false, false, 'bidding.bidding_contract');
}

/**
 * Thêm mới hợp đồng
 * @data : Dữ liệu cần thêm 
 */
function createBiddingContract(data) {
    console.log(32, "sv client", data);
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-contracts/bidding-contract`,
        method: 'POST',
        data: data
    }, true, true, 'bidding.bidding_contract');
}

//=============EDIT===============

/**
 * Chỉnh sửa hợp đồng
 * @data : Dữ liệu
 */
function editBiddingContract(data, id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-contracts/bidding-contract/${id}`,
        method: 'PATCH',
        data: data
    }, true, true, 'bidding.bidding_contract');
}

// =============DELETE===============

/**
 * Xóa hợp đồng
 * @data : Dữ liệu xóa
 */
function deleteBiddingContract(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-contracts/bidding-contract/${data}`,
        method: 'DELETE',
        data: data
    }, true, true, 'bidding.bidding_contract');
}


//=============CREATE_PROJECT===============

/**
 * Tạo prj cho hợp đồng
 * @data : Dữ liệu
 */
function createProjectByContract(data, id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-contracts/bidding-contract/${id}/project/create-cpm`,
        method: 'POST',
        data: data
    }, true, true, 'bidding.bidding_contract');
}