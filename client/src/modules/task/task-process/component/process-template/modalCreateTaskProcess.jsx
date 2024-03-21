import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getStorage } from '../../../../../config'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, SelectBox, ErrorLabel } from '../../../../../common-components'
import { TaskProcessActions } from '../../redux/actions'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { AddTaskTemplate } from '../../../task-template/component/addTaskTemplate'

import { is } from 'bpmn-js/lib/util/ModelUtil'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import BpmnViewer from 'bpmn-js'
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider'
import customModule from '../custom-task-process-template'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import './processDiagram.css'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { AddProcessTemplate } from './addProcessTemplateChild'
import { ModalViewTaskProcess } from './modalViewTaskProcess'
import { ModalViewBpmnProcessTemplateChild } from './viewBpmnProcessTemplateChild'

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

  if (is(semantic, 'bpmn:TextAnnotation')) {
    return { width: 100, height: 30 }
  }
  return { width: 100, height: 80 }
}

//Xóa element khỏi palette
var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries
PaletteProvider.prototype.getPaletteEntries = function (element) {
  var entries = _getPaletteEntries.apply(this)
  delete entries['create.subprocess-expanded']
  delete entries['create.data-store']
  delete entries['create.data-object']
  delete entries['create.group']
  delete entries['create.participant-expanded']
  delete entries['create.intermediate-event']
  delete entries['create.task']
  delete entries['create.process']
  return entries
}

// diagram khởi tạo
const InitialDiagram =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
  'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
  'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
  'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
  'targetNamespace="http://bpmn.io/schema/bpmn" ' +
  'id="Definitions_1">' +
  '<bpmn:process id="Process_1" isExecutable="false">' +
  // '<bpmn:startEvent id="StartEvent_1"/>' +
  '</bpmn:process>' +
  '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
  '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
  '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
  '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' +
  '</bpmndi:BPMNShape>' +
  '</bpmndi:BPMNPlane>' +
  '</bpmndi:BPMNDiagram>' +
  '</bpmn:definitions>'

// zoom level mặc định, dùng cho zoomin zoomout
var zlevel = 1

function ModalCreateTaskProcess(props) {
  const [state, setState] = useState({
    userId: getStorage('userId'),
    currentRole: getStorage('currentRole'),
    showInfo: false,
    showInfoProcess: false,
    selectedCreate: 'info',
    info: {},
    infoTemplate: {},
    save: false,
    manager: [],
    viewer: [],
    processName: '',
    processDescription: '',
    indexRenderer: 0,
    showProcessTemplate: false,
    dataProcessTask: {}
  })
  const initialDiagram = InitialDiagram
  const [modeler, setModeler] = useState(
    new BpmnModeler({
      additionalModules: [customModule, { zoomScroll: ['value', ''] }]
    })
  )
  const generateId = 'createprocess'
  if (state.save === true) {
    props.getAllDepartments()
    modeler.importXML(initialDiagram)
    setState({
      ...state,
      save: false
    })
  }

  useEffect(() => {
    props.getAllDepartments()
    modeler.attachTo('#' + generateId)
    modeler.importXML(initialDiagram)
    var eventBus = modeler.get('eventBus')
    //Vo hieu hoa double click edit label
    eventBus.on('element.dblclick', 10000, function (event) {
      var element = event.element

      if (isAny(element, ['bpmn:Task'])) {
        return false // will cancel event
      }
      if (isAny(element, ['bpmn:SubProcess'])) {
        return false // will cancel event
      }
    })

    //Vo hieu hoa edit label khi tao shape
    eventBus.on(['create.end', 'autoPlace.end'], 250, (e) => {
      // if (e.element[0].type === "bpmn:Task") {
      modeler.get('directEditing').cancel()
      // }
    })
    // console.log(props);
    modeler.on('element.click', 1, (e) => interactPopup(e))

    modeler.on('shape.remove', 1000, (e) => deleteElements(e))

    modeler.on('commandStack.shape.delete.revert', (e) => handleUndoDeleteElement(e))
  }, [])

  // Hàm đổi tên Quy trình
  const handleChangeBpmnName = async (e) => {
    let { value } = e.target
    let { message } = ValidationHelper.validateName(props.translate, value)

    await setState((state) => {
      return {
        ...state,
        processName: value,
        errorOnProcessName: message
      }
    })
  }

  // Hàm cập nhật mô tả quy trình
  const handleChangeBpmnDescription = async (e) => {
    let { value } = e.target
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    await setState((state) => {
      return {
        ...state,
        processDescription: value,
        errorOnProcessDescription: message
      }
    })
  }

  // Hàm cập nhật người được xem quy trình
  const handleChangeViewer = async (value) => {
    let { message } = ValidationHelper.validateArrayLength(props.translate, value)

    await setState((state) => {
      return {
        ...state,
        viewer: value,
        errorOnViewer: message
      }
    })
  }

  // Hàm cập nhật người quản lý quy trình
  const handleChangeManager = async (value) => {
    let { message } = ValidationHelper.validateArrayLength(props.translate, value)

    await setState((state) => {
      return {
        ...state,
        manager: value,
        errorOnManager: message
      }
    })
  }

  // Các hàm cập nhật thông tin task

  // hàm up date thông tin task vào diagram xml
  const handleUpdateElement = (abc) => {
    const modeling = modeler.get('modeling')
    let element1 = modeler.get('elementRegistry').get(state.id)
    modeling.updateProperties(element1, {
      info: state.info
    })
  }

  // hàm cập nhật tên công việc trong quy trình
  const handleChangeName = async (value) => {
    let stringName = value
    const modeling = modeler.get('modeling')
    let element1 = modeler.get('elementRegistry').get(state.id)
    modeling.updateProperties(element1, {
      shapeName: stringName
    })

    // forceUpdate();
  }

  // hàm cập nhật người thực hiện công việc
  const handleChangeResponsible = async (value) => {
    const modeling = modeler.get('modeling')
    let element1 = modeler.get('elementRegistry').get(state.id)
    let { user } = props
    let responsibleName
    let responsible = []
    value.forEach((x) => {
      responsible.push(user.list.find((y) => y._id == x).name)
    })
    modeling.updateProperties(element1, {
      responsibleName: responsible
    })
  }

  // hàm cập nhật người phê duyệt công việc
  const handleChangeAccountable = async (value) => {
    const modeling = modeler.get('modeling')
    let element1 = modeler.get('elementRegistry').get(state.id)
    let { user } = props
    let accountableName
    let accountable = []
    value.forEach((x) => {
      accountable.push(user.list.find((y) => y._id == x).name)
    })
    modeling.updateProperties(element1, {
      accountableName: accountable
    })
  }

  // const handleChangeViewerBpmn = async (value) => {
  // 	const modeling = modeler.get('modeling');
  // 	let element1 = modeler.get('elementRegistry').get(state.id);
  // 	let viewer = []
  // 	value.forEach(x => {
  // 		viewer.push(x.name)
  // 	})
  // 	modeling.updateProperties(element1, {
  // 		viewerName: viewer
  // 	});

  // }

  // // hàm cập nhật người phê duyệt công việc
  // const handleChangeManagerBpmn = async (value) => {
  // 	const modeling = modeler.get('modeling');
  // 	let element1 = modeler.get('elementRegistry').get(state.id);
  // 	let manager = []
  // 	value.forEach(x => {
  // 		manager.push(x.name)
  // 	})
  // 	modeling.updateProperties(element1, {
  // 		managereName: manager
  // 	});
  // }

  // hàm cập nhật màu sắc trong diagram
  const done = (e) => {
    const modeling = modeler.get('modeling')
    e.preventDefault()
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
        fill: '#7236ff',
        stroke: '#7236ff'
      })
    })
  }

  // Các hàm sự kiện của BPMN element
  const interactPopup = async (event) => {
    let element = event.element
    // console.log(props);
    let nameStr = element.type.split(':')

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
          // console.log('props.listOrganizationalUnit[0]?._id', props.listOrganizationalUnit[0]?._id);
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
        return { ...state, showInfoProcess: false, showInfo: false, type: element.type, name: '', id: element.businessObject.id }
      }
    })
  }

  const deleteElements = (event) => {
    var element = event.element
    // console.log(element);
    setState((state) => {
      delete state.info[`${state.id}`]
      return {
        ...state,
        showInfo: false,
        showInfoProcess: false
      }
    })
    // console.log(state);
  }

  const handleUndoDeleteElement = (event) => {
    var element = event.context.shape
  }

  const changeNameElement = (event) => {
    var name = event.element.businessObject.name
  }

  // các hàm dành cho export, import, download diagram...
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

  // Các hàm xử lý tabbedPane
  const handleChangeContent = async (content) => {
    await setState((state) => {
      return {
        ...state,
        selectedCreate: content
      }
    })
  }

  // hàm cập nhật các thông tin của task trong quy trình
  const handleChangeInfo = (value) => {
    let info = {
      ...value,
      code: state.id
    }

    const infos = state.info
    infos[`${state.id}`] = info

    state.info[`${state.id}`] = info
    setState({
      ...state,
      info: infos
    })
  }

  const handleDataProcessTempalte = async (value) => {
    // console.log(value);
    await setState({
      ...state,
      dataProcessTask: value,
      showProcessTemplate: true
    })
    // modeler.importXML(value.xmlDiagram)
    await window.$(`#modal-view-process`).modal('show')
  }

  // validate quy trình
  const isFormValidate = () => {
    // let elementList = await modeler.get('elementRegistry')._elements;
    let elementList = modeler.get('elementRegistry')._elements
    let check = true // valid
    let hasStart = false,
      hasEnd = false

    let validateTasks = true
    let { info } = state

    for (let i in info) {
      let taskItem = info[i]
      if (!taskItem.name || taskItem.name?.trim() === '') {
        // taskItem.organizationalUnit.trim() === '' ||
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
      state.manager &&
      state.manager.length !== 0 &&
      state.viewer &&
      state.viewer.length !== 0 &&
      validateTasks &&
      state.processDescription.trim() !== '' &&
      state.processName.trim() !== '' &&
      state.errorOnManager === undefined &&
      state.errorOnProcessDescription === undefined &&
      state.errorOnProcessName === undefined &&
      state.errorOnViewer === undefined
    )
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
    let infoTemplate = {
      ...data,
      code: state.id
    }
    const infoTemplates = state.infoTemplate
    infoTemplates[`${state.id}`] = infoTemplate
    state.infoTemplate[`${state.id}`] = infoTemplate
    setState({
      ...state,
      infoTemplate: infoTemplates
    })
  }

  // hàm lưu
  const save = async () => {
    let elementList = modeler.get('elementRegistry')._elements
    // let { info } = state;
    let { department } = props
    let xmlStr
    modeler.saveXML({ format: true }, function (err, xml) {
      xmlStr = xml
    })
    // console.log('infooo', state);
    await setState((state) => {
      let { info } = state
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
                  let types = incoming[x].sourceRef.$type.split(':')
                  // console.log(incoming[x].sourceRef.$type,types);
                  if (types[1] === 'SubProcess') {
                    info[j].preceedingTasks.push({
                      // các công việc trc công việc hiện tại
                      process: incoming[x].sourceRef.id,
                      link: incoming[x].name
                      // TODO: activated: false
                    })
                  } else {
                    info[j].preceedingTasks.push({
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
                  if (types[1] === 'SubProcess') {
                    info[j].followingTasks.push({
                      // các công việc sau công việc hiện tại
                      process: outgoing[y].targetRef.id,
                      link: outgoing[y].name
                    })
                  } else {
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
                  if (types[1] === 'SubProcess') {
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
                  if (types[1] === 'SubProcess') {
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

    // console.log('infooo', state);

    let data = {
      info: info,
      infoTemplate: infoTemplate,
      xmlDiagram: xmlStr,
      processName: state.processName,
      processDescription: state.processDescription,
      manager: state.manager,
      viewer: state.viewer,
      creator: getStorage('userId')
    }
    console.log(data)
    await props.createXmlDiagram(data)

    // RESET FORM CREATE

    setState((state) => {
      return {
        ...state,
        indexRenderer: state.indexRenderer + 1,
        processName: null,
        processDescription: '',
        viewer: undefined,
        manager: undefined,
        save: true,
        showInfo: false,
        info: [],
        infoTemplate: [],
        errorOnProcessName: undefined,
        errorOnProcessDescription: undefined,
        errorOnViewer: undefined,
        errorOnManager: undefined
      }
    })
    modeler.importXML(initialDiagram)
  }

  const { translate, department, role } = props
  const {
    id,
    name,
    info,
    showInfo,
    showInfoProcess,
    processDescription,
    processName,
    viewer,
    manager,
    selectedCreate,
    indexRenderer,
    type,
    infoTemplate
  } = state
  const { listOrganizationalUnit } = props
  if (type === 'bpmn:ExclusiveGateway' && info && id && info[id].name) {
    window.$(`.task-process-gate-way-title`).css('background-color', 'white')
  }
  let listRole = []
  if (role && role.list.length !== 0) listRole = role.list
  let listItem = listRole
    .filter((e) => ['Admin', 'Super Admin', 'Manager', 'Deputy Manager', 'Employee'].indexOf(e.name) === -1)
    .map((item) => {
      return { text: item.name, value: item._id }
    })
  // console.log(state.dataProcessTask);
  return (
    <React.Fragment>
      <DialogModal
        size='100'
        modalID='modal-create-process-task'
        isLoading={false}
        formID='form-create-process-task'
        resetOnSave={true}
        resetOnClose={true}
        title={props.title}
        func={save}
        disableSubmit={!isFormValidate()}
        bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
      >
        <form id='form-create-process-task'>
          <div>
            <div className='nav-tabs-custom' style={{ boxShadow: 'none', MozBoxShadow: 'none', WebkitBoxShadow: 'none', marginBottom: 0 }}>
              {/* Tabbed pane */}
              <ul className='nav nav-tabs'>
                {/* Nút tab thông tin cơ bản quy trình */}
                <li className='active'>
                  <a href='#info-create' onClick={() => handleChangeContent('info')} data-toggle='tab'>
                    {translate('task.task_process.process_information')}
                  </a>
                </li>
                {/* Nút tab quy trình - công việc */}
                <li>
                  <a href='#process-create' onClick={() => handleChangeContent('process')} data-toggle='tab'>
                    {translate('task.task_process.task_process')}
                  </a>
                </li>
              </ul>

              {/* tab thông tin quy trình */}
              <div className='tab-content'>
                <div className={selectedCreate === 'info' ? 'active tab-pane' : 'tab-pane'} id='info-create'>
                  <div className='row'>
                    <div className='col-md-6'>
                      {/* tên quy trình */}
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
                          placeholder={translate('task.task_process.process_description')}
                          onChange={handleChangeBpmnDescription}
                        />
                        <ErrorLabel content={state.errorOnProcessDescription} />
                      </div>

                      <div className={`form-group ${state.errorOnViewer === undefined ? '' : 'has-error'}`}>
                        {/* Người được xem mẫu quy trình */}
                        <label className='control-label'>
                          {translate('task.task_process.viewer')} <span style={{ color: 'red' }}>*</span>
                        </label>
                        {
                          <SelectBox
                            id={`select-viewer-employee-create-${indexRenderer}`}
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

                      <div className={`form-group ${state.errorOnManager === undefined ? '' : 'has-error'}`}>
                        {/* Người quản lý mẫu quy trình */}
                        <label className='control-label'>
                          {translate('task.task_process.manager')} <span style={{ color: 'red' }}>*</span>
                        </label>
                        {
                          <SelectBox
                            id={`select-manager-employee-create-${indexRenderer}`}
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
                <div className={selectedCreate === 'process' ? 'active tab-pane' : 'tab-pane'} id='process-create'>
                  <div className=''>
                    {/* Quy trình công việc */}
                    <div className={`contain-border ${showInfo || showInfoProcess ? 'col-md-8' : 'col-md-12'}`}>
                      {/*
                                                state.showProcessTemplate &&
                                                <ModalViewTaskProcess
                                                    title={translate("task.task_process.view_process_template_modal")}
                                                    data={state.dataProcessTask}
                                                    idProcess={state.dataProcessTask._id}
                                                    xmlDiagram={state.dataProcessTask.xmlDiagram}
                                                    processName={state.dataProcessTask.processName}
                                                    processDescription={state.dataProcessTask.processDescription}
                                                    infoTask={state.dataProcessTask.tasks}
                                                    creator={state.dataProcessTask.creator}
                                                />*/}

                      {/* nút export, import diagram,... */}
                      <div>
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

                        {/* phần vẽ biểu đồ */}
                        <div id={generateId}></div>

                        {/* Nút zoom in, zoom out */}
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

                    {/* form thông tin công việc */}
                    <div className={`right-content ${showInfo || showInfoProcess ? 'col-md-4' : undefined}`}>
                      {showInfo && (
                        <div>
                          {/* <div>
                                                        <h1>Option {name}</h1>
                                                    </div> */}

                          <AddTaskTemplate
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
                            id={id}
                            infoTemplate={infoTemplate && infoTemplate[`${id}`] && infoTemplate[`${id}`]._id}
                            handleDataProcessTempalte={handleDataProcessTempalte}
                            setBpmnProcess={setBpmnProcess}
                            handleChangeName={handleChangeName} // cập nhật tên vào diagram
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
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { user, auth, department, role } = state
  return { user, auth, department, role }
}

const actionCreators = {
  getAllDepartments: DepartmentActions.get,
  getDepartment: UserActions.getDepartmentOfUser,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  createXmlDiagram: TaskProcessActions.createXmlDiagram,
  getXmlDiagramById: TaskProcessActions.getXmlDiagramById
}
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(ModalCreateTaskProcess))
export { connectedModalAddProcess as ModalCreateTaskProcess }
