import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { generateCode } from "../../../../../helpers/generateCode";
import { DiscountActions } from "../redux/actions";
import { DialogModal, DatePicker, ButtonModal, ErrorLabel, SelectBox } from "../../../../../common-components";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";
import ValidationHelper from "../../../../../helpers/validationHelper";
import DiscountCreateDetail from "./discountCreateDetail";

class DiscountCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            description: "",
            discountType: -1,
            formality: -1,
            // customerType: 0,
            effectiveDate: "",
            expirationDate: "",
            // goods: [],
            // selectAll: true,
            discounts: [],
        };
    }

    handleClickCreateCode = () => {
        this.setState((state) => {
            return { ...state, code: generateCode("DIS_") };
        });
    };

    handleNameChange = (e) => {
        let { value = "" } = e.target;
        this.setState((state) => {
            return {
                ...state,
                name: value,
            };
        });

        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({ nameError: message });
    };

    handleDescriptionChange = (e) => {
        let { value = "" } = e.target;
        this.setState((state) => {
            return {
                ...state,
                description: value,
            };
        });
    };

    handleChangeDiscountType = async (value) => {
        if (!value) {
            value = null;
        }
        await this.setState((state) => {
            return {
                ...state,
                discountType: value[0],
                discounts: [],
            };
        });
    };

    handleChangeDiscountFormality = async (value) => {
        if (!value) {
            value = null;
        }
        await this.setState((state) => {
            return {
                ...state,
                formality: value[0],
                discounts: [],
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

    getFormalitySelectItem = () => {
        let items = [
            { value: -1, text: "---Chọn hình thức giảm giá---" },
            { value: 0, text: "Giảm giá tiền" },
            { value: 1, text: "Giảm giá theo %" },
            { value: 2, text: "Tặng xu" },
            { value: 3, text: "Miễn phí vận chuyển" },
            { value: 4, text: "Tặng sản phẩm kèm theo" },
        ];
        if (this.state.discountType == 1) {
            items.push({ value: 5, text: "Xả hàng tồn kho" });
        }
        return items;
    };

    onChangeDiscounts = (dataSubmit) => {
        this.setState({
            discounts: dataSubmit,
        });
    };

    validateDiscounts = (discounts) => {
        let msg = undefined;
        if (discounts.length === 0) {
            msg = "Phải có ít nhất 1 mục khuyến mãi";
        }
        return msg;
    };

    isFormValidated = () => {
        let { name, effectiveDate, expirationDate, discounts } = this.state;
        let { translate } = this.props;
        if (
            ValidationHelper.validateName(translate, name, 1, 255).message ||
            this.validateDateStage(effectiveDate, expirationDate, false) ||
            this.validateDiscounts(discounts)
        ) {
            return false;
        }
        return true;
    };

    getFieldsForDiscounts = () => {
        let { discounts } = this.state;
        let discountsMap = discounts.map((item) => {
            let discount = {};

            discount.discountedCash = item.discountedCash;
            discount.discountedPercentage = item.discountedPercentage;
            discount.loyaltyCoin = item.loyaltyCoin;
            discount.maximumFreeShippingCost = item.maximumFreeShippingCost;
            discount.maximumDiscountedCash = item.maximumDiscountedCash;
            discount.minimumThresholdToBeApplied = item.minimumThresholdToBeApplied;
            discount.maximumThresholdToBeApplied = item.maximumThresholdToBeApplied;
            discount.customerType = item.customerType;

            if (item.bonusGoods && item.bonusGoods.length !== 0) {
                discount.bonusGoods = item.bonusGoods.map((good) => {
                    return {
                        good: good.good ? good.good._id : undefined,
                        expirationDateOfGoodBonus: good.expirationDateOfGoodBonus
                            ? new Date(formatToTimeZoneDate(good.expirationDateOfGoodBonus))
                            : undefined,
                        quantityOfBonusGood: good.quantityOfBonusGood,
                    };
                });
            }
            if (item.discountOnGoods && item.discountOnGoods.length !== 0) {
                discount.discountOnGoods = item.discountOnGoods.map((good) => {
                    return {
                        good: good.good ? good.good._id : undefined,
                        expirationDate: good.expirationDate ? new Date(formatToTimeZoneDate(good.expirationDate)) : undefined,
                        discountedPrice: good.discountedPrice ? good.discountedPrice : undefined,
                    };
                });
            }

            return discount;
        });

        return discountsMap;
    };

    save = async () => {
        if (this.isFormValidated()) {
            let { code, name, effectiveDate, expirationDate, discountType, formality, description } = this.state;
            const data = {
                code,
                name,
                effectiveDate: new Date(formatToTimeZoneDate(effectiveDate)),
                expirationDate: new Date(formatToTimeZoneDate(expirationDate)),
                type: discountType,
                formality,
                description,
                discounts: this.getFieldsForDiscounts(),
            };
            await this.props.createNewDiscount(data);
            this.setState({
                code: "",
                name: "",
                effectiveDate: "",
                expirationDate: "",
                discountType: -1,
                formality: -1,
                description: "",
                discounts: [],
            });
        }
    };

    render() {
        const { translate } = this.props;
        const {
            name,
            code,
            description,
            nameError,
            discountTypeError,
            discountType,
            formality,
            effectiveDate,
            expirationDate,
            dateError,
            discounts,
        } = this.state;
        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreateCode}
                    modalID={`modal-create-discount`}
                    button_name={"Thêm mới"}
                    title={"Thêm khuyến mãi"}
                    onButtonCallBack={this.handleClickCreateCode}
                />
                <DialogModal
                    modalID={`modal-create-discount`}
                    isLoading={false}
                    formID={`form-create-discount`}
                    title={"Thêm khuyến mãi"}
                    msg_success={"Thêm thành công"}
                    msg_faile={"Thêm thất bại"}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="75"
                    style={{ backgroundColor: "green" }}
                >
                    <form id={`form-create-discount`}>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>
                                    {"Mã giảm giá"}
                                    <span className="attention"> </span>
                                </label>
                                <input type="text" className="form-control" value={code} disabled="true" />
                            </div>
                            <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                                <label>
                                    {"Tên giảm giá"}
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control" value={name} onChange={this.handleNameChange} />
                                <ErrorLabel content={nameError} />
                            </div>
                            <div className={`form-group ${!discountTypeError ? "" : "has-error"}`}>
                                <label>
                                    {"Loại giảm giá"}
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-create-discount-type`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: -1, text: "---Chọn loại giảm giá---" },
                                        { value: 0, text: "Giảm giá trên toàn đơn hàng" },
                                        { value: 1, text: "Giảm giá từng mặt hàng" },
                                    ]}
                                    onChange={this.handleChangeDiscountType}
                                    multiple={false}
                                    value={discountType}
                                />
                                <ErrorLabel content={discountTypeError} />
                            </div>
                            <div className={`form-group`}>
                                <label>
                                    {"Hình thức giảm giá"}
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-create-discount-formality`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={this.getFormalitySelectItem()}
                                    onChange={this.handleChangeDiscountFormality}
                                    multiple={false}
                                    value={formality}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!dateError ? "" : "has-error"}`}>
                                <label>Ngày bắt đầu</label>
                                <DatePicker
                                    id="date_picker_create_discount_effectiveDate"
                                    value={effectiveDate}
                                    onChange={this.handleChangeEffectiveDate}
                                    disabled={false}
                                />
                                <ErrorLabel content={dateError} />
                            </div>

                            <div className={`form-group ${!dateError ? "" : "has-error"}`}>
                                <label>Ngày kết thúc</label>
                                <DatePicker
                                    id="date_picker_create_discount_expirationDate"
                                    value={expirationDate}
                                    onChange={this.handleChangeExpirationDate}
                                    disabled={false}
                                />
                                <ErrorLabel content={dateError} />
                            </div>
                            <div className="form-group">
                                <label>
                                    {"Mô tả"}
                                    <span className="attention"> </span>
                                </label>
                                <textarea
                                    type="text"
                                    rows={4.5}
                                    className="form-control"
                                    value={description}
                                    onChange={this.handleDescriptionChange}
                                />
                            </div>
                        </div>
                        <DiscountCreateDetail
                            discountType={this.state.discountType}
                            formality={this.state.formality}
                            discounts={discounts}
                            onChangeDiscounts={(data) => this.onChangeDiscounts(data)}
                            actionType="create"
                            discountCode={code}
                        />
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

const mapDispatchToProps = {
    createNewDiscount: DiscountActions.createNewDiscount,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DiscountCreateForm));
