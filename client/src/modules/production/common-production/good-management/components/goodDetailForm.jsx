import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { DialogModal } from "../../../../../common-components";
import { GoodActions } from "../redux/actions";
import { CategoryActions } from "../../category-management/redux/actions";
import { formatCurrency } from "../../../../../helpers/formatCurrency";

function GoodDetailForm(props) {
    const [state, setState] = useState({

    })
    if (
        props.goodId !== state.goodId ||
        props.baseUnit !== state.baseUnit ||
        props.units !== state.units ||
        props.materials !== state.materials ||
        props.code !== state.code ||
        props.name !== state.name ||
        props.category !== state.category ||
        props.description !== state.description
    ) {
        setState({
            ...state,
            goodId: props.goodId,
            type: props.type,
            baseUnit: props.baseUnit,
            units: props.units,
            materials: props.materials,
            description: props.description,
            code: props.code,
            name: props.name,
            category: props.category,
            // packingRule: props.packingRule,
            manufacturingMills: props.manufacturingMills,
            pricePerBaseUnit: props.pricePerBaseUnit,
            salesPriceVariance: props.salesPriceVariance,
            numberExpirationDate: props.numberExpirationDate
        });
    }

    const { translate, goods, type, categories, sourceType } = props;
    const {
        goodId,
        code,
        name,
        category,
        units,
        materials,
        baseUnit,
        description,
        // packingRule,
        manufacturingMills,
        pricePerBaseUnit,
        salesPriceVariance,
        numberExpirationDate,
    } = state;
    return (
        <React.Fragment >
            <DialogModal
                modalID={`modal-detail-good`}
                isLoading={goods.isLoading}
                formID={`form-detail-good`}
                title={translate("manage_warehouse.good_management.info")}
                msg_success={translate("manage_warehouse.good_management.add_success")}
                msg_failure={translate("manage_warehouse.good_management.add_faile")}
                size={50}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-detail-good`}>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <strong>{translate("manage_warehouse.good_management.code")}:&emsp;</strong>
                                {code ? code : ''}
                            </div>
                            <div className="form-group">
                                <strong>{translate("manage_warehouse.good_management.name")}:&emsp;</strong>
                                {name ? name : ''}
                            </div>
                            <div className="form-group">
                                <strong>{translate("manage_warehouse.good_management.baseUnit")}:&emsp;</strong>
                                {baseUnit ? baseUnit : ''}
                            </div>
                            <div className="form-group">
                                <strong>{translate("manage_warehouse.good_management.expirationDate")}:&emsp;</strong>
                                {numberExpirationDate ? numberExpirationDate : ''}{" " + translate("manage_warehouse.good_management.day")}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <strong>{translate("manage_warehouse.good_management.good_source")}:&emsp;</strong>
                                {sourceType ? (sourceType === "1" ? translate("manage_warehouse.good_management.selfProduced") : translate("manage_warehouse.good_management.importedFromSuppliers")) : ''}
                            </div>
                            <div className="form-group">
                                <strong>{translate("manage_warehouse.good_management.category")}:&emsp;</strong>
                                {category &&
                                    categories.categoryToTree.list.length &&
                                    categories.categoryToTree.list.filter((item) => item._id === category).pop()
                                    ? categories.categoryToTree.list.filter((item) => item._id === category).pop().name
                                    : "Category is deleted"}
                            </div>
                            <div className="form-group">
                                <strong>{"Giá một đơn vị tính cơ bản"}:&emsp;</strong>
                                {pricePerBaseUnit ? `${formatCurrency(pricePerBaseUnit)} (vnđ)` : ""}
                            </div>
                            <div className="form-group">
                                <strong>{"Phương sai giá bán"}:&emsp;</strong>
                                {salesPriceVariance ? `${formatCurrency(salesPriceVariance)} (vnđ)` : ""}
                            </div>
                            <div className="form-group">
                                <strong>{translate("manage_warehouse.good_management.description")}:&emsp;</strong>
                                {description ? description : ''}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate("manage_warehouse.good_management.unit")}</legend>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th title={translate("manage_warehouse.good_management.name")}>
                                                {translate("manage_warehouse.good_management.name")}
                                            </th>
                                            <th title={translate("manage_warehouse.good_management.conversion_rate")}>
                                                {translate("manage_warehouse.good_management.conversion_rate")}
                                            </th>
                                            <th title={translate("manage_warehouse.good_management.description")}>
                                                {translate("manage_warehouse.good_management.description")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id={`unit-create-good`}>
                                        {typeof units === "undefined" || units.length === 0 ? (
                                            <tr>
                                                <td colSpan={3}>
                                                    <center>{translate("task_template.no_data")}</center>
                                                </td>
                                            </tr>
                                        ) : (
                                            units.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>{item.conversionRate}</td>
                                                    <td>{item.description}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </fieldset>
                                <React.Fragment>
                                    {(type === "product" && sourceType === "1") ? (
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">{translate("manage_warehouse.good_management.materials")}</legend>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th title={translate("manage_warehouse.good_management.material")}>
                                                        {translate("manage_warehouse.good_management.material")}
                                                    </th>
                                                    <th title={translate("manage_warehouse.good_management.quantity")}>
                                                        {translate("manage_warehouse.good_management.quantity")}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody id={`material-create-${type}`}>
                                                {typeof materials === "undefined" || materials.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={3}>
                                                            <center>{translate("task_template.no_data")}</center>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    materials.map((x, index) => (
                                                        <tr key={index}>
                                                            <td>{x.good.name}</td>
                                                            <td>{x.quantity}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </fieldset>) : ("")}
                                    {(type !== "waste" && sourceType === "1") ? (
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">{translate("manage_warehouse.good_management.info_mill")}</legend>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>{translate("manage_warehouse.good_management.index")}</th>
                                                    <th>{translate("manage_warehouse.good_management.mill_code")}</th>
                                                    <th>{translate("manage_warehouse.good_management.mill_name")}</th>
                                                    <th>{translate("manage_warehouse.good_management.productivity")}</th>
                                                    <th>{translate("manage_warehouse.good_management.person_number")}</th>
                                                </tr>
                                            </thead>
                                            <tbody id={`manufacturingMill-detail-1`}>
                                                {typeof manufacturingMills === "undefined" || manufacturingMills.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5}>
                                                            <center>{translate("task_template.no_data")}</center>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    manufacturingMills.map((x, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.manufacturingMill.code}</td>
                                                            <td>{x.manufacturingMill.name}</td>
                                                            <td>{x.productivity}</td>
                                                            <td>{x.personNumber}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </fieldset>) : ("")}
                                </React.Fragment>
                            
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment >
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodDetailForm));
