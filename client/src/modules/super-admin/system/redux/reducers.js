import { SystemConstants } from "./constants";

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

export function system(state = initState, action) {
    var index = -1;
    switch (action.type) {
        case SystemConstants.GET_BACKUPS_REQUEST:
        case SystemConstants.GET_CONFIG_BACKUP_REQUEST:
        case SystemConstants.CREATE_BACKUP_REQUEST:
        case SystemConstants.CONFIG_BACKUP_REQUEST:
        case SystemConstants.DELETE_BACKUP_REQUEST:
        case SystemConstants.EDIT_BACKUP_INFO_REQUEST:
        case SystemConstants.DOWNLOAD_BACKUP_VERSION_REQUEST:
        case SystemConstants.UPLOAD_BACKUP_FILE_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        
        case SystemConstants.GET_BACKUPS_FAILURE:        
        case SystemConstants.GET_CONFIG_BACKUP_FAILURE:
        case SystemConstants.CONFIG_BACKUP_FAILURE:
        case SystemConstants.CREATE_BACKUP_FAILURE:
        case SystemConstants.DELETE_BACKUP_FAILURE:
        case SystemConstants.RESTORE_SUCCESS:
        case SystemConstants.RESTORE_FAILURE:
        case SystemConstants.EDIT_BACKUP_INFO_FAILURE:
        case SystemConstants.DOWNLOAD_BACKUP_VERSION_SUCCESS:
        case SystemConstants.DOWNLOAD_BACKUP_VERSION_FAILURE:
        case SystemConstants.UPLOAD_BACKUP_FILE_FAILURE:
            return {
                ...state,
                isLoading: false
            }

        case SystemConstants.GET_BACKUPS_SUCCESS:
            return {
                ...state,
                backup: {
                    ...state.backup,
                    list: action.payload
                },
                isLoading: false
            }

        case SystemConstants.GET_CONFIG_BACKUP_SUCCESS:
            state.backup.config = action.payload;
            return {
                ...state,
                isLoading: false
            }

        case SystemConstants.CREATE_BACKUP_SUCCESS:
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

        case SystemConstants.CONFIG_BACKUP_SUCCESS:
            return {
                ...state,
                isLoading: false
            }

        case SystemConstants.DELETE_BACKUP_SUCCESS:
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

        case SystemConstants.EDIT_BACKUP_INFO_SUCCESS: 
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
        case SystemConstants.UPLOAD_BACKUP_FILE_SUCCESS:
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