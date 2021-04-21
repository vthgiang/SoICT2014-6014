import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { generateCode } from "../../../../../helpers/generateCode";
import { formatToTimeZoneDate, formatDate } from "../../../../../helpers/formatDate"
import ValidationHelper from '../../../../../helpers/validationHelper';

import { LocationMap } from './map/locationMap'

import { transportPlanActions } from '../redux/actions';
import { transportRequirementsActions } from '../../transport-requirements/redux/actions'

import {} from './transport-plan.css'

function TransportPlanCreateForm(props) {
    let allTransportRequirements;
    let {transportRequirements} = props;
    const [formSchedule, setFormSchedule] = useState({
        code: "",
        startDate: "",
        endDate: "",
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
    const handleClickCreateCode = () => {
        setFormSchedule({
            ...formSchedule,
            code: generateCode("KHVC"),
        })
    }

    const handleStartDateChange = async (value) => {
        await setFormSchedule({
            ...formSchedule,
            startDate: formatToTimeZoneDate(value),
        })
    }

    const handleEndDateChange = async (value) => {
        console.log(value, " end date change");
        await setFormSchedule({
            ...formSchedule,
            endDate: formatToTimeZoneDate(value),
        })
    }
    const save = () => {
        props.createTransportPlan(formSchedule);
    }
    
    /**
     * sắp xếp và trả về thứ tự ưu tiên các yêu cần vận chuyển
     * theo thời gian yêu cầu và thời gian của kế hoạch
     * @param {*} allTransportRequirements 
     */
    const arrangeRequirement = (allTransportRequirements, date) => {
        let result = [];
        let calArr = [];
        if(allTransportRequirements && allTransportRequirements.length !==0){
            allTransportRequirements.map((requirement, index)=> {
                let mark = 0;
                if (requirement.timeRequests && requirement.timeRequests.length !==0){
                    requirement.timeRequests.map(time => {
                        let timeRequest = new Date(time.timeRequest);
                        if(timeRequest.getTime() === date.getTime()){
                            mark = 5*86400000;
                        }
                    })
                }
                const createdAt = new Date(requirement.createdAt);
                mark += date.getTime() - createdAt.getTime();
                calArr.push({
                    requirement: requirement,
                    mark: mark,
                })
            })
            calArr.sort((a, b)=> {
                return b.mark-a.mark;
              });
            for (let i=0;i<calArr.length;i++){
                result.push(calArr[i].requirement);
            }
        }
        return result;
    }

    const handleSelectRequirement = (requirement) => {
        let arr = [...listSelectedRequirements];
        let pos = arr.indexOf(requirement._id)
        if (pos>=0){
            arr = arr.slice(0,pos).concat(arr.slice(pos+1));
        }
        else{
            arr.push(requirement._id);
        }
        console.log(arr);
        setListSelectedRequirements(arr);
    }

    const getStatusTickBox = (requirement) => {
        if (listSelectedRequirements && listSelectedRequirements.length!==0){
            if (listSelectedRequirements.indexOf(requirement._id)>=0){
                return "iconactive";
            }
            else{
                return "iconunactive";
            }
        }
        else{
            return "iconunactive"
        }
    }

    useEffect(() => {
        props.getAllTransportRequirements({page:1, limit: 100})
    }, [])

    useEffect(() => {
        if (transportRequirements){
            let {lists} = transportRequirements;
            if (lists && lists.length!==0){
                if (formSchedule.startDate && formSchedule.endDate){
                    const startDate = new Date(formSchedule.startDate);
                    const endDate = new Date(formSchedule.endDate);
                    if(startDate.getTime() <= endDate.getTime()){
                        setListRequirements(arrangeRequirement(lists, startDate))
                    }
                }
            }

        }
    }, [formSchedule.startDate, formSchedule.endDate])

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
                    console.log(item, "otem");
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
        console.log(locationArr, " ar")
        setListSelectedRequirementsLocation(locationArr);

    }, [listSelectedRequirements])

    return (
        <React.Fragment>
            <ButtonModal
                    onButtonCallBack={handleClickCreateCode}
                    modalID={"modal-create-transport-plan"}
                    button_name={"Thêm kế hoạch vận chuyển"}
                    title={"Thêm kế hoạch vận chuyển"}
            />
            <DialogModal
                modalID="modal-create-transport-plan" 
                isLoading={false}
                formID="form-create-transport-requirements"
                title={"Thêm lịch vận chuyển"}
                msg_success={"success"}
                msg_faile={"fail"}
                func={save}
                // disableSubmit={!isFormValidated()}
                size={100}
                maxWidth={500}
            >
                <form id="form-create-transport-requirements" 
                // onSubmit={() => save(translate('manage_example.add_success'))}
                >
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                        <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>
                                            Mã lịch trình <span className="attention"> </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={true} 
                                            value={formSchedule.code}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>
                                            Người phụ trách
                                            <span className="attention"> * </span>
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
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group">
                                        <label>
                                            Ngày bắt đầu <span className="attention"> * </span>
                                        </label>
                                        <DatePicker
                                            id={`start_date`}
                                            value={formSchedule.startDate}
                                            onChange={handleStartDateChange}
                                            disabled={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>
                                            Ngày kết thúc
                                            <span className="attention"> * </span>
                                        </label>
                                        <DatePicker
                                            id={`end_date`}
                                            value={formSchedule.endDate}
                                            onChange={handleEndDateChange}
                                            disabled={false}
                                        />
                                    </div>
                                </div>

                            </div>  
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                            {
                                (listRequirements && listRequirements.length!==0)
                                &&
                                <LocationMap 
                                    locations = {listSelectedRequirementsLocation}
                                />
                            }
                        </div>
                    </div>
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
                            {(listRequirements && listRequirements.length !== 0) &&
                                listRequirements.map((x, index) => (
                                    x &&
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{x.code}</td>
                                        <td>{x.type}</td>
                                        <td>{x.fromAddress}</td>
                                        <td>{x.toAddress}</td>
                                        <td>{x.createdAt ? formatDate(x.createdAt) : ""}</td>
                                        <td>
                                            {
                                                (x.timeRequests && x.timeRequests.length!==0)
                                                && x.timeRequests.map((timeRequest, index2)=>(
                                                    <div key={index+" "+index2}>
                                                        {index+1+"/ "+formatDate(timeRequest.timeRequest)}
                                                    </div>
                                                ))
                                            }
                                        </td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }} className="tooltip-checkbox">
                                            <span className={"icon "
                                            +getStatusTickBox(x)
                                        }
                                            title={"alo"} 
                                            onClick={() => handleSelectRequirement(x)}
                                            >

                                            </span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    console.log(state, " ssss")
    const {transportRequirements} = state;
    return {transportRequirements}
}

const actions = {
    getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
    createTransportPlan: transportPlanActions.createTransportPlan,
}

const connectedTransportPlanCreateForm = connect(mapState, actions)(withTranslate(TransportPlanCreateForm));
export { connectedTransportPlanCreateForm as TransportPlanCreateForm };