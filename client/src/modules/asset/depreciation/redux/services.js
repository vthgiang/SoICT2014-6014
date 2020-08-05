import {LOCAL_SERVER_API} from '../../../../env';
import {sendRequest} from '../../../../helpers/requestHelper';

export const DepreciationService = {
    updateDepreciation,
}

// chỉnh sửa thông tin khấu hao tài sản
function updateDepreciation(assetId, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/updateDepreciation/${assetId}`,
        method: 'PUT',
        data
    }, true, true, 'asset.depreciation');
}
