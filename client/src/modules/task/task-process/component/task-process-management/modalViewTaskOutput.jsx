import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DialogModal } from "../../../../../common-components";
import { ViewProcess } from "./viewProcess";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { performTaskAction } from "../../../task-perform/redux/actions";
import { ViewTaskOutputs } from "./viewTaskOutputs";

function ModalViewTaskOutput(props) {
    const { translate, role, user } = props;
    const { data, listOrganizationalUnit, idProcess, xmlDiagram, processName, processDescription, infoTask, creator } = props;

    return (
        <React.Fragment>
            <DialogModal
                size='100' modalID={`modal-view-task-output`} isLoading={false}
                formID="modal-view-task-output"
                // disableSubmit={!isTaskFormValidated()}
                title={"Kết quả giao nộp của công việc trong quy trình"}
                hasSaveButton={false}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            >
                <ViewTaskOutputs
                    listOrganizationalUnit={listOrganizationalUnit}
                    data={data}
                    idProcess={idProcess}
                    xmlDiagram={xmlDiagram}
                    processName={processName}
                    processDescription={processDescription}
                    infoTask={infoTask}
                    creator={creator}
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
const connectedModalViewProcess = connect(mapState, actionCreators)(withTranslate(ModalViewTaskOutput));
export { connectedModalViewProcess as ModalViewTaskOutput };
