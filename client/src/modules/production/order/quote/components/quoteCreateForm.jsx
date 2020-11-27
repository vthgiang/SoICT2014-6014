import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { generateCode } from "../../../../../helpers/generateCode";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";
import { DatePicker, DialogModal, SelectBox, ButtonModal, ErrorLabel } from "../../../../../common-components";
import QuoteCreateGood from "./createQuote/quoteCreateGood";
import QuoteCreateInfo from "./createQuote/quoteCreateInfo";
import QuoteCreatePayment from "./createQuote/quoteCreatePayment";
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
            shippingFee: "",
            deliveryTime: "",
            step: 0,
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

    handleCustomerChange = (value) => {
        console.log("VALUE", value);
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

    nextStep = (e) => {
        e.preventDefault();
        let { step } = this.state;
        step++;
        this.setState({
            step,
        });
    };

    preStep = (e) => {
        e.preventDefault();
        let { step } = this.state;
        step--;
        this.setState({
            step,
        });
    };

    setCurrentStep = (e, step) => {
        e.preventDefault();
        this.setState({
            step,
        });
    };

    setGoods = (goods) => {
        this.setState((state) => {
            return {
                ...state,
                goods,
            };
        });
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
            step,
            goods,
            shippingFee,
            deliveryTime,
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
                    hasSaveButton={false}
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
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active">
                                <a data-toggle="tab" onClick={(e) => this.setCurrentStep(e, 0)} style={{ cursor: "pointer" }}>
                                    Thông tin chung
                                </a>
                            </li>
                            <li>
                                <a data-toggle="tab" onClick={(e) => this.setCurrentStep(e, 1)} style={{ cursor: "pointer" }}>
                                    Chọn sản phẩm
                                </a>
                            </li>
                            <li>
                                <a data-toggle="tab" onClick={(e) => this.setCurrentStep(e, 2)} style={{ cursor: "pointer" }}>
                                    Chốt báo giá
                                </a>
                            </li>
                        </ul>
                    </div>
                    <form id={`form-add-quote`}>
                        <div className="row row-equal-height" style={{ marginTop: 0 }}>
                            {step === 0 && (
                                <QuoteCreateInfo
                                    code={code}
                                    note={note}
                                    customer={customer}
                                    customerName={customerName}
                                    customerAddress={customerAddress}
                                    customerPhone={customerPhone}
                                    customerRepresent={customerRepresent}
                                    effectiveDate={effectiveDate}
                                    expirationDate={expirationDate}
                                    dateError={dateError}
                                    handleCustomerChange={this.handleCustomerChange}
                                    handleCustomerAddressChange={this.handleCustomerAddressChange}
                                    handleCustomerPhoneChange={this.handleCustomerPhoneChange}
                                    handleCustomerRepresentChange={this.handleCustomerRepresentChange}
                                    handleNoteChange={this.handleNoteChange}
                                    handleChangeEffectiveDate={this.handleChangeEffectiveDate}
                                    handleChangeExpirationDate={this.handleChangeExpirationDate}
                                />
                            )}
                            {step === 1 && <QuoteCreateGood listGoods={goods} setGoods={this.setGoods} />}
                            {step === 2 && (
                                <QuoteCreatePayment
                                    listGoods={goods}
                                    customerPhone={customerPhone}
                                    customerAddress={customerAddress}
                                    customerName={customerName}
                                    customerRepresent={customerRepresent}
                                    effectiveDate={effectiveDate}
                                    expirationDate={expirationDate}
                                    code={code}
                                    shippingFee={shippingFee}
                                    deliveryTime={deliveryTime}
                                    note={note}
                                />
                            )}
                        </div>
                        {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={"pull-right"} style={{ padding: 10 }}>
                                <div>
                                    <div>
                                        {step + 1} / {3}
                                    </div>
                                    <div>
                                        {step !== 0 ? (
                                            <button className="btn" onClick={this.preStep}>
                                                Quay lại
                                            </button>
                                        ) : (
                                            ""
                                        )}
                                        {step === 2 ? (
                                            ""
                                        ) : (
                                            <button className="btn btn-success" onClick={this.nextStep}>
                                                Tiếp
                                            </button>
                                        )}
                                        {step === 2 ? <button className="btn btn-success">Lưu</button> : ""}
                                    </div>
                                </div>
                            </div>
                        </div> */}
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
