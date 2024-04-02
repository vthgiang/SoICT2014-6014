import { sendRequest } from '../../../../../helpers/requestHelper';

export const JourneyServices = {
    getJourneys,
    deleteJourney,
    createJourney,
    changeDrivers,
    getJourneysByCondition,
    updateJourney,
    getCostOfAllJourney
}

function getJourneys(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/journeys`,
            method: "GET",
            params: {
                journeyName: queryData?.journeyName ? queryData.journeyName : "",
                page: queryData?.page ? queryData.page : null,
                perPage: queryData?.perPage ? queryData.perPage : null
            }
        },
        false,
        true,
        "manage_journey"
    );
}

function getCostOfAllJourney(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/journeys/cost`,
            method: "GET",
            params: {
                page: queryData?.page ? queryData.page : null,
                perPage: queryData?.perPage ? queryData.perPage : null
            }
        },
        false,
        true,
        "manage_journey"
    );
}

function getJourneysByCondition(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/journeys/search`,
            method: "GET",
            params: queryData
        },
        false,
        true,
        "manage_journey"
    );
}

function deleteJourney(journeyId) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/journeys/${journeyId}`,
            method: "DELETE",
        },
        true,
        true,
        "manage_journey"
    )
}

function createJourney(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/journeys`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_journey"
    )
}

function changeDrivers(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/journeys/${id}/change-drivers`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_journey"
    )
}

function updateJourney(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/journeys/update/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_journey"
    )
}