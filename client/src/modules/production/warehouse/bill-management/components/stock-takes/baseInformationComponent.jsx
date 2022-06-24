import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { SelectBox, ErrorLabel } from "../../../../../../common-components";
import { generateCode } from "../../../../../../helpers/generateCode";
import { LotActions } from "../../../inventory-management/redux/actions";
import { BillActions } from "../../../bill-management/redux/actions";
import { GoodActions } from "../../../../common-production/good-management/redux/actions";
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import { datasBillType } from '../genaral/config';

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
        currentRole: localStorage.getItem("currentRole"),
        code: generateCode("BIRE"),
        listGood: [],
        good: Object.assign({}, EMPTY_GOOD),
        editInfo: false,
        customer: "",
        status: "1",
        fromStock: "",
        toStock: "",
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
        if (value === "0") {
            msg = "Chọn loại phiếu";
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

    const getFromStock = () => {
        const { stocks, translate } = props;
        let stockArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_stock") }];
        stocks.listStocks.map((item) => {
            let checkIncludeRole = 0;
            item.managementLocation.forEach((item2) => {
                if (item2.role.id === state.currentRole) {
                    checkIncludeRole++;
                }
            })
            if (checkIncludeRole > 0) {
                stockArr.push({
                    value: item._id,
                    text: item.name,
                });
            }
        });

        return stockArr;
    };

    const getToStock = () => {
        const { stocks, translate } = props;
        let stockArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_stock") }];
        stocks.listStocks.map((item) => {
            if (item._id !== state.fromStock) {
                stockArr.push({
                    value: item._id,
                    text: item.name,
                });
            }
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
                errorFromStock: msg,
            });
        }
        return msg === undefined;
    };

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
                toStock: request.toStock ? request.toStock._id : "",
                worksValue: request.manufacturingWork ? request.manufacturingWork._id : "",
                supplier: request.supplier ? request.supplier._id : "",
                requestId: request._id,
            });
        }
        return msg === undefined;
    }

    // Phần hàng hóa

    const getGoodType = () => {
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

    const handleGoodTypeChange = async (value) => {
        let goodType = value[0];
        if (goodType === "1") {
            await props.getGoodsByType({ type: "material" });
        } else if (goodType === "2") {
            await props.getGoodsByType({ type: "product" });
        } else if (goodType === "3") {
            await props.getGoodsByType({ type: "equipment" });
        } else if (goodType === "4") {
            await props.getGoodsByType({ type: "waste" });
        }
        validateGoodType(goodType, true);
    };

    const validateGoodType = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_type");
        }
        if (willUpdateState) {
            setState({
                ...state,
                goodType: value,
                errorType: msg,
            });
        }
        return msg === undefined;
    };

    const getAllGoods = () => {
        let { translate } = props;
        let goodArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_good") }];
        let goods = props.goods.listGoods;
        goods.map((item) => {
            goodArr.push({
                value: item._id,
                text: item.code + " -- " + item.name + " (" + item.baseUnit + ")",
                code: item.code,
                name: item.name,
                baseUnit: item.baseUnit,
                goodType: item.goodType,
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
        state.good.good = { _id: good, code: goodName.code, name: goodName.name, baseUnit: goodName.baseUnit, goodType: goodName.type };
        await setState({
            ...state,
            lots: [],
            lotName: lotName,
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
            goodType: "0",
        });
    };

    const handleClearGood = (e) => {
        e.preventDefault();
        setState({
            ...state,
            good: Object.assign({}, EMPTY_GOOD),
            goodType: "0",
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
            goodType: "0",
        });
    };

    const handleCancelEditGood = (e) => {
        e.preventDefault();
        setState({
            ...state,
            editInfo: false,
            good: Object.assign({}, EMPTY_GOOD),
            goodType: "0",
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
            good: {
                ...state.good,
                description: value,
            },
        });
    };

    const isGoodsValidated = () => {
        if (state.good.good) {
            return true;
        }
        return false;
    };

    // Phần dữ liệu

    if (props.isHaveDataStep1 !== state.isHaveDataStep1) {
        setState({
            ...state,
            fromStock: props.fromStock,
            toStock: props.toStock,
            code: props.code,
            type: props.type,
            listGood: props.listGood,
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
                toStock: state.toStock,
                group: state.group,
                type: state.type,
                listGood: state.listGood,
                manufacturingWork: state.worksValue,
                requestValue: state.requestValue,
                supplier: state.supplier,
                description: state.description,
            }
            props.onDataChange(data);
        }
    }, [state.fromStock, state.worksValue, state.type, state.supplier, state.listGood, state.description, state.requestValue, state.toStock]);

    useEffect(() => {
        switch (state.type) {
            case "3":
                props.getAllRequestByCondition({ requestType: 3, type: 1 });
                break;
            case "4":
                props.getAllRequestByCondition({ requestType: 3, type: 2 });
                break;
            case "5":
                props.getAllRequestByCondition({ requestType: 3, type: 3 });
                break;
            case "6":
                props.getAllRequestByCondition({ requestType: 3, type: 4 });
                break;
        }
    }, [state.type])

    const validateGoods = () => {
        const { type, listGood } = state;
        if (type === '2') return true;
        else
            if (listGood.length > 0) return true;
        return false;
    }
    
    const isFormValidated = () => {
        let { fromStock, listGood, type } = state;
        let result =
            validateStock(fromStock, false) &&
            validateBillTypeProduct(state.type, false) &&
            validateGoods();
        return result;
    };

    const { translate, createType } = props;
    const {
        listGood, code, fromStock, errorFromStock,
        errorOnBillType, type, description, requestValue, errorOnRequest, isHaveDataStep1, good, goodType, errorGoodType } = state;
    const dataBillType = datasBillType.goodTakesBillType();
    const dataFromStock = getFromStock();
    const dataRequest = getRequest();
    const listGoods = getAllGoods();
    const dataGoodType = getGoodType();
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
                        <div className={`form-group ${!errorFromStock ? "" : "has-error"}`}>
                            <label>
                                {translate("manage_warehouse.bill_management.stock")}
                                <span className="text-red"> * </span>
                            </label>
                            <SelectBox
                                id={`select-from-stock-bill-issue-create`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={fromStock}
                                items={dataFromStock}
                                onChange={handleStockChange}
                                multiple={false}
                                disabled={createType !== 1}
                            />
                            <ErrorLabel content={errorFromStock} />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group ${!errorOnBillType ? "" : "has-error"}`}>
                            <label>{"Chọn loại kiểm kê"}</label>
                            <span className="text-red"> * </span>
                            <SelectBox
                                id={`select-bill-type`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={type}
                                items={dataBillType}
                                onChange={handleBillTypeChange}
                                multiple={false}
                                disabled={createType !== 1}
                            />
                            <ErrorLabel content={errorOnBillType} />
                        </div>
                        {(type === '3' || type === '4' || type === '5' || type === '6') &&
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
                {type !== '2' &&
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate("manage_warehouse.bill_management.goods")}</legend>
                            {(createType === 1 && type === '1') ? <div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorGoodType ? "" : "has-error"}`}>
                                        <label>
                                            {"Loại hàng hóa"}
                                            <span className="text-red"> * </span>
                                        </label>
                                        <SelectBox
                                            id={`select-type-receipt-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={goodType}
                                            items={dataGoodType}
                                            onChange={handleGoodTypeChange}
                                            multiple={false}
                                        />
                                        <ErrorLabel content={errorGoodType} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
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
                                            disabled={!isGoodsValidated()}
                                            onClick={handleAddGood}
                                        >
                                            {translate("task_template.add")}
                                        </button>
                                    )}
                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearGood}>
                                        {translate("task_template.delete")}
                                    </button>
                                </div>
                            </div> : ''}

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
                                            <th title={translate("manage_warehouse.bill_management.description")}>
                                                {translate("manage_warehouse.bill_management.description")}
                                            </th>
                                            {createType === 1 &&
                                                <th>{translate("task_template.action")}</th>
                                            }
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
                                                    <td>{x.description}</td>
                                                    <td>
                                                        {createType === 1 &&
                                                            <div>
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
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>
                    </div>
                }
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
    getLotsByGood: LotActions.getLotsByGood,
    createBill: BillActions.createBill,
    getGoodsByType: GoodActions.getGoodsByType,
    getAllRequestByCondition: RequestActions.getAllRequestByCondition,
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BaseInformationComponent));
