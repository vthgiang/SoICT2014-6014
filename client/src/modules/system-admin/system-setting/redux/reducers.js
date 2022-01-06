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
        list: [],
        config: {}
    },
    isLoading: false
}

export function systemSetting(state = initState, action) {
    var index = -1;
    switch (action.type) {
        case SystemSettingConstants.GET_BACKUPS_REQUEST:
        case SystemSettingConstants.GET_CONFIG_BACKUP_REQUEST:
        case SystemSettingConstants.CREATE_BACKUP_REQUEST:
        case SystemSettingConstants.CONFIG_BACKUP_REQUEST:
        case SystemSettingConstants.DELETE_BACKUP_REQUEST:
        case SystemSettingConstants.EDIT_BACKUP_INFO_REQUEST:
        case SystemSettingConstants.DOWNLOAD_BACKUP_VERSION_REQUEST:
        case SystemSettingConstants.RESTORE_REQUEST:
        case SystemSettingConstants.UPLOAD_BACKUP_FILE_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        
        case SystemSettingConstants.GET_BACKUPS_FAILURE:        
        case SystemSettingConstants.GET_CONFIG_BACKUP_FAILURE:
        case SystemSettingConstants.CONFIG_BACKUP_FAILURE:
        case SystemSettingConstants.CREATE_BACKUP_FAILURE:
        case SystemSettingConstants.DELETE_BACKUP_FAILURE:
        case SystemSettingConstants.EDIT_BACKUP_INFO_FAILURE:
        case SystemSettingConstants.DOWNLOAD_BACKUP_VERSION_FAILURE:
        case SystemSettingConstants.DOWNLOAD_BACKUP_VERSION_SUCCESS: 
        case SystemSettingConstants.RESTORE_FAILURE:
        case SystemSettingConstants.UPLOAD_BACKUP_FILE_FAILURE:
            return {
                ...state,
                isLoading: false
            }

        case SystemSettingConstants.GET_BACKUPS_SUCCESS:
            return {
                ...state,
                backup: {
                    ...state.backup,
                    list: action.payload
                },
                isLoading: false
            }

        case SystemSettingConstants.GET_CONFIG_BACKUP_SUCCESS:

            state.backup.config = action.payload;
            return {
                ...state,
                isLoading: false
            }

        case SystemSettingConstants.CREATE_BACKUP_SUCCESS:
            return {
                ...state,
                backup: {
                    ...state.backup,
                    list: [
                        action.payload,
                        ...state.backup.list
                    ]
                },
                isLoading: false
            }

        case SystemSettingConstants.CONFIG_BACKUP_SUCCESS:
            return {
                ...state,
                isLoading: false
            }

        case SystemSettingConstants.DELETE_BACKUP_SUCCESS:
            index = findVersion(state.backup.list, action.payload);
            if(index !== -1){
                state.backup.list.splice(index, 1);
            }
            return {
                ...state,
                backup: {
                    ...state.backup
                },
                isLoading: false
            }

        case SystemSettingConstants.EDIT_BACKUP_INFO_SUCCESS: 
            let list = state.backup.list.map(node => {
                if(node.version === action.payload.version){
                    node.description = action.payload.data ? action.payload.data.description : node.description
                }

                return node;
            });

            return {
                ...state,
                backup: {
                    ...state.backup,
                    list
                },
                isLoading: false
            }
        case SystemSettingConstants.UPLOAD_BACKUP_FILE_SUCCESS:
            return {
                ...state,
                backup: {
                    ...state.backup,
                    list: action.payload
                },
                isLoading: false
            }
        default:
            return state;
    }
}