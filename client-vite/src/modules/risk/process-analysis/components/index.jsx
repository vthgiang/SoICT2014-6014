import React, { useEffect, useState } from 'react';
import { TaskPertActions } from '../redux/actions'
import { RiskDistributionActions } from '../../risk-dash-board/redux/actions'
import { TaskProcessActions } from '../../../task/task-process/redux/actions';
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { SelectProcess } from './processSelect';
import { TaskProcessManagement } from './processList'
import {TaskWidgetGroup }from './taskWidgetGroup';
import './dashboard.css'
import { ModalViewProcess } from './modalViewProcess';
import CircularProgress from '@material-ui/core/CircularProgress';
import {RequestChangeTaskProcessTable} from '../../change-process-request/components'
import { Loading } from '../../../../common-components';
function TaskPert(props) {


    const { taskPert, translate, taskProcess, department,notifications } = props


    const [state, setState] = useState({
        currentRow: undefined,
        result: null,
        processData: []
    })
    const { currentRow, result, processData } = state
    const [process, setProcess] = useState(null)
    const removePrevStatisticChart = () => {
        const chart = document.getElementById('task-chart');
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }
    if (process == null && document.getElementById('task-chart') != null) {
        removePrevStatisticChart()
    }
    let listOrganizationalUnit = department?.list
    useEffect(() => {
        if (notifications.associatedData?.length != 0) {
            // console.log('new NOti', notifications.associatedData)
            if (notifications.associatedData.dataType == "realtime_close_task_process"||notifications.associatedData.dataType == "change_request") {

                props.updateProb()
                props.getAllTaskProcess(state.pageNumber, state.noResultsPerPage, "");
            }
        }
    }, [notifications.associatedData])
    // useEffect(() => {
    //     props.updateProb()
    //     props.getAllTaskProcess(state.pageNumber, state.noResultsPerPage, "");
    // }, [props.taskPert.closeProcess])
    useEffect(() => {
        props.updateProb()
        props.getAllTaskProcess()

    }, [])
    useEffect(() => {
        if(props.taskPert.changeTime&&props.taskPert.changeTime.length!=0){
            props.updateProb()
            props.getAllTaskProcess()
        }
       

    }, [props.taskPert.changeTime])
    //set processList
    useEffect(() => {

        if (taskProcess.listTaskProcess && taskProcess.listTaskProcess.length != 0) {
            console.log('length of process update taskPert', taskProcess.listTaskProcess.length)
            props.updateProcessList({ processList: taskProcess.listTaskProcess.map(tp => tp._id) })
        }
    }, [taskProcess.listTaskProcess, taskProcess.isLoading, props.taskPert.closeProcess])
    // Dữ liệu trả về
    useEffect(() => {
        if (taskPert.processListData.length != 0) {
            setProcessTable(<TaskProcessManagement></TaskProcessManagement>)
            setState({
                ...state,
                processData: taskPert.processListData
            })
        }
    }, [taskPert.processListData])
    const [widget, setWidget] = useState(<TaskWidgetGroup processData={processData} ></TaskWidgetGroup>)
    useEffect(() => {
        if (processData.length != 0) {
            console.log('loading change', processData)
            setWidget(<TaskWidgetGroup processData={processData}></TaskWidgetGroup>)
        }

    }, [processData])
    const [processTable, setProcessTable] = useState(<div className="row" style={{ textAlign: 'center' }}><CircularProgress /></div>)
    return (
        <React.Fragment>
            {processData.length != 0 && <TaskWidgetGroup processData={processData}></TaskWidgetGroup>}
            <div style={{ display: processData.length != 0 ? 'none' : 'block' }}>
                <Loading />
                <div style={{ paddingLeft: 20 }}>{translate('process_analysis.index.loading_data')}</div>
            </div>
            <br></br>
            {
                currentRow &&
                <ModalViewProcess
                    title={translate("task.task_process.view_task_process_modal")}
                    listOrganizationalUnit={listOrganizationalUnit}
                    data={currentRow}
                    idProcess={currentRow._id}
                    xmlDiagram={currentRow.xmlDiagram}
                    processName={currentRow.processName}
                    processDescription={currentRow.processDescription}
                    infoTask={currentRow.taskList}
                    creator={currentRow.creator}
                />
            }
            <div className="nav-tabs-custom">
                {/* Nav-tabs */}
                <ul className="nav nav-tabs">
                    <li className="active"><a title={`Phân tích quy trình`} data-toggle="tab" href={`#analysis`}>{translate('process_analysis.index.calculate_successfully')}</a></li>
                    <li><a title={`Quản lý yêu cầu thay đổi quy trình`} data-toggle="tab" href={`#request_change`}>{translate('process_analysis.index.change_process_request')}</a></li>


                </ul>
            </div>

            <div className="tab-content">
                <div id="analysis" className="tab-pane active" >
                    <div className="box" style={{ minHeight: "450px" }}>
                        <div className="box-body">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title col-md-12">{translate('process_analysis.index.calculate_successfully')}</div>
                                    </div>

                                    <div className="box-body">
                                        <div style={{ display: processData.length != 0 ? 'none' : 'block' }}>
                                            <Loading />
                                            <div style={{ paddingLeft: 20 }}>{translate('process_analysis.index.loading_data')}</div>
                                        </div>
                                        {taskPert.processListData.length != 0 && <TaskProcessManagement></TaskProcessManagement>}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="request_change" className="tab-pane" >
                    <div className="box">
                        <div className="box-body">
                            <RequestChangeTaskProcessTable />
                        </div>
                    </div>
                </div>

            </div>



        </React.Fragment>

    );
}
function mapState(state) {
    const { user, auth, taskProcess, role, department, taskPert, riskDistribution, notifications } = state;
    return { user, auth, taskProcess, role, department, taskPert, riskDistribution, notifications };
}
// function mapState(state) {
//     const taskPert = state.taskPert;
//     const taskProcess = state.taskProcess
//     // console.log(risk)
//     return { taskPert, taskProcess }
// }

const actions = {
    countTask: TaskPertActions.countTask,
    updateTask: TaskPertActions.updateTask,
    updateProcessList: TaskPertActions.updateProcessList,
    updateProb: RiskDistributionActions.updateProb,
    getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
    deleteXmlDiagram: TaskProcessActions.deleteXmlDiagram,
    deleteTaskProcess: TaskProcessActions.deleteTaskProcess,
    getAllTaskProcess: TaskProcessActions.getAllTaskProcess
}
const connectedTaskPert = connect(mapState, actions)(withTranslate(TaskPert));
export { connectedTaskPert as TaskPert };