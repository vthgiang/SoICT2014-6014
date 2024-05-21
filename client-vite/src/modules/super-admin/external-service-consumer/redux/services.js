import { sendRequest } from "../../../../helpers/requestHelper";

export const ExternalServiceConsumerServices = {
    getExternalServiceConsumers,
    createExternalServiceConsumer,
    editExternalServiceConsumer,
    deleteExternalServiceConsumer,
};

const EXTERNAL_SERVICE_CONSUMER_BASE_API_URL = `${process.env.REACT_APP_SERVICE_IDENTITY_SERVER}/authorization/external-service-consumers`;

function getExternalServiceConsumers(params) {
    const { name, description, page, perPage } = params;

    return sendRequest({
        url: `${EXTERNAL_SERVICE_CONSUMER_BASE_API_URL}/external-service-consumers`,
        method: 'GET',
        params: {
            name,
            description,
            page,
            perPage,
        }
    }, false, true, 'super_admin.external_service_consumer');
}

function createExternalServiceConsumer(data) {
    return sendRequest({
        url: `${EXTERNAL_SERVICE_CONSUMER_BASE_API_URL}/external-service-consumers`,
        method: 'POST',
        data: data
    }, true, true, 'super_admin.external_service_consumer');
}

function editExternalServiceConsumer (serviceIdentityId, data) {
    return sendRequest({
        url: `${EXTERNAL_SERVICE_CONSUMER_BASE_API_URL}/external-service-consumers/${serviceIdentityId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'super_admin.external_service_consumer');
}

function deleteExternalServiceConsumer(serviceIdentityId) {
    return sendRequest({
        url: `${EXTERNAL_SERVICE_CONSUMER_BASE_API_URL}/external-service-consumers/${serviceIdentityId}`,
        method: 'DELETE',
    }, true, true, 'super_admin.external_service_consumer');
}
