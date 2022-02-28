import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const BiddingPackageService = {
    getListBiddingPackage,
    createBiddingPackage,
    editBiddingPackage,
    deleteBiddingPackage,
}

// =============GET=================

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListBiddingPackage(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bidding-packages/bidding-packages`,
        method: 'GET',
        params: {
            name: data.name,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.bidding-package');
}
// =============CREATE=================

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu 
 */
function createBiddingPackage(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bidding-packages/bidding-packages`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.bidding-package');
}

//=============EDIT===============

/**
 * Chỉnh sửa vị trí cv
 * @data : Dữ liệu
 */
function editBiddingPackage(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bidding-packages/bidding-packages/${data.biddingPackageId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'human_resource.bidding-package');
}

// =============DELETE===============

/**
 * Xóa lĩnh vực cv
 * @data : Dữ liệu xóa
 */
function deleteCareerField(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bidding-packages/career-fields`,
        method: 'DELETE',
        data: data
    }, true, true, 'human_resource.bidding-package');
}

/**
 * Xóa lĩnh vực cv
 * @data : Dữ liệu xóa
 */
function deleteBiddingPackage(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bidding-packages/bidding-packages`,
        method: 'DELETE',
        data: data
    }, true, true, 'human_resource.bidding-package');
}
