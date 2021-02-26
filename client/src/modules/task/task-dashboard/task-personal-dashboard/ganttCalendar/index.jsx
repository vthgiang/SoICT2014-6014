import React, { Component } from 'react';
// import { Gantt } from './gantt';
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
  getDataGroupByRole = (data, group, groupName, label, count, line) => {
    let taskFilter = [];
    let status = this.state.taskStatus;
    let parentCount = 0, currentParent = -1;

    for (let i in status) {
      for (let j in group) {
        if (group[j].status === status[i]) {
          taskFilter.push(group[j])
        }
      }
    }

    for (let i in taskFilter) {
      if (i == 0) {
        taskFilter[i].parentSplit = 0;
      } else {
        if (moment(taskFilter[i].startDate) > moment(taskFilter[i - 1]?.endDate)
          || moment(taskFilter[i].endDate) < moment(taskFilter[i - 1]?.startDate)) {
          taskFilter[i].parentSplit = parentCount;
        }
        else {
          parentCount++;
          taskFilter[i].parentSplit = parentCount;
        }
      }
    }

    for (let i in taskFilter) {
      let start = moment(taskFilter[i].startDate);
      let end = moment(taskFilter[i].endDate);
      let now = moment(new Date());
      let duration = end.diff(start, 'days');
      if (duration == 0) duration = 1;
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
      if (taskFilter[i].parentSplit != currentParent) {

        data.push({
          id: `${groupName}-${taskFilter[i].parentSplit}`,
          text: "",
          role: i == 0 ? label : "",
          start_date: null,
          duration: null,
          render: "split"
        });
        currentParent++;
        line++;
      }
      data.push({
        id: `${groupName}-${taskFilter[i]._id}`,
        text: taskFilter[i].status == "inprocess" ? `${taskFilter[i].name} - ${taskFilter[i].progress}%` : `${taskFilter[i].name}`,
        start_date: moment(taskFilter[i].startDate).format("YYYY-MM-DD"),
        duration: duration,
        progress: taskFilter[i].status === "inprocess" ? taskFilter[i].progress / 100 : 0,
        process: process,
        parent: `${groupName}-${taskFilter[i].parentSplit}`
      });
    }
    return { data, count, line };
  }

  // Xử lý công việc cá nhân
  getdataTask = () => {
    const { tasks, translate } = this.props;
    let data = [], line = 0;
    let count = { delay: 0, intime: 0, notAchived: 0 };

    let res = tasks && tasks.responsibleTasks;
    let acc = tasks && tasks.accountableTasks;
    let con = tasks && tasks.consultedTasks;
    let inf = tasks && tasks.informedTasks;

    let resData = this.getDataGroupByRole(data, res, 'res', translate('task.task_management.responsible_role'), count, line);
    let data1 = resData.data;
    let count1 = resData.count;
    let line1 = resData.line;

    let accData = this.getDataGroupByRole(data1, acc, 'acc', translate('task.task_management.accountable_role'), count1, line1);
    let data2 = accData.data;
    let count2 = accData.count;
    let line2 = accData.line;

    let conData = this.getDataGroupByRole(data2, con, 'con', translate('task.task_management.consulted_role'), count2, line2);
    let data3 = conData.data;
    let count3 = conData.count;
    let line3 = conData.line;

    let infData = this.getDataGroupByRole(data3, inf, 'inf', translate('task.task_management.informed_role'), count3, line3);
    let dataAllTask = infData.data;
    let countAllTask = infData.count;
    let lineAllTask = infData.line;

    return {
      dataAllTask,
      countAllTask,
      lineAllTask
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
    const lineAllTask = unitData.line;
    return {
      dataAllTask,
      countAllTask,
      lineAllTask
    };
  }

  // Phân nhóm công việc đơn vị
  getDataGroupByEmployee = (group) => {
    let line = 0, parentCount = 0, currentParent = -1;
    let data = [];
    let count = { delay: 0, intime: 0, notAchived: 0 };
    let taskFilter = [], taskSorted = [];
    let status = this.state.taskStatus;

    // Lọc công việc theo trạng thái
    for (let i in status) {
      for (let j in group) {
        if (group[j].status === status[i]) {
          taskFilter.push(group[j])
        }
      }
    }

    // sắp xếp các công việc theo tên ngươi thực hiện
    let sortTask = {};
    for (let i in taskFilter) {
      let item = taskFilter[i];
      if (item.responsibleEmployees) {
        //cong viec 1 nguoi thuc hien
        if (item.responsibleEmployees.length == 1) {
          let employee = item.responsibleEmployees[0].name;
          if (!sortTask[employee]) sortTask[employee] = [];
          sortTask[employee].push(item)
        }
        // cong viec nhieu nguoi thuc hien
        else {
          if (!sortTask.multipleEmployee) sortTask.multipleEmployee = [];
          sortTask.multipleEmployee.push(item)
        }
      }
    }

    // chuyen object thanh mang cong viec
    for (let key in sortTask) {
      if (sortTask.hasOwnProperty(key) && key != 'multipleEmployee') {
        taskSorted = taskSorted.concat(sortTask[key]);
      }
    }
    taskSorted = sortTask.multipleEmployee && taskSorted.concat(sortTask.multipleEmployee);

    for (let i in taskSorted) {
      let item = taskSorted[i];
      let prevItem = taskSorted[i - 1];

      if (i == 0) {
        item.parentSplit = 0;
      } else {
        if (moment(item.startDate) > moment(prevItem?.endDate)
          || moment(item.endDate) < moment(prevItem?.startDate)
          && (item.responsibleEmployees[0]?.name == prevItem?.responsibleEmployees[0]?.name
            || item.responsibleEmployees.length != 1)
        ) {
          item.parentSplit = parentCount;
        }
        else {
          parentCount++;
          item.parentSplit = parentCount;
        }
      }
    }

    for (let i in taskSorted) {
      let item = taskSorted[i];
      let start = moment(item.startDate);
      let end = moment(item.endDate);
      let now = moment(new Date());
      let duration = end.diff(start, 'days');
      let process = 0;
      let employeeName = item.responsibleEmployees[0] && item.responsibleEmployees[0].name;
      let groupNameLabel = item.responsibleEmployees[0] && item.responsibleEmployees[0].name;

      // Tô màu công việc
      if (item.status != "inprocess") {
        process = 3;
      }
      else if (now > end) {
        process = 2; // Quá hạn
        count.notAchived++;
      }
      else {
        let processDay = Math.floor(item.progress * duration / 100);
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

      if (item && item.responsibleEmployees && item.responsibleEmployees.length > 1) {
        groupNameLabel = "Công việc nhiều người thực hiện";
      }
      else {
        groupNameLabel = item && taskSorted[i - 1] && taskSorted[i - 1].responsibleEmployees[0] && item.responsibleEmployees[0]
          && taskSorted[i - 1].responsibleEmployees[0].name === item.responsibleEmployees[0].name
          ? "" : item?.responsibleEmployees[0]?.name;
      }
      if (item.parentSplit != currentParent) {

        data.push({
          id: `${employeeName}-${item.parentSplit}`,
          text: "",
          role: groupNameLabel,
          start_date: null,
          duration: null,
          render: "split"
        });
        currentParent++;
        line++;
      }
      data.push({
        id: `taskUnit-${item._id}`,
        text: item.status == "inprocess" ? `${item.name} - ${item.progress}%` : `${item.name}`,
        start_date: moment(item.startDate).format("YYYY-MM-DD"),
        duration: duration != 0 ? duration : 1,
        progress: item.status === "inprocess" ? item.progress / 100 : 0,
        process: process,
        parent: `${employeeName}-${item.parentSplit}`
      });
    }
    return { data, count, line };
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
            line={dataCalendar.lineAllTask}
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

