import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../../common-components';
import QuantityLotStockRotateEdit from './quantityLotStockRotateEdit';
import { LotActions } from '../../../inventory-management/redux/actions';
import { BillActions } from '../../redux/actions';

function StockRotateEditForm(props) {
    const EMPTY_GOOD = {
        good: '',
        quantity: '',
        returnQuantity: '',
        damagedQuantity: 0,
        realQuantity: 0,
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
        customer: '',
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
        window.$('#modal-edit-quantity-rotate').modal('show');
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

    const getToStock = () => {
        const { stocks, translate } = props;
        let toStockArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_stock') }];

        stocks.listStocks.map(item => {
            if (item._id !== state.fromStock) {
                toStockArr.push({
                    value: item._id,
                    text: item.name
                })
            }
        })

        return toStockArr;
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
        let typeArr = [];
        typeArr = [
            { value: '0', text: translate('manage_warehouse.bill_management.choose_type') },
            { value: '14', text: translate('manage_warehouse.bill_management.billType.14') },
        ]
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

    const handleToStockChange = (value) => {
        let toStock = value[0];
        validateToStock(toStock, true);
    }

    const validateToStock = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_stock')
        }
        if (willUpdateState) {
            setState({
                ...state,
                toStock: value,
                errorToStock: msg,
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
            validateToStock(state.toStock, false) &&
            validateAccountables(state.accountables, false) &&
            validateQualityControlStaffs(state.qualityControlStaffs, false) &&
            validateResponsibles(state.responsibles, false)
        return result;
    }

    const handleLotsChange = (data) => {
        let totalQuantity = data.length > 0 ? data.reduce(function (accumulator, currentValue) {
            return Number(accumulator) + Number(currentValue.quantity);
        }, 0) : 0;
        state.good.quantity = totalQuantity;
        state.good.lots = data;
        setState({
            ...state,
            lots: data,
            quantity: totalQuantity
        })
    }

    const handleQuantityChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            quantity: value
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

    const getStatus = () => {
        const { translate } = props;
        const { oldStatus } = state;
        let statusArr = [];
        if (oldStatus === '1') {
            statusArr = [
                { value: '1', text: translate('manage_warehouse.bill_management.bill_status.1') },
                { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2') },
                { value: '7', text: translate('manage_warehouse.bill_management.bill_status.7') }
            ]
        }
        if (oldStatus === '5') {
            statusArr = [
                { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5') },
                { value: '7', text: translate('manage_warehouse.bill_management.bill_status.7') }
            ]
        }
        if (oldStatus === '2') {
            statusArr = [
                { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2') },
                { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3') },
                { value: '7', text: translate('manage_warehouse.bill_management.bill_status.7') },
            ]
        }
        if (oldStatus === '3') {
            statusArr = [
                { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5') },
                { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3') },
                { value: '7', text: translate('manage_warehouse.bill_management.bill_status.7') },
            ]
        }

        if (oldStatus === '7') {
            statusArr = [
                { value: '7', text: translate('manage_warehouse.bill_management.bill_status.7') }
            ]
        }

        return statusArr;
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
        state.good.returnQuantity = 0;
        state.good.lots = [];
        setState({
            ...state,
            billId: props.billId,
            code: props.code,
            fromStock: props.fromStock,
            toStock: props.toStock,
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
            customer: props.customer,
            name: props.name,
            phone: props.phone,
            email: props.email,
            address: props.address,
            listGood: props.listGood,
            oldGoods: props.listGood,
            editInfo: false,
            errorStock: undefined,
            errorType: undefined,
            errorApprover: undefined,
            errorToStock: undefined

        })
    }

    const save = async () => {

        const { billId, fromStock, code, toStock, type, status, oldStatus, users, approvers,
            name, phone, email, address, description, listGood, oldGoods, listQualityControlStaffs, responsibles, accountables } = state;
        const { group } = props;
        await props.editBill(billId, {
            fromStock: fromStock,
            toStock: toStock,
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
            name: name,
            phone: phone,
            email: email,
            address: address,
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
    const { billId, lots, listGood, good, code, approvers, approver, listQualityControlStaffs, accountables, responsibles,
        qualityControlStaffs, status, toStock, fromStock, type, name, phone, email, address, description,
        errorStock, errorType, errorApprover, errorToStock, quantity, errorQualityControlStaffs, errorAccountables, errorResponsibles } = state;
    const listGoods = getAllGoods();
    const dataApprover = getApprover();
    const dataToStock = getToStock();
    const dataStock = getStock();
    const dataType = getType();
    const dataStatus = getStatus();
    // const checkApproved = checkApproved(approvers, listQualityControlStaffs)
    const timelineTextArr = [
        { text: "Tạo phiếu" },
        { text: "Phê duyệt phiếu" },
        { text: "Thực hiện phiếu" },
        { text: "Kiểm định chất lượng" },
        { text: "Hoàn thành" },
    ]
    
    return (
        <React.Fragment>

            <DialogModal
                modalID={`modal-edit-bill-rotate`}
                formID={`form-edit-bill-rotate`}
                title={translate(`manage_warehouse.bill_management.edit_title.${group}`)}
                msg_success={translate('manage_warehouse.bill_management.add_success')}
                msg_failure={translate('manage_warehouse.bill_management.add_faile')}
                disableSubmit={!isFormValidated()}
                func={save}
                size={75}
            >
                <QuantityLotStockRotateEdit group={group} good={good} stock={fromStock} initialData={lots} onDataChange={handleLotsChange} />
                <form id={`form-edit-bill-rotate`}>
                    {status !== '7' && <div className="timeline-create">
                        <div className="timeline-progress" style={{ width: (parseInt(status - 1)) / 4 * 100 + "%" }}></div>
                        <div className="timeline-items">
                            {timelineTextArr.map((item, index) => (
                                <div className={`timeline-item ${index < parseInt(status) ? "active" : ""}`} key={index} >
                                    <div className={`timeline-contain`}>
                                        {item.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>}
                    {status === '7' && <div className="timeline-create" style={{ width: "0%" }}>
                        <div className="timeline-progress"></div>
                        <div className="timeline-items">
                            <div className={`timeline-item cancel`}>
                                <div className={`timeline-contain`}>
                                    {"Phiếu đã hủy"}
                                </div>
                            </div>
                        </div>
                    </div>}
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
                                        id={`select-type-rotate-edit-${billId}`}
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
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.status')}</label>
                                    <SelectBox
                                        id={`select-status-rotate-edit-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={status}
                                        // items={[
                                        //     { value: '1', text: translate('manage_warehouse.bill_management.bill_status.1') },
                                        //     { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2') },
                                        //     { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3') },
                                        //     { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4') },
                                        //     { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5') },
                                        // ]}
                                        items={dataStatus}
                                        onChange={handleStatusChange}
                                        multiple={false}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.stock')}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-stock-bill-rotate-edit-${billId}`}
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
                                <div className={`form-group ${!errorToStock ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.rotate_stock')}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-customer-rotate-edit-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={toStock}
                                        items={dataToStock}
                                        onChange={handleToStockChange}
                                        multiple={false}
                                    />
                                    <ErrorLabel content={errorToStock} />
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
                                        <label>{translate('manage_warehouse.bill_management.approved')}<span className="text-red"> * </span></label>
                                        <SelectBox
                                            id={`select-approver-bill-rotate-edit-${billId}`}
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
                                            id={`select-accountables-bill-rotate-edit-${billId}`}
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
                                            id={`select-qualityControlStaffs-bill-rotate-edit-${billId}`}
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
                                            id={`select-responsibles-bill-rotate-edit-${billId}`}
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
                            <legend className="scheduler-border">{translate('manage_warehouse.bill_management.receiver')}</legend>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.name')}</label>
                                    <input type="text" className="form-control" value={name ? name : ''} onChange={handleNameChange} />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.phone')}</label>
                                    <input type="number" className="form-control" value={phone ? phone : ''} onChange={handlePhoneChange} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.email')}</label>
                                    <input type="text" className="form-control" value={email ? email : ''} onChange={handleEmailChange} />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.address')}</label>
                                    <input type="text" className="form-control" value={address ? address : ''} onChange={handleAddressChange} />
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
                                        id={`select-good-rotate-edit-${billId}`}
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
                                    <label>{translate('manage_warehouse.bill_management.number')}</label>
                                    <div style={{ display: "flex" }}>
                                        <input className="form-control" value={good.quantity} onChange={handleQuantityChange} disabled type="number" />
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
                                {good.good && (<p type="button" className="btn btn-info" style={{ marginLeft: "10px" }} onClick={() => addQuantity()}>{translate('manage_warehouse.inventory_management.select_lot')}</p>)}
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
                                            <th title={translate('manage_warehouse.bill_management.lot_with_unit')}>{translate('manage_warehouse.bill_management.lot_with_unit')}</th>
                                            <th title={translate('manage_warehouse.bill_management.description')}>{translate('manage_warehouse.bill_management.description')}</th>
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
                                                        <td>{x.lots.map((lot, index) =>
                                                            <div key={index}>
                                                                {lot.lot.code && <p>{lot.lot.code}/{lot.quantity} {x.good.baseUnit}</p>}
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockRotateEditForm));
