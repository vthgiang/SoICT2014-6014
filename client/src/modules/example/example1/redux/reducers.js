import { exampleConstants } from './constants';

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initialState = {
    lists: [],
    isLoading: true,
    error: null,
    totalList: 0,
}

export function example1(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case exampleConstants.GET_ALL_EXAMPLES_REQUEST:
        case exampleConstants.DELETE_EXAMPLE_REQUEST:
        case exampleConstants.CREATE_EXAMPLE_REQUEST:
        case exampleConstants.EDIT_EXAMPLE_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case exampleConstants.GET_ALL_EXAMPLES_FAILURE:
        case exampleConstants.DELETE_EXAMPLE_FAILURE:
        case exampleConstants.CREATE_EXAMPLE_FAILURE:
        case exampleConstants.EDIT_EXAMPLE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case exampleConstants.GET_ALL_EXAMPLES_SUCCESS:
            return {
                ...state,
                lists: action.payload.data,
                totalList: action.payload.totalList,
                isLoading: false
            }
        case exampleConstants.DELETE_EXAMPLE_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(example => !action.exampleIds.includes(example?._id)),
                isLoading: false
            }
        case exampleConstants.CREATE_EXAMPLE_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload
                ],
                isLoading: false
            }
        case exampleConstants.EDIT_EXAMPLE_SUCCESS:
            index = findIndex(state.lists, action.payload._id);
            if (index !== -1) {
                state.lists[index] = action.payload
            }
            return {
                ...state,
                isLoading: false
            }
        default:
            return state
    }
}