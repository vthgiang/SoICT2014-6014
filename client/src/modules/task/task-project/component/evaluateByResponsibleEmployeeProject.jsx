import React, { Component, useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, DatePicker, SelectBox, QuillEditor, TimePicker } from '../../../../common-components/index';
import { performTaskAction } from '../../task-perform/redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { TaskInformationForm } from '../../task-perform/component/taskInformationForm';
import { AutomaticTaskPointCalculator } from '../../task-perform/component/automaticTaskPointCalculator';
import { ModalShowAutoPointInfoProjectTask } from './modalShowAutoPointInfoProjectTask';
import { getStorage } from '../../../../config';
import moment from 'moment';
import "../../task-perform/component/scrollBar.css";
import { getCurrentProjectDetails } from '../../../project/projects/components/functionHelper';
import { checkIsNullUndefined } from '../../task-management/component/functionHelpers';
import { ProjectActions } from '../../../project/projects/redux/actions';
import { ModalShowAutoPointInfoProjectMember } from './modalShowAutoPointInfoProjectMember';

const EvaluateByResponsibleEmployeeProject = (props) => {
    const { role, task, project } = props;
    const projectDetail = getCurrentProjectDetails(project, String(task?.taskProject));
    const userId = getStorage('userId');
    const [currentProgress, setCurrentProgress] = useState(task?.progress || 0);
    const currentTaskAutomaticPointInDB = task.overallEvaluation?.automaticPoint;
    const currentUserAutomaticPointInDB = task.overallEvaluation?.responsibleEmployees?.find((item) => String(item.employee?._id) === userId)?.automaticPoint;
    const currentUserHandPointInDb = task.overallEvaluation?.responsibleEmployees?.find((item) => String(item.employee?._id) === userId)?.employeePoint;
    const [currentUserHandPoint, setCurrentUserHandPoint] = useState(currentUserHandPointInDb || 0);
    const [currentMemberActualCost, setCurrentMemberActualCost] = useState(
        task?.actorsWithSalary.find((actorItem) => {
            return String(userId) === String(actorItem.userId)
        })?.actualCost || ''
    );

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "user_all", userId });
    }, [])

    const calcAutomaticPoint = (type) => {
        if (type === 'task') {
            let taskInfo = {
                task: task,
                progress: currentProgress,
                projectDetail,
            };

            let automaticPoint = AutomaticTaskPointCalculator.calcProjectTaskPoint(taskInfo);
            if (isNaN(automaticPoint)) automaticPoint = undefined

            return automaticPoint;
        }
        let taskMemberInfo = {
            task: task,
            progress: currentProgress,
            projectDetail,
            userId,
            currentMemberActualCost,
        };

        let automaticPoint = AutomaticTaskPointCalculator.calcProjectMemberPoint(taskMemberInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined

        return automaticPoint;
    }

    let currentTaskAutomaticPoint = useMemo(() => {
        return calcAutomaticPoint('task')
    }, [currentProgress]);

    let currentUserAutomaticPoint = useMemo(() => {
        return calcAutomaticPoint('member')
    }, [currentProgress, currentMemberActualCost]);

    const openModalTaskCalculation = () => {
        setTimeout(() => {
            window.$(`#modal-automatic-point-info-project-task-${task?._id}`).modal('show');
        }, 10);
    }

    const openModalMemberCalculation = () => {
        setTimeout(() => {
            window.$(`#modal-automatic-point-info-project-member-${task?._id}-${userId}`).modal('show');
        }, 10);
    }

    const handleSaveEvalResult = () => {
        props.evaluateTaskByResponsibleEmployeesProject({
            userId,
            taskAutomaticPoint: Number(currentTaskAutomaticPoint),
            automaticPoint: Number(currentUserAutomaticPoint),
            employeePoint: Number(currentUserHandPoint),
            progress: currentProgress,
            actualResMemberCost: Number(currentMemberActualCost),
        }, task._id)
    }

    // useEffect(() => {
    //     props.handleSaveResponsibleData({
    //         userId,
    //         taskAutomaticPoint: Number(currentTaskAutomaticPoint),
    //         automaticPoint: Number(currentUserAutomaticPoint),
    //         employeePoint: Number(currentUserHandPoint),
    //         progress: currentProgress,
    //         actualResMemberCost: Number(currentMemberActualCost),
    //     })
    // }, [currentProgress, currentUserHandPoint, currentMemberActualCost])

    return (
        <React.Fragment>
            <div className="body-evaluation">
                <ModalShowAutoPointInfoProjectTask
                    task={task}
                    progress={currentProgress}
                    projectDetail={projectDetail}
                />
                <ModalShowAutoPointInfoProjectMember
                    task={task}
                    progress={currentProgress}
                    projectDetail={projectDetail}
                    userId={userId}
                    currentMemberActualCost={currentMemberActualCost}
                />

                <fieldset className="scheduler-border">
                    {/* <div className="row">
                        <button className="btn btn-success pull-right" style={{ marginRight: 10 }} onClick={() => handleSaveEvalResult()}>Lưu kết quả đánh giá</button>
                    </div> */}

                    <legend className="scheduler-border">Thông tin công việc</legend>
                    <div className="row">
                        <div className="col-md-6 col-xs-6">
                            <label>Thời gian bắt đầu công việc</label>
                            {'  '}
                            {moment(task?.startDate).format('HH:mm DD/MM/YYYY')}
                        </div>
                        <div className="col-md-6 col-xs-6">
                            <label>Thời gian dự kiến kết thúc công việc</label>
                            {'  '}
                            {moment(task?.endDate).format('HH:mm DD/MM/YYYY')}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label>Tiến độ công việc (%):</label>
                            <input className="form-control" type="number" value={currentProgress} onChange={e => setCurrentProgress(e.target.value)} />
                        </div>
                    </div>
                </fieldset>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Điểm công việc</legend>
                    <div className="row">
                        <div className="col-md-12">
                            <strong>Điểm tự động đã được lưu:</strong>{'  '}
                            {checkIsNullUndefined(currentTaskAutomaticPointInDB) ? 'Chưa tính được' : currentTaskAutomaticPointInDB}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <strong>Điểm tự động:</strong>{'  '}
                            <a style={{ cursor: "pointer" }} onClick={openModalTaskCalculation}>
                                {checkIsNullUndefined(currentTaskAutomaticPoint) ? 'Chưa tính được' : currentTaskAutomaticPoint}
                            </a>
                        </div>
                    </div>
                </fieldset>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Điểm cho người thực hiện</legend>
                    <div className="row">
                        <div className="col-md-12">
                            <label>Chi phí thực của thành viên:</label>
                            <input className="form-control" type="number" value={currentMemberActualCost} onChange={e => setCurrentMemberActualCost(e.target.value)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <strong>Điểm tự động đã được lưu:</strong>{'  '}
                            {checkIsNullUndefined(currentUserAutomaticPointInDB) ? 'Chưa tính được' : currentUserAutomaticPointInDB}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <strong>Điểm tự động:</strong>{'  '}
                            <a style={{ cursor: "pointer" }} onClick={openModalMemberCalculation}>
                                {checkIsNullUndefined(currentUserAutomaticPoint) ? 'Chưa tính được' : currentUserAutomaticPoint}
                            </a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label>Điểm tự đánh giá bằng tay:</label>
                            <input className="form-control" type="number" value={currentUserHandPoint} onChange={e => setCurrentUserHandPoint(e.target.value)} />
                        </div>
                    </div>
                </fieldset>

                <div className="box">
                    <div className="row">
                        <button className="btn-success pull-right" onClick={handleSaveEvalResult} title="Lưu kết quả đánh giá">Lưu kết quả đánh giá</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapState = (state) => {
    const { tasks, performtasks, kpimembers, KPIPersonalManager, user, project } = state;
    return { tasks, performtasks, kpimembers, KPIPersonalManager, user, project };
}
const getState = {
    getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
    evaluateTaskByResponsibleEmployeesProject: performTaskAction.evaluateTaskByResponsibleEmployeesProject,
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
}

const evaluateByResponsibleEmployee = connect(mapState, getState)(withTranslate(EvaluateByResponsibleEmployeeProject));
export { evaluateByResponsibleEmployee as EvaluateByResponsibleEmployeeProject }
