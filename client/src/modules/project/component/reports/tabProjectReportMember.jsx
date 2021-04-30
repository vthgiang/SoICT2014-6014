import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { getAmountOfWeekDaysInMonth } from '../projects/functionHelper';
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers';

momentDurationFormatSetup(moment);
const MILISECS_TO_DAYS = 86400000;

const TabProjectReportMember = (props) => {
    const { currentTasks, translate, projectDetail } = props;

    const getCurrentActualCostForTask = (taskItem) => {
        let actualCost = 0;
        const { timesheetLogs, actorsWithSalary, responsibleEmployees, accountableEmployees } = taskItem
        if (!timesheetLogs) return 0;
        for (let timeItem of timesheetLogs) {
            // Lấy salary của creator của timeLog đó
            let currentSalary = actorsWithSalary.find(actorItem => String(actorItem.userId) === String(timeItem.creator))?.salary;
            // Tính số ngày công của tháng đó
            const currentMonthWorkDays = getAmountOfWeekDaysInMonth(moment(timeItem.startedAt));
            // Tính trọng số của creator cho task đó
            let weight = 0;
            const responsibleEmployeesFlatten = responsibleEmployees.map(resItem => String(resItem.id));
            const accountableEmployeesFlatten = accountableEmployees.map(accItem => String(accItem.id));
            if (responsibleEmployeesFlatten.includes(String(timeItem.creator))) {
                weight = 0.8 / responsibleEmployeesFlatten.length;  // Trọng số phải đi kèm với số người
            } else {
                weight = 0.2 / accountableEmployeesFlatten.length;  // Trọng số phải đi kèm với số người
            }
            // Tính actual cost của task đó bằng cách cộng thêm actual cost của creator hiện tại
            actualCost += weight * (currentSalary / currentMonthWorkDays) * (timeItem.duration / MILISECS_TO_DAYS);
        }
        return actualCost;
    }

    const preprocessMembersData = () => {
        let result = [];
        if (!currentTasks || !projectDetail) return [];
        // Cần check xem có cần projectManager và creator không?
        for (let memberItem of projectDetail.responsibleEmployees) {
            // Lấy danh sách tasks mà có member này tham gia
            const tasksWithMemberArr = currentTasks.filter((currentTaskItem) => {
                const responsibleEmployeesFlatten = currentTaskItem.responsibleEmployees.map(resItem => String(resItem.id));
                const accountableEmployeesFlatten = currentTaskItem.accountableEmployees.map(accItem => String(accItem.id));
                if (responsibleEmployeesFlatten.includes(String(memberItem.id)) ||
                    accountableEmployeesFlatten.includes(String(memberItem.id))) {
                    return currentTaskItem;
                }
            })
            let doingTasks = [], notStartedYetTasks = [];
            let onScheduleTasks = [], onBudgetTasks = [];
            let overdueTasks = [], behindScheduleTasks = [], behindBudgetTasks = []
            let totalTimeLogsMilliseconds = 0, totalActualCostForMember = 0, totalBudgetForMember = 0;
            let tasksWithBudgetAndCost = [];
            // Lấy tất cả thông số trên qua vòng lặp tasksWithMemberArr
            for (let tasksWithMemberItem of tasksWithMemberArr) {
                // Tính tổng số giờ của nhân viên dành cho task đó
                const currentTimeLogMember = tasksWithMemberItem.timesheetLogs.filter(item => String(item.creator) === String(memberItem.id));
                for (let currentTimeLogMemberItem of currentTimeLogMember) {
                    totalTimeLogsMilliseconds += currentTimeLogMemberItem.duration;
                }
                // Tính trọng số của nhân viên cho task đó
                let weight = 0;
                const responsibleEmployeesFlatten = tasksWithMemberItem.responsibleEmployees.map(resItem => String(resItem.id));
                const accountableEmployeesFlatten = tasksWithMemberItem.accountableEmployees.map(accItem => String(accItem.id));
                if (responsibleEmployeesFlatten.includes(String(memberItem.id))) {
                    weight = 0.8 / responsibleEmployeesFlatten.length;  // Trọng số phải đi kèm với số người
                } else {
                    weight = 0.2 / accountableEmployeesFlatten.length;  // Trọng số phải đi kèm với số người
                }
                // Tính ngân sách của nhân viên cho task đó
                totalBudgetForMember += weight * tasksWithMemberItem.estimateNormalCost;
                // Lấy salary của creator của timeLog đó
                let currentSalary = tasksWithMemberItem?.actorsWithSalary.find(actorItem => String(actorItem.userId) === String(memberItem.id))?.salary;
                // Tính số ngày công của tháng đó
                const currentMonthWorkDays = getAmountOfWeekDaysInMonth(moment(tasksWithMemberItem.startDate));
                // Tính chi phí của nhân viên cho task đó
                let actualCostEachTask = 0;
                for (let currentTimeLogMemberItem of currentTimeLogMember) {
                    actualCostEachTask += weight * (currentSalary / currentMonthWorkDays) * currentTimeLogMemberItem.duration / MILISECS_TO_DAYS;
                    totalActualCostForMember += actualCostEachTask;
                }
                // Push vào tasksWithBudgetAndCost
                tasksWithBudgetAndCost.push({
                    id: tasksWithMemberItem?._id,
                    code: tasksWithMemberItem?.code,
                    name: tasksWithMemberItem?.name,
                    budgetEachTask: weight * tasksWithMemberItem.estimateNormalCost,
                    actualCostEachTask,
                })
                // Push vào doingTasks
                if (moment().isSameOrAfter(moment(tasksWithMemberItem.startDate)) && moment().isBefore(moment(tasksWithMemberItem.endDate))
                    && tasksWithMemberItem.progress < 100) {
                    doingTasks.push(tasksWithMemberItem);
                }
                // Push vào notStartedYetTasks
                if (moment().isBefore(moment(tasksWithMemberItem.startDate))) {
                    notStartedYetTasks.push(tasksWithMemberItem);
                }
                // Push vào onScheduleTasks
                const diffFromStartToNow = moment().diff(moment(tasksWithMemberItem.startDate), 'milliseconds');
                const diffFromStartToEstimateEnd = moment(tasksWithMemberItem.endDate).diff(moment(tasksWithMemberItem.startDate), 'milliseconds');
                if (moment().isSameOrBefore(moment(tasksWithMemberItem.endDate)) && diffFromStartToNow / diffFromStartToEstimateEnd <= Number(tasksWithMemberItem.progress) / 100) {
                    onScheduleTasks.push(tasksWithMemberItem);
                }
                // Push vào behindScheduleTasks
                if (moment().isSameOrBefore(moment(tasksWithMemberItem.endDate)) && diffFromStartToNow / diffFromStartToEstimateEnd > Number(tasksWithMemberItem.progress) / 100) {
                    behindScheduleTasks.push(tasksWithMemberItem);
                }
                // Push vào overdueTasks
                if (tasksWithMemberItem.progress < 100 && moment().isAfter(moment(tasksWithMemberItem.endDate))) {
                    overdueTasks.push(tasksWithMemberItem);
                }
                // Push vào onBudgetTasks
                let currentTaskActualCost = tasksWithMemberItem.actualCost || getCurrentActualCostForTask(tasksWithMemberItem);
                if (currentTaskActualCost <= tasksWithMemberItem.estimateNormalCost) {
                    onBudgetTasks.push(tasksWithMemberItem);
                }
                // Push vào behindBudgetTasks
                if (currentTaskActualCost > tasksWithMemberItem.estimateNormalCost) {
                    behindBudgetTasks.push(tasksWithMemberItem);
                }
            }
            result.push({
                id: memberItem.id,
                totalTasks: tasksWithMemberArr,
                name: memberItem.name,
                tasksWithBudgetAndCost,
                totalTimeLogs: totalTimeLogsMilliseconds === 0 ? '00:00:00' : moment.duration(totalTimeLogsMilliseconds, 'milliseconds').format('HH:mm:ss'),
                totalBudgetForMember,
                totalActualCostForMember,
                doingTasks,
                notStartedYetTasks,
                onScheduleTasks,
                behindScheduleTasks,
                overdueTasks,
                onBudgetTasks,
                behindBudgetTasks,
            })
        }
        console.log('result', result);
        return result;
    }

    // Function để lấy danh sách những nhân viên trễ tiến độ
    const getMembersAlwaysBehindSchedule = (membersData) => {
        let membersAlwaysBehindSchedule = [];
        membersData.forEach((item) => {
            const { id, name, behindScheduleTasks, overdueTasks, totalTasks } = item;
            if ((behindScheduleTasks.length + overdueTasks.length) / totalTasks.length >= 0.5 && behindScheduleTasks.length + overdueTasks.length > 0) {
                membersAlwaysBehindSchedule.push({
                    id,
                    name,
                    behindNumber: Number(behindScheduleTasks.length) + Number(overdueTasks.length),
                    totalNumber: Number(totalTasks.length),
                    behindScheduleTasks: [...behindScheduleTasks, ...overdueTasks],
                })
            }
        });
        const sortedArr = membersAlwaysBehindSchedule.sort((a, b) => {
            return b.behindNumber - a.behindNumber;
        });
        return sortedArr;
    }

    // Function để lấy danh sách những nhân viên làm thừa chi phí so với ngân sách
    const getMembersAlwaysBehindBudget = (membersData) => {
        let membersAlwaysBehindBudget = [];
        membersData.forEach((item) => {
            const { id, name, behindBudgetTasks, totalTasks } = item;
            if (behindBudgetTasks.length / totalTasks.length >= 0.5 && behindBudgetTasks.length > 0) {
                membersAlwaysBehindBudget.push({
                    id,
                    name,
                    behindNumber: Number(behindBudgetTasks.length),
                    totalNumber: Number(totalTasks.length),
                    behindBudgetTasks,
                })
            }
        });
        const sortedArr = membersAlwaysBehindBudget.sort((a, b) => {
            return b.behindNumber - a.behindNumber;
        });
        return sortedArr;
    }

    const membersData = preprocessMembersData();

    const renderData = (data, paramText) => {
        if (data.length === 0) return <div className="col-md-4 statistical-item">Không có thành viên nào</div>
        return data.map((item, index) => {
            return (
                <div key={item?.id} className="col-md-4 statistical-item">
                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#d3d3d3", padding: '10px', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">person</span>
                            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{item?.name}</span>
                        </div>
                        <span style={{ fontSize: '17px', color: 'red' }} className="info-box-number">
                            {item?.behindNumber} {paramText}
                            <span>{' '}</span>
                            <span style={{ fontSize: '17px', color: 'black' }}>/ {item?.totalNumber} tổng số</span>
                        </span>
                    </div>
                </div>
            )
        })
    }

    return (
        <React.Fragment>
            <div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h4><strong>Các thành viên điểm số cao</strong></h4>

                    </div>
                </div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h4><strong>Các thành viên hay bị chậm tiến độ / quá hạn</strong></h4>
                        <div className="row statistical-wrapper" style={{ marginTop: '5px' }}>
                            {renderData(getMembersAlwaysBehindSchedule(membersData), 'công việc trễ tiến độ')}
                        </div>
                    </div>
                </div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h4><strong>Các thành viên hay để lãng phí chi phí</strong></h4>
                        <div className="row statistical-wrapper" style={{ marginTop: '5px' }}>
                            {renderData(getMembersAlwaysBehindBudget(membersData), 'công việc lãng phí chi phí')}
                        </div>
                    </div>
                </div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h4><strong>Tổng quan thành viên dự án</strong></h4>
                        <table id="report-member-table" className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Tên thành viên</th>
                                    <th>Số giờ làm việc</th>
                                    <th>Số công việc đang làm</th>
                                    <th>Số công việc chưa làm</th>
                                    <th>Số công việc trễ tiến độ</th>
                                    <th>Số công việc quá hạn</th>
                                    <th>Số công việc đủ chi phí</th>
                                    <th>Số công việc lãng phí chi phí</th>
                                    <th>Ngân sách cho thành viên (VND)</th>
                                    <th>Chi phí thực của thành viên (VND)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(membersData && membersData.length !== 0) &&
                                    membersData.map((memberItem, index) => (
                                        <tr key={index}>
                                            <td>{memberItem?.name}</td>
                                            <td>{memberItem?.totalTimeLogs}</td>
                                            <td>{memberItem?.doingTasks.length}</td>
                                            <td>{memberItem?.notStartedYetTasks.length}</td>
                                            <td style={{ color: memberItem?.behindScheduleTasks.length === 0 ? 'black' : 'red' }}>{memberItem?.behindScheduleTasks.length}</td>
                                            <td style={{ color: memberItem?.overdueTasks.length === 0 ? 'black' : 'red' }}>{memberItem?.overdueTasks.length}</td>
                                            <td>{memberItem?.onBudgetTasks.length}</td>
                                            <td style={{ color: memberItem?.behindBudgetTasks.length === 0 ? 'black' : 'red' }}>{memberItem?.behindBudgetTasks.length}</td>
                                            <td>{numberWithCommas(memberItem?.totalBudgetForMember)}</td>
                                            <td style={{ color: memberItem?.totalActualCostForMember > memberItem?.totalBudgetForMember ? 'red' : 'black' }}>
                                                {numberWithCommas(memberItem?.totalActualCostForMember)}
                                            </td>
                                        </tr>
                                    ))
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabProjectReportMember));