import React, { Component, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, SelectBox } from "../../../../../common-components";
import { ModalViewTaskProcess2 } from '../process-template/modalViewTaskProcess2';
import { TaskProcessActions } from "../../redux/actions";
import "../process-template/processDiagram.css"
import qs from 'qs';
import { ViewProcess } from "./viewProcess";
var zlevel = 1;
function areEqual(prevProps, nextProps) {
    if (JSON.stringify(prevProps.taskProcess) === JSON.stringify(nextProps.taskProcess)){
        return true
    } else {
        return false
    }
}
function ModalViewProcessById(props) {
    // let { data } = props;
    const [state, setState] = useState({
        userId: getStorage("userId"),
        currentRole: getStorage('currentRole'),
        showInfo: false,
        showInfoProcess: false,
        selectedView: 'info',
        info: [],
        xmlDiagram: [],
        dataProcessTask:'',
        showProcessTemplate:false,
        render:0
    })
    useEffect(() => {
        // console.log(props.location);
        const { processId } = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        props.getProcessById(processId)
    }, [JSON.stringify(props.location)])
    const { translate, role, user, taskProcess } = props;
    const {taskProcessById} = taskProcess
    console.log(taskProcessById);
    return (
        <React.Fragment>
            <div className="processbyid">
            <ViewProcess
                title={translate("task.task_process.view_process_template_modal")}
                listOrganizationalUnit={taskProcessById ? taskProcessById.listOrganizationalUnit : ""}
                data={taskProcessById ? taskProcessById : ""}
                idProcess={taskProcessById ? taskProcessById._id : ""}
                xmlDiagram={taskProcessById ? taskProcessById.xmlDiagram : ""}
                processName={taskProcessById ? taskProcessById.processName : ""}
                processDescription={taskProcessById ? taskProcessById.processDescription : ""}
                infoTask={taskProcessById ? taskProcessById.tasks : ""}
                creator={taskProcessById ? taskProcessById.creator : ""}
            />
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const { user, auth, role, taskProcess } = state;
    return { user, auth, role, taskProcess };
}

const actionCreators = {
    getProcessById: TaskProcessActions.getProcessById,
};
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(React.memo(ModalViewProcessById,areEqual)));
export { connectedModalAddProcess as ModalViewProcessById };
