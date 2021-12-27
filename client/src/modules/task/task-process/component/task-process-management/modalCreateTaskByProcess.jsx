import React, { Component, useEffect, useMemo, useState } from "react";
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, SelectBox, ErrorLabel, DatePicker } from "../../../../../common-components";
import { TaskProcessActions } from "../../redux/actions";
import { DepartmentActions } from "../../../../super-admin/organizational-unit/redux/actions";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { TaskFormValidator } from "../../../task-management/component/taskFormValidator";
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'

import { FormCreateTask } from './formCreateTask'

import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import customModule from '../custom-task-process-template'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import '../process-template/processDiagram.css'
import getEmployeeSelectBoxItems from "../../../organizationalUnitHelper";
import { TaskAddModal } from "../../../task-management/component/taskAddModal";
import { AddTaskForm } from "../../../task-management/component/addTaskForm";
import ValidationHelper from '../../../../../helpers/validationHelper';

// custom element
ElementFactory.prototype._getDefaultSize = function (semantic) {

    if (is(semantic, 'bpmn:Task')) {
        return { width: 160, height: 130 };
    }
    if (is(semantic, 'bpmn:SubProcess')) {
		return { width: 260, height: 180 };
	}
    if (is(semantic, 'bpmn:Gateway')) {
        return { width: 50, height: 50 };
    }

    if (is(semantic, 'bpmn:Event')) {
        return { width: 36, height: 36 };
    }

    if (is(semantic, 'bpmn:TextAnnotation')) {
        return { width: 100, height: 30 };
    }
    return { width: 100, height: 80 };

};

//Xóa element khỏi palette 
var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
PaletteProvider.prototype.getPaletteEntries = function (element) {
    var entries = _getPaletteEntries.apply(this);
    delete entries['create.subprocess-expanded'];
    delete entries['create.data-store'];
    delete entries['create.data-object'];
    delete entries['create.group'];
    delete entries['create.participant-expanded'];
    delete entries['create.intermediate-event'];
    delete entries['create.task'];
    return entries;
}

// diagram khởi tạo
const InitialDiagram =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
    'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
    'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
    'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
    'targetNamespace="http://bpmn.io/schema/bpmn" ' +
    'id="Definitions_1">' +
    '<bpmn:process id="Process_1" isExecutable="false">' +
    // '<bpmn:startEvent id="StartEvent_1"/>' +
    '</bpmn:process>' +
    '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
    '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
    '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
    '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' +
    '</bpmndi:BPMNShape>' +
    '</bpmndi:BPMNPlane>' +
    '</bpmndi:BPMNDiagram>' +
    '</bpmn:definitions>';

// zoom level mặc định, dùng cho zoomin zoomout
var zlevel = 1;

