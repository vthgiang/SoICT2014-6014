import React, { Component } from 'react';
import Gantt from './gantt';
import Toolbar from './toolBar';
import './ganttCalendar.css';
import moment from 'moment'
import { SelectMulti } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
class GanttCalendar extends Component {
  constructor(props) {
    super(props);

    this.SEARCH_INFO = {
      taskStatus: ["inprocess"],
  }
    this.state = {
      currentZoom: 'Ngày',
      messages: [],
      taskStatus: this.SEARCH_INFO.taskStatus,

    };
  }
  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom
    });
  }
  handleSelectStatus = async (taskStatus) => {
    if (taskStatus.length === 0) {
        taskStatus = ["inprocess"];
    }

    this.SEARCH_INFO.taskStatus = taskStatus;
}
handleSearchData = async () => {
  let status = this.SEARCH_INFO.taskStatus;

  await this.setState(state => {
      return {
          ...state,
          taskStatus: status
      }
  })
}

  // xu ly data cho mot nhom 
  getDataByGroup = (data, group, groupName, label) =>{
    // loc cong viec theo trang thai
    let taskFilter = [];
    let status = this.state.taskStatus;
    for(let i in status){
      for(let j in group){
        if(group[j].status ===  status[i]){
          taskFilter.push(group[j])
        }
      }
    }
    console.log("filter", taskFilter);
    for(let i in taskFilter){

      // tinh so ngay thuc hien cong viec
      let start = moment(taskFilter[i].startDate);
      let end = moment(taskFilter[i].endDate);
      let now = moment(new Date());
      let duration = end.diff(start, 'days');
      // xu ly mau sac hien thi
      let process = 0;
      if(taskFilter[i].status !="inprocess"){
        console.log("khac inprocess");

        process = 3;
      } 
       // khong phai cong viec dang thuc hien
      else if(now>end){
        process = 2; // qua han
      }
      else{
        // phan tram lam viec theo tien do
        let processDay =Math.floor(taskFilter[i].progress*duration/100);
        // lam viec thuc te
        let uptonow = now.diff(start, 'days');
        if(uptonow>processDay) process = 0 // tre
        else if(uptonow<=processDay) process = 1 // dung tien do
      }

   
      data.push({
        id: `${groupName}-${i}`,
        idTask: taskFilter[i]._id, 
        text: taskFilter[i].status == "inprocess"? `${taskFilter[i].name} - ${taskFilter[i].progress}%` :`${taskFilter[i].name}`,
        role: i==0? label : "",
        start_date: moment(taskFilter[i].startDate).format("YYYY-MM-DD"),
        duration: duration,
        progress: taskFilter[i].status === "inprocess"? taskFilter[i].progress/100 : 0,
        process: process // xu ly mau sac 
      });
    }
    return data;
  }
  // xu ly data bieu do
  getDataCalendar = () =>{
    const {tasks} = this.props;

    let data = [];
    let res = tasks && tasks.responsibleTasks;
    let acc = tasks && tasks.accountableTasks;
    let con = tasks && tasks.consultedTasks;
    let inf = tasks && tasks.informedTasks;

    let data1 = this.getDataByGroup(data, res, 'res', 'Thực hiện');
    let data2 = this.getDataByGroup(data1, acc, 'acc', 'Tư vấn');
    let data3 = this.getDataByGroup(data2, con, 'con', 'Hỗ trợ');
    let data4 = this.getDataByGroup(data3, inf, 'inf', 'Quan sát');
    
    return data4;
  }

  render() {
    const {translate} = this.props;
    const { currentZoom, taskStatus } = this.state;
    const dataCalendar = {};
    dataCalendar.data = this.getDataCalendar();
    console.log("==========",dataCalendar);

    return (
      <div className="gantt" >
        <section className="form-inline" style={{ textAlign: "right", marginBottom: "10px" }}>
                        {/* Chọn trạng thái công việc */}
                        <div className="form-group">
                            <label style={{ minWidth: "150px" }}>{translate('task.task_management.task_status')}</label>

                            <SelectMulti id="multiSelectStatusInCalendar"
                                items={[
                                    { value: "inprocess", text: translate('task.task_management.inprocess') },
                                    { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
                                    { value: "finished", text: translate('task.task_management.finished') },
                                    { value: "delayed", text: translate('task.task_management.delayed') },
                                    { value: "canceled", text: translate('task.task_management.canceled') }
                                ]}
                                onChange={this.handleSelectStatus}
                                options={{ nonSelectedText: translate('task.task_management.inprocess'), allSelectedText: translate('task.task_management.select_all_status') }}
                                value={taskStatus}>
                            </SelectMulti>

                        </div>
                        <div className="form-group">
                            <button className="btn btn-success" onClick={this.handleSearchData}>{translate('task.task_management.filter')}</button>
                        </div>
                    </section>
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
            status = {taskStatus}
          />
        </div>
      </div>
    );
  }
}

export default withTranslate(GanttCalendar);

