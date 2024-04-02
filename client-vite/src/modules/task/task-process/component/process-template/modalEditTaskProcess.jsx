import React, { Component, useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { getStorage } from '../../../../../config'
import { DialogModal, SelectBox, ErrorLabel } from '../../../../../common-components'

import { UserActions } from '../../../../super-admin/user/redux/actions'
import { TaskProcessActions } from '../../redux/actions'
import { EditTaskTemplate } from '../../../task-template/component/editTaskTemplate'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'

import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import customModule from '../custom-task-process-template'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import './processDiagram.css'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { AddProcessTemplate } from './addProcessTemplateChild'

//Xóa element khỏi pallette theo data-action
var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries
PaletteProvider.prototype.getPaletteEntries = function (element) {
  var entries = _getPaletteEntries.apply(this)
  delete entries['create.subprocess-expanded']
  delete entries['create.data-store']
  delete entries['create.data-object']
  delete entries['create.group']
  // delete entries['create.participant-expanded']
  return entries
}

// custom element
ElementFactory.prototype._getDefaultSize = function (semantic) {
  if (is(semantic, 'bpmn:Task')) {
    return { width: 160, height: 130 }
  }
  if (is(semantic, 'bpmn:SubProcess')) {
    return { width: 260, height: 180 }
  }
  if (is(semantic, 'bpmn:Gateway')) {
    return { width: 50, height: 50 }
  }

  if (is(semantic, 'bpmn:Event')) {
    return { width: 36, height: 36 }
  }

  if(is(semantic, 'bpmn:Participant')){
		return { width: 350, height: 250 };
	}

  if (is(semantic, 'bpmn:TextAnnotation')) {
    return { width: 100, height: 30 }
  }
  return { width: 100, height: 80 }
}

// zoom level mặc định dùng cho zoomin zoomout
var zlevel = 1
function ModalEditTaskProcess(props) {
  let { data } = props
  const [state, setState] = useState({
    userId: getStorage('userId'),
    currentRole: getStorage('currentRole'),
    showInfo: false,
    info: '',
    xmlDiagram: '',
    selectedEdit: 'info',
    zlevel: 1,
    showInfoProcess: false
  })
  const [modeler, setModeler] = useState(
    new BpmnModeler({
      additionalModules: [customModule, { zoomScroll: ['value', ''] }]
    })
  )
  // const

  // modeling = modeler.get('modeling')
  const generateId = 'editprocess'
  // initialDiagram = data.xmlDiagram;
  useEffect(() => {
    let info = {}
    let infoTask1 = props.data.tasks // TODO TaskList

    for (let i in infoTask1) {
      if (!infoTask1[i].organizationalUnit) {
        infoTask1[i].organizationalUnit = props.listOrganizationalUnit[0]?._id
      }
      info[`${infoTask1[i].code}`] = infoTask1[i]
    }

    let { infoTask } = props
    // for (const x in infoTask) {
    //     if (x !== undefined) {
    //         const modeling = modeler.get('modeling');
    //         let element1 = modeler.get('elementRegistry').get(x);
    //         if (element1) {
    //             modeling.updateProperties(element1, {
    //                 info: infoTask[x],
    //             });
    //         }
    //     }
    // }

    let infoTemplate = {}
    let infoProcessTemplates = props.data.processTemplates // TODO task list
    for (let i in infoProcessTemplates) {
      infoTemplate[`${infoProcessTemplates[i].code}`] = infoProcessTemplates[i]
    }
    modeler.importXML(props.data.xmlDiagram, function (err) {})
    setState({
      ...state,
      idProcess: props.idProcess,
      showInfo: false,
      info: info,
      infoTemplate: infoTemplate,
      processDescription: props.data.processDescription ? props.data.processDescription : '',
      processName: props.data.processName ? props.data.processName : '',
      viewer: props.data.viewer ? props.data.viewer.map((x) => x._id) : [],
      manager: props.data.manager ? props.data.manager.map((x) => x._id) : [],
      xmlDiagram: props.data.xmlDiagram,
      errorOnProcessName: undefined,
      errorOnProcessDescription: undefined,
      errorOnManager: undefined,
      errorOnViewer: undefined
    })
    // modeler.on('element.click', 1000, (e) => interactPopup(e));

    // modeler.on('shape.remove', 1000, (e) => deleteElements(e));

    // modeler.on('commandStack.shape.delete.revert', (e) => handleUndoDeleteElement(e));

    // modeler.on('shape.changed', 1000, (e) => changeNameElement(e));
  }, [props.idProcess])
  useEffect(() => {
    props.getDepartment()

    let { user } = props
    let defaultUnit =
      user &&
      user.organizationalUnitsOfUser &&
      user.organizationalUnitsOfUser.find(
        (item) => item.manager === state.currentRole || item.deputyManager === state.currentRole || item.employee === state.currentRole
      )
    if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
      // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
      defaultUnit = user.organizationalUnitsOfUser[0]
    }
    props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id)

    modeler.attachTo('#' + generateId)

    var eventBus = modeler.get('eventBus')

    //Vo hieu hoa double click edit label
    eventBus.on('element.dblclick', 10000, function (event) {
      var element = event.element

      if (isAny(element, ['bpmn:Task'])) {
        return false
      }
      if (isAny(element, ['bpmn:SubProcess'])) {
        return false
      }
    })

    //Vo hieu hoa chinh sua label khi tao moi
    eventBus.on(['create.end', 'autoPlace.end'], 250, (e) => {
      modeler.get('directEditing').cancel()
    })
    modeler.on('element.click', 1000, (e) => interactPopup(e))

    modeler.on('shape.remove', 1000, (e) => deleteElements(e))

    modeler.on('commandStack.shape.delete.revert', (e) => handleUndoDeleteElement(e))

    modeler.on('shape.changed', 1000, (e) => changeNameElement(e))
  }, [])
  // modeler.on('element.click', 1000, (e) => interactPopup(e));

  //     modeler.on('shape.remove', 1000, (e) => deleteElements(e));

  //     modeler.on('commandStack.shape.delete.revert', (e) => handleUndoDeleteElement(e));

  //     modeler.on('shape.changed', 1000, (e) => changeNameElement(e));
  // console.log(state);

  // Các hàm thay đổi thông tin của quy trình
  // Cập nhật tên quy trình
  const handleChangeBpmnName = async (e) => {
    let { value } = e.target
    let { message } = ValidationHelper.validateName(props.translate, value)

    await setState({
      ...state,
      processName: value,
      errorOnProcessName: message
    })
  }

  // cập nhật mô tả quy trình
  const handleChangeBpmnDescription = async (e) => {
    let { value } = e.target
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    await setState({
      ...state,
      processDescription: value,
      errorOnProcessDescription: message
    })
  }

  // Cập nhật người được xem
  const handleChangeViewer = async (value) => {
    let { message } = ValidationHelper.validateArrayLength(props.translate, value)

    await setState({
      ...state,
      viewer: value,
      errorOnViewer: message
    })
  }

  // Cập nhật người quản lý
  const handleChangeManager = async (value) => {
    let { message } = ValidationHelper.validateArrayLength(props.translate, value)

    await setState({
      ...state,
      manager: value,
      errorOnManager: message
    })
  }

  // cập nhật thông tin của task element
  const handleUpdateElement = (abc) => {
    const modeling = modeler.get('modeling')
    let element1 = modeler.get('elementRegistry').get(state.id)
    modeling.updateProperties(element1, {
      info: state.info
    })
  }

  // Các hàm xử lý sự kiện của form
  const handleChangeContent = async (content) => {
    await setState({
      ...state,
      selectedEdit: content
    })
  }
  // cập nhật tên công việc trong quy trình
  const handleChangeName = async (value) => {
    const modeling = modeler.get('modeling')
    let element1 = modeler.get('elementRegistry').get(state.id)
    modeling.updateProperties(element1, {
      shapeName: value
    })
    // forceUpdate(); // render lại component
  }

  // Cập nhật người thực hiện công việc trong quy trình
  const handleChangeResponsible = async (value) => {
    const modeling = modeler.get('modeling')
    let element1 = modeler.get('elementRegistry').get(state.id)
    let { user } = props
    let responsibleName
    let responsible = []
    user.usercompanys.forEach((x) => {
      if (value.some((y) => y === x._id)) {
        responsible.push(x.name)
      }
    })
    modeling.updateProperties(element1, {
      responsibleName: responsible
    })
  }

  // Cập nhật người phê duyệt công việc trong quy trình
  const handleChangeAccountable = async (value) => {
    const modeling = modeler.get('modeling')
    let element1 = modeler.get('elementRegistry').get(state.id)
    let { user } = props
    let accountableName
    let accountable = []

    user.usercompanys.forEach((x) => {
      if (value.some((y) => y === x._id)) {
        accountable.push(x.name)
      }
    })
    modeling.updateProperties(element1, {
      accountableName: accountable
    })
  }

  // Các hàm  xử lý sự kiện của bpmn
  const interactPopup = (event) => {
    var element = event.element
    let nameStr = element.type.split(':')
    setState((state) => {
      if (
        element.type === 'bpmn:Task' ||
        element.type === 'bpmn:ExclusiveGateway'
        // || element.type === "bpmn:SequenceFlow" || element.type === "bpmn:IntermediateThrowEvent"
        // || element.type === 'bpmn:EndEvent' || element.type === "bpmn:StartEvent"
      ) {
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
          showInfoProcess: false,
          type: element.type,
          name: nameStr[1],
          taskName: element.businessObject.name,
          id: `${element.businessObject.id}`
        }
      } else if (element.type === 'bpmn:SubProcess') {
        if (
          !state.infoTemplate[`${element.businessObject.id}`] ||
          (state.infoTemplate[`${element.businessObject.id}`] && !state.infoTemplate[`${element.businessObject.id}`].organizationalUnit)
        ) {
          state.infoTemplate[`${element.businessObject.id}`] = {
            ...state.infoTemplate[`${element.businessObject.id}`]
          }
          // console.log('props.listOrganizationalUnit[0]?._id', props.listOrganizationalUnit[0]?._id);
        }
        return {
          ...state,
          showInfo: false,
          showInfoProcess: true,
          type: element.type,
          name: nameStr[1],
          taskName: element.businessObject.name,
          id: `${element.businessObject.id}`
        }
      } else {
        return { ...state, showInfo: false, showInfoProcess: false, type: element.type, name: '', id: element.businessObject.id }
      }
    })
  }
  // }

  const deleteElements = (event) => {
    var element = event.element
    setState((state) => {
      delete state.info[`${state.id}`]
      delete state.infoTemplate[`${state.id}`]
      return {
        ...state,
        showInfo: false
      }
    })
  }

  const handleUndoDeleteElement = (event) => {
    var element = event.context.shape
  }

  const changeNameElement = (event) => {
    var element = event.element
  }

  // hàm cập nhật màu sắc
  const done = (e) => {
    e.preventDefault()
    const modeling = modeler.get('modeling')
    let element1 = modeler.get('elementRegistry').get(state.id)
    modeling.setColor(element1, {
      fill: '#dde6ca',
      stroke: '#6b7060'
    })
    let target = []
    element1.outgoing.forEach((x) => {
      target.push(x.target.id)
    })
    target.forEach((x) => {
      modeling.setColor(modeler.get('elementRegistry').get(x), {
        // fill: '#7236ff',
        stroke: '#7236ff'
      })
    })

    var outgoing = element1.outgoing
    outgoing.forEach((x) => {
      var outgoingEdge = modeler.get('elementRegistry').get(x.id)

      modeling.setColor(outgoingEdge, {
        stroke: '#7236ff',
        width: '5px'
      })
    })
    var incoming = element1.incoming
    incoming.forEach((x) => {
      var incomingEdge = modeler.get('elementRegistry').get(x.id)

      modeling.setColor(incomingEdge, {
        stroke: '#dde6ca',
        width: '5px'
      })
    })
  }

  // Các hàm cho nút export, import, download BPMN
  const downloadAsSVG = () => {
    // console.log(modeler);
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
      img.crossOrigin = 'anonymous'
      var svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      var url = DOMURL.createObjectURL(svgBlob)
      img.src = url
      // console.log(canvas);
      // console.log(canvas.toDataURL());
      ctx.drawImage(img, 0, 0)
      img.onload = function () {
        DOMURL.revokeObjectURL(url)
        // console.log(canvas);
        // console.log(canvas.toDataURL());
        var imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')

        triggerDownload(imgURI)
      }
    })
  }

  const exportDiagram = () => {
    let xmlStr
    modeler.saveXML({ format: true }, function (err, xml) {
      if (err) {
        console.log(err)
      } else {
        console.log(xml)
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

  // Hàm xử lý sự kiện zoomin, zoomout, zoomfit
  const handleZoomOut = async () => {
    let zstep = 0.2
    let canvas = modeler.get('canvas')
    let eventBus = modeler.get('eventBus')

    // set initial zoom level
    canvas.zoom(zlevel, 'auto')
    // zlevel = canvas?._cachedViewbox?.scale;

    // update our zoom level on viewbox change
    await eventBus.on('canvas.viewbox.changed', function (evt) {
      zlevel = evt.viewbox.scale
    })
    zlevel = Math.max(zlevel - zstep, zstep)
    canvas.zoom(zlevel, 'auto')
  }

  const handleZoomReset = () => {
    console.log('click zoom reset')

    let canvas = modeler.get('canvas')
    canvas.zoom('fit-viewport')
  }

  const handleZoomIn = async () => {
    let zstep = 0.2
    let canvas = modeler.get('canvas')
    let eventBus = modeler.get('eventBus')

    // set initial zoom level
    canvas.zoom(zlevel, 'auto')
    // zlevel = canvas?._cachedViewbox?.scale;
    // update our zoom level on viewbox change
    await eventBus.on('canvas.viewbox.changed', function (evt) {
      zlevel = evt.viewbox.scale
    })

    zlevel = Math.min(zlevel + zstep, 7)
    canvas.zoom(zlevel, 'auto')
  }

  // hàm cập nhật thông tin task trong quy trình
  const handleChangeInfo = (value) => {
    let info = {
      ...value,
      code: state.id
    }
    const infos = state.info
    infos[`${state.id}`] = info

    // state.info[`${state.id}`] = info
    setState({
      ...state,
      info: infos
    })
  }

  const setBpmnProcess = (data) => {
    const modeling = modeler.get('modeling')
    let element1 = modeler.get('elementRegistry').get(state.id)
    let manager = []
    data.manager.forEach((x) => {
      manager.push(x.name)
    })
    let viewer = []
    data.viewer.forEach((x) => {
      viewer.push(x.name)
    })
    if (element1) {
      modeling.updateProperties(element1, {
        shapeName: data.processName,
        managerName: manager,
        viewerName: viewer
      })
    }
    const infoTemplates = state.infoTemplate
    if (!state.infoTemplate[`${state.id}`].code) {
      state.infoTemplate[`${state.id}`].code = state.id
    }
    infoTemplates[`${state.id}`].process = data
    state.infoTemplate[`${state.id}`].process = data
    setState({
      ...state,
      infoTemplate: infoTemplates
    })
  }

  // validate quy trình
  const isFormValidate = () => {
    let elementList = modeler.get('elementRegistry')._elements
    let check = true // valid
    let hasStart = false,
      hasEnd = false

    let validateTasks = true
    let { info } = state

    for (let i in info) {
      let taskItem = info[i]
      if (!taskItem.name || taskItem.name?.trim() === '') {
        //taskItem.organizationalUnit.trim() === '' ||
        console.log('-------')
        validateTasks = false
      }
    }

    for (let i in elementList) {
      let e = elementList[i].element
      if (e.type === 'bpmn:StartEvent') {
        hasStart = true
      } else if (e.type === 'bpmn:EndEvent') {
        hasEnd = true
      } else if (e.type === 'bpmn:Task' || e.type === 'bpmn:ExclusiveGateway') {
        if (!e.businessObject.incoming) {
          check = false
        } else if (e.businessObject.incoming.length === 0) {
          check = false
        }

        if (!e.businessObject.outgoing) {
          check = false
        } else if (e.businessObject.outgoing.length === 0) {
          check = false
        }
      }
    }
    if (!hasStart || !hasEnd) {
      check = false
    }
    return (
      check &&
      validateTasks &&
      state.errorOnManager === undefined &&
      state.errorOnProcessDescription === undefined &&
      state.errorOnProcessName === undefined &&
      state.errorOnViewer === undefined
    )
  }

  // hàm lưu
  const save = async () => {
    let elementList = modeler.get('elementRegistry')._elements
    let { info } = state
    let xmlStr
    modeler.saveXML({ format: true }, function (err, xml) {
      xmlStr = xml
    })
    await setState((state) => {
      for (let j in info) {
        if (Object.keys(info[j]).length !== 0) {
          info[j].followingTasks = []
          info[j].preceedingTasks = []

          for (let i in elementList) {
            let elem = elementList[i].element
            if (info[j].code === elem.id) {
              if (elem.businessObject.incoming) {
                let incoming = elem.businessObject.incoming
                for (let x in incoming) {
                  info[j].preceedingTasks.push({
                    // các công việc trc công việc hiện tại
                    task: incoming[x].sourceRef.id,
                    link: incoming[x].name
                  })
                }
              }
              if (elem.businessObject.outgoing) {
                let outgoing = elem.businessObject.outgoing
                for (let y in outgoing) {
                  info[j].followingTasks.push({
                    // các công việc sau công việc hiện tại
                    task: outgoing[y].targetRef.id,
                    link: outgoing[y].name
                  })
                }
              }
            }
          }
        }
      }
      let { infoTemplate } = state
      for (let j in infoTemplate) {
        if (Object.keys(infoTemplate[j]).length !== 0) {
          infoTemplate[j].followingTasks = []
          infoTemplate[j].preceedingTasks = []

          for (let i in elementList) {
            let elem = elementList[i].element
            if (infoTemplate[j].code === elem.id) {
              if (elem.businessObject.incoming) {
                let incoming = elem.businessObject.incoming
                for (let x in incoming) {
                  let types = incoming[x].sourceRef.$type.split(':')
                  // console.log(incoming[x].sourceRef.$type,types);
                  if (types[1] === 'Process') {
                    infoTemplate[j].preceedingTasks.push({
                      // các công việc trc công việc hiện tại
                      process: incoming[x].sourceRef.id,
                      link: incoming[x].name
                      // TODO: activated: false
                    })
                  } else {
                    infoTemplate[j].preceedingTasks.push({
                      // các công việc trc công việc hiện tại
                      task: incoming[x].sourceRef.id,
                      link: incoming[x].name
                      // TODO: activated: false
                    })
                  }
                }
              }
              if (elem.businessObject.outgoing) {
                let outgoing = elem.businessObject.outgoing
                for (let y in outgoing) {
                  let types = outgoing[y].sourceRef.$type.split(':')
                  if (types[1] === 'Process') {
                    infoTemplate[j].followingTasks.push({
                      // các công việc sau công việc hiện tại
                      process: outgoing[y].targetRef.id,
                      link: outgoing[y].name
                    })
                  } else {
                    infoTemplate[j].followingTasks.push({
                      // các công việc sau công việc hiện tại
                      task: outgoing[y].targetRef.id,
                      link: outgoing[y].name
                    })
                  }
                }
              }
            }
          }
        }
      }
      return {
        ...state,
        xmlDiagram: xmlStr
      }
    })

    let data = {
      info: info,
      infoTemplate: infoTemplate,
      xmlDiagram: xmlStr,
      processName: state.processName,
      processDescription: state.processDescription,
      manager: state.manager,
      viewer: state.viewer,
      creator: getStorage('userId'),

      userId: getStorage('userId'),
      pageNumber: props.pageNumber,
      noResultsPerPage: props.noResultsPerPage,
      name: props.name
    }
    props.editXmlDiagram(state.idProcess, data)
  }

  const { translate, role } = props
  const {
    name,
    id,
    idProcess,
    info,
    showInfo,
    processDescription,
    processName,
    viewer,
    manager,
    selectedEdit,
    showInfoProcess,
    infoTemplate
  } = state
  const { listOrganizationalUnit } = props
  let listRole = []
  if (role && role.list.length !== 0) listRole = role.list
  let listItem = listRole
    .filter((e) => ['Admin', 'Super Admin', 'Manager', 'Deputy Manager', 'Employee'].indexOf(e.name) === -1)
    .map((item) => {
      return { text: item.name, value: item._id }
    })

  return (
    <React.Fragment>
      <DialogModal
        size='100'
        modalID={`modal-edit-process`}
        isLoading={false}
        formID='form-task-process'
        disableSubmit={!isFormValidate()}
        title={props.title}
        func={save}
        bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
      >
        <div>
          <div className='nav-tabs-custom' style={{ boxShadow: 'none', MozBoxShadow: 'none', WebkitBoxShadow: 'none', marginBottom: 0 }}>
            <ul className='nav nav-tabs'>
              {/* Nút tab Thông tin quy trình */}
              <li className='active'>
                <a href='#info-edit' onClick={() => handleChangeContent('info')} data-toggle='tab'>
                  {translate('task.task_process.process_information')}
                </a>
              </li>
              {/* Nút tab quy trình - công việc */}
              <li>
                <a href='#process-edit' onClick={() => handleChangeContent('process')} data-toggle='tab'>
                  {translate('task.task_process.task_process')}
                </a>
              </li>
            </ul>
            <div className='tab-content'>
              {/* Tab thôn tin quy trình */}
              <div className={selectedEdit === 'info' ? 'active tab-pane' : 'tab-pane'} id='info-edit'>
                <div className='row'>
                  <div className='col-md-6'>
                    {/* Tên quy trình */}
                    <div className={`form-group ${state.errorOnProcessName === undefined ? '' : 'has-error'}`}>
                      <label className={`control-label`}>
                        {translate('task.task_process.process_name')} <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type='text'
                        value={processName}
                        className='form-control'
                        placeholder={translate('task.task_process.process_name')}
                        onChange={handleChangeBpmnName}
                      />
                      <ErrorLabel content={state.errorOnProcessName} />
                    </div>

                    {/* Mô tả quy trình */}
                    <div className={`form-group ${state.errorOnProcessDescription === undefined ? '' : 'has-error'}`}>
                      <label className='control-label'>
                        {translate('task.task_process.process_description')} <span style={{ color: 'red' }}>*</span>
                      </label>
                      <textarea
                        type='text'
                        rows={4}
                        value={processDescription}
                        className='form-control'
                        placeholder='Mô tả công việc'
                        onChange={handleChangeBpmnDescription}
                      />
                      <ErrorLabel content={state.errorOnProcessDescription} />
                    </div>

                    {/* Người xem quy trình */}
                    <div className={`form-group ${state.errorOnViewer === undefined ? '' : 'has-error'}`}>
                      <label className='control-label'>
                        {translate('task.task_process.viewer')} <span style={{ color: 'red' }}>*</span>
                      </label>
                      {
                        <SelectBox
                          id={`select-viewer-employee-edit-${idProcess}`}
                          className='form-control select2'
                          style={{ width: '100%' }}
                          items={listItem}
                          onChange={handleChangeViewer}
                          multiple={true}
                          value={viewer}
                        />
                      }
                      <ErrorLabel content={state.errorOnViewer} />
                    </div>

                    {/* Người quản lý quy trình */}
                    <div className={`form-group ${state.errorOnManager === undefined ? '' : 'has-error'}`}>
                      <label className='control-label'>
                        {translate('task.task_process.manager')} <span style={{ color: 'red' }}>*</span>
                      </label>
                      {
                        <SelectBox
                          id={`select-manager-employee-edit-${idProcess}`}
                          className='form-control select2'
                          style={{ width: '100%' }}
                          items={listItem}
                          onChange={handleChangeManager}
                          multiple={true}
                          value={manager}
                        />
                      }
                      <ErrorLabel content={state.errorOnManager} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab quy trình - công việc */}
            <div className='tab-content' style={{ padding: 0, marginTop: -15 }}>
              <div className={selectedEdit === 'process' ? 'active tab-pane' : 'tab-pane'} id='process-edit'>
                <div className='row'>
                  {/* Quy trình công việc */}
                  <div className={`contain-border ${showInfo || showInfoProcess ? 'col-md-8' : 'col-md-12'}`}>
                    {/* nút export, import, download diagram,... */}
                    <div
                      className='tool-bar-xml'
                      style={
                        {
                          /*position: "absolute", right: 5, top: 5*/
                        }
                      }
                    >
                      <button onClick={exportDiagram}>Export XML</button>
                      <button onClick={downloadAsSVG}>Save SVG</button>
                      <button onClick={downloadAsImage}>Save Image</button>
                      <button onClick={downloadAsBpmn}>Download BPMN</button>
                    </div>

                    {/* vẽ Diagram */}
                    <div id={generateId}></div>

                    {/* nút Zoom in zoom out */}
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

                  {/* Thông tin công việc trong quy trình */}
                  <div className={`right-content ${showInfo || showInfoProcess ? 'col-md-4' : undefined}`}>
                    {showInfo && (
                      <div>
                        {/* <div>
                                                        <h2>Option {name}</h2>
                                                    </div> */}

                        <EditTaskTemplate
                          isProcess={true}
                          id={id}
                          info={info && info[`${id}`] && info[`${id}`]}
                          onChangeTemplateData={handleChangeInfo}
                          handleChangeName={handleChangeName} // cập nhật tên vào diagram
                          handleChangeResponsible={handleChangeResponsible} // cập nhật hiển thi diagram
                          handleChangeAccountable={handleChangeAccountable} // cập nhật hiển thị diagram
                        />
                      </div>
                    )}

                    {showInfoProcess && (
                      <div>
                        {/* <div>
                                                    <h1>Option {name}</h1>
                                                </div> */}

                        <AddProcessTemplate
                          idParent={props.idProcess}
                          id={id}
                          infoTemplate={
                            infoTemplate && infoTemplate[`${id}`] && infoTemplate[`${id}`].process && infoTemplate[`${id}`].process._id
                          }
                          // handleDataProcessTempalte={handleDataProcessTempalte}
                          setBpmnProcess={setBpmnProcess}
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
    </React.Fragment>
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
  editXmlDiagram: TaskProcessActions.editXmlDiagram
}
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(ModalEditTaskProcess))
export { connectedModalAddProcess as ModalEditTaskProcess }
