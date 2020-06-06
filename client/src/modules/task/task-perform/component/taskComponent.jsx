import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DetailTaskTab } from './detailTaskTab';
import { ActionTab } from './actionTab';
import { SubTaskTab } from './subTaskTab';
import { taskManagementActions } from "../../task-management/redux/actions";
import { performTaskAction } from '../redux/actions';

import qs from 'qs';
import { DialogModal } from '../../../../common-components';

class TaskComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskId: null
        };

    }
    componentWillMount = () => {
        if (this.props.location) {
            const { taskId } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
            console.log(taskId);
            if (taskId) {
                this.handleShowSubTask(taskId);
            }
        }
    }
    handleShowSubTask = async (taskId) => {
        console.log(taskId);
        await this.setState(state => {
            return {
                ...state,
                taskId: taskId
            }
        })
        this.props.getTaskById(taskId);
        this.props.getSubTask(taskId);
        this.props.getTimesheetLogs(taskId);
    }
    handleShowErr() {
        window.$('#modal-show-err').modal('show');
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
        }
        return false;
    }

    render() {
        const { taskId } = this.state;
        const { tasks } = this.props;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) {
            if (!this.checkPermission(tasks)) {
                this.handleShowErr();
                return (
                    <React.Fragment>
                        <DialogModal
                            size='50' modalID="modal-show-err" isLoading={false}
                            formID="form-show-err"
                            title="Bạn không có quyền truy cập vào công việc này"
                            hasSaveButton={false}

                        >
                            <div className="modal-body">
                                <p><b>Nguyên nhân có thể là do:</b></p>
                                <ul>
                                    <li>Bạn không có nhiệm vụ trong công việc</li>
                                    <li>Công việc không còn tồn tại</li>
                                </ul>
                            </div>
                        </DialogModal>
                    </React.Fragment>
                );
            } else {
                return (
                    <div className="row row-equal-height" style={{ margin: "0px", height: "100%", backgroundColor: "#fff" }}>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ paddingTop: "10px" }}>

                            <DetailTaskTab
                                id={this.props.id}
                                role={this.props.role}
                            />
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ padding: "10px 0 10px 0", borderLeft: "1px solid #f4f4f4" }}>
                            <ActionTab
                                id={this.props.id}
                                role={this.props.role}
                            />
                        </div>

                    </div>
                );
            }
        } else {
            return (
                <div className="row row-equal-height" style={{ margin: "0px", height: "100%", backgroundColor: "#fff" }}>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ paddingTop: "10px" }}>

                        <DetailTaskTab
                            id={this.props.id}
                            role={this.props.role}
                        />
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ padding: "10px 0 10px 0", borderLeft: "1px solid #f4f4f4" }}>
                        <ActionTab
                            id={this.props.id}
                            role={this.props.role}
                        />
                    </div>

                </div>
            );
        }
        return null;
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
};

const taskComponent = connect(mapState, actionCreators)(withTranslate(TaskComponent));
export { taskComponent as TaskComponent }


