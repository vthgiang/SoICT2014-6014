const SUITABILITY_SCORE_HIGH = 100,
  SUITABILITY_SCORE_AVERGE = 50,
  SUITABILITY_SCORE_LOW = 25

export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate

    palette.registerProvider(this)
  }

  getPaletteEntries(element) {
    const { bpmnFactory, create, elementFactory, translate } = this

    function createTask(suitabilityScore) {
      return function (event) {
        const businessObject = bpmnFactory.create('bpmn:Task')

        businessObject.suitable = suitabilityScore

        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject
        })

        create.start(event, shape)
      }
    }
    function createProcessTask(suitabilityScore) {
      return function (event) {
        const businessObject = bpmnFactory.create('bpmn:SubProcess')

        businessObject.suitable = suitabilityScore

        const shape = elementFactory.createShape({
          type: 'bpmn:SubProcess',
          businessObject: businessObject
        })

        create.start(event, shape)
      }
    }

    return {
      'create.average-task': {
        group: 'activity',
        className: 'bpmn-icon-task yellow',
        title: translate('Create Task'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_AVERGE),
          click: createTask(SUITABILITY_SCORE_AVERGE)
        }
      },
      'create.group': {
        group: 'activity',
        className: 'bpmn-icon-subprocess-collapsed yellow',
        title: translate('Create Process Task'),
        action: {
          dragstart: createProcessTask(SUITABILITY_SCORE_HIGH),
          click: createProcessTask(SUITABILITY_SCORE_HIGH)
        }
      }
    }
  }
}

CustomPalette.$inject = ['bpmnFactory', 'create', 'elementFactory', 'palette', 'translate']
