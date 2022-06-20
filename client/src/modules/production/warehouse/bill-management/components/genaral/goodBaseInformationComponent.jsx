import React, { useState } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { SelectBox, ErrorLabel } from "../../../../../../common-components";
import { generateCode } from "../../../../../../helpers/generateCode";
import { LotActions } from "../../../inventory-management/redux/actions";
import { GoodActions } from "../../../../common-production/good-management/redux/actions";

function GoodBaseInformationComponent(props) {
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
        listGood: [],
        good: Object.assign({}, EMPTY_GOOD),
        editInfo: false,
    })

    if (props.isHaveDataStep1 !== state.isHaveDataStep1) {
        setState({
            ...state,
            listGood: props.listGood,
            isHaveDataStep1: props.isHaveDataStep1,
        });
    }

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
        let goods = props.goods.listGoods;
        goods.map((item) => {
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
                realQuantity: value,
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
        await props.onDataChange(listGood);
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
        await props.onDataChange(listGood);
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
        await props.onDataChange(listGood);
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

    const { listGood, good, type, errorType } = state;
    const { translate, createType } = props;
    const listGoods = getAllGoods();
    const dataType = getType();
    return (
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
                                        <td>{x.quantity}</td>
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
    );
}
const mapStateToProps = state => state;

const mapDispatchToProps = {
    getGoodsByType: GoodActions.getGoodsByType,
    getLotsByGood: LotActions.getLotsByGood,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodBaseInformationComponent));
