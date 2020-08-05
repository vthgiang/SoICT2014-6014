// import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
// import { AuthenticateHeader } from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';
export const RecommendDistributeService = {
    searchRecommendDistributes,
    // createRecommendDistribute,
    // deleteRecommendDistribute,
    updateRecommendDistribute,
}

// Lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendDistributes(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommenddistribute/paginate`,
        method: 'POST',
        data: data
    }, false, true, 'asset.recommend_distribute');
}

// // tạo mới thông tin phiếu đề nghị mua sắm thiết bị
// function createRecommendDistribute(data) {
//     return sendRequest({
//         url: `${ LOCAL_SERVER_API }/recommenddistribute/create`,
//         method: 'POST',
//         data: data
//     }, true, true, 'asset.recommend_distribute');
// }

// Xoá thông tin phiếu đề nghị mua sắm thiết bị
function deleteRecommendDistribute(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommenddistribute/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.recommend_distribute');
}

// Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendDistribute(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/recommenddistribute/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.recommend_distribute');
}