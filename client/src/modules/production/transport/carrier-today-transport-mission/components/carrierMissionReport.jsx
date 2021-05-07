import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting,  PaginateBar, DialogModal, SelectBox } from "../../../../../common-components";
import { transportScheduleActions } from "../../transport-schedule/redux/actions"

function CarrierMissionReport(props) {
    let {currentMission} = props

    const [state, setState] = useState({
        status: "title",
        detail: "",
    })

    const handleStatusChange = (value) => {
        setState({
            ...state,
            status: value[0],
        })
    }
    const handleDetailChange = (e) => {
        let {value} = e.target
        setState({
            ...state,
            detail: value,
        })
    }

    const save = () => {
        let data = {
            status: state.status,
            detail: state.detail,
            requirementId: currentMission?.transportRequirement?._id,
        }
        props.changeTransportStatusByCarrierId(localStorage.getItem("userId"), data)
    }

    useEffect(() => {
        console.log(currentMission);
    }, [currentMission])
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-carrier-report-process`}
                title={"Báo cáo kết quả"}
                formID={`modal-carrier-report-process`}
                size={50}
                maxWidth={500}
                
                hasSaveButton={true}
                func={save}
                // hasNote={false}
            >
                <form id={`modal-carrier-report-process`}>
                <div className={`form-group`}>
                        <label>
                            Trạng thái 
                            <span className="attention"> * </span>
                        </label>
                        {
                            String(currentMission?.type)==="1"
                            &&
                            <SelectBox
                            id={`select-quote-approve-status`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={state.status}
                            items={[
                                { value: "title", text: "---Chọn trạng thái nhiệm vụ---" },
                                { value: 1, text: "Đã lấy hàng" },
                                { value: 2, text: "Không lấy được hàng" },
                            ]}
                            onChange={handleStatusChange}
                            multiple={false}
                            />
                            /* <ErrorLabel content={statusError} /> */
                        }
                                                {
                            String(currentMission?.type)==="2"
                            &&
                            <SelectBox
                            id={`select-quote-approve-status`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={state.status}
                            items={[
                                { value: "title", text: "---Chọn trạng thái nhiệm vụ---" },
                                { value: 3, text: "Đã giao hàng" },
                                { value: 4, text: "Không giao được hàng" },
                            ]}
                            onChange={handleStatusChange}
                            multiple={false}
                            />
                            /* <ErrorLabel content={statusError} /> */
                        }
                        
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label>
                                Ghi chú
                                <span className="attention"> </span>
                            </label>
                            <textarea type="text" className="form-control" 
                                value={state.detail} 
                                onChange={handleDetailChange} 
                            />
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
}

const actions = {   
    changeTransportStatusByCarrierId: transportScheduleActions.changeTransportStatusByCarrierId,
}

const connectedTransportDialogMissionReport = connect(mapState, actions)(withTranslate(CarrierMissionReport));
export { connectedTransportDialogMissionReport as CarrierMissionReport };