import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import { DatePicker } from '../../../../common-components';
import { checkIsNullUndefined, numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import { AutomaticTaskPointCalculator } from '../../../task/task-perform/component/automaticTaskPointCalculator';

const TabEvalSelf = (props) => {
    const { currentTasks, translate, listTasksEval, currentMonth, handleChangeMonth, projectDetail, userId } = props;
    // console.log('currentTasks', currentTasks)
    // console.log('listTasksEval', listTasksEval)
    const handleSelfData = (listTaskData) => {
        if (!listTaskData || listTaskData.length === 0) return undefined;
        let selfData;
        const selfItem = projectDetail.responsibleEmployees.find(projectEmpItem => String(projectEmpItem._id) === userId)
            || projectDetail.projectManager.find(projectManItem => String(projectManItem._id) === userId);
        if (!selfItem) return undefined;
        
        // Lấy danh sách tasks mà có member này tham gia
        const tasksWithMemberArr = listTaskData.filter((listTaskItem) => {
            const responsibleEmployeesFlatten = listTaskItem.responsibleEmployees.map(resItem => String(resItem.id));
            const accountableEmployeesFlatten = listTaskItem.accountableEmployees.map(accItem => String(accItem.id));
            if (responsibleEmployeesFlatten.includes(String(userId)) ||
                accountableEmployeesFlatten.includes(String(userId))) {
                return listTaskItem;
            }
        })
        if (tasksWithMemberArr.length === 0) return undefined;
        else {
            let tasksWithPointAndRoleAndEVM = [];
            // Lấy tất cả thông số trên qua vòng lặp tasksWithMemberArr
            for (let tasksWithMemberItem of tasksWithMemberArr) {
                let currentMemberCurrentTaskPoint = 0;
                let currentRole = 'accountable';
                const currentMemberEvalRes = tasksWithMemberItem?.overallEvaluation?.responsibleEmployees.find(resEval => String(resEval.employee) === String(userId));
                const currentMemberEvalAcc = tasksWithMemberItem?.overallEvaluation?.accountableEmployees.find(accEval => String(accEval.employee) === String(userId));
                if (currentMemberEvalRes) {
                    let curAutomaticPoint = checkIsNullUndefined(currentMemberEvalRes.automaticPoint) ? 0 : currentMemberEvalRes.automaticPoint;
                    let curEmployeePoint = checkIsNullUndefined(currentMemberEvalRes.employeePoint) ? 0 : currentMemberEvalRes.employeePoint;
                    let curAccountablePoint = checkIsNullUndefined(currentMemberEvalRes.accountablePoint) ? 0 : currentMemberEvalRes.accountablePoint;
                    currentMemberCurrentTaskPoint = (curAutomaticPoint + curEmployeePoint + curAccountablePoint) / 3;
                }
                if (currentMemberEvalAcc) {
                    let curAutomaticPoint = checkIsNullUndefined(currentMemberEvalAcc.automaticPoint) ? 0 : currentMemberEvalAcc.automaticPoint;
                    let curEmployeePoint = checkIsNullUndefined(currentMemberEvalAcc.employeePoint) ? 0 : currentMemberEvalAcc.employeePoint;
                    currentMemberCurrentTaskPoint = (curAutomaticPoint + curEmployeePoint) / 2;
                }
                // Check currentRole
                if (tasksWithMemberItem.responsibleEmployees.find(resItem => String(resItem.id) === String(userId))) currentRole = 'responsible';
                // Tính toán PV, AC, EV của nhân viên trong task
                const data = {
                    task: tasksWithMemberItem,
                    progress: tasksWithMemberItem.progress,
                    projectDetail,
                    userId: userId,
                }
                const resultCalculate = AutomaticTaskPointCalculator.calcProjectTaskMemberAutoPoint(data, false);
                tasksWithPointAndRoleAndEVM.push({
                    tasksWithMemberItem,
                    currentRole,
                    currentMemberCurrentTaskPoint,
                    ...resultCalculate,
                })
            }
            // Tính điểm trung bình cộng của tất cả task trong tháng của nhân viên đó
            let sumPoint = 0, totalPV = 0, totalAC = 0, totalEV = 0;
            let counter = 0;
            for (let taskPointRoleEVMItem of tasksWithPointAndRoleAndEVM) {
                // console.log(taskPointRoleEVMItem.currentMemberCurrentTaskPoint, taskPointRoleEVMItem.plannedValue, taskPointRoleEVMItem.actualCost, taskPointRoleEVMItem.earnedValue)
                sumPoint += taskPointRoleEVMItem.currentMemberCurrentTaskPoint;
                totalPV += taskPointRoleEVMItem.plannedValue;
                totalAC += taskPointRoleEVMItem.actualCost;
                totalEV += taskPointRoleEVMItem.earnedValue;
                counter++;
            }
            selfData = {
                id: userId,
                name: selfItem.name,
                tasksWithPointAndRoleAndEVM,
                averagePoint: sumPoint / counter,
                totalPV,
                totalAC,
                totalEV,
            }
        }
        return selfData;
    }

    const processedSelfData = handleSelfData(listTasksEval);

    return (
        <React.Fragment>
            <div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h4><strong>Điểm số thành viên {processedSelfData?.name} trong tháng</strong></h4>
                        {/* Chọn tháng để lọc đánh giâ */}
                        <div className="form-group">
                            <label style={{ marginRight: 20 }}>Chọn tháng</label>
                            <DatePicker
                                id="start-date-eval-self-statistical"
                                dateFormat="month-year"
                                value={moment(currentMonth).format('MM-YYYY')}
                                onChange={handleChangeMonth}
                                disabled={false}
                            />
                        </div>
                        <table id="eval-project-members-statistical-table" className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Họ và tên</th>
                                    <th>Tháng đánh giá</th>
                                    <th>Tên công việc</th>
                                    <th>Thời gian bắt đầu</th>
                                    <th>Thời gian dự kiến kết thúc</th>
                                    <th>Planned Value (VND)</th>
                                    <th>Actual Cost (VND)</th>
                                    <th>Earned Value (VND)</th>
                                    <th>Vai trò</th>
                                    <th>Điểm số thành viên</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedSelfData &&
                                    processedSelfData?.tasksWithPointAndRoleAndEVM?.map((memberTaskItem, memberTaskIndex) => {
                                        if (memberTaskIndex === processedSelfData?.tasksWithPointAndRoleAndEVM.length - 1) {
                                            return (
                                                <>
                                                    <tr key={`${userId}-${memberTaskIndex}-0`}>
                                                        <td><strong>{memberTaskIndex === 0 ? processedSelfData?.name : ''}</strong></td>
                                                        <td>{moment(currentMonth).format('M')}</td>
                                                        <td>{memberTaskItem?.tasksWithMemberItem.name}</td>
                                                        <td>{moment(memberTaskItem?.tasksWithMemberItem?.startDate).format('DD/MM/YYYY')}</td>
                                                        <td>{moment(memberTaskItem?.tasksWithMemberItem?.endDate).format('DD/MM/YYYY')}</td>
                                                        <td>{numberWithCommas(memberTaskItem?.plannedValue)}</td>
                                                        <td>{numberWithCommas(memberTaskItem?.actualCost)}</td>
                                                        <td>{numberWithCommas(memberTaskItem?.earnedValue)}</td>
                                                        <td>{memberTaskItem.currentRole}</td>
                                                        <td>{numberWithCommas(memberTaskItem.currentMemberCurrentTaskPoint)} / 100</td>
                                                    </tr>
                                                    {
                                                        processedSelfData.tasksWithPointAndRoleAndEVM.length > 1
                                                        &&
                                                        <tr key={`${userId}-${memberTaskIndex}-1`}>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td style={{ fontWeight: 'bold' }}>{numberWithCommas(processedSelfData?.totalPV)}</td>
                                                            <td style={{ fontWeight: 'bold' }}>{numberWithCommas(processedSelfData?.totalAC)}</td>
                                                            <td style={{ fontWeight: 'bold' }}>{numberWithCommas(processedSelfData?.totalEV)}</td>
                                                            <td></td>
                                                            <td style={{ fontWeight: 'bold' }}>{numberWithCommas(processedSelfData?.averagePoint)} / 100</td>
                                                        </tr>
                                                    }
                                                </>
                                            )
                                        }
                                        return (
                                            <tr key={`${userId}-${memberTaskIndex}-2`}>
                                                <td><strong>{memberTaskIndex === 0 ? processedSelfData?.name : ''}</strong></td>
                                                <td>{moment(currentMonth).format('M')}</td>
                                                <td>{memberTaskItem?.tasksWithMemberItem.name}</td>
                                                <td>{moment(memberTaskItem?.tasksWithMemberItem?.startDate).format('DD/MM/YYYY')}</td>
                                                <td>{moment(memberTaskItem?.tasksWithMemberItem?.endDate).format('DD/MM/YYYY')}</td>
                                                <td>{numberWithCommas(memberTaskItem?.plannedValue)}</td>
                                                <td>{numberWithCommas(memberTaskItem?.actualCost)}</td>
                                                <td>{numberWithCommas(memberTaskItem?.earnedValue)}</td>
                                                <td>{memberTaskItem.currentRole}</td>
                                                <td>{numberWithCommas(memberTaskItem.currentMemberCurrentTaskPoint)} / 100</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {!processedSelfData && 'Không có công việc nào trong tháng này'}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const project = state.project;
    return { project }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabEvalSelf));