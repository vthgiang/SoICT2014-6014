import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { DialogModal, TreeSelect, ErrorLabel, ButtonModal } from "../../../../../common-components";
import { GoodActions } from "../redux/actions";
import { CategoryActions } from "../../category-management/redux/actions";
import UnitCreateForm from "./unitCreateForm";
import ComponentCreateForm from "./componentCreateForm";
import InfoMillCreateForm from "./infoMillCreateForm";
import { generateCode } from "../../../../../helpers/generateCode";

function GoodCreateForm(props) {
    const [state, setState] = useState({
        code: "",
        name: "",
        baseUnit: "",
        units: [],
        materials: [],
        quantity: 0,
        description: "",
        type: props.type,
        category: "",
        pricePerBaseUnit: "",
        salesPriceVariance: "",
        numberExpirationDate: ""
    })

    if (props.type !== state.type) {
        setState({
            ...state,
            type: props.type,
            baseUnit: props.baseUnit ? props.baseUnit : "",
            units: props.units ? props.units : [],
            materials: props.materials ? props.materials : [],
            description: props.description ? props.description : "",
            code: props.code ? props.code : "",
            name: props.name ? props.name : "",
            pricePerBaseUnit: props.pricePerBaseUnit ? props.pricePerBaseUnit : "",
            salesPriceVariance: props.salesPriceVariance ? props.salesPriceVariance : "",
            numberExpirationDate: props.numberExpirationDate ? props.numberExpirationDate : ""
        });
    }

    const validatePrice = (value) => {
        let msg = undefined;
        if (value && parseInt(value) < 0) {
            msg = "Giá trị không được âm";
        }
        return msg;
    };

    const handlePricePerBaseUnitChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            pricePerBaseUnit: value,
            pricePerBaseUnitError: validatePrice(value),
        });
    };

    const handleSalesPriceVarianceChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            salesPriceVariance: value,
            salesPriceVarianceError: validatePrice(value),
        });
    };

    const handleCodeChange = (e) => {
        let value = e.target.value;
        validateCode(value, true);
    };

    const validateCode = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate, type } = props;
        if (!value) {
            msg = translate("manage_warehouse.category_management.validate_code");
        }
        if (willUpdateState) {
            setState({
                ...state,
                errorOnCode: msg,
                code: value,
                type: type,
            });
        }
        return msg === undefined;
    };

    const handleNameChange = (e) => {
        let value = e.target.value;
        validateName(value, true);
    };

    const validateName = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("manage_warehouse.category_management.validate_name");
        }
        if (willUpdateState) {
            setState({
                ...state,
                errorOnName: msg,
                name: value,
            });
        }
        return msg === undefined;
    };

    const handleBaseUnitChange = (e) => {
        let value = e.target.value;
        validateBaseUnit(value, true);
    };

    const validateBaseUnit = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("manage_warehouse.category_management.validate_name");
        }
        if (willUpdateState) {
            setState({
                ...state,
                errorOnBaseUnit: msg,
                baseUnit: value,
            });
        }
        return msg === undefined;
    };

    const handleCategoryChange = (value) => {
        let category = value[0];
        validateCategory(category, true);
    };

    const validateCategory = (category, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!category) {
            msg = translate("manage_warehouse.category_management.validate_name");
        }
        if (willUpdateState) {
            setState({
                ...state,
                errorOnCategory: msg,
                category: category,
            });
        }
        return msg === undefined;
    };

    const getAllCategory = () => {
        let { categories } = props;
        let categoryArr = [];
        if (categories.categoryToTree.list.length > 0) {
            categories.categoryToTree.list.map((item) => {
                categoryArr.push({
                    _id: item._id,
                    id: item._id,
                    state: { open: true },
                    name: item.name,
                    parent: item.parent ? item.parent.toString() : null,
                });
            });
        }
        return categoryArr;
    };

    const handleDescriptionChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            description: value,
        });
    };

    const handleListUnitChange = (data) => {
        setState({
            ...state,
            units: data
        });
    };

    const handleListMaterialChange = (data) => {
        setState({
            ...state,
            materials: data,
        });
    };

    const handleListMillsChange = (data) => {
        setState({
            ...state,
            manufacturingMills: data,
        });
    };

    const handleNumberExpirationDateChange = (e) => {
        const { value } = e.target;
        validateNumberExpirationDate(value, true);
    }

    const validateNumberExpirationDate = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        console.log(value);
        if (value === "") {
            msg = translate("manage_warehouse.good_management.validate_number_expiration_date");
        }
        if (value < 1) {
            msg = translate("manage_warehouse.good_management.validate_number_expiration_date_input");
        }
        if (willUpdateState) {
            console.log(msg)
            setState({
                ...state,
                errorOnNumberExpirationDate: msg,
                numberExpirationDate: value,
            });
        }
        return msg === undefined;
    }

    const isFormValidated = () => {
        let { name, code, baseUnit, category, materials, numberExpirationDate, type } = state;
        let result;
        if (!type || type === "material") {
            result = validateName(name, false) &&
                validateCode(code, false) &&
                validateBaseUnit(baseUnit, false) &&
                validateCategory(category, false) &&
                validateNumberExpirationDate(numberExpirationDate, false)
        } else {
            result = validateName(name, false) &&
                validateCode(code, false) &&
                validateBaseUnit(baseUnit, false) &&
                validateCategory(category, false) &&
                materials.length > 0 &&
                validateNumberExpirationDate(numberExpirationDate, false)
        }
        return result;
        // return true;

    };

    const save = () => {
        if (isFormValidated()) {
            console.log(state);
            props.createGoodByType(state);
        }
    };

    const handleClickCreate = () => {
        let code = generateCode("HH");
        setState({
            ...state,
            code: code,
        });
    };
    let listUnit = [];
    let listMaterial = [];
    const { translate, goods, categories, type } = props;
    const {
        errorOnName,
        errorOnCode,
        errorOnBaseUnit,
        errorOnCategory,
        code,
        name,
        category,
        units,
        baseUnit,
        description,
        materials,
        pricePerBaseUnit,
        pricePerBaseUnitError,
        salesPriceVariance,
        salesPriceVarianceError,
        numberExpirationDate,
        errorOnNumberExpirationDate
    } = state;
    const dataSelectBox = getAllCategory();

    if (units) listUnit = units;
    if (materials) listMaterial = materials;
    return (
        <React.Fragment>
            <ButtonModal
                onButtonCallBack={handleClickCreate}
                modalID={`modal-create-${type}`}
                button_name={translate("manage_warehouse.good_management.add")}
                title={translate("manage_warehouse.good_management.add_title")}
            />
            <DialogModal
                modalID={`modal-create-${type}`}
                isLoading={goods.isLoading}
                formID={`form-create-${type}`}
                title={translate("manage_warehouse.good_management.add_title")}
                msg_success={translate("manage_warehouse.good_management.add_success")}
                msg_failure={translate("manage_warehouse.good_management.add_faile")}
                disableSubmit={!isFormValidated()}
                func={save}
                size={50}
            >
                <form id={`form-create-${type}`}>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorOnCode ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.good_management.code")}
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control" disabled={true} value={code} onChange={handleCodeChange} />
                                <ErrorLabel content={errorOnCode} />
                            </div>
                            <div className={`form-group ${!errorOnBaseUnit ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.good_management.baseUnit")}
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control" value={baseUnit} onChange={handleBaseUnitChange} />
                                <ErrorLabel content={errorOnBaseUnit} />
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorOnName ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.good_management.name")}
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control" value={name} onChange={handleNameChange} />
                                <ErrorLabel content={errorOnName} />
                            </div>
                            <div className={`form-group ${!errorOnCategory ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.good_management.category")}
                                    <span className="attention"> * </span>
                                </label>
                                <TreeSelect data={dataSelectBox} value={category} handleChange={handleCategoryChange} mode="hierarchical" />
                                <ErrorLabel content={errorOnCategory} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!pricePerBaseUnitError ? "" : "has-error"}`}>
                                <label>
                                    {"Giá một đơn vị tính cơ bản"}
                                    <span className="attention"> </span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={pricePerBaseUnit}
                                    onChange={handlePricePerBaseUnitChange}
                                    placeholder="Ví dụ: 1000000"
                                />
                                <ErrorLabel content={pricePerBaseUnitError} />
                            </div>
                            <div className={`form-group ${!errorOnNumberExpirationDate ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.good_management.numberExpirationDate")}
                                    <span className="attention"> * </span>
                                </label>
                                <input type="number" className="form-control" value={numberExpirationDate} onChange={handleNumberExpirationDateChange} />
                                <ErrorLabel content={errorOnNumberExpirationDate} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!salesPriceVarianceError ? "" : "has-error"}`}>
                                <label>
                                    {"Phương sai giá bán"}
                                    <span className="attention"> </span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={salesPriceVariance}
                                    onChange={handleSalesPriceVarianceChange}
                                    placeholder="Ví dụ: 50000"
                                />
                                <ErrorLabel content={salesPriceVarianceError} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <label>{translate("manage_warehouse.good_management.description")}</label>
                                <textarea type="text" className="form-control" value={description} onChange={handleDescriptionChange} />
                            </div>
                            <UnitCreateForm baseUnit={baseUnit} initialData={listUnit} onDataChange={handleListUnitChange} />
                            {type === "product" ? (
                                <React.Fragment>
                                    <ComponentCreateForm initialData={listMaterial} onDataChange={handleListMaterialChange} />
                                    <InfoMillCreateForm onDataChange={handleListMillsChange} />
                                </React.Fragment>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}
function mapStateToProps(state) {
    const { goods, categories } = state;
    return { goods, categories };
}

const mapDispatchToProps = {
    createGoodByType: GoodActions.createGoodByType,
    getCategoriesByType: CategoryActions.getCategoriesByType,
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodCreateForm));
