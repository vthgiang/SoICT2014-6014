import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

export default class Gantt extends Component {

  constructor(props) {
    super(props);
    this.initZoom();
  }

  // instance of gantt.dataProcessor
  dataProcessor = null;

  initZoom() {
    gantt.ext.zoom.init({
      levels: [
        {
          name: 'Hours',
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: 'day', step: 1, format: '%d %M' },
            { unit: 'hour', step: 1, format: '%H' }
          ]
        },
        {
          name: 'Days',
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: 'week', step: 1, format: 'Week #%W' },
            { unit: 'day', step: 1, format: '%d %M' }
          ]
        },
        {
          name: 'Months',
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "month", step: 1, format: '%F' },
            { unit: 'week', step: 1, format: '#%W' }
          ]
        }
      ]
    });
  }

  setZoom(value) {
    gantt.ext.zoom.setLevel(value);
  }

  initGanttDataProcessor() {
    /**
     * type: "task"|"link"
     * action: "create"|"update"|"delete"
     * item: data object object
     */
    const onDataUpdated = this.props.onDataUpdated;
    this.dataProcessor = gantt.createDataProcessor((type, action, item, id) => {
      // return new Promise((resolve, reject) => {
      //   if (onDataUpdated) {
      //     onDataUpdated(type, action, item, id);
      //   }

      //   // if onDataUpdated changes returns a permanent id of the created item, you can return it from here so dhtmlxGantt could apply it
      //   // resolve({id: databaseId});
      //   return resolve();
      // });
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.zoom !== nextProps.zoom;
  }

  componentDidMount() {
    console.log("hello",gantt.config);
    gantt.config.drag_move = false;
    gantt.config.drag_multiple = false;
    gantt.config.drag_progress = false;
    gantt.config.drag_resize = false;
    gantt.config.links = false;
    gantt.config.details_on_dblclick = false;
    gantt.config.columns=[{name :'user', label: "Người thực hiện", align: "center", resize: true, width: 120}]
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    gantt.templates.task_class = function (start, end, task) {
      switch (task.process) {
        case 0:
          return "delay";
        case 1:
          return "intime";
        case 2:
          return "notAchive";
        default: return "";
      }
    };
    const { tasks } = this.props;
    gantt.init(this.ganttContainer);
    this.initGanttDataProcessor();
    gantt.parse(tasks);
    
  }
  
  componentWillUnmount() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }

  render() {
    const { zoom } = this.props;
    this.setZoom(zoom);

    // gantt.attachEvent("onTaskClick", function (id, mode) {
    //   var task = gantt.getTask(id);
    //   console.log("task", task);
    //     gantt.message("you clicked task" + task.id);
    // });

    return (
      <div
        ref={(input) => { this.ganttContainer = input }}
        style={{ width: '100%', height: '100%' }}
      ></div>
    );
  }
}
