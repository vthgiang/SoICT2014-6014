import React, {Component} from 'react'
import {connect} from 'react-redux'
import Swal from 'sweetalert2';
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import Timeline from "react-calendar-timeline";
import {DatePicker} from '../../../../../common-components/index'
import { taskManagementActions } from '../../../task-management/redux/actions';
import {ModelDetailTask2} from './detailTask'
import './calendar.css'



//TODO: Sửa lại tham số trong componentDidMount
//      sửa tên thuộc tính 
//      sắp xếp lại thứ tự các hàm riêng biệt cho 2 phần calendar và search
//      xóa service getbyDate đã thêm nhưng không dùng đến
//      sửa lại tham số cho service lấy dữ liệu trong taskManagement.jsx




class TasksSchedule extends Component{
    constructor(props){
        super(props);
    
    var defaultTimeStart = moment()
      .startOf("month")
      .toDate();
      console.log('jfakslfalsflkasjdfljasdkgjasljaigisdf',defaultTimeStart);
    var defaultTimeEnd = moment()
      .startOf("month")
      .add(1, "month")
      .toDate();
    // const now = moment();
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
      // month: (new Date()).getMonth()
    };
    // console.log('fjaslkdfjasdf', this.state.infoSearch.startDateAfter);
  }
  componentDidMount() {
    let {startDateAfter} = this.state.infoSearch;
    this.props.getResponsibleTaskByUser("[]", "1", "1000", "[]", "[]", "[]", null, null, null,startDateAfter,null);
    // console.log('running in componentDidMount...');
  }
  // formatDateBack(date) {
  //   var d = new Date(date), month, day, year;
  //   if(d.getMonth()===0){
  //       month = '' + 12;
  //       day = '' + d.getDate();
  //       year = d.getFullYear()-1;
  //   } else{
  //       month = '' + (d.getMonth()+1);
  //       day = '' + d.getDate();
  //       year = d.getFullYear();
  //   }
  //   if (month.length < 2)
  //       month = '0' + month;
  //   if (day.length < 2)
  //       day = '0' + day;

  //   return [month, year].join('-');
  // }
  formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth()),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2)
          month = '0' + month;
      if (day.length < 2)
          day = '0' + day;

      return [month, year].join('-');
  }
  formatDate2(date) {
    let res = date.split("-");

    return [res[1], res[0]].join(',');
}
  handleSearchTasks = async () => {
    if(this.state.startDateAfter === "") this.state.startDateAfter = null;
    if(this.state.endDateBefore === "") this.state.endDateBefore = null;
    
    // console.log('mmmmmmmmmm',this.formatDate2(this.state.startDateAfter));
    await this.setState(state => {
        return {
            ...state,
            defaultTimeStart : new Date(this.formatDate2(this.state.startDateAfter)),
            defaultTimeEnd : new Date(2020,10) ,
            // defaultTimeEnd :
            infoSearch: {
                ...state.infoSearch,
                // status: this.state.status,
                startDateAfter: this.state.startDateAfter,
                endDateBefore: this.state.endDateBefore
            },
            // employeeKpiSet: {_id: null},
        }
    })
    
    const { infoSearch } = this.state;
    // console.log("info====", this.state.startDate);
        var startDateAfter;
        var startdate_after=null;
        var endDateBefore;
        var enddate_before=null;
        if(infoSearch.startDateAfter === undefined) infoSearch.startDateAfter = null;
        if(infoSearch.endDateBefore === undefined) infoSearch.endDateBefore = null;
        if(infoSearch.startDateAfter !== null) {startDateAfter = infoSearch.startDateAfter.split("-");
        startdate_after = new Date(startDateAfter[1], startDateAfter[0], 0);}
        if (infoSearch.endDateBefore !== null){endDateBefore= infoSearch.endDateBefore.split("-");
        enddate_before = new Date(endDateBefore[1], endDateBefore[0], 28);}

        if (startdate_after && enddate_before && Date.parse(startdate_after) > Date.parse(enddate_before)) {
            Swal.fire({
                title: "Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } 
        else {
          // console.log("\n\n\n", infoSearch.startDateAfter);
          this.props.getResponsibleTaskByUser("[]", "1", "1000", "[]", "[]", "[]", null, infoSearch.startDate, infoSearch.endDate, infoSearch.startDateAfter, infoSearch.endDateBefore);
        }
}
  //  getDaysOfMonth(year, month) {

  //   return new Date(year, month + 1, 0).getDate();
    
  //   }
    
    
    getDurations(){
        const {tasks} = this.props;
        const {now} = this.state;
        const taskList = tasks && tasks.responsibleTasks;
        var durations=[];

        if(taskList) {
          for(let i = 1; i<= taskList.length; i++){
              var start_time = moment(new Date(taskList[i-1].startDate));
              var end_time = moment(new Date(taskList[i-1].endDate)) ;
       
            durations.push({
                id: parseInt(i),
                group: 1,
                title: `${taskList[i-1].name} - ${taskList[i-1].progress}%`,
                canMove: false,
                
                start_time: start_time,
                end_time: end_time,
                
                itemProps:{
                    style:{
                    color:"rgba(0, 0, 0, 0.8)",
                    borderStyle: "solid",
                    fontWeight:'600',
                    fontSize: 14,
                    borderWidth:1,
                    borderRadius: 3}}
                  }
            )
        }
    }
        return durations;
    }
    handleItemClick = async(itemId) => {
        
        await this.setState(state => {
            return {
                ...state,
                detailTask: itemId-1
            }
        })
        window.$(`#modal-detail-task`).modal('show')
      }
  animateScroll = invert => {
    var month = this.state.month;
    
    // let calc =  this.getDaysOfMonth(new Date().getFullYear(), month+1); 
    // let prev = this.getDaysOfMonth(new Date().getFullYear(),month ); 
    const width = (invert ? -1 : 1) * parseFloat(this.scrollRef.style.width); 
    const duration = 1200;
    // console.log('calc, prev', calc, prev);
    const startTime = performance.now();
    
    let lastWidth = 0;
    const animate = () => {
      let normalizedTime = (performance.now() - startTime) / duration;
      // console.log('perform', performance.now());
      if (normalizedTime > 1) {
        normalizedTime = 1;
      }

      const calculatedWidth = width * 0.5 * (1 + Math.cos(Math.PI * (normalizedTime - 1)));
      // console.log('width', calculatedWidth);
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
    
    // this.decreaseMonth(this.state.month);
  };

  onNextClick = () => {
    // this.increaseMonth(this.state.month);
   
    this.animateScroll(false);
  };
  handleStartDateChange = (value) => {
    this.setState(state => {
            return {
                ...state,
                startDateAfter: value,
            }
        });
    
  }
  handleEndDateChange = (value) => {
      this.setState(state => {
              return {
                  ...state,
                  endDateBefore: value,
              }
          });
      
  }
  //  increaseMonth = async(month) => {
  //      console.log('increase', month);
  //   await this.setState ( state => {
  //       return {
  //           ...state,
  //           month : (month + 1) % 13
  //       }
  //   })
    
  // }
  //  decreaseMonth = async(month) => {
  //   console.log('decrease', month);
  //   await this.setState ( state => {
  //       return {
  //           ...state,
  //           month : (month - 1)%13
  //       }
  //   })
    
  // }
  
  render() {
    const { defaultTimeStart, defaultTimeEnd, infoSearch } = this.state;
    const {startDateAfter, endDateBefore} = infoSearch;
    return (
        <React.Fragment>
      {/* <div className='box box-primary'> */}
        {/* <div className="box-header with-border">
          <div className="box-title">
          <h3 style={{textAlign:"center", margin:"0px"}}>Lịch công việc chi tiết</h3>
          </div>
        </div> */}
          <div className="box-body qlcv">
              
              <ModelDetailTask2 id={this.state.detailTask}/>
              {/* <ModalMemberApprove id={this.state.kpiId} /> */}
              <div className="flex-right">
                <div className="form-inline">
                  <div className="form-group">
                    <label>Từ tháng: </label>
                    <DatePicker id='start_date'
                            value = {startDateAfter}
                            onChange={this.handleStartDateChange}
                            dateFormat="month-year"
                            />
                  </div>
                  <div className="form-group">
                    <label>Đến tháng: </label>
                    <DatePicker
                            id='end_date'
                            value = {endDateBefore}
                            onChange={this.handleEndDateChange}
                            dateFormat="month-year"
                            />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-success" onClick={this.handleSearchTasks}>Tìm kiếm</button>
                  </div>

                </div>
                
              </div>
              {/* <div className="main"> */}
                <Timeline
                    scrollRef={el => (this.scrollRef = el)}
                    items={this.getDurations()}
                    groups={[{ id: 1, title: 'group' }]}
                    itemsSorted
                    itemTouchSendsClick={false}
                    stackItems
                    sidebarWidth = {0}
                    itemHeightRatio={0.8}
                    onItemClick = {this.handleItemClick}
                    canMove={false}
                    canResize={false}
                    defaultTimeStart={defaultTimeStart}
                    defaultTimeEnd={defaultTimeEnd}
                />
            {/* </div> */}
            <div className="form-inline pull-right" style={{marginTop:"5px"}}>
              <button className='btn btn-danger' onClick={this.onPrevClick}>{"< Prev"}</button>
              <button className='btn btn-danger' onClick={this.onNextClick}>{"Next >"}</button>
                
            </div>
            
        </div>
      {/* </div> */}
      </React.Fragment>
    )
  }
}

function mapState(state){
    const {tasks} = state;
    return {tasks}
}
const actions = {
  getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
}
const connectedSchedule = connect(mapState, actions) (TasksSchedule)
export {connectedSchedule as TasksSchedule}