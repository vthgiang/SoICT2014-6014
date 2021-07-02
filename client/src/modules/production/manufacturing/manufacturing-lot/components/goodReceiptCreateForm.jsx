import { isPropsValid } from '@fullcalendar/react';
import React, { Component, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-redux-multilingual/lib/utils';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { generateCode } from '../../../../../helpers/generateCode';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { BillActions } from '../../../warehouse/bill-management/redux/actions';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';

function GoodReceiptCreateFrom(props) {

    let EMPTY_BILL = {
        code: "",
        fromStock: "1",
        quantity: "",
        approvers: [],
        accountables: [],
        responsibles: [],
        name: "",
        email: "",
        phone: "",
        address: "",
        description: "",
        stockName: "",

    }
    const [state, setState] = useState({
        bill: Object.assign({}, EMPTY_BILL),
        listBills: []
    })

    useEffect(() => {
        if(props.lotId !== state.lotId){
            setState({
                ...state,
                lot: props.lot,
                lotId: props.lotId,
                bill: { ...state.bill, quantity: props.lot.originalQuantity, code: props.billCode },
                remainingQuantityOfLot: props.lot.originalQuantity,
                //listBills: []
            })
        }
    }, [props.lotId])
    

    const getListStocksArr = () => {
        const { stocks, translate } = props;
        let stockArr = [{ value: '1', text: translate('manage_warehouse.bill_management.choose_stock') }];

        if (stocks) {
            stocks.listStocks.map(item => {
                stockArr.push({
                    value: item._id,
                    text: item.name
                })
            })
        }


        return stockArr;

    }

    const handleQuantityChange = (e) => {
        const { value } = e.target;
        validateQuantityChange(value, true);
    }

    const validateQuantityChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        const { remainingQuantityOfLot } = state;
        if (value === "") {
            msg = translate('manage_warehouse.bill_management.quantity_error')
        }
        if (value < 1) {
            msg = translate('manage_warehouse.bill_management.quantity_error_input')
        }
        if (value > remainingQuantityOfLot) {
            msg = translate('manage_warehouse.bill_management.quantity_error_input_1')
        }
        if (willUpdateState) {
            setState((state) => ({
                ...state,
                bill: { ...state.bill, quantity: value },
                errorQuantity: msg
            }));
        }
    }

    const handleStockChange = (value) => {
        const stockId = value[0];
        validateStockChange(stockId, true);
    }

    const validateStockChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value === "1") {
            msg = translate('manage_warehouse.bill_management.choose_stock_error')
        }
        if (willUpdateState) {
            // Tìm tên stock by Id
            let stockName = "";
            if (value) {
                const { stocks } = props;
                stocks.listStocks.map((stock) => {
                    if (stock._id === value) {
                        stockName = stock.name
                    }
                });
            }

            setState((state) => ({
                ...state,
                bill: { ...state.bill, fromStock: value, stockName: stockName },
                errorStock: msg
            }));
        }
        return msg;
    }

    const getUsersArr = () => {
        const { user } = props;
        const { usercompanys } = user;
        let usersArr = [];
        if (usercompanys) {
            usercompanys.map(x => {
                usersArr.push({
                    value: x._id,
                    text: x.name + " - " + x.email
                });
            });
        }

        return usersArr;
    }

    const handleApproverChange = (value) => {
        if (value.length === 0) {
            value = undefined;
        }
        validateApproversChange(value, true);
    }

    const validateApproversChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value || !value.length) {
            msg = translate('manage_warehouse.bill_management.choose_approvers')
        }
        if (willUpdateState) {
            setState((state) => ({
                ...state,
                bill: { ...state.bill, approvers: value },
                errorApprovers: msg
            }));
        }
        return msg;
    }

    const handleAccountablesChange = (value) => {
        if (value.length === 0) {
            value = undefined;
        }
        validateAccountablesChange(value, true);
    }

    const validateAccountablesChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value || !value.length) {
            msg = translate('manage_warehouse.bill_management.choose_accountables')
        }
        if (willUpdateState) {
            setState((state) => ({
                ...state,
                bill: { ...state.bill, accountables: value },
                errorAccountables: msg
            }));
        }
        // console.log(validateResponsiblesChange(state.bill.responsibles, false))
        // console.log(validateNameChange(state.bill.name, false))
        return msg;
    }

    const handleResponsiblesChange = (value) => {
        if (value.length === 0) {
            value = undefined;
        }
        validateResponsiblesChange(value, true);
    }

    const validateResponsiblesChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value || !value.length) {
            msg = translate('manage_warehouse.bill_management.chooos_reponsibles')
        }
        if (willUpdateState) {
            setState((state) => ({
                ...state,
                bill: { ...state.bill, responsibles: value },
                errorResponsibles: msg
            }));
        }
        return msg;
    }

    const handleNameChange = (e) => {
        const { value } = e.target;
        validateNameChange(value, true);
    }

    const validateNameChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.error_name_receiver')
        }
        if (willUpdateState) {
            setState((state) => ({
                ...state,
                bill: { ...state.bill, name: value },
                errorName: msg
            }));
        }
        return msg;
    }

    const handlePhoneChange = (e) => {
        const { value } = e.target;
        validatePhoneChange(value, true);
    }

    const validatePhoneChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.error_phone_receiver')
        }
        if (value < 0) {
            msg = translate('manage_warehouse.bill_management.error_phone_receiver_input')
        }
        if (willUpdateState) {
            setState((state) => ({
                ...state,
                bill: { ...state.bill, phone: value },
                errorPhone: msg
            }));
        }
        return msg;
    }

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setState((state) => ({
            ...state,
            bill: { ...state.bill, email: value }
        }));
    }

    const handleAddressChange = (e) => {
        const { value } = e.target;
        setState((state) => ({
            ...state,
            bill: { ...state.bill, address: value }
        }));
    }

    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        setState((state) => ({
            ...state,
            bill: { ...state.bill, description: value }
        }));
    }

    const isValidateBill = () => {
        if (
            validateStockChange(state.bill.fromStock, false)
            || validateApproversChange(state.bill.approvers, false)
            || validateAccountablesChange(state.bill.accountables, false)
            || validateResponsiblesChange(state.bill.responsibles, false)
            || validateNameChange(state.bill.name, false)
            || validatePhoneChange(state.bill.phone, false)
            || validateQuantityChange(state.bill.quantity, false)
        ) {
            return false;
        }
        return true;
    }

    const handleClearBill = (e) => {
        e.preventDefault();
        EMPTY_BILL.code = generateCode("BILL");
        setState((state) => ({
            ...state,
            bill: Object.assign({}, EMPTY_BILL),
        }));
    }

    const handleAddBill = async (e) => {
        console.log("add bill")
        e.preventDefault();
        EMPTY_BILL.code = generateCode("BILL");
        await setState((state) => ({
            ...state,
            listBills: [...state.listBills, state.bill],
            bill: Object.assign({}, EMPTY_BILL),
        }));
        calculateQuantityOfLot();

    }


    const isFormValidated = () => {
        if (state.listBills.length && (state.remainingQuantityOfLot === 0)) {
            return true;
        }
        return false;
    }

    // Hàm tính số lượng còn lại của lô sau khi thêm phiếu vào state
    const calculateQuantityOfLot = () => {
        const { lot, listBills } = state;
        let remainingQuantityOfLot = 0;
        if (lot) {
            remainingQuantityOfLot = lot.originalQuantity;
        }
        let totalQuantityOfBills = 0;
        if (listBills.length) {
            listBills.map(bill => {
                totalQuantityOfBills += Number(bill.quantity)
            });
        }

        if (state.editBill) {
            totalQuantityOfBills -= Number(listBills[state.indexEditting].quantity)
        }

        remainingQuantityOfLot = remainingQuantityOfLot - totalQuantityOfBills;
        console.log(state)
        setState(state =>{
            return{
                ...state,
                remainingQuantityOfLot: remainingQuantityOfLot
            }
        });
    }

    const handleEditBill = async (bill, index) => {
        await setState((state) => ({
            ...state,
            editBill: true,
            bill: { ...bill },
            indexEditting: index
        }));
        calculateQuantityOfLot();
    }

    const handleCancelEditBill = async (e) => {
        e.preventDefault();
        await setState((state) => ({
            ...state,
            editBill: false,
            bill: Object.assign({}, EMPTY_BILL)
        }));
        calculateQuantityOfLot();
    }

    const handleSaveEditBill = async (e) => {
        e.preventDefault();
        const { listBills, indexEditting } = state;
        listBills[indexEditting] = state.bill;
        await setState((state) => ({
            ...state,
            listBills: [...listBills],
            editBill: false,
            bill: Object.assign({}, EMPTY_BILL)
        }));
        calculateQuantityOfLot();
    }

    const handleDeleteBill = async (bill, index) => {
        let { listBills } = state;
        listBills.splice(index, 1);
        await setState((state) => ({
            ...state,
            editBill: false,
            bill: Object.assign({}, EMPTY_BILL),
            listBills: [...listBills]
        }));
        calculateQuantityOfLot();
    }

    const save = () => {
        if (isFormValidated()) {
            const { listBills, lot } = state;
            const data = listBills.map(bill => {
                return {
                    fromStock: bill.fromStock,
                    group: "1",
                    code: bill.code,
                    type: "2",
                    status: "1",
                    creator: localStorage.getItem("userId"),
                    approvers: bill.approvers.map(approver => {
                        return {
                            approver: approver,
                            approvedTime: null
                        }
                    }),
                    responsibles: bill.responsibles,
                    accountables: bill.accountables,
                    receiver: {
                        name: bill.name,
                        phone: bill.phone,
                        email: bill.email ? bill.email : "",
                        address: bill.address ? bill.address : "",
                    },
                    description: bill.description,
                    goods: [{
                        good: lot.good._id,
                        quantity: bill.quantity,
                        lots: [{
                            lot: lot._id,
                            quantity: bill.quantity
                        }]
                    }],
                    manufacturingMill: lot.manufacturingCommand.manufacturingMill,
                    manufacturingCommand: lot.manufacturingCommand._id
                }
            });
            props.createManyProductBills(data);
            props.handleEditManufacturingLot(lot._id, { status: 2 })
        }
    }

    const { bills, translate } = props;
    const { lot, bill, errorStock, errorQuantity, errorApprovers, errorResponsibles, errorAccountables, errorName, errorPhone, listBills, remainingQuantityOfLot } = state;

    console.log(state)
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-create-bill-issue-product`} isLoading={bills.isLoading}
                formID={`form-create-bill-issue-product`}
                title={translate(`manage_warehouse.bill_management.add_product_bill`)}
                msg_success={translate('manage_warehouse.bill_management.create_product_bill_successfully')}
                msg_faile={translate('manage_warehouse.bill_management.create_product_bill_failed')}
                disableSubmit={!isFormValidated()}
                func={save}
                size={75}
            >
                <form id={`form-create-bill-issue-product`}>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_warehouse.bill_management.lot_information')}</legend>
                            <div className={`form-group`}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>{translate('manage_warehouse.bill_management.good_code')}</th>
                                            <th>{translate('manage_warehouse.bill_management.good_name')}</th>
                                            <th>{translate('manage_warehouse.bill_management.base_unit')}</th>
                                            <th>{translate('manage_warehouse.bill_management.number')}</th>
                                            <th>{translate('manage_warehouse.bill_management.quantity_billed')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{lot && lot.good && lot.good.code}</td>
                                            <td>{lot && lot.good && lot.good.name}</td>
                                            <td>{lot && lot.good && lot.good.baseUnit}</td>
                                            <td>{lot && lot.originalQuantity}</td>
                                            <td>{remainingQuantityOfLot}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_warehouse.bill_management.bill_info')}</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.code')}</label>
                                        <input type="text" className="form-control" value={bill.code} disabled />
                                    </div>
                                    <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.number')} ({lot && lot.good.baseUnit})<span className="attention"> * </span></label>
                                        <input type="number" className="form-control" value={bill.quantity} onChange={handleQuantityChange} />
                                        <ErrorLabel content={errorQuantity} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.stock')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-stock-issue-product-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={bill.fromStock}
                                            items={getListStocksArr()}
                                            onChange={handleStockChange}
                                            multiple={false}
                                        />
                                        <ErrorLabel content={errorStock} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorApprovers ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.approved')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-approver-bill-issue-product-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={bill.approvers}
                                            items={getUsersArr()}
                                            onChange={handleApproverChange}
                                            multiple={true}
                                        />
                                        <ErrorLabel content={errorApprovers} />
                                    </div>
                                    <div className={`form-group ${!errorResponsibles ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.users')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-accountables-bill-issue-product-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={bill.responsibles}
                                            items={getUsersArr()}
                                            onChange={handleResponsiblesChange}
                                            multiple={true}
                                        />
                                        <ErrorLabel content={errorResponsibles} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorAccountables ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.accountables')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-responsibles-bill-issue-product-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={bill.accountables}
                                            items={getUsersArr()}
                                            onChange={handleAccountablesChange}
                                            multiple={true}
                                        />
                                        <ErrorLabel content={errorAccountables} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.name_receiver')}<span className="attention"> * </span></label>
                                        <input type="text" value={bill.name} className="form-control" onChange={handleNameChange} />
                                        <ErrorLabel content={errorName} />
                                    </div>
                                    <div className={`form-group ${!errorPhone ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.phone_receiver')}<span className="attention"> * </span></label>
                                        <input type="number" value={bill.phone} className="form-control" onChange={handlePhoneChange} />
                                        <ErrorLabel content={errorPhone} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.email_receiver')}</label>
                                        <input type="text" className="form-control" value={bill.email} onChange={handleEmailChange} />
                                    </div>
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.address_receiver')}</label>
                                        <input type="text" className="form-control" value={bill.address} onChange={handleAddressChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>{translate('manage_warehouse.bill_management.description')}</label>
                                        <textarea type="text" className="form-control" value={bill.description} onChange={handleDescriptionChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                {state.editBill ?
                                    <React.Fragment>
                                        <button className="btn btn-success" onClick={handleCancelEditBill} style={{ marginLeft: "10px" }}>{translate('manufacturing.purchasing_request.cancel_editing_good')}</button>
                                        <button className="btn btn-success" disabled={!isValidateBill()} onClick={handleSaveEditBill} style={{ marginLeft: "10px" }}>{translate('manufacturing.purchasing_request.save_good')}</button>
                                    </React.Fragment> :
                                    <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!isValidateBill()} onClick={handleAddBill}>{translate('manufacturing.purchasing_request.add_good')}</button>
                                }
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearBill}>{translate('manufacturing.purchasing_request.delete_good')}</button>
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>{translate('manage_warehouse.bill_management.index')}</th>
                                        <th>{translate('manage_warehouse.bill_management.code')}</th>
                                        <th>{translate('manage_warehouse.bill_management.good_code')}</th>
                                        <th>{translate('manage_warehouse.bill_management.good_name')}</th>
                                        <th>{translate('manage_warehouse.bill_management.base_unit')}</th>
                                        <th>{translate('manage_warehouse.bill_management.number')}</th>
                                        <th>{translate('manage_warehouse.bill_management.receipt_stock')}</th>
                                        <th>{translate('table.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listBills &&
                                            listBills.length == 0 ?
                                            <tr><td colSpan={8}>{translate('general.no_data')}</td></tr>
                                            :
                                            listBills.map((bill, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{bill.code}</td>
                                                    <td>{lot && lot.good && lot.good.code}</td>
                                                    <td>{lot && lot.good && lot.good.name}</td>
                                                    <td>{lot && lot.good && lot.good.baseUnit}</td>
                                                    <td>{bill.quantity}</td>
                                                    <td>{bill.stockName}</td>
                                                    <td>
                                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditBill(bill, index)}><i className="material-icons"></i></a>
                                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteBill(bill, index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        {
                            !isFormValidated() &&
                            <div className="pull-left form-group has-error" style={{ marginBottom: "10px" }}>
                                <label>{translate('manage_warehouse.bill_management.choose_all_lot')}<span className="attention"> * </span></label>
                            </div>
                        }
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );

}

function mapStateToProps(state) {
    const { bills, stocks, user } = state;
    return { bills, stocks, user }
}

const mapDispatchToProps = {
    createManyProductBills: BillActions.createManyProductBills,
    handleEditManufacturingLot: LotActions.handleEditManufacturingLot
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodReceiptCreateFrom));