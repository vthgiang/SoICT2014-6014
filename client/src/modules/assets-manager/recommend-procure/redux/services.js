import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
export const RecommendProcureService = {
    searchRecommendProcures,
    createRecommendProcure,
    deleteRecommendProcure,
    updateRecommendProcure,
}

// Lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendProcures(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/recommendprocure/paginate`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createRecommendProcure(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/recommendprocure/create`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Xoá thông tin phiếu đề nghị mua sắm thiết bị
function deleteRecommendProcure(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/recommendprocure/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendProcure(id, data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/recommendprocure/${id}`,
        method: 'PUT',
        data:data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}