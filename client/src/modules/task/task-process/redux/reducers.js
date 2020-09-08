import { TaskProcessConstants } from "../redux/constants";

export function taskProcess(state = {}, action) {
    switch (action.type) {
        case TaskProcessConstants.CREATE_XML_DIAGRAM_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case TaskProcessConstants.CREATE_XML_DIAGRAM_SUCCESS:
            return {
                ...state,
                xmlDiagram: [
                    ...state.xmlDiagram,
                    action.payload.content
                ],
            };
        case TaskProcessConstants.CREATE_XML_DIAGRAM_FAIL:
            return {
                error: action.error,
                isLoading: false
            };
        case TaskProcessConstants.GET_ALL_XML_DIAGRAM_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case TaskProcessConstants.GET_ALL_XML_DIAGRAM_SUCCESS:
            return {
                ...state,
                xmlDiagram: action.payload.content.data,
                totalPage: action.payload.content.pageTotal
            };
        case TaskProcessConstants.GET_ALL_XML_DIAGRAM_FAIL:
            return {
                error: action.error,
                isLoading: false
            };
        case TaskProcessConstants.GET_XML_DIAGRAM_BY_ID_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case TaskProcessConstants.GET_XML_DIAGRAM_BY_ID_SUCCESS:
            return {
                ...state,
                currentDiagram: action.payload.content
            };
        case TaskProcessConstants.GET_XML_DIAGRAM_BY_ID_FAIL:
            return {
                error: action.error,
                isLoading: false
            };
        case TaskProcessConstants.EDIT_XML_DIAGRAM_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case TaskProcessConstants.EDIT_XML_DIAGRAM_SUCCESS:
            // return {
            //   ...state,
            //   xmlDiagram: action.payload.content
            // };
            return {
                ...state,
                xmlDiagram: action.payload.content.data,
                totalPage: action.payload.content.pageTotal
            };
        case TaskProcessConstants.EDIT_XML_DIAGRAM_FAIL:
            return {
                error: action.error,
                isLoading: false
            };
        case TaskProcessConstants.DELETE_XML_DIAGRAM_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case TaskProcessConstants.DELETE_XML_DIAGRAM_SUCCESS:
            // return {
            //   ...state,
            //   xmlDiagram: action.payload.content
            // };
            return {
                ...state,
                xmlDiagram: action.payload.content.data,
                totalPage: action.payload.content.pageTotal
            };
        case TaskProcessConstants.DELETE_XML_DIAGRAM_FAIL:
            return {
                error: action.error,
                isLoading: false
            };
        case TaskProcessConstants.CREATE_TASK_BY_PROCESS_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case TaskProcessConstants.CREATE_TASK_BY_PROCESS_SUCCESS:
            return {
                ...state,
                xmlDiagram: action.payload.content
            };
        case TaskProcessConstants.CREATE_TASK_BY_PROCESS_FAIL:
            return {
                error: action.error,
                isLoading: false
            };
        case TaskProcessConstants.GET_ALL_TASK_PROCESS_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case TaskProcessConstants.GET_ALL_TASK_PROCESS_SUCCESS:
            return {
                ...state,
                listTaskProcess: action.payload.content.data,
                totalPage: action.payload.content.pageTotal
            };
        case TaskProcessConstants.GET_ALL_TASK_PROCESS_FAIL:
            return {
                error: action.error,
                isLoading: false
            };
        case TaskProcessConstants.UPDATE_DIAGRAM_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case TaskProcessConstants.UPDATE_DIAGRAM_SUCCESS:
            return {
                ...state,
                listTaskProcess: action.payload.content.data,
                totalPage: action.payload.content.pageTotal
            };
        case TaskProcessConstants.UPDATE_DIAGRAM_FAIL:
            return {
                error: action.error,
                isLoading: false
            };
        case TaskProcessConstants.CREATE_COMMENT_REQUEST:
            return {
                ...state,
                adding: true
            }
        case TaskProcessConstants.CREATE_COMMENT_SUCCESS:
            return {
                ...state,
                currentKPI: {
                    ...state.currentKPI,
                    comments: action.payload
                }
            }
        case TaskProcessConstants.CREATE_COMMENT_FAILURE:
            return {
                error: action.payload,
            }
        case TaskProcessConstants.CREATE_COMMENT_OF_COMMENT_REQUEST:
            return {
                ...state,
                adding: true
            }
        case TaskProcessConstants.CREATE_COMMENT_OF_COMMENT_SUCCESS:
            return {
                ...state,
                currentKPI: {
                    ...state.currentKPI,
                    comments: action.payload
                }
            }
        case TaskProcessConstants.CREATE_COMMENT_OF_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case TaskProcessConstants.EDIT_COMMENT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case TaskProcessConstants.EDIT_COMMENT_SUCCESS:
            return {
                ...state,
                idLoading: false,
                currentKPI: {
                    ...state.currentKPI,
                    comments: action.payload,

                }
            }
        case TaskProcessConstants.EDIT_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case TaskProcessConstants.DELETE_COMMENT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case TaskProcessConstants.DELETE_COMMENT_SUCCESS:
            return {
                ...state,
                currentKPI: {
                    ...state.currentKPI,
                    comments: action.payload
                }
            }
        case TaskProcessConstants.DELETE_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case TaskProcessConstants.EDIT_COMMENT_OF_COMMENT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case TaskProcessConstants.EDIT_COMMENT_OF_COMMENT_SUCCESS:
            return {
                ...state,
                currentKPI: {
                    ...state.currentKPI,
                    comments: action.payload
                }
            }
        case TaskProcessConstants.EDIT_COMMENT_OF_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case TaskProcessConstants.DELETE_COMMENT_OF_COMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case TaskProcessConstants.DELETE_COMMENT_OF_COMMENT_SUCCESS:
            return {
                ...state,
                currentKPI: {
                    ...state.currentKPI,
                    comments: action.payload
                }
            }
        case TaskProcessConstants.DELETE_COMMENT_OF_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case TaskProcessConstants.DELETE_FILE_COMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case TaskProcessConstants.DELETE_FILE_COMMENT_SUCCESS:
            return {
                ...state,
                currentKPI: {
                    ...state.currentKPI,
                    comments: action.payload
                }
            }
        case TaskProcessConstants.DELETE_FILE_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case TaskProcessConstants.DELETE_FILE_CHILD_COMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case TaskProcessConstants.DELETE_FILE_CHILD_COMMENT_SUCCESS:
            return {
                ...state,
                currentKPI: {
                    ...state.currentKPI,
                    comments: action.payload
                }
            }
        case TaskProcessConstants.DELETE_FILE_CHILD_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        default:
            return state
    }

}