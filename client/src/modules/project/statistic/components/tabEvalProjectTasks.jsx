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
import { formatTaskStatus, renderStatusColor } from '../../projects/components/functionHelper';

const TabEvalProjectTasks = (props) => {
    const { currentTasks, translate, listTasksEval, project, currentMonth, projectDetailId, projectDetail, isLoading, handleChangeMonth } = props;

    const checkUndefinedNull = (value) => {
        return value === undefined || value === null;
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

    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <h4><strong>Điểm số các công việc của dự án theo tháng</strong></h4>
                {/* Chọn tháng để lọc đánh giá */}
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
                {
                    isLoading
                        ? <div>Đang tải dữ liệu</div>
                        : <table id="eval-project-statistical-table" className="table table-bordered table-hover">
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
                                            <td style={{ color: '#385898' }}>{taskItem?.name}</td>
                                            <td style={{ color: renderStatusColor(taskItem) }}>{formatTaskStatus(translate, taskItem?.status)}</td>
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
                }
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabEvalProjectTasks));