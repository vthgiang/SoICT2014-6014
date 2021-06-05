import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import WorkerScheduleManagementTable from './workerScheduleManagementTable'

function WorkerScheduleList(props){
    return (
        <div style={{ minHeight: "450px" }}>
            <div className="box-body">
                <WorkerScheduleManagementTable />
            </div>
        </div>

    );
}
export default connect(null, null)(withTranslate(WorkerScheduleList));