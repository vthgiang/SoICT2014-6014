import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

import { SortableComponent } from "./testDragDrop/sortableComponent"
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { ArrangeOrdinalTransportOneVehicle } from './testDragDrop/arrangeOrdinalTransportOneVehicle'

import { transportPlanActions } from "../../transport-plan/redux/actions";
import { transportScheduleActions } from "../redux/actions";

import { convertDistanceToKm, convertTimeToMinutes } from "../../transportHelper/convertDistanceAndDuration"

import { MapContainer } from "./googleReactMap/maphook"

import './arrangeOrdinalTransport.css'

function ArrangeOrdinalTransport(props) {

    let { allTransportPlans, currentTransportSchedule} = props;

    const [currentTransportPlan, setCurrentTransportPlan] = useState({
        _id: "0",
        code: "",
    });

    // State chứa array [transportVehicle: id, transportRequirements: arr]
    const [transportVehicles, setTransportVehicles] = useState([])

    // State chứa trạng thái thứ tự địa điểm vận chuyển của các phương tiện
    // [transportVehicle: id, addressOrdinal: []]
    const [transportOrdinalAddress, setTransportOrdinalAddress] = useState([]);

    /**
     * Định vị các điểm trên bản đồ
     * [
     *  transportVehicle: id;
     *  location: 
     * ]
     */
    const [locationsOnMap, setLocationsOnMap] = useState([]);
    
    const getListTransportPlans = () => {
        let listTransportPlans = [
            {
                value: "0",
                text: "Kế hoạch",
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
    const getScheduleRouteOrdinal = (transportVehicles) => {
        let routeOrdinal = []
        if (transportVehicles){
            if (transportVehicles.transportVehicle){
                let vehicleId = transportVehicles.transportVehicle._id;
                if (currentTransportSchedule){
                    if(currentTransportSchedule.route && currentTransportSchedule.route.length!==0){
                        let route = currentTransportSchedule.route.filter(route => {
                            if (route.transportVehicle?._id){
                                return route.transportVehicle._id === vehicleId;
                            }
                            else {
                                return route.transportVehicle === vehicleId;
                            }
                        })
                        if (route && route.length!==0){
                            routeOrdinal = route[0].routeOrdinal;
                        }
                    }
                }
            }
        }
        return routeOrdinal;
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
    /**
     * Submit state và lưu vào transportSchedule qua plan id, lưu lại lộ trình các xe
     */
    const handleSubmitRoute = () => {
        if (transportOrdinalAddress && transportOrdinalAddress.length !==0){
            let data = [];
            transportOrdinalAddress.map((item, index) => {
                let routeOrdinal = [];
                if (item.addressOrdinal && item.addressOrdinal.length !==0){
                    item.addressOrdinal.map((item2, index2) => {
                        routeOrdinal.push({
                            transportRequirement: item2.transportRequirementId,
                            type: item2.addressType,
                            distance: convertDistanceToKm(item2.distance),
                            duration: convertTimeToMinutes(item2.duration),
                        })
                    })
                }
                data.push({
                    transportVehicle: item.transportVehicle,
                    routeOrdinal: routeOrdinal,
                })
            })
            props.editTransportScheduleByPlanId(currentTransportPlan._id, {route: data})
            setTransportOrdinalAddress([]);
        }
    }
    useEffect(() => {
        props.getAllTransportPlans({page: 1, limit: 100});
    }, []);

    useEffect(() => {
        if (currentTransportPlan && currentTransportPlan._id !=="0"){
            props.getTransportScheduleByPlanId(currentTransportPlan._id);
        }
    }, [currentTransportPlan])

    useEffect(() => {
        console.log(currentTransportSchedule, " currentTransportSchedule")
        // Lưu dữ liệu xe và hàng trên xe
        if (currentTransportSchedule){
            if (currentTransportSchedule.transportVehicles && currentTransportSchedule.transportVehicles.length !== 0){
                setTransportVehicles(currentTransportSchedule.transportVehicles);
            }
        }
    }, [currentTransportSchedule])


    /**
     * cập nhật lại trạng thái sau khi sắp xếp
     * @param {*} addressOrdinalList 
     * @param {*} vehicleId 
     */
    const callBackStateOrdinalAddress = (addressOrdinalList, vehicleId) => {
        const transportOrdinal = [...transportOrdinalAddress];
        if (transportOrdinal && transportOrdinal.length !==0 ){
            let index = -1;
            for (let i = 0; i< transportOrdinal.length; i++){
                if (String(transportOrdinal[i].transportVehicle) === String(vehicleId)){
                    index = i;
                }
            }
            if (index>-1){
                transportOrdinal[index].addressOrdinal = addressOrdinalList;
            }
            else {
                transportOrdinal.push({
                    transportVehicle: vehicleId,
                    addressOrdinal: addressOrdinalList,
                })
            }
        }
        else {
            transportOrdinal.push({
                transportVehicle: vehicleId,
                addressOrdinal: addressOrdinalList,
            })            
        }
        
        setTransportOrdinalAddress(transportOrdinal);
    }

    useEffect(() => {
        console.log(transportOrdinalAddress, " transportOrdinalAddress")
    }, [transportOrdinalAddress])

    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">Chọn kế hoạch</label>
                        <SelectBox
                            id={`select-filter-plan-2`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={currentTransportPlan._id}
                            items={getListTransportPlans()}
                            onChange={handleTransportPlanChange}
                        />
                    </div>
                    {
                        (currentTransportPlan && currentTransportPlan._id!=="0") 
                        &&
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title="Lưu" 
                                onClick={handleSubmitRoute}
                            >
                                Lưu
                            </button>
                        </div>
                    }
                </div>
            {
                (currentTransportPlan && currentTransportPlan._id!=="0") 
                &&
                <div>                       
                    {
                        (transportVehicles && transportVehicles.length !==0 )
                        && transportVehicles.map((item, index) => (
                            item.transportRequirements && item.transportRequirements.length !==0 &&					
                            <ArrangeOrdinalTransportOneVehicle
                                item={item}
                                routeOrdinal={getScheduleRouteOrdinal(item)}
                                callBackStateOrdinalAddress={callBackStateOrdinalAddress}
                            />
                        ))
                    }
                </div>
            }
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const allTransportPlans = state.transportPlan.lists;
    const { currentTransportSchedule } = state.transportSchedule;
    return { allTransportPlans, currentTransportSchedule };
}

const actions = {
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
    getTransportScheduleByPlanId: transportScheduleActions.getTransportScheduleByPlanId,
    editTransportScheduleByPlanId: transportScheduleActions.editTransportScheduleByPlanId,
}

const connectedArrangeOrdinalTransport = connect(mapState, actions)(withTranslate(ArrangeOrdinalTransport));
export { connectedArrangeOrdinalTransport as ArrangeOrdinalTransport };