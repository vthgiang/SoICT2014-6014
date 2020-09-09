import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox } from '../../../../common-components';
import { performTaskAction } from '../redux/actions';
import Swal from 'sweetalert2';


class SelectFollowingTaskModal extends Component {
    constructor(props) {
        super(props);
        let { task } = props;
        this.state = {
            selectedFollowing: {},
            statusOptions: task?.status,
        };
    }

    /**
     * Hàm cập nhật chọn status
     * @param {*} value giá trị status lựa chọn
     */
    handleSelectedStatus = (value) => {
        this.setState(state => {
            return {
                ...state,
                statusOptions: value[0]
            }
        })
    }

    /**
     * Hàm cập nhật các following task muốn kích hoạt
     * @param {*} e event - đối tượng sự kiện khi tác động thay đổi input
     * @param {*} id id của công việc được chọn
     */
    changeSelectedFollowingTask = async (e, id) => {
        let { value, checked } = e.target;

        await this.setState(state => {
            state.selectedFollowing[id] = {
                checked: checked,
                value: value,
            }
            return {
                ...state,
            }
        });
    }

    /**
     * Hàm lưu, gửi request đến server
     */
    save = () => {
        let selectedFollowing = this.state.selectedFollowing;
        let listFollowing = [];
        for (let i in selectedFollowing) {
            if (selectedFollowing[i].checked) {
                listFollowing.push(selectedFollowing[i].value);
            }
        }

        // Thông báo xác nhận kích hoạt công việc
        Swal.fire({
            title: this.props.translate('task.task_perform.notice_change_activate_task'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.translate('general.no'),
            confirmButtonText: this.props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                this.props.editActivateOfTask(this.props.id, this.props.typeOfTask, listFollowing);
            }
        })
    }

    /**
     * Hàm validate form gửi dữ liệu
     */
    isFormValidated = () => {
        let { selectedFollowing } = this.state;
        let listFollowing = [];
        for (let i in selectedFollowing) {
            if (selectedFollowing[i].checked) {
                listFollowing.push(selectedFollowing[i].value);
            }
        }

        if (listFollowing.length > 0) {
            return true;
        }
        return false;
    }

    render() {
        const { user, translate } = this.props;
        const { task } = this.props;
        const { statusOptions, selectedFollowing } = this.state;

        // biến kiểm tra có công việc CHƯA kích hoạt hay không
        let checkHasNonActivatedFollowTask = false;
        if (task) {
            for (let i in task.followingTasks) {
                if (task.followingTasks[i].activated === false) {
                    checkHasNonActivatedFollowTask = true;
                }
            }
        }

        // biến kiểm tra có công việc ĐÃ kích hoạt hay không
        let checkHasActivatedFollowTask = false;
        if (task) {
            for (let i in task.followingTasks) {
                if (task.followingTasks[i].activated === true) {
                    checkHasActivatedFollowTask = true;
                }
            }
        }

        // Mảng cấu hình trạng thái công việc
        let statusArr = [
            { value: "Inprocess", text: translate('task.task_management.inprocess') },
            { value: "WaitForApproval", text: translate('task.task_management.wait_for_approval') },
            { value: "Finished", text: translate('task.task_management.finished') },
            { value: "Delayed", text: translate('task.task_management.delayed') },
            { value: "Canceled", text: translate('task.task_management.canceled') }
        ];

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-select-following-task" isLoading={user.isLoading}
                    formID="form-select-following-task"
                    title={this.props.title}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    hasSaveButton={checkHasNonActivatedFollowTask}
                >
                    {/* Danh sách các công việc ĐÃ kích hoạt */}
                    {checkHasActivatedFollowTask &&
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('task.task_perform.activated_task_list')}</legend>
                            {task.followingTasks.map((x, key) => {
                                if (x.activated) {
                                    return <ul key={key} style={{ paddingLeft: 20 }}>
                                        <li>{x.task.name} {x.link ? `- ${translate('task.task_perform.task_link_of_process')}: ${x.link}` : ''}</li>
                                        <br />
                                    </ul>
                                }
                            })}
                        </fieldset>
                    }

                    {/* Danh sách công việc CHƯA kích hoạt */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('task.task_perform.choose_following_task')}<span style={{ color: "red" }}> *</span></legend>

                        {task.followingTasks.length !== 0 ?
                            (checkHasNonActivatedFollowTask ?
                                (task.followingTasks.map((x, key) => {
                                    if (x.activated === false) {
                                        return <div key={key} style={{ paddingLeft: 20 }}>
                                            <label style={{ fontWeight: "normal", margin: "7px 0px" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFollowing[x.task._id] && selectedFollowing[x.task._id].checked === true}
                                                    value={x.task._id}
                                                    name="following" onChange={(e) => this.changeSelectedFollowingTask(e, x.task._id)}
                                                />&nbsp;&nbsp;&nbsp;{x.task.name} {x.link ? `- ${translate('task.task_perform.task_link_of_process')}: ${x.link}` : ''}
                                            </label>
                                            <br />
                                        </div>
                                    }

                                })) : <div>{translate('task.task_perform.activated_all')}</div>
                            )
                            : <div>{translate('task.task_perform.not_have_following')}</div>
                        }
                    </fieldset>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks, performtasks, user } = state;
    return { tasks, performtasks, user };
}

const actionCreators = {
    editActivateOfTask: performTaskAction.editActivateOfTask,
};
const connectedSelectFollowingTaskModal = connect(mapState, actionCreators)(withTranslate(SelectFollowingTaskModal));
export { connectedSelectFollowingTaskModal as SelectFollowingTaskModal };