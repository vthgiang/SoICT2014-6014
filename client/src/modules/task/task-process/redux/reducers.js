import { TaskProcessConstants } from "../redux/constants";

export function taskProcess(state = {}, action) {
  switch(action.type) {
    case TaskProcessConstants.EXPORT_XML_DIAGRAM_REQUEST:
      return {
          ...state,
          isLoading: true
      };
  case TaskProcessConstants.EXPORT_XML_DIAGRAM_SUCCESS:
      return {
          ...state,
          xmlDiagram: action.payload.content.data
      };
  case TaskProcessConstants.EXPORT_XML_DIAGRAM_FAIL:
      return {
          error: action.error,
          isLoading: false
      };

      default:
        return state
  }

}