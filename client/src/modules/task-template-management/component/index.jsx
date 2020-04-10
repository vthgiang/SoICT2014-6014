import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {TaskTemplate} from './TaskTemplate';
import {ModalAddTaskTemplate}  from './ModalAddTaskTemplate';

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    checkHasComponent = (name) => {
        var { auth } = this.props;
        var result = false;
        auth.components.forEach(component => {
            if (component.name === name) result = true;
        });

        return result;
    }

    render() {
        const { translate } = this.props;
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-body qlcv">
                        <div className="form-group">
                            {this.checkHasComponent('create-add-button') &&
                            <button type="button" className="btn btn-success pull-right" data-toggle="modal" title="Thêm mới một mẫu công việc" data-target="#addTaskTemplate" data-backdrop="static" data-keyboard="false">{translate('task_template.add')}</button>}
                            <ModalAddTaskTemplate />
                        </div>
                        <TaskTemplate/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = state => state;
const TaskExport = connect(mapState, null)(withTranslate(Task));
export { TaskExport as Task }