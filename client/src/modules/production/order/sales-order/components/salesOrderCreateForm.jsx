import React, { Component, useState } from "react";
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
import ManufacturingWorksOfGoodDetail from "./createSalesOrder/viewDetailOnCreate/manufacturingWorksOfGoodDetail";
import "../../../../crm/customer/components/customer.css";

function SalesOrderCreateForm(props) {

    const [state, setState] = useState({
        goods: [],
        approvers: [],
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
        customerPromotions: [],
        shippingFee: "",
        deliveryTime: "",
        coin: "",
        priority: "",
        initialAmount: 0,
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
            symbol: "",
            ratio: "1",
        },
    })


    if (props.code !== state.code) {
        setState((state) => {
            return {
                ...state,
                code: props.code,
            }
        })
    }

    // componentDidMount() {
    //     props.getCustomers();
    // }

    const validateCustomer = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (value[0] === "title") {
            msg = "Giá trị không được để trống";
        }
        if (willUpdateState) {
            setState((state) => {
                return {
                    ...state,
                    customerError: msg,
                };
            });
        }
        return msg;
    };

    const handleCustomerChange = (value) => {
        if (value[0] !== "" && value[0] !== "title") {
            let customerInfo = props.customers.list.filter((item) => item._id === value[0]);
            let customerPromotions = customerInfo[0].promotions.map((promo) => ({ ...promo, checked: false, disabled: false })).filter((item) => item.status == 1);
            if (customerInfo.length) {
                setState({
                    ...state,
                    customer: customerInfo[0]._id,
                    customerName: customerInfo[0].name,
                    customerAddress: customerInfo[0].address,
                    customerPhone: customerInfo[0].mobilephoneNumber,
                    customerRepresent: customerInfo[0].represent,
                    customerTaxNumber: customerInfo[0].taxNumber,
                    customerEmail: customerInfo[0].email,
                    customerPromotions
                });
            }
        } else {
            setState((state) => {
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

        validateCustomer(value, true);
    };

    const setCustomerPromotions = (customerPromotions) => {
        setState((state) => {
            return {
                ...state,
                customerPromotions,
            };
        });
    }

    const setInitialAmount = (initialAmount) => {
        setState((state) => {
            return {
                ...state,
                initialAmount,
            };
        });
    }

    const handleCustomerEmailChange = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateEmail(translate, value);
        setState({
            ...state,
            customerEmail: value,
            customerEmailError: message,
        });
    };

    const handleCustomerPhoneChange = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        setState({
            ...state,
            customerPhone: value,
            customerPhoneError: message,
        });
    };

    const handleCustomerAddressChange = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        setState({
            ...state,
            customerAddress: value,
            customerAddressError: message,
        });
    };

    const handleCustomerRepresentChange = (e) => {
        let { value } = e.target;
        setState((state) => {
            return {
                ...state,
                customerRepresent: value,
            };
        });
    };

    const handleNoteChange = (e) => {
        let { value } = e.target;
        setState((state) => {
            return {
                ...state,
                note: value,
            };
        });
    };

    const validatePriority = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (value === "title") {
            msg = "Giá trị không được để trống";
        }
        if (willUpdateState) {
            setState((state) => {
                return {
                    ...state,
                    priorityError: msg,
                };
            });
        }
        return msg;
    };

    const handlePriorityChange = (value) => {
        setState((state) => {
            return {
                ...state,
                priority: value[0],
            };
        });
        validatePriority(value[0], true);
    };

    const validateOrganizationalUnit = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (value === "title") {
            msg = "Giá trị không được để trống";
        }
        if (willUpdateState) {
            setState((state) => {
                return {
                    ...state,
                    organizationalUnitError: msg,
                };
            });
        }
        return msg;
    };

    const handleOrganizationalUnitChange = (value) => {
        setState((state) => {
            return {
                ...state,
                organizationalUnit: value[0],
            };
        });
        validateOrganizationalUnit(value[0], true);
    };

    const validateApprovers = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value.length) {
            msg = "Giá trị không được để trống";
        } else {
            for (let index = 0; index < value.length; value++) {
                if (value[index] === "title") {
                    msg = "Không được chọn tiêu đề";
                }
            }
        }
        if (willUpdateState) {
            setState((state) => {
                return {
                    ...state,
                    approversError: msg,
                };
            });
        }
        return msg;
    };

    const handleApproversChange = (value) => {
        setState((state) => {
            return {
                ...state,
                approvers: value,
            };
        });
        validateApprovers(value, true);
    };

    const setCurrentStep = (e, step) => {
        e.preventDefault();
        setState({
            ...state,
            step,
        });
    };

    const setGoods = (goods) => {
        setState((state) => {
            return {
                ...state,
                goods,
            };
        });
    };

    const handleUseForeignCurrencyChange = (e) => {
        const { checked } = e.target;
        setState((state) => {
            return {
                ...state,
                isUseForeignCurrency: checked,
            };
        });
        if (!checked) {
            setState((state) => {
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

    const handleRatioOfCurrencyChange = (e) => {
        let { foreignCurrency } = state;
        let { value } = e.target;
        setState((state) => {
            return {
                ...state,
                foreignCurrency: {
                    ratio: value,
                    symbol: foreignCurrency.symbol,
                },
            };
        });
    };

    const handleSymbolOfForreignCurrencyChange = (e) => {
        let { foreignCurrency } = state;
        let { value } = e.target;
        setState((state) => {
            return {
                ...state,
                foreignCurrency: {
                    ratio: foreignCurrency.ratio,
                    symbol: value,
                },
            };
        });
    };

    const handleChangeCurrency = (value) => {
        let { foreignCurrency, standardCurrency } = state;
        setState((state) => {
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

    const handleDiscountsOfOrderValueChange = (data) => {
        setState((state) => {
            return {
                ...state,
                discountsOfOrderValue: data,
            };
        });
    };

    const setDiscountsOfOrderValueChecked = (discountsOfOrderValueChecked) => {
        setState((state) => {
            return {
                ...state,
                discountsOfOrderValueChecked,
            };
        });
    };

    const handleShippingFeeChange = (e) => {
        const { value } = e.target;
        setState((state) => {
            return {
                ...state,
                shippingFee: value,
            };
        });
    };

    const handleDeliveryTimeChange = (value) => {
        setState((state) => {
            return {
                ...state,
                deliveryTime: value,
            };
        });
    };

    const setCurrentSlasOfGood = (data) => {
        setState((state) => {
            return {
                ...state,
                currentSlasOfGood: data,
            };
        });
    };

    const setCurrentDiscountsOfGood = (data) => {
        setState((state) => {
            return {
                ...state,
                currentDiscountsOfGood: data,
            };
        });
    };

    const setCurrentManufacturingWorksOfGoods = (data) => {
        setState((state) => {
            return {
                ...state,
                currentManufacturingWorksOfGood: data,
            };
        });
    };

    const handleCoinChange = (coin) => {
        setState((state) => {
            return {
                ...state,
                coin: state.coin ? "" : coin, //Nếu đang checked thì bỏ checked
            };
        });
    };

    const getCoinOfAll = () => {
        let coinOfAll = 0;
        let { goods } = state;
        let { discountsOfOrderValue } = state;

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

    const setPaymentAmount = (paymentAmount) => {
        setState((state) => {
            return {
                ...state,
                paymentAmount,
            };
        });
    };

    const isValidateSalesOrderCreateInfo = () => {
        let { customer, customerEmail, customerPhone, customerAddress, priority, organizationalUnit, approvers } = state;
        let { translate } = props;

        if (
            validateCustomer(customer, false) ||
            validatePriority(priority, false) ||
            // validateOrganizationalUnit(organizationalUnit, false) ||
            validateApprovers(approvers, false) ||
            !ValidationHelper.validateEmail(translate, customerEmail).status ||
            !ValidationHelper.validateEmpty(translate, customerPhone).status ||
            !ValidationHelper.validateEmpty(translate, customerAddress).status
        ) {
            return false;
        } else {
            return true;
        }
    };

    const isValidateSalesOrderCreateGood = () => {
        let { goods } = state;
        if (goods && goods.length) {
            return true;
        } else {
            return false;
        }
    };

    const isValidateForm = () => {
        if (isValidateSalesOrderCreateInfo() && isValidateSalesOrderCreateGood()) {
            return true;
        } else {
            return false;
        }
    };

    const formatDiscountForSubmit = (discounts) => {
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

    const formatGoodForSubmit = () => {
        let { goods } = state;
        let goodMap = goods.map((item) => {
            return {
                good: item.good._id,
                pricePerBaseUnit: item.pricePerBaseUnit,
                pricePerBaseUnitOrigin: item.pricePerBaseUnitOrigin,
                salesPriceVariance: item.salesPriceVariance,
                quantity: item.quantity,
                serviceLevelAgreements: item.slasOfGood,
                taxs: item.taxs,
                discounts: item.discountsOfGood.length ? formatDiscountForSubmit(item.discountsOfGood) : [],
                note: item.note,
                amount: item.amount,
                amountAfterDiscount: item.amountAfterDiscount,
                amountAfterTax: item.amountAfterTax,
                manufacturingWorks: item.manufacturingWorks ? item.manufacturingWorks._id : undefined,
            };
        });
        return goodMap;
    };

    const save = async (e) => {
        e.preventDefault();
        if (isValidateForm()) {
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
                // organizationalUnit,
                approvers,
                priority,
                customerPromotions
            } = state;

            let allCoin = getCoinOfAll(); //Lấy tất cả các xu được tặng trong đơn

            let data = {
                code,
                customer,
                customerPhone,
                customerAddress,
                customerRepresent,
                customerEmail,
                priority,
                goods: formatGoodForSubmit(),
                discounts: discountsOfOrderValue.length ? formatDiscountForSubmit(discountsOfOrderValue) : [],
                shippingFee,
                deliveryTime: deliveryTime ? new Date(formatToTimeZoneDate(deliveryTime)) : undefined,
                coin,
                allCoin,
                // organizationalUnit,
                approvers: approvers.map((element) => {
                    return { approver: element };
                }),
                paymentAmount,
                note,
            };

            await props.createNewSalesOrder(data);
            await props.usePromotion(customer, { promoIndex: customerPromotions.findIndex((promo) => promo.checked) })
            await props.getCustomers({ getAll: true })
            setState((state) => {
                return {
                    ...state,
                    customer: "",
                    customerName: "",
                    customerAddress: "",
                    customerPhone: "",
                    customerRepresent: "",
                    customerTaxNumber: "",
                    customerEmail: "",
                    priority: "",
                    code: "",
                    shippingFee: "",
                    deliveryTime: "",
                    coin: "",
                    allCoin: "",
                    goods: [],
                    discountsOfOrderValue: [],
                    // organizationalUnit: "",
                    approvers: [],
                    paymentAmount: "",
                    note: "",
                    step: 0,
                    customerPromotions: []
                };
            });

            window.$(`#modal-add-sales-order`).modal("hide");
        }
    };

    let {
        code,
        note,
        customer,
        customerPromotions,
        customerName,
        customerAddress,
        customerPhone,
        customerRepresent,
        customerTaxNumber,
        customerEmail,
        priority,
        organizationalUnit,
        approvers,
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
        paymentAmount,
    } = state;

    let {
        customerError,
        customerEmailError,
        customerPhoneError,
        customerAddressError,
        priorityError,
        organizationalUnitError,
        approversError,
    } = state;

    let enableStepOne = isValidateSalesOrderCreateInfo();
    let enableStepTwo = isValidateSalesOrderCreateGood();
    let enableFormSubmit = enableStepOne && enableStepTwo;

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-add-sales-order`}
                isLoading={false}
                formID={`form-add-sales-order`}
                title={"Đơn hàng mới"}
                msg_success={"Thêm đơn thành công"}
                msg_faile={"Thêm đơn không thành công"}
                // disableSubmit={!isFormValidated()}
                // func={save}
                size="100"
                style={{ backgroundColor: "green" }}
                hasSaveButton={false}
            >
                <div className="nav-tabs-custom">
                    <ul className="breadcrumbs">
                        <li key="1">
                            <a
                                className={`${step >= 0 ? "quote-active-tab" : "quote-defaul-tab"}`}
                                onClick={(e) => setCurrentStep(e, 0)}
                                style={{ cursor: "pointer" }}
                            >
                                <span>Thông tin chung</span>
                            </a>
                        </li>
                        <li key="2">
                            <a
                                className={`${step >= 1 ? "quote-active-tab" : "quote-defaul-tab"} 
                                    ${enableStepOne ? "" : "disable-onclick-prevent"}`}
                                onClick={(e) => setCurrentStep(e, 1)}
                                style={{ cursor: "pointer" }}
                            >
                                <span>Chọn sản phẩm</span>
                            </a>
                        </li>
                        <li key="3">
                            <a
                                className={`${step >= 2 ? "quote-active-tab" : "quote-defaul-tab"} 
                                    ${enableStepOne && enableStepTwo ? "" : "disable-onclick-prevent"}`}
                                onClick={(e) => setCurrentStep(e, 2)}
                                style={{ cursor: "pointer" }}
                            >
                                <span>Chốt đơn</span>
                            </a>
                        </li>
                    </ul>
                    {foreignCurrency && foreignCurrency.ratio && foreignCurrency.symbol ? (
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
                                onChange={handleChangeCurrency}
                                multiple={false}
                            />
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <SlasOfGoodDetail currentSlasOfGood={currentSlasOfGood} />
                <DiscountOfGoodDetail currentDiscounts={currentDiscountsOfGood} />
                <ManufacturingWorksOfGoodDetail currentManufacturingWorksOfGood={currentManufacturingWorksOfGood} />
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
                                organizationalUnit={organizationalUnit}
                                approvers={approvers}
                                isUseForeignCurrency={isUseForeignCurrency}
                                foreignCurrency={foreignCurrency}
                                //handle
                                handleCustomerChange={handleCustomerChange}
                                handleCustomerAddressChange={handleCustomerAddressChange}
                                handleCustomerEmailChange={handleCustomerEmailChange}
                                handleCustomerPhoneChange={handleCustomerPhoneChange}
                                handleCustomerRepresentChange={handleCustomerRepresentChange}
                                handleNoteChange={handleNoteChange}
                                handleUseForeignCurrencyChange={handleUseForeignCurrencyChange}
                                handleRatioOfCurrencyChange={handleRatioOfCurrencyChange}
                                handleSymbolOfForreignCurrencyChange={handleSymbolOfForreignCurrencyChange}
                                handlePriorityChange={handlePriorityChange}
                                handleOrganizationalUnitChange={handleOrganizationalUnitChange}
                                handleApproversChange={handleApproversChange}
                                //Error Status
                                customerError={customerError}
                                customerEmailError={customerEmailError}
                                customerPhoneError={customerPhoneError}
                                customerAddressError={customerAddressError}
                                priorityError={priorityError}
                                organizationalUnitError={organizationalUnitError}
                                approversError={approversError}
                            />
                        )}
                        {step === 1 && (
                            <SalesOrderCreateGood
                                listGoods={goods}
                                setGoods={setGoods}
                                isUseForeignCurrency={isUseForeignCurrency}
                                foreignCurrency={foreignCurrency}
                                standardCurrency={standardCurrency}
                                currency={currency}
                                setCurrentSlasOfGood={(data) => {
                                    setCurrentSlasOfGood(data);
                                }}
                                setCurrentDiscountsOfGood={(data) => {
                                    setCurrentDiscountsOfGood(data);
                                }}
                                setCurrentManufacturingWorksOfGoods={(data) => {
                                    setCurrentManufacturingWorksOfGoods(data);
                                }}
                                setInitialAmount={(data) => setInitialAmount(data)}
                            />
                        )}
                        {step === 2 && (
                            <SalesOrderCreatePayment
                                paymentAmount={paymentAmount}
                                listGoods={goods}
                                customer={customer}
                                customerPromotions={customerPromotions}
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
                                handleDiscountsOfOrderValueChange={(data) => handleDiscountsOfOrderValueChange(data)}
                                setDiscountsOfOrderValueChecked={(checked) => setDiscountsOfOrderValueChecked(checked)}
                                handleShippingFeeChange={handleShippingFeeChange}
                                handleDeliveryTimeChange={handleDeliveryTimeChange}
                                handleCoinChange={handleCoinChange}
                                setCurrentSlasOfGood={(data) => {
                                    setCurrentSlasOfGood(data);
                                }}
                                setCurrentDiscountsOfGood={(data) => {
                                    setCurrentDiscountsOfGood(data);
                                }}
                                setCurrentManufacturingWorksOfGoods={(data) => {
                                    setCurrentManufacturingWorksOfGoods(data);
                                }}
                                setPaymentAmount={(data) => setPaymentAmount(data)}
                                saveSalesOrder={save}
                                setCustomerPromotions={(data) => setCustomerPromotions(data)}
                            />
                        )}
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { customers } = state.crm;
    return { customers };
}

const mapDispatchToProps = {
    getCustomers: CrmCustomerActions.getCustomers,
    createNewSalesOrder: SalesOrderActions.createNewSalesOrder,
    usePromotion: CrmCustomerActions.usePromotion
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderCreateForm));
