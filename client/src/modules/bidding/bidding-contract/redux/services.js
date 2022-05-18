import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const BiddingContractService = {
    getListBiddingContract,
    createBiddingContract,
    editBiddingContract,
    deleteBiddingContract
}
/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListBiddingContract(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bidding-contracts/bidding-contract`,
        method: 'GET',
        params: {
            name: data.name,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.bidding_contract');
}

/**
 * Thêm mới hợp đồng
 * @data : Dữ liệu cần thêm 
 */
function createBiddingContract(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bidding-contracts/bidding-contract`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.bidding_contract');
}

//=============EDIT===============

/**
 * Chỉnh sửa hợp đồng
 * @data : Dữ liệu
 */
function editBiddingContract(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bidding-contracts/bidding-contract/${data.contractId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'human_resource.bidding_contract');
}

// =============DELETE===============

/**
 * Xóa hợp đồng
 * @data : Dữ liệu xóa
 */
 function deleteBiddingContract(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bidding-contracts/bidding-contract/${data}`,
        method: 'DELETE',
        data: data
    }, true, true, 'human_resource.bidding_contract');
}