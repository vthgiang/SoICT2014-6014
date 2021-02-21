import React, { Component } from "react";
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, SelectBox, ErrorLabel, DatePicker } from "../../../../../common-components";
import { TaskProcessActions } from "../../redux/actions";
import { DepartmentActions } from "../../../../super-admin/organizational-unit/redux/actions";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { TaskProcessValidator } from '../process-template/taskProcessValidator';
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
// custom element
ElementFactory.prototype._getDefaultSize = function (semantic) {

    if (is(semantic, 'bpmn:Task')) {
        return { width: 160, height: 130 };
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
const initialDiagram =
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

class ModalCreateTaskByProcess extends Component {

    constructor() {
        super();
        this.state = {
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
        }
        this.initialDiagram = initialDiagram
        this.modeler = new BpmnModeler({
            additionalModules: [
                customModule,
                { zoomScroll: ['value', ''] }
            ],
        });
        this.modeling = this.modeler.get('modeling');
        this.generateId = "createprocess"
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.save === true) {
            this.props.getAllDepartments()
            this.modeler.importXML(this.initialDiagram);
            this.setState({
                save: false,
            });
            return true;
        }
        return true
    }

    componentDidMount() {
        this.props.getAllUsers();
        this.props.getAllDepartments();
        this.modeler.attachTo('#' + this.generateId);
        this.modeler.importXML(this.initialDiagram);
        var eventBus = this.modeler.get('eventBus');
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
            this.modeler.get('directEditing').cancel()
            // }
        });

        this.modeler.on('element.click', 1, (e) => this.interactPopup(e));

        this.modeler.on('shape.remove', 1000, (e) => this.deleteElements(e));

        this.modeler.on('commandStack.shape.delete.revert', (e) => this.handleUndoDeleteElement(e));

        // this.modeler.on('shape.changed', 1, (e) => this.changeNameElement(e));
    }

    // Hàm đổi tên Quy trình
    handleChangeBpmnName = async (e) => {
        let { value } = e.target;
        let msg = TaskProcessValidator.validateProcessName(value, this.props.translate);
        await this.setState(state => {
            return {
                ...state,
                processName: value,
                errorOnProcessName: msg,
            }
        });
    }

    // Hàm cập nhật mô tả quy trình
    handleChangeBpmnDescription = async (e) => {
        let { value } = e.target;
        await this.setState(state => {
            return {
                ...state,
                processDescription: value,
                errorOnProcessDescription: TaskProcessValidator.validateProcessDescription(value, this.props.translate),
            }
        });
    }

    // Hàm cập nhật người được xem quy trình
    handleChangeViewer = async (value) => {
        await this.setState(state => {

            return {
                ...state,
                viewer: value,
                errorOnViewer: TaskProcessValidator.validateViewer(value, this.props.translate),
            }
        })
    }

    // Hàm cập nhật người quản lý quy trình
    handleChangeManager = async (value) => {
        await this.setState(state => {

            return {
                ...state,
                manager: value,
                errorOnManager: TaskProcessValidator.validateManager(value, this.props.translate),
            }
        })
    }

    // Các hàm cập nhật thông tin task

    // hàm up date thông tin task vào diagram xml
    handleUpdateElement = (abc) => {
        const modeling = this.modeler.get('modeling');
        let element1 = this.modeler.get('elementRegistry').get(this.state.id);
        modeling.updateProperties(element1, {
            info: this.state.info,
        });
    }

    // hàm cập nhật tên công việc trong quy trình
    handleChangeName = async (value) => {
        let stringName = value
        const modeling = this.modeler.get('modeling');
        let element1 = this.modeler.get('elementRegistry').get(this.state.id);
        modeling.updateProperties(element1, {
            shapeName: stringName,
        });

        this.forceUpdate();
    }

    // hàm cập nhật người thực hiện công việc
    handleChangeResponsible = async (value) => {
        console.log(value)
        const modeling = this.modeler.get('modeling');
        let element1 = this.modeler.get('elementRegistry').get(this.state.id);
        let { user } = this.props
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
    handleChangeAccountable = async (value) => {
        const modeling = this.modeler.get('modeling');
        let element1 = this.modeler.get('elementRegistry').get(this.state.id);
        let { user } = this.props
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
    done = (e) => {
        e.preventDefault()
        let element1 = this.modeler.get('elementRegistry').get(this.state.id);
        this.modeling.setColor(element1, {
            fill: '#dde6ca',
            stroke: '#6b7060'
        });
        let target = [];
        element1.outgoing.forEach(x => {
            target.push(x.target.id)
        })
        target.forEach(x => {
            this.modeling.setColor(this.modeler.get('elementRegistry').get(x), {
                fill: '#7236ff',
                stroke: '#7236ff'
            });
        })
    }

    // Các hàm sự kiện của BPMN element
    interactPopup = async (event) => {
        let element = event.element;
        console.log(element);
        let nameStr = element.type.split(':');

        await this.setState(state => {
            if (element.type === "bpmn:Task" || element.type === "bpmn:ExclusiveGateway") {
                if (!state.info[`${element.businessObject.id}`] || (state.info[`${element.businessObject.id}`] && !state.info[`${element.businessObject.id}`].organizationalUnit)) {
                    state.info[`${element.businessObject.id}`] = {
                        ...state.info[`${element.businessObject.id}`],
                        organizationalUnit: this.props.listOrganizationalUnit[0]?._id,
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

    }

    deleteElements = (event) => {
        var element = event.element;
        console.log(element);
        this.setState(state => {
            delete state.info[`${state.id}`];
            return {
                ...state,
                showInfo: false,
            }
        })
        console.log(this.state);
    }

    handleUndoDeleteElement = (event) => {
        var element = event.context.shape;
    }

    changeNameElement = (event) => {
        var name = event.element.businessObject.name;
    }

    // các hàm dành cho export, import, download diagram...
    exportDiagram = () => {
        let xmlStr;
        this.modeler.saveXML({ format: true }, function (err, xml) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(xml);
                xmlStr = xml;
            }
        });
        this.setState(state => {
            return {
                ...state,
                xmlDiagram: xmlStr,
            }
        })
    }

    downloadAsSVG = () => {
        this.modeler.saveSVG({ format: true }, function (error, svg) {
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

    downloadAsBpmn = () => {
        this.modeler.saveXML({ format: true }, function (error, xml) {
            if (error) {
                return;
            }
        });
    }

    downloadAsImage = () => {
        this.modeler.saveSVG({ format: true }, function (error, svg) {
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


    handleZoomOut = async () => {
        let zstep = 0.2;
        let canvas = this.modeler.get('canvas');
        let eventBus = this.modeler.get('eventBus');

        // set initial zoom level
        canvas.zoom(zlevel, 'auto');

        // update our zoom level on viewbox change
        await eventBus.on('canvas.viewbox.changed', function (evt) {
            zlevel = evt.viewbox.scale;
        });
        zlevel = Math.max(zlevel - zstep, zstep);
        canvas.zoom(zlevel, 'auto');
    }

    handleZoomReset = () => {
        let canvas = this.modeler.get('canvas');
        canvas.zoom('fit-viewport');
    }

    handleZoomIn = async () => {
        let zstep = 0.2;
        let canvas = this.modeler.get('canvas');
        let eventBus = this.modeler.get('eventBus');

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
    handleChangeContent = async (content) => {
        await this.setState(state => {
            return {
                ...state,
                selectedCreate: content
            }
        })
    }

    // hàm cập nhật các thông tin của task trong quy trình
    handleChangeInfo = (value) => {
        let info = {
            ...value,
            code: this.state.id
        }

        this.setState(
            state => {
                state.info[`${state.id}`] = info
            })
        console.log(this.state.info)    

    }

    // validate quy trình
    isFormValidate = () => {
        let elementList = this.modeler.get('elementRegistry')._elements;
        let check = true; // valid
        let hasStart = false, hasEnd = false

        let validateTasks = true;
        let { info } = this.state;

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
        return check && this.state.manager.length !== 0 && this.state.viewer.length !== 0 && validateTasks
            && this.state.processDescription.trim() !== '' && this.state.processName.trim() !== ''
            && this.state.errorOnManager === undefined && this.state.errorOnProcessDescription === undefined
            && this.state.errorOnProcessName === undefined && this.state.errorOnViewer === undefined;
    }
    // hàm cập nhật ngày bắt đầu công việc
    handleChangeTaskStartDate = (value) => {
        this.validateTaskStartDate(value, true);
    }
    validateTaskStartDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msgStart = TaskFormValidator.validateTaskStartDate(value, this.state.endDate ? this.state.endDate : "", translate);
        let msgEnd = TaskFormValidator.validateTaskEndDate(value, this.state.endDate ? this.state.endDate : "", translate);

        if (willUpdateState) {
            this.state.startDate = value;
            this.state.errorOnStartDate = msgStart;
            // this.state.errorOnEndDate = msgEnd;

            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msgStart === undefined;
    }

    // hàm cập nhật ngày kết thúc công việc
    handleChangeTaskEndDate = (value) => {
        this.validateTaskEndDate(value, true);
    }
    validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msgEnd = TaskFormValidator.validateTaskEndDate(this.state.startDate ? this.state.startDate : "", value, translate);
        let msgStart = TaskFormValidator.validateTaskStartDate(this.state.startDate ? this.state.startDate : "", value, translate);

        if (willUpdateState) {
            this.state.endDate = value;
            this.state.errorOnEndDate = msgEnd;
            // this.state.errorOnStartDate = msgStart;

            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msgEnd === undefined;
    }


    // Hàm cập nhật người được xem quy trình
    handleChangeViewer = async (value) => {
        await this.setState(state => {

            return {
                ...state,
                viewer: value,
                errorOnViewer: TaskProcessValidator.validateViewer(value, this.props.translate),
            }
        })
    }

    // Hàm cập nhật người quản lý quy trình
    handleChangeManager = async (value) => {
        await this.setState(state => {

            return {
                ...state,
                manager: value,
                errorOnManager: TaskProcessValidator.validateManager(value, this.props.translate),
            }
        })
    }

    // hàm cập nhật độ ưu tiên
    handleChangeTaskPriority = (value) => {
        this.state.info[`${this.state.id}`].priority = value;
        this.setState(state => {
            return {
                ...state,
            };
        });
    }

    // hàm validate form tạo quy trình công việc
    isTaskFormValidated = () => {
        let { errorOnEndDate, errorOnProcessDescription, errorOnProcessName, errorOnStartDate, startDate, endDate, viewer, manager, errorOnManager, errorOnViewer } = this.state;

        return errorOnEndDate === undefined && errorOnProcessDescription === undefined && errorOnProcessName === undefined && errorOnStartDate === undefined
            && errorOnViewer === undefined && errorOnManager === undefined && manager.length !== 0 && viewer.length !== 0
            && startDate.trim() !== "" && endDate.trim() !== "";
    }
    // Hàm lưu thông tin 
    save = async () => {
        let { info, startDate, endDate, userId, processName, processDescription, xmlDiagram, viewer, manager } = this.state;
        console.log("info",info)
        let xmlStr;
        this.modeler.saveXML({ format: true }, function (err, xml) {
            xmlStr = xml;
        });

        await this.setState(state => {
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
            xmlDiagram: this.state.xmlDiagram,
            creator: userId,
            taskList: info,
            startDate: startDate,
            endDate: endDate,
            template: false
        }
        this.props.createTaskByProcess(data, this.state.idProcess);
    }

    render() {
        let idProcess = ""
        const { translate, department, role, user } = this.props;
        const { id, name, info, showInfo, processDescription, processName, viewer, manager, selectedCreate, indexRenderer, type, errorOnEndDate, errorOnStartDate, errorOnManager, errorOnViewer,
            selected, errorOnProcessName, errorOnProcessDescription, startDate, endDate } = this.state;
        const { listOrganizationalUnit } = this.props;
        if (type === "bpmn:ExclusiveGateway" && info && id && info[id].name) {
            window.$(`.task-process-gate-way-title`).css("background-color", "white")
        }
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
                    title={this.props.title}
                    func={this.save}
                    disableSubmit={!this.isFormValidate()}
                    bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
                >
                    <form id="form-create-task-by-process">
                        <div>
                            <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                                {/* Tabbed pane */}
                                <ul className="nav nav-tabs">
                                    {/* Nút tab thông tin cơ bản quy trình */}
                                    <li className="active"><a href="#info-create" onClick={() => this.handleChangeContent("info")} data-toggle="tab">{translate("task.task_process.process_information")}</a></li>
                                    {/* Nút tab quy trình - công việc */}
                                    <li><a href="#process-create" onClick={() => this.handleChangeContent("process")} data-toggle="tab">{translate("task.task_process.task_process")}</a></li>
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
                                                        onChange={this.handleChangeBpmnName}
                                                    />
                                                    <ErrorLabel content={errorOnProcessName} />
                                                </div>

                                                {/* Mô tả quy trình */}
                                                <div className={`form-group ${errorOnProcessDescription === undefined ? "" : "has-error"}`}>
                                                    <label>{translate("task.task_process.process_description")} <span style={{ color: "red" }}>*</span></label>
                                                    <textarea type="text" rows={4} style={{ minHeight: '103.5px' }}
                                                        value={processDescription}
                                                        className="form-control" placeholder={translate("task.task_process.process_description")}
                                                        onChange={this.handleChangeBpmnDescription}
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
                                                            onChange={this.handleChangeTaskStartDate}
                                                        />
                                                        <ErrorLabel content={errorOnStartDate} />
                                                    </div>
                                                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                                        <label className="control-label">{translate('task.task_management.end_date')} <span style={{ color: "red" }}>*</span></label>
                                                        <DatePicker
                                                            id={`datepicker2-process-${idProcess}`}
                                                            value={endDate}
                                                            onChange={this.handleChangeTaskEndDate}
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
                                                            onChange={this.handleChangeViewer}
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
                                                            onChange={this.handleChangeManager}
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
                                                    <button onClick={this.exportDiagram}>Export XML</button>
                                                    <button onClick={this.downloadAsSVG}>Save SVG</button>
                                                    <button onClick={this.downloadAsImage}>Save Image</button>
                                                    <button onClick={this.downloadAsBpmn}>Download BPMN</button>
                                                </div>

                                                {/* phần vẽ biểu đồ */}
                                                <div id={this.generateId}></div>

                                                {/* Nút zoom in, zoom out */}
                                                <div className="row">
                                                    <div className="io-zoom-controls">
                                                        <ul className="io-zoom-reset io-control io-control-list">
                                                            <li>
                                                                <a style={{ cursor: "pointer" }} title="Reset zoom" onClick={this.handleZoomReset}>
                                                                    <i className="fa fa-crosshairs"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a style={{ cursor: "pointer" }} title="Zoom in" onClick={this.handleZoomIn}>
                                                                    <i className="fa fa-plus"></i>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a style={{ cursor: "pointer" }} title="Zoom out" onClick={this.handleZoomOut}>
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
                                                            handleChangeTaskData={this.handleChangeInfo}
                                                            handleChangeName={this.handleChangeName} // cập nhật tên vào diagram
                                                            handleChangeResponsible={this.handleChangeResponsible} // cập nhật hiển thi diagram
                                                            handleChangeAccountable={this.handleChangeAccountable} // cập nhật hiển thị diagram
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
