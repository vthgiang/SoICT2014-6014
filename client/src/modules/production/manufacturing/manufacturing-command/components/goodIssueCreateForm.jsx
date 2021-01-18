import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { generateCode } from '../../../../../helpers/generateCode';
import { BillActions } from '../../../warehouse/bill-management/redux/actions';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';
import { commandActions } from '../redux/actions';

class goodIssueCreateForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_BILL = {
            code: "",
            fromStock: "1",
            approvers: [],
            accountables: [],
            responsibles: [],
            qualityControlStaffs: [],
            name: "",
            email: "",
            phone: "",
            address: "",
            description: "",
            stockName: "",
            // added
            goods: [],

        }
        // added
        this.EMPTY_GOOD = {
            goodId: '1',
            goodObject: '',
            quantity: '',
            description: '',
            inventory: ''
        }
        this.state = {
            bill: Object.assign({}, this.EMPTY_BILL),
            listBills: [],
            //added
            good: Object.assign({}, this.EMPTY_GOOD),
            listRemainingGoods: [],
        }
    }

    findIndexInArray = (array, id) => {
        let result = -1;
        array.map((x, index) => {
            if (x.good._id === id) {
                result = index;
            }
        });
        return result;
    }
    // Hàm này sẽ sinh ra listRemainingGoods và tính số lượng trong listRemainingGoods cho hợp lý 
    getRemainingQuantityOfGood = () => {
        // Tính số lượng trong command
        const listRemainingGoods = [];
        const { commandIssue } = this.state;
        const { materials } = commandIssue.good;
        const { listBills } = this.state;
        if (listBills.length) { // lấy trong materials trừ đi trong listBills là ra
            let listGoodCopy = [];
            materials.map(x => {
                let material = Object.assign({},
                    {
                        good: x.good,
                        remainingQuantity: x.quantity * commandIssue.quantity
                    }
                )
                listGoodCopy.push(material);
            });
            listBills.map(bill => {
                bill.goods.map(x => {
                    listGoodCopy[this.findIndexInArray(listGoodCopy, x.goodId)].remainingQuantity -= x.quantity;
                });
            });
            if (this.state.editBill) {
                const bill = listBills[this.state.indexEdittingBill];
                bill.goods.map(x => {
                    listGoodCopy[this.findIndexInArray(listGoodCopy, x.goodId)].remainingQuantity += x.quantity;
                });
            }
            listGoodCopy.map(x => {
                listRemainingGoods.push({
                    good: x.good,
                    remainingQuantity: x.remainingQuantity
                });
            });
        } else { //  Nếu đơn rỗng
            materials.map(x => {
                listRemainingGoods.push({
                    good: x.good,
                    remainingQuantity: x.quantity * commandIssue.quantity
                });
            });
        }
        return listRemainingGoods;
    }

    calculateRemainingQuantityGood = () => {
        const listRemainingGoods = this.getRemainingQuantityOfGood();
        this.setState((state) => ({
            ...state,
            listRemainingGoods: [...listRemainingGoods]
        }))
    }

    // Hàm lấy ra số lượng còn lại chưa lên lệnh từ listRemaninggoods
    getRemainingQuantityFromGoodId = (id) => {
        let result = "";
        const { listRemainingGoods } = this.state;
        listRemainingGoods.map(x => {
            if (x.good._id === id) {
                result = x.remainingQuantity
            }
        });
        return result;
    }


    static getDerivedStateFromProps = (props, state) => {
        if (props.commandIssueId !== state.commandIssueId) {
            if (state.listRemainingGoods.length === 0) { // Nếu chưa lên đơn nào thì tính toán listRemainingGoods
                let listRemainingGoods = [];
                props.commandIssue.good.materials.map(x => {
                    listRemainingGoods.push({
                        good: x.good,
                        remainingQuantity: (x.quantity * props.commandIssue.quantity)
                    });
                });
                state.listRemainingGoods = [...listRemainingGoods]
            }
            return {
                ...state,
                listRemainingGoods: [...state.listRemainingGoods],
                commandIssueId: props.commandIssueId,
                commandIssue: props.commandIssue,
                bill: { ...state.bill, code: props.billCode }
            }
        }
        return null;
    }

    getListStocksArr = () => {
        const { stocks, translate } = this.props;
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

    handleStockChange = (value) => {
        const stockId = value[0];
        this.validateStockChange(stockId, true);
    }

    validateStockChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "1") {
            msg = translate('manage_warehouse.bill_management.choose_stock_error')
        }
        if (willUpdateState) {
            // Tìm tên stock by Id
            let stockName = "";
            if (value) {
                const { stocks } = this.props;
                stocks.listStocks.map((stock) => {
                    if (stock._id === value) {
                        stockName = stock.name
                    }
                });
            }

            this.setState((state) => ({
                ...state,
                good: Object.assign({}, this.EMPTY_GOOD),
                bill: { ...state.bill, fromStock: value, stockName: stockName, goods: [] },
                errorStock: msg
            }));
        }
        return msg;
    }

    getUsersArr = () => {
        const { user } = this.props;
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

    handleApproverChange = (value) => {
        if (value.length === 0) {
            value = undefined;
        }
        this.validateApproversChange(value, true);
    }

    validateApproversChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value || !value.length) {
            msg = translate('manage_warehouse.bill_management.choose_approvers')
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                bill: { ...state.bill, approvers: value },
                errorApprovers: msg
            }));
        }
        return msg;
    }

    handleAccountablesChange = (value) => {
        if (value.length === 0) {
            value = undefined;
        }
        this.validateAccountablesChange(value, true);
    }

    validateAccountablesChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value || !value.length) {
            msg = translate('manage_warehouse.bill_management.choose_accountables')
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                bill: { ...state.bill, accountables: value },
                errorAccountables: msg
            }));
        }
        return msg;
    }

    handleResponsiblesChange = (value) => {
        if (value.length === 0) {
            value = undefined;
        }
        this.validateResponsiblesChange(value, true);
    }

    validateResponsiblesChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value || !value.length) {
            msg = translate('manage_warehouse.bill_management.chooos_reponsibles')
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                bill: { ...state.bill, responsibles: value },
                errorResponsibles: msg
            }));
        }
        return msg;
    }

    handleQualityControlStaffsChange = (value) => {
        if (value.length === 0) {
            value = undefined;
        }
        this.validateQualityControlStaffsChange(value, true);
    }

    validateQualityControlStaffsChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value || !value.length) {
            msg = translate('manage_warehouse.bill_management.quality_control_staffs_error')
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                bill: { ...state.bill, qualityControlStaffs: value },
                errorQualityControlStaffs: msg
            }));
        }
        return msg;
    }


    handleNameChange = (e) => {
        const { value } = e.target;
        this.validateNameChange(value, true);
    }

    validateNameChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.error_name_receiver')
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                bill: { ...state.bill, name: value },
                errorName: msg
            }));
        }
        return msg;
    }

    handlePhoneChange = (e) => {
        const { value } = e.target;
        this.validatePhoneChange(value, true);
    }

    validatePhoneChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.error_phone_receiver')
        }
        if (value < 0) {
            msg = translate('manage_warehouse.bill_management.error_phone_receiver_input')
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                bill: { ...state.bill, phone: value },
                errorPhone: msg
            }));
        }
        return msg;
    }

    handleEmailChange = (e) => {
        const { value } = e.target;
        this.setState((state) => ({
            ...state,
            bill: { ...state.bill, email: value }
        }));
    }

    handleAddressChange = (e) => {
        const { value } = e.target;
        this.setState((state) => ({
            ...state,
            bill: { ...state.bill, address: value }
        }));
    }

    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.setState((state) => ({
            ...state,
            bill: { ...state.bill, description: value }
        }));
    }

    isValidateBill = () => {
        if (
            this.validateStockChange(this.state.bill.fromStock, false)
            || this.validateApproversChange(this.state.bill.approvers, false)
            || this.validateAccountablesChange(this.state.bill.accountables, false)
            || this.validateResponsiblesChange(this.state.bill.responsibles, false)
            || this.validateResponsiblesChange(this.state.bill.qualityControlStaffs, false)
            || this.validateNameChange(this.state.bill.name, false)
            || this.validatePhoneChange(this.state.bill.phone, false)
            || this.validateQuantityChange(this.state.bill.quantity, false)
            || this.state.bill.goods.length === 0
        ) {
            return false;
        }
        return true;
    }

    handleClearBill = (e) => {
        e.preventDefault();
        this.setState((state) => ({
            ...state,
            bill: Object.assign({}, this.EMPTY_BILL),
        }));
    }

    handleAddBill = async (e) => {
        e.preventDefault();
        this.EMPTY_BILL.code = generateCode("BILL");
        await this.setState((state) => ({
            ...state,
            listBills: [...state.listBills, this.state.bill],
            bill: Object.assign({}, this.EMPTY_BILL),
        }));
        this.calculateRemainingQuantityGood();
    }

    handleEditBill = async (bill, index) => {
        await this.setState((state) => ({
            ...state,
            editBill: true,
            bill: { ...bill },
            indexEdittingBill: index
        }));
        this.calculateRemainingQuantityGood();
    }

    handleCancelEditBill = async (e) => {
        e.preventDefault();
        await this.setState((state) => ({
            ...state,
            editBill: false,
            bill: Object.assign({}, this.EMPTY_BILL)
        }));
        this.calculateRemainingQuantityGood();
    }

    handleSaveEditBill = async (e) => {
        e.preventDefault();
        const { listBills, indexEdittingBill } = this.state;
        listBills[indexEdittingBill] = this.state.bill;
        await this.setState((state) => ({
            ...state,
            listBills: [...listBills],
            editBill: false,
            bill: Object.assign({}, this.EMPTY_BILL)
        }));
        this.calculateRemainingQuantityGood();
    }

    handleDeleteBill = async (bill, index) => {
        let { listBills } = this.state;
        listBills.splice(index, 1);
        await this.setState((state) => ({
            ...state,
            editBill: false,
            bill: Object.assign({}, this.EMPTY_BILL),
            listBills: [...listBills]
        }));
        this.calculateRemainingQuantityGood();
    }



    //  Xử lý good trong bill

    getMaterialArr = () => {
        let { translate } = this.props;
        let goodArr = [{ value: "1", text: translate("manage_warehouse.bill_management.choose_material") }];
        const { materials } = this.state.commandIssue.good;
        if (materials) {
            materials.map((item) => {
                goodArr.push({
                    value: item.good._id,
                    text: item.good.code + " -- " + item.good.name + " (" + item.good.baseUnit + ")",
                });
            });
        }
        return goodArr;

    }

    handleGoodChange = (value) => {
        const goodId = value[0];
        this.validateGoodChange(goodId, true);
        if (goodId !== "1") {
            const data = {
                goodId: goodId,
                stockId: this.state.bill.fromStock
            }
            console.log(data);
            this.props.getInventoryByGoodAndStock(data);
        }
    }

    validateGoodChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "1") {
            msg = translate('manufacturing.purchasing_request.error_good')
        }

        if (willUpdateState) {
            let { good } = this.state;

            good.goodId = value
            const { goods } = this.props;
            const { listGoodsByType } = goods;
            let goodArrFilter = listGoodsByType.filter(x => x._id === good.goodId);
            if (goodArrFilter) {
                good.goodObject = goodArrFilter[0];
            }

            this.setState((state) => ({
                ...state,
                good: { ...good },
                errorGood: msg
            }))
        }
        return msg;

    }


    handleQuantityChange = (e) => {
        const { value } = e.target;
        this.validateQuantityChange(value, true);
    }

    validateQuantityChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate('manage_warehouse.bill_management.quantity_error')
        }
        if (value < 1) {
            msg = translate('manage_warehouse.bill_management.quantity_error_input')
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                good: { ...state.good, quantity: value === "" ? value : Number(value) },
                errorQuantity: msg
            }));
        }
        return msg;
    }

    handleGoodDescriptionChange = (e) => {
        const { value } = e.target;
        this.setState((state) => ({
            ...state,
            good: { ...state.good, description: value }
        }));
        console.log(this.state);
    }

    /* --- start Copy from purchasing request*/

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState((state) => ({
            ...state,
            good: Object.assign({}, this.EMPTY_GOOD)
        }));
    }

    handleAddGood = (e) => {
        e.preventDefault();
        let { bill, good } = this.state;
        const { goods } = this.props;
        const { listGoodsByType } = goods;
        let goodArrFilter = listGoodsByType.filter(x => x._id === good.goodId);
        if (goodArrFilter) {
            good.goodObject = goodArrFilter[0];
        }
        bill.goods.push(good);
        this.setState((state) => ({
            ...state,
            bill: { ...bill },
            good: Object.assign({}, this.EMPTY_GOOD)
        }))
    }

    handleDeleteGood = (good, index) => {
        let { bill } = this.state;
        bill.goods.splice(index, 1);
        this.setState((state) => ({
            ...state,
            bill: { ...bill }
        }));
    }

    handleEditGood = (good, index) => {
        this.setState({
            editGood: true,
            good: { ...good },
            indexEditting: index
        });
    }

    handleCancelEditGood = (e) => {
        e.preventDefault();
        this.setState({
            editGood: false,
            good: Object.assign({}, this.EMPTY_GOOD),
        });

    }

    handleSaveEditGood = () => {
        let { good, indexEditting, bill } = this.state;
        bill.goods[indexEditting] = good;
        this.setState({
            editGood: false,
            good: Object.assign({}, this.EMPTY_GOOD),
            bill: { ...bill }
        })
    }

    isGoodsValidated = () => {
        if (
            this.validateQuantityChange(this.state.good.quantity, false)
            || this.validateGoodChange(this.state.good.goodId, false)
        ) {
            return false;
        }
        return true;
    }

    /* --- end Copy from purchasing request --- */

    save = () => {
        if (this.isFormValidated()) {
            const { listBills, commandIssue } = this.state;
            const data = listBills.map(bill => {
                return {
                    fromStock: bill.fromStock,
                    group: "2",
                    code: bill.code,
                    type: "3",
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
                    qualityControlStaffs: bill.qualityControlStaffs.map(staff => {
                        return {
                            staff: staff,
                            status: 1
                        }
                    }),
                    receiver: {
                        name: bill.name,
                        phone: bill.phone,
                        email: bill.email ? bill.email : "",
                        address: bill.address ? bill.address : "",
                    },
                    description: bill.description,
                    goods: bill.goods.map(x => {
                        return {
                            good: x.goodId,
                            quantity: x.quantity
                        }
                    }),
                    manufacturingMill: commandIssue.manufacturingMill._id,
                    manufacturingCommand: commandIssue._id
                }
            });
            this.props.createManyProductBills(data);
            this.props.handleEditCommand(commandIssue._id, { status: 2, approver: localStorage.getItem('userId') });
            this.props.onReloadCommandTable();
        }
    }

    isFormValidated = () => {
        const { listRemainingGoods } = this.state;
        let result = true;
        for (let i = 0; i < listRemainingGoods.length; i++) {
            if (listRemainingGoods[i].remainingQuantity > 0) {
                result = false;
            }
        }
        if (!this.state.listBills.length
            || !result) {
            return false;
        }
        return true;
    }

    render() {

        const { bills, translate, lots } = this.props;
        let goodStockInventory = {};
        if (lots.goodStockInventory && lots.isLoading === false) {
            goodStockInventory = lots.goodStockInventory;
        }
        const { commandIssue, bill, errorStock, errorApprovers, errorResponsibles, errorAccountables, errorName, errorPhone, listBills, errorQualityControlStaffs, good, errorQuantity, errorGood } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-create-bill-issue-material`} isLoading={bills.isLoading}
                    formID={`form-create-bill-issue-material`}
                    title={translate(`manage_warehouse.bill_management.add_material_bill`)}
                    msg_success={translate('manage_warehouse.bill_management.create_product_bill_successfully')}
                    msg_faile={translate('manage_warehouse.bill_management.create_product_bill_failed')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={100}
                >
                    <form id={`form-create-bill-issue-material`}>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.command_info')}</legend>
                                <div className={`form-group`}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>{translate('manage_warehouse.bill_management.index')}</th>
                                                <th>{translate('manage_warehouse.bill_management.material_code')}</th>
                                                <th>{translate('manage_warehouse.bill_management.material_name')}</th>
                                                <th>{translate('manage_warehouse.bill_management.base_unit')}</th>
                                                <th>{translate('manage_warehouse.bill_management.number')}</th>
                                                <th>{translate('manage_warehouse.bill_management.quantity_needed_bill')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                commandIssue && commandIssue.good && commandIssue.good.materials
                                                    && commandIssue.good.materials.length ?
                                                    commandIssue.good.materials.map((x, index) => (
                                                        <tr key={index}>
                                                            <td key={index}>{index + 1}</td>
                                                            <td>{x.good.code}</td>
                                                            <td>{x.good.name}</td>
                                                            <td>{x.good.baseUnit}</td>
                                                            <td>{x.quantity * commandIssue.quantity}</td>
                                                            <td>{this.getRemainingQuantityFromGoodId(x.good._id)}</td>
                                                        </tr>
                                                    ))
                                                    :
                                                    <tr>
                                                        <td colSpan={6}>{translate('general.no_data')}</td>
                                                    </tr>
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </fieldset>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.bill_material_info')}</legend>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className={`form-group`}>
                                            <label>{translate('manage_warehouse.bill_management.code')}</label>
                                            <input type="text" className="form-control" value={bill.code} disabled />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                            <label>{translate('manage_warehouse.bill_management.stock')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-stock-issue-material-create`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={bill.fromStock}
                                                items={this.getListStocksArr()}
                                                onChange={this.handleStockChange}
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
                                                id={`select-approver-bill-issue-material-create`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={bill.approvers}
                                                items={this.getUsersArr()}
                                                onChange={this.handleApproverChange}
                                                multiple={true}
                                            />
                                            <ErrorLabel content={errorApprovers} />
                                        </div>
                                        <div className={`form-group ${!errorResponsibles ? "" : "has-error"}`}>
                                            <label>{translate('manage_warehouse.bill_management.users')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-accountables-bill-issue-material-create`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={bill.responsibles}
                                                items={this.getUsersArr()}
                                                onChange={this.handleResponsiblesChange}
                                                multiple={true}
                                            />
                                            <ErrorLabel content={errorResponsibles} />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className={`form-group ${!errorAccountables ? "" : "has-error"}`}>
                                            <label>{translate('manage_warehouse.bill_management.accountables')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-responsibles-bill-issue-material-create`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={bill.accountables}
                                                items={this.getUsersArr()}
                                                onChange={this.handleAccountablesChange}
                                                multiple={true}
                                            />
                                            <ErrorLabel content={errorAccountables} />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className={`form-group ${!errorQualityControlStaffs ? "" : "has-error"}`}>
                                            <label>{translate('manage_warehouse.bill_management.quality_control_staffs')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-quality-control-staff-bill-issue-material-create`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={bill.qualityControlStaffs}
                                                items={this.getUsersArr()}
                                                onChange={this.handleQualityControlStaffsChange}
                                                multiple={true}
                                            />
                                            <ErrorLabel content={errorQualityControlStaffs} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                                            <label>{translate('manage_warehouse.bill_management.name_receiver')}<span className="attention"> * </span></label>
                                            <input type="text" value={bill.name} className="form-control" onChange={this.handleNameChange} />
                                            <ErrorLabel content={errorName} />
                                        </div>
                                        <div className={`form-group ${!errorPhone ? "" : "has-error"}`}>
                                            <label>{translate('manage_warehouse.bill_management.phone_receiver')}<span className="attention"> * </span></label>
                                            <input type="number" value={bill.phone} className="form-control" onChange={this.handlePhoneChange} />
                                            <ErrorLabel content={errorPhone} />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className={`form-group`}>
                                            <label>{translate('manage_warehouse.bill_management.email_receiver')}</label>
                                            <input type="text" className="form-control" value={bill.email} onChange={this.handleEmailChange} />
                                        </div>
                                        <div className={`form-group`}>
                                            <label>{translate('manage_warehouse.bill_management.address_receiver')}</label>
                                            <input type="text" className="form-control" value={bill.address} onChange={this.handleAddressChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div className="form-group">
                                            <label>{translate('manage_warehouse.bill_management.description')}</label>
                                            <textarea type="text" className="form-control" value={bill.description} onChange={this.handleDescriptionChange} />
                                        </div>
                                    </div>
                                </div>
                                {
                                    bill.fromStock !== "1" &&
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <fieldset className="scheduler-border">
                                                <legend className="scheduler-border">{translate("manage_warehouse.bill_management.materials_in_bill")}</legend>
                                                <div className="row">
                                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                        <div className={`form-group ${!errorGood ? "" : "has-error"}`}>
                                                            <label>{translate("manage_warehouse.bill_management.choose_good")}<span className="attention"> * </span></label>
                                                            <SelectBox
                                                                id={`select-good-issue-create-material`}
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                value={good.goodId}
                                                                items={this.getMaterialArr()}
                                                                onChange={this.handleGoodChange}
                                                                multiple={false}
                                                            />
                                                            <ErrorLabel content={errorGood} />
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                        <div className="form-group">
                                                            <label>{translate("manage_warehouse.bill_management.number_inventory")}</label>
                                                            <div style={{ display: "flex" }}>
                                                                <input
                                                                    className="form-control"
                                                                    value={good.goodId === "1" ? "" : goodStockInventory.inventory}
                                                                    disabled
                                                                    type="number"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                        <div className="form-group">
                                                            <label>{translate("manage_warehouse.bill_management.quantity_needed_bill")}</label>
                                                            <div>
                                                                <input
                                                                    className="form-control"
                                                                    value={this.getRemainingQuantityFromGoodId(good.goodId)}
                                                                    disabled
                                                                    type="number"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                        <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                                                            <label className="control-label">{translate("manage_warehouse.bill_management.quantity")} <span className="attention"> * </span></label>
                                                            <div>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder={100}
                                                                    value={good.quantity}
                                                                    onChange={this.handleQuantityChange}
                                                                />
                                                            </div>
                                                            <ErrorLabel content={errorQuantity} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
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
                                                </div>
                                                <div className="pull-right" style={{ marginBottom: "10px" }}>
                                                    {this.state.editGood ? (
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
                                                        <tbody id={`good-bill-create-material`}>
                                                            {typeof bill.goods === "undefined" || bill.goods.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan={7}>
                                                                        <center>{translate("general.no_data")}</center>
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                    bill.goods.map((x, index) => (
                                                                        <tr key={index}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{x.goodObject.code}</td>
                                                                            <td>{x.goodObject.name}</td>
                                                                            <td>{x.goodObject.baseUnit}</td>
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
                                    </div>
                                }
                                <div className="pull-right" style={{ marginBottom: "10px" }}>
                                    {this.state.editBill ?
                                        <React.Fragment>
                                            <button
                                                className="btn btn-success"
                                                onClick={this.handleCancelEditBill}
                                                style={{ marginLeft: "10px" }}>{translate('manufacturing.purchasing_request.cancel_editing_good')}
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                disabled={!this.isValidateBill()}
                                                onClick={this.handleSaveEditBill}
                                                style={{ marginLeft: "10px" }}>{translate('manufacturing.purchasing_request.save_good')}
                                            </button>
                                        </React.Fragment> :
                                        <button
                                            className="btn btn-success"
                                            style={{ marginLeft: "10px" }}
                                            disabled={!this.isValidateBill()}
                                            onClick={this.handleAddBill}>{translate('manufacturing.purchasing_request.add_good')}
                                        </button>
                                    }
                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearBill}>{translate('manufacturing.purchasing_request.delete_good')}</button>
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
                                            <th>{translate('manage_warehouse.bill_management.command_code')}</th>
                                            <th>{translate('manage_warehouse.bill_management.mill_request')}</th>
                                            <th>{translate('manage_warehouse.bill_management.receipt_stock')}</th>
                                            <th>{translate('table.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            listBills &&
                                                listBills.length == 0 ?
                                                <tr><td colSpan={6}>{translate('general.no_data')}</td></tr>
                                                :
                                                listBills.map((bill, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{bill.code}</td>
                                                        <td>{commandIssue && commandIssue.code}</td>
                                                        <td>{commandIssue && commandIssue.manufacturingMill && commandIssue.manufacturingMill.name}</td>
                                                        <td>{bill.stockName}</td>
                                                        <td>
                                                            <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditBill(bill, index)}><i className="material-icons"></i></a>
                                                            <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteBill(bill, index)}><i className="material-icons"></i></a>
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
                                !this.isFormValidated() &&
                                <div className="pull-left form-group has-error" style={{ marginBottom: "10px" }}>
                                    <label>{translate('manage_warehouse.bill_management.quantity_needed_true')}<span className="attention"> * </span></label>
                                </div>
                            }
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { bills, stocks, user, goods, lots } = state;
    return { bills, stocks, user, goods, lots }
}

const mapDispatchToProps = {
    createManyProductBills: BillActions.createManyProductBills,
    handleEditCommand: commandActions.handleEditCommand,
    getInventoryByGoodAndStock: LotActions.getInventoryByGoodAndStock
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(goodIssueCreateForm));