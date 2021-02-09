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
      currentZoom: this.props.translate('system_admin.system_setting.backup.date'),
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

  // Phân nhóm công việc cá nhân
  getDataGroupByRole = (data, group, groupName, label, count) => {
    let taskFilter = [];
    let status = this.state.taskStatus;

    for (let i in status) {
      for (let j in group) {
        if (group[j].status === status[i]) {
          taskFilter.push(group[j])
        }
      }
    }

    for (let i in taskFilter) {
      let start = moment(taskFilter[i].startDate);
      let end = moment(taskFilter[i].endDate);
      let now = moment(new Date());
      let duration = end.diff(start, 'days');
      let process = 0;

      // Tô màu công việc
      if (taskFilter[i].status != "inprocess") {
        process = 3;
      }
      else if (now > end) {
        process = 2; // Quá hạn
        count.notAchived++;
      }
      else {
        let processDay = Math.floor(taskFilter[i].progress * duration / 100);
        let uptonow = now.diff(start, 'days');

        if (uptonow > processDay) {
          process = 0; // Trễ hạn
          count.delay++;
        }
        else if (uptonow <= processDay) {
          process = 1; // Đúng hạn
          count.intime++;
        }
      }
      data.push({
        id: `${groupName}-${taskFilter[i]._id}`,
        text: taskFilter[i].status == "inprocess" ? `${taskFilter[i].name} - ${taskFilter[i].progress}%` : `${taskFilter[i].name}`,
        role: i == 0 ? label : "",
        start_date: moment(taskFilter[i].startDate).format("YYYY-MM-DD"),
        duration: duration,
        progress: taskFilter[i].status === "inprocess" ? taskFilter[i].progress / 100 : 0,
        process: process
      });
    }

    return { data, count };
  }
  // Xử lý công việc cá nhân
  getdataTask = () => {
    const { tasks, translate } = this.props;
    // console.log("========= hello", tasks)
    let data = [];
    let count = { delay: 0, intime: 0, notAchived: 0 };

    let res = tasks && tasks.responsibleTasks;
    let acc = tasks && tasks.accountableTasks;
    let con = tasks && tasks.consultedTasks;
    let inf = tasks && tasks.informedTasks;


    let resData = this.getDataGroupByRole(data, res, 'res', translate('task.task_management.responsible_role'), count);
    let data1 = resData.data;
    let count1 = resData.count;

    let accData = this.getDataGroupByRole(data1, acc, 'acc', translate('task.task_management.accountable_role'), count1);
    let data2 = accData.data;
    let count2 = accData.count;

    let conData = this.getDataGroupByRole(data2, con, 'con', translate('task.task_management.consulted_role'), count2);
    let data3 = conData.data;
    let count3 = conData.count;

    let infData = this.getDataGroupByRole(data3, inf, 'inf', translate('task.task_management.informed_role'), count3);
    let dataAllTask = infData.data;
    let countAllTask = infData.count;

    return {
      dataAllTask,
      countAllTask
    };
  }

  // Xử lý công việc đơn vị
  getdataTaskUnit = () => {
    const { tasks } = this.props;
    const { organizationUnitTasks } = tasks;
    const listtask = organizationUnitTasks && organizationUnitTasks.tasks;

    const unitData = this.getDataGroupByEmployee(listtask);
    const dataAllTask = unitData.data;
    const countAllTask = unitData.count;

    return {
      dataAllTask,
      countAllTask
    };
  }

  // Phân nhóm công việc đơn vị
  getDataGroupByEmployee = (group) => {
    let data = [];
    let count = { delay: 0, intime: 0, notAchived: 0 };
    let taskFilter = [];
    let status = this.state.taskStatus;

    // Lọc công việc theo trạng thái
    for (let i in status) {
      for (let j in group) {
        if (group[j].status === status[i]) {
          taskFilter.push(group[j])
        }
      }
    }

    for (let i in taskFilter) {
      let start = moment(taskFilter[i].startDate);
      let end = moment(taskFilter[i].endDate);
      let now = moment(new Date());
      let duration = end.diff(start, 'days');
      let process = 0;
      let groupNameLabel = taskFilter[i].responsibleEmployees[0] && taskFilter[i].responsibleEmployees[0].name;

      // Tô màu công việc
      if (taskFilter[i].status != "inprocess") {
        process = 3;
      }
      else if (now > end) {
        process = 2; // Quá hạn
        count.notAchived++;
      }
      else {
        let processDay = Math.floor(taskFilter[i].progress * duration / 100);
        let uptonow = now.diff(start, 'days');
        if (uptonow > processDay) {
          process = 0; // Trễ hạn
          count.delay++;
        }
        else if (uptonow <= processDay) {
          process = 1; // Đúng hạn
          count.intime++;
        }
      }

      if (taskFilter[i] && taskFilter[i].responsibleEmployees && taskFilter[i].responsibleEmployees.length > 1) {
        groupNameLabel = "Công việc nhiều người thực hiện";
      } else {
        groupNameLabel = taskFilter[i] && taskFilter[i - 1] && taskFilter[i - 1].responsibleEmployees[0] && taskFilter[i].responsibleEmployees[0]
          && taskFilter[i - 1].responsibleEmployees[0].name === taskFilter[i].responsibleEmployees[0].name
          ? "" : taskFilter[i]?.responsibleEmployees[0]?.name;
      }

      data.push({
        id: `taskUnit-${taskFilter[i]._id}`,
        text: taskFilter[i].status == "inprocess" ? `${taskFilter[i].name} - ${taskFilter[i].progress}%` : `${taskFilter[i].name}`,
        role: groupNameLabel,
        start_date: moment(taskFilter[i].startDate).format("YYYY-MM-DD"),
        duration: duration,
        progress: taskFilter[i].status === "inprocess" ? taskFilter[i].progress / 100 : 0,
        process: process
      });
    }
    return { data, count };
  }

  render() {
    const { translate, unit } = this.props;
    const { currentZoom, taskStatus } = this.state;
    const dataTask = {};
    const dataCalendar = unit ? this.getdataTaskUnit() : this.getdataTask();
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
            unit={unit}
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

