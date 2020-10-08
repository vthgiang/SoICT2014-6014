import React, { Component } from 'react';
import WorkSchedule from '../../../../manufacturing-schedule/components';

class ManufacturingSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { id } = this.props;
        return (
            <div id={id} className="tab-pane">
                <WorkSchedule />
            </div>
        );
    }

}

export default ManufacturingSchedule;