import { TaskProcessService } from './services';
import { TaskProcessConstants } from './constants';
export const TaskProcessActions = {
  createXmlDiagram,
  getAllXmlDiagram,
  getXmlDiagramById
};


function getAllXmlDiagram() {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.GET_ALL_XML_DIAGRAM_REQUEST });
    TaskProcessService.getAllXmlDiagram()
      .then(
        res => dispatch({ type: TaskProcessConstants.GET_ALL_XML_DIAGRAM_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.GET_ALL_XML_DIAGRAM_FAIL })
      );
  };
}


function getXmlDiagramById(diagramId) {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.GET_XML_DIAGRAM_BY_ID_REQUEST });
    TaskProcessService.getXmlDiagramById(diagramId)
      .then(
        res => dispatch({ type: TaskProcessConstants.GET_XML_DIAGRAM_BY_ID_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.GET_XML_DIAGRAM_BY_ID_FAIL })
      );
  };
}


function createXmlDiagram(diagramId, data) {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.CREATE_XML_DIAGRAM_REQUEST });
    TaskProcessService.createXmlDiagram(diagramId, data)
      .then(
        res => dispatch({ type: TaskProcessConstants.CREATE_XML_DIAGRAM_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.CREATE_XML_DIAGRAM_FAIL })
      );
  };
}