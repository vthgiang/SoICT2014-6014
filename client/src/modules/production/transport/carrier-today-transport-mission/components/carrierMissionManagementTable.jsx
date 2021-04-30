import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox, DialogModal, DatePicker } from "../../../../../common-components";

import { formatDate, formatToTimeZoneDate } from "../../../../../helpers/formatDate"

// import { TransportDialogMissionReport } from "./transport-process-mission/transportDialogMissionReport"

import { transportPlanActions } from "../../transport-plan/redux/actions"
import { transportScheduleActions } from "../../transport-schedule/redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

function CarrierMissionManagementTable(props) {
    let {transportPlanId, transportPlan, transportSchedule} = props;
    const [transportScheduleByCarrierId, setTransportScheduleByCarrierId] = useState()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentVehicleRoute, setCurrentVehicleRoute] = useState();
    // const [currentVehicle, setCurrentVehicle] = useState([])
    // const [driver, setDriver] = useState()

    const handleCarrierDateChange = (value) => {
        setCurrentDate(formatToTimeZoneDate(value));
    }

    useEffect(() => {
        props.getTransportScheduleByCarrierId("608b8a3ead08cb0d4874efbe");
    }, [])

    useEffect(() => {
        if (transportSchedule){
            setTransportScheduleByCarrierId(transportSchedule.transportScheduleByCarrierId)
        }
    }, [transportSchedule])
    useEffect(() => {
        console.clear();
        console.log(transportScheduleByCarrierId)
    }, [transportScheduleByCarrierId])
    // const handleShowReportMission = (routeOrdinal_i) => {
    //     let data = {
    //         planId: transportPlanId,
    //         requirementId: routeOrdinal_i.transportRequirement._id,
    //         status: 1,
    //         description: " "
    //     }
    //     props.changeTransportRequirementProcess(data);
    //     window.$(`#modal-report-process`).modal('show');
    // }

    // useEffect(() => {
    //     if(transportPlanId){
    //         props.getDetailTransportPlan(transportPlanId);
    //     }
    // }, [transportPlanId])
    // useEffect(() => {
    //     if (transportPlan && currentVehicleRoute && transportPlan.currentTransportPlan) {
    //         let vehicle = transportPlan.currentTransportPlan.transportVehicles
    //                     .filter(r=> String(r.vehicle) ===currentVehicleRoute?.transportVehicle?._id)
    //         if (vehicle && vehicle.length!==0){
    //             setCurrentVehicle(vehicle[0]);
    //         }
    //     }
    // }, [transportPlan, currentVehicleRoute])

    // useEffect(() => {
    //     console.log(currentVehicle, " day la xe co nguoi")
    //     if (currentVehicle && currentVehicle.carriers && currentVehicle.carriers.length!==0){
    //         console.log(currentVehicle.carriers)
    //         let dri = currentVehicle.carriers.filter(r => String(r.pos) === "1");
    //         console.log(dri);
    //         if (dri && dri.length !==0 ){
    //             setDriver(dri[0]);
    //         }
    //     }
    // }, [currentVehicle])

    // useEffect(() => {
    //     console.log(currentVehicleRoute, " day la currentVehicleRoute");
    // }, [currentVehicleRoute])
    useEffect(() => {
        let flag = false;
        if (currentDate && transportScheduleByCarrierId && transportScheduleByCarrierId.length!==0){
            transportScheduleByCarrierId.map(item => {
                if (item.transportPlan && item.transportPlan.endTime && item.transportPlan.startTime){
                    if (formatDate(item.transportPlan.endTime)===formatDate(currentDate)
                        && formatDate(item.transportPlan.startTime)===formatDate(currentDate)
                    ){
                        flag = true;
                        setCurrentVehicleRoute(item.route);
                    }
                }
            })
        }
        if (!flag) setCurrentVehicleRoute({})
    }, [currentDate, transportScheduleByCarrierId])
    return (
        <React.Fragment>
            <div className="box-body qlcv">
            {/* <TransportDialogMissionReport /> */}
                <div className="form-inline">
                    <div className="form-group">

                        <DatePicker
                            id={`carrier_day`}
                            value={formatDate(currentDate)}
                            onChange={handleCarrierDateChange}
                            disabled={false}
                        />
                    </div>
                </div>
                <div>
                    {/* <div>Tài xế: {driver?.carrier?.name}</div> */}
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
                        <th>{"TransportStatus"}</th>
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
                                <td>
                                    {routeOrdinal.transportRequirement?.transportStatus?.status}
                                </td>
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
                                    <a className="edit text-blue" style={{ width: '5px' }} 
                                        // title={translate('manage_example.detail_info_example')} 
                                        title={'Báo cáo nhiện vụ vận chuyển'}
                                        // onClick={() => handleShowReportMission(routeOrdinal)}
                                    >
                                        <i className="material-icons">
                                            assignment_turned_in
                                        </i>
                                    </a>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
                
                </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const {transportSchedule, socket} = state
    return { transportSchedule, socket }
}

const actions = {
    // getTransportScheduleByPlanId: transportScheduleActions.getTransportScheduleByPlanId,
    getTransportScheduleByCarrierId: transportScheduleActions.getTransportScheduleByCarrierId
    // changeTransportRequirementProcess: transportScheduleActions.changeTransportRequirementProcess,
    // getDetailTransportPlan: transportPlanActions.getDetailTransportPlan,
}

const connectedCarrierMissionManagementTable = connect(mapState, actions)(withTranslate(CarrierMissionManagementTable));
export { connectedCarrierMissionManagementTable as CarrierMissionManagementTable };