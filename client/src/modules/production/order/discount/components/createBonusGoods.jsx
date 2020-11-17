import React, { Component } from "react";
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from "../../../../../common-components";
import { connect } from "react-redux";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";
import { formatDate } from "../../../../../helpers/formatDate";
import { withTranslate } from "react-redux-multilingual";

class CreateBonusGoods extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            goodId: "1",
            goodObject: "",
            quantityOfBonusGood: "",
            expirationDateOfGoodBonus: "",
        };
        this.state = {
            good: Object.assign({}, this.EMPTY_GOOD),
            goodOptions: [],
            listGoods: [],
            editState: true,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.discountType !== prevState.discountType || nextProps.formality !== prevState.formality) {
            return {
                goodOptions: [],
                listGoods: [],
                good: {
                    goodId: "1",
                    goodObject: "",
                    quantityOfBonusGood: "",
                    expirationDateOfGoodBonus: "",
                },
                discountType: nextProps.discountType,
                formality: nextProps.formality,
            };
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        let enableIndexEdit =
            this.props.indexEdittingDiscount !== nextProps.indexEdittingDiscount || nextState.discountCode !== nextProps.discountCode;
        let bonusGoodsIsNotNull = nextProps.bonusGoods && nextProps.bonusGoods.length;

        if (nextProps.editDiscountDetail && enableIndexEdit && bonusGoodsIsNotNull) {
            let { listGoods, goodOptions } = this.state;
            goodOptions = [];
            listGoods = [];
            // Lấy các thông tin của good đưa vào goodObject va day good vao listGoods
            const { goods } = this.props;
            const { listGoodsByType } = goods;
            listGoods = nextProps.bonusGoods.map((item) => {
                let good = {};
                let goodArrFilter = listGoodsByType.filter((x) => x._id === item.good._id);
                if (goodArrFilter) {
                    good.goodObject = goodArrFilter[0];
                    good.goodId = item.good._id;
                    good.quantityOfBonusGood = item.quantityOfBonusGood;
                    good.expirationDateOfGoodBonus = formatDate(item.expirationDateOfGoodBonus);
                    good.baseUnit = item.baseUnit;
                }

                // filter good ra khoi getAllGoods() va gan state vao goodOption
                if (goodOptions.length === 0) {
                    goodOptions = this.getAllGoods().filter((x) => x.value !== good.goodId);
                } else {
                    // Nếu state đang là goodOptions thi vẫn phải filter những thằng còn lại
                    goodOptions = goodOptions.filter((x) => x.value !== item.good._id);
                }
                return good;
            });

            // Cập nhật lại good state
            this.setState((state) => ({
                ...state,
                listGoods: [...listGoods],
                goodOptions: [...goodOptions],
                editState: false,
                discountCode: nextProps.discountCode,
            }));
            return false;
        }
        return true;
    };

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

    handleQuantityOfBonusGood = (e) => {
        let { value } = e.target;
        this.validateQuantityChange(value, true);
    };

    validateQuantityChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = "Giá trị không được để trống";
        } else if (value < 1) {
            msg = "Số lượng phải lớn hơn 0";
        }
        if (willUpdateState) {
            let { good } = this.state;
            good.quantityOfBonusGood = value;
            this.setState((state) => ({
                ...state,
                good: { ...good },
                quantityOfBonusGoodError: msg,
            }));
        }
        return msg;
    };

    handleChangeExpirationDate = (value) => {
        if (!value) {
            value = null;
        }
        let { good } = this.state;
        good.expirationDateOfGoodBonus = value;
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

    submitChange = () => {
        let { listGoods } = this.state;
        let dataSubmit = listGoods.map((good) => {
            return {
                good: {
                    _id: good.goodId,
                    name: good.goodObject.name,
                    code: good.goodObject.code,
                    baseUnit: good.goodObject.baseUnit,
                },
                expirationDateOfGoodBonus: good.expirationDateOfGoodBonus,
                quantityOfBonusGood: good.quantityOfBonusGood,
            };
        });

        this.props.handleSubmitBonusGoods(dataSubmit);
        this.setState({
            listGoods: [],
            goodOptions: [],
        });
    };

    isGoodValidated = () => {
        if (this.validateGoodChange(this.state.good.goodId, false) || this.validateQuantityChange(this.state.good.quantityOfBonusGood, false)) {
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
        const { actionType } = this.props;
        const { goodOptions, good, listGoods, quantityOfBonusGoodError } = this.state;
        const { goodId, expirationDateOfGoodBonus, quantityOfBonusGood, baseUnit } = good;
        return (
            <DialogModal
                modalID={`modal-${actionType}-discount-bonus-goods`}
                isLoading={false}
                formID={`form-${actionType}-discount-bonus-goods`}
                title={"Các mặt hàng được tặng"}
                size="75"
                style={{ backgroundColor: "green" }}
                func={this.submitChange}
                disableSubmit={!this.isFormValidated()}
            >
                <form id={`form-${actionType}-discount-bonus-goods`}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Thêm hàng tặng kèm</legend>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group`}>
                                <label className="control-label">
                                    Chọn hàng tặng kèm <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-${actionType}-discount-bonus-goods`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={goodId}
                                    items={goodOptions.length ? goodOptions : this.getAllGoods()}
                                    onChange={this.handleGoodChange}
                                    multiple={false}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Hạn sử dụng của hàng tặng</label>
                                <DatePicker
                                    id={`date_picker_${actionType}_discount_expirationDateOfGoodBonus`}
                                    value={expirationDateOfGoodBonus}
                                    onChange={this.handleChangeExpirationDate}
                                    disabled={false}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group `}>
                                <label className="control-label">Đơn vị tính</label>
                                <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={good.goodId !== "1" ? good.goodObject.baseUnit : ""}
                                        disabled="true"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!quantityOfBonusGoodError ? "" : "has-error"}`}>
                                <label className="control-label">
                                    Số lượng <span className="attention"> * </span>
                                </label>
                                <div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder={"vd: 5"}
                                        value={quantityOfBonusGood}
                                        onChange={this.handleQuantityOfBonusGood}
                                    />
                                </div>
                                <ErrorLabel content={quantityOfBonusGoodError} />
                            </div>
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
                                <th>Đơn vị tính</th>
                                <th>Số lượg</th>
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
                                            <td>{good.expirationDateOfGoodBonus}</td>
                                            <td>{good.goodObject.baseUnit}</td>
                                            <td>{good.quantityOfBonusGood}</td>
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

export default connect(mapStateToProps, null)(withTranslate(CreateBonusGoods));
