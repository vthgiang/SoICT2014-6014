import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, DataTableSetting, PaginateBar, TreeTable } from '../../../../common-components';

class DetailOfTaskDialogModal extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

        }
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

        return [day, month, year].join('-');
    }

    formatPriority = (data) => {
        const { translate } = this.props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.normal');
        if (data === 3) return translate('task.task_management.high');
    }

    formatStatus = (data) => {
        const { translate } = this.props;
        if (data === "Inprocess") return translate('task.task_management.inprocess');
        else if (data === "WaitForApproval") return translate('task.task_management.wait_for_approval');
        else if (data === "Finished") return translate('task.task_management.finished');
        else if (data === "Delayed") return translate('task.task_management.delayed');
        else if (data === "Canceled") return translate('task.task_management.canceled');
    }

    render() {
        const { translate } = this.props;
        const { listTask } = this.props;

        let data = [], column;

        column = [
            { name: translate('task.task_management.col_name'), key: "name" },
            { name: translate('task.task_management.col_organization'), key: "organization" },
            { name: translate('task.task_management.col_priority'), key: "priority" },
            { name: translate('task.task_management.col_start_date'), key: "startDate" },
            { name: translate('task.task_management.col_end_date'), key: "endDate" },
            { name: translate('task.task_management.col_status'), key: "status" }
        ];

        if (listTask && listTask.length !== 0) {
            data = listTask.map(task => {
                return {
                    ...task,
                    name: task.name,
                    organization: task.detailOrganizationalUnit && task.detailOrganizationalUnit.length !== 0 ? task.detailOrganizationalUnit[0].name : translate('task.task_management.err_organizational_unit'),
                    priority: this.formatPriority(task.priority),
                    startDate: this.formatDate(task.startDate),
                    endDate: this.formatDate(task.endDate),
                    status: this.formatStatus(task.status)
                }      
            });
        }
        

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-task-detail" 
                    title="Chi tiết công việc"
                    size="75"
                    hasNote={false}
                    hasSaveButton={false}
                >
                    <DataTableSetting
                        tableId="task-tree-table"
                        tableContainerId="task-tree-table-container"
                        tableWidth="1000px"
                        columnArr={[
                            translate('task.task_management.col_name'),
                            translate('task.task_management.col_organization'),
                            translate('task.task_management.col_priority'),
                            translate('task.task_management.col_start_date'),
                            translate('task.task_management.col_end_date'),
                            translate('task.task_management.col_status')
                        ]}
                        hideColumnOption={true}
                    />

                    <div id="task-tree-table-container">
                        <TreeTable
                            tableId="task-tree-table"
                            column={column}
                            data={data}
                            actions={false}
                        />

                    </div>
                </DialogModal>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { } = state;
    return { };
}

const actions = {

}

const connectDetailOfTaskDialogModal = connect(mapState, actions)(withTranslate(DetailOfTaskDialogModal));
export { connectDetailOfTaskDialogModal as DetailOfTaskDialogModal }