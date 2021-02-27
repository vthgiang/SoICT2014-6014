import React, { Component } from "react";
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
import { TaskProcessValidator } from "../process-template/taskProcessValidator";
import { TaskProcessActions } from "../../redux/actions";
import getEmployeeSelectBoxItems from "../../../organizationalUnitHelper";
import { AddTaskForm } from "../../../task-management/component/addTaskForm";


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


class ModalEditProcess extends Component {

    constructor(props) {
        super(props);
        let { data } = this.props;

        this.state = {
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
        }
        this.modeler = new BpmnModeler({
            additionalModules: [
                customModule,
                { zoomScroll: ['value', ''] }
            ],
        });
        this.generateId = 'edittaskprocess';
        this.modeling = this.modeler.get("modeling");
        this.initialDiagram = data.xmlDiagram;
    }

    componentDidMount() {
        this.props.getAllUsers();
        this.props.getAllUserOfCompany();
        this.props.getAllUserInAllUnitsOfCompany()

        this.modeler.attachTo('#' + this.generateId);
        var eventBus = this.modeler.get('eventBus');

        //Vo hieu hoa double click edit label
        eventBus.on('element.dblclick', 10000, function (event) {
            var element = event.element;

            if (isAny(element, ['bpmn:Task'])) {
                return false; // will cancel event
            }
        });

        eventBus.on('shape.move.start', 100000, () => { return false });

        this.modeler.on('element.click', 1000, (e) => this.interactPopup(e));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.idProcess !== prevState.idProcess) {
            let info = {};
            let infoTask = nextProps.data.tasks;
            for (let i in infoTask) {
                info[`${infoTask[i].codeInProcess}`] = {
                    ...infoTask[i],
                    responsibleEmployees: infoTask[i].responsibleEmployees.map(e => e._id),
                    accountableEmployees: infoTask[i].accountableEmployees.map(e => e._id),
                    consultedEmployees: infoTask[i].consultedEmployees.map(e => e._id),
                    informedEmployees: infoTask[i].informedEmployees.map(e => e._id),
                };
            }
            return {
                ...prevState,
                idProcess: nextProps.idProcess,
                showInfo: false,
                info: info,
                processDescription: nextProps.data.processDescription ? nextProps.data.processDescription : '',
                processName: nextProps.data.processName ? nextProps.data.processName : '',
                status: nextProps.data.status ? nextProps.data.status : '',
                startDate: nextProps.data.startDate ? nextProps.data.startDate : '',
                endDate: nextProps.data.endDate ? nextProps.data.endDate : '',
                viewer: nextProps.data.viewer ? nextProps.data.viewer : '',
                xmlDiagram: nextProps.data.xmlDiagram,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.idProcess !== this.state.idProcess) {
            this.props.getDepartment();
            let { user } = this.props;
            let defaultUnit;

            if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.manager === this.state.currentRole
                || item.deputyManager === this.state.currentRole
                || item.employee === this.state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
                // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0]
            }

            this.props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);
            let modeler = this.modeler;
            let modeling = this.modeling;
            let state = this.state;
            this.modeler.importXML(nextProps.data.xmlDiagram, function (err) {
                                // chỉnh màu sắc task
                                let infoTask = nextProps.data.tasks
                                let info = state.info;
                
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
                                                if (info[x.businessObject.targetRef.id].status === "inprocess") {
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
            this.setState(state => {
                return {
                    ...state,
                    startDate: nextProps.data.startDate ? this.formatDate(nextProps.data.startDate) : '',
                    endDate: nextProps.data.endDate ? this.formatDate(nextProps.data.endDate) : '',
                }
            });
            return true;
        }
        if (nextProps.data) {
            let modeler = this.modeler;
            let modeling = this.modeling;
            let state = this.state;
            // this.modeler.importXML(nextProps.data.xmlDiagram, function (err) {


            // });
            return true;
        }
        return true;
    }

    // Các hàm  xử lý sự kiện của bpmn

    interactPopup = (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');
        this.setState(state => {
            if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway') {
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

    // các hàm thu nhỏ, phóng to, vừa màn hình cho diagram
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

    exportDiagram = () => {
        let xmlStr;
        this.modeler.saveXML({ format: true }, function (err, xml) {
            if (err) {
            }
            else {
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

    // Format date dd-mm-yyyy
    formatDate(date) {
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

    // hàm cập nhật Tên Quy trình
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

    // hàm cập nhật mô tả quy trình
    handleChangeBpmnDescription = async (e) => {
        let { value } = e.target;
        let msg = TaskProcessValidator.validateProcessDescription(value, this.props.translate);
        await this.setState(state => {
            return {
                ...state,
                processDescription: value,
                errorOnProcessDescription: msg,
            }
        });
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

    /**
     * Hàm cập nhật chọn status
     * @param {*} value giá trị status lựa chọn
     */
    handleSelectedStatus = (value) => {
        this.setState(state => {
            return {
                ...state,
                status: value[0]
            }
        })
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

    // hàm validate form tạo quy trình công việc
    isFormValidated = () => {
        let { errorOnEndDate, errorOnProcessDescription, errorOnProcessName, errorOnStartDate, errorOnViewer, startDate, endDate, viewer } = this.state;

        return errorOnEndDate === undefined && errorOnProcessDescription === undefined && errorOnProcessName === undefined && errorOnStartDate === undefined && errorOnViewer === undefined
            && startDate.trim() !== "" && endDate.trim() !== "";
    }

    // hàm lưu
    save = () => {
        let { processName, processDescription, status, startDate, endDate, viewer } = this.state;

        let { idProcess } = this.props;

        let data = {
            processName: processName,
            processDescription: processDescription,
            status: status,
            startDate: startDate,
            endDate: endDate,

            viewer: viewer,
        }
        this.props.editProcessInfo(idProcess, data);

    }

    render() {
        const { translate, role, user } = this.props;
        const { idProcess } = this.props;
        const { id, info, viewer, startDate, endDate, showInfo, status, processDescription, processName, errorOnViewer, errorOnProcessName, errorOnEndDate, errorOnStartDate, errorOnProcessDescription } = this.state;

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

        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID={`modal-edit-process-task-list`} isLoading={false}
                    formID="modal-edit-process-task-list"
                    disableSubmit={!this.isFormValidated()}
                    title={this.props.title}
                    func={this.save}
                    bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
                >
                    <div>
                        {/* {id !== undefined &&
                            <ModalDetailTask action={"edit-process"} task={(info && info[`${id}`]) && info[`${id}`]} isProcess={true} />
                        } */}

                        <div className={'row'}>
                            {/* Quy trình công việc */}
                            <div className={`contain-border ${showInfo ? 'col-md-8' : 'col-md-12'}`}>
                                {/* Diagram */}
                                <div id={this.generateId}></div>
                                {/* Zoom button */}
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

                            {showInfo &&
                                <div className={`right-content ${showInfo ? 'col-md-4' : undefined}`}>
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
                </DialogModal>
            </React.Fragment>
        )
    }

}

function mapState(state) {
    const { user, auth, role } = state;
    return { user, auth, role };
}

const actionCreators = {
    getAllUsers: UserActions.get,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getDepartment: UserActions.getDepartmentOfUser,
    getTaskById: performTaskAction.getTaskById,
    getAllUsersWithRole: UserActions.getAllUsersWithRole,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    editProcessInfo: TaskProcessActions.editProcessInfo,
};
const connectedModalEditProcess = connect(mapState, actionCreators)(withTranslate(ModalEditProcess));
export { connectedModalEditProcess as ModalEditProcess };
