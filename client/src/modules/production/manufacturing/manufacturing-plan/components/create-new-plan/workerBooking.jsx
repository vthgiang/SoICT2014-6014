import React, { Component } from 'react';
import WorkSchedule from '../work-schedule-component/workSchedule';
class WorkerBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div>
                <WorkSchedule />
            </div >
        );
    }
}

export default WorkerBooking;