import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, ErrorLabel } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";

class CreateTaxDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goods: [],
            percent: "",
            key: "",
            goodsDeleted: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data.key !== prevState.key) {
            return {
                ...prevState,
                goods: nextProps.data.goods,
                percent: nextProps.data.percent,
                key: nextProps.data.key,
                goodsDeleted: [],
            };
        } else {
            return null;
        }
    }

    handleDeleteGoodsTax = (item) => {
        let { goods, goodsDeleted } = this.state;
        goodsDeleted.push(item.value);

        let goodsFilter = goods.filter((element) => element.value !== item.value);
        this.setState({
            goods: goodsFilter,
            goodsDeleted,
        });
    };

    handlePercentChange = (e) => {
        let { value } = e.target;
        this.validatePercent(value, true);
    };

    submitChange = () => {
        if (this.isFormValidated()) {
            let data = this.state;
            this.props.handleSubmitGoodChange(data);
        }
    };

    handleRedo = () => {
        if (this.state.key === this.props.data.key) {
            this.setState((state) => {
                return {
                    ...state,
                    goods: this.props.data.goods,
                    percent: this.props.data.percent,
                    key: this.props.data.key,
                    goodsDeleted: [],
                    percentError: undefined,
                };
            });
        }
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
            this.state.percent = value;
            this.setState((state) => {
                return {
                    ...state,
                    percentError: msg,
                };
            });
        }
        return msg;
    };

    isFormValidated = () => {
        const { percent, goods } = this.state;
        let { translate } = this.props;

        if (!goods.length) {
            //Nếu good bị xóa hết thì không cần validate percent
            if (this.state.percentError) {
                this.setState((state) => {
                    return {
                        ...state,
                        percentError: undefined,
                    };
                });
            }
            return true;
        }

        if (!ValidationHelper.validateEmpty(translate, percent).status || this.validatePercent(percent, false)) {
            return false;
        }
        return true;
    };

    render() {
        let { goods, percent, percentError } = this.state;
        const { translate } = this.props;
        return (
            <DialogModal
                modalID={`modal-create-tax-detail-good`}
                isLoading={false}
                formID={`form-create-tax-detail-good`}
                title={translate("manage_order.tax.detail_goods")}
                size="75"
                style={{ backgroundColor: "green" }}
                func={this.submitChange}
                disableSubmit={!this.isFormValidated()}
            >
                <div className={`form-group ${!percentError ? "" : "has-error"}`}>
                    <label>
                        {translate("manage_order.tax.tax_percent")}
                        <span className="attention"> * </span>
                    </label>
                    <input type="number" className="form-control" placeholder="Nhập %" value={percent} onChange={this.handlePercentChange} />
                    <ErrorLabel content={percentError} />
                </div>
                <table id={`order-table-tax-create`} className="table table-bordered">
                    <thead>
                        <tr>
                            <th title={"STT"}>{translate("manage_order.tax.index")}</th>
                            <th title={"Tên"}>{translate("manage_order.tax.code")}</th>
                            <th>{translate("manage_order.tax.name")}</th>
                            <th>{translate("manage_order.tax.action")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goods &&
                            goods.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.code}</td>
                                        <td>{item.name}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a
                                                onClick={() => this.handleDeleteGoodsTax(item)}
                                                className="delete red-yellow"
                                                style={{ width: "5px" }}
                                                title={translate("manage_order.tax.delete_good")}
                                            >
                                                <i className="material-icons">delete</i>
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                <div className={"pull-right"} style={{ padding: 10 }}>
                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleRedo}>
                        {"Hoàn tác"}
                    </button>
                </div>
            </DialogModal>
        );
    }
}

export default connect(null, null)(withTranslate(CreateTaxDetail));
