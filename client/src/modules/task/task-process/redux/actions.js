import { TaskProcessService } from './services';
import { TaskProcessConstants } from './constants';
export const TaskProcessActions = {
  exportXmlDiagram,
};


function exportXmlDiagram(data) {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.EXPORT_XML_DIAGRAM_REQUEST });
    TaskProcessService.exportXmlDiagram(data)
      .then(
        res => dispatch({ type: TaskProcessConstants.EXPORT_XML_DIAGRAM_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.EXPORT_XML_DIAGRAM_FAIL })
      );
  };
}