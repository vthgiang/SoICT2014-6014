import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { ModalDetailTask } from '../modalDetailTask';
import { performTaskAction } from '../../../task-perform/redux/actions';

import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { translate } from 'react-redux-multilingual/lib/utils';

class Gantt extends Component {

  constructor(props) {
    super(props);
    this.initZoom();
  }

  dataProcessor = null;

  initZoom() {
    const { translate } = this.props;
    gantt.ext.zoom.init({
      levels: [
        {
          name: translate('system_admin.system_setting.backup.hour'),
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: 'day', step: 1, format: '%d %M' },
            { unit: 'hour', step: 1, format: '%H' }
          ]
        },
        {
          name: translate('system_admin.system_setting.backup.date'),
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: 'week', step: 1, format: '# %W' },
            { unit: 'day', step: 1, format: '%d %M' }
          ]
        },
        {
          name: translate('system_admin.system_setting.backup.week'),
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "month", step: 1, format: '%F' },
            { unit: 'week', step: 1, format: 'Tuần %W' }
          ]
        },
        {
          name: translate('system_admin.system_setting.backup.month'),
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "year", step: 1, format: '%Y' },
            { unit: "month", step: 1, format: '%F' }
          ]
        }
      ]
    });
  }

  setZoom(value) {
    gantt.ext.zoom.setLevel(value);
  }

  initGanttDataProcessor() {
  }

  shouldComponentUpdate(nextProps) {
    gantt.clearAll();
    gantt.init(this.ganttContainer);
    this.initGanttDataProcessor();
    gantt.parse(this.props.ganttData);
    return true;
  }

  componentDidMount() {
    const { unit, translate } = this.props;
    gantt.config.drag_move = false;
    gantt.config.drag_multiple = false;
    gantt.config.drag_progress = false;
    gantt.config.drag_resize = false;
    gantt.config.links = false;
    gantt.config.details_on_dblclick = false;
    gantt.config.columns = [{ name: 'role', label: unit ? translate('task.task_management.responsible') : translate('task.task_management.role'), align: "center", resize: true, width: 120 }]
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    gantt.templates.task_class = function (start, end, task) {
      switch (task.process) {
        case 0:
          return "delay";
        case 1:
          return "intime";
        case 2:
          return "notAchive";
        default: return "none";
      }
    };

    gantt.attachEvent("onTaskDblClick", (id, mode) => {
      const taskId = id.split('-')[1];
      this.props.getTaskById(taskId);
      window.$(`#modal-detail-task-Employee`).modal('show')
    });

  }

  componentWillUnmount() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }

  render() {
    const { zoom, tasks, ganttData } = this.props;
    const task = tasks && tasks.task;
    const heightCalc = ganttData ? (ganttData.data.length) * 35 + 80 : 0;
    this.setZoom(zoom);

    return (
      <React.Fragment>

        {<ModalDetailTask action={'Employee'} task={task} />}
        <div
          ref={(input) => { this.ganttContainer = input }}
          style={{ width: '100%', height: heightCalc }}
        ></div>


      </React.Fragment>
    );
  }
}

function mapState(state) {
  const { tasks } = state;
  return { tasks }
}
const actions = {
  getTaskById: performTaskAction.getTaskById,
}
const ganttConnected = connect(mapState, actions)(withTranslate(Gantt))
export { ganttConnected as Gantt }