import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../../common-components';
import QuantityLotGoodReturn from './quantityLotGoodReturn';
import { generateCode } from '../../../../../../helpers/generateCode';
import { LotActions } from '../../../inventory-management/redux/actions';
import { BillActions } from '../../redux/actions';

function GoodReturnCreateForm(props) {
    const EMPTY_GOOD = {
        good: '',
        quantity: 0,
        returnQuantity: 0,
        description: '',
        lots: []
    }

    const [state, setState] = useState({
        list: [],
        code: generateCode("BIGR"),
        lots: [],
        listGood: [],
        good: Object.assign({}, EMPTY_GOOD),
        editInfo: false,
        getGoodInfo: false,
        customer: '',
        users: [],
        status: '1',
        fromStock: '',
        qualityControlStaffs: [],
        accountables: [],
        responsibles: [],
        approver: [],
        type: '7'
    })

    function formatDate(date, monthYear = false) {
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

    const getAllGoods = () => {
        let { translate } = props;
        let goodArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_good') }];

        props.goods.listALLGoods.map(item => {
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

    const getBillByStatus = () => {
        let { translate, bills } = props;
        let billArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_bill') }];

        bills.listBillByStatus.map(item => {
            billArr.push({
                value: item._id,
                text: item.code + " -- " + formatDate(item.createdAt),
                code: item.code,
            })
        })

        return billArr;
    }

    const handleGoodChange = async (value) => {
        const dataGoods = await getAllGoods();
        let good = value[0];
        state.good.quantity = 0;
        let goodName = dataGoods.find(x => x.value === good);
        state.good.good = { _id: good, code: goodName.code, name: goodName.name, baseUnit: goodName.baseUnit };
        await setState({
            ...state,
            lots: []
        })
        const { fromStock } = state;

        await props.getLotsByGood({ good, stock: fromStock });
    }

    const addQuantity = () => {
        window.$('#modal-add-quantity-return').modal('show');
    }

    const handleClickCreate = () => {
        const value = generateCode("BIGR");
        setState({
            ...state,
            code: value
        });
    }

    const getApprover = () => {
        const { user, translate } = props;
        let ApproverArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_approver') }];

        user.list.map(item => {
            ApproverArr.push({
                value: item._id,
                text: item.name
            })
        })

        return ApproverArr;
    }

    const getCustomer = () => {
        const { crm, translate } = props;
        let CustomerArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_customer') }];

        crm.customers.list.map(item => {
            CustomerArr.push({
                value: item._id,
                text: item.name
            })
        })

        return CustomerArr;
    }

    const getStock = () => {
        const { stocks, translate } = props;
        let stockArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_stock') }];

        stocks.listStocks.map(item => {
            stockArr.push({
                value: item._id,
                text: item.name
            })
        })

        return stockArr;
    }

    const getType = () => {
        const { group, translate } = props;
        let typeArr = [
            { value: '0', text: translate('manage_warehouse.bill_management.choose_type') },
            { value: '7', text: translate('manage_warehouse.bill_management.billType.7') },
        ];
        return typeArr;
    }

    const handleTypeChange = (value) => {
        let type = value[0];
        validateType(type, true);
    }

    const validateType = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_type')
        }
        if (willUpdateState) {
            setState({
                ...state,
                type: value,
                errorType: msg,
            })
        }
        return msg === undefined;
    }

    const handleStockChange = async (value) => {
        let fromStock = value[0];
        await validateStock(fromStock, true);

        let group = '2';
        let status = '2';
        if (fromStock) {
            await props.getBillsByStatus({ group, status, fromStock });
        } else {
            await props.getBillsByStatus({ group, status, fromStock: null });
        }

    }

    const validateStock = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_stock')
        }
        if (willUpdateState) {
            setState({
                ...state,
                fromStock: value,
                errorStock: msg,
                bill: '',
                getGoodInfo: false
            })
        }

        return msg === undefined;
    }

    const handleApproverChange = (value) => {
        let approver = value;
        validateApprover(approver, true);
    }

    const validateApprover = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
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
            setState({
                ...state,
                approver: value,
                approvers: approvers,
                errorApprover: msg,
            })
        }
        return msg === undefined;
    }

    const handleAccountablesChange = (value) => {
        let accountables = value;
        validateAccountables(accountables, true);
    }

    const validateAccountables = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            setState({
                ...state,
                accountables: value,
                errorAccountables: msg,
            })
        }
        return msg === undefined;
    }

    const handleResponsiblesChange = (value) => {
        let responsibles = value;
        validateResponsibles(responsibles, true);
    }

    const validateResponsibles = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            setState({
                ...state,
                responsibles: value,
                errorResponsibles: msg,
            })
        }
        return msg === undefined;
    }

    const handleQualityControlStaffsChange = (value) => {
        let qualityControlStaffs = value;
        validateQualityControlStaffs(qualityControlStaffs, true);
    }

    const validateQualityControlStaffs = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
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
            setState({
                ...state,
                qualityControlStaffs: value,
                listQualityControlStaffs: listQualityControlStaffs,
                errorQualityControlStaffs: msg,
            })
        }
        return msg === undefined;
    }

    const handlePartnerChange = (value) => {
        let partner = value[0];
        validatePartner(partner, true);
    }

    const validatePartner = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_customer')
        }
        if (willUpdateState) {
            setState({
                ...state,
                customer: value,
                errorCustomer: msg,
            })
        }
        return msg === undefined;
    }

    const handleSupplierChange = (value) => {
        let supplier = value[0];
        validateSupplier(supplier, true);
    }

    const validateSupplier = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_customer')
        }
        if (willUpdateState) {
            setState({
                ...state,
                supplier: value,
                errorSuppler: msg,
            })
        }
        return msg === undefined;
    }

    const handleDescriptionChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            description: value,
        })
    }

    const handleNameChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            name: value,
        })
    }

    const handlePhoneChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            phone: value,
        })
    }

    const handleEmailChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            email: value,
        })
    }

    const handleAddressChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            address: value,
        })
    }

    const handleStatusChange = (value) => {
        setState({
            ...state,
            status: value[0]
        })
    }

    const isFormValidated = () => {
        let result =
            validateType(state.type, false) &&
            validateStock(state.fromStock, false) &&
            validateApprover(state.approver, false) &&
            validateAccountables(state.accountables, false) &&
            validateQualityControlStaffs(state.qualityControlStaffs, false) &&
            validateResponsibles(state.responsibles, false)
        return result;
    }

    const handleLotsChange = (data) => {
        let totalQuantity = data.length > 0 ? data.reduce(function (accumulator, currentValue) {
            return Number(accumulator) + Number(currentValue.returnQuantity);
        }, 0) : 0;
        state.good.returnQuantity = totalQuantity;
        state.good.lots = data;
        setState({
            ...state,
            lots: data,
            returnQuantity: totalQuantity
        })
    }

    const handleQuantityChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            returnQuantity: value
        })
    }

    const handleSaveEditGood = async (e) => {
        e.preventDefault();
        const { indexInfo, listGood } = state;
        let newListGood;
        if (listGood) {
            newListGood = listGood.map((item, index) => {
                return (index === indexInfo) ? state.good : item;
            })
        }
        await setState({
            ...state,
            editInfo: false,
            listGood: newListGood,
            lots: [],
            good: Object.assign({}, EMPTY_GOOD)
        })
    }

    const handleCancelEditGood = (e) => {
        e.preventDefault();
        setState({
            ...state,
            editInfo: false,
            good: Object.assign({}, EMPTY_GOOD),
            lots: []
        })
    }

    const handleEditGood = async (good, index) => {
        let lots = good.lots ? good.lots : [];
        setState({
            ...state,
            editInfo: true,
            indexInfo: index,
            good: Object.assign({}, good),
            lots: lots
        })

        const { fromStock } = state;

        await props.getLotsByGood({ good: good.good._id, stock: fromStock });
    }

    const handleDeleteGood = async (index) => {
        let { listGood } = state;
        let newListGood;
        if (listGood) {
            newListGood = listGood.filter((item, x) => index !== x);
        }
        await setState({
            ...state,
            listGood: newListGood
        })
    }

    const handleGoodDescriptionChange = (e) => {
        let value = e.target.value;
        state.good.description = value;
        setState({
            ...state,
        })
    }

    const handleBillChange = async (value) => {
        let bill = value[0];
        state.listGood = [];
        if (bill) {
            await setState({
                ...state,
                bill: bill,
                getGoodInfo: true
            })
            await props.getDetailBill(bill);
        } else {
            setState({
                ...state,
                bill: bill,
                getGoodInfo: false
            })
        }

    }

    const isGoodsValidated = () => {
        if (state.good.good && state.good.quantity && state.good.quantity !== 0) {
            return true;
        }
        return false;
    }

    useEffect(() => {
        state.listGood = props.bills.billDetail.goods;
        state.billDetail = props.bills.billDetail;
    }, [props.bills.billDetail])

    const save = async () => {
        const { fromStock, code, toStock, type, status, users, approvers, supplier,
            name, phone, email, address, description, listGood, bill, listQualityControlStaffs, responsibles, accountables } = state;
        const { group, bills } = props;
        if (bills.billDetail) {
            var customer = bills.billDetail.customer;
        }
        await props.createBill({
            fromStock: fromStock,
            bill: bill,
            code: code,
            type: type,
            group: group,
            status: status,
            users: users,
            approvers: approvers,
            qualityControlStaffs: listQualityControlStaffs,
            responsibles: responsibles,
            accountables: accountables,
            customer: customer,
            supplier: supplier,
            name: name,
            phone: phone,
            email: email,
            address: address,
            description: description,
            goods: listGood
        })
    }

    const { translate, group, bills } = props;
    const { lots, listGood, good, code, approver, accountables, responsibles, qualityControlStaffs, status, fromStock, type, name, phone, email, address,
        errorStock, errorType, errorApprover, errorCustomer, errorSupplier, bill, errorQualityControlStaffs, errorAccountables, errorResponsibles } = state;
    const dataApprover = getApprover();
    const dataStock = getStock();
    const dataType = getType();
    const dataBill = getBillByStatus();

    return (
        <React.Fragment>
            <ButtonModal onButtonCallBack={handleClickCreate} modalID={`modal-create-bill-return`} button_name={translate('manage_warehouse.good_management.add')} title={translate('manage_warehouse.good_management.add_title')} />

            <DialogModal
                modalID={`modal-create-bill-return`}
                formID={`form-create-bill-return`}
                title={translate(`manage_warehouse.bill_management.add_title.${group}`)}
                msg_success={translate('manage_warehouse.bill_management.add_success')}
                msg_failure={translate('manage_warehouse.bill_management.add_faile')}
                disableSubmit={!isFormValidated()}
                func={save}
                size={75}
            >
                <QuantityLotGoodReturn group={group} good={good} stock={fromStock} initialData={lots} onDataChange={handleLotsChange} />
                <form id={`form-create-bill-return`}>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_warehouse.bill_management.infor')}</legend>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.code')}</label>
                                    <input type="text" className="form-control" value={code} disabled />
                                </div>
                                <div className={`form-group ${!errorType ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.type')}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-type-return-create`}
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
                                            id={`select-status-return-create`}
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
                                            onChange={handleStatusChange}
                                            multiple={false}
                                            disabled={true}
                                        />
                                    </div> */}
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.stock')}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-stock-bill-return-create`}
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
                                    <label>{translate('manage_warehouse.bill_management.bill_issued')}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-customer-return-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={bill}
                                        items={dataBill}
                                        onChange={handleBillChange}
                                        multiple={false}
                                    />
                                    <ErrorLabel content={errorCustomer} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bill_management.description')}</label>
                                    <textarea type="text" className="form-control" onChange={handleDescriptionChange} />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_warehouse.bill_management.list_saffs')}</legend>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.approved')}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-approver-bill-return-create`}
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
                                    <label>{translate('manage_warehouse.bill_management.users')}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-accountables-bill-return-create`}
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
                                    <label>{translate('manage_warehouse.bill_management.qualityControlStaffs')}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-qualityControlStaffs-bill-return-create`}
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
                                    <label>{translate('manage_warehouse.bill_management.accountables')}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-responsibles-bill-return-create`}
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
                            <legend className="scheduler-border">{translate('manage_warehouse.bill_management.receiver')}</legend>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.name')}<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" onChange={handleNameChange} />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.phone')}<span className="text-red"> * </span></label>
                                    <input type="number" className="form-control" onChange={handlePhoneChange} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.email')}<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" onChange={handleEmailChange} />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.address')}<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" onChange={handleAddressChange} />
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    {state.getGoodInfo &&
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.goods')}</legend>
                                <div>
                                    {state.editInfo &&
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
                                                    <div style={{ display: "flex" }}>
                                                        <input className="form-control" value={good.returnQuantity ? good.returnQuantity : 0} onChange={handleQuantityChange} type="number" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                <div className="form-group">
                                                    <label>{translate('manage_warehouse.bill_management.description')}</label>
                                                    <textarea type="text" className="form-control" value={good.description} onChange={handleGoodDescriptionChange} />
                                                </div>
                                            </div>
                                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                            <button className="btn btn-info" style={{ marginLeft: "10px" }} onClick={() => addQuantity()}>{translate('manage_warehouse.inventory_management.select_lot')}</button>
                                                {state.editInfo &&
                                                    <React.Fragment>
                                                        <button className="btn btn-success" onClick={handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                                        <button className="btn btn-success" disabled={!isGoodsValidated()} onClick={handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
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
                                                <th title={translate('manage_warehouse.bill_management.lot_with_unit')}>{translate('manage_warehouse.bill_management.lot_with_unit')}</th>
                                                <th title={translate('manage_warehouse.bill_management.description')}>{translate('manage_warehouse.bill_management.description')}</th>
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
                                                            <td>{x.lots.map((lot, index) => 
                                                                <div key={index}>
                                                                    <p>{lot.lot.code}/{lot.quantity} {x.good.baseUnit}</p>
                                                                </div>)}
                                                            </td> 
                                                            <td>{x.description}</td>
                                                            <td>
                                                                <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditGood(x, index)}><i className="material-icons"></i></a>
                                                                <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteGood(index)}><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                    )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </fieldset>
                        </div>
                    }
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getLotsByGood: LotActions.getLotsByGood,
    getBillsByStatus: BillActions.getBillsByStatus,
    createBill: BillActions.createBill,
    getDetailBill: BillActions.getDetailBill,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodReturnCreateForm));
