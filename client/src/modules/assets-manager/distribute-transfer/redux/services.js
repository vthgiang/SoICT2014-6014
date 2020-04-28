import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
export const DistributeTransferService = {
    searchDistributeTransfers,
    createNewDistributeTransfer,
    deleteDistributeTransfer,
    updateDistributeTransfer,
}

// Lấy danh sách cấp phát - điều chuyển - thu hồi
function searchDistributeTransfers(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/distributetransfer/paginate`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// tạo mới thông tin cấp phát - điều chuyển - thu hồi
function createNewDistributeTransfer(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/distributetransfer/create`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Xoá thông tin cấp phát - điều chuyển - thu hồi
function deleteDistributeTransfer(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/distributetransfer/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Cập nhật thông tin cấp phát - điều chuyển - thu hồi
function updateDistributeTransfer(id, data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/distributetransfer/${id}`,
        method: 'PUT',
        data:data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}