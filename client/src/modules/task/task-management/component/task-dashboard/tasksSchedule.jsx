import React, {Component} from 'react'
import {connect} from 'react-redux'
import Timeline from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import {ModelDetailTask2} from './detailTask'

class Schedule extends Component{
    constructor(props){
        super(props);
        // let schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Week);
    }
    
     getTasksName(){
        const {tasks} = this.props;
        const taskList = tasks && tasks.responsibleTasks;
        var tasksName = [];
        // console.log(tasks);
        if(taskList) for(let i = 1; i<= taskList.length; i++){
            tasksName.push({ id: i, title: taskList[i-1].name })
        }
    //    console.log(tasksName);
        // const group = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }, { id: 3, title: 'group 3' }, { id: 4, title: 'group 4' }]
        return tasksName;
    }

    getDurations(){
        const {tasks} = this.props;
        const taskList = tasks && tasks.responsibleTasks;
        var durations=[];
        
          
        if(taskList) {
          for(let i = 1; i<= taskList.length; i++){
              let start_time = moment(parseInt((new Date(taskList[i-1].startDate).getTime())));
              let end_time = moment(parseInt((new Date(taskList[i-1].endDate).getTime())));
            
            durations.push({ 
                id: i,
                group: i,
                title: `${taskList[i-1].name} - ${taskList[i-1].progress}%`,
                canMove: false,
                selectedBgColor: 'rgb(0, 0, 244)',
                start_time: start_time,
                end_time: end_time
            })
        }}
        console.log(durations);
        
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
    render(){
        const timeDefault = Date.now();
        return(
            <div className ="box">
                <div className="box-body qlcv">
                <h4>Lịch thực hiện công việc</h4>
                <Timeline
                groups={this.getTasksName()}
                items={this.getDurations()}
                itemTouchSendsClick = {false}
                traditionalZoom = {true}
                onItemClick={this.handleItemClick}
                // visibleTimeStart={moment(timeDefault).add(-1, 'year')}
                // visibleTimeEnd={moment(timeDefault).add(1, 'year')}
                sidebarWidth = {0}
                defaultTimeStart={moment(timeDefault).add(-15, 'day')}
                defaultTimeEnd={moment(timeDefault).add(15, 'day')}
                />
                
                {<ModelDetailTask2 id={this.state && this.state.detailTask}/>}
            </div>
            </div>
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