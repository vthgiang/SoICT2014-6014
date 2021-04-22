import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import { DatePicker } from '../../../../common-components';

const TabEvalProject = (props) => {
    const { currentTasks, translate, listTasksEval, project, currentMonth, handleChangeMonth } = props;

    const checkUndefinedNull = (value) => {
        return value === undefined || value === null;
    }
    // console.log('currentTasks', currentTasks)
    return (
        <React.Fragment>
            <div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h3><strong>Điểm số các công việc của dự án</strong></h3>
                        {/* Chọn tháng để lọc đánh giâ */}
                        <div className="form-group">
                            <label style={{ marginRight: 20 }}>Chọn tháng</label>
                            <DatePicker
                                id="start-date"
                                dateFormat="month-year"
                                value={moment(currentMonth).format('MM-YYYY')}
                                onChange={handleChangeMonth}
                                disabled={false}
                            />
                        </div>
                        <table id="project-table" className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>{translate('project.schedule.taskCode')}</th>
                                    <th>{translate('task.task_management.col_name')}</th>
                                    <th>Tháng đánh giá</th>
                                    <th>Điểm số tự động</th>
                                    <th>Điểm số người thực hiện đánh giá</th>
                                    <th>Điểm số người phê duyệt đánh giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(listTasksEval && listTasksEval.length !== 0) &&
                                    listTasksEval.map((taskItem, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{taskItem?.code}</td>
                                                <td>{taskItem?.name}</td>
                                                <td>{moment(taskItem?.evalMonth).format('M')}</td>
                                                <td>{checkUndefinedNull(taskItem?.automaticPoint) ? 'Chưa tính được' : taskItem?.automaticPoint}</td>
                                                <td>{checkUndefinedNull(taskItem?.employeePoint) ? 'Chưa tính được' : taskItem?.employeePoint}</td>
                                                <td>{checkUndefinedNull(taskItem?.approvedPoint) ? 'Chưa tính được' : taskItem?.approvedPoint}</td>
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