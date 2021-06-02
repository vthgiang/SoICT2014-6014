import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../projects/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import { DatePicker } from '../../../../common-components';
import { checkIsNullUndefined, numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import { AutomaticTaskPointCalculator } from '../../../task/task-perform/component/automaticTaskPointCalculator';

const TabEvalProjectMember = (props) => {
    const { currentTasks, translate, listTasksEval, currentMonth, handleChangeMonth, projectDetail } = props;
    // console.log('currentTasks', currentTasks)
    // console.log('listTasksEval', listTasksEval)
    const handleMembersData = (listTaskData) => {
        if (!listTaskData || listTaskData.length === 0) return [];
        let membersData = [];
        // Cần check xem có cần projectManager và creator không?
        for (let memberItem of projectDetail.responsibleEmployees) {
            // Lấy danh sách tasks mà có member này tham gia
            const tasksWithMemberArr = listTaskData.filter((listTaskItem) => {
                const responsibleEmployeesFlatten = listTaskItem.responsibleEmployees.map(resItem => String(resItem.id));
                const accountableEmployeesFlatten = listTaskItem.accountableEmployees.map(accItem => String(accItem.id));
                if (responsibleEmployeesFlatten.includes(String(memberItem.id)) ||
                    accountableEmployeesFlatten.includes(String(memberItem.id))) {
                    return listTaskItem;
                }
            })
            if (tasksWithMemberArr.length === 0) continue;
            else {
                let tasksWithPointAndRoleAndEVM = [];
                // Lấy tất cả thông số trên qua vòng lặp tasksWithMemberArr
                for (let tasksWithMemberItem of tasksWithMemberArr) {
                    let currentMemberCurrentTaskPoint = 0;
                    let currentRole = 'accountable';
                    const currentMemberEvalRes = tasksWithMemberItem?.overallEvaluation?.responsibleEmployees.find(resEval => String(resEval.employee) === String(memberItem.id));
                    const currentMemberEvalAcc = tasksWithMemberItem?.overallEvaluation?.accountableEmployees.find(accEval => String(accEval.employee) === String(memberItem.id));
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
                    if (tasksWithMemberItem.responsibleEmployees.find(resItem => String(resItem.id) === String(memberItem.id))) currentRole = 'responsible';
                    // Tính toán estCost, realCost, estDuration và realDuration của nhân viên trong task
                    const data = {
                        task: tasksWithMemberItem,
                        progress: tasksWithMemberItem.progress,
                        projectDetail,
                        userId: memberItem.id,
                    }
                    const resultCalculate = AutomaticTaskPointCalculator.calcMemberStatisticEvalPoint(data, false);
                    tasksWithPointAndRoleAndEVM.push({
                        tasksWithMemberItem,
                        currentRole,
                        currentMemberCurrentTaskPoint,
                        ...resultCalculate,
                    })
                }
                // Tính điểm trung bình cộng của tất cả task trong tháng của nhân viên đó
                let sumPoint = 0, totalEstCost = 0, totalRealCost = 0;
                let counter = 0;
                for (let taskPointRoleEVMItem of tasksWithPointAndRoleAndEVM) {
                    // console.log(taskPointRoleEVMItem.currentMemberCurrentTaskPoint, taskPointRoleEVMItem.plannedValue, taskPointRoleEVMItem.actualCost, taskPointRoleEVMItem.earnedValue)
                    sumPoint += taskPointRoleEVMItem.currentMemberCurrentTaskPoint;
                    totalEstCost += taskPointRoleEVMItem.estCost;
                    totalRealCost += taskPointRoleEVMItem.realCost;
                    counter++;
                }
                membersData.push({
                    id: memberItem.id,
                    name: memberItem.name,
                    tasksWithPointAndRoleAndEVM,
                    averagePoint: sumPoint / counter,
                    totalEstCost,
                    totalRealCost,
                })
            }
        }
        // console.log('membersData', membersData)
        return membersData;
    }

    const processedMemberData = handleMembersData(listTasksEval);

    return (
        <React.Fragment>
            <div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h4><strong>Điểm số thành viên dự án trong tháng</strong></h4>
                        {/* Chọn tháng để lọc đánh giâ */}
                        <div className="form-group">
                            <label style={{ marginRight: 20 }}>Chọn tháng</label>
                            <DatePicker
                                id="start-date-eval-project-members-statistical"
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
                                    <th>Trạng thái công việc</th>
                                    <th>Tên công việc</th>
                                    <th>Thời điểm bắt đầu</th>
                                    <th>Thời điểm kết thúc dự kiến</th>
                                    <th>Thời điểm kết thúc thực tế</th>
                                    <th>Thời lượng ước lượng ({translate(`project.unit.${projectDetail?.unitTime}`)})</th>
                                    <th>Thời lượng thực tế ({translate(`project.unit.${projectDetail?.unitTime}`)})</th>
                                    <th>Tổng chi phí ước lượng thành viên (VND)</th>
                                    <th>Tổng chi phí thực tế thành viên (VND)</th>
                                    <th>Vai trò</th>
                                    <th>Điểm số thành viên</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(processedMemberData.length !== 0) &&
                                    processedMemberData.map((memberItem, memberIndex) => {
                                        return memberItem?.tasksWithPointAndRoleAndEVM?.map((memberTaskItem, memberTaskIndex) => {
                                            console.log(memberItem?.name, memberTaskItem?.tasksWithMemberItem.name, memberTaskItem?.tasksWithMemberItem.status)
                                            if (memberTaskIndex === memberItem?.tasksWithPointAndRoleAndEVM.length - 1) {
                                                return (
                                                    <>
                                                        <tr key={`${memberItem.id}-${memberTaskItem?.tasksWithMemberItem.name}-${memberIndex}-${memberTaskIndex}-0`}>
                                                            <td><strong>{memberTaskIndex === 0 ? memberItem?.name : ''}</strong></td>
                                                            <td>{memberTaskItem?.tasksWithMemberItem?.status}</td>
                                                            <td>{memberTaskItem?.tasksWithMemberItem.name}</td>
                                                            <td>{moment(memberTaskItem?.tasksWithMemberItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                                            <td>{moment(memberTaskItem?.tasksWithMemberItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                                            <td>{memberTaskItem?.tasksWithMemberItem?.actualEndDate && memberTaskItem?.tasksWithMemberItem?.status === 'finished'
                                                                && moment(memberTaskItem?.tasksWithMemberItem?.actualEndDate).format('HH:mm DD/MM/YYYY')}</td>
                                                            <td>{numberWithCommas(memberTaskItem?.estDuration)}</td>
                                                            <td>{memberTaskItem?.realDuration && numberWithCommas(memberTaskItem?.realDuration)}</td>
                                                            <td>{numberWithCommas(memberTaskItem?.estCost)}</td>
                                                            <td>{numberWithCommas(memberTaskItem?.realCost)}</td>
                                                            <td>{memberTaskItem.currentRole}</td>
                                                            <td>{numberWithCommas(memberTaskItem.currentMemberCurrentTaskPoint)} / 100</td>
                                                        </tr>
                                                        {
                                                            memberItem.tasksWithPointAndRoleAndEVM.length > 1
                                                            &&
                                                            <tr key={`${memberItem.id}-${memberTaskItem?.tasksWithMemberItem.name}-${memberIndex}-${memberTaskIndex}-1`}>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td style={{ fontWeight: 'bold' }}>{numberWithCommas(memberItem?.totalEstCost)}</td>
                                                                <td style={{ fontWeight: 'bold' }}>{numberWithCommas(memberItem?.totalRealCost)}</td>
                                                                <td></td>
                                                                <td style={{ fontWeight: 'bold' }}>{numberWithCommas(memberItem?.averagePoint)} / 100</td>
                                                            </tr>
                                                        }
                                                    </>
                                                )
                                            }
                                            return (
                                                <tr key={`${memberItem.id}-${memberTaskItem?.tasksWithMemberItem.name}-${memberIndex}-${memberTaskIndex}-2`}>
                                                    <td><strong>{memberTaskIndex === 0 ? memberItem?.name : ''}</strong></td>
                                                    <td>{memberTaskItem?.tasksWithMemberItem?.status}</td>
                                                    <td>{memberTaskItem?.tasksWithMemberItem.name}</td>
                                                    <td>{moment(memberTaskItem?.tasksWithMemberItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                                    <td>{moment(memberTaskItem?.tasksWithMemberItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                                    <td>{memberTaskItem?.tasksWithMemberItem?.actualEndDate && memberTaskItem?.tasksWithMemberItem?.status === 'finished'
                                                        && moment(memberTaskItem?.tasksWithMemberItem?.actualEndDate).format('HH:mm DD/MM/YYYY')}</td>
                                                    <td>{numberWithCommas(memberTaskItem?.estDuration)}</td>
                                                    <td>{memberTaskItem?.realDuration && numberWithCommas(memberTaskItem?.realDuration)}</td>
                                                    <td>{numberWithCommas(memberTaskItem?.estCost)}</td>
                                                    <td>{numberWithCommas(memberTaskItem?.realCost)}</td>
                                                    <td>{memberTaskItem.currentRole}</td>
                                                    <td>{numberWithCommas(memberTaskItem.currentMemberCurrentTaskPoint)} / 100</td>
                                                </tr>
                                            )
                                        })
                                    })
                                }
                            </tbody>
                        </table>
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabEvalProjectMember));