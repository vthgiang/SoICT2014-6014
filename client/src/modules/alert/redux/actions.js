import { AlertConstants } from "./constants";

export const AlertActions = {
    reset
}

function reset(){
    return {
        type: AlertConstants.RESET_ALERT
    }
}