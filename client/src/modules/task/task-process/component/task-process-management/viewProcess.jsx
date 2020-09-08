import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { ModalDetailTask } from "../../../task-dashboard/task-personal-dashboard/modalDetailTask";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { performTaskAction } from "../../../task-perform/redux/actions";
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import BpmnModeler from 'bpmn-js/lib/Modeler';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import customModule from './../custom'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import './../processDiagram.css'

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

class ViewProcess extends Component {

    constructor(props) {
        super(props);
        let { data } = this.props;
        console.log('dtaa', data);
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
                { zoomScroll: ['value', ''] }
            ],
        });
        this.generateId = 'viewtaskprocestab';
        this.modeling = this.modeler.get("modeling")
        this.initialDiagram = data.xmlDiagram;
    }

    componentDidMount() {

        this.modeler.attachTo('#' + this.generateId);
        var eventBus = this.modeler.get('eventBus');

        //Vo hieu hoa double click edit label
        eventBus.on('element.dblclick', 10000, function (event) {
            var element = event.element;

            if (isAny(element, ['bpmn:Task'])) {
                return false; // will cancel event
            }
        });


        this.modeler.on('element.click', 1000, (e) => this.interactPopup(e));


    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.idProcess !== prevState.idProcess) {
            let info = {};
            let infoTask = nextProps.data.tasks;
            for (let i in infoTask) {
                info[`${infoTask[i].codeInProcess}`] = infoTask[i];
            }
            return {
                ...prevState,
                idProcess: nextProps.idProcess,
                showInfo: false,
                info: info,
                processDescription: nextProps.data.processDescription ? nextProps.data.processDescription : '',
                processName: nextProps.data.processName ? nextProps.data.processName : '',
                startDate: nextProps.data.startDate ? nextProps.data.startDate : '',
                endDate: nextProps.data.endDate ? nextProps.data.endDate : '',
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
        if (nextProps.data) {
            let modeler = this.modeler;
            let modeling = this.modeling;
            let state = this.state;
            this.modeler.importXML(nextProps.data.xmlDiagram, function (err) {

                let infoTask = nextProps.data.tasks
                let info = state.info;

                if (infoTask) {
                    for (let i in infoTask) {
                        if (infoTask[i].status === "Finished") {
                            let element1 = (Object.keys(modeler.get('elementRegistry')).length > 0) && modeler.get('elementRegistry').get(infoTask[i].codeInProcess);

                            element1 && modeling.setColor(element1, {
                                fill: '#f9f9f9', // 9695AD
                                stroke: '#c4c4c7'
                            });

                            var outgoing = element1.outgoing;
                            outgoing.forEach(x => {
                                console.log('x', x);
                                if (info[x.businessObject.targetRef.id].status === "Inprocess") {
                                    var outgoingEdge = modeler.get('elementRegistry').get(x.id);

                                    modeling.setColor(outgoingEdge, {
                                        stroke: '#c4c4c7',
                                        width: '5px'
                                    })
                                }
                            })
                        }

                        if (infoTask[i].status === "Inprocess") {
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

            return true;
        }
        return true;
    }

    // Các hàm  xử lý sự kiện của bpmn

    interactPopup = (event) => {
        var element = event.element;
        console.log(element, this.state)
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
        if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway') {
            console.log('0000', this.state.info[this.state.id]);
            window.$(`#modal-detail-task`).modal("show");
        }
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

    render() {
        const { translate, role, user } = this.props;
        const { name, id, idProcess, info, startDate, endDate, errorOnEndDate, errorOnStartDate,
            processDescription, processName } = this.state;
        const { isTabPane } = this.props

        return (
            <React.Fragment>
                <div>
                    {id !== undefined &&
                        <ModalDetailTask task={(info && info[`${id}`]) && info[`${id}`]} isProcess={true} />
                    }

                    <div className={`${isTabPane ? 'is-tabbed-pane' : 'row'}`}>
                        {/* Quy trình công việc */}
                        <div className={`contain-border ${isTabPane ? '' : 'col-md-8'}`}>
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

                        <div className={`${isTabPane ? 'row' : 'right-content col-md-4'}`}>

                            <div className={`${isTabPane ? "col-lg-6 col-md-6 col-sm-6 col-xs-6" : "box box-solid"}`}>
                                { // !isTabPane && style={isTabPane ? {display: "flex", flexDirection: "row"} : {}}
                                    <div className="box-header with-border">
                                        {translate('task_template.general_information')}
                                    </div>
                                }
                                <div className="box-body">

                                    {/**Các thông tin của mẫu công việc */}
                                    <dt>{translate("task.task_process.process_name")}</dt>
                                    <dd>{processName}</dd>

                                    <dt>{translate("task.task_process.process_description")}</dt>
                                    <dd>{processDescription}</dd>

                                    <dt>{translate("task.task_process.time_of_process")}</dt>
                                    <dd>{this.formatDate(startDate)} <i className="fa fa-fw fa-caret-right"></i> {this.formatDate(endDate)}</dd>
                                </div>
                            </div>
                            <div className={` ${isTabPane ? "col-lg-6 col-md-6 col-sm-6 col-xs-6" : "box box-solid"}`}>
                                { // !isTabPane &&
                                    <div className="box-header with-border">
                                        {translate("task.task_process.notice")}
                                    </div>
                                }
                                <div className="box-body">

                                    {/**Các thông tin của mẫu công việc */}
                                    <dd><i className="fa fa-square" style={{ color: "#fff", border: "1px solid #000", borderRadius: "3px", marginRight: "5px" }}></i>{translate("task.task_process.wait_for_approval")}</dd>
                                    <dd><i className="fa fa-square" style={{ color: "#84ffb8", border: "1px solid #14984c", borderRadius: "3px", marginRight: "5px" }}></i>{translate("task.task_process.inprocess")}</dd>
                                    <dd><i className="fa fa-square" style={{ color: "#f9f9f9", border: "1px solid #c4c4c7", borderRadius: "3px", marginRight: "5px" }}></i>{translate("task.task_process.finished")}</dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
    getTaskById: performTaskAction.getTaskById,
    getAllUsersWithRole: UserActions.getAllUsersWithRole,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
};
const connectedViewProcess = connect(mapState, actionCreators)(withTranslate(ViewProcess));
export { connectedViewProcess as ViewProcess };
