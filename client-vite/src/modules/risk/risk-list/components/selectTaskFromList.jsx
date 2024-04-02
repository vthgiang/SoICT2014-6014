import React, { useState, useEffect } from 'react';
import { connect} from 'react-redux';

import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import {ModalDetailTask} from "../../../task/task-dashboard/task-personal-dashboard/modalDetailTask"
import dayjs from 'dayjs'
import {TaskDetail} from './taskDetail'
const SelectTaskFromList = (props) =>{
    const { lists, translate ,setStateParent,stateParent,checkedItems} = props;
    // Khởi tạo state
    const [state, setState] = useState({
        riskName: "",
        task:null,
        page: 1,
        riskEdit: null,
        riskId: null,
        perPage: 10,
        tableId: 'select-task',
        currentRow: null,
        curentRowDetail: null,
        showModal: false,
        taskSelected:null,
        taskSelectedList:checkedItems?checkedItems:[],
        checkedList :checkedItems?checkedItems:[],
        flag:false

    })

    const {
        riskName,
        task,
        page,
        perPage,
        riskEdit,
        riskId,
        tableId,
        currentRow,
        curentRowDetail,
        showModal,
        taskSelected,
        taskSelectedList,
        checkedList,
        flag
    } = state;
  
    useEffect(()=>{
        if(curentRowDetail!=null){
            window.$(`#modal-detail-task-select-1`).modal('show')
        }
    },[curentRowDetail])
    const handleShowDetailInfo = (task) =>{
        console.log(task)
        setState({
            ...state,
            curentRowDetail: task,
        });
        // window.$(`#modal-detail-task-select-1`).modal('show')
        
    }
    useEffect(()=>{
        if(taskSelected){
            console.log('task Selected',taskSelected)
            // setState
            let selectedList = []
            selectedList = taskSelectedList.concat(taskSelected)
            console.log(taskSelectedList)
            setState({
                ...state,
                taskSelectedList:selectedList
            })
        }
    },[flag])
    useEffect(()=>{
        if(taskSelectedList){
            console.log('set taskList parent',taskSelectedList)
            if(checkedList)
            console.log('checkedList length',checkedList.length)
            setStateParent({
                ...stateParent,
                taskRelateList:taskSelectedList
            })
        }
    },[taskSelectedList])
    const handleSelectTask = async(event,task) =>{
        console.log(event.target.checked)
        let isChecked = event.target.checked
        if(isChecked == true){
            console.log('checked')
            setState({
                ...state,
                taskSelected:task,
                flag:!flag
            })
          
        }else{
            let selectedList = [].concat(taskSelectedList)
            console.log('id',task._id)
            console.log('selectedList',selectedList)
            let indexDelete =-1
            selectedList = selectedList.filter(s => s._id!=task._id)
            console.log('delete after',selectedList)
            if(checkedList){
                console.log('setCheckedList',checkedList)
                setState({
                    ...state,
                    checkedList:selectedList
                })
            }
            
            // selectedList = taskSelectedList.concat(taskSelected)
            // console.log(taskSelectedList)
            await setState({
                ...state,
                taskSelectedList:selectedList
            })
        }
        console.log(task)
        
    }
    return(
        <React.Fragment>
            {curentRowDetail&&<TaskDetail task = {curentRowDetail&&curentRowDetail} isProcess = {true}></TaskDetail>}
            {/* <ModalDetailTask task = {curentRowDetail&&curentRowDetail} action={'select-1'} isProcess= {true}></ModalDetailTask> */}
            <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 70 }}>{translate('manage_risk.index')}</th>
                            <th>{translate('task.task_management.col_name')}</th>
                            <th>{translate('task.task_management.col_priority')}</th>
                            <th>{translate('manage_risk.create_risk_form.process')}</th>
                            <th>{translate('task.task_management.col_status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(lists && lists.length !== 0) &&
                            lists.map((task, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (page - 1) * perPage}</td>
                                    <td>{task.name}</td>
                                    <td>{task.priority}</td>
                                    <td>{task.process.processName}</td>
                                    <td>{task.status}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_risk.detail_info_risk')} onClick={() => handleShowDetailInfo(task)}><i className="material-icons">visibility</i></a> 
                                        <input checked = {checkedItems&&stateParent.taskRelateList && stateParent.taskRelateList.map(tr=>tr._id).includes(task._id)} class="form-check-input" type="checkbox" onChange={(e) => handleSelectTask(e,task)}></input>
               
                                       
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

        </React.Fragment>

    );
}
function mapState(state) {
    const risk = state.risk;
    // console.log('map state')
    // console.log(risk)
    return { risk }
}

const actions = {
    
}

const connectedRiskManagementTable = connect(mapState, actions)(withTranslate(SelectTaskFromList));
export { connectedRiskManagementTable as SelectTaskFromList };