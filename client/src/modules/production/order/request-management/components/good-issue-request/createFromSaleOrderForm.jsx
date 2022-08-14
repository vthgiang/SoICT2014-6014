import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import GoodComponentRequest from '../../../../common-production/request-management/components/goodComponent';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../../common-components';
import { generateCode } from '../../../../../../helpers/generateCode';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
import { PurchaseOrderActions } from "../../../purchase-order/redux/actions";

function CreateFromSaleOrderForm(props) {

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('-');
    }

    const [state, setState] = useState({
        code: generateCode("PDN"),
        desiredTime: formatDate((new Date()).toISOString()),
        description: "",
        stock: "",
    });

    // Thời gian mong muốn 

    const handleDesiredTimeChange = (value) => {
        if (value.length === 0) {
            value = ""
        }
        setState({
            ...state,
            desiredTime: value
        })
    }

    // Mô tả
    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            description: value,
        });

    }

    // Phần người phê duyệt

    const getApprover = () => {
        let mapOptions = [];
        const { user } = props;
        if (user) {
            mapOptions = [{
                value: "title", //Title không được chọn
                text: "---Chọn người phê duyệt---",
            }];

            user.list.map((user) => {
                mapOptions.push({
                    value: user._id,
                    text: user.name,
                });
            });
        }
        return mapOptions;
    }

    const handleApproverChange = (value) => {
        let approver = value[0];
        validateApprover(approver, true);
    };

    const validateApprover = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("production.request_management.validate_approver_in_order");
        }
        if (willUpdateState) {
            let approvers = [];
            let information = [];
            information.push({
                approver: value,
                approvedTime: null,
            });
            approvers.push({
                information: information,
                approveType: 3
            });
            setState({
                ...state,
                approver: value,
                approvers: approvers,
                errorApprover: msg,
            });
        }
        return msg === undefined;
    };

    // Phần đơn mua hàng

    const getSaleOrder = () => {
        let mapOptions = [];
        console.log(props);
        const { salesOrders } = props;
        if (salesOrders) {
            mapOptions = [{
                value: "", 
                text: "---Chọn đơn mua hàng---",
            }];

            salesOrders.listSalesOrders.map((saleOrder) => {
                mapOptions.push({
                    value: saleOrder._id,
                    text: saleOrder.code,
                });
            });
        }
        return mapOptions;
    }

    const handleSaleOrderChange = (value) => {
        let saleOrder = value[0];
        validateSaleOrder(saleOrder, true);
    };

    const validateSaleOrder = (value, willUpdateState = true) => {
        let msg = undefined;
        let saleOrder ;
        const { translate, salesOrders } = props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_stock");
        }
        if (willUpdateState) {
            let listGoods = [];
            if (value) {
                let saleOrderIds = salesOrders.listSalesOrders.map(x => x._id);
                saleOrder = salesOrders.listSalesOrders[saleOrderIds.indexOf(value)];
                listGoods = salesOrders.listSalesOrders[saleOrderIds.indexOf(value)].goods.map((good) => {
                    return {
                        goodId: good.good._id,
                        goodObject: good.good,
                        quantity: good.quantity
                    }
                });
            }
            setState({
                ...state,
                saleOrder: value,
                errorSaleOrder: msg,
                listGoods: listGoods,
            });
        }
        return msg === undefined;
    };

    // phần kho
    const handleStockChange = (value) => {
        let stock = value[0];
        validateStock(stock, true);
    };

    const validateStock = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("production.request_management.validate_stock");
        }
        if (willUpdateState) {
            setState({
                ...state,
                stock: value,
                errorStock: msg,
            });
        }
        return msg === undefined;
    };

    const getStock = () => {
        const { stocks, translate } = props;
        let stockArr = [{ value: "", text: translate("production.request_management.choose_stock") }];

        stocks.listStocks.map((item) => {
            stockArr.push({
                value: item._id,
                text: item.name,
            });
        });

        return stockArr;
    };

    // Phần lưu dữ liệu

    const isFormValidated = () => {
        let { approver, stock, listGoods } = state;
        let result = validateApprover(approver, false) &&
            validateStock(stock, false) &&
            listGoods.length > 0
        return result;
    }

    const save = () => {
        if (isFormValidated()) {
            let { listGoods } = state;
            let goods = listGoods.map((good) => {
                return {
                    good: good.goodId,
                    quantity: good.quantity
                }
            })
            const data = {
                code: state.code,
                desiredTime: state.desiredTime,
                description: state.description,
                goods: goods,
                stock: state.stock,
                requestType: 2,
                type: 2,
                status: 1,
                approvers: state.approvers,
                saleOrder: state.saleOrder,
            }
            props.createRequest(data);
            props.updatePurchaseOrder(saleOrder, {status: 3});
        }
    }

    const onHandleGoodChange = (data) => {
        setState({
            ...state,
            listGoods: data
        });
    }

    const { translate, bigModal } = props;
    const { code, desiredTime, errorDesiredTime, description, approver, errorApprover, errorStock, stock, errorSaleOrder, saleOrder, listGoods } = state;
    const dataStock = getStock();
    const dataApprover = getApprover();
    const dataSaleOrder = getSaleOrder();
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-request-from-sale-order"
                formID="modal-create-request-from-sale-order"
                title={translate('production.request_management.add_request')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={bigModal ? 75 : 50}
            >
                <form id="modal-create-request-from-sale-order">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate("production.request_management.base_infomation")}</legend>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('production.request_management.code')}<span className="text-red">*</span></label>
                                <input type="text" disabled={true} value={code} className="form-control"></input>
                            </div>

                            <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                <label>
                                    {translate("production.request_management.unit_receiving_request")}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-stock`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={stock}
                                    items={dataStock}
                                    onChange={handleStockChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorStock} />
                            </div>
                            <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                <label>
                                    {translate("production.request_management.approver_in_order")}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-approver`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={approver}
                                    items={dataApprover}
                                    onChange={handleApproverChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorApprover} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorSaleOrder ? "" : "has-error"}`}>
                                <label>
                                    {"Đơn mua hàng"}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-sale-order`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={saleOrder}
                                    items={dataSaleOrder}
                                    onChange={handleSaleOrderChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorSaleOrder} />
                            </div>
                            <div className={`form-group ${!errorDesiredTime ? "" : "has-error"}`}>
                                <label>{translate('production.request_management.desiredTime')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`purchasing-request-create-desiredTime`}
                                    value={desiredTime}
                                    onChange={handleDesiredTimeChange}
                                />
                                <ErrorLabel content={errorDesiredTime} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={`form-group`}>
                                <label>{translate('production.request_management.description')}</label>
                                <textarea type="text" className="form-control" value={description} onChange={handleDescriptionChange} />
                            </div>
                        </div>
                    </fieldset>
                    <GoodComponentRequest onHandleGoodChange={onHandleGoodChange} requestId={saleOrder} listGoods={listGoods} selectBoxName={"create-receipt-request-from-purchase-order"}/>
                </form>
            </DialogModal>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
    createRequest: RequestActions.createRequest,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    updatePurchaseOrder: PurchaseOrderActions.updatePurchaseOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateFromSaleOrderForm));
