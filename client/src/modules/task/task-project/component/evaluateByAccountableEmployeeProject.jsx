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
import { getCurrentProjectDetails } from '../../../project/component/projects/functionHelper';
import { checkIsNullUndefined } from '../../task-management/component/functionHelpers';
import { ProjectActions } from '../../../project/redux/actions';
import { ModalShowAutoPointInfoProjectMember } from './modalShowAutoPointInfoProjectMember';

const EvaluateByAccountableEmployeeProject = (props) => {
    const { role, task, project } = props;
    // console.log('task', task)
    const projectDetail = getCurrentProjectDetails(project, String(task?.taskProject));
    const userId = getStorage('userId');
    const [currentProgress, setCurrentProgress] = useState(task?.progress || 0);
    const currentTaskAutomaticPointInDB = task.overallEvaluation?.automaticPoint;
    const currentAccUserAutomaticPointInDB = task.overallEvaluation?.accountableEmployees?.find((item) => String(item.employee?._id) === userId)?.automaticPoint;
    const currentAccUserHandPointInDb = task.overallEvaluation?.accountableEmployees?.find((item) => String(item.employee?._id) === userId)?.employeePoint;
    const [currentAccUserHandPoint, setCurrentAccUserHandPoint] = useState(currentAccUserHandPointInDb || 0);
    const resEvalArr = task.responsibleEmployees?.map((resItem) => {
        const currentResEmp = task.overallEvaluation?.responsibleEmployees?.find((item) => String(item.employee?._id) === String(resItem._id));
        if (currentResEmp) {
            return {
                id: resItem._id,
                name: resItem.name,
                automaticPoint: currentResEmp.automaticPoint,
                employeePoint: currentResEmp.employeePoint,
                accountablePoint: currentResEmp.accountablePoint,
            }
        }
        return {
            id: resItem._id,
            name: resItem.name,
            automaticPoint: undefined,
            employeePoint: undefined,
            accountablePoint: '',
        }
    })
    const [currentResHandPointFromAccArr, setCurrentResHandPointFromAccArr] = useState(
        resEvalArr?.map((resItem) => (
            resItem?.accountablePoint || ''
        ))
    )

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "all", userId });
    }, [])

    const calcAutomaticPoint = (type) => {
        if (type === 'task') {
            let taskInfo = {
                task: task,
                progress: currentProgress,
                projectDetail,
            };

            let automaticPoint = AutomaticTaskPointCalculator.calcProjectAutoPoint(taskInfo);
            if (isNaN(automaticPoint)) automaticPoint = undefined

            return automaticPoint;
        }
        let taskMemberInfo = {
            task: task,
            progress: currentProgress,
            projectDetail,
            userId,
        };

        let automaticPoint = AutomaticTaskPointCalculator.calcProjectTaskMemberAutoPoint(taskMemberInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined

        return automaticPoint;
    }

    let currentTaskAutomaticPoint = useMemo(() => {
        return calcAutomaticPoint('task')
    }, [currentProgress]);

    let currentAccUserAutomaticPoint = useMemo(() => {
        return calcAutomaticPoint('member')
    }, [currentProgress]);;

    const openModalTaskCalculation = () => {
        setTimeout(() => {
            window.$(`#modal-automatic-point-info-project-task-${task?._id}`).modal('show');
        }, 10);
    }

    const openModalMemberCalculation = () => {
        setTimeout(() => {
            window.$(`#modal-automatic-point-info-project-member-${task?._id}`).modal('show');
        }, 10);
    }

    // const handleSaveEvalResult = async () => {
    //     // console.log('resEvalArr', currentResHandPointFromAccArr)
    //     for (let i = 0; i < resEvalArr.length; i++) {
    //         await props.evaluateTaskByResponsibleEmployeesProject({
    //             userId: resEvalArr[i].id,
    //             taskAutomaticPoint: Number(currentTaskAutomaticPoint),
    //             automaticPoint: Number(resEvalArr[i].automaticPoint),
    //             employeePoint: Number(resEvalArr[i].employeePoint),
    //             accountablePoint: Number(currentResHandPointFromAccArr[i]),
    //             progress: currentProgress,
    //         }, task._id)
    //     }
    //     await props.evaluateTaskByAccountableEmployeesProject({
    //         userId,
    //         taskAutomaticPoint: Number(currentTaskAutomaticPoint),
    //         automaticPoint: Number(currentAccUserAutomaticPoint),
    //         employeePoint: Number(currentAccUserHandPoint),
    //         progress: currentProgress,
    //     }, task._id)
    // }

    useEffect(() => {
        props.handleSaveAccountableData({
            resEvalArr: resEvalArr.map((resItem, resIndex)=>{
                return{
                    userId: resItem.id,
                    taskAutomaticPoint: Number(currentTaskAutomaticPoint),
                    automaticPoint: Number(resItem.automaticPoint),
                    employeePoint: Number(resItem.employeePoint),
                    accountablePoint: Number(currentResHandPointFromAccArr[resIndex]),
                    progress: currentProgress,
                }
            }),
            accData: {
                userId,
                taskAutomaticPoint: Number(currentTaskAutomaticPoint),
                automaticPoint: Number(currentAccUserAutomaticPoint),
                employeePoint: Number(currentAccUserHandPoint),
                progress: currentProgress,
            },
        })
    }, [currentProgress, currentAccUserHandPoint, currentResHandPointFromAccArr])

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
                />
                {/* Thông tin chung */}
                <fieldset className="scheduler-border">
                    {/* <div className="row">
                        <button className="btn btn-success pull-right" style={{ marginRight: 10 }} onClick={() => handleSaveEvalResult()}>Lưu kết quả đánh giá</button>
                    </div> */}
                    <legend className="scheduler-border">Thông tin công việc</legend>
                    <div className="row">
                        <div className="col-md-6">
                            <label>Thời gian bắt đầu công việc</label>
                            {'  '}
                            {moment(task?.startDate).format('HH:mm DD/MM/YYYY')}
                        </div>
                        <div className="col-md-6">
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
                {/* Điểm công việc */}
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
                {/* Điểm người phê duyệt */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Điểm cho người phê duyệt</legend>
                    <div className="row">
                        <div className="col-md-12">
                            <strong>Điểm tự động đã được lưu:</strong>{'  '}
                            {checkIsNullUndefined(currentAccUserAutomaticPointInDB) ? 'Chưa tính được' : currentAccUserAutomaticPointInDB}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <strong>Điểm tự động:</strong>{'  '}
                            <a style={{ cursor: "pointer" }} onClick={openModalMemberCalculation}>
                                {checkIsNullUndefined(currentAccUserAutomaticPoint) ? 'Chưa tính được' : currentAccUserAutomaticPoint}
                            </a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label>Điểm tự đánh giá bằng tay:</label>
                            <input className="form-control" type="number" value={currentAccUserHandPoint} onChange={e => setCurrentAccUserHandPoint(e.target.value)} />
                        </div>
                    </div>
                </fieldset>
                {/* Điểm người thực hiện */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Điểm cho người thực hiện</legend>
                    <h4><strong>Danh sách người thực hiện</strong></h4>
                    <table id="res-employee-eval-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Họ và tên</th>
                                <th>Điểm tự động</th>
                                <th>Điểm tự đánh giá</th>
                                <th>Điểm người phê duyệt đánh giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resEvalArr?.map((resEvalItem, resEvalIndex) => (
                                <tr key={resEvalIndex}>
                                    <td>{resEvalItem?.name}</td>
                                    <td>{checkIsNullUndefined(resEvalItem?.automaticPoint) ? 'Chưa tính được' : resEvalItem?.automaticPoint}</td>
                                    <td>{checkIsNullUndefined(resEvalItem?.employeePoint) ? 'Chưa tính được' : resEvalItem?.employeePoint}</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={currentResHandPointFromAccArr[resEvalIndex]}
                                            onChange={(e) => {
                                                const newArr = currentResHandPointFromAccArr.map((value, index) => {
                                                    if (index === resEvalIndex) {
                                                        return e.target.value
                                                    }
                                                    return value;
                                                })
                                                setCurrentResHandPointFromAccArr(newArr);
                                            }} />
                                        <ErrorLabel style={{ color: 'red' }} content={
                                            currentResHandPointFromAccArr[resEvalIndex] > 100
                                                || currentResHandPointFromAccArr[resEvalIndex] < 0
                                                ? 'Số phải >= 0 và <= 100'
                                                : null} />
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </fieldset>
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
    evaluateTaskByAccountableEmployeesProject: performTaskAction.evaluateTaskByAccountableEmployeesProject,
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
}

const evaluateByAccountableEmployee = connect(mapState, getState)(withTranslate(EvaluateByAccountableEmployeeProject));
export { evaluateByAccountableEmployee as EvaluateByAccountableEmployeeProject }
