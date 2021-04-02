import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

import { TransportVehicle } from './transportVehicle';
import { TransportEmployee } from './transportEmployee'; 


function TransportVehicleManagementTable(props) {
    const getTableId = "table-manage-transport-requirements-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;


    return (
        <React.Fragment>
            <div className="box-body qlcv">
            <div className="form-inline">
                            <div className="form-group">
                                <label className="form-control-static">Chọn lịch trình</label>
                                <SelectBox
                                    id={`select-filter-status-discounts`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: "all", text: "Tất cả lịch trình" },
                                        { value: "1", text: "Lịch trình 1" },
                                    ]}
                                    // onChange={this.handleQueryDateChange}
                                />
                            </div>

                            <div className="form-group">
                                <button type="button" className="btn btn-success" title="Lọc" 
                                    // onClick={this.handleSubmitSearch}
                                >
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                        
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                        
                        <fieldset className="scheduler-border" style={{ height: "100%" }}>
                        <legend className="scheduler-border">Phương tiện</legend>
                            <TransportVehicle />
                        </fieldset>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                    <fieldset className="scheduler-border" style={{ height: "100%" }}>
                        <legend className="scheduler-border">Nhân viên vận chuyển</legend>
                            <TransportEmployee />
                        </fieldset>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {

}

const actions = {
}

const connectedTransportVehicleManagementTable = connect(mapState, actions)(withTranslate(TransportVehicleManagementTable));
export { connectedTransportVehicleManagementTable as TransportVehicleManagementTable };

