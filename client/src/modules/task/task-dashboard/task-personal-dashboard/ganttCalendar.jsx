import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import { withTranslate } from 'react-redux-multilingual';

import { performTaskAction } from '../../task-perform/redux/actions';

import { ModalDetailTask } from './modalDetailTask';

import { SelectMulti, Gantt } from '../../../../common-components';

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
    console.log("\n\n\n\n\n");
    let taskFilter = [];
    let status = this.state.taskStatus;
    let parentCount = 0, currentParent = -1;
    let splitTask = {};

    for (let i in status) {
      for (let j in group) {
        if (group[j].status === status[i]) {
          taskFilter.push(group[j])
        }
      }
    }

    // split task
    if (taskFilter[0]) splitTask[0] = [taskFilter[0]];

    for (let i in taskFilter) {
      let left = moment(taskFilter[i].startDate);
      let right = moment(taskFilter[i].endDate);
      let name = taskFilter[i].name;
      let intersect;
      if (i == 0) continue;

      // console.log("dang xet cong viec ", taskFilter[i].name);

      for (let parent in splitTask) {
        let idx = 0;
        // intersect = false;

        if (splitTask[parent]) {
          // duyet cac cong viec trong 1 dong
          // intersect = false;
          let currentLine = splitTask[parent];

          for (let j in currentLine) {
            // Kiem tra xem co trung cong viec nao k

            let currentLeft = moment(currentLine[j].startDate);
            let currentRight = moment(currentLine[j].endDate);
            let currentName = currentLine[j].name;
            if ((left >= currentLeft && left <= currentRight) || (currentLeft >= left && currentLeft <= right)) {
              intersect = true;
              // console.log("2 cong viec trung nhau", name, "\n", currentName);
              break;
            }
          }
          // console.log("!intersect", intersect);

          if (!intersect) {
            // console.log("!intersect");
            splitTask[idx].push(taskFilter[i]);
            break;
          }
        }
      }
      if (intersect) {
        let nextId = Object.keys(splitTask).length;
        splitTask[nextId] = [];
        splitTask[nextId].push(taskFilter[i])
      }
    }

    // console.log("split", splitTask);

    let taskFilterSplit = [];
    for (let key in splitTask) {
      if (splitTask[key]) {
        for (let i in splitTask[key]) {
          if (splitTask[key][i]) {
            splitTask[key][i].parentSplit = parseInt(key);
            taskFilterSplit.push(splitTask[key][i]);
          }
        }
      }
    }

    for (let i in taskFilterSplit) {
      let start = moment(taskFilterSplit[i].startDate);
      let end = moment(taskFilterSplit[i].endDate);
      let now = moment(new Date());
      let duration = end.diff(start, 'days') + 1;
      if (duration == 0) duration = 1;
      let process = 0;

      // Tô màu công việc
      if (taskFilterSplit[i].status != "inprocess") {
        process = 3;
      }
      else if (now > end) {
        process = 2; // Quá hạn
        count.notAchived++;
      }
      else {
        let processDay = Math.floor(taskFilterSplit[i].progress * duration / 100);
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
      if (taskFilterSplit[i].parentSplit != currentParent) {

        data.push({
          id: `${groupName}-${taskFilterSplit[i].parentSplit}`,
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
        id: `${groupName}-${taskFilterSplit[i]._id}`,
        text: taskFilterSplit[i].status == "inprocess" ? `${taskFilterSplit[i].name} - ${taskFilterSplit[i].progress}%` : `${taskFilterSplit[i].name}`,
        start_date: moment(taskFilterSplit[i].startDate).format("YYYY-MM-DD"),
        duration: duration,
        progress: taskFilterSplit[i].status === "inprocess" ? taskFilterSplit[i].progress / 100 : 0,
        process: process,
        parent: `${groupName}-${taskFilterSplit[i].parentSplit}`
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

    // let accData = this.getDataGroupByRole(data, acc, 'acc', translate('task.task_management.accountable_role'), count, line);
    // let dataAllTask = accData.data;
    // let countAllTask = accData.count;
    // let lineAllTask = accData.line;
    return {
      dataAllTask,
      countAllTask,
      lineAllTask
    };
  }

  // Xử lý công việc đơn vị
  getdataTaskUnit = () => {
    const { tasks, unitSelected } = this.props;
    const { organizationUnitTasks } = tasks;
    const listtask = organizationUnitTasks && organizationUnitTasks.tasks;
    //Lay cac cong viec cua cac unit da chon
    const tasksOfSelectedUnit = listtask?.filter(x =>
      unitSelected?.includes(x?.organizationalUnit?._id))

    const unitData = this.getDataGroupByEmployee(tasksOfSelectedUnit);
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
    let taskFilter = [], sortTaskArr = [], splitTask = [];
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
    let sortTaskObj = {};
    for (let i in taskFilter) {
      let item = taskFilter[i];
      if (item.responsibleEmployees) {
        //cong viec 1 nguoi thuc hien
        if (item.responsibleEmployees.length == 1) {
          let employee = item.responsibleEmployees[0].name;
          if (!sortTaskObj[employee]) sortTaskObj[employee] = [];
          sortTaskObj[employee].push(item)
        }
        // cong viec nhieu nguoi thuc hien
        else {
          if (!sortTaskObj.multipleEmployee) sortTaskObj.multipleEmployee = [];
          sortTaskObj.multipleEmployee.push(item)
        }
      }
    }

    // split task
    for (let employee in sortTaskObj) {
      if (sortTaskObj[employee] && sortTaskObj[employee].length) {
        splitTask[0] = [sortTaskObj[employee][0]];
        break;
      }
    }
    // console.log("first element", splitTask);
    // for(let employee in sortTaskObj){
    //   if(sortTaskObj[employee]){

    //   }
    // }
    // if (taskFilter[0]) splitTask[0] = [taskFilter[0]];

    // for (let i in taskFilter) {
    //   let left = moment(taskFilter[i].startDate);
    //   let right = moment(taskFilter[i].endDate);
    //   if (i == 0) continue;
    //   for (let parent in splitTask) {
    //     let idx = 0;

    //     if (splitTask[parent]) {

    //       // duyet cac cong viec trong 1 dong
    //       var intersect = false;
    //       let currentLine = splitTask[parent];

    //       for (let j in currentLine) {
    //         // Kiem tra xem co trung cong viec nao k

    //         let currentLeft = moment(currentLine[j].startDate);
    //         let currentRight = moment(currentLine[j].endDate);
    //         if ((left >= currentLeft && left <= currentRight) || (currentLeft >= left && currentLeft <= right)) {
    //           intersect = true;
    //           break;
    //         }
    //       }
    //       if (!intersect) {
    //         splitTask[idx].push(taskFilter[i]);
    //         break;
    //       }
    //     }
    //   }
    //   if (intersect) {
    //     let nextId = Object.keys(splitTask).length;
    //     splitTask[nextId] = [];
    //     splitTask[nextId].push(taskFilter[i])
    //   }
    // }

    // let taskFilterSplit = [];
    // for (let key in splitTask) {
    //   if (splitTask[key]) {
    //     for (let i in splitTask[key]) {
    //       if (splitTask[key][i]) {
    //         splitTask[key][i].parentSplit = parseInt(key);
    //         taskFilterSplit.push(splitTask[key][i]);
    //       }
    //     }
    //   }
    // }
    // console.log("arrrrrr", sortTaskObj);

    // chuyen object thanh mang cong viec
    for (let key in sortTaskObj) {

      if (sortTaskObj.hasOwnProperty(key) && key != 'multipleEmployee') {
        sortTaskArr = sortTaskArr.concat(sortTaskObj[key]);
      }
    }

    if (sortTaskObj.multipleEmployee) {
      sortTaskArr = sortTaskArr.concat(sortTaskObj.multipleEmployee)
    }

    for (let i in sortTaskArr) {
      let item = sortTaskArr[i];
      let prevItem = sortTaskArr[i - 1];

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

    for (let i in sortTaskArr) {
      let item = sortTaskArr[i];
      let start = moment(item.startDate);
      let end = moment(item.endDate);
      let now = moment(new Date());
      let duration = end.diff(start, 'days') + 1;
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
        groupNameLabel = item && sortTaskArr[i - 1] && sortTaskArr[i - 1].responsibleEmployees[0] && item.responsibleEmployees[0]
          && sortTaskArr[i - 1].responsibleEmployees[0].name === item.responsibleEmployees[0].name
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

  attachEvent = (id) => {
    const taskId = id.split('-')[1];
    this.props.getTaskById(taskId);
    window.$(`#modal-detail-task-Employee`).modal('show')
  }

  render() {
    const { translate, unit, tasks } = this.props;
    const { currentZoom, taskStatus } = this.state;
    const dataTask = {};
    const dataCalendar = unit ? this.getdataTaskUnit() : this.getdataTask();
    dataTask.data = dataCalendar.dataAllTask;
    const count = dataCalendar.countAllTask;
    const task = tasks && tasks.task;

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

        {<ModalDetailTask action={'Employee'} task={task} />}
        <Gantt
          ganttData={dataTask}
          zoom={currentZoom}
          status={taskStatus}
          count={dataCalendar.countAllTask}
          line={dataCalendar.lineAllTask}
          unit={unit}
          onZoomChange={this.handleZoomChange}
          attachEvent={this.attachEvent}
        />

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

function mapState(state) {
  const { tasks } = state;
  return { tasks }
}
const actions = {
  getTaskById: performTaskAction.getTaskById,
}
const GanttCalendarConnected = connect(mapState, actions)(withTranslate(GanttCalendar))
export { GanttCalendarConnected as GanttCalendar }

