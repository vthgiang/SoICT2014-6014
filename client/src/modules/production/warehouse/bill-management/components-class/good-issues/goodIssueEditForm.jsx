import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../../common-components';
import QuantityLotGoodIssueEdit from './quantityLotGoodIssueEdit';
import { LotActions } from '../../../inventory-management/redux/actions';
import { BillActions } from '../../redux/actions';
import { GoodActions } from "../../../../common-production/good-management/redux/actions";

class GoodIssueEditForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            good: '',
            quantity: '',
            returnQuantity: '',
            description: '',
            lots: []
        }
        this.state = {
            userId: localStorage.getItem("userId"),
            list: [],
            lots: [],
            listGood: [],
            good: Object.assign({}, this.EMPTY_GOOD),
            editInfo: false,
            customer: '',
            users: [],
            status: '1',
            fromStock: ''
        }
    }

    getAllGoods = () => {
        let { translate } = this.props;
        let goodArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_good') }];

        this.props.goods.listGoods.map(item => {
            goodArr.push({
                value: item._id,
                text: item.code + " -- " + item.name + " (" + item.baseUnit + ")",
                code: item.code,
                name: item.name,
                baseUnit: item.baseUnit
            })
        })

        return goodArr;
    }

    handleGoodChange = async (value) => {
        const dataGoods = await this.getAllGoods();
        let good = value[0];
        this.state.good.quantity = 0;
        let goodName = dataGoods.find(x => x.value === good);
        this.state.good.good = { _id: good, code: goodName.code, name: goodName.name, baseUnit: goodName.baseUnit };
        await this.setState(state => {
            return {
                ...state,
                lots: []
            }
        })
        const { fromStock } = this.state;

        await this.props.getLotsByGood({ good, stock: fromStock });
    }

    addQuantity = () => {
        window.$('#modal-edit-quantity-issue').modal('show');
    }

    getApprover = () => {
        const { user, translate } = this.props;
        let ApproverArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_approver') }];

        user.list.map(item => {
            ApproverArr.push({
                value: item._id,
                text: item.name
            })
        })

        return ApproverArr;
    }

    getCustomer = () => {
        const { crm, translate } = this.props;
        let CustomerArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_customer') }];

        crm.customers.list.map(item => {
            CustomerArr.push({
                value: item._id,
                text: item.name
            })
        })

        return CustomerArr;
    }

    getStock = () => {
        const { stocks, translate } = this.props;
        let stockArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_stock') }];

        stocks.listStocks.map(item => {
            stockArr.push({
                value: item._id,
                text: item.name
            })
        })

        return stockArr;
    }

    getType = () => {
        const { group, translate } = this.props;
        let typeArr = [];
        typeArr = [
            { value: '0', text: translate('manage_warehouse.bill_management.choose_type') },
            { value: '3', text: translate('manage_warehouse.bill_management.billType.3') },
            { value: '4', text: translate('manage_warehouse.bill_management.billType.4') },
        ]
        return typeArr;
    }

    handleTypeChange = (value) => {
        let type = value[0];
        this.validateType(type, true);
    }

    validateType = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_type')
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    type: value,
                    errorType: msg,
                }
            })
        }
        return msg === undefined;
    }

    handleStockChange = (value) => {
        let fromStock = value[0];
        this.validateStock(fromStock, true);
    }

    validateStock = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_stock')
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    fromStock: value,
                    errorStock: msg,
                }
            })
        }
        return msg === undefined;
    }

    handleApproverChange = (value) => {
        let approver = value;
        this.validateApprover(approver, true);
    }

    validateApprover = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            let approvers = [];
            value.map(item => {
                approvers.push({
                    approver: item,
                    approvedTime: null
                });
            })
            this.setState(state => {
                return {
                    ...state,
                    approver: value,
                    approvers: approvers,
                    errorApprover: msg,
                }
            })
        }
        return msg === undefined;
    }

    handleAccountablesChange = (value) => {
        let accountables = value;
        this.validateAccountables(accountables, true);
    }

    validateAccountables = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    accountables: value,
                    errorAccountables: msg,
                }
            })
        }
        return msg === undefined;
    }

    handleResponsiblesChange = (value) => {
        let responsibles = value;
        this.validateResponsibles(responsibles, true);
    }

    validateResponsibles = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    responsibles: value,
                    errorResponsibles: msg,
                }
            })
        }
        return msg === undefined;
    }

    handleQualityControlStaffsChange = (value) => {
        let qualityControlStaffs = value;
        this.validateQualityControlStaffs(qualityControlStaffs, true);
    }

    validateQualityControlStaffs = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            let listQualityControlStaffs = [];
            value.map(item => {
                listQualityControlStaffs.push({
                    staff: item,
                    time: null
                });
            })
            this.setState(state => {
                return {
                    ...state,
                    qualityControlStaffs: value,
                    listQualityControlStaffs: listQualityControlStaffs,
                    errorQualityControlStaffs: msg,
                }
            })
        }
        return msg === undefined;
    }

    handlePartnerChange = (value) => {
        let partner = value[0];
        this.validatePartner(partner, true);
    }

    validatePartner = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_customer')
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    customer: value,
                    errorCustomer: msg,
                }
            })
        }
        return msg === undefined;
    }

    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                description: value,
            }
        })
    }

    handleNameChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                name: value,
            }
        })
    }

    handlePhoneChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                phone: value,
            }
        })
    }

    handleEmailChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                email: value,
            }
        })
    }

    handleAddressChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                address: value,
            }
        })
    }

    handleStatusChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                status: value[0]
            }
        })
    }

    isFormValidated = () => {
        let result =
            this.validateType(this.state.type, false) &&
            this.validateStock(this.state.fromStock, false) &&
            this.validateApprover(this.state.approver, false) &&
            this.validatePartner(this.state.customer, false) &&
            this.validateAccountables(this.state.accountables, false) &&
            this.validateQualityControlStaffs(this.state.qualityControlStaffs, false) &&
            this.validateResponsibles(this.state.responsibles, false)
        return result;
    }

    handleLotsChange = (data) => {
        let totalQuantity = data.length > 0 ? data.reduce(function (accumulator, currentValue) {
            return Number(accumulator) + Number(currentValue.quantity);
        }, 0) : 0;
        this.state.good.quantity = totalQuantity;
        this.state.good.lots = data;
        this.setState(state => {
            return {
                ...state,
                lots: data,
                quantity: totalQuantity
            }
        })
    }

    handleQuantityChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                quantity: value
            }
        })
    }

    handleAddGood = async (e) => {
        e.preventDefault();
        await this.setState(state => {
            let listGood = [...(this.state.listGood), state.good];
            return {
                ...state,
                listGood: listGood,
                lots: [],
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                good: Object.assign({}, this.EMPTY_GOOD),
                lots: []
            }
        })
    }

    handleSaveEditGood = async (e) => {
        e.preventDefault();
        const { indexInfo, listGood } = this.state;
        let newListGood;
        if (listGood) {
            newListGood = listGood.map((item, index) => {
                return (index === indexInfo) ? this.state.good : item;
            })
        }
        await this.setState(state => {
            return {
                ...state,
                editInfo: false,
                listGood: newListGood,
                lots: [],
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleCancelEditGood = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                good: Object.assign({}, this.EMPTY_GOOD),
                lots: []
            }
        })
    }

    handleEditGood = async (good, index) => {
        let lots = good.lots ? good.lots : [];
        this.setState(state => {
            return {
                ...state,
                editInfo: true,
                indexInfo: index,
                good: Object.assign({}, good),
                lots: lots
            }
        })

        const { fromStock } = this.state;

        await this.props.getLotsByGood({ good: good.good._id, stock: fromStock });
    }

    handleDeleteGood = async (index) => {
        let { listGood } = this.state;
        let newListGood;
        if (listGood) {
            newListGood = listGood.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,
                listGood: newListGood
            }
        })
    }

    handleGoodDescriptionChange = (e) => {
        let value = e.target.value;
        this.state.good.description = value;
        this.setState(state => {
            return {
                ...state,
            }
        })
    }

    getStatus = () => {
        const { translate } = this.props;
        const { oldStatus } = this.state;
        let statusArr = [];
        if (oldStatus === '1') {
            statusArr = [
                { value: '1', text: translate('manage_warehouse.bill_management.bill_status.1') },
                { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3') },
                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4') }
            ]
        }
        if (oldStatus === '2') {
            statusArr = [
                { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2') },
                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4') }
            ]
        }
        if (oldStatus === '3') {
            statusArr = [
                { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3') },
                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4') },
                { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5') }
            ]
        }
        if (oldStatus === '5') {
            statusArr = [
                { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2') },
                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4') },
                { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5') }
            ]
        }

        if (oldStatus === '4') {
            statusArr = [
                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4') }
            ]
        }

        return statusArr;
    }

    isGoodsValidated = () => {
        if (this.state.good.good && this.state.good.quantity && this.state.good.quantity !== 0) {
            return true;
        }
        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.billId !== prevState.billId || nextProps.oldStatus !== prevState.oldStatus) {
            let approver = [];
            let qualityControlStaffs = [];
            let responsibles = [];
            let accountables = [];
            if (nextProps.approvers && nextProps.approvers.length > 0) {
                for (let i = 0; i < nextProps.approvers.length; i++) {
                    approver = [...approver, nextProps.approvers[i].approver._id];
                }

            }

            if (nextProps.listQualityControlStaffs && nextProps.listQualityControlStaffs.length > 0) {
                for (let i = 0; i < nextProps.listQualityControlStaffs.length; i++) {
                    qualityControlStaffs = [...qualityControlStaffs, nextProps.listQualityControlStaffs[i].staff._id];
                }

            }

            if (nextProps.responsibles && nextProps.responsibles.length > 0) {
                for (let i = 0; i < nextProps.responsibles.length; i++) {
                    responsibles = [...responsibles, nextProps.responsibles[i]._id];
                }

            }

            if (nextProps.accountables && nextProps.accountables.length > 0) {
                for (let i = 0; i < nextProps.accountables.length; i++) {
                    accountables = [...accountables, nextProps.accountables[i]._id];
                }

            }
            prevState.good.quantity = 0;
            prevState.good.good = '';
            prevState.good.description = '';
            prevState.good.lots = [];

            if (nextProps.type === "3") {
                nextProps.getGoodsByType({ type: "material" });
            } else if (nextProps.type === "4") {
                nextProps.getGoodsByType({ type: "product" });
            }

            return {
                ...prevState,
                billId: nextProps.billId,
                code: nextProps.code,
                fromStock: nextProps.fromStock,
                status: nextProps.status,
                oldStatus: nextProps.oldStatus,
                group: nextProps.group,
                type: nextProps.type,
                users: nextProps.users,
                creator: nextProps.creator,
                approvers: nextProps.approvers,
                approver: approver,
                qualityControlStaffs: qualityControlStaffs,
                listQualityControlStaffs: nextProps.listQualityControlStaffs,
                responsibles: responsibles,
                accountables: accountables,
                description: nextProps.description,
                customer: nextProps.customer,
                name: nextProps.name,
                phone: nextProps.phone,
                email: nextProps.email,
                address: nextProps.address,
                listGood: nextProps.listGood,
                oldGoods: nextProps.listGood,
                editInfo: false,
                errorStock: undefined,
                errorType: undefined,
                errorApprover: undefined,
                errorCustomer: undefined,
                errorQualityControlStaffs: undefined,
                errorAccountables: undefined,
                errorResponsibles: undefined

            }
        }
        else {
            return null;
        }
    }

    save = async () => {
        const { billId, fromStock, code, toStock, type, status, oldStatus, users, approvers, customer, supplier,
            name, phone, email, address, description, listGood, oldGoods, listQualityControlStaffs, responsibles, accountables } = this.state;
        const { group } = this.props;
        await this.props.editBill(billId, {
            fromStock: fromStock,
            code: code,
            type: type,
            group: group,
            status: status,
            oldStatus: oldStatus,
            users: users,
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
            oldGoods: oldGoods
        })
    }

    checkApproved = (approvers, listQualityControlStaffs) => {
        let quantityApproved = 1;
        approvers.forEach((element) => {
            if (element.approvedTime == null) {
                quantityApproved = 0;
            }
        });
        if (quantityApproved === 0) {
            return true;
        }
        return false;
    }

    render() {
        const { translate, group } = this.props;
        const { billId, lots, listGood, good, code, approvers, approver, listQualityControlStaffs, accountables, responsibles, qualityControlStaffs, status, customer, fromStock, type, name, phone, email, address, description, errorStock, errorType, errorApprover, errorCustomer, quantity, errorQualityControlStaffs, errorAccountables, errorResponsibles } = this.state;
        const listGoods = this.getAllGoods();
        const dataApprover = this.getApprover();
        const dataCustomer = this.getCustomer();
        const dataStock = this.getStock();
        const dataType = this.getType();
        const dataStatus = this.getStatus();
        const checkApproved = this.checkApproved(approvers, listQualityControlStaffs);

        return (
            <React.Fragment>

                <DialogModal
                    modalID={`modal-edit-bill-issue`}
                    formID={`form-edit-bill-issue`}
                    title={translate(`manage_warehouse.bill_management.edit_title.${group}`)}
                    msg_success={translate('manage_warehouse.bill_management.add_success')}
                    msg_faile={translate('manage_warehouse.bill_management.add_faile')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={75}
                >
                    <QuantityLotGoodIssueEdit group={group} good={good} stock={fromStock} initialData={lots} onDataChange={this.handleLotsChange} />
                    <form id={`form-edit-bill-issue`}>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.infor')}</legend>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.code')}</label>
                                        <input type="text" className="form-control" value={code} disabled />
                                    </div>
                                    <div className={`form-group ${!errorType ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.type')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-type-issue-edit-${billId}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={type}
                                            items={dataType}
                                            onChange={this.handleTypeChange}
                                            multiple={false}
                                            disabled={true}
                                        />
                                        <ErrorLabel content={errorType} />
                                    </div>
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.status')}</label>
                                        <SelectBox
                                            id={`select-status-issue-edit-${billId}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={status}
                                            items={dataStatus}
                                            onChange={this.handleStatusChange}
                                            multiple={false}
                                            disabled={checkApproved}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.stock')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-stock-bill-issue-edit-${billId}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={fromStock}
                                            items={dataStock}
                                            onChange={this.handleStockChange}
                                            multiple={false}
                                            disabled={true}
                                        />
                                        <ErrorLabel content={errorStock} />
                                    </div>
                                    <div className={`form-group ${!errorCustomer ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.customer')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-customer-issue-edit-${billId}`}
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
                                        <label>{translate('manage_warehouse.bill_management.description')}</label>
                                        <textarea type="text" className="form-control" value={description} onChange={this.handleDescriptionChange} />
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        {this.state.userId === this.state.creator &&
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bill_management.list_saffs')}</legend>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                            <label>{translate('manage_warehouse.bill_management.approved')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-approver-bill-issue-edit-${billId}`}
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
                                            <label>{translate('manage_warehouse.bill_management.users')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-accountables-bill-issue-edit-${billId}`}
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
                                            <label>{translate('manage_warehouse.bill_management.qualityControlStaffs')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-qualityControlStaffs-bill-issue-edit-${billId}`}
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
                                            <label>{translate('manage_warehouse.bill_management.accountables')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-responsibles-bill-issue-edit-${billId}`}
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
                        }
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.receiver')}</legend>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.name')}<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" value={name ? name : ''} onChange={this.handleNameChange} />
                                    </div>
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.phone')}<span className="attention"> * </span></label>
                                        <input type="number" className="form-control" value={phone ? phone : ''} onChange={this.handlePhoneChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.email')}<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" value={email ? email : ''} onChange={this.handleEmailChange} />
                                    </div>
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.address')}<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" value={address ? address : ''} onChange={this.handleAddressChange} />
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.goods')}</legend>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{translate('manage_warehouse.bill_management.choose_good')}</label>
                                        <SelectBox
                                            id={`select-good-issue-edit-${billId}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={good.good ? good.good._id : '1'}
                                            items={listGoods}
                                            onChange={this.handleGoodChange}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{translate('manage_warehouse.bill_management.number')}</label>
                                        <div style={{ display: "flex" }}><input className="form-control" value={good.quantity} onChange={this.handleQuantityChange} disabled type="number" />{good.good && <i className="fa fa-plus-square" style={{ color: "#28A745", marginLeft: '5px', marginTop: '9px', cursor: 'pointer' }} onClick={() => this.addQuantity()}></i>}</div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>{translate('manage_warehouse.bill_management.description')}</label>
                                        <textarea type="text" className="form-control" value={good.description} onChange={this.handleGoodDescriptionChange} />
                                    </div>
                                </div>
                                <div className="pull-right" style={{ marginBottom: "10px" }}>
                                    {this.state.editInfo ?
                                        <React.Fragment>
                                            <button className="btn btn-success" onClick={this.handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                            <button className="btn btn-success" disabled={!this.isGoodsValidated()} onClick={this.handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                        </React.Fragment> :
                                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isGoodsValidated()} onClick={this.handleAddGood}>{translate('task_template.add')}</button>
                                    }
                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>{translate('task_template.delete')}</button>
                                </div>
                                <div className={`form-group`}>
                                    {/* Bảng thông tin chi tiết */}
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                <th title={translate('manage_warehouse.bill_management.good_code')}>{translate('manage_warehouse.bill_management.good_code')}</th>
                                                <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                                <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                                <th>{translate('task_template.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-bill-edit`}>
                                            {
                                                (typeof listGood === 'undefined' || listGood.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                    listGood.map((x, index) =>
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.good.code}</td>
                                                            <td>{x.good.name}</td>
                                                            <td>{x.good.baseUnit}</td>
                                                            <td>{x.quantity}</td>
                                                            <td>{x.description}</td>
                                                            <td>
                                                                <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditGood(x, index)}><i className="material-icons"></i></a>
                                                                <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteGood(index)}><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                    )
                                            }
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

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getLotsByGood: LotActions.getLotsByGood,
    editBill: BillActions.editBill,
    getGoodsByType: GoodActions.getGoodsByType,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodIssueEditForm));