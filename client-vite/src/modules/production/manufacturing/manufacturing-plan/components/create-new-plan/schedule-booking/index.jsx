import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import AutoScheduleBooking from './automatic-booking';
import ManualScheduleBooking from './manualScheduleBooking';

const ScheduleBooking = (props) => {
    const { translate } = props;
    const [activeTab, setActiveTab] = useState(0);

    const handleActiveTab = (activeTab) => {
        setActiveTab(activeTab)
    }
    
    return (
        <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                <li className="active"><a href="#auto-booking" data-toggle="tab" onClick={() => handleActiveTab(0)}>{translate('manufacturing.plan.auto_schedule_booking')}</a></li>
                <li><a href="#manual-booking" data-toggle="tab" onClick={() => handleActiveTab(1)}>{translate('manufacturing.plan.manual_schedule_booking')} </a></li>
            </ul>
            <div className="tab-content">
                <div className="tab-pane active" id="auto-booking">
                    {activeTab === 0 && (
                        <AutoScheduleBooking 
                            manufacturingCommands={props.manufacturingCommands}
                            onManufacturingCommandsChange={props.onManufacturingCommandsChange}
                            startDate={props.startDate}
                            endDate={props.endDate}
                        />
                    )}
                </div>
                <div className="tab-pane" id="manual-booking">
                    {activeTab === 1 && (
                        <ManualScheduleBooking {...props} />
                    )}
                </div>
            </div>
        </div>
    );
}
export default connect(null, null)(withTranslate(ScheduleBooking));
