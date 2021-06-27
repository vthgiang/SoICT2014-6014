import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { forceCheckOrVisible, LazyLoadComponent, DialogModal } from '../../../../../common-components';

import { formatDate } from "../../../../../helpers/formatDate"

import { transportPlanActions } from "../../transport-plan/redux/actions";
import { transportScheduleActions } from "../redux/actions";
import { ArrangeVehiclesAndGoods } from './arrangeVehiclesAndGoods2';
import { ArrangeOrdinalTransport } from './arrangeOrdinalTransport2';

import { convertDistanceToKm, convertTimeToMinutes } from "../../transportHelper/convertDistanceAndDuration"

function ArrangeDialog(props) {
    let {transportPlan, currentPlanId, transportSchedule} = props

    const [currentTransportSchedule, setCurrentTransportSchedule] = useState()

    const [stateSchedule, setStateSchedule] = useState({
        tab: 1,
        data1: {},
        data2: {},
    });

    const callBackReload = () => {
        props.getTransportScheduleByPlanId(currentPlanId);
    }

    const callBackRequirementToVehicle = (data) => {
        setStateSchedule({
            ...stateSchedule,
            data1: data,
        })
    }

    const callBackRouteArrange = (data) => {
        setStateSchedule({
            ...stateSchedule,
            data2: data,
        })
    }

    useEffect(() => {
        props.getAllTransportPlans({page: 1, limit: 100});
    }, []);

    useEffect(() => {
        if (currentPlanId){
            props.getTransportScheduleByPlanId(currentPlanId);
        }
    }, [currentPlanId])

    useEffect(() => {
        if (transportSchedule && transportSchedule.currentTransportSchedule){
            setCurrentTransportSchedule(transportSchedule.currentTransportSchedule);
        }
    }, [transportSchedule])

    const save = () => {
        if (Number(stateSchedule.tab) === 1){
            props.editTransportScheduleByPlanId(currentTransportSchedule?.transportPlan?._id, stateSchedule?.data1);
        };
        if (Number(stateSchedule.tab) === 2){
            props.editTransportScheduleByPlanId(currentTransportSchedule?.transportPlan?._id, stateSchedule?.data2);
        };
    }

    const changeState = () => {
        if (Number(stateSchedule.tab) === 1){
            setStateSchedule({
                ...stateSchedule,
                tab: 2,
            })
        }
        else{
            setStateSchedule({
                ...stateSchedule,
                tab: 1,
            })
        }
    }

    const isFormValidated = () => {
        if (Number(stateSchedule.tab) === 1){
            if (stateSchedule.data1){
                return true;
            }
        }
        else{
            if (stateSchedule.data2){
                return true;
            }
        }
        return false; 
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-arrange-good-vehicle-ordinal-transport" 
                isLoading={false}
                formID="form-arrange-good-vehicle-ordinal-transport"
                title={"Thêm lịch vận chuyển"}
                msg_success={"success"}
                msg_faile={"fail"}
                hasSaveButton={true}
                func={save}
                disableSubmit={!isFormValidated()}
                size={100}
                maxWidth={500}
                closeOnSave={false}
            >
            <form id="form-arrange-good-vehicle-ordinal-transport" >
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#arrange-vehicles-and-goods" data-toggle="tab" onClick={() => {forceCheckOrVisible(true, false); changeState();} }>{"Sắp xếp xe và hàng hóa"}</a></li>
                    <li><a href="#arrange-ordinal-transport" data-toggle="tab" onClick={() => {forceCheckOrVisible(true, false); changeState();} }>{"Thứ tự vận chuyển"}</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="arrange-vehicles-and-goods">
                        {/* <LazyLoadComponent
                        > */}
                            <ArrangeVehiclesAndGoods
                                currentTransportSchedule={currentTransportSchedule}
                                callBackReload={callBackReload}
                                callBackStateData={callBackRequirementToVehicle}
                            />
                        {/* </LazyLoadComponent> */}
                    </div>
                    <div className="tab-pane" id="arrange-ordinal-transport">
                        {/* <LazyLoadComponent
                        > */}
                            <ArrangeOrdinalTransport
                                currentTransportSchedule={currentTransportSchedule}
                                callBackStateData={callBackRouteArrange}
                            />
                        {/* </LazyLoadComponent> */}
                    </div>
                </div>
            </div>
            </form>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const {transportPlan, transportSchedule} = state;
    return { transportPlan, transportSchedule };
}

const actions = {
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
    getTransportScheduleByPlanId: transportScheduleActions.getTransportScheduleByPlanId,
    editTransportScheduleByPlanId: transportScheduleActions.editTransportScheduleByPlanId,
}

const connectedArrangeDialog = connect(mapState, actions)(withTranslate(ArrangeDialog));
export { connectedArrangeDialog as ArrangeDialog };