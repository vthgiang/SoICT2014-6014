import React, {Component} from 'react'
import {connect} from 'react-redux'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'

import Timeline from "react-calendar-timeline";
import {DatePicker} from '../../../../../common-components/index'
import { taskManagementActions } from '../../../task-management/redux/actions';
import {ModelDetailTask2} from './detailTask'
import './style.css'
class Schedule extends Component{
    constructor(props){
        super(props);
   
    const defaultTimeStart = moment()
      .startOf("month")
      .toDate();
    const defaultTimeEnd = moment()
      .startOf("month")
      .add(1, "month")
      .toDate();
    const now = moment();
    this.state = {
      defaultTimeStart,
      defaultTimeEnd,
      startDate: null, 
      endDate: null,
      month: (new Date()).getMonth()
    };
  }
   getDaysOfMonth(year, month) {

    return new Date(year, month + 1, 0).getDate();
    
    }
    
    
    getDurations(){
        const {tasks} = this.props;
        const {now} = this.state;
        const taskList = tasks && tasks.responsibleTasks;
        var durations=[];

        if(taskList) {
          for(var i = 1; i<= taskList.length; i++){
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
    
    let calc =  this.getDaysOfMonth(new Date().getFullYear(), month+1); 
    let prev = this.getDaysOfMonth(new Date().getFullYear(),month ); 
    const width = (invert ? -1 : 1) * parseFloat(this.scrollRef.style.width); 
    const duration = 1200;
    console.log('calc, prev', calc, prev);
    const startTime = performance.now();
    
    let lastWidth = 0;
    const animate = () => {
      let normalizedTime = (performance.now() - startTime) / duration;
      console.log('perform', performance.now());
      if (normalizedTime > 1) {
        normalizedTime = 1;
      }

      const calculatedWidth = width * 0.5 * (1 + Math.cos(Math.PI * (normalizedTime - 1)));
      console.log('width', calculatedWidth);
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
                startDate: value,
            }
        });
    
  }
  handleEndDateChange = (value) => {
      this.setState(state => {
              return {
                  ...state,
                  endDate: value,
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
  handleSelectItem(itemId, e){
    console.log('itemID, e', itemId, e);
  }
  render() {
    const { defaultTimeStart, defaultTimeEnd, startDate, endDate } = this.state;

    return (
        <React.Fragment>
      <div className='box box-primary'>
        <div className="box-header with-border">
          <div className="box-title">
          <h3 style={{textAlign:"center", margin:"0px"}}>Lịch công việc chi tiết</h3>
          </div>
        </div>
          <div className="box-body qlcv">
              
              <ModelDetailTask2 id={this.state.detailTask}/>
              {/* <ModalMemberApprove id={this.state.kpiId} /> */}
              <div className="flex-right">
                <div className="form-inline">
                  <div className="form-group">
                    <label>Từ tháng: </label>
                    <DatePicker id='start_date'
                            value = {startDate}
                            onChange={this.handleStartDateChange}
                            dateFormat="month-year"
                            />
                  </div>
                  <div className="form-group">
                    <label>Đến tháng: </label>
                    <DatePicker
                            id='end_date'
                            value = {endDate}
                            onChange={this.handleEndDateChange}
                            dateFormat="month-year"
                            />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-success">Tìm kiếm</button>
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
                    onItemSelect={this.handleSelectItem}
                    defaultTimeStart={defaultTimeStart}
                    defaultTimeEnd={defaultTimeEnd}
                />
            {/* </div> */}
            <div className="form-inline pull-right" style={{marginTop:"5px"}}>
              <button className='btn btn-danger' onClick={this.onPrevClick}>{"< Prev"}</button>
              <button className='btn btn-danger' onClick={this.onNextClick}>{"Next >"}</button>
                
            </div>
            
        </div>
      </div>
      </React.Fragment>
    )
  }
}

function mapState(state){
    const {tasks} = state;
    return {tasks}
}
const actions = {
}
const connectedSchedule = connect(mapState, actions) (Schedule)
export {connectedSchedule as Schedule}