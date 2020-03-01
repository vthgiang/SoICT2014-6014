import {handleResponse} from '../../../../helpers/HandleResponse';
export const overviewKpiServices = {
    getAllKPIPersonalByMember
};

// Lấy tất cả kpi cá nhân
function getAllKPIPersonalByMember(member) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`/kpipersonals/user/${member}`, requestOptions).then(handleResponse);
}


