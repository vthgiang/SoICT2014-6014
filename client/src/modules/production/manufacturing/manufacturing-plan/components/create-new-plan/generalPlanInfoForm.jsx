import React, { Component } from "react";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import { connect } from "react-redux";
import { DatePicker, ErrorLabel, SelectBox } from "../../../../../../common-components";
import { LotActions } from "../../../../warehouse/inventory-management/redux/actions";
import { compareLtDate, compareLteDate, formatDate } from "../../../../../../helpers/formatDate";
import { PaymentActions } from "../../../../order/payment/redux/actions";
import SalesOrderDetailForm from "../../../../order/sales-order/components/salesOrderDetailForm";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";

class PlanInfoForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            goodId: "1",
            baseUnit: "",
            inventory: "",
            quantity: "",
        };
        this.state = {
            good: Object.assign({}, this.EMPTY_GOOD),
            currentGoodId: "1",
            approvers: this.props.approvers,
        };
    }

    handleStartDateChange = (value) => {
        this.validateStartDateChange(value, true);
    };

    validateStartDateChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manufacturing.plan.choose_start_date");
        }
        if (value && this.state.endDate) {
            let obj = compareLteDate(value, this.state.endDate);
            if (!obj.status) {
                msg = translate("manufacturing.plan.choose_date_error");
            }
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                startDate: value,
                startDateError: msg,
                endDateError: msg
            }));
        }
        this.props.onStartDateChange(value);
        return msg;
    }


    handleEndDateChange = (value) => {
        this.validateEndDateChange(value, true);
    };

    validateEndDateChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate("manufacturing.plan.choose_end_date");
        }
        if (value && this.state.endDate) {
            let obj = compareLteDate(this.state.startDate, value);
            if (!obj.status) {
                msg = translate("manufacturing.plan.choose_date_error");
            }
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                endDate: value,
                endDateError: msg,
                startDateError: msg
            }));
        }
        this.props.onEndDateChange(value);
        return msg;
    }

    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.props.onDescriptionChange(value);
    };

    getListSalesOrdersArr = () => {
        const { translate, salesOrders } = this.props;
        let listSalesOrderArr = [];
        const { listSalesOrdersWorks } = salesOrders;
        if (listSalesOrdersWorks) {
            listSalesOrdersWorks.map((order) => {
                listSalesOrderArr.push({
                    value: order._id,
                    text: order.code + " - " + translate(`manufacturing.plan.sales_order.${order.priority}.content`),
                });
            });
        }
        return listSalesOrderArr;
    };

    handleSalesOrdersChange = (value) => {
        this.props.onSalesOrdersChange(value);
    };

    findIndex = (array, id) => {
        let result = -1;
        array.map((x, index) => {
            if (x.good._id === id) {
                result = index;
            }
        });
        return result;
    };

    // getListApproversArr = () => {
    //     const { manufacturingPlan } = this.props;
    //     let listUsersArr = [];
    //     const { listApprovers } = manufacturingPlan;
    //     if (listApprovers) {
    //         listApprovers.map(approver => {
    //             listUsersArr.push({
    //                 value: approver._id,
    //                 text: approver.userId.name + " - " + approver.userId.email
    //             })
    //         })
    //     }

    //     return listUsersArr;
    // }

    getUserArray = () => {
        const { user } = this.props;
        const { usercompanys } = user;
        let userArray = [];
        if (usercompanys) {
            usercompanys.map((user) => {
                userArray.push({
                    value: user._id,
                    text: user.name + " - " + user.email,
                });
            });
        }
        return userArray;
    };

    handleApproversChange = (value) => {
        if (value.length === 0) {
            value = undefined;
        }
        this.validateApproversChange(value, true);
    };

    validateApproversChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value || !value.length) {
            msg = translate("manufacturing.plan.choose_approvers");
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                approvers: value,
                errorApprovers: msg,
            }));
        }
        this.props.onApproversChange(this.state.approvers);
        return msg;
    };

    getAllGoods = () => {
        const { translate, goods } = this.props;
        let listGoods = [
            {
                value: "1",
                text: translate("manufacturing.plan.choose_good_input"),
            },
        ];
        const { listGoodsByRole } = goods;

        if (listGoodsByRole) {
            listGoodsByRole.map((item) => {
                listGoods.push({
                    value: item._id,
                    text: item.code + " - " + item.name,
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
            msg = translate("manufacturing.plan.error_good");
        }

        if (willUpdateState) {
            let { good } = this.state;

            good.goodId = value;

            const { goods } = this.props;
            const { listGoodsByRole } = goods;
            let goodArrFilter = listGoodsByRole.filter((x) => x._id === good.goodId);

            if (goodArrFilter.length) {
                good.baseUnit = goodArrFilter[0].baseUnit;
                const { lots } = this.props;
                const { listInventories } = lots;
                if (listInventories && listInventories.length) {
                    good.inventory = listInventories[0].inventory;
                }
            } else {
                good.inventory = "";
                good.baseUnit = "";
            }
            this.setState((state) => ({
                ...state,
                good: { ...good },
                errorGood: msg,
                currentGoodId: value,
            }));
        }
        return msg;
    };

    handleQuantityChange = (e) => {
        let { value } = e.target;
        this.validateQuantityChange(value, true);
    };

    validateQuantityChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate("manufacturing.plan.error_quantity");
        }
        if (value < 1) {
            msg = translate("manufacturing.plan.error_quantity_input");
        }
        if (willUpdateState) {
            let { good } = this.state;
            good.quantity = value === "" ? value : Number(value);
            this.setState((state) => ({
                ...state,
                good: { ...good },
                errorQuantity: msg,
            }));
        }
        return msg;
    };

    isGoodValidated = () => {
        if (this.validateGoodChange(this.state.good.goodId, false) || this.validateQuantityChange(this.state.good.quantity, false)) {
            return false;
        }
        return true;
    };

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState({
            good: Object.assign({}, this.EMPTY_GOOD),
            currentGoodId: "1",
        });
    };

    handleAddGood = (e) => {
        e.preventDefault();
        const { good } = this.state;
        this.props.onAddGood(good);
        this.setState((state) => ({
            ...state,
            good: Object.assign({}, this.EMPTY_GOOD),
            currentGoodId: "1",
        }));
    };

    handleEditGood = (good, index) => {
        good.baseUnit = good.good.baseUnit;
        good.goodId = good.good._id;
        this.setState((state) => ({
            ...state,
            editGood: true,
            good: { ...good },
            indexEditting: index,
        }));
    };

    handleCancelEditGood = (e) => {
        e.preventDefault();
        this.setState((state) => ({
            ...state,
            editGood: false,
            good: Object.assign({}, this.EMPTY_GOOD),
            currentGoodId: "1",
        }));
    };

    handleSaveEditGood = (e) => {
        e.preventDefault();
        const { good, indexEditting } = this.state;
        this.props.onSaveEditGood(good, indexEditting);
        this.setState((state) => ({
            ...state,
            editGood: false,
            good: Object.assign({}, this.EMPTY_GOOD),
            currentGoodId: "1",
        }));
    };

    handleDeleteGood = (index) => {
        this.props.onDeleteGood(index);
        this.setState((state) => ({
            ...state,
            good: Object.assign({}, this.EMPTY_GOOD),
            currentGoodId: "1",
            editGood: false,
        }));
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.currentGoodId !== "1" && this.state.currentGoodId !== nextState.currentGoodId) {
            this.props.getInventoryByGoodId({
                array: [nextState.currentGoodId],
            });
            return false;
        }
        return true;
    };

    static getDerivedStateFromProps = (props, state) => {
        if (state.currentGoodId !== "1" && props.lots.currentInventory) {
            state.good.inventory = props.lots.currentInventory.inventory;
            return {
                ...state,
                good: { ...state.good },
            };
        }
        return null;
    }

    // Hàm trả về danh sách đơn hàng đã chọn
    getListSalesOrdersChoosed = (salesOrderIds) => {
        const { salesOrders } = this.props;
        let listSalesOrderChoosed = [];
        const { listSalesOrders } = salesOrders;
        if (listSalesOrders && listSalesOrders.length) {
            listSalesOrders.map(x => {
                if (salesOrderIds.includes(x._id)) {
                    listSalesOrderChoosed.push(x);
                }
            });
            return listSalesOrderChoosed;
        }
        return [];
    }

    handleShowDetailSalesOrder = async (data) => {
        await this.props.getPaymentForOrder({ orderId: data._id, orderType: 1 });
        await this.setState((state) => {
            return {
                ...state,
                salesOrderDetail: data,
            };
        });
        await window.$("#modal-detail-sales-order").modal("show");
    }

    render() {
        const { translate, code, salesOrderIds, startDate, endDate, description, listGoodsSalesOrders, addedAllGoods, listGoods } = this.props;
        const { good, errorGood, errorQuantity, approvers, errorApprovers, startDateError, endDateError } = this.state;
        let listSalesOrdersChoosed = [];
        listSalesOrdersChoosed = this.getListSalesOrdersChoosed(salesOrderIds);

        const dataStatus = [
            {
                className: "text-primary",
                text: translate('manufacturing.plan.sales_order.a')
            },
            {
                className: "text-primary",
                text: translate('manufacturing.plan.sales_order.b')
            },
            {
                className: "text-warning",
                text: translate('manufacturing.plan.sales_order.c')
            },
            {
                className: "text-dark",
                text: translate('manufacturing.plan.sales_order.d')
            },
            {
                className: "text-secondary",
                text: translate('manufacturing.plan.sales_order.e')
            },
            {
                className: "text-success",
                text: translate('manufacturing.plan.sales_order.f')
            },
            {
                className: "text-danger",
                text: translate('manufacturing.plan.sales_order.g')
            },
        ];


        const dataPriority = [
            {
                className: "text-primary",
                text: translate('manufacturing.plan.sales_order.0.content'),
            },
            {
                className: "text-muted",
                text: translate('manufacturing.plan.sales_order.1.content')
            },
            {
                className: "text-primary",
                text: translate('manufacturing.plan.sales_order.2.content')

            },
            {
                className: "text-success",
                text: translate('manufacturing.plan.sales_order.3.content')
            },
            {
                className: "text-danger",
                text: translate('manufacturing.plan.sales_order.4.content')
            },
        ];
        return (
            <React.Fragment>
                {this.state.salesOrderDetail && <SalesOrderDetailForm salesOrderDetail={this.state.salesOrderDetail} />}
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="form-group">
                            <label>
                                {translate("manufacturing.plan.code")}
                                <span className="text-red">*</span>
                            </label>
                            <input type="text" value={code} disabled={true} className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>{translate("manufacturing.plan.sales_order_code")}</label>
                            <SelectBox
                                id="select-sales-order"
                                className="form-control select"
                                style={{ width: "100%" }}
                                items={this.getListSalesOrdersArr()}
                                onChange={this.handleSalesOrdersChange}
                                value={salesOrderIds}
                                multiple={true}
                            />
                        </div>
                        <div className={`form-group ${!errorApprovers ? "" : "has-error"}`}>
                            <label>
                                {translate("manufacturing.plan.approvers")}
                                <span className="text-red">*</span>
                            </label>
                            <SelectBox
                                id="select-approvers-of-plan"
                                className="form-control select"
                                style={{ width: "100%" }}
                                items={this.getUserArray()}
                                disabled={false}
                                onChange={this.handleApproversChange}
                                value={approvers}
                                multiple={true}
                            />
                            <ErrorLabel content={errorApprovers} />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group ${!startDateError ? "" : "has-error"}`}>
                            <label>
                                {translate("manufacturing.plan.start_date")}
                                <span className="text-red">*</span>
                            </label>
                            <DatePicker
                                id={`maintain_after_start_date`}
                                // dateFormat={dateFormat}
                                value={startDate}
                                onChange={this.handleStartDateChange}
                                disabled={false}
                            />
                            <ErrorLabel content={startDateError} />
                        </div>
                        <div className={`form-group ${!endDateError ? "" : "has-error"}`}>
                            <label>
                                {translate("manufacturing.plan.end_date")}
                                <span className="text-red">*</span>
                            </label>
                            <DatePicker
                                id={`maintain_after_end_date`}
                                // dateFormat={dateFormat}
                                value={endDate}
                                onChange={this.handleEndDateChange}
                                disabled={false}
                            />
                            <ErrorLabel content={endDateError} />
                        </div>
                        <div className="form-group">
                            <label>{translate("manufacturing.plan.description")}</label>
                            <textarea type="text" value={description} onChange={this.handleDescriptionChange} className="form-control"></textarea>
                        </div>
                    </div>
                </div>
                {
                    listSalesOrdersChoosed && listSalesOrdersChoosed.length > 0 &&
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manufacturing.plan.list_order')}</legend>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>{translate('manufacturing.plan.index')}</th>
                                            <th>{translate('manufacturing.plan.sales_order.code')}</th>
                                            <th>{translate('manufacturing.plan.sales_order.creator')}</th>
                                            <th>{translate('manufacturing.plan.sales_order.customer')}</th>
                                            <th>{translate('manufacturing.plan.sales_order.total_money')}</th>
                                            <th>{translate('manufacturing.plan.sales_order.status')}</th>
                                            <th>{translate('manufacturing.plan.sales_order.priority')}</th>
                                            <th>{translate('manufacturing.plan.sales_order.intend_deliver_good')}</th>
                                            <th style={{ width: "120px", textAlign: "center" }}>
                                                {translate("table.action")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            listSalesOrdersChoosed.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.code}</td>
                                                    <td>{x.creator ? x.creator.name : ""}</td>
                                                    <td>{x.customer ? x.customer.name : ""}</td>
                                                    <td>{x.paymentAmount ? formatCurrency(x.paymentAmount) + " VNĐ" : "---"}</td>
                                                    <td className={dataStatus[x.status].className}>{dataStatus[x.status].text}</td>
                                                    <td className={dataPriority[x.priority].className}>{dataPriority[x.priority].text}</td>
                                                    <td>{x.deliveryTime ? formatDate(x.deliveryTime) : "---"}</td>
                                                    <td>
                                                        <a style={{ width: '5px' }} title={translate('manufacturing.plan.sales_order.detail_sales_order')} onClick={() => { this.handleShowDetailSalesOrder(x) }}><i className="material-icons">view_list</i></a>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </div>
                }
                {
                    listGoodsSalesOrders.length > 0 &&
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate("manufacturing.plan.sales_order_info")}</legend>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>{translate("manufacturing.plan.index")}</th>
                                            <th>{translate("manufacturing.plan.good_code")}</th>
                                            <th>{translate("manufacturing.plan.good_name")}</th>
                                            <th>{translate("manufacturing.plan.base_unit")}</th>
                                            <th>{translate("manufacturing.plan.quantity_good_inventory")}</th>
                                            <th>{translate("manufacturing.plan.quantity_order")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listGoodsSalesOrders.map((x, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{x.good.code}</td>
                                                <td>{x.good.name}</td>
                                                <td>{x.good.baseUnit}</td>
                                                <td>{x.inventory}</td>
                                                <td>{x.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {!addedAllGoods ? (
                                    <div className="pull-right" style={{ marginBottom: "10px" }}>
                                        <button
                                            className="btn btn-primary"
                                            style={{ marginLeft: "10px" }}
                                            onClick={() => {
                                                this.props.onAddAllGood();
                                            }}
                                        >
                                            {translate("manufacturing.plan.add_to_plan")}
                                        </button>
                                    </div>
                                ) : (
                                        <div className="pull-right" style={{ marginBottom: "10px" }}>
                                            <button className="btn btn-primary" style={{ marginLeft: "10px" }} disabled={true}>
                                                {translate("manufacturing.plan.added_to_plan")}
                                            </button>
                                        </div>
                                    )}
                            </fieldset>
                        </div>
                    </div>
                }

                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate("manufacturing.plan.add_good_info")}</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorGood ? "" : "has-error"}`}>
                                        <label>{translate("manufacturing.plan.choose_good")}</label>
                                        <SelectBox
                                            id={`select-good-of-plan`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={good.goodId}
                                            items={this.getAllGoods()}
                                            onChange={this.handleGoodChange}
                                            multiple={false}
                                        />
                                        <ErrorLabel content={errorGood} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate("manufacturing.plan.quantity_good_inventory")}</label>
                                        <input type="number" value={good.inventory} disabled={true} className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate("manufacturing.plan.base_unit")}</label>
                                        <input type="text" value={good.baseUnit} disabled={true} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group  ${!errorQuantity ? "" : "has-error"}`}>
                                        <label>{translate("manufacturing.plan.quantity")}</label>
                                        <input type="number" value={good.quantity} onChange={this.handleQuantityChange} className="form-control" />
                                        <ErrorLabel content={errorQuantity} />
                                    </div>
                                </div>
                            </div>
                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                {this.state.editGood ? (
                                    <React.Fragment>
                                        <button className="btn btn-success" onClick={this.handleCancelEditGood} style={{ marginLeft: "10px" }}>
                                            {translate("manufacturing.purchasing_request.cancel_editing_good")}
                                        </button>
                                        <button className="btn btn-success" onClick={this.handleSaveEditGood} style={{ marginLeft: "10px" }}>
                                            {translate("manufacturing.purchasing_request.save_good")}
                                        </button>
                                    </React.Fragment>
                                ) : (
                                        <button
                                            className="btn btn-success"
                                            style={{ marginLeft: "10px" }}
                                            disabled={!this.isGoodValidated()}
                                            onClick={this.handleAddGood}
                                        >
                                            {translate("manufacturing.purchasing_request.add_good")}
                                        </button>
                                    )}
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>
                                    {translate("manufacturing.purchasing_request.delete_good")}
                                </button>
                            </div>
                        </fieldset>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>{translate("manufacturing.plan.index")}</th>
                                    <th>{translate("manufacturing.plan.good_code")}</th>
                                    <th>{translate("manufacturing.plan.good_name")}</th>
                                    <th>{translate("manufacturing.plan.base_unit")}</th>
                                    <th>{translate("manufacturing.plan.quantity_good_inventory")}</th>
                                    <th>{translate("manufacturing.plan.quantity")}</th>
                                    <th>{translate("table.action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listGoods && listGoods.length === 0 ? (
                                    <tr>
                                        <td colSpan={7}>{translate("general.no_data")}</td>
                                    </tr>
                                ) : (
                                        listGoods.map((x, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{x.good.code}</td>
                                                <td>{x.good.name}</td>
                                                <td>{x.good.baseUnit}</td>
                                                <td>{x.inventory}</td>
                                                <td>{x.quantity}</td>
                                                <td>
                                                    <a
                                                        href="#abc"
                                                        className="edit"
                                                        title={translate("general.edit")}
                                                        onClick={() => this.handleEditGood(x, index)}
                                                    >
                                                        <i className="material-icons"></i>
                                                    </a>
                                                    <a
                                                        href="#abc"
                                                        className="delete"
                                                        title={translate("general.delete")}
                                                        onClick={() => this.handleDeleteGood(index)}
                                                    >
                                                        <i className="material-icons"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { salesOrders, manufacturingPlan, goods, lots, user } = state;
    return { salesOrders, manufacturingPlan, goods, lots, user };
}

const mapDispatchToProps = {
    getInventoryByGoodId: LotActions.getInventoryByGoodId,
    getPaymentForOrder: PaymentActions.getPaymentForOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PlanInfoForm));
