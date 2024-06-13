import { dispatch } from "d3";
import { transportationConstants } from "./constants";
import { DashboardService } from "./services";

const getOntimeDeliveryRate = () => {
    return (dispatch) => {
        dispatch({ type: transportationConstants.GET_ON_TIME_DELIVERY_RATE })
      DashboardService.getOntimeDeliveryRate()
        .then((response) => {
          dispatch({
            type: transportationConstants.GET_ON_TIME_DELIVERY_RATE_SUCCESS,
            payload: response.data.content
          })
        })
        .catch(() => {
          dispatch({
            type: transportationConstants.GET_ON_TIME_DELIVERY_RATE_FAILED
          })
        })
    }
}

export const DashboardActions = {getOntimeDeliveryRate}