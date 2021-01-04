import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { SalesOrderActions } from "../redux/actions";
import { generateCode } from "../../../../../helpers/generateCode";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";
import { DialogModal, SelectBox, ButtonModal } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import SalesOrderCreateGood from "./createSalesOrder/salesOrderCreateGood";
import SalesOrderCreateInfo from "./createSalesOrder/salesOrderCreateInfo";
import SalesOrderCreatePayment from "./createSalesOrder/salesOrderCreatePayment";
import SlasOfGoodDetail from "./createSalesOrder/viewDetailOnCreate/slasOfGoodDetail";
import DiscountOfGoodDetail from "./createSalesOrder/viewDetailOnCreate/discountOfGoodDetail";
class SalesOrderCreateForm extends Component {
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
            shippingFee: "",
            deliveryTime: "",
            coin: "",
            priority: "",
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.code !== prevState.code) {
            return {
                code: nextProps.code,
            };
        }
    }

    componentDidMount() {
        this.props.getCustomers();
    }

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

    validatePriority = (value, willUpdateState = true) => {
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
                    priorityError: msg,
                };
            });
        }
        return msg;
    };

    handlePriorityChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                priority: value[0],
            };
        });
        this.validatePriority(value[0], true);
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

    setPaymentAmount = (paymentAmount) => {
        this.setState((state) => {
            return {
                ...state,
                paymentAmount,
            };
        });
    };

    isValidateSalesOrderCreateInfo = () => {
        let { customer, customerEmail, customerPhone, customerAddress, priority } = this.state;
        let { translate } = this.props;

        if (
            this.validateCustomer(customer, false) ||
            this.validatePriority(priority, false) ||
            !ValidationHelper.validateEmail(translate, customerEmail).status ||
            !ValidationHelper.validateEmpty(translate, customerPhone).status ||
            !ValidationHelper.validateEmpty(translate, customerAddress).status
        ) {
            return false;
        } else {
            return true;
        }
    };

    isValidateSalesOrderCreateGood = () => {
        let { goods } = this.state;
        if (goods && goods.length) {
            return true;
        } else {
            return false;
        }
    };

    isValidateForm = () => {
        if (this.isValidateSalesOrderCreateInfo() && this.isValidateSalesOrderCreateGood()) {
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
                manufacturingWorks: item.manufacturingWorks,
            };
        });
        return goodMap;
    };

    save = async (e) => {
        e.preventDefault();
        if (this.isValidateForm()) {
            let {
                customer,
                customerAddress,
                customerPhone,
                customerRepresent,
                customerEmail,
                code,
                shippingFee,
                deliveryTime,
                coin,
                discountsOfOrderValue,
                paymentAmount,
                note,
                priority,
            } = this.state;

            let data = {
                code,
                customer,
                customerPhone,
                customerAddress,
                customerRepresent,
                customerEmail,
                priority,
                goods: this.formatGoodForSubmit(),
                discounts: discountsOfOrderValue.length ? this.formatDiscountForSubmit(discountsOfOrderValue) : [],
                shippingFee,
                deliveryTime: deliveryTime ? new Date(formatToTimeZoneDate(deliveryTime)) : undefined,
                coin,
                paymentAmount,
                note,
            };

            await this.props.createNewSalesOrder(data);

            console.log("data", data);

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
                    priority: "",
                    code: "",
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

            window.$(`#modal-add-sales-order`).modal("hide");
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
            priority,
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

        let { customerError, customerEmailError, customerPhoneError, customerAddressError, priorityError } = this.state;

        let enableStepOne = this.isValidateSalesOrderCreateInfo();
        let enableStepTwo = this.isValidateSalesOrderCreateGood();
        let enableFormSubmit = enableStepOne && enableStepTwo;

        return (
            <React.Fragment>
                {/* <ButtonModal
                    onButtonCallBack={this.handleClickCreateCode}
                    modalID={`modal-add-sales-order`}
                    button_name={"Đơn hàng mới"}
                    title={"Đơn hàng mới"}
                /> */}
                <DialogModal
                    modalID={`modal-add-sales-order`}
                    isLoading={false}
                    formID={`form-add-sales-order`}
                    title={"Đơn hàng mới"}
                    msg_success={"Thêm đơn thành công"}
                    msg_faile={"Thêm đơn không thành công"}
                    // disableSubmit={!this.isFormValidated()}
                    // func={this.save}
                    size="100"
                    style={{ backgroundColor: "green" }}
                    hasSaveButton={false}
                >
                    <div className="nav-tabs-custom">
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
                                    <span>Chốt đơn</span>
                                </a>
                            </li>
                        </ul>
                        {foreignCurrency.ratio && foreignCurrency.symbol ? (
                            <div className="form-group select-currency">
                                <SelectBox
                                    id={`select-sales-order-currency-${foreignCurrency.symbol.replace(" ")}`}
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
                    <form id={`form-add-sales-order`}>
                        <div className="row row-equal-height" style={{ marginTop: 0 }}>
                            {step === 0 && (
                                <SalesOrderCreateInfo
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
                                    priority={priority}
                                    isUseForeignCurrency={isUseForeignCurrency}
                                    foreignCurrency={foreignCurrency}
                                    //handle
                                    handleCustomerChange={this.handleCustomerChange}
                                    handleCustomerAddressChange={this.handleCustomerAddressChange}
                                    handleCustomerEmailChange={this.handleCustomerEmailChange}
                                    handleCustomerPhoneChange={this.handleCustomerPhoneChange}
                                    handleCustomerRepresentChange={this.handleCustomerRepresentChange}
                                    handleNoteChange={this.handleNoteChange}
                                    handleUseForeignCurrencyChange={this.handleUseForeignCurrencyChange}
                                    handleRatioOfCurrencyChange={this.handleRatioOfCurrencyChange}
                                    handleSymbolOfForreignCurrencyChange={this.handleSymbolOfForreignCurrencyChange}
                                    handlePriorityChange={this.handlePriorityChange}
                                    //Error Status
                                    customerError={customerError}
                                    customerEmailError={customerEmailError}
                                    customerPhoneError={customerPhoneError}
                                    customerAddressError={customerAddressError}
                                    priorityError={priorityError}
                                />
                            )}
                            {step === 1 && (
                                <SalesOrderCreateGood
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
                                <SalesOrderCreatePayment
                                    paymentAmount={paymentAmount}
                                    listGoods={goods}
                                    customer={customer}
                                    customerPhone={customerPhone}
                                    customerAddress={customerAddress}
                                    customerName={customerName}
                                    customerRepresent={customerRepresent}
                                    customerTaxNumber={customerTaxNumber}
                                    customerEmail={customerEmail}
                                    priority={priority}
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
                                    saveSalesOrder={this.save}
                                />
                            )}
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
    createNewSalesOrder: SalesOrderActions.createNewSalesOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderCreateForm));
