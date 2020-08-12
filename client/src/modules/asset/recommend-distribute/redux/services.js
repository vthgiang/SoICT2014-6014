import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
// import { AuthenticateHeader } from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';
export const RecommendDistributeService = {
    searchRecommendDistributes,
    createRecommendDistribute,
    updateRecommendDistribute,
    deleteRecommendDistribute,
}

// Lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendDistributes(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommenddistribute/recommend-distributes`,
        method: 'GET',
        params: {
            recommendNumber: data.recommendNumber,
            month: data.month,
            status: data.status,
            page: data.page,
            limit: data.limit,
        },
    }, false, true, 'asset.recommend_distribute');
}

// Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createRecommendDistribute(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommenddistribute/recommend-distributes`,
        method: 'POST',
        data: data
    }, true, true, 'asset.recommend_distribute');
}

// Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendDistribute(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommenddistribute/recommend-distributes/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.recommend_distribute');
}

// Xoá thông tin phiếu đề nghị mua sắm thiết bị
function deleteRecommendDistribute(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommenddistribute/recommend-distributes/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.recommend_distribute');
}