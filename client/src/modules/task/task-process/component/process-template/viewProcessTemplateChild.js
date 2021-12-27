import React, { Component, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, SelectBox } from "../../../../../common-components";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { TaskProcessActions } from "../../redux/actions";
import { ViewTaskTemplate } from "../../../task-template/component/viewTaskTemplate";

import BpmnViewer from 'bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import customModule from '../custom-task-process-template';

var zlevel = 1;
function areEqual(prevProps, nextProps) {
    if (prevProps.idProcess === nextProps.idProcess ){
        return true
    } else {
        return false
    }
}
function ModalViewProcess(props) {
    let { data } = props;
    const [state, setState] = useState({
        userId: getStorage("userId"),
        currentRole: getStorage('currentRole'),
        showInfo: false,
        selectedView: 'info',
        info: props.tasks,
        xmlDiagram: props.xmlDiagram,
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
    const generateId = 'view_process';
    // modeler.importXML(props.xmlDiagram)
    // const interactPopup = async (event) => {
    //     let element = event.element;

    //     setState({
    //         ...state,
    //         id: element.businessObject.id
    //     });
    // }
    const interactPopup = (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');
        setState(state => {
            if (element.type !== 'bpmn:Collaboration' && element.type !== 'bpmn:Process' && element.type !== 'bpmn:StartEvent' && element.type !== 'bpmn:EndEvent' && element.type !== 'bpmn:SequenceFlow') {
                // console.log("object");
                return { ...state, showInfo: true, type: element.type, name: nameStr[1], taskName: element.businessObject.name, id: `${element.businessObject.id}`, }
            }
            else {
                return { ...state, showInfo: false, type: element.type, name: '', id: element.businessObject.id, }
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
        // console.log("2");
        if(props.idProcess != state.idProcess){
            let info = {};
            let infoTask = props.tasks; // TODO task list
            for (let i in infoTask) {
                info[`${infoTask[i].code}`] = infoTask[i];
            }
            modeler.attachTo('#' + generateId);
            console.log(props.xmlDiagram);
            modeler.importXML(props.xmlDiagram);
            setState({
                ...state,
                idProcess: props.idProcess,
                showInfo: false,
                info: info,
                processDescription: props.processDescription ? props.processDescription : '',
                processName: props.processName ? props.processName : '',
                viewer: props.viewer ? props.viewer : [],
                manager: props.manager ? props.manager : [],
                xmlDiagram: props.xmlDiagram,
            })
        }
        
    }, [props.idProcess])
    console.log(state);
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
    const { translate, role, user } = props;
    const { listOrganizationalUnit } = props
    const { name, id, idProcess, info, showInfo, processDescription, processName, viewer, manager, selectedView } = state;
    return (
        <React.Fragment>
            <DialogModal
                size='100' modalID={`modal-view-process`}
                isLoading={false}
                formID="form-task-process"
                title={props.processName}
                hasSaveButton={false}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            >
                <div>
                    <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                        <div className="tab-content" style={{ padding: 0, marginTop: -15 }}>
                            <div className={selectedView !== "process" ? "active tab-pane" : "tab-pane"} id="process-view">
                                <div className="">
                                    {/* Quy trình công việc */}
                                    <div className={`contain-border ${showInfo ? 'col-md-8' : 'col-md-12'}`}>
                                        
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
                                    <div className={`right-content ${showInfo ? 'col-md-4' : undefined}`}>
                                        {
                                            (showInfo) &&
                                            <div>
                                                {/* <div>
                                                        <h1>Option {name}</h1>
                                                    </div> */}
                                                <ViewTaskTemplate
                                                    isProcess={true}
                                                    taskTemplate={info?.[`${id}`]}
                                                    // listUser={listUser}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { user, auth, role } = state;
    return { user, auth, role };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    createXmlDiagram: TaskProcessActions.createXmlDiagram,
    getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
    editXmlDiagram: TaskProcessActions.editXmlDiagram,
    getAllUsers: UserActions.get
};
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(React.memo(ModalViewProcess,areEqual)));
export { connectedModalAddProcess as ModalViewProcess };
