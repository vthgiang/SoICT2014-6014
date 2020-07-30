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
class ModalEditProcessTask extends Component {

    constructor(props) {
        super(props);
        let { data } = this.props;
        this.state = {
            userId: getStorage("userId"),
            currentRole: getStorage('currentRole'),
            showInfo: false,
            info: data.infoTask,
            xmlDiagram: data.xmlDiagram,
            selected: 'info',
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
        this.modeler.on('element.click', 1, (e) => this.interactPopup(e));

        this.modeler.on('shape.remove', 1000, (e) => this.deleteElements(e));

        this.modeler.on('commandStack.shape.delete.revert', (e) => this.handleUndoDeleteElement(e));

        this.modeler.on('shape.changed', 1, (e) => this.changeNameElement(e));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.idProcess !== prevState.idProcess) {
            let info = {};
            let infoTask = nextProps.data.infoTask;
            for (let i in infoTask) {
                info[`${infoTask[i].code}`] = infoTask[i];
            }

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
        console.log("element||state", element, this.state);
        let nameStr = element.type.split(':');
        this.setState(state => {
            if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway' ||
                element.type === 'bpmn:EndEvent' || element.type === "bpmn:SequenceFlow" ||
                element.type === "bpmn:StartEvent" || element.type === "bpmn:IntermediateThrowEvent"
            ) {
                return { ...state, showInfo: true, type: element.type, name: nameStr[1], taskName: element.businessObject.name, id: `${element.businessObject.id}`, }
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


    render() {
        const { translate, role } = this.props;
        const { name, id, idProcess, info, showInfo, processDescription, processName, viewer, manager, selected } = this.state;

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
                >
                    <div>

                        <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none" }}>
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#info" onClick={() => this.handleChangeContent("info")} data-toggle="tab">Thông tin quy trình</a></li>
                                <li><a href="#process" onClick={() => this.handleChangeContent("process")} data-toggle="tab">Quy trình công việc</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className={selected === "info" ? "active tab-pane" : "tab-pane"} id="info">
                                    {/* <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">Thông tin quy trình</legend> */}


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

                                    {/* </fieldset> */}
                                </div>
                            </div>
                            <div className="tab-content">
                                <div className={selected === "process" ? "active tab-pane" : "tab-pane"} id="process">
                                    <fieldset className="scheduler-border">
                                        {/* <legend className="scheduler-border">Quy trình công việc</legend> */}
                                        <div className='row'>
                                            <div id={this.generateId} className={showInfo ? 'col-md-8' : 'col-md-12'}></div>
                                            <div className={showInfo ? 'col-md-4' : undefined}>

                                                {
                                                    (showInfo) &&
                                                    <div>
                                                        <div>
                                                            <h1>Option {name}</h1>
                                                        </div>
                                                        <FormInfoTask
                                                            action='edit'
                                                            id={id}
                                                            info={(info && info[`${id}`]) && info[`${id}`]}
                                                            handleChangeName={this.handleChangeName}
                                                            handleChangeDescription={this.handleChangeDescription}
                                                            handleChangeResponsible={this.handleChangeResponsible}
                                                            handleChangeAccountable={this.handleChangeAccountable}

                                                            save={this.save}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            {/* <button onClick={this.exportDiagram}>Export XML</button>
                                                <button onClick={this.downloadAsSVG}>Save SVG</button>
                                                <button onClick={this.downloadAsImage}>Save Image</button>
                                                <button onClick={this.downloadAsBpmn}>Download BPMN</button> */}
                                        </div>
                                    </fieldset>
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
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(ModalEditProcessTask));
export { connectedModalAddProcess as ModalEditProcessTask };
