import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox, LazyLoadComponent, forceCheckOrVisible } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { formatToTimeZoneDate, formatDate } from "../../../../../../helpers/formatDate"
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { LocationMap } from '../map/locationMap'
import { TransportVehicleAndCarrierSelect } from "../transport-plan-detail/transportVehicleAndCarrierSelect"

import { transportPlanActions } from '../../redux/actions';
import { transportRequirementsActions } from '../../../transport-requirements/redux/actions'
import { getTypeRequirement } from '../../../transportHelper/getTextFromValue'

function TransportPlanDetailInfo(props) {
    let allTransportRequirements;
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

    /**
     * Danh sách transportrequirements đã lựa chọn
     * [id, id...]
     */
    const [listSelectedRequirements, setListSelectedRequirements] = useState([])
    /**
     * Danh sách vị trí tọa độ tương ứng với transportrequirements
     */
    const [listSelectedRequirementsLocation, setListSelectedRequirementsLocation] = useState([])

    const [listChosenVehicleCarrier, setListChosenVehicleCarrier] = useState()

    useEffect(() => {
        if (currentTransportPlan){
            console.log(currentTransportPlan)
            setFormSchedule({
                startDate: currentTransportPlan.startTime,
                endDate: currentTransportPlan.endTime,
                code: currentTransportPlan.code,
                name: currentTransportPlan.name,
            });

            let idArr = []
            if (currentTransportPlan.transportRequirements && currentTransportPlan.transportRequirements.length!==0){
                currentTransportPlan.transportRequirements.map(item => {
                    idArr.push(item._id);
                })
            }
            setListSelectedRequirements(idArr);
            setListRequirements(currentTransportPlan.transportRequirements)

            // khởi tạo giá trị cho chọn người lên xe => chosenVehicleCarrier => listChosenVehicle, listVehicleAndCarrier
            let chosenVehicleCarrier = [];
            if (currentTransportPlan.transportVehicles && currentTransportPlan.transportVehicles.length!==0){
                currentTransportPlan.transportVehicles.map(transportVehicles => {
                    let carriers = [];
                    if (transportVehicles.carriers && transportVehicles.carriers.length !==0){
                        transportVehicles.carriers.map(carrier => {
                            if (carrier.pos && String(carrier.pos) ==="1"){
                                carriers.push({
                                    carrier: carrier.carrier._id?carrier.carrier._id:carrier.carrier,
                                    pos: 1,
                                })
                            }
                            else {
                                carriers.push({
                                    carrier: carrier.carrier._id?carrier.carrier._id:carrier.carrier,
                                })
                            }
                        })
                    }
                    if (transportVehicles.vehicle){
                        chosenVehicleCarrier.push({
                            vehicle: transportVehicles.vehicle._id,
                            carriers: carriers,
                        })
                    }
                })
            }
            setListChosenVehicleCarrier(chosenVehicleCarrier)      
        }
    }, [currentTransportPlan])

    useEffect(() => {
        setFormSchedule({
            ...formSchedule,
            transportRequirements: listSelectedRequirements,
        })

        let locationArr= []
        if (listRequirements && listRequirements.length!==0
            &&listSelectedRequirements && listSelectedRequirements.length !==0){
            listRequirements.map((item, index) => {
                if (listSelectedRequirements.indexOf(item._id) >=0){
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
                }
            })
        }
        setListSelectedRequirementsLocation(locationArr);
    }, [listSelectedRequirements, listRequirements])

    const callBackVehicleAndCarrier = (transportVehicles) => {
        setFormSchedule({
            ...formSchedule,
            transportVehicles: transportVehicles,
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-detail-info-transport-plan2" 
                isLoading={false}
                // formID="modal-detail-info-transport-plan2"
                title={"Chi tiết kế hoạch vận chuyển"}
                size={100}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
            {/* <form id="modal-detail-info-transport-plan2" > */}
                <div className="box-body">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">

                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>
                                            Mã kế hoạch <span className="attention"> </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={true} 
                                            value={formSchedule.code}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>
                                            Tên kế hoạch <span className="attention"> </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={true} 
                                            value={formSchedule.name}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className={`form-group`}>
                                        <label>
                                            Người phụ trách
                                            {/* <span className="attention"> * </span> */}
                                        </label>
                                        <input type="text" className="form-control" disabled={false} 
                                        />
                                        {/* <SelectBox
                                            id={`select-type-requirement`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={"5"}
                                            // items={requirements}
                                            // onChange={handleTypeRequirementChange}
                                            multiple={false}
                                        /> */}
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>
                                            Ngày bắt đầu 
                                            {/* <span className="attention"> * </span> */}
                                        </label>
                                        <DatePicker
                                            id={`start_date_edit`}
                                            value={formatDate(formSchedule.startDate)}
                                            // onChange={handleStartDateChange}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className={`form-group`}>
                                        <label>
                                            Ngày kết thúc
                                            {/* <span className="attention"> * </span> */}
                                        </label>
                                        <DatePicker
                                            id={`end_date_edit`}
                                            value={formatDate(formSchedule.endDate)}
                                            // onChange={handleEndDateChange}
                                            disabled={true}
                                        />
                                    </div>
                                </div>

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
                                <th>{"Trạng thái"}</th>
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
                                        <td>{x.status}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
                </div>
            
                <TransportVehicleAndCarrierSelect
                    currentTransportPlan={currentTransportPlan}
                />
            {/* </form> */}
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const {transportRequirements} = state;
    return {transportRequirements}
}

const actions = {
    getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
    createTransportPlan: transportPlanActions.createTransportPlan,
    editTransportPlan: transportPlanActions.editTransportPlan,
}

const connectedTransportPlanDetailInfo = connect(mapState, actions)(withTranslate(TransportPlanDetailInfo));
export { connectedTransportPlanDetailInfo as TransportPlanDetailInfo };