import React, { Component } from 'react';
import { Gantt } from './gantt';
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
    this.forceUpdate();
  }

  // xu ly data cho mot nhom 
  getDataByGroup = (data, group, groupName, label, count) => {
    // loc cong viec theo trang thai
    let taskFilter = [];
    let status = this.state.taskStatus;
    for (let i in status) {
      for (let j in group) {
        if (group[j].status === status[i]) {
          taskFilter.push(group[j])
        }
      }
    }
    // console.log("filter", taskFilter);
    for (let i in taskFilter) {

      // tinh so ngay thuc hien cong viec
      let start = moment(taskFilter[i].startDate);
      let end = moment(taskFilter[i].endDate);
      let now = moment(new Date());
      let duration = end.diff(start, 'days');
      // xu ly mau sac hien thi
      let process = 0;
      if (taskFilter[i].status != "inprocess") {
        process = 3;
      }
      // khong phai cong viec dang thuc hien
      else if (now > end) {
        process = 2; // qua han
        count.notAchived++;
      }
      else {
        // phan tram lam viec theo tien do
        let processDay = Math.floor(taskFilter[i].progress * duration / 100);
        // lam viec thuc te
        let uptonow = now.diff(start, 'days');
        if (uptonow > processDay) {
          process = 0;
          count.delay++;
        } // tre
        else if (uptonow <= processDay) {
          process = 1 // dung tien do
          count.intime++;
        }
      }


      data.push({
        id: `${groupName}-${taskFilter[i]._id}`,
        // id: taskFilter[i]._id, 
        text: taskFilter[i].status == "inprocess" ? `${taskFilter[i].name} - ${taskFilter[i].progress}%` : `${taskFilter[i].name}`,
        role: i == 0 ? label : "",
        start_date: moment(taskFilter[i].startDate).format("YYYY-MM-DD"),
        duration: duration,
        progress: taskFilter[i].status === "inprocess" ? taskFilter[i].progress / 100 : 0,
        process: process // xu ly mau sac 
      });
    }
    console.log("===============COUNT===========", count)
    return {
      data,
      count
    };
  }
  // xu ly data bieu do
  getdataTask = () => {
    const { tasks } = this.props;

    let data = [];
    let count = { delay: 0, intime: 0, notAchived: 0 };

    let res = tasks && tasks.responsibleTasks;
    let acc = tasks && tasks.accountableTasks;
    let con = tasks && tasks.consultedTasks;
    let inf = tasks && tasks.informedTasks;


    let resData = this.getDataByGroup(data, res, 'res', 'Thực hiện', count);
    let data1 = resData.data;
    let count1 = resData.count;
    console.log("count 1", count1);
    let accData = this.getDataByGroup(data1, acc, 'acc', 'Tư vấn', count1);
    let data2 = accData.data;
    let count2 = accData.count;
    console.log("count 2", count2);


    let conData = this.getDataByGroup(data2, con, 'con', 'Hỗ trợ', count2);
    let data3 = conData.data;
    let count3 = conData.count;
    console.log("count 3", count3);

    let infData = this.getDataByGroup(data3, inf, 'inf', 'Quan sát', count3);
    let dataAllTask = infData.data;
    let countAllTask = infData.count;
    return {
      dataAllTask,
      countAllTask
    };
  }

  render() {
    const { translate } = this.props;
    const { currentZoom, taskStatus } = this.state;
    const dataTask = {};
    const dataCalendar = this.getdataTask();
    dataTask.data = dataCalendar.dataAllTask;
    const count = dataCalendar.countAllTask;
    return (
      <div className="gantt qlcv" >
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
            ganttData={dataTask}
            zoom={currentZoom}
            status={taskStatus}
            count={dataCalendar.countAllTask}
          />
        </div>

        <div className="form-inline" style={{ textAlign: 'center' }}>
          <div className="form-group">
            <div id="in-time"></div>
            <label id="label-for-calendar">{translate('task.task_management.in_time')}({count && count.intime ? count.intime : 0})</label>
          </div>
          <div className="form-group">
            <div id="delay"></div>
            <label id="label-for-calendar">{translate('task.task_management.delayed_time')}({count && count.delay ? count.delay : 0})</label>
          </div>
          <div className="form-group">
            <div id="not-achieved"></div>
            <label id="label-for-calendar">{translate('task.task_management.not_achieved')}({count && count.notAchived ? count.notAchived : 0})</label>
          </div>

        </div>
      </div>
    );
  }
}

export default withTranslate(GanttCalendar);

