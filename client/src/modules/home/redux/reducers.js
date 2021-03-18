import { homeConstants } from "./constants";

let initState = {
    newsFeed: []
}
export function newsFeeds(state = initState, action) {
    switch (action.type) {
        case homeConstants.GET_NEWSFEED_REQUEST:
            return {
                ...state,
                newsFeedLoading: true
            }
        case homeConstants.GET_NEWSFEED_SUCCESS:
            return {
                ...state,
                newsfeedLoading: false,
                newsFeed: [...state.newsFeed, ...action.payload]
            }
        case homeConstants.GET_NEWSFEED_FAILURE:
            return {
                ...state,
                newsfeedLoading: false,
                error: action.payload
            }
        
        case homeConstants.RECEIVE_NEWSFEED_SUCCESS:
            return {
                ...state,
                newsFeed: [action.payload, ...state.newsFeed]
            }
        default: 
            return state
    }
}