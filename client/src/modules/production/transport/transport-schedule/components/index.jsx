import React, { Component } from "react";
import { forceCheckOrVisible, formatDate, LazyLoadComponent } from '../../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TransportScheduleManagementTable } from './transportScheduleManagementTable';
import { TransportArrangeSchedule } from './transportArrangeSchedule';
import { Chart } from './chart'

class TransportSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#list-manufacturing-mill-schedule" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Lịch vận chuyển"}</a></li>
                    <li ><a href="#list-workder-schedule" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Xếp lịch vận chuyển"}</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="list-manufacturing-mill-schedule">
                        <LazyLoadComponent
                        >
                            <TransportScheduleManagementTable />
                        </LazyLoadComponent>
                    </div>
                    <div className="tab-pane" id="list-workder-schedule">
                        <LazyLoadComponent
                        >
                            <TransportArrangeSchedule />
                            <Chart />
                        </LazyLoadComponent>
                    </div>
                </div>
            </div>
        );
    }
}

export default TransportSchedule;