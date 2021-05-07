import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import c3 from 'c3';
import 'c3/c3.css';
import { getAmountOfWeekDaysInMonth } from '../projects/functionHelper';
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers';

const MILISECS_TO_DAYS = 86400000;

const TabProjectReportCost = (props) => {
    const { currentTasks, translate, projectDetail } = props;
    const chartRef = useRef(null);

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

    const preprocessData = () => {
        let columns = [], categories = [];
        let budgets = ['Ngân sách (VND)'], actualCost = ['Chi phí thực (VND)'];
        if (!currentTasks) {
            return {
                columns,
                categories,
            }
        }
        for (let taskItem of currentTasks) {
            budgets.push(taskItem.estimateNormalCost);
            actualCost.push(taskItem.actualCost || getCurrentActualCostForTask(taskItem));
            categories.push(taskItem.name)
        }
        columns = [budgets, actualCost];
        return {
            columns,
            categories,
        }
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    const removePreviousChart = () => {
        const currentChart = chartRef.current;
        while (currentChart.hasChildNodes()) {
            currentChart.removeChild(currentChart.lastChild);
        }
    }

    const renderChart = () => {
        removePreviousChart();
        let chart = c3.generate({
            bindto: chartRef.current,
            data: {
                columns: preprocessData().columns,
                type: 'bar',
            },
            bar: {
                width: {
                    ratio: 0.5
                }
            },
            axis: {
                x: {
                    type: 'category',
                    categories: preprocessData().categories,
                },
                y: {
                    tick: {
                        format: (d) => {
                            return `${numberWithCommas(d)} VND`;
                        }
                    },
                }
            },
            zoom: {
                enabled: true,
            },
            tooltip: {
                format: {
                    value: (value, ratio, id) => {
                        return numberWithCommas(value);
                    }
                }
            },
        });
    }

    useEffect(() => {
        renderChart();
    });

    // Danh sách các task đủ chi phí
    const getOnBudgetTasks = () => {
        if (!currentTasks) return [];
        return currentTasks.filter((taskItem, taskIndex) => {
            const currentActualCost = taskItem.actualCost || getCurrentActualCostForTask(taskItem);
            if (taskItem.estimateNormalCost >= currentActualCost) return taskItem;
        })
    }

    // Danh sách task thiếu chi phí
    const getBehindBudgetTasks = () => {
        if (!currentTasks) return [];
        return currentTasks.filter((taskItem, taskIndex) => {
            const currentActualCost = taskItem.actualCost || getCurrentActualCostForTask(taskItem);
            if (taskItem.estimateNormalCost < currentActualCost) return taskItem;
        })
    }

    return (
        <React.Fragment>
            <div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h4><strong>Tổng quan chi phí dự án công việc</strong></h4>
                        <div>Số công việc đủ chi phí: <strong>{getOnBudgetTasks().length} công việc</strong></div>
                        <div>Số công việc thiếu chi phí: <strong>{getBehindBudgetTasks().length} công việc</strong></div>
                    </div>
                </div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h4><strong>Biểu đồ chi phí dự án công việc</strong></h4>
                        <div ref={chartRef} />
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabProjectReportCost));