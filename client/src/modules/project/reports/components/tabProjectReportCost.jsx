import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../projects/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import c3 from 'c3';
import 'c3/c3.css';
import { formatTaskStatus, getAmountOfWeekDaysInMonth } from '../../projects/components/functionHelper';
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers';

const MILISECS_TO_DAYS = 86400000;

const TabProjectReportCost = (props) => {
    const { currentTasks, translate, projectDetail } = props;
    const chartRef = useRef(null);

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
            actualCost.push(taskItem.actualCost || 0);
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
                labels: true,
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
            const currentActualCost = taskItem.actualCost || 0;
            if (taskItem.estimateNormalCost >= currentActualCost) return taskItem;
        })
    }

    // Danh sách task thiếu chi phí
    const getBehindBudgetTasks = () => {
        if (!currentTasks) return [];
        return currentTasks.filter((taskItem, taskIndex) => {
            const currentActualCost = taskItem.actualCost || 0;
            if (taskItem.estimateNormalCost < currentActualCost) return taskItem;
        })
    }

    const [displayContent, setDisplayContent] = useState({
        title: 'Tổng số công việc',
        tasks: currentTasks,
    })

    useEffect(() => {
        setDisplayContent({
            ...displayContent,
            tasks: currentTasks,
        })
    }, [currentTasks])

    const renderItem = (label, currentTask, icon = 'person') => {
        if (!currentTask) return null;
        return (
            <div className="col-md-4 col-sm-4 col-xs-6 statistical-item" style={{ marginBottom: 8 }}>
                <a style={{ cursor: "pointer" }} onClick={() => {
                    setDisplayContent({
                        title: label,
                        tasks: currentTask,
                    })
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#d3d3d3", padding: '10px', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">{icon}</span>
                            <span style={{ fontWeight: 'bold' }}>{label}</span>
                        </div>
                        <span style={{ fontSize: '17px', color: 'red' }} className="info-box-number">
                            {currentTask.length}
                        </span>
                    </div>
                </a>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h4><strong>Tổng quan chi phí dự án công việc</strong></h4>
                        {renderItem('Tổng số công việc', currentTasks)}
                        {renderItem('Số công việc đủ chi phí', getOnBudgetTasks())}
                        {renderItem('Số công việc thiếu chi phí', getBehindBudgetTasks())}
                    </div>
                    <div className="box-body qlcv">
                        {displayContent.tasks && displayContent.tasks.length !== 0 &&
                            <a
                                className="pull-right"
                                aria-controls="show-report-cost-tasks-project-table"
                                data-toggle="collapse"
                                data-target="#show-report-cost-tasks-project-table"
                                aria-expanded="false"
                                style={{ cursor: 'pointer' }}
                            >
                                Xem chi tiết
                        </a>}
                        <h4><strong>Danh sách - {displayContent.title}</strong></h4>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Tên công việc</th>
                                    <th>Trạng thái</th>
                                    <th>Tiến độ (%)</th>
                                    <th>Thời gian bắt đầu</th>
                                    <th>Thời gian dự kiến kết thúc</th>
                                    <th>Ngân sách (VND)</th>
                                    <th>Chi phí thực (VND)</th>
                                </tr>
                            </thead>
                            <tbody data-toggle="collapse" id="show-report-cost-tasks-project-table" className="collapse">
                                {displayContent.tasks && displayContent.tasks.length !== 0 &&
                                    displayContent.tasks.map((taskItem, index) => (
                                        <tr key={index}>
                                            <td>{taskItem?.name}</td>
                                            <td>{formatTaskStatus(translate, taskItem?.status)}</td>
                                            <td>{taskItem?.progress}</td>
                                            <td>{moment(taskItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                            <td>{moment(taskItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                            <td>{numberWithCommas(taskItem.estimateNormalCost)}</td>
                                            <td>{numberWithCommas(taskItem.actualCost || 0)}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
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