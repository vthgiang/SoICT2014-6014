import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import React, { useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { DialogModal } from '../../../common-components'
import customModule from './risk-diagram'

ElementFactory.prototype._getDefaultSize = function (semantic) {
  if (is(semantic, 'bpmn:Task')) {
    return { width: 50, height: 50 }
  }

  if (is(semantic, 'bpmn:Gateway')) {
    return { width: 50, height: 50 }
  }

  if (is(semantic, 'bpmn:Event')) {
    return { width: 36, height: 36 }
  }

  if (is(semantic, 'bpmn:Participant')) {
    return { width: 350, height: 250 }
  }

  if (is(semantic, 'bpmn:TextAnnotation')) {
    return { width: 100, height: 30 }
  }
  return { width: 50, height: 80 }
}

// Xóa element khỏi palette
const _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries
PaletteProvider.prototype.getPaletteEntries = function (element) {
  const entries = _getPaletteEntries.apply(this)
  // for (let entry in entries) {
  //     delete entries[entry]
  // }
  delete entries['create.subprocess-expanded']
  delete entries['create.data-store']
  delete entries['create.data-object']
  delete entries['create.group']
  // delete entries['create.participant-expanded'];
  delete entries['create.intermediate-event']
  delete entries['create.task']
  // delete entries
  return entries
}
var zlevel = 1
// diagram khởi tạo
const InitialDiagram =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
  'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
  'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
  'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
  'targetNamespace="http://bpmn.io/schema/bpmn" ' +
  'id="Definitions_2">' +
  '<bpmn:process id="Process_4" isExecutable="false">' +
  '</bpmn:process>' +
  '<bpmndi:BPMNDiagram id="BPMNDiagram_2">' +
  '<bpmndi:BPMNPlane id="BPMNPlane_2" bpmnElement="Process_3">' +
  '</bpmndi:BPMNPlane>' +
  '</bpmndi:BPMNDiagram>' +
  '</bpmn:definitions>'
var zlevel = 1

function VisualizeRisk(props) {
  const { translate, exprimentalData, task } = props
  const initialDiagram = InitialDiagram
  const [modeler, setModeler] = useState(
    new BpmnModeler({
      additionalModules: [
        customModule,
        {
          contextPad: ['value', {}],
          contextPadProvider: ['value', {}],
          palette: ['value', {}],
          paletteProvider: ['value', {}],
          dragging: ['value', {}],
          move: ['value', {}],
          create: ['value', {}]
        }
      ]
    })
  )
  useEffect(() => {
    console.log(task)
    modeler.attachTo('#diagram-risk')
    const eventBus = modeler.get('eventBus')
    console.log(eventBus)
    // Vo hieu hoa double click edit label
    eventBus.on('element.dblclick', 10000, function (event) {
      const { element } = event
      if (isAny(element, ['bpmn:Task'])) {
        return false // will cancel event
      }
    })
  }, [])
  useEffect(() => {
    if (exprimentalData.data.riskData.length != 0) {
      console.log('exprimental Data', exprimentalData)
      modeler.importXML(initialDiagram, function () {
        const elementFactory = modeler.get('elementFactory')
        const elementRegistry = modeler.get('elementRegistry')
        const modeling = modeler.get('modeling')
        const bpmnFactory = modeler.get('bpmnFactory')
        const process = elementRegistry.get('Process_4')
        const { riskData } = exprimentalData.data
        const riskClassList = riskData.filter((rd) => rd.ID < 5)
        // Tao cac nut
        for (const risk of riskData) {
          console.log('risk', risk, Number.isInteger(risk.ID))
          var taskBusinessObject = bpmnFactory.create('bpmn:Task', {
            id: risk._id.toString(),
            riskProb: risk.prob,
            riskName: risk.name,
            // riskProb: 0,
            parentList: risk.parentList,
            riskID: risk.ID,
            isRiskClass: Number.isNaN(parseInt(risk.ID))
          })
          var riskNode = elementFactory.createShape({ type: 'bpmn:Task', businessObject: taskBusinessObject })
          // Search
          modeling.createShape(riskNode, { x: 400, y: 150 }, process)
          const element1 = elementRegistry.get(risk._id.toString())

          modeling.setColor(element1, null)
          element1 &&
            modeling.setColor(element1, {
              fill: 'gray',
              stroke: '#14984c', // E02001
              width: '5px'
            })
        }
        // di chuyen cho dung vi tri
        const placeMap = new Map([
          ['human', 1],
          ['enviroment', 2],
          ['product', 3],
          ['equipment', 4]
        ])

        for (const risk of riskData) {
          const element1 = elementRegistry.get(risk._id)
          // console.log(risk.riskID)
          let down = 1
          const parentList = risk.parentList.map((par) => par._id)
          // console.log('parentList', parentList)
          if (parentList.length != 0) {
            modeling.moveElements([element1], {
              x: 270 * (placeMap.get(risk.ID) - 1),
              y: 0
            })
            for (const parId of parentList) {
              const parent = elementRegistry.get(parId)
              modeling.moveElements([parent], {
                x: props.output ? 270 * (placeMap.get(risk.ID) - 1) + 135 : 270 * (placeMap.get(risk.ID) - 1) + 115,
                y: props.output ? 150 * down : 50 * down
              })
              if (down <= parentList.length) {
                down++
              }
            }
          }
        }
        // Tao nut rui ro cha
        // console.log('taskClass', task)
        // Lấy các nút rủi ro tương ứng với task
        let riskRelate = task.riskClass

        riskRelate = riskData.filter((rd) => riskRelate.includes(rd.ID))
        console.log(riskRelate)
        let prob = 1
        for (const rl of riskRelate) {
          prob *= rl.prob
        }
        var taskBusinessObject = bpmnFactory.create('bpmn:Task', {
          id: 'risk_total',
          parents: [],
          riskProb: 0,
          taskClass: 0,
          riskName: `Total Risk ${task.ID}`,
          parentList: [],
          riskID: 0
        })
        var riskNode = elementFactory.createShape({ type: 'bpmn:Task', businessObject: taskBusinessObject })

        modeling.createShape(riskNode, { x: 750, y: 10 }, process)
        const element1 = elementRegistry.get(riskNode.id)
        // Nối các class với nút Risk
        for (const risk of riskData) {
          const dashed = !task.riskClass.includes(risk.ID)
          const width = task.riskClass.includes(risk.ID) ? '3px' : '2px'
          const colorUpdate = task.riskClass.includes(risk.ID) ? 'red' : '#424242'
          if (risk.parentList.length != 0) {
            const element = elementRegistry.get(risk._id)
            modeling.connect(element, element1, {
              type: 'bpmn:SequenceFlow',
              colorUpdate,
              dashed,
              width,
              riskID: risk.riskID
            })
          }
        }
        let riskAvailableList = riskData.filter((risk) => task.riskClass.includes(risk.ID))
        const belongClass = (risk, classList) => {
          const { parentList } = risk
          for (const par of parentList) {
            if (classList.includes(par)) return true
          }
          return false
        }
        riskAvailableList = riskAvailableList.concat(riskData.filter((risk) => belongClass(risk, riskAvailableList)))
        console.log('avail', riskAvailableList)
        // Noi cac nut voi nhau
        for (const risk of riskData) {
          const dashed = !task.riskClass.includes(risk.ID)
          const width = task.riskClass.includes(risk.ID) ? '3px' : '2px'
          const colorUpdate = task.riskClass.includes(risk.ID) ? 'red' : '#424242'
          const element1 = elementRegistry.get(risk._id)
          const parentList = risk.parentList.map((par) => par._id)
          if (parentList.length != 0) {
            for (const parId of parentList) {
              const parent = elementRegistry.get(parId)

              modeling.connect(parent, element1, {
                type: 'bpmn:SequenceFlow',
                colorUpdate,
                dashed,
                width
              })
            }
          }
        }
      })
    }
  }, [task])
  // các hàm thu nhỏ, phóng to, vừa màn hình cho diagram
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
  return (
    <DialogModal
      modalID='visualize-risk'
      formID='visulize-risk'
      title='Input'
      msg_success={translate('manage_risk.add_success')}
      msg_faile={translate('manage_risk.add_fail')}
      // func={save}
      // disableSubmit={!isFormValidated()}
      size={100}
      maxWidth={500}
    >
      <div className='box'>
        <div className='box-body'>
          <div className='row'>
            <div id='diagram-risk' style={{ height: 400 }} />
          </div>
          <div className='row'>
            <div className='io-zoom-controls '>
              <ul className='io-zoom-reset io-control io-control-list'>
                <li>
                  <a id='reset' style={{ cursor: 'pointer' }} title='Reset zoom' onClick={handleZoomReset}>
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
      </div>
    </DialogModal>
  )
}
function mapState(state) {
  const { risk, exprimentalData } = state
  return { risk, exprimentalData }
}

const actions = {}
const connectedVisualizeRisk = connect(mapState, actions)(withTranslate(VisualizeRisk))
export { connectedVisualizeRisk as VisualizeRisk }
