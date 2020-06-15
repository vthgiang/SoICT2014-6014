import React, { Component } from 'react'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import { connect } from 'react-redux';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import {ModelDetailTask2} from './detailTask'
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
class Schedule extends Component {
  constructor(props) {
      super(props);
      this.state = {
        showdetail : false
      }
  }
  handleClick= async(e) => {
    // console.log('==========CLICKED!==========');
    // console.log(e.event.id);
    
    // id.preventDefault();
      this.setState(state => {
          return {
              ...state,
              detailTask: e.event.id
          }
      })
      window.$(`#modal-detail-task`).modal('show')
  }
  
 
  showEvents(){
    const tasks = this.props.tasks.responsibleTasks;
    var schedule=[];
      tasks && tasks.map((item)=>{
        schedule.push ({
          id: item._id,
          title: item.name,
          start: item.startDate,
          end : item.endDate
        })
      
      })
      // console.log(schedule);
      return schedule;

  }
  
  render() {
    const tasks = this.props.tasks;
    var taskList =[];
    var id;
    taskList =  tasks && tasks.responsibleTasks;
    // if(taskList) id = taskList[0]._id;
    // console.log('======='+ id);
    return (
      <React.Fragment>
      {<ModelDetailTask2 id={this.state.detailTask}/>}
      <FullCalendar 
        defaultView="dayGridMonth" 
        plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
        // header={
        //   {left:'title',
        //   center:'dayGridMonth, timeGridWeek, timeGridDay',
        //   right:'prev today next'}
        // }
        editable={true}
        eventClick= {(e)=>this.handleClick(e)}
        events={this.showEvents()}
      />
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