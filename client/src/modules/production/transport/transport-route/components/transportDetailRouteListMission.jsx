import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox, DialogModal } from "../../../../../common-components";

import { formatDate } from "../../../../../helpers/formatDate"

import { TransportManageVehicleProcess } from "./transportManageVehicleProcess"

import { transportPlanActions } from "../../transport-plan/redux/actions"
import { transportScheduleActions } from "../../transport-schedule/redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

import './timeLine.css';

function TransportDetailRouteListMission(props) {
    let {currentVehicleRoute, transportPlanId, transportPlan} = props;
    const [currentVehicle, setCurrentVehicle] = useState([])
    const [driver, setDriver] = useState()
    useEffect(() => {
        if(transportPlanId){
            props.getDetailTransportPlan(transportPlanId);
        }
    }, [transportPlanId])
    useEffect(() => {
        if (transportPlan && currentVehicleRoute && transportPlan.currentTransportPlan) {
            let vehicle = transportPlan.currentTransportPlan.transportVehicles
                        .filter(r=> String(r.vehicle) ===currentVehicleRoute?.transportVehicle?._id)
            if (vehicle && vehicle.length!==0){
                setCurrentVehicle(vehicle[0]);
            }
        }
    }, [transportPlan, currentVehicleRoute])

    useEffect(() => {
        console.log(currentVehicle, " day la xe co nguoi")
        if (currentVehicle && currentVehicle.carriers && currentVehicle.carriers.length!==0){
            console.log(currentVehicle.carriers)
            let dri = currentVehicle.carriers.filter(r => String(r.pos) === "1");
            console.log(dri);
            if (dri && dri.length !==0 ){
                setDriver(dri[0]);
            }
        }
    }, [currentVehicle])
    return (
        <React.Fragment>
            <div>
                <div>Tài xế: {driver?.carrier?.name}</div>
            </div>
            <table id={currentVehicleRoute?currentVehicleRoute.transportVehicle:"route"} 
                className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                        <th>{"Mã yêu cầu"}</th>
                        <th>{"Loại yêu cầu"}</th>
                        <th>{"Địa chỉ"}</th>
                        <th>{"Nhiệm vụ"}</th>
                        <th>{"Trạng thái"}</th>
                        <th>{"Hành động"}</th>
                        {/* <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                            <DataTableSetting
                                tableId={tableId}
                                columnArr={[
                                    translate('manage_example.index'),
                                    translate('manage_example.exampleName'),
                                    translate('manage_example.description'),
                                ]}
                                setLimit={setLimit}
                            />
                        </th> */}
                    </tr>
                </thead>
                <tbody>
                    {(currentVehicleRoute && currentVehicleRoute.length !== 0
                        && currentVehicleRoute.routeOrdinal && currentVehicleRoute.routeOrdinal.length!==0) 
                        && currentVehicleRoute.routeOrdinal.map((routeOrdinal, index) => (
                            routeOrdinal &&
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{routeOrdinal.transportRequirement?.code}</td>
                                <td>{routeOrdinal.transportRequirement?.type}</td>
                                <td>{(String(routeOrdinal.type)==="1")?routeOrdinal.transportRequirement?.fromAddress:routeOrdinal.transportRequirement?.toAddress}</td>
                                <td>{(String(routeOrdinal.type)==="1")?"Nhận hàng":"Trả hàng"}</td>
                                <td>{"Chưa hoàn thành"}</td>
                                <td style={{ textAlign: "center" }}>
                                    <a className="edit text-green" style={{ width: '5px' }} 
                                        // title={translate('manage_example.detail_info_example')} 
                                        title={'Thông tin chi tiết yêu cầu vận chuyển'}
                                        // onClick={() => handleShowDetailInfo(x)}
                                    >
                                        <i className="material-icons">
                                            visibility
                                        </i>
                                    </a>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </React.Fragment>
    )
}

function mapState(state) {
    const {transportPlan, socket} = state
    return { transportPlan, socket }
}

const actions = {
    
    getDetailTransportPlan: transportPlanActions.getDetailTransportPlan,
}

const connectedTransportDetailRouteListMission = connect(mapState, actions)(withTranslate(TransportDetailRouteListMission));
export { connectedTransportDetailRouteListMission as TransportDetailRouteListMission };