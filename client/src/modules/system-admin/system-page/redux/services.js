import { sendRequest } from '../../../../helpers/requestHelper';

/** Lấy các system page api */
const getSystemPageApis = (params) => {
    /**
     * params contain pageUrl and  perPage
     */

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system-admin/system-page/apis`,
        method: 'GET',
        params,
    }, false, true, 'system_admin.system_page');
}

export const SystemPageServices = {
    getSystemPageApis,
};
