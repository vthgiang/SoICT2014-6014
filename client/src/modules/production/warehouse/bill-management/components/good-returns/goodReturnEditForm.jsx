import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../../common-components';
import QuantityLotGoodReturnEdit from './quantityLotGoodReturnEdit';
import { generateCode } from '../../../../../../helpers/generateCode';
import { LotActions } from '../../../inventory-management/redux/actions';
import { BillActions } from '../../redux/actions';

class GoodReturnEditForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            good: '',
            quantity: 0,
            returnQuantity: 0,
            description: '',
            lots: []
        }
        this.state = {
            list: [],
            code: generateCode("BIGR"),
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

    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                day = '' + d.getDate(),
                month = '' + (d.getMonth() + 1),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }

    getAllGoods = () => {
        let { translate } = this.props;
        let goodArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_good') }];

        this.props.goods.listALLGoods.map(item => {
            goodArr.push({
                value: item._id,
                text: item.code + " -- " + item.name,
                code: item.code,
                name: item.name,
                baseUnit: item.baseUnit
            })
        })

        return goodArr;
    }

    getBillByStatus = () => {
        let { translate, bills } = this.props;
        let billArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_bill') }];

        bills.listBillByStatus.map(item => {
            billArr.push({
                value: item._id,
                text: item.code + " -- " + this.formatDate(item.createdAt),
                code: item.code,
            })
        })

        return billArr;
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
        window.$('#modal-edit-quantity-return').modal('show');
    }

    handleClickCreate = () => {
        const value = generateCode("BIGR");
        this.setState({
            code: value
        });
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
        let typeArr = [
            { value: '0', text: translate('manage_warehouse.bill_management.choose_type') },
            { value: '7', text: translate('manage_warehouse.bill_management.billType.7') },
        ];
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

    handleStockChange = async (value) => {
        let fromStock = value[0];
        const group = '2';
        const status = '2';
        await this.props.getBillsByStatus({ group, status, fromStock });
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
        if(!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if(willUpdateState) {
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
        if(!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if(willUpdateState) {
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
        if(!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if(willUpdateState) {
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
        if(!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if(willUpdateState) {
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

    handleSupplierChange = (value) => {
        let supplier = value[0];
        this.validateSupplier(supplier, true);
    }

    validateSupplier = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_customer')
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    supplier: value,
                    errorSuppler: msg,
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
            this.validateAccountables(this.state.accountables, false) &&
            this.validateQualityControlStaffs(this.state.qualityControlStaffs, false) &&
            this.validateResponsibles(this.state.responsibles, false)
        return result;
    }

    handleLotsChange = (data) => {
        let totalQuantity = data.length > 0 ? data.reduce(function (accumulator, currentValue) {
            return Number(accumulator) + Number(currentValue.returnQuantity);
        }, 0) : 0;
        this.state.good.returnQuantity = totalQuantity;
        this.state.good.lots = data;
        this.setState(state => {
            return {
                ...state,
                lots: data,
                returnQuantity: totalQuantity
            }
        })
    }

    handleQuantityChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                returnQuantity: value
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
        console.log(newListGood);
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

    handleBillChange = async (value) => {
        let bill = value[0];
        await this.props.getDetailBill(bill);
        await this.setState(state => {
            return {
                ...state,
                bill: bill
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
        if(this.state.good.good && this.state.good.quantity && this.state.good.quantity !== 0) {
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
            if(nextProps.approvers && nextProps.approvers.length >  0) {
                for(let i = 0; i < nextProps.approvers.length; i++) {
                   approver = [ ...approver, nextProps.approvers[i].approver._id ]; 
                }
                
            }

            if(nextProps.listQualityControlStaffs && nextProps.listQualityControlStaffs.length >  0) {
                for(let i = 0; i < nextProps.listQualityControlStaffs.length; i++) {
                    qualityControlStaffs = [ ...qualityControlStaffs, nextProps.listQualityControlStaffs[i].staff._id ]; 
                }
                
            }

            if(nextProps.responsibles && nextProps.responsibles.length >  0) {
                for(let i = 0; i < nextProps.responsibles.length; i++) {
                    responsibles = [ ...responsibles, nextProps.responsibles[i]._id ]; 
                }
                
            }

            if(nextProps.accountables && nextProps.accountables.length >  0) {
                for(let i = 0; i < nextProps.accountables.length; i++) {
                    accountables = [ ...accountables, nextProps.accountables[i]._id ]; 
                }
                
            }
            return {
                ...prevState,
                editInfo: false,
                billId: nextProps.billId,
                bill: nextProps.bill,
                code: nextProps.code,
                fromStock: nextProps.fromStock,
                status: nextProps.status,
                oldStatus: nextProps.oldStatus,
                group: nextProps.group,
                type: nextProps.type,
                users: nextProps.users,
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
        const { billId, fromStock, code, bill, type, status, oldStatus, users, approvers, customer,
            name, phone, email, address, description, listGood, oldGoods, listQualityControlStaffs, responsibles, accountables } = this.state;
        const { group } = this.props;
        await this.props.editBill(billId, {
            fromStock: fromStock,
            bill: bill,
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
        if(quantityApproved === 0) {
            return true;
        }
        return false;
    }

    render() {
        const { translate, group, bills } = this.props;
        const { lots, listGood, description, good, code, approvers, approver, listQualityControlStaffs, qualityControlStaffs, accountables, responsibles, status, fromStock, 
            type, name, phone, email, address, errorStock, errorType, errorApprover, errorCustomer, bill, errorQualityControlStaffs, errorAccountables, errorResponsibles } = this.state;
        const dataApprover = this.getApprover();
        const dataStock = this.getStock();
        const dataType = this.getType();
        const dataBill = this.getBillByStatus();
        const dataStatus = this.getStatus();
        const checkApproved = this.checkApproved(approvers, listQualityControlStaffs)

        return (
            <React.Fragment>

                <DialogModal
                    modalID={`modal-edit-bill-return`}
                    formID={`form-edit-bill-return`}
                    title={translate(`manage_warehouse.bill_management.add_title.${group}`)}
                    msg_success={translate('manage_warehouse.bill_management.add_success')}
                    msg_faile={translate('manage_warehouse.bill_management.add_faile')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={75}
                >
                    <QuantityLotGoodReturnEdit group={group} good={good} stock={fromStock} initialData={lots} onDataChange={this.handleLotsChange} />
                    <form id={`form-edit-bill-return`}>
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
                                            id={`select-type-return-edit`}
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
                                            id={`select-status-return-edit`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={status}
                                            items={[
                                                { value: '1', text: translate('manage_warehouse.bill_management.bill_status.1') },
                                                { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2') },
                                                { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3') },
                                                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4') },
                                                { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5') },
                                            ]}
                                            items={dataStatus}
                                            onChange={this.handleStatusChange}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.stock')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-stock-bill-return-edit`}
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
                                        <label>{translate('manage_warehouse.bill_management.bill_issued')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-customer-return-edit`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={bill}
                                            items={dataBill}
                                            onChange={this.handleBillChange}
                                            multiple={false}
                                            disabled={true}
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
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_warehouse.bill_management.list_saffs')}</legend>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.approved')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-approver-bill-return-edit`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={approver}
                                        items={dataApprover}
                                        onChange={this.handleApproverChange}    
                                        multiple={true}
                                    />
                                    <ErrorLabel content = { errorApprover } />
                                </div>
                                <div className={`form-group ${!errorResponsibles ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.users')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-accountables-bill-return-edit`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={responsibles}
                                        items={dataApprover}
                                        onChange={this.handleResponsiblesChange}    
                                        multiple={true}
                                    />
                                    <ErrorLabel content = { errorResponsibles } />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorQualityControlStaffs ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.qualityControlStaffs')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-qualityControlStaffs-bill-return-edit`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={qualityControlStaffs}
                                        items={dataApprover}
                                        onChange={this.handleQualityControlStaffsChange}    
                                        multiple={true}
                                    />
                                    <ErrorLabel content = { errorQualityControlStaffs } />
                                </div>
                                <div className={`form-group ${!errorAccountables ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.accountables')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-responsibles-bill-return-edit`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={accountables}
                                        items={dataApprover}
                                        onChange={this.handleAccountablesChange}    
                                        multiple={true}
                                    />
                                    <ErrorLabel content = { errorAccountables } />
                                </div>
                            </div>
                        </fieldset>
                        </div>
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
                                <div>
                                    {this.state.editInfo &&
                                        <div>
                                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                <div className="form-group">
                                                    <label>{translate('manage_warehouse.bill_management.quantity_issue')}</label>
                                                    <input className="form-control" value={good.quantity} disabled type="number" />
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                <div className="form-group">
                                                    <label>{translate('manage_warehouse.bill_management.quantity_return')}</label>
                                                    <div style={{ display: "flex" }}><input className="form-control" value={good.returnQuantity ? good.returnQuantity : 0} onChange={this.handleQuantityChange} type="number" /><i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: '5px', marginTop: '9px', cursor: 'pointer' }} onClick={() => this.addQuantity()}></i></div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                <div className="form-group">
                                                    <label>{translate('manage_warehouse.bill_management.description')}</label>
                                                    <textarea type="text" className="form-control" value={good.description} onChange={this.handleGoodDescriptionChange} />
                                                </div>
                                            </div>
                                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                                {this.state.editInfo &&
                                                    <React.Fragment>
                                                        <button className="btn btn-success" onClick={this.handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                                        <button className="btn btn-success" disabled={!this.isGoodsValidated()} onClick={this.handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                                    </React.Fragment>
                                                }
                                            </div>
                                        </div>
                                    }
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
                                                <th title={translate('manage_warehouse.bill_management.quantity_issue')}>{translate('manage_warehouse.bill_management.quantity_issue')}</th>
                                                <th title={translate('manage_warehouse.bill_management.quantity_return')}>{translate('manage_warehouse.bill_management.quantity_return')}</th>
                                                <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                                <th>{translate('task_template.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-bill-create`}>
                                            {
                                                (typeof listGood === 'undefined' || listGood.length === 0) ? <tr><td colSpan={8}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                    listGood.map((x, index) =>
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.good.code}</td>
                                                            <td>{x.good.name}</td>
                                                            <td>{x.good.baseUnit}</td>
                                                            <td>{x.quantity}</td>
                                                            <td>{x.returnQuantity}</td>
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
    editBill: BillActions.editBill
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodReturnEditForm));