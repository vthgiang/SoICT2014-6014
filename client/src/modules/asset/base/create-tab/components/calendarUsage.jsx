import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { RecommendDistributeActions } from '../../../user/use-request/redux/actions';
import { UseRequestActions } from '../../../admin/use-request/redux/actions'
import { UsageLogAddModal } from './combinedContent';

import './calendarUsage.css';


class CalendarUsage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekendsVisible: true,
      currentEvents: [],
      nowDate: new Date(),
    }
  }
  componentDidMount() {
    let data = {
      receiptsCode: "",
      month: "",
      reqUseStatus: null,
      page: 0,
      limit: 5,
      managedBy: this.props.managedBy ? this.props.managedBy : '',
      assetId: this.props.id
    }
    this.props.searchRecommendDistributes(data); // Lấy phiếu đăng ký sử dụng theo tài sản
  }


  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  handleDateSelect = async (selectInfo) => {
    console.log("Chạy đến hàm handle date select", selectInfo)
    // Reset lại dữ liệu của currentRow
    await this.setState(state => {
      return {
        ...state,
        currentRow: undefined
      }
    });
    let startTime = [selectInfo.start.getHours(), selectInfo.start.getMinutes()].join(':');
    let stopTime = [selectInfo.end.getHours(), selectInfo.end.getMinutes()].join(':');
    console.log("----", `modal-create-usage-calendar-${this.props.assetId}`)
    await this.setState(state => {
      return {
        ...state,
        currentRow: {
          ...selectInfo,
          startTime: startTime,
          stopTime: stopTime,
        }
      }
    });
    window.$(`#modal-create-usage-calendar-${this.props.assetId}`).modal('show');
  }

  handleEventClick = (clickInfo) => {
    alert("Hii")
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

  handleAddUsage = async (data) => {
    const { assignedToUser, usageLogs, assignedToOrganizationalUnit, currentRow } = this.state
    const { user } = this.props;
    let userlist = user.list;
    let newUsage = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate)
    }
    usageLogs.push(newUsage);

    let calendarApi = currentRow.view.calendar;
    if (data) {
      console.log("currr", currentRow)
      calendarApi.unselect() // clear date selection
      calendarApi.addEvent({
        // id: createEventId(),
        id: 1,
        title: userlist.filter(item => item._id === data.usedByUser).pop() ? userlist.filter(item => item._id === data.usedByUser).pop().name : "Chưa có đối tượng sử dụng",
        color: '337ab7',
        start: newUsage.startDate,
        end: newUsage.endDate,
        url: newUsage.description,
      })

    }

    await this.setState({
      ...this.state,
      usageLogs: usageLogs,
      assignedToUser: data.usedByUser,
      assignedToOrganizationalUnit: data.usedByOrganizationalUnit,
      status: "Đang sử dụng",
    })

    let createUsage = {
      usageLogs: usageLogs,
      status: "Đang sử dụng",
      assignedToUser: data.usedByUser,
      assignedToOrganizationalUnit: data.usedByOrganizationalUnit,
    }

    await this.props.createUsage(this.props.assetId, createUsage)
    // await this.props.handleAddUsage(createUsage);
  }

  renderEventContent(eventInfo) {
    return (
      <>
        <i>{eventInfo.event.title}</i><br />
        <b>{eventInfo.event.url}</b><br />
        <b>{eventInfo.timeText}</b><br />
      </>
    )
  }
  renderSidebarEvent(event) {
    return (
      <li key={event.id}>
        <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
        <i>{event.title}</i>
      </li>
    )
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.id !== prevState.id || nextProps.usageLogs !== prevState.usageLogs) {
      return {
        ...prevState,
        id: nextProps.id,
        usageLogs: nextProps.usageLogs,
        assignedToUser: nextProps.assignedToUser,
        assignedToOrganizationalUnit: nextProps.assignedToOrganizationalUnit,
        typeRegisterForUse: nextProps.typeRegisterForUse,
      }
    } else {
      return null;
    }
  }

  render() {
    const { recommendDistribute, user, assetId } = this.props;
    var { currentRow, typeRegisterForUse, usageLogs } = this.state;
    // const { defaultCurrentDate, resources } = this.state;
    let listRecommendDistributes, data = [], userlist = user.list;
    console.log("Dòng 170 render")
    if (recommendDistribute && recommendDistribute.listRecommendDistributes) {
      listRecommendDistributes = recommendDistribute.listRecommendDistributes
      for (let i in listRecommendDistributes) {
        let recommendDistribute;
        recommendDistribute = {
          id: 1,
          color: listRecommendDistributes[i].status == "Chờ phê duyệt" ? '#00a65a' : (listRecommendDistributes[i].status == "Đã phê duyệt" ? 'blue' : 'yellow'),
          title: listRecommendDistributes[i].proponent.name,
          start: listRecommendDistributes[i].dateStartUse,
          end: listRecommendDistributes[i].dateEndUse,
        }
        data.push(recommendDistribute);
      }

      for (let i in usageLogs) {
        data.push({
          id: 1,
          title: userlist.filter(item => item._id === usageLogs[i].usedByUser).pop() ? userlist.filter(item => item._id === usageLogs[i].usedByUser).pop().name : "Chưa có đối tượng sử dụng",
          color: '#337ab7',
          start: usageLogs[i].startDate,
          end: usageLogs[i].endDate,
          url: usageLogs[i].description,
        })
      }
    }

    
    console.log("-----", data);
    return (
      <div className='demo-app'>
        <div className='demo-app-main'>
          {
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek'
              }}
              initialView='timeGridWeek'
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              now={this.state.nowDate}
              weekends={this.state.weekendsVisible}
              initialEvents={data} // alternatively, use the `events` setting to fetch from a feed
              select={this.handleDateSelect}
              eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
              eventContent={this.renderEventContent}
              eventClick={this.handleEventClick}
            />
          }
        </div>
        { currentRow &&
          <UsageLogAddModal
            calendarUsage={`calendar`}
            handleChange={this.handleAddUsage}
            id={`calendar-${assetId}`}
            typeRegisterForUse={typeRegisterForUse}
            startDate={currentRow.start}
            endDate={currentRow.end}
            startTime={currentRow.startTime}
            stopTime={currentRow.stopTime}
          />
        }
      </div>
    )
  }
}




function mapState(state) {
  const { user, department, recommendDistribute } = state;
  return { user, department, recommendDistribute };
};

const actionCreators = {
  searchRecommendDistributes: RecommendDistributeActions.searchRecommendDistributes,
  updateRecommendDistribute: RecommendDistributeActions.updateRecommendDistribute,
  createUsage: UseRequestActions.createUsage,
};

const calendarUsage = connect(mapState, actionCreators)(withTranslate(CalendarUsage));

export { calendarUsage as CalendarUsage };
