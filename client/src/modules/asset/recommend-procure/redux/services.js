import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
export const RecommendProcureService = {
    searchRecommendProcures,
    createRecommendProcure,
    deleteRecommendProcure,
    updateRecommendProcure,
}

// Lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendProcures(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommendprocure/recommend-procurements`,
        method: 'GET',
        params: {
            recommendNumber: data.recommendNumber,
            month: data.month,
            status: data.status,
            page: data.page,
            limit: data.limit,
        },
    }, false, true, 'asset.recommend_procure');
}

// tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createRecommendProcure(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommendprocure/recommend-procurements`,
        method: 'POST',
        data: data
    }, true, true, 'asset.recommend_procure');
}

// Xoá thông tin phiếu đề nghị mua sắm thiết bị
function deleteRecommendProcure(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommendprocure/recommend-procurements/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.recommend_procure');
}

// Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendProcure(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommendprocure/recommend-procurements/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.recommend_procure');
}