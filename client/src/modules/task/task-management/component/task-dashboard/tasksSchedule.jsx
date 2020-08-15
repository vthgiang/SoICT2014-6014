import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { taskManagementActions } from '../../../task-management/redux/actions'

import { ModalDetailTask } from './modalDetailTask'

import Timeline, { TodayMarker } from "react-calendar-timeline"
import moment from 'moment'
import 'react-calendar-timeline/lib/Timeline.css'
import './calendar.css'
import { translate } from 'react-redux-multilingual/lib/utils'


class TasksSchedule extends Component {
  constructor(props) {
    super(props);

    let defaultTimeStart = moment()
      .startOf("month")
      .toDate();

    let defaultTimeEnd = moment()
      .startOf("month")
      .add(1, "month")
      .toDate();
    let dateNow = new Date();
    this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

    this.state = {
      defaultTimeStart,
      defaultTimeEnd,
      startDate: null,
      endDate: null,
      infoSearch: {
        organizationalUnit: this.props.units,
        currentPage: "1",
        perPage: "1000",
        status: '[]',
        priority: '[]',
        special: '[]',
        name: null,
        startDate: this.formatDate(dateNow),
        endDate: null,
        startDateAfter: null,
        endDateBefore: null,
        aPeriodOfTime: true
      },
      taskId: null,
      add: true,
      dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

      willUpdate: false       // Khi true sẽ cập nhật dữ liệu vào props từ redux
    };
  }

  formatDate(d) {
    let month = '' + (d.getMonth());
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;

    return [month, year].join('-');
  }

  // Lấy thời gian các công việc
  getTaskDurations() {
    const { tasks } = this.props;
    var taskList, inprocessTasks;
    let taskDurations = [];

    if (tasks) {
      // Phân chia công việc vào nhóm theo người thực hiện
      if (this.props.TaskOrganizationUnitDashboard) {
        taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
        inprocessTasks = taskList && taskList.filter(task => (task.status === "Inprocess" && task.isArchived === false));

        if (inprocessTasks) {
          var startTime, endTime, currentTime, start_time, end_time, title1, title2, groupTask, titleTask;
          var workingDayMin;

          for (let i = 1; i <= inprocessTasks.length; i++) {
            let multi = false;
            let responsibleEmployeeIds = [];
            let responsibleEmployeeNames = [];

            currentTime = new Date();
            startTime = new Date(inprocessTasks[i - 1].startDate);
            endTime = new Date(inprocessTasks[i - 1].endDate);
            start_time = moment(startTime);
            end_time = moment(endTime);

            inprocessTasks[i - 1].responsibleEmployees.map(x => {
              responsibleEmployeeIds.push(x._id);
              responsibleEmployeeNames.push(x.name);
            });

            title1 = inprocessTasks[i - 1].name + " - " + inprocessTasks[i - 1].progress + "%";
            title2 = inprocessTasks[i - 1].name + " - " + responsibleEmployeeNames.join(" - ") + " - " + inprocessTasks[i - 1].progress + "%";
            if (responsibleEmployeeIds.length > 1) {
              multi = true;
            }
            if (multi) {
              titleTask = title2;
              groupTask = "multi-responsible-employee"
            }
            else {
              titleTask = title1;
              groupTask = responsibleEmployeeIds[0];
            }

            taskDurations.push({
              id: parseInt(i),
              group: groupTask,
              title: titleTask,
              canMove: false,

              start_time: start_time,
              end_time: end_time,

              itemProps: {
                style: {
                  color: "rgb(0, 0, 0, 0.8)",
                  borderStyle: "solid",
                  fontWeight: '600',
                  fontSize: 14,
                  borderWidth: 1,
                  borderRadius: 3,
                }
              }
            })
          }

          let x = document.getElementsByClassName("rct-item");

          if (x.length) {
            for (let i = 0; i < x.length; i++) {
              if (inprocessTasks[i]) {
                let color;
                currentTime = new Date();
                startTime = new Date(inprocessTasks[i].startDate);
                endTime = new Date(inprocessTasks[i].endDate);

                if (currentTime > endTime && inprocessTasks[i].progress < 100) {
                  color = "#DD4B39"; // not achieved
                }
                else {
                  workingDayMin = (endTime - startTime) * inprocessTasks[i].progress / 100;
                  let dayFromStartDate = currentTime - startTime;
                  let timeOver = workingDayMin - dayFromStartDate;
                  if (timeOver >= 0) color = "#00A65A"; // In time or on time
                  else {
                    color = "#F0D83A"; // delay
                  }
                }
                this.displayTaskProgress(inprocessTasks[i].progress, x[i], color);
              }
            }
          }
        }
      }

      // Chia nhóm công việc theo vai trò trong công việc
      else {
        let res, acc, con, inf;
        let inprocessTasks2 = [];

        res = tasks.responsibleTasks;
        acc = tasks.accountableTasks;
        con = tasks.consultedTasks;
        inf = tasks.informedTasks;

        if (res) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].status === "Inprocess" && res[i].isArchived === false) {
              inprocessTasks2.push({
                id: res[i]._id,
                gr: 'responsible-tasks',
                name: res[i].name,
                startDate: res[i].startDate,
                endDate: res[i].endDate,
                progress: res[i].progress
              })
            }
          }
        }

        if (acc) {
          for (let i = 0; i < acc.length; i++) {
            if (acc[i].status === "Inprocess" && acc[i].isArchived === false) {
              inprocessTasks2.push({
                id: acc[i]._id,
                gr: 'accountable-tasks',
                name: acc[i].name,
                startDate: acc[i].startDate,
                endDate: acc[i].endDate,
                progress: acc[i].progress
              })
            }
          }
        }

        if (con) {
          for (let i = 0; i < con.length; i++) {
            if (con[i].status === "Inprocess" && con[i].isArchived === false) {
              inprocessTasks2.push({
                id: con[i]._id,
                gr: 'consulted-tasks',
                name: con[i].name,
                startDate: con[i].startDate,
                endDate: con[i].endDate,
                progress: con[i].progress
              })
            }
          }
        }

        if (inf) {
          for (let i = 0; i < inf.length; i++) {
            if (inf[i].status === "Inprocess" && inf[i].isArchived === false) {
              inprocessTasks2.push({
                id: inf[i]._id,
                gr: 'informed-tasks',
                name: inf[i].name,
                startDate: inf[i].startDate,
                endDate: inf[i].endDate,
                progress: inf[i].progress
              })
            }
          }
        }

        if (inprocessTasks2) {

          for (let i = 0; i < inprocessTasks2.length; i++) {

            if (inprocessTasks2[i]) {
              let startTime, endTime, start_time, end_time;
              let titleTask = inprocessTasks2[i].name + " - " + inprocessTasks2[i].progress + "%";

              startTime = new Date(inprocessTasks2[i].startDate);
              endTime = new Date(inprocessTasks2[i].endDate);
              start_time = moment(startTime);
              end_time = moment(endTime);

              taskDurations.push({
                id: i + 1,
                group: inprocessTasks2[i].gr,
                title: titleTask,
                canMove: false,
                start_time: start_time,
                end_time: end_time,
                itemProps: {
                  style: {
                    color: "rgb(0, 0, 0, 0.8)",
                    borderStyle: "solid",
                    fontWeight: '600',
                    fontSize: 14,
                    borderWidth: 1,
                    borderRadius: 3,
                  }
                }
              })
            }
          }
          let x = document.getElementsByClassName("rct-item");
          if (x.length) {
            for (let i = 0; i < x.length; i++) {
              if (inprocessTasks2[i]) {
                let color;
                currentTime = new Date();
                startTime = new Date(inprocessTasks2[i].startDate);
                endTime = new Date(inprocessTasks2[i].endDate);

                if (currentTime > endTime && inprocessTasks2[i].progress < 100) {
                  color = "#DD4B39"; // not achieved
                }
                else {
                  workingDayMin = (endTime - startTime) * inprocessTasks2[i].progress / 100;
                  let dayFromStartDate = currentTime - startTime;
                  let timeOver = workingDayMin - dayFromStartDate;
                  if (timeOver >= 0) color = "#00A65A"; // In time or on time
                  else {
                    color = "#F0D83A"; // delay
                  }
                }
                this.displayTaskProgress(inprocessTasks2[i].progress, x[i], color);
              }
            }
          }
        }
      }
    }
    return taskDurations;
  }

  // Nhóm công việc theo người thực hiện

  getTaskGroups() {
    const { tasks, translate } = this.props;
    var taskList1, inprocessTasks1;
    let groupName = [], distinctGroupName = [], id = [], distinctId = [];
    let multiResponsibleEmployee = false;

    if (tasks) {

      // Phân nhóm công việc theo người thực hiện
      if (this.props.TaskOrganizationUnitDashboard) {
        taskList1 = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
        inprocessTasks1 = taskList1 && taskList1.filter(task => (task.status === "Inprocess" && task.isArchived === false));
        if (inprocessTasks1) {
          for (let i = 1; i <= inprocessTasks1.length; i++) {
            let responsibleName = [];
            let responsibleEmployeeIds = [];

            inprocessTasks1[i - 1].responsibleEmployees.map(x => {
              responsibleName.push(x.name)
              responsibleEmployeeIds.push(x._id)
            });

            if (responsibleEmployeeIds.length === 1) { // Nếu công việc chỉ có 1 người thực hiện
              groupName.push({
                id: responsibleEmployeeIds[0],
                title: responsibleName
              });
              id.push(responsibleEmployeeIds[0])
            }
            else if (responsibleEmployeeIds.length > 1) { // Nếu công việc có nhiều người làm chung
              multiResponsibleEmployee = true;
            }

          }
          // Loại bỏ các id trùng nhau
          if (groupName.length) {
            for (let i = 0; i < id.length; i++) {
              let idx = distinctId.indexOf(id[i]);

              if (idx < 0) {
                distinctId.push(id[i]);
                if (groupName[i]) {
                  distinctGroupName.push({
                    id: groupName[i].id,
                    title: groupName[i].title
                  })
                }
              }
            }

            if (multiResponsibleEmployee) {
              distinctGroupName.push({
                id: "multi-responsible-employee",
                title: translate('task.task_management.collaborative_tasks')
              })
            }
          }
        }
      }

      //Phân nhóm công việc theo vai trò trong công việc
      else {
        let res, acc, con, inf;

        if (tasks) {
          res = tasks.responsibleTasks;
          acc = tasks.accountableTasks;
          con = tasks.consultedTasks;
          inf = tasks.informedTasks;

          if (res && res.length) distinctGroupName.push({
            id: "responsible-tasks",
            title: translate('task.task_management.responsible_role')
          })
          if (acc && acc.length) distinctGroupName.push({
            id: "accountable-tasks",
            title: translate('task.task_management.accountable_role')
          })
          if (con && con.length) distinctGroupName.push({
            id: "consulted-tasks",
            title: translate('task.task_management.consulted_role')
          })
          if (inf && inf.length) distinctGroupName.push({
            id: "informed-tasks",
            title: translate('task.task_management.informed_role')
          })
        }
      }
    }
    let group = [{ id: "no-data", title: "" }];

    return distinctGroupName.length ? distinctGroupName : group;
  }

  // Hiển thị tiến độ công việc

  displayTaskProgress = async (progress, x, color) => {
    if (x) {
      let d, child;
      d = document.createElement('div');
      d.setAttribute("class", "task-progress");
      d.style.width = `${progress}%`;
      d.style.backgroundColor = color;

      child = x.childElementCount;

      if (child === 1) {
        await x.appendChild(d);
      }
    }
  }



  handleItemClick = async (itemId) => {
    let { tasks } = this.props;
    var taskList, inprocessTasks;

    if (tasks) {
      if (this.props.TaskOrganizationUnitDashboard) {
        taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
        inprocessTasks = taskList && taskList.filter(task => (task.status === "Inprocess" && task.isArchived === false));
      }
      else {
        let res, acc, con, inf;
        var inprocessTasks2 = [];

        res = tasks.responsibleTasks;
        acc = tasks.accountableTasks;
        con = tasks.consultedTasks;
        inf = tasks.informedTasks;

        if (res) {
          await res.map(item => {
            if (item.status === "Inprocess" && item.isArchived === false) {
              inprocessTasks2.push({
                _id: item._id
              })
            }
          })
        }

        if (acc) {
          await acc.map(item => {
            if (item.status === "Inprocess" && item.isArchived === false) {
              inprocessTasks2.push({
                _id: item._id
              })
            }
          })
        }

        if (con) {
          await con.map(item => {
            if (item.status === "Inprocess" && item.isArchived === false) {
              inprocessTasks2.push({
                _id: item._id
              })
            }
          })
        }

        if (inf) {
          await inf.map(item => {
            if (item.status === "Inprocess" && item.isArchived === false) {
              inprocessTasks2.push({
                _id: item._id
              })
            }
          })
        }
        inprocessTasks = inprocessTasks2;
      }
    }

    let id = inprocessTasks[itemId - 1]._id;

    await this.setState(state => {
      return {
        ...state,
        taskId: id
      }
    })
    await this.props.getTaskById(id);
    window.$(`#modal-detail-task`).modal('show')
  }

  animateScroll = invert => {
    const width = (invert ? -1 : 1) * parseFloat(this.scrollRef.style.width);
    const duration = 1200;
    const startTime = performance.now();
    let lastWidth = 0;
    const animate = () => {
      let normalizedTime = (performance.now() - startTime) / duration;
      if (normalizedTime > 1) {
        normalizedTime = 1;
      }
      const calculatedWidth = width * 0.5 * (1 + Math.cos(Math.PI * (normalizedTime - 1)));
      this.scrollRef.scrollLeft += calculatedWidth - lastWidth;
      lastWidth = calculatedWidth;
      if (normalizedTime < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  onPrevClick = () => {
    this.animateScroll(true);
  };

  onNextClick = () => {
    this.animateScroll(false);
  };

  render() {
    const { tasks, translate } = this.props;
    const { TaskOrganizationUnitDashboard } = this.props;
    const { defaultTimeStart, defaultTimeEnd } = this.state;

    let task = tasks && tasks.task;
    let today = new Date();

    let rctHeadText = TaskOrganizationUnitDashboard ? translate('task.task_management.responsible') : translate('task.task_management.role');
    let rctHead = document.getElementsByClassName("rct-header-root");

    if (rctHead[0]) {
      let first = rctHead[0].children;
      if (first[0]) {
        first[0].setAttribute("id", "rct-header-text")
        first[0].innerHTML = rctHeadText;
      }
    }

    return (
      <React.Fragment>
        <div className="box-body qlcv">
          {<ModalDetailTask task={task} />}
          <Timeline
            scrollRef={el => (this.scrollRef = el)}
            groups={this.getTaskGroups()}
            items={this.getTaskDurations()}
            itemsSorted
            itemTouchSendsClick={false}
            stackItems
            sidebarWidth={150}
            itemHeightRatio={0.8}
            onItemClick={this.handleItemClick}
            canMove={false}
            canResize={false}
            defaultTimeStart={defaultTimeStart}
            defaultTimeEnd={defaultTimeEnd}
          >
            <TodayMarker date={today}>
              {
                ({ styles, date }) => {
                  const customStyles = {
                    ...styles,
                    backgroundColor: 'rgba(231, 76, 60, 1)',
                    width: '2px',
                    zIndex: '100'
                  }
                  return <div style={customStyles}></div>
                }
              }
            </TodayMarker>
          </Timeline>
          <div className="form-inline" style={{ textAlign: "center", margin: "10px" }}>
            <div className="form-group">
              <div id="in-time"></div>
              <label id="label-for-calendar">{translate('task.task_management.in_time')}</label>
            </div>
            <div className="form-group">
              <div id="delay"></div>
              <label id="label-for-calendar">{translate('task.task_management.delayed_time')}</label>
            </div>
            <div className="form-group">
              <div id="not-achieved"></div>
              <label id="label-for-calendar">{translate('task.task_management.not_achieved')}</label>
            </div>

          </div>
          <div className="form-inline pull-right" style={{ marginTop: "5px" }}>
            <button className='btn btn-success' onClick={this.onPrevClick}><i className="fa fa-angle-left"></i> {translate('task.task_management.prev')}</button>
            <button className='btn btn-success' onClick={this.onNextClick}>{translate('task.task_management.next')} <i className="fa fa-angle-right"></i></button>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapState(state) {
  const { tasks } = state;
  return { tasks }
}
const actions = {
  getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
  getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
  getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
  getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
  getTaskById: taskManagementActions.getTaskById,
  getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
}
const connectedSchedule = connect(mapState, actions)(withTranslate(TasksSchedule))
export { connectedSchedule as TasksSchedule }