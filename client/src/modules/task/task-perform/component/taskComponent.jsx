import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DetailTaskTab } from './detailTaskTab';
import { ActionTab } from './actionTab';
import { SubTaskTab } from './subTaskTab';
import { taskManagementActions } from "../../task-management/redux/actions";
import { performTaskAction } from '../redux/actions';
import { UserActions } from "../../../super-admin/user/redux/actions";

import qs from 'qs';
import { DialogModal } from '../../../../common-components';

class TaskComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskId: null
        };

        /**
         * Dùng khi mở task từ URL. Ban đầu flag là 1, chạy vào render trước, taskID=null
         * Sau đó chạy vào shouldComponentUpdate, flag có giá trị là 2, taskID sẽ là tham số từ URL 
         */
        this.flag= 1;

        this.props.getAllUserOfCompany();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.location) {
            const { taskId } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
            if (taskId && this.flag ==1) {
                this.flag = 2;
                return true;
            }
        }
        return true;
    }
    checkPermission(tasks) {
        var id = localStorage.getItem("userId");
        var task, info, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees;
        if (tasks.task) info = tasks.task.info;
        if (typeof info !== 'undefined' && info !== null) {
            responsibleEmployees = info.responsibleEmployees;
            accountableEmployees = info.accountableEmployees;
            consultedEmployees = info.consultedEmployees;
            informedEmployees = info.informedEmployees;
            for (let n in responsibleEmployees) {
                if (responsibleEmployees[n]._id === id) return true;
            }
            for (let n in accountableEmployees) {
                if (accountableEmployees[n]._id === id) return true;
            }
            for (let n in consultedEmployees) {
                if (consultedEmployees[n]._id === id) return true;
            }
            for (let n in informedEmployees) {
                if (informedEmployees[n]._id === id) return true;
            }
            if (info.creator._id === id){
                return true;
            }
        }
        return false;
    }

    onChangeTaskRole = (role) => {
        this.setState(state => {
            return {
                ...state,
                role: role
            }
        })
    }

    render = () => {
        let taskId = this.props.id;;

        if (this.props.location){
            if (this.flag !== 1){
                taskId = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).taskId;
            }
        }
        
        const { tasks } = this.props;
        if (tasks.task && !this.checkPermission(tasks)) {
            return (
                <div>
                    <h2>Công việc không tồn tại hoặc bạn không có quyền truy cập</h2>
                </div>
            );
        }
        return (
            <div className="row row-equal-height" style={{ margin: "0px", height: "100%", backgroundColor: "#fff" }}>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ paddingTop: "10px" }}>

                    <DetailTaskTab
                        id={taskId} onChangeTaskRole={this.onChangeTaskRole}
                    />
                </div>

                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ padding: "10px 0 10px 0", borderLeft: "1px solid #f4f4f4" }}>
                    <ActionTab
                        id={taskId}
                        role={this.state.role}
                    />
                </div>

            </div>
        );
    }
}
function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const actionCreators = {
    getTaskById: taskManagementActions.getTaskById,
    getSubTask: taskManagementActions.getSubTask,
    getTimesheetLogs: performTaskAction.getTimesheetLogs,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
};

const taskComponent = connect(mapState, actionCreators)(withTranslate(TaskComponent));
export { taskComponent as TaskComponent }


