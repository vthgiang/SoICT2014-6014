import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  remove as svgRemove
} from 'tiny-svg';

import {
  getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { computeVisibleDayRange } from '@fullcalendar/common';
import { roundProb } from '../../../risk-dash-board/TaskPertHelper';

const HIGH_PRIORITY = 1500,
  TASK_BORDER_RADIUS = 2;


export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {

    // only render tasks and events (ignore labels)
    return isAny(element, ['bpmn:Task', 'bpmn:Event']) && !element.labelTarget;
  }

  drawShape(parentNode, element) {
    var shape = this.bpmnRenderer.drawShape(parentNode, element);
    var prob = element.businessObject.$attrs.riskProb ? element.businessObject.$attrs.riskProb : 0
    var fillColor = this.getColor(prob)

    // const rect = drawRect(parentNode, 160, 120, TASK_BORDER_RADIUS, '#52B415', fillColor);
    // Bắt đầu vẽ
    element.height = 90;
    element.width = 160;
    let b = element.businessObject.$attrs.riskName
    let riskID = element.businessObject.$attrs.riskID
    const line = drawLine(parentNode, 0, 35, 160, 35, 'black');

    let foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');

    //Vẽ tên của công việc lên shape
    foreignObject.setAttribute('x', 5);
    foreignObject.setAttribute('y', 5);
    foreignObject.setAttribute('height', 35);
    foreignObject.setAttribute('width', 150);

    let div = document.createElement('div');
    let att = document.createAttribute("class");        // Create a "href" attribute
    att.value = "task-process-title";            // Set the value of the href attribute
    div.setAttributeNode(att);

    att = document.createAttribute("style");      // Create a "href" attribute
    div.setAttributeNode(att);

    div.innerHTML = b ? riskID.toString() + '.' + b : "";
    foreignObject.appendChild(div);
    svgAppend(parentNode, foreignObject);
    // Ve rui ro
    //Vẽ người thực hiện công việc
    let foreignObject1 = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject1.setAttribute('x', 0);
    foreignObject1.setAttribute('y', 50);
    foreignObject1.setAttribute('height', 70);
    foreignObject1.setAttribute('width', 150);


    let div3 = document.createElement('div');
    let att3 = document.createAttribute("class");        // Create a "href" attribute
    att3.value = "gate-way-progress";            // Set the value of the href attribute
    div3.setAttributeNode(att3);
    att3 = document.createAttribute("style");        // Create a "href" attribute
    div3.setAttributeNode(att3);
    div3.innerHTML = prob ? roundProb(prob) + "%" : "0%";
    foreignObject1.appendChild(div3);
    svgAppend(parentNode, foreignObject1);

    // prependTo(rect, parentNode);

    // svgRemove(shape);

    return shape;
  }
  getColor(prob) {
    let color = "#FF0000"
    if (prob >= 0.5) {
      color = '#FFFF00'
    }
    if (prob >= 0.9) {
      color = '#40FF00'
    }
    return color
  }
  getShapePath(shape) {
    return getRoundRectPath(shape, TASK_BORDER_RADIUS);
  }
  
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, strokeColor, fillColor) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: strokeColor || '#000',
    strokeWidth: 2,
    fill: fillColor
  });

  svgAppend(parentNode, rect);

  return rect;
}


function drawLine(parentNode, x1, y1, x2, y2, color) {
  const line = svgCreate('line');

  svgAttr(line, {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    stroke: color,
    fill: color,
    strokeWidth: 1,
  });

  svgAppend(parentNode, line);

  return line;
}