import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { RecommendDistributeActions } from '../../../user/use-request/redux/actions';
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

  handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        // id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  //   handleEventClick = (clickInfo) => {
  //     if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
  //       clickInfo.event.remove()
  //     }
  //   }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }



  renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
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
  render() {
    const { recommendDistribute, user } = this.props;
    // const { defaultCurrentDate, resources } = this.state;
    let listRecommendDistributes, data = [], userlist = user.list;

    if (recommendDistribute && recommendDistribute.listRecommendDistributes) {
      listRecommendDistributes = recommendDistribute.listRecommendDistributes
      for (let i in listRecommendDistributes) {
        let recommendDistribute;
        recommendDistribute = {
          id: listRecommendDistributes[i]._id,
          color: listRecommendDistributes[i].status == "Chờ phê duyệt" ? 'green' : (listRecommendDistributes[i].status == "Đã phê duyệt" ? 'blue': 'yellow'),
          title: listRecommendDistributes[i].proponent.name,
          start: listRecommendDistributes[i].dateStartUse,
          end: listRecommendDistributes[i].dateEndUse,
        }
        data.push(recommendDistribute);
      }
    }

    for (let i in this.props.usageLogs) {
      data.push({
        id: 1,
        title: userlist.filter(item => item._id === this.props.usageLogs[i].usedByUser).pop() ? userlist.filter(item => item._id === this.props.usageLogs[i].usedByUser).pop().name : "Chưa có đối tượng sử dụng",
        color: 'blue',
        start: this.props.usageLogs[i].startDate,
        end: this.props.usageLogs[i].endDate,
      })
    }
    console.log("-----", data)
    return (
      <div className='demo-app'>
        <div className='demo-app-main'>
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
          />
        </div>
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
};

const calendarUsage = connect(mapState, actionCreators)(withTranslate(CalendarUsage));

export { calendarUsage as CalendarUsage };
