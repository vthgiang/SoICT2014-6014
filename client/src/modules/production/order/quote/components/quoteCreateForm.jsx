import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { generateCode } from "../../../../../helpers/generateCode";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";
import { DatePicker, DialogModal, SelectBox, ButtonModal, ErrorLabel } from "../../../../../common-components";
import QuoteCreateGood from "./quoteCreateGood";
class QuoteCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goods: [],
            code: "",
            note: "",
            customer: "",
            customerName: "",
            customerAddress: "",
            customerPhone: "",
            customerRepresent: "",
            effectiveDate: "",
            expirationDate: "",
        };
    }

    componentDidMount() {
        this.props.getCustomers();
    }

    handleClickCreateCode = () => {
        this.setState((state) => {
            return { ...state, code: generateCode("QUOTE_") };
        });
    };

    getCustomerOptions = () => {
        let options = this.props.customers.list.map((item) => {
            return {
                value: item._id,
                text: item.code + " - " + item.name,
            };
        });
        return options;
    };

    handleCustomerChange = (value) => {
        let customerInfo = this.props.customers.list.filter((item) => item._id === value[0]);
        this.setState({
            customer: customerInfo[0]._id,
            customerName: customerInfo[0].name,
            customerAddress: customerInfo[0].address,
            customerPhone: customerInfo[0].mobilephoneNumber,
            customerRepresent: customerInfo[0].represent,
        });
    };

    handleCustomerPhoneChange = (e) => {
        let { value } = e.target;
        this.setState((state) => {
            return {
                ...state,
                customerPhone: value,
            };
        });
    };

    handleCustomerAddressChange = (e) => {
        let { value } = e.target;
        this.setState((state) => {
            return {
                ...state,
                customerAddress: value,
            };
        });
    };

    handleCustomerRepresentChange = (e) => {
        let { value } = e.target;
        this.setState((state) => {
            return {
                ...state,
                customerRepresent: value,
            };
        });
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

    validateDateStage = (effectiveDate, expirationDate, willUpdateState = true) => {
        let msg = undefined;
        if (effectiveDate && expirationDate) {
            let effDate = new Date(formatToTimeZoneDate(effectiveDate));
            let expDate = new Date(formatToTimeZoneDate(expirationDate));
            if (effDate.getTime() >= expDate.getTime()) {
                msg = "Ngày bắt đầu phải trước ngày kết thúc";
            } else {
                msg = undefined;
            }
        }

        if (willUpdateState) {
            this.setState({
                ...this.state,
                effectiveDate: effectiveDate,
                expirationDate: expirationDate,
                dateError: msg,
            });
        }
        return msg;
    };

    handleChangeEffectiveDate = (value) => {
        const { expirationDate } = this.state;
        if (!value) {
            value = null;
        }

        this.validateDateStage(value, expirationDate, true);
    };

    handleChangeExpirationDate = (value) => {
        const { effectiveDate } = this.state;
        if (!value) {
            value = null;
        }

        this.validateDateStage(effectiveDate, value, true);
    };

    render() {
        let {
            code,
            note,
            customer,
            customerName,
            customerAddress,
            customerPhone,
            customerRepresent,
            effectiveDate,
            expirationDate,
            dateError,
        } = this.state;

        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreateCode}
                    modalID={`modal-add-quote`}
                    button_name={"Đơn báo giá mới"}
                    title={"Đơn báo giá mới"}
                />
                <DialogModal
                    modalID={`modal-add-quote`}
                    isLoading={false}
                    formID={`form-add-quote`}
                    title={"Đơn báo giá mới"}
                    msg_success={"Thêm đơn thành công"}
                    msg_faile={"Thêm đơn không thành công"}
                    // disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="100"
                    style={{ backgroundColor: "green" }}
                >
                    <DialogModal
                        modalID="modal-create-quote-sla"
                        isLoading={false}
                        formID="form-create-quote-sla"
                        title={"Chi tiết cam kết chất lượng"}
                        size="50"
                        hasSaveButton={false}
                        hasNote={false}
                    >
                        <form id="form-create-quote-sla">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <i className="fa fa-check-square-o text-success"></i>
                                <div>Sản phẩm được sản xuất 100% đảm bảo tiêu chuẩn an toàn</div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <i className="fa fa-check-square-o text-success"></i>
                                <div>Sản phẩm đúng với cam kết trên bao bì</div>
                            </div>
                        </form>
                    </DialogModal>
                    <form id={`form-add-quote`}>
                        <div className="row row-equal-height" style={{ marginTop: -25 }}>
                            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8" style={{ padding: 10, height: "100%" }}>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Thông tin chung</legend>
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className="form-group">
                                            <label>
                                                Khách hàng
                                                <span className="attention"> * </span>
                                            </label>
                                            <SelectBox
                                                id={`select-quote-customer`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={customer}
                                                items={this.getCustomerOptions()}
                                                onChange={this.handleCustomerChange}
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                        <div className="form-group">
                                            <label>
                                                Tên khách hàng <span className="attention"> </span>
                                            </label>
                                            <input type="text" className="form-control" value={customerName} disabled={true} />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div className="form-group">
                                            <label>
                                                Địa chỉ
                                                <span className="attention">* </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={customerAddress}
                                                onChange={this.handleCustomerAddressChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className="form-group">
                                            <label>
                                                Số điện thoại
                                                <span className="attention"> * </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={customerPhone}
                                                onChange={this.handleCustomerPhoneChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                        <div className="form-group">
                                            <label>
                                                Người liên hệ <span className="attention"> </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={customerRepresent}
                                                onChange={this.handleCustomerRepresentChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div className="form-group">
                                            <label>
                                                Ghi chú
                                                <span className="attention"> </span>
                                            </label>
                                            <input type="text" className="form-control" value={note} onChange={this.handleNoteChange} />
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, height: "100%" }}>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Báo giá</legend>
                                    <div className="form-group">
                                        <label>
                                            Mã báo giá
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="text" className="form-control" value={code} disabled="true" />
                                    </div>
                                    <div className={`form-group ${!dateError ? "" : "has-error"}`}>
                                        <label>Ngày báo giá</label>
                                        <DatePicker
                                            id="date_picker_create_discount_effectiveDate"
                                            value={effectiveDate}
                                            onChange={this.handleChangeEffectiveDate}
                                            disabled={false}
                                        />
                                        <ErrorLabel content={dateError} />
                                    </div>

                                    <div className={`form-group ${!dateError ? "" : "has-error"}`}>
                                        <label>Hiệu lực đến</label>
                                        <DatePicker
                                            id="date_picker_create_discount_expirationDate"
                                            value={expirationDate}
                                            onChange={this.handleChangeExpirationDate}
                                            disabled={false}
                                        />
                                        <ErrorLabel content={dateError} />
                                    </div>

                                    {/* <div className="form-group">
                                        <label>
                                            Nhân viên bán hàng
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="text" className="form-control" value={"Phạm Đại Tài"} disabled={true} />
                                    </div> */}
                                </fieldset>
                            </div>

                            <QuoteCreateGood />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { customers } = state.crm;
    return { customers };
}

const mapDispatchToProps = {
    getCustomers: CrmCustomerActions.getCustomers,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuoteCreateForm));
