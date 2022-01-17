import React, { Component, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, SelectBox } from "../../../../../common-components";
import { ModalViewTaskProcess2 } from './modalViewTaskProcess2';
import { TaskProcessActions } from "../../redux/actions";
import "./processDiagram.css"
import qs from 'qs';
var zlevel = 1;
function areEqual(prevProps, nextProps) {
    if (JSON.stringify(prevProps.taskProcess) === JSON.stringify(nextProps.taskProcess)){
        return true
    } else {
        return false
    }
}
function ModalViewTaskProcessById(props) {
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
        props.getXmlDiagramById(processId)
    }, [JSON.stringify(props.location)])
    const { translate, role, user, taskProcess } = props;
    const {currentDiagram} = taskProcess
    console.log(currentDiagram);
    return (
        <React.Fragment>
            <div className="processbyid">
            <ModalViewTaskProcess2
                title={translate("task.task_process.view_process_template_modal")}
                listOrganizationalUnit={currentDiagram ? currentDiagram.listOrganizationalUnit : ""}
                data={currentDiagram ? currentDiagram : ""}
                idProcess={currentDiagram ? currentDiagram._id : ""}
                xmlDiagram={currentDiagram ? currentDiagram.xmlDiagram : ""}
                processName={currentDiagram ? currentDiagram.processName : ""}
                processDescription={currentDiagram ? currentDiagram.processDescription : ""}
                infoTask={currentDiagram ? currentDiagram.tasks : ""}
                creator={currentDiagram ? currentDiagram.creator : ""}
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
    getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
};
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(React.memo(ModalViewTaskProcessById,areEqual)));
export { connectedModalAddProcess as ModalViewTaskProcessById };
