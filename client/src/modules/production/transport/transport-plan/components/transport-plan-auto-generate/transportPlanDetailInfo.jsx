import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox, LazyLoadComponent, forceCheckOrVisible } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { formatToTimeZoneDate, formatDate } from "../../../../../../helpers/formatDate"
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { LocationMap } from '../map/locationMap'
// import { TransportVehicleAndCarrierSelect } from "./transport-plan-detail/transportVehicleAndCarrierSelect"

import { transportPlanActions } from '../../redux/actions';
import { transportRequirementsActions } from '../../../transport-requirements/redux/actions'
import { getTypeRequirement } from '../../../transportHelper/getTextFromValue'

function TransportPlanDetailInfo(props) {
    let {currentTransportPlan} = props;
    const [formSchedule, setFormSchedule] = useState({
        code: "",
        startDate: "",
        endDate: "",
        name: "",
    });

    /**
     * Danh sách tất cả transportrequirements theo thứ tự ưu tiên
     * [transportRequirement, ...]
     */
    const [listRequirements, setListRequirements] = useState([])
    const [listSelectedRequirementsLocation, setListSelectedRequirementsLocation] = useState([])

    /**
     * Danh sách transportrequirements đã lựa chọn
     * [id, id...]
     */
    const [listSelectedRequirements, setListSelectedRequirements] = useState([])

    useEffect(() => {
        if (currentTransportPlan){
            console.log(currentTransportPlan)
            setFormSchedule({
                startDate: currentTransportPlan.startTime,
                endDate: currentTransportPlan.endTime,
                // code: currentTransportPlan.code,
                // name: currentTransportPlan.name,
            });

            setListRequirements(currentTransportPlan.transportRequirements)
        }
    }, [currentTransportPlan])

    useEffect(() => {
        setFormSchedule({
            ...formSchedule,
            transportRequirements: listSelectedRequirements,
        })

        let locationArr= []
        console.log(listRequirements, " ooooooooooooo")
        if (listRequirements && listRequirements.length!==0){
            listRequirements.map((item, index) => {
                locationArr.push(
                    {
                        name: String(index+1),
                        location: {
                            lat: item.geocode?.fromAddress?.lat,
                            lng: item.geocode?.fromAddress?.lng,
                        }
                    },
                    {
                        name: String(index+1),
                        location: {
                            lat: item.geocode?.toAddress?.lat,
                            lng: item.geocode?.toAddress?.lng,
                        }
                    }
                )
            })
        }
        setListSelectedRequirementsLocation(locationArr);
    }, [listRequirements])

    useEffect(() => {
        console.log(listSelectedRequirementsLocation, " aaaaaaaaaaaaaaaaaa")
    }, [listSelectedRequirementsLocation])

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-detail-info-transport-plan-generate" 
                isLoading={false}
                formID="modal-detail-info-transport-plan-generate"
                title={"Chỉnh sửa kế hoạch vận chuyển"}
                size={100}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
            <form id="modal-detail-info-transport-plan-generate" >
                <div className="box-body">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                            {
                                (listRequirements && listRequirements.length!==0)
                                &&
                                <LocationMap 
                                    locations = {listSelectedRequirementsLocation}
                                    loadingElement={<div style={{height: `100%`}}/>}
                                    containerElement={<div style={{height: "40vh"}}/>}
                                    mapElement={<div style={{height: `100%`}}/>}
                                />
                            }
                        </div>
                    </div>
                {
                    listRequirements && listRequirements.length!==0
                    &&
                    <table id={"1"} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                                <th>{"Mã yêu cầu"}</th>
                                <th>{"Loại yêu cầu"}</th>
                                <th>{"Địa chỉ nhận hàng"}</th>
                                <th>{"Địa chỉ giao hàng"}</th>
                                <th>{"Ngày tạo"}</th>
                                <th>{"Ngày mong muốn vận chuyển"}</th>
                                {/* <th>{"Trạng thái"}</th> */}
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
                            {(listRequirements && listRequirements.length !== 0) &&
                                listRequirements.map((x, index) => (
                                    x &&
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{x.code}</td>
                                        <td>{getTypeRequirement(x.type)}</td>
                                        <td>{x.fromAddress}</td>
                                        <td>{x.toAddress}</td>
                                        <td>{x.createdAt ? formatDate(x.createdAt) : ""}</td>
                                        <td>
                                            {
                                                (x.timeRequests && x.timeRequests.length!==0)
                                                && x.timeRequests.map((timeRequest, index2)=>(
                                                    <div key={index+" "+index2}>
                                                        {index2+1+"/ "+formatDate(timeRequest.timeRequest)}
                                                    </div>
                                                ))
                                            }
                                        </td>
                                        {/* <td>{x.status}</td> */}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
                </div>
            
                {/* <TransportVehicleAndCarrierSelect
                    currentTransportPlan={currentTransportPlan}
                /> */}
            </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const {transportRequirements} = state;
    return {transportRequirements}
}

const actions = {
    // getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
    // createTransportPlan: transportPlanActions.createTransportPlan,
    // editTransportPlan: transportPlanActions.editTransportPlan,
}

const connectedTransportPlanDetailInfo = connect(mapState, actions)(withTranslate(TransportPlanDetailInfo));
export { connectedTransportPlanDetailInfo as TransportPlanDetailInfo };