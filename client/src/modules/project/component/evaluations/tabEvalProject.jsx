import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import { DatePicker } from '../../../../common-components';
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import { AutomaticTaskPointCalculator } from '../../../task/task-perform/component/automaticTaskPointCalculator';
import c3 from 'c3';
import 'c3/c3.css';
import ModalEVMData from './modalEVMData';

const TabEvalProject = (props) => {
    const { currentTasks, translate, listTasksEval, project, currentMonth, projectDetailId, projectDetail, handleChangeMonth } = props;
    const chartRef = useRef(null);

    const checkUndefinedNull = (value) => {
        return value === undefined || value === null;
    }

    const handleProcessData = (listData, listDataForEvalMonth) => {
        const timeMode = 'weeks';
        let plannedValues = ['Planned Value'], actualCosts = ['Actual Cost'], earnedValues = ['Earned Value'];
        let categories = [];
        let modalEVMData = [];
        if (!listData || listData.length === 0 || !listDataForEvalMonth || listDataForEvalMonth.length === 0) return {
            tableData: [],
            graphData: [plannedValues, actualCosts, earnedValues],
            categories: [],
        };
        // Lấy data từ listTasksEval cho tableData
        const tableTimeModeData = listDataForEvalMonth.map(listItem => {
            console.log('listItem', listItem)
            const data = {
                task: listItem,
                progress: listItem.progress,
                projectDetail,
            }
            const resultCalculate = AutomaticTaskPointCalculator.calcProjectAutoPoint(data, false);
            return {
                ...listItem,
                ...resultCalculate,
            }
        });
        // Lấy data từ currentTasks cho graphData (đành phải đặt tên là tableData)
        const tableData = listData.map(listItem => {
            console.log('listItem', listItem)
            const data = {
                task: listItem,
                progress: listItem.progress,
                projectDetail,
            }
            const resultCalculate = AutomaticTaskPointCalculator.calcProjectAutoPoint(data, false);
            return {
                ...listItem,
                ...resultCalculate,
            }
        });
        console.log('tableData', tableData)
        let earliestStart = tableData[0].startDate;
        let latestEnd = tableData[0].endDate;
        for (let tableItem of tableData) {
            if (moment(tableItem.startDate).isBefore(moment(earliestStart))) {
                earliestStart = tableItem.startDate;
            }
            if (moment(tableItem.endDate).isAfter(moment(latestEnd))) {
                latestEnd = tableItem.endDate;
            }
        }
        console.log('earliestStart', earliestStart, 'latestEnd', latestEnd);
        const diffInDuration = moment(latestEnd).diff(moment(earliestStart), timeMode);
        console.log('diffInDuration', diffInDuration)
        let currentCounterMoment = earliestStart;
        // Tính toán các thông số theo từng khoảng timemode một
        for (let i = 0; i < diffInDuration; i++) {
            const startOfCurrentMoment = moment(currentCounterMoment).startOf(timeMode.substring(0, timeMode.length - 1));
            const endOfCurrentMoment = moment(currentCounterMoment).endOf(timeMode.substring(0, timeMode.length - 1));
            // Tập hợp các task của khoảng timemode đó và tính toán các thông số
            let totalPVEachMoment = 0, totalACEachMoment = 0, totalEVEachMoment = 0;
            let listTasksEachMoment = []
            for (let tableItem of tableData) {
                if (moment(tableItem.endDate).isSameOrAfter(startOfCurrentMoment) &&
                    moment(tableItem.endDate).isSameOrBefore(endOfCurrentMoment)) {
                    console.log(tableItem.name, tableItem.plannedValue, tableItem.actualCost, tableItem.earnedValue)
                    totalPVEachMoment += tableItem.plannedValue === Infinity ? 0 : tableItem.plannedValue;
                    totalACEachMoment += tableItem.actualCost;
                    totalEVEachMoment += tableItem.earnedValue;
                    listTasksEachMoment.push(tableItem)
                }
            }
            plannedValues.push(totalPVEachMoment);
            actualCosts.push(totalACEachMoment);
            earnedValues.push(totalEVEachMoment);
            const currentCategoryTitle = `Tuần ${Math.ceil(moment(currentCounterMoment).date() / 7)} T${moment(currentCounterMoment).format('M-YYYY')}`;
            // Push vào categories để làm thành trục Oy
            categories.push(currentCategoryTitle);
            // Sau mỗi lần lặp thì tăng currentCounterMoment thêm 1 đơn vị nhỏ nhất của timeMode
            currentCounterMoment = moment(currentCounterMoment).add(1, timeMode).format();
            // Push vào modalEVMData để show bên modal details
            modalEVMData.push({
                category: currentCategoryTitle,
                listTasksEachMoment,
                startOfCurrentMoment,
                endOfCurrentMoment,
                totalPVEachMoment,
                totalACEachMoment,
                totalEVEachMoment,
            })
        }
        let graphData = [plannedValues, actualCosts, earnedValues];
        return {
            tableData: tableTimeModeData,
            graphData,
            categories,
            modalEVMData,
        }
    }

    const processedData = handleProcessData(currentTasks, listTasksEval);

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
                columns: processedData.graphData,
                type: 'line',
            },
            axis: {
                x: {
                    type: 'category',
                    categories: processedData.categories,
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

    const showModalDetails = () => {
        setTimeout(() => {
            window.$(`#modal-evm-${projectDetailId}`).modal('show');
        }, 10);
    }

    // console.log('currentTasks', currentTasks)
    return (
        <React.Fragment>
            <div>
                <div className="box">
                    <div className="box-body qlcv">
                        <ModalEVMData projectDetailId={projectDetailId} projectDetail={projectDetail} evmData={processedData.modalEVMData} />
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <h4><strong>Biểu đồ trực quan EVM dự án</strong></h4>
                            <button className="btn-link" onClick={showModalDetails}>Xem chi tiết</button>
                        </div>
                        <div ref={chartRef} />
                    </div>
                </div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h4><strong>Điểm số các công việc của dự án theo tháng</strong></h4>
                        {/* Chọn tháng để lọc đánh giâ */}
                        <div className="form-group">
                            <label style={{ marginRight: 20 }}>Chọn tháng</label>
                            <DatePicker
                                id="start-date-eval-project-statistical"
                                dateFormat="month-year"
                                value={moment(currentMonth).format('MM-YYYY')}
                                onChange={handleChangeMonth}
                                disabled={false}
                            />
                        </div>
                        <table id="eval-project-statistical-table" className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>{translate('task.task_management.col_name')}</th>
                                    <th>Tháng đánh giá</th>
                                    <th>Thời gian ước lượng ({translate(`project.unit.${projectDetail?.unitTime}`)})</th>
                                    <th>Thời gian thực tế ({translate(`project.unit.${projectDetail?.unitTime}`)})</th>
                                    <th>Ngân sách - Chi phí ước lượng (VND)</th>
                                    <th>Chi phí thực (VND)</th>
                                    <th>Điểm số tự động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedData.tableData.map((taskItem, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{taskItem?.name}</td>
                                            <td>{moment(currentMonth).format('M')}</td>
                                            <td>{numberWithCommas(taskItem?.estDuration)}</td>
                                            <td>{numberWithCommas(taskItem?.realDuration)}</td>
                                            <td>{numberWithCommas(taskItem?.estCost)}</td>
                                            <td>{numberWithCommas(taskItem?.realCost)}</td>
                                            <td>{checkUndefinedNull(taskItem?.overallEvaluation?.automaticPoint) ? 'Chưa tính được' : `${taskItem?.overallEvaluation?.automaticPoint} / 100`}</td>
                                        </tr>
                                    )
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabEvalProject));