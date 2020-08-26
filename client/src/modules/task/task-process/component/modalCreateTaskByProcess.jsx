import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { FormInfoTask } from "./formInfoTask";
import { DialogModal, SelectBox, DatePicker } from "../../../../common-components";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { getStorage } from '../../../../config';
import { TaskProcessActions } from "../redux/actions";
import { TaskFormValidator } from "../../task-management/component/taskFormValidator";
import { FormCreateTaskByProcess } from "./formCreateTaskByProcess";
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnViewer from 'bpmn-js'
import customModule from './read-only'
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import './processDiagram.css'
//bpmn-nyan
// import nyanDrawModule from 'bpmn-js-nyan/lib/nyan/draw';
// import nyanPaletteModule from 'bpmn-js-nyan/lib/nyan/palette';

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
class ModalCreateTaskByProcess extends Component {

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
        }
        this.modeler = new BpmnModeler({
            additionalModules: [
                customModule,
                { zoomScroll: ['value', ''] },
                { bendpoints: ['value', ""] }
            ],
        });
        this.generateId = 'createtaskbyprocess';
        this.initialDiagram = data.xmlDiagram;
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getAllUsersWithRole();
        let { user } = this.props;
        let defaultUnit = user && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.find(item =>
            item.dean === this.state.currentRole
            || item.viceDean === this.state.currentRole
            || item.employee === this.state.currentRole);
        if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) { // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
            defaultUnit = user.organizationalUnitsOfUser[0]
        }
        this.props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);


        this.modeler.attachTo('#' + this.generateId);

        var eventBus = this.modeler.get('eventBus');

        //Vo hieu hoa double click edit label
        eventBus.on('element.dblclick', 10000, function (event) {
            var element = event.element;

            if (isAny(element, ['bpmn:Task'])) {
                return false; // will cancel event
            }
        });

        eventBus.on('shape.move.start', 100000, () => { return false })
        this.modeler.on('element.click', 1000, (e) => this.interactPopup(e));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.idProcess !== prevState.idProcess) {
            let info = {};
            let infoTask = nextProps.data.tasks;
            for (let i in infoTask) {
                if (!infoTask[i].organizationalUnit) {
                    infoTask[i].organizationalUnit = nextProps.listOrganizationalUnit[0]?._id;
                }
                info[`${infoTask[i].code}`] = infoTask[i];
            }
            return {
                ...prevState,
                idProcess: nextProps.idProcess,
                showInfo: false,
                info: info,
                processDescription: nextProps.data.processDescription ? nextProps.data.processDescription : '',
                processName: nextProps.data.processName ? nextProps.data.processName : '',
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
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
                // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0]
            }
            this.props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);
            this.modeler.importXML(nextProps.data.xmlDiagram, function (err) { });
            return true;
        }
        return true;
    }

    // Các hàm xử lý sự kiện của form 
    handleChangeContent = async (content) => {
        await this.setState(state => {
            return {
                ...state,
                selected: content
            }
        })
    }

    handleChangeBpmnName = async (e) => {
        let { value } = e.target;
        await this.setState(state => {
            return {
                ...state,
                processName: value,
            }
        });
    }

    handleChangeBpmnDescription = async (e) => {
        let { value } = e.target;
        await this.setState(state => {
            return {
                ...state,
                processDescription: value,
            }
        });
    }

    handleChangeName = async (value) => {
        const modeling = this.modeler.get('modeling');
        let element1 = this.modeler.get('elementRegistry').get(this.state.id);
        modeling.updateProperties(element1, {
            name: value,
        });
    }
    // handleChangeName = async (value) => {
    //     await this.setState(state => {
    //         state.info[`${state.id}`] = {
    //             ...state.info[`${state.id}`],
    //             code: state.id,
    //             nameTask: value,
    //         }
    //         return {
    //             ...state,
    //         }
    //     })
    // }

    handleChangeDescription = async (value) => {
        await this.setState(state => {
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

    // handleChangeResponsible = async (value) => {
    //     let { user } = this.props
    //     let responsible = []
    //     user.usersWithRole.forEach(x => {
    //         if (value.some(y => y === x.userId._id)) {
    //             responsible.push(x.userId.name)
    //         }
    //     })
    //     await this.setState(state => {
    //         state.info[`${state.id}`] = {
    //             ...state.info[`${state.id}`],
    //             code: state.id,
    //             responsibleName: value
    //         }
    //         return {
    //             ...state,
    //         }
    //     })
    //     console.log('-----vào');
    //     const modeling = this.modeler.get('modeling');
    //     let element1 = this.modeler.get('elementRegistry').get(this.state.id);
    //     modeling.updateProperties(element1, {
    //         responsibleName: responsible
    //     });

    // }

    // handleChangeAccountable = async (value) => {
    //     let { user } = this.props
    //     let accountable = []
    //     user.usersWithRole.forEach(x => {
    //         if (value.some(y => y === x.userId._id)) {
    //             accountable.push(x.userId.name)
    //         }
    //     })
    //     await this.setState(state => {
    //         state.info[`${state.id}`] = {
    //             ...state.info[`${state.id}`],
    //             code: state.id,
    //             accountableName: value
    //         }
    //         return {
    //             ...state,
    //         }
    //     })
    //     const modeling = this.modeler.get('modeling');
    //     let element1 = this.modeler.get('elementRegistry').get(this.state.id);
    //     modeling.updateProperties(element1, {
    //         accountableName: accountable
    //     });
    // }

    handleChangeResponsible = async (value) => {
        let { user } = this.props
        let responsible = []
        user.usercompanys.forEach(x => {
            if (value.some(y => y === x._id)) {
                responsible.push(x.name)
            }
        })
        const modeling = this.modeler.get('modeling');
        let element1 = this.modeler.get('elementRegistry').get(this.state.id);
        modeling.updateProperties(element1, {
            responsibleName: responsible
        });
    }

    handleChangeAccountable = async (value) => {
        let { user } = this.props
        let accountable = []
        user.usercompanys.forEach(x => {
            if (value.some(y => y === x._id)) {
                accountable.push(x.name)
            }
        })
        const modeling = this.modeler.get('modeling');
        let element1 = this.modeler.get('elementRegistry').get(this.state.id);
        modeling.updateProperties(element1, {
            accountableName: accountable
        });
    }

    handleChangeOrganizationalUnit = async (value) => {
        await this.setState(state => {
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

    handleChangeTemplate = async (value) => {
        await this.setState(state => {
            state.info[`${state.id}`] = {
                ...state.info[`${state.id}`],
                code: state.id,
                taskTemplate: value,
            }
            return {
                ...state,
            }
        })
    }

    handleChangeViewer = async (value) => {
        await this.setState(state => {

            return {
                ...state,
                viewer: value,
            }
        })
    }

    handleChangeManager = async (value) => {
        await this.setState(state => {

            return {
                ...state,
                manager: value,
            }
        })
    }


    handleChangeTaskStartDate = (value) => {
        this.validateTaskStartDate(value, true);
    }
    validateTaskStartDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = TaskFormValidator.validateTaskStartDate(value, this.state.endDate ? this.state.endDate : "", translate);

        if (willUpdateState) {
            this.state.startDate = value;
            this.state.errorOnStartDate = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    handleChangeTaskEndDate = (value) => {
        this.validateTaskEndDate(value, true);
    }
    validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = TaskFormValidator.validateTaskEndDate(this.state.startDate ? this.state.startDate : "", value, translate);

        if (willUpdateState) {
            this.state.endDate = value;
            this.state.errorOnEndDate = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        console.log('state.info', this.state);
        return msg === undefined;
    }

    handleChangeTaskPriority = (value) => {
        this.state.info[`${this.state.id}`].priority = value;
        this.setState(state => {
            return {
                ...state,
            };
        });
    }

    // Các hàm  xử lý sự kiện của bpmn

    interactPopup = (event) => {
        var element = event.element;
        console.log(element, this.state)
        let nameStr = element.type.split(':');
        this.setState(state => {
            if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway' ||
                element.type === "bpmn:SequenceFlow" || element.type === "bpmn:ServiceTask"
            ) {
                if (!state.info[`${element.businessObject.id}`] ||
                    (state.info[`${element.businessObject.id}`] && !state.info[`${element.businessObject.id}`].organizationalUnit)) {
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
        this.setState(state => {
            delete state.info[`${state.id}`];
            return {
                ...state,
                showInfo: false,
            }
        })
    }

    handleUndoDeleteElement = (event) => {
        var element = event.context.shape;
    }

    changeNameElement = (event) => {
        var element = event.element;
    }

    save = async () => {
        let { info, startDate, endDate, userId, processName, processDescription, xmlDiagram } = this.state;

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
            xmlDiagram: this.state.xmlDiagram,
            creator: userId,
            taskList: info,
            startDate: startDate,
            endDate: endDate,

        }
        console.log('000', data);
        this.props.createTaskByProcess(data, this.state.idProcess);
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

    render() {
        const { translate, role, user } = this.props;
        const { name, id, idProcess, info, taskName, showInfo, startDate, endDate, errorOnEndDate, errorOnStartDate,
            processDescription, processName, viewer, manager, selected, infoTask } = this.state;
        const { listOrganizationalUnit } = this.props
        let listUser = user.usersWithRole
        let listRole = [];
        let task = Object.assign({}, info)
        if (role && role.list.length !== 0) listRole = role.list;
        let listItem = listRole.filter(e => ['Admin', 'Super Admin', 'Dean', 'Vice Dean', 'Employee'].indexOf(e.name) === -1)
            .map(item => { return { text: item.name, value: item._id } });
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID={`modal-create-task-by-process`} isLoading={false}
                    formID="form-create-task-by-process"
                    // disableSubmit={!this.isTaskFormValidated()}
                    title={this.props.title}
                    func={this.save}
                    bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
                >
                    <div>

                        <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#info-create-task" onClick={() => this.handleChangeContent("info")} data-toggle="tab">Thông tin quy trình</a></li>
                                <li><a href="#process-create-task" onClick={() => this.handleChangeContent("process")} data-toggle="tab">Tạo công việc trong quy trình</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className={selected === "info" ? "active tab-pane" : "tab-pane"} id="info-create-task">
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div className="form-group">
                                                <label>Tên quy trình</label>
                                                <input type="text"
                                                    value={processName}
                                                    className="form-control" placeholder="Mô tả công việc"
                                                    onChange={this.handleChangeBpmnName}
                                                />
                                            </div>
                                            <div className="row">
                                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                                    <label className="control-label">{translate('task.task_management.start_date')}*</label>
                                                    <DatePicker
                                                        id={`datepicker1-process-${idProcess}`}
                                                        dateFormat="day-month-year"
                                                        value={startDate}
                                                        onChange={this.handleChangeTaskStartDate}
                                                    />
                                                </div>
                                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                                    <label className="control-label">{translate('task.task_management.end_date')}*</label>
                                                    <DatePicker
                                                        id={`datepicker2-process-${idProcess}`}
                                                        value={endDate}
                                                        onChange={this.handleChangeTaskEndDate}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className="form-group">
                                                <label>Mô tả quy trình</label>
                                                <textarea type="text" rows={4} style={{ height: "108px" }}
                                                    value={processDescription}
                                                    className="form-control" placeholder="Mô tả công việc"
                                                    onChange={this.handleChangeBpmnDescription}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-content" style={{ padding: 0, marginTop: -15 }}>
                                <div className={selected === "process" ? "active tab-pane" : "tab-pane"} id="process-create-task">
                                    <div className="row">
                                        {/* Quy trình công việc */}
                                        <div className={`contain-border ${showInfo ? 'col-md-8' : 'col-md-12'}`}>
                                            <div className="tool-bar-xml" style={{ /*position: "absolute", right: 5, top: 5*/ }}>
                                                <button onClick={this.exportDiagram}>Export XML</button>
                                                <button onClick={this.downloadAsSVG}>Save SVG</button>
                                                <button onClick={this.downloadAsImage}>Save Image</button>
                                                <button onClick={this.downloadAsBpmn}>Download BPMN</button>
                                            </div>
                                            <div id={this.generateId}></div>
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

                                        <div className={`right-content ${showInfo ? 'col-md-4' : undefined}`}>
                                            {/* style={{ display: "flex", flexDirection: "column" }} */}
                                            {
                                                (showInfo) &&
                                                <div>
                                                    <div>
                                                        <h3>Tạo công việc với mẫu {taskName}</h3>
                                                    </div>

                                                    <FormCreateTaskByProcess
                                                        isProcess={true}
                                                        id={id}
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        info={(info && info[`${id}`]) && info[`${id}`]}
                                                        onChangeTemplateData={this.handleChangeInfo}
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
    getDepartment: UserActions.getDepartmentOfUser,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    createXmlDiagram: TaskProcessActions.createXmlDiagram,
    getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
    createTaskByProcess: TaskProcessActions.createTaskByProcess,
    getAllUsersWithRole: UserActions.getAllUsersWithRole
};
const connectedModalCreateProcess = connect(mapState, actionCreators)(withTranslate(ModalCreateTaskByProcess));
export { connectedModalCreateProcess as ModalCreateTaskByProcess };
