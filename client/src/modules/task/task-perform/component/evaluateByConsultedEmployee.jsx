import React, { Component } from 'react';
import { DialogModal, ButtonModal, ErrorLabel } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';

class EvaluateByConsultedEmployee extends Component {
    constructor(props) {
        super(props);
        this.state={}
    }
    
    componentWillMount() {
        this.props.getTaskById(this.props.id);
    }

    validatePoint = (value) => {
        var { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    handleChangePoint = async (e) => {
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                point: value
            }
        })
    }

    isFormValidated = () => {

    }
    
    save = () => {

    }



    render() {
        var { point } = this.state;
        var { id, role } = this.props;

        return (
            <React.Fragment>
            <DialogModal
                modalID={`modal-evaluate-task-by-${this.props.role}-${this.props.id}`}
                formID="form-evaluate-task-by-consulted"
                title={this.props.title}
                func={this.save}
                disableSubmit={!this.isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-evaluate-task-by-consulted">
                    <form className="form-group">
                        <div className="form-group">
                            <label>Điểm tự đánh giá</label>
                            <input 
                                className="form-control"
                                type="number" 
                                name={point} 
                                onChange={this.handleChangePoint}
                            />
                        </div>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Task information</legend>


                        </fieldset>
                    </form>
                </form>
            </DialogModal>
        </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks } = state; // tasks,
    return { tasks, performtasks }; // tasks,
}
const getState = {
    getTaskById: taskManagementActions.getTaskById,
    createResult: performTaskAction.createResultTask,
    editResultTask: performTaskAction.editResultTask,
    editStatusOfTask: taskManagementActions.editStatusOfTask
}

const evaluateByConsultedEmployee = connect(mapState, getState)(withTranslate(EvaluateByConsultedEmployee));
export { evaluateByConsultedEmployee as EvaluateByConsultedEmployee }

// export {EvaluateByConsultedEmployee};