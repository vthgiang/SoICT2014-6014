import { DialogModal } from '../../../../../common-components/src/modal/dialogModal';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TaskImpartanceDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { translate, task } = this.props;
        let priority = "";
        if (task.priority) {
            switch (task.priority) {
                case 1:
                    priority = translate("task.task_management.low");
                    break;
                case 2:
                    priority = translate("task.task_management.average");
                    break;
                case 3:
                    priority = translate("task.task_management.standard");
                    break;
                case 4:
                    priority = translate("task.task_management.high");
                    break;
                case 5:
                    priority = translate("task.task_management.urgent");
                    break;

            }

        }
        return (
            <React.Fragment>
                <DialogModal
                    size={50}
                    modalID={`modal-taskimportance-auto`}
                    title={`${translate('kpi.evaluation.employee_evaluation.explain_automatic_point')} ${this.props.task.name}`}
                    hasSaveButton={false}
                >
                    <div>
                        <div>{translate('kpi.evaluation.employee_evaluation.num_of_working_day')}: {this.props.task ? this.props.task.daykpi : 0}</div>
                        <div>{translate('kpi.evaluation.employee_evaluation.contribution')}: {this.props.task ? this.props.task.results.contribution : ""}</div>
                        <div>{translate('kpi.evaluation.employee_evaluation.priority')}: {priority}</div>
                        <div>{translate('kpi.evaluation.employee_evaluation.formula')}:</div>
                        <div> 3 * ({this.props.task.priority} / 5) + 3 * ({this.props.task.results.contribution} / 100) + 4 * ({this.props.task.daykpi} / 30)</div>
                        <div> = {this.props.task.taskImportanceLevelCal}</div>
                    </div>
                </DialogModal>
            </React.Fragment>
        )
    };
}
const taskImportance = connect(null, null)(withTranslate(TaskImpartanceDialog))
export { taskImportance as TaskDialog }