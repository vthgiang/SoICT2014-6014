import React, { Component } from 'react';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { connect } from 'react-redux';
import { DatePicker, ErrorLabel, SelectBox } from '../../../../../../common-components';
import sampleData from '../../../sampleData';
import { LotActions } from '../../../../warehouse/inventory-management/redux/actions';


class PlanInfoForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            goodId: '1',
            baseUnit: '',
            inventory: '',
            quantity: ''
        }
        this.state = {
            good: Object.assign({}, this.EMPTY_GOOD),
            currentGoodId: '1'
        };
    }

    handleStartDateChange = (value) => {
        this.props.onStartDateChange(value);
    }

    handleEndDateChange = (value) => {
        this.props.onEndDateChange(value);
    }

    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.props.onDescriptionChange(value);
    }

    getListSalesOrdersArr = () => {
        const { translate, salesOrder } = this.props;
        let listSalesOrderArr = [];
        const { listSalesOrders } = salesOrder;
        if (listSalesOrders) {
            listSalesOrders.map(order => {
                listSalesOrderArr.push({
                    value: order._id,
                    text: order.code + " - " + translate(`manufacturing.plan.sales_order.${order.priority}.content`)
                })
            })
        }
        return listSalesOrderArr;
    }

    handleSalesOrdersChange = (value) => {
        this.props.onSalesOrdersChange(value)
    }

    getListApproversArr = () => {
        const { manufacturingPlan } = this.props;
        let listUsersArr = [];
        const { listApprovers } = manufacturingPlan;
        if (listApprovers) {
            listApprovers.map(approver => {
                listUsersArr.push({
                    value: approver._id,
                    text: approver.userId.name + " - " + approver.userId.email
                })
            })
        }

        return listUsersArr;
    }

    getAllGoods = () => {
        const { translate, goods } = this.props;
        let listGoods = [{
            value: "1",
            text: translate('manufacturing.plan.choose_good_input')
        }];
        const { listGoodsByType } = goods;

        if (listGoodsByType) {
            listGoodsByType.map((item) => {
                listGoods.push({
                    value: item._id,
                    text: item.code + " - " + item.name
                })
            })
        }
        return listGoods
    }

    handleGoodChange = (value) => {
        const goodId = value[0];
        this.validateGoodChange(goodId, true);
    }

    validateGoodChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "1") {
            msg = translate('manufacturing.plan.error_good')
        }

        if (willUpdateState) {
            let { good } = this.state;

            good.goodId = value

            const { goods } = this.props;
            const { listGoodsByType } = goods;
            let goodArrFilter = listGoodsByType.filter(x => x._id === good.goodId);
            if (goodArrFilter.length) {
                good.baseUnit = goodArrFilter[0].baseUnit;
                const { lots } = this.props;
                const { listInventories } = lots;
                if (listInventories) {
                    good.inventory = listInventories[0].inventory
                }
            } else {
                good.inventory = ""
                good.baseUnit = ""
            }
            this.setState((state) => ({
                ...state,
                good: { ...good },
                errorGood: msg,
                currentGoodId: value
            }))
        }
        return msg;
    }

    handleQuantityChange = (e) => {
        let { value } = e.target;
        this.validateQuantityChange(value, true);
    }

    validateQuantityChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === '') {
            msg = translate('manufacturing.plan.error_quantity')
        }
        if (value < 1) {
            msg = translate('manufacturing.plan.error_quantity_input')
        }
        if (willUpdateState) {
            let { good } = this.state;
            good.quantity = value;
            this.setState((state) => ({
                ...state,
                good: { ...good },
                errorQuantity: msg
            }));
        }
        return msg;

    }

    isGoodValidated = () => {
        if (this.validateGoodChange(this.state.good.goodId, false)
            || this.validateQuantityChange(this.state.good.quantity, false)
        ) {
            return false;
        }
        return true
    }

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState({
            good: Object.assign({}, this.EMPTY_GOOD)
        });
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.currentGoodId !== "1" && this.state.currentGoodId !== nextState.currentGoodId) {
            this.props.getInventoryByGoodIds({
                array: [nextState.currentGoodId]
            });
            return false;
        }
        return true;
    }

    static getDerivedStateFromProps = (props, state) => {
        if (state.currentGoodId !== "1" && props.lots.listInventories) {
            state.good.inventory = props.lots.listInventories[0].inventory;
            return {
                ...state,
                good: { ...state.good }
            }
        }
        return null;
    }


    render() {
        console.log(this.state.good);
        const { translate, code, salesOrders, approvers, startDate, endDate, description } = this.props;
        const { good, errorGood, errorQuantity } = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.code')}<span className="text-red">*</span></label>
                            <input type="text" value={code} disabled={true} className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.sales_order_code')}</label>
                            <SelectBox
                                id="select-sales-order"
                                className="form-control select"
                                style={{ width: "100%" }}
                                items={this.getListSalesOrdersArr()}
                                onChange={this.handleSalesOrdersChange}
                                value={salesOrders}
                                multiple={true}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.approvers')}<span className="text-red">*</span></label>
                            <SelectBox
                                id="select-approvers-of-plan"
                                className="form-control select"
                                style={{ width: "100%" }}
                                items={this.getListApproversArr()}
                                disabled={true}
                                onChange={this.handleChangeValue}
                                value={approvers}
                                multiple={true}
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.start_date')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`maintain_after_start_date`}
                                // dateFormat={dateFormat}
                                value={startDate}
                                onChange={this.handleStartDateChange}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.end_date')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`maintain_after_end_date`}
                                // dateFormat={dateFormat}
                                value={endDate}
                                onChange={this.handleEndDateChange}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.description')}</label>
                            <textarea type="text" value={description} onChange={this.handleDescriptionChange} className="form-control"></textarea>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing.plan.add_good_info')}</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorGood ? "" : "has-error"}`}>
                                        <label>{translate('manufacturing.plan.choose_good')}</label>
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
                                        <label>{translate('manufacturing.plan.quantity_good_inventory')}</label>
                                        <input type="number" value={good.inventory} disabled={true} className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate('manufacturing.plan.base_unit')}</label>
                                        <input type="text" value={good.baseUnit} disabled={true} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group  ${!errorQuantity ? "" : "has-error"}`}>
                                        <label>{translate('manufacturing.plan.quantity')}</label>
                                        <input type="number" value={good.quantity} onChange={this.handleQuantityChange} className="form-control" />
                                        <ErrorLabel content={errorQuantity} />
                                    </div>
                                </div>
                            </div>
                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                {this.state.editBill ?
                                    <React.Fragment>
                                        <button className="btn btn-success" onClick={this.handleCancelEditBill} style={{ marginLeft: "10px" }}>{translate('manufacturing.purchasing_request.cancel_editing_good')}</button>
                                        <button className="btn btn-success" onClick={this.handleSaveEditBill} style={{ marginLeft: "10px" }}>{translate('manufacturing.purchasing_request.save_good')}</button>
                                    </React.Fragment> :
                                    <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isGoodValidated()} onClick={this.handleAddBill}>{translate('manufacturing.purchasing_request.add_good')}</button>
                                }
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>{translate('manufacturing.purchasing_request.delete_good')}</button>
                            </div>
                        </fieldset>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>{translate('manufacturing.plan.index')}</th>
                                    <th>{translate('manufacturing.plan.good_code')}</th>
                                    <th>{translate('manufacturing.plan.good_name')}</th>
                                    <th>{translate('manufacturing.plan.base_unit')}</th>
                                    <th>{translate('manufacturing.plan.quantity_good_inventory')}</th>
                                    <th>{translate('manufacturing.plan.quantity')}</th>
                                    <th>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { salesOrder, manufacturingPlan, goods, lots } = state;
    return { salesOrder, manufacturingPlan, goods, lots }
}

const mapDispatchToProps = {
    getInventoryByGoodIds: LotActions.getInventoryByGoodIds
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PlanInfoForm));