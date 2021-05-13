import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox, LazyLoadComponent, forceCheckOrVisible } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { generateCode } from "../../../../../../helpers/generateCode";
import { formatToTimeZoneDate, formatDate } from "../../../../../../helpers/formatDate"
import ValidationHelper from '../../../../../../helpers/validationHelper';

// import { LocationMap } from './map/locationMap'

import { transportPlanActions } from '../redux/actions';
import { transportRequirementsActions } from '../../transport-requirements/redux/actions'


function TransportPlanGenerate(props) {
    // let allTransportRequirements;
    let {transportRequirements} = props;
    const [formSchedule, setFormSchedule] = useState({
        code: "",
        startDate: "",
        endDate: "",
        name: "Kế hoạch vận chuyển",
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
    const handleClickCreateCode = () => {
        setFormSchedule({
            code: generateCode("KHVC"),
        })
    }

    const handlePlanNameChange = (e) => {
        setFormSchedule({
            ...formSchedule,
            name: e.target.value,
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
        // props.createTransportPlan(formSchedule);
    }

    // useEffect(() => {
    //     props.getAllTransportRequirements({page:1, limit: 100, status: 2})
    // }, [])

    // useEffect(() => {
    //     console.log(formSchedule, " day la form schedule");
    // }, [formSchedule])
    useEffect(() => {
        props.getAllTransportRequirements({page: 1, limit: 100, status: "2"})
    }, [formSchedule.startDate, formSchedule.endDate])


    return (
        <React.Fragment>
            <ButtonModal
                    onButtonCallBack={handleClickCreateCode}
                    modalID={"modal-generate-transport-plan"}
                    button_name={"Thêm kế hoạch vận chuyển"}
                    title={"Thêm kế hoạch vận chuyển"}
            />
            <DialogModal
                modalID="modal-generate-transport-plan" 
                isLoading={false}
                formID="form-generate-transport-requirements"
                title={"Thêm lịch vận chuyển"}
                msg_success={"success"}
                msg_faile={"fail"}
                func={save}
                // disableSubmit={!isFormValidated()}
                size={100}
                maxWidth={500}
            >
            <form id="form-generate-transport-requirements" >
            
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
                                                <input type="text" className="form-control" disabled={false} 
                                                    value={formSchedule.name}
                                                    onChange={handlePlanNameChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
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

                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <div className="form-group">
                                                <label>
                                                    Ngày bắt đầu <span className="attention"> * </span>
                                                </label>
                                                <DatePicker
                                                    id={`start_date12`}
                                                    value={formatDate(formSchedule.startDate)}
                                                    onChange={handleStartDateChange}
                                                    disabled={false}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <div className={`form-group`}>
                                                <label>
                                                    Ngày kết thúc
                                                    <span className="attention"> * </span>
                                                </label>
                                                <DatePicker
                                                    id={`end_date12`}
                                                    value={formatDate(formSchedule.endDate)}
                                                    onChange={handleEndDateChange}
                                                    disabled={false}
                                                />
                                            </div>
                                        </div>

                                </div>
                            </div>
                        </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const {transportRequirements} = state;
    console.log(transportRequirements?.lists);
    return {transportRequirements}
}

const actions = {
    getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
    createTransportPlan: transportPlanActions.createTransportPlan,
}

const connectedTransportPlanGenerate = connect(mapState, actions)(withTranslate(TransportPlanGenerate));
export { connectedTransportPlanGenerate as TransportPlanGenerate };