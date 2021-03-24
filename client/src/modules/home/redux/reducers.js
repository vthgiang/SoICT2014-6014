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
        case homeConstants.CREATE_COMMENT_REQUEST:
            return {
                ...state,
                adding: true
            }
        case homeConstants.CREATE_COMMENT_SUCCESS:
            let newsFeed = state.newsFeed?.length > 0 && state.newsFeed.map(item => {
                if (item?._id === action.newsFeedId) {
                    item.comments = action.payload
                    return item
                } else return item
            })
            return {
                ...state,
                newsFeed: newsFeed
            }
        case homeConstants.CREATE_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case homeConstants.EDIT_COMMENT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case homeConstants.EDIT_COMMENT_SUCCESS:
            newsFeed = state.newsFeed?.length > 0 && state.newsFeed.map(item => {
                if (item?._id === action.newsFeedId) {
                    item.comments = action.payload
                    return item
                } else return item
            })

            return {
                ...state,
                newsFeed: newsFeed
            }
        case homeConstants.EDIT_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case homeConstants.DELETE_COMMENT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case homeConstants.DELETE_COMMENT_SUCCESS:
            newsFeed = state.newsFeed?.length > 0 && state.newsFeed.map(item => {
                if (item?._id === action.newsFeedId) {
                    item.comments = action.payload
                    return item
                } else return item
            })

            return {
                ...state,
                newsFeed: newsFeed
            }
        case homeConstants.DELETE_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case homeConstants.DELETE_FILE_COMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case homeConstants.DELETE_FILE_COMMENT_SUCCESS:
            newsFeed = state.newsFeed?.length > 0 && state.newsFeed.map(item => {
                if (item?._id === action.newsFeedId) {
                    item.comments = action.payload
                    return item
                } else return item
            })

            return {
                ...state,
                newsFeed: newsFeed
            }
        case homeConstants.DELETE_FILE_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        default: 
            return state
    }
}