import React, { Component, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, DatePicker, ErrorLabel, SelectBox } from "../../../../../common-components";
import { FormCreateTaskByProcess } from "./formCreateTaskByProcess";

import { UserActions } from "../../../../super-admin/user/redux/actions";
import { TaskProcessActions } from "../../redux/actions";
import { TaskFormValidator } from "../../../task-management/component/taskFormValidator";
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import BpmnModeler from 'bpmn-js/lib/Modeler';
import customModule from '../custom-task-process-template';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import './processDiagram.css'
import getEmployeeSelectBoxItems from "../../../organizationalUnitHelper";
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

var zlevel = 1;
function ModalCreateTaskByProcessTemplate(props) {

    let { data } = props;
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
        manager: [],
        viewer: [],
        id:"",
        indexRenderer: 0,
    })
    const [modeler, setModeler] = useState(new BpmnModeler({
        additionalModules: [
            customModule,
            { zoomScroll: ['value', ''] },
            { bendpoints: ['value', ""] }
        ],
    }))
    const generateId = 'createtaskbyprocess';
    // initialDiagram = data.xmlDiagram;

    useEffect(() => {
        props.getAllUserInAllUnitsOfCompany()
        props.getDepartment();
        props.getAllUsersWithRole();
        let { user } = props;
        let defaultUnit = user && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.find(item =>
            item.manager === state.currentRole
            || item.deputyManager === state.currentRole
            || item.employee === state.currentRole);
        if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) { // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
            defaultUnit = user.organizationalUnitsOfUser[0]
        }
        props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);


        modeler.attachTo('#' + generateId);

        var eventBus = modeler.get('eventBus');

        //Vo hieu hoa double click edit label
        eventBus.on('element.dblclick', 10000, function (event) {
            var element = event.element;

            if (isAny(element, ['bpmn:Task'])) {
                return false; // will cancel event
            }
        });

        eventBus.on('shape.move.start', 100000, () => { return false })
        modeler.on('element.click', 1000, (e) => interactPopup(e));
    }, [])

    // static getDerivedStateFromProps(props, prevState) {
    //     if (props.idProcess !== prevState.idProcess) {

    //     } else {
    //         return null;
    //     }
    // }

    // shouldComponentUpdate(props, nextState) {
    //     if (props.idProcess !== state.idProcess) {
    //         props.getDepartment();
    //         let { user } = props;
    //         let defaultUnit;
    //         if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
    //             item.manager === state.currentRole
    //             || item.deputyManager === state.currentRole
    //             || item.employee === state.currentRole);
    //         if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
    //             // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
    //             defaultUnit = user.organizationalUnitsOfUser[0]
    //         }
    //         props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);
    //         modeler.importXML(props.data.xmlDiagram, function (err) { });
    //         return true;
    //     }
    //     return true;
    // }
    useEffect(() => {
        if (props.idProcess !== state.idProcess) {
            let info = {};
            let infoTask = props.data.tasks;
            for (let i in infoTask) {
                if (!infoTask[i].organizationalUnit) {
                    infoTask[i].organizationalUnit = props.listOrganizationalUnit[0]?._id;
                }
                info[`${infoTask[i].code}`] = infoTask[i];
            }
            setState({
                ...state,
                idProcess: props.idProcess,
                showInfo: false,
                info: info,
                processDescription: props.data.processDescription ? props.data.processDescription : '',
                processName: props.data.processName ? props.data.processName : '',
                xmlDiagram: props.data.xmlDiagram,
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
            modeler.importXML(props.data.xmlDiagram, function (err) { });
        }
    }, [props.idProcess])
    if (state.save === true) {
		modeler.importXML(props.data.xmlDiagram);
		setState({
			...state,
			save: false,
		});
	}
    // Các hàm xử lý sự kiện của form 
    const handleChangeContent = async (content) => {
        await setState(state => {
            return {
                ...state,
                selected: content
            }
        })
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

    // hàm cập nhật tên Công việc trong quy trình
    const handleChangeName = async (value) => {
        const modeling = modeler.get('modeling');
        let element1 = modeler.get('elementRegistry').get(state.id);
        modeling.updateProperties(element1, {
            shapeName: value,
        });
    }

    // hàm cập nhật mô tả công việc trong quy trình
    const handleChangeDescription = async (value) => {
        await setState(state => {
            state.info[`${state.id}`] = {
                ...state.info[`${state.id}`],
                code: state.id,
                description: value,
            }
            return {
                ...state,
            }
        })
    }

    // hàm cập nhật thông tin người thực hiện
    const handleChangeResponsible = async (value) => {
        let { user } = props
        let responsible = []
        user.usercompanys.forEach(x => {
            if (value.some(y => y === x._id)) {
                responsible.push(x.name)
            }
        })
        const modeling = modeler.get('modeling');
        let element1 = modeler.get('elementRegistry').get(state.id);
        modeling.updateProperties(element1, {
            responsibleName: responsible
        });
    }

    // cập nhật thông tin người phê duyệt
    const handleChangeAccountable = async (value) => {
        let { user } = props
        let accountable = []
        user.usercompanys.forEach(x => {
            if (value.some(y => y === x._id)) {
                accountable.push(x.name)
            }
        })
        const modeling = modeler.get('modeling');
        let element1 = modeler.get('elementRegistry').get(state.id);
        modeling.updateProperties(element1, {
            accountableName: accountable
        });
    }

    // hàm cập nhật thông tin đơn vị công việc
    const handleChangeOrganizationalUnit = async (value) => {
        await setState(state => {
            state.info[`${state.id}`] = {
                ...state.info[`${state.id}`],
                code: state.id,
                organizationalUnit: value,
            }
            return {
                ...state,
            }
        })
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

    // Các hàm  xử lý sự kiện của bpmn
    const interactPopup = (event) => {
        var element = event.element;
        // console.log(element, state)
        let nameStr = element.type.split(':');
        setState(state => {
            if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway' ||
                element.type === "bpmn:SequenceFlow" || element.type === "bpmn:ServiceTask"
            ) {
                if (!state.info[`${element.businessObject.id}`] ||
                    (state.info[`${element.businessObject.id}`] && !state.info[`${element.businessObject.id}`].organizationalUnit)) {
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
    }

    const deleteElements = (event) => {
        var element = event.element;
        setState(state => {
            delete state.info[`${state.id}`];
            return {
                ...state,
                showInfo: false,
            }
        })
    }

    const handleUndoDeleteElement = (event) => {
        var element = event.context.shape;
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

    // xử lý zoomin zoomout
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


    // cập nhật thông tin công viêc mỗi lần thay đổi thông tin
    const handleChangeInfo = (value) => {
        let info = {
            ...value,
            code: state.id
        }
        const infos = state.info
        infos[`${state.id}`] = info ;
        state.info[`${state.id}`] = info
        setState({
                ...state,
                info: infos
            })
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

        }
        let template;
        props.createTaskByProcess(data, state.idProcess, template = true);
        setState({
            userId: getStorage("userId"),
            currentRole: getStorage('currentRole'),
            showInfo: false,
            info: props.data.tasks,
            xmlDiagram: props.data.xmlDiagram,
            selected: 'info',
            save : true,
            zlevel: 1,
            startDate: "",
            endDate: "",
            manager: [],
            viewer: [],
            id:"",
            indexRenderer: 0,
        })
    }

    const { translate, role, user } = props;
    const { id, idProcess, info, taskName, showInfo, startDate, endDate, errorOnEndDate, errorOnStartDate, errorOnManager, errorOnViewer,
        processDescription, processName, selected, viewer, manager, errorOnProcessName, errorOnProcessDescription, indexRenderer } = state;
    const { listOrganizationalUnit } = props

    let listUserCompany = user?.usercompanys;
    let listItem = [];
    if (listUserCompany && listUserCompany.length !== 0) {
        listItem = listUserCompany.map(item => { return { text: item.name, value: item._id } });
    }
    let listRole = [];
    if (role && role.list.length !== 0) listRole = role.list;


    let usersOfChildrenOrganizationalUnit;
    if (user.usersOfChildrenOrganizationalUnit) {
        usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
    }
    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }

    let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);
    let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);
    return (
        <React.Fragment>
            <DialogModal
                size='100' modalID={`modal-create-task-by-process-template`} isLoading={false}
                formID="form-create-task-by-process-template"
                disableSubmit={!isTaskFormValidated()}
                title={props.title}
                func={save}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            >
                <div>

                    <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                        <ul className="nav nav-tabs">
                            {/* Nút tab thông tin quy trình */}
                            <li className="active"><a href="#info-create-task" onClick={() => handleChangeContent("info")} data-toggle="tab">{translate("task.task_process.process_information")}</a></li>
                            {/* Nút tab quy trình - công việc */}
                            <li><a href="#process-create-task" onClick={() => handleChangeContent("process")} data-toggle="tab">{translate("task.task_process.task_process")}</a></li>
                        </ul>

                        {/* Tab Thông tin quy trình */}
                        <div className="tab-content">
                            <div className={selected === "info" ? "active tab-pane" : "tab-pane"} id="info-create-task">
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
                            <div className={selected === "process" ? "active tab-pane" : "tab-pane"} id="process-create-task">
                                <div className="row">
                                    {/* Quy trình công việc */}
                                    <div className={`contain-border ${showInfo ? 'col-md-8' : 'col-md-12'}`}>
                                        {/* Nút tùy chọn export, import diagram,... */}
                                        <div className="tool-bar-xml" style={{ /*position: "absolute", right: 5, top: 5*/ }}>
                                            <button onClick={exportDiagram}>Export XML</button>
                                            <button onClick={downloadAsSVG}>Save SVG</button>
                                            <button onClick={downloadAsImage}>Save Image</button>
                                            <button onClick={downloadAsBpmn}>Download BPMN</button>
                                        </div>

                                        {/* biểu đồ */}
                                        <div id={generateId}></div>

                                        {/* Nút zoomin, zoomout */}
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
                                        {/* style={{ display: "flex", flexDirection: "column" }} */}
                                        {
                                            (showInfo) &&
                                            <div>
                                                <div>
                                                    <h3>{translate("task.task_process.create_task_with_template")} {taskName}</h3>
                                                </div>
                                                <FormCreateTaskByProcess
                                                    isProcess={true}
                                                    id={id}
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    info={(info && info[`${id}`]) && info[`${id}`]}
                                                    onChangeTemplateData={handleChangeInfo}
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
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const { user, auth, role } = state;
    return { user, auth, role };
}

const actionCreators = {
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getDepartment: UserActions.getDepartmentOfUser,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    createXmlDiagram: TaskProcessActions.createXmlDiagram,
    getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
    createTaskByProcess: TaskProcessActions.createTaskByProcess,
    getAllUsersWithRole: UserActions.getAllUsersWithRole
};
const connectedModalCreateProcess = connect(mapState, actionCreators)(withTranslate(ModalCreateTaskByProcessTemplate));
export { connectedModalCreateProcess as ModalCreateTaskByProcessTemplate };
