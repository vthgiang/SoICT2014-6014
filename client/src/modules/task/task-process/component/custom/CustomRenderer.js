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

      // const rect = drawRect(parentNode, 200, 120, 10, 'black');
      // svgAttr(rect, {
      //   transform: 'translate(0, 20)'
      // });

      const line = drawLine(parentNode, 0, 30, 160, 30, 'black');
      const line1 = drawLine(parentNode, 0, 90, 160, 90, 'black');


      var text = svgCreate('text');
      svgAttr(text, {
        fill: 'black',
        transform: 'translate(5, 25)',
        fontSize: "20px"
      });
      svgClasses(text).add('djs-label');
      svgAppend(text, document.createTextNode(element.businessObject.name !== undefined ? element.businessObject.name : ""));
      svgAppend(parentNode, text);

      var a = 'Nguyễn Văn A'
      var b = "Nguyễn Văn B"
      text = svgCreate('text');
      svgAttr(text, {
        fill: 'black',
        transform: 'translate(5, 50)',
        fontSize: "10px"
      });
      svgClasses(text).add('djs-label');

      let info = element.businessObject.$attrs.info;
      svgAppend(text, document.createTextNode(`Thực hiện: ${info ? (info[element.id]?.responsible ? info[element.id].responsible : "" ): ""}`));
      svgAppend(parentNode, text);

      text = svgCreate('text');
      svgAttr(text, {
        fill: 'black',
        transform: 'translate(5, 70)',
        fontSize: "10px"
      });
      svgClasses(text).add('djs-label');
      svgAppend(text, document.createTextNode(`Phê duyệt: ${info ? (info[element.id]?.accountable? info[element.id].accountable : "") : ""}`));
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