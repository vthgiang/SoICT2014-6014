import { exampleConstants } from './constants';
import { exampleServices } from './services';

export const exampleActions = {
    getExamples
}

function getExamples(queryData) {
    return (dispatch) => {
        dispatch({
            type: exampleConstants.GET_ALL_EXAMPLES_REQUEST
        });

        exampleServices
            .getExamples(queryData)
            .then((res) => {
                dispatch({
                    type: exampleConstants.GET_ALL_EXAMPLES_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: exampleConstants.GET_ALL_EXAMPLES_FAILURE,
                    error
                });
            });
    }
}
