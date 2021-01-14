import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { QuoteActions } from "../redux/actions";
import { generateCode } from "../../../../../helpers/generateCode";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";
import { DialogModal, SelectBox, ButtonModal } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
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
            paymentAmount: 0,
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

    validateCustomer = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (value[0] === "title") {
            msg = "Giá trị không được để trống";
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    customerError: msg,
                };
            });
        }
        return msg;
    };

    handleCustomerChange = (value) => {
        if (value[0] !== "title") {
            let customerInfo = this.props.customers.list.filter((item) => item._id === value[0]);
            if (customerInfo.length) {
                this.setState({
                    customer: customerInfo[0]._id,
                    customerName: customerInfo[0].name,
                    customerAddress: customerInfo[0].address,
                    customerPhone: customerInfo[0].mobilephoneNumber,
                    customerRepresent: customerInfo[0].represent,
                    customerTaxNumber: customerInfo[0].taxNumber,
                    customerEmail: customerInfo[0].email,
                });
            }
        } else {
            this.setState((state) => {
                return {
                    ...state,
                    customer: value[0],
                    customerName: "",
                    customerAddress: "",
                    customerPhone: "",
                    customerRepresent: "",
                    customerTaxNumber: "",
                    customerEmail: "",
                };
            });
        }

        this.validateCustomer(value, true);
    };

    handleCustomerEmailChange = (e) => {
        let { value } = e.target;
        this.setState((state) => {
            return {
                ...state,
                customerEmail: value,
            };
        });

        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmail(translate, value);
        this.setState({ customerEmailError: message });
    };

    handleCustomerPhoneChange = (e) => {
        let { value } = e.target;
        this.setState((state) => {
            return {
                ...state,
                customerPhone: value,
            };
        });

        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ customerPhoneError: message });
    };

    handleCustomerAddressChange = (e) => {
        let { value } = e.target;
        this.setState((state) => {
            return {
                ...state,
                customerAddress: value,
            };
        });

        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ customerAddressError: message });
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
        let {} = this.state;
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
            this.setState((state) => {
                return {
                    ...state,
                    effectiveDate: effectiveDate,
                    expirationDate: expirationDate,
                    effectiveDateError: msg,
                    expirationDateError: msg,
                };
            });
        }
        return msg;
    };

    handleChangeEffectiveDate = (value) => {
        const { expirationDate } = this.state;
        if (!value) {
            value = null;
        }

        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ effectiveDateError: message, expirationDateError: undefined });

        if (value) {
            this.validateDateStage(value, expirationDate, true);
        }
    };

    handleChangeExpirationDate = (value) => {
        const { effectiveDate } = this.state;
        if (!value) {
            value = null;
        }
        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ expirationDateError: message, effectiveDateError: undefined });

        if (value) {
            this.validateDateStage(effectiveDate, value, true);
        }
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

    getCoinOfAll = () => {
        let coinOfAll = 0;
        let { goods } = this.state;
        let { discountsOfOrderValue } = this.state;

        goods.forEach((good) => {
            good.discountsOfGood.forEach((discount) => {
                if (discount.formality == "2") {
                    coinOfAll += discount.loyaltyCoin;
                }
            });
        });

        discountsOfOrderValue.forEach((discount) => {
            if (discount.formality == "2") {
                coinOfAll += discount.loyaltyCoin;
            }
        });
        return coinOfAll;
    };

    setPaymentAmount = (paymentAmount) => {
        this.setState((state) => {
            return {
                ...state,
                paymentAmount,
            };
        });
    };

    isValidateQuoteCreateInfo = () => {
        let { customer, customerEmail, customerPhone, customerAddress, effectiveDate, expirationDate } = this.state;
        let { translate } = this.props;

        if (
            this.validateCustomer(customer, false) ||
            !ValidationHelper.validateEmail(translate, customerEmail).status ||
            !ValidationHelper.validateEmpty(translate, customerPhone).status ||
            !ValidationHelper.validateEmpty(translate, customerAddress).status ||
            this.validateDateStage(effectiveDate, expirationDate, false) ||
            !ValidationHelper.validateEmpty(translate, effectiveDate).status ||
            !ValidationHelper.validateEmpty(translate, expirationDate).status
        ) {
            return false;
        } else {
            return true;
        }
    };

    isValidateQuoteCreateGood = () => {
        let { goods } = this.state;
        if (goods && goods.length) {
            return true;
        } else {
            return false;
        }
    };

    isValidateForm = () => {
        if (this.isValidateQuoteCreateInfo() && this.isValidateQuoteCreateGood()) {
            return true;
        } else {
            return false;
        }
    };

    formatDiscountForSubmit = (discounts) => {
        let discountsMap = discounts.map((dis) => {
            return {
                _id: dis._id,
                code: dis.code,
                type: dis.type,
                formality: dis.formality,
                name: dis.name,
                effectiveDate: dis.effectiveDate,
                expirationDate: dis.expirationDate,
                discountedCash: dis.discountedCash,
                discountedPercentage: dis.discountedPercentage,
                maximumFreeShippingCost: dis.maximumFreeShippingCost,
                loyaltyCoin: dis.loyaltyCoin,
                bonusGoods: dis.bonusGoods
                    ? dis.bonusGoods.map((bonus) => {
                          return {
                              good: bonus.good._id,
                              expirationDateOfGoodBonus: bonus.expirationDateOfGoodBonus,
                              quantityOfBonusGood: bonus.quantityOfBonusGood,
                          };
                      })
                    : undefined,
                discountOnGoods: dis.discountOnGoods
                    ? {
                          good: dis.discountOnGoods.good._id,
                          expirationDate: dis.discountOnGoods.expirationDate,
                          discountedPrice: dis.discountOnGoods.discountedPrice,
                      }
                    : undefined,
            };
        });

        return discountsMap;
    };

    formatGoodForSubmit = () => {
        let { goods } = this.state;
        let goodMap = goods.map((item) => {
            return {
                good: item.good._id,
                pricePerBaseUnit: item.pricePerBaseUnit,
                pricePerBaseUnitOrigin: item.pricePerBaseUnitOrigin,
                salesPriceVariance: item.salesPriceVariance,
                quantity: item.quantity,
                serviceLevelAgreements: item.slasOfGood,
                taxs: item.taxs,
                discounts: item.discountsOfGood.length ? this.formatDiscountForSubmit(item.discountsOfGood) : [],
                note: item.note,
                amount: item.amount,
                amountAfterDiscount: item.amountAfterDiscount,
                amountAfterTax: item.amountAfterTax,
            };
        });
        return goodMap;
    };

    save = async () => {
        console.log("this.isValidateForm()", this.isValidateForm());
        if (this.isValidateForm()) {
            let {
                customer,
                customerAddress,
                customerPhone,
                customerRepresent,
                customerEmail,
                code,
                effectiveDate,
                expirationDate,
                shippingFee,
                deliveryTime,
                coin,
                discountsOfOrderValue,
                paymentAmount,
                note,
            } = this.state;

            let allCoin = this.getCoinOfAll(); //Lấy tất cả các xu được tặng trong đơn

            let data = {
                code,
                effectiveDate: effectiveDate ? new Date(formatToTimeZoneDate(effectiveDate)) : undefined,
                expirationDate: expirationDate ? new Date(formatToTimeZoneDate(expirationDate)) : undefined,
                customer,
                customerPhone,
                customerAddress,
                customerRepresent,
                customerEmail,
                goods: this.formatGoodForSubmit(),
                discounts: discountsOfOrderValue.length ? this.formatDiscountForSubmit(discountsOfOrderValue) : [],
                shippingFee,
                deliveryTime: deliveryTime ? new Date(formatToTimeZoneDate(deliveryTime)) : undefined,
                coin,
                allCoin,
                paymentAmount,
                note,
            };

            await this.props.createNewQuote(data);

            this.setState((state) => {
                return {
                    ...state,
                    customer: "",
                    customerName: "",
                    customerAddress: "",
                    customerPhone: "",
                    customerRepresent: "",
                    customerTaxNumbe: "",
                    customerEmail: "",
                    code: "",
                    effectiveDate: "",
                    expirationDate: "",
                    shippingFee: "",
                    deliveryTime: "",
                    coin: "",
                    goods: [],
                    discountsOfOrderValue: [],
                    paymentAmount: "",
                    note: "",
                    paymentAmount: "",
                    step: 0,
                };
            });

            window.$(`#modal-add-quote`).modal("hide");
        }
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
            customerTaxNumber,
            customerEmail,
            effectiveDate,
            expirationDate,
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
            paymentAmount,
        } = this.state;

        let { customerError, customerEmailError, customerPhoneError, customerAddressError, effectiveDateError, expirationDateError } = this.state;

        let enableStepOne = this.isValidateQuoteCreateInfo();
        let enableStepTwo = this.isValidateQuoteCreateGood();
        let enableFormSubmit = enableStepOne && enableStepTwo;

        console.log("businessDepartments", this.props.businessDepartments);

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
                    // func={this.save}
                    size="100"
                    style={{ backgroundColor: "green" }}
                    hasSaveButton={false}
                >
                    <div className="nav-tabs-custom">
                        {/* <ul className="nav nav-tabs">
                            <li className={step === 0 ? "active" : ""} key="1">
                                <a data-toggle="tab" onClick={(e) => this.setCurrentStep(e, 0)} style={{ cursor: "pointer" }}>
                                    Thông tin chung
                                </a>
                            </li>
                            <li className={step === 1 ? "active" : ""} key="2">
                                <a data-toggle="tab" onClick={(e) => this.setCurrentStep(e, 1)} style={{ cursor: "pointer" }}>
                                    Chọn sản phẩm
                                </a>
                            </li>
                            <li className={step === 2 ? "active" : ""} key="3">
                                <a data-toggle="tab" onClick={(e) => this.setCurrentStep(e, 2)} style={{ cursor: "pointer" }}>
                                    Chốt báo giá
                                </a>
                            </li>
                        </ul> */}
                        <ul className="breadcrumbs">
                            <li key="1">
                                <a
                                    className={`${step >= 0 ? "quote-active-tab" : "quote-defaul-tab"}`}
                                    onClick={(e) => this.setCurrentStep(e, 0)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <span>Thông tin chung</span>
                                </a>
                            </li>
                            <li key="2">
                                <a
                                    className={`${step >= 1 ? "quote-active-tab" : "quote-defaul-tab"} 
                                    ${enableStepOne ? "" : "disable-onclick-prevent"}`}
                                    onClick={(e) => this.setCurrentStep(e, 1)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <span>Chọn sản phẩm</span>
                                </a>
                            </li>
                            <li key="3">
                                <a
                                    className={`${step >= 2 ? "quote-active-tab" : "quote-defaul-tab"} 
                                    ${enableStepOne && enableStepTwo ? "" : "disable-onclick-prevent"}`}
                                    onClick={(e) => this.setCurrentStep(e, 2)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <span>Chốt báo giá</span>
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
                                    //state
                                    code={code}
                                    note={note}
                                    customer={customer}
                                    customerName={customerName}
                                    customerAddress={customerAddress}
                                    customerPhone={customerPhone}
                                    customerRepresent={customerRepresent}
                                    customerTaxNumber={customerTaxNumber}
                                    customerEmail={customerEmail}
                                    effectiveDate={effectiveDate}
                                    expirationDate={expirationDate}
                                    isUseForeignCurrency={isUseForeignCurrency}
                                    foreignCurrency={foreignCurrency}
                                    //handle
                                    handleCustomerChange={this.handleCustomerChange}
                                    handleCustomerAddressChange={this.handleCustomerAddressChange}
                                    handleCustomerEmailChange={this.handleCustomerEmailChange}
                                    handleCustomerPhoneChange={this.handleCustomerPhoneChange}
                                    handleCustomerRepresentChange={this.handleCustomerRepresentChange}
                                    handleNoteChange={this.handleNoteChange}
                                    handleChangeEffectiveDate={this.handleChangeEffectiveDate}
                                    handleChangeExpirationDate={this.handleChangeExpirationDate}
                                    handleUseForeignCurrencyChange={this.handleUseForeignCurrencyChange}
                                    handleRatioOfCurrencyChange={this.handleRatioOfCurrencyChange}
                                    handleSymbolOfForreignCurrencyChange={this.handleSymbolOfForreignCurrencyChange}
                                    //Error Status
                                    customerError={customerError}
                                    customerEmailError={customerEmailError}
                                    customerPhoneError={customerPhoneError}
                                    customerAddressError={customerAddressError}
                                    effectiveDateError={effectiveDateError}
                                    expirationDateError={expirationDateError}
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
                                    paymentAmount={paymentAmount}
                                    listGoods={goods}
                                    customer={customer}
                                    customerPhone={customerPhone}
                                    customerAddress={customerAddress}
                                    customerName={customerName}
                                    customerRepresent={customerRepresent}
                                    customerTaxNumber={customerTaxNumber}
                                    customerEmail={customerEmail}
                                    effectiveDate={effectiveDate}
                                    expirationDate={expirationDate}
                                    code={code}
                                    shippingFee={shippingFee}
                                    deliveryTime={deliveryTime}
                                    coin={coin}
                                    note={note}
                                    discountsOfOrderValue={discountsOfOrderValue}
                                    discountsOfOrderValueChecked={discountsOfOrderValueChecked}
                                    enableFormSubmit={enableFormSubmit}
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
                                    setPaymentAmount={(data) => this.setPaymentAmount(data)}
                                    saveQuote={this.save}
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
    const { customers, businessDepartments } = state.crm;
    return { customers, businessDepartments };
}

const mapDispatchToProps = {
    getCustomers: CrmCustomerActions.getCustomers,
    createNewQuote: QuoteActions.createNewQuote,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuoteCreateForm));
