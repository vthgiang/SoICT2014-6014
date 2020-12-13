import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { TaxActions } from "../redux/actions";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { DialogModal, ErrorLabel, SelectBox, SelectMulti } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import CreateTaxDetail from "./createTaxDetail";

class TaxEditForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            goods: "",
            percent: "",
        };
        this.state = {
            isSelectAll: true,
        };
    }

    componentDidMount() {
        this.props.getAllGoodsByType({ type: "product" });
    }

    getAllGoods = () => {
        const { translate, goods } = this.props;
        const { isSelectAll } = this.state;
        let listGoods = [
            isSelectAll
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.taxEdit._id !== prevState.taxId) {
            let { goods } = nextProps.taxEdit;
            let allGoodsSelected = [];
            goods.forEach((good) => {
                let checkPercentAvailable = false;

                allGoodsSelected.forEach((collection) => {
                    if (collection.percent === good.percent) {
                        collection.goods.push(good.good._id);
                        checkPercentAvailable = true;
                    }
                });

                if (!checkPercentAvailable) {
                    let goods = [good.good._id];
                    allGoodsSelected.push({ key: good._id, percent: good.percent, goods });
                }
            });

            return {
                ...prevState,
                taxId: nextProps.taxEdit._id,
                code: nextProps.taxEdit.code,
                name: nextProps.taxEdit.name,
                // goods: nextProps.taxEdit.goods,
                allGoodsSelected,
                description: nextProps.taxEdit.description,
                version: nextProps.taxEdit.version,
                status: nextProps.taxEdit.status,
                creator: nextProps.taxEdit.creator._id,
                nameError: undefined,
                goodsError: undefined,

                goodsSelected: Object.assign({}, { goods: "", percent: "" }),
                goodOptionsState: [],
                changed: false,
            };
        }
        return null;
    }

    handleSubmitGoods = (e) => {
        e.preventDefault();

        let { goodsSelected, allGoodsSelected, goodOptionsState } = this.state;

        goodOptionsState = this.filterOption(goodsSelected); //Lọc bỏ những options đã được chọn

        goodsSelected.key = goodsSelected.goods[0]; //Thêm key để có thể xóa
        allGoodsSelected.push(goodsSelected);

        this.setState({
            ...this.state,
            allGoodsSelected,
            goodsSelected: Object.assign({}, this.EMPTY_GOOD),
            goodOptionsState,
            isSelectAll: true,
        });
    };

    showGoodDetail = async (item) => {
        //Gán mã code và name vào để hiển thị table
        let data = {
            key: item.key,
            percent: item.percent,
        };

        data.goods = item.goods.map((good) => {
            let option = {};
            this.props.goods.listGoodsByType.forEach((item) => {
                console.log(item);
                if (item._id === good) {
                    option = {
                        value: item._id,
                        name: item.name,
                        code: item.code,
                    };
                }
            });
            return option;
        });

        await this.setState((state) => {
            return {
                ...state,
                currentRow: data,
            };
        });
        window.$("#modal-create-tax-detail-good").modal("show");
    };

    //Lấy các goods chưa có trong thuế để có thể chọn
    getOptionFromProps = () => {
        const { goods } = this.props.taxEdit;

        let options = [
            {
                value: "all",
                text: "CHỌN TẤT CẢ",
            },
        ];
        this.props.goods.listGoodsByType.forEach((item) => {
            let check = false;
            goods.forEach((good) => {
                if (good.good._id === item._id) {
                    check = true;
                }
            });
            if (!check) {
                options.push({ value: item._id, text: item.name, code: item.code });
            }
        });
        this.setState((state) => {
            return {
                ...state,
                changed: true,
                goodOptionsState: options,
            };
        });
        return options;
    };

    getGoodOptions = () => {
        let { goodOptionsState, changed } = this.state;
        let goodOptions = changed ? goodOptionsState : this.getOptionFromProps();

        return goodOptions;
    };

    checkDisabledSelectGoods = () => {
        let { allGoodsSelected, goodOptionsState } = this.state;

        let disabledSelectGoods = !goodOptionsState.length && allGoodsSelected.length ? true : false;
        return disabledSelectGoods;
    };

    handleTaxNameChange = (e) => {
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

    handlePercentChange = (e) => {
        let { value } = e.target;
        this.validatePercent(value, true);
    };

    handleGoodsChange = async (goods) => {
        let { goodOptionsState, allGoodsSelected } = this.state;

        let checkSelectedAll = [];
        if (goods) {
            checkSelectedAll = await goods.filter((item) => {
                return item === "all" || item === "unselected";
            });
        }

        if (checkSelectedAll.length && checkSelectedAll[0] === "all" && goods) {
            if (!goodOptionsState.length && !allGoodsSelected.length) {
                goods = await this.getAllGoods().map((item) => {
                    return item.value;
                });
            } else {
                goods = await goodOptionsState.map((item) => {
                    return item.value;
                });
            }

            goods.splice(0, 1); //lấy phần tử all ra khỏi mảng
        } else if (checkSelectedAll.length && checkSelectedAll[0] === "unselected" && goods) {
            goods = [];
        }

        if (goods && goods.length === this.getAllGoods().length - 1) {
            //Tất cả các mặt hàng đã được chọn
            this.setState({
                isSelectAll: false,
            });
        } else if (!this.state.isSelectAll) {
            this.setState({
                isSelectAll: true,
            });
        }

        this.state.goodsSelected.goods = goods;
        await this.setState((state) => {
            return {
                ...state,
                goodsError: this.validateGoods(goods, true),
            };
        });
    };

    filterOption = (goodsSelectedNeedFilter) => {
        let { goodOptionsState, allGoodsSelected } = this.state;
        //Nếu chưa có goodOptionsState thì thêm vào
        if (!goodOptionsState.length && !allGoodsSelected.length) {
            goodOptionsState = this.getAllGoods();
            // goodOptionsState.splice(0, 1);
        }

        //Lọc bỏ những option đã được chọn
        let optionsFilter = goodOptionsState.filter((good) => {
            let check = false;
            goodsSelectedNeedFilter.goods.forEach((e) => {
                if (e === good.value) {
                    check = true;
                }
            });
            if (!check) {
                return good;
            }
        });

        if (optionsFilter.length === 1) {
            //Nếu không còn phần tử nào thì lấy phần tử chọn tất cả ra khỏi mảng
            optionsFilter = [];
        }
        return optionsFilter;
    };

    handleSubmitGoods = (e) => {
        e.preventDefault();

        let { goodsSelected, allGoodsSelected, goodOptionsState } = this.state;

        goodOptionsState = this.filterOption(goodsSelected); //Lọc bỏ những options đã được chọn

        goodsSelected.key = goodsSelected.goods[0]; //Thêm key để có thể xóa
        allGoodsSelected.push(goodsSelected);

        this.setState({
            ...this.state,
            allGoodsSelected,
            goodsSelected: Object.assign({}, this.EMPTY_GOOD),
            goodOptionsState,
            isSelectAll: true,
        });
    };

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState((state) => {
            return {
                ...state,
                goodsSelected: Object.assign({}, this.EMPTY_GOOD),
                isSelectAll: true,
                goodsError: undefined,
                percentError: undefined,
            };
        });
    };

    reOptionsSelected = (item) => {
        let { goodOptionsState } = this.state;
        //Các mặt hàng bị xóa được trả về option, có thể tiếp tục lựa chọn mặt hàng này
        let OptionsOfReOption = item.goods.map((good) => {
            let option = {};
            this.props.goods.listGoodsByType.forEach((item) => {
                if (item._id === good) {
                    option = {
                        value: item._id,
                        text: item.name,
                        code: item.code,
                    };
                }
            });
            return option;
        });

        //Thêm lại các phần tử vừa bị xóa vào select option
        if (goodOptionsState.length === 0) {
            goodOptionsState.push({
                value: "all",
                text: "CHỌN TẤT CẢ",
            });
        }
        goodOptionsState = goodOptionsState.concat(OptionsOfReOption);
        return goodOptionsState;
    };

    handleDeleteGoodsTaxCollection = (item) => {
        let { allGoodsSelected, goodOptionsState } = this.state;

        goodOptionsState = this.reOptionsSelected(item);

        //Xóa các phần tử bị xóa
        let collections = allGoodsSelected.filter((collection) => {
            return collection.key !== item.key;
        });

        this.setState((state) => {
            return {
                ...state,
                allGoodsSelected: collections,
                goodOptionsState,
            };
        });
    };

    handleEditGoodsTaxCollection = (item, index) => {
        let { goodOptionsState } = this.state;
        goodOptionsState = this.reOptionsSelected(item);
        this.setState({
            editGoodsTaxCollection: true,
            goodOptionsState,
            goodsSelected: { ...item },
            indexEditting: index,
        });
    };

    handleCancelEditGoodTaxCollection = (e) => {
        e.preventDefault();
        let { goodOptionsState, allGoodsSelected, indexEditting } = this.state;
        goodOptionsState = this.filterOption(allGoodsSelected[indexEditting]);
        this.setState({
            editGoodsTaxCollection: false,
            goodsSelected: Object.assign({}, this.EMPTY_GOOD),
            goodOptionsState,
            isSelectAll: true,
            goodsError: undefined,
            percentError: undefined,
        });
    };

    handleSaveEditGoodTaxCollection = () => {
        let { goodsSelected, indexEditting, goodOptionsState, allGoodsSelected } = this.state;
        goodOptionsState = this.filterOption(goodsSelected); //Lọc bỏ những options đã được chọn
        allGoodsSelected[indexEditting] = goodsSelected;
        this.setState({
            ...this.state,
            allGoodsSelected,
            goodsSelected: Object.assign({}, this.EMPTY_GOOD),
            goodOptionsState,
            isSelectAll: true,
            editGoodsTaxCollection: false,
        });
    };

    handleSubmitGoodChange = (data) => {
        let { allGoodsSelected, goodOptionsState } = this.state;
        if (data.goods.length === 0) {
            this.handleDeleteGoodsTaxCollection({ key: data.key, goods: data.goodsDeleted, percent: data.percent }); // Xóa luôn collection
        } else {
            //Các mặt hàng bị xóa được trả về option, có thể tiếp tục lựa chọn mặt hàng này
            let OptionsOfReOption = data.goodsDeleted.map((good) => {
                let option = {};
                this.props.goods.listGoodsByType.forEach((item) => {
                    if (item._id === good) {
                        option = {
                            value: item._id,
                            text: item.name,
                            code: item.code,
                        };
                    }
                });
                return option;
            });
            goodOptionsState = goodOptionsState.concat(OptionsOfReOption);

            let collections = allGoodsSelected.map((collection) => {
                if (collection.key === data.key) {
                    return {
                        key: collection.key,
                        goods: data.goods.map((good) => good.value), //lấy id các mặt hàng không bị xóa
                        percent: data.percent,
                    };
                } else return collection;
            });

            this.setState((state) => {
                return {
                    ...state,
                    allGoodsSelected: collections,
                    goodOptionsState,
                };
            });
        }
    };

    validateGoods = (goods, willUpdateState = true) => {
        let msg = undefined;
        if (!goods || goods.length === 0) {
            const { translate } = this.props;
            msg = translate("manage_order.tax.choose_at_least_one_item");
        }
        return msg;
    };

    isGoodsValidated = () => {
        const { percent, goods } = this.state.goodsSelected;
        let { translate } = this.props;
        if (!ValidationHelper.validateEmpty(translate, percent).status || this.validateGoods(goods, false) || this.validatePercent(percent, false)) {
            return false;
        }
        return true;
    };

    isFormValidated = () => {
        const { name, allGoodsSelected, percent } = this.state;
        let { translate } = this.props;
        if (!ValidationHelper.validateEmpty(translate, name).status || this.validateGoods(allGoodsSelected, false)) {
            return false;
        }
        return true;
    };

    validatePercent = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manage_order.tax.percent_is_not_null");
        } else if (value < 0) {
            msg = translate("manage_order.tax.percent_greater_than_or_equal_zero");
        }
        if (willUpdateState) {
            this.state.goodsSelected.percent = value;
            this.setState((state) => {
                return {
                    ...state,
                    percentError: msg,
                };
            });
        }
        return msg;
    };

    save = async () => {
        if (this.isFormValidated()) {
            let { allGoodsSelected } = this.state;
            let dataGoods = [];
            allGoodsSelected.forEach((e) => {
                e.goods.forEach((good) => {
                    dataGoods.push({ good: good, percent: parseInt(e.percent) });
                });
            });
            let { taxId } = this.state;
            console.log("Creator", this.state.creator);
            const data = {
                code: this.state.code,
                name: this.state.name,
                description: this.state.description,
                goods: dataGoods,
            };
            await this.props.updateTax(taxId, data);
        }
    };

    render() {
        const { translate, taxs } = this.props;
        const {
            code,
            name,
            goods,
            description,
            nameError,
            allGoodsSelected,
            goodsSelected,
            currentRow,
            goodsError,
            percentError,
            editGoodsTaxCollection,
        } = this.state;
        let goodOptions = this.getGoodOptions();
        let disabledSelectGoods = this.checkDisabledSelectGoods();

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-tax"
                    isLoading={taxs.isLoading}
                    formID="form-edit-tax"
                    title="Chỉnh sửa thuế"
                    msg_success="Chỉnh sửa thành công"
                    msg_faile="Chỉnh sửa không thành công"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                >
                    {currentRow && (
                        <CreateTaxDetail
                            data={currentRow}
                            handleSubmitGoodChange={(dataChagneSubmit) => this.handleSubmitGoodChange(dataChagneSubmit)}
                        />
                    )}
                    <form id="form-edit-tax">
                        <div className={`form-group`}>
                            <label>
                                {translate("manage_order.tax.tax_code")}
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={code} disabled="true" />
                        </div>
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>
                                {translate("manage_order.tax.tax_name")}
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={name} onChange={this.handleTaxNameChange} />
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className="form-group">
                            <label>
                                {translate("manage_order.tax.description")}
                                <span className="attention"> </span>
                            </label>
                            <textarea type="text" className="form-control" value={description} onChange={this.handleDescriptionChange} />
                        </div>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate("manage_order.tax.goods")}</legend>
                            <div className={`form-group ${!goodsError ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_order.tax.select_goods")}
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-edit-multi-good-tax`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={goodOptions}
                                    onChange={this.handleGoodsChange}
                                    multiple={true}
                                    value={goodsSelected.goods}
                                />
                                <ErrorLabel content={goodsError} />
                            </div>
                            <div className={`form-group ${!percentError ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_order.tax.tax_percent")}
                                    <span className="attention"> * </span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Nhập %"
                                    value={goodsSelected.percent}
                                    onChange={this.handlePercentChange}
                                />
                                <ErrorLabel content={percentError} />
                            </div>
                            <div className={"pull-right"} style={{ padding: 10 }}>
                                {editGoodsTaxCollection ? (
                                    <React.Fragment>
                                        <button
                                            className="btn btn-success"
                                            onClick={this.handleCancelEditGoodTaxCollection}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Hủy chỉnh sửa
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            disabled={!this.isGoodsValidated()}
                                            onClick={this.handleSaveEditGoodTaxCollection}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Lưu
                                        </button>
                                    </React.Fragment>
                                ) : (
                                    <button
                                        className="btn btn-success"
                                        style={{ marginLeft: "10px" }}
                                        disabled={!this.isGoodsValidated()}
                                        onClick={this.handleSubmitGoods}
                                    >
                                        {translate("manage_order.tax.add")}
                                    </button>
                                )}
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>
                                    {translate("manage_order.tax.reset")}
                                </button>
                            </div>
                            <table id={`order-table-tax-create`} className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th title={translate("manage_order.tax.index")}>{translate("manage_order.tax.index")}</th>
                                        <th title={translate("manage_order.tax.tax_percent")}>{translate("manage_order.tax.tax_percent")}</th>
                                        <th title={translate("manage_order.tax.goods")}>{translate("manage_order.tax.goods")}</th>
                                        <th title={translate("manage_order.tax.action")}>{translate("manage_order.tax.action")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allGoodsSelected &&
                                        allGoodsSelected.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.percent}</td>
                                                    <td>
                                                        <a onClick={() => this.showGoodDetail(item)}>{translate("manage_order.tax.view_deatail")}</a>
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <a
                                                            href="#abc"
                                                            className="edit"
                                                            title="Sửa"
                                                            onClick={() => this.handleEditGoodsTaxCollection(item, index)}
                                                        >
                                                            <i className="material-icons">edit</i>
                                                        </a>
                                                        {!editGoodsTaxCollection ? (
                                                            <a
                                                                onClick={() => this.handleDeleteGoodsTaxCollection(item)}
                                                                className="delete red-yellow"
                                                                style={{ width: "5px" }}
                                                                title={translate("manage_order.tax.delete_list_goods")}
                                                            >
                                                                <i className="material-icons">delete</i>
                                                            </a>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { taxs, goods } = state;
    return { taxs, goods };
}

const mapDispatchToProps = {
    updateTax: TaxActions.updateTax,
    getAllGoodsByType: GoodActions.getAllGoodsByType,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TaxEditForm));
