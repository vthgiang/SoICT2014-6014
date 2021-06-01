import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from "../../../../../../common-components";
import QuantityLotGoodIssue from "./quantityLotGoodIssue";
import { generateCode } from "../../../../../../helpers/generateCode";
import { LotActions } from "../../../inventory-management/redux/actions";
import { BillActions } from "../../redux/actions";
import { GoodActions } from "../../../../common-production/good-management/redux/actions";

class GoodIssueCreateForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            good: "",
            quantity: "",
            returnQuantity: "",
            description: "",
            lots: [],
        };
        this.state = {
            list: [],
            code: generateCode("BIIS"),
            lots: [],
            listGood: [],
            good: Object.assign({}, this.EMPTY_GOOD),
            editInfo: false,
            customer: "",
            users: [],
            status: "1",
            fromStock: "",
            qualityControlStaffs: [],
            accountables: [],
            responsibles: [],
            approver: [],
        };
    }

    getAllGoods = () => {
        let { translate } = this.props;
        let goodArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_good") }];

        this.props.goods.listGoods.map((item) => {
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

    handleGoodChange = async (value) => {
        const dataGoods = await this.getAllGoods();
        let good = value[0];
        this.state.good.quantity = 0;
        let goodName = dataGoods.find((x) => x.value === good);
        this.state.good.good = { _id: good, code: goodName.code, name: goodName.name, baseUnit: goodName.baseUnit };
        await this.setState((state) => {
            return {
                ...state,
                lots: [],
            };
        });
        const { fromStock } = this.state;

        await this.props.getLotsByGood({ good, stock: fromStock });
    };

    addQuantity = () => {
        window.$("#modal-add-quantity-issue").modal("show");
    };

    handleClickCreate = () => {
        const value = generateCode("BIIS");
        this.setState({
            code: value,
        });
    };

    getApprover = () => {
        const { user, translate } = this.props;
        let ApproverArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_approver") }];

        user.list.map((item) => {
            ApproverArr.push({
                value: item._id,
                text: item.name,
            });
        });

        return ApproverArr;
    };

    getCustomer = () => {
        const { crm, translate } = this.props;
        let CustomerArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_customer") }];

        crm.customers.list.map((item) => {
            CustomerArr.push({
                value: item._id,
                text: item.name,
            });
        });

        return CustomerArr;
    };

    getStock = () => {
        const { stocks, translate } = this.props;
        let stockArr = [{ value: "", text: translate("manage_warehouse.bill_management.choose_stock") }];

        stocks.listStocks.map((item) => {
            stockArr.push({
                value: item._id,
                text: item.name,
            });
        });

        return stockArr;
    };

    getType = () => {
        const { translate } = this.props;
        let typeArr = [];
        typeArr = [
            { value: "0", text: translate("manage_warehouse.bill_management.choose_type") },
            { value: "3", text: translate("manage_warehouse.bill_management.billType.3") },
            { value: "4", text: translate("manage_warehouse.bill_management.billType.4") },
        ];
        return typeArr;
    };

    handleTypeChange = async (value) => {
        let type = value[0];
        if (type === "3") {
            await this.props.getGoodsByType({ type: "material" });
        } else if (type === "4") {
            await this.props.getGoodsByType({ type: "product" });
        }
        this.validateType(type, true);
    };

    validateType = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_type");
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    type: value,
                    errorType: msg,
                };
            });
        }
        return msg === undefined;
    };

    handleStockChange = (value) => {
        let fromStock = value[0];
        this.validateStock(fromStock, true);
    };

    validateStock = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_stock");
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    fromStock: value,
                    errorStock: msg,
                };
            });
        }
        return msg === undefined;
    };

    handleApproverChange = (value) => {
        let approver = value;
        this.validateApprover(approver, true);
    };

    validateApprover = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
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
            this.setState((state) => {
                return {
                    ...state,
                    approver: value,
                    approvers: approvers,
                    errorApprover: msg,
                };
            });
        }
        return msg === undefined;
    };

    handleAccountablesChange = (value) => {
        let accountables = value;
        this.validateAccountables(accountables, true);
    };

    validateAccountables = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_approver");
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    accountables: value,
                    errorAccountables: msg,
                };
            });
        }
        return msg === undefined;
    };

    handleResponsiblesChange = (value) => {
        let responsibles = value;
        this.validateResponsibles(responsibles, true);
    };

    validateResponsibles = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_approver");
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    responsibles: value,
                    errorResponsibles: msg,
                };
            });
        }
        return msg === undefined;
    };

    handleQualityControlStaffsChange = (value) => {
        let qualityControlStaffs = value;
        this.validateQualityControlStaffs(qualityControlStaffs, true);
    };

    validateQualityControlStaffs = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
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
            this.setState((state) => {
                return {
                    ...state,
                    qualityControlStaffs: value,
                    listQualityControlStaffs: listQualityControlStaffs,
                    errorQualityControlStaffs: msg,
                };
            });
        }
        return msg === undefined;
    };

    handlePartnerChange = (value) => {
        let partner = value[0];
        this.validatePartner(partner, true);
    };

    validatePartner = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_customer");
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    customer: value,
                    errorCustomer: msg,
                };
            });
        }
        return msg === undefined;
    };

    handleSupplierChange = (value) => {
        let supplier = value[0];
        this.validateSupplier(supplier, true);
    };

    validateSupplier = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_customer");
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    supplier: value,
                    errorSuppler: msg,
                };
            });
        }
        return msg === undefined;
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

    handleNameChange = (e) => {
        let value = e.target.value;
        this.setState((state) => {
            return {
                ...state,
                name: value,
            };
        });
    };

    handlePhoneChange = (e) => {
        let value = e.target.value;
        this.setState((state) => {
            return {
                ...state,
                phone: value,
            };
        });
    };

    handleEmailChange = (e) => {
        let value = e.target.value;
        this.setState((state) => {
            return {
                ...state,
                email: value,
            };
        });
    };

    handleAddressChange = (e) => {
        let value = e.target.value;
        this.setState((state) => {
            return {
                ...state,
                address: value,
            };
        });
    };

    handleStatusChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                status: value[0],
            };
        });
    };

    isFormValidated = () => {
        let result =
            this.validateType(this.state.type, false) &&
            this.validateStock(this.state.fromStock, false) &&
            this.validateApprover(this.state.approver, false) &&
            this.validatePartner(this.state.customer, false) &&
            this.validateAccountables(this.state.accountables, false) &&
            this.validateQualityControlStaffs(this.state.qualityControlStaffs, false) &&
            this.validateResponsibles(this.state.responsibles, false);
        return result;
    };

    handleLotsChange = (data) => {
        let totalQuantity =
            data.length > 0
                ? data.reduce(function (accumulator, currentValue) {
                      return Number(accumulator) + Number(currentValue.quantity);
                  }, 0)
                : 0;
        this.state.good.quantity = totalQuantity;
        this.state.good.lots = data;
        this.setState((state) => {
            return {
                ...state,
                lots: data,
                quantity: totalQuantity,
            };
        });
    };

    handleQuantityChange = (e) => {
        let value = e.target.value;
        this.setState((state) => {
            return {
                ...state,
                quantity: value,
            };
        });
    };

    handleAddGood = async (e) => {
        e.preventDefault();
        await this.setState((state) => {
            let listGood = [...this.state.listGood, state.good];
            return {
                ...state,
                listGood: listGood,
                lots: [],
                good: Object.assign({}, this.EMPTY_GOOD),
            };
        });
    };

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState((state) => {
            return {
                ...state,
                good: Object.assign({}, this.EMPTY_GOOD),
                lots: [],
            };
        });
    };

    handleSaveEditGood = async (e) => {
        e.preventDefault();
        const { indexInfo, listGood } = this.state;
        let newListGood;
        if (listGood) {
            newListGood = listGood.map((item, index) => {
                return index === indexInfo ? this.state.good : item;
            });
        }
        await this.setState((state) => {
            return {
                ...state,
                editInfo: false,
                listGood: newListGood,
                lots: [],
                good: Object.assign({}, this.EMPTY_GOOD),
            };
        });
    };

    handleCancelEditGood = (e) => {
        e.preventDefault();
        this.setState((state) => {
            return {
                ...state,
                editInfo: false,
                good: Object.assign({}, this.EMPTY_GOOD),
                lots: [],
            };
        });
    };

    handleEditGood = async (good, index) => {
        let lots = good.lots ? good.lots : [];
        this.setState((state) => {
            return {
                ...state,
                editInfo: true,
                indexInfo: index,
                good: Object.assign({}, good),
                lots: lots,
            };
        });

        const { fromStock } = this.state;

        await this.props.getLotsByGood({ good: good.good._id, stock: fromStock });
    };

    handleDeleteGood = async (index) => {
        let { listGood } = this.state;
        let newListGood;
        if (listGood) {
            newListGood = listGood.filter((item, x) => index !== x);
        }
        await this.setState((state) => {
            return {
                ...state,
                listGood: newListGood,
            };
        });
    };

    handleGoodDescriptionChange = (e) => {
        let value = e.target.value;
        this.state.good.description = value;
        this.setState((state) => {
            return {
                ...state,
            };
        });
    };

    isGoodsValidated = () => {
        if (this.state.good.good && this.state.good.quantity && this.state.good.quantity !== 0) {
            return true;
        }
        return false;
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        //---Lập phiếu từ đơn bán hàng---
        let { salesOrderAddBill = { code: "" } } = nextProps;

        if (nextProps.createdSource === "salesOrder" && salesOrderAddBill.code !== "" && salesOrderAddBill.code !== prevState.salesOrderCode) {
            return {
                ...prevState,
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
            };
        }
        //---Kết thúc phần lập phiếu từ đơn bán hàng---

        //---Lập phiếu xuất nguyên vật liệu từ lệnh sản xuất---

        //---Kế thúc lập phiếu xuất nguyên liệu từ lệnh sản xuất---

        if (nextProps.group !== prevState.group) {
            return {
                ...prevState,
                group: nextProps.group,
                listGood: [],
                lots: [],
                type: "",
                errorStock: undefined,
                errorType: undefined,
                errorApprover: undefined,
                errorCustomer: undefined,
            };
        } else {
            return null;
        }
    }

    save = async () => {
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
        } = this.state;
        const { group, createdSource } = this.props;
        await this.props.createBill({
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
            await setTimeout(() => this.props.reloadSalesOrderTable(), 2000);
        }
    };

    render() {
        const { translate, group, createdSource, modalName } = this.props;
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
        } = this.state;
        const listGoods = this.getAllGoods();
        const dataApprover = this.getApprover();
        const dataCustomer = this.getCustomer();
        const dataStock = this.getStock();
        const dataType = this.getType();

        return (
            <React.Fragment>
                {createdSource !== "salesOrder" && (
                    <ButtonModal
                        onButtonCallBack={this.handleClickCreate}
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
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={75}
                >
                    <QuantityLotGoodIssue group={group} good={good} stock={fromStock} initialData={lots} onDataChange={this.handleLotsChange} />
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
                                            onChange={this.handleTypeChange}
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
                                            onChange={this.handleStockChange}
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
                                            onChange={this.handlePartnerChange}
                                            multiple={false}
                                        />
                                        <ErrorLabel content={errorCustomer} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>{translate("manage_warehouse.bill_management.description")}</label>
                                        <textarea type="text" className="form-control" onChange={this.handleDescriptionChange} />
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
                                            onChange={this.handleApproverChange}
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
                                            onChange={this.handleResponsiblesChange}
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
                                            onChange={this.handleQualityControlStaffsChange}
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
                                            onChange={this.handleAccountablesChange}
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
                                        <input type="text" className="form-control" onChange={this.handleNameChange} />
                                    </div>
                                    <div className={`form-group`}>
                                        <label>
                                            {translate("manage_warehouse.bill_management.phone")}
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="number" className="form-control" onChange={this.handlePhoneChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>
                                            {translate("manage_warehouse.bill_management.email")}
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="text" className="form-control" onChange={this.handleEmailChange} />
                                    </div>
                                    <div className={`form-group`}>
                                        <label>
                                            {translate("manage_warehouse.bill_management.address")}
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="text" className="form-control" value={address} onChange={this.handleAddressChange} />
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
                                            onChange={this.handleGoodChange}
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
                                                onChange={this.handleQuantityChange}
                                                disabled
                                                type="number"
                                            />
                                            {good.good && (
                                                <i
                                                    className="fa fa-plus-square"
                                                    style={{ color: "#28A745", marginLeft: "5px", marginTop: "9px", cursor: "pointer" }}
                                                    onClick={() => this.addQuantity()}
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
                                            onChange={this.handleGoodDescriptionChange}
                                        />
                                    </div>
                                </div>
                                <div className="pull-right" style={{ marginBottom: "10px" }}>
                                    {this.state.editInfo ? (
                                        <React.Fragment>
                                            <button className="btn btn-success" onClick={this.handleCancelEditGood} style={{ marginLeft: "10px" }}>
                                                {translate("task_template.cancel_editing")}
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                disabled={!this.isGoodsValidated()}
                                                onClick={this.handleSaveEditGood}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                {translate("task_template.save")}
                                            </button>
                                        </React.Fragment>
                                    ) : (
                                        <button
                                            className="btn btn-success"
                                            style={{ marginLeft: "10px" }}
                                            disabled={!this.isGoodsValidated()}
                                            onClick={this.handleAddGood}
                                        >
                                            {translate("task_template.add")}
                                        </button>
                                    )}
                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>
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
                                                                onClick={() => this.handleEditGood(x, index)}
                                                            >
                                                                <i className="material-icons"></i>
                                                            </a>
                                                            <a
                                                                href="#abc"
                                                                className="delete"
                                                                title={translate("general.delete")}
                                                                onClick={() => this.handleDeleteGood(index)}
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
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
    getLotsByGood: LotActions.getLotsByGood,
    createBill: BillActions.createBill,
    getGoodsByType: GoodActions.getGoodsByType,
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodIssueCreateForm));