import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { DialogModal, TreeSelect, ErrorLabel, ButtonModal } from "../../../../../common-components";
import { GoodActions } from "../redux/actions";
import { CategoryActions } from "../../category-management/redux/actions";
import UnitCreateForm from "./unitCreateForm";
import ComponentCreateForm from "./componentCreateForm";
import InfoMillCreateForm from "./infoMillCreateForm";

class GoodEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.goodId !== prevState.goodId) {
            return {
                ...prevState,
                goodId: nextProps.goodId,
                type: nextProps.type,
                baseUnit: nextProps.baseUnit,
                // packingRule: nextProps.packingRule,
                units: nextProps.units,
                materials: nextProps.materials,
                manufacturingMills: nextProps.manufacturingMills,
                description: nextProps.description,
                code: nextProps.code,
                name: nextProps.name,
                category: nextProps.category,
                pricePerBaseUnit: nextProps.pricePerBaseUnit ? nextProps.pricePerBaseUnit : "",
                salesPriceVariance: nextProps.salesPriceVariance ? nextProps.salesPriceVariance : "",
                numberExpirationDate: nextProps.numberExpirationDate ? nextProps.numberExpirationDate : "",
                errorOnName: undefined,
                errorOnCode: undefined,
                errorOnBaseUnit: undefined,
                errorOnCategory: undefined,
                pricePerBaseUnitError: undefined,
                salesPriceVarianceError: undefined,
                errorOnNumberExpirationDate: undefined
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
        let result =
            this.validateName(this.state.name, false) &&
            this.validateCode(this.state.code, false) &&
            this.validateBaseUnit(this.state.baseUnit, false) &&
            this.validateCategory(this.state.category, false) &&
            this.state.materials.length > 0 &&
            this.validateNumberExpirationDate(this.state.numberExpirationDate, false)
        return result;
    };

    save = () => {
        if (this.isFormValidated()) {
            this.props.editGood(this.props.goodId, this.state);
        }
    };

    render() {
        let listUnit = [];
        let listMaterial = [];
        let listManfaucturingMills = [];
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
            manufacturingMills,
            goodId,
            // packingRule,
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
        if (manufacturingMills) listManfaucturingMills = manufacturingMills;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-good`}
                    isLoading={goods.isLoading}
                    formID={`form-edit-good`}
                    title={translate("manage_warehouse.good_management.add_title")}
                    msg_success={translate("manage_warehouse.good_management.add_success")}
                    msg_faile={translate("manage_warehouse.good_management.add_faile")}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={50}
                >
                    <form id={`form-edit-good`}>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorOnCode ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.good_management.code")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control" value={code} onChange={this.handleCodeChange} />
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
                                <UnitCreateForm
                                    // packingRule={packingRule}
                                    id={goodId}
                                    baseUnit={baseUnit}
                                    onValidate={this.validateUnitCreateForm}
                                    initialData={listUnit}
                                    onDataChange={this.handleListUnitChange}
                                />
                                {type === "product" ? (
                                    <React.Fragment>
                                        <ComponentCreateForm id={goodId} initialData={listMaterial} onDataChange={this.handleListMaterialChange} />
                                        <InfoMillCreateForm
                                            id={goodId}
                                            onDataChange={this.handleListMillsChange}
                                            initialData={listManfaucturingMills}
                                        />
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
    editGood: GoodActions.editGood,
    getCategoriesByType: CategoryActions.getCategoriesByType,
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodEditForm));
