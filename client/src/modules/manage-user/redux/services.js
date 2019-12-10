import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../config';
import {reactLocalStorage} from 'reactjs-localstorage';
const company = reactLocalStorage.getObject('company');

export const UserServices = {
    get
};

function get() {
    console.log("company: ", company._id);
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/company/${company._id}`,
        method: 'GET',
        data: { company: company._id }
    };

    return axios(requestOptions);
}