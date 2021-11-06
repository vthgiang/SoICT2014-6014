import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../../common-components';
import QuantityLotStockTakeEdit from './quantityLotStockTakeEdit';
import { LotActions } from '../../../inventory-management/redux/actions';
import { BillActions } from '../../redux/actions';

function StockTakeEditForm(props) {
    const EMPTY_GOOD = {
        good: '',
        quantity: '',
        realQuantity: '',
        description: '',
        lots: []
    }

    const [state, setState] = useState({
        userId: localStorage.getItem("userId"),
        list: [],
        lots: [],
        listGood: [],
        good: Object.assign({}, EMPTY_GOOD),
        editInfo: false,
        users: [],
        status: '1',
        fromStock: ''
    })

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
        window.$('#modal-edit-quantity-take').modal('show');
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
        const { translate } = props;
        let typeArr = [];
        typeArr = [
            { value: '0', text: translate('manage_warehouse.bill_management.choose_type') },
            { value: '5', text: translate('manage_warehouse.bill_management.billType.5') },
            { value: '6', text: translate('manage_warehouse.bill_management.billType.6') },
        ]
        return typeArr;
    }

    const getStatus = () => {
        const { translate } = props;
        const { oldStatus } = state;
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

    const handleStockChange = (value) => {
        let fromStock = value[0];
        validateStock(fromStock, true);
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

    // const handlePartnerChange = (value) => {
    //     let partner = value[0];
    //     validatePartner(partner, true);
    // }

    const handleUsersChange = (value) => {
        let users = value;
        validateUsers(users, true);
    }

    const validateUsers = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            setState({
                ...state,
                users: value,
                errorUsers: msg,
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
            return Number(accumulator) + Number(currentValue.realQuantity);
        }, 0) : 0;
        state.good.realQuantity = totalQuantity;
        state.good.damagedQuantity = Number(state.good.realQuantity) - Number(state.good.quantity);
        state.good.lots = data;
        setState({
            ...state,
            lots: data,
            realQuantity: totalQuantity
        })
    }

    const handleQuantityChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            realQuantity: value
        })
    }

    const handleAddGood = async (e) => {
        e.preventDefault();
        let listGood = [...(state.listGood), state.good];
        await setState({
            ...state,
            listGood: listGood,
            lots: [],
            good: Object.assign({}, EMPTY_GOOD)
        })
    }

    const handleClearGood = (e) => {
        e.preventDefault();
        setState({
            ...state,
            good: Object.assign({}, EMPTY_GOOD),
            lots: []
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

    const isGoodsValidated = () => {
        if (state.good.good && state.good.quantity && state.good.quantity !== 0) {
            return true;
        }
        return false;
    }

    if (props.billId !== state.billId || props.oldStatus !== state.oldStatus) {
        let approver = [];
        let qualityControlStaffs = [];
        let responsibles = [];
        let accountables = [];
        if (props.approvers && props.approvers.length > 0) {
            for (let i = 0; i < props.approvers.length; i++) {
                approver = [...approver, props.approvers[i].approver._id];
            }

        }

        if (props.listQualityControlStaffs && props.listQualityControlStaffs.length > 0) {
            for (let i = 0; i < props.listQualityControlStaffs.length; i++) {
                qualityControlStaffs = [...qualityControlStaffs, props.listQualityControlStaffs[i].staff._id];
            }

        }

        if (props.responsibles && props.responsibles.length > 0) {
            for (let i = 0; i < props.responsibles.length; i++) {
                responsibles = [...responsibles, props.responsibles[i]._id];
            }

        }

        if (props.accountables && props.accountables.length > 0) {
            for (let i = 0; i < props.accountables.length; i++) {
                accountables = [...accountables, props.accountables[i]._id];
            }

        }
        state.good.quantity = 0;
        state.good.good = '';
        state.good.description = '';
        state.good.realQuantity = 0;
        state.good.lots = [];
        setState ({
            ...state,
            billId: props.billId,
            code: props.code,
            fromStock: props.fromStock,
            status: props.status,
            oldStatus: props.oldStatus,
            group: props.group,
            type: props.type,
            users: props.users,
            creator: props.creator,
            approvers: props.approvers,
            approver: approver,
            qualityControlStaffs: qualityControlStaffs,
            listQualityControlStaffs: props.listQualityControlStaffs,
            responsibles: responsibles,
            accountables: accountables,
            description: props.description,
            listGood: props.listGood,
            oldGoods: props.listGood,
            editInfo: false,
            errorStock: undefined,
            errorType: undefined,
            errorApprover: undefined,
            errorCustomer: undefined,
            errorUsers: undefined

        })
    }

    const save = async () => {
        const { billId, fromStock, code, type, status, oldStatus, approvers,
            users, description, listGood, oldGoods, listQualityControlStaffs, responsibles, accountables } = state;
        const { group } = props;
        await props.editBill(billId, {
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
            description: description,
            goods: listGood,
            oldGoods: oldGoods
        })
    }

    const checkApproved = (approvers, listQualityControlStaffs) => {
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

    const { translate, group } = props;
    const { billId, lots, listGood, good, code, approvers, approver, listQualityControlStaffs, accountables, responsibles, qualityControlStaffs, status, users, fromStock, type,
        description, errorStock, errorType, errorApprover, errorUsers, quantity, errorQualityControlStaffs, errorAccountables, errorResponsibles } = state;
    const listGoods = getAllGoods();
    const dataApprover = getApprover();
    const dataStock = getStock();
    const dataType = getType();
    const dataStatus = getStatus();
    // const checkApproved = checkApproved(approvers, listQualityControlStaffs)

    return (
        <React.Fragment>

            <DialogModal
                modalID={`modal-edit-bill-take`}
                formID={`form-edit-bill-take`}
                title={translate(`manage_warehouse.bill_management.edit_title.${group}`)}
                msg_success={translate('manage_warehouse.bill_management.add_success')}
                msg_failure={translate('manage_warehouse.bill_management.add_faile')}
                disableSubmit={!isFormValidated()}
                func={save}
                size={75}
            >
                <QuantityLotStockTakeEdit group={group} good={good} stock={fromStock} initialData={lots} onDataChange={handleLotsChange} />
                <form id={`form-edit-bill-take`}>
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
                                        id={`select-type-take-edit-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={type}
                                        items={dataType}
                                        onChange={handleTypeChange}
                                        multiple={false}
                                        disabled={true}
                                    />
                                    <ErrorLabel content={errorType} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.stock')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-stock-bill-take-edit-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={fromStock}
                                        items={dataStock}
                                        onChange={handleStockChange}
                                        multiple={false}
                                        disabled={true}
                                    />
                                    <ErrorLabel content={errorStock} />
                                </div>

                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.status')}</label>
                                    <SelectBox
                                        id={`select-status-take-edit-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={status}
                                        items={dataStatus}
                                        onChange={handleStatusChange}
                                        multiple={false}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bill_management.description')}</label>
                                    <textarea type="text" className="form-control" value={description} onChange={handleDescriptionChange} />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {state.userId === state.creator &&
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.list_saffs')}</legend>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.approved')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-approver-bill-take-edit-${billId}`}
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
                                        <label>{translate('manage_warehouse.bill_management.users')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-accountables-bill-take-edit-${billId}`}
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
                                        <label>{translate('manage_warehouse.bill_management.qualityControlStaffs')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-qualityControlStaffs-bill-take-edit-${billId}`}
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
                                        <label>{translate('manage_warehouse.bill_management.accountables')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-responsibles-bill-take-edit-${billId}`}
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
                    }
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_warehouse.bill_management.goods')}</legend>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bill_management.choose_good')}</label>
                                    <SelectBox
                                        id={`select-good-take-edit-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={good.good ? good.good._id : '1'}
                                        items={listGoods}
                                        onChange={handleGoodChange}
                                        multiple={false}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bill_management.real_quantity')}</label>
                                    <div style={{ display: "flex" }}><input className="form-control" value={good.realQuantity} onChange={handleQuantityChange} type="number" />{status === '2' && good.good && <i className="fa fa-plus-square" style={{ color: "#28A745", marginLeft: '5px', marginTop: '9px', cursor: 'pointer' }} onClick={() => addQuantity()}></i>}</div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bill_management.note')}</label>
                                    <textarea type="text" className="form-control" value={good.description} onChange={handleGoodDescriptionChange} />
                                </div>
                            </div>
                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                {state.editInfo ?
                                    <React.Fragment>
                                        <button className="btn btn-success" onClick={handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                        <button className="btn btn-success" disabled={!isGoodsValidated()} onClick={handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                    </React.Fragment> :
                                    <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!isGoodsValidated()} onClick={handleAddGood}>{translate('task_template.add')}</button>
                                }
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearGood}>{translate('task_template.delete')}</button>
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
                                            <th title={translate('manage_warehouse.bill_management.real_quantity')}>{translate('manage_warehouse.bill_management.real_quantity')}</th>
                                            <th title={translate('manage_warehouse.bill_management.difference')}>{translate('manage_warehouse.bill_management.difference')}</th>
                                            <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                            <th>{translate('task_template.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody id={`good-bill-create`}>
                                        {
                                            (typeof listGood === 'undefined' || listGood.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                listGood.map((x, index) =>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.good.code}</td>
                                                        <td>{x.good.name}</td>
                                                        <td>{x.good.baseUnit}</td>
                                                        <td>{x.quantity}</td>
                                                        <td>{x.realQuantity}</td>
                                                        <td>{x.damagedQuantity ? x.damagedQuantity : 0}</td>
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
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getLotsByGood: LotActions.getLotsByGood,
    editBill: BillActions.editBill
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockTakeEditForm));
