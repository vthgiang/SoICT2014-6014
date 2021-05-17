import React, { useState ,useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from "../../../../../../common-components";
import QuantityLotGoodIssue from "./quantityLotGoodIssue";
import { generateCode } from "../../../../../../helpers/generateCode";
import { LotActions } from "../../../inventory-management/redux/actions";
import { BillActions } from "../../redux/actions";
import { GoodActions } from "../../../../common-production/good-management/redux/actions";

function GoodIssueCreateForm(props) {
    const EMPTY_GOOD = {
        good: "",
        quantity: "",
        returnQuantity: "",
        description: "",
        lots: [],
    };

    const [state, setState] = useState({
        list: [],
        code: generateCode("BIIS"),
        lots: [],
        listGood: [],
        good: Object.assign({}, EMPTY_GOOD),
        editInfo: false,
        customer: "",
        users: [],
        status: "1",
        fromStock: "",
        qualityControlStaffs: [],
        accountables: [],
        responsibles: [],
        approver: [],
    })

    const getAllGoods = () => {
        let { translate } = props;
        let goodArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_good") }];

        props.goods.listGoods.map((item) => {
            goodArr.push({
                value: item._id,
                text: item.code + " -- " + item.name + " (" + item.baseUnit + ")",
                code: item.code,
                name: item.name,
                baseUnit: item.baseUnit,
            });
        });

        return goodArr;
    };

    const handleGoodChange = async (value) => {
        const dataGoods = await getAllGoods();
        let good = value[0];
        state.good.quantity = 0;
        let goodName = dataGoods.find((x) => x.value === good);
        state.good.good = { _id: good, code: goodName.code, name: goodName.name, baseUnit: goodName.baseUnit };
        await setState({
            ...state,
            lots: [],
        });
        const { fromStock } = state;

        await props.getLotsByGood({ good, stock: fromStock });
    };

    addQuantity = () => {
        window.$("#modal-add-quantity-issue").modal("show");
    };

    const handleClickCreate = () => {
        const value = generateCode("BIIS");
        setState({
            ...state,
            code: value,
        });
    };

    const getApprover = () => {
        const { user, translate } = props;
        let ApproverArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_approver") }];

        user.list.map((item) => {
            ApproverArr.push({
                value: item._id,
                text: item.name,
            });
        });

        return ApproverArr;
    };

    const getCustomer = () => {
        const { crm, translate } = props;
        let CustomerArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_customer") }];

        crm.customers.list.map((item) => {
            CustomerArr.push({
                value: item._id,
                text: item.name,
            });
        });

        return CustomerArr;
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

    const getType = () => {
        const { translate } = props;
        let typeArr = [];
        typeArr = [
            { value: "0", text: translate("manage_warehouse.bill_management.choose_type") },
            { value: "3", text: translate("manage_warehouse.bill_management.billType.3") },
            { value: "4", text: translate("manage_warehouse.bill_management.billType.4") },
        ];
        return typeArr;
    };

    const handleTypeChange = async (value) => {
        let type = value[0];
        if (type === "3") {
            await props.getGoodsByType({ type: "material" });
        } else if (type === "4") {
            await props.getGoodsByType({ type: "product" });
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

    const handleApproverChange = (value) => {
        let approver = value;
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
            value.map((item) => {
                approvers.push({
                    approver: item,
                    approvedTime: null,
                });
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

    const handleAccountablesChange = (value) => {
        let accountables = value;
        validateAccountables(accountables, true);
    };

    const validateAccountables = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_approver");
        }
        if (willUpdateState) {
            setState({
                ...state,
                accountables: value,
                errorAccountables: msg,
            });
        }
        return msg === undefined;
    };

    const handleResponsiblesChange = (value) => {
        let responsibles = value;
        validateResponsibles(responsibles, true);
    };

    const validateResponsibles = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_approver");
        }
        if (willUpdateState) {
            setState({
                ...state,
                responsibles: value,
                errorResponsibles: msg,
            });
        }
        return msg === undefined;
    };

    const handleQualityControlStaffsChange = (value) => {
        let qualityControlStaffs = value;
        validateQualityControlStaffs(qualityControlStaffs, true);
    };

    const validateQualityControlStaffs = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_approver");
        }
        if (willUpdateState) {
            let listQualityControlStaffs = [];
            value.map((item) => {
                listQualityControlStaffs.push({
                    staff: item,
                    time: null,
                });
            });
            setState({
                ...state,
                qualityControlStaffs: value,
                listQualityControlStaffs: listQualityControlStaffs,
                errorQualityControlStaffs: msg,
            });
        }
        return msg === undefined;
    };

    const handlePartnerChange = (value) => {
        let partner = value[0];
        validatePartner(partner, true);
    };

    const validatePartner = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_customer");
        }
        if (willUpdateState) {
            setState({
                ...state,
                customer: value,
                errorCustomer: msg,
            });
        }
        return msg === undefined;
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

    const handleDescriptionChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            description: value,
        });
    };

    const handleNameChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            name: value,
        });
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            phone: value,
        });
    };

    const handleEmailChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            email: value,
        });
    };

    const handleAddressChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            address: value,
        });
    };

    const handleStatusChange = (value) => {
        setState({
            ...state,
            status: value[0],
        });
    };

    const isFormValidated = () => {
        let result =
            validateType(state.type, false) &&
            validateStock(state.fromStock, false) &&
            validateApprover(state.approver, false) &&
            validatePartner(state.customer, false) &&
            validateAccountables(state.accountables, false) &&
            validateQualityControlStaffs(state.qualityControlStaffs, false) &&
            validateResponsibles(state.responsibles, false);
        return result;
    };

    const handleLotsChange = (data) => {
        let totalQuantity =
            data.length > 0
                ? data.reduce(function (accumulator, currentValue) {
                    return Number(accumulator) + Number(currentValue.quantity);
                }, 0)
                : 0;
        state.good.quantity = totalQuantity;
        state.good.lots = data;
        setState({
            ...state,
            lots: data,
            quantity: totalQuantity,
        });
    };

    const handleQuantityChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            quantity: value,
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
        });
    };

    const handleClearGood = (e) => {
        e.preventDefault();
        setState({
            ...state,
            good: Object.assign({}, EMPTY_GOOD),
            lots: [],
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
        });
    };

    const handleCancelEditGood = (e) => {
        e.preventDefault();
        setState({
            ...state,
            editInfo: false,
            good: Object.assign({}, EMPTY_GOOD),
            lots: [],
        });
    };

    const handleEditGood = async (good, index) => {
        let lots = good.lots ? good.lots : [];
        await setState({
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
        await setState((state) => {
            return {
                ...state,
                listGood: newListGood,
            };
        });
    };

    const handleGoodDescriptionChange = (e) => {
        let value = e.target.value;
        state.good.description = value;
        setState({
            ...state,
        });
    };

    const isGoodsValidated = () => {
        if (state.good.good && state.good.quantity && state.good.quantity !== 0) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        let { salesOrderAddBill = { code: "" } } = props;

        if (nextProps.createdSource === "salesOrder" && salesOrderAddBill.code !== "" && salesOrderAddBill.code !== state.salesOrderCode) {
            setState({
                ...state,
                group: nextProps.group,
                code: nextProps.billCode,
                salesOrderId: salesOrderAddBill._id,
                salesOrderCode: salesOrderAddBill.code,
                type: "4",
                customer: salesOrderAddBill.customer ? salesOrderAddBill.customer._id : "",
                address: salesOrderAddBill.customerAddress,
                listGood: salesOrderAddBill.goods
                    ? salesOrderAddBill.goods.map((good) => {
                        return {
                            good: {
                                _id: good.good._id,
                                code: good.good.code,
                                name: good.good.name,
                                baseUnit: good.good.baseUnit,
                            },
                            quantity: good.quantity,
                        };
                    })
                    : "",
            });
        }
    }, [props.salesOrderAddBill.code])

    useEffect(() => {
        setState({
            ...state,
            group: nextProps.group,
            listGood: [],
            lots: [],
            type: "",
            errorStock: undefined,
            errorType: undefined,
            errorApprover: undefined,
            errorCustomer: undefined,
        });
    }, [props.group])

    const save = async () => {
        const {
            fromStock,
            code,
            type,
            status,
            users,
            approvers,
            customer,
            name,
            phone,
            email,
            address,
            description,
            listGood,
            listQualityControlStaffs,
            responsibles,
            accountables,
            salesOrderId,
        } = state;
        const { group, createdSource } = props;
        await props.createBill({
            fromStock: fromStock,
            code: code,
            type: type,
            group: group,
            status: status,
            approvers: approvers,
            qualityControlStaffs: listQualityControlStaffs,
            responsibles: responsibles,
            accountables: accountables,
            customer: customer,
            name: name,
            phone: phone,
            email: email,
            address: address,
            description: description,
            goods: listGood,
            salesOrderId,
        });

        //Load lại dữ liệu đơn hàng sau 1000ms
        if (createdSource === "salesOrder") {
            await setTimeout(() => props.reloadSalesOrderTable(), 2000);
        }
    };

    const { translate, group, createdSource, modalName } = props;
    const {
        lots,
        listGood,
        good,
        code,
        approver,
        accountables,
        responsibles,
        qualityControlStaffs,
        status,
        customer,
        fromStock,
        type,
        name,
        phone,
        email,
        address,
        errorStock,
        errorType,
        errorApprover,
        errorCustomer,
        errorQualityControlStaffs,
        errorAccountables,
        errorResponsibles,
    } = state;
    const listGoods = getAllGoods();
    const dataApprover = getApprover();
    const dataCustomer = getCustomer();
    const dataStock = getStock();
    const dataType = getType();

    return (
        <React.Fragment>
            {createdSource !== "salesOrder" && (
                <ButtonModal
                    onButtonCallBack={handleClickCreate}
                    modalID={`modal-create-bill-issue`}
                    button_name={translate("manage_warehouse.good_management.add")}
                    title={translate("manage_warehouse.good_management.add_title")}
                />
            )}

            <DialogModal
                modalID={`modal-create-bill-issue`}
                formID={`form-create-bill-issue`}
                title={translate(`manage_warehouse.bill_management.add_title.${group}`) || modalName}
                msg_success={translate("manage_warehouse.bill_management.add_success")}
                msg_faile={translate("manage_warehouse.bill_management.add_faile")}
                disableSubmit={!isFormValidated()}
                func={save}
                size={75}
            >
                <QuantityLotGoodIssue group={group} good={good} stock={fromStock} initialData={lots} onDataChange={handleLotsChange} />
                <form id={`form-create-bill-issue`}>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate("manage_warehouse.bill_management.infor")}</legend>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate("manage_warehouse.bill_management.code")}</label>
                                    <input type="text" className="form-control" value={code} disabled />
                                </div>
                                <div className={`form-group ${!errorType ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.type")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-type-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={type}
                                        items={dataType}
                                        onChange={handleTypeChange}
                                        multiple={false}
                                    />
                                    <ErrorLabel content={errorType} />
                                </div>
                                {/* <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.status')}</label>
                                        <SelectBox
                                            id={`select-status-issue-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={status}
                                            items={[
                                                { value: '1', text: translate('manage_warehouse.bill_management.bill_status.1')},
                                                { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2')},
                                                { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3')},
                                                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4')},
                                                { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5')},
                                            ]}
                                            onChange={this.handleStatusChange}    
                                            multiple={false}
                                            disabled={true}
                                        />
                                    </div> */}
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.stock")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-stock-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={fromStock}
                                        items={dataStock}
                                        onChange={handleStockChange}
                                        multiple={false}
                                    />
                                    <ErrorLabel content={errorStock} />
                                </div>
                                <div className={`form-group ${!errorCustomer ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.customer")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-customer-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={customer}
                                        items={dataCustomer}
                                        onChange={handlePartnerChange}
                                        multiple={false}
                                    />
                                    <ErrorLabel content={errorCustomer} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{translate("manage_warehouse.bill_management.description")}</label>
                                    <textarea type="text" className="form-control" onChange={handleDescriptionChange} />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate("manage_warehouse.bill_management.list_saffs")}</legend>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.approved")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-approver-bill-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={approver}
                                        items={dataApprover}
                                        onChange={handleApproverChange}
                                        multiple={true}
                                    />
                                    <ErrorLabel content={errorApprover} />
                                </div>
                                <div className={`form-group ${!errorResponsibles ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.users")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-accountables-bill-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={responsibles}
                                        items={dataApprover}
                                        onChange={handleResponsiblesChange}
                                        multiple={true}
                                    />
                                    <ErrorLabel content={errorResponsibles} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorQualityControlStaffs ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.qualityControlStaffs")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-qualityControlStaffs-bill-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={qualityControlStaffs}
                                        items={dataApprover}
                                        onChange={handleQualityControlStaffsChange}
                                        multiple={true}
                                    />
                                    <ErrorLabel content={errorQualityControlStaffs} />
                                </div>
                                <div className={`form-group ${!errorAccountables ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.accountables")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-responsibles-bill-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={accountables}
                                        items={dataApprover}
                                        onChange={handleAccountablesChange}
                                        multiple={true}
                                    />
                                    <ErrorLabel content={errorAccountables} />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate("manage_warehouse.bill_management.receiver")}</legend>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.name")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control" onChange={handleNameChange} />
                                </div>
                                <div className={`form-group`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.phone")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="number" className="form-control" onChange={handlePhoneChange} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.email")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control" onChange={handleEmailChange} />
                                </div>
                                <div className={`form-group`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.address")}
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control" value={address} onChange={handleAddressChange} />
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate("manage_warehouse.bill_management.goods")}</legend>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{translate("manage_warehouse.bill_management.choose_good")}</label>
                                    <SelectBox
                                        id={`select-good-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={good.good ? good.good._id : "1"}
                                        items={listGoods}
                                        onChange={handleGoodChange}
                                        multiple={false}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{translate("manage_warehouse.bill_management.number")}</label>
                                    <div style={{ display: "flex" }}>
                                        <input
                                            className="form-control"
                                            value={good.quantity}
                                            onChange={handleQuantityChange}
                                            disabled
                                            type="number"
                                        />
                                        {good.good && (
                                            <i
                                                className="fa fa-plus-square"
                                                style={{ color: "#28A745", marginLeft: "5px", marginTop: "9px", cursor: "pointer" }}
                                                onClick={() => addQuantity()}
                                            ></i>
                                        )}
                                    </div>
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
                                            <th title={translate("manage_warehouse.bill_management.note")}>
                                                {translate("manage_warehouse.bill_management.note")}
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
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
    getLotsByGood: LotActions.getLotsByGood,
    createBill: BillActions.createBill,
    getGoodsByType: GoodActions.getGoodsByType,
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodIssueCreateForm));
