import { SystemSettingConstants } from "./constants";

var findVersion = (arrayVersion, version) => {
    var result = -1;
    arrayVersion.forEach((value, index) => {
        if(value.version === version){
            result = index;
        }
    });
    return result;
}

const initState = {
    backup: {
        isLoading: false
    },
    restore: {
        list: [],
        isLoading: false
    }
}

export function systemSetting(state = initState, action) {
    var index = -1;
    switch (action.type) {

        case SystemSettingConstants.SET_SCHEDULE_BACKUP_AUTOMATIC_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case SystemSettingConstants.SET_SCHEDULE_BACKUP_AUTOMATIC_SUCCESS:
            return {
                ...state,
                isLoading: false
            };

        case SystemSettingConstants.SET_SCHEDULE_BACKUP_AUTOMATIC_FAILE:
            return {
                ...state,
                isLoading: false
            };

        case SystemSettingConstants.CREATE_BACKUP_REQUEST:
            return {
                ...state,
                restore: {
                    ...state.restore,
                    isLoading: true
                }
            }

        case SystemSettingConstants.CREATE_BACKUP_SUCCESS:
            return {
                ...state,
                restore: {
                    ...state.restore,
                    list: [action.payload, ...state.restore.list],
                    isLoading: false
                }
            }

        case SystemSettingConstants.CREATE_BACKUP_FAILE:
            return {
                ...state,
                restore: {
                    ...state.restore,
                    isLoading: false
                }
            }

        case SystemSettingConstants.GET_RESTORE_DATA_REQUEST:
            return {
                ...state,
                restore: {
                    ...state.restore,
                    isLoading: true
                }
            }

        case SystemSettingConstants.GET_RESTORE_DATA_FAILE:
            return {
                ...state,
                restoreDB: {
                    ...state.restore,
                    isLoading: false
                }
            }

        case SystemSettingConstants.GET_RESTORE_DATA_SUCCESS:
            return {
                ...state,
                restore: {
                    ...state.restore,
                    list: action.payload,
                    isLoading: false
                }
            }

        case SystemSettingConstants.DELETE_BACKUP_REQUEST:
            return {
                ...state,
                restore: {
                    ...state.restore,
                    isLoading: true
                }
            }
        
        case SystemSettingConstants.DELETE_BACKUP_FAILE:
            return {
                ...state,
                restore: {
                    ...state.restore,
                    isLoading: false
                }
            }

        case SystemSettingConstants.DELETE_BACKUP_SUCCESS:
            index = findVersion(state.restore.list, action.payload);
            if(index !== -1){
                state.restore.list.splice(index, 1);
            }
            return {
                ...state,
                restore: {
                    ...state.restore,
                    isLoading: false
                }
            }

        default:
            return state;
    }
}