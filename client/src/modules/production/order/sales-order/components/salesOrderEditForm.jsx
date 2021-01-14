import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SalesOrderActions } from "../redux/actions";
import { DiscountActions } from "../../discount/redux/actions";
import { formatToTimeZoneDate, formatDate } from "../../../../../helpers/formatDate";
import { DialogModal, SelectBox } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import SalesOrderCreateGood from "./editSalesOrder/salesOrderCreateGood";
import SalesOrderCreateInfo from "./editSalesOrder/salesOrderCreateInfo";
import SalesOrderCreatePayment from "./editSalesOrder/salesOrderCreatePayment";
import SlasOfGoodDetail from "./editSalesOrder/viewDetailOnCreate/slasOfGoodDetail";
import DiscountOfGoodDetail from "./editSalesOrder/viewDetailOnCreate/discountOfGoodDetail";
import ManufacturingWorksOfGoodDetail from "./editSalesOrder/viewDetailOnCreate/manufacturingWorksOfGoodDetail";
class SalesOrderEditForm extends Component {
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
            priority: "",
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.salesOrderEdit._id !== prevState.salesOrderId) {
            return {
                ...prevState,
                step: 0,
                salesOrderId: nextProps.salesOrderEdit._id,
                code: nextProps.salesOrderEdit.code,
                customer: nextProps.salesOrderEdit.customer._id,
                customerName: nextProps.salesOrderEdit.customer.name,
                customerPhone: nextProps.salesOrderEdit.customerPhone,
                customerTaxNumber: nextProps.salesOrderEdit.customer.taxNumber,
                customerRepresent: nextProps.salesOrderEdit.customerRepresent,
                customerAddress: nextProps.salesOrderEdit.customerAddress,
                customerEmail: nextProps.salesOrderEdit.customerEmail,
                priority: nextProps.salesOrderEdit.priority,
                deliveryTime: nextProps.salesOrderEdit.deliveryTime ? formatDate(nextProps.salesOrderEdit.deliveryTime) : "",
                discountsOfOrderValue: nextProps.salesOrderEdit.discounts,
                discountsOfOrderValueChecked: Object.assign({}),
                note: nextProps.salesOrderEdit.note,
                paymentAmount: nextProps.salesOrderEdit.paymentAmount,
                shippingFee: nextProps.salesOrderEdit.shippingFee,
                coin: nextProps.salesOrderEdit.coin,
                status: nextProps.salesOrderEdit.status,
                goods: nextProps.salesOrderEdit.goods
                    ? nextProps.salesOrderEdit.goods.map((item) => {
                          return {
                              good: item.good,
                              pricePerBaseUnit: item.pricePerBaseUnit,
                              pricePerBaseUnitOrigin: item.pricePerBaseUnitOrigin,
                              salesPriceVariance: item.salesPriceVariance,
                              quantity: item.quantity,
                              slasOfGood: item.serviceLevelAgreements,
                              taxs: item.taxs,
                              manufacturingWorks: item.manufacturingWorks,
                              manufacturingPlan: item.manufacturingPlan,
                              note: item.note,
                              amount: item.amount,
                              amountAfterDiscount: item.amountAfterDiscount,
                              amountAfterTax: item.amountAfterTax,
                              discountsOfGood: item.discounts.length
                                  ? item.discounts.map((dis) => {
                                        return {
                                            _id: dis._id,
                                            code: dis.code,
                                            type: dis.type,
                                            formality: dis.formality,
                                            name: dis.name,
                                            effectiveDate: dis.effectiveDate ? formatDate(dis.effectiveDate) : undefined,
                                            expirationDate: dis.expirationDate ? formatDate(dis.expirationDate) : undefined,
                                            discountedCash: dis.discountedCash,
                                            discountedPercentage: dis.discountedPercentage,
                                            maximumFreeShippingCost: dis.maximumFreeShippingCost,
                                            loyaltyCoin: dis.loyaltyCoin,
                                            bonusGoods: dis.bonusGoods
                                                ? dis.bonusGoods.map((bonus) => {
                                                      return {
                                                          good: bonus.good,
                                                          expirationDateOfGoodBonus: bonus.expirationDateOfGoodBonus
                                                              ? formatDate(bonus.expirationDateOfGoodBonus)
                                                              : undefined,
                                                          quantityOfBonusGood: bonus.quantityOfBonusGood,
                                                      };
                                                  })
                                                : undefined,
                                            discountOnGoods: dis.discountOnGoods
                                                ? {
                                                      good: dis.discountOnGoods.good,
                                                      expirationDate: dis.discountOnGoods.expirationDate
                                                          ? formatDate(dis.discountOnGoods.expirationDate)
                                                          : undefined,
                                                      discountedPrice: dis.discountOnGoods.discountedPrice,
                                                  }
                                                : undefined,
                                        };
                                    })
                                  : [],
                          };
                      })
                    : [],
            };
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("nextState", nextState.code, this.state.salesOrderCode);
        if (nextState.code !== this.state.salesOrderCode) {
            this.getDiscountOfOrderValueChecked();
            this.setState({
                salesOrderCode: nextState.code,
            });
            return false;
        }
        return true;
    }

    getDiscountOfOrderValueChecked = () => {
        const { listDiscountsByOrderValue } = this.props.discounts;
        let { discountsOfOrderValue, discountsOfOrderValueChecked } = this.state;
        let amountAfterApplyTax = this.getAmountAfterApplyTax();

        if (discountsOfOrderValue) {
            discountsOfOrderValue.forEach((element) => {
                //checked các khuyến mãi đã có trong danh mục
                let discount = listDiscountsByOrderValue.find((dis) => dis._id === element._id);
                if (discount) {
                    let checked = this.getDiscountsCheckedForEditSalesOrder(discount, amountAfterApplyTax);
                    discountsOfOrderValueChecked[`${checked.id}`] = checked.status;
                }
            });

            this.setState({
                discountsOfOrderValueChecked,
            });
        }
    };

    getDiscountsCheckedForEditSalesOrder = (item, orderValue) => {
        let checked = { id: "", status: false };
        item.discounts.forEach((discount, index) => {
            let disabled = false;
            if (discount.minimumThresholdToBeApplied) {
                if (parseInt(orderValue) < discount.minimumThresholdToBeApplied) {
                    disabled = true;
                }
            }
            if (discount.maximumThresholdToBeApplied) {
                if (parseInt(orderValue) > discount.maximumThresholdToBeApplied) {
                    disabled = true;
                }
            }
            if (!disabled) {
                checked = { id: `${item._id}-${index}`, status: true };
            }
        });

        return checked;
    };

    getAmountAfterApplyTax = () => {
        let { goods } = this.state;
        let amountAfterApplyTax = goods.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.amountAfterTax;
        }, 0);

        // this.setState({ amountAfterApplyTax });
        return amountAfterApplyTax;
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

    setCurrentManufacturingWorksOfGoods = (manufacturingWorks, manufacturingPlan) => {
        this.setState((state) => {
            return {
                ...state,
                currentManufacturingWorksOfGood: manufacturingWorks,
                currentManufacturingPlanOfGood: manufacturingPlan,
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
                effectiveDate: dis.effectiveDate ? new Date(formatToTimeZoneDate(dis.effectiveDate)) : undefined,
                expirationDate: dis.expirationDate ? new Date(formatToTimeZoneDate(dis.expirationDate)) : undefined,
                discountedCash: dis.discountedCash,
                discountedPercentage: dis.discountedPercentage,
                maximumFreeShippingCost: dis.maximumFreeShippingCost,
                loyaltyCoin: dis.loyaltyCoin,
                bonusGoods: dis.bonusGoods
                    ? dis.bonusGoods.map((bonus) => {
                          return {
                              good: bonus.good._id,
                              expirationDateOfGoodBonus: bonus.expirationDateOfGoodBonus
                                  ? new Date(formatToTimeZoneDate(bonus.expirationDateOfGoodBonus))
                                  : undefined,
                              quantityOfBonusGood: bonus.quantityOfBonusGood,
                          };
                      })
                    : undefined,
                discountOnGoods: dis.discountOnGoods
                    ? {
                          good: dis.discountOnGoods.good._id,
                          expirationDate: dis.discountOnGoods.expirationDate
                              ? new Date(formatToTimeZoneDate(dis.discountOnGoods.expirationDate))
                              : undefined,
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
                manufacturingWorks: item.manufacturingWorks ? item.manufacturingWorks._id : undefined,
                manufacturingPlan: item.manufacturingPlan,
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
                priority,
                code,
                shippingFee,
                deliveryTime,
                coin,
                discountsOfOrderValue,
                paymentAmount,
                note,
                salesOrderId,
            } = this.state;

            let allCoin = this.getCoinOfAll(); //Lấy tất cả các xu được tặng trong đơn

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
                allCoin,
                paymentAmount,
                note,
            };

            await this.props.editSalesOrder(salesOrderId, data);

            this.setState((state) => {
                return {
                    ...state,
                    step: 0,
                };
            });

            window.$(`#modal-edit-sales-order`).modal("hide");
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
            currentManufacturingWorksOfGood,
            currentManufacturingPlanOfGood,
            paymentAmount,
        } = this.state;

        let { customerError, customerEmailError, customerPhoneError, customerAddressError, priorityError } = this.state;

        let enableStepOne = this.isValidateSalesOrderCreateInfo();
        let enableStepTwo = this.isValidateSalesOrderCreateGood();
        let enableFormSubmit = enableStepOne && enableStepTwo;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-sales-order`}
                    isLoading={false}
                    formID={`form-add-sales-order`}
                    title={"Chỉnh sửa đơn bán hàng"}
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
                    <ManufacturingWorksOfGoodDetail
                        currentManufacturingWorksOfGood={currentManufacturingWorksOfGood}
                        currentManufacturingPlanOfGood={currentManufacturingPlanOfGood}
                    />
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
                                    setCurrentManufacturingWorksOfGoods={(manufacturingWorks, manufacturingPlan) => {
                                        this.setCurrentManufacturingWorksOfGoods(manufacturingWorks, manufacturingPlan);
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
                                    setCurrentManufacturingWorksOfGoods={(manufacturingWorks, manufacturingPlan) => {
                                        this.setCurrentManufacturingWorksOfGoods(manufacturingWorks, manufacturingPlan);
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
    const { discounts } = state;
    return { discounts, customers };
}

const mapDispatchToProps = {
    getDiscountForOrderValue: DiscountActions.getDiscountForOrderValue,
    editSalesOrder: SalesOrderActions.editSalesOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderEditForm));
