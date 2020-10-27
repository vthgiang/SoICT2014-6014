import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { generateCode } from "../../../../../helpers/generateCode";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { TaxActions } from "../redux/actions";
import { DialogModal, SelectMulti, ButtonModal, DataTableSetting, ErrorLabel } from "../../../../../common-components";
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
            goodsSelections: Object.assign({}, this.EMPTY_GOOD),
            allGoodsSelections: [],
            type: "product",
            goodOptionsState: [],
            limit: 5,
            page: 1,
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
        // this.state.goodsSelections.percent = e.target.value;
        // this.setState((state) => {
        //     return {
        //         ...state,
        //     };
        // });
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

        let { goodsSelections, allGoodsSelections, goodOptionsState } = this.state;

        //Nếu chưa có goodOptionsState thì thêm vào
        if (!goodOptionsState.length && !allGoodsSelections.length) {
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
            goodsSelections.goods.forEach((e) => {
                if (e === good.value) {
                    check = true;
                }
            });
            if (!check) {
                return good;
            }
        });

        goodsSelections.key = goodsSelections.goods[0]; //Thêm key để có thể xóa
        allGoodsSelections.push(goodsSelections);

        this.setState({
            ...this.state,
            allGoodsSelections,
            goodsSelections: Object.assign({}, this.EMPTY_GOOD),
            goodOptionsState: mapOption,
        });
    };

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState((state) => {
            return {
                ...this.state,
                goodsSelections: Object.assign({}, this.EMPTY_GOOD),
            };
        });
    };

    handleDeleteGoodsTaxCollection = (item) => {
        console.log("ITEM", item);
        let { allGoodsSelections, goodOptionsState } = this.state;
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

        console.log("DELETE ALL OPTION O DAY", goodOptionsState);

        //Xóa các phần tử bị xóa
        let collections = allGoodsSelections.filter((collection) => {
            return collection.key !== item.key;
        });

        this.setState((state) => {
            return {
                ...state,
                allGoodsSelections: collections,
                goodOptionsState,
            };
        });
    };

    handleSubmitGoodChange = (data) => {
        let { allGoodsSelections, goodOptionsState } = this.state;
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
            console.log("goodOptionsState O DAY", goodOptionsState);

            let collections = allGoodsSelections.map((collection) => {
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
                    allGoodsSelections: collections,
                    goodOptionsState,
                };
            });
        }
    };

    getGoodOptions = () => {
        let { allGoodsSelections, goodOptionsState } = this.state;

        let goodOptions =
            goodOptionsState.length || allGoodsSelections.length
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

        return goodOptions;
    };

    checkDisabledSelectGoods = () => {
        let { allGoodsSelections, goodOptionsState } = this.state;

        let disabledSelectGoods = !goodOptionsState.length && allGoodsSelections.length ? true : false;
        return disabledSelectGoods;
    };

    validateGoods = (goods, willUpdateState = true) => {
        let msg = undefined;
        if (!goods) {
            const { translate } = this.props;
            msg = "Phải chọn ít nhất 1 mặt hàng";
        }

        if (willUpdateState) {
            this.state.goodsSelections.goods = goods;
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
        const { percent, goods } = this.state.goodsSelections;
        let { translate } = this.props;
        if (!ValidationHelper.validateEmpty(translate, percent).status || this.validateGoods(goods, false)) {
            return false;
        }
        return true;
    };

    isFormValidated = () => {
        const { taxName, allGoodsSelections, goodsSelections } = this.state;
        let { translate } = this.props;

        if (
            !ValidationHelper.validateEmpty(translate, taxName).status ||
            this.validateGoods(allGoodsSelections, false) ||
            this.validatePercent(goodsSelections, false)
        ) {
            return false;
        }
        return true;
    };

    validatePercent = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = "Chiết khấu thuế không được để trống";
        } else if (value < 0) {
            msg = "Chiết khấu thuế phải lớn hơn 0";
        }
        if (willUpdateState) {
            this.state.goodsSelections.percent = value;
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
            let { allGoodsSelections } = this.state;
            let dataGoods = [];
            allGoodsSelections.forEach((e) => {
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
        }
    };
    render() {
        let {
            taxName,
            code,
            description,
            creator,
            goodsSelections,
            allGoodsSelections,
            currentRow,
            nameTaxError,
            percentError,
            goodsError,
        } = this.state;

        let goodOptions = this.getGoodOptions();
        let disabledSelectGoods = this.checkDisabledSelectGoods();

        console.log("STATE", this.state);

        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreateCode}
                    modalID={`modal-add-tax`}
                    button_name={"Thêm loại thuế"}
                    title={"Thêm loại thuế"}
                />
                <DialogModal
                    modalID={`modal-add-tax`}
                    isLoading={false}
                    formID={`form-add-tax`}
                    title={"Thêm loại thuế mới"}
                    msg_success={"Thêm thuế thành công"}
                    msg_faile={"Thêm thuế không thành công"}
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
                        <div className="row row-equal-height" style={{ marginTop: -25 }}>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10 }}>
                                <div className="form-group">
                                    <label>
                                        Mã thuế
                                        <span className="attention"> </span>
                                    </label>
                                    <input type="text" className="form-control" value={code} disabled="true" />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10 }}>
                                <div className={`form-group ${!nameTaxError ? "" : "has-error"}`}>
                                    <label>
                                        Tên thuế
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control" value={taxName} onChange={this.handleTaxNameChange} />
                                    <ErrorLabel content={nameTaxError} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10 }}>
                                <div className="form-group">
                                    <label>
                                        Mô tả
                                        <span className="attention"> </span>
                                    </label>
                                    <textarea type="text" className="form-control" value={description} onChange={this.handleDescriptionChange} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10 }}>
                                <div className="form-group">
                                    <label>
                                        Người tạo
                                        <span className="attention"> </span>
                                    </label>
                                    <input type="text" className="form-control" value={creator.name} disabled="true" />
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10 }}>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Các mặt hàng</legend>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10 }}>
                                        <div className={`form-group ${!goodsError ? "" : "has-error"}`}>
                                            <label>
                                                Chọn các mặt hàng
                                                <span className="attention"> * </span>
                                            </label>
                                            <SelectMulti
                                                id={`select-multi-good-tax`}
                                                multiple="multiple"
                                                options={{
                                                    nonSelectedText: "Chọn các mặt hàng",
                                                    allSelectedText: "Đã chọn tất cả",
                                                }}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={goodOptions}
                                                value={goodsSelections.goods}
                                                onChange={this.handleGoodsChange}
                                                disabled={disabledSelectGoods}
                                            />
                                            <ErrorLabel content={goodsError} />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10 }}>
                                        <div className={`form-group ${!percentError ? "" : "has-error"}`}>
                                            <label>
                                                Chiết khấu
                                                <span className="attention"> * </span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Nhập %"
                                                value={goodsSelections.percent}
                                                onChange={this.handlePercentChange}
                                            />
                                            <ErrorLabel content={percentError} />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div className={"pull-right"} style={{ padding: 10 }}>
                                            <button
                                                className="btn btn-success"
                                                style={{ marginLeft: "10px" }}
                                                disabled={!this.isGoodsValidated()}
                                                onClick={this.handleSubmitGoods}
                                            >
                                                Thêm mới
                                            </button>
                                            <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>
                                                Xóa trắng
                                            </button>
                                        </div>
                                    </div>
                                    <table id={`order-table-tax-create`} className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={"STT"}>STT</th>
                                                <th title={"Chiết khấu (%)"}>Chiết khấu (%)</th>
                                                <th>Các mặt hàng</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allGoodsSelections &&
                                                allGoodsSelections.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.percent}</td>
                                                            <td>
                                                                <a onClick={() => this.showGoodDetail(item)}>Chi tiết</a>
                                                            </td>
                                                            <td style={{ textAlign: "center" }}>
                                                                <a
                                                                    onClick={() => this.handleDeleteGoodsTaxCollection(item)}
                                                                    className="delete red-yellow"
                                                                    style={{ width: "5px" }}
                                                                    title="Xóa danh sách mặt hàng"
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
                            </div>
                        </div>
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
