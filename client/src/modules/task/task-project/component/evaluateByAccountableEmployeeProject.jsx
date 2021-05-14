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
    });
    const [currentResHandPointFromAccArr, setCurrentResHandPointFromAccArr] = useState(
        resEvalArr?.map((resItem) => (
            resItem?.accountablePoint || ''
        ))
    )
    const [actualCostResMemberArr, setActualCostResMemberArr] = useState(
        task?.actorsWithSalary?.filter((actorItem) => {
            const resArrFlatten = task?.responsibleEmployees?.map((resItem) => String(resItem.id));
            if (resArrFlatten.includes(String(actorItem.userId))) {
                return actorItem;
            }
        })?.map((newActorItem) => {
            return {
                userId: newActorItem.userId,
                actualCost: newActorItem.actualCost,
            }
        })
    )
    const [autoResMemPointArr, setAutoResMemPointArr] = useState(
        resEvalArr.map((resEvalItem) => resEvalItem.automaticPoint)
    )
    const [currentActualCostTask, setCurrentActualCostTask] = useState(task?.actualCost || 0);
    const [currentActualAccMemberCost, setCurrentActualAccMemberCost] = useState(
        task?.actorsWithSalary?.find((actorItem) => {
            return String(actorItem.userId) === String(userId)
        })?.actualCost
        || 0
    );
    const [error, setError] = useState({
        costInput: undefined,
    })

    const getInfoFromTask = (currentTask) => {
        let info = {};
        if (!currentTask) return {};
        const infoTask = currentTask.taskInformations;
        for (let i in infoTask) {
            if (infoTask[i].type === "date") {
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: this.formatDate(infoTask[i].value),
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
                else if (!infoTask[i].filledByAccountableEmployeesOnly) {
                    info[`${infoTask[i].code}`] = {
                        value: this.formatDate(Date.now()),
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
            else if (infoTask[i].type === "set_of_values") {
                let splitSetOfValues = infoTask[i].extra.split('\n');
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: [infoTask[i].value],
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
                else if (!infoTask[i].filledByAccountableEmployeesOnly) {
                    info[`${infoTask[i].code}`] = {
                        value: [splitSetOfValues[0]],
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
            else {
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: infoTask[i].value,
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
        }
        return info;
    }

    const calcAutomaticPoint = (type) => {
        if (type === 'task') {
            let taskInfo = {
                task: task,
                progress: currentProgress,
                projectDetail,
                currentTaskActualCost: Number(currentActualCostTask),
                info: getInfoFromTask(task),
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
            currentMemberActualCost: Number(currentActualAccMemberCost),
            info: getInfoFromTask(task),
        };

        let automaticPoint = AutomaticTaskPointCalculator.calcProjectMemberPoint(taskMemberInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined

        return automaticPoint;
    }

    let currentTaskAutomaticPoint = useMemo(() => {
        return calcAutomaticPoint('task')
    }, [currentProgress, currentActualCostTask]);

    let currentAccUserAutomaticPoint = useMemo(() => {
        return calcAutomaticPoint('member')
    }, [currentProgress, currentActualAccMemberCost]);

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

    const handleSaveEvalResult = async () => {
        // console.log('resEvalArr', currentResHandPointFromAccArr)
        for (let i = 0; i < resEvalArr.length; i++) {
            await props.evaluateTaskByResponsibleEmployeesProject({
                userId: resEvalArr[i].id,
                taskAutomaticPoint: Number(currentTaskAutomaticPoint),
                automaticPoint: Number(autoResMemPointArr[i]),
                employeePoint: Number(resEvalArr[i].employeePoint),
                accountablePoint: Number(currentResHandPointFromAccArr[i]),
                progress: currentProgress,
                actualResMemberCost: Number(
                    actualCostResMemberArr.find((acResItem) => {
                        console.log('resEvalArr[i]', resEvalArr[i], 'acResItem.userId', acResItem.userId)
                        return String(acResItem.userId) === String(resEvalArr[i].id)
                    })?.actualCost
                )
            }, task._id)
        }
        await props.evaluateTaskByAccountableEmployeesProject({
            userId,
            taskAutomaticPoint: Number(currentTaskAutomaticPoint),
            automaticPoint: Number(currentAccUserAutomaticPoint),
            employeePoint: Number(currentAccUserHandPoint),
            progress: currentProgress,
            actualAccMemberCost: Number(currentActualAccMemberCost),
            actualCostTask: Number(currentActualCostTask),
        }, task._id)
    }

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "all", userId });
    }, [])

    useEffect(() => {
        const newAutoResMemberPointArr = actualCostResMemberArr.map((acMemberItem, acMemberIndex) => {
            let taskMemberInfo = {
                task,
                progress: currentProgress,
                projectDetail,
                userId: acMemberItem.userId,
                currentMemberActualCost: Number(acMemberItem.actualCost),
            };
            let automaticPoint = AutomaticTaskPointCalculator.calcProjectMemberPoint(taskMemberInfo);
            if (isNaN(automaticPoint)) automaticPoint = undefined
            return automaticPoint;
        })
        console.log('newAutoResMemberPointArr', newAutoResMemberPointArr)
        setAutoResMemPointArr(newAutoResMemberPointArr);
    }, [actualCostResMemberArr])

    // useEffect để kiểm tra nếu 3 thông số cost đã hợp lý chưa
    useEffect(() => {
        let totalResCost = 0;
        for (let acResItem of actualCostResMemberArr) {
            totalResCost += Number(acResItem.actualCost);
        }
        if (Number(currentActualCostTask) < Number(currentActualAccMemberCost) + totalResCost) {
            setTimeout(() => {
                setError({
                    ...error,
                    costInput: 'Tổng chi phí cho công việc phải lớn hơn chi phí phê duyệt và chi phí thực hiện cộng lại',
                })
            }, 10);
        } else {
            setTimeout(() => {
                setError({
                    ...error,
                    costInput: undefined,
                })
            }, 10);
        }
    }, [currentActualCostTask, currentActualAccMemberCost, actualCostResMemberArr])

    // useEffect(() => {
    //     props.handleSaveAccountableData({
    //         resEvalArr: resEvalArr.map((resItem, resIndex) => {
    //             return {
    //                 userId: resItem.id,
    //                 taskAutomaticPoint: Number(currentTaskAutomaticPoint),
    //                 automaticPoint: Number(resItem.automaticPoint),
    //                 employeePoint: Number(resItem.employeePoint),
    //                 accountablePoint: Number(currentResHandPointFromAccArr[resIndex]),
    //                 progress: currentProgress,
    //                 actualResMemberCost: Number(
    //                     actualCostResMemberArr.find((acResItem) => {
    //                         return String(acResItem.userId) === String(resItem.id)
    //                     })?.actualCost
    //                 )
    //             }
    //         }),
    //         accData: {
    //             userId,
    //             taskAutomaticPoint: Number(currentTaskAutomaticPoint),
    //             automaticPoint: Number(currentAccUserAutomaticPoint),
    //             employeePoint: Number(currentAccUserHandPoint),
    //             progress: currentProgress,
    //             actualCost: Number(currentActualAccMemberCost),
    //         },
    //     })
    // }, [currentProgress, currentAccUserHandPoint, currentResHandPointFromAccArr, autoResMemPointArr, actualCostResMemberArr, currentActualAccMemberCost])

    return (
        <React.Fragment>
            <div className="body-evaluation">
                <ModalShowAutoPointInfoProjectTask
                    task={task}
                    progress={currentProgress}
                    currentTaskActualCost={currentActualCostTask}
                    projectDetail={projectDetail}
                />
                <ModalShowAutoPointInfoProjectMember
                    task={task}
                    progress={currentProgress}
                    projectDetail={projectDetail}
                    userId={userId}
                    currentMemberActualCost={currentActualAccMemberCost}
                />
                {/* Thông tin chung */}
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
                        <div className="col-md-6 col-xs-6">
                            <label>Tiến độ công việc (%):</label>
                            <input className="form-control" type="number" value={currentProgress} onChange={e => setCurrentProgress(e.target.value)} />
                        </div>
                        <div className={`col-md-6 col-xs-6 form-group ${error.costInput === undefined ? "" : "has-error"}`}>
                            <label>Chi phí thực công việc (VND):</label>
                            <input className="form-control" type="number" value={currentActualCostTask} onChange={e => setCurrentActualCostTask(e.target.value)} />
                            <ErrorLabel content={error.costInput} />
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
                        <div className={`col-md-12 form-group ${error.costInput === undefined ? "" : "has-error"}`}>
                            <label>Chi phí thực của thành viên phê duyệt:</label>
                            <input className="form-control" type="number" value={currentActualAccMemberCost} onChange={e => setCurrentActualAccMemberCost(e.target.value)} />
                            <ErrorLabel content={error.costInput} />
                        </div>
                    </div>
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
                                <th>Điểm tự động trong CSDL</th>
                                <th>Điểm tự đánh giá</th>
                                <th>Điểm người phê duyệt đánh giá</th>
                                <th>Điểm tự động đang tính</th>
                                <th>Chi phí thực của thành viên thực hiện</th>
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
                                    <td>{checkIsNullUndefined(autoResMemPointArr[resEvalIndex]) ? 'Chưa tính được' : autoResMemPointArr[resEvalIndex]}</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={actualCostResMemberArr[resEvalIndex].actualCost}
                                            onChange={(e) => {
                                                const newArr = actualCostResMemberArr.map((value, index) => {
                                                    if (index === resEvalIndex) {
                                                        return {
                                                            ...value,
                                                            actualCost: e.target.value,
                                                        }
                                                    }
                                                    return value;
                                                })
                                                setActualCostResMemberArr(newArr);
                                            }} />
                                        {error.costInput && <ErrorLabel style={{ color: 'red' }} content={error.costInput} />}
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
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
    evaluateTaskByAccountableEmployeesProject: performTaskAction.evaluateTaskByAccountableEmployeesProject,
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
}

const evaluateByAccountableEmployee = connect(mapState, getState)(withTranslate(EvaluateByAccountableEmployeeProject));
export { evaluateByAccountableEmployee as EvaluateByAccountableEmployeeProject }
