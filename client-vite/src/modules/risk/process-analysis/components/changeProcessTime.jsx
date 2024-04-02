import React, { useState, useEffect } from "react"
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DialogModal, Loading } from "../../../../common-components";
import { TaskPertActions } from './../redux/actions';
import { roundProb } from './../TaskPertHelper';
const ChangeProcessTime = (props) => {
    const { processData, taskPert, taskProcess, translate, changeTime } = props
    const [state, setState] = useState({
        taskDistribution: undefined,
        listTaskProcess: undefined,
        tasks: undefined,
        newValues: undefined,
        taskDisID: undefined,
        processID: undefined,
        totalData: undefined,
        criticalPath: undefined
    })
    useEffect(() => {
        console.log(processData, taskPert, taskProcess)
        let taskDis = taskPert.processListData.find(p => p.process.toString() == processData._id.toString())
        let totalData = taskDis.totalData
        console.log(totalData)
        // let criticalPath = processData.tasks.filter(task => totalData.criticalPath.includes(task.codeInProcess)).map(t=>t.name)
        // console.log(criticalPath)
        let taskProcessMap = new Map(processData.tasks.map(task => [task.codeInProcess, task]))
        for (let task of taskDis.tasks) {
            let data = taskProcessMap.get(task.taskID)
            taskDis.startDate = data.startDate
            task.responsibleEmployees = data.responsibleEmployees
            task.newValue = -1
            task.change = false
        }
        console.log(taskDis)
        setState({
            ...state,
            listTaskProcess: taskDis,
            // taskDistribution: taskDis,
            taskDisID: taskDis.taskDisId,
            processID: processData._id,
            totalData: totalData,
            criticalPath: totalData.criticalPath

        })
    }, [processData])
    const handleChange = (event, taskID) => {
        let task = listTaskProcess.tasks.find(task => task.taskID == taskID)

        if (task) {
            task.change = !task.change
        }
        let tasksTemp = listTaskProcess.tasks.map(t => t.taskID == taskID ? task : t)
        let process = listTaskProcess
        process.tasks = tasksTemp

        setState({
            ...state,
            listTaskProcess: process
        })
    }
    const isFormValidated = () => {
        return state.processID && state.taskDisID
    }
    const save = () => {
        if (isFormValidated()) {
            for (let task of listTaskProcess.tasks) {
                if (task.change == true) {
                    task.duration = task.newValue
                }
            }
            let tasks = listTaskProcess.tasks.map(task => {
                return { taskID: task.taskID, duration: task.duration }
            })
            // console.log(tasks)
            let data = {
                taskProcessId: state.processID,
                taskDistributionId: state.taskDisID,
                tasks: tasks
            }
            let initTasks = listTaskProcess.tasks.map(task => {
                task.change = false
                return task
            })
            let tmp = listTaskProcess
            tmp.tasks = initTasks
            console.log(data)
            changeTime(data)
            setState({
                ...state,
                listTaskProcess: tmp
            })
        }

    }
    const handleNewValue = (e, taskID) => {
        let val = e.target.value
        val = parseFloat(val)
        let task = listTaskProcess.tasks.find(t => t.taskID == taskID)
        if (task) {
            task.newValue = val
        }
        console.log(task)
    }
    const isOnCritical = (taskID) => {
        return criticalPath.includes(taskID)
    }
    const { listTaskProcess, tasks, criticalPath, totalData } = state
    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={`modal-change-process-time-${processData._id}`} isLoading={false}
                formID="modal-change-process-time"
                disableSubmit={!isFormValidated()}
                title={translate('process_analysis.change_time.title')}
                hasSaveButton={true}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
                func={save}

            >
                <div className="box">
                    <div className="box-body qlcv">
                        <div style={{ textAlign: 'center' }} className="box">
                            <div className="box-body">
                                <h2><strong>{processData && processData.processName.toUpperCase()}</strong></h2>
                                <h3><strong>#{processData && processData._id.toUpperCase()}</strong></h3>
                                {totalData && 
                                    <h4 htmlFor="">{translate('process_analysis.change_time.total_duration')}:{totalData.totalDuration} {translate("process_analysis.change_time.day")}</h4>
                              }
                                {totalData&&<div className="progress-task" style={{textAlign:'center',marginLeft:'40%'}}>
                                    <div className="fillmult" data-width={`${roundProb(totalData.totalProb)}%`} style={{ width: `${roundProb(totalData.totalProb)}%`, backgroundColor: '#3c8dbc' }}></div>
                                    <span className="perc"> {roundProb(totalData.totalProb)}%</span>
                                </div>}
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <p>(<span className="text-red">*</span>){translate('process_analysis.change_time.warning')}</p>
                            </div>

                        </div>

                        <table className="table table-bordered table-striped table-hover" id={"modal-change-process-time"}>
                            <thead>
                                <tr>
                                    <th style={{ width: "70px" }}>{translate('process_analysis.process_list.index')}</th>

                                    <th title={translate("process_analysis.change_time.name")}>{translate("process_analysis.change_time.name")}</th>
                                    <th title={translate("process_analysis.change_time.responsible_employees")}>{translate("process_analysis.change_time.responsible_employees")}</th>
                                    <th title={translate("process_analysis.change_time.duration")}>{translate("process_analysis.change_time.duration")}</th>
                                    <th title={translate("process_analysis.change_time.action")}>{translate("process_analysis.change_time.action")}</th>

                                </tr>
                            </thead>
                            <tbody className="task-table">
                                {
                                    (totalData && listTaskProcess && listTaskProcess.length !== 0) ? listTaskProcess.tasks.map((item, key) => {
                                        return <tr key={key} >
                                            <td>{key + 1}</td>
                                            <td className={isOnCritical(item.taskID) ? `table-row` : ``}>{item.name}</td>
                                            <td>{item.responsibleEmployees.map(u => u.name).join(',')}</td>
                                            {item.change ? <td><input type="number" name={item.taskID} style={{ width: '50px' }} defaultValue={item.duration} onChange={(e) => handleNewValue(e, item.taskID)} />{translate("process_analysis.change_time.day")}</td> : <td>{item.duration} {translate("process_analysis.change_time.day")}</td>}
                                            <td><button onClick={(e) => handleChange(e, item.taskID)}>{item.change ? translate('process_analysis.change_time.reset') : translate('process_analysis.change_time.change')}</button></td>
                                            {/* <td>{item.change?:null}</td> */}
                                        </tr>
                                    }) : null
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

            </DialogModal>
        </React.Fragment>
    )
}
const mapState = (state) => {
    let { taskProcess, taskPert } = state
    return { taskProcess, taskPert }
}
const mapAction = {
    changeTime: TaskPertActions.changeTime
}
const connectedChangeProcessTime = connect(mapState, mapAction)(withTranslate(ChangeProcessTime));
export { connectedChangeProcessTime as ChangeProcessTime };