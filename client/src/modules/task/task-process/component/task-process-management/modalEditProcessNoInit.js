import React, { Component, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getStorage } from "../../../../../config";
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, ErrorLabel, SelectBox, DatePicker } from "../../../../../common-components";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { performTaskAction } from "../../../task-perform/redux/actions";
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import BpmnModeler from 'bpmn-js/lib/Modeler';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import customModule from '../custom-task-process'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import './../process-template/processDiagram.css';
import { TaskFormValidator } from "../../../task-management/component/taskFormValidator";
import { TaskProcessActions } from "../../redux/actions";
import getEmployeeSelectBoxItems from "../../../organizationalUnitHelper";
import { AddTaskForm } from "../../../task-management/component/addTaskForm";
import { DepartmentActions } from "../../../../super-admin/organizational-unit/redux/actions";
import ValidationHelper from '../../../../../helpers/validationHelper';
import { EditProcessChild } from "./editProcessChild";


//Xóa element khỏi pallette theo data-action
var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
PaletteProvider.prototype.getPaletteEntries = function (element) {
    var entries = _getPaletteEntries.apply(this);
    delete entries['create.subprocess-expanded'];
    delete entries['create.data-store'];
    delete entries['create.data-object'];
    delete entries['create.group'];
    delete entries['create.participant-expanded'];
    return entries;
}

// khởi tạo giá trị mặc định zoomIn zoomOut
var zlevel = 1;


function ModalEditProcessNoInit(props) {

    let { data } = props;

    const [state, setState] = useState({
        userId: getStorage("userId"),
        currentRole: getStorage('currentRole'),
        showInfo: false,
        showInfoProcess: false,
        info: data.tasks,
        xmlDiagram: data.xmlDiagram,
        selected: 'info',
        zlevel: 1,
        startDate: "",
        endDate: "",
        status: "",
    })
    const [modeler, setModeler] = useState(new BpmnModeler({
        additionalModules: [
            customModule,
            { zoomScroll: ['value', ''] }
        ],
    }));
    const generateId = 'edittaskprocessnoinit';
    // modeling = modeler.get("modeling");
    // initialDiagram = data.xmlDiagram;
    useEffect(() => {
        props.getAllUsers();
        props.getAllUserOfCompany();
        props.getAllDepartments();
        props.getAllUserInAllUnitsOfCompany()

        modeler.attachTo('#' + generateId);
        var eventBus = modeler.get('eventBus');

        //Vo hieu hoa double click edit label
        eventBus.on('element.dblclick', 10000, function (event) {
            var element = event.element;

            if (isAny(element, ['bpmn:Task'])) {
                return false; // will cancel event
            }
        });

        eventBus.on('shape.move.start', 100000, () => { return false });

        modeler.on('element.click', 1000, (e) => interactPopup(e));
    }, [])
    useEffect(() => {
        let info = {};
        let infoTask = props.data.tasks;
        for (let i in infoTask) {
            info[`${infoTask[i].code}`] = {
                ...infoTask[i],
                // responsibleEmployees: infoTask[i].responsibleEmployees.map(e => e._id),
                // accountableEmployees: infoTask[i].accountableEmployees.map(e => e._id),
                // consultedEmployees: infoTask[i].consultedEmployees.map(e => e._id),
                // informedEmployees: infoTask[i].informedEmployees.map(e => e._id),
            };
        }
        let infoTemplate = {};
        // console.log(props.data);
        let infoProcessTemplates = props.data.processChilds; // TODO task list
        for (let i in infoProcessTemplates) {
            infoTemplate[`${infoProcessTemplates[i].code}`] = infoProcessTemplates[i];
        }
        console.log(props.data.processChilds);
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
        let modeling = modeler.get("modeling");;
        console.log(state.processChilds);
        modeler.importXML(props.data.xmlDiagram, function (err) {
            // chỉnh màu sắc task
            let infoTask = props.data.tasks
            let infos = info;

            if (infoTask) {
                for (let i in infoTask) {
                    if (infoTask[i].status === "finished") {
                        let element1 = (Object.keys(modeler.get('elementRegistry')).length > 0) && modeler.get('elementRegistry').get(infoTask[i].codeInProcess);
                        element1 && modeling.setColor(element1, {
                            fill: '#f9f9f9', // 9695AD
                            stroke: '#c4c4c7'
                        });
                        var outgoing = element1.outgoing;
                        outgoing.forEach(x => {
                            // console.log(x.businessObject.targetRef.id)
                            if (infos[x.businessObject.targetRef.id].status === "inprocess") {
                                var outgoingEdge = modeler.get('elementRegistry').get(x.id);

                                modeling.setColor(outgoingEdge, {
                                    stroke: '#c4c4c7',
                                    width: '5px'
                                })
                            }
                        })
                    }

                    if (infoTask[i].status === "inprocess") {
                        let element1 = (Object.keys(modeler.get('elementRegistry')).length > 0) && modeler.get('elementRegistry').get(infoTask[i].codeInProcess);

                        element1 && modeling.setColor(element1, {
                            fill: '#84ffb8',
                            stroke: '#14984c', //E02001
                            width: '5px'
                        });
                    }
                }
            }
        });
        setState({
            ...state,
            idProcess: props.idProcess,
            showInfo: false,
            info: info,
            processChilds: infoTemplate,
            processDescription: props.data.processDescription ? props.data.processDescription : '',
            processName: props.data.processName ? props.data.processName : '',
            status: props.data.status ? props.data.status : '',
            startDate: props.data.startDate ? formatDate(props.data.startDate) : '',
            endDate: props.data.endDate ? formatDate(props.data.endDate) : '',
            viewer: props.data.viewer ? props.data.viewer : '',
            xmlDiagram: props.data.xmlDiagram,
        })

    }, [props.idProcess])



    // Các hàm  xử lý sự kiện của bpmn

    const interactPopup = (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');
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
                    showInfoProcess:false,
                    type: element.type,
                    name: nameStr[1],
                    taskName: element.businessObject.name,
                    id: `${element.businessObject.id}`,
                }
            } else if (element.type === "bpmn:SubProcess") {
                if (!state.processChilds[`${element.businessObject.id}`] ||
                    (state.processChilds[`${element.businessObject.id}`] && !state.processChilds[`${element.businessObject.id}`].organizationalUnit)) {
                    state.processChilds[`${element.businessObject.id}`] = {
                        ...state.processChilds[`${element.businessObject.id}`],
                        organizationalUnit: props.listOrganizationalUnit[0]?._id,
                    }
                }

                return {
                    ...state,
                    showInfo: false,
                    showInfoProcess:true,
                    type: element.type,
                    name: nameStr[1],
                    taskName: element.businessObject.name,
                    id: `${element.businessObject.id}`,
                }
            }
            else {
                return { ...state,showInfoProcess:false, showInfo: false, type: element.type, name: '', id: element.businessObject.id, }
            }

        })
    }

    const downloadAsSVG = () => {
        modeler.saveSVG({ format: true }, function (error, svg) {
            if (error) {
                return;
            }

            var svgBlob = new Blob([svg], {
                type: 'image/svg+xml'
            });

            var fileName = Math.random(36).toString().substring(7) + '.svg';

            var downloadLink = document.createElement('a');
            downloadLink.download = fileName;
            downloadLink.innerHTML = 'Get BPMN SVG';
            downloadLink.href = window.URL.createObjectURL(svgBlob);
            downloadLink.onclick = function (event) {
                document.body.removeChild(event.target);
            };
            downloadLink.style.visibility = 'hidden';
            document.body.appendChild(downloadLink);
            downloadLink.click();
        });
    }

    const downloadAsBpmn = () => {
        modeler.saveXML({ format: true }, function (error, xml) {
            if (error) {
                return;
            }
        });
    }
    const downloadAsImage = () => {
        modeler.saveSVG({ format: true }, function (error, svg) {
            if (error) {
                return;
            }
            function triggerDownload(imgURI) {
                var evt = new MouseEvent('click', {
                    view: window,
                    bubbles: false,
                    cancelable: true
                });

                var a = document.createElement('a');
                a.setAttribute('download', 'MY_COOL_IMAGE.png');
                a.setAttribute('href', imgURI);
                a.setAttribute('target', '_blank');

                a.dispatchEvent(evt);
            }
            var canvas = document.createElement("CANVAS");
            var ctx = canvas.getContext('2d');
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            var DOMURL = window.URL || window.webkitURL || window;

            var img = new Image();
            var svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            var url = DOMURL.createObjectURL(svgBlob);

            img.onload = function () {

                DOMURL.revokeObjectURL(url);
                ctx.drawImage(img, 0, 0);
                var imgURI = canvas
                    .toDataURL('image/png')
                    .replace('image/png', 'image/octet-stream');

                triggerDownload(imgURI);
            };

            img.src = url;
        });
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

    const exportDiagram = () => {
        let xmlStr;
        modeler.saveXML({ format: true }, function (err, xml) {
            if (err) {
            }
            else {
                xmlStr = xml;
            }
        });
        setState(state => {
            return {
                ...state,
                xmlDiagram: xmlStr,
            }
        })
    }

    // Format date dd-mm-yyyy
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

    const handleDataProcess = async (name,value) => {
        // console.log(value);
        let processChilds = state.processChilds
        processChilds[`${state.id}`].process[name] = value
        console.log(processChilds);
        await setState(state => {
            return {
                ...state,
                processChilds: processChilds
            }
        });
        
    }
    const handleChangeNameProcessChild = async (value) => {
        let processChilds = state.processChilds
        processChilds[`${state.id}`].process.processName = value
        await setState(state => {
            return {
                ...state,
                processChilds: processChilds
            }
        });
    }

    // hàm cập nhật mô tả quy trình con
    const handleProcessDescProcessChild = async (value) => {
        let processChilds = state.processChilds
        processChilds[`${state.id}`].process.processDescription = value
        await setState(state => {
            return {
                ...state,
                processChilds: processChilds
            }
        });
    }

    const handleChangeManagerProcessChild = async (value) => {
        let processChilds = state.processChilds
        processChilds[`${state.id}`].process.manager = value
        await setState(state => {
            return {
                ...state,
                processChilds: processChilds
            }
        });
    }

    const handleChangeViewerProcessChild = async (value) => {
        let processChilds = state.processChilds
        processChilds[`${state.id}`].process.viewer = value
        await setState(state => {
            return {
                ...state,
                processChilds: processChilds
            }
        });
    }


    // hàm cập nhật các thông tin của task trong quy trình
    const handleChangeInfo = (value) => {
        let info = {
            ...value,
            codeInProcess: state.id
        }
        let infos = state.info
        let id = infos[`${state.id}`]._id

        infos[`${state.id}`] = { ...info, _id: id };
        // state.info[`${state.id}`] = info
        // console.log(infos[`${state.id}`]);
        setState({
            ...state,
            info: infos
        })
    }
    // hàm cập nhật tên công việc trong quy trình
    const handleChangeName = async (value) => {
        let stringName = value
        const modeling = modeler.get('modeling');
        let element1 = modeler.get('elementRegistry').get(state.id);
        modeling.updateProperties(element1, {
            shapeName: stringName,
        });

        // forceUpdate();
    }
    // hàm cập nhật người thực hiện công việc
    const handleChangeResponsible = async (value) => {
        // console.log(value)
        const modeling = modeler.get('modeling');
        let element1 = modeler.get('elementRegistry').get(state.id);
        let { user } = props
        let responsibleName
        let responsible = []
        value.forEach(x => {
            responsible.push(user.list.find(y => y._id == x).name)
        })
        modeling.updateProperties(element1, {
            responsibleName: responsible
        });

    }

    // hàm cập nhật người phê duyệt công việc
    const handleChangeAccountable = async (value) => {
        const modeling = modeler.get('modeling');
        let element1 = modeler.get('elementRegistry').get(state.id);
        let { user } = props
        let accountableName
        let accountable = []
        value.forEach(x => {
            accountable.push(user.list.find(y => y._id == x).name)
        })
        modeling.updateProperties(element1, {
            accountableName: accountable
        });
    }

    // hàm cập nhật Tên Quy trình
    const handleChangeBpmnName = async (e) => {
        let { value } = e.target;
        let { message } = ValidationHelper.validateName(props.translate, value);

        await setState(state => {
            return {
                ...state,
                processName: value,
                errorOnProcessName: message,
            }
        });
    }

    // hàm cập nhật mô tả quy trình
    const handleChangeBpmnDescription = async (e) => {
        let { value } = e.target;
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        await setState(state => {
            return {
                ...state,
                processDescription: value,
                errorOnProcessDescription: message,
            }
        });
    }

    // hàm cập nhật ngày bắt đầu công việc
    const handleChangeTaskStartDate = (value) => {
        validateTaskStartDate(value, true);
    }
    const validateTaskStartDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msgStart = TaskFormValidator.validateTaskStartDate(value, state.endDate ? state.endDate : "", translate);
        let msgEnd = TaskFormValidator.validateTaskEndDate(value, state.endDate ? state.endDate : "", translate);

        if (willUpdateState) {
            state.startDate = value;
            state.errorOnStartDate = msgStart;
            // state.errorOnEndDate = msgEnd;

            setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msgStart === undefined;
    }

    // hàm cập nhật ngày kết thúc công việc
    const handleChangeTaskEndDate = (value) => {
        validateTaskEndDate(value, true);
    }
    const validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msgEnd = TaskFormValidator.validateTaskEndDate(state.startDate ? state.startDate : "", value, translate);
        let msgStart = TaskFormValidator.validateTaskStartDate(state.startDate ? state.startDate : "", value, translate);

        if (willUpdateState) {
            state.endDate = value;
            state.errorOnEndDate = msgEnd;
            // state.errorOnStartDate = msgStart;

            setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msgEnd === undefined;
    }

    /**
     * Hàm cập nhật chọn status
     * @param {*} value giá trị status lựa chọn
     */
    const handleSelectedStatus = (value) => {
        setState(state => {
            return {
                ...state,
                status: value[0]
            }
        })
    }

    // Hàm cập nhật người được xem quy trình
    const handleChangeViewer = async (value) => {
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);

        await setState(state => {

            return {
                ...state,
                viewer: value,
                errorOnViewer: message,
            }
        })
    }

    // hàm validate form tạo quy trình công việc
    const isFormValidated = () => {
        let { errorOnEndDate, errorOnProcessDescription, errorOnProcessName, errorOnStartDate, errorOnViewer, startDate, endDate, viewer } = state;

        return errorOnEndDate === undefined && errorOnProcessDescription === undefined && errorOnProcessName === undefined && errorOnStartDate === undefined && errorOnViewer === undefined
            && startDate.trim() !== "" && endDate.trim() !== "";
    }

    // hàm lưu
    const save = async () => {
        // console.log("object");
        let { processName, processDescription, status, startDate, endDate, viewer, info ,userId} = state;
        // console.log(state);
        let xmlStr;
        modeler.saveXML({ format: true }, function (err, xml) {
            xmlStr = xml;
        });
        let elementList = modeler.get('elementRegistry')._elements
        console.log(elementList);
        await setState(state => {
            let { info } = state;
            for (let j in info) {
                if (Object.keys(info[j]).length !== 0) {
                    info[j].followingTasks = [];
                    info[j].preceedingTasks = [];

                    for (let i in elementList) {
                        let elem = elementList[i].element;
                        if (info[j].codeInProcess === elem.id) {
                            if (elem.businessObject.incoming) {
                                let incoming = elem.businessObject.incoming;
                                for (let x in incoming) {
                                    let types = incoming[x].sourceRef.$type.split(":")
                                    // console.log(incoming[x].sourceRef.$type,types);
                                    if (types[1] === 'SubProcess'){
                                        info[j].preceedingTasks.push({ // các công việc trc công việc hiện tại
                                            process: incoming[x].sourceRef.id,
                                            link: incoming[x].name,
                                            // TODO: activated: false
                                        })
                                    } else {
                                        info[j].preceedingTasks.push({ // các công việc trc công việc hiện tại
                                            task: incoming[x].sourceRef.id,
                                            link: incoming[x].name,
                                            // TODO: activated: false
                                        })
                                    }
                                }
                            }
                            if (elem.businessObject.outgoing) {
                                let outgoing = elem.businessObject.outgoing;
                                for (let y in outgoing) {
                                    let types = outgoing[y].sourceRef.$type.split(":")
                                    if (types[1] === 'SubProcess'){
                                        info[j].followingTasks.push({ // các công việc sau công việc hiện tại
                                            process: outgoing[y].targetRef.id,
                                            link: outgoing[y].name,
                                        })
                                    } else {
                                        info[j].followingTasks.push({ // các công việc sau công việc hiện tại
                                            task: outgoing[y].targetRef.id,
                                            link: outgoing[y].name,
                                        })
                                    }
                                }
                            }
                        }

                    
                    }
                }
            }
            let { processChilds } = state;
            for (let j in processChilds) {
                if (Object.keys(processChilds[j]).length !== 0) {
                    processChilds[j].followingTasks = [];
                    processChilds[j].preceedingTasks = [];

                    for (let i in elementList) {
                        let elem = elementList[i].element;
                        if (processChilds[j].code === elem.id) {
                            if (elem.businessObject.incoming) {
                                let incoming = elem.businessObject.incoming;
                                for (let x in incoming) {
                                    let types = incoming[x].sourceRef.$type.split(":")
                                    // console.log(incoming[x].sourceRef.$type,types);
                                    if (types[1] === 'SubProcess'){
                                        processChilds[j].preceedingTasks.push({ // các công việc trc công việc hiện tại
                                            process: incoming[x].sourceRef.id,
                                            link: incoming[x].name,
                                            // TODO: activated: false
                                        })
                                    } else {
                                        processChilds[j].preceedingTasks.push({ // các công việc trc công việc hiện tại
                                            task: incoming[x].sourceRef.id,
                                            link: incoming[x].name,
                                            // TODO: activated: false
                                        })
                                    }
                                }
                            }
                            if (elem.businessObject.outgoing) {
                                let outgoing = elem.businessObject.outgoing;
                                for (let y in outgoing) {
                                    let types = outgoing[y].sourceRef.$type.split(":")
                                    if (types[1] === 'SubProcess'){
                                        processChilds[j].followingTasks.push({ // các công việc sau công việc hiện tại
                                            process: outgoing[y].targetRef.id,
                                            link: outgoing[y].name,
                                        })
                                    } else {
                                        processChilds[j].followingTasks.push({ // các công việc sau công việc hiện tại
                                            task: outgoing[y].targetRef.id,
                                            link: outgoing[y].name,
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return {
                ...state,
                xmlDiagram: xmlStr,
            }
        })
        let { idProcess } = props;
        let data = {
            processName: processName,
            processDescription: processDescription,
            status: status,
            startDate: startDate,
            endDate: endDate,
            creator: userId,
            info: info,
            processChilds:processChilds,
            viewer: viewer,
            xmlDiagram: xmlStr,
            id: idProcess
        }  
        props.editProcessInfo(idProcess, data);

    }

    const { translate, role, user } = props;
    const { idProcess } = props;
    const { id, info, processChilds, viewer, startDate, endDate, taskName, showInfo, showInfoProcess, status, processDescription, processName, errorOnViewer, errorOnProcessName, errorOnEndDate, errorOnStartDate, errorOnProcessDescription } = state;
    // lấy danh sách các nhân viên trong cả công ty
    let listUserCompany = user?.usercompanys;
    let listItem = [];
    if (listUserCompany && listUserCompany.length !== 0) {
        listItem = listUserCompany.map(item => { return { text: item.name, value: item._id } });
    }

    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }

    let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);

    // Mảng cấu hình trạng thái công việc
    let statusArr = [
        { value: "inprocess", text: translate('task.task_management.inprocess') },
        { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
        { value: "finished", text: translate('task.task_management.finished') },
        { value: "delayed", text: translate('task.task_management.delayed') },
        { value: "canceled", text: translate('task.task_management.canceled') }
    ];
    // console.log(processChilds);
    return (
        <React.Fragment>
            <DialogModal
                size='100' modalID={`modal-edit-process-no-init-task-list`} isLoading={false}
                formID="modal-edit-process-no-init-task-list"
                disableSubmit={!isFormValidated()}
                title={props.title}
                func={save}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            >
                <div>
                    {/* {id !== undefined &&
                            <ModalDetailTask action={"edit-process"} task={(info && info[`${id}`]) && info[`${id}`]} isProcess={true} />
                        } */}

                    <div className={'row'}>
                        {/* Quy trình công việc */}
                        <div className={`contain-border ${showInfo || showInfoProcess ? 'col-md-8' : 'col-md-12'}`}>
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

                        {showInfo &&
                            <div className={`right-content ${showInfo ? 'col-md-4' : undefined}`}>
                                <AddTaskForm
                                    isProcess={true}
                                    id={id}
                                    info={(info && info[`${id}`]) && info[`${id}`]}
                                    handleChangeTaskData={handleChangeInfo}
                                    handleChangeName={handleChangeName} // cập nhật tên vào diagram
                                    handleChangeResponsible={handleChangeResponsible} // cập nhật hiển thi diagram
                                    handleChangeAccountable={handleChangeAccountable} // cập nhật hiển thị diagram
                                />
                            </div>
                        }
                        {
                            (showInfoProcess) &&
                            <div className={`right-content ${showInfoProcess ? 'col-md-4' : undefined}`}>
                                <div>
                                    <h3>{translate("task.task_process.create_task_with_template")} {taskName}</h3>
                                </div>
                                <EditProcessChild
                                    user={user}
                                    id={id}
                                    infoTemplate={(processChilds && processChilds[`${id}`]) && processChilds[`${id}`].process}
                                     handleDataProcessChild={handleDataProcess}
                                    handleChangeNameProcessChild={handleChangeNameProcessChild} // cập nhật tên vào diagram
                                    handleProcessDescProcessChild={handleProcessDescProcessChild} // cập nhật mô tả vào diagram
                                    handleChangeManagerProcessChild={handleChangeManagerProcessChild} // cập nhật hiển thi diagram
                                    handleChangeViewerProcessChild={handleChangeViewerProcessChild} // cập nhật hiển thị diagram
                                    //setBpmnProcess={setBpmnProcess}
                                />
                            </div>
                        }
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )

}

function mapState(state) {
    const { user, auth, role } = state;
    return { user, auth, role };
}

const actionCreators = {
    getAllUsers: UserActions.get,
    getAllDepartments: DepartmentActions.get,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getDepartment: UserActions.getDepartmentOfUser,
    getTaskById: performTaskAction.getTaskById,
    getAllUsersWithRole: UserActions.getAllUsersWithRole,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    editProcessInfo: TaskProcessActions.editProcessInfo,
};
const connectedModalEditProcessNoInit = connect(mapState, actionCreators)(withTranslate(ModalEditProcessNoInit));
export { connectedModalEditProcessNoInit as ModalEditProcessNoInit };
