import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { generateCode } from "../../../../../helpers/generateCode";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { TaxActions } from "../redux/actions";
import { DialogModal, SelectMulti, ButtonModal, ErrorLabel, SelectBox } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import CreateTaxDetail from "./createTaxDetail";

class TaxCreateForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            goods: "",
            percent: "",
        };
        this.state = {
            taxName: "",
            code: "",
            description: "",
            creator: {
                name: "",
                id: "",
            },
            goodsSelected: Object.assign({}, this.EMPTY_GOOD),
            allGoodsSelected: [],
            type: "product",
            goodOptionsState: [],
        };
    }

    componentDidMount() {
        let creator = {};
        creator.id = this.props.auth.user._id;
        creator.name = this.props.auth.user.name;
        this.props.getAllGoodsByType({ type: this.state.type });
        this.setState({
            creator,
        });
    }

    handleClickCreateCode = () => {
        this.setState((state) => {
            return { ...state, code: generateCode("TAX_") };
        });
    };

    handleTaxNameChange = (e) => {
        let { value = "" } = e.target;
        this.setState((state) => {
            return {
                ...state,
                taxName: value,
            };
        });

        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({ nameTaxError: message });
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

    handleGoodsChange = (value) => {
        if (value.length === 0) {
            value = null;
        }
        this.validateGoods(value, true);
    };

    handleSubmitGoods = (e) => {
        e.preventDefault();

        let { goodsSelected, allGoodsSelected, goodOptionsState } = this.state;

        //Nếu chưa có goodOptionsState thì thêm vào
        if (!goodOptionsState.length && !allGoodsSelected.length) {
            goodOptionsState = this.props.goods.listGoodsByType.map((item) => {
                return {
                    value: item._id,
                    text: item.name,
                    code: item.code,
                };
            });
        }

        //Lọc bỏ những option đã được chọn
        let mapOption = goodOptionsState.filter((good) => {
            let check = false;
            goodsSelected.goods.forEach((e) => {
                if (e === good.value) {
                    check = true;
                }
            });
            if (!check) {
                return good;
            }
        });

        goodsSelected.key = goodsSelected.goods[0]; //Thêm key để có thể xóa
        allGoodsSelected.push(goodsSelected);

        this.setState({
            ...this.state,
            allGoodsSelected,
            goodsSelected: Object.assign({}, this.EMPTY_GOOD),
            goodOptionsState: mapOption,
        });
    };

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState((state) => {
            return {
                ...state,
                goodsSelected: Object.assign({}, this.EMPTY_GOOD),
            };
        });
    };

    handleDeleteGoodsTaxCollection = (item) => {
        let { allGoodsSelected, goodOptionsState } = this.state;
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
        goodOptionsState = goodOptionsState.concat(OptionsOfReOption);

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

    getGoodOptions = () => {
        let { allGoodsSelected, goodOptionsState } = this.state;

        let goodOptions =
            goodOptionsState.length || allGoodsSelected.length
                ? goodOptionsState
                : this.props.goods.listGoodsByType.map((item) => {
                      return {
                          value: item._id,
                          text: item.name,
                          code: item.code,
                      };
                  });

        //Xếp theo alphabet
        goodOptions.sort((a, b) => {
            if (a.text.toLowerCase() < b.text.toLowerCase()) {
                return -1;
            } else {
                return 1;
            }
        });

        console.log("Goo", goodOptions);

        return goodOptions;
    };

    checkDisabledSelectGoods = () => {
        let { allGoodsSelected, goodOptionsState } = this.state;

        let disabledSelectGoods = !goodOptionsState.length && allGoodsSelected.length ? true : false;
        return disabledSelectGoods;
    };

    validateGoods = (goods, willUpdateState = true) => {
        let msg = undefined;
        if (!goods) {
            const { translate } = this.props;
            msg = translate("manage_order.tax.choose_at_least_one_item");
        }

        if (willUpdateState) {
            this.state.goodsSelected.goods = goods;
            this.setState((state) => {
                return {
                    ...state,
                    goodsError: msg,
                };
            });
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
        const { taxName, allGoodsSelected, percent } = this.state;
        let { translate } = this.props;
        console.log("ALL GOOD", allGoodsSelected);
        if (!ValidationHelper.validateEmpty(translate, taxName).status || this.validateGoods(allGoodsSelected, false)) {
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

    showGoodDetail = async (item) => {
        //Gán mã code và name vào để hiển thị table
        let data = {
            key: item.key,
            percent: item.percent,
        };

        data.goods = item.goods.map((good) => {
            let option = {};
            this.props.goods.listGoodsByType.forEach((item) => {
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

    save = async () => {
        if (this.isFormValidated()) {
            let { allGoodsSelected } = this.state;
            let dataGoods = [];
            allGoodsSelected.forEach((e) => {
                e.goods.forEach((good) => {
                    dataGoods.push({ good: good, percent: parseInt(e.percent) });
                });
            });
            const data = {
                code: this.state.code,
                name: this.state.taxName,
                description: this.state.description,
                creator: this.state.creator.id,
                goods: dataGoods,
            };
            await this.props.createNewTax(data);
            await this.props.reloadState();
            this.setState((state) => {
                return {
                    ...state,
                    taxName: "",
                    code: "",
                    description: "",
                    creator: {
                        name: "",
                        id: "",
                    },
                    goodsSelected: Object.assign({}, this.EMPTY_GOOD),
                    allGoodsSelected: [],
                    type: "product",
                    goodOptionsState: [],
                };
            });
        }
    };
    render() {
        let { taxName, code, description, creator, goodsSelected, allGoodsSelected, currentRow, nameTaxError, percentError, goodsError } = this.state;

        let goodOptions = this.getGoodOptions();
        let disabledSelectGoods = this.checkDisabledSelectGoods();

        const { translate } = this.props;

        console.log("CREATE STATE", this.state);

        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreateCode}
                    modalID={`modal-add-tax`}
                    button_name={translate("manage_order.tax.add_new_tax")}
                    title={translate("manage_order.tax.add_new_tax")}
                />
                <DialogModal
                    modalID={`modal-add-tax`}
                    isLoading={false}
                    formID={`form-add-tax`}
                    title={translate("manage_order.tax.add_new_tax")}
                    msg_success={translate("manage_order.tax.add_successfully")}
                    msg_faile={translate("manage_order.tax.add_failed")}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="50"
                    style={{ backgroundColor: "green" }}
                >
                    {currentRow && (
                        <CreateTaxDetail
                            data={currentRow}
                            handleSubmitGoodChange={(dataChagneSubmit) => this.handleSubmitGoodChange(dataChagneSubmit)}
                        />
                    )}

                    <form id={`form-add-tax`}>
                        <div className="form-group">
                            <label>
                                {translate("manage_order.tax.tax_code")}
                                <span className="attention"> </span>
                            </label>
                            <input type="text" className="form-control" value={code} disabled="true" />
                        </div>
                        <div className={`form-group ${!nameTaxError ? "" : "has-error"}`}>
                            <label>
                                {translate("manage_order.tax.tax_name")}
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={taxName} onChange={this.handleTaxNameChange} />
                            <ErrorLabel content={nameTaxError} />
                        </div>
                        <div className="form-group">
                            <label>
                                {translate("manage_order.tax.description")}
                                <span className="attention"> </span>
                            </label>
                            <textarea type="text" className="form-control" value={description} onChange={this.handleDescriptionChange} />
                        </div>

                        <div className="form-group">
                            <label>
                                {translate("manage_order.tax.creator")}
                                <span className="attention"> </span>
                            </label>
                            <input type="text" className="form-control" value={creator.name} disabled="true" />
                        </div>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate("manage_order.tax.goods")}</legend>
                            <div className={`form-group ${!goodsError ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_order.tax.select_goods")}
                                    <span className="attention"> * </span>
                                </label>
                                {/* <SelectMulti
                                    id={`select-multi-good-tax`}
                                    multiple="multiple"
                                    options={{
                                        nonSelectedText: translate("manage_order.tax.select_goods"),
                                        allSelectedText: translate("manage_order.tax.selected_all"),
                                    }}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={goodOptions}
                                    value={goodsSelected.goods}
                                    onChange={this.handleGoodsChange}
                                    disabled={disabledSelectGoods}
                                /> */}
                                <SelectBox
                                    id={`select-multi-good-tax`}
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
                                <button
                                    className="btn btn-success"
                                    style={{ marginLeft: "10px" }}
                                    disabled={!this.isGoodsValidated()}
                                    onClick={this.handleSubmitGoods}
                                >
                                    {translate("manage_order.tax.add")}
                                </button>
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
                                                            onClick={() => this.handleDeleteGoodsTaxCollection(item)}
                                                            className="delete text-red"
                                                            style={{ width: "5px" }}
                                                            title={translate("manage_order.tax.delete_list_goods")}
                                                        >
                                                            <i className="material-icons">delete</i>
                                                        </a>
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
    const { auth, goods } = state;
    return { auth, goods };
}

const mapDispatchToProps = {
    getAllGoodsByType: GoodActions.getAllGoodsByType,
    createNewTax: TaxActions.createNewTax,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TaxCreateForm));
