import React, { Component, useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { getStorage } from '../../../../../config'
import { TaskProcessActions } from '../../redux/actions'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { ErrorLabel, QuillEditor, SelectBox } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { DialogModal } from '../../../../../common-components'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import customModule from '../custom-task-process-template'
var zlevel = 1
function ViewProcessChild(props) {
  // let userId = getStorage
  let userId = getStorage('userId')

  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole')
  })
  const generateId = 'viewprocesschild'
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
  useEffect(() => {
    const { processChild } = props
    modeler.attachTo('#' + generateId)
    modeler.importXML(processChild.xmlDiagram)
    //props.getXmlDiagramById(processChild.process._id)
  }, [props.id])
  const handleZoomOut = async () => {
    let zstep = 0.2
    let canvas = modeler.get('canvas')
    let eventBus = modeler.get('eventBus')

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
    let canvas = modeler.get('canvas')
    canvas.zoom('fit-viewport')
  }

  const handleZoomIn = async () => {
    let zstep = 0.2
    let canvas = modeler.get('canvas')
    let eventBus = modeler.get('eventBus')

    // set initial zoom level
    canvas.zoom(zlevel, 'auto')
    // update our zoom level on viewbox change
    await eventBus.on('canvas.viewbox.changed', function (evt) {
      zlevel = evt.viewbox.scale
    })

    zlevel = Math.min(zlevel + zstep, 7)
    canvas.zoom(zlevel, 'auto')
  }

  const { translate, taskProcess, role, processChild } = props
  const { newProcessTemplate, show } = state
  const { currentDiagram } = taskProcess
  console.log(props)

  return (
    <React.Fragment>
      <DialogModal
        size='100'
        modalID={`modal-view-process-child`}
        isLoading={false}
        formID='modal-view-process-childt'
        // disableSubmit={!isTaskFormValidated()}
        title={props.title}
        hasSaveButton={false}
        bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
      >
        <div className='row'>
          <div className={`contain-border col-md-8`}>
            <div id={generateId}></div>
            <div className='row'>
              <div className='io-zoom-controls'>
                <ul className='io-zoom-reset io-control io-control-list'>
                  <li>
                    <a style={{ cursor: 'pointer' }} title='Reset zoom' onClick={handleZoomReset}>
                      <i className='fa fa-crosshairs'></i>
                    </a>
                  </li>
                  <li>
                    <a style={{ cursor: 'pointer' }} title='Zoom in' onClick={handleZoomIn}>
                      <i className='fa fa-plus'></i>
                    </a>
                  </li>
                  <li>
                    <a style={{ cursor: 'pointer' }} title='Zoom out' onClick={handleZoomOut}>
                      <i className='fa fa-minus'></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='col-lg-4'>
            {processChild && (
              <div>
                {/**Tên mẫu quy trình */}
                <div className={`form-group ${processChild.errorOnName === undefined ? '' : 'has-error'}`}>
                  <label className='control-label'>
                    {translate('task.task_template.process_template_name')} <span style={{ color: 'red' }}>*</span>
                  </label>
                  <p type='Name'>{processChild.processName}</p>
                </div>
                {/* Mô tả quy trình */}
                <div className={`form-group`}>
                  <label className='control-label'>{translate('task.task_process.process_description')}</label>
                  <p>{processChild.processDescription}</p>
                </div>
                <div className='description-box'>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '17px', marginRight: '5px' }} className='material-icons'>
                      people_alt
                    </span>
                    <h4>{translate('task.task_management.role')}</h4>
                  </div>
                  {/* Người quản lý mẫu quy trình */}
                  <strong>{translate('task.task_process.manager')}:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {processChild?.manager?.length > 0 &&
                      processChild.manager.map((item, index) => {
                        return (
                          <span key={index} className='raci-style'>
                            <img
                              src={process.env.REACT_APP_SERVER + '/upload/avatars/user.png'}
                              className='img-circle'
                              style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }}
                              alt='User avatar'
                            />
                            <span>{item.name}</span>
                          </span>
                        )
                      })}
                  </div>

                  {/* Người được xem mẫu quy trình */}
                  <strong>{translate('task.task_process.viewer')}:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {processChild?.viewer?.length > 0 &&
                      processChild.viewer.map((item, index) => {
                        return (
                          <span key={index} className='raci-style'>
                            <img
                              src={process.env.REACT_APP_SERVER + '/upload/avatars/user.png'}
                              className='img-circle'
                              style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }}
                              alt='User avatar'
                            />
                            <span>{item.name}</span>
                          </span>
                        )
                      })}
                  </div>
                </div>
                <a className='viewbpmnprocesschild' href={`/process?processId=${processChild ? processChild._id : ''}`} target='_blank'>
                  Xem chi tiết quy trình
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { taskProcess } = state
  return { taskProcess }
}

const actionCreators = {
  getXmlDiagramById: TaskProcessActions.getXmlDiagramById
}
const connectedAddProcessTemplate = connect(mapState, actionCreators)(withTranslate(ViewProcessChild))
export { connectedAddProcessTemplate as ViewProcessChild }
