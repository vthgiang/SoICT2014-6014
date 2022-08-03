import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../projects/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import ModalListTasks from '../../reports/components/modalListTasks';

const TabPhaseReportTasks = (props) => {
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
        listType: 'total',
        tasks: currentTasks,
    })

    useEffect(() => {
        setDisplayContent({
            ...displayContent,
            tasks: currentTasks,
        })
    }, [currentTasks])

    const handleOpenModalListTasks = (listType, currentTask, title) => {
        setDisplayContent({
            listType,
            title,
            tasks: currentTask,
        })
        setTimeout(() => {
            window.$(`#modal-list-tasks-report-${listType}`).modal('show');
        }, 100);
    }

    const renderItem = (label, currentTask, listType, icon = 'person') => {
        if (!currentTask) return null;
        return (
            <div className="row col-md-4 col-sm-6 col-xs-6" style={{ marginBottom: 5 }}>
                <span className="task-name">{label} <span style={{ fontWeight: 'bold' }}>({currentTask.length})</span></span>
                <i style={{ marginRight: 10, marginLeft: 10 }} className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                <a style={{ cursor: "pointer" }} title="Xem chi tiết" onClick={() => {
                    handleOpenModalListTasks(listType, currentTask, label);
                }}>
                    Xem chi tiết
                </a>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div>
                <ModalListTasks currentTasks={displayContent.tasks} listType={displayContent.listType} title={displayContent.title} />
                <div className="box-body qlcv">
                    <h4><strong>Tổng quan công việc </strong></h4>
                    {renderItem('Tổng số công việc', currentTasks, 'total')}
                    {renderItem('Số công việc kịp tiến độ', getOnScheduleTasks(), 'onSchedule')}
                    {renderItem('Số công việc trễ tiến độ', getBehindScheduleTasks(), 'behindSchedule')}
                    {renderItem('Số công việc quá hạn', getOverdueScheduleTasks(), 'overdueSchedule')}
                    {renderItem('Số công việc đạt ngân sách', getOnBudgetTasks(), 'onBudget')}
                    {renderItem('Số công việc vượt mức ngân sách', getBehindBudgetTasks(), 'behindBudget')}
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabPhaseReportTasks));