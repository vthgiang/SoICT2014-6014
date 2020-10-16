import { formatRange } from '@fullcalendar/react';
import { worksConstants } from './constants';
import { worksServices } from './services';

export const worksActions = {
    getAllManufacturingWorks,
}

function getAllManufacturingWorks(queryData) {
    return (dispatch) => {
        dispatch({
            type: worksConstants.GET_ALL_WORKS_REQUEST
        });
        worksServices.getAllManufacturingWorks(queryData)
            .then((res) => {
                dispatch({
                    type: worksConstants.GET_ALL_WORKS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: worksConstants.GET_ALL_WORKS_FAILURE,
                    error
                })
            });

    }
}