import React, { Component } from 'react';
import WorkSchedule from '../plan-component/workSchedule';
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