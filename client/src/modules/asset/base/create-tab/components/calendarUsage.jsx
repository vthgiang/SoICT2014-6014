import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RecommendDistributeActions } from '../../../user/use-request/redux/actions';
import { UseRequestActions } from '../../../admin/use-request/redux/actions'
import { UsageLogAddModal } from './combinedContent';
import { Scheduler, formatDate } from '../../../../../common-components';
import { UseRequestCreateForm } from './../../../user/use-request/components/UseRequestCreateForm';
import './calendarUsage.css';



class CalendarUsage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
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

  shouldComponentUpdate = async (nextProps, nextState) => {
    if (nextState.clickInfo !== this.state.clickInfo || nextState.currentEvent !== this.state.currentEvent) {
      await this.setState({
        clickInfo: nextState.clickInfo,
        currentEvent: nextState.currentEvent,
      });
      this.handleClick();
      return false;
    }
    return true;
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  handleDateSelect = async (selectInfo) => {
    // Reset lại dữ liệu của currentRow
    await this.setState(state => {
      return {
        ...state,
        currentRow: undefined,
        currentRowAdd: undefined
      }
    });
    let startTime = [selectInfo.start.getHours(), selectInfo.start.getMinutes()].join(':');
    let stopTime = [selectInfo.end.getHours(), selectInfo.end.getMinutes()].join(':');

    if( this.props.managedBy == this.state.userId){
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
    } else {
      await this.setState(state => {
        return {
          ...state,
          currentRowAdd: {
            ...selectInfo,
            startTime: startTime,
            stopTime: stopTime,
          }
        }
      });

    window.$(`#modal-create-recommenddistribute-calendar-${this.props.assetId}`).modal('show');
    }
    
  }

  handleEventClick = async (clickInfo) => {
    await this.setState({
      clickInfo: clickInfo
    })
  }

  handleClick = () => {
    if (this.state.currentEvent == 'delete') {
      this.handleDeleteEvent(this.state.clickInfo);
    }
    if (this.state.currentEvent == 'approve') {
      this.handleApprove(this.state.clickInfo);
    }
  }
  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }


  handleDeleteEvent = async (clickInfo) => {
    let count, data;
    var { usageLogs } = this.state;
    // var data = usageLogs[index];
    count = usageLogs.findIndex(item => item._id == clickInfo.event.id)
    data = usageLogs[count]
    usageLogs.splice(count, 1);
    await this.setState({
      ...this.state,
      usageLogs: [...usageLogs],
      currentEvent: undefined,
    })
    clickInfo.event.remove()
    await this.props.deleteUsage(this.props.assetId, data._id)
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
      calendarApi.unselect() // clear date selection
      calendarApi.addEvent({
        // id: createEventId(),
        id: 1,
        title: userlist.filter(item => item._id === data.usedByUser).pop() ? userlist.filter(item => item._id === data.usedByUser).pop().name : "Chưa có đối tượng sử dụng",
        color: '#337ab7',
        start: newUsage.startDate,
        end: newUsage.endDate,
      })

    }

    await this.setState({
      ...this.state,
      usageLogs: usageLogs,
      assignedToUser: data.usedByUser,
      assignedToOrganizationalUnit: data.usedByOrganizationalUnit,
      status: "in_use",
    })

    let createUsage = {
      usageLogs: usageLogs,
      status: "in_use",
      assignedToUser: data.usedByUser,
      assignedToOrganizationalUnit: data.usedByOrganizationalUnit,
    }

    await this.props.createUsage(this.props.assetId, createUsage)
    // await this.props.handleAddUsage(createUsage);
  }
  
  handleCreateUseRequest = async (data) => {
    const { currentRowAdd } = this.state
    const { user } = this.props;
    let userlist = user.list, startDate, endDate, partStart, partEnd;

    partStart =  data.dateStartUse.split('-');
    startDate = [partStart[2], partStart[1], partStart[0]].join("-") + " " + data.startTime;

    partEnd = data.dateEndUse.split('-');
    endDate = [partEnd[2], partEnd[1], partEnd[0]].join("-") + " " + data.stopTime;  
    startDate = new Date(startDate);
    endDate =  new Date(endDate);

    let calendarApi = currentRowAdd.view.calendar;
    if (data) {
      calendarApi.unselect() // clear date selection
      calendarApi.addEvent({
        // id: createEventId(),
        id: 1,
        title: userlist.filter(item => item._id === data.proponent).pop() ? userlist.filter(item => item._id === data.proponent).pop().name : "Chưa có đối tượng sử dụng",
        color: '#00a65a',
        start: startDate,
        end: endDate,
      })
    }
  }

  handleApprove = async (clickInfo) => {
    // event.preventDefault();
    const { recommendDistribute } = this.props;
    var { usageLogs } = this.state;
    let list, dataRecommendDistribute, value = clickInfo.event.id;
    if (recommendDistribute && recommendDistribute.listRecommendDistributes) {
      list = recommendDistribute.listRecommendDistributes;
      dataRecommendDistribute = list.filter(item => item._id == value);
    }
    if (dataRecommendDistribute) {
      await this.props.updateRecommendDistribute(
        dataRecommendDistribute[0]._id,
        {
          recommendNumber: dataRecommendDistribute[0].recommendNumber,
          dateCreate: dataRecommendDistribute[0].dateCreate,
          proponent: dataRecommendDistribute[0].proponent, // Người đề nghị
          reqContent: dataRecommendDistribute[0].reqContent,
          asset: dataRecommendDistribute[0].asset,
          dateStartUse: dataRecommendDistribute[0].dateStartUse,
          dateEndUse: dataRecommendDistribute[0].dateEndUse,
          approver: dataRecommendDistribute[0].approver, // Người phê duyệt
          note: dataRecommendDistribute[0].note,
          status: "Đã phê duyệt",
        })

      let data = {
        receiptsCode: "",
        month: "",
        reqUseStatus: null,
        page: 0,
        limit: 5,
        managedBy: this.props.managedBy ? this.props.managedBy : '',
        assetId: this.props.assetId
      }
      let newUsage = {
        usedByUser: dataRecommendDistribute[0].proponent,
        usedByOrganizationalUnit: null,
        startDate: dataRecommendDistribute[0].dateStartUse,
        endDate: dataRecommendDistribute[0].dateEndUse,
      }
      usageLogs.push(newUsage)

      let createUsage = {
        usageLogs: usageLogs,
        status: "in_use",
        assignedToUser: dataRecommendDistribute[0].proponent,
        assignedToOrganizationalUnit: undefined,
      }

      clickInfo.event.setProp("backgroundColor", "#337ab7")
      clickInfo.event.setProp("borderColor", "#337ab7")

      await this.props.createUsage(this.props.assetId, createUsage)
      await this.props.searchRecommendDistributes(data);
    }
  }


  renderEventContent = (eventInfo) => {
    return (
      <>
        { (eventInfo.event.borderColor != "#337ab7" &&  this.props.managedBy == this.state.userId) &&
          <a className="edit" title="Approve" style={{ color: "whitesmoke", cursor: "pointer" }} data-toggle="tooltip" onClick={async () => {
            await this.setState({
              currentEvent: 'approve',
            }, () => {
              return this.handleEventClick
            })

          }}><i className="material-icons" id="approve-event">post_add</i></a>
        }
        {eventInfo.event.borderColor == "#337ab7" &&
          <a className="delete" title="Delete" style={{}} data-toggle="tooltip" onClick={async () => {
            await this.setState({
              currentEvent: 'delete',
            }, () => {
              return this.handleEventClick
            })

          }}><i className="material-icons" id="delete-event"></i></a>
        }
        <br />
        <i>{eventInfo.event.title}</i><br />
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
    const { recommendDistribute, user, assetId, managedBy } = this.props;
    var { currentRow, typeRegisterForUse, usageLogs, currentRowAdd } = this.state;
    let listRecommendDistributes, data = [], userlist = user.list;
    if (recommendDistribute && recommendDistribute.listRecommendDistributes) {
      listRecommendDistributes = recommendDistribute.listRecommendDistributes
      for (let i in listRecommendDistributes) {
        let recommendDistribute;
        if (listRecommendDistributes[i].status == "Chờ phê duyệt") {
          recommendDistribute = {
            id: listRecommendDistributes[i]._id,
            color: listRecommendDistributes[i].status == "Chờ phê duyệt" ? '#00a65a' : (listRecommendDistributes[i].status == "Đã phê duyệt" ? '#337ab7' : 'yellow'),
            title: listRecommendDistributes[i].proponent.name,
            start: listRecommendDistributes[i].dateStartUse,
            end: listRecommendDistributes[i].dateEndUse,
          }
          data.push(recommendDistribute);
        }
      }

      for (let i in usageLogs) {
        data.push({
          id: usageLogs[i]._id,
          title: userlist.filter(item => item._id === usageLogs[i].usedByUser).pop() ? userlist.filter(item => item._id === usageLogs[i].usedByUser).pop().name : "Chưa có đối tượng sử dụng",
          color: '#337ab7',
          start: usageLogs[i].startDate,
          end: usageLogs[i].endDate,
          // url: usageLogs[i].description,
        })
      }
    }

    return (
      <div className='demo-app'>
        <div className='demo-app-main'>
          {((listRecommendDistributes && data.length > usageLogs.length) ||
            (!listRecommendDistributes && data.length == usageLogs.length))
            &&
            <Scheduler
              className="asset-usage-scheduler"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek'
              }}
              updateSizeEventRegistrations={[ // Áp dụng khi mở lại modal (trước đó modal đã mở và tab usage được chọn)
                { selector: "#modal-view-asset", eventName: "shown.bs.modal" },
                { selector: "#modal-edit-asset", eventName: "shown.bs.modal" },
              ]}
              initialView='timeGridWeek'
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              now={this.state.nowDate}
              weekends={this.state.weekendsVisible}
              initialEvents={data} // alternatively, use the `events` setting to fetch from a feed
              select={this.handleDateSelect}
              // eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
              eventContent={this.renderEventContent}
              eventClick={this.handleEventClick}
            />
          }
        </div>

        {currentRow &&
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

        {
          currentRowAdd &&
          <UseRequestCreateForm
            _id={`calendar-${assetId}`}
            asset={assetId}
            typeRegisterForUse={typeRegisterForUse}
            managedBy={currentRowAdd.managedBy}
            startDate={currentRowAdd.start}
            endDate={currentRowAdd.end}
            startTime={currentRowAdd.startTime}
            stopTime={currentRowAdd.stopTime}
            handleChange = {this.handleCreateUseRequest}
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
  deleteUsage: UseRequestActions.deleteUsage,
};

const calendarUsage = connect(mapState, actionCreators)(withTranslate(CalendarUsage));

export { calendarUsage as CalendarUsage };