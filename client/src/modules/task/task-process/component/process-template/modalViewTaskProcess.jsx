import React, { Component, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, SelectBox } from "../../../../../common-components";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { TaskProcessActions } from "../../redux/actions";
import { ViewTaskTemplate } from "../../../task-template/component/viewTaskTemplate";

import BpmnViewer from 'bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import customModule from '../custom-task-process-template';
import { AddProcessTemplate } from "./addProcessTemplateChild";
import { ViewProcessTemplateChild } from "./viewProcessTemplateChild";
import { ModalViewBpmnProcessTemplateChild } from "./viewBpmnProcessTemplateChild";
import { ModalViewTaskProcess2 } from './modalViewTaskProcess2';
var zlevel = 1;
function areEqual(prevProps, nextProps) {
    if (prevProps.idProcess === nextProps.idProcess ){
        return true
    } else {
        return false
    }
}
function ModalViewTaskProcess(props) {
    let { data } = props;
    const [state, setState] = useState({
        userId: getStorage("userId"),
        currentRole: getStorage('currentRole'),
        showInfo: false,
        showInfoProcess: false,
        selectedView: 'info',
        info: data.tasks,
        xmlDiagram: data.xmlDiagram,
        dataProcessTask:'',
        showProcessTemplate:false,
        render:0
    })
    const { translate, role, user } = props;
    return (
        <React.Fragment>
            <DialogModal
                size='100' modalID={`modal-view-process-task`}
                isLoading={false}
                formID="form-task-process"
                title={props.title}
                hasSaveButton={false}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            >
            <ModalViewTaskProcess2
                title={translate("task.task_process.view_process_template_modal")}
                listOrganizationalUnit={props.listOrganizationalUnit}
                data={props.data}
                idProcess={props.idProcess}
                xmlDiagram={props.xmlDiagram}
                processName={props.processName}
                processDescription={props.processDescription}
                infoTask={props.infoTask}
                creator={props.creator}
            />
            </DialogModal>
        </React.Fragment>
    );
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
    getAllUsers: UserActions.get
};
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(React.memo(ModalViewTaskProcess,areEqual)));
export { connectedModalAddProcess as ModalViewTaskProcess };
