import React, { Component } from 'react';
import { connect } from 'react-redux';

import { performTaskAction } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { RoleActions } from '../../../super-admin/role/redux/actions';

import { getStorage } from '../../../../config';
import { withTranslate } from 'react-redux-multilingual';
import { ShowMoreShowLess } from '../../../../common-components';
import moment from 'moment';
import Swal from 'sweetalert2';
import parse from 'html-react-parser';

import { RequestToCloseTaskModal } from './requestToCloseTaskModal';

import { ROOT_ROLE } from '../../../../helpers/constants';
import { EditReportProgressModal } from './editReportProgress';
const DetailTaskManufacturing = (props) => {

    const { translate } = props;

    const refresh = () => {

    }

    const handleShowEdit = () => {
        window.$("#report-progress-manufacturing").modal("show")
    }

    const startTimer = () => {

    }

    const handleShowEvaluate = () => {

    }

    const handleShowRequestCloseTask = () => {

    }

    const handleOpenTaskAgain = () => {

    }

    const handleChangeCollapseInfo = () => {

    }

    const currentRole = "", collapseInfo = true;

    return (
        <React.Fragment>
            <div style={{ marginLeft: "-10px" }}>
                <a className="btn btn-app" onClick={() => refresh()} title="Refresh">
                    <i className="fa fa-refresh" style={{ fontSize: "16px" }} aria-hidden="true" ></i>{translate('task.task_management.detail_refresh')}
                </a>
                <a className="btn btn-app" onClick={() => handleShowEdit()} title="Chỉnh sửa thông tin chung">
                    <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_edit')}
                </a>

                <a className="btn btn-app" onClick={() => startTimer()} title="Bắt đầu thực hiện công việc">
                    <i className="fa fa-clock-o" style={{ fontSize: "16px" }} aria-hidden="true" ></i>{translate('task.task_management.detail_start_timer')}
                </a>

                <a className="btn btn-app" onClick={() => handleShowEvaluate()} title={translate('task.task_management.detail_evaluate')}>
                    <i className="fa fa-calendar-check-o" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_evaluate')}
                </a>

                <a className="btn btn-app" onClick={() => handleShowRequestCloseTask()} title={currentRole === "responsible" ? translate('task.task_perform.request_close_task') : translate('task.task_perform.approval_close_task')}>
                    <i className="fa fa-external-link-square" style={{ fontSize: "16px" }}></i>{currentRole === "responsible" ? translate('task.task_perform.request_close_task') : translate('task.task_perform.approval_close_task')}
                </a>
                <a className="btn btn-app" onClick={() => handleOpenTaskAgain()} title={translate('task.task_perform.open_task_again')}>
                    <i className="fa fa-rocket" style={{ fontSize: "16px" }}></i>{translate('task.task_perform.open_task_again')}
                </a>
                {(collapseInfo === false) ?
                    <a className="btn btn-app" data-toggle="collapse" href="#info" onClick={() => handleChangeCollapseInfo()} role="button" aria-expanded="false" aria-controls="info">
                        <i className="fa fa-info" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_hide_info')}
                    </a> :
                    <a className="btn btn-app" data-toggle="collapse" href="#info" onClick={() => handleChangeCollapseInfo()} role="button" aria-expanded="false" aria-controls="info">
                        <i className="fa fa-info" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_show_info')}
                    </a>
                }
                <div className="dropdown" style={{ margin: "10px 0px 0px 10px", display: "inline-block" }}>
                    <a className="btn btn-app" style={{ margin: "-10px 0px 0px 0px" }} data-toggle="dropdown">
                        <i className="fa fa-user" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_choose_role')}
                    </a>
                    <ul className="dropdown-menu">

                    </ul>
                </div>
            </div>
            <div>
                <div id="info" className="collapse in">
                    {/* Các trường thông tin cơ bản */}
                    {
                        <div className="description-box">
                            <h4>{translate('task.task_management.detail_general_info')}</h4>
                            <div><strong>{translate('task.task_management.detail_link')}:</strong> <a href={`/task?taskId=`} target="_blank"></a></div>
                            <div><strong>{translate('task.task_management.detail_time')}:</strong>
                                {/* {this.formatTime(task && task.startDate)} */}
                                <i className="fa fa-fw fa-caret-right"></i>
                                {/* {this.formatTime(task && task.endDate)} */}
                            </div>
                            <div><strong>{translate('task.task_management.unit_manage_task')}:</strong>
                                {/* {task && task.organizationalUnit ? task.organizationalUnit.name :  */}
                                {translate('task.task_management.err_organizational_unit')}
                            </div>
                            <div><strong>{translate('task.task_management.detail_priority')}:</strong>
                                {/* {task && this.formatPriority(task.priority)} */}
                            </div>
                            <div><strong>{translate('task.task_management.detail_status')}:</strong>
                            </div>
                            <div><strong>{translate('task.task_management.detail_progress')}:</strong>
                            </div>

                            <div>
                                <strong>{translate('task.task_management.detail_description')}:</strong>
                                <ShowMoreShowLess
                                    id={"task-description"}
                                    isHtmlElement={true}
                                    characterLimit={200}
                                >
                                </ShowMoreShowLess>
                            </div>
                        </div>
                    }
                    <div>
                        <div className="description-box">
                            <h4>{translate('task.task_management.role')}</h4>

                            {/* Người thực hiện */}
                            <strong>{translate('task.task_management.responsible')}:</strong>
                            <span>
                            </span>
                            <br />

                            <div>
                                {/* Người hỗ trợ */}
                                <strong>{translate('task.task_management.consulted')}:</strong>
                                <span>
                                </span>
                                <br />
                            </div>

                            <div>
                                {/* Người quan sát */}
                                <strong>{translate('task.task_management.informed')}:</strong>
                                <span>
                                </span>
                                <br />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            <EditReportProgressModal />
            {/* 
            {
                (id && showEvaluate === id) &&
                <EvaluationModal
                    id={id}
                    task={task && task}
                    hasAccountable={checkHasAccountable}
                    role={currentRole}
                    title={translate('task.task_management.detail_cons_eval')}
                    perform='evaluate'
                />
            }
            {
                (id && showRequestClose === id) && (currentRole === "responsible" || currentRole === "accountable") && checkHasAccountable &&
                <RequestToCloseTaskModal
                    id={id}
                    task={task && task}
                    role={currentRole}
                />
            } */}
        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    const { tasks, performtasks, user, role } = state;
    return { tasks, performtasks, user, role };
}

const mapDispatchToProps = {
}

const detailTask = connect(mapStateToProps, mapDispatchToProps)(withTranslate(DetailTaskManufacturing));
export { detailTask as DetailTaskManufacturing };