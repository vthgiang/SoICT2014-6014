import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { DialogModal, TreeSelect, ErrorLabel, SelectBox } from "../../../../../common-components";
import { GoodActions } from "../redux/actions";
import { CategoryActions } from "../../category-management/redux/actions";
import UnitCreateForm from "./unitCreateForm";
import ComponentCreateForm from "./componentCreateForm";
import InfoMillCreateForm from "./infoMillCreateForm";
import Swal from "sweetalert2";

function GoodEditForm(props) {
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
        numberExpirationDate: "",
        sourceType: "",
        isSeflProduced: props.sourceType === "1" ? true : false,
    })

    useEffect(() => {
        if (props.goodId !== state.goodId) {
            setState({
                ...state,
                goodId: props.goodId,
                type: props.type,
                baseUnit: props.baseUnit,
                // packingRule: props.packingRule,
                units: props.units,
                materials: props.materials,
                manufacturingMills: props.manufacturingMills,
                description: props.description,
                code: props.code,
                name: props.name,
                category: props.category,
                pricePerBaseUnit: props.pricePerBaseUnit ? props.pricePerBaseUnit : "",
                salesPriceVariance: props.salesPriceVariance ? props.salesPriceVariance : "",
                numberExpirationDate: props.numberExpirationDate ? props.numberExpirationDate : "",
                errorOnName: undefined,
                errorOnCode: undefined,
                errorOnBaseUnit: undefined,
                errorOnCategory: undefined,
                pricePerBaseUnitError: undefined,
                salesPriceVarianceError: undefined,
                errorOnNumberExpirationDate: undefined
            });
        }
    }, [props.goodId]);

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

    const validatePrice = (value) => {
        let msg = undefined;
        if (value && parseInt(value) < 0) {
            msg = "Giá trị không được âm";
        }
        return msg;
    };

    const showListExplainVariance = () => {
        Swal.fire({
            icon: "question",

            html: `<h3 style="color: red"><div>Phương sai</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Phương sai là giá trị chênh lệch giữa giá bán cao nhất và giá bán thấp nhất có thể chấp nhận được dựa trên 1 đơn vị tính cơ bản.</p>
            <p>Ví dụ: Phương sai 50,000 VNĐ giá sản phẩm 500,000 VNĐ có nghĩa là có thể bán 1 đơn vị trong tầm giá 450,000 VNĐ-> 500,000 VNĐ</p>`,
            width: "50%",
        })
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
                materials: value === "2" ? [] : state.materials,
                manufacturingMills: value === "2" ? [] : state.manufacturingMills,
                isSeflProduced: value === "1" ? true : false,
            });
        }
        return msg === undefined;
    }

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
        if (value === "") {
            msg = translate("manage_warehouse.good_management.validate_number_expiration_date");
        }
        if (value < 1) {
            msg = translate("manage_warehouse.good_management.validate_number_expiration_date_input");
        }
        if (willUpdateState) {
            setState({
                ...state,
                errorOnNumberExpirationDate: msg,
                numberExpirationDate: value,
            });
        }
        return msg === undefined;
    }

    const isFormValidated = () => {
        let result =
            validateName(state.name, false) &&
                validateCode(state.code, false) &&
                validateBaseUnit(state.baseUnit, false) &&
                validateCategory(state.category, false) &&
                validateSourceProduct(state.sourceType, false) &&
                ((state.type && state.type === "product") && state.isSeflProduced === true) ? state.materials.length > 0 : true &&
            validateNumberExpirationDate(state.numberExpirationDate, false)
        return result;
    };

    const save = () => {
        if (isFormValidated()) {
            props.editGood(props.goodId, state);
        }
    };

    let listUnit = [];
    let listMaterial = [];
    let listManfaucturingMills = [];
    const { translate, goods, categories, type, sourceType } = props;
    const {
        errorOnName,
        errorOnCode,
        errorOnBaseUnit,
        errorOnCategory,
        errorOnSourceProduct,
        code,
        name,
        category,
        units,
        baseUnit,
        description,
        materials,
        manufacturingMills,
        goodId,
        // packingRule,
        pricePerBaseUnit,
        pricePerBaseUnitError,
        salesPriceVariance,
        salesPriceVarianceError,
        numberExpirationDate,
        errorOnNumberExpirationDate,
        isSeflProduced,
    } = state;
    const dataSelectBox = getAllCategory();

    if (units) listUnit = units;
    if (materials) listMaterial = materials;
    if (manufacturingMills) listManfaucturingMills = manufacturingMills;
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-good`}
                isLoading={goods.isLoading}
                formID={`form-edit-good`}
                title={translate(`manage_warehouse.good_management.edit.${type}`)}
                msg_success={translate("manage_warehouse.good_management.add_success")}
                msg_failure={translate("manage_warehouse.good_management.add_faile")}
                disableSubmit={!isFormValidated()}
                func={save}
                size={50}
            >
                <form id={`form-edit-good`}>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorOnCode ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.good_management.code")}
                                    <span className="text-red"> * </span>
                                </label>
                                <input type="text" className="form-control" value={code ? code : ''} onChange={handleCodeChange} />
                                <ErrorLabel content={errorOnCode} />
                            </div>
                            <div className={`form-group ${!errorOnName ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.good_management.name")}
                                    <span className="text-red"> * </span>
                                </label>
                                <input type="text" className="form-control" value={name ? name : ''} onChange={handleNameChange} />
                                <ErrorLabel content={errorOnName} />
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorOnSourceProduct ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.good_management.good_source')}</label>
                                <span className="text-red"> * </span>
                                <SelectBox
                                    id={`edit-source-type-${dataSource.value}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={sourceType ? sourceType : ""}
                                    items={dataSource}
                                    onChange={handleSourceChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorOnSourceProduct} />
                            </div>
                            <div className={`form-group ${!errorOnCategory ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.good_management.category")}
                                    <span className="text-red"> * </span>
                                </label>
                                <TreeSelect data={dataSelectBox ? dataSelectBox : ''} value={category} handleChange={handleCategoryChange} mode="hierarchical" />
                                <ErrorLabel content={errorOnCategory} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorOnBaseUnit ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.good_management.baseUnit")}
                                    <span className="text-red"> * </span>
                                </label>
                                <input type="text" className="form-control" value={baseUnit ? baseUnit : ''} onChange={handleBaseUnitChange} />
                                <ErrorLabel content={errorOnBaseUnit} />
                            </div>
                            <div className={`form-group ${!errorOnNumberExpirationDate ? "" : "has-error"}`}>
                                <label>
                                    {translate("manage_warehouse.good_management.numberExpirationDate")}
                                    <span className="text-red"> * </span>
                                </label>
                                <input type="number" className="form-control" value={numberExpirationDate ? numberExpirationDate : ''} onChange={handleNumberExpirationDateChange} />
                                <ErrorLabel content={errorOnNumberExpirationDate} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!pricePerBaseUnitError ? "" : "has-error"}`}>
                                <label>
                                    {"Giá một đơn vị tính cơ bản"}
                                    <span className="text-red"> </span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={pricePerBaseUnit ? pricePerBaseUnit : ''}
                                    onChange={handlePricePerBaseUnitChange}
                                    placeholder="Ví dụ: 1000000"
                                />
                                <ErrorLabel content={pricePerBaseUnitError} />
                            </div>
                            <div className={`form-group ${!salesPriceVarianceError ? "" : "has-error"}`}>
                                <label>
                                    {"Phương sai giá bán / 1 đơn vị tính cơ bản"}
                                    <span className="text-red"> </span>
                                </label>
                                <a onClick={() => showListExplainVariance()}>
                                    <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                                </a>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={salesPriceVariance ? salesPriceVariance : ''}
                                    onChange={handleSalesPriceVarianceChange}
                                    placeholder="Ví dụ: 50000"
                                />
                                <ErrorLabel content={salesPriceVarianceError} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <label>{translate("manage_warehouse.good_management.description")}</label>
                                <textarea type="text" className="form-control" value={description ? description : ''} onChange={handleDescriptionChange} />
                            </div>
                            <UnitCreateForm
                                // packingRule={packingRule}
                                id={goodId}
                                baseUnit={baseUnit}
                                // onValidate={validateUnitCreateForm}
                                initialData={listUnit}
                                onDataChange={handleListUnitChange}
                            />
                            <React.Fragment>
                                {(type === "product" && isSeflProduced === true) ? (<ComponentCreateForm id={goodId} initialData={listMaterial} onDataChange={handleListMaterialChange} />) : ""}

                                {(isSeflProduced === true) ? (<InfoMillCreateForm
                                    id={goodId}
                                    onDataChange={handleListMillsChange}
                                    initialData={listManfaucturingMills}
                                />) : ""}
                            </React.Fragment>

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
    editGood: GoodActions.editGood,
    getCategoriesByType: CategoryActions.getCategoriesByType,
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodEditForm));
