import React, {Component} from 'react'
import {connect} from 'react-redux'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'

import Timeline from "react-calendar-timeline";
import { taskManagementActions } from '../../../task-management/redux/actions';
import {ModelDetailTask2} from './detailTask'

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
    //   currentMonth: (new Date()).getMonth(),
      month: (new Date()).getMonth()
    };
    // console.log(this.state.month);
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
        //     //   console.log(moment(new Date(taskList[i-1].startDate)));
            //   var end_time = moment(parseInt((new Date(taskList[i-1].endDate).getTime())));
              var end_time = moment(new Date(taskList[i-1].endDate)) ;
        //     // console.log( start_time);
        //     // console.log(moment().add(-start_time,'millisecond'));
       
            durations.push({
                id: parseInt(i),
                group: 1,
                title: `${taskList[i-1].name} - ${taskList[i-1].progress}%`,
                canMove: false,
                
                start_time: start_time,
                end_time: end_time,
                
                itemProps:{
                    style:{
                    backgroundColor: "dodgeblue",
                    // selectedBgColor: "black",
                    borderStyle: "solid",
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
    console.log('calc', calc);
    const startTime = performance.now();
    
    let lastWidth = 0;
    const animate = () => {
      let normalizedTime = (performance.now() - startTime) / duration;
      if (normalizedTime > 1) {
        
        normalizedTime = 1;
      }

      const calculatedWidth = width * 0.5 * (1 + Math.cos(Math.PI * (normalizedTime - 1)))*prev/calc*15/14;
      console.log('width', calculatedWidth);
      this.scrollRef.scrollLeft += calculatedWidth - lastWidth;
    //   this.scrollRef.scrollLeft += width - lastWidth;
      lastWidth = calculatedWidth;
    //   lastWidth = width;
    //   console.log('startTime, width ,normalizedTime, calculatedWidth\n\n\n',this.scrollRef.style, startTime, width ,normalizedTime, calculatedWidth);
      if (normalizedTime < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  onPrevClick = () => {
    this.animateScroll(true);
    
    this.decreaseMonth(this.state.month);
  };

  onNextClick = () => {
    this.increaseMonth(this.state.month);
   
    this.animateScroll(false);
  };
   increaseMonth = async(month) => {
       console.log('increase', month);
    await this.setState ( state => {
        return {
            ...state,
            month : (month + 1) % 13
        }
    })
    
  }
   decreaseMonth = async(month) => {
    console.log('decrease', month);
    await this.setState ( state => {
        return {
            ...state,
            month : (month - 1)%13
        }
    })
    
  }
  render() {
    const { defaultTimeStart, defaultTimeEnd } = this.state;

    return (
        <React.Fragment>
      <div className='box'>
          <div className="box-body qlcv">
              <h4>Lịch công việc chi tiết</h4>
              <ModelDetailTask2 id={this.state.detailTask}/>
              {/* <ModalMemberApprove id={this.state.kpiId} /> */}
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
            <div className="form-inline">
              
                <button className='btn-google pull-right' onClick={this.onNextClick}>{"Next >"}</button>
                <button className='btn-google pull-right' onClick={this.onPrevClick}>{"< Prev"}</button>
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