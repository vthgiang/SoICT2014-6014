import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
import moment from 'moment';

import { DialogModal, QuillEditor, SelectBox } from '../../../../common-components';
import { performTaskAction } from '../redux/actions';

function RequestToCloseTaskModal(props) {
    const { id, role, task, translate } = props;
    const [status, setStatus] = useState(task?.requestToCloseTask?.taskStatus ? task.requestToCloseTask.taskStatus : 'finished');
    const [description, setDescription] = useState();
    const [descriptionDefault, setDescriptionDefault] = useState();

    useEffect(() => {
        setDescriptionDefault(task?.requestToCloseTask?.description);
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
            taskStatus: status,
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
                            height={150}
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