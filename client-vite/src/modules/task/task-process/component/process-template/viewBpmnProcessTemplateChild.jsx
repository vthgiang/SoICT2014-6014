import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import { getStorage } from '../../../../../config'
import { DialogModal } from '../../../../../common-components'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { TaskProcessActions } from '../../redux/actions'
import customModule from '../custom-task-process-template'
import { ViewProcessTemplateChild } from './viewProcessTemplateChild'
import { ViewTaskTemplate } from '../../../task-template/component/viewTaskTemplate'

let zlevel = 1
function areEqual(prevProps, nextProps) {
  if (prevProps.idProcess === nextProps.idProcess) {
    return true
  }
  return false
}
function ModalViewBpmnProcessTemplateChild(props) {
  const { data } = props
  const [state, setState] = useState({
    userId: getStorage('userId'),
    currentRole: getStorage('currentRole'),
    showInfo: false,
    showInfoProcess: false,
    selectedView: 'info',
    info: props.tasks,
    xmlDiagram: props.xmlDiagram,
    render: 0
  })
  const [modeler, setmodeler] = useState(
    new BpmnModeler({
      // container:"#viewprocess",
      additionalModules: [
        customModule,
        // { moveCanvas: ['value', null] }, // chặn chức năng kéo thả khung vẽ
        { zoomScroll: ['value', ''] } // chặn chức năng lăn chuột, zoom on mouse wheel
      ]
    })
  )
  const generateId = 'viewprocesschild'
  // modeler.importXML(props.xmlDiagram)
  // const interactPopup = async (event) => {
  //     let element = event.element;

  //     setState({
  //         ...state,
  //         id: element.businessObject.id
  //     });
  // }
  const interactPopup = (event) => {
    const { element } = event
    const nameStr = element.type.split(':')
    setState((state) => {
      if (element.type === 'bpmn:SubProcess') {
        return {
          ...state,
          showInfo: false,
          showInfoProcess: true,
          type: element.type,
          name: nameStr[1],
          taskName: element.businessObject.name,
          id: `${element.businessObject.id}`
        }
      }
      if (
        element.type !== 'bpmn:Collaboration' &&
        element.type !== 'bpmn:Process' &&
        element.type !== 'bpmn:StartEvent' &&
        element.type !== 'bpmn:EndEvent' &&
        element.type !== 'bpmn:SequenceFlow'
      ) {
        // console.log("object");
        return {
          ...state,
          showInfo: true,
          showInfoProcess: false,
          type: element.type,
          name: nameStr[1],
          taskName: element.businessObject.name,
          id: `${element.businessObject.id}`
        }
      }
      return { ...state, showInfo: false, showInfoProcess: false, type: element.type, name: '', id: element.businessObject.id }
    })
  }
  useEffect(() => {
    props.getAllUsers()
    // modeler.container="#viewprocess"
    // console.log(modeler);
    // modeler.attachTo('#' + generateId);

    const eventBus = modeler.get('eventBus')

    eventBus.on('shape.move.start', 100000, () => {
      return false
    })
    modeler.on('element.click', 1000, (e) => interactPopup(e))
  }, [])
  useEffect(() => {
    // console.log("2");
    if (props.idProcess != state.idProcess) {
      const info = {}
      const infoTask = props.tasks // TODO task list
      for (const i in infoTask) {
        info[`${infoTask[i].code}`] = infoTask[i]
      }
      const infoTemplate = {}
      const infoProcessTemplates = props.processTemplates // TODO task list
      for (const i in infoProcessTemplates) {
        infoTemplate[`${infoProcessTemplates[i].code}`] = infoProcessTemplates[i]
      }
      modeler.attachTo(`#${generateId}`)
      modeler.importXML(props.xmlDiagram)
      setState({
        ...state,
        idProcess: props.idProcess,
        showInfo: false,
        info,
        infoTemplate,
        processName: props.processName ? props.processName : '',
        xmlDiagram: props.xmlDiagram
      })
    }
  }, [props.idProcess])
  // static getDerivedStateFromProps(nextProps, prevState) {
  //     if (nextProps.idProcess !== prevState.idProcess) {
  //         let info = {};
  //         let infoTask = nextProps.data.tasks; // TODO task list
  //         for (let i in infoTask) {
  //             info[`${infoTask[i].code}`] = infoTask[i];
  //         }
  //         return {
  //             ...prevState,
  //             idProcess: nextProps.idProcess,
  //             showInfo: false,
  //             info: info,
  //             processDescription: nextProps.data.processDescription ? nextProps.data.processDescription : '',
  //             processName: nextProps.data.processName ? nextProps.data.processName : '',
  //             viewer: nextProps.data.viewer ? nextProps.data.viewer.map(x => x._id) : [],
  //             manager: nextProps.data.manager ? nextProps.data.manager.map(x => x._id) : [],
  //             xmlDiagram: nextProps.data.xmlDiagram,
  //         }
  //     } else {
  //         return null;
  //     }
  // }
  // shouldComponentUpdate(nextProps, nextState) {
  //     if (nextProps?.idProcess !== state.idProcess) {
  //         modeler.importXML(nextProps.data.xmlDiagram);
  //         return true;
  //     }
  //     return true;
  // }
  // componentDidMount() {
  //     props.getAllUsers();
  //     modeler.attachTo('#' + generateId);

  //     let eventBus = modeler.get('eventBus')

  //     eventBus.on('shape.move.start', 100000, () => { return false });
  //     modeler.on('element.click', 1000, (e) => interactPopup(e));
  // }

  // Các hàm xử lý sự kiện của form
  const handleChangeContent = async (content) => {
    await setState((state) => {
      return {
        ...state,
        selectedView: content
      }
    })
  }

  const handleZoomOut = async () => {
    const zstep = 0.2
    const canvas = modeler.get('canvas')
    const eventBus = modeler.get('eventBus')

    // set initial zoom level
    canvas.zoom(zlevel, 'auto')
    // update our zoom level on viewbox change
    await eventBus.on('canvas.viewbox.changed', function (evt) {
      zlevel = evt.viewbox.scale
    })
    zlevel = Math.max(zlevel - zstep, zstep)
    canvas.zoom(zlevel, 'auto')
  }

  const handleZoomReset = () => {
    const canvas = modeler.get('canvas')
    canvas.zoom('fit-viewport')
  }

  const handleZoomIn = async () => {
    const zstep = 0.2
    const canvas = modeler.get('canvas')
    const eventBus = modeler.get('eventBus')

    // set initial zoom level
    canvas.zoom(zlevel, 'auto')
    // update our zoom level on viewbox change
    await eventBus.on('canvas.viewbox.changed', function (evt) {
      zlevel = evt.viewbox.scale
    })

    zlevel = Math.min(zlevel + zstep, 7)
    canvas.zoom(zlevel, 'auto')
  }
  const exportDiagram = () => {}
  const downloadAsImage = () => {}
  const downloadAsBpmn = () => {}
  const downloadAsSVG = () => {}
  const { translate, role, user } = props
  const { listOrganizationalUnit } = props
  const { name, id, idProcess, info, showInfo, selectedView, showInfoProcess, infoTemplate } = state
  return (
    <DialogModal
      size='100'
      modalID='modal-view-process'
      isLoading={false}
      formID='form-task-process'
      title={props.processName}
      hasSaveButton={false}
    >
      <div>
        <div className='nav-tabs-custom' style={{ boxShadow: 'none', MozBoxShadow: 'none', WebkitBoxShadow: 'none', marginBottom: 0 }}>
          <div className='tab-content' style={{ padding: 0, marginTop: -15 }}>
            <div className={selectedView !== 'process' ? 'active tab-pane' : 'tab-pane'} id='process-view'>
              <div className=''>
                {/* Quy trình công việc */}
                <div className={`contain-border ${showInfo || showInfoProcess ? 'col-md-8' : 'col-md-12'}`}>
                  <div id={generateId} />
                  <div className='row'>
                    <div className='io-zoom-controls'>
                      <ul className='io-zoom-reset io-control io-control-list'>
                        <li>
                          <a style={{ cursor: 'pointer' }} title='Reset zoom' onClick={handleZoomReset}>
                            <i className='fa fa-crosshairs' />
                          </a>
                        </li>
                        <li>
                          <a style={{ cursor: 'pointer' }} title='Zoom in' onClick={handleZoomIn}>
                            <i className='fa fa-plus' />
                          </a>
                        </li>
                        <li>
                          <a style={{ cursor: 'pointer' }} title='Zoom out' onClick={handleZoomOut}>
                            <i className='fa fa-minus' />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className={`right-content ${showInfo || showInfoProcess ? 'col-md-4' : undefined}`}>
                  {showInfo && (
                    <div>
                      {/* <div>
                                                        <h1>Option {name}</h1>
                                                    </div> */}
                      <ViewTaskTemplate
                        isProcess
                        taskTemplate={info?.[`${id}`]}
                        // listUser={listUser}
                      />
                    </div>
                  )}

                  {showInfoProcess && (
                    <div>
                      {/* <div>
                                                    <h1>Option {name}</h1>
                                                </div> */}
                      <ViewProcessTemplateChild
                        id={id}
                        infoTemplate={infoTemplate && infoTemplate[`${id}`] && infoTemplate[`${id}`]}
                        // handleDataProcessTempalte={handleDataProcessTempalte}
                        // setBpmnProcess={setBpmnProcess}
                        // handleChangeName={handleChangeName} // cập nhật tên vào diagram
                        // handleChangeViewerBpmn={handleChangeViewerBpmn} // cập nhật hiển thi diagram
                        // handleChangeManagerBpmn={handleChangeManagerBpmn} // cập nhật hiển thị diagram
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogModal>
  )
}

function mapState(state) {
  const { user, auth, role } = state
  return { user, auth, role }
}

const actionCreators = {
  getDepartment: UserActions.getDepartmentOfUser,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  createXmlDiagram: TaskProcessActions.createXmlDiagram,
  getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
  editXmlDiagram: TaskProcessActions.editXmlDiagram,
  getAllUsers: UserActions.get
}
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(React.memo(ModalViewBpmnProcessTemplateChild, areEqual)))
export { connectedModalAddProcess as ModalViewBpmnProcessTemplateChild }
