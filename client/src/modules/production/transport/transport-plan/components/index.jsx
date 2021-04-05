import React, { Component } from "react";
import { forceCheckOrVisible, formatDate, LazyLoadComponent } from '../../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TransportScheduleManagementTable } from './transportScheduleManagementTable';
import { TransportArrangeSchedule } from './transportArrangeSchedule';
import { TransportVehicleManagementTable } from '../../transport-vehicle/components/transportVehicleManagementTable';

class TransportPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#list-transport-plan" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Kế hoạch vận chuyển"}</a></li>
                    <li><a href="#list-arrange-schedule" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Xếp kế hoạch vận chuyển"}</a></li>
                    <li><a href="#list-vehicle-carrier" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Phương tiện và nhân viên vận chuyển"}</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="list-transport-plan">
                        <LazyLoadComponent
                        >
                            <TransportScheduleManagementTable />
                        </LazyLoadComponent>
                    </div>
                    <div className="tab-pane" id="list-arrange-schedule">
                        <LazyLoadComponent
                        >
                            <TransportArrangeSchedule />
                        </LazyLoadComponent>
                    </div>
                    <div className="tab-pane" id="list-vehicle-carrier">
                        <LazyLoadComponent
                        >
                            <TransportVehicleManagementTable />
                        </LazyLoadComponent>
                    </div>
                </div>
            </div>
        );
    }
}

export default TransportPlan;