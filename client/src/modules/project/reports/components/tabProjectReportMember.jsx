import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../projects/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { getActualMemberCostOfTask, getAmountOfWeekDaysInMonth, getCurrentProjectDetails, getEstimateMemberCostOfTask } from '../../projects/components/functionHelper';
import { checkIsNullUndefined, numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import c3 from 'c3';
import 'c3/c3.css';

momentDurationFormatSetup(moment);

const TabProjectReportMember = (props) => {
    const { currentTasks, translate, projectDetail, project, } = props;

    const chartHighScoreRef = useRef(null);
    const chartOverdueScheduleRef = useRef(null);
    const chartBehindBudgetRef = useRef(null);

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
            let currentMemberPointSum = 0;
            let taskWithMemberItemForPoints = 0;
            let doingTasks = [], notStartedYetTasks = [];
            let onScheduleTasks = [], onBudgetTasks = [];
            let overdueTasks = [], behindScheduleTasks = [], behindBudgetTasks = []
            let totalTimeLogsMilliseconds = 0, totalActualCostForMember = 0, totalBudgetForMember = 0;
            let tasksWithBudgetAndCostAndPointForMember = [];
            // Lấy tất cả thông số trên qua vòng lặp tasksWithMemberArr
            for (let tasksWithMemberItem of tasksWithMemberArr) {
                // console.log('tasksWithMemberItem', tasksWithMemberItem)
                // Tính điểm số của nhân viên trong task
                let currentMemberCurrentTaskPoint = 0;
                const resEvalItem = tasksWithMemberItem.overallEvaluation?.responsibleEmployees?.find(resItem => String(resItem.employee?._id) === String(memberItem.id));
                const accEvalItem = tasksWithMemberItem.overallEvaluation?.accountableEmployees?.find(accItem => String(accItem.employee?._id) === String(memberItem.id));
                // Nếu task hiện tại mà endDate <= now thì tiếp tục, còn không bỏ qua
                if (moment(tasksWithMemberItem.endDate).isSameOrBefore(moment())) {
                    // console.log('resEvalItem', memberItem.name, resEvalItem)
                    // console.log('accEvalItem', memberItem.name, accEvalItem)
                    if (resEvalItem) {
                        let curAutomaticPoint = checkIsNullUndefined(resEvalItem.automaticPoint) ? 0 : resEvalItem.automaticPoint;
                        let curEmployeePoint = checkIsNullUndefined(resEvalItem.employeePoint) ? 0 : resEvalItem.employeePoint;
                        let curAccountablePoint = checkIsNullUndefined(resEvalItem.accountablePoint) ? 0 : resEvalItem.accountablePoint;
                        currentMemberCurrentTaskPoint = (curAutomaticPoint + curEmployeePoint + curAccountablePoint) / 3;
                    }
                    if (accEvalItem) {
                        let curAutomaticPoint = checkIsNullUndefined(accEvalItem.automaticPoint) ? 0 : accEvalItem.automaticPoint;
                        let curEmployeePoint = checkIsNullUndefined(accEvalItem.employeePoint) ? 0 : accEvalItem.employeePoint;
                        currentMemberCurrentTaskPoint = (curAutomaticPoint + curEmployeePoint) / 2;
                    }
                    taskWithMemberItemForPoints++;
                }
                currentMemberPointSum += currentMemberCurrentTaskPoint;
                // Tính tổng số giờ của nhân viên dành cho task đó
                const currentTimeLogMember = tasksWithMemberItem.timesheetLogs.filter(item => String(item.creator) === String(memberItem.id));
                for (let currentTimeLogMemberItem of currentTimeLogMember) {
                    totalTimeLogsMilliseconds += currentTimeLogMemberItem.duration;
                }
                // Tính ngân sách của nhân viên cho task đó
                let budgetEachTask = 0;
                budgetEachTask = getEstimateMemberCostOfTask(tasksWithMemberItem, projectDetail, memberItem.id);
                totalBudgetForMember += budgetEachTask;
                // Lấy chi phí thực của nhân viên cho task đó
                let actualCostEachTask = 0;
                actualCostEachTask += getActualMemberCostOfTask(tasksWithMemberItem, projectDetail, memberItem.id);
                totalActualCostForMember += actualCostEachTask;
                // Push vào tasksWithBudgetAndCostAndPointForMember
                tasksWithBudgetAndCostAndPointForMember.push({
                    id: tasksWithMemberItem?._id,
                    code: tasksWithMemberItem?.code,
                    name: tasksWithMemberItem?.name,
                    budgetEachTask,
                    actualCostEachTask,
                    currentMemberCurrentTaskPoint,
                    startDate: tasksWithMemberItem?.startDate,
                    endDate: tasksWithMemberItem?.endDate,
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
                if ((tasksWithMemberItem.progress < 100 && moment().isAfter(moment(tasksWithMemberItem.endDate)))
                    || (tasksWithMemberItem.progress === 100 && moment().isAfter(moment(tasksWithMemberItem.endDate)) && tasksWithMemberItem.status === 'inprocess')) {
                    overdueTasks.push(tasksWithMemberItem);
                }
                // Push vào onBudgetTasks
                let currentTaskActualCost = tasksWithMemberItem.actualCost || 0;
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
                tasksWithBudgetAndCostAndPointForMember,
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
                currentMemberPoint: currentMemberPointSum / (taskWithMemberItemForPoints === 0 ? 1 : taskWithMemberItemForPoints),
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
            if (((behindScheduleTasks.length + overdueTasks.length) / totalTasks.length >= 0.5)
                && (behindScheduleTasks.length + overdueTasks.length > 0)) {
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

    // Function để lấy danh sách những nhân viên điểm cao (>= 85)
    const getMembersWithPoint = (membersData) => {
        let membersWithPoint = [];
        membersData.forEach((item) => {
            const { id, name, tasksWithBudgetAndCostAndPointForMember, currentMemberPoint } = item;
            if (currentMemberPoint >= 85) {
                // if (currentMemberPoint >= 0) {
                membersWithPoint.push({
                    id,
                    name,
                    tasksWithBudgetAndCostAndPointForMember,
                    currentMemberPoint,
                })
            }
        });
        const sortedArr = membersWithPoint.sort((a, b) => {
            return b.currentMemberPoint - a.currentMemberPoint;
        });
        return sortedArr;
    }

    const membersData = preprocessMembersData();
    console.log('membersData', membersData)

    // Xử lý chart data nhân viên có điểm số cao
    const preprocessHighScoreChartData = () => {
        let columns = [], categories = [];
        let highScore = ['Điểm số'];
        if (!membersData) {
            return {
                columns,
                categories,
            }
        }
        for (let memberItem of getMembersWithPoint(membersData)) {
            highScore.push(memberItem.currentMemberPoint);
            categories.push(memberItem.name);
        }
        columns = [highScore];
        return {
            columns,
            categories,
        }
    }

    // Xử lý chart data nhân viên hay bị chậm tiến độ
    const preprocessOverdueScheduleChartData = () => {
        let columns = [], categories = [];
        let overdue = ['Công việc chậm tiến độ'], total = ['Tổng số công việc được giao'];
        if (!membersData) {
            return {
                columns,
                categories,
            }
        }
        for (let memberItem of getMembersAlwaysBehindSchedule(membersData)) {
            overdue.push(memberItem.behindNumber);
            total.push(memberItem.totalNumber)
            categories.push(memberItem.name);
        }
        columns = [overdue, total];
        return {
            columns,
            categories,
        }
    }

    // Xử lý chart data nhân viên hay bị lãng phí chi phí
    const preprocessBehindBudgetChartData = () => {
        let columns = [], categories = [];
        let behindBudget = ['Công việc vượt mức ngân sách'], total = ['Tổng số công việc được giao'];
        if (!membersData) {
            return {
                columns,
                categories,
            }
        }
        for (let memberItem of getMembersAlwaysBehindBudget(membersData)) {
            behindBudget.push(memberItem.behindNumber);
            total.push(memberItem.totalNumber)
            categories.push(memberItem.name);
        }
        columns = [behindBudget, total];
        console.log(columns)
        return {
            columns,
            categories,
        }
    }

    const renderHighScoreChart = () => {
        const currentChartHighScore = chartHighScoreRef.current;
        while (currentChartHighScore.hasChildNodes()) {
            currentChartHighScore.removeChild(currentChartHighScore.lastChild);
        }
        let chartHighScore = c3.generate({
            bindto: chartHighScoreRef.current,
            data: {
                columns: preprocessHighScoreChartData().columns,
                type: 'bar',
                labels: true,
            },
            axis: {
                x: {
                    type: 'category',
                    categories: preprocessHighScoreChartData().categories,
                },
                rotated: true,
            },
            tooltip: {
                format: {
                    value: (value, ratio, id) => {
                        return `${numberWithCommas(value)}`;
                    }
                }
            },
            zoom: {
                enabled: false,
            },
            size: {
                height: (preprocessHighScoreChartData().columns?.[0].length - 2) * 100,
            },
        });
    }

    const renderOverdueScheduleChart = () => {
        const currentChartOverdueSchedule = chartOverdueScheduleRef.current;
        while (currentChartOverdueSchedule.hasChildNodes()) {
            currentChartOverdueSchedule.removeChild(currentChartOverdueSchedule.lastChild);
        }
        let chartOverdueSchedule = c3.generate({
            bindto: chartOverdueScheduleRef.current,
            data: {
                columns: preprocessOverdueScheduleChartData().columns,
                type: 'bar',
                labels: true,
            },
            axis: {
                x: {
                    type: 'category',
                    categories: preprocessOverdueScheduleChartData().categories,
                },
                rotated: true,
            },
            tooltip: {
                format: {
                    value: (value, ratio, id) => {
                        return `${numberWithCommas(value)}`;
                    }
                }
            },
            zoom: {
                enabled: false,
            },
            size: {
                height: (preprocessOverdueScheduleChartData().columns?.[0].length - 2) * 100,
            },
        });
    }

    const renderBehindBudgetChart = () => {
        const currentChartBehindBudget = chartBehindBudgetRef.current;
        while (currentChartBehindBudget.hasChildNodes()) {
            currentChartBehindBudget.removeChild(currentChartBehindBudget.lastChild);
        }
        let chartBehindBudget = c3.generate({
            bindto: chartBehindBudgetRef.current,
            data: {
                columns: preprocessBehindBudgetChartData().columns,
                type: 'bar',
                labels: true,
            },
            axis: {
                x: {
                    type: 'category',
                    categories: preprocessBehindBudgetChartData().categories,
                },
                rotated: true,
            },
            tooltip: {
                format: {
                    value: (value, ratio, id) => {
                        return `${numberWithCommas(value)}`;
                    }
                }
            },
            zoom: {
                enabled: false,
            },
            size: {
                height: (preprocessBehindBudgetChartData().columns?.[0].length - 2) * 100,
            },
        });
    }

    useEffect(() => {
        renderHighScoreChart();
        renderOverdueScheduleChart();
        renderBehindBudgetChart();
    });

    return (
        <React.Fragment>
            <div>
                {
                    getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 &&
                    <div className="box-body qlcv">
                        <h4><strong>Các thành viên điểm số cao (điểm trung bình lớn hơn hoặc bằng 85)</strong></h4>
                        <div ref={chartHighScoreRef} />
                    </div>
                }
                <div className="box-body qlcv">
                    <h4><strong>Các thành viên hay bị chậm tiến độ / quá hạn (tổng số trễ / tổng công việc lớn hơn hoặc bằng 1/2)</strong></h4>
                    <div ref={chartOverdueScheduleRef} />
                </div>
                {
                    getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 &&
                    <div className="box-body qlcv">
                        <h4><strong>Các thành viên hay để lãng phí chi phí (tổng số vi phạm / tổng công việc lớn hơn hoặc bằng 1/2)</strong></h4>
                        <div ref={chartBehindBudgetRef} />
                    </div>
                }
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
                                {getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 && <th>Số công việc đủ chi phí</th>}
                                {getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 && <th>Số công việc lãng phí chi phí</th>}
                                {getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 && <th>Tổng ngân sách cho thành viên (VND)</th>}
                                {getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 && <th>Tổng chi phí thực của thành viên (VND)</th>}
                                {getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 && <th>Điểm số hiện tại</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {(membersData && membersData.length !== 0) &&
                                membersData.map((memberItem, index) => (
                                    <tr key={index}>
                                        <td style={{ color: '#385898' }}>{memberItem?.name}</td>
                                        <td>{memberItem?.totalTimeLogs}</td>
                                        <td>{memberItem?.doingTasks.length}</td>
                                        <td>{memberItem?.notStartedYetTasks.length}</td>
                                        <td style={{ color: memberItem?.behindScheduleTasks.length === 0 ? 'black' : 'red' }}>{memberItem?.behindScheduleTasks.length}</td>
                                        <td style={{ color: memberItem?.overdueTasks.length === 0 ? 'black' : 'red' }}>{memberItem?.overdueTasks.length}</td>
                                        {getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 && <td>{memberItem?.onBudgetTasks.length}</td>}
                                        {getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 && <td style={{ color: memberItem?.behindBudgetTasks.length === 0 ? 'black' : 'red' }}>{memberItem?.behindBudgetTasks.length}</td>}
                                        {getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 && <td>{numberWithCommas(memberItem?.totalBudgetForMember)}</td>}
                                        {getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 && <td style={{ color: memberItem?.totalActualCostForMember > memberItem?.totalBudgetForMember ? 'red' : 'black' }}>
                                            {numberWithCommas(memberItem?.totalActualCostForMember)}
                                        </td>}
                                        {getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 && <td>{numberWithCommas(memberItem?.currentMemberPoint)} / 100</td>}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
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