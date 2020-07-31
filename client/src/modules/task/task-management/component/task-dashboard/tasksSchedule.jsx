import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DatePicker } from '../../../../../common-components/index'
import { taskManagementActions } from '../../../task-management/redux/actions'
import { ModalDetailTask } from './modalDetailTask'
import Swal from 'sweetalert2'
import moment from 'moment'
import Timeline, {TodayMarker} from "react-calendar-timeline"
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
        startDateAfter: this.formatDate(new Date()),
        endDateBefore: null
      },
      taskId: null
    };
  }

  componentDidMount() {
    let { infoSearch } = this.state;
    let { organizationalUnit, currentPage, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = infoSearch;
    this.props.getResponsibleTaskByUser(organizationalUnit, currentPage, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth()),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [month, year].join('-');
  }

  handleSearchTasks = async () => {
    let { infoSearch } = this.state;
    let { organizationalUnit, currentPage, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = infoSearch;
    if (startDateAfter === "") startDateAfter = null;
    if (endDateBefore === "") endDateBefore = null;

    await this.setState(state => {
      return {
        ...state,
        infoSearch: {
          ...state.infoSearch,
          startDateAfter: this.state.startDateAfter,
          endDateBefore: this.state.endDateBefore
        }
      }
    })

    let startAfterSpl;
    let startdate_after = null;
    let endBeforeSpl;
    let enddate_before = null;

    if (startDateAfter === undefined) startDateAfter = null;
    if (endDateBefore === undefined) endDateBefore = null;
    if (startDateAfter !== null) {
      startAfterSpl = startDateAfter.split("-");
      startdate_after = new Date(startAfterSpl[1], startAfterSpl[0], 0);
    }
    if (endDateBefore !== null) {
      endBeforeSpl = endDateBefore.split("-");
      enddate_before = new Date(endBeforeSpl[1], endBeforeSpl[0], 28);
    }
    if (startdate_after && enddate_before &&
      Date.parse(startdate_after) > Date.parse(enddate_before)) {
        const {translate} = this.props;
      Swal.fire({
        title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    }
    else {
      this.props.getResponsibleTaskByUser(organizationalUnit, currentPage, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
    }
  }
  handleStartDateChange = async (value) => {
    await this.setState(state => {
      return {
        ...state,
        infoSearch: {
          ...state.infoSearch,
          startDateAfter: value,
        }
      }
    });

  }
  handleEndDateChange = async (value) => {
    await this.setState(state => {
      return {
        ...state,
        infoSearch: {
          ...state.infoSearch,
          endDateBefore: value,
        }
      }
    });

  }
  getDurations() {
    const { tasks } = this.props;
    const taskList = tasks && tasks.responsibleTasks;
    let durations = [];

    if (taskList) {
      for (let i = 1; i <= taskList.length; i++) {
        let start_time = moment(new Date(taskList[i - 1].startDate));
        let end_time = moment(new Date(taskList[i - 1].endDate));

        durations.push({
          id: parseInt(i),
          group: 1,
          title: `${taskList[i - 1].name} - ${taskList[i - 1].progress}%`,
          canMove: false,

          start_time: start_time,
          end_time: end_time,

          itemProps: {
            style: {
              color: "rgba(0, 0, 0, 0.8)",
              borderStyle: "solid",
              fontWeight: '600',
              fontSize: 14,
              borderWidth: 1,
              borderRadius: 3
            }
          }
        })
      }
    }
    return durations;
  }

  handleItemClick = async (itemId) => {
    let { tasks } = this.props;
    let id = tasks.responsibleTasks[itemId - 1]._id;
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
                ({styles, date}) => {
                  const customStyles ={
                    ...styles,
                    backgroundColor: '#d73925',
                    width: '3px',
                    marginLeft:'-4px'

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
  getTaskById: taskManagementActions.getTaskById
}
const connectedSchedule = connect(mapState, actions)(withTranslate(TasksSchedule))
export { connectedSchedule as TasksSchedule }