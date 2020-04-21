import {handleResponse} from '../../../../../helpers/handleResponse';
import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage,AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
export const kpiMemberServices = {
    getAllKPIMemberOfUnit,
    getAllKPIMemberByMember,
};
// Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị
function getAllKPIMemberOfUnit(infosearch) {
    console.log(infosearch);
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/kpimembers/all-member/${infosearch.role}/${infosearch.user}/${infosearch.status}/${infosearch.starttime}/${infosearch.endtime}`, requestOptions).then(handleResponse);
}
// Lấy tất cả kpi cá nhân
async function getAllKPIMemberByMember() {
    console.log("gọi API lấy tất cả kpi cá nhân");
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var member = verified._id;
    console.log("MEMBER: ", member)
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/kpimembers/user/${member}`, requestOptions).then(handleResponse);
}
