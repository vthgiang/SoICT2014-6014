import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { generateCode } from "../../../../../helpers/generateCode";
import { formatDate } from "../../../../../helpers/formatDate";
import { DiscountActions } from "../redux/actions";
import { DialogModal, DatePicker, ButtonModal, ErrorLabel, SelectBox } from "../../../../../common-components";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";
import ValidationHelper from "../../../../../helpers/validationHelper";
import DiscountCreateDetail from "./discountCreateDetail";

class DiscountEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.discountEdit._id !== prevState.discountId) {
            let discounts = nextProps.discountEdit.discounts.map((discount) => {
                let bonusGoods = [];
                let discountOnGoods = [];
                if (discount.bonusGoods.length) {
                    bonusGoods = discount.bonusGoods.map((item) => {
                        return {
                            good: item.good._id,
                            code: item.good.code,
                            name: item.good.name,
                            quantityOfBonusGood: item.quantityOfBonusGood,
                            expirationDateOfGoodBonus: item.expirationDateOfGoodBonus,
                            baseUnit: item.baseUnit,
                        };
                    });
                }
                if (discount.discountOnGoods.length) {
                    discountOnGoods = discount.discountOnGoods.map((item) => {
                        return {
                            good: item.good._id,
                            code: item.good.code,
                            name: item.good.name,
                            expirationDate: item.expirationDate,
                            discountedPrice: item.discountedPrice,
                        };
                    });
                }
                discount.bonusGoods = bonusGoods;
                discount.discountOnGoods = discountOnGoods;
                return discount;
            });
            return {
                ...prevState,
                discountId: nextProps.discountEdit._id,
                code: nextProps.discountEdit.code,
                name: nextProps.discountEdit.name,
                description: nextProps.discountEdit.description,
                effectiveDate: nextProps.discountEdit.effectiveDate ? formatDate(nextProps.discountEdit.effectiveDate) : "",
                expirationDate: nextProps.discountEdit.expirationDate ? formatDate(nextProps.discountEdit.expirationDate) : "",
                discountType: nextProps.discountEdit.type,
                formality: nextProps.discountEdit.formality,
                discounts: discounts,
            };
        }
    }

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

    save = async () => {
        if (this.isFormValidated()) {
            let { discountId, code, name, effectiveDate, expirationDate, discountType, formality, description, discounts } = this.state;
            const data = {
                code,
                name,
                effectiveDate: new Date(formatToTimeZoneDate(effectiveDate)),
                expirationDate: new Date(formatToTimeZoneDate(expirationDate)),
                type: discountType,
                formality,
                description,
                discounts,
            };
            console.log("DATA SUBMIT EDIT", data);
            await this.props.editDiscount(discountId, data);
        }
    };

    render() {
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
            <DialogModal
                modalID="modal-edit-discount"
                formID="form-edit-discount"
                title="Chỉnh sửa giảm giá"
                msg_success="Chỉnh sửa thành công"
                msg_faile="Chỉnh sửa không thành công"
                func={this.save}
                disableSubmit={!this.isFormValidated()}
                size={75}
            >
                <form id={`form-edit-discount`}>
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
                                id={`select-edit-discount-type`}
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
                                disabled="true"
                            />
                        </div>
                        <div className={`form-group`}>
                            <label>
                                {"Hình thức giảm giá"}
                                <span className="attention"> * </span>
                            </label>
                            <SelectBox
                                id={`select-edit-discount-formality`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={this.getFormalitySelectItem()}
                                onChange={this.handleChangeDiscountFormality}
                                multiple={false}
                                value={formality}
                                disabled="true"
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group ${!dateError ? "" : "has-error"}`}>
                            <label>Ngày bắt đầu</label>
                            <DatePicker
                                id="date_picker_edit_discount_effectiveDate"
                                value={effectiveDate}
                                onChange={this.handleChangeEffectiveDate}
                                disabled={false}
                            />
                            <ErrorLabel content={dateError} />
                        </div>

                        <div className={`form-group ${!dateError ? "" : "has-error"}`}>
                            <label>Ngày kết thúc</label>
                            <DatePicker
                                id="date_picker_edit_discount_expirationDate"
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
                            <textarea type="text" rows={4.5} className="form-control" value={description} onChange={this.handleDescriptionChange} />
                        </div>
                    </div>
                    <DiscountCreateDetail
                        discountType={this.state.discountType}
                        formality={this.state.formality}
                        discounts={discounts}
                        onChangeDiscounts={(data) => this.onChangeDiscounts(data)}
                        actionType="edit"
                    />
                </form>
            </DialogModal>
        );
    }
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

const mapDispatchToProps = {
    editDiscount: DiscountActions.editDiscount,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DiscountEditForm));
