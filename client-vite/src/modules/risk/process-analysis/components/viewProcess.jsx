import React, { Component, useEffect, useState } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { getStorage } from '../../../../config'
import { ModalDetailTask } from "../../../task/task-dashboard/task-personal-dashboard/modalDetailTask"
import { UserActions } from "../../../super-admin/user/redux/actions"
import { performTaskAction } from "../../../task/task-perform/redux/actions"
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import BpmnModeler from 'bpmn-js/lib/Modeler';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
// import customModule from '../../task/task-process/component/custom-task-process'
import customModule from './diagram'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import '../../../task/task-process/component/process-template/processDiagram.css'
import { TaskPertActions } from '../redux/actions'
import { roundProb, getColor } from '../TaskPertHelper'
import { TaskDetail } from './taskDetail'
import { ChangeProcessTime } from "./changeProcessTime";
//Xóa element khỏi pallette theo data-action
var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
PaletteProvider.prototype.getPaletteEntries = function (element) {
    var entries = _getPaletteEntries.apply(this);
    delete entries['create.subprocess-expanded'];
    delete entries['create.data-store'];
    delete entries['create.data-object'];
    delete entries['create.group'];
    // delete entries['create.participant-expanded'];
    return entries;
}

// khởi tạo giá trị mặc định zoomIn zoomOut
var zlevel = 1;

