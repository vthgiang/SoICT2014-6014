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
    default:
      return state
  }

}