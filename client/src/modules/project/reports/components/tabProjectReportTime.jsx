import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../projects/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';

const TabProjectReportTime = (props) => {
    const { currentTasks, translate } = props;

    // Task kịp tiến độ
    const getOnScheduleTasks = () => {
        if (!currentTasks) return [];
        return currentTasks.filter((taskItem, taskIndex) => {
            const diffFromStartToNow = moment().diff(moment(taskItem.startDate), 'milliseconds');
            const diffFromStartToEstimateEnd = moment(taskItem.endDate).diff(moment(taskItem.startDate), 'milliseconds');
            if (moment().isSameOrBefore(moment(taskItem.endDate)) && diffFromStartToNow / diffFromStartToEstimateEnd <= Number(taskItem.progress) / 100)
                return taskItem;
        })
    }

    // Task trễ tiến độ
    const getBehindScheduleTasks = () => {
        if (!currentTasks) return [];
        return currentTasks.filter((taskItem, taskIndex) => {
            const diffFromStartToNow = moment().diff(moment(taskItem.startDate), 'milliseconds');
            const diffFromStartToEstimateEnd = moment(taskItem.endDate).diff(moment(taskItem.startDate), 'milliseconds');
            if (moment().isSameOrBefore(moment(taskItem.endDate)) && diffFromStartToNow / diffFromStartToEstimateEnd > Number(taskItem.progress) / 100)
                return taskItem;
        })
    }

    // Task quá hạn
    const getOverdueScheduleTasks = () => {
        if (!currentTasks) return [];
        return currentTasks.filter((taskItem, taskIndex) => {
            if (taskItem.progress < 100 && moment().isAfter(moment(taskItem.endDate)))
                return taskItem;
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
            <div className="col-md-3 col-sm-4 col-xs-6 statistical-item" style={{ marginBottom: 8 }}>
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
                        <h4><strong>Tổng quan tiến độ dự án công việc</strong></h4>
                        {renderItem('Tổng số công việc', currentTasks)}
                        {renderItem('Số công việc kịp tiến độ', getOnScheduleTasks())}
                        {renderItem('Số công việc trễ tiến độ', getBehindScheduleTasks())}
                        {renderItem('Số công việc quá hạn', getOverdueScheduleTasks())}
                    </div>
                    <div className="box-body qlcv">
                        {displayContent.tasks && displayContent.tasks.length !== 0 &&
                            <a
                                className="pull-right"
                                aria-controls="show-report-time-tasks-project-table"
                                data-toggle="collapse"
                                data-target="#show-report-time-tasks-project-table"
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
                                    <th>Thời gian bắt đầu</th>
                                    <th>Thời gian dự kiến kết thúc</th>
                                </tr>
                            </thead>
                            <tbody data-toggle="collapse" id="show-report-time-tasks-project-table" className="collapse">
                                {displayContent.tasks && displayContent.tasks.length !== 0 &&
                                    displayContent.tasks.map((taskItem, index) => (
                                        <tr key={index}>
                                            <td>{taskItem?.name}</td>
                                            <td>{moment(taskItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                            <td>{moment(taskItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabProjectReportTime));