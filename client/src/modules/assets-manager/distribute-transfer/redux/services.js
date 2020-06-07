import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
export const DistributeTransferService = {
    searchDistributeTransfers,
    createNewDistributeTransfer,
    deleteDistributeTransfer,
    updateDistributeTransfer,
}

// Lấy danh sách cấp phát - điều chuyển - thu hồi
function searchDistributeTransfers(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/distributetransfer/paginate`,
        method: 'POST',
        data: data
    }, false, true, 'asset.distribute_transfer');
}

// tạo mới thông tin cấp phát - điều chuyển - thu hồi
function createNewDistributeTransfer(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/distributetransfer/create`,
        method: 'POST',
        data: data
    }, true, true, 'asset.distribute_transfer');
}

// Xoá thông tin cấp phát - điều chuyển - thu hồi
function deleteDistributeTransfer(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/distributetransfer/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.distribute_transfer');
}

// Cập nhật thông tin cấp phát - điều chuyển - thu hồi
function updateDistributeTransfer(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/distributetransfer/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.distribute_transfer');
}