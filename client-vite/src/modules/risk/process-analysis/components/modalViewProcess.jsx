import React, { Component, useEffect, useState } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DialogModal, Loading } from "../../../../common-components";
import { ViewProcess } from "./viewProcess";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { performTaskAction } from "../../../task/task-perform/redux/actions"
import { roundProb } from '../TaskPertHelper'
import C3Chart from "react-c3js";
import c3 from 'c3';
import 'c3/c3.css';
import { translate } from 'react-redux-multilingual/lib/utils';

function ModalViewProcess(props) {
    const { translate, role, use, taskPert } = props;
    const { data, listOrganizationalUnit, idProcess, xmlDiagram, processName, processDescription, infoTask, creator } = props;
    const [state, setState] = useState({
        chartData: null
    })
    const [ratioChart, setRatioChart] = useState({
        data: null,
    })
    useEffect(() => {
        let rs = setProbChartData();
        let dataChart = rs.dataChart
        let taskNameList = rs.taskNameList
        console.log('title', taskNameList)
        setState({
            ...state,
            chartData: {
                x: 'x',
                columns: dataChart,
                type:'bar'
            },
            axis: {                                // Config trục tọa độ
                x: {
                    type: 'category',
                    tick: {
                        rotate: -75,
                        multiline: false,

                    },
                    label: {
                        text: 'Công việc',
                        position: 'center'
                    },
                    height: 75,

                },
                y: {
                    max: 100,
                    min: 10,
                    label: {
                        text: 'Xác xuất thành công(%)',
                        position: 'outer-middle'
                    },
                    // format: d3.format("$")
                }
            },
            size: {
                width: 750,
            },
            legend:{
                position:'top',
                
            },
            tooltip: {
                format: {
                    title: function (d) {
                        console.log('d', d)
                        return taskNameList[d + 1];
                    },
                    value: function(value){
                        return value+' %'
                    }
                   
                },
                
            },
        })
        // ratioChart
        rs = setRatioChartData()
        setRatioChart({
            ...ratioChart,
            data: {
                columns: rs,
                type: 'donut',
                
            },
            color: {
                pattern:[
                "#FF0000",
                 '#ffc107',
                 '#40FF00'
             ]
            },
            size: {
                width: 400
            },
            legend:{
                position:'top',
                // hide:['Xác suất thành công thấp','Xác suất thành công trung bình','Xác suất thành công cao']
            },
            tooltip: {
                format: {
                    title: function (d) {
                        if(d==1){
                            return 'Xác suất thành công trung bình'
                        }
                        if(d==2){
                            return 'Xác suất thành công cao'
                        }
                        return 'Xác suất thành công thấp'
                        
                       
                    },
                    value: function(value){
                        return roundProb(value)+' %'
                    }
                },
                // contents: function (d, defaultTitleFormat, defaultValueFormat, color){
                //     let table = "<table>";
                //     table +="<tr><th colspan='2'>"
                //     let title = "</th>"

                //     return "<table><td class='name'><span style='background-color:blue'>abc</span></table>"
                // } 
            },

        }
        )

    }, [idProcess])
    const [taskList,setTaskList] = useState(null)
    const setRatioChartData = () => {
        let dataProcess = props.taskPert.processListData
        dataProcess = dataProcess.find(d => d.process == props.idProcess)
        let tasks = dataProcess.tasks
        setTaskList(tasks)
        let low = ['Xác suất thành công thấp'].concat(tasks.filter(t => t.prob < 0.5).length / tasks.length)

        let medium = ['Xác suất thành công trung bình'].concat(tasks.filter(t => t.prob >= 0.5 && t.prob < 0.89).length / tasks.length)
        // medium.unshift('medium')
        let high = ['Xác suất thành công cao'].concat(tasks.filter(t => t.prob >= 0.89).length / tasks.length)
        // high.unshift('high')
        let x = ['x']
        x.concat(tasks.map(t => t.name))
        let rs = [
            low,
            medium,
            high
        ]
        console.log(rs)
        return rs


    }
    const setProbChartData = () => {

        let data = ['Tính theo PERT']
        let dataProcess = props.taskPert.processListData
        dataProcess = dataProcess.find(d => d.process == props.idProcess)
        let tasks = dataProcess.tasks
        // console.log('tasks', tasks)
        data = tasks != undefined ? data.concat(tasks.map(r => { return roundProb(r.pertProb)})) : [];
        // console.log(data)
        let taskRiskData = ['Mô hình có xét đến yếu tổ rủi ro']
        taskRiskData = tasks != undefined ? taskRiskData.concat(tasks.map(t => roundProb(t.prob))) : [];
        let x = ['x']
        x = x.concat(tasks.map(r => r.name))
        let taskNameList = x.map(x => x.length > 10 ? x.slice(0, 7) + '...' : x)

        // console.log(x)

        let rs = {
            taskNameList: x,
            dataChart: [
                taskNameList,
                // data,
                taskRiskData

            ]
        }

        return rs
    }



    return (
        <React.Fragment>
            <DialogModal
                size='100' modalID={`modal-view-process-task-list`} isLoading={false}
                formID="modal-view-process-task-list"
                // disableSubmit={!isTaskFormValidated()}
                title={translate('process_analysis.modal_view_process.title')}
                hasSaveButton={false}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            >

                <div className="nav-tabs-custom" >
                    {/* Nav-tabs */}
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('manage_risk.add_tab.basic')} data-toggle="tab" href={`#process`}>{translate('manage_risk.add_tab.basic')}</a></li>
                        {/* <li><a title={translate('manage_risk.add_tab.impact')} data-toggle="tab" href={`#pertData`}>Dữ liệu PERT</a></li> */}
                        <li><a title="Thống kê" data-toggle="tab" href={`#statistical`}>{translate('process_analysis.modal_view_process.statistical')}</a></li>

                    </ul>
                </div>
                <div className="tab-content">
                    <div id="process" className="tab-pane active" >

                        <ViewProcess

                            listOrganizationalUnit={listOrganizationalUnit}
                            data={data}
                            idProcess={idProcess}
                            xmlDiagram={xmlDiagram}
                            processName={processName}
                            processDescription={processDescription}
                            infoTask={infoTask}
                            creator={creator}
                        />

                    </div>
                    <div id="statistical" className="tab-pane">
                        <div className="row">
                            <div className="col-sm-8">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">{translate('process_analysis.modal_view_process.success_probability')}</div>
                                    </div>
                                    <div className="box-body">


                                        {state.chartData != null && <C3Chart
                                            data={state.chartData}
                                            axis={state.axis}
                                            size={state.size}
                                            tooltip={state.tooltip}
                                            legend={state.legend}
                                             />
                                            }
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">{translate('process_analysis.modal_view_process.ratio_chart')}</div>
                                    </div>
                                    <div className="box-body">
                                        <div class = "row" style={{paddingLeft:'4px'}}>
                                            <strong>{translate('process_analysis.modal_view_process.number_task')}: {taskList&&taskList.length} (cv)</strong>
                                        </div>
                                        {ratioChart.data != null &&
                                            <C3Chart 
                                            data={ratioChart.data} 
                                            size={ratioChart.size}
                                            legend={ratioChart.legend} 
                                            tooltip={ratioChart.tooltip}
                                            color={ratioChart.color}></C3Chart>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                        </div>

                    </div>
                </div>



            </DialogModal>
        </React.Fragment>
    )

}

function mapState(state) {
    const { user, auth, role, taskPert } = state;
    return { user, auth, role, taskPert };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getTaskById: performTaskAction.getTaskById,
    getAllUsersWithRole: UserActions.getAllUsersWithRole,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
};
const connectedModalViewProcess = connect(mapState, actionCreators)(withTranslate(ModalViewProcess));
export { connectedModalViewProcess as ModalViewProcess };