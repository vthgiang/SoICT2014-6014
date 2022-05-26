import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import GoodComponentRequest from '../../../../common-production/request-management/components/goodComponent';
import { formatToTimeZoneDate, formatDate } from '../../../../../../helpers/formatDate';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../../common-components';
import { generateCode } from '../../../../../../helpers/generateCode';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
import { PurchaseOrderActions } from "../../../purchase-order/redux/actions";

function CreateFromPurchaseOrderForm(props) {

    const [state, setState] = useState({
        code: generateCode("PDN"),
        desiredTime: "",
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
            desiredTime: formatToTimeZoneDate(value)
        })
    }

    // Mô tả
    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        validateDescriptionChange(value, true);

    }

    const validateDescriptionChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value === "") {
            msg = translate('production.request_management.error_description')
        }
        if (willUpdateState) {
            setState({
                ...state,
                description: value,
                errorDescription: msg
            });
        }

        return msg;
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
            msg = translate("manage_warehouse.bill_management.validate_approver");
        }
        if (willUpdateState) {
            let approvers = [];
            approvers.push({
                approver: value,
                approvedTime: null,
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

    const getPurchaseOrder = () => {
        let mapOptions = [];
        const { purchaseOrders } = props;
        if (purchaseOrders) {
            mapOptions = [{
                value: "", 
                text: "---Chọn đơn mua hàng---",
            }];

            purchaseOrders.listPurchaseOrders.map((purchaseOrder) => {
                mapOptions.push({
                    value: purchaseOrder._id,
                    text: purchaseOrder.code,
                });
            });
        }
        return mapOptions;
    }

    const handlePurchaseOrderChange = (value) => {
        let purchaseOrder = value[0];
        validatePurchaseOrder(purchaseOrder, true);
    };

    const validatePurchaseOrder = (value, willUpdateState = true) => {
        let msg = undefined;
        let purchaseOrder ;
        const { translate, purchaseOrders } = props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_stock");
        }
        console.log(value);
        if (willUpdateState) {
            let listGoods = [];
            if (value) {
                let purchaseOrderIds = purchaseOrders.listPurchaseOrders.map(x => x._id);
                purchaseOrder = purchaseOrders.listPurchaseOrders[purchaseOrderIds.indexOf(value)];
                listGoods = purchaseOrders.listPurchaseOrders[purchaseOrderIds.indexOf(value)].materials.map((material) => {
                    return {
                        goodId: material.material._id,
                        goodObject: material.material,
                        quantity: material.quantity
                    }
                });
            }
            setState({
                ...state,
                purchaseOrder: value,
                errorPurchaseOrder: msg,
                listGoods: listGoods,
                stock: purchaseOrder.stock._id,
                desiredTime: formatDate(purchaseOrder.intendReceiveTime),
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
            msg = translate("manage_warehouse.bill_management.validate_stock");
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
        let stockArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_stock") }];

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
        if (
            validateDescriptionChange(state.description, false)
            || state.desiredTime === ""
            || state.listGoods.length === 0
        ) {
            return false;
        }
        return true;
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
                type: 1,
                status: 1,
                approverReceiptRequestInOrder: state.approvers,
            }
            props.createRequest(data);
            props.updatePurchaseOrder(purchaseOrder, {status: 3});
        }
    }

    const onHandleGoodChange = (data) => {
        setState({
            ...state,
            listGoods: data
        });
    }

    const { translate, bigModal } = props;
    const { code, desiredTime, errorIntendReceiveTime, description, errorDescription, approver, errorApprover, errorStock, stock, errorPurchaseOrder, purchaseOrder, listGoods } = state;
    const dataStock = getStock();
    const dataApprover = getApprover();
    const dataPurchaseOrder = getPurchaseOrder();
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-request-from-purchase-order"
                formID="modal-create-request-from-purchase-order"
                title={translate('production.request_management.add_request')}
                msg_success={translate('production.request_management.create_successfully')}
                msg_failure={translate('production.request_management.create_failed')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={bigModal ? 75 : 50}
                maxWidth={500}
            >
                <form id="modal-create-request-from-purchase-order">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate("manage_warehouse.bill_management.infor")}</legend>
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
                                    disabled={true}
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
                            <div className={`form-group ${!errorPurchaseOrder ? "" : "has-error"}`}>
                                <label>
                                    {"Đơn mua hàng"}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-purchase-order`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={purchaseOrder}
                                    items={dataPurchaseOrder}
                                    onChange={handlePurchaseOrderChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorPurchaseOrder} />
                            </div>
                            <div className={`form-group ${!errorIntendReceiveTime ? "" : "has-error"}`}>
                                <label>{translate('production.request_management.desiredTime')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`purchasing-request-create-desiredTime`}
                                    value={desiredTime}
                                    onChange={handleDesiredTimeChange}
                                    disabled={true}
                                />
                                <ErrorLabel content={errorIntendReceiveTime} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={`form-group ${!errorDescription ? "" : "has-error"}`}>
                                <label>{translate('production.request_management.description')}<span className="text-red">*</span></label>
                                <textarea type="text" className="form-control" value={description} onChange={handleDescriptionChange} />
                                <ErrorLabel content={errorDescription} />
                            </div>
                        </div>
                    </fieldset>
                    <GoodComponentRequest onHandleGoodChange={onHandleGoodChange} requestId={purchaseOrder} listGoods={listGoods} selectBoxName={"create-receipt-request-from-purchase-order"}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateFromPurchaseOrderForm));
