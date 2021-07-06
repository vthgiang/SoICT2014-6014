import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, LazyLoadComponent, forceCheckOrVisible } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { generateCode } from "../../../../../../helpers/generateCode";
import { formatToTimeZoneDate, formatDate } from "../../../../../../helpers/formatDate"
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { SelectBox } from '../../../transportHelper/select-box-id/selectBoxId'
import { transportPlanActions } from '../../redux/actions';
import { transportVehicleActions } from '../../../transport-vehicle/redux/actions'
import { transportDepartmentActions } from "../../../transport-department/redux/actions"
import { isTimeZoneDateSmaller } from "../../../transportHelper/compareDateTimeZone"
import '../transport-plan.css'
// Xem danh sách xe + tài xế khi ấn xem chi tiết kế hoạch
function TransportVehicleAndCarrierSelect(props) {
    let {currentTransportPlan} = props;
    const [vehicleAndCarrier, setVehicleAndCarrier] = useState([]);
    const getDriver = (carriers) => {
        let driver = "";
            for (let i=0;i<carriers.length;i++){
                if (carriers[i]?.pos === 1){
                    driver = carriers[i].carrier.name;
                }
            }
        return driver;
    }
    const getCarrier = (carriers) => {
        let carrier = "";
        if (currentTransportPlan?.transportVehicles && currentTransportPlan?.transportVehicles?.length!==0){
            for (let i=0;i<carriers.length;i++){
                if (!(carriers[i]?.pos === 1)){
                    if (carrier.length!==0){
                        carrier+=", ";
                    }
                    carrier += carriers[i].carrier.name;
                }
            }
        }
        return carrier;
    }
    useEffect(() => {
        if (currentTransportPlan){
            setVehicleAndCarrier(currentTransportPlan.transportVehicles);
        }
        console.log(currentTransportPlan)
    }, [currentTransportPlan])

    return (
        <React.Fragment>
            <div className="box-body">
                {
                vehicleAndCarrier && vehicleAndCarrier.length!==0
                &&
                <table id={"detail-vehicle-carrier"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                            <th>{"Mã xe"}</th>
                            <th>{"Tên xe"}</th>
                            <th>{"Trọng tải"}</th>
                            <th>{"Thể tích thùng"}</th>
                            <th>{"Tài xế"}</th>
                            <th style={{width: '200px'}}>{"Nhân viên đi cùng"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(vehicleAndCarrier && vehicleAndCarrier.length !== 0) &&
                            vehicleAndCarrier.map((x, index) => (
                                x &&
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{x.vehicle?.code}</td>
                                    <td>{x.vehicle?.name}</td>
                                    <td>{x.vehicle?.payload + " kg"}</td>
                                    <td>{x.vehicle?.volume + " \u33A5"}</td>
                                    <td>
                                        {getDriver(x.carriers)}
                                    </td>
                                    <td>
                                        {getCarrier(x.carriers)}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }
            </div>
        </React.Fragment>
    );
}


function mapState(state) {
    const {transportDepartment, transportVehicle, transportPlan} = state;
    return { transportDepartment, transportVehicle, transportPlan }
}
const actions = {
    getAllTransportDepartments: transportDepartmentActions.getAllTransportDepartments,
    getAllTransportVehicles: transportVehicleActions.getAllTransportVehicles,
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
}
const connectedTransportVehicleAndCarrierSelect = connect(mapState, actions)(withTranslate(TransportVehicleAndCarrierSelect));
export { connectedTransportVehicleAndCarrierSelect as TransportVehicleAndCarrierSelect };