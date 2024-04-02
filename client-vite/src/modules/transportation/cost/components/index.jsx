import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { LazyLoadComponent } from "../../../../common-components";
import VehicleCostManagement from "./vehicleCostManagement";
import ShipperCostManagement from './shipperCostManagement';
import ShipperSalaryStatisticTable from "./shipperSalaryStatisticTable";

function TransportationCost(props) {

    const [state, setState]  = useState({
        type: 1
    })

    const { type } = state;
    const { translate } = props

    const handleVehicleCost = async () => {
        const type = 1;
        await setState({
            ...state,
            type: type,
        })
    };

    const handleShipperCost = async () => {
        const type = 2;
        await setState({
            ...state,
            type: type,
        })
    };

    const handleShipperSalaryStatistic = async () => {
        const type = 3;
        await setState({
            ...state,
            type: type,
        })
    };

    return (
        <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                <li className="active"><a href="#vehicle-cost" data-toggle="tab" onClick={() => handleVehicleCost()}>{translate('manage_transportation.cost_management.vehicle_cost_title')}</a></li>
                <li><a href="#shipper-cost" data-toggle="tab" onClick={() => handleShipperCost()}>{translate('manage_transportation.cost_management.shipper_cost_title')}</a></li>
                <li><a href="#shipper-salary-statistic" data-toggle="tab" onClick={() => handleShipperSalaryStatistic()}>{translate('manage_transportation.cost_management.shipper_salary_statistic_table')}</a></li>
            </ul>
            <div className="tab-content">
                <div className="tab-pane active" id="vehicle-cost">
                    {type === 1 &&
                        <LazyLoadComponent>
                            <VehicleCostManagement/>
                        </LazyLoadComponent>
                    }
                </div>
                <div className="tab-pane" id="shipper-cost">
                    {type === 2 &&
                        <LazyLoadComponent>
                            <ShipperCostManagement/>
                        </LazyLoadComponent>
                    }
                </div>
                <div className="tab-pane" id="shipper-salary-statistic">
                    {type === 3 &&
                        <LazyLoadComponent>
                            <ShipperSalaryStatisticTable/>
                        </LazyLoadComponent>
                    }
                </div>
            </div>
        </div>
    );
}

function mapState(state) {
    const transportationCost = state.transportationCost;
    return { transportationCost }
}
const actions = {

}

export default connect(null, null)(withTranslate(TransportationCost));