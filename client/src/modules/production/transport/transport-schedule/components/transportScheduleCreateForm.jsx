import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { generateCode } from "../../../../../helpers/generateCode";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate"
import ValidationHelper from '../../../../../helpers/validationHelper';

import { transportScheduleActions } from '../redux/actions'

function TransportScheduleCreateForm(props) {

    const [formSchedule, setFormSchedule] = useState({
        code: "",
        startDate: "",
        endDate: "",
    });

    const handleClickCreateCode = () => {
        setFormSchedule({
            ...formSchedule,
            code: generateCode("LVC"),
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
        props.createTransportSchedule(formSchedule);
    }
    return (
        <React.Fragment>
            <ButtonModal
                    onButtonCallBack={handleClickCreateCode}
                    modalID={"modal-create-transport-schedule"}
                    button_name={"Thêm lịch vận chuyển"}
                    title={"Thêm lịch vận chuyển"}
            />
            <DialogModal
                modalID="modal-create-transport-schedule" 
                isLoading={false}
                formID="form-create-transport-requirements"
                title={"Thêm lịch vận chuyển"}
                msg_success={"success"}
                msg_faile={"fail"}
                func={save}
                // disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-create-transport-requirements" 
                // onSubmit={() => save(translate('manage_example.add_success'))}
                >
                    
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                            <div className="form-group">
                                <label>
                                    Mã lịch trình <span className="attention"> </span>
                                </label>
                                <input type="text" className="form-control" disabled={true} 
                                    value={formSchedule.code}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
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
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    // const example = state.example1;
    // return { example }
    
    // const bills = state.bills.listPaginate;
    // const listAllGoods = state.goods.listALLGoods;
    // return { bills }
}

const actions = {
    createTransportSchedule: transportScheduleActions.createTransportSchedule,
}

const connectedTransportScheduleCreateForm = connect(mapState, actions)(withTranslate(TransportScheduleCreateForm));
export { connectedTransportScheduleCreateForm as TransportScheduleCreateForm };