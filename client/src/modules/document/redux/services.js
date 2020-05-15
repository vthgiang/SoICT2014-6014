import { LOCAL_SERVER_API } from '../../../env';
import { sendRequest } from '../../../helpers/requestHelper';

export const DocumentServices = {
    getDocumentTypes,
    createDocumentType,
};

function getDocumentTypes() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/types`,
        method: 'GET',
    }, false, true, 'document');
}

function createDocumentType(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/types`,
        method: 'POST',
        data,
    }, false, true, 'document');
}
