import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DialogModal} from '../../../../../common-components/index';
import {taskManagementActions} from '../../../task-management/redux/actions'
import { DetailTaskTab } from '../../../task-perform/component/detailTaskTab';

class ModelDetailTask extends Component{
    constructor (props) {
        super(props);
    }
    

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/');
    }

    render(){
        const {tasks} = this.props;
        let task = tasks && tasks.task;
        return(
            <React.Fragment>
            <DialogModal
                modalID={`modal-detail-task`}
                title={`Thông tin chi tiết công việc`}
                hasSaveButton ={false}
                size={75}>
                 <DetailTaskTab
                        task={task && task}
                        showToolbar={false}
                    />
            </DialogModal>
            </React.Fragment>
        )
    }
}
function mapState(state){
    const {tasks} = state;
    return {tasks}
}
const Actions = {
    getTaskById: taskManagementActions.getTaskById
}
const connectedModelDetailTask = connect (mapState, Actions)(ModelDetailTask)
export { connectedModelDetailTask as ModelDetailTask };