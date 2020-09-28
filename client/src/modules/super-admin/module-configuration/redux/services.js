import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const ConfigurationServices = {
    getConfiguration,
};

function getConfiguration() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/configuration/configurations`,
        method: 'GET',
    }, false, true, 'super_admin.link');
};