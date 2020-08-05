import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { taskManagementActions } from '../../../task-management/redux/actions'

import { ModalDetailTask } from './modalDetailTask'

import Timeline, { TodayMarker } from "react-calendar-timeline"
import { DatePicker } from '../../../../../common-components/index'

import Swal from 'sweetalert2'
import moment from 'moment'
import 'react-calendar-timeline/lib/Timeline.css'
import './calendar.css'


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
    let unitIds = this.props.units ? this.props.units : "[]";
    console.log('uniit\n\n\n\n\n\n\n\n', this.props.units);
    await this.props.getResponsibleTaskByUser(organizationalUnit, currentPage, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
    await this.props.getTaskInOrganizationUnitByMonth("[]", startDateAfter, endDateBefore);
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
      else if (!nextProps.tasks.responsibleTasks || !nextProps.tasks.accountableTasks || !nextProps.tasks.consultedTasks || !nextProps.tasks.informedTasks || !nextProps.tasks.creatorTasks || !nextProps.tasks.tasksbyuser) {
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
    // let d = new Date(date),
    let month = '' + (d.getMonth());
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;

    return [month, year].join('-');
  }

  handleSearchTasks = async (nextState) => {
    let { infoSearch } = this.state;
    let { organizationalUnit, currentPage, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = infoSearch;
    console.log(startDateAfter, endDateBefore);
    if (startDateAfter === "") startDateAfter = null;
    if (endDateBefore === "") endDateBefore = null;

    await this.setState(state => {
      return {
        ...state,
        infoSearch: {
          ...state.infoSearch,
          startDateAfter: startDateAfter,
          endDateBefore: endDateBefore
        }
      }
    })
    // console.log('===============\n\n\n\n\n\n\n', this.state.infoSearch);
    let startAfterSpl;
    let startdate_after = null;
    let endBeforeSpl;
    let enddate_before = null;

    if (startDateAfter === undefined) startDateAfter = null;
    if (endDateBefore === undefined) endDateBefore = null;
    if (startDateAfter !== null) {
      startAfterSpl = startDateAfter.split("-");
      startdate_after = new Date(startAfterSpl[0], startAfterSpl[1], 0);
    }

    if (endDateBefore !== null) {
      endBeforeSpl = endDateBefore.split("-");
      enddate_before = new Date(endBeforeSpl[0], endBeforeSpl[1], 28);
    }
    if (startdate_after && enddate_before &&
      Date.parse(startdate_after) > Date.parse(enddate_before)) {
      const { translate } = this.props;
      Swal.fire({
        title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    }
    else {
      // console.log('chay den 162', this.props.TaskOrganizationUnitDashboard);
      if (this.props.TaskOrganizationUnitDashboard) {
        let unitIds = this.props.units ? this.props.units : "[]";
        console.log("kkkk", startDateAfter, endDateBefore)
        this.props.getTaskInOrganizationUnitByMonth(unitIds, startDateAfter, endDateBefore);
      }
      else {
        this.props.getResponsibleTaskByUser(organizationalUnit, currentPage, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
        // console.log('ko chay vao if');
      }
    }
  }
  handleStartDateChange = async (value) => {
    // if (value = )
    // let test = this.formatDate(value);
    // console.log(test);
    let month = value.split("-");
    let startAfter = [month[0], month[1]].join("-");
    console.log('dsfsd', startAfter);
    await this.setState(state => {
      return {
        ...state,
        infoSearch: {
          ...state.infoSearch,
          startDateAfter: startAfter,
        }
      }
    });

  }
  handleEndDateChange = async (value) => {
    let month = value.split("-");
    let endBefore = [month[0], month[1]].join("-");

    console.log(endBefore);
    await this.setState(state => {
      return {
        ...state,
        infoSearch: {
          ...state.infoSearch,
          endDateBefore: endBefore,
        }
      }
    });

  }
  getDurations() {
    const { tasks } = this.props;
    console.log(tasks)
    var taskList, inprocessTasks;
    let durations = [];
    if (tasks) {
      if (this.props.TaskOrganizationUnitDashboard) {
        taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
        inprocessTasks = taskList && taskList.filter(task => task.status === "Inprocess");
      }
      else inprocessTasks = tasks.responsibleTasks;

    }


    if (inprocessTasks) {
      for (let i = 1; i <= inprocessTasks.length; i++) {
        let start_time = moment(new Date(inprocessTasks[i - 1].startDate));
        let end_time = moment(new Date(inprocessTasks[i - 1].endDate));
        let responsibleName = [];
        let title;
        inprocessTasks[i - 1].responsibleEmployees.map(x => {
          responsibleName.push(x.name)
        });
        if (this.props.TaskOrganizationUnitDashboard) {
          title = inprocessTasks[i - 1].name + " - " + responsibleName + " - " + inprocessTasks[i - 1].progress + "%"
        }
        else {
          title = inprocessTasks[i - 1].name + " - " + inprocessTasks[i - 1].progress + "%"
        }
        durations.push({
          id: parseInt(i),
          group: 1,
          title: title,
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
    return durations;
  }



  displayTaskProgress = async () => {
    let x = document.getElementsByClassName("rct-item");
    let d = document.createElement('div');
    let { add } = this.state;
    d.setAttribute("id", "task-progress");
    var test = x[0];
    if (x[0]) {



      if (add) {
        x[0].appendChild(d);
        console.log('\n\n\n\n\n\n\n\nchay vao day');
        await this.setState(state => {

          return {
            ...state,
            add: false,
          }
        })
      }
      console.log('rct-item', x[0]);

    }
  }



  handleItemClick = async (itemId) => {
    let { tasks } = this.props;
    let taskList, inprocessTasks;

    if (tasks) {
      if (this.props.TaskOrganizationUnitDashboard) {
        taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
        inprocessTasks = taskList && taskList.filter(task => task.status === "Inprocess");
      }
      else inprocessTasks = tasks.responsibleTasks;

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
    const { defaultTimeStart, defaultTimeEnd, infoSearch, taskId } = this.state;
    const { startDateAfter, endDateBefore } = infoSearch;
    let { tasks, translate } = this.props;
    let task = tasks && tasks.task;
    let today = new Date();
    this.displayTaskProgress();
    return (
      <React.Fragment>
        <div className="box-body qlcv">
          {<ModalDetailTask task={task} />}
          <div className="flex-right">
            <div className="form-inline">
              <div className="form-group">
                <label>{translate('task.task_management.from')}: </label>
                <DatePicker id='start_date_after'
                  value={startDateAfter}
                  onChange={this.handleStartDateChange}
                  dateFormat="month-year"
                />
              </div>
              <div className="form-group">
                <label>{translate('task.task_management.to')}: </label>
                <DatePicker
                  id='end_date_before'
                  value={endDateBefore}
                  onChange={this.handleEndDateChange}
                  dateFormat="month-year"
                />
              </div>
              <div className="form-group">
                <button className="btn btn-success" onClick={this.handleSearchTasks}>{translate('task.task_management.search')}</button>
              </div>
            </div>
          </div>
          <Timeline
            scrollRef={el => (this.scrollRef = el)}
            items={this.getDurations()}
            groups={[{ id: 1, title: 'group' }]}
            itemsSorted
            itemTouchSendsClick={false}
            stackItems
            sidebarWidth={0}
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
                    backgroundColor: '#d73925',
                    width: '3px',
                    // marginLeft: '-4px'

                  }
                  return <div style={customStyles}></div>
                }
              }
            </TodayMarker>
          </Timeline>
          <div className="form-inline pull-right" style={{ marginTop: "5px" }}>
            <button className='btn btn-danger' onClick={this.onPrevClick}><i className="fa fa-angle-left"></i> {translate('task.task_management.prev')}</button>
            <button className='btn btn-danger' onClick={this.onNextClick}>{translate('task.task_management.next')} <i className="fa fa-angle-right"></i></button>
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