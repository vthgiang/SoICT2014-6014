import React, { Component, useEffect, useState } from "react";
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from "../../../../../common-components";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { connect } from "react-redux";
import { formatDate } from "../../../../../helpers/formatDate";
import { withTranslate } from "react-redux-multilingual";

function CreateDiscountOnGoods(props) {

    let EMPTY_GOOD = {
        goodId: "1",
        goodObject: "",
        expirationDate: "",
        discountedPrice: "",
    };

    const [state, setState] = useState({
        good: Object.assign({}, EMPTY_GOOD),
        goodOptions: [],
        listGoods: [],
    })

    if (props.discountType !== state.discountType || props.formality !== state.formality) {
        setState((state) => {
            return {
                ...state,
                goodOptions: [],
                listGoods: [],
                good: {
                    goodId: "1",
                    goodObject: "",
                    expirationDate: "",
                    discountedPrice: "",
                },
                discountType: props.discountType,
                formality: props.formality,
            };
        })
    }

    useEffect(() => {
        
        let enableIndexEdit =
            props.indexEdittingDiscount !== props.indexEdittingDiscount || state.discountCode !== props.discountCode;
        let discountOnGoodsIsNotNull = props.discountOnGoods && props.discountOnGoods.length;

        if (props.editDiscountDetail && enableIndexEdit && discountOnGoodsIsNotNull) {
            let { listGoods, goodOptions } = state;
            goodOptions = [];
            listGoods = [];
            // Lấy các thông tin của good đưa vào goodObject va day good vao listGoods
            const { goods } = props;
            const { listGoodsByType } = goods;
            listGoods = props.discountOnGoods.map((item) => {
                let good = {};
                let goodArrFilter = listGoodsByType.filter((x) => x._id === item.good._id);
                if (goodArrFilter) {
                    good.goodObject = goodArrFilter[0];
                    good.goodId = item.good._id;
                    good.expirationDate = item.expirationDate ? formatDate(item.expirationDate) : undefined;
                    good.discountedPrice = item.discountedPrice;
                }

                // filter good ra khoi getAllGoods() va gan state vao goodOption
                if (goodOptions.length === 0) {
                    goodOptions = getAllGoods().filter((x) => x.value !== good.goodId);
                } else {
                    // Nếu state đang là goodOptions thi vẫn phải filter những thằng còn lại
                    goodOptions = goodOptions.filter((x) => x.value !== item.good._id);
                }
                return good;
            });

            // Cập nhật lại good state
            setState((state) => ({
                ...state,
                listGoods: [...listGoods],
                goodOptions: [...goodOptions],
                discountCode: props.discountCode,
            }));
            return false;
        }
    },[props.discountCode])

    const getAllGoods = () => {
        const { translate, goods } = props;
        let listGoods = [
            {
                value: "1",
                text: "---Chọn các mặt hàng---",
            },
        ];

        const { listGoodsByType } = goods;

        if (listGoodsByType) {
            listGoodsByType.map((item) => {
                listGoods.push({
                    value: item._id,
                    text: item.code + "-" + item.name,
                });
            });
        }

        return listGoods;
    };

    const handleGoodChange = (value) => {
        const goodId = value[0];
        validateGoodChange(goodId, true);
    };

    const validateGoodChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value === "1") {
            msg = "Vui lòng không chọn mặt hàng này";
        }

        if (willUpdateState) {
            let { good } = state;

            good.goodId = value;

            const { goods } = props;
            const { listGoodsByType } = goods;
            let goodArrFilter = listGoodsByType.filter((x) => x._id === good.goodId);
            if (goodArrFilter) {
                good.goodObject = goodArrFilter[0];
            }

            setState((state) => ({
                ...state,
                good: { ...good },
                goodError: msg,
            }));
        }
        return msg;
    };

    const handleClearGood = async (e) => {
        e.preventDefault();

        await setState((state) => {
            return {
                ...state,
                good: Object.assign({}, EMPTY_GOOD),
            };
        });
    };

    const handleChangeExpirationDate = (value) => {
        if (!value) {
            value = null;
        }
        let { good } = state;
        good.expirationDate = value;
        setState({
            ...state,
            good: { ...good },
        });
    };

    const handleAddGood = (e) => {
        e.preventDefault();
        let { listGoods, good } = state;

        // Lấy các thông tin của good đưa vào goodObject va day good vao listGoods
        const { goods } = props;
        const { listGoodsByType } = goods;
        let goodArrFilter = listGoodsByType.filter((x) => x._id === good.goodId);
        if (goodArrFilter) {
            good.goodObject = goodArrFilter[0];
        }

        listGoods.push(good);

        // filter good ra khoi getAllGoods() va gan state vao goodOption
        let { goodOptions } = state;
        if (goodOptions.length === 0) {
            goodOptions = getAllGoods().filter((x) => x.value !== good.goodId);
        } else {
            // Nếu state đang là goodOptions thi vẫn phải filter những thằng còn lại
            goodOptions = goodOptions.filter((x) => x.value !== good.goodId);
            console.log(goodOptions);
        }

        // Cập nhật lại good state

        good = Object.assign({}, EMPTY_GOOD);

        setState((state) => ({
            ...state,
            listGoods: [...listGoods],
            goodOptions: [...goodOptions],
            good: { ...good },
        }));
    };

    //DELETE AND EDIT
    const handleDeleteGood = (good, index) => {
        let { listGoods, goodOptions } = state;
        // Loại bỏ phần tử good ra khỏi listGoods
        listGoods.splice(index, 1);

        setState((state) => ({
            ...state,
            listGoods: [...listGoods],
            goodOptions: [
                ...goodOptions,
                {
                    value: good.goodId,
                    text: good.goodObject.code + " - " + good.goodObject.name,
                },
            ],
        }));
    };

    const handleEditGood = (good, index) => {
        let { goodOptions } = state;
        setState({
            ...state,
            editGood: true,
            good: { ...good },
            goodOptions: [
                ...goodOptions,
                {
                    value: good.goodId,
                    text: good.goodObject.code + " - " + good.goodObject.name,
                },
            ],
            indexEditting: index,
        });
    };

    const handleCancelEditGood = (e) => {
        e.preventDefault();
        let { listGoods, indexEditting, goodOptions } = state;
        goodOptions = goodOptions.filter((x) => x.value !== listGoods[indexEditting].goodId);
        setState({
            ...state,
            editGood: false,
            good: Object.assign({}, EMPTY_GOOD),
            goodOptions: goodOptions,
        });
    };

    const handleSaveEditGood = () => {
        let { listGoods, good, indexEditting, goodOptions } = state;
        goodOptions = goodOptions.filter((x) => x.value !== good.goodId);
        listGoods[indexEditting] = state.good;
        setState({
            ...state,
            editGood: false,
            good: Object.assign({}, EMPTY_GOOD),
            goodOptions: goodOptions,
            listGoods: [...listGoods],
        });
    };

    const handleDiscountedPriceChange = (e) => {
        let { value } = e.target;
        validateDiscountedPriceChange(value, true);
    };
    const validateDiscountedPriceChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value === "") {
            msg = "Giá trị không được để trống";
        } else if (value < 0) {
            msg = "Giá không là số âm";
        }
        if (willUpdateState) {
            let { good } = state;
            good.discountedPrice = value;
            setState((state) => ({
                ...state,
                good: { ...good },
                discountedPriceError: msg,
            }));
        }
        return msg;
    };

    const submitChange = () => {
        let { listGoods } = state;
        let dataSubmit = listGoods.map((good) => {
            return {
                good: {
                    _id: good.goodId,
                    name: good.goodObject.name,
                    code: good.goodObject.code,
                },
                expirationDate: good.expirationDate,
                discountedPrice: good.discountedPrice,
            };
        });

        props.handleSubmitDiscountOnGoods(dataSubmit);
    };

    const isGoodValidated = () => {
        if (validateGoodChange(state.good.goodId, false) || validateDiscountedPriceChange(state.good.discountedPrice, false)) {
            return false;
        }
        return true;
    };

    const isFormValidated = () => {
        const { listGoods } = state;
        if (listGoods.length === 0) {
            return false;
        }
        return true;
    };

    const { translate } = props;
    const { actionType } = props;
    const { goodOptions, good, listGoods, discountedPriceError } = state;
    const { goodId, discountedPrice, expirationDate } = good;
    return (
        <DialogModal
            modalID={`modal-${actionType}-discount-on-goods`}
            isLoading={false}
            formID={`form-${actionType}-discount-on-goods`}
            title={"Các mặt hàng áp dụng"}
            size="75"
            style={{ backgroundColor: "green" }}
            func={submitChange}
            disableSubmit={!isFormValidated()}
        >
            <form id={`form-${actionType}-discount-bonus-goods`}>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Thêm hàng tặng kèm</legend>
                    <div className={`form-group`}>
                        <label className="control-label">
                            Mặt hàng áp dụng <span className="attention"> * </span>
                        </label>
                        <SelectBox
                            id={`select-${actionType}-discount-on-goods`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={goodId}
                            items={goodOptions.length ? goodOptions : getAllGoods()}
                            onChange={handleGoodChange}
                            multiple={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>Hạn sử dụng</label>
                        <DatePicker
                            id={`date_picker_${actionType}_discount_expiration_date_of_discount_on_good`}
                            value={expirationDate}
                            onChange={handleChangeExpirationDate}
                            disabled={false}
                        />
                    </div>
                    <div className={`form-group ${!discountedPriceError ? "" : "has-error"}`}>
                        <label className="control-label">
                            Giá khuyến mãi <span className="attention"> * </span>
                        </label>
                        <div>
                            <input
                                type="number"
                                className="form-control"
                                placeholder={"vd: 10000"}
                                value={discountedPrice}
                                onChange={handleDiscountedPriceChange}
                            />
                        </div>
                        <ErrorLabel content={discountedPriceError} />
                    </div>
                    <div className="pull-right" style={{ marginBottom: "10px" }}>
                        {state.editGood ? (
                            <React.Fragment>
                                <button className="btn btn-success" onClick={handleCancelEditGood} style={{ marginLeft: "10px" }}>
                                    Hủy chỉnh sửa
                                </button>
                                <button
                                    className="btn btn-success"
                                    disabled={!isGoodValidated()}
                                    onClick={handleSaveEditGood}
                                    style={{ marginLeft: "10px" }}
                                >
                                    Lưu
                                </button>
                            </React.Fragment>
                        ) : (
                            <button
                                className="btn btn-success"
                                style={{ marginLeft: "10px" }}
                                disabled={!isGoodValidated()}
                                onClick={handleAddGood}
                            >
                                Thêm
                            </button>
                        )}
                        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearGood}>
                            Xóa trắng
                        </button>
                    </div>
                </fieldset>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã mặt hàng</th>
                            <th>Tên mặt hàng</th>
                            <th>Hạn sử dụng</th>
                            <th>Giá khuyến mãi</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!listGoods || listGoods.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <center>Chưa có dữ liệu</center>
                                </td>
                            </tr>
                        ) : (
                            listGoods.map((good, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{good.goodObject.code}</td>
                                        <td>{good.goodObject.name}</td>
                                        <td>{good.expirationDate}</td>
                                        <td>{formatCurrency(good.discountedPrice)}</td>
                                        <td>
                                            <a href="#abc" className="edit" title="Sửa" onClick={() => handleEditGood(good, index)}>
                                                <i className="material-icons">edit</i>
                                            </a>
                                            <a href="#abc" className="delete" title="Xóa" onClick={() => handleDeleteGood(good, index)}>
                                                <i className="material-icons">delete</i>
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </form>
        </DialogModal>
    );
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

export default connect(mapStateToProps, null)(withTranslate(CreateDiscountOnGoods));
