import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { DeleteNotification, RevokeNotification, ConfirmNotification, ButtonModal, DialogModal, ErrorLabel, SelectBox, DatePicker, TimePicker, SelectMulti, SmartTable } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../../super-admin/user/redux/actions';
import '../../../delegation/delegation-list/components/selectLink.css'
import { PolicyActions } from '../../../super-admin/policy-delegation/redux/actions';
import { performTaskAction } from '../../task-perform/redux/actions';
import { TaskDelegationForm } from './taskDelegationForm';
import { colorfyDelegationStatus } from '../../../delegation/delegation-list/components/functionHelper';
import { DelegationDetailInfoTask } from "../../../delegation/delegation-list/components/delegationDetailInfoTask";
import { taskManagementActions } from '../redux/actions';
import { getStorage } from '../../../../config';

import dayjs from "dayjs";


function TaskDelegation(props) {


    const [state, setState] = useState({

    })
    const { taskId, delegateTaskName, taskDelegations, curentRowDetail, curentRowDetailReceive, taskDelegationsReceive } = state;

    const { translate, performtasks, tasks } = props;


    useEffect(() => {
        if (tasks?.task) {
            let userId = getStorage("userId");
            setState({
                ...state,
                taskId: props.taskId,
                delegateTaskName: props.taskName,
                taskDelegations: tasks?.task?.delegations?.filter(d => d.delegator._id.toString() == userId.toString()),
                taskDelegationsReceive: tasks?.task?.delegations?.filter(d => d.delegatee._id.toString() == userId.toString()),

            });
        }
    }, [tasks?.task])

    const formatTime = (date) => {
        return dayjs(date).format("DD-MM-YYYY hh:mm A")
    }

    const handleShowDetailInfo = (delegation) => {
        setState({
            ...state,
            curentRowDetail: delegation,
        });
        window.$(`#modal-detail-info-delegation-hooks-Task`).modal('show')
    }

    const handleShowDetailInfoReceive = (delegation) => {
        console.log("alo")
        setState({
            ...state,
            curentRowDetailReceive: delegation,
        });
        window.$(`#modal-detail-info-delegation-hooks-Task`).modal('show')
    }

    const handleDelete = (id) => {
        props.deleteTaskDelegation(taskId, {
            delegationId: id,
        });

    }

    const handleRevoke = (id) => {
        props.revokeTaskDelegation(taskId, {
            delegationId: id,
            reason: window.$(`#revokeReason-${id}`).val()
        });

    }

    const handleEdit = (delegation) => {
        setState({
            ...state,
            currentRow: delegation
        });
        window.$(`#modal-edit-delegation-hooks-Role`).modal('show');
    }

    const confirmDelegation = (id) => {
        props.confirmTaskDelegation(taskId, {
            delegationId: id,
        });

    }

    const rejectDelegation = (id) => {
        props.rejectTaskDelegation(taskId, {
            delegationId: id,
            reason: window.$(`#rejectReason-${id}`).val()
        });

    }

    console.log(curentRowDetailReceive)

    console.log(tasks)
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-task-delegation-${props.id}`}
                formID={`form-task-delegation-${props.id}`}
                title={translate('manage_delegation.task_delegation_title')}
                size={80}
                hasSaveButton={false}
                hasNote={false}
                isLoading={tasks.isLoading}
                noTabIndex={true}
            >

                <DelegationDetailInfoTask
                    size={65}
                    delegationID={curentRowDetail ? curentRowDetail._id : curentRowDetailReceive ? curentRowDetailReceive._id : null}
                    delegationName={curentRowDetail ? curentRowDetail.delegationName : curentRowDetailReceive ? curentRowDetailReceive.delegationName : null}
                    description={curentRowDetail ? curentRowDetail.description : curentRowDetailReceive ? curentRowDetailReceive.description : null}
                    delegator={curentRowDetail ? curentRowDetail.delegator : curentRowDetailReceive ? curentRowDetailReceive.delegator : null}
                    delegatee={curentRowDetail ? curentRowDetail.delegatee : curentRowDetailReceive ? curentRowDetailReceive.delegatee : null}
                    delegatePrivileges={curentRowDetail ? curentRowDetail.delegatePrivileges : curentRowDetailReceive ? curentRowDetailReceive.delegatePrivileges : null}
                    delegateType={curentRowDetail ? curentRowDetail.delegateType : curentRowDetailReceive ? curentRowDetailReceive.delegateType : null}
                    delegateRole={curentRowDetail ? curentRowDetail.delegateRole : curentRowDetailReceive ? curentRowDetailReceive.delegateRole : null}
                    delegateTask={curentRowDetail ? curentRowDetail.delegateTask : curentRowDetailReceive ? curentRowDetailReceive.delegateTask : null}
                    delegateTaskRoles={curentRowDetail ? curentRowDetail.delegateTaskRoles : curentRowDetailReceive ? curentRowDetailReceive.delegateTaskRoles : null}
                    status={curentRowDetail ? curentRowDetail.status : curentRowDetailReceive ? curentRowDetailReceive.status : null}
                    allPrivileges={curentRowDetail ? curentRowDetail.allPrivileges : curentRowDetailReceive ? curentRowDetailReceive.allPrivileges : null}
                    startDate={curentRowDetail ? curentRowDetail.startDate : curentRowDetailReceive ? curentRowDetailReceive.startDate : null}
                    endDate={curentRowDetail ? curentRowDetail.endDate : curentRowDetailReceive ? curentRowDetailReceive.endDate : null}
                    revokedDate={curentRowDetail ? curentRowDetail.revokedDate : curentRowDetailReceive ? curentRowDetailReceive.revokedDate : null}
                    revokeReason={curentRowDetail ? curentRowDetail.revokeReason : curentRowDetailReceive ? curentRowDetailReceive.revokeReason : null}
                    replyStatus={curentRowDetail ? curentRowDetail.replyStatus : curentRowDetailReceive ? curentRowDetailReceive.replyStatus : null}
                    declineReason={curentRowDetail ? curentRowDetail.declineReason : curentRowDetailReceive ? curentRowDetailReceive.declineReason : null}
                    delegatePolicy={curentRowDetail ? curentRowDetail.delegatePolicy : curentRowDetailReceive ? curentRowDetailReceive.delegatePolicy : null}
                    logs={curentRowDetail ? curentRowDetail.logs : curentRowDetailReceive ? curentRowDetailReceive.logs : null}
                    forReceive={curentRowDetailReceive ? true : false}
                />


                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('menu.delegation_list')} data-toggle="tab" href={`#task_delegation_delegate`}>{translate('menu.delegation_list')}</a></li>
                        <li><a title={translate('menu.delegation_receive')} data-toggle="tab" href={`#task_delegation_receive`}>{translate('menu.delegation_receive')}</a></li>
                    </ul>
                    <div className="tab-content">


                        <div className="tab-pane active" id="task_delegation_delegate">
                            <TaskDelegationForm
                                id={props.id}
                                taskId={taskId}
                                taskName={delegateTaskName}
                            />




                            <div className="dropdown pull-right" style={{ marginTop: "5px" }}>
                                <button type="button" className="btn btn-success pull-right" title={translate('manage_delegation.add_title')}
                                    onClick={() => window.$(`#modal-task-delegation-form-${props.id}`).modal('show')}>
                                    {translate('manage_delegation.add')}
                                </button>
                            </div>

                            <div className="form-inline">

                                <div className="form-group">
                                    <label style={{ width: "auto", textAlign: 'left' }} className="form-control-static">{translate('task.task_management.col_name')}:</label>
                                    <div style={{ width: "auto" }} className="form-control-static">
                                        {delegateTaskName}
                                    </div>
                                </div>
                            </div>

                            {/* Bảng thông tin ủy quyền công việc*/}
                            <table className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                                <thead>
                                    <tr>
                                        <th className="col-fixed">{translate('manage_delegation.index')}</th>
                                        <th style={{ width: '14%' }}>{translate('manage_delegation.delegationName')}</th>
                                        <th>{translate('manage_delegation.delegateObject')}</th>
                                        <th>{translate('manage_delegation.delegatee')}</th>
                                        <th>{translate('manage_delegation.delegateStartDate')}</th>
                                        <th>{translate('manage_delegation.delegateEndDate')}</th>
                                        <th>{translate('manage_delegation.delegateStatus')}</th>
                                        <th style={{ width: '90px', textAlign: 'center' }}>{translate('general.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(taskDelegations && taskDelegations.length !== 0) &&
                                        taskDelegations.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item?.delegationName}</td>
                                                {/* <td>{translate('manage_delegation.delegateType' + item?.delegateType)}</td> */}
                                                <td>{item.delegateTaskRoles ? item.delegateTaskRoles.map(r => translate('task.task_management.' + r)).join(", ") : ""}</td>
                                                <td>{item?.delegatee.name}</td>
                                                <td>{formatTime(item?.startDate)}</td>
                                                <td>{item.revokedDate && (item.endDate && (new Date(item.revokedDate)).getTime() < (new Date(item.endDate)).getTime()) || (item.revokedDate && !item.endDate) ? formatTime(item.revokedDate) : (item.endDate ? formatTime(item.endDate) : translate("manage_delegation.end_date_tbd"))}</td>
                                                <td>{colorfyDelegationStatus(item.status, translate)} - {colorfyDelegationStatus(item.replyStatus, translate)}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_delegation.detail_info_delegation')}
                                                        onClick={() => handleShowDetailInfo(item)}
                                                    ><i className="material-icons">visibility</i></a>
                                                    {/* {item.status == "pending"
                                    ? <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_delegation.edit')} onClick={() => handleEdit(item)}><i className="material-icons">edit</i></a>
                                    : null
                                } */}
                                                    {item.status == "revoked" ?
                                                        <DeleteNotification
                                                            content={translate('manage_delegation.delete')}
                                                            data={{
                                                                id: item._id,
                                                                info: item.delegationName
                                                            }}
                                                            func={handleDelete}
                                                        /> :
                                                        <RevokeNotification
                                                            content={translate('manage_delegation.revoke_request')}
                                                            data={{
                                                                id: item._id,
                                                                info: item.delegationName
                                                            }}
                                                            func={handleRevoke}
                                                        />
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            {
                                (!taskDelegations || taskDelegations.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }

                        </div>


                        <div className="tab-pane" id="task_delegation_receive">

                            <div className="form-inline">

                                <div className="form-group">
                                    <label style={{ width: "auto", textAlign: 'left' }} className="form-control-static">{translate('task.task_management.col_name')}:</label>
                                    <div style={{ width: "auto" }} className="form-control-static">
                                        {delegateTaskName}
                                    </div>
                                </div>
                            </div>

                            {/* Bảng thông tin ủy quyền công việc*/}
                            <table className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                                <thead>
                                    <tr>
                                        <th className="col-fixed">{translate('manage_delegation.index')}</th>
                                        <th style={{ width: '14%' }}>{translate('manage_delegation.delegationName')}</th>
                                        <th>{translate('manage_delegation.delegateObject')}</th>
                                        <th>{translate('manage_delegation.delegator')}</th>
                                        <th>{translate('manage_delegation.delegateStartDate')}</th>
                                        <th>{translate('manage_delegation.delegateEndDate')}</th>
                                        <th>{translate('manage_delegation.delegateStatus')}</th>
                                        <th style={{ width: '90px', textAlign: 'center' }}>{translate('general.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(taskDelegationsReceive && taskDelegationsReceive.length !== 0) &&
                                        taskDelegationsReceive.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item?.delegationName}</td>
                                                {/* <td>{translate('manage_delegation.delegateType' + item?.delegateType)}</td> */}
                                                <td>{item.delegateTaskRoles ? item.delegateTaskRoles.map(r => translate('task.task_management.' + r)).join(", ") : ""}</td>
                                                <td>{item?.delegator.name}</td>
                                                <td>{formatTime(item?.startDate)}</td>
                                                <td>{item.revokedDate && (item.endDate && (new Date(item.revokedDate)).getTime() < (new Date(item.endDate)).getTime()) || (item.revokedDate && !item.endDate) ? formatTime(item.revokedDate) : (item.endDate ? formatTime(item.endDate) : translate("manage_delegation.end_date_tbd"))}</td>
                                                <td>{colorfyDelegationStatus(item.status, translate)} - {colorfyDelegationStatus(item.replyStatus, translate)}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_delegation.detail_info_delegation')}
                                                        onClick={() => handleShowDetailInfoReceive(item)}
                                                    ><i className="material-icons">visibility</i></a>
                                                    {item.replyStatus == "wait_confirm" || item.replyStatus == "declined"
                                                        ? <ConfirmNotification
                                                            icon="success"
                                                            title={translate('manage_delegation.confirm_delegation')}
                                                            content={`<h4 style='color: green'><div>${translate('manage_delegation.confirm_delegation')}</div> <div>"${item.delegationName}"</div></h4>`}
                                                            name="thumb_up"
                                                            className="text-blue"
                                                            func={() => confirmDelegation(item._id)}
                                                        />
                                                        : null}
                                                    {item.replyStatus == "wait_confirm" || item.replyStatus == "confirmed"
                                                        ? <ConfirmNotification
                                                            icon="error"
                                                            title={translate('manage_delegation.reject_reason')}
                                                            content={`<h4 style='color: red'><div>${translate('manage_delegation.reject_delegation')}</div> <div>"${item.delegationName}"</div></h4>
                                        <br> <div class="form-group">
                                            <label>${translate('manage_delegation.reject_reason')}</label>
                                            <textarea id="rejectReason-${item._id}" class="form-control" placeholder="${translate('manage_delegation.reject_reason_placeholder')}"></textarea>
                                        </div>
                                        `}
                                                            name="thumb_down"
                                                            className="text-red"
                                                            func={() => rejectDelegation(item._id)}
                                                        />
                                                        : null}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            {
                                (!taskDelegationsReceive || taskDelegationsReceive.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </div>


                    </div>
                </div>


            </DialogModal>
        </React.Fragment >
    );
}

function mapState(state) {
    const { auth, user, policyDelegation, performtasks, tasks } = state;
    return { auth, user, policyDelegation, performtasks, tasks }
}

const actions = {

    deleteTaskDelegation: taskManagementActions.deleteTaskDelegation,
    revokeTaskDelegation: taskManagementActions.revokeTaskDelegation,
    rejectTaskDelegation: taskManagementActions.rejectTaskDelegation,
    confirmTaskDelegation: taskManagementActions.confirmTaskDelegation

}

const connectedTaskDelegation = connect(mapState, actions)(withTranslate(TaskDelegation));
export { connectedTaskDelegation as TaskDelegation };