import React, { Component, useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { getStorage } from '../../../../../config'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { performTaskAction } from '../../../task-perform/redux/actions'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'
import customModule from '../custom-task-process'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import './../process-template/processDiagram.css'
import { TaskOutputTab } from './taskOutputTab'

//Xóa element khỏi pallette theo data-action
var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries
PaletteProvider.prototype.getPaletteEntries = function (element) {
  var entries = _getPaletteEntries.apply(this)
  delete entries['create.subprocess-expanded']
  delete entries['create.data-store']
  delete entries['create.data-object']
  delete entries['create.group']
  delete entries['create.participant-expanded']
  return entries
}

const formatStatusTaskOutput = (value) => {
  switch (value) {
    case 'unfinished':
      return 'Chưa hoàn thành'
    case 'inprogess':
      return 'Đang thực hiện'
    case 'waiting_for_approval':
      return 'Đang chờ phê duyệt'
    case 'rejected':
      return 'Bị từ chối'
    case 'approved':
      return 'Đã phê duyệt'
    default:
      return ''
      break
  }
}

// khởi tạo giá trị mặc định zoomIn zoomOut
var zlevel = 1

function ViewTaskOutputs(props) {
  let { data } = props
  const [state, setState] = useState({
    userId: getStorage('userId'),
    currentRole: getStorage('currentRole'),
    showProcessChild: false,
    showInfo: false,
    processChilds: data.processChilds,
    info: data.tasks,
    xmlDiagram: data.xmlDiagram,
    selected: 'info',
    zlevel: 1,
    startDate: '',
    endDate: '',
    status: ''
  })

  const [modeler, setModeler] = useState(
    new BpmnModeler({
      additionalModules: [
        customModule,
        { zoomScroll: ['value', ''] }
        // { moveCanvas: [ 'value', null ] }
      ]
    })
  )

  const generateId = 'viewtaskoutputtab'

  useEffect(() => {
    modeler.attachTo('#' + generateId)
    var eventBus = modeler.get('eventBus')

    //Vo hieu hoa double click edit label
    eventBus.on('element.dblclick', 10000, function (event) {
      var element = event.element
      if (isAny(element, ['bpmn:Task'])) {
        return false // will cancel event
      }
    })

    eventBus.on('shape.move.start', 100000, () => {
      return false
    })

    modeler.on('element.click', 1000, (e) => interactPopup(e))
  }, [])

  useEffect(() => {
    let info = {}
    let infoTask = props.data.tasks
    for (let i in infoTask) {
      info[`${infoTask[i].codeInProcess}`] = infoTask[i]
    }
    let ListProcessChilds = {}
    let processChilds = props.data.processChilds
    for (let i in processChilds) {
      ListProcessChilds[`${processChilds[i].codeInProcess}`] = processChilds[i]
    }
    setState({
      ...state,
      idProcess: props.idProcess,
      showInfo: false,
      showProcessChild: false,
      info: info,
      processChilds: ListProcessChilds,
      processDescription: props.data.processDescription ? props.data.processDescription : '',
      processName: props.data.processName ? props.data.processName : '',
      status: props.data.status ? props.data.status : '',
      startDate: props.data.startDate ? props.data.startDate : '',
      endDate: props.data.endDate ? props.data.endDate : '',
      xmlDiagram: props.data.xmlDiagram
    })
    props.getDepartment()
    let { user } = props

    let defaultUnit
    if (user && user.organizationalUnitsOfUser)
      defaultUnit = user.organizationalUnitsOfUser.find(
        (item) => item.manager === state.currentRole || item.deputyManager === state.currentRole || item.employee === state.currentRole
      )
    if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
      // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
      defaultUnit = user.organizationalUnitsOfUser[0]
    }
    props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id)
    if (props.data) {
      let modeling = modeler.get('modeling')
      modeler.importXML(props.data.xmlDiagram, function (err) {
        let infoTask = props.data.tasks
        let info = state.info

        if (infoTask) {
          for (let i in infoTask) {
            let responsible = []
            let accountable = []
            let taskOutputs = []
            infoTask[i].responsibleEmployees.forEach((x) => {
              responsible.push(x.name)
            })
            infoTask[i].accountableEmployees.forEach((x) => {
              accountable.push(x.name)
            })
            if (infoTask[i].taskOutputs?.length > 0) {
              infoTask[i].taskOutputs.forEach((x) => {
                let check = formatStatusTaskOutput(x.status)
                let title = x.title
                taskOutputs.push({ title: x.title, status: x.status })
              })
            }

            let element1 =
              Object.keys(modeler.get('elementRegistry')).length > 0 && modeler.get('elementRegistry').get(infoTask[i].codeInProcess)
            element1 &&
              modeling.updateProperties(element1, {
                progress: infoTask[i].progress,
                shapeName: infoTask[i].name,
                responsibleName: responsible,
                accountableName: accountable,
                taskOutputs: taskOutputs
              })
            let checkStatusTaskOutputs = 'normal'
            let check = 0
            for (let x in infoTask[i].taskOutputs) {
              if (x.status !== 'approved') {
                checkStatusTaskOutputs = 'unfinished'
              } else {
                check = check + 1
              }
            }
            if (check == infoTask[i].taskOutputs.length) {
              checkStatusTaskOutputs = 'approved'
            }

            // if (checkStatusTaskOutputs === "approved") {
            //     element1 && modeling.setColor(element1, {
            //         fill: '#84ffb8',
            //         stroke: '#14984c', //E02001
            //     });
            // }
            // if (checkStatusTaskOutputs === "unfinished") {
            //     element1 && modeling.setColor(element1, {
            //         fill: 'rgba(254, 202, 202)',
            //         stroke: 'rgba(239, 68, 68)', //E02001
            //         width: '5px'
            //     });

            // }
          }
        }
      })
    }
  }, [props.idProcess])

  const { id, info, startDate, endDate, status, processDescription, processName, showProcessChild, processChilds, showInfo } = state

  // Các hàm  xử lý sự kiện của bpmn

  const interactPopup = async (event) => {
    var element = event.element
    let nameStr = element.type.split(':')
    // console.log(element.businessObject.id);
    await setState((state) => {
      if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway') {
        if (
          !state.info[`${element.businessObject.id}`] ||
          (state.info[`${element.businessObject.id}`] && !state.info[`${element.businessObject.id}`].organizationalUnit)
        ) {
          state.info[`${element.businessObject.id}`] = {
            ...state.info[`${element.businessObject.id}`],
            organizationalUnit: props.listOrganizationalUnit[0]?._id
          }
        }
        return {
          ...state,
          showInfo: true,
          type: element.type,
          name: nameStr[1],
          taskName: element.businessObject.name,
          id: `${element.businessObject.id}`,
          showProcessChild: false
        }
      } else if (element.type === 'bpmn:SubProcess') {
        if (
          !state.processChilds[`${element.businessObject.id}`] ||
          (state.processChilds[`${element.businessObject.id}`] && !state.processChilds[`${element.businessObject.id}`].organizationalUnit)
        ) {
          state.processChilds[`${element.businessObject.id}`] = {
            ...state.processChilds[`${element.businessObject.id}`],
            organizationalUnit: props.listOrganizationalUnit[0]?._id
          }
        }
        return {
          ...state,
          showProcessChild: true,
          type: element.type,
          name: nameStr[1],
          taskName: element.businessObject.name,
          id: `${element.businessObject.id}`,
          showInfo: false
        }
      } else {
        return { ...state, showInfo: false, showProcessChild: false, type: element.type, name: '', id: element.businessObject.id }
      }
    })
    if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway') {
      // window.$(`#modal-task-outputs-of-task`).modal("show");
      console.log(253)
    }
    if (element.type === 'bpmn:SubProcess') {
      // window.$(`#modal-view-process-child`).modal("show");
      console.log(257)
    }
  }

  const downloadAsSVG = () => {
    modeler.saveSVG({ format: true }, function (error, svg) {
      if (error) {
        return
      }

      var svgBlob = new Blob([svg], {
        type: 'image/svg+xml'
      })

      var fileName = Math.random(36).toString().substring(7) + '.svg'

      var downloadLink = document.createElement('a')
      downloadLink.download = fileName
      downloadLink.innerHTML = 'Get BPMN SVG'
      downloadLink.href = window.URL.createObjectURL(svgBlob)
      downloadLink.onclick = function (event) {
        document.body.removeChild(event.target)
      }
      downloadLink.style.visibility = 'hidden'
      document.body.appendChild(downloadLink)
      downloadLink.click()
    })
  }

  const downloadAsBpmn = () => {
    modeler.saveXML({ format: true }, function (error, xml) {
      if (error) {
        return
      }
    })
  }

  const downloadAsImage = () => {
    modeler.saveSVG({ format: true }, function (error, svg) {
      if (error) {
        return
      }
      function triggerDownload(imgURI) {
        var evt = new MouseEvent('click', {
          view: window,
          bubbles: false,
          cancelable: true
        })

        var a = document.createElement('a')
        a.setAttribute('download', 'MY_COOL_IMAGE.png')
        a.setAttribute('href', imgURI)
        a.setAttribute('target', '_blank')

        a.dispatchEvent(evt)
      }
      var canvas = document.createElement('CANVAS')
      var ctx = canvas.getContext('2d')
      ctx.canvas.width = window.innerWidth
      ctx.canvas.height = window.innerHeight
      var DOMURL = window.URL || window.webkitURL || window

      var img = new Image()
      var svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      var url = DOMURL.createObjectURL(svgBlob)

      img.onload = function () {
        DOMURL.revokeObjectURL(url)
        ctx.drawImage(img, 0, 0)
        var imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')

        triggerDownload(imgURI)
      }

      img.src = url
    })
  }

  // các hàm thu nhỏ, phóng to, vừa màn hình cho diagram
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

  const exportDiagram = () => {
    let xmlStr
    modeler.saveXML({ format: true }, function (err, xml) {
      if (err) {
      } else {
        xmlStr = xml
      }
    })
    setState((state) => {
      return {
        ...state,
        xmlDiagram: xmlStr
      }
    })
  }

  const formatDate = (date) => {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [day, month, year].join('-')
  }

  const formatStatus = (data) => {
    const { translate } = props
    if (data === 'inprocess') return translate('task.task_management.inprocess')
    else if (data === 'wait_for_approval') return translate('task.task_management.wait_for_approval')
    else if (data === 'finished') return translate('task.task_management.finished')
    else if (data === 'delayed') return translate('task.task_management.delayed')
    else if (data === 'canceled') return translate('task.task_management.canceled')
  }

  const { translate, role, user } = props

  const { isTabPane } = props
  // if (id){
  //     console.log(info[`${id}`]);
  // }
  //`contain-border ${showInfo ||showInfoProcess? 'col-md-8' : 'col-md-12'}`
  return (
    <React.Fragment>
      <div>
        <div className={`${isTabPane ? 'is-tabbed-pane' : 'row'}`}>
          {/* Quy trình công việc */}
          <div className={`${isTabPane ? '' : 'col-md-8'}`} style={{ paddingRight: '0px' }}>
            <div className='contain-border'>
              {/* Diagram */}
              <div id={generateId}></div>

              {/* Zoom button */}
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
          </div>

          <div className={`${isTabPane ? '' : 'col-md-4'}`}>
            <div className='description-box without-border'>
              {id !== undefined && showInfo && <TaskOutputTab id={id} task={info && info[`${id}`] && info[`${id}`]} />}
              {/* tên quy trình */}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { user, auth, role } = state
  return { user, auth, role }
}

const actionCreators = {
  getDepartment: UserActions.getDepartmentOfUser,
  getTaskById: performTaskAction.getTaskById,
  getAllUsersWithRole: UserActions.getAllUsersWithRole,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree
}
const connectedViewProcess = connect(mapState, actionCreators)(withTranslate(ViewTaskOutputs))
export { connectedViewProcess as ViewTaskOutputs }
