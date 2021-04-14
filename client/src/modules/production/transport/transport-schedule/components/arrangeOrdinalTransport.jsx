import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

import { SortableComponent } from "./testDragDrop/sortableComponent"
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

import { transportPlanActions } from "../../transport-plan/redux/actions";
import { transportScheduleActions } from "../redux/actions";


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

    useEffect(() => {
        props.getAllTransportPlans({page: 1, limit: 100});
    }, []);

    useEffect(() => {
        if (currentTransportPlan && currentTransportPlan._id !==0){
            props.getTransportScheduleByPlanId(currentTransportPlan._id);
        }
    }, [currentTransportPlan])

    useEffect(() => {
        console.log(currentTransportSchedule, " currentTransportSchedule")
        // Lưu dữ liệu xe và hàng trên xe
        if (currentTransportSchedule){
            if (currentTransportSchedule.transportVehicles && currentTransportSchedule.transportVehicles.length !== 0){
                // setTransportVehicles(currentTransportSchedule.transportVehicles);

                // Lọc theo id trường vehicles theo trường plan (do dữ liệu chi tiết requirement và vehicle đã có ở trường transportPlan)
                let transportVehiclesDetail = [];
                currentTransportSchedule.transportVehicles.map((item, index) => {
                    let transportRequirementsList = [];
                    if (item.transportRequirements && item.transportRequirements.length !== 0 ){
                        item.transportRequirements.map((requirement, index2) => {
                            transportRequirementsList.push(
                                currentTransportSchedule
                                .transportPlan
                                .transportRequirements.filter(r=>String(r._id) === String(requirement))[0],
                            )
                        })
                    }
                    transportVehiclesDetail.push({
                        transportVehicle: 
                            currentTransportSchedule
                                .transportPlan.transportVehicles.filter(r=>String(r.transportVehicle._id) === String(item.transportVehicle))[0],
                        transportRequirements: transportRequirementsList,
                        
                    })
                })
                setTransportVehicles(transportVehiclesDetail);
            }
        }
    }, [currentTransportSchedule])

    // useEffect(() => {
    //     console.log(transportVehicles, " vhielss")
    // }, [transportVehicles])


    /**
     * cập nhật lại trạng thái sau khi sắp xếp
     * @param {*} addressOrdinalList 
     * @param {*} vehicleId 
     */
    const callBackStateOrdinalAddress = (addressOrdinalList, vehicleId) => {
        console.log(vehicleId, " vehicleId")
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
                        <label className="form-control-static">Chọn lịch trình</label>
                        <SelectBox
                            id={`select-filter-plan-2`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={currentTransportPlan._id}
                            items={getListTransportPlans()}
                            onChange={handleTransportPlanChange}
                        />
                    </div>
                </div>

                <div>                       
                    {
                        (transportVehicles && transportVehicles.length !==0 )
                        && transportVehicles.map((item, index) => (					
                            <fieldset className="scheduler-border" style={{ height: "100%" }}>

                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <legend className="scheduler-border">{item.transportVehicle.transportVehicle.name}</legend>
                                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <strong>{"Trọng tải: "+item.transportVehicle.transportVehicle.payload}</strong>
                                        </div>
                                    </div>                                    
                                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <strong>{"Thể tích thùng chứa: "+item.transportVehicle.transportVehicle.volume}</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <SortableComponent
                                        transportRequirements = {item.transportRequirements}
                                        transportVehicle = {item.transportVehicle.transportVehicle}
                                        callBackStateOrdinalAddress = {callBackStateOrdinalAddress}
                                    />
                                </div>
                            </fieldset>
                        ))
                    }
                </div>
                
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
}

const connectedArrangeOrdinalTransport = connect(mapState, actions)(withTranslate(ArrangeOrdinalTransport));
export { connectedArrangeOrdinalTransport as ArrangeOrdinalTransport };