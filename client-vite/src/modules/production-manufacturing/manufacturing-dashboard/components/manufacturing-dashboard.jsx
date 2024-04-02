import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DatePicker, TimePicker, SelectBox, ErrorLabel, ToolTip, TreeSelect, QuillEditor, DataTableSetting, DeleteNotification } from '../../../../common-components';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

function ManagementDashboard() {

    const [state, setState] = useState({
        startDate: "",
        endDate: "",
    })

    return (
        <React.Fragment>
            <div className="row">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Báo cáo tông hợp</legend>
                    <div className="row">
                        <div className="col-xs-6 col-md-6">
                            <label className="control-label">Ngày bắt đầu<span className="text-red">*</span></label>
                            <DatePicker
                                id={`date-start-picker1`}
                                value={newTask.startDate}
                                onChange={this.handleChangeTaskEndDate}
                            />
                        </div>
                        <div className="col-xs-6 col-md-6">
                        <label className="control-label">Ngày kết thúc<span className="text-red">*</span></label>
                            <DatePicker
                                id={`date-end-picker1`}
                                value={newTask.endDate}
                                onChange={this.handleChangeTaskEndDate}
                            />
                        </div>
                    </div>
                    <div className="row">
                        
                    </div>
                </fieldset>
            </div>
        </React.Fragment>
    )
}

const connectMangementDashboard = connect()(withTranslate(ManagementDashboard))