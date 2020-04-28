import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
export const RepairUpgradeService = {
    searchRepairUpgrades,
    createNewRepairUpgrade,
    deleteRepairUpgrade,
    updateRepairUpgrade,
}

// Lấy danh sách sửa chữa - thay thế - nâng cấp
function searchRepairUpgrades(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/repairupgrade/paginate`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// tạo mới thông tin sửa chữa - thay thế - nâng cấp
function createNewRepairUpgrade(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/repairupgrade/create`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Xoá thông tin sửa chữa - thay thế - nâng cấp
function deleteRepairUpgrade(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/repairupgrade/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Cập nhật thông tin sửa chữa - thay thế - nâng cấp
function updateRepairUpgrade(id, data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/repairupgrade/${id}`,
        method: 'PUT',
        data:data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}