import { homeConstants } from "./constants";
import { homeServices } from "./services";

export const homeActions = {
    getNewsfeed,
    receiveNewsFeed
};


/** Lấy tập KPI cá nhân hiện tại */
function getNewsfeed(data) {
    return dispatch => {
        dispatch({ type: homeConstants.GET_NEWSFEED_REQUEST });

        homeServices.getNewsfeed(data)
            .then(res => {
                dispatch({
                    type: homeConstants.GET_NEWSFEED_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: homeConstants.GET_NEWSFEED_FAILURE,
                    payload: error
                })
            })
    }
}

/** Lấy dữ liệu realtime */
function receiveNewsFeed(data) {
    return dispatch => dispatch({ 
        type: homeConstants.RECEIVE_NEWSFEED_SUCCESS,
        payload: data 
    });
}
