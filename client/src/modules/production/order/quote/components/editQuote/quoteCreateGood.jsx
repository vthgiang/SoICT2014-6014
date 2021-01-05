import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { GoodActions } from "../../../../common-production/good-management/redux/actions";
import { DiscountActions } from "../../../discount/redux/actions";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import GoodSelected from "./goodCreateSteps/goodSelected";
import ApplyDiscount from "./goodCreateSteps/applyDiscount";
import Payment from "./goodCreateSteps/payment";
import "../quote.css";
class QuoteCreateGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            good: "",
            discountsOfGood: [],
            discountsOfGoodChecked: {},
            slasOfGood: [],
            slasOfGoodChecked: {},
            taxs: [],
            step: 0,
            steps: [
                {
                    label: "Chọn sản phẩm",
                    active: true,
                },
                {
                    label: "Các chính sách",
                    active: false,
                },
                {
                    label: "Thuế",
                    active: false,
                },
            ],
        };
    }

    componentDidMount() {
        this.props.getAllGoodsByType({ type: "product" });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (this.props.goods.goodItems.goodId !== nextProps.goods.goodItems.goodId) {
            await this.getCheckedForGood(nextProps.goods.goodItems);
            return false;
        }

        //Lấy số lượng hàng tồn kho cho các mặt hàng
        if (nextProps.goods.goodItems.inventoryByGoodId !== nextState.inventory && nextState.good !== "title") {
            this.setState({
                inventory: nextProps.goods.goodItems.inventoryByGoodId,
            });
        }
        return true;
    };

    nextStep = (e) => {
        e.preventDefault();
        let { step, steps } = this.state;
        step++;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        this.setState({
            steps: steps,
            step: step,
        });
    };
    preStep = (e) => {
        e.preventDefault();
        let { step, steps } = this.state;
        step--;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        this.setState((state) => {
            return {
                ...state,
                steps: steps,
                step: step,
            };
        });
    };

    setCurrentStep = (e, step) => {
        e.preventDefault();
        let { steps } = this.state;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        this.setState((state) => {
            return {
                ...state,
                steps: steps,
                step: step,
            };
        });
    };

    handleDiscountsChange = (data) => {
        this.setState((state) => {
            return {
                ...state,
                discountsOfGood: data,
            };
        });
    };

    setDiscountsOfGoodChecked = (discountsOfGoodChecked) => {
        this.setState((state) => {
            return {
                ...state,
                discountsOfGoodChecked,
            };
        });
    };

    validateGood = (value, willUpdateState = true) => {
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
                    goodError: msg,
                };
            });
        }
        return msg;
    };

    handleGoodChange = async (value) => {
        if (value[0] !== "title") {
            let { listGoodsByType } = this.props.goods;

            const goodInfo = listGoodsByType.filter((item) => item._id === value[0]);
            if (goodInfo.length) {
                await this.setState((state) => {
                    return {
                        ...state,
                        good: goodInfo[0]._id,
                        code: goodInfo[0].code,
                        goodName: goodInfo[0].name,
                        baseUnit: goodInfo[0].baseUnit,
                        pricePerBaseUnit: goodInfo[0].pricePerBaseUnit,
                        pricePerBaseUnitOrigin: goodInfo[0].pricePerBaseUnit, //giá gốc
                        salesPriceVariance: goodInfo[0].salesPriceVariance ? goodInfo[0].salesPriceVariance : 0,
                        pricePerBaseUnitError: undefined,
                        taxs: [],
                        slasOfGood: [],
                        slasOfGoodChecked: {},
                        discountsOfGood: [],
                        discountsOfGoodChecked: {},
                        quantity: "",
                    };
                });
            }

            await this.props.getItemsForGood(value[0]);
        } else {
            this.setState((state) => {
                return {
                    ...state,
                    good: value[0],
                    code: "",
                    goodName: "",
                    baseUnit: "",
                    pricePerBaseUnit: "",
                    pricePerBaseUnitOrigin: "", //giá gốc
                    inventory: "",
                    salesPriceVariance: "",
                    pricePerBaseUnitError: undefined,
                    taxs: [],
                    slasOfGood: [],
                    slasOfGoodChecked: {},
                    discountsOfGood: [],
                    discountsOfGoodChecked: {},
                    quantity: "",
                };
            });
        }

        this.validateGood(value, true);
    };

    hasDiscountsOnGoodChecker = () => {
        let { discountsOfGood } = this.state;
        let checked = false;
        discountsOfGood.forEach((element) => {
            if (element.formality == "5") {
                checked = true;
            }
        });
        return checked;
    };

    validatePrice = (value, willUpdateState = true) => {
        let msg = undefined;
        let checkDiscountOnGoods = this.hasDiscountsOnGoodChecker(); //Nếu mặt hàng là giảm giá tồn kho thì không cần salesPriceVariance

        let { salesPriceVariance, pricePerBaseUnitOrigin } = this.state;
        if (!value) {
            msg = "Giá trị không được để trống!";
        } else if (parseInt(value) < 0) {
            msg = "Giá không được âm";
        } else if (parseInt(value) < pricePerBaseUnitOrigin - salesPriceVariance && !checkDiscountOnGoods) {
            msg = `Giá không được chênh lệch quá ${salesPriceVariance ? formatCurrency(salesPriceVariance) : 0} (vnđ) so với giá gốc: ${
                pricePerBaseUnitOrigin ? formatCurrency(pricePerBaseUnitOrigin) : 0
            } (vnđ)`;
        }

        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    pricePerBaseUnit: value,
                    pricePerBaseUnitError: msg,
                };
            });
        }
        return msg;
    };

    handlePriceChange = (e) => {
        let { value } = e.target;
        this.validatePrice(value, true);
    };

    validateQuantity = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được để trống!";
        } else if (value <= 0) {
            msg = "Số lượng phải lớn hơn 0";
        }

        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    quantity: value,
                    quantityError: msg,
                };
            });
        }
        return msg;
    };

    handleQuantityChange = (e) => {
        let { value } = e.target;
        if (value >= 0) {
            this.validateQuantity(value, true);
        }
    };

    handleSlasOfGoodChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                slasOfGood: value,
            };
        });
    };

    setSlasOfGoodChecked = (slasOfGoodChecked) => {
        this.setState((state) => {
            return {
                ...state,
                slasOfGoodChecked,
            };
        });
    };

    handleNoteChange = (e) => {
        let { value } = e.target;
        this.setState({
            note: value,
        });
    };

    handleTaxsChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                taxs: value,
            };
        });
    };

    getOriginAmountOfGood = () => {
        const { quantity, pricePerBaseUnit } = this.state;
        let originAmount = 0;
        if (pricePerBaseUnit && quantity) {
            originAmount = pricePerBaseUnit * quantity;
        }

        originAmount = Math.round(originAmount * 100) / 100;

        return originAmount;
    };

    getAmountAfterApplyDiscount = () => {
        let amountAfterApplyDiscount = this.getOriginAmountOfGood();
        const { discountsOfGood, pricePerBaseUnit } = this.state;
        let discountForFormality = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
        };
        discountsOfGood.forEach((element) => {
            discountForFormality[element.formality].push(element);
        });

        if (discountForFormality[5].length) {
            if (discountForFormality[5][0].discountOnGoods.discountedPrice !== pricePerBaseUnit) {
                this.setState({
                    pricePerBaseUnit: discountForFormality[5][0].discountOnGoods.discountedPrice,
                });
            }
        }
        if (discountForFormality[0].length) {
            amountAfterApplyDiscount = amountAfterApplyDiscount - discountForFormality[0][0].discountedCash;
        }
        if (discountForFormality[1].length) {
            amountAfterApplyDiscount = (amountAfterApplyDiscount * (100 - discountForFormality[1][0].discountedPercentage)) / 100;
        }

        amountAfterApplyDiscount = Math.round(amountAfterApplyDiscount * 100) / 100;

        return amountAfterApplyDiscount;
    };

    getAmountAfterApplyTax = () => {
        const { listTaxsByGoodId } = this.props.goods.goodItems;
        let amountAfterApplyTax = this.getAmountAfterApplyDiscount();
        const { taxs } = this.state;
        let listTaxs = [];
        taxs.forEach((item) => {
            let tax = listTaxsByGoodId.find((element) => element.code == item);
            if (tax) {
                listTaxs.push(Object.assign({}, tax));
            }
        });

        if (listTaxs && listTaxs.length) {
            amountAfterApplyTax = ((listTaxs[0].percent + 100) / 100) * amountAfterApplyTax;
        }

        amountAfterApplyTax = Math.round(amountAfterApplyTax * 100) / 100;
        return amountAfterApplyTax;
    };

    isValidateGoodSelected = () => {
        let { good, pricePerBaseUnit, quantity } = this.state;
        if (this.validateGood([good], false) || this.validatePrice(pricePerBaseUnit, false) || this.validateQuantity(quantity, false)) {
            return false;
        } else {
            return true;
        }
    };

    addGood = (e) => {
        e.preventDefault();
        if (this.isValidateGoodSelected()) {
            const { listTaxsByGoodId } = this.props.goods.goodItems;
            let {
                taxs,
                slasOfGood,
                pricePerBaseUnit,
                discountsOfGood,
                good,
                goodName,
                baseUnit,
                quantity,
                code,
                pricePerBaseUnitOrigin,
                note,
                steps,
                salesPriceVariance,
            } = this.state;

            let { listGoods } = this.props;

            let amount = this.getOriginAmountOfGood();
            let amountAfterDiscount = this.getAmountAfterApplyDiscount();
            let amountAfterTax = this.getAmountAfterApplyTax();

            console.log("TAXS", taxs);

            let listTaxs = taxs.map((item) => {
                let tax = listTaxsByGoodId.find((element) => element.code == item);
                if (tax) {
                    return tax;
                }
            });

            let listSlas = [];
            let { listSlasByGoodId } = this.props.goods.goodItems;
            for (const key in slasOfGood) {
                let slaInfo = listSlasByGoodId.find((element) => element._id === key);
                listSlas.push({
                    _id: key,
                    title: slaInfo.title,
                    descriptions: slasOfGood[key],
                });
            }

            let additionGood = {
                good: {
                    _id: good,
                    name: goodName,
                    baseUnit: baseUnit,
                    code: code,
                },
                pricePerBaseUnit: pricePerBaseUnit,
                pricePerBaseUnitOrigin: pricePerBaseUnitOrigin,
                quantity: quantity,
                taxs: listTaxs,
                slasOfGood: listSlas,
                discountsOfGood: discountsOfGood,
                note: note,
                amount,
                amountAfterDiscount,
                amountAfterTax,
                salesPriceVariance,
            };

            console.log("additionGood", additionGood);

            listGoods.push(additionGood);
            steps = steps.map((step, index) => {
                step.active = !index ? true : false;
                return step;
            });
            this.props.setGoods(listGoods);
            this.setState((state) => {
                return {
                    ...state,
                    discountsOfGood: [],
                    discountsOfGoodChecked: {},
                    taxs: [],
                    slasOfGood: [],
                    slasOfGoodChecked: {},
                    quantity: "",
                    pricePerBaseUnit: "",
                    pricePerBaseUnitError: undefined,
                    pricePerBaseUnitOrigin: "",
                    salesPriceVariance: "",
                    note: "",
                    inventory: "",
                    baseUnit: "",
                    good: "title",
                    code: "",
                    goodName: "",
                    step: 0,
                    steps,
                };
            });
        }
    };

    deleteGood = (goodId) => {
        let { listGoods } = this.props;
        let goodsFilter = listGoods.filter((item) => item.good._id !== goodId);
        this.props.setGoods(goodsFilter);
    };

    getDiscountsCheckedForEditGood = (item, quantity, goodId) => {
        let checked = { id: "", status: false };
        item.discounts.forEach((discount, index) => {
            let checkGoodInDiscount = discount.discountOnGoods.find((element) => goodId === element.good._id); //Kiểm tra mặt hàng này có được trong danh mục khuyến mãi
            if (checkGoodInDiscount) {
                let disabled = false;
                if (discount.minimumThresholdToBeApplied) {
                    if (parseInt(quantity) < discount.minimumThresholdToBeApplied) {
                        disabled = true;
                    }
                }
                if (discount.maximumThresholdToBeApplied) {
                    if (parseInt(quantity) > discount.maximumThresholdToBeApplied) {
                        disabled = true;
                    }
                }
                if (!disabled) {
                    checked = { id: `${item._id}-${index}`, status: true };
                }
            }
        });

        return checked;
    };

    getSlasCheckedForEditGood = (goodItems, slasOfGoodChecked, slaChecked) => {
        let { listSlasByGoodId } = goodItems;
        let slaInfo = listSlasByGoodId.find((element) => element._id === slaChecked._id);

        if (slaInfo) {
            slaChecked.descriptions.forEach((desOfSlaChecked) => {
                slaInfo.descriptions.forEach((desOfSlaInfo, index) => {
                    if (desOfSlaInfo === desOfSlaChecked) {
                        slasOfGoodChecked[`${slaChecked._id}-${index}`] = true;
                    }
                });
            });
        }

        return slasOfGoodChecked;
    };

    getCheckedForGood = (goodItems) => {
        //lấy những sla và discount đã check box set vào state
        let { discountsOfGoodChecked, slasOfGoodChecked, discountsOfGood, slasOfGood, quantity, good } = this.state;
        let { listDiscountsByGoodId } = goodItems;

        if (discountsOfGood) {
            discountsOfGood.forEach((element) => {
                //checked các khuyến mãi đã có trong danh mục
                let discount = listDiscountsByGoodId.find((dis) => dis._id === element._id);
                if (discount) {
                    let checked = this.getDiscountsCheckedForEditGood(discount, quantity, good);
                    discountsOfGoodChecked[`${checked.id}`] = checked.status;
                }
            });
        }

        if (slasOfGood && slasOfGood.length) {
            slasOfGood.forEach((element) => {
                slasOfGoodChecked = this.getSlasCheckedForEditGood(goodItems, slasOfGoodChecked, element);
            });
        } //Trong trường hợp gọi nhưng slasOfGood đã chuyển về dạng Object để checkbox rồi
        else if (typeof slasOfGood === "object") {
            for (let key in slasOfGood) {
                let element = {
                    _id: key,
                    descriptions: slasOfGood[key],
                };
                slasOfGoodChecked = this.getSlasCheckedForEditGood(goodItems, slasOfGoodChecked, element);
            }
        }

        this.setState({
            discountsOfGoodChecked,
            slasOfGoodChecked,
            // slasOfGood: slasOfGood ? slasForEdit : slasOfGood,
        });
    };

    handleEditGood = async (item, index) => {
        await this.props.getItemsForGood(item.good._id);

        let { listGoodsByType } = this.props.goods;
        const goodInfo = listGoodsByType.filter((good) => good._id === item.good._id);

        let slasForEdit = {};
        item.slasOfGood.forEach((element) => {
            slasForEdit[element._id] = element.descriptions;
        });

        await this.setState({
            editGood: true,
            indexEditting: index,
            taxs: item.taxs.map((tax) => tax.code),
            quantity: item.quantity,
            pricePerBaseUnit: item.pricePerBaseUnit,
            pricePerBaseUnitError: undefined,
            pricePerBaseUnitOrigin: item.pricePerBaseUnitOrigin,
            salesPriceVariance: item.salesPriceVariance,
            note: item.note,
            goodName: item.good.name,
            good: item.good._id,
            baseUnit: item.good.baseUnit,
            code: item.good.code,
            discountsOfGood: item.discountsOfGood,
            slasOfGood: slasForEdit,
        });

        this.getCheckedForGood(this.props.goods.goodItems); //gọi để checked trong trường hợp không thay đổi goodId
    };

    handleCancelEditGood = (e) => {
        e.preventDefault();
        let { steps } = this.state;
        steps = steps.map((step, index) => {
            step.active = !index ? true : false;
            return step;
        });
        this.setState((state) => {
            return {
                ...state,
                indexEditting: "",
                editGood: false,
                discountsOfGood: [],
                discountsOfGoodChecked: {},
                taxs: [],
                slasOfGood: [],
                slasOfGoodChecked: {},
                quantity: "",
                pricePerBaseUnit: "",
                pricePerBaseUnitError: undefined,
                pricePerBaseUnitOrigin: "",
                salesPriceVariance: "",
                note: "",
                inventory: "",
                baseUnit: "",
                good: "title",
                code: "",
                goodName: "",
                step: 0,
                steps,
            };
        });
    };

    handleSaveEditGood = (e) => {
        e.preventDefault();
        if (this.isValidateGoodSelected()) {
            const { listTaxsByGoodId } = this.props.goods.goodItems;
            let {
                taxs,
                slasOfGood,
                pricePerBaseUnit,
                discountsOfGood,
                good,
                goodName,
                baseUnit,
                quantity,
                code,
                pricePerBaseUnitOrigin,
                note,
                steps,
                salesPriceVariance,
                indexEditting,
            } = this.state;

            let { listGoods } = this.props;

            let amount = this.getOriginAmountOfGood();
            let amountAfterDiscount = this.getAmountAfterApplyDiscount();
            let amountAfterTax = this.getAmountAfterApplyTax();

            let listTaxs = taxs.map((item) => {
                let tax = listTaxsByGoodId.find((element) => element.code == item);
                if (tax) {
                    return tax;
                }
            });

            let listSlas = [];
            let { listSlasByGoodId } = this.props.goods.goodItems;
            for (const key in slasOfGood) {
                let slaInfo = listSlasByGoodId.find((element) => element._id === key);
                listSlas.push({
                    _id: key,
                    title: slaInfo.title,
                    descriptions: slasOfGood[key],
                });
            }

            let additionGood = {
                good: {
                    _id: good,
                    name: goodName,
                    baseUnit: baseUnit,
                    code: code,
                },
                pricePerBaseUnit: pricePerBaseUnit,
                pricePerBaseUnitOrigin: pricePerBaseUnitOrigin,
                quantity: quantity,
                taxs: listTaxs,
                slasOfGood: listSlas,
                discountsOfGood: discountsOfGood,
                note: note,
                amount,
                amountAfterDiscount,
                amountAfterTax,
                salesPriceVariance,
            };

            listGoods[indexEditting] = additionGood;
            steps = steps.map((step, index) => {
                step.active = !index ? true : false;
                return step;
            });
            this.props.setGoods(listGoods);
            this.setState((state) => {
                return {
                    ...state,
                    indexEditting: "",
                    editGood: false,
                    discountsOfGood: [],
                    discountsOfGoodChecked: {},
                    taxs: [],
                    slasOfGood: [],
                    slasOfGoodChecked: {},
                    quantity: "",
                    pricePerBaseUnit: "",
                    pricePerBaseUnitError: undefined,
                    pricePerBaseUnitOrigin: "",
                    salesPriceVariance: "",
                    note: "",
                    inventory: "",
                    baseUnit: "",
                    good: "",
                    code: "",
                    goodName: "title",
                    step: 0,
                    steps,
                };
            });
        }
    };

    render() {
        let {
            good,
            goodName,
            code,
            pricePerBaseUnit,
            baseUnit,
            inventory,
            quantity,
            discountsOfGood,
            discountsOfGoodChecked,
            slasOfGood,
            slasOfGoodChecked,
            taxs,
            note,
            steps,
            step,
            editGood,
        } = this.state;

        let { goodError, pricePerBaseUnitError, quantityError } = this.state;

        const { setCurrentSlasOfGood, setCurrentDiscountsOfGood } = this.props;
        let { listGoods } = this.props;

        const { isUseForeignCurrency, foreignCurrency, standardCurrency, currency } = this.props;

        let originAmount = this.getOriginAmountOfGood();
        let amountAfterApplyDiscount = this.getAmountAfterApplyDiscount();
        let amountAfterApplyTax = this.getAmountAfterApplyTax();

        let isGoodValidate = this.isValidateGoodSelected();

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <fieldset className="scheduler-border" style={{ padding: 10 }}>
                    <legend className="scheduler-border">Các mặt hàng</legend>
                    {/* ---------------------STEP--------------------- */}
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ backgroundColor: "#f5f5f5" }}>
                        <div className="timeline">
                            <div className="timeline-progress" style={{ width: `${(step * 100) / (steps.length - 1)}%` }}></div>
                            <div className="timeline-items">
                                {steps.map((item, index) => (
                                    <div
                                        className={`timeline-item ${item.active ? "active" : ""} 
                                        ${!isGoodValidate && index > 0 ? "disable-onclick-prevent" : ""}`}
                                        key={index}
                                        onClick={(e) => {
                                            this.setCurrentStep(e, index);
                                        }}
                                    >
                                        <div className="timeline-contain">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8" style={{ padding: 10, height: "100%" }}>
                            <div
                                style={{ padding: 10, backgroundColor: "white", height: "100%" }}
                                className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                            >
                                {step === 0 && (
                                    <GoodSelected
                                        good={good}
                                        goodName={goodName}
                                        pricePerBaseUnit={pricePerBaseUnit}
                                        baseUnit={baseUnit}
                                        inventory={inventory}
                                        quantity={quantity}
                                        handleGoodChange={this.handleGoodChange}
                                        handlePriceChange={this.handlePriceChange}
                                        handleQuantityChange={this.handleQuantityChange}
                                        //log error
                                        pricePerBaseUnitError={pricePerBaseUnitError}
                                        goodError={goodError}
                                        quantityError={quantityError}
                                    />
                                )}
                                {step === 1 && (
                                    <ApplyDiscount
                                        quantity={quantity}
                                        handleQuantityChange={this.handleQuantityChange}
                                        good={good}
                                        goodName={goodName}
                                        code={code}
                                        baseUnit={baseUnit}
                                        inventory={inventory}
                                        pricePerBaseUnit={pricePerBaseUnit}
                                        handleDiscountsChange={(data) => this.handleDiscountsChange(data)}
                                        setDiscountsChecked={(checked) => this.setDiscountsOfGoodChecked(checked)}
                                        discountsChecked={discountsOfGoodChecked}
                                        discountsOfGood={discountsOfGood}
                                        slasOfGood={slasOfGood}
                                        handleSlasOfGoodChange={(data) => this.handleSlasOfGoodChange(data)}
                                        slasOfGoodChecked={slasOfGoodChecked}
                                        setSlasOfGoodChecked={(checked) => this.setSlasOfGoodChecked(checked)}
                                        //log error
                                        quantityError={quantityError}
                                    />
                                )}
                                {step === 2 && (
                                    <Payment
                                        quantity={quantity}
                                        good={good}
                                        goodName={goodName}
                                        code={code}
                                        baseUnit={baseUnit}
                                        inventory={inventory}
                                        pricePerBaseUnit={pricePerBaseUnit}
                                        taxs={taxs}
                                        note={note}
                                        handleTaxsChange={this.handleTaxsChange}
                                        handleNoteChange={this.handleNoteChange}
                                    />
                                )}
                            </div>
                        </div>

                        {/* ---------------------END-STEP--------------------- */}

                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, minHeight: "250px" }}>
                            <div style={{ padding: 10, backgroundColor: "white" }}>
                                <div className="form-group">
                                    <strong>Thành tiền: </strong>
                                    <span style={{ float: "right" }}>
                                        {originAmount ? formatCurrency(originAmount) + ` (${currency.symbol})` : `0 (${currency.symbol})`}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <strong>Khuyến mãi: </strong>
                                    <span style={{ float: "right" }} className="text-red">
                                        {amountAfterApplyDiscount
                                            ? formatCurrency(Math.round((amountAfterApplyDiscount - originAmount) * 100) / 100) +
                                              ` (${currency.symbol})`
                                            : `0 (${currency.symbol})`}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <strong>Tổng tiền trước thuế: </strong>
                                    <span style={{ float: "right" }}>
                                        {amountAfterApplyDiscount
                                            ? formatCurrency(amountAfterApplyDiscount) + ` (${currency.symbol})`
                                            : `0 (${currency.symbol})`}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <strong>Thuế: </strong>
                                    <span style={{ float: "right" }}>
                                        {amountAfterApplyTax
                                            ? formatCurrency(Math.round((amountAfterApplyTax - amountAfterApplyDiscount) * 100) / 100) +
                                              ` (${currency.symbol})`
                                            : `0 (${currency.symbol})`}
                                    </span>
                                </div>

                                <div className="form-group" style={{ borderTop: "solid 0.3px #c5c5c5", padding: "10px 0px" }}>
                                    <strong>Tổng tiền sau thuế: </strong>
                                    <span style={{ float: "right", fontSize: "18px" }} className="text-red">
                                        {amountAfterApplyTax
                                            ? formatCurrency(amountAfterApplyTax) + ` (${currency.symbol})`
                                            : `0 (${currency.symbol})`}
                                    </span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {/* Thêm sản phẩm mới */}
                                    {step === steps.length - 1 && !editGood ? (
                                        <div className="quote-add-good-button">
                                            <button disabled={!isGoodValidate} className="btn btn-success" onClick={this.addGood}>
                                                Thêm sản phẩm
                                            </button>
                                        </div>
                                    ) : (
                                        ""
                                    )}

                                    {/* Lưu chỉnh sửa */}
                                    {step === steps.length - 1 && editGood ? (
                                        <div className="quote-save-edit-good-button">
                                            <button disabled={!isGoodValidate} className="btn btn-success" onClick={this.handleSaveEditGood}>
                                                Lưu
                                            </button>
                                        </div>
                                    ) : (
                                        ""
                                    )}

                                    {/* Hủy chỉnh sửa */}
                                    {editGood ? (
                                        <div className="quote-cancel-edit-good-button">
                                            <button className="btn btn-success" onClick={this.handleCancelEditGood}>
                                                Hủy chỉnh sửa
                                            </button>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={"pull-right"} style={{ padding: 10 }}></div>
                        </div>
                    </div>

                    {/* Hiển thị bảng */}
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th title={"STT"}>STT</th>
                                <th title={"Mã sản phẩm"}>Mã sản phẩm</th>
                                <th title={"Tên sản phẩm"}>Tên sản phẩm</th>
                                <th title={"Đơn vị tính"}>Đ/v tính</th>
                                <th title={"Giá niêm yết"}>Giá niêm yết (vnđ)</th>
                                <th title={"giá tính tiền"}>giá tính tiền (vnđ)</th>
                                <th title={"Số lượng"}>Số lượng</th>
                                <th title={"Khuyến mãi"}>Khuyến mãi</th>
                                <th title={"Thành tiền"}>Thành tiền</th>
                                <th title={"Thuế"}>Thuế</th>
                                <th title={"Tổng tiền"}>Tổng tiền</th>
                                <th>Cam kết chất lượng</th>
                                <th title={"Ghi chú"}>Ghi chú</th>
                                <th title={"Hành động"}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody id={`quote-goods-table`}>
                            {listGoods &&
                                listGoods.length !== 0 &&
                                listGoods.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.good ? item.good.code : ""}</td>
                                        <td>{item.good ? item.good.name : ""}</td>
                                        <td>{item.good ? item.good.baseUnit : ""}</td>
                                        <td>
                                            {item.pricePerBaseUnitOrigin
                                                ? formatCurrency(item.pricePerBaseUnitOrigin) + ` (${currency.symbol})`
                                                : `0 (${currency.symbol})`}
                                        </td>
                                        <td>
                                            {item.pricePerBaseUnit
                                                ? formatCurrency(item.pricePerBaseUnit) + ` (${currency.symbol})`
                                                : `0 (${currency.symbol})`}
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            <a
                                                onClick={() => setCurrentDiscountsOfGood(item.discountsOfGood)}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                data-toggle="modal"
                                                data-backdrop="static"
                                                href={"#modal-edit-quote-discounts-of-good-detail"}
                                                title="Click để xem chi tiết"
                                            >
                                                {item.amount && item.amountAfterDiscount
                                                    ? formatCurrency(item.amount - item.amountAfterDiscount) + ` (${currency.symbol})`
                                                    : `0 (${currency.symbol})`}
                                            </a>
                                        </td>
                                        <td>{item.amountAfterDiscount ? formatCurrency(item.amountAfterDiscount) : ""}</td>
                                        <td>
                                            {item.amountAfterDiscount && item.amountAfterTax
                                                ? formatCurrency(item.amountAfterTax - item.amountAfterDiscount) + ` (${currency.symbol})`
                                                : `0 (${currency.symbol})`}
                                            ({item.taxs.length ? item.taxs[0].percent : "0"}%)
                                        </td>
                                        <td>
                                            {item.amountAfterTax
                                                ? formatCurrency(item.amountAfterTax) + ` (${currency.symbol})`
                                                : `0 (${currency.symbol})`}
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    display: "flex",
                                                }}
                                            >
                                                <a
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    data-toggle="modal"
                                                    data-backdrop="static"
                                                    href={"#modal-edit-quote-slas-of-good-detail"}
                                                    onClick={() => setCurrentSlasOfGood(item.slasOfGood)}
                                                >
                                                    Chi tiết &ensp;
                                                    <i className="fa fa-arrow-circle-right"></i>
                                                </a>
                                            </div>
                                        </td>
                                        <td>{item.note}</td>
                                        <td>
                                            <a className="edit text-yellow">
                                                <i className="material-icons" onClick={() => this.handleEditGood(item, index)}>
                                                    edit
                                                </i>
                                            </a>
                                            <a className="edit text-red">
                                                <i className="material-icons" onClick={() => this.deleteGood(item.good._id)}>
                                                    delete
                                                </i>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            {listGoods.length !== 0 && (
                                <tr>
                                    <td colSpan={7} style={{ fontWeight: 600 }}>
                                        <center>Tổng</center>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {formatCurrency(
                                            listGoods.reduce((accumulator, currentValue) => {
                                                return accumulator + (currentValue.amount - currentValue.amountAfterDiscount);
                                            }, 0)
                                        ) + ` (${currency.symbol})`}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {formatCurrency(
                                            listGoods.reduce((accumulator, currentValue) => {
                                                return accumulator + currentValue.amountAfterDiscount;
                                            }, 0)
                                        ) + ` (${currency.symbol})`}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {formatCurrency(
                                            listGoods.reduce((accumulator, currentValue) => {
                                                return accumulator + (currentValue.amountAfterTax - currentValue.amountAfterDiscount);
                                            }, 0)
                                        ) + ` (${currency.symbol})`}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {formatCurrency(
                                            listGoods.reduce((accumulator, currentValue) => {
                                                return accumulator + currentValue.amountAfterTax;
                                            }, 0)
                                        ) + ` (${currency.symbol})`}
                                    </td>
                                    <td colSpan={3}></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </fieldset>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { goods, discounts } = state;
    return { goods, discounts };
}

const mapDispatchToProps = {
    getAllGoodsByType: GoodActions.getAllGoodsByType,
    getItemsForGood: GoodActions.getItemsForGood,
    getDiscountForOrderValue: DiscountActions.getDiscountForOrderValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuoteCreateGood));
