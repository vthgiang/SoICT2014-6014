import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'

import { append as svgAppend, attr as svgAttr, classes as svgClasses, create as svgCreate } from 'tiny-svg'

import { getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil'

import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'

import { isNil } from 'min-dash'

const HIGH_PRIORITY = 1500,
  TASK_BORDER_RADIUS = 5,
  COLOR_GREEN = '#52B415',
  COLOR_YELLOW = '#ffc800',
  COLOR_RED = '#cc0000'

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY)

    this.bpmnRenderer = bpmnRenderer
  }

  canRender(element) {
    // ignore labels
    return !element.labelTarget
  }

  drawShape(parentNode, element) {
    // svgAppend(svg[2], marker);
    const shape = this.bpmnRenderer.drawShape(parentNode, element)
    let responsible = element.businessObject.$attrs.responsibleName ? element.businessObject.$attrs.responsibleName : ''
    let responsibleName = ''
    let i
    if (Array.isArray(responsible)) {
      for (i = 0; i < responsible.length; i++) {
        if (i !== responsible.length - 1) {
          responsibleName = responsibleName + responsible[i] + ', '
        } else {
          responsibleName = responsibleName + responsible[i]
        }
      }
    } else {
      let responsible1 = responsible.split(',')
      for (i = 0; i < responsible1.length; i++) {
        if (i !== responsible1.length - 1) {
          responsibleName = responsibleName + responsible1[i] + ', '
        } else {
          responsibleName = responsibleName + responsible1[i]
        }
      }
    }

    let accountable = element.businessObject.$attrs.accountableName ? element.businessObject.$attrs.accountableName : ''
    let accountableName = ''
    if (Array.isArray(accountable)) {
      for (i = 0; i < accountable.length; i++) {
        if (i !== accountable.length - 1) {
          accountableName = accountableName + accountable[i] + ', '
        } else {
          accountableName = accountableName + accountable[i]
        }
      }
    } else {
      let accountable1 = accountable.split(',')
      for (i = 0; i < accountable1.length; i++) {
        if (i !== accountable1.length - 1) {
          accountableName = accountableName + accountable1[i] + ', '
        } else {
          accountableName = accountableName + accountable1[i]
        }
      }
    }
    let manager = element.businessObject.$attrs.managerName ? element.businessObject.$attrs.managerName : ''
    let managerName = ''
    if (Array.isArray(manager)) {
      for (i = 0; i < manager.length; i++) {
        if (i !== manager.length - 1) {
          managerName = managerName + manager[i] + ', '
        } else {
          managerName = managerName + manager[i]
        }
      }
    } else {
      let manager1 = manager.split(',')
      for (i = 0; i < manager1.length; i++) {
        if (i !== manager1.length - 1) {
          managerName = managerName + manager1[i] + ', '
        } else {
          managerName = managerName + manager1[i]
        }
      }
    }
    let viewer = element.businessObject.$attrs.viewerName ? element.businessObject.$attrs.viewerName : ''
    let viewerName = ''
    if (Array.isArray(viewer)) {
      for (i = 0; i < viewer.length; i++) {
        if (i !== viewer.length - 1) {
          viewerName = viewerName + viewer[i] + ', '
        } else {
          viewerName = viewerName + viewer[i]
        }
      }
    } else {
      let viewer1 = viewer.split(',')
      for (i = 0; i < viewer1.length; i++) {
        if (i !== viewer1.length - 1) {
          viewerName = viewerName + viewer1[i] + ', '
        } else {
          viewerName = viewerName + viewer1[i]
        }
      }
    }
    if (element.type == 'bpmn:Task') {
      let b = element.businessObject.$attrs.shapeName
      const line = drawLine(parentNode, 0, 50, 160, 50, 'black')

      let foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')

      //Vẽ tên của công việc lên shape
      foreignObject.setAttribute('x', 5)
      foreignObject.setAttribute('y', 5)
      foreignObject.setAttribute('height', 35)
      foreignObject.setAttribute('width', 150)

      let div = document.createElement('div')
      let att = document.createAttribute('class') // Create a "href" attribute
      att.value = 'task-process-title' // Set the value of the href attribute
      div.setAttributeNode(att)

      att = document.createAttribute('style') // Create a "href" attribute
      div.setAttributeNode(att)

      div.innerHTML = b ? b : ''
      foreignObject.appendChild(div)
      svgAppend(parentNode, foreignObject)

      //Vẽ người thực hiện công việc
      let foreignObject1 = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
      foreignObject1.setAttribute('x', 5)
      foreignObject1.setAttribute('y', 60)
      foreignObject1.setAttribute('height', 60)
      foreignObject1.setAttribute('width', 150)

      let div1 = document.createElement('div')
      let att1 = document.createAttribute('class') // Create a "href" attribute
      att1.value = 'list-task-process-responsible' // Set the value of the href attribute
      div1.setAttributeNode(att1)

      att1 = document.createAttribute('style') // Create a "href" attribute
      div1.setAttributeNode(att1)
      div1.innerHTML = responsibleName ? responsibleName : ''
      foreignObject1.appendChild(div1)

      let div2 = document.createElement('div')
      let att2 = document.createAttribute('class') // Create a "href" attribute
      att2.value = 'list-task-process-accountable' // Set the value of the href attribute
      div2.setAttributeNode(att2)
      att2 = document.createAttribute('style') // Create a "href" attribute
      div2.setAttributeNode(att2)
      div2.innerHTML = accountableName ? accountableName : ''
      foreignObject1.appendChild(div2)
      svgAppend(parentNode, foreignObject1)
    }
    if (element.type == 'bpmn:SubProcess') {
      // const svg = document.getElementsByTagName("svg");
      // let marker = document.createElement('marker');
      // marker.setAttribute('id','arrow')
      // marker.setAttribute('viewBox','0 0 10 10')
      // marker.setAttribute('refX','0')
      // marker.setAttribute('refY','5')
      // marker.setAttribute('orient','auto')
      // let path = document.createElement('path');
      // path.setAttribute('d',"M 0 0 L 10 5 L 0 10 z")
      // marker.appendChild(path)
      // svg[2].insertBefore(marker, svg[2].childNodes[0])
      let b = element.businessObject.$attrs.shapeName
      const line = drawLine(parentNode, 0, 50, 260, 50, 'black')
      const line2 = drawLine(parentNode, 0, 131, 260, 131, 'black')
      const line1 = drawLine(parentNode, 52, 155, 194, 155, 'black', 'url(#arrow)')
      const circle_start = drawCircle(parentNode, 36, 155, 14.5, 'black', 1.7, 'white')
      const circle_end = drawCircle(parentNode, 210, 155, 14.5, 'black', 3.4, 'white')
      let foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
      //Vẽ tên của công việc lên shape
      foreignObject.setAttribute('x', 5)
      foreignObject.setAttribute('y', 5)
      foreignObject.setAttribute('height', 35)
      foreignObject.setAttribute('width', 260)

      let div = document.createElement('div')
      let att = document.createAttribute('class') // Create a "href" attribute
      att.value = 'process-title' // Set the value of the href attribute
      div.setAttributeNode(att)

      att = document.createAttribute('style') // Create a "href" attribute
      div.setAttributeNode(att)

      div.innerHTML = b ? b : ''
      foreignObject.appendChild(div)
      svgAppend(parentNode, foreignObject)

      //Vẽ người quản lý quy trình
      let foreignObject1 = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
      foreignObject1.setAttribute('x', 5)
      foreignObject1.setAttribute('y', 60)
      foreignObject1.setAttribute('height', 60)
      foreignObject1.setAttribute('width', 260)

      let div1 = document.createElement('div')
      let att1 = document.createAttribute('class') // Create a "href" attribute
      att1.value = 'list-process-manager' // Set the value of the href attribute
      div1.setAttributeNode(att1)

      att1 = document.createAttribute('style') // Create a "href" attribute
      div1.setAttributeNode(att1)
      div1.innerHTML = managerName ? managerName : ''
      foreignObject1.appendChild(div1)

      let div2 = document.createElement('div')
      let att2 = document.createAttribute('class') // Create a "href" attribute
      att2.value = 'list-process-viewer' // Set the value of the href attribute
      div2.setAttributeNode(att2)
      att2 = document.createAttribute('style') // Create a "href" attribute
      div2.setAttributeNode(att2)
      div2.innerHTML = viewerName ? viewerName : ''
      foreignObject1.appendChild(div2)
      svgAppend(parentNode, foreignObject1)
    }

    if (element.type == 'bpmn:ExclusiveGateway') {
      let b = element.businessObject.$attrs.shapeName

      //Vẽ tên của công việc lên shape
      let foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
      foreignObject.setAttribute('x', -50)
      foreignObject.setAttribute('y', -55)
      foreignObject.setAttribute('height', 48)
      foreignObject.setAttribute('width', 150)

      //tao div cha
      let parentDiv = document.createElement('div')
      let parentAtt = document.createAttribute('class')
      parentAtt.value = 'parent-task-process-gate-way-title'
      parentDiv.setAttributeNode(parentAtt)
      parentAtt = document.createAttribute('style')
      parentDiv.setAttributeNode(parentAtt)

      //tao div con
      let div = document.createElement('div')
      let att = document.createAttribute('class') // Create a "href" attribute
      att.value = 'task-process-gate-way-title' // Set the value of the href attribute
      div.setAttributeNode(att)
      att = document.createAttribute('style') // Create a "href" attribute
      div.setAttributeNode(att)
      div.innerHTML = b ? b : ''

      parentDiv.appendChild(div)

      foreignObject.appendChild(parentDiv)
      svgAppend(parentNode, foreignObject)

      //Vẽ người thực hiện công việc
      let foreignObject1 = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
      foreignObject1.setAttribute('x', -50)
      foreignObject1.setAttribute('y', 60)
      foreignObject1.setAttribute('height', 70)
      foreignObject1.setAttribute('width', 150)

      let div1 = document.createElement('div')
      let att1 = document.createAttribute('class') // Create a "href" attribute
      att1.value = 'list-task-process-gate-way-responsible' // Set the value of the href attribute
      div1.setAttributeNode(att1)

      att1 = document.createAttribute('style') // Create a "href" attribute
      div1.setAttributeNode(att1)
      div1.innerHTML = responsibleName ? responsibleName : ''
      foreignObject1.appendChild(div1)

      let div2 = document.createElement('div')
      let att2 = document.createAttribute('class') // Create a "href" attribute
      att2.value = 'list-task-process-gate-way-accountable' // Set the value of the href attribute
      div2.setAttributeNode(att2)

      att2 = document.createAttribute('style') // Create a "href" attribute
      div2.setAttributeNode(att2)
      div2.innerHTML = accountableName ? accountableName : ''
      foreignObject1.appendChild(div2)
      svgAppend(parentNode, foreignObject1)
    }
    return shape
  }

  getShapePath(shape) {
    if (is(shape, 'bpmn:Task')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS)
    }
    if (is(shape, 'bpmn:Group')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS)
    }

    return this.bpmnRenderer.getShapePath(shape)
  }

  getSuitabilityScore(element) {
    const businessObject = getBusinessObject(element)

    const { suitable } = businessObject

    return Number.isFinite(suitable) ? suitable : null
  }

  getColor(suitabilityScore) {
    if (suitabilityScore > 75) {
      return COLOR_GREEN
    } else if (suitabilityScore > 25) {
      return COLOR_YELLOW
    }

    return COLOR_RED
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer']

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate('rect')

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color
  })

  svgAppend(parentNode, rect)

  return rect
}

function drawCircle(parentNode, cx, cy, r, stroke_color, strokeWidth, color) {
  const circle = svgCreate('circle')

  svgAttr(circle, {
    cx: cx,
    cy: cy,
    r: r,
    stroke: stroke_color,
    fill: color,
    strokeWidth: strokeWidth
  })

  svgAppend(parentNode, circle)

  return circle
}

function drawLine(parentNode, x1, y1, x2, y2, color, markerEnd) {
  const line = svgCreate('line')

  svgAttr(line, {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    stroke: color,
    fill: color,
    strokeWidth: 1
  })
  if (markerEnd) {
    line.setAttribute('marker-end', markerEnd)
  }
  svgAppend(parentNode, line)

  return line
}
