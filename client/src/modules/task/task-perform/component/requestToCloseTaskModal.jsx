import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';

import { DialogModal, QuillEditor, SelectBox } from '../../../../common-components';
import { performTaskAction } from '../redux/actions';

function RequestToCloseTaskModal(props) {
    const { id, role, task, translate } = props;
    const [status, setStatus] = useState("wait_for_approval");
    const [description, setDescription] = useState();
    const [descriptionDefault, setDescriptionDefault] = useState();

    useEffect(() => {
        setDescriptionDefault(task && task.requestToCloseTask && task.requestToCloseTask.description);
    })

    let requestToCloseTask;
    
    if (task) {
        requestToCloseTask = task.requestToCloseTask;
    }

    const handleChangeRequestDescription = (value, imgs) => {
        setDescription(value);
    }

    const handleSelectStatus = (value) => {
        setStatus(value[0]);
    }

    const sendRequestCloseTask = () => {
        props.requestAndApprovalCloseTask(id, {
            taskStatus: status,
            description: description,
            type: 'request'
        })
    }

    const cancelRequestCloseTask = () => {
        props.requestAndApprovalCloseTask(id, { type: 'cancel_request' })
    }

    const approvalRequestCloseTask = () => {
        props.requestAndApprovalCloseTask(id, {
            requestedBy: requestToCloseTask && requestToCloseTask.requestedBy,
            taskStatus: requestToCloseTask && requestToCloseTask.taskStatus,
            description: requestToCloseTask && requestToCloseTask.description,
            type: 'approval'
        })

        window.$(`#modal-request-close-task-${id}`).modal("hide");
    }

    const declineRequestCloseTask = () => {
        props.requestAndApprovalCloseTask(id, {
            requestedBy: requestToCloseTask && requestToCloseTask.requestedBy,
            taskStatus: requestToCloseTask && requestToCloseTask.taskStatus,
            description: requestToCloseTask && requestToCloseTask.description,
            type: 'decline'
        })

        setDescriptionDefault(null);
        window.$(`#modal-request-close-task-${id}`).modal("hide");
    }

    const formatStatus = (data) => {
        if (data === "inprocess") return translate('task.task_management.inprocess');
        else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
        else if (data === "finished") return translate('task.task_management.finished');
        else if (data === "delayed") return translate('task.task_management.delayed');
        else if (data === "canceled") return translate('task.task_management.canceled');
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-request-close-task-${id}`} isLoading={false}
                title={`Thông tin yêu cầu kết thúc công việc`}
                hasSaveButton={false}
                hasNote={false}
            >
                {role === 'responsible' && requestToCloseTask
                    ? <div style={{ textAlign: 'right' }}>
                        {(requestToCloseTask.requestStatus === 0 || requestToCloseTask.requestStatus === 2)
                            ? <button className="btn btn-success" onClick={() => sendRequestCloseTask()}>Gửi yêu cầu</button>
                            : requestToCloseTask && requestToCloseTask.requestStatus === 1
                                && <button className="btn btn-danger" onClick={() => cancelRequestCloseTask()}>Hủy yêu cầu</button>
                        }
                    </div>
                    : role === 'accountable' && requestToCloseTask && requestToCloseTask.requestStatus === 1
                        && <div style={{ textAlign: 'right' }}>
                            <button className="btn btn-success" onClick={() => approvalRequestCloseTask()}>Chấp nhận</button>
                            <button className="btn btn-danger" onClick={() => declineRequestCloseTask()} style={{ marginLeft: '5px' }}>Từ chối</button>
                        </div>
                }
                <div className="form-group">
                    <label style={{ marginRight: '5px' }}>Trạng thái khi kết thúc công việc</label>
                    {role === 'responsible'
                        ? <SelectBox id="multiSelectStatusRequestClose"
                            style={{ width: "100%" }}
                            value={status}
                            items={[
                                { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
                                { value: "finished", text: translate('task.task_management.finished') },
                                { value: "delayed", text: translate('task.task_management.delayed') },
                                { value: "canceled", text: translate('task.task_management.canceled') }
                            ]}
                            onChange={handleSelectStatus}
                            disabled={requestToCloseTask && requestToCloseTask.requestStatus === 1}
                        >
                        </SelectBox>
                        : role === 'accountable' && requestToCloseTask
                            && <span>{formatStatus(requestToCloseTask.taskStatus)}</span>
                    }
                </div>

                <div className="form-group">
                    <label>Mô tả yêu cầu</label>
                    {role === 'responsible'
                        ? <QuillEditor
                            id={`quill-request-close-task-by-${role}-${id}`}
                            toolbar={false}
                            getTextData={handleChangeRequestDescription}
                            height={150}
                            placeholder={translate('task.task_management.detail_description')}
                            enableEdit={requestToCloseTask && requestToCloseTask.requestStatus !== 1}
                            quillValueDefault={descriptionDefault}
                        />
                        : role === 'accountable' && requestToCloseTask
                            && <span>{requestToCloseTask.description && parse(requestToCloseTask.description)}</span>
                    }
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const { } = state;
    return {}

}
const actions = {
    requestAndApprovalCloseTask: performTaskAction.requestAndApprovalCloseTask
}

const connectedRequestToCloseTaskModal = connect(mapState, actions)(withTranslate(RequestToCloseTaskModal))
export { connectedRequestToCloseTaskModal as RequestToCloseTaskModal }