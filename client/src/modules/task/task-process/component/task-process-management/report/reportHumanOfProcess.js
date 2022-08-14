import React, { Component, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import moment from 'moment';
import "./reportProcess.css"
import { checkIsNullUndefined, numberWithCommas } from "../../../../task-management/component/functionHelpers.js"
import c3 from 'c3';
import 'c3/c3.css';
function areEqual(prevProps, nextProps) {
    if (JSON.stringify(prevProps.listTask) === JSON.stringify(nextProps.listTask)) {
        return true
    } else {
        return false
    }
}

function ReportHumanOfProcess(props) {
    const chartHighScoreRef = useRef(null);
    const chartOverdueScheduleRef = useRef(null);
    const { translate } = props
    const preprocessMembersData = (currentTasks) => {
        let result = [];
        if (!currentTasks) return [];
        let arr = [];
        currentTasks.forEach(value => {
            arr = arr.concat(value.responsibleEmployees)
        });
        var newArr = []
        arr.forEach((item) => {
            if (newArr.filter(e => e._id === item._id).length === 0) newArr.push(item)
        })
        // Cần check xem có cần projectManager và creator không?

        for (let memberItem of newArr) {
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
                tasksWithMemberItem.evaluations.forEach(value=>{
                    let point1 =0;
                    value.results.forEach(point=>{
                        point1= point1+(point.approvedPoint+point.automaticPoint+point.employeePoint)/3;
                    })
                    if(point1!==0 && value.results.length!==0) currentMemberCurrentTaskPoint  =currentMemberCurrentTaskPoint+ point1/value.results.length
                })
                if(currentMemberCurrentTaskPoint!==0 &&  tasksWithMemberItem.evaluations.length!==0) currentMemberCurrentTaskPoint  = currentMemberCurrentTaskPoint/ tasksWithMemberItem.evaluations.length
                // const resEvalItem = tasksWithMemberItem.evaluations?.responsibleEmployees?.find(resItem => String(resItem.employee?._id) === String(memberItem.id));
                // const accEvalItem = tasksWithMemberItem.overallEvaluation?.accountableEmployees?.find(accItem => String(accItem.employee?._id) === String(memberItem.id));
                // // Nếu task hiện tại mà endDate <= now thì tiếp tục, còn không bỏ qua
                // if (moment(tasksWithMemberItem.endDate).isSameOrBefore(moment())) {
                //     // console.log('resEvalItem', memberItem.name, resEvalItem)
                //     // console.log('accEvalItem', memberItem.name, accEvalItem)
                //     if (resEvalItem) {
                //         let curAutomaticPoint = checkIsNullUndefined(resEvalItem.automaticPoint) ? 0 : resEvalItem.automaticPoint;
                //         let curEmployeePoint = checkIsNullUndefined(resEvalItem.employeePoint) ? 0 : resEvalItem.employeePoint;
                //         let curAccountablePoint = checkIsNullUndefined(resEvalItem.accountablePoint) ? 0 : resEvalItem.accountablePoint;
                //         currentMemberCurrentTaskPoint = (curAutomaticPoint + curEmployeePoint + curAccountablePoint) / 3;
                //     }
                //     if (accEvalItem) {
                //         let curAutomaticPoint = checkIsNullUndefined(accEvalItem.automaticPoint) ? 0 : accEvalItem.automaticPoint;
                //         let curEmployeePoint = checkIsNullUndefined(accEvalItem.employeePoint) ? 0 : accEvalItem.employeePoint;
                //         currentMemberCurrentTaskPoint = (curAutomaticPoint + curEmployeePoint) / 2;
                //     }
                //     taskWithMemberItemForPoints++;
                // }
                currentMemberPointSum += currentMemberCurrentTaskPoint;
                // Tính tổng số giờ của nhân viên dành cho task đó
                const currentTimeLogMember = tasksWithMemberItem.timesheetLogs.filter(item => String(item.creator) === String(memberItem.id));
                for (let currentTimeLogMemberItem of currentTimeLogMember) {
                    totalTimeLogsMilliseconds += currentTimeLogMemberItem.duration;
                }

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

            }
            console.log(currentMemberPointSum);
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
                currentMemberPoint:  Math.floor((currentMemberPointSum/(tasksWithMemberArr.length)) * 100 / 100),
            })
        }
        return result;
    }
    const membersData = preprocessMembersData(props.listTask);
    console.log(membersData);
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
        let max =0;
        if (!membersData) {
            return {
                columns,
                categories,
            }
        }
        for (let memberItem of getMembersAlwaysBehindSchedule(membersData)) {
            max = max <memberItem.totalNumber? memberItem.totalNumber : max
            overdue.push(memberItem.behindNumber);
            total.push(memberItem.totalNumber)
            categories.push(memberItem.name);
        }
        columns = [overdue, total];
        return {
            columns,
            categories,
            max,
        }
    }
    const maxLength = (data)=>{

    }
    const renderOverdueScheduleChart = () => {
        const currentChartOverdueSchedule = chartOverdueScheduleRef.current;
        console.log(preprocessOverdueScheduleChartData().columns);
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
                // rotated: true,
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
                height: (preprocessOverdueScheduleChartData().max - 2) * 100,
            },
        });
    }
    const renderHighScoreChart = () => {
        const currentChartHighScore = chartHighScoreRef.current;
        while (currentChartHighScore && currentChartHighScore.hasChildNodes()) {
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
                // rotated: true,
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


    useEffect(() => {
        renderHighScoreChart();
        renderOverdueScheduleChart();
    });
    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <h4><strong>Các thành viên điểm số cao (điểm trung bình lớn hơn hoặc bằng 85)</strong></h4>
                <div ref={chartHighScoreRef} />
            </div>
            <div className="box-body qlcv">
                <h4><strong>Các thành viên hay bị chậm tiến độ / quá hạn (tổng số trễ / tổng công việc lớn hơn hoặc bằng 1/2)</strong></h4>
                <div ref={chartOverdueScheduleRef} />
            </div>
            <div className="box-body qlcv">
                <h4><strong>Tổng quan thành viên quy trình</strong></h4>
                <table id="report-member-table" className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Tên thành viên</th>
                            <th>Số giờ làm việc theo chấm công</th>
                            <th>Số lượng công việc được giao</th>
                            <th>Số công việc đang làm</th>
                            <th>Số công việc chưa làm</th>
                            <th>Số công việc trễ tiến độ</th>
                            <th>Số công việc quá hạn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(membersData && membersData.length !== 0) &&
                            membersData.map((memberItem, index) => (
                                <tr key={index}>
                                    <td style={{ color: '#385898' }}>{memberItem?.name}</td>
                                    <td>{memberItem?.totalTimeLogs}</td>
                                    <td>{memberItem?.totalTasks.length}</td>
                                    <td>{memberItem?.doingTasks.length}</td>
                                    <td>{memberItem?.notStartedYetTasks.length}</td>
                                    <td style={{ color: memberItem?.behindScheduleTasks.length === 0 ? 'black' : 'red' }}>{memberItem?.behindScheduleTasks.length}</td>
                                    <td style={{ color: memberItem?.overdueTasks.length === 0 ? 'black' : 'red' }}>{memberItem?.overdueTasks.length}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const { user, auth, role, taskProcess } = state;
    return { user, auth, role, taskProcess };
}

const actionCreators = {
    //getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
    //getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
};
const connectedReportHumanOfProcess = connect(mapState, actionCreators)(withTranslate(React.memo(ReportHumanOfProcess, areEqual)));
export { connectedReportHumanOfProcess as ReportHumanOfProcess };
