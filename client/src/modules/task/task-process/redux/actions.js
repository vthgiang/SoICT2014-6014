import { TaskProcessService } from './services';
import { TaskProcessConstants } from './constants';
export const TaskProcessActions = {
  createXmlDiagram,
  getAllXmlDiagram,
  getXmlDiagramById,
  editXmlDiagram,
  deleteXmlDiagram,
  createTaskByProcess,
  getAllTaskProcess,
  updateDiagram,

};


function getAllXmlDiagram(pageNumber, noResultsPerPage, name = '') {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.GET_ALL_XML_DIAGRAM_REQUEST });
    TaskProcessService.getAllXmlDiagram(pageNumber, noResultsPerPage, name)
      .then(
        res => dispatch({ type: TaskProcessConstants.GET_ALL_XML_DIAGRAM_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.GET_ALL_XML_DIAGRAM_FAIL })
      );
  };
}

function getAllTaskProcess(pageNumber, noResultsPerPage, name = '') {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.GET_ALL_TASK_PROCESS_REQUEST });
    TaskProcessService.getAllTaskProcess(pageNumber, noResultsPerPage, name)
      .then(
        res => dispatch({ type: TaskProcessConstants.GET_ALL_TASK_PROCESS_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.GET_ALL_TASK_PROCESS_FAIL })
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


function createXmlDiagram(data) {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.CREATE_XML_DIAGRAM_REQUEST });
    TaskProcessService.createXmlDiagram(data)
      .then(
        res => dispatch({ type: TaskProcessConstants.CREATE_XML_DIAGRAM_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.CREATE_XML_DIAGRAM_FAIL })
      );
  };
}

function editXmlDiagram(diagramId, data) {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.EDIT_XML_DIAGRAM_REQUEST });
    TaskProcessService.editXmlDiagram(diagramId, data)
      .then(
        res => dispatch({ type: TaskProcessConstants.EDIT_XML_DIAGRAM_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.EDIT_XML_DIAGRAM_FAIL })
      );
  };
}

function deleteXmlDiagram(diagramId, pageNumber, noResultsPerPage, name = "") {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.DELETE_XML_DIAGRAM_REQUEST });
    TaskProcessService.deleteXmlDiagram(diagramId, pageNumber, noResultsPerPage, name)
      .then(
        res => dispatch({ type: TaskProcessConstants.DELETE_XML_DIAGRAM_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.DELETE_XML_DIAGRAM_FAIL })
      );
  };
}

function createTaskByProcess(data, diagramId) {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.CREATE_TASK_BY_PROCESS_REQUEST });
    TaskProcessService.createTaskByProcess(data, diagramId)
      .then(
        res => dispatch({ type: TaskProcessConstants.CREATE_TASK_BY_PROCESS_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.CREATE_TASK_BY_PROCESS_FAIL })
      );
  };
}
function updateDiagram(processId, diagram) {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.UPDATE_DIAGRAM_REQUEST });
    TaskProcessService.updateDiagram(processId, diagram)
      .then(
        res => dispatch({ type: TaskProcessConstants.UPDATE_DIAGRAM_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.UPDATE_DIAGRAM_FAIL })
      );
  };
}
