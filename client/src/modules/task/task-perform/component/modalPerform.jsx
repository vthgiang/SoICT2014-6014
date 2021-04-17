import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { TaskComponent } from './taskComponent';

class ModalPerform extends Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    render() {
        let taskName;
        const { performtasks, units } = this.props;

        if (performtasks?.task)
            taskName = performtasks.task?.name;
        return (
            <React.Fragment>
                <DialogModal
                    size="100"
                    modalID={`modelPerformTask${this.props.id}`}
                    formID="form-perform-task"
                    title={taskName ? taskName : ""}
                    bodyStyle={{ padding: "0px" }}
                    hasSaveButton={false}
                >
                    <TaskComponent
                        units={units}
                        id={this.props.id}
                    />
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { performtasks } = state;
    return { performtasks };
}

const actionDispatch = {}

const modalPerform = connect(mapState, actionDispatch)(withTranslate(ModalPerform));
export { modalPerform as ModalPerform }


