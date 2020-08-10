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
        organizationalUnit: '[]',
        currentPage: "1",
        perPage: "1000",
        status: '[]',
        priority: '[]',
        special: '[]',
        name: null,
        startDate: null,
        endDate: null,
        startDateAfter: this.formatDate(dateNow),
        endDateBefore: null
      },
      taskId: null,
      add: true,
      dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

      willUpdate: false       // Khi true sẽ cập nhật dữ liệu vào props từ redux
    };
  }

  componentDidMount = async () => {
    let { infoSearch } = this.state;
    let { organizationalUnit, currentPage, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = infoSearch;

    await this.props.getResponsibleTaskByUser(organizationalUnit, currentPage, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
    await this.setState(state => {
      return {
        ...state,
        dataStatus: this.DATA_STATUS.QUERYING,
        willUpdate: true       // Khi true sẽ cập nhật dữ liệu vào props từ redux
      };
    });
  }

  shouldComponentUpdate = async (nextProps, nextState) => {
    if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
      if (this.props.TaskOrganizationUnitDashboard) {
        if (!nextProps.tasks.organizationUnitTasks) {
          return false;
        }
      }
      else if (!nextProps.tasks.responsibleTasks
        || !nextProps.tasks.accountableTasks
        || !nextProps.tasks.consultedTasks
        || !nextProps.tasks.informedTasks
        || !nextProps.tasks.creatorTasks
        || !nextProps.tasks.tasksbyuser) {
        return false;
      }

      this.setState(state => {
        return {
          ...state,
          dataStatus: this.DATA_STATUS.AVAILABLE
        }
      });

    } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE && nextState.willUpdate) {
      this.setState(state => {
        return {
          ...state,
          dataStatus: this.DATA_STATUS.FINISHED,
          willUpdate: false       // Khi true sẽ cập nhật dữ liệu vào props từ redux
        }
      });
      return true;
    }
    return false;
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
      if (this.props.TaskOrganizationUnitDashboard) {
        taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
        inprocessTasks = taskList && taskList.filter(task => (task.status === "Inprocess" && task.isArchived === false));
      }
      else {
        taskList = tasks && tasks.responsibleTasks;
        inprocessTasks = taskList && taskList.filter(task => (task.status === "Inprocess" && task.isArchived === false));
      }
    }

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
    return taskDurations;
  }

  // Nhóm công việc theo người thực hiện

  getTaskGroups() {
    const { tasks, translate } = this.props;
    var taskList1, inprocessTasks1;
    let groupName = [], distinctGroupName = [], id = [], distinctId = [];
    let multiResponsibleEmployee = false;

    if (tasks) {
      if (this.props.TaskOrganizationUnitDashboard) {
        taskList1 = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
        inprocessTasks1 = taskList1 && taskList1.filter(task => (task.status === "Inprocess" && task.isArchived === false));
      }
      else {
        taskList1 = tasks && tasks.responsibleTasks;
        inprocessTasks1 = taskList1 && taskList1.filter(task => (task.status === "Inprocess" && task.isArchived === false));
      }
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
            })
          }
          else if (responsibleEmployeeIds.length > 1) {
            multiResponsibleEmployee = true;
          }

          id.push(responsibleEmployeeIds[0])
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
    let group = [{ id: "no-data", title: "" }]

    return distinctGroupName.length ? distinctGroupName : group;
  }

  // Hiển thị tiến độ công việc

  displayTaskProgress = async (progress, x, color) => {
    if (x) {
      let d, child;

      d = document.createElement('div');
      d.setAttribute("class", "task-progress");
      d.style.width = `${progress}%`
      d.style.backgroundColor = color;
      child = x.childElementCount;

      if (child === 1) x.appendChild(d);
    }
  }


  handleItemClick = async (itemId) => {
    let { tasks } = this.props;
    var taskList, inprocessTasks;

    if (tasks) {
      // if (this.props.TaskOrganizationUnitDashboard) {
      //   taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
      //   inprocessTasks = taskList && taskList.filter(task => task.status === "Inprocess");
      // }
      // else inprocessTasks = tasks.responsibleTasks;

      if (this.props.TaskOrganizationUnitDashboard) {
        taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
        inprocessTasks = taskList && taskList.filter(task => (task.status === "Inprocess" && task.isArchived === false));
      }
      else {
        taskList = tasks && tasks.responsibleTasks;
        inprocessTasks = taskList && taskList.filter(task => (task.status === "Inprocess" && task.isArchived === false));
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
    const { defaultTimeStart, defaultTimeEnd } = this.state;
    const { tasks, translate } = this.props;
    let { TaskOrganizationUnitDashboard } = this.props;
    let task = tasks && tasks.task;
    let today = new Date();
    this.displayTaskProgress();
    let sidebarWidth = TaskOrganizationUnitDashboard ? 150 : 0;
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
            sidebarWidth={sidebarWidth}
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
  getTaskById: taskManagementActions.getTaskById,
  getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
}
const connectedSchedule = connect(mapState, actions)(withTranslate(TasksSchedule))
export { connectedSchedule as TasksSchedule }