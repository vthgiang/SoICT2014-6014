import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../projects/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import { DatePicker, SelectBox } from '../../../../common-components';
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import { AutomaticTaskPointCalculator } from '../../../task/task-perform/component/automaticTaskPointCalculator';
import c3 from 'c3';
import 'c3/c3.css';
import ModalEVMData from './modalEVMData';
import { formatTaskStatus } from '../../projects/components/functionHelper';

const TabEvalProject = (props) => {
    const { currentTasks, translate, listTasksEval, project, currentMonth, projectDetailId, projectDetail, handleChangeMonth } = props;
    const chartRef = useRef(null);
    const [currentTimeMode, setCurrentTimeMode] = useState('');
    const currentTimeModeArr = [
        { text: 'Tuần', value: 'weeks' },
        { text: 'Tháng', value: 'months' },
    ]
    const [currentGraphData, setCurrentGraphData] = useState(undefined);

    const checkUndefinedNull = (value) => {
        return value === undefined || value === null;
    }

    const getGraphTasksDataOfTimeMode = (listData, timeMode) => {
        if (!listData || listData.length === 0) return undefined;
        let categories = [];
        let modalEVMData = [];
        let plannedValues = ['Planned Value'], actualCosts = ['Actual Cost'], earnedValues = ['Earned Value'];
        const tableData = listData.map(listItem => {
            // console.log('listItem', listItem)
            const data = {
                task: listItem,
                progress: listItem.progress,
                projectDetail,
            }
            const resultCalculate = AutomaticTaskPointCalculator.calcTaskEVMPoint(data);
            return {
                ...listItem,
                ...resultCalculate,
            }
        });
        // console.log('tableData', tableData)
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
        const diffInDuration = moment(latestEnd).diff(moment(earliestStart), timeMode);
        if (diffInDuration > 1) {
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
                        // console.log(tableItem.name, tableItem.plannedValue, tableItem.actualCost, tableItem.earnedValue)
                        totalPVEachMoment += tableItem.plannedValue === Infinity ? 0 : tableItem.plannedValue;
                        totalACEachMoment += tableItem.actualCost;
                        totalEVEachMoment += tableItem.earnedValue;
                        listTasksEachMoment.push(tableItem)
                    }
                }
                plannedValues.push(totalPVEachMoment);
                actualCosts.push(totalACEachMoment);
                earnedValues.push(totalEVEachMoment);
                const currentCategoryTitle = timeMode === 'weeks'
                    ? `Tuần ${Math.ceil(moment(currentCounterMoment).date() / 7)} T${moment(currentCounterMoment).format('M-YYYY')}`
                    : `T${moment(currentCounterMoment).format('M-YYYY')}`;
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
            return {
                graphData: [plannedValues, actualCosts, earnedValues],
                modalEVMData,
                categories,
            };
        }
        return undefined;
    }

    const handleProcessTableData = (listData, listDataForEvalMonth) => {
        if (!listData || listData.length === 0 || !listDataForEvalMonth || listDataForEvalMonth.length === 0) return [];
        // Lấy data từ listTasksEval cho tableData
        const tableTimeModeData = listDataForEvalMonth.map(listItem => {
            const data = {
                task: listItem,
                progress: listItem.progress,
                projectDetail,
            }
            const resultCalculate = AutomaticTaskPointCalculator.calcTaskEVMPoint(data);
            return {
                ...listItem,
                ...resultCalculate,
            }
        });
        return tableTimeModeData
    }

    const processedTableData = handleProcessTableData(currentTasks, listTasksEval);

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
                columns: currentGraphData.graphData,
                type: 'line',
            },
            axis: {
                x: {
                    type: 'category',
                    categories: currentGraphData.categories,
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
        if (currentGraphData) {
            renderChart();
        }
    });

    useEffect(() => {
        if (currentTasks) {
            // Lấy graph tasks data theo tuần
            const graphDataWeeks = getGraphTasksDataOfTimeMode(currentTasks, 'weeks');
            // Lấy graph tasks data theo tháng
            const graphDataMonths = getGraphTasksDataOfTimeMode(currentTasks, 'months');
            setCurrentTimeMode(graphDataMonths ? 'months' : 'weeks');
            setCurrentGraphData(graphDataMonths || graphDataWeeks);
        }
    }, [currentTasks])

    const showModalDetails = () => {
        setTimeout(() => {
            window.$(`#modal-evm-${projectDetailId}`).modal('show');
        }, 10);
    }

    useEffect(() => {
        console.log('currentTimeMode', currentTimeMode)
    }, [currentTimeMode])

    // console.log('currentTasks', currentTasks)
    return (
        <React.Fragment>
            <div>
                <div className="box">
                    <div className="box-body qlcv">
                        {
                            currentGraphData &&
                            <ModalEVMData
                                projectDetailId={projectDetailId}
                                projectDetail={projectDetail}
                                evmData={currentGraphData.modalEVMData}
                            />
                        }
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div className="col-md-8 col-xs-8 col-ms-8" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <h4><strong>Biểu đồ trực quan EVM dự án</strong></h4>
                                <div className="col-md-3 col-xs-3 col-ms-3">
                                    <SelectBox
                                        id={`tab-eval-project-time-mode`}
                                        className="form-control select2"
                                        value={currentTimeMode}
                                        items={currentTimeModeArr}
                                        onChange={(e) => {
                                            setCurrentTimeMode(e[0]);
                                            setCurrentGraphData(getGraphTasksDataOfTimeMode(currentTasks, e[0]))
                                        }}
                                        multiple={false}
                                    />
                                </div>
                            </div>

                            <button className="btn-link" onClick={showModalDetails}>Xem chi tiết</button>
                        </div>
                        {currentGraphData
                            ? <div ref={chartRef} />
                            : `Không thể biểu diễn biểu đồ dưới dạng ${currentTimeModeArr.find(item => item.value === currentTimeMode)?.text}`}
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
                                    <th>Trạng thái công việc</th>
                                    <th>Thời điểm bắt đầu</th>
                                    <th>Thời điểm kết thúc dự kiến</th>
                                    <th>Thời điểm kết thúc thực tế</th>
                                    <th>Thời lượng ước lượng ({translate(`project.unit.${projectDetail?.unitTime}`)})</th>
                                    <th>Thời lượng thực tế ({translate(`project.unit.${projectDetail?.unitTime}`)})</th>
                                    <th>Planned Value (VND)</th>
                                    <th>Actual Cost (VND)</th>
                                    <th>Earned Value (VND)</th>
                                    <th>Điểm số công việc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedTableData.map((taskItem, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{taskItem?.name}</td>
                                            <td>{formatTaskStatus(translate, taskItem?.status)}</td>    
                                            <td>{moment(taskItem?.startDate).format('HH:mm DD/MM/YYYY')}</td> 
                                            <td>{moment(taskItem?.endDate).format('HH:mm DD/MM/YYYY')}</td> 
                                            <td>{taskItem?.actualEndDate && taskItem?.status === 'finished' && moment(taskItem?.actualEndDate).format('HH:mm DD/MM/YYYY')}</td>                                         
                                            <td>{numberWithCommas(taskItem?.estDuration)}</td>
                                            <td>{taskItem?.realDuration && numberWithCommas(taskItem?.realDuration)}</td>
                                            <td>{numberWithCommas(taskItem?.plannedValue)}</td>
                                            <td>{numberWithCommas(taskItem?.actualCost)}</td>
                                            <td>{numberWithCommas(taskItem?.earnedValue)}</td>
                                            <td>{checkUndefinedNull(taskItem?.overallEvaluation?.automaticPoint) ? 'Chưa tính được' : `${numberWithCommas(taskItem?.overallEvaluation?.automaticPoint)} / 100`}</td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </React.Fragment >
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