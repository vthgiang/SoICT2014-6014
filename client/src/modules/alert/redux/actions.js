import { AlertConstants } from "./constants";

export const AlertActions = {
    reset
}

function reset(){
    return {
        type: 'RESET'
    }
}