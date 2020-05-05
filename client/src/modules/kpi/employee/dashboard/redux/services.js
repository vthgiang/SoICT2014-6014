import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage, AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import {handleResponse} from '../../../../../helpers/handleResponse';
export const dashboardEmployeeKpiSetService = {
};
