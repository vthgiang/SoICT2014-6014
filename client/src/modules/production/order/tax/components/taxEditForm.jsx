import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { TaxActions } from "../redux/actions";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { DialogModal, ErrorLabel, SelectMulti } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import CreateTaxDetail from "./createTaxDetail";

class TaxEditForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            goods: "",
            percent: "",
        };
        this.state = {};
    }

    componentDidMount() {
        this.props.getAllGoodsByType({ type: "product" });
    }

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

        let options = [];
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

        //Xếp theo alphabet
        if (goodOptions.length) {
            goodOptions.sort((a, b) => {
                if (a.text.toLowerCase() < b.text.toLowerCase()) {
                    return -1;
                } else {
                    return 1;
                }
            });
        }

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
            await this.props.reloadState();
        }
    };

    // handleEditCollection = (collection) => {
    //     console.log("COLLECT", collection);
    // };

    render() {
        const { translate, taxs } = this.props;
        const { code, name, goods, description, nameError, allGoodsSelected, goodsSelected, currentRow, goodsError, percentError } = this.state;
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
                                <SelectMulti
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
                                                        {/* <a
                                                            className="edit text-yellow"
                                                            style={{ width: "5px" }}
                                                            title={"Sửa thông tin thuế"}
                                                            onClick={() => {
                                                                this.handleEditCollection(item);
                                                            }}
                                                        >
                                                            <i className="material-icons">edit</i>
                                                        </a> */}
                                                        <a
                                                            onClick={() => this.handleDeleteGoodsTaxCollection(item)}
                                                            className="delete red-yellow"
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
    const { taxs, goods } = state;
    return { taxs, goods };
}

const mapDispatchToProps = {
    updateTax: TaxActions.updateTax,
    getAllGoodsByType: GoodActions.getAllGoodsByType,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TaxEditForm));
