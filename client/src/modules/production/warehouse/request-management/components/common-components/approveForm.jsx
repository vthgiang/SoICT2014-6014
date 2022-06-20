import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, SelectBox, ErrorLabel } from "../../../../../../common-components";
import StockInformationModal from "./stockInformationModal"
import { RequestActions } from '../../../../common-production/request-management/redux/actions';

function ApproveForm(props) {

    const [state, setState] = useState({
        status: "",
    })

    useEffect(() => {
        if (props.requestId !== state.requestId) {
            setState({
                ...state,
                requestApprove: props.requestApprove,
            });
        }
    }, [props.requestId]);

    const handleStatusChange = (value) => {
        validateStatus(value[0], true);
    };

    const validateStatus = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value === "") {
            msg = "Giá trị không được để trống";
        }
        if (willUpdateState) {
            setState({
                ...state,
                status: value,
                statusError: msg,
            });
        }
        return msg === undefined;
    };

    const handleNoteChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            note: value,
        });
    };

    const handleShowStockInformationModal = () => {
        window.$("#stock-information-modal").modal("show");
    };

    const handleShowGoodTakesBillModal = () => {
        window.$("#good-takes-bill-modal").modal("show");
    }

    const isFormValidated = () => {
        const { status } = state;
        return validateStatus(status, false);
    };

    const save = async () => {
        const { status, note } = state;
        let data = {};
        const userId = localStorage.getItem("userId");
        if (status === "2") {
            data = {
                approvedUser: userId,
                approveType: 4,
                note: note,
            }
        } else if (status === "3") {
            let refuser = {};
            refuser.refuser = userId;
            refuser.refuserTime = new Date(Date.now());
            refuser.note = note;
            data = {
                refuser: refuser,
                status: 5,
            }
        }
        props.editRequest(requestApprove._id, data);
    };


    const { status, note, statusError, requestApprove, requestId } = state;
    return (
        <DialogModal
            modalID="modal-approve-form"
            isLoading={false}
            formID="form--approve-purchase-order"
            title={`Phê duyệt yêu cầu`}
            size="50"
            hasSaveButton={true}
            hasNote={false}
            disableSubmit={!isFormValidated()}
            func={save}
        >
            <StockInformationModal
                requestId={requestApprove ? requestApprove._id : ''}
                requestApprove={requestApprove} />
            <form id="form--approve-purchase-order">
                <div className="form-group">
                    <label className="form-control-static"></label>
                    <button type="button" className="btn btn-info" title={"Xem trạng thái kho"} onClick={handleShowStockInformationModal} >{"Xem trạng thái kho"}</button> &nbsp;&nbsp;
                    <button type="button" className="btn btn-success" title={"Xem thông tin kiểm kê"} onClick={handleShowGoodTakesBillModal} >{"Xem thông tin kiểm kê"}</button> &nbsp;&nbsp;
                    <a href="/bill-management"><button type="button" className="btn btn-default" title={"Kiểm kê kho"} >{"Kiểm kê kho"}</button></a>
                </div>
                <div className={`form-group ${!statusError ? "" : "has-error"}`}>
                    <label>
                        {"Trạng thái phê duyệt"}
                        <span className="text-red"> * </span>
                    </label>
                    <SelectBox
                        id={`select-purchase-order-approve-status`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={status}
                        items={[
                            { value: "", text: "---Chọn thái phê duyệt---" },
                            { value: "2", text: "Phê duyệt yêu cầu" },
                            { value: "3", text: "Từ chối yêu cầu" },
                        ]}
                        onChange={handleStatusChange}
                        multiple={false}
                    />
                    <ErrorLabel content={statusError} />
                </div>
                <div className="form-group">
                    <div className="form-group">
                        <label>
                            {"Ghi chú"}
                            <span className="attention"> </span>
                        </label>
                        <textarea type="text" className="form-control" value={note} onChange={handleNoteChange} />
                    </div>
                </div>
            </form>
        </DialogModal>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editRequest: RequestActions.editRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ApproveForm));
