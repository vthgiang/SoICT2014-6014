import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal } from '../../../../common-components';


class SelectFollowingTaskModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFollowing: {}
        };
    }

    componentDidMount() {
        // this.props.getDepartment();
        // this.props.getAllUserOfCompany();
        // this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        // this.props.getDepartmentsThatUserIsDean();
        // this.props.getAllUserInAllUnitsOfCompany();
    }

    changeSelectedFollowingTask = async (e, id) => {
        let { value, checked } = e.target;

        await this.setState( state =>{
            state.selectedFollowing[id] = {
                checked: checked,
                value: value,
            }
            return {
                ...state,
            }
        });
        console.log('0000', this.state);
    }
    
    save = () => {
        console.log('saved');
    }

    render() {
        const { user, translate } = this.props;
        const { task } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-select-following-task" isLoading={user.isLoading}
                    formID="form-select-following-task"
                    title={this.props.title}
                    func={this.save}
                    // disableSubmit={!this.isTaskTemplateFormValidated()}
                    size={50}
                >
                    {task.followingTasks.length !== 0 ?
                        (task.followingTasks.map( (x, key) => {
                            return <div key={key} style={{ paddingLeft: 20 }}>
                                <label style={{ fontWeight: "normal", margin: "7px 0px" }}>
                                    <input
                                        type="checkbox"
                                        // checked={this.state.listInactive[`${elem._id}`] && this.state.listInactive[`${elem._id}`].checked === true}
                                        checked={this.state.selectedFollowing[x.task._id] && this.state.selectedFollowing[x.task._id].checked === true}
                                        value={x.task._id}
                                        name="following" onChange={(e) => this.changeSelectedFollowingTask(e, x.task._id)}
                                    />&nbsp;&nbsp;&nbsp;{x.task.name} { x.link ? `- Đường liên kết: ${x.link}` : ''}
                                </label>
                                <br />
                            </div>
                        }))
                        : <div>Không có công việc phía sau</div>
                    }
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks, performtasks, user } = state;
    return { tasks, performtasks, user };
}

const actionCreators = {};
const connectedSelectFollowingTaskModal = connect(mapState, actionCreators)(withTranslate(SelectFollowingTaskModal));
export { connectedSelectFollowingTaskModal as SelectFollowingTaskModal };