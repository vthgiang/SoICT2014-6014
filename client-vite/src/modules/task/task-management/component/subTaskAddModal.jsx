import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components/src/modal/dialogModal'
import { getStorage } from '../../../../config';
import ModalAddTaskProject from '../../task-project/component/modalAddTaskProject';
import { taskManagementActions } from '../redux/actions';
import { AddTaskForm } from './addTaskForm';
import dayjs from "dayjs";
class AddSubTaskByProcessModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newTask: {
                name: "",
                description: "",
                quillDescriptionDefault: "",
                startDate: "",
                endDate: "",
                priority: 3,
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                creator: getStorage("userId"),
                organizationalUnit: "",
                collaboratedWithOrganizationalUnits: [],
                taskTemplate: "",
                taskProject: "",
            },
            currentRole: getStorage('currentRole'),
        };
    }

    onChangeTaskData = (value) => {
        this.setState({ newTask: value })
    }
    onChangeStartTime = (value) => {
        this.setState({ startTime: value });
    }
    onChangeEndTime = (value) => {
        this.setState({ endTime: value });
    }

    convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss');
    }

    handleAddSubTask = () => {
        const { newTask, startTime, endTime } = this.state;
        let startDateTask = this.convertDateTime(newTask.startDate, startTime);
        let endDateTask = this.convertDateTime(newTask.endDate, endTime);
        this.props.addSubTask({
            ...newTask,
            startDate: startDateTask,
            endDate: endDateTask,
        });
    }

    render() {
        const { translate } = this.props;
        const { task, id, parentTask, currentTasks } = this.props;
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID={`addSubTaskByProcess`} isLoading={false}
                    formID={`form-add-new-task-${id}`}
                    func={this.handleAddSubTask}
                    title={translate('task.task_management.add_new_task')}
                >
                    <AddTaskForm
                        quillId={this.props.id}
                        handleChangeTaskData={this.onChangeTaskData}
                        handleChangeStartTime={this.onChangeStartTime}
                        handleChangeEndTime={this.onChangeEndTime}
                        id={id}
                        task={task}
                        parentTask={parentTask}
                        currentTasks={currentTasks}
                    />
                    <ModalAddTaskProject />
                </DialogModal>
            </React.Fragment>
        );
    }
}

const actionCreators = {
    addTask: taskManagementActions.addTask,
};

const connectedModalSubAddTask = connect(null, actionCreators)(withTranslate(AddSubTaskByProcessModal));
export { connectedModalSubAddTask as AddSubTaskByProcessModal };