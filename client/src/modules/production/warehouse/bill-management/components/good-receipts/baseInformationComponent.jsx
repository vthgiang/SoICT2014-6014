import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { SelectBox, ErrorLabel } from "../../../../../../common-components";
import { generateCode } from "../../../../../../helpers/generateCode";
import { LotActions } from "../../../inventory-management/redux/actions";
import { BillActions } from "../../../bill-management/redux/actions";
import { GoodActions } from "../../../../common-production/good-management/redux/actions";

function BaseInformationComponent(props) {
    const EMPTY_GOOD = {
        good: "",
        quantity: 0,
        returnQuantity: 0,
        damagedQuantity: 0,
        realQuantity: 0,
        description: "",
        lots: [],
        group: 1,
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
        sourceType: "",
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

    const handleSourceChange = (value) => {
        validateSourceProduct(value[0], true);
    }

    const validateSourceProduct = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value !== "1" && value !== "2") {
            msg = translate("manage_warehouse.good_management.validate_source_product");
        }
        if (willUpdateState) {
            setState({
                ...state,
                errorOnSourceProduct: msg,
                sourceType: value,
                listGood: [],
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
            console.log(request);
            setState({
                ...state,
                requestValue: value,
                requestValueError: msg,
                listGood: request.goods,
                fromStock: request.stock._id,
                worksValue: request.manufacturingWork ? request.manufacturingWork._id : "",
                supplier: request.supplier ? request.supplier._id : "",
                sourceType: request.supplier ? "2" : "1",
                requestId: request._id,
            });
        }
        return msg === undefined;
    }

    // Phần hàng hóa

    const getType = () => {
        let typeArr = [];
        typeArr = [
            { value: "0", text: "Chọn loại hàng hóa" },
            { value: "1", text: "Nguyên vật liệu" },
            { value: "2", text: "Thành phẩm" },
            { value: "3", text: "Công cụ dụng cụ" },
            { value: "4", text: "Phế phẩm" },
        ];
        return typeArr;
    };

    const handleTypeChange = async (value) => {
        let type = value[0];
        if (type === "1") {
            await props.getGoodsByType({ type: "material" });
        } else if (type === "2") {
            await props.getGoodsByType({ type: "product" });
        } else if (type === "3") {
            await props.getGoodsByType({ type: "equipment" });
        } else if (type === "4") {
            await props.getGoodsByType({ type: "waste" });
        }
        validateType(type, true);
    };

    const validateType = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_type");
        }
        if (willUpdateState) {
            setState({
                ...state,
                type: value,
                errorType: msg,
            });
        }
        return msg === undefined;
    };

    const getAllGoods = () => {
        let { translate } = props;
        let goodArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_good") }];
        let listGoodsCheckBySourceType = [];
        let goods = props.goods.listGoods;
        for (let i = 0; i < goods.length; i++) {
            if (goods[i].sourceType === state.sourceType) {
                listGoodsCheckBySourceType.push(goods[i]);
            }
        }
        listGoodsCheckBySourceType.map((item) => {
            goodArr.push({
                value: item._id,
                text: item.code + " -- " + item.name + " (" + item.baseUnit + ")",
                code: item.code,
                name: item.name,
                baseUnit: item.baseUnit,
                type: item.type,
            });
        });

        return goodArr;
    };

    const handleGoodChange = async (value) => {
        const dataGoods = await getAllGoods();
        let good = value[0];
        const lotName = generateCode("LOT");
        state.good.quantity = 0;
        let goodName = dataGoods.find((x) => x.value === good);
        state.good.good = { _id: good, code: goodName.code, name: goodName.name, baseUnit: goodName.baseUnit, type: goodName.type };
        await setState({
            ...state,
            lots: [],
            lotName: lotName,
        });
    };

    const handleQuantityChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            good: {
                ...state.good,
                quantity: value,
            },
        });
    };

    const handleAddGood = async (e) => {
        e.preventDefault();
        let listGood = [...state.listGood, state.good];
        await setState({
            ...state,
            listGood: listGood,
            lots: [],
            good: Object.assign({}, EMPTY_GOOD),
            type: "0",
        });
    };

    const handleClearGood = (e) => {
        e.preventDefault();
        setState({
            ...state,
            good: Object.assign({}, EMPTY_GOOD),
            type: "0",
        });
    };

    const handleSaveEditGood = async (e) => {
        e.preventDefault();
        const { indexInfo, listGood } = state;
        let newListGood;
        if (listGood) {
            newListGood = listGood.map((item, index) => {
                return index === indexInfo ? state.good : item;
            });
        }
        await setState({
            ...state,
            editInfo: false,
            listGood: newListGood,
            lots: [],
            good: Object.assign({}, EMPTY_GOOD),
            type: "0",
        });
    };

    const handleCancelEditGood = (e) => {
        e.preventDefault();
        setState({
            ...state,
            editInfo: false,
            good: Object.assign({}, EMPTY_GOOD),
            type: "0",
        });
    };

    const handleEditGood = async (good, index) => {
        let lots = good.lots ? good.lots : [];
        setState({
            ...state,
            editInfo: true,
            indexInfo: index,
            good: Object.assign({}, good),
            lots: lots,
        });

        const { fromStock } = state;

        await props.getLotsByGood({ good: good.good._id, stock: fromStock });
    };

    const handleDeleteGood = async (index) => {
        let { listGood } = state;
        let newListGood;
        if (listGood) {
            newListGood = listGood.filter((item, x) => index !== x);
        }
        await setState({
            ...state,
            listGood: newListGood,
        });
    };

    const handleGoodDescriptionChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            description: value,
        });
    };

    const isGoodsValidated = () => {
        if (state.good.good && state.good.quantity && state.good.quantity !== 0) {
            return true;
        }
        return false;
    };

    // Phần dữ liệu

    if (props.isHaveDataStep1 !== state.isHaveDataStep1) {
        setState({
            ...state,
            fromStock: props.fromStock,
            code: props.code,
            sourceType: props.sourceType,
            listGood: props.listGood,
            worksValue: props.manufacturingWork,
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
                sourceType: state.sourceType,
                listGood: state.listGood,
                manufacturingWork: state.worksValue,
                supplier: state.supplier,
                description: state.description,
            }
            props.onDataChange(data);
        }
    }, [state.fromStock, state.worksValue, state.sourceType, state.supplier, state.listGood, state.description]);

    const isFormValidated = () => {
        let { fromStock, listGood } = state;
        let result =
            validateStock(fromStock, false) &&
            validateSourceProduct(state.sourceType, false) &&
            (validateManufacturingWorks(state.worksValue, false) ||
                validateSupplier(state.supplier, false)) &&
            listGood.length > 0
        return result;
    };

    const { translate, createType } = props;
    const {
        listGood, good, code, supplier, worksValue, fromStock, type, errorStock, errorType, errorSupplier, worksValueError,
        errorOnSourceProduct, sourceType, purchaseOrderId, description, request, errorOnRequest } = state;

    let dataSource = [
        {
            value: '0',
            text: 'Chọn nguồn hàng hóa',
        },
        {
            value: '1',
            text: 'Hàng hóa tự sản xuất',
        },
        {
            value: '2',
            text: 'Hàng hóa nhập từ nhà cung cấp',
        }
    ];
    const listGoods = getAllGoods();
    const dataCustomer = getSupplier();
    const dataManufacturingWorks = getListWorks();
    const dataStock = getStock();
    const dataType = getType();
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
                        {(createType === 1 || createType === 3) &&
                            <div className={`form-group ${!errorOnSourceProduct ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.good_management.good_source')}</label>
                                <span className="text-red"> * </span>
                                <SelectBox
                                    id={`select-source-type`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={sourceType}
                                    items={dataSource}
                                    onChange={handleSourceChange}
                                    multiple={false}
                                    disabled={createType === 2 || createType === 3}
                                />
                                <ErrorLabel content={errorOnSourceProduct} />
                            </div>
                        }
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        {(createType === 1 || createType === 3) &&
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
                                    value={request}
                                    items={dataRequest}
                                    onChange={handleRequestChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorOnRequest} />
                            </div>
                        }
                        {createType === 2 &&
                            <div className={`form-group ${!errorOnSourceProduct ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.good_management.good_source')}</label>
                                <span className="text-red"> * </span>
                                <SelectBox
                                    id={`select-source-type`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={sourceType}
                                    items={dataSource}
                                    onChange={handleSourceChange}
                                    multiple={false}
                                    disabled={createType === 2 || createType === 3}
                                />
                                <ErrorLabel content={errorOnSourceProduct} />
                            </div>
                        }
                        {sourceType === "2" ?
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
                        {sourceType === "1" ?
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
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{translate("manage_warehouse.bill_management.goods")}</legend>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <div className={`form-group ${!errorType ? "" : "has-error"}`}>
                            <label>
                                {"Loại hàng hóa"}
                                <span className="text-red"> * </span>
                            </label>
                            <SelectBox
                                id={`select-type-receipt-create`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={type}
                                items={dataType}
                                onChange={handleTypeChange}
                                multiple={false}
                            />
                            <ErrorLabel content={errorType} />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <div className="form-group">
                            <label>{translate("manage_warehouse.bill_management.choose_good")}</label>
                            <SelectBox
                                id={`select-good-receipt-create`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={good.good ? good.good._id : "1"}
                                items={listGoods}
                                onChange={handleGoodChange}
                                multiple={false}
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <div className="form-group">
                            <label>{translate("manage_warehouse.bill_management.number")}</label>
                            <input className="form-control" value={good.quantity} onChange={handleQuantityChange} type="number" />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="form-group">
                            <label>{translate("manage_warehouse.bill_management.description")}</label>
                            <textarea
                                type="text"
                                className="form-control"
                                value={good.description}
                                onChange={handleGoodDescriptionChange}
                            />
                        </div>
                    </div>
                    <div className="pull-right" style={{ marginBottom: "10px" }}>
                        {state.editInfo ? (
                            <React.Fragment>
                                <button className="btn btn-success" onClick={handleCancelEditGood} style={{ marginLeft: "10px" }}>
                                    {translate("task_template.cancel_editing")}
                                </button>
                                <button
                                    className="btn btn-success"
                                    disabled={!isGoodsValidated()}
                                    onClick={handleSaveEditGood}
                                    style={{ marginLeft: "10px" }}
                                >
                                    {translate("task_template.save")}
                                </button>
                            </React.Fragment>
                        ) : (
                            <button
                                className="btn btn-success"
                                style={{ marginLeft: "10px" }}
                                disabled={(createType === 2 || createType === 3) ? true : !isGoodsValidated()}
                                onClick={handleAddGood}
                            >
                                {translate("task_template.add")}
                            </button>
                        )}
                        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearGood}>
                            {translate("task_template.delete")}
                        </button>
                    </div>
                    <div className={`form-group`}>
                        {/* Bảng thông tin chi tiết */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }} title={translate("manage_warehouse.bill_management.index")}>
                                        {translate("manage_warehouse.bill_management.index")}
                                    </th>
                                    <th title={translate("manage_warehouse.bill_management.good_code")}>
                                        {translate("manage_warehouse.bill_management.good_code")}
                                    </th>
                                    <th title={translate("manage_warehouse.bill_management.good_name")}>
                                        {translate("manage_warehouse.bill_management.good_name")}
                                    </th>
                                    <th title={translate("manage_warehouse.bill_management.unit")}>
                                        {translate("manage_warehouse.bill_management.unit")}
                                    </th>
                                    <th title={translate("manage_warehouse.bill_management.number")}>
                                        {translate("manage_warehouse.bill_management.number")}
                                    </th>
                                    <th title={translate("manage_warehouse.bill_management.description")}>
                                        {translate("manage_warehouse.bill_management.description")}
                                    </th>
                                    <th>{translate("task_template.action")}</th>
                                </tr>
                            </thead>
                            <tbody id={`good-bill-create`}>
                                {typeof listGood === "undefined" || listGood.length === 0 ? (
                                    <tr>
                                        <td colSpan={7}>
                                            <center>{translate("task_template.no_data")}</center>
                                        </td>
                                    </tr>
                                ) : (
                                    listGood.map((x, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{x.good.code}</td>
                                            <td>{x.good.name}</td>
                                            <td>{x.good.baseUnit}</td>
                                            <td>{x.quantity}</td>
                                            <td>{x.description}</td>
                                            <td>
                                                <a
                                                    href="#abc"
                                                    className="edit"
                                                    title={translate("general.edit")}
                                                    onClick={() => handleEditGood(x, index)}
                                                >
                                                    <i className="material-icons"></i>
                                                </a>
                                                <a
                                                    href="#abc"
                                                    className="delete"
                                                    title={translate("general.delete")}
                                                    onClick={() => handleDeleteGood(index)}
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
                </fieldset>
            </div>
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
