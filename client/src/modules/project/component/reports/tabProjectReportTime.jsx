import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../redux/actions";
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

    return (
        <React.Fragment>
            <div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h4><strong>Tổng quan tiến độ dự án công việc</strong></h4>
                        <div>Tổng số công việc: <strong>{currentTasks?.length}</strong></div>
                        <div>Số task kịp tiến độ: <strong>{getOnScheduleTasks().length}</strong></div>
                        <div>Số task trễ tiến độ: <strong>{getBehindScheduleTasks().length}</strong></div>
                        <div>Số task quá hạn: <strong>{getOverdueScheduleTasks().length}</strong></div>
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