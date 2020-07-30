import React from 'react';
import { Component } from 'react';
import { DomainOfTaskResultsChart } from '../task-dashboard/domainOfTaskResultsChart';
import { TaskStatusChart } from '../task-dashboard/taskStatusChart';
import { TasksSchedule } from '../task-dashboard/tasksSchedule';

class TaskOrganizationUnitDashboard extends Component {
    render() {
        return (

            <React.Fragment>

                <DomainOfTaskResultsChart taskOrganizationUnit={true} />

                <TaskStatusChart taskOrganizationUnit={true} />

                <TasksSchedule />

            </React.Fragment>
        )
    }
}

export { TaskOrganizationUnitDashboard };