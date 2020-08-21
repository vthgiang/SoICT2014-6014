import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components/index';
import { taskManagementActions } from '../../redux/actions'
import { DetailTaskTab } from '../../../task-perform/component/detailTaskTab';

class ModalDetailTask extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.id !== this.state.id) {
            this.props.getTaskById(nextProps.id);

            this.setState(state => {
                return {
                    ...state,
                    id: nextProps.id,
                }
            });
            return false;
        }
        return true;
    }

    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/');
    }

    render() {
        const { tasks, translate } = this.props;
        const { isProcess } = this.props;

        let task;
        if (isProcess) {
            console.log('quang');
            task = (this.props.task) && this.props.task;
        }
        else task = tasks && tasks.task;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-task`}
                    title={translate('task.task_management.model_detail_task_title')}
                    hasSaveButton={false}
                    size={75}>
                    <DetailTaskTab
                        task={task && task}
                        showToolbar={false}
                        isProcess={isProcess}
                    />
                </DialogModal>
            </React.Fragment>
        )
    }
}
function mapState(state) {
    const { tasks } = state;
    return { tasks }
}
const Actions = {
    getTaskById: taskManagementActions.getTaskById
}
const connectedModalDetailTask = connect(mapState, Actions)(withTranslate(ModalDetailTask));
export { connectedModalDetailTask as ModalDetailTask };