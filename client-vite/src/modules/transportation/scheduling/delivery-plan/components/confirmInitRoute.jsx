import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from "../../../../../common-components";
import { DatePicker } from "../../../../../common-components";
function ConfirmInitRoute (props) {

    const [state, setState] = useState({
        estimatedDeliveryDate: "",
    });
    const { estimatedDeliveryDate } = state;

    const { handleInitDeliveryPlan, handleChangeEstimatedDeliveryDate } = props;

    useEffect(() => {
    }, []);

    const handleChangeDeliveryDate = (value) => {
        setState({
            ...state,
            estimatedDeliveryDate: value
        })
        handleChangeEstimatedDeliveryDate(value);
    }

    const isFormValidated = () => {
        if (estimatedDeliveryDate) return true;
        return false;
    }

    const save = () => {
        handleInitDeliveryPlan();
    }
    return (
        <>
            <DialogModal
                modalID="modal-confirm-create-route"
                formID="form-confirm-create-route"
                isLoading={false}
                title="Tạo lịch vận tải"
                func={save}
                size={35}
                disableSubmit={!isFormValidated()}
            >
                <div className="box-body">
                    <div className="form-group">
                        <label htmlFor="intended-date">Lập lịch cho ngày <span className="text-red">*</span></label>
                        <DatePicker
                            id="delivery-date-picker"
                            dateFormat="day-month-year"
                            value={estimatedDeliveryDate}
                            onChange={handleChangeDeliveryDate}
                        />
                        {
                            estimatedDeliveryDate && <p style={{marginTop: "10px"}}>Lưu để bắt đầu lập lịch vận tải, quá trình khởi tạo có thể mất vài phút</p>
                        }
                    </div>
                </div>
            </DialogModal>
        </>
    );
}

export default connect(null, null)(withTranslate(ConfirmInitRoute))