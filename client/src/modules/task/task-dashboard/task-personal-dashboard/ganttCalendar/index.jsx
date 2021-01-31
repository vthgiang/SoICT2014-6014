import React, { Component } from 'react';
import Gantt from './gantt';
import Toolbar from './toolBar';
import './ganttCalendar.css';
import moment from 'moment'

class GanttCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentZoom: 'Ngày',
      messages: []
    };
  }
  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom
    });
  }

  // xu ly data
  getDataCalendar = () =>{
    const {tasks} = this.props;
    let data = [];
    let res = tasks && tasks.responsibleTasks;
    let acc = tasks && tasks.accountableTasks;
    let con = tasks && tasks.consultedTasks;
    let inf = tasks && tasks.informedTasks;
    // let index = 0;
    for(let i in res){
      let start = moment(res[i].startDate);
      let end = moment(res[i].endDate);
      data.push({
        id: `res${i}`,
        idTask: res[i]._id, 
        text: `${res[i].name} - ${res[i].progress}%`,
        role: i==0? "Thực hiện" : "",
        start_date: moment(res[i].startDate).format("YYYY-MM-DD"),
        duration: end.diff(start, 'days'),
        progress: res[i].progress/100,
        process: 0 // xu ly mau sac 
      });
      // index ++;
    }
    for(let i in acc){
      let start = moment(acc[i].startDate);
      let end = moment(acc[i].endDate);
      data.push({
        id: `acc${i}`,
        idTask: acc[i]._id, 
        text: `${acc[i].name} - ${acc[i].progress}%`,
        role: i==0? "Tư vấn" : "",
        start_date: moment(acc[i].startDate).format("YYYY-MM-DD"),
        duration: end.diff(start, 'days'),
        progress: acc[i].progress/100,
        process: 0 // xu ly mau sac 
      });
      // index ++;
    }
    for(let i in con){
      let start = moment(con[i].startDate);
      let end = moment(con[i].endDate);
      // a.diff(b, 'days') // 1  
      data.push({
        id: `con${i}`,
        idTask: con[i]._id, 
        text: `${con[i].name} - ${con[i].progress}%`,
        role: i==0? "Hỗ trợ" : "",
        start_date: moment(con[i].startDate).format("YYYY-MM-DD"),
        duration: end.diff(start, 'days'),
        progress: con[i].progress/100,
        process: 0 // xu ly mau sac 
      });
      // index ++;
    }
    for(let i in inf){
      let start = moment(inf[i].startDate);
      let end = moment(inf[i].endDate);
      data.push({
        id: `inf${i}`,
        idTask: inf[i]._id, 
        text: `${inf[i].name} - ${inf[i].progress}%`,
        role: i==0? "Quan sát" : "",
        // start_date: inf[i].startDate.moment(),
        start_date: moment(inf[i].startDate).format("YYYY-MM-DD"),
        duration: end.diff(start, 'days'),
        progress: inf[i].progress/100,
        process: 0 // xu ly mau sac 
      });
      // index ++;
    }

    // let data = [
    //   { id: 'task1', text: 'task of An - 20%', user:'Nguyễn Văn An', start_date: '2020-02-11', duration: 0, progress: 0.2, process: 0 },
    //   { id: 'task2', text: 'task with very long title', user:'', start_date: '2020-02-12', duration: 2, progress: 0.6, process: 0 },
    //   { id: 'task5', text: 'task with very long title', user:'', start_date: '2020-02-12', duration: 2, progress: 0.6, process: 0 },
    //   { id: 'task4', text: 'task with very long title', user:'', start_date: '2020-02-12', duration: 2, progress: 0.6, process: 0 },
    //   { id: 'task3', text: 'task 2', user:'Nguyễn Văn Bách', start_date: '2020-02-14', duration: 2, progress: 0.2, process: 1 },
    // ]

    //  let data = [
    //   {id: "6012dd020b02b51e949ccac0", text: "cv1", role: "Thực hiện", start_date: "2020-02-15", duration: 7, progress: 0.2, process: 1},
    //   {id: "5ff1d555914a032ae8262f11", text: "Tìm kiếm nguồn nhân lực ở các trường đại học", role: "", start_date: "2020-02-11", duration: 5, progress: 0.2, process: 0},
    //   {id: "5ff1d555914a032ae8262f0c", text: "Tiến hành các khảo sát về nguồn nhân lực", role: "", start_date: "2020-02-18", duration: 10, progress: 0.2, process: 2},
    //   {id: "5ff1d555914a032ae8262f03", text: "Tăng doanh số bán hàng ở trong nước", role: "", start_date: "2020-02-10", duration: 5, progress: 0.2, process: 0},
    //   {id: "5ff1d555914a032ae8262efe", text: "Tham gia vào đội ngũ xây dựng kế hoạch ban hàng", role: "Phê duyệt", start_date: "2020-02-11", duration: 5, progress: 0.2, process: 2},
    //   {id: "5ff1d555914a032ae8262ef9", text: "Tiến hành các cuộc khảo sát chuỗi bán hàng", role: "", start_date: "2020-02-21", duration: 7, progress: 0.2, process: 0},
    // ]
    console.log("data", data);
    return data;
  }

  render() {
    const { currentZoom } = this.state;
    const dataCalendar = {};
    dataCalendar.data = this.getDataCalendar();
    console.log("==========",dataCalendar);

    return (
      <div className="gantt" >
        <div className="zoom-bar">
          <Toolbar
            zoom={currentZoom}
            onZoomChange={this.handleZoomChange}
          />
        </div>
        <div className="gantt-container">
          <Gantt
            tasks={dataCalendar}
            zoom={currentZoom}
          />
        </div>
      </div>
    );
  }
}

export default GanttCalendar;

