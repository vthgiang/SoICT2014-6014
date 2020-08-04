import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { FormInfoTask } from "./formInfoTask";
import { DialogModal, SelectBox } from "../../../../common-components";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { getStorage } from '../../../../config';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import './processDiagram.css'
import { TaskProcessActions } from "../redux/actions";

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
class ModalEditTaskProcess extends Component {

    constructor(props) {
        super(props);
        let { data } = this.props;
        this.state = {
            userId: getStorage("userId"),
            currentRole: getStorage('currentRole'),
            showInfo: false,
            info: data.infoTask,
            xmlDiagram: data.xmlDiagram,
            selectedEdit: 'info',
            zlevel: 1,
        }
        this.modeler = new BpmnModeler();
        this.generateId = 'editprocess';
        this.initialDiagram = data.xmlDiagram;
    }

    componentDidMount() {
        this.props.getDepartment();
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
        // this.modeler.importXML(this.initialDiagram, function (err) {})

        var eventBus = this.modeler.get('eventBus');
        this.modeler.on('element.click', 1000, (e) => this.interactPopup(e));

        this.modeler.on('shape.remove', 1000, (e) => this.deleteElements(e));

        this.modeler.on('commandStack.shape.delete.revert', (e) => this.handleUndoDeleteElement(e));

        this.modeler.on('shape.changed', 1000, (e) => this.changeNameElement(e));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.idProcess !== prevState.idProcess) {
            let info = {};
            let infoTask = nextProps.data.infoTask;
            for (let i in infoTask) {
                if (!infoTask[i].organizationalUnit) {
                    infoTask[i].organizationalUnit = nextProps.listOrganizationalUnit[0]?._id;
                }
                info[`${infoTask[i].code}`] = infoTask[i];
            }
            console.log('info', info);
            return {
                ...prevState,
                idProcess: nextProps.idProcess,
                showInfo: false,
                info: info,
                processDescription: nextProps.data.description ? nextProps.data.description : '',
                processName: nextProps.data.nameProcess ? nextProps.data.nameProcess : '',
                viewer: nextProps.data.viewer ? nextProps.data.viewer : [],
                manager: nextProps.data.manager ? nextProps.data.manager : [],
                xmlDiagram: nextProps.data.xmlDiagram,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.idProcess !== this.state.idProcess) {
            // this.props.getDepartment();
            // let { user } = this.props;
            // let defaultUnit;
            // if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
            //     item.dean === this.state.currentRole
            //     || item.viceDean === this.state.currentRole
            //     || item.employee === this.state.currentRole);
            // if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
            //     // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
            //     defaultUnit = user.organizationalUnitsOfUser[0]
            // }
            // this.props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);
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
                selectedEdit: content
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
        await this.setState(state => {
            state.info[`${state.id}`] = {
                ...state.info[`${state.id}`],
                code: state.id,
                nameTask: value,
            }
            return {
                ...state,
            }
        })
    }

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

    handleChangeResponsible = async (value) => {
        await this.setState(state => {
            state.info[`${state.id}`] = {
                ...state.info[`${state.id}`],
                code: state.id,
                responsible: value,
            }
            return {
                ...state,
            }
        })
    }

    handleChangeAccountable = async (value) => {
        await this.setState(state => {
            state.info[`${state.id}`] = {
                ...state.info[`${state.id}`],
                code: state.id,
                accountable: value,
            }
            return {
                ...state,
            }
        })
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
        console.log('state', this.state);
    }

    handleChangeManager = async (value) => {
        await this.setState(state => {

            return {
                ...state,
                manager: value,
            }
        })
        console.log('state', this.state);
    }


    // Các hàm  xử lý sự kiện của bpmn

    interactPopup = (event) => {
        var element = event.element;
        console.log(event);
        let nameStr = element.type.split(':');
        this.setState(state => {
            if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway' ||
                element.type === "bpmn:SequenceFlow" || element.type === "bpmn:IntermediateThrowEvent"
                // || element.type === 'bpmn:EndEvent' || element.type === "bpmn:StartEvent" 
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
        var element = event.element;
        // this.modeler.updateProperties(shape,{name: 'abc'});
    }

    save = async () => {
        let xmlStr;
        this.modeler.saveXML({ format: true }, function (err, xml) {
            console.log(xml);
            xmlStr = xml;
        });
        await this.setState(state => {
            return {
                ...state,
                xmlDiagram: xmlStr,
            }
        })
        let data = {
            nameProcess: this.state.processName,
            description: this.state.processDescription,
            viewer: this.state.viewer,
            manager: this.state.manager,
            creator: this.state.userId,
            xmlDiagram: this.state.xmlDiagram,
            infoTask: this.state.info
        }

        this.props.editXmlDiagram(this.state.idProcess, data)
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
        // zlevel = canvas?._cachedViewbox?.scale;

        console.log(canvas);
        // update our zoom level on viewbox change
        await eventBus.on('canvas.viewbox.changed', function (evt) {
            zlevel = evt.viewbox.scale;
            console.log('scale', zlevel, evt.viewbox.scale);
        });
        console.log('zzz', zlevel);
        zlevel = Math.max(zlevel - zstep, zstep);
        console.log('zlevel', zlevel);
        canvas.zoom(zlevel, 'auto');
    }

    handleZoomReset = () => {
        console.log('click zoom reset');

        let canvas = this.modeler.get('canvas');
        console.log('canvas', canvas);
        canvas.zoom('fit-viewport');
    }

    handleZoomIn = async () => {
        let zstep = 0.2;
        let canvas = this.modeler.get('canvas');
        let eventBus = this.modeler.get('eventBus');

        // set initial zoom level
        canvas.zoom(zlevel, 'auto');
        // zlevel = canvas?._cachedViewbox?.scale;
        // update our zoom level on viewbox change
        await eventBus.on('canvas.viewbox.changed', function (evt) {
            zlevel = evt.viewbox.scale;
            console.log('scale', zlevel, evt.viewbox.scale);
        });
        console.log('zzzIIII', zlevel);

        zlevel = Math.min(zlevel + zstep, 7);
        canvas.zoom(zlevel, 'auto');
    }

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

    render() {
        const { translate, role } = this.props;
        const { name, id, idProcess, info, showInfo, processDescription, processName, viewer, manager, selectedEdit } = this.state;
        const { listOrganizationalUnit } = this.props

        let listRole = [];
        if (role && role.list.length !== 0) listRole = role.list;
        let listItem = listRole.filter(e => ['Admin', 'Super Admin', 'Dean', 'Vice Dean', 'Employee'].indexOf(e.name) === -1)
            .map(item => { return { text: item.name, value: item._id } });

        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID={`modal-edit-process`} isLoading={false}
                    formID="form-task-process"
                    // disableSubmit={!this.isTaskFormValidated()}
                    title={this.props.title}
                    func={this.save}
                    bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
                >
                    <div>

                        <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#info-edit" onClick={() => this.handleChangeContent("info")} data-toggle="tab">Thông tin quy trình</a></li>
                                <li><a href="#process-edit" onClick={() => this.handleChangeContent("process")} data-toggle="tab">Quy trình công việc</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className={selectedEdit === "info" ? "active tab-pane" : "tab-pane"} id="info-edit">
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
                                            <div className="form-group">
                                                <label htmlFor="" >Người được phép xem</label>
                                                {
                                                    <SelectBox
                                                        id={`select-viewer-employee-edit-${idProcess}`}
                                                        className="form-control select2"
                                                        style={{ width: "100%" }}
                                                        items={listItem}
                                                        onChange={this.handleChangeViewer}
                                                        multiple={true}
                                                        value={viewer}
                                                    />
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" >Người quản lý quy trình</label>
                                                {
                                                    <SelectBox
                                                        id={`select-manager-employee-edit-${idProcess}`}
                                                        className="form-control select2"
                                                        style={{ width: "100%" }}
                                                        items={listItem}
                                                        onChange={this.handleChangeManager}
                                                        multiple={true}
                                                        value={manager}
                                                    />
                                                }
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className="form-group">
                                                <label>Mô tả quy trình</label>
                                                <textarea type="text" rows={8}
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
                                <div className={selectedEdit === "process" ? "active tab-pane" : "tab-pane"} id="process-edit">
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
                                                            <button title="Reset zoom" onClick={this.handleZoomReset}>
                                                                <i className="fa fa-crosshairs"></i>
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button title="Zoom in" onClick={this.handleZoomIn}>
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button title="Zoom out" onClick={this.handleZoomOut}>
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={showInfo ? 'col-md-4' : undefined}>
                                            {
                                                (showInfo) &&
                                                <div>
                                                    <div>
                                                        <h1>Option {name}</h1>
                                                    </div>
                                                    <FormInfoTask
                                                        listOrganizationalUnit={listOrganizationalUnit}
                                                        action='edit'
                                                        id={id}
                                                        info={(info && info[`${id}`]) && info[`${id}`]}
                                                        handleChangeName={this.handleChangeName}
                                                        handleChangeDescription={this.handleChangeDescription}
                                                        handleChangeResponsible={this.handleChangeResponsible}
                                                        handleChangeAccountable={this.handleChangeAccountable}
                                                        handleChangeOrganizationalUnit={this.handleChangeOrganizationalUnit}
                                                        handleChangeTemplate={this.handleChangeTemplate}

                                                        save={this.save}
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
    editXmlDiagram: TaskProcessActions.editXmlDiagram,
};
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(ModalEditTaskProcess));
export { connectedModalAddProcess as ModalEditTaskProcess };
