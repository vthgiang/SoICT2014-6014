import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, SelectBox, DatePicker, TimePicker, SelectMulti, SmartTable } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../../super-admin/user/redux/actions';
import '../../../delegation/delegation-list/components/selectLink.css'
import { PolicyActions } from '../../../super-admin/policy-delegation/redux/actions';
import { performTaskAction } from '../../task-perform/redux/actions';
import { TaskDelegationForm } from './taskDelegationForm';
import { colorfyDelegationStatus } from '../../../delegation/delegation-list/components/functionHelper';
import dayjs from "dayjs";


function TaskDelegation(props) {


    const [state, setState] = useState({

    })
    const { taskId, delegateTaskName, taskDelegations } = state;

    const { translate, performtasks, tasks } = props;


    useEffect(() => {
        if (tasks?.task) {
            setState({
                ...state,
                taskId: props.taskId,
                delegateTaskName: props.taskName,
                taskDelegations: tasks?.task?.delegations
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
        window.$(`#modal-detail-info-task-delegation`).modal('show')
    }


    console.log(tasks)
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-task-delegation-${props.id}`}
                formID={`form-task-delegation-${props.id}`}
                title={translate('manage_delegation.task_delegation_title')}
                size={75}
                hasSaveButton={false}
                hasNote={false}
                isLoading={tasks.isLoading}
            >
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

                {/* <SmartTable
                    disableCheckbox={true}
                    tableId={tableId}
                    columnData={{
                        index: translate('manage_delegation.index'),
                        delegationName: translate('manage_delegation.delegationName'),
                        // delegateType: translate('manage_delegation.delegateType'),
                        delegateObject: translate('manage_delegation.delegateObject'),
                        delegatee: translate('manage_delegation.delegatee'),
                        delegateStartDate: translate('manage_delegation.delegateStartDate'),
                        delegateEndDate: translate('manage_delegation.delegateEndDate'),
                        delegateStatus: translate('manage_delegation.delegateStatus'),
                        // description: translate('manage_delegation.description')
                    }}
                    tableHeaderData={{
                        index: <th className="col-fixed" style={{ width: 60 }}>{translate('manage_delegation.index')}</th>,
                        delegationName: <th>{translate('manage_delegation.delegationName')}</th>,
                        // delegateType: <th>{translate('manage_delegation.delegateType')}</th>,
                        delegateObject: <th>{translate('manage_delegation.delegateObject')}</th>,
                        delegatee: <th>{translate('manage_delegation.delegatee')}</th>,
                        delegateStartDate: <th>{translate('manage_delegation.delegateStartDate')}</th>,
                        delegateEndDate: <th>{translate('manage_delegation.delegateEndDate')}</th>,
                        delegateStatus: <th>{translate('manage_delegation.delegateStatus')}</th>,
                        // description: <th>{translate('manage_delegation.description')}</th>,
                        action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    }}
                    tableBodyData={taskDelegations?.length > 0 && taskDelegations.map((item, index) => {
                        return {
                            id: item?._id,
                            index: <td>{index + 1}</td>
                            delegationName: <td>{item?.delegationName}</td>
                            // delegateType: <td>{translate('manage_delegation.delegateType' + item?.delegateType)}</td>
                            delegateObject: <td>{item.delegateRole ? item.delegateRole.name : ""}</td>
                            delegatee: <td>{item?.delegatee.name}</td>
                            delegateStartDate: <td>{formatTime(item?.startDate)}</td>
                            delegateEndDate: <td>{item.revokedDate && (item.endDate && (new Date(item.revokedDate)).getTime() < (new Date(item.endDate)).getTime()) || (item.revokedDate && !item.endDate) ? formatTime(item.revokedDate) : (item.endDate ? formatTime(item.endDate) : translate("manage_delegation.end_date_tbd"))}</td>
                            delegateStatus: <td>{colorfyDelegationStatus(item.status, translate)} - {colorfyDelegationStatus(item.replyStatus, translate)}</td>
                            // description: <td>{item?.description}</td>
                            action:
                                <td style={{ textAlign: "center" }}>
                                    <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_delegation.detail_info_delegation')} onClick={() => handleShowDetailInfo(item)}><i className="material-icons">visibility</i></a>
                                    {item.status == "pending"
                                    ? <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_delegation.edit')} onClick={() => handleEdit(item)}><i className="material-icons">edit</i></a>
                                    : null
                                }
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
                        }
                    })}
                    dataDependency={taskDelegations}
                    onSetNumberOfRowsPerpage={setLimit}
                    onSelectedRowsChange={onSelectedRowsChange}
                
                /> */}

                {/* Bảng thông tin ủy quyền công việc*/}
                <table className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{translate('manage_delegation.index')}</th>
                            <th>{translate('manage_delegation.delegationName')}</th>
                            <th>{translate('manage_delegation.delegateObject')}</th>
                            <th>{translate('manage_delegation.delegatee')}</th>
                            <th>{translate('manage_delegation.delegateStartDate')}</th>
                            <th>{translate('manage_delegation.delegateEndDate')}</th>
                            <th>{translate('manage_delegation.delegateStatus')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(taskDelegations && taskDelegations.length !== 0) &&
                            taskDelegations.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.delegationName}</td>
                                    {/* <td>{translate('manage_delegation.delegateType' + item?.delegateType)}</td> */}
                                    <td>{item.delegateTaskRoles ? item.delegateTaskRoles.join(", ") : ""}</td>
                                    <td>{item?.delegatee.name}</td>
                                    <td>{formatTime(item?.startDate)}</td>
                                    <td>{item.revokedDate && (item.endDate && (new Date(item.revokedDate)).getTime() < (new Date(item.endDate)).getTime()) || (item.revokedDate && !item.endDate) ? formatTime(item.revokedDate) : (item.endDate ? formatTime(item.endDate) : translate("manage_delegation.end_date_tbd"))}</td>
                                    <td>{colorfyDelegationStatus(item.status, translate)} - {colorfyDelegationStatus(item.replyStatus, translate)}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_delegation.detail_info_delegation')}
                                        // onClick={() => handleShowDetailInfo(item)}
                                        ><i className="material-icons">visibility</i></a>
                                        {/* {item.status == "pending"
                                    ? <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_delegation.edit')} onClick={() => handleEdit(item)}><i className="material-icons">edit</i></a>
                                    : null
                                }
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
                                } */}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    (!taskDelegations || taskDelegations.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

            </DialogModal>
        </React.Fragment >
    );
}

function mapState(state) {
    const { auth, user, policyDelegation, performtasks, tasks } = state;
    return { auth, user, policyDelegation, performtasks, tasks }
}

const actions = {
    // getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    // getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    // getPolicies: PolicyActions.getPolicies,
    // getTaskById: performTaskAction.getTaskById,
}

const connectedTaskDelegation = connect(mapState, actions)(withTranslate(TaskDelegation));
export { connectedTaskDelegation as TaskDelegation };