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
import SlasOfGoodDetail from "./createQuote/viewDetailOnCreate/slasOfGoodDetail";
import DiscountOfGoodDetail from "./createQuote/viewDetailOnCreate/discountOfGoodDetail";
class QuoteCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goods: [],
            discountsOfOrderValue: [],
            discountsOfOrderValueChecked: {},
            currentSlasOfGood: [],
            currentDiscountsOfGood: [],
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
            coin: "",
            step: 0,
            isUseForeignCurrency: false,
            foreignCurrency: {
                symbol: "", // ký hiệu viết tắt
                ratio: "", // tỷ lệ chuyển đổi
            },
            standardCurrency: {
                symbol: "vnđ", // ký hiệu viết tắt
                ratio: "1", // tỷ lệ chuyển đổi
            },
            currency: {
                type: "standard",
                symbol: "vnđ",
                ratio: "1",
            },
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

    handleUseForeignCurrencyChange = (e) => {
        const { checked } = e.target;
        this.setState((state) => {
            return {
                ...state,
                isUseForeignCurrency: checked,
            };
        });
        if (!checked) {
            this.setState((state) => {
                return {
                    ...state,
                    foreignCurrency: {
                        ratio: "",
                        symbol: "",
                    },
                    currency: {
                        type: "standard",
                        symbol: "vnđ",
                        ratio: "1",
                    },
                };
            });
        }
    };

    handleRatioOfCurrencyChange = (e) => {
        let { foreignCurrency } = this.state;
        let { value } = e.target;
        this.setState((state) => {
            return {
                ...state,
                foreignCurrency: {
                    ratio: value,
                    symbol: foreignCurrency.symbol,
                },
            };
        });
    };

    handleSymbolOfForreignCurrencyChange = (e) => {
        let { foreignCurrency } = this.state;
        let { value } = e.target;
        this.setState((state) => {
            return {
                ...state,
                foreignCurrency: {
                    ratio: foreignCurrency.ratio,
                    symbol: value,
                },
            };
        });
    };

    handleChangeCurrency = (value) => {
        let { foreignCurrency, standardCurrency } = this.state;
        this.setState((state) => {
            return {
                ...state,
                currency: {
                    type: value[0],
                    symbol: value[0] === "standard" ? standardCurrency.symbol : foreignCurrency.symbol,
                    ratio: foreignCurrency.ratio,
                },
            };
        });
    };

    handleDiscountsOfOrderValueChange = (data) => {
        this.setState((state) => {
            return {
                ...state,
                discountsOfOrderValue: data,
            };
        });
    };

    setDiscountsOfOrderValueChecked = (discountsOfOrderValueChecked) => {
        this.setState((state) => {
            return {
                ...state,
                discountsOfOrderValueChecked,
            };
        });
    };

    handleShippingFeeChange = (e) => {
        const { value } = e.target;
        this.setState((state) => {
            return {
                ...state,
                shippingFee: value,
            };
        });
    };

    handleDeliveryTimeChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                deliveryTime: value,
            };
        });
    };

    setCurrentSlasOfGood = (data) => {
        this.setState((state) => {
            return {
                ...state,
                currentSlasOfGood: data,
            };
        });
    };

    setCurrentDiscountsOfGood = (data) => {
        this.setState((state) => {
            return {
                ...state,
                currentDiscountsOfGood: data,
            };
        });
    };

    handleCoinChange = (coin) => {
        this.setState((state) => {
            return {
                ...state,
                coin: this.state.coin ? "" : coin, //Nếu đang checked thì bỏ checked
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
            coin,
            deliveryTime,
            isUseForeignCurrency,
            foreignCurrency,
            currency,
            standardCurrency,
            discountsOfOrderValue,
            discountsOfOrderValueChecked,
            currentSlasOfGood,
            currentDiscountsOfGood,
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
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active" key="1">
                                <a data-toggle="tab" onClick={(e) => this.setCurrentStep(e, 0)} style={{ cursor: "pointer" }}>
                                    Thông tin chung
                                </a>
                            </li>
                            <li key="2">
                                <a data-toggle="tab" onClick={(e) => this.setCurrentStep(e, 1)} style={{ cursor: "pointer" }}>
                                    Chọn sản phẩm
                                </a>
                            </li>
                            <li key="3">
                                <a data-toggle="tab" onClick={(e) => this.setCurrentStep(e, 2)} style={{ cursor: "pointer" }}>
                                    Chốt báo giá
                                </a>
                            </li>
                        </ul>
                        {foreignCurrency.ratio && foreignCurrency.symbol ? (
                            <div className="form-group select-currency">
                                <SelectBox
                                    id={`select-quote-currency-${foreignCurrency.symbol.replace(" ")}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={currency.type}
                                    items={[
                                        { text: "vnđ", value: "standard" },
                                        { text: `${foreignCurrency.symbol}`, value: "foreign" },
                                    ]}
                                    onChange={this.handleChangeCurrency}
                                    multiple={false}
                                />
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                    <SlasOfGoodDetail currentSlasOfGood={currentSlasOfGood} />
                    <DiscountOfGoodDetail currentDiscounts={currentDiscountsOfGood} />
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
                                    isUseForeignCurrency={isUseForeignCurrency}
                                    foreignCurrency={foreignCurrency}
                                    handleCustomerChange={this.handleCustomerChange}
                                    handleCustomerAddressChange={this.handleCustomerAddressChange}
                                    handleCustomerPhoneChange={this.handleCustomerPhoneChange}
                                    handleCustomerRepresentChange={this.handleCustomerRepresentChange}
                                    handleNoteChange={this.handleNoteChange}
                                    handleChangeEffectiveDate={this.handleChangeEffectiveDate}
                                    handleChangeExpirationDate={this.handleChangeExpirationDate}
                                    handleUseForeignCurrencyChange={this.handleUseForeignCurrencyChange}
                                    handleRatioOfCurrencyChange={this.handleRatioOfCurrencyChange}
                                    handleSymbolOfForreignCurrencyChange={this.handleSymbolOfForreignCurrencyChange}
                                />
                            )}
                            {step === 1 && (
                                <QuoteCreateGood
                                    listGoods={goods}
                                    setGoods={this.setGoods}
                                    isUseForeignCurrency={isUseForeignCurrency}
                                    foreignCurrency={foreignCurrency}
                                    standardCurrency={standardCurrency}
                                    currency={currency}
                                    setCurrentSlasOfGood={(data) => {
                                        this.setCurrentSlasOfGood(data);
                                    }}
                                    setCurrentDiscountsOfGood={(data) => {
                                        this.setCurrentDiscountsOfGood(data);
                                    }}
                                />
                            )}
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
                                    coin={coin}
                                    note={note}
                                    discountsOfOrderValue={discountsOfOrderValue}
                                    discountsOfOrderValueChecked={discountsOfOrderValueChecked}
                                    handleDiscountsOfOrderValueChange={(data) => this.handleDiscountsOfOrderValueChange(data)}
                                    setDiscountsOfOrderValueChecked={(checked) => this.setDiscountsOfOrderValueChecked(checked)}
                                    handleShippingFeeChange={this.handleShippingFeeChange}
                                    handleDeliveryTimeChange={this.handleDeliveryTimeChange}
                                    handleCoinChange={this.handleCoinChange}
                                    setCurrentSlasOfGood={(data) => {
                                        this.setCurrentSlasOfGood(data);
                                    }}
                                    setCurrentDiscountsOfGood={(data) => {
                                        this.setCurrentDiscountsOfGood(data);
                                    }}
                                    customer={customer}
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
