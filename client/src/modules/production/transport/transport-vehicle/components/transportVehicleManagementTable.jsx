import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

import { TransportVehicle } from './transportVehicle';
import { TransportEmployee } from './transportEmployee'; 

import { transportPlanActions } from "../../transport-plan/redux/actions"


function TransportVehicleManagementTable(props) {

    let { allTransportPlans } = props

    const [currentTransportPlan, setCurrentTransportPlan] = useState({
        _id: "0",
        code: "",
    });

    const getTableId = "table-manage-transport-requirements-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    const getListTransportPlans = () => {
        let listTransportPlans = [
            {
                value: "0",
                text: "Lịch trình",
            },
        ];        
        if (allTransportPlans) {
            allTransportPlans.map((item) => {
                listTransportPlans.push({
                    value: item._id,
                    text: item.code,
                });
            });
        }
        return listTransportPlans;
    }

    const handleTransportPlanChange = (value) => {
        if (value[0] !== "0" && allTransportPlans){
            let filterPlan = allTransportPlans.filter((r) => r._id === value[0]);
            if (filterPlan.length > 0){
                setCurrentTransportPlan(filterPlan[0]);
            }
        }
        else{
            setCurrentTransportPlan({_id: value[0], code: ""});
        }
    }

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
                        value={currentTransportPlan._id}
                        items={getListTransportPlans()}
                        onChange={handleTransportPlanChange}
                    />
                </div>

                {/* <div className="form-group">
                    <button type="button" className="btn btn-success" title="Lọc" 
                        // onClick={this.handleSubmitSearch}
                    >
                        Tìm kiếm
                    </button>
                </div> */}
            </div>
            {
                (currentTransportPlan && currentTransportPlan._id !== "0")
                &&
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border" style={{ height: "100%" }}>
                        <legend className="scheduler-border">Kế hoạch: {currentTransportPlan.code}</legend>
                            {/* <TransportVehicle 
                                currentTransportPlan = {currentTransportPlan}
                            /> */}
                        </fieldset>
                    </div>            
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                            <fieldset className="scheduler-border" style={{ height: "100%" }}>
                            <legend className="scheduler-border">Phương tiện</legend>
                            {
                                (currentTransportPlan && currentTransportPlan._id !== "0")
                                && 
                                <TransportVehicle 
                                    currentTransportPlanId = {currentTransportPlan._id}
                                />
                            } 
                            
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
            }
            
        </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const allTransportPlans = state.transportPlan.lists;
    return { allTransportPlans }
}

const actions = {
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
    getDetailTransportPlan: transportPlanActions.getDetailTransportPlan,
}

const connectedTransportVehicleManagementTable = connect(mapState, actions)(withTranslate(TransportVehicleManagementTable));
export { connectedTransportVehicleManagementTable as TransportVehicleManagementTable };

