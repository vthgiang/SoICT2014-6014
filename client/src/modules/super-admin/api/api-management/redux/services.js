import { sendRequest } from '../../../../../helpers/requestHelper';

export const ApiServices = {
    getApis
};

/** Lấy các system api */
function getApis(params) {
    const { path, method, description, page, perPage, special } = params

    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/api/companies`,
        method: 'GET',
        params: {
            path,
            method,
            description,
            page, 
            perPage,
            special
        }
    }, false, true, 'super-admin.api');
}

