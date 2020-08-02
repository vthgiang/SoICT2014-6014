import React, { Component } from "react";
import BpmnViewer from 'bpmn-js';
import { connect } from 'react-redux';
import { DialogModal, SelectBox } from "../../../../common-components";
import { FormInfoTask } from "./formInfoTask";
import { getStorage } from '../../../../config';
import { UserActions } from "../../../super-admin/user/redux/actions";
import { TaskProcessActions } from "../redux/actions";
import { withTranslate } from "react-redux-multilingual";


class ModalViewTaskProcess extends Component {

    constructor(props) {
        super(props);
        let { data } = this.props;
        this.state = {
            userId: getStorage("userId"),
            currentRole: getStorage('currentRole'),
            showInfo: false,
            selectedView: 'info',
            info: data.infoTask,
            xmlDiagram: data.xmlDiagram,
        }
        this.viewer = new BpmnViewer();
        this.generateId = 'bpmnContainer';
        this.viewer.importXML(this.props.xmlDiagram)
    }

    interactPopup = async (event) => {
        let element = event.element;
        console.log(element)
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
        if (nextProps?.idProcess !== this.state.idProcess) {
            this.viewer.importXML(nextProps.data.xmlDiagram);
            return true;
        }
        return true;
    }
    componentDidMount() {
        this.viewer.attachTo('#' + this.generateId);
        this.viewer.on('element.click', 1000, (e) => this.interactPopup(e));
    }

    interactPopup = (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');
        this.setState(state => {
            if (element.type !== 'bpmn:Collaboration' && element.type !== 'bpmn:Process' && element.type !== 'bpmn:StartEvent' && element.type !== 'bpmn:EndEvent') {
                return { ...state, showInfo: true, type: element.type, name: nameStr[1], taskName: element.businessObject.name, id: `${element.businessObject.id}`, }
            }
            else {
                return { ...state, showInfo: false, type: element.type, name: '', id: element.businessObject.id, }
            }

        })
    }

    // Các hàm xử lý sự kiện của form 
    handleChangeContent = async (content) => {
        await this.setState(state => {
            return {
                ...state,
                selectedView: content
            }
        })
    }

    render() {
        const { translate, role } = this.props;
        const { listOrganizationalUnit } = this.props
        const { name, id, idProcess, info, showInfo, processDescription, processName, viewer, manager, selectedView } = this.state;

        let listRole = [];
        if (role && role.list.length !== 0) listRole = role.list;
        let listItem = listRole.filter(e => ['Admin', 'Super Admin', 'Dean', 'Vice Dean', 'Employee'].indexOf(e.name) === -1)
            .map(item => { return { text: item.name, value: item._id } });
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID={`modal-view-process-task`}
                    isLoading={false}
                    formID="form-task-process"
                    title={this.props.title}
                    hasSaveButton={false}
                >
                    <div>
                        <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none" }}>
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#info" onClick={() => this.handleChangeContent("info")} data-toggle="tab">Thông tin quy trình</a></li>
                                <li><a href="#process" onClick={() => this.handleChangeContent("process")} data-toggle="tab">Quy trình công việc</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className={selectedView === "info" ? "active tab-pane" : "tab-pane"} id="info">

                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div className="form-group">
                                                <label>Tên quy trình</label>
                                                <input type="text"
                                                    value={processName}
                                                    className="form-control" placeholder="Mô tả công việc"
                                                    disabled={true}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" >Người được phép xem</label>
                                                {
                                                    <SelectBox
                                                        id={`select-viewer-employee-view-${idProcess}`}
                                                        className="form-control select2"
                                                        style={{ width: "100%" }}
                                                        items={listItem}
                                                        multiple={true}
                                                        value={viewer}
                                                        disabled={true}
                                                    />
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" >Người quản lý quy trình</label>
                                                {
                                                    <SelectBox
                                                        id={`select-manager-employee-view-${idProcess}`}
                                                        className="form-control select2"
                                                        style={{ width: "100%" }}
                                                        items={listItem}
                                                        multiple={true}
                                                        value={manager}
                                                        disabled={true}
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
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>


                            <div className="tab-content">
                                <div className={selectedView === "process" ? "active tab-pane" : "tab-pane"} id="process">
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
                                                            disabled={true}
                                                            listOrganizationalUnit={listOrganizationalUnit}
                                                            action='view'
                                                            id={id}
                                                            info={(info && info[`${id}`]) && info[`${id}`]}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <div id={this.generateId}></div>
                                            <button onClick={this.exportDiagram}>Export XML</button>
                                            <button onClick={this.downloadAsSVG}>Save SVG</button>
                                            <button onClick={this.downloadAsImage}>Save Image</button>
                                            <button onClick={this.downloadAsBpmn}>Download BPMN</button>
                                        </div>
                                    </fieldset>

                                </div>
                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
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
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(ModalViewTaskProcess));
export { connectedModalAddProcess as ModalViewTaskProcess };
