import {
    BiddingPackageConstant
} from "./constants";

import {
    BiddingPackageService
} from "./services";

const FileDownload = require("js-file-download");

export const BiddingPackageReduxAction = {
    downloadPackageDocument
};

function downloadPackageDocument(id) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstant.GET_DOCUMENT_REQUEST
        });

        BiddingPackageService.getBiddingPackageDocument(id)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstant.GET_DOCUMENT_SUCCESS,
                })
                const content = res.headers["content-type"];
                FileDownload(res.data, 'data', content);
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstant.GET_DOCUMENT_FAILURE,
                });
            })
    }
}