import {handleResponse} from '../../../../../helpers/handleResponse';
import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage,AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
import { sendRequest } from '../../../../../helpers/requestHelper';
export const kpiMemberServices = {
};