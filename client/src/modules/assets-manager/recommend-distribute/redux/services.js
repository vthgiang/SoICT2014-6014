import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
export const RecommendDistributeService = {
    searchRecommendDistributes,
    createRecommendDistribute,
    deleteRecommendDistribute,
    updateRecommendDistribute,
}

// Lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendDistributes(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/recommenddistribute/paginate`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createRecommendDistribute(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/recommenddistribute/create`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Xoá thông tin phiếu đề nghị mua sắm thiết bị
function deleteRecommendDistribute(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/recommenddistribute/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendDistribute(id, data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/recommenddistribute/${id}`,
        method: 'PUT',
        data:data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}