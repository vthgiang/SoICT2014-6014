import React, { Component, useState } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DialogModal } from "../../../../../common-components";
import { ViewProcess } from "./viewProcess";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { performTaskAction } from "../../../task-perform/redux/actions";
import { ViewTaskOutputs } from "./viewTaskOutputs";

function ModalViewProcess(props) {
    const { translate, role, user } = props;
    const { data, listOrganizationalUnit, idProcess, xmlDiagram, processName, processDescription, infoTask, creator } = props;
    const [content, setContent] = useState("viewProcess");

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
                <div>
                    <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                        {/* Tabbed pane */}
                        <ul className="nav nav-tabs">
                            {/* Nút tab thông tin cơ bản quy trình */}
                            <li className="active"><a href="#view-process" onClick={() => setContent("viewProcess")} data-toggle="tab">Thông tin quy trình</a></li>
                            {/* Nút tab quy trình - công việc */}
                            <li><a href="#view-task-output" onClick={() => setContent("viewTaskOutput")} data-toggle="tab">Kết quả giao nộp</a></li>
                        </ul>
                    </div>
                    <div className="tab-content">
                        <div className={content === "viewProcess" ? "active tab-pane" : "tab-pane"} id="view-process">
                            {content === "viewProcess" &&
                                <ViewProcess
                                    listOrganizationalUnit={listOrganizationalUnit}
                                    data={data}
                                    idProcess={idProcess}
                                    xmlDiagram={xmlDiagram}
                                    processName={processName}
                                    processDescription={processDescription}
                                    infoTask={infoTask}
                                    creator={creator}
                                />
                            }
                        </div>
                    </div>

                    <div className="tab-content" style={{ padding: 0 }}>
                        <div className={content === "viewTaskOutput" ? "active tab-pane" : "tab-pane"} id="view-task-output">
                            {content === "viewTaskOutput" &&
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
                            }
                        </div>
                    </div>
                </div>
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
