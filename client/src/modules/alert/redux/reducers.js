import { AlertConstants } from "./constants";
import { clearStorage } from '../../../config';

const initState = {
    display: false
}

export function alert(state = initState, action) {

    switch (action.type) {
        case AlertConstants.ACCESS_DENIED:
            return {
                ...state,
                display: true
            };

        case AlertConstants.RESET_ALERT:
            clearStorage();
            return {
                ...state,
                display: false
            };

        default:
            return {
                ...state
            };
    }
}