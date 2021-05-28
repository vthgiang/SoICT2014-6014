import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { DialogModal, TreeSelect, ErrorLabel, ButtonModal } from "../../../../../common-components";
import { GoodActions } from "../redux/actions";
import { CategoryActions } from "../../category-management/redux/actions";
import UnitCreateForm from "./unitCreateForm";
import ComponentCreateForm from "./componentCreateForm";
import InfoMillCreateForm from "./infoMillCreateForm";
import { generateCode } from "../../../../../helpers/generateCode";

class GoodCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            name: "",
            baseUnit: "",
            units: [],
            materials: [],
            quantity: 0,
            description: "",
            type: this.props.type,
            category: "",
            pricePerBaseUnit: "",
            salesPriceVariance: "",
            numberExpirationDate: ""
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.type !== prevState.type) {
            return {
                ...prevState,
                type: nextProps.type,
                baseUnit: nextProps.baseUnit ? nextProps.baseUnit : "",
                units: nextProps.units ? nextProps.units : [],
                materials: nextProps.materials ? nextProps.materials : [],
                description: nextProps.description ? nextProps.description : "",
                code: nextProps.code ? nextProps.code : "",
                name: nextProps.name ? nextProps.name : "",
                pricePerBaseUnit: nextProps.pricePerBaseUnit ? nextProps.pricePerBaseUnit : "",
                salesPriceVariance: nextProps.salesPriceVariance ? nextProps.salesPriceVariance : "",
                numberExpirationDate: nextProps.numberExpirationDate ? nextProps.numberExpirationDate : ""
            };
        } else {
            return null;
        }
    }

    validatePrice = (value) => {
        let msg = undefined;
        if (value && parseInt(value) < 0) {
            msg = "Giá trị không được âm";
        }
        return msg;
    };

    handlePricePerBaseUnitChange = (e) => {
        let { value } = e.target;
        this.setState({
            pricePerBaseUnit: value,
            pricePerBaseUnitError: this.validatePrice(value),
        });
    };

    handleSalesPriceVarianceChange = (e) => {
        let { value } = e.target;
        this.setState({
            salesPriceVariance: value,
            salesPriceVarianceError: this.validatePrice(value),
        });
    };

    handleCodeChange = (e) => {
        let value = e.target.value;
        this.validateCode(value, true);
    };

    validateCode = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate, type } = this.props;
        if (!value) {
            msg = translate("manage_warehouse.category_management.validate_code");
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    errorOnCode: msg,
                    code: value,
                    type: type,
                };
            });
        }
        return msg === undefined;
    };

    handleNameChange = (e) => {
        let value = e.target.value;
        this.validateName(value, true);
    };

    validateName = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manage_warehouse.category_management.validate_name");
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    errorOnName: msg,
                    name: value,
                };
            });
        }
        return msg === undefined;
    };

    handleBaseUnitChange = (e) => {
        let value = e.target.value;
        this.validateBaseUnit(value, true);
    };

    validateBaseUnit = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manage_warehouse.category_management.validate_name");
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    errorOnBaseUnit: msg,
                    baseUnit: value,
                };
            });
        }
        return msg === undefined;
    };

    handleCategoryChange = (value) => {
        let category = value[0];
        this.validateCategory(category, true);
    };

    validateCategory = (category, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!category) {
            msg = translate("manage_warehouse.category_management.validate_name");
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    errorOnCategory: msg,
                    category: category,
                };
            });
        }
        return msg === undefined;
    };

    getAllCategory = () => {
        let { categories } = this.props;
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

    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState((state) => {
            return {
                ...state,
                description: value,
            };
        });
    };

    handleListUnitChange = (data) => {
        this.setState((state) => {
            return {
                ...state,
                units: data
            };
        });
    };

    handleListMaterialChange = (data) => {
        this.setState((state) => {
            return {
                ...state,
                materials: data,
            };
        });
    };

    handleListMillsChange = (data) => {
        this.setState((state) => {
            return {
                ...state,
                manufacturingMills: data,
            };
        });
        console.log(this.state.manufacturingMills);
    };

    handleNumberExpirationDateChange = (e) => {
        const { value } = e.target;
        this.validateNumberExpirationDate(value, true);
    }

    validateNumberExpirationDate = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        console.log(value);
        if (value === "") {
            msg = translate("manage_warehouse.good_management.validate_number_expiration_date");
        }
        if (value < 1) {
            msg = translate("manage_warehouse.good_management.validate_number_expiration_date_input");
        }
        if (willUpdateState) {
            console.log(msg)
            this.setState((state) => {
                return {
                    ...state,
                    errorOnNumberExpirationDate: msg,
                    numberExpirationDate: value,
                };
            });
        }
        return msg === undefined;
    }

    isFormValidated = () => {
        let { name, code, baseUnit, category, materials, numberExpirationDate, type } = this.state;
        let result;
        if (!type || type === "material") {
            result = this.validateName(name, false) &&
                this.validateCode(code, false) &&
                this.validateBaseUnit(baseUnit, false) &&
                this.validateCategory(category, false) &&
                this.validateNumberExpirationDate(numberExpirationDate, false)
        } else {
            result = this.validateName(name, false) &&
                this.validateCode(code, false) &&
                this.validateBaseUnit(baseUnit, false) &&
                this.validateCategory(category, false) &&
                materials.length > 0 &&
                this.validateNumberExpirationDate(numberExpirationDate, false)
        }
        return result;
    };

    save = () => {
        if (this.isFormValidated()) {
            console.log(this.state);
            this.props.createGoodByType(this.state);
        }
    };

    handleClickCreate = () => {
        let code = generateCode("HH");
        this.setState((state) => ({
            ...state,
            code: code,
        }));
    };
    render() {
        let listUnit = [];
        let listMaterial = [];
        const { translate, goods, categories, type } = this.props;
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
        } = this.state;
        const dataSelectBox = this.getAllCategory();

        if (units) listUnit = units;
        if (materials) listMaterial = materials;
        console.log('state', this.state);
        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreate}
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
                    msg_faile={translate("manage_warehouse.good_management.add_faile")}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
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
                                    <input type="text" className="form-control" disabled={true} value={code} onChange={this.handleCodeChange} />
                                    <ErrorLabel content={errorOnCode} />
                                </div>
                                <div className={`form-group ${!errorOnBaseUnit ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.good_management.baseUnit")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control" value={baseUnit} onChange={this.handleBaseUnitChange} />
                                    <ErrorLabel content={errorOnBaseUnit} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorOnName ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.good_management.name")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control" value={name} onChange={this.handleNameChange} />
                                    <ErrorLabel content={errorOnName} />
                                </div>
                                <div className={`form-group ${!errorOnCategory ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.good_management.category")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <TreeSelect data={dataSelectBox} value={category} handleChange={this.handleCategoryChange} mode="hierarchical" />
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
                                        onChange={this.handlePricePerBaseUnitChange}
                                        placeholder="Ví dụ: 1000000"
                                    />
                                    <ErrorLabel content={pricePerBaseUnitError} />
                                </div>
                                <div className={`form-group ${!errorOnNumberExpirationDate ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.good_management.numberExpirationDate")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="number" className="form-control" value={numberExpirationDate} onChange={this.handleNumberExpirationDateChange} />
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
                                        onChange={this.handleSalesPriceVarianceChange}
                                        placeholder="Ví dụ: 50000"
                                    />
                                    <ErrorLabel content={salesPriceVarianceError} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{translate("manage_warehouse.good_management.description")}</label>
                                    <textarea type="text" className="form-control" value={description} onChange={this.handleDescriptionChange} />
                                </div>
                                <UnitCreateForm baseUnit={baseUnit} initialData={listUnit} onDataChange={this.handleListUnitChange} />
                                {type === "product" ? (
                                    <React.Fragment>
                                        <ComponentCreateForm initialData={listMaterial} onDataChange={this.handleListMaterialChange} />
                                        <InfoMillCreateForm onDataChange={this.handleListMillsChange} />
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
