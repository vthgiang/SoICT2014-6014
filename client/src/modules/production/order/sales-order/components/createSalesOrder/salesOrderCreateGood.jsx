import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { GoodActions } from "../../../../common-production/good-management/redux/actions";
import { DiscountActions } from "../../../discount/redux/actions";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import GoodSelected from "./goodCreateSteps/goodSelected";
import ApplyDiscount from "./goodCreateSteps/applyDiscount";
import Payment from "./goodCreateSteps/payment";
import "../salesOrder.css";

function SalesOrderCreateGood(props) {

    const [state, setState] = useState({
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
    })

    useEffect(() => {
        props.getAllGoodsByType({ type: "product" });
    }, [])

    useEffect(  () => {
        
             getCheckedForGood(props.goods.goodItems);
    }, [props.goods.goodItems])   

    useEffect(() => {
        //Lấy số lượng hàng tồn kho cho các mặt hàng
        if (props.goods.goodItems.inventoryByGoodId !== state.inventory && state.good !== "title") {
            setState({
                ...state,
                inventory: props.goods.goodItems.inventoryByGoodId,
            });
        }
    },[props.goods.goodItems.inventoryByGoodId])

    const nextStep = (e) => {
        e.preventDefault();
        let { step, steps } = state;
        step++;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        setState({
            steps: steps,
            step: step,
        });
    };

    const preStep = (e) => {
        e.preventDefault();
        let { step, steps } = state;
        step--;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        setState((state) => {
            return {
                ...state,
                steps: steps,
                step: step,
            };
        });
    };

    const setCurrentStep = (e, step) => {
        e.preventDefault();
        let { steps } = state;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        setState((state) => {
            return {
                ...state,
                steps: steps,
                step: step,
            };
        });
    };

    const handleDiscountsChange = (data) => {
        setState((state) => {
            return {
                ...state,
                discountsOfGood: data,
            };
        });
    };

    const setDiscountsOfGoodChecked = (discountsOfGoodChecked) => {
        setState((state) => {
            return {
                ...state,
                discountsOfGoodChecked,
            };
        });
    };

    const validateGood = (value, willUpdateState = true) => {
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
                    goodError: msg,
                };
            });
        }
        return msg;
    };

    const handleGoodChange = async (value) => {
        if (value[0] !== "title") {
            let { listGoodsByType } = props.goods;
            const goodInfo = listGoodsByType.filter((item) => item._id === value[0]);
            if (goodInfo.length) {
                await setState((state) => {
                    return {
                        ...state,
                        good: goodInfo[0]._id,
                        code: goodInfo[0].code,
                        goodName: goodInfo[0].name,
                        baseUnit: goodInfo[0].baseUnit,
                        pricePerBaseUnit: goodInfo[0].pricePerBaseUnit ? goodInfo[0].pricePerBaseUnit : "",
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

            await props.getItemsForGood(value[0]);
        } else {
            setState((state) => {
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

        validateGood(value, true);
    };

    const handleManufacturingWorkChange = (value) => {
        let { listManufacturingWorks } = props.goods.goodItems;
        let manufacturingWorksInfo = listManufacturingWorks.find((element) => element._id === value[0]);

        if (value[0] !== "title") {
            setState((state) => {
                return {
                    ...state,
                    manufacturingWorks: {
                        _id: manufacturingWorksInfo._id,
                        code: manufacturingWorksInfo.code,
                        name: manufacturingWorksInfo.name,
                        description: manufacturingWorksInfo.description,
                        address: manufacturingWorksInfo.address,
                    },
                };
            });
        } else {
            setState((state) => {
                return {
                    ...state,
                    manufacturingWorks: {
                        _id: "title",
                        code: "",
                        name: "",
                        description: "",
                        address: "",
                    },
                };
            });
        }
    };

    const hasDiscountsOnGoodChecker = () => {
        let { discountsOfGood } = state;
        let checked = false;
        discountsOfGood.forEach((element) => {
            if (element.formality == "5") {
                checked = true;
            }
        });
        return checked;
    };

    const validatePrice = (value, willUpdateState = true) => {
        let msg = undefined;
        let checkDiscountOnGoods = hasDiscountsOnGoodChecker(); //Nếu mặt hàng là giảm giá tồn kho thì không cần salesPriceVariance

        let { salesPriceVariance, pricePerBaseUnitOrigin } = state;
        if (!value) {
            msg = "Giá trị không được để trống!";
        } else if (parseInt(value) < 0) {
            msg = "Giá không được âm";
        } else if (parseInt(value) < pricePerBaseUnitOrigin - salesPriceVariance && !checkDiscountOnGoods) {
            msg = `Giá không được chênh lệch quá ${salesPriceVariance ? formatCurrency(salesPriceVariance) : 0} so với giá gốc: ${pricePerBaseUnitOrigin ? formatCurrency(pricePerBaseUnitOrigin) : 0
                } `;
        }

        if (willUpdateState) {
            setState((state) => {
                return {
                    ...state,
                    pricePerBaseUnit: value,
                    pricePerBaseUnitError: msg,
                };
            });
        }
        return msg;
    };

    const handlePriceChange = (e) => {
        let { value } = e.target;
        validatePrice(value, true);
    };

    const validateQuantity = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được để trống!";
        } else if (value <= 0) {
            msg = "Số lượng phải lớn hơn 0";
        }

        if (willUpdateState) {
            setState((state) => {
                return {
                    ...state,
                    quantity: value,
                    quantityError: msg,
                };
            });
        }
        return msg;
    };

    const handleQuantityChange = (e) => {
        let { value } = e.target;
        if (value >= 0) {
            validateQuantity(value, true);
        }
    };

    const handleSlasOfGoodChange = (value) => {
        setState((state) => {
            return {
                ...state,
                slasOfGood: value,
            };
        });
    };

    const setSlasOfGoodChecked = (slasOfGoodChecked) => {
        setState((state) => {
            return {
                ...state,
                slasOfGoodChecked,
            };
        });
    };

    const handleNoteChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            note: value,
        });
    };

    const handleTaxsChange = (value) => {
        setState((state) => {
            return {
                ...state,
                taxs: value,
            };
        });
    };

    const getOriginAmountOfGood = () => {
        const { quantity, pricePerBaseUnit } = state;
        let originAmount = 0;
        if (pricePerBaseUnit && quantity) {
            originAmount = pricePerBaseUnit * quantity;
        }

        originAmount = Math.round(originAmount * 100) / 100;

        return originAmount;
    };

    const getAmountAfterApplyDiscount = () => {
        let amountAfterApplyDiscount = getOriginAmountOfGood();
        const { discountsOfGood, pricePerBaseUnit } = state;
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
                setState({
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

    const getAmountAfterApplyTax = () => {
        const { listTaxsByGoodId } = props.goods.goodItems;
        let amountAfterApplyTax = getAmountAfterApplyDiscount();
        const { taxs } = state;
        let listTaxs = taxs.map((item) => {
            let tax = listTaxsByGoodId.find((element) => element.code == item);
            if (tax) {
                return tax;
            }
        });

        if (listTaxs && listTaxs.length) {
            amountAfterApplyTax = ((listTaxs[0].percent + 100) / 100) * amountAfterApplyTax;
        }

        amountAfterApplyTax = Math.round(amountAfterApplyTax * 100) / 100;
        return amountAfterApplyTax;
    };

    const isValidateGoodSelected = () => {
        let { good, pricePerBaseUnit, quantity } = state;
        if (validateGood([good], false) || validatePrice(pricePerBaseUnit, false) || validateQuantity(quantity, false)) {
            return false;
        } else {
            return true;
        }
    };

    const addGood = (e) => {
        e.preventDefault();
        if (isValidateGoodSelected()) {
            const { listTaxsByGoodId } = props.goods.goodItems;
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
                manufacturingWorks,
            } = state;

            let { listGoods } = props;

            let amount = getOriginAmountOfGood();
            let amountAfterDiscount = getAmountAfterApplyDiscount();
            let amountAfterTax = getAmountAfterApplyTax();

            let listTaxs = taxs.map((item) => {
                let tax = listTaxsByGoodId.find((element) => element.code == item);
                if (tax) {
                    return tax;
                }
            });

            let listSlas = [];
            let { listSlasByGoodId } = props.goods.goodItems;
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
                manufacturingWorks: manufacturingWorks ? (manufacturingWorks._id !== "title" ? manufacturingWorks : undefined) : undefined,
            };

            listGoods && listGoods.push(additionGood);
            steps = steps.map((step, index) => {
                step.active = !index ? true : false;
                return step;
            });
            props.setGoods(listGoods);
            setState((state) => {
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
                    manufacturingWorks: { _id: "title" },
                    step: 0,
                    steps,
                };
            });
        }
    };

    const deleteGood = (goodId) => {
        let { listGoods } = props;
        let goodsFilter = listGoods.filter((item) => item.good._id !== goodId);
        props.setGoods(goodsFilter);
    };

    const getDiscountsCheckedForEditGood = (item, quantity, goodId) => {
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

    const getSlasCheckedForEditGood = (goodItems, slasOfGoodChecked, slaChecked) => {
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

    const getCheckedForGood = (goodItems) => {
        //lấy những sla và discount đã check box set vào state
        let { discountsOfGoodChecked, slasOfGoodChecked, discountsOfGood, slasOfGood, quantity, good } = state;
        let { listDiscountsByGoodId } = goodItems;

        if (discountsOfGood) {
            discountsOfGood.forEach((element) => {
                //checked các khuyến mãi đã có trong danh mục
                let discount = listDiscountsByGoodId.find((dis) => dis._id === element._id);
                if (discount) {
                    let checked = getDiscountsCheckedForEditGood(discount, quantity, good);
                    discountsOfGoodChecked[`${checked.id}`] = checked.status;
                }
            });
        }

        //Trong trường hợp gọi nhưng slasOfGood đã chuyển về dạng Object để checkbox rồi
        if (typeof slasOfGood === "object") {
            for (let key in slasOfGood) {
                let element = {
                    _id: key,
                    descriptions: slasOfGood[key],
                };
                slasOfGoodChecked = getSlasCheckedForEditGood(goodItems, slasOfGoodChecked, element);
            }
        }

        setState({
            ...state,
            discountsOfGoodChecked,
            slasOfGoodChecked,
        });
    };

    const handleEditGood = async (item, index) => {
        await props.getItemsForGood(item.good._id);

        let { listGoodsByType } = props.goods;
        const goodInfo = listGoodsByType.filter((good) => good._id === item.good._id);

        let slasForEdit = {};
        item.slasOfGood.forEach((element) => {
            slasForEdit[element._id] = element.descriptions;
        });

        await setState({
            ...state,
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
            manufacturingWorks: item.manufacturingWorks,
        });

        getCheckedForGood(props.goods.goodItems); //gọi để checked trong trường hợp không thay đổi goodId
    };

    const handleCancelEditGood = async (e) => {
        e.preventDefault();
        let { steps } = state;
        steps = steps.map((step, index) => {
            step.active = !index ? true : false;
            return step;
        });
        await setState((state) => {
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
                manufacturingWorks: { _id: "title" },
                step: 0,
                steps,
            };
        });
    };

    const handleSaveEditGood = (e) => {
        e.preventDefault();
        if (isValidateGoodSelected()) {
            const { listTaxsByGoodId } = props.goods.goodItems;
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
                manufacturingWorks,
            } = state;

            let { listGoods } = props;

            let amount = getOriginAmountOfGood();
            let amountAfterDiscount = getAmountAfterApplyDiscount();
            let amountAfterTax = getAmountAfterApplyTax();

            let listTaxs = taxs.map((item) => {
                let tax = listTaxsByGoodId.find((element) => element.code == item);
                if (tax) {
                    return tax;
                }
            });

            let listSlas = [];
            let { listSlasByGoodId } = props.goods.goodItems;
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
                manufacturingWorks: manufacturingWorks ? (manufacturingWorks._id !== "title" ? manufacturingWorks : undefined) : undefined,
            };

            listGoods[indexEditting] = additionGood;
            steps = steps.map((step, index) => {
                step.active = !index ? true : false;
                return step;
            });
            props.setGoods(listGoods);
            setState((state) => {
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
                    manufacturingWorks: { _id: "title" },
                    step: 0,
                    steps,
                };
            });
        }
    };

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
        manufacturingWorks,
    } = state;

    let { goodError, pricePerBaseUnitError, quantityError } = state;

    const { setCurrentSlasOfGood, setCurrentDiscountsOfGood, setCurrentManufacturingWorksOfGoods } = props;
    let { listGoods } = props;

    const { isUseForeignCurrency, foreignCurrency, standardCurrency, currency } = props;

    let originAmount = getOriginAmountOfGood();
    let amountAfterApplyDiscount = getAmountAfterApplyDiscount();
    let amountAfterApplyTax = getAmountAfterApplyTax();

    let isGoodValidate = isValidateGoodSelected();

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
                                        setCurrentStep(e, index);
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
                                    manufacturingWorks={manufacturingWorks}
                                    handleGoodChange={handleGoodChange}
                                    handlePriceChange={handlePriceChange}
                                    handleQuantityChange={handleQuantityChange}
                                    handleManufacturingWorkChange={handleManufacturingWorkChange}
                                    //log error
                                    pricePerBaseUnitError={pricePerBaseUnitError}
                                    goodError={goodError}
                                    quantityError={quantityError}
                                />
                            )}
                            {step === 1 && (
                                <ApplyDiscount
                                    quantity={quantity}
                                    handleQuantityChange={handleQuantityChange}
                                    good={good}
                                    goodName={goodName}
                                    code={code}
                                    baseUnit={baseUnit}
                                    inventory={inventory}
                                    pricePerBaseUnit={pricePerBaseUnit}
                                    handleDiscountsChange={(data) => handleDiscountsChange(data)}
                                    setDiscountsChecked={(checked) => setDiscountsOfGoodChecked(checked)}
                                    discountsChecked={discountsOfGoodChecked}
                                    discountsOfGood={discountsOfGood}
                                    slasOfGood={slasOfGood}
                                    handleSlasOfGoodChange={(data) => handleSlasOfGoodChange(data)}
                                    slasOfGoodChecked={slasOfGoodChecked}
                                    setSlasOfGoodChecked={(checked) => setSlasOfGoodChecked(checked)}
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
                                    handleTaxsChange={handleTaxsChange}
                                    handleNoteChange={handleNoteChange}
                                />
                            )}
                        </div>
                    </div>

                    {/* ---------------------END-STEP--------------------- */}

                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, minHeight: "250px" }}>
                        <div style={{ padding: 10, backgroundColor: "white" }}>
                            <div className="form-group">
                                <strong>Thành tiền: </strong>
                                <span style={{ float: "right" }}>{originAmount ? formatCurrency(originAmount) : ` 0`}</span>
                            </div>
                            <div className="form-group">
                                <strong>Khuyến mãi: </strong>
                                <span style={{ float: "right" }} className="text-red">
                                    {amountAfterApplyDiscount
                                        ? formatCurrency(Math.round((amountAfterApplyDiscount - originAmount) * 100) / 100)
                                        : ` 0`}
                                </span>
                            </div>
                            <div className="form-group">
                                <strong>Tổng tiền trước thuế: </strong>
                                <span style={{ float: "right" }}>
                                    {amountAfterApplyDiscount ? formatCurrency(amountAfterApplyDiscount) : ` 0 `}
                                </span>
                            </div>
                            <div className="form-group">
                                <strong>Thuế: </strong>
                                <span style={{ float: "right" }}>
                                    {amountAfterApplyTax
                                        ? formatCurrency(Math.round((amountAfterApplyTax - amountAfterApplyDiscount) * 100) / 100)
                                        : ` 0`}
                                </span>
                            </div>

                            <div className="form-group" style={{ borderTop: "solid 0.3px #c5c5c5", padding: "10px 0px" }}>
                                <strong>Tổng tiền sau thuế: </strong>
                                <span style={{ float: "right", fontSize: "18px" }} className="text-red">
                                    {amountAfterApplyTax ? formatCurrency(amountAfterApplyTax) : `0 `}
                                </span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center" }}>
                                {/* Thêm sản phẩm mới */}
                                {step === steps.length - 1 && !editGood ? (
                                    <div className="quote-add-good-button">
                                        <button disabled={!isGoodValidate} className="btn btn-success" onClick={addGood}>
                                            Thêm sản phẩm
                                        </button>
                                    </div>
                                ) : (
                                    ""
                                )}

                                {/* Lưu chỉnh sửa */}
                                {step === steps.length - 1 && editGood ? (
                                    <div className="quote-save-edit-good-button">
                                        <button disabled={!isGoodValidate} className="btn btn-success" onClick={handleSaveEditGood}>
                                            Lưu
                                        </button>
                                    </div>
                                ) : (
                                    ""
                                )}

                                {/* Hủy chỉnh sửa */}
                                {editGood ? (
                                    <div className="quote-cancel-edit-good-button">
                                        <button className="btn btn-success" onClick={handleCancelEditGood}>
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
                <table className="table table-bordered not-sort">
                    <thead>
                        <tr>
                            <th title={"STT"}>STT</th>
                            <th title={"Mã sản phẩm"}>Mã sản phẩm</th>
                            <th title={"Tên sản phẩm"}>Tên sản phẩm</th>
                            <th title={"Đơn vị tính"}>Đ/v tính</th>
                            <th title={"Giá niêm yết"}>Giá niêm yết</th>
                            <th title={"giá tính tiền"}>giá tính tiền</th>
                            <th title={"Số lượng"}>Số lượng</th>
                            <th title={"Khuyến mãi"}>Khuyến mãi</th>
                            <th title={"Thành tiền"}>Thành tiền</th>
                            <th title={"Thuế"}>Thuế</th>
                            <th title={"Tổng tiền"}>Tổng tiền</th>
                            <th>Cam kết chất lượng</th>
                            {/* <th title={"Yêu cầu sản xuất"}>Yêu cầu s/x</th> */}
                            <th title={"Ghi chú"}>Ghi chú</th>
                            <th title={"Hành động"}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody id={`sales-order-goods-table`}>
                        {listGoods &&
                            listGoods.length !== 0 &&
                            listGoods.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.good ? item.good.code : ""}</td>
                                    <td>{item.good ? item.good.name : ""}</td>
                                    <td>{item.good ? item.good.baseUnit : ""}</td>
                                    <td>{item.pricePerBaseUnitOrigin ? formatCurrency(item.pricePerBaseUnitOrigin) : `0 `}</td>
                                    <td>{item.pricePerBaseUnit ? formatCurrency(item.pricePerBaseUnit) : `0 `}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        <a
                                            onClick={() => setCurrentDiscountsOfGood(item.discountsOfGood)}
                                            style={{
                                                cursor: "pointer",
                                            }}
                                            data-toggle="modal"
                                            data-backdrop="static"
                                            href={"#modal-create-sales-order-discounts-of-good-detail"}
                                            title="Click để xem chi tiết"
                                        >
                                            {item.amount && item.amountAfterDiscount
                                                ? formatCurrency(item.amount - item.amountAfterDiscount)
                                                : `0 `}
                                        </a>
                                    </td>
                                    <td>{item.amountAfterDiscount ? formatCurrency(item.amountAfterDiscount) : ""}</td>
                                    <td>
                                        {item.amountAfterDiscount && item.amountAfterTax
                                            ? formatCurrency(item.amountAfterTax - item.amountAfterDiscount)
                                            : `0`}
                                        ({item.taxs.length && item.taxs[0] ? item.taxs[0].percent : "0"}%)
                                    </td>
                                    <td>{item.amountAfterTax ? formatCurrency(item.amountAfterTax) : `0 `}</td>
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
                                                href={"#modal-create-sales-order-slas-of-good-detail"}
                                                onClick={() => setCurrentSlasOfGood(item.slasOfGood)}
                                            >
                                                Chi tiết &ensp;
                                                <i className="fa fa-arrow-circle-right"></i>
                                            </a>
                                        </div>
                                    </td>
                                    {/* <td>
                                            {item.manufacturingWorks ? (
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
                                                        href={"#modal-create-sales-order-manufacturing-works-of-good-detail"}
                                                        onClick={() => setCurrentManufacturingWorksOfGoods(item.manufacturingWorks)}
                                                    >
                                                        Đang thiết lập &ensp;
                                                    </a>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </td> */}
                                    <td>{item.note}</td>
                                    <td>
                                        <a className="edit text-yellow">
                                            <i className="material-icons" onClick={() => handleEditGood(item, index)}>
                                                edit
                                            </i>
                                        </a>
                                        <a className="edit text-red">
                                            <i className="material-icons" onClick={() => deleteGood(item.good._id)}>
                                                delete
                                            </i>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        {listGoods && listGoods.length !== 0 && (
                            <tr>
                                <td colSpan={7} style={{ fontWeight: 600 }}>
                                    <center>Tổng</center>
                                </td>
                                <td style={{ fontWeight: 600 }}>
                                    {formatCurrency(
                                        listGoods.reduce((accumulator, currentValue) => {
                                            return accumulator + (currentValue.amount - currentValue.amountAfterDiscount);
                                        }, 0)
                                    )}
                                </td>
                                <td style={{ fontWeight: 600 }}>
                                    {formatCurrency(
                                        listGoods.reduce((accumulator, currentValue) => {
                                            return accumulator + currentValue.amountAfterDiscount;
                                        }, 0)
                                    )}
                                </td>
                                <td style={{ fontWeight: 600 }}>
                                    {formatCurrency(
                                        listGoods.reduce((accumulator, currentValue) => {
                                            return accumulator + (currentValue.amountAfterTax - currentValue.amountAfterDiscount);
                                        }, 0)
                                    )}
                                </td>
                                <td style={{ fontWeight: 600 }}>
                                    {formatCurrency(
                                        listGoods.reduce((accumulator, currentValue) => {
                                            return accumulator + currentValue.amountAfterTax;
                                        }, 0)
                                    )}
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

function mapStateToProps(state) {
    const { goods, discounts } = state;
    return { goods, discounts };
}

const mapDispatchToProps = {
    getAllGoodsByType: GoodActions.getAllGoodsByType,
    getItemsForGood: GoodActions.getItemsForGood,
    getDiscountForOrderValue: DiscountActions.getDiscountForOrderValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderCreateGood));
