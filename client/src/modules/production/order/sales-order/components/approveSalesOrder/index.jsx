import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, SelectBox, ErrorLabel } from "../../../../../../common-components";
import { SalesOrderActions } from "../../redux/actions";

class SalesOrderApproveForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    validateStatus = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (value === "title") {
            msg = "Giá trị không được để trống";
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    statusError: msg,
                };
            });
        }
        return msg;
    };

    handleStatusChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                status: value[0],
            };
        });
        this.validateStatus(value[0], true);
    };

    handleNoteChange = (e) => {
        let { value } = e.target;
        this.setState((state) => {
            return {
                ...state,
                note: value,
            };
        });
    };

    isFormValidated = () => {
        const { status } = this.state;
        if (this.validateStatus(status, false)) {
            return false;
        }

        return true;
    };

    save = async () => {
        const { status, note } = this.state;
        const { salesOrderApprove } = this.props;
        const userId = localStorage.getItem("userId");

        let data = { status, note, approver: userId };
        await this.props.approveSalesOrder(salesOrderApprove._id, data);
        this.setState({
            status: "title",
            note: "",
        });
    };

    render() {
        const { salesOrderApprove } = this.props;
        const { status, note, statusError } = this.state;
        return (
            <DialogModal
                modalID="modal-approve-sales-order"
                isLoading={false}
                formID="form--approve-sales-order"
                title={`Phê duyệt đơn hàng: ${salesOrderApprove && salesOrderApprove.code}`}
                size="25"
                hasSaveButton={true}
                hasNote={false}
                disableSubmit={!this.isFormValidated()}
                func={this.save}
            >
                <form id="form--approve-sales-order">
                    <div className={`form-group ${!statusError ? "" : "has-error"}`}>
                        <label>
                            Trạng thái phê duyệt
                            <span className="attention"> * </span>
                        </label>
                        <SelectBox
                            id={`select-sales-order-approve-status`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={status}
                            items={[
                                { value: "title", text: "---Chọn thái phê duyệt---" },
                                { value: 2, text: "Phê duyệt đơn" },
                                { value: 3, text: "Hủy đơn" },
                            ]}
                            onChange={this.handleStatusChange}
                            multiple={false}
                        />
                        <ErrorLabel content={statusError} />
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label>
                                Ghi chú
                                <span className="attention"> </span>
                            </label>
                            <textarea type="text" className="form-control" value={note} onChange={this.handleNoteChange} />
                        </div>
                    </div>
                </form>
            </DialogModal>
        );
    }
}

function mapStateToProps(state) {}

const mapDispatchToProps = {
    approveSalesOrder: SalesOrderActions.approveSalesOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderApproveForm));
