import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { generateCode } from "../../../../../helpers/generateCode";
import { formatDate } from "../../../../../helpers/formatDate";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { DiscountActions } from "../redux/actions";
import { DialogModal, DatePicker, ButtonModal, ErrorLabel, SelectBox } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import CreateBonusGoods from "./createBonusGoods";
import CreateDiscountOnGoods from "./createDiscountOnGoods";
import { preventDefault } from "@fullcalendar/react";

class DiscountCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            description: "",
            discountType: -1,
            formality: -1,
            customerType: 0,
            effectiveDate: "",
            expirationDate: "",
            goods: [],
            selectAll: true,
        };
    }

    getAllGoods = () => {
        const { translate, goods } = this.props;
        const { selectAll } = this.state;
        let listGoods = [
            selectAll
                ? {
                      value: "all",
                      text: "CHỌN TẤT CẢ",
                  }
                : {
                      value: "unselected",
                      text: "BỎ CHỌN TẤT CẢ",
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
        // await this.setState({ discountType: value[0] });
        await this.setState((state) => {
            return {
                ...state,
                discountType: value[0],
                goods: [],
                selectAll: true,
                discountOnGoods: undefined,
                bonusGoods: undefined,
                minimumThresholdToBeApplied: null,
                maximumThresholdToBeApplied: null,
                maximumFreeShippingCost: undefined,
                maximumDiscountedCash: undefined,
                discountedCash: undefined,
            };
        });
    };

    handleChangeDiscountFormality = async (value) => {
        if (!value) {
            value = null;
        }
        console.log(value);
        // await this.setState({ formality: value[0] });
        await this.setState((state) => {
            return {
                ...state,
                formality: value[0],
                goods: [],
                selectAll: true,
                discountOnGoods: undefined,
                bonusGoods: undefined,
                minimumThresholdToBeApplied: null,
                maximumThresholdToBeApplied: null,
                maximumFreeShippingCost: undefined,
                maximumDiscountedCash: undefined,
                discountedCash: undefined,
            };
        });
    };

    handleChangeEffectiveDate = (value) => {
        if (!value) {
            value = null;
        }

        this.setState({
            ...this.state,
            effectiveDate: value,
        });
    };

    handleChangeExpirationDate = (value) => {
        if (!value) {
            value = null;
        }

        this.setState({
            ...this.state,
            expirationDate: value,
        });
    };

    handleAddBonusGood = () => {
        window.$("#modal-create-discount-bonus-goods").modal("show");
    };

    handleAddDiscountOnGoods = () => {
        window.$("#modal-create-discount-on-goods").modal("show");
    };

    handleSubmitBonusGoods = (dataSubmit) => {
        this.setState({
            bonusGoods: dataSubmit,
        });
    };

    handleSubmitDiscountOnGoods = (dataSubmit) => {
        this.setState({
            discountOnGoods: dataSubmit,
        });
    };
    handleGoodChange = async (goods) => {
        if (goods.length === 0) {
            goods = null;
        }
        let checkSelectedAll = [];
        if (goods) {
            checkSelectedAll = await goods.filter((item) => {
                return item === "all" || item === "unselected";
            });
        }

        if (checkSelectedAll.length && checkSelectedAll[0] === "all" && goods) {
            goods = await this.getAllGoods().map((item) => {
                return item.value;
            });

            goods.splice(0, 1); //lấy phần tử all ra khỏi mảng
        } else if (checkSelectedAll.length && checkSelectedAll[0] === "unselected" && goods) {
            goods = [];
        }

        if (goods && goods.length === this.getAllGoods().length - 1) {
            //Tất cả các mặt hàng đã được chọn
            this.setState({
                selectAll: false,
            });
        } else if (!this.state.selectAll) {
            this.setState({
                selectAll: true,
            });
        }

        await this.setState((state) => {
            return {
                ...state,
                goods: goods,
            };
        });
        this.validateGoods(goods, true);
    };

    validateGoods = (goods, willUpdateState = true) => {
        let msg = undefined;
        if (goods === null) {
            const { translate } = this.props;
            msg = "Mặt hàng không được để trống";
        }

        this.setState((state) => {
            return {
                ...state,
                goodError: msg,
            };
        });
        return msg;
    };

    getFormalitySelectItem = () => {
        let items = [
            { value: -1, text: "---Chọn hình thức giảm giá---" },
            { value: 0, text: "Giảm giá tiền" },
            { value: 1, text: "Giảm giá theo %" },
            { value: 2, text: "Tặng xu" },
            { value: 3, text: "Miễn phí vận chuyển" },
            { value: 4, text: "Tặng sản phẩm kèm theo" },
            { value: 5, text: "Xả hàng tồn kho" },
        ];
        // if (this.state.discountType === 1) {
        //     items.push({ value: 5, text: "Xả hàng tồn kho" });
        // }
        return items;
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
            customerType,
            formality,
            effectiveDate,
            expirationDate,
            minimumThresholdToBeApplied,
            maximumThresholdToBeApplied,
            discountedCash,
            discountedPercentage,
            loyaltyCoin,
            maximumFreeShippingCost,
            maximumDiscountedCash,
            bonusGoods,
            discountOnGoods,
            goods,
        } = this.state;
        console.log("STATE", this.state);
        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreateCode}
                    modalID={`modal-create-discount`}
                    button_name={"Thêm khuyến mãi"}
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
                    // disableSubmit={!this.isFormValidated()}
                    // func={this.save}
                    size="75"
                    style={{ backgroundColor: "green" }}
                >
                    <CreateBonusGoods handleSubmitBonusGoods={(data) => this.handleSubmitBonusGoods(data)} />
                    <CreateDiscountOnGoods handleSubmitDiscountOnGoods={(data) => this.handleSubmitDiscountOnGoods(data)} />
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
                            <div className="form-group">
                                <label>Ngày bắt đầu</label>
                                <DatePicker
                                    id="date_picker_discount_effectiveDate"
                                    value={effectiveDate}
                                    onChange={this.handleChangeEffectiveDate}
                                    disabled={false}
                                />
                            </div>

                            <div className="form-group">
                                <label>Ngày kết thúc</label>
                                <DatePicker
                                    id="date_picker_discount_expirationDate"
                                    value={expirationDate}
                                    onChange={this.handleChangeExpirationDate}
                                    disabled={false}
                                />
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
                        {discountType >= 0 && formality >= 0 ? (
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{"Chi tiết giảm giá"}</legend>
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className={`form-group`}>
                                            <label>
                                                {"Khách hàng được áp dụng"}
                                                <span className="attention"> * </span>
                                            </label>
                                            <SelectBox
                                                id={`select-create-discount-customer-type`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={[
                                                    { value: 0, text: "Khách thường" },
                                                    { value: 1, text: "Khách VIP" },
                                                    { value: 2, text: "Tất cả" },
                                                ]}
                                                onChange={this.handleChangeCustomerType}
                                                multiple={false}
                                                value={customerType}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className="form-group">
                                            <label>
                                                {discountType === 0 ? "Đơn hàng có giá trị từ:" : "Số lượng hàng từ: "}
                                                <span className="attention"> </span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={minimumThresholdToBeApplied}
                                                placeholder={discountType === 0 ? "vnđ" : "đơn vị"}
                                                onChange={this.handleMaximumThresholdToBeAppliedChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className="form-group">
                                            <label>
                                                {discountType === 0 ? "Đến: " : "Đến: "}
                                                <span className="attention"> </span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={maximumThresholdToBeApplied}
                                                onChange={this.handleMaximumThresholdToBeAppliedChange}
                                                placeholder={discountType === 0 ? "vnđ" : "đơn vị"}
                                            />
                                        </div>
                                    </div>
                                    {formality == 0 ? (
                                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                            <div className="form-group">
                                                <label>
                                                    {"Giảm giá tiền mặt"}
                                                    <span className="attention">*</span>
                                                </label>
                                                <input type="number" className="form-control" value={discountedCash} />
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {formality == 1 ? (
                                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                            <div className="form-group">
                                                <label>
                                                    {"Phần trăm giảm giá"}
                                                    <span className="attention">*</span>
                                                </label>
                                                <input type="number" className="form-control" value={discountedPercentage} />
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {formality == 1 ? (
                                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                            <div className="form-group">
                                                <label>
                                                    {"Tiền giảm giá tối đa"}
                                                    <span className="attention"> </span>
                                                </label>
                                                <input type="number" className="form-control" value={maximumDiscountedCash} placeholder="vd: 50000" />
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {formality == 2 ? (
                                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                            <div className="form-group">
                                                <label>
                                                    {"Tặng xu"}
                                                    <span className="attention"></span>
                                                </label>
                                                <input type="number" className="form-control" value={loyaltyCoin} placeholder="vd: 10000" />
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {formality == 3 ? (
                                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                            <div className="form-group">
                                                <label>
                                                    {"Miễn phí vận chuyển tối đa"}
                                                    <span className="attention"> </span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={maximumFreeShippingCost}
                                                    placeholder="vd: 50000"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {discountType == 1 && formality == 5 ? (
                                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                            <div className="form-group">
                                                <label>
                                                    Các mặt hàng được áp dụng:
                                                    <a style={{ cursor: "pointer" }} title="Thêm các mặt hàng áp dụng">
                                                        <i
                                                            className="fa fa-plus-square"
                                                            style={{ color: "#00a65a", marginLeft: 5 }}
                                                            onClick={this.handleAddDiscountOnGoods}
                                                        />
                                                    </a>
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {discountType == 1 && formality != 5 ? (
                                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                            <div className={`form-group`}>
                                                <label className="control-label">
                                                    Các mặt hàng được áp dụng: <span className="attention"> * </span>
                                                </label>
                                                <SelectBox
                                                    id={`select-discount-on-goods2`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    value={goods}
                                                    items={this.getAllGoods()}
                                                    onChange={this.handleGoodChange}
                                                    multiple={true}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {formality == 4 ? (
                                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                            <div className="form-group">
                                                <label>
                                                    Sản phẩm tặng kèm:
                                                    <a style={{ cursor: "pointer" }} title="Thêm các sản phẩm tặng kèm">
                                                        <i
                                                            className="fa fa-plus-square"
                                                            style={{ color: "#00a65a", marginLeft: 5 }}
                                                            onClick={this.handleAddBonusGood}
                                                        />
                                                    </a>
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div className={"pull-right"} style={{ padding: 10 }}>
                                            <button
                                                className="btn btn-success"
                                                style={{ marginLeft: "10px" }}
                                                // disabled={!this.isGoodsValidated()}
                                                // onClick={this.handleSubmitGoods}
                                            >
                                                Thêm
                                            </button>
                                            <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClear}>
                                                Xóa trắng
                                            </button>
                                        </div>
                                    </div>
                                    <table id={`order-table-tax-create`} className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Loại khách hàng</th>
                                                <th>Giá trị tối thiểu</th>
                                                <th>Giá trị tối đa</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </fieldset>
                            </div>
                        ) : (
                            ""
                        )}
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
    getAllGoodsByType: GoodActions.getAllGoodsByType,
    createNewDiscount: DiscountActions.createNewDiscount,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DiscountCreateForm));
