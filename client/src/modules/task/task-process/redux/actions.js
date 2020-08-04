import { TaskProcessService } from './services';
import { TaskProcessConstants } from './constants';
export const TaskProcessActions = {
  createXmlDiagram,
  getAllXmlDiagram,
  getXmlDiagramById,
  editXmlDiagram,
  deleteXmlDiagram,
};


function getAllXmlDiagram( pageNumber, noResultsPerPage, name ) {
  console.log('pppp', pageNumber, name, noResultsPerPage);
  return dispatch => {
    dispatch({ type: TaskProcessConstants.GET_ALL_XML_DIAGRAM_REQUEST });
    TaskProcessService.getAllXmlDiagram( pageNumber, noResultsPerPage, name )
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

function deleteXmlDiagram(diagramId) {
  return dispatch => {
    dispatch({ type: TaskProcessConstants.DELETE_XML_DIAGRAM_REQUEST });
    TaskProcessService.deleteXmlDiagram(diagramId)
      .then(
        res => dispatch({ type: TaskProcessConstants.DELETE_XML_DIAGRAM_SUCCESS, payload: res.data }),
        error => dispatch({ type: TaskProcessConstants.DELETE_XML_DIAGRAM_FAIL })
      );
  };
}