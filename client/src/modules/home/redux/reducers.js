import { homeConstants } from "./constants";

let initState = {
    newsfeed: []
}
export function newsFeeds(state = initState, action) {
    switch (action.type) {
        case homeConstants.GET_NEWSFEED_REQUEST:
            return {
                ...state,
                newsfeedLoading: true
            }
        case homeConstants.GET_NEWSFEED_SUCCESS:
            return {
                ...state,
                newsfeedLoading: false,
                newsfeed: [...state.newsfeed, ...action.payload]
            }
        case homeConstants.GET_NEWSFEED_FAILURE:
            return {
                ...state,
                newsfeedLoading: false,
                error: action.payload
            }
        default: 
            return state
    }
}