import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Resources,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  DateNavigator,
  Toolbar
} from '@devexpress/dx-react-scheduler-material-ui';
import { blue, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { RecommendDistributeActions } from '../../../user/use-request/redux/actions';
import './calendarUsage.css';


class CalendarUsage extends Component {
  constructor(props) {
    super(props);

    // Khởi tạo group cho phiếu đăng ký theo trạng thái
    const locations = [
      { text: 'Đã phê duyệt', id: 1, color: blue },
      { text: 'Chưa phê duyệt', id: 2, color: green },
    ]

    this.state = {
      defaultCurrentDate: new Date(),
      resources: [{
        fieldName: 'status',
        title: 'Test',
        instances: locations,
      }],
    };
  }

  Header = (({
    children, appointmentData, classes, props, ...restProps
  }) => (
      <AppointmentTooltip.Header
        {...restProps}
        appointmentData={appointmentData}
      >
        { this.props.id == `edit` &&
          <IconButton
            onClick={event => this.handleApprove(event, appointmentData.id)}
          >
            <i className="material-icons">post_add</i>
          </IconButton>
        }

      </AppointmentTooltip.Header>
    ));

  componentDidMount() {
    let data = {
      recommendNumber: "",
      month: "",
      status: null,
      page: 0,
      limit: 5,
      managedBy: this.props.managedBy ? this.props.managedBy : '',
      assetId: this.props.id
    }
    this.props.searchRecommendDistributes(data); // Lấy phiếu đăng ký sử dụng theo tài sản
  }

  handleApprove = async (event, value) => {
    event.preventDefault();
    const { recommendDistribute } = this.props;
    let list, dataRecommendDistribute;
    if (recommendDistribute && recommendDistribute.listRecommendDistributes) {
      list = recommendDistribute.listRecommendDistributes;
      dataRecommendDistribute = list.filter(item => item._id == value);
    }
    console.log("ddđ")
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
        recommendNumber: "",
        month: "",
        status: null,
        page: 0,
        limit: 5,
        managedBy: this.props.managedBy ? this.props.managedBy : '',
        assetId: this.props.id
      }
      await this.props.searchRecommendDistributes(data);
    }
  }

  handleEdit = async (value) => {
    await this.setState(state => {
      return {
        ...state,
        currentRow: value
      }
    });
    window.$('#modal-edit-recommenddistributemanage').modal('show');
  }



  formatDate(value) {
    let partTime, partDate, date, time;
    if (value.length > 10) {
      partTime = value.split(' ');
      partDate = partTime[2].split('-');
      date = [partDate[2], partDate[1], partDate[0]].join('-');
      time = [date, partTime[0], partTime[1]].join(' ');
    } else {
      time = value
    }
    return time;
  }


  render() {
    const { recommendDistribute, user } = this.props;
    const { defaultCurrentDate, resources } = this.state;
    let listRecommendDistributes, data = [], userlist = user.list;

    if (recommendDistribute && recommendDistribute.listRecommendDistributes) {
      listRecommendDistributes = recommendDistribute.listRecommendDistributes
      for (let i in listRecommendDistributes) {
        let recommendDistribute;
        recommendDistribute = {
          id: listRecommendDistributes[i]._id,
          status: listRecommendDistributes[i].status == "Chờ phê duyệt" ? 2 : 1,
          title: listRecommendDistributes[i].proponent.name,
          startDate: new Date(this.formatDate(listRecommendDistributes[i].dateStartUse)),
          endDate: new Date(this.formatDate(listRecommendDistributes[i].dateEndUse)),
        }
        data.push(recommendDistribute);
      }
    }

    for (let i in this.props.usageLogs) {
      data.push({
        id: 1,
        title: userlist.filter(item => item._id === this.props.usageLogs[i].usedByUser).pop() ? userlist.filter(item => item._id === this.props.usageLogs[i].usedByUser).pop().name : "Chưa có đối tượng sử dụng",
        status: 1,
        startDate: new Date(this.props.usageLogs[i].startDate),
        endDate: new Date(this.props.usageLogs[i].endDate),
      })
    }

    return (
      <Paper>
        <Scheduler
          data={data}
          height={500}
        >
          {/* Điều chỉnh lịch */}
          <Toolbar
            defaultCurrentDate={defaultCurrentDate}
          />
          <ViewState
            defaultCurrentDate={defaultCurrentDate}
          />
          <DateNavigator />
          <WeekView
            startDayHour={7}
            endDayHour={23}
          />
          {/* Hiển thị dữ liệu và form */}
          <Appointments />
          <AppointmentTooltip
            headerComponent={this.Header}
            showCloseButton
          />
          <AppointmentForm />
          {/* Phân nhóm đăng ký sử dụng */}
          <Resources
            data={resources}
            mainResourceName="status"
          />
        </Scheduler>
      </Paper>
    );
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
