import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
import moment from 'moment';

import { DialogModal, QuillEditor, SelectBox } from '../../../../common-components';
import { performTaskAction } from '../../task-perform/redux/actions';
import { EvaluateByResponsibleEmployeeProject } from './evaluateByResponsibleEmployeeProject';
import { EvaluateByAccountableEmployeeProject } from './evaluateByAccountableEmployeeProject';

function RequestToCloseProjectTaskModal(props) {
    const { id, role, task, translate, performtasks } = props;
    const [status, setStatus] = useState(task?.requestToCloseTask?.taskStatus ? task.requestToCloseTask.taskStatus : 'finished');
    const [description, setDescription] = useState();
    const [descriptionDefault, setDescriptionDefault] = useState();
    const [resData, setResData] = useState();
    const [accData, setAccData] = useState();

    useEffect(() => {
        setDescriptionDefault(task?.requestToCloseTask?.description);
    })

    let requestToCloseTask;
    if (task) {
        requestToCloseTask = task.requestToCloseTask;
    }

    let roleName;
    if (role === 'responsible') {
        roleName = "người thực hiện";
    }
    else if (role === 'accountable') {
        roleName = "người phê duyệt";
    }

    const handleChangeRequestDescription = (value, imgs) => {
        setDescription(value);
    }

    const handleSelectStatus = (value) => {
        setStatus(value[0]);
    }

    const sendRequestCloseTask = () => {
        // props.evaluateTaskByResponsibleEmployeesProject(resData, task._id);
        props.requestAndApprovalCloseTask(id, {
            taskStatus: status,
            description: description,
            type: 'request',
            role,
        })
    }

    const cancelRequestCloseTask = () => {
        props.requestAndApprovalCloseTask(id, {
            type: 'cancel_request',
            role,
        })
    }

    const approvalRequestCloseTask = async () => {
        // for (let i = 0; i < accData.resEvalArr.length; i++) {
        //     await props.evaluateTaskByResponsibleEmployeesProject(accData.resEvalArr[i], task._id);
        // }
        // await props.evaluateTaskByAccountableEmployeesProject(accData.accData, task._id)
        await props.requestAndApprovalCloseTask(id, {
            requestedBy: requestToCloseTask && requestToCloseTask.requestedBy,
            taskStatus: status,
            description: requestToCloseTask && requestToCloseTask.description,
            type: 'approval',
            role,
        })

        window.$(`#modal-request-close-task-${id}`).modal("hide");
    }

    const declineRequestCloseTask = () => {
        props.requestAndApprovalCloseTask(id, {
            requestedBy: requestToCloseTask && requestToCloseTask.requestedBy,
            taskStatus: requestToCloseTask && requestToCloseTask.taskStatus,
            description: requestToCloseTask && requestToCloseTask.description,
            type: 'decline',
            role,
        })

        setDescriptionDefault(null);
        window.$(`#modal-request-close-task-${id}`).modal("hide");
    }

    const renderRequestCloseTask = () => {
        return (
            <div>
                {role === 'responsible' && requestToCloseTask
                    ? <div style={{ textAlign: 'right' }}>
                        {(requestToCloseTask.requestStatus === 0 || requestToCloseTask.requestStatus === 2)
                            ? <button className="btn btn-success" onClick={() => sendRequestCloseTask()}>{translate('task.task_perform.send_request_close_task')}</button>
                            : requestToCloseTask && requestToCloseTask.requestStatus === 1
                            && <button className="btn btn-danger" onClick={() => cancelRequestCloseTask()}>{translate('task.task_perform.cancel_request_close_task')}</button>
                        }
                    </div>
                    : role === 'accountable' && requestToCloseTask && requestToCloseTask.requestStatus === 1
                    && <div style={{ textAlign: 'right' }}>
                        <button className="btn btn-success" onClick={() => approvalRequestCloseTask()}>{translate('task.task_perform.approval_request_close_task')}</button>
                        <button className="btn btn-danger" onClick={() => declineRequestCloseTask()} style={{ marginLeft: '5px' }}>{translate('task.task_perform.decline_request_close_task')}</button>
                    </div>
                }
                <div className="form-group">
                    <label style={{ marginRight: '5px' }}>{translate('task.task_perform.status_task_close')}</label>
                    <SelectBox id="multiSelectStatusRequestClose"
                        style={{ width: "100%" }}
                        value={status}
                        items={[
                            { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
                            { value: "finished", text: translate('task.task_management.finished') },
                            { value: "delayed", text: translate('task.task_management.delayed') },
                            { value: "canceled", text: translate('task.task_management.canceled') }
                        ]}
                        onChange={handleSelectStatus}
                        disabled={requestToCloseTask?.requestStatus === 1 && role === 'responsible'}
                    />
                </div>
                <div className="form-group">
                    <label style={{ marginRight: '5px' }}>{translate('task.task_management.detail_description')}</label>
                    {role === 'responsible'
                        ? <QuillEditor
                            id={`quill-request-close-task-by-${role}-${id}`}
                            toolbar={false}
                            getTextData={handleChangeRequestDescription}
                            maxHeight={150}
                            placeholder={translate('task.task_management.detail_description')}
                            enableEdit={requestToCloseTask && requestToCloseTask.requestStatus !== 1}
                            quillValueDefault={descriptionDefault}
                        />
                        : role === 'accountable' && requestToCloseTask && requestToCloseTask?.description
                            ? <span>{parse(requestToCloseTask.description)}</span> : <span>{translate('task.task_perform.none_description')}</span>
                    }
                </div>

                {role === 'accountable' && requestToCloseTask
                    && <div className="form-group">
                        <label style={{ marginRight: '5px' }}>Ngày gửi yêu cầu</label>
                        <span>{moment(requestToCloseTask?.createdAt).format("HH:mm:ss DD/MM/YYYY")}</span>
                    </div>
                }
            </div>
        )
    }

    const renderNotRequestClostTaskYet = () => {
        return (
            <div>
                <div style={{ textAlign: 'right' }}>
                    <button className="btn btn-success" onClick={() => approvalRequestCloseTask()}>{translate('task.task_perform.approval_request_close_task')}</button>
                </div>
                <div className="form-group">
                    <label style={{ marginRight: '5px' }}>{translate('task.task_perform.status_task_close')}</label>
                    <SelectBox id="multiSelectStatusRequestClose"
                        style={{ width: "100%" }}
                        value={status}
                        items={[
                            { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
                            { value: "finished", text: translate('task.task_management.finished') },
                            { value: "delayed", text: translate('task.task_management.delayed') },
                            { value: "canceled", text: translate('task.task_management.canceled') }
                        ]}
                        onChange={handleSelectStatus}
                    />
                </div>
            </div>
        )
    }

    const handleSaveResponsibleData = (data) => {
        setResData(data)
    }

    const handleSaveAccountableData = (data) => {
        setAccData(data)
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-request-close-task-${id}`} isLoading={false}
                title={`Kết thúc công việc với vai trò ${roleName}`}
                hasSaveButton={false}
                hasNote={false}
                size={75}
            >
                {role === "responsible" &&
                    <EvaluateByResponsibleEmployeeProject role={role} task={task} handleSaveResponsibleData={handleSaveResponsibleData} />
                }
                {role === "accountable" &&
                    <EvaluateByAccountableEmployeeProject role={role} task={task} handleSaveAccountableData={handleSaveAccountableData} handleSaveResponsibleData={handleSaveResponsibleData} />
                }

                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Yêu cầu kết thúc công việc</legend>
                    {role === 'accountable' && requestToCloseTask?.requestStatus !== 1
                        ? renderNotRequestClostTaskYet()
                        : renderRequestCloseTask()}
                </fieldset>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const { } = state;
    return {}

}
const actions = {
    requestAndApprovalCloseTask: performTaskAction.requestAndApprovalCloseTask,
    evaluateTaskByResponsibleEmployeesProject: performTaskAction.evaluateTaskByResponsibleEmployeesProject,
    evaluateTaskByAccountableEmployeesProject: performTaskAction.evaluateTaskByAccountableEmployeesProject,
}

const connectedRequestToCloseTaskModal = connect(mapState, actions)(withTranslate(RequestToCloseProjectTaskModal))
export { connectedRequestToCloseTaskModal as RequestToCloseProjectTaskModal }