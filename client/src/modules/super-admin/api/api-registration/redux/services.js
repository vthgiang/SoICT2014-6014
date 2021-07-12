import { sendRequest } from '../../../../../helpers/requestHelper';

export const ApiRegistrationServices = {
    registerToUseApi,
    getApiRegistration
};

function registerToUseApi(data) {
    const { email, name, description, registrationApis } = data

    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/api/privilege-apis/register`,
        method: 'POST',
        data: {
            email,
            name,
            description,
            registrationApis
        }
    }, true, true, 'super-admin.api');
}

function getApiRegistration(data) {
    const { email, name, page, perPage } = data
    console.log("8888")
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/api/privilege-apis`,
        method: 'GET',
        params: {
            email,
            name,
            page,
            perPage
        }
    }, false, true, 'super-admin.api');
}



