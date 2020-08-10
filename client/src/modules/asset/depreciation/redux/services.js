import {LOCAL_SERVER_API} from '../../../../env';
import {sendRequest} from '../../../../helpers/requestHelper';

export const DepreciationService = {
    updateDepreciation,
}

// chỉnh sửa thông tin khấu hao tài sản
function updateDepreciation(assetId, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/assets/${assetId}/depreciations`,
        method: 'PATCH',
        data
    }, true, true, 'asset.depreciation');
}

