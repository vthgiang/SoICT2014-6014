import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ManufacturingMillScheduleManagentTable from './manufacturingMillScheduleManagentTable';

class ManufacturingMillScheduleList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <ManufacturingMillScheduleManagentTable />
                </div>
            </div>

        );
    }
}
export default connect(null, null)(withTranslate(ManufacturingMillScheduleList));