import React, { Component } from "react";
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from "../../../../../common-components";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

class CreateDiscountOnGoods extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            goodId: "1",
            goodObject: "",
            expirationDateOfDiscountOnGood: "",
            discountedPrice: "",
        };
        this.state = {
            good: Object.assign({}, this.EMPTY_GOOD),
            goodOptions: [],
            listGoods: [],
        };
    }

    getAllGoods = () => {
        const { translate, goods } = this.props;
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

    handleGoodChange = (value) => {
        const goodId = value[0];
        this.validateGoodChange(goodId, true);
    };

    validateGoodChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "1") {
            msg = "Vui lòng không chọn mặt hàng này";
        }

        if (willUpdateState) {
            let { good } = this.state;

            good.goodId = value;

            const { goods } = this.props;
            const { listGoodsByType } = goods;
            let goodArrFilter = listGoodsByType.filter((x) => x._id === good.goodId);
            if (goodArrFilter) {
                good.goodObject = goodArrFilter[0];
            }

            this.setState((state) => ({
                ...state,
                good: { ...good },
                goodError: msg,
            }));
        }
        return msg;
    };

    handleClearGood = async (e) => {
        e.preventDefault();

        await this.setState((state) => {
            return {
                ...state,
                good: Object.assign({}, this.EMPTY_GOOD),
            };
        });
    };

    handleChangeExpirationDate = (value) => {
        if (!value) {
            value = null;
        }
        let { good } = this.state;
        good.expirationDateOfDiscountOnGood = value;
        this.setState({
            ...this.state,
            good: { ...good },
        });
    };

    handleAddGood = (e) => {
        e.preventDefault();
        let { listGoods, good } = this.state;

        // Lấy các thông tin của good đưa vào goodObject va day good vao listGoods
        const { goods } = this.props;
        const { listGoodsByType } = goods;
        let goodArrFilter = listGoodsByType.filter((x) => x._id === good.goodId);
        if (goodArrFilter) {
            good.goodObject = goodArrFilter[0];
        }

        listGoods.push(good);

        // filter good ra khoi getAllGoods() va gan state vao goodOption
        let { goodOptions } = this.state;
        if (goodOptions.length === 0) {
            goodOptions = this.getAllGoods().filter((x) => x.value !== good.goodId);
        } else {
            // Nếu state đang là goodOptions thi vẫn phải filter những thằng còn lại
            goodOptions = goodOptions.filter((x) => x.value !== good.goodId);
            console.log(goodOptions);
        }

        // Cập nhật lại good state

        good = Object.assign({}, this.EMPTY_GOOD);

        this.setState((state) => ({
            ...state,
            listGoods: [...listGoods],
            goodOptions: [...goodOptions],
            good: { ...good },
        }));
    };

    //DELETE AND EDIT
    handleDeleteGood = (good, index) => {
        let { listGoods, goodOptions } = this.state;
        // Loại bỏ phần tử good ra khỏi listGoods
        listGoods.splice(index, 1);

        this.setState((state) => ({
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

    handleEditGood = (good, index) => {
        let { goodOptions } = this.state;
        this.setState({
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

    handleCancelEditGood = (e) => {
        e.preventDefault();
        let { listGoods, indexEditting, goodOptions } = this.state;
        goodOptions = goodOptions.filter((x) => x.value !== listGoods[indexEditting].goodId);
        this.setState({
            editGood: false,
            good: Object.assign({}, this.EMPTY_GOOD),
            goodOptions: goodOptions,
        });
    };

    handleSaveEditGood = () => {
        let { listGoods, good, indexEditting, goodOptions } = this.state;
        goodOptions = goodOptions.filter((x) => x.value !== good.goodId);
        listGoods[indexEditting] = this.state.good;
        this.setState({
            editGood: false,
            good: Object.assign({}, this.EMPTY_GOOD),
            goodOptions: goodOptions,
            listGoods: [...listGoods],
        });
    };

    handleDiscountedPriceChange = (e) => {
        let { value } = e.target;
        this.validateDiscountedPriceChange(value, true);
    };

    validateDiscountedPriceChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = "Giá trị không được để trống";
        } else if (value < 0) {
            msg = "Giá không là số âm";
        }
        if (willUpdateState) {
            let { good } = this.state;
            good.discountedPrice = value;
            this.setState((state) => ({
                ...state,
                good: { ...good },
                discountedPriceError: msg,
            }));
        }
        return msg;
    };

    submitChange = () => {
        let { listGoods } = this.state;
        let dataSubmit = listGoods.map((good) => {
            return {
                good: good.goodId,
                expirationDate: good.expirationDateOfDiscountOnGood,
                discountedPrice: good.discountedPrice,
            };
        });

        this.props.handleSubmitDiscountOnGoods(dataSubmit);
    };

    isGoodValidated = () => {
        if (this.validateGoodChange(this.state.good.goodId, false) || this.validateDiscountedPriceChange(this.state.good.discountedPrice, false)) {
            return false;
        }
        return true;
    };

    isFormValidated = () => {
        const { listGoods } = this.state;
        if (listGoods.length === 0) {
            return false;
        }
        return true;
    };

    render() {
        const { translate } = this.props;
        const { goodOptions, good, listGoods, discountedPriceError } = this.state;
        const { goodId, discountedPrice, expirationDateOfDiscountOnGood } = good;
        return (
            <DialogModal
                modalID={`modal-create-discount-on-goods`}
                isLoading={false}
                formID={`form-create-discount-on-goods`}
                title={"Các mặt hàng áp dụng"}
                size="75"
                style={{ backgroundColor: "green" }}
                func={this.submitChange}
                disableSubmit={!this.isFormValidated()}
            >
                <form id={`form-create-discount-bonus-goods`}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Thêm hàng tặng kèm</legend>
                        <div className={`form-group`}>
                            <label className="control-label">
                                Mặt hàng áp dụng <span className="attention"> * </span>
                            </label>
                            <SelectBox
                                id={`select-discount-on-goods`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={goodId}
                                items={goodOptions.length ? goodOptions : this.getAllGoods()}
                                onChange={this.handleGoodChange}
                                multiple={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hạn sử dụng</label>
                            <DatePicker
                                id="date_picker_discount_expiration_date_of_discount_on_good"
                                value={expirationDateOfDiscountOnGood}
                                onChange={this.handleChangeExpirationDate}
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
                                    onChange={this.handleDiscountedPriceChange}
                                />
                            </div>
                            <ErrorLabel content={discountedPriceError} />
                        </div>
                        <div className="pull-right" style={{ marginBottom: "10px" }}>
                            {this.state.editGood ? (
                                <React.Fragment>
                                    <button className="btn btn-success" onClick={this.handleCancelEditGood} style={{ marginLeft: "10px" }}>
                                        Hủy chỉnh sửa
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        disabled={!this.isGoodValidated()}
                                        onClick={this.handleSaveEditGood}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Lưu
                                    </button>
                                </React.Fragment>
                            ) : (
                                <button
                                    className="btn btn-success"
                                    style={{ marginLeft: "10px" }}
                                    disabled={!this.isGoodValidated()}
                                    onClick={this.handleAddGood}
                                >
                                    Thêm
                                </button>
                            )}
                            <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>
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
                                            <td>{good.expirationDateOfDiscountOnGood}</td>
                                            <td>{formatCurrency(good.discountedPrice)}</td>
                                            <td>
                                                <a href="#abc" className="edit" title="Sửa" onClick={() => this.handleEditGood(good, index)}>
                                                    <i className="material-icons">edit</i>
                                                </a>
                                                <a href="#abc" className="delete" title="Xóa" onClick={() => this.handleDeleteGood(good, index)}>
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
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

export default connect(mapStateToProps, null)(withTranslate(CreateDiscountOnGoods));