function ViewProcess(props) {

    const { translate, role, user, data } = props;
    const [state, setState] = useState({
        userId: getStorage("userId"),
        currentRole: getStorage('currentRole'),
        showInfo: false,
        info: data.tasks,
        xmlDiagram: data.xmlDiagram,
        selected: 'info',
        zlevel: 1,
        startDate: "",
        endDate: "",
        status: "",
        currentRowChangeTime: undefined
    })

    const [modeler, setModeler] = useState(
        new BpmnModeler({
            additionalModules: [
                customModule,
                { zoomScroll: ['value', ''] },
                // { moveCanvas: [ 'value', null ] }
            ],
        })
    )
    const generateId = 'viewtaskprocesstab';
    useEffect(() => {
        modeler.attachTo('#' + generateId);
        var eventBus = modeler.get('eventBus');

        //Vo hieu hoa double click edit label
        eventBus.on('element.dblclick', 10000, function (event) {
            var element = event.element;
            if (isAny(element, ['bpmn:Task'])) {
                return false; // will cancel event
            }
        });

        // eventBus.on('shape.move.start', 100000, () => { return false });

        modeler.on('element.click', 1000, (e) => interactPopup(e));
    }, [])

    // Sửa biểu đồ
    useEffect(() => {
        // console.log('processListData',props.taskPert.processListData)
        // console.log('props.data',props.data)
        // console.log('props.id',props.idProcess)
        let process = props.taskProcess.listTaskProcess.find(d => d.process == props.idProcess)
        console.log(process)
        let data = props.taskPert.processListData
        data = data.find(d => d.process == props.idProcess)
        let totalData = data.totalData
        console.log('process', data)
        data = data.tasks
        let probData = data.map(d => [d.taskID, d.prob])
        console.log('probData', probData)
        let probMap = new Map(data.map(d => [d.taskID, d.prob]))
        let slackMap = new Map(data.map(d => [d.taskID, d.slack]))
        let childMap = new Map(data.map(d => [d.taskID, d.childList]))
        let parentMap = new Map(data.map(d => [d.taskID, d.parentList]))
        let info = {};
        let infoTask = props.data.tasks;
        for (let i in infoTask) {
            info[`${infoTask[i].codeInProcess}`] = infoTask[i];
        }
        setState({
            ...state,
            idProcess: props.idProcess,
            showInfo: false,
            info: info,
            process: process,
            processDescription: props.data.processDescription ? props.data.processDescription : '',
            processName: props.data.processName ? props.data.processName : '',
            status: props.data.status ? props.data.status : '',
            startDate: props.data.startDate ? props.data.startDate : '',
            endDate: props.data.endDate ? props.data.endDate : '',
            xmlDiagram: props.data.xmlDiagram,
            totalData: totalData

        })
        props.getDepartment();
        let { user } = props;
        let defaultUnit;
        if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
            item.manager === state.currentRole
            || item.deputyManager === state.currentRole
            || item.employee === state.currentRole);
        if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
            // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
            defaultUnit = user.organizationalUnitsOfUser[0]
        }
        props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);
        if (props.data) {
            let modeling = modeler.get("modeling");
            modeler.importXML(props.data.xmlDiagram, function (err) {
                let infoTask = props.data.tasks
                let info = state.info;
                // lấy node start và node end 
                let elements = modeler.get('elementRegistry')._elements
                let vals = Object.keys(elements).map(key => elements[key]);
                vals = vals.map(val => val.element)
                let startEvent = vals.find(val => val.type == "bpmn:StartEvent")
                let startEventId = startEvent.id
                let endEvent = vals.find(val => val.type == "bpmn:EndEvent")
                let endEventId = endEvent.id

                // let elementName = (Object.keys(modeler.get('elementRegistry')._elements))
                if (infoTask) {
                    for (let i in infoTask) {
                        // console.log(probMap.get(infoTask[i].codeInProcess))
                        let prob = probMap.get(infoTask[i].codeInProcess)
                        let slack = slackMap.get(infoTask[i].codeInProcess)
                        let childs = childMap.get(infoTask[i].codeInProcess)
                        let parents = parentMap.get(infoTask[i].codeInProcess)

                        let responsible = []
                        let accountable = []
                        infoTask[i].responsibleEmployees.forEach(x => {
                            responsible.push(x.name)
                        })
                        infoTask[i].accountableEmployees.forEach(x => {
                            accountable.push(x.name)
                        })
                        let element1 = (Object.keys(modeler.get('elementRegistry')).length > 0) && modeler.get('elementRegistry').get(infoTask[i].codeInProcess);
                        element1 && modeling.updateProperties(element1, {
                            // progress: infoTask[i].progress,
                            slack: slack,
                            color: getColor(prob),
                            progress: roundProb(prob),
                            shapeName: infoTask[i].name,
                            responsibleName: responsible,
                            accountableName: 'Click to view detail'
                        });
                        for (let child of childs) {
                            console.log(slack, slackMap.get(child))
                            let dashed = true, width = '1px'
                            console.log(slack, slackMap.get(child))
                            let element = (Object.keys(modeler.get('elementRegistry')).length > 0) && modeler.get('elementRegistry').get(child);
                            if (slack == 0 && slackMap.get(child) == 0) {
                                dashed = false
                                width = '2px'

                            }
                            modeling.connect(element1, element, {
                                type: 'bpmn:SequenceFlow',
                                colorUpdate: 'black',
                                dashed: dashed,
                                width: width,
                                // riskID: risk.riskID
                            })
                        }
                        if (childs.length == 0) {
                            let element = (Object.keys(modeler.get('elementRegistry')).length > 0) && modeler.get('elementRegistry').get(endEventId);
                            
                            modeling.connect(element1, element, {
                                type: 'bpmn:SequenceFlow',
                                colorUpdate: 'black',
                                dashed: false,
                                width: '2px',
                                // riskID: risk.riskID
                            })
                        }
                        if (parents.length == 0) {
                            let element = (Object.keys(modeler.get('elementRegistry')).length > 0) && modeler.get('elementRegistry').get(startEventId);
                            modeling.connect(element, element1, {
                                type: 'bpmn:SequenceFlow',
                                colorUpdate: 'black',
                                dashed: false,
                                width: '2px',
                                // riskID: risk.riskID
                            })

                        }
                    }
                }
                //start event Event_0yt01lg
                // end event //Event_11eqwr0

            });
        }
    }, [props.idProcess, props.data, props.taskPert.processListData])

    // Các hàm  xử lý sự kiện của bpmn

    const interactPopup = (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');

        console.log('id', element.businessObject.id);
        setState(state => {
            if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway') {
                if (!state.info[`${element.businessObject.id}`] || (state.info[`${element.businessObject.id}`] && !state.info[`${element.businessObject.id}`].organizationalUnit)) {
                    state.info[`${element.businessObject.id}`] = {
                        ...state.info[`${element.businessObject.id}`],
                        organizationalUnit: props.listOrganizationalUnit[0]?._id,
                    }
                }
                return {
                    ...state,
                    showInfo: true,
                    type: element.type,
                    name: nameStr[1],
                    taskName: element.businessObject.name,
                    id: `${element.businessObject.id}`,
                }
            }

            else {
                return { ...state, showInfo: false, type: element.type, name: '', id: element.businessObject.id, }
            }

        })
        if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway') {
            window.$(`#modal-detail-task-view-process`).modal("show");
        }
    }



    // các hàm thu nhỏ, phóng to, vừa màn hình cho diagram
    const handleZoomOut = async () => {
        let zstep = 0.2;
        let canvas = modeler.get('canvas');
        let eventBus = modeler.get('eventBus');

        // set initial zoom level
        canvas.zoom(zlevel, 'auto');

        // update our zoom level on viewbox change
        await eventBus.on('canvas.viewbox.changed', function (evt) {
            zlevel = evt.viewbox.scale;
        });
        zlevel = Math.max(zlevel - zstep, zstep);
        canvas.zoom(zlevel, 'auto');
    }

    const handleZoomReset = () => {

        let canvas = modeler.get('canvas');
        canvas.zoom('fit-viewport');
    }

    const handleZoomIn = async () => {
        let zstep = 0.2;
        let canvas = modeler.get('canvas');
        let eventBus = modeler.get('eventBus');

        // set initial zoom level
        canvas.zoom(zlevel, 'auto');
        // update our zoom level on viewbox change
        await eventBus.on('canvas.viewbox.changed', function (evt) {
            zlevel = evt.viewbox.scale;
        });
        zlevel = Math.min(zlevel + zstep, 7);
        canvas.zoom(zlevel, 'auto');
    }



    const formatDate = (date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    const formatStatus = (data) => {
        const { translate } = props;
        if (data === "inprocess") return translate('task.task_management.inprocess');
        else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
        else if (data === "finished" || data === "temp_finished") return translate('task.task_management.finished');
        else if (data === "delayed") return translate('task.task_management.delayed');
        else if (data === "canceled") return translate('task.task_management.canceled');
    }


    const { id, info, startDate, endDate, status,
        processDescription, processName, totalData } = state;
    // console.log(info);
    const { isTabPane } = props
    const [show, setShow] = useState({
        changeTime: false
    })
    useEffect(() => {
        if (state.currentRowChangeTime) {
            window.$(`#modal-change-process-time-${state.currentRowChangeTime._id}`).modal("show");
        }
    }, [show.changeTime])
    const handleChangeTime = (event, item) => {
        let data = props.taskProcess.listTaskProcess
        data = data.find(d => d._id == props.idProcess)
        setState({
            ...state,
            currentRowChangeTime: data
        })
        setShow({
            ...show,
            changeTime: !show.changeTime
        })
    }
    return (
        <React.Fragment>
            <div className="box">

                {state.currentRowChangeTime &&
                    <ChangeProcessTime processData={state.currentRowChangeTime} />}
                {id !== undefined && props.taskPert.processListData.length != 0 && props.idProcess && props.riskDistribution &&
                    <TaskDetail
                        action={"view-process"} taskData={(info && info[`${id}`]) && info[`${id}`]}
                        isProcess={true}
                        idProcess={props.idProcess}
                        riskDistribution={props.riskDistribution.bayesData.riskInfo}
                        taskPertBayes={props.taskPert.processListData.find(tp => tp.process == props.idProcess).tasks.find(t => t.taskID == id)} />
                }

                <div className={`row'`}>
                    {/* Quy trình công việc */}
                    <div className={'contain-border col-md-8'}>
                        {/* Diagram */}
                        <div id={generateId}></div>
                        {/* Zoom button */}
                        <div className="row">
                            <div className="io-zoom-controls">
                                <ul className="io-zoom-reset io-control io-control-list">
                                    <li>
                                        <a style={{ cursor: "pointer" }} title="Reset zoom" onClick={handleZoomReset}>
                                            <i className="fa fa-crosshairs"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a style={{ cursor: "pointer" }} title="Zoom in" onClick={handleZoomIn}>
                                            <i className="fa fa-plus"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a style={{ cursor: "pointer" }} title="Zoom out" onClick={handleZoomOut}>
                                            <i className="fa fa-minus"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className={`${isTabPane ? "" : "col-md-4"}`}>
                        <div>
                            {props.idProcess && data.manager.map(u => u._id).includes(getStorage('userId')) && data.status != 'temp_finished' &&

                                <button className="edit" style={{ color: '#1C1C1C' }} onClick={(e) => handleChangeTime(e, props.idProcess)} title={translate('task.task_template.view_detail_of_this_task_template')}>
                                    <i class="fa fa-cog" aria-hidden="true"></i><span>{translate('process_analysis.change_time.change_plan')}</span>
                                </button>
                            }
                        </div>
                        <div className='description-box without-border'>
                            <div style={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                                <label>{translate('process_analysis.change_time.total_prob')}:</label>
                                {totalData && <div className="progress-task" style={{ textAlign: 'center', width: 200 }}>
                                    <div className="fillmult" data-width={`${roundProb(totalData.totalProb)}%`} style={{ width: `${roundProb(totalData.totalProb)}%`, backgroundColor: '#3c8dbc' }}></div>
                                    <span className="perc"> {roundProb(totalData.totalProb)}%</span>
                                </div>}

                            </div>

                            {/* tên quy trình */}
                            <div>
                                <strong>{translate("task.task_process.process_name")}:</strong>
                                <span>{processName}</span>
                            </div>

                            {/* mô tả quy trình */}
                            <div>
                                <strong>{translate("task.task_process.process_description")}:</strong>
                                <span>{processDescription}</span>
                            </div>

                            {/* mô tả quy trình */}
                            <div>
                                <strong>{translate("task.task_process.process_status")}:</strong>
                                <span>{formatStatus(status)}</span>
                            </div>
                            {/* mô tả quy trình */}
                            <div>
                                <strong>{translate("process_analysis.view_process.number_of_task")}:</strong>
                                <span>{props.data.tasks.length}</span>
                            </div>

                            {/* thời gian thực hiện quy trình */}
                            <div>
                                <strong>{translate("task.task_process.time_of_process")}:</strong>
                                <span>{formatDate(startDate)} <i className="fa fa-fw fa-caret-right"></i> {formatDate(endDate)}</span>
                            </div>

                            <div>
                                <strong>{translate("task.task_process.notice")}:</strong>
                            </div>

                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ backgroundColor: getColor(0.4), height: "30px", width: "40px", border: "2px solid #000", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate("process_analysis.view_process.low")}
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ backgroundColor: getColor(0.6), height: "30px", width: "40px", border: "2px solid #000", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate("process_analysis.view_process.medium")}
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ backgroundColor: getColor(0.92), height: "30px", width: "40px", border: "2px solid #000", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate("process_analysis.view_process.high")}
                            </div>
                            <div className="form-group">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div style={{ backgroundColor: 'white', height: "30px", width: "40px", border: "4px solid", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate("process_analysis.view_process.critical_activity")}
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div><span style={{ fontSize: '30px' }}>&#8674;</span><span> :{translate('process_analysis.view_process.on_critical')}</span></div>
                                    <div><span style={{ fontSize: '30px' }}>&#8594;</span><span> :{translate('process_analysis.view_process.not_on_critical')}</span></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )

}

function mapState(state) {
    const { user, auth, role, taskPert, riskDistribution, taskProcess } = state;
    return { user, auth, role, taskPert, riskDistribution, taskProcess };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getTaskById: performTaskAction.getTaskById,
    getAllUsersWithRole: UserActions.getAllUsersWithRole,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    updateTask: TaskPertActions.updateTask
};
const connectedViewProcess = connect(mapState, actionCreators)(withTranslate(ViewProcess));
export { connectedViewProcess as ViewProcess };