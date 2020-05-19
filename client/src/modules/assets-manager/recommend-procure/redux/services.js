import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
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
        url: `${ LOCAL_SERVER_API }/recommendprocure/paginate`,
        method: 'POST',
        data: data
    }, false, true, 'asset.recommend_procure');
}

// tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createRecommendProcure(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommendprocure/create`,
        method: 'POST',
        data: data
    }, true, true, 'asset.recommend_procure');
}

// Xoá thông tin phiếu đề nghị mua sắm thiết bị
function deleteRecommendProcure(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommendprocure/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.recommend_procure');
}

// Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendProcure(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommendprocure/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.recommend_procure');
}