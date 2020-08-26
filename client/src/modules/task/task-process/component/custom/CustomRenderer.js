import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate
} from 'tiny-svg';

import {
  getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import { isNil } from 'min-dash';

const HIGH_PRIORITY = 1500,
  TASK_BORDER_RADIUS = 5,
  COLOR_GREEN = '#52B415',
  COLOR_YELLOW = '#ffc800',
  COLOR_RED = '#cc0000';


export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;

  }

  canRender(element) {

    // ignore labels
    return !element.labelTarget;
  }



  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);


    const suitabilityScore = this.getSuitabilityScore(element);

    if (element.type == 'bpmn:Task') {
      element.height = 130;
      element.width = 160;
      // let a = element.businessObject.name.split("")
      let b = element.businessObject.name
      console.log(b)
      const line = drawLine(parentNode, 0, 40, 160, 40, 'black');

      var text = svgCreate('text');
      svgAttr(text, {
        fill: 'black',
        transform: 'translate(7, 26)',
        fontSize: "13px",
        fontWeight: "bold",
        fontFamily: "Open Sans"
      });
      svgClasses(text).add('djs-label');
      svgAppend(text, document.createTextNode(b !== undefined ? b : ""));
      svgAppend(parentNode, text);

      text = svgCreate('text');
      svgAttr(text, {
        fill: 'black',
        transform: 'translate(5, 50)',
        fontSize: "10px",
        fontWeight: "bold"
      });
      svgClasses(text).add('djs-label');

      let info = element.businessObject.$attrs.info;
      let accountableName = element.businessObject.$attrs.accountableName
      let responsibleName = element.businessObject.$attrs.responsibleName
      svgAppend(text, document.createTextNode(`${responsibleName ? responsibleName : ""}`));
      svgAppend(parentNode, text);

      text = svgCreate('text');
      svgAttr(text, {
        fill: 'black',
        transform: 'translate(5, 70)',
        fontSize: "10px"
      });
      svgClasses(text).add('djs-label');
      svgAppend(text, document.createTextNode(`${accountableName ? accountableName : ""}`));
      svgAppend(parentNode, text);

      // const line = drawLine(parentNode, 0, 40, 200, 40, 'black');
    }
    return shape;
  }

  getShapePath(shape) {
    if (is(shape, 'bpmn:Task')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }

  getSuitabilityScore(element) {
    const businessObject = getBusinessObject(element);

    const { suitable } = businessObject;

    return Number.isFinite(suitable) ? suitable : null;
  }

  getColor(suitabilityScore) {
    if (suitabilityScore > 75) {
      return COLOR_GREEN;
    } else if (suitabilityScore > 25) {
      return COLOR_YELLOW;
    }

    return COLOR_RED;
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color
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