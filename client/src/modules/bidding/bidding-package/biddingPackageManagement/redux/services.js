import {
    sendRequest
} from '../../../../../helpers/requestHelper';

export const BiddingPackageService = {
    getAll,
    addNewBiddingPackage,
    updateBiddingPackage,
    deleteBiddingPackage,
    importBiddingPackages,
    getDetailBiddingPackage,
    getDetailEditBiddingPackage,
    proposeEmployeeForTask,
}
/**
 * Lấy danh sách nhân viên
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAll(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-package/bidding-packages`,
        method: 'GET',
        params: {
            status: data ? data.status : data,
            type: data ? data.type : data,
            page: data ? data.page : data,
            limit: data ? data.limit : data,
            startDateSearch: data ? data.startDateSearch : data,
            endDateSearch: data ? data.endDateSearch : data,
            name: data ? data.nameSearch : data,
            code: data ? data.codeSearch : data,
        }
    }, false, true, 'human_resource.profile.bidding_package');
}

function getDetailBiddingPackage(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-package/bidding-packages/${id}`,
        method: 'GET',
        params: data
    }, false, true, 'human_resource.profile.bidding_package');
}

function getDetailEditBiddingPackage(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-package/bidding-packages/${id}/edit`,
        method: 'GET',
        params: data
    }, false, true, 'human_resource.profile.bidding_package');
}

/**
 * Lấy danh sách nhân viên
 * @param {*} data : dữ liệu key tìm kiếm
 */
function searchForPackage(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-package/bidding-packages`,
        method: 'GET',
        params: data,
    }, false, true, 'human_resource.profile.bidding_package');
}

/**
 * Thêm mới thông tin nhân viên
 * @param {*} data : dữ liệu thông tin nhân viên cần tạo
 */
function addNewBiddingPackage(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-package/bidding-packages`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.profile.bidding_package');
}

/**
 * Cập nhật thông tin nhân viên theo id
 * @param {*} id : id thông tin nhân viên cần chỉnh sửa
 * @param {*} data :dữ liệu chỉnh sửa thông tin nhân viên
 */
function updateBiddingPackage(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-package/bidding-packages/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'human_resource.profile.bidding_package');
}

/**
 * Xoá thông tin nhân viên
 * @id : id thông tin nhân viên cần xoá
 */
function deleteBiddingPackage(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-package/bidding-packages/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.profile.bidding_package');
}

/**
 * Import thông tin nhân viên
 * @param {*} data : dữ liệu thông tin nhân viên cần import
 */
function importBiddingPackages(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-package/bidding-packages/import`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.profile.bidding_package');
}

/**
 * đề xuất nhân sự cho cviec gói thầu
 * @param {*} data : dữ liệu
 */
function proposeEmployeeForTask(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/bidding-package//bidding-packages/:bidId/semi-auto-proposal`,
        method: 'POST',
        data: data,
        params: { bidId: id }
    }, false, false, 'human_resource.profile.bidding_package');
}
