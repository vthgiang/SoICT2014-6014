import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DialogModal } from "../../../../../common-components";
import { ViewProcess } from "./viewProcess";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { performTaskAction } from "../../../task-perform/redux/actions";

function ModalViewProcess(props) {
    const { translate, role, user } = props;
    const { data, listOrganizationalUnit, idProcess, xmlDiagram, processName, processDescription, infoTask, creator } = props;
    
    return (
        <React.Fragment>
            <DialogModal
                size='100' modalID={`modal-view-process-task-list`} isLoading={false}
                formID="modal-view-process-task-list"
                // disableSubmit={!isTaskFormValidated()}
                title={props.title}
                hasSaveButton={false}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            >
                <ViewProcess
                    listOrganizationalUnit={listOrganizationalUnit}
                    data={data}
                    idProcess={idProcess}
                    xmlDiagram={xmlDiagram}
                    processName={processName}
                    processDescription={processDescription}
                    infoTask={infoTask}
                    creator={creator}
                    checkManager ={props.checkManager}
                />
            </DialogModal>
        </React.Fragment>
    )

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
const connectedModalViewProcess = connect(mapState, actionCreators)(withTranslate(ModalViewProcess));
export { connectedModalViewProcess as ModalViewProcess };
