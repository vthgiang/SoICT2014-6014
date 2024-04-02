import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { getStorage } from '../../../../config'
import { PaginateBar, SelectMulti, DataTableSetting, DialogModal } from '../../../../common-components'

import { TaskProcessActions } from '../../../task/task-process/redux/actions';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { TaskPertActions } from '../redux/actions';
import c3 from 'c3';
import 'c3/c3.css';
import { TaskDetail } from './taskDetail';
import { translate } from 'react-redux-multilingual/lib/utils';

function TaskList(props) {
    const TableId = "table-task-process-template";
    const defaultConfig = { limit: 5 }
    const Limit = getTableConfiguration(TableId, defaultConfig).limit;
    
   
    const [state, setState] = useState({
        currentRole: getStorage('currentRole'),
        currentUser: getStorage("userId"),
        currentRow: null,
        pageNumber: 1,
        noResultsPerPage: 1000,
        tableId: TableId,
        taskList:null
    })
    const { translate, processList,level,taskProcess} = props
    const { currentRow, tableId, taskList,taskSelected} = state
    useEffect(()=>{
        console.log('tasklist receive',processList)
        console.log('tasklist receive',level)
        console.log('list task process', taskProcess.listTaskProcess)
        let tasks =[]
        for(let process of processList){
            for(let task of process.tasks){
                task.processName = taskProcess.listTaskProcess.find(p=> p._id==process.process).processName
                task.processID = taskProcess.listTaskProcess.find(p=> p._id==process.process)._id
            }
            tasks = tasks.concat(process.tasks)
        }
        console.log('all',tasks)
    
        if(level =='high'){
            tasks = tasks.filter(t => t.prob>=0.89)
        }
        if(level == 'low'){
            tasks = tasks.filter(t => t.prob<0.5)
        }
        if(level =='medium'){
            tasks = tasks.filter(t=> t.prob>=0.5&&t.prob<0.89)
        }
        console.log(tasks)
        setState({
            ...state,
            taskList:tasks
        })

       
    },[level])
    useEffect(()=>{
        window.$(`#modal-detail-task-view-from-task-list`).modal("show");
    },[taskSelected])
    const viewTaskDetail =async (e,item) =>{
        setState({
            ...state,
            taskSelected:item
        })
        console.log(item)
        
        
    }
  
    return (
        <React.Fragment>
              <DialogModal
                size='75' modalID={`modal-show-task-list-with-level`} isLoading={false}
                formID="modal-view-process-task-list"
                // disableSubmit={!isTaskFormValidated()}
                title={translate("process_analysis.task_list_modal.title")}
                hasSaveButton={false}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            >
                
                 {props.taskPert.processListData.length!=0&&props.riskDistribution&&taskSelected!=null&&
                    <TaskDetail 
                    action={"view-from-task-list"} 
                    taskData={taskProcess.listTaskProcess.find(p=> p._id.toString()==taskSelected.processID.toString()).tasks.find(t=> t.codeInProcess == taskSelected.taskID)} 
                    isProcess={true}
                    idProcess = {taskSelected.processID} 
                    riskDistribution = {props.riskDistribution.bayesData.riskInfo}
                    taskPertBayes={taskSelected} />
                }
                <div className="box">
            <div className="box-body qlcv">
                
                <table className="table table-bordered table-striped table-hover" id={tableId}>
                    <thead>
                        <tr>
                            <th style={{ width: "70px" }}>{translate("process_analysis.task_list_modal.index")}</th>
                            <th title={translate("task.task_process.process_name")}>{translate("process_analysis.task_list_modal.task_name")}</th>
                            <th title={translate("task.task_process.process_name")}>{translate("process_analysis.task_list_modal.process_name")}</th>
                            
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                        </tr>
                    </thead>
                    <tbody className="task-table">
                        {
                            (taskList && taskList.length !== 0) ? taskList.map((item, key) => {
                                return <tr key={key} >
                                    <td>{key + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.processName}</td>
                                    
                                    <td>
                                        <a onClick= {(e)=>viewTaskDetail(e,item)} title={translate('task.task_template.view_detail_of_this_task_template')}>
                                            <span>{translate("process_analysis.task_list_modal.view_detail")}</span>
                                        </a>
                                    </td>

                                </tr>
                            }) : null
                        }
                    </tbody>
                </table>
                {(taskList && taskList.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
              
            </div>
        </div>
            </DialogModal>
        </React.Fragment>
      
        
    );
}



function mapState(state) {
    const {  taskProcess,taskPert,riskDistribution} = state;
    return {  taskProcess,taskPert,riskDistribution};
}

const actionCreators = {
    getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
    deleteXmlDiagram: TaskProcessActions.deleteXmlDiagram,
    deleteTaskProcess: TaskProcessActions.deleteTaskProcess,
    updateTask: TaskPertActions.updateTask
};
const connectedTaskList = connect(mapState, actionCreators)(withTranslate(TaskList));
export { connectedTaskList as TaskList };