import { JourneyConstants } from './constants';
import { JourneyServices } from './services';

export const JourneyActions = {
    getJourneys,
    deleteJourney,
    createJourney,
    changeDrivers,
    getJourneysByCondition,
    updateJourney,
    refreshJourneyData,
    getCostOfAllJourney,
}

function getJourneys(queryData) {
    return (dispatch) => {
        dispatch({
            type: JourneyConstants.GET_ALL_JOURNEYS_REQUEST
        });

        JourneyServices
            .getJourneys(queryData)
            .then((res) => {
                dispatch({
                    type: JourneyConstants.GET_ALL_JOURNEYS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: JourneyConstants.GET_ALL_JOURNEYS_FAILURE,
                    error
                });
            });
    }
}

function getCostOfAllJourney(data) {
    return (dispatch) => {
        dispatch({
            type: JourneyConstants.GET_COST_OF_ALL_JOURNEYS_REQUEST
        });

        JourneyServices
            .getCostOfAllJourney(data)
            .then((res) => {
                dispatch({
                    type: JourneyConstants.GET_COST_OF_ALL_JOURNEYS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: JourneyConstants.GET_COST_OF_ALL_JOURNEYS_FAILURE,
                    error
                });
            });
    }
}

function getJourneysByCondition(queryData) {
    return (dispatch) => {
        dispatch({
            type: JourneyConstants.GET_ALL_JOURNEYS_REQUEST
        });

        JourneyServices
            .getJourneysByCondition(queryData)
            .then((res) => {
                dispatch({
                    type: JourneyConstants.GET_ALL_JOURNEYS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: JourneyConstants.GET_ALL_JOURNEYS_FAILURE,
                    error
                });
            });
    }
}

function deleteJourney(journeyId) {
    return (dispatch) => {
        dispatch({
            type: JourneyConstants.DELETE_JOURNEY_REQUEST
        });

        JourneyServices
            .deleteJourney(journeyId)
            .then((res) => {
                dispatch({
                    type: JourneyConstants.DELETE_JOURNEY_SUCCESS,
                    payload: res.data.content,
                    journeyId: journeyId
                });
            })
            .catch((error) => {
                dispatch({
                    type: JourneyConstants.DELETE_JOURNEY_FAILURE,
                    error
                });
            });
    }
}

function createJourney(data) {
    return (dispatch) => {
        dispatch({
            type: JourneyConstants.CREATE_JOURNEY_REQUEST
        });
        JourneyServices
            .createJourney(data)
            .then((res) => {
                dispatch({
                    type: JourneyConstants.CREATE_JOURNEY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: JourneyConstants.CREATE_JOURNEY_FAILURE,
                    error
                });
            });
    }
}

function changeDrivers(id, data) {
    return (dispatch) => {
        dispatch({
            type: JourneyConstants.EDIT_JOURNEY_REQUEST
        });
        JourneyServices
            .changeDrivers(id, data)
            .then((res) => {
                dispatch({
                    type: JourneyConstants.EDIT_JOURNEY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: JourneyConstants.EDIT_JOURNEY_FAILURE,
                    error
                });
            });
    }
}

function updateJourney(id, data) {
    return (dispatch) => {
        dispatch({
            type: JourneyConstants.EDIT_JOURNEY_REQUEST
        });
        JourneyServices
            .updateJourney(id, data)
            .then((res) => {
                dispatch({
                    type: JourneyConstants.EDIT_JOURNEY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: JourneyConstants.EDIT_JOURNEY_FAILURE,
                    error
                });
            });
    }
}

function refreshJourneyData(refreshJourneyData) {
    return (dispatch) => {
        dispatch({
            type: JourneyConstants.REFRESH_JOURNEY_DATA,
            payload: refreshJourneyData
        });
    }
}