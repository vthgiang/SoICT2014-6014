import React, { Component } from 'react';
// import Gantt from './gantt';
import Toolbar from './toolBar';
import './ganttCalendar.css';

const data = {
  data: [
    { id: 'task1', text: 'task of An - 20%', user:'Nguyễn Văn An', start_date: '2020-02-11', duration: 0, progress: 0.2, process: 0 },
    { id: 'task2', text: 'task with very long title', user:'', start_date: '2020-02-12', duration: 2, progress: 0.6, process: 0 },
    { id: 'task5', text: 'task with very long title', user:'', start_date: '2020-02-12', duration: 2, progress: 0.6, process: 0 },
    { id: 'task4', text: 'task with very long title', user:'', start_date: '2020-02-12', duration: 2, progress: 0.6, process: 0 },
    { id: 'task3', text: 'task 2', user:'Nguyễn Văn Bách', start_date: '2020-02-14', duration: 2, progress: 0.2, process: 1 },
  ],
};
class GanttCalendar extends Component {
  state = {
    currentZoom: 'Days',
    messages: []
  };

  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom
    });
  }

  render() {
    const { currentZoom } = this.state;
    return (
      <div>
        <div className="zoom-bar">
          <Toolbar
            zoom={currentZoom}
            onZoomChange={this.handleZoomChange}
          />
        </div>
        <div className="gantt-container">
          {/* <Gantt
            tasks={data}
            zoom={currentZoom}
          /> */}
        </div>
      </div>
    );
  }
}

export default GanttCalendar;

