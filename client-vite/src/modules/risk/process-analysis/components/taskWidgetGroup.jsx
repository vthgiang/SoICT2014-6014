import React, { Component, useEffect, useState } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';


import { getRankProb } from '../TaskPertHelper'
import { TaskList } from './taskListModal';
// import { translate } from 'react-redux-multilingual/lib/utils';
const TaskWidgetGroup = (props) => {
    const { processData ,translate} = props
    const [state, setState] = useState({
        high: -1,
        low: -1,
        medium: -1,
        level:null,
        flag:false
    })
    const { high, low, medium,level ,flag} = state
    useEffect(() => {
        let tasks = []
        for (let process of processData) {
            tasks = tasks.concat(process.tasks)
        }
        console.log('tasks widget', processData)
        setState({
            ...state,
            low: tasks.filter(t => getRankProb(t.prob) == 1).length,
            medium: tasks.filter(t => getRankProb(t.prob) == 2).length,
            high: tasks.filter(t => getRankProb(t.prob) == 3).length,
        })
    }, [processData])
    useEffect(()=>{
        if(level!=null){
            window.$(`#modal-show-task-list-with-level`).modal("show");
        }
    },[flag])
    const showTaskList= async(event,level) =>{
        setState({
            ...state,
            level:level,
            flag:!flag
        })
       
       
    }
    return (
        <React.Fragment>
            {processData&&processData.length!=0&&level!=null&&<TaskList
             processList ={processData}
             level = {level}
             />}
            <div className="box widget-box" style={{ minHeight: "100px" }}>
                {processData.length != 0 ?
                    <div className="row">
                        <div className="col-md-4 col-sm-6 col-12">
                            <div className="info-box bg-green" >
                                <span className="info-box-icon"><i className="fa fa-bookmark"></i></span>

                                <div className="info-box-content">
                                    <span className="info-box-text">{translate("process_analysis.task_widget_group.high_probability")}</span>
                                    <span className="info-box-number">{high} {translate("process_analysis.task_widget_group.task")}</span>

                                    <div className="progress">
                                        <div className="progress-bar" style={{ width: '100%' }}></div>
                                    </div>
                                    <span className="progress-description">
                                        <a onClick={(e)=>showTaskList(e,'high')} className="small-box-footer" style={{ color: 'white' }}>
                                            More info <i class="fa fa-arrow-circle-right"></i>
                                        </a>
                                    </span>
                                </div>

                            </div>
                            {/* <!-- /.info-box --> */}
                        </div>
                        {/* <!-- /.col --> */}
                        <div className="col-md-4 col-sm-6 col-12">
                            <div className="info-box bg-yellow">
                                <span className="info-box-icon"><i className="fa fa-bookmark"></i></span>

                                <div className="info-box-content">
                                    <span className="info-box-text">{translate("process_analysis.task_widget_group.medium_probability")}</span>
                                    <span className="info-box-number">{medium} {translate("process_analysis.task_widget_group.task")}</span>

                                    <div className="progress">
                                        <div className="progress-bar" style={{ width: '100%' }}></div>
                                    </div>
                                    <span className="progress-description">
                                        <a onClick={(e)=>showTaskList(e,'medium')}  class="small-box-footer" style={{ color: 'white' }}>
                                            More info <i class="fa fa-arrow-circle-right"></i>
                                        </a>
                                    </span>
                                </div>
                                {/* <!-- /.info-box-content --> */}
                            </div>
                            {/* <!-- /.info-box --> */}
                        </div>
                        {/* <!-- /.col --> */}
                        <div className="col-md-4 col-sm-6 col-12">
                            <div className="info-box bg-red">
                                <span className="info-box-icon"><i className="fa fa-bookmark"></i></span>

                                <div className="info-box-content">
                                    <span className="info-box-text">{translate("process_analysis.task_widget_group.low_probability")}</span>
                                    <span className="info-box-number">{low} {translate("process_analysis.task_widget_group.task")}</span>

                                    <div className="progress">
                                        <div className="progress-bar" style={{ width: '100%' }}></div>
                                    </div>
                                    <span className="progress-description">
                                        <a onClick={(e)=>showTaskList(e,'low')} class="small-box-footer" style={{ display:'block',color: 'white' }}>
                                            More info <i class="fa fa-arrow-circle-right"></i>
                                        </a>
                                    </span>
                                </div>
                                {/* <!-- /.info-box-content --> */}
                            </div>
                            {/* <!-- /.info-box --> */}
                        </div>
                    </div> : <div className="row" style={{ textAlign: 'center' }}>
                        <CircularProgress></CircularProgress>
                    </div>}
            </div>

        </React.Fragment>

    );
}
const connectedTaskWidgetGroup = connect(null, null)(withTranslate(TaskWidgetGroup));
export { connectedTaskWidgetGroup as TaskWidgetGroup };

export default TaskWidgetGroup