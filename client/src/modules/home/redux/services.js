import { sendRequest } from '../../../helpers/requestHelper';

export const homeServices = {
    getNewsfeed
};

/** Lấy tập KPI cá nhân hiện tại */
function getNewsfeed(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/news-feed/news-feeds`,
        method: 'GET',
        params: {
            currentNewsfeed: data?.currentNewsfeed
        }
    }, false, true);
}