function ModalCreateTaskByProcess(props) {

    const [state, setState] = useState({
        userId: getStorage("userId"),
        currentRole: getStorage('currentRole'),
        showInfo: false,
        selectedCreate: 'info',
        info: {},
        save: false,
        manager: [],
        viewer: [],
        processName: '',
        processDescription: '',
        indexRenderer: 0,
    })
    const initialDiagram = InitialDiagram
    const [modeler, setModeler] = useState(new BpmnModeler({
        additionalModules: [
            customModule,
            { zoomScroll: ['value', ''] }
        ],
    }));
    const generateId = "createprocess"

    if (state.save === true) {
		props.getAllDepartments()
		modeler.importXML(initialDiagram);
		setState({
			...state,
			save: false,
		});
	}
    // modeling = modeler.get('modeling');
    useEffect(() => {
        props.getAllUsers();
        props.getAllDepartments();
		modeler.attachTo('#' + generateId);
		modeler.importXML(initialDiagram);
		var eventBus = modeler.get('eventBus');
		//Vo hieu hoa double click edit label
		eventBus.on('element.dblclick', 10000, function (event) {
			var element = event.element;

			if (isAny(element, ['bpmn:Task'])) {
				return false; // will cancel event
			}
		});

		//Vo hieu hoa edit label khi tao shape
		eventBus.on([
			'create.end',
			'autoPlace.end'
		], 250, (e) => {
			// if (e.element[0].type === "bpmn:Task") {
			modeler.get('directEditing').cancel()
			// }
		});

		modeler.on('element.click', 1, (e) => interactPopup(e));

		modeler.on('shape.remove', 1000, (e) => deleteElements(e));

		modeler.on('commandStack.shape.delete.revert', (e) => handleUndoDeleteElement(e));

    }, [])
    // useMemo(() => {
    //     if (state.save === true) {
    //         props.getAllDepartments()
    //         modeler.importXML(initialDiagram);
    //         setState({
    //             ...state,
    //             save: false,
    //         });
    //     }
    // }, [state.save])
    
    // Hàm đổi tên Quy trình
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

    // Hàm cập nhật mô tả quy trình
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
    
    // hàm up date thông tin task vào diagram xml
    const handleUpdateElement = (abc) => {
        const modeling = modeler.get('modeling');
        let element1 = modeler.get('elementRegistry').get(state.id);
        modeling.updateProperties(element1, {
            info: state.info,
        });
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

    // hàm cập nhật màu sắc trong diagram
    const done = (e) => {
        e.preventDefault()
        const modeling = modeler.get('modeling');
        let element1 = modeler.get('elementRegistry').get(state.id);
        modeling.setColor(element1, {
            fill: '#dde6ca',
            stroke: '#6b7060'
        });
        let target = [];
        element1.outgoing.forEach(x => {
            target.push(x.target.id)
        })
        target.forEach(x => {
            modeling.setColor(modeler.get('elementRegistry').get(x), {
                fill: '#7236ff',
                stroke: '#7236ff'
            });
        })
    }
    // Các hàm sự kiện của BPMN element
    const interactPopup = async (event) => {
        let element = event.element;
        let nameStr = element.type.split(':');
        let organizationalUnit
        if (props.department && props.department?.tree && props.department?.tree.length !==0){
            organizationalUnit = props.department?.tree[0]?.id
        }
        setState(state => {
            if (element.type === "bpmn:Task" || element.type === "bpmn:ExclusiveGateway") {
                if (!state.info[`${element.businessObject.id}`] || (state.info[`${element.businessObject.id}`] && !state.info[`${element.businessObject.id}`].organizationalUnit)) {
                    state.info[`${element.businessObject.id}`] = {
                        ...state.info[`${element.businessObject.id}`],
                        organizationalUnit: organizationalUnit,
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
        }, () => console.log(state.info))

    }
    const deleteElements = (event) => {
        var element = event.element;
        delete state.info[`${state.id}`];
        setState(state => {
            return {
                ...state,
                showInfo: false,
            }
        })
    }

    const handleUndoDeleteElement = (event) => {
        var element = event.context.shape;
    }

    const changeNameElement = (event) => {
        var name = event.element.businessObject.name;
    }

    // các hàm dành cho export, import, download diagram...
    const exportDiagram = () => {
        let xmlStr;
        modeler.saveXML({ format: true }, function (err, xml) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(xml);
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

    // Các hàm xử lý tabbedPane
    const handleChangeContent = async (content) => {
        await setState(state => {
            return {
                ...state,
                selectedCreate: content
            }
        })
    }

    // hàm cập nhật các thông tin của task trong quy trình
    const handleChangeInfo = (value) => {
        let info = {
            ...value,
            code: state.id,
            organizationalUnit: props.department.tree[0].id
        }

        const infos = state.info
        infos[`${state.id}`] = info ;
        
        state.info[`${state.id}`] = info
        setState({
                ...state,
                info: infos
            })
    }

    // validate quy trình
    const isFormValidate = () => {
        let elementList = modeler.get('elementRegistry')._elements;
        let check = true; // valid
        let hasStart = false, hasEnd = false

        let validateTasks = true;
        let { info } = state;

        for (let i in info) {
            let taskItem = info[i];
            if (!taskItem.name || (taskItem.name?.trim() === '')) { // taskItem.organizationalUnit.trim() === '' ||
                validateTasks = false;
            }
        }

        for (let i in elementList) {

            let e = elementList[i].element;
            if (e.type === "bpmn:StartEvent") {
                hasStart = true;
            }
            else if (e.type === "bpmn:EndEvent") {
                hasEnd = true;
            }
            else if (e.type === "bpmn:Task" || e.type === "bpmn:ExclusiveGateway") {
                if (!e.businessObject.incoming) {
                    check = false;
                }
                else if (e.businessObject.incoming.length === 0) {
                    check = false;
                }

                if (!e.businessObject.outgoing) {
                    check = false;
                }
                else if (e.businessObject.outgoing.length === 0) {
                    check = false;
                }
            }
        }
        if (!hasStart || !hasEnd) {
            check = false;
        }
        return check && state.manager.length !== 0 && state.viewer.length !== 0 && validateTasks
            && state.processDescription.trim() !== '' && state.processName.trim() !== ''
            && state.errorOnManager === undefined && state.errorOnProcessDescription === undefined
            && state.errorOnProcessName === undefined && state.errorOnViewer === undefined;
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

    // Hàm cập nhật người quản lý quy trình
    const handleChangeManager = async (value) => {
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);

        await setState(state => {

            return {
                ...state,
                manager: value,
                errorOnManager: message,
            }
        })
    }

    // hàm cập nhật độ ưu tiên
    const handleChangeTaskPriority = (value) => {
        state.info[`${state.id}`].priority = value;
        setState(state => {
            return {
                ...state,
            };
        });
    }

    // hàm validate form tạo quy trình công việc
    const isTaskFormValidated = () => {
        let { errorOnEndDate, errorOnProcessDescription, errorOnProcessName, errorOnStartDate, startDate, endDate, viewer, manager, errorOnManager, errorOnViewer } = state;

        return errorOnEndDate === undefined && errorOnProcessDescription === undefined && errorOnProcessName === undefined && errorOnStartDate === undefined
            && errorOnViewer === undefined && errorOnManager === undefined && manager.length !== 0 && viewer.length !== 0
            && startDate.trim() !== "" && endDate.trim() !== "";
    }
    // Hàm lưu thông tin 
    const save = async () => {
        let { info, startDate, endDate, userId, processName, processDescription, xmlDiagram, viewer, manager } = state;
        // console.log("info", info)
        let xmlStr;
        modeler.saveXML({ format: true }, function (err, xml) {
            xmlStr = xml;
        });

        await setState(state => {
            return {
                ...state,
                xmlDiagram: xmlStr,
            }
        });

        for (let i in info) {
            info[i].startDate = info[i].startDate ? info[i].startDate : startDate;
            info[i].endDate = info[i].endDate ? info[i].endDate : endDate;
        }

        let data = {
            processName: processName,
            processDescription: processDescription,
            viewer: viewer,
            manager: manager,
            xmlDiagram: xmlStr,
            creator: userId,
            taskList: info,
            startDate: startDate,
            endDate: endDate,
            template: false
        }
        props.createTaskByProcess(data, state.idProcess);

        setState({
            userId: getStorage("userId"),
            currentRole: getStorage('currentRole'),
            showInfo: false,
            selectedCreate: 'info',
            info: {},
            save: true,
            manager: [],
            viewer: [],
            processName: '',
            processDescription: '',
            indexRenderer: 0,
        })
    }
    let idProcess = ""
    const { translate, department, role, user } = props;
    const { id, name, info, showInfo, processDescription, processName, viewer, manager, selectedCreate, indexRenderer, type, errorOnEndDate, errorOnStartDate, errorOnManager, errorOnViewer,
        selected, errorOnProcessName, errorOnProcessDescription, startDate, endDate } = state;
    const { listOrganizationalUnit } = props;
    // if (type === "bpmn:ExclusiveGateway" && info && id && info[id].name) {
    //     window.$(`.task-process-gate-way-title`).css("background-color", "white")
    // }
    let listRole = [];
    if (role && role.list.length !== 0) listRole = role.list;
    let listItem = listRole.filter(e => ['Admin', 'Super Admin', 'Manager', 'Deputy Manager', 'Employee'].indexOf(e.name) === -1)
        .map(item => { return { text: item.name, value: item._id } });
    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }
    var usersOfChildrenOrganizationalUnit;
    if (user && user.usersOfChildrenOrganizationalUnit) {
        usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
    }
    let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);
    return (
        <React.Fragment>
            <DialogModal
                size='100'
                modalID="modal-create-task-by-process"
                isLoading={false}
                formID="form-create-task-by-process"
                resetOnSave={true}
                resetOnClose={true}
                title={props.title}
                func={save}
                disableSubmit={!isFormValidate()}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            >
                <form id="form-create-task-by-process">
                    <div>
                        <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                            {/* Tabbed pane */}
                            <ul className="nav nav-tabs">
                                {/* Nút tab thông tin cơ bản quy trình */}
                                <li className="active"><a href="#info-create" onClick={() => handleChangeContent("info")} data-toggle="tab">{translate("task.task_process.process_information")}</a></li>
                                {/* Nút tab quy trình - công việc */}
                                <li><a href="#process-create" onClick={() => handleChangeContent("process")} data-toggle="tab">{translate("task.task_process.task_process")}</a></li>
                            </ul>

                            {/* Tab Thông tin quy trình */}
                            <div className="tab-content">
                                <div className={selectedCreate === "info" ? "active tab-pane" : "tab-pane"} id="info-create-task">
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            {/* Tên quy trình */}
                                            <div className={`form-group ${errorOnProcessName === undefined ? "" : "has-error"}`}>
                                                <label>{translate("task.task_process.process_name")} <span style={{ color: "red" }}>*</span></label>
                                                <input type="text"
                                                    value={processName}
                                                    className="form-control" placeholder={translate("task.task_process.process_name")}
                                                    onChange={handleChangeBpmnName}
                                                />
                                                <ErrorLabel content={errorOnProcessName} />
                                            </div>

                                            {/* Mô tả quy trình */}
                                            <div className={`form-group ${errorOnProcessDescription === undefined ? "" : "has-error"}`}>
                                                <label>{translate("task.task_process.process_description")} <span style={{ color: "red" }}>*</span></label>
                                                <textarea type="text" rows={4} style={{ minHeight: '103.5px' }}
                                                    value={processDescription}
                                                    className="form-control" placeholder={translate("task.task_process.process_description")}
                                                    onChange={handleChangeBpmnDescription}
                                                />
                                                <ErrorLabel content={errorOnProcessDescription} />
                                            </div>
                                        </div>

                                        <div className='col-md-6'>
                                            {/* Ngày bắt đầu - kết thúc quy trình */}
                                            <div className="row form-group">
                                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                                    <label className="control-label">{translate('task.task_management.start_date')} <span style={{ color: "red" }}>*</span></label>
                                                    <DatePicker
                                                        id={`datepicker1-process-${idProcess}`}
                                                        dateFormat="day-month-year"
                                                        value={startDate}
                                                        onChange={handleChangeTaskStartDate}
                                                    />
                                                    <ErrorLabel content={errorOnStartDate} />
                                                </div>
                                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                                    <label className="control-label">{translate('task.task_management.end_date')} <span style={{ color: "red" }}>*</span></label>
                                                    <DatePicker
                                                        id={`datepicker2-process-${idProcess}`}
                                                        value={endDate}
                                                        onChange={handleChangeTaskEndDate}
                                                    />
                                                    <ErrorLabel content={errorOnEndDate} />
                                                </div>
                                            </div>

                                            <div className={`form-group ${errorOnViewer === undefined ? "" : "has-error"}`}>
                                                {/* Người được xem quy trình */}
                                                <label className="control-label">{translate("task.task_process.viewer")} <span style={{ color: "red" }}>*</span></label>
                                                {allUnitsMember &&
                                                    <SelectBox
                                                        id={`select-viewer-employee-create-task-by-process-${indexRenderer}-${idProcess}`}
                                                        className="form-control select2"
                                                        style={{ width: "100%" }}
                                                        items={allUnitsMember}
                                                        onChange={handleChangeViewer}
                                                        multiple={true}
                                                        value={viewer}
                                                    />
                                                }
                                                <ErrorLabel content={errorOnViewer} />
                                            </div>
                                            <div className={`form-group ${errorOnManager === undefined ? "" : "has-error"}`}>
                                                {/* Người quản lý quy trình */}
                                                <label className="control-label" >{translate("task.task_process.manager")} <span style={{ color: "red" }}>*</span></label>
                                                {allUnitsMember &&
                                                    <SelectBox
                                                        id={`select-manager-employee-create-task-by-process-${indexRenderer}-${idProcess}`}
                                                        className="form-control select2"
                                                        style={{ width: "100%" }}
                                                        items={allUnitsMember}
                                                        onChange={handleChangeManager}
                                                        multiple={true}
                                                        value={manager}
                                                    />
                                                }
                                                <ErrorLabel content={errorOnManager} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Tab quy trình - công việc */}
                            <div className="tab-content" style={{ padding: 0, marginTop: -15 }}>
                                <div className={selectedCreate === "process" ? "active tab-pane" : "tab-pane"} id="process-create">

                                    <div className="">
                                        {/* Quy trình công việc */}
                                        <div className={`contain-border ${showInfo ? 'col-md-8' : 'col-md-12'}`}>
                                            {/* nút export, import diagram,... */}
                                            <div className="tool-bar-xml" style={{ /*position: "absolute", right: 5, top: 5*/ }}>
                                                <button onClick={exportDiagram}>Export XML</button>
                                                <button onClick={downloadAsSVG}>Save SVG</button>
                                                <button onClick={downloadAsImage}>Save Image</button>
                                                <button onClick={downloadAsBpmn}>Download BPMN</button>
                                            </div>

                                            {/* phần vẽ biểu đồ */}
                                            <div id={generateId}></div>

                                            {/* Nút zoom in, zoom out */}
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

                                        {/* form thông tin công việc */}
                                        <div className={`right-content ${showInfo ? 'col-md-4' : undefined}`}>
                                            {
                                                (showInfo) &&
                                                <div>
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
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    )
}


function mapState(state) {
    const { user, auth, department, role } = state;
    return { user, auth, department, role };
}

const actionCreators = {
    getAllUsers: UserActions.get,
    getAllDepartments: DepartmentActions.get,
    getDepartment: UserActions.getDepartmentOfUser,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    createXmlDiagram: TaskProcessActions.createXmlDiagram,
    getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
    createTaskByProcess: TaskProcessActions.createTaskByProcess,
};
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(ModalCreateTaskByProcess));
export { connectedModalAddProcess as ModalCreateTaskByProcess };
