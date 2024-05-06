import { ExternalServiceConsumerConstants } from "./constants";

const initState = {
    listExternalServiceConsumer: [],
}

export function externalServiceConsumers (state = initState, action) {
    switch (action.type) {
        case ExternalServiceConsumerConstants.GET_EXTERNAL_SERVICE_CONSUMER_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case ExternalServiceConsumerConstants.GET_EXTERNAL_SERVICE_CONSUMER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listExternalServiceConsumer: action.payload.data,
                totalExternalServiceConsumers: action.payload.totalExternalServiceConsumers,
                totalPages: action.payload.totalPages,
            };
        case ExternalServiceConsumerConstants.GET_EXTERNAL_SERVICE_CONSUMER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        case ExternalServiceConsumerConstants.CREATE_EXTERNAL_SERVICE_CONSUMER_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case ExternalServiceConsumerConstants.CREATE_EXTERNAL_SERVICE_CONSUMER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listExternalServiceConsumer: [action.payload, ...state.listExternalServiceConsumer]
            };
        case ExternalServiceConsumerConstants.CREATE_EXTERNAL_SERVICE_CONSUMER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        case ExternalServiceConsumerConstants.EDIT_EXTERNAL_SERVICE_CONSUMER_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case ExternalServiceConsumerConstants.EDIT_EXTERNAL_SERVICE_CONSUMER_SUCCESS:
            let temp = state.listExternalServiceConsumer
            temp = temp?.map(item => {
                if (item?.id === action.payload?.id) {
                    return action.payload;
                }
                return item;
            })
            return {
                ...state,
                isLoading: false,
                listExternalServiceConsumer: temp
            };
            
        case ExternalServiceConsumerConstants.EDIT_EXTERNAL_SERVICE_CONSUMER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        case ExternalServiceConsumerConstants.DELETE_EXTERNAL_SERVICE_CONSUMER_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case ExternalServiceConsumerConstants.DELETE_EXTERNAL_SERVICE_CONSUMER_SUCCESS:
            let currentList = state.listExternalServiceConsumer
            for (let i = 0; i < currentList?.length; i++) {
                if (currentList?.[i]?.id === action.payload) {
                    currentList.splice(i, 1)
                }
            }
            return {
                ...state,
                isLoading: false,
                listExternalServiceConsumer: currentList
            };
        case ExternalServiceConsumerConstants.DELETE_EXTERNAL_SERVICE_CONSUMER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        default:
            return state;
    }
}