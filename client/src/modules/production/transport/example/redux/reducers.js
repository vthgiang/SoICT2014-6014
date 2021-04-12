import { exampleConstants } from './constants';
const initialState = {
    lists: [],
    isLoading: true,
}
export function examples(state = initialState, action) {
switch (action.type) {
		case exampleConstants.GET_ALL_EXAMPLES_REQUEST:
		return {
                ...state,
                isLoading: true
            }
		
		case exampleConstants.GET_ALL_EXAMPLES_FAILURE:
		return {
                ...state,
                isLoading: false,
                error: action.error
            }
		case exampleConstants.GET_ALL_EXAMPLES_SUCCESS:
		return {
                ...state,
                lists: action.payload.data,
                isLoading: false
            }

		default:
            		return state
}
}
