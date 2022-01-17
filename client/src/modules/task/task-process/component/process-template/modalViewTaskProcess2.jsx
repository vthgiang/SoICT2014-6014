import React, { Component, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, SelectBox } from "../../../../../common-components";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { TaskProcessActions } from "../../redux/actions";
import { ViewTaskTemplate } from "../../../task-template/component/viewTaskTemplate";
import qs from 'qs';
import BpmnViewer from 'bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import customModule from '../custom-task-process-template';
import { AddProcessTemplate } from "./addProcessTemplateChild";
import { ViewProcessTemplateChild } from "./viewProcessTemplateChild";
import { ModalViewBpmnProcessTemplateChild } from "./viewBpmnProcessTemplateChild";
import { TaskProcessService } from "../../redux/services";
var zlevel = 1;
function areEqual(prevProps, nextProps) {
    if (prevProps.idProcess === nextProps.idProcess ){
        return true
    } else {
        return false
    }
}
function ModalViewTaskProcess2(props) {
    // let { data } = props;
    const [state, setState] = useState({
        userId: getStorage("userId"),
        currentRole: getStorage('currentRole'),
        showInfo: false,
        showInfoProcess: false,
        selectedView: 'info',
        info: [],
        xmlDiagram: [],
        dataProcessTask:'',
        showProcessTemplate:false,
        render:0
    })
    const [modeler,setmodeler] = useState( new BpmnModeler({
        // container:"#viewprocess",
        additionalModules: [
            customModule,
            // { moveCanvas: ['value', null] }, // chặn chức năng kéo thả khung vẽ
            { zoomScroll: ['value', ''] }, // chặn chức năng lăn chuột, zoom on mouse wheel
        ]
    }))
    const generateId = 'viewprocess';
    // modeler.importXML(props.xmlDiagram)
    // const interactPopup = async (event) => {
    //     let element = event.element;

    //     setState({
    //         ...state,
    //         id: element.businessObject.id
    //     });
    // }
    const interactPopup =  (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');
        // console.log(element);
         setState(state => {
            if (element.type === "bpmn:SubProcess") {
                return {
                    ...state,
                    showInfo: false,
                    showInfoProcess:true,
                    type: element.type,
                    name: nameStr[1],
                    taskName: element.businessObject.name,
                    id: `${element.businessObject.id}`,
                }
                
            } else 
            if (element.type === "bpmn:Task" || element.type === "bpmn:ExclusiveGateway") {
                console.log("object");
                return { ...state, showInfo: true,showInfoProcess:false, type: element.type, name: nameStr[1], taskName: element.businessObject.name, id: `${element.businessObject.id}`, }
            }
            else {
                return { ...state, showInfo: false,showInfoProcess:false, type: element.type, name: '', id: element.businessObject.id, }
            }
        })
        
    }
    useEffect(() => {
        props.getAllUsers();
        // modeler.container="#viewprocess"
        // console.log(modeler);
        // modeler.attachTo('#' + generateId);

        let eventBus = modeler.get('eventBus')

        eventBus.on('shape.move.start', 100000, () => { return false });
        modeler.on('element.click', 1000, (e) => interactPopup(e));
    }, [])
    useEffect(() => {
        if(props.idProcess&&props.idProcess != state.idProcess){
            let info = {};
            let infoTask = props.data.tasks; // TODO task list
            for (let i in infoTask) {
                info[`${infoTask[i].code}`] = infoTask[i];
            }
            let infoTemplate = {};
            let infoProcessTemplates = props.data.processTemplates; // TODO task list
            for (let i in infoProcessTemplates) {
                infoTemplate[`${infoProcessTemplates[i].code}`] = infoProcessTemplates[i];
            }
            modeler.attachTo('#' + generateId);
            modeler.importXML(props.data.xmlDiagram);
            setState({
                ...state,
                idProcess: props.idProcess,
                showInfo: false,
                showInfoProcess: false,
                info: info,
                infoTemplate: infoTemplate,
                processDescription: props.data.processDescription ? props.data.processDescription : '',
                processName: props.data.processName ? props.data.processName : '',
                viewer: props.data.viewer ? props.data.viewer.map(x => x._id) : [],
                manager: props.data.manager ? props.data.manager.map(x => x._id) : [],
                xmlDiagram: props.data.xmlDiagram,
                selectedView:"info",
                dataProcessTask:'',
                showProcessTemplate:false,
            })
        }
        
    }, [props.idProcess])
    
    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (nextProps.idProcess !== prevState.idProcess) {
    //         let info = {};
    //         let infoTask = nextProps.data.tasks; // TODO task list
    //         for (let i in infoTask) {
    //             info[`${infoTask[i].code}`] = infoTask[i];
    //         }
    //         return {
    //             ...prevState,
    //             idProcess: nextProps.idProcess,
    //             showInfo: false,
    //             info: info,
    //             processDescription: nextProps.data.processDescription ? nextProps.data.processDescription : '',
    //             processName: nextProps.data.processName ? nextProps.data.processName : '',
    //             viewer: nextProps.data.viewer ? nextProps.data.viewer.map(x => x._id) : [],
    //             manager: nextProps.data.manager ? nextProps.data.manager.map(x => x._id) : [],
    //             xmlDiagram: nextProps.data.xmlDiagram,
    //         }
    //     } else {
    //         return null;
    //     }
    // }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextProps?.idProcess !== state.idProcess) {
    //         modeler.importXML(nextProps.data.xmlDiagram);
    //         return true;
    //     }
    //     return true;
    // }
    // componentDidMount() {
    //     props.getAllUsers();
    //     modeler.attachTo('#' + generateId);

    //     let eventBus = modeler.get('eventBus')

    //     eventBus.on('shape.move.start', 100000, () => { return false });
    //     modeler.on('element.click', 1000, (e) => interactPopup(e));
    // }

    

    // Các hàm xử lý sự kiện của form 
    const handleChangeContent = async (content) => {
        await setState(state => {
            return {
                ...state,
                selectedView: content
            }
        })
    }


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
    const exportDiagram=()=>{

    }
    const downloadAsImage=()=>{

    }
    const downloadAsBpmn=()=>{

    }
    const downloadAsSVG=()=>{

    }
    const handleDataProcessTempalte = async (value) => {
		await setState({
			...state,
			dataProcessTask:value,
			showProcessTemplate:true,
		})
		// modeler.importXML(value.xmlDiagram)
		await window.$(`#modal-view-process`).modal("show");
	}
    const { translate, role, user } = props;
    const { listOrganizationalUnit } = props
    const { name, id, idProcess, info, showInfo, processDescription, processName, viewer, manager, selectedView, showInfoProcess ,infoTemplate ,showProcessTemplate} = state;

    let listRole = [];
    let listUser = user.list
    if (role && role.list.length !== 0) listRole = role.list;

    let listItem = listRole.filter(e => ['Admin', 'Super Admin', 'Manager', 'Deputy Manager', 'Employee'].indexOf(e.name) === -1)
        .map(item => { return { text: item.name, value: item._id } });

    let listViewer = [];
    if (viewer) {
        listViewer = listItem.filter(e => viewer.indexOf(e.value) !== -1)
    }

    let listManager = [];
    if (manager) {
        listManager = listItem.filter(e => manager.indexOf(e.value) !== -1)
    }
    return (
        <React.Fragment>
            
            <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#info-view" onClick={() => handleChangeContent("info")} data-toggle="tab">{translate("task.task_process.process_information")}</a></li>
                    <li><a href="#process-view" onClick={() => handleChangeContent("process")} data-toggle="tab">{translate("task.task_process.task_process")}</a></li>
                </ul>
                <div className="tab-content">
                    <div className={selectedView === "info" ? "active tab-pane" : "tab-pane"} id="info-view">
                        <div className="description-box without-border">
                            {/* Thông tin chung */}
                            <div>
                                <strong>{translate("task.task_process.process_name")}:</strong>
                                <span>{processName}</span>
                            </div>
                            <div>
                                <strong>{translate("task.task_process.process_description")}:</strong>
                                <span>{processDescription}</span>
                            </div>


                            {/* Người xem, quản lý */}
                            <strong>{translate("task.task_process.viewer")}:</strong>
                            <ul>
                                {
                                    listViewer.map((x, key) => {
                                        return <li key={key}>{x.text}</li>
                                    })
                                }
                            </ul>
                            <strong>{translate("task.task_process.manager")}:</strong>
                            <ul>
                                {
                                    listManager.map((x, key) => {
                                        return <li key={key}>{x.text}</li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>


                <div className="tab-content" style={{ padding: 0, marginTop: -15 }}>
                    <div className={selectedView === "process" ? "active tab-pane" : "tab-pane"} id="process-view">
                        <div className="">
                            {/* Quy trình công việc */}
                            <div className={`contain-border ${showInfo || showInfoProcess? 'col-md-8' : 'col-md-12'}`}>
                                <div className="tool-bar-xml" style={{ /*position: "absolute", right: 5, top: 5*/ }}>
                                    <button onClick={exportDiagram}>Export XML</button>
                                    <button onClick={downloadAsSVG}>Save SVG</button>
                                    <button onClick={downloadAsImage}>Save Image</button>
                                    <button onClick={downloadAsBpmn}>Download BPMN</button>
                                </div>
                                <div id={generateId}></div>
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
                            <div className={`right-content ${showInfo || showInfoProcess? 'col-md-4' : undefined}`}>
                                {showInfo&&
                                    <div>
                                        {/* <div>
                                                <h1>Option {name}</h1>
                                            </div> */}
                                        <ViewTaskTemplate
                                            isProcess={true}
                                            taskTemplate={info?.[`${id}`]}
                                            listUser={listUser}
                                        />
                                    </div>
                                }
                                {showInfoProcess&&
                                    <div >
                                    {/* <div>
                                            <h1>Option {name}</h1>
                                        </div> */}
                                        <ViewProcessTemplateChild
                                            id={id}
                                            infoTemplate={(infoTemplate && infoTemplate[`${id}`]) && infoTemplate[`${id}`]}
                                            handleDataProcessTempalte={handleDataProcessTempalte}
                                            // setBpmnProcess={setBpmnProcess}
                                            // handleChangeName={handleChangeName} // cập nhật tên vào diagram
                                            // handleChangeViewerBpmn={handleChangeViewerBpmn} // cập nhật hiển thi diagram
                                            // handleChangeManagerBpmn={handleChangeManagerBpmn} // cập nhật hiển thị diagram
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
        </React.Fragment>
    );
}

function mapState(state) {
    const { user, auth, role, taskProcess } = state;
    return { user, auth, role, taskProcess };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    createXmlDiagram: TaskProcessActions.createXmlDiagram,
    getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
    editXmlDiagram: TaskProcessActions.editXmlDiagram,
    getAllUsers: UserActions.get,
};
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(React.memo(ModalViewTaskProcess2,areEqual)));
export { connectedModalAddProcess as ModalViewTaskProcess2 };
