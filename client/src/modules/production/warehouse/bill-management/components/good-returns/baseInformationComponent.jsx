import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { SelectBox, ErrorLabel } from "../../../../../../common-components";
import { generateCode } from "../../../../../../helpers/generateCode";
import { LotActions } from "../../../inventory-management/redux/actions";
import { BillActions } from "../../../bill-management/redux/actions";
import { GoodActions } from "../../../../common-production/good-management/redux/actions";
import { datasBillType } from '../genaral/config';

function BaseInformationComponent(props) {
    const EMPTY_GOOD = {
        good: "",
        quantity: 0,
        returnQuantity: 0,
        // damagedQuantity: 0,
        realQuantity: 0,
        description: "",
        lots: [],
        isHaveDataStep1: 0,
    };

    const [state, setState] = useState({
        list: [],
        code: generateCode("BIRE"),
        listGood: [],
        good: Object.assign({}, EMPTY_GOOD),
        editInfo: false,
        customer: "",
        status: "1",
        fromStock: "",
        type: "",
        description: "",
    })

    const handleDescriptionChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            description: value,
        });
    };

    // Nguồn gốc hàng hóa

    const handleBillTypeChange = (value) => {
        validateBillTypeProduct(value[0], true);
    }

    const validateBillTypeProduct = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value === '0') {
            msg = translate("manage_warehouse.good_management.validate_source_product");
        }
        if (willUpdateState) {
            setState({
                ...state,
                errorOnBillType: msg,
                type: value,
            });
        }
        return msg === undefined;
    }

    // Phần kho

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

    const handleStockChange = (value) => {
        let fromStock = value[0];
        validateStock(fromStock, true);
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
                fromStock: value,
                errorStock: msg,
            });
        }
        return msg === undefined;
    };

    // Nhà cung cấp 

    const getSupplier = () => {
        const { crm, translate } = props;
        let supplierArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_supplier") }];

        crm.customers.list.map((item) => {
            supplierArr.push({
                value: item._id,
                text: item.name,
            });
        });
        return supplierArr;
    };

    const handleSupplierChange = (value) => {
        let supplier = value[0];
        validateSupplier(supplier, true);
    };

    const validateSupplier = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_customer");
        }
        if (willUpdateState) {
            setState({
                ...state,
                supplier: value,
                errorSuppler: msg,
            });
        }
        return msg === undefined;
    };

    // Phần nhà máy sản xuất

    const getListWorks = () => {
        const { translate, manufacturingWorks } = props;
        let listWorksArray = [{
            value: "",
            text: translate('production.request_management.choose_manufacturing_works')
        }];

        const { listWorks } = manufacturingWorks;

        if (listWorks) {
            listWorks.map((item) => {
                listWorksArray.push({
                    value: item._id,
                    text: item.name,
                    organizationalUnit: item.organizationalUnit._id
                });
            });
        }
        return listWorksArray;
    }

    const handleManufacturingWorksChange = (value) => {
        const worksValue = value[0];
        validateManufacturingWorks(worksValue, true);
    }

    const validateManufacturingWorks = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = props;
        if (value === undefined || value === "") {
            msg = translate('production.request_management.validate_manufacturing_works');
        }
        if (willUpdateState) {
            setState({
                ...state,
                worksValue: value,
                worksValueError: msg,
                teamLeaderValue: "",
                supplier: "",
            });
        }
        return msg === undefined;
    }

    // Phần đơn yêu cầu

    const getRequest = () => {
        const { translate, requestManagements } = props;
        let requestArr = [{ value: "", text: "Chọn yêu cầu" }];
        if (requestManagements.listRequests) {
            requestManagements.listRequests.map((item) => {
                requestArr.push({
                    value: item._id,
                    text: item.code,
                });
            });
        }
        return requestArr;
    }

    const handleRequestChange = (value) => {
        const requestValue = value[0];
        validateRequest(requestValue, true);
    }

    const validateRequest = (value, willUpdateState) => {
        let msg = undefined;
        const { requestManagements } = props;
        if (value === undefined || value === "") {
            msg = "Bạn phải chọn yêu cầu";
        }
        if (willUpdateState) {
            let request = requestManagements.listRequests.find(element => element._id === value)
            setState({
                ...state,
                requestValue: value,
                requestValueError: msg,
                listGood: request.goods,
                fromStock: request.stock._id,
                worksValue: request.manufacturingWork ? request.manufacturingWork._id : "",
                supplier: request.supplier ? request.supplier._id : "",
                type: request.supplier ? "2" : "1",
                requestId: request._id,
                bill: request.bill ? request.bill._id : "",
            });
        }
        return msg === undefined;
    }

    // Phần dữ liệu

    const getDataLots = (goods) => {
        let lots = [];
        if (goods && goods.length > 0) {
            goods.forEach(item => {
                item.lots.forEach(lot => {
                    lot.goodName = item.good.name;
                    lot.baseUnit = item.good.baseUnit;
                    lot.code = lot.lot.code;
                    lot.expirationDate = lot.lot.expirationDate;
                    lot.returnQuantity = lot.returnQuantity;
                    lot.goodId = item.good._id;
                    lots.push(lot);
                })
            })
        }
        return lots;
    }

    if (props.isHaveDataStep1 !== state.isHaveDataStep1) {
        setState({
            ...state,
            fromStock: props.fromStock,
            code: props.code,
            type: props.type,
            listGood: props.listGood,
            dataLots: getDataLots(props.listGood),
            worksValue: props.manufacturingWork,
            requestValue: props.requestValue,
            supplier: props.supplier,
            description: props.description,
            isHaveDataStep1: props.isHaveDataStep1,
        });
    }

    useEffect(() => {
        if (isFormValidated()) {
            let data = {
                code: state.code,
                fromStock: state.fromStock,
                group: state.group,
                type: state.type,
                listGood: state.listGood,
                manufacturingWork: state.worksValue,
                requestValue: state.requestValue,
                supplier: state.supplier,
                description: state.description,
                bill: state.bill,
            }
            props.onDataChange(data);
        }
    }, [state.fromStock, state.worksValue, state.type, state.supplier, state.listGood, state.description, state.requestValue]);

    const isFormValidated = () => {
        let { fromStock, listGood } = state;
        let result =
            validateStock(fromStock, false) &&
            validateBillTypeProduct(state.type, false) &&
            (validateManufacturingWorks(state.worksValue, false) ||
                validateSupplier(state.supplier, false)) &&
            listGood.length > 0
        return result;
    };

    const { translate, createType } = props;
    const {
        listGood, good, code, supplier, worksValue, fromStock, errorStock, errorType, errorSupplier, worksValueError,
        errorOnBillType, type, purchaseOrderId, description, requestValue, errorOnRequest, isHaveDataStep1, dataLots } = state;

    const dataBillType = datasBillType.goodReturnBillType();

    const dataCustomer = getSupplier();
    const dataManufacturingWorks = getListWorks();
    const dataStock = getStock();
    const dataRequest = getRequest();
    return (
        <React.Fragment>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{translate("manage_warehouse.bill_management.infor")}</legend>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <label>{translate("manage_warehouse.bill_management.code")}</label>
                            <input type="text" className="form-control" value={code} disabled />
                        </div>
                        {createType === 2 &&
                            <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.bill_management.stock")}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-stock-bill-receipt-create-${purchaseOrderId}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={fromStock}
                                    items={dataStock}
                                    onChange={handleStockChange}
                                    multiple={false}
                                    disabled={createType === 2 || createType === 3}
                                />
                                <ErrorLabel content={errorStock} />
                            </div>}
                        {(createType === 3) &&
                            <div className={`form-group ${!errorOnBillType ? "" : "has-error"}`}>
                                <label>{"Loại phiếu"}</label>
                                <span className="text-red"> * </span>
                                <SelectBox
                                    id={`select-bill-type`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={type}
                                    items={dataBillType}
                                    onChange={handleBillTypeChange}
                                    multiple={false}
                                    disabled={createType === 2 || createType === 3}
                                />
                                <ErrorLabel content={errorOnBillType} />
                            </div>
                        }
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        {(createType === 3) &&
                            <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.bill_management.stock")}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-stock-bill-receipt-create-${purchaseOrderId}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={fromStock}
                                    items={dataStock}
                                    onChange={handleStockChange}
                                    multiple={false}
                                    disabled={createType === 2 || createType === 3}
                                />
                                <ErrorLabel content={errorStock} />
                            </div>}
                        {createType === 2 &&
                            <div className={`form-group ${!errorOnRequest ? "" : "has-error"}`}>
                                <label>{"Phiếu yêu cầu"}</label>
                                <span className="text-red"> * </span>
                                <SelectBox
                                    id={`select-request`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={requestValue}
                                    items={dataRequest}
                                    onChange={handleRequestChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorOnRequest} />
                            </div>
                        }
                        {createType === 2 &&
                            <div className={`form-group ${!errorOnBillType ? "" : "has-error"}`}>
                                <label>{"Loại phiếu"}</label>
                                <span className="text-red"> * </span>
                                <SelectBox
                                    id={`select-bill-type`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={type}
                                    items={dataBillType}
                                    onChange={handleBillTypeChange}
                                    multiple={false}
                                    disabled={createType === 2 || createType === 3}
                                />
                                <ErrorLabel content={errorOnBillType} />
                            </div>
                        }
                        {type === "2" ?
                            (<div className={`form-group ${!errorSupplier ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.bill_management.supplier")}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-customer-receipt-create-${purchaseOrderId}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={supplier}
                                    items={dataCustomer}
                                    onChange={handleSupplierChange}
                                    multiple={false}
                                    disabled={createType === 2 || createType === 3}
                                />
                                <ErrorLabel content={errorSupplier} />
                            </div>)
                            : null}
                        {type === "1" ?
                            (<div className={`form-group ${!worksValueError ? "" : "has-error"}`}>
                                <label>{translate('production.request_management.manufacturing_works')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`select-works`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={worksValue}
                                    items={dataManufacturingWorks}
                                    onChange={handleManufacturingWorksChange}
                                    multiple={false}
                                    disabled={createType === 2 || createType === 3}
                                />
                                <ErrorLabel content={worksValueError} />
                            </div>)
                            : null}
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="form-group">
                            <label>{translate("manage_warehouse.bill_management.description")}</label>
                            <textarea
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>
            <fieldset className="scheduler-border">
                <legend className="scheduler-border">{"Thông tin chi tiết lô hàng không đạt kiểm định"}</legend>
                <div className={`form-group`}>
                    {/* Bảng thông tin chi tiết */}
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                <th title="Mã lô hàng">{"Mã lô hàng"}</th>
                                <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                <th title={"Số lượng xuất kho"}>{"Số lượng xuất kho"}</th>
                                <th title={"Vị lượng trả lại"}>{"Số lượng trả lại"}</th>
                                <th title={"Ngày hết hạn"}>{"Ngày hết hạn"}</th>
                            </tr>
                        </thead>
                        <tbody id={`data-lot-bill`}>
                            {
                                (typeof dataLots === 'undefined' || dataLots.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                    dataLots.map((x, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{x.code}</td>
                                            <td>{x.goodName}</td>
                                            <td>{x.baseUnit}</td>
                                            <td>{x.quantity}</td>
                                            <td>{x.returnQuantity}</td>
                                            <td>{x.expirationDate}</td>
                                        </tr>
                                    )
                            }
                        </tbody>
                    </table>
                </div>
            </fieldset>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
    getLotsByGood: LotActions.getLotsByGood,
    createBill: BillActions.createBill,
    getGoodsByType: GoodActions.getGoodsByType,
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BaseInformationComponent));